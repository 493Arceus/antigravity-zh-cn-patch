/**
 * AntiGravity Real-Time Token Rate & Prompt Cache Monitor (token-rate.js)
 * 
 * 架构特性：
 * 1. 严格多会话独立隔离 (conversationStores)：
 *    按 conversationId 独立存储轨迹步骤、Token 统计与速率，杜绝多标签页/后台任务数据互相串扰或跳动。
 * 2. 100% 贴合 AntiGravity 原生设计规范：
 *    采用 AGY 原生 --color-card, --color-foreground, --color-border, --color-muted-foreground 与微质感投影。
 * 3. 零微任务死循环与高性能：
 *    MutationObserver 忽略自身节点并通过 requestAnimationFrame 节流。
 */
(function () {
  'use strict';

  // 清理可能存在的旧实例
  if (typeof window.__AGY_TOKEN_RATE_CLEANUP__ === 'function') {
    try { window.__AGY_TOKEN_RATE_CLEANUP__(); } catch (e) {}
  }

  window.__AGY_TOKEN_RATE_INITIALIZED__ = true;

  const RATE_STORAGE_KEY = 'agy_token_rate_unit';
  const CACHE_MODE_KEY = 'agy_token_cache_mode';

  let unit = 's'; // 's' -> tok/s, 'm' -> tok/m
  let cacheDisplayMode = 'percent'; // 'percent' | 'detail'

  try {
    const savedUnit = localStorage.getItem(RATE_STORAGE_KEY);
    if (savedUnit === 's' || savedUnit === 'm') unit = savedUnit;
    const savedCacheMode = localStorage.getItem(CACHE_MODE_KEY);
    if (savedCacheMode === 'percent' || savedCacheMode === 'detail') cacheDisplayMode = savedCacheMode;
  } catch (e) {}

  function toNum(val) {
    if (val === null || val === undefined) return 0;
    if (typeof val === 'bigint') return Number(val);
    if (typeof val === 'number') return Number.isFinite(val) ? val : 0;
    if (typeof val === 'string') {
      const n = Number(val);
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  }

  function toEpochMs(ts) {
    if (!ts) return 0;
    if (typeof ts === 'string') {
      const ms = Date.parse(ts);
      return Number.isFinite(ms) ? ms : 0;
    }
    if (typeof ts === 'object') {
      const sec = toNum(ts.seconds);
      const nanos = toNum(ts.nanos);
      if (sec > 0) return sec * 1000 + Math.round(nanos / 1e6);
    }
    return 0;
  }

  function formatCompactNumber(n) {
    n = toNum(n);
    if (n >= 1e6) return `${(n / 1e6).toFixed(2)}M`;
    if (n >= 1e3) return `${(n / 1e3).toFixed(1)}k`;
    return `${Math.round(n)}`;
  }

  // ==========================================
  // 会话独立状态管理 (Multi-Conversation Isolation)
  // ==========================================
  const conversationStores = new Map();

  function getOrCreateStore(convId) {
    const key = convId || '__default__';
    let store = conversationStores.get(key);
    if (!store) {
      store = {
        convId: key,
        turnState: 'idle', // 'idle' | 'waiting' | 'streaming'
        requestStartTime: 0,
        firstTokenTime: null,
        lastChunkTime: 0,
        lastTokenCount: 0,
        smoothedRate: 0,
        finalTurnRate: 0,
        liveServerTtftSec: 0,
        slidingHistory: [],
        baselineStepIndex: -1,
        maxKnownStepIndex: -1,
        currentTurnSteps: new Map(),
        allSteps: new Map(),
        stepFirstTokenMs: new Map(),
        officialCostSummary: {
          input: 0, cacheRead: 0, cacheWrite: 0, output: 0, thinking: 0, response: 0, costUsd: 0
        },
        stepsUsageSummary: {
          input: 0, cacheRead: 0, cacheWrite: 0, output: 0, thinking: 0, response: 0, costUsd: 0,
          lastStepInput: 0, lastStepCacheRead: 0, lastStepOutput: 0, lastStepThinking: 0, lastStepResponse: 0
        },
        lastTurnStats: {
          tokens: 0, thinkingTokens: 0, responseTokens: 0, duration: 0, ttft: 0, rate: 0
        }
      };

      try {
        const savedTurn = localStorage.getItem(`agy_turn_${key}`);
        if (savedTurn) {
          const pt = JSON.parse(savedTurn);
          if (pt && toNum(pt.rate) > 0 && toNum(pt.rate) < 800) {
            store.lastTurnStats = pt;
            store.finalTurnRate = pt.rate;
          }
        }
        const savedCache = localStorage.getItem(`agy_cache_${key}`);
        if (savedCache) {
          const pc = JSON.parse(savedCache);
          if (pc && (toNum(pc.cacheRead) > 0 || toNum(pc.input) > 0)) {
            Object.assign(store.stepsUsageSummary, pc);
          }
        }
      } catch (e) {}

      conversationStores.set(key, store);
    }
    return store;
  }

  function getActiveConvId() {
    const match = window.location.pathname.match(/\/c\/([a-zA-Z0-9-]+)/);
    if (match && match[1]) return match[1];

    const trigger = document.querySelector('[data-testid="model-selector-trigger"]');
    if (trigger) {
      let curr = trigger;
      while (curr && curr !== document.body) {
        if (curr.attributes) {
          for (let i = 0; i < curr.attributes.length; i++) {
            const val = curr.attributes[i].value;
            if (val && val.length === 36 && val.includes('-')) {
              return val;
            }
          }
        }
        curr = curr.parentElement;
      }
    }

    for (const k of conversationStores.keys()) {
      if (k !== '__default__') return k;
    }
    return '__default__';
  }

  function getActiveStore() {
    return getOrCreateStore(getActiveConvId());
  }

  // ==========================================
  // 流式文本估算与 Step 提取
  // ==========================================
  function estimateStepTextTokens(text) {
    if (!text || typeof text !== 'string') return 0;
    let cjk = 0;
    let other = 0;
    for (let i = 0; i < text.length; i++) {
      const code = text.charCodeAt(i);
      if (
        (code >= 0x4e00 && code <= 0x9fff) ||
        (code >= 0x3400 && code <= 0x4dbf) ||
        (code >= 0x3000 && code <= 0x303f) ||
        (code >= 0xac00 && code <= 0xd7af) ||
        (code >= 0xff00 && code <= 0xffef)
      ) {
        cjk++;
      } else {
        other++;
      }
    }
    return Math.max(1, Math.round(cjk * 0.9 + other / 3.5));
  }

  function extractStepMetrics(s, explicitIndex) {
    if (!s || typeof s !== 'object') return null;

    const meta = s.metadata || {};
    const stepIdx = explicitIndex !== undefined && explicitIndex !== null
      ? toNum(explicitIndex)
      : toNum(meta.sourceTrajectoryStepInfo?.stepIndex ?? s.stepIdx ?? -1);

    const stepCase = s.step?.case || '';
    if (stepCase === 'userInput' || s.type === 'USER_INPUT' || s.type === 14 || s.userInput) {
      return { stepIdx, isUser: true };
    }

    const st = s.status;
    const isGenerating =
      st === 8 ||
      st === 'CORTEX_STEP_STATUS_GENERATING' ||
      st === 'GENERATING' ||
      ((st === 2 || st === 'CORTEX_STEP_STATUS_RUNNING' || st === 'RUNNING') && stepCase === 'plannerResponse');
    const isDone =
      st === 3 ||
      st === 'CORTEX_STEP_STATUS_DONE' ||
      st === 'DONE';

    const createdAtMs = toEpochMs(meta.createdAt);
    const viewableAtMs = toEpochMs(meta.viewableAt);
    const finishedAtMs = toEpochMs(meta.finishedGeneratingAt) || toEpochMs(meta.completedAt);

    const usage = meta.modelUsage || s.modelUsage;
    let officialOut = 0;
    let officialThink = 0;
    let officialResp = 0;
    let officialIn = 0;
    let officialCache = 0;
    let officialCacheWrite = 0;

    if (usage) {
      officialOut = toNum(usage.outputTokens ?? usage.output_tokens);
      officialThink = toNum(usage.thinkingOutputTokens ?? usage.thinkingTokens ?? usage.thinking_tokens);
      officialResp = toNum(usage.responseOutputTokens ?? usage.responseTokens ?? usage.response_tokens);
      officialIn = toNum(usage.inputTokens ?? usage.input_tokens ?? usage.promptTokenCount);
      officialCache = toNum(usage.cacheReadTokens ?? usage.cache_read_tokens ?? usage.cachedContentTokenCount);
      officialCacheWrite = toNum(usage.cacheWriteTokens ?? usage.cache_write_tokens);
    }

    const toolOut = toNum(meta.toolCallOutputTokens);
    const modelCost = toNum(meta.modelCost);

    const planner = (stepCase === 'plannerResponse' ? s.step?.value : null) || s.plannerResponse || s.step?.plannerResponse;
    let textTokens = 0;
    let thinkTextTokens = 0;
    let respTextTokens = 0;

    if (planner && typeof planner === 'object') {
      const thinkStr = typeof planner.thinking === 'string' && planner.thinking.length > 0
        ? planner.thinking
        : (typeof planner.rawThinking === 'string' ? planner.rawThinking : '');
      const respStr = typeof planner.response === 'string' && planner.response.length > 0
        ? planner.response
        : (typeof planner.modifiedResponse === 'string' ? planner.modifiedResponse : '');

      if (thinkStr) thinkTextTokens = estimateStepTextTokens(thinkStr);
      if (respStr) respTextTokens = estimateStepTextTokens(respStr);

      let toolCallsTokens = 0;
      if (Array.isArray(planner.toolCalls) && planner.toolCalls.length > 0) {
        try {
          toolCallsTokens = estimateStepTextTokens(JSON.stringify(planner.toolCalls, (k, v) => typeof v === 'bigint' ? v.toString() : v));
        } catch (e) {}
      }
      textTokens = thinkTextTokens + respTextTokens + toolCallsTokens;
    }

    let totalStepTokens = 0;
    let hasOfficialUsage = false;
    if (officialOut > 0) {
      totalStepTokens = officialOut + toolOut;
      hasOfficialUsage = true;
    } else if (officialThink + officialResp > 0) {
      totalStepTokens = officialThink + officialResp + toolOut;
      hasOfficialUsage = true;
    } else if (toolOut > 0) {
      totalStepTokens = toolOut;
      hasOfficialUsage = true;
    } else if (textTokens > 0) {
      totalStepTokens = textTokens;
    }

    return {
      stepIdx,
      isUser: false,
      isPlanner: Boolean(planner || hasOfficialUsage || stepCase === 'plannerResponse'),
      hasOfficialUsage,
      isGenerating,
      isDone,
      tokens: totalStepTokens,
      thinkingTokens: hasOfficialUsage ? officialThink : thinkTextTokens,
      responseTokens: hasOfficialUsage ? (officialResp || officialOut) + toolOut : respTextTokens,
      officialIn,
      officialCache,
      officialCacheWrite,
      modelCost,
      createdAtMs,
      viewableAtMs,
      finishedAtMs
    };
  }

  // ==========================================
  // 会话统计聚合
  // ==========================================
  function recomputeStoreStats(store) {
    if (!store) return;

    let sumIn = 0;
    let sumCache = 0;
    let sumCacheWrite = 0;
    let sumOut = 0;
    let sumThink = 0;
    let sumResp = 0;
    let sumCost = 0;

    let lastStepWithUsage = null;
    let lastCompletedStep = null;

    const sortedIndices = Array.from(store.allSteps.keys()).sort((a, b) => a - b);
    for (const idx of sortedIndices) {
      const st = store.allSteps.get(idx);
      if (!st || !st.isPlanner) continue;

      if (st.officialIn > 0 || st.officialCache > 0 || st.hasOfficialUsage) {
        sumIn += st.officialIn;
        sumCache += st.officialCache;
        sumCacheWrite += st.officialCacheWrite;
        sumOut += st.tokens;
        sumThink += st.thinkingTokens;
        sumResp += st.responseTokens;
        sumCost += st.modelCost;
        lastStepWithUsage = st;
      }

      if (st.createdAtMs > 0 && st.finishedAtMs > st.createdAtMs && st.tokens > 0) {
        lastCompletedStep = st;
      }
    }

    if (sumIn > 0 || sumCache > 0 || sumOut > 0) {
      store.stepsUsageSummary = {
        input: sumIn,
        cacheRead: sumCache,
        cacheWrite: sumCacheWrite,
        output: sumOut,
        thinking: sumThink,
        response: sumResp,
        costUsd: sumCost,
        lastStepInput: lastStepWithUsage ? lastStepWithUsage.officialIn : 0,
        lastStepCacheRead: lastStepWithUsage ? lastStepWithUsage.officialCache : 0,
        lastStepOutput: lastStepWithUsage ? lastStepWithUsage.tokens : 0,
        lastStepThinking: lastStepWithUsage ? lastStepWithUsage.thinkingTokens : 0,
        lastStepResponse: lastStepWithUsage ? lastStepWithUsage.responseTokens : 0
      };
      try {
        localStorage.setItem(`agy_cache_${store.convId}`, JSON.stringify(store.stepsUsageSummary));
      } catch (e) {}
    }

    if (lastCompletedStep) {
      const createdMs = lastCompletedStep.createdAtMs;
      const viewableMs = lastCompletedStep.viewableAtMs;
      const endMs = lastCompletedStep.finishedAtMs;
      const firstSeenMs = store.stepFirstTokenMs.get(lastCompletedStep.stepIdx) || 0;

      let durationSec = 0;
      let ttftSec = 0;

      if (firstSeenMs > 0 && firstSeenMs >= createdMs && (endMs - firstSeenMs) >= 400) {
        durationSec = (endMs - firstSeenMs) / 1000;
        ttftSec = (firstSeenMs - createdMs) / 1000;
      } else if (lastCompletedStep.thinkingTokens === 0 && viewableMs >= createdMs && (endMs - viewableMs) >= 800) {
        durationSec = (endMs - viewableMs) / 1000;
        ttftSec = (viewableMs - createdMs) / 1000;
      } else {
        durationSec = (endMs - createdMs) / 1000;
        ttftSec = 0;
      }

      if (durationSec > 0.2 && lastCompletedStep.tokens > 0) {
        const rate = lastCompletedStep.tokens / durationSec;
        if (rate > 0 && rate < 800) {
          store.finalTurnRate = rate;
          store.lastTurnStats = {
            tokens: Math.round(lastCompletedStep.tokens),
            thinkingTokens: Math.round(lastCompletedStep.thinkingTokens),
            responseTokens: Math.round(lastCompletedStep.responseTokens),
            duration: durationSec,
            ttft: Math.max(0, ttftSec),
            rate: store.finalTurnRate
          };
          try {
            localStorage.setItem(`agy_turn_${store.convId}`, JSON.stringify(store.lastTurnStats));
          } catch (e) {}
        }
      }
    }
  }

  // ==========================================
  // 处理 AgentStateUpdate (__asu 核心回调)
  // ==========================================
  function processAgentStateUpdate(conversationId, update, isHistoricalReplay) {
    if (!update || typeof update !== 'object') return;

    const convId = conversationId || getActiveConvId();
    const store = getOrCreateStore(convId);

    // 1. 提取顶层 costSummary
    const cs = update.costSummary || update.update?.costSummary;
    if (cs) {
      const cum = cs.total?.cumulativeTotal || cs.cumulativeTotal;
      if (cum) {
        const inTok = toNum(cum.input?.tokens);
        const cacheTok = toNum(cum.cacheRead?.tokens);
        const outTok = toNum(cum.output?.tokens);
        const thinkTok = toNum(cum.thinking?.tokens);
        const respTok = toNum(cum.response?.tokens);
        const costUsd = toNum(cum.estimatedCostUsd);

        if (inTok > 0 || cacheTok > 0 || outTok > 0) {
          store.officialCostSummary = {
            input: inTok,
            cacheRead: cacheTok,
            cacheWrite: 0,
            output: outTok,
            thinking: thinkTok,
            response: respTok,
            costUsd: costUsd
          };
        }
      }
    }

    // 2. 提取 stepsUpdate
    const stepsUpdate =
      update.mainTrajectoryUpdate?.stepsUpdate ||
      update.update?.mainTrajectoryUpdate?.stepsUpdate ||
      update.stepsUpdate;

    let anyPlannerGenerating = false;
    let activeGeneratingStep = null;

    if (stepsUpdate && Array.isArray(stepsUpdate.steps)) {
      const steps = stepsUpdate.steps;
      const indices = Array.isArray(stepsUpdate.indices) ? stepsUpdate.indices : [];

      for (let i = 0; i < steps.length; i++) {
        const s = steps[i];
        const explicitIdx = indices[i] !== undefined ? indices[i] : undefined;
        const info = extractStepMetrics(s, explicitIdx);
        if (!info) continue;

        if (info.stepIdx >= 0) {
          store.maxKnownStepIndex = Math.max(store.maxKnownStepIndex, info.stepIdx);
        }

        if (info.isUser) {
          if (!isHistoricalReplay && info.stepIdx > store.baselineStepIndex) {
            store.baselineStepIndex = info.stepIdx;
          }
          continue;
        }

        if (info.stepIdx >= 0 && info.isPlanner) {
          store.allSteps.set(info.stepIdx, info);
        }

        if (info.isGenerating && info.isPlanner) {
          anyPlannerGenerating = true;
          activeGeneratingStep = info;
        }

        if (!isHistoricalReplay && info.isPlanner) {
          if (info.isGenerating && store.turnState === 'idle') {
            onStoreRequestSubmitted(store);
          }
          if (info.tokens > 0 && info.stepIdx >= 0 && !store.stepFirstTokenMs.has(info.stepIdx)) {
            store.stepFirstTokenMs.set(info.stepIdx, Date.now());
          }
          if (store.turnState !== 'idle' && info.stepIdx > store.baselineStepIndex && info.tokens > 0) {
            store.currentTurnSteps.set(info.stepIdx, info);
          }
        }
      }

      if (!isHistoricalReplay && anyPlannerGenerating && activeGeneratingStep) {
        const firstSeenMs = store.stepFirstTokenMs.get(activeGeneratingStep.stepIdx) || activeGeneratingStep.createdAtMs || Date.now();
        const serverElapsedSec = Math.max(0.05, (Date.now() - firstSeenMs) / 1000);
        const serverTtftSec = (activeGeneratingStep.createdAtMs > 0 && firstSeenMs >= activeGeneratingStep.createdAtMs)
          ? (firstSeenMs - activeGeneratingStep.createdAtMs) / 1000
          : 0;
        if (activeGeneratingStep.tokens > 0) {
          onStoreTokensProgress(store, activeGeneratingStep.tokens, serverElapsedSec, serverTtftSec);
        }
      }
    }

    const runStatus = update.status ?? update.executionStatus;
    const isCascadeIdle =
      runStatus === 1 ||
      runStatus === 'CASCADE_RUN_STATUS_IDLE' ||
      runStatus === 'IDLE';

    if (!isHistoricalReplay && store.turnState !== 'idle' && (!anyPlannerGenerating || isCascadeIdle)) {
      let allTurnPlannerDone = true;
      for (const st of store.currentTurnSteps.values()) {
        const latest = store.allSteps.get(st.stepIdx) || st;
        if (latest.isGenerating) {
          allTurnPlannerDone = false;
          break;
        }
      }
      if ((allTurnPlannerDone && store.currentTurnSteps.size > 0) || isCascadeIdle) {
        store.turnState = 'idle';
        store.slidingHistory = [];
      }
    }

    recomputeStoreStats(store);

    if (convId === getActiveConvId()) {
      updateAllBadges();
      if (isPopoverOpen) renderPopoverContent();
    }
  }

  function onStoreRequestSubmitted(store) {
    if (store.turnState === 'waiting' || store.turnState === 'streaming') return;
    const now = performance.now();
    store.turnState = 'waiting';
    store.requestStartTime = now;
    store.firstTokenTime = null;
    store.lastChunkTime = now;
    store.lastTokenCount = 0;
    store.smoothedRate = 0;
    store.liveServerTtftSec = 0;
    store.slidingHistory = [];
    store.baselineStepIndex = store.maxKnownStepIndex;
    store.currentTurnSteps.clear();

    if (store.convId === getActiveConvId()) {
      updateAllBadges();
      if (isPopoverOpen) renderPopoverContent();
    }
  }

  function onStoreTokensProgress(store, newTotalTokens, serverStreamingElapsedSec, serverTtftSec) {
    if (newTotalTokens <= 0) return;
    const now = performance.now();

    if (serverTtftSec > 0) {
      store.liveServerTtftSec = serverTtftSec;
    }

    if (store.turnState === 'idle') {
      store.turnState = 'waiting';
      store.requestStartTime = now;
    }

    if (store.firstTokenTime === null) {
      store.firstTokenTime = serverStreamingElapsedSec > 0.05
        ? (now - serverStreamingElapsedSec * 1000)
        : now;
      store.turnState = 'streaming';
      store.slidingHistory = [
        { t: store.firstTokenTime, tokens: 0 },
        { t: now, tokens: newTotalTokens }
      ];
      store.lastTokenCount = newTotalTokens;
      store.lastChunkTime = now;
      const initElapsed = Math.max(0.08, (now - store.firstTokenTime) / 1000);
      store.smoothedRate = newTotalTokens / initElapsed;
      if (store.convId === getActiveConvId()) {
        updateAllBadges();
        if (isPopoverOpen) renderPopoverContent();
      }
      return;
    }

    if (newTotalTokens < store.lastTokenCount) return;

    store.lastTokenCount = newTotalTokens;
    store.lastChunkTime = now;
    store.slidingHistory.push({ t: now, tokens: newTotalTokens });

    const cutoff = now - 2000;
    while (store.slidingHistory.length > 2 && store.slidingHistory[0].t < cutoff) {
      store.slidingHistory.shift();
    }

    const totalElapsed = serverStreamingElapsedSec > 0.1
      ? serverStreamingElapsedSec
      : Math.max(0.1, (now - store.firstTokenTime) / 1000);
    const overallAvgRate = newTotalTokens / totalElapsed;

    if (store.slidingHistory.length >= 2) {
      const oldest = store.slidingHistory[0];
      const dt = (now - oldest.t) / 1000;
      const dTokens = newTotalTokens - oldest.tokens;
      if (dt >= 0.12 && dTokens > 0) {
        const windowRate = dTokens / dt;
        const blended = windowRate * 0.6 + overallAvgRate * 0.4;
        store.smoothedRate = store.smoothedRate <= 0 ? blended : store.smoothedRate * 0.35 + blended * 0.65;
      } else if (store.smoothedRate <= 0) {
        store.smoothedRate = overallAvgRate;
      }
    } else {
      store.smoothedRate = overallAvgRate;
    }

    if (store.convId === getActiveConvId()) {
      updateAllBadges();
      if (isPopoverOpen) renderPopoverContent();
    }
  }

  // ==========================================
  // 当前活动会话数据格式化
  // ==========================================
  function getCacheMetrics() {
    const store = getActiveStore();
    const useOfficial = store.officialCostSummary.cacheRead > 0 || store.officialCostSummary.input > 0;
    const src = useOfficial ? store.officialCostSummary : store.stepsUsageSummary;

    const read = Math.max(0, toNum(src.cacheRead));
    const write = Math.max(0, toNum(src.cacheWrite));
    const input = Math.max(0, toNum(src.input));
    const totalInput = read + write + input;

    if (totalInput <= 0) {
      return {
        rate: null,
        percentText: '--%',
        detailText: '--',
        read: 0,
        input: 0,
        total: 0
      };
    }

    const rate = (read / totalInput) * 100;
    const percentText = `${rate.toFixed(1)}%`;
    const detailText = `${formatCompactNumber(read)}/${formatCompactNumber(totalInput)}`;

    return {
      rate,
      percentText,
      detailText,
      read,
      input,
      total: totalInput
    };
  }

  function getFormattedRate() {
    const store = getActiveStore();
    if (store.turnState === 'waiting') {
      return unit === 's' ? '... tok/s' : '... tok/m';
    }

    const rate = store.turnState === 'streaming' ? store.smoothedRate : store.finalTurnRate;
    const validRate = Number(rate) > 0 && Number.isFinite(Number(rate)) ? Number(rate) : 0;

    if (validRate <= 0) {
      return unit === 's' ? '-- tok/s' : '-- tok/m';
    }

    if (unit === 's') {
      return validRate >= 100 ? `${Math.round(validRate)} tok/s` : `${validRate.toFixed(1)} tok/s`;
    } else {
      const perMin = Math.round(validRate * 60);
      return `${perMin.toLocaleString()} tok/m`;
    }
  }

  function getFormattedCache() {
    const cache = getCacheMetrics();
    if (cache.rate === null) return '--% 缓存';
    return cacheDisplayMode === 'percent' ? `${cache.percentText} 缓存` : `${cache.detailText} 缓存`;
  }

  // ==========================================
  // 全景悬浮面板渲染 (严格对齐 AGY 原生 Menu 视觉质感)
  // ==========================================
  let popoverEl = null;
  let popoverHideTimer = null;
  let activeAnchorEl = null;
  let isPopoverOpen = false;

  function ensurePopover() {
    if (popoverEl && document.body && document.body.contains(popoverEl)) {
      return popoverEl;
    }
    popoverEl = document.createElement('div');
    popoverEl.id = 'agy-metrics-popover';
    popoverEl.className = 'agy-native-popover';
    Object.assign(popoverEl.style, {
      position: 'fixed',
      zIndex: '2147483647',
      pointerEvents: 'none',
      opacity: '0',
      display: 'none'
    });

    popoverEl.addEventListener('mouseenter', () => {
      clearTimeout(popoverHideTimer);
    });
    popoverEl.addEventListener('mouseleave', () => {
      scheduleHidePopover();
    });

    if (document.body) {
      document.body.appendChild(popoverEl);
    }
    return popoverEl;
  }

  function showPopover(anchorEl) {
    if (!anchorEl || !document.body) return;
    clearTimeout(popoverHideTimer);
    activeAnchorEl = anchorEl;
    isPopoverOpen = true;

    const pop = ensurePopover();
    renderPopoverContent();

    pop.style.display = 'block';
    pop.style.visibility = 'hidden';
    pop.style.pointerEvents = 'auto';

    positionPopover(anchorEl);

    pop.style.visibility = 'visible';
    pop.style.opacity = '1';
  }

  function scheduleHidePopover() {
    clearTimeout(popoverHideTimer);
    popoverHideTimer = setTimeout(() => {
      isPopoverOpen = false;
      activeAnchorEl = null;
      if (popoverEl) {
        popoverEl.style.opacity = '0';
        popoverEl.style.pointerEvents = 'none';
        popoverEl.style.display = 'none';
      }
    }, 140);
  }

  function positionPopover(anchorEl) {
    const pop = ensurePopover();
    if (!anchorEl || !anchorEl.getBoundingClientRect) return;
    const rect = anchorEl.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    const popWidth = pop.offsetWidth || 300;
    const popHeight = pop.offsetHeight || 240;

    let top = rect.top - popHeight - 8;
    if (top < 8) {
      top = rect.bottom + 8;
    }

    let left = rect.left + rect.width / 2 - popWidth / 2;
    if (left < 8) left = 8;
    if (left + popWidth > window.innerWidth - 8) {
      left = Math.max(8, window.innerWidth - 8 - popWidth);
    }

    pop.style.top = `${Math.round(top)}px`;
    pop.style.left = `${Math.round(left)}px`;
  }

  function renderPopoverContent() {
    const pop = ensurePopover();
    const store = getActiveStore();
    const cache = getCacheMetrics();
    const isGenerating = store.turnState === 'waiting' || store.turnState === 'streaming';
    const rate = isGenerating ? store.smoothedRate : store.finalTurnRate;
    const validRate = Number(rate) > 0 && Number.isFinite(Number(rate)) ? Number(rate) : 0;

    const rateText = validRate > 0
      ? (unit === 's'
          ? `${validRate >= 100 ? Math.round(validRate) : validRate.toFixed(1)} tok/s`
          : `${Math.round(validRate * 60).toLocaleString()} tok/m`)
      : (store.turnState === 'waiting' ? '等待首字响应...' : '-- tok/s');

    const altRateText = validRate > 0
      ? (unit === 's'
          ? `(${Math.round(validRate * 60).toLocaleString()} TPM)`
          : `(${validRate >= 100 ? Math.round(validRate) : validRate.toFixed(1)} tok/s)`)
      : '';

    let statusBadge = '';
    if (store.turnState === 'waiting') {
      const elapsed = Math.max(0, (performance.now() - store.requestStartTime) / 1000).toFixed(1);
      statusBadge = `<span class="agy-tag agy-tag-waiting"><span class="agy-token-dot"></span> 等待首字 (${elapsed}s)</span>`;
    } else if (store.turnState === 'streaming') {
      statusBadge = `<span class="agy-tag agy-tag-streaming"><span class="agy-token-dot"></span> 实时解码中</span>`;
    } else {
      statusBadge = `<span class="agy-tag agy-tag-idle">⚡ 实时会话监测</span>`;
    }

    const hitRatePercent = cache.rate !== null ? `${cache.rate.toFixed(1)}%` : '--%';
    const hitRateColor = cache.rate !== null && cache.rate >= 80
      ? '#10b981'
      : (cache.rate !== null && cache.rate >= 50 ? '#f59e0b' : '#3b82f6');
    const progressWidth = cache.rate !== null ? Math.min(100, Math.max(0, cache.rate)) : 0;

    const turnOutTokens = isGenerating
      ? store.lastTokenCount
      : (store.lastTurnStats.tokens > 0 ? store.lastTurnStats.tokens : store.stepsUsageSummary.lastStepOutput);
    const turnThinkTokens = isGenerating
      ? 0
      : (store.lastTurnStats.thinkingTokens > 0 ? store.lastTurnStats.thinkingTokens : store.stepsUsageSummary.lastStepThinking);
    const sessionOutTokens = store.officialCostSummary.output > 0
      ? store.officialCostSummary.output
      : (store.stepsUsageSummary.output > 0 ? store.stepsUsageSummary.output : turnOutTokens);

    const pureDuration = isGenerating
      ? (store.firstTokenTime ? Math.max(0, (performance.now() - store.firstTokenTime) / 1000).toFixed(1) : '0.0')
      : (store.lastTurnStats.duration > 0 ? Number(store.lastTurnStats.duration).toFixed(2) : '0.00');
    const ttftDuration = isGenerating
      ? (store.liveServerTtftSec > 0
          ? store.liveServerTtftSec.toFixed(2)
          : (store.firstTokenTime
              ? Math.max(0, (store.firstTokenTime - store.requestStartTime) / 1000).toFixed(2)
              : Math.max(0, (performance.now() - store.requestStartTime) / 1000).toFixed(1)))
      : (store.lastTurnStats.ttft > 0 ? Number(store.lastTurnStats.ttft).toFixed(2) : '0.00');

    const totalCostUsd = store.officialCostSummary.costUsd > 0
      ? store.officialCostSummary.costUsd
      : store.stepsUsageSummary.costUsd;
    const costText = totalCostUsd > 0 ? `$${totalCostUsd.toFixed(4)}` : '--';

    const nextHtml = `
      <div class="agy-card-header">
        <span class="agy-card-title">Token 速率与缓存监测</span>
        ${statusBadge}
      </div>
      <div class="agy-card-body">
        <div class="agy-metric-row">
          <span class="agy-metric-label">⚡ 输出速率</span>
          <span class="agy-metric-value agy-highlight">${rateText} <span class="agy-metric-sub">${altRateText}</span></span>
        </div>
        <div class="agy-metric-row">
          <span class="agy-metric-label">🎯 缓存命中率</span>
          <span class="agy-metric-value" style="color: ${hitRateColor}; font-weight: 600;">${hitRatePercent}</span>
        </div>
        <div class="agy-progress-bar">
          <div class="agy-progress-fill" style="width: ${progressWidth}%; background-color: ${hitRateColor};"></div>
        </div>
        <div class="agy-detail-grid">
          <div class="agy-grid-item">
            <span class="agy-grid-label">命中缓存 (Read):</span>
            <span class="agy-grid-val">${cache.read > 0 ? formatCompactNumber(cache.read) : '--'}</span>
          </div>
          <div class="agy-grid-item">
            <span class="agy-grid-label">未缓存输入 (In):</span>
            <span class="agy-grid-val">${cache.input > 0 ? formatCompactNumber(cache.input) : '--'}</span>
          </div>
          <div class="agy-grid-item">
            <span class="agy-grid-label">最新步输出:</span>
            <span class="agy-grid-val">${turnOutTokens > 0 ? turnOutTokens.toLocaleString() : '--'}</span>
          </div>
          <div class="agy-grid-item">
            <span class="agy-grid-label">最新步思考:</span>
            <span class="agy-grid-val">${turnThinkTokens > 0 ? turnThinkTokens.toLocaleString() : '--'}</span>
          </div>
          <div class="agy-grid-item">
            <span class="agy-grid-label">纯解码耗时:</span>
            <span class="agy-grid-val">${pureDuration}s</span>
          </div>
          <div class="agy-grid-item">
            <span class="agy-grid-label">首字延迟 (TTFT):</span>
            <span class="agy-grid-val">${ttftDuration}s</span>
          </div>
          <div class="agy-grid-item">
            <span class="agy-grid-label">累计总输出:</span>
            <span class="agy-grid-val">${sessionOutTokens > 0 ? formatCompactNumber(sessionOutTokens) : '--'}</span>
          </div>
          <div class="agy-grid-item">
            <span class="agy-grid-label">预估成本 (USD):</span>
            <span class="agy-grid-val">${costText}</span>
          </div>
        </div>
      </div>
      <div class="agy-card-footer">
        <div>👉 点击左侧徽标切换单位 (${unit === 's' ? '当前: tok/s' : '当前: tok/m'})</div>
        <div>👉 点击右侧徽标切换缓存百分比 / 容量明细</div>
      </div>
    `;

    if (pop.__agy_last_html__ !== nextHtml) {
      pop.__agy_last_html__ = nextHtml;
      pop.innerHTML = nextHtml;
    }
  }

  function setupGlobalHoverDelegation() {
    const onPointerEvent = (e) => {
      const target = e.target;
      if (!target || typeof target.closest !== 'function') return;

      const badgeContainer = target.closest('.agy-token-rate-container');
      if (badgeContainer) {
        if (!isPopoverOpen || activeAnchorEl !== badgeContainer) {
          showPopover(badgeContainer);
        } else {
          clearTimeout(popoverHideTimer);
        }
        return;
      }

      const insidePopover = target.closest('#agy-metrics-popover');
      if (insidePopover) {
        clearTimeout(popoverHideTimer);
        return;
      }

      if (isPopoverOpen) {
        scheduleHidePopover();
      }
    };

    document.addEventListener('pointerover', onPointerEvent, true);
    document.addEventListener('mouseover', onPointerEvent, true);
  }

  // ==========================================
  // 徽标组件与样式注入 (对齐 AGY 原生 Menu 视觉质感)
  // ==========================================
  function updateAllBadges() {
    const store = getActiveStore();
    const isActivelyGenerating = store.turnState === 'waiting' || store.turnState === 'streaming';
    const cache = getCacheMetrics();
    const nextRateText = getFormattedRate();
    const nextCacheText = getFormattedCache();

    const rateBadges = document.querySelectorAll('.agy-token-rate-badge');
    rateBadges.forEach((badge) => {
      const valSpan = badge.querySelector('.agy-token-rate-value');
      if (valSpan && valSpan.textContent !== nextRateText) {
        valSpan.textContent = nextRateText;
      }

      const dot = badge.querySelector('.agy-token-dot');
      if (isActivelyGenerating) {
        if (!badge.classList.contains('agy-generating')) {
          badge.classList.add('agy-generating');
        }
        if (!dot) {
          const newDot = document.createElement('span');
          newDot.className = 'agy-token-dot';
          badge.insertBefore(newDot, badge.firstChild);
        }
      } else {
        if (badge.classList.contains('agy-generating')) {
          badge.classList.remove('agy-generating');
        }
        if (dot) dot.remove();
      }
    });

    const cacheBadges = document.querySelectorAll('.agy-cache-rate-badge');
    cacheBadges.forEach((badge) => {
      const valSpan = badge.querySelector('.agy-cache-rate-value');
      if (valSpan && valSpan.textContent !== nextCacheText) {
        valSpan.textContent = nextCacheText;
      }

      const wantHigh = cache.rate !== null && cache.rate >= 80;
      const wantMid = cache.rate !== null && cache.rate >= 50 && cache.rate < 80;

      if (wantHigh !== badge.classList.contains('agy-cache-high')) {
        badge.classList.toggle('agy-cache-high', wantHigh);
      }
      if (wantMid !== badge.classList.contains('agy-cache-mid')) {
        badge.classList.toggle('agy-cache-mid', wantMid);
      }
    });
  }

  function createMetricsContainer(id) {
    const container = document.createElement('div');
    container.id = id;
    container.className = 'agy-token-rate-container no-focus-agent-input flex items-center shrink-0 select-none';
    container.style.marginLeft = '4px';
    container.style.marginRight = '4px';
    container.style.gap = '4px';
    container.style.pointerEvents = 'auto';

    const rateBadge = document.createElement('button');
    rateBadge.type = 'button';
    rateBadge.className = 'agy-token-rate-badge';
    rateBadge.setAttribute('aria-label', 'Real-time Token Rate');

    const rateSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    rateSvg.setAttribute('width', '12');
    rateSvg.setAttribute('height', '12');
    rateSvg.setAttribute('viewBox', '0 0 24 24');
    rateSvg.setAttribute('fill', 'none');
    rateSvg.setAttribute('stroke', 'currentColor');
    rateSvg.setAttribute('stroke-width', '2');
    rateSvg.setAttribute('stroke-linecap', 'round');
    rateSvg.setAttribute('stroke-linejoin', 'round');
    rateSvg.style.marginRight = '3px';
    rateSvg.style.opacity = '0.75';
    rateSvg.style.flexShrink = '0';
    rateSvg.style.pointerEvents = 'none';
    rateSvg.innerHTML = '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>';

    const rateValSpan = document.createElement('span');
    rateValSpan.className = 'agy-token-rate-value';
    rateValSpan.style.pointerEvents = 'none';
    rateValSpan.textContent = getFormattedRate();

    rateBadge.appendChild(rateSvg);
    rateBadge.appendChild(rateValSpan);

    rateBadge.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      unit = unit === 's' ? 'm' : 's';
      try {
        localStorage.setItem(RATE_STORAGE_KEY, unit);
      } catch (err) {}
      updateAllBadges();
      if (isPopoverOpen) renderPopoverContent();
    });

    const cacheBadge = document.createElement('button');
    cacheBadge.type = 'button';
    cacheBadge.className = 'agy-cache-rate-badge';
    cacheBadge.setAttribute('aria-label', 'Prompt Cache Hit Rate');

    const cacheSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    cacheSvg.setAttribute('width', '12');
    cacheSvg.setAttribute('height', '12');
    cacheSvg.setAttribute('viewBox', '0 0 24 24');
    cacheSvg.setAttribute('fill', 'none');
    cacheSvg.setAttribute('stroke', 'currentColor');
    cacheSvg.setAttribute('stroke-width', '2');
    cacheSvg.setAttribute('stroke-linecap', 'round');
    cacheSvg.setAttribute('stroke-linejoin', 'round');
    cacheSvg.style.marginRight = '3px';
    cacheSvg.style.opacity = '0.75';
    cacheSvg.style.flexShrink = '0';
    cacheSvg.style.pointerEvents = 'none';
    cacheSvg.innerHTML = '<circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="6"></circle><circle cx="12" cy="2" r="2"></circle>';

    const cacheValSpan = document.createElement('span');
    cacheValSpan.className = 'agy-cache-rate-value';
    cacheValSpan.style.pointerEvents = 'none';
    cacheValSpan.textContent = getFormattedCache();

    cacheBadge.appendChild(cacheSvg);
    cacheBadge.appendChild(cacheValSpan);

    cacheBadge.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      cacheDisplayMode = cacheDisplayMode === 'percent' ? 'detail' : 'percent';
      try {
        localStorage.setItem(CACHE_MODE_KEY, cacheDisplayMode);
      } catch (err) {}
      updateAllBadges();
      if (isPopoverOpen) renderPopoverContent();
    });

    [container, rateBadge, cacheBadge].forEach((el) => {
      el.addEventListener('mouseenter', () => showPopover(container));
      el.addEventListener('mouseleave', () => scheduleHidePopover());
    });

    container.appendChild(rateBadge);
    container.appendChild(cacheBadge);
    return container;
  }

  function injectStyles() {
    let style = document.getElementById('agy-token-rate-styles');
    if (!style) {
      style = document.createElement('style');
      style.id = 'agy-token-rate-styles';
      document.head.appendChild(style);
    }
    style.textContent = `
      @keyframes agy-pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.35; transform: scale(0.85); }
      }
      .agy-token-dot {
        display: inline-block;
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: #10b981;
        margin-right: 4px;
        flex-shrink: 0;
        animation: agy-pulse 1.2s ease-in-out infinite;
      }
      .agy-token-rate-badge, .agy-cache-rate-badge {
        display: inline-flex;
        align-items: center;
        height: 28px;
        padding: 0 8px;
        border-radius: 9999px;
        font-size: 11px;
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
        font-variant-numeric: tabular-nums;
        user-select: none;
        cursor: pointer;
        outline: none;
        transition: all 0.15s ease;
        border: 1px solid var(--color-border, rgba(128, 128, 128, 0.22));
        background-color: var(--color-card, rgba(128, 128, 128, 0.08));
        color: var(--color-foreground, inherit);
        opacity: 0.9;
        white-space: nowrap;
        line-height: 1;
        pointer-events: auto;
      }
      .agy-token-rate-badge:hover, .agy-cache-rate-badge:hover {
        opacity: 1;
        background-color: var(--color-border, rgba(128, 128, 128, 0.16));
        border-color: rgba(128, 128, 128, 0.38);
      }
      .agy-token-rate-badge.agy-generating {
        border-color: rgba(16, 185, 129, 0.55);
        background-color: rgba(16, 185, 129, 0.12);
        color: #10b981;
        opacity: 1;
      }
      .agy-cache-rate-badge.agy-cache-high {
        border-color: rgba(16, 185, 129, 0.45);
        background-color: rgba(16, 185, 129, 0.1);
        color: #10b981;
      }
      .agy-cache-rate-badge.agy-cache-mid {
        border-color: rgba(245, 158, 11, 0.45);
        background-color: rgba(245, 158, 11, 0.1);
        color: #d97706;
      }

      /* 1:1 对标 AntiGravity 原生模型菜单 (bg-card, border-border, shadow-md, rounded-[10px]) */
      #agy-metrics-popover {
        width: 300px;
        border-radius: 10px;
        padding: 12px 14px;
        box-sizing: border-box;
        font-size: 11.5px;
        line-height: 1.45;
        background-color: var(--color-card, #ffffff);
        color: var(--color-foreground, #101010);
        border: 1px solid var(--color-border, rgba(0, 0, 0, 0.08));
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05), 0 10px 15px -3px rgba(0, 0, 0, 0.05);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        user-select: none;
        transition: opacity 0.12s ease;
      }
      .agy-card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        padding-bottom: 6px;
        border-bottom: 1px solid var(--color-border, rgba(0, 0, 0, 0.06));
      }
      .agy-card-title {
        font-weight: 600;
        font-size: 12px;
        color: var(--color-foreground, inherit);
      }
      .agy-tag {
        font-size: 10px;
        padding: 1px 6px;
        border-radius: 4px;
        display: inline-flex;
        align-items: center;
      }
      .agy-tag-idle {
        background: rgba(82, 111, 255, 0.12);
        color: #4f46e5;
      }
      .agy-tag-waiting {
        background: rgba(245, 158, 11, 0.12);
        color: #d97706;
      }
      .agy-tag-streaming {
        background: rgba(16, 185, 129, 0.12);
        color: #059669;
      }
      .agy-card-body {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }
      .agy-metric-row {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
      }
      .agy-metric-label {
        color: var(--color-muted-foreground, #6b7280);
      }
      .agy-metric-value {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-variant-numeric: tabular-nums;
        font-weight: 500;
        color: var(--color-foreground, inherit);
      }
      .agy-highlight {
        color: #10b981;
        font-weight: 600;
      }
      .agy-metric-sub {
        font-size: 10px;
        color: var(--color-muted-foreground, #6b7280);
        font-weight: normal;
      }
      .agy-progress-bar {
        width: 100%;
        height: 5px;
        background: var(--color-border, rgba(0, 0, 0, 0.06));
        border-radius: 9999px;
        overflow: hidden;
        margin: 2px 0 4px 0;
      }
      .agy-progress-fill {
        height: 100%;
        border-radius: 9999px;
        transition: width 0.25s ease;
      }
      .agy-detail-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 4px 10px;
        background: var(--color-background, rgba(0, 0, 0, 0.03));
        border: 1px solid var(--color-border, rgba(0, 0, 0, 0.06));
        border-radius: 8px;
        padding: 7px 9px;
        margin-top: 2px;
        font-size: 10.5px;
      }
      .agy-grid-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .agy-grid-label {
        color: var(--color-muted-foreground, #6b7280);
      }
      .agy-grid-val {
        font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
        font-variant-numeric: tabular-nums;
        color: var(--color-foreground, inherit);
        font-weight: 500;
      }
      .agy-card-footer {
        margin-top: 8px;
        padding-top: 6px;
        border-top: 1px solid var(--color-border, rgba(0, 0, 0, 0.06));
        font-size: 10px;
        color: var(--color-muted-foreground, #6b7280);
        display: flex;
        flex-direction: column;
        gap: 2px;
      }
    `;
  }

  function mountBadges() {
    const triggers = document.querySelectorAll('[data-testid="model-selector-trigger"]');
    let mountedNew = false;
    triggers.forEach((modelBtn, idx) => {
      const wrapper = modelBtn.closest('.no-focus-agent-input') || modelBtn.parentElement;
      if (!wrapper || !wrapper.parentElement) return;

      const containerId = `agy-token-rate-container-${idx}`;
      let container = document.getElementById(containerId);
      if (!container) {
        container = createMetricsContainer(containerId);
        mountedNew = true;
      }

      if (wrapper.nextSibling !== container) {
        wrapper.parentElement.insertBefore(container, wrapper.nextSibling);
        mountedNew = true;
      }
    });
    if (mountedNew) {
      updateAllBadges();
    }
  }

  // ==========================================
  // 挂载 globalThis.__asu 与会话同步
  // ==========================================
  let hookedAsuInstance = null;

  function attachToAsuInstance(asu) {
    if (!asu || typeof asu !== 'object' || hookedAsuInstance === asu) return;
    hookedAsuInstance = asu;

    try {
      if (typeof asu.maxSize === 'number' && asu.maxSize < 500) {
        asu.maxSize = 500;
      }
    } catch (e) {}

    try {
      if (asu.conversations instanceof Map) {
        for (const [convId, entries] of asu.conversations.entries()) {
          if (Array.isArray(entries)) {
            for (const entry of entries) {
              if (entry && entry.update) {
                processAgentStateUpdate(convId, entry.update, true);
              }
            }
          }
        }
      }
    } catch (e) {}

    window.__agy_on_asu_push__ = function (conversationId, update) {
      processAgentStateUpdate(conversationId, update, false);
    };

    if (typeof asu.push === 'function' && !asu.push.__agy_hooked__) {
      const origPush = asu.push;
      const wrappedPush = function (conversationId, update) {
        const res = origPush.apply(this, arguments);
        try {
          if (typeof window.__agy_on_asu_push__ === 'function') {
            window.__agy_on_asu_push__(conversationId, update);
          }
        } catch (e) {}
        return res;
      };
      wrappedPush.__agy_hooked__ = true;
      asu.push = wrappedPush;
    }
  }

  function setupAsuHook() {
    try {
      if (globalThis.__asu) {
        attachToAsuInstance(globalThis.__asu);
      } else {
        let currentAsu = globalThis.__asu;
        Object.defineProperty(globalThis, '__asu', {
          configurable: true,
          enumerable: true,
          get() {
            return currentAsu;
          },
          set(val) {
            currentAsu = val;
            attachToAsuInstance(val);
          }
        });
      }
    } catch (e) {}
  }

  function setupFetchStartTrigger() {
    const origFetch = globalThis.fetch;
    if (!origFetch || origFetch.__agy_hooked__) return;

    const wrappedFetch = function (input, init) {
      try {
        const url = typeof input === 'string' ? input : (input?.url || '');
        if (/StartCascade|SendUserCascadeMessage/i.test(url)) {
          const store = getActiveStore();
          onStoreRequestSubmitted(store);
        }
      } catch (e) {}
      return origFetch.apply(this, arguments);
    };

    wrappedFetch.__agy_hooked__ = true;
    globalThis.fetch = wrappedFetch;
  }

  setupAsuHook();
  setupFetchStartTrigger();

  let prevCancelBtn = false;
  let prevActiveConvId = null;

  function pollRuntimeState() {
    if (globalThis.__asu && globalThis.__asu !== hookedAsuInstance) {
      attachToAsuInstance(globalThis.__asu);
    }

    const currentConvId = getActiveConvId();
    if (currentConvId !== prevActiveConvId) {
      prevActiveConvId = currentConvId;
      updateAllBadges();
      if (isPopoverOpen) renderPopoverContent();
    }

    const store = getActiveStore();
    const cancelBtn = !!document.querySelector('[data-tooltip-id="input-send-button-cancel-tooltip"]');
    if (cancelBtn && !prevCancelBtn) {
      if (store.turnState === 'idle') onStoreRequestSubmitted(store);
    } else if (!cancelBtn && prevCancelBtn) {
      if (store.turnState !== 'idle') {
        store.turnState = 'idle';
        store.slidingHistory = [];
        recomputeStoreStats(store);
        updateAllBadges();
      }
    }
    prevCancelBtn = cancelBtn;
  }

  let intervalId = null;
  let observerInstance = null;

  function init() {
    injectStyles();
    setupGlobalHoverDelegation();
    mountBadges();

    if (globalThis.__asu) {
      attachToAsuInstance(globalThis.__asu);
    }

    let rafPending = false;
    observerInstance = new MutationObserver((mutations) => {
      let hasExternalMutation = false;
      for (let i = 0; i < mutations.length; i++) {
        const t = mutations[i].target;
        if (
          t &&
          t.nodeType === 1 &&
          typeof t.closest === 'function' &&
          (t.closest('.agy-token-rate-container') || t.closest('#agy-metrics-popover'))
        ) {
          continue;
        }
        hasExternalMutation = true;
        break;
      }
      if (!hasExternalMutation) return;

      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(() => {
        rafPending = false;
        mountBadges();
        pollRuntimeState();
      });
    });

    if (document.body) {
      observerInstance.observe(document.body, { childList: true, subtree: true });
    }

    intervalId = setInterval(() => {
      pollRuntimeState();
      const store = getActiveStore();
      if (store.turnState !== 'idle') {
        updateAllBadges();
      }
      if (isPopoverOpen && activeAnchorEl) {
        renderPopoverContent();
        positionPopover(activeAnchorEl);
      }
    }, 200);

    window.__AGY_TOKEN_RATE_CLEANUP__ = function () {
      if (intervalId) clearInterval(intervalId);
      if (observerInstance) observerInstance.disconnect();
      document.querySelectorAll('.agy-token-rate-container, #agy-metrics-popover').forEach(el => el.remove());
    };

    console.log('[AntiGravity] Token Rate & Prompt Cache Monitor v4 (Multi-Session Isolated) active.');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
