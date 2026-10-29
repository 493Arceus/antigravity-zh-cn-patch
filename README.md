> 💡 **项目说明**：本项目由 493Arceus 与 Google AntiGravity 联合协作开发与编写维护。

# AntiGravity 客户端一键全景深度汉化补丁 (AntiGravity zh-CN Patch)

<p align="center">
  <h1 align="center">🚀 AntiGravity zh-CN Patch</h1>
  <p align="center"><strong>专为 Google AntiGravity (Jetski) 桌面客户端打造的高精度、全景深度简体中文汉化套件</strong></p>
</p>

<p align="center">
  <a href="https://github.com/493Arceus/antigravity-zh-cn-patch"><img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS-0078D6?logo=apple&logoColor=white" alt="Platform" /></a>
  <a href="https://github.com/493Arceus/antigravity-zh-cn-patch"><img src="https://img.shields.io/badge/AntiGravity-v2.23.0%2B-4285F4?logo=google&logoColor=white" alt="Target Version" /></a>
  <a href="https://github.com/493Arceus/antigravity-zh-cn-patch/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License" /></a>
  <a href="https://github.com/493Arceus/antigravity-zh-cn-patch"><img src="https://img.shields.io/badge/PRs-Welcome-brightgreen.svg" alt="PRs Welcome" /></a>
</p>

---

## 📖 项目简介

**AntiGravity zh-CN Patch** 是一个跨平台（Windows / macOS）、非侵入式、极速且全覆盖的 Google AntiGravity 桌面客户端本地化套件。

本项目攻克了 Electron 原生菜单注入、React 碎片化 DOM 节点动态重组、以及 Google Cloud Code 动态配额展示等核心难点，覆盖了从主界面导航、模型用量（动态配额、剩余额度计算）、常规与智能体行为控制、应用高级配置、外观配色主题、代码审查与产物工作区，到顶部标题菜单栏的 **1000+ 项词条与动态规则**，提供丝滑沉浸的纯中文开发体验。

> 🛡️ **安全与合规保障**：本项目采用**动态本地提取技术**，仓库内仅包含开源汉化引擎（`zh-CN.js`）与安装脚本，纯净透明，合规安全。

---

## ✨ 核心特性

- ⚡ **一键跨平台安装与管理向导**：
  提供 Windows 统一批处理 `一键安装.bat` 与 macOS Shell 脚本 `install.sh`，运行即刻进入向导，安装时供用户自主选择是否安装 Token 速率监控扩展，同时支持一键开关扩展与一键还原。
- 📊 **实时 Token 速率与缓存命中率监控（跨平台全兼容，安装时可选）**：
  **100% 兼容 Windows 与 macOS**。在底部输入框模型选择器右侧无缝挂载高精度 Token 性能双徽标仪表盘：
  - **工业级测速算法**：**首字延迟（TTFT）与解码生成彻底剥离**，剔除预填充排队延迟，真实反映模型吐字流速
  - **Prompt 缓存命中率实时统计**：实时统计已缓存 Context Token 与新增 Prompt Token，直观展示缓存命中百分比（`🎯 98.0%`）与 Token 明细，单击徽标可在百分比与明细间切换
  - **瞬时响应式悬浮数据卡片**：彻底解决浏览器原生 `title` 延迟及不显示问题，鼠标悬停（30ms 极速响应）即弹出高颜值毛玻璃信息卡片，呈现速率、缓存命中率进度条、Token 明细（已缓存/未缓存/输出总量）及纯解码耗时与 TTFT 耗时
  - **滑动时间窗口（1.8s）与 EMA 平滑**：消除瞬时网络抖动，流式生成平滑灵敏；生成结束展示全周期精确均速
  - **单击徽标即时切换**：单击速率徽标在 `tok/s` 与 `tok/m` 间切换，单击缓存徽标在百分比与明细间切换，本地自动持久化
  - **纯可选非侵入扩展**：安装时自主选择是否启用，后续亦可通过向导随时一键开启或关闭，热重载即刻生效
- 🎯 **像素级全景深度覆盖**：
  - **顶部菜单栏**：文件、视图、窗口及点击展开的二级子菜单（新建对话、命令面板、缩放调整、全屏控制等）。
  - **模型与配额中心**：套餐信息（`Google AI Pro` / `Ultra`）、每周/五小时滚动剩余配额、剩余刷新倒计时、超额额度抵扣开关等。
  - **设置中心全屏覆盖**：常规设置、执行管理、智能体行为、网络权限、沙盒外终端命令、浏览器智能体（Browser）、应用设置、外观偏好（主题配色、面板宽度）等 327 项核心设置 100% 汉化。
  - **对话流与工作流**：思考过程展示、模式切换（极速模式、规划模式、自主模式）、产物与审查面板。
- 🛡️ **严格保护开发者代码**：
  内置智能代码隔离机制，严格跳过 Monaco 编辑器、Markdown 代码块（`pre` / `code`）以及用户对话中的技术正文，**绝不污染或篡改用户的代码与工程数据**。
- 🔄 **支持热生效（Hot-Reload）**：
  后续微调词条后，只需在客户端内按下 `Ctrl + R` (macOS 下 `Cmd + R`) 刷新窗口，即可立即热生效，无需反复重启客户端。

---

## 🚀 快速上手

### 🪟 Windows 用户

#### 方式一：一键安装向导（推荐）
1. 点击本仓库右上角 **`Code`** ➔ **`Download ZIP`**（或通过 `git clone` 下载）。
2. 解压到任意目录，双击运行目录下的 **`一键安装.bat`**。
3. 在弹出的交互菜单中按需选择（直接回车默认推荐安装 `[2]`）：
   - `[1]` **安装完整汉化（标准纯净版）**
   - `[2]` **安装完整汉化 + 实时 Token 速率与缓存监控扩展 (推荐)**
   - `[3]` **单独开启 Token 速率监控扩展（需已安装汉化）**
   - `[4]` **单独关闭 Token 速率监控扩展**
   - `[5]` **一键卸载汉化，还原官方英文原版**
   - `[0]` **退出**
4. 脚本会自动检测进程、从本机合法提取资源、注入汉化并重新拉起客户端，打开即生效！

> 💡 **高级用法（PowerShell 命令行自动化）**：
> - 交互向导：`.\install-cn.ps1`
> - 带速率直接安装：`.\install-cn.ps1 -WithTokenRate`
> - 标准纯净安装：`.\install-cn.ps1`
> - 开启/关闭速率扩展：`.\install-cn.ps1 -Action EnableTokenRate` / `DisableTokenRate`
> - 还原英文原版：`.\install-cn.ps1 -Action Uninstall`

---

### 🍎 macOS 用户

#### 方式一：一键安装向导（推荐）
1. 打开终端（Terminal），克隆或下载解压本仓库：
   ```bash
   git clone https://github.com/493Arceus/antigravity-zh-cn-patch.git
   cd antigravity-zh-cn-patch
   ```
2. 执行一键安装向导脚本：
   ```bash
   chmod +x install-cn.sh install.sh
   ./install.sh
   # 或者执行: ./install-cn.sh
   ```
3. 在交互向导中输入选项数字 `[1-5]` 选择对应模式（直接回车默认推荐安装 `[2]`）：
   - `[1]` **安装完整汉化（标准纯净版）**
   - `[2]` **安装完整汉化 + 实时 Token 速率与缓存监控扩展 (推荐)**
   - `[3]` **单独开启 Token 速率监控扩展**
   - `[4]` **单独关闭 Token 速率监控扩展**
   - `[5]` **一键卸载汉化，还原官方英文原版**
4. 脚本会自动定位 `/Applications/Antigravity.app`，安全注入汉化并自动处理 macOS Gatekeeper 签名校验！

> 💡 **终端命令行自动化支持**：
> - 带速率直接安装：`./install.sh --with-token-rate`
> - 标准纯净安装：`./install.sh --standard`
> - 开启/关闭速率扩展：`./install.sh --enable-token-rate` / `--disable-token-rate`
> - 还原英文原版：`./install.sh --uninstall`


---

## 🛠️ 自定义修改与扩展词条

所有翻译字典与匹配规则均保存在公开的 JavaScript 文件中：
`zh-CN.js`

- **新增静态词条**：直接在 `DICT` 对象中追加 `"English Text": "中文译文"` 即可。
- **动态正则替换**：在 `PATTERNS` 数组中添加带有捕获组的正则表达式与替换模版。
- **即时生效**：修改保存后，直接在 AntiGravity 窗口内按快捷键 **`Ctrl + R`** (macOS: **`Cmd + R`**) 重新加载界面，即可秒级查看翻译效果！

欢迎提交 Pull Request 贡献您优化或补充的译文！

---

## 🏗️ 技术实现原理

```
[ 安装器: install-cn.ps1 (Win) / install-cn.sh (Mac) ]
       │
       ├── 1. 从本机 language_server 提取官方 web_bundle 资源并解压
       ├── 2. 注入 zh-CN.js 纯中文运行时翻译引擎并挂载到 index.html
       └── 3. 部署轻量级原生菜单汉化补丁 (app.asar.zh) 并自动签名
```

1. **动态本地解包**：安装器直接利用原生流扫描算法，从用户本机的 `language_server` 中动态解出官方前端包，不分发任何第三方版权 JS。
2. **零闪烁运行时拦截**：`zh-CN.js` 在页面加载之初注册高性能 `MutationObserver`，针对节点的新增、字符变动、属性（`placeholder`、`title`、`aria-label`）进行增量翻译，CPU 开销微乎其微。
3. **复合句段碎片重组**：针对 React 拆分多节点（如 `<span>` 嵌套 `<a>` 链接）的场景，采用词根分片匹配，保留超链接的原本结构与交互性。

---

## ❓ 常见问题 (FAQ)

<details>
<summary><strong>Q1: 汉化后会不会影响客户端后续版本自动更新？</strong></summary>
官方推送新版本时会直接覆盖 <code>app.asar</code>，更新后客户端将暂时回到官方英文状态。只需重新运行一次安装脚本即可重新恢复汉化。
</details>

<details>
<summary><strong>Q2: macOS 提示“应用程序已损坏”或无法打开？</strong></summary>
macOS 默认会对修改过 Contents 的应用开启签名隔离。<code>install-cn.sh</code> 脚本已内置 <code>xattr -cr</code> 和自签名指令；若系统仍提示拦截，请在终端执行：
<code>sudo xattr -cr /Applications/Antigravity.app</code>
</details>

<details>
<summary><strong>Q3: 为什么有的专业技术名词保留了英文？</strong></summary>
如 <code>MCP</code> (Model Context Protocol)、<code>VS Code</code>、<code>WSL</code>、<code>Git</code>、<code>Token</code> 等业内通用标准名词，按开发者使用习惯予以保留或采取双语标注，避免过度直译造成歧义。
</details>

---

## 📄 开源许可证

本项目基于 [MIT License](LICENSE) 许可证开源，仅供学习、交流与辅助开发使用。  
AntiGravity 相关商标与原始资产所有权均归 Google LLC 所有。
