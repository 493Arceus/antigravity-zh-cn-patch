# AntiGravity 客户端设置中心全景汉化升级总结

针对用户最新提供的设置面板截图，我们进行了**逐项像素级对照排查**，攻克了动态拼接与复合句式的汉化难点，完成了对**设置中心（Settings）全区域的深度汉化**。

---

## 1. 本轮新增汉化对照明细

### 🛠️ 设置导航栏与底部
- `Application` ➔ **`应用设置`**
- `Models` ➔ **`模型管理`**
- `Show All` / `Show Less` ➔ **`显示全部` / `收起`**
- `Not in Project` ➔ **`未归属项目`**
- `Shortcuts` ➔ **`快捷键`**

### 📋 常规设置（General）主面板
- **副标题**：`Configure agent execution, queued message delivery, and permissions.` ➔ **`配置智能体执行、排队消息发送以及全局权限。`**
- **执行管理板块 (Execution)**：
  - `Queued Messages` ➔ **`排队消息`**
  - `Configure when follow-up messages are sent.` ➔ **`配置何时发送后续追加的消息。`**
  - `Queue` / `Send Immediately` ➔ **`排队` / `立即发送`**
  - `Keyboard shortcuts` ➔ **`键盘快捷键`**
- **全局权限板块 (Global Permissions)**：
  - `Security Preset` ➔ **`安全预设`**
  - `Controls the actions the agent can take. Modified in <Project>` ➔ **`控制智能体可执行的操作权限。已在 <Project> 中修改`**
  - `Learn more about Turbo mode` ➔ **`了解更多关于极速模式的信息`**
  - `Turbo Mode` ➔ **`极速模式`**
  - `Tool Permissions 23` ➔ **`工具权限 23`**
  - `Modify permissions for file, terminal, and MCP tools.` ➔ **`修改文件、终端以及 MCP 工具的使用权限。`**
- **智能体行为 (Agent Behavior)**：
  - `Plan Review Policy` ➔ **`规划审查策略`**
  - `Whether the agent asks you to review its documents. Modified in <Project>` ➔ **`智能体是否要求您审查其规划文档。已在 <Project> 中修改`**
  - `Type / and select plan to have the agent generate a plan.` ➔ **`输入 / 并选择 plan 即可让智能体生成规划。`**
- **网络权限 (Network Permissions)**：
  - `Network Access Rules 6` ➔ **`网络访问规则 6`**
  - `Configure allowed and denied URLs for reading.` ➔ **`配置允许和禁止读取的 URL 地址。`**
- **终端与工具权限 (Terminal & Tooling Permissions)**：
  - `Terminal Commands` ➔ **`终端命令`**
  - `Commands Outside Sandbox` ➔ **`沙盒外终端命令`**
  - `Allow/deny specific terminal commands.` ➔ **`允许或拒绝特定的终端命令。`**
  - `Allow/deny agent command execution outside the sandbox.` ➔ **`允许或拒绝智能体在沙盒外执行命令。`**

### 💻 应用设置 (Application) 与 外观偏好 (Appearance)
- `Prevent Sleep` ➔ **`防止系统休眠`**
- `Keep In Menu Bar` ➔ **`保持在托盘菜单栏`**
- `Automatic Check for Updates` ➔ **`自动检查更新`**
- `Verbose Agent Chat` ➔ **`详细思考过程`**
- `Custom Context Menus` ➔ **`自定义右键快捷菜单`**
- `Conversation Width` ➔ **`对话面板宽度`**

---

## 2. 攻克的关键技术点

在设置面板中，文本存在三种特殊的 React 渲染特征，本轮针对性实现了彻底解决：
1. **动态附加项目名称**：例如 `Modified in Train Sim World 6` 是动态拼接到静态句尾的。通过加入正则分流提取，无论切换到哪个项目，都能优雅翻译为 `已在 [项目名] 中修改`。
2. **数字徽章后缀分离**：例如 `Tool Permissions 23` 和 `Network Access Rules 6`。引擎新增了智能数字提取逻辑，精准保留原有数量，完美翻译标题。
3. **复合句段拆分匹配**：对于包含快捷键标签的复合句，提供了子句映射保证不遗漏。

---

## 3. 立即查看效果

新引擎已写入客户端动态运行目录：
> 🔄 请在当前 AntiGravity 窗口内直接按下快捷键 **`Ctrl + R`**（重新加载界面），重新点开设置面板即可查看全新的全中文设置界面！
