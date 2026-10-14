> 本项目由 gemini 3.8 flash (high) 编写

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

本项目攻克了 Electron 原生菜单注入、React 碎片化 DOM 节点动态重组、以及 Google Cloud Code 动态配额展示等核心难点，覆盖了从主界面导航、模型用量（动态配额、剩余额度计算）、常规与智能体行为控制、应用高级配置、外观配色主题、代码审查与产物工作区，到顶部标题菜单栏的 **700+ 项词条与动态规则**，提供丝滑沉浸的纯中文开发体验。

> 🛡️ **安全与合规保障**：本项目采用**动态本地提取技术**，仓库内仅包含开源汉化引擎（`zh-CN.js`）与安装脚本，纯净透明，合规安全。

---

## ✨ 核心特性

- ⚡ **一键跨平台安装与还原**：
  提供 Windows 批处理/PowerShell 以及 macOS Shell 脚本，全自动从本机提取官方资源并无缝挂载汉化引擎，3 秒搞定。
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

#### 方式一：一键安装（推荐）
1. 点击本仓库右上角 **`Code`** ➔ **`Download ZIP`**（或通过 `git clone` 下载）。
2. 解压到任意目录，双击运行目录下的 **`一键汉化.bat`**。
3. 脚本会自动检测进程、从本机合法提取资源、注入汉化并重新拉起客户端，打开即为纯中文界面！

> 💡 **提示**：如果系统拦截批处理，请允许运行，或在 PowerShell 中直接执行 `.\install-cn.ps1`。

#### 方式二：一键还原官方英文
双击运行目录下的 **`一键还原.bat`**（或执行 `.\uninstall-cn.ps1`）。

---

### 🍎 macOS 用户

#### 方式一：一键安装（推荐）
1. 打开终端（Terminal），克隆或下载解压本仓库：
   ```bash
   git clone https://github.com/493Arceus/antigravity-zh-cn-patch.git
   cd antigravity-zh-cn-patch
   ```
2. 执行一键安装脚本：
   ```bash
   chmod +x install-cn.sh uninstall-cn.sh
   ./install-cn.sh
   ```
3. 脚本会自动定位 `/Applications/Antigravity.app`，安全注入汉化并自动处理 macOS Gatekeeper 签名校验！

#### 方式二：一键还原官方英文
在终端中执行：
```bash
./uninstall-cn.sh
```

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
