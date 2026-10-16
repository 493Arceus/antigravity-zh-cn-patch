/**
 * AntiGravity Client Chinese Localization Engine (zh-CN.js)
 * Fully exhaustive, deep-inspected runtime UI translator
 * Auto-generated: 2026-10-15T23:41:32.535Z
 */
(function() {
  'use strict';

  if (window.__AGY_ZH_CN_INITIALIZED__) return;
  window.__AGY_ZH_CN_INITIALIZED__ = true;

  // 1. Comprehensive Master Dictionary
  const DICT = {
  "New Conversation": "新建对话",
  "Conversation History": "对话历史",
  "Automations": "自动化任务",
  "Customizations": "自定义扩展",
  "Projects": "项目列表",
  "Conversations": "所有对话",
  "Settings": "设置",
  "No Project": "未关联项目",
  "Select a project": "选择项目",
  "Select Project": "选择项目",
  "New Project": "新建项目",
  "Create New Project": "创建新项目",
  "Search Projects": "搜索项目...",
  "Archive project": "归档项目",
  "Project Folders": "项目文件夹",
  "Project Settings": "项目设置",
  "Project Name": "项目名称",
  "Overview": "概览",
  "Files": "文件",
  "Terminal": "终端",
  "Terminals": "终端列表",
  "Open Terminal": "打开终端",
  "Split Terminal": "拆分终端",
  "Delete Terminal": "删除终端",
  "Add Terminal": "新建终端",
  "No active terminals": "暂无活动终端",
  "Standalone Terminals": "独立终端",
  "Standalone terminals": "独立终端",
  "Code Review": "代码审查",
  "Review": "审查",
  "Artifacts": "产物",
  "Context": "上下文",
  "History": "历史记录",
  "Feedback": "意见反馈",
  "Provide Feedback": "提供反馈",
  "Documentation": "官方文档",
  "Docs": "文档",
  "Learn more": "了解详情",
  "Learn more about": "了解更多关于",
  "Modified in": "修改于项目：",
  "See less": "收起",
  "Show more": "显示更多",
  "Show less": "收起",
  "Show Less": "收起",
  "Show All": "显示全部",
  "View Details": "查看详情",
  "Hide Details": "收起详情",
  "Toggle Sidebar": "切换左侧栏",
  "Toggle Auxiliary Pane": "切换辅助侧栏",
  "Toggle Overview Panel": "切换概览面板",
  "Auxiliary Pane": "辅助侧栏",
  "Sidecar View": "侧栏视图",
  "Custom View": "自定义视图",
  "Not in Project": "未归属项目",
  "Outside of Project": "项目外部",
  "Shortcuts": "快捷键",
  "Workspace": "工作区",
  "Workspaces": "工作区列表",
  "New Workspace": "新建工作区",
  "Workspace Name": "工作区名称",
  "Search workspaces...": "搜索工作区...",
  "Search Recent Workspaces": "搜索最近工作区",
  "Select workspace...": "选择工作区...",
  "Workspace name cannot be empty": "工作区名称不能为空",
  "Add Workspace": "添加工作区",
  "Open Workspace": "打开工作区",
  "Close Workspace": "关闭工作区",
  "Recent Workspaces": "最近工作区",
  "No workspace open": "未打开工作区",
  "Open Folder": "打开文件夹",
  "Open File": "打开文件",
  "Create fork in current workspace": "在当前工作区创建分支",
  "Create fork in shared workspace": "在共享工作区创建分支",
  "Create fork in new workspace": "在新工作区创建分支",
  "Failed to create workspace": "创建工作区失败",
  "Delete workspace": "删除工作区",
  "Ask anything, @ to mention, / for actions": "输入任何问题，按 @ 引用，输入 / 触发操作",
  "Ask anything, @ to mention": "输入任何问题，按 @ 引用",
  ", / for actions": "，输入 / 触发操作",
  "Ask anything...": "输入任何问题...",
  "Ask a question": "向智能体提问",
  "Send a message...": "发送消息...",
  "Send a message": "发送消息",
  "Type a message...": "输入消息...",
  "Search...": "搜索...",
  "Search": "搜索",
  "Search files": "搜索文件",
  "Search files...": "搜索文件...",
  "Search conversation...": "搜索对话...",
  "Search Conversations": "搜索对话历史",
  "Search settings": "搜索设置...",
  "Search commands": "搜索命令",
  "Search file contents...": "搜索文件内容...",
  "Search for files in the project...": "在项目中搜索文件...",
  "Type to search file contents": "输入以搜索文件内容",
  "Recent Files": "最近文件",
  "Recent files": "最近文件",
  "Files Changed": "已修改文件",
  "Searched files": "已检索文件",
  "Searched for files": "已检索文件",
  "Model": "模型选择",
  "Models": "模型管理",
  "Model Selection": "模型选择",
  "Select Model": "选择模型",
  "New": "新",
  "Notice": "提示",
  "Unavailable": "不可用",
  "View Usage": "查看用量",
  "Turbo": "极速模式",
  "Turbo Mode": "极速模式",
  "Turbo mode": "极速模式",
  "Thinking": "思考中",
  "Thinking Process": "思考过程",
  "Thinking...": "思考中...",
  "High": "深度思考 (High)",
  "Medium": "平衡思考 (Medium)",
  "Low": "精简思考 (Low)",
  "Fast": "快速模式",
  "Normal": "常规模式",
  "Autonomous Mode": "自主智能体模式",
  "Plan Mode": "规划模式",
  "Models & Usage": "模型与用量",
  "Manage your model quota and credits.": "管理您的模型配额与额度。",
  "Plan": "当前套餐",
  "Your Plan:": "当前套餐：",
  "Your Plan: Google AI Pro": "当前套餐：Google AI Pro",
  "You can upgrade to a Google AI Ultra plan to receive higher rate limits.": "您可以升级到 Google AI Ultra 套餐以获取更高的速率上限。",
  "Upgrade": "升级套餐",
  "Model Credits": "模型额外额度",
  "Enable AI Credit Overages": "启用 AI 超额抵扣额度",
  "When toggled on, Antigravity will use your AI credits to fulfill model requests once you're out of model quota. Antigravity will always use your model quota first before using AI credits.": "开启后，当模型基础配额耗尽时，AntiGravity 将使用您的 AI 额外额度继续响应请求。AntiGravity 始终会优先消耗免费/基础套餐配额。",
  "Gemini Models": "Gemini 模型系列",
  "Claude and GPT models": "Claude 与 GPT 模型系列",
  "Weekly Limit Remaining": "每周剩余额度",
  "Five Hour Limit Remaining": "5小时滚动剩余额度",
  "Application": "应用设置",
  "Manage Antigravity app settings.": "管理 AntiGravity 客户端应用设置。",
  "Appearance": "外观偏好",
  "Notifications": "通知设置",
  "Notification Settings": "通知设置",
  "Developer": "开发者选项",
  "Editor": "编辑器设置",
  "Tab": "代码补全 (Tab)",
  "Jetski Chat": "聊天设置",
  "General": "常规设置",
  "Account": "账号与身份",
  "Keyboard Shortcuts": "键盘快捷键",
  "Advanced": "高级选项",
  "Advanced Settings": "高级设置",
  "Editor Settings": "编辑器设置",
  "Open Editor Settings": "打开编辑器设置",
  "Open Settings": "打开设置",
  "Close Settings": "关闭设置",
  "Experimental Features": "实验性功能",
  "Agent Security Settings": "智能体安全设置",
  "Skills and Rules Settings": "技能与规则设置",
  "About": "关于 AntiGravity",
  "Execution": "执行管理",
  "Queued Messages": "排队消息",
  "Configure when follow-up messages are sent.": "配置何时发送后续追加的消息。",
  "Keyboard shortcuts": "键盘快捷键",
  "Queue": "排队",
  "Send Immediately": "立即发送",
  "Configure agent execution, queued message delivery, and permissions.": "配置智能体执行、排队消息发送以及全局权限。",
  "Global Permissions": "全局权限",
  "Security Preset": "安全预设",
  "Controls the actions the agent can take.": "控制智能体可执行的操作权限。",
  "Tool Permissions": "工具权限",
  "Modify permissions for file, terminal, and MCP tools.": "修改文件、终端以及 MCP 工具的使用权限。",
  "Agent always asks for review.": "智能体始终请求代码审查。",
  "Every command requires approval.": "所有命令均需手动批准。",
  "Ask before sensitive operations.": "执行敏感操作前进行确认。",
  "Security agent decides if commands run.": "由安全决策智能体判断命令是否可执行。",
  "Automatically decide if commands run.": "自动判断并决定命令是否允许执行。",
  "Run all commands without restrictions.": "无限制运行所有命令（极速模式）。",
  "Agent Behavior": "智能体行为",
  "Plan Review Policy": "规划审查策略",
  "Whether the agent asks you to review its documents.": "智能体是否要求您审查其规划文档。",
  "Always Proceed": "始终允许继续",
  "Always Ask": "始终询问",
  "Type": "输入",
  "and select": "并选择",
  "to have the agent generate a plan.": "以让智能体生成规划。",
  "Network Permissions": "网络访问权限",
  "Network Access Rules": "网络访问规则",
  "Configure allowed and denied URLs for reading.": "配置允许和禁止读取的 URL 地址。",
  "Terminal & Tooling Permissions": "终端与工具权限",
  "Terminal Commands": "终端命令",
  "Allow/deny specific terminal commands.": "允许或拒绝特定的终端命令。",
  "Commands Outside Sandbox": "沙盒外终端命令",
  "Configure allowed commands outside the sandbox.": "配置允许在沙盒外部运行的命令。",
  "Allow/deny agent command execution outside the sandbox.": "允许或拒绝智能体在沙盒外执行命令。",
  "Run terminal commands with sandbox restrictions.": "在沙盒隔离限制下运行终端命令。",
  "Allow sandboxed commands to make network requests.": "允许沙盒中的命令发起网络请求。",
  "A shell setup script run before every command the agent executes.": "在智能体执行每条命令前运行的 Shell 初始化脚本。",
  "The agent auto-executes commands matched by an allow list entry.": "智能体自动执行匹配允许列表的命令。",
  "The agent asks for permission before executing commands matched by a deny list entry.": "智能体执行匹配拒绝列表的命令前需征得许可。",
  "Browser": "浏览器智能体 (Browser)",
  "Configure the browser subagent. It requires Google Chrome to be installed. The browser subagent can be invoked by typing /browser in the conversation input box.": "配置浏览器子智能体。此功能需要系统中安装 Google Chrome。您可以通过在对话框中键入 /browser 来调用浏览器子智能体。",
  "Browser Javascript Execution Policy": "浏览器 JavaScript 执行策略",
  "Controls whether the agent can run custom JavaScript to automate complex browser actions.": "控制智能体是否可以运行自定义 JavaScript 脚本以实现复杂浏览器操作自动化。",
  "Browser Actuation Rules": "浏览器操作控制规则",
  "Configure allowed and denied URLs for browser actuation.": "配置允许和禁止浏览器执行操作的 URL 网址。",
  "Edit": "编辑",
  "Remote Control": "远程控制",
  "Enable Remote Control": "启用远程控制",
  "Work with local agents from another device.": "通过其他设备远程连接并使用本地智能体。",
  "To modify notification settings, open your operating system's system preferences.": "如需修改系统通知偏好，请打开操作系统的系统设置。",
  "Open System Preferences": "打开系统设置",
  "App version": "客户端版本号",
  "Prevent Sleep": "防止系统休眠",
  "Prevent the computer from sleeping while the app is running.": "在应用运行期间防止计算机进入睡眠状态。",
  "Keep In Menu Bar": "保持在托盘菜单栏",
  "Keep the app accessible from the menu bar and running in the background when all windows are closed.": "在所有窗口关闭后，保持应用在后台运行并可通过菜单栏托盘访问。",
  "Automatic Check for Updates": "自动检查更新",
  "Automatically prompt you to restart and update when a new version is available.": "有新版本可用时自动提示您重启以更新应用。",
  "Contrast": "对比度",
  "Strong": "增强对比",
  "Light Theme": "浅色主题配色",
  "Dark Theme": "深色主题配色",
  "Preset": "配色预设",
  "Background": "背景色",
  "Foreground": "前景色",
  "Accent": "强调高亮色",
  "Chat Settings": "聊天界面偏好",
  "Narrow": "紧凑居中",
  "Wide": "宽屏居中",
  "Verbose Agent Chat": "详细思考过程",
  "Display and preserve intermediate thinking steps.": "显示并保留智能体的完整中间思考步骤。",
  "Custom Context Menus": "自定义右键快捷菜单",
  "Replace the default browser right-click menu with quick actions.": "使用快捷操作菜单替换默认的浏览器右键菜单。",
  "Conversation Width": "对话面板宽度",
  "Configure the maximum width of the conversation panel.": "配置文件对话面板的最大显示宽度。",
  "Configure the default width of markdown artifacts.": "配置 Markdown 产物文档的默认显示宽度。",
  "Theme": "界面主题",
  "Dark": "深色",
  "Light": "浅色",
  "System": "跟随系统",
  "Default Dark": "默认深色",
  "Default Light": "默认浅色",
  "Suggestions in Editor": "编辑器行内建议",
  "Show suggestions when typing in the editor": "在编辑器中键入时显示代码建议",
  "Tab to Jump": "Tab 跳转建议",
  "Predict the location of your next edit and navigate you there with a tab keypress.": "预测下一次编辑位置，按 Tab 键即可快速跳转。",
  "Tab to Import": "Tab 导入代码",
  "Quickly add and update imports with a tab keypress.": "按 Tab 键快速添加和更新导入语句 (Imports)。",
  "Tab Speed": "Tab 建议响应速度",
  "Set the speed of tab suggestions": "设置 Tab 代码补全建议的触发响应速度",
  "Highlight After Accept": "接受后高亮新代码",
  "Highlight newly inserted text after accepting a Tab completion.": "接受 Tab 补全后高亮显示新插入的代码。",
  "Tab Gitignore Access": "Tab 访问 .gitignore 文件",
  "Allow Tab to view and edit the files in .gitignore. Use with caution if your .gitignore lists files containing credentials, secrets, or other sensitive information.": "允许 Tab 查看和编辑 .gitignore 中指定的文件。若包含机密请谨慎使用。",
  "Confirm Window Reload": "确认重载窗口",
  "Toggle if a confirmation is shown when using the \"Reload Window\" button.": "使用“重新加载窗口”时是否弹出确认提示。",
  "Enable Demo Mode (Beta)": "演示模式 (测试版)",
  "Show Selection Actions": "显示选区快捷按钮",
  "Show \"Edit\" and \"Chat\" buttons when selecting text in the editor.": "在编辑器中选中文本时显示“编辑”和“对话”快捷操作按钮。",
  "Play a sound when the agent finishes generating a response.": "当智能体完成回复生成时播放提示音。",
  "Show browser notifications when your action is needed or execution finishes.": "当需要您操作或执行完成时显示系统通知。",
  "Automatically expand the Changes Overview toolbar when the agent finishes generating a response.": "当智能体完成回复生成时，自动展开更改概览工具栏。",
  "Accept all": "全部接受",
  "Reject all": "全部拒绝",
  "Accept": "接受",
  "Reject": "拒绝",
  "Save": "保存",
  "Cancel": "取消",
  "Delete": "删除",
  "Delete Conversation": "删除对话",
  "Delete Task": "删除任务",
  "Delete Skill": "删除技能",
  "Delete MCP Server": "删除 MCP 服务",
  "Delete Permanently": "永久删除",
  "Confirm": "确认",
  "Proceed": "继续执行",
  "Deny": "拒绝执行",
  "Dismiss": "忽略",
  "Skip": "跳过",
  "Submit": "提交",
  "Clear": "清除",
  "Reset": "重置",
  "Retry": "重试",
  "Try again": "重试",
  "Stop": "停止",
  "Stop generating": "停止生成",
  "Send": "发送",
  "Copy": "复制",
  "Copied": "已复制",
  "Copied!": "已复制！",
  "Copied to clipboard": "已复制到剪贴板",
  "Copy Path": "复制完整路径",
  "Copy link": "复制链接",
  "Copy error": "复制错误信息",
  "Copy value": "复制值",
  "Copy Config File Path": "复制配置文件路径",
  "Close": "关闭",
  "Back": "返回",
  "Next": "下一步",
  "Previous": "上一步",
  "Finish": "完成",
  "Apply": "应用",
  "Refresh": "刷新",
  "Manage": "管理",
  "Install": "安装",
  "Uninstall": "卸载",
  "Enable": "启用",
  "Disable": "禁用",
  "Enabled": "已启用",
  "Disabled": "已禁用",
  "Rename": "重命名",
  "Create": "创建",
  "Installed": "已安装",
  "Global": "全局",
  "Inherit Global": "继承全局",
  "Default": "默认",
  "Unknown": "未知",
  "Other": "其他",
  "Running": "运行中",
  "Idle": "空闲",
  "Done": "已完成",
  "Failed": "失败",
  "Error": "错误",
  "Warning": "警告",
  "Info": "提示",
  "Success": "成功",
  "Open": "打开",
  "Open in editor": "在编辑器中打开",
  "Open in new tab": "在新标签页打开",
  "Open in Code Search": "在代码搜索中打开",
  "Code Search": "代码搜索",
  "Reveal in File Explorer": "在系统资源管理器中显示",
  "Agent": "智能体",
  "Agents": "智能体列表",
  "Subagent": "子智能体",
  "Subagents": "子智能体",
  "Child Subagents": "下级子智能体",
  "No subagents": "无子智能体",
  "Stop Subagent": "停止子智能体",
  "Invoked subagent": "调用子智能体",
  "Fix with Agent": "让智能体排查修复",
  "Project Agent": "项目智能体",
  "Custom Agents": "自定义智能体",
  "Agent Stopped": "智能体已停止",
  "Agent is analyzing": "智能体正在分析",
  "Queue message": "消息加入排队",
  "Plugins": "插件中心",
  "Plugin": "插件",
  "No plugins available": "暂无可用插件",
  "Loading plugin...": "正在加载插件...",
  "Create plugin": "创建插件",
  "Create a Plugin with the Agent": "通过智能体创建插件",
  "Loading installed plugins...": "正在加载已安装插件...",
  "No matching plugins found": "未找到匹配插件",
  "MCP Servers": "MCP 服务器",
  "MCP Tools": "MCP 工具",
  "Unknown Server": "未知服务器",
  "Background Tasks": "后台任务",
  "Background Task": "后台任务",
  "Background Task Output": "后台任务输出",
  "Cancel Task": "取消任务",
  "Scheduled Tasks": "定时计划任务",
  "Skills": "技能库",
  "Skill": "技能",
  "Rules": "自定义规则",
  "Staged Changes": "暂存更改",
  "Branch Changes": "分支更改",
  "Diff": "差异对比",
  "All changes saved": "所有更改已保存",
  "No changes detected": "未检测到代码更改",
  "Request Review": "发起代码审查",
  "all agent edits": "智能体全部修改",
  "Canceled edit to": "已取消对以下文件的编辑：",
  "File Diff Comments": "代码比对评论",
  "File Comments": "文件评论",
  "Are you sure you want to delete this conversation? This action cannot be undone.": "确定要删除此对话吗？此操作无法撤销。",
  "Are you sure you want to delete": "确定要删除吗：",
  "Just now": "刚刚",
  "Untitled Conversation": "未命名对话",
  "Walkthrough": "实施总结",
  "Antigravity Localization Plan": "汉化规划方案",
  "Loading...": "加载中...",
  "Creating...": "创建中...",
  "Removing...": "移除中...",
  "Saving...": "保存中...",
  "Searching...": "搜索中...",
  "Version": "客户端版本",
  "Release channel": "发布通道",
  "Check for updates": "检查更新...",
  "Checking for updates...": "正在检查更新...",
  "Update Available": "发现新版本可用",
  "Update Anyway": "仍然更新",
  "Update": "更新",
  "Last Updated": "最后更新时间",
  "Sign in with Google": "使用 Google 账号登录",
  "Sign In": "登录",
  "Sign Out": "退出登录",
  "Signed in as": "当前登录账号：",
  "Your Plan: ": "当前套餐：",
  "Your Plan: Google AI Ultra": "当前套餐：Google AI Ultra",
  "Gemini 4 Argon": "Gemini 4 Argon",
  "Gemini 4 Argon Weekly Limit": "Gemini 4 Argon 每周额度",
  "Gemini 4 Argon 5-Hour Limit": "Gemini 4 Argon 5小时滚动额度",
  "Gemini 4 Argon Five Hour Limit": "Gemini 4 Argon 5小时滚动额度",
  "Weekly Limit": "每周额度",
  "Five Hour Limit": "5小时滚动额度",
  "5-Hour Limit": "5小时滚动额度",
  "Daily Limit": "每日额度",
  "Monthly Limit": "每月额度",
  "Refreshing...": "正在刷新...",
  "Refreshing": "正在刷新",
  "Your quota for this model is running low.": "该模型的可用配额即将耗尽。",
  "New models have been enabled for you!": "已为您启用新模型！",
  "Select a model in the model selector": "请在模型选择器中选择模型",
  "Dismiss Tip": "忽略提示",
  "Custom models are only supported on Linux machines.": "自定义模型仅支持在 Linux 系统上运行。",
  "Edit Model": "编辑模型",
  "Add Model": "添加模型",
  "Loading models...": "正在加载模型列表...",
  "No models available": "暂无可用模型",
  "GPT-OSS will be removed from Antigravity on November 2, 2026.": "GPT-OSS 将于 2026 年 11 月 2 日从 AntiGravity 中下线。",
  "Refresh quota and credits data": "刷新配额与额度数据",
  "No quota information available.": "暂无可用配额信息。",
  "No token data available.": "暂无可用 Token 数据。",
  "Model Quota": "模型配额",
  "No Model Selected": "未选择模型",
  "Fill": "占满全宽",
  "Markdown Artifact Width": "Markdown 产物宽度",
  "Configure the agent's visual theme and display preferences.": "配置智能体的界面主题与显示偏好。",
  "Layout Controls": "界面布局控件",
  "Manage Jetski app settings.": "管理 Jetski 客户端应用设置。",
  "Automatically prompt you to restart the app when a new update is available. When disabled, you can check for updates manually from the app menu.": "有新版本可用时自动提示重启应用。禁用后，您可在应用菜单中手动检查更新。",
  "Manage your conversations from the companion website.": "通过配套网站远程管理您的对话。",
  "Continue your work from another device with Remote Control. Scan the QR code or open the link below.": "使用远程控制在其他设备上继续工作。扫描二维码或打开下方链接。",
  "Open in Remote Control": "在远程控制中打开",
  "Scan the code to open this device in Remote Control, or": "扫描二维码在远程控制中打开此设备，或",
  "A label for this computer when you connect from another device. Changing it reconnects.": "从其他设备连接时此计算机的名称标识。修改后将重新连接。",
  "Device Name": "设备名称",
  "Nickname": "设备别名",
  "Enter device name...": "输入设备名称...",
  "These settings can only be changed on the computer running the app, not from a remote session.": "这些设置只能在运行该应用的计算机上修改，无法在远程会话中更改。",
  "Manage your notification preferences.": "管理您的通知偏好设置。",
  "Enable Notifications for Agent": "为智能体启用系统通知",
  "Sound": "提示音",
  "Enable Sounds for Agent": "为智能体启用提示音",
  "When enabled, Antigravity will play a sound when Agent finishes generating a response.": "启用后，当智能体生成完回复时 AntiGravity 将播放提示音。",
  "Set the volume of agent sounds.": "设置智能体提示音音量。",
  "Volume": "音量",
  "Auto-Expand Changes Overview": "自动展开更改概览",
  "When enabled, the Changes Overview toolbar will automatically expand when Agent finishes generating a response.": "启用后，智能体完成回复时将自动展开更改概览工具栏。",
  "Enable Browser Tools": "启用浏览器工具",
  "Let the agent use browser tools to open URLs, read web pages, and interact with browser content. This gives the agent access to important (and often critical) knowledge and methods of validation, but any browser integration does increase exposure to external malicious parties for security exploits.": "允许智能体使用浏览器工具打开 URL、读取网页以及与网页内容交互。这为智能体提供了关键的信息检索与验证能力，但也会增加暴露给外部恶意站点的风险。",
  "Browser Actuation Permissions": "浏览器操作权限",
  "Chrome Binary Path": "Chrome 可执行文件路径",
  "Path to the Chrome/Chromium executable. Leave empty for auto-detection.": "Chrome 或 Chromium 可执行文件的路径。留空则自动检测。",
  "Browser User Profile Path": "浏览器用户配置目录路径",
  "Custom path for the browser user profile directory. Leave empty for default (~/.gemini/antigravity-browser-profile).": "浏览器用户配置文件目录的自定义路径。留空则使用默认路径 (~/.gemini/antigravity-browser-profile)。",
  "Browser CDP Port": "浏览器 CDP 调试端口",
  "Port number for Chrome DevTools Protocol remote debugging. Leave empty for default (9222).": "Chrome DevTools Protocol (CDP) 远程调试端口号。留空则使用默认端口 (9222)。",
  "Inline Actions": "行内操作浮卡",
  "Show a floating notification card when background conversations need your input. Answer questions, approve commands, and grant permissions without leaving your current conversation. Share feedback at go/inline-actions-feedback.": "当后台对话需要您的输入时显示悬浮通知卡片。无需离开当前对话即可回答问题、批准命令和授予权限。",
  "Adds an Autonomous Mode switch to the modes dropdown below the input box. Turns sent with it on run non-interactively: the agent does not ask questions or request new permissions.": "在输入框下方的模式下拉菜单中添加自主模式开关。开启后以非交互方式运行：智能体不会提问或请求新权限。",
  "Let the agent access past conversations to inform its responses.": "允许智能体查阅过往对话历史以辅助回答。",
  "When enabled, the agent will be able to access past conversations to inform its responses.": "启用后，智能体将能够访问过往对话历史以辅助回答。",
  "Auto-Open Edited Files": "自动打开编辑过的文件",
  "Open files in the background if the agent creates or edits them": "当智能体创建或编辑文件时在后台自动打开",
  "Open files in the background if Agent creates or edits them": "当智能体创建或编辑文件时在后台自动打开",
  "Open Agent on Reload": "重载时打开智能体",
  "Open the agent panel on window reload": "在窗口重新加载时自动打开智能体面板",
  "Open Agent panel on window reload": "在窗口重新加载时自动打开智能体面板",
  "Permission Settings": "权限设置",
  "Permissions": "权限管理",
  "Permission Details": "权限详情",
  "Permission Preset": "权限预设",
  "File Permissions": "文件访问权限",
  "Commands the agent can run outside the sandbox in this workspace.": "智能体在此工作区内可在沙盒外部运行的命令。",
  "Commands the agent can run outside the sandbox.": "智能体可在沙盒外部运行的命令。",
  "Configure allowed terminal commands.": "配置允许执行的终端命令。",
  "Configure allowed and denied paths for file reads and writes.": "配置允许和禁止读取与写入的文件路径。",
  "Paths the agent can read.": "智能体可读取的文件路径。",
  "Paths the agent can modify.": "智能体可修改的文件路径。",
  "Paths the agent can read inside this workspace.": "智能体在此工作区内可读取的文件路径。",
  "Paths the agent can modify inside this workspace.": "智能体在此工作区内可修改的文件路径。",
  "File Access Rules": "文件访问规则",
  "File Reads": "文件读取",
  "File Writes": "文件写入",
  "Read Files": "读取文件",
  "Write Files": "写入文件",
  "Read URLs": "读取网页 URL",
  "Execute URLs": "执行网页 URL",
  "All tools (*)": "所有工具 (*)",
  "Browser tools (browser_.*)": "浏览器工具 (browser_.*)",
  "External tools the agent can call via Model Context Protocol.": "智能体可通过模型上下文协议 (MCP) 调用的外部工具。",
  "Agent security mode": "智能体安全模式",
  "Agent will always ask to review in strict mode.": "在严格模式下，智能体将始终请求审查。",
  "Agent cannot modify files outside of the workspace in strict mode.": "在严格模式下，智能体不能修改工作区外部的文件。",
  "Strict Mode": "严格模式",
  "Enforce settings that prevent the agent from autonomously running targeted exploits and require human review for all agent actions. Visit antigravity.google/docs/strict-mode for details.": "强制启用安全策略，防止智能体自主执行潜在危险操作，并对所有操作强制要求人工审查。详情请参阅 antigravity.google/docs/strict-mode。",
  "Agent Non-Workspace File Access": "智能体跨工作区文件访问",
  "Allows the agent to access files outside of your current workspace.": "允许智能体访问当前工作区外部的文件。",
  "Allow the agent to automatically view and edit files outside the current workspace. Use with caution: this gives the agent access to additional potentially-relevant information, but also allows the agent to access credential files, secrets, and other files outside of the workspace that could be targeted in prompt injection attacks or other exploits by malicious actors.": "允许智能体自动查看和编辑当前工作区之外的文件。请谨慎使用：虽然这能为智能体提供更多相关信息，但也可能使其接触到凭据、密钥等敏感文件，存在提示词注入等安全风险。",
  "Outside of folders file access policy": "工作区文件夹外文件访问策略",
  "Configures how the agent tries to access files outside of its working folders.": "配置智能体访问工作文件夹外部文件的方式。",
  "Enable Terminal Sandbox": "启用终端沙盒",
  "Sandbox Allow Network": "沙盒允许网络连接",
  "When enabled, sandboxed commands are allowed to make network requests.": "启用后，沙盒中的命令将被允许发起网络请求。",
  "Restricts agent tools to a secure, isolated local sandbox.": "将智能体工具限制在安全隔离的本地沙盒中运行。",
  "Enable Sandbox Mode (Preview)": "启用沙盒模式 (预览)",
  "Command Setup Script": "命令初始化脚本",
  "Enable Shell Integration": "启用 Shell 集成",
  "Use the IDE's shell integration to detect and report terminal command execution. When disabled, the agent uses its own shell. Restart the application for this to take effect.": "使用 IDE 的 Shell 集成来检测并报告终端命令执行。禁用时，智能体将使用独立 Shell。需重启应用生效。",
  "When enabled, Agent will use IDE's shell integration to detect and report terminal command execution.": "启用后，智能体将使用 IDE 的 Shell 集成检测并报告终端命令执行。",
  "Terminal Command Auto Execution": "终端命令自动执行",
  "Allow List Terminal Commands": "终端命令允许白名单",
  "Deny List Terminal Commands": "终端命令拒绝黑名单",
  "Terminal commands the agent can execute in this workspace.": "智能体在此工作区中可执行的终端命令。",
  "Terminal commands the agent can execute.": "智能体可执行的终端命令。",
  "Controls whether terminal commands require your approval before running.": "控制终端命令在运行前是否需要您的批准。",
  "Modify permissions for file and terminal tools.": "修改文件与终端工具的使用权限。",
  "Agent never asks for review. This maximizes the autonomy of the Agent, but also has the highest risk of the Agent operating over unsafe or injected Artifact content.": "智能体从不请求审查。这最大化了智能体的自主性，但也有执行不安全内容的最高风险。",
  "The agent never asks for confirmation before executing terminal commands (except those in the Deny list). This provides the agent with the maximum ability to operate over long periods without intervention, but also has the highest risk of the agent executing an unsafe terminal command.": "智能体在执行终端命令前从不请求确认（拒绝列表中的命令除外）。这使智能体能够长时间自主运行，但也具有执行不安全命令的高风险。",
  "The agent always asks for confirmation before executing terminal commands (except those in the Allow list).": "智能体在执行终端命令前始终请求确认（允许列表中的命令除外）。",
  "Active environment: os=": "当前环境: 系统=",
  "Add": "添加",
  "Add MCP": "添加 MCP 服务",
  "Advanced Command Access": "高级命令访问权限",
  "Advanced File Access": "高级文件访问权限",
  "Advanced Web Access": "高级网页访问权限",
  "Agent Auto-Fix Lints": "智能体自动修复 Lint 代码检查错误",
  "Also includes": "同时包含",
  "Ask about your code or any topic, get clear answers.": "就您的代码或任何话题提问，获得清晰准确的解答。",
  "Auto (detected)": "自动 (已检测)",
  "Automatically reproduce bugs, trace causes, test fixes.": "自动复现问题 Bug、排查根本原因并测试修复方案。",
  "Automation": "自动化任务",
  "Best of N": "Best of N 多方案对比",
  "Binary": "可执行文件类型",
  "Build new features": "构建新功能",
  "Build with Google": "通过 Google 技术构建",
  "By using this app, you agree to its": "使用此应用程序即表示您同意其",
  "Choose the experience that fits how you work.": "选择最契合您工作流的操作体验。",
  "Command:": "命令：",
  "Configure GitHub access policies.": "配置 GitHub 访问策略。",
  "Configure editor-specific behaviors and shortcuts.": "配置编辑器特定的行为与快捷键。",
  "Configure external tools via Model Context Protocol.": "通过模型上下文协议 (MCP) 配置外部工具。",
  "Configure tab completion, suggestions, and navigation behavior.": "配置 Tab 代码补全、智能建议和导航行为。",
  "Configure workspace-specific permissions, resources, and customizations.": "配置工作区特定的权限、资源和自定义扩展。",
  "Conversation": "对话",
  "Current parameter: ": "当前参数：",
  "Custom Flags": "自定义特性开关 (Flags)",
  "Debug and fix": "调试与修复",
  "Delete Hook": "删除 Hook 钩子",
  "Developer-only tools. These settings are stored locally in this browser and do not affect other users.": "开发者专用工具。这些设置仅保存在本地当前浏览器中，不会影响其他用户。",
  "Draft documents, emails, and notes that sound like you.": "起草符合您风格与语气的技术文档、邮件或备忘录。",
  "Electron (Android Desktop)": "Electron (安卓桌面端)",
  "Electron (Desktop)": "Electron (桌面原生端)",
  "Electron (Gemini App)": "Electron (Gemini 应用)",
  "Email": "电子邮箱",
  "Enable Telemetry": "启用遥测数据收集",
  "Enter Google Cloud Project Details": "输入 Google Cloud 项目详情",
  "Enter URL pattern...": "输入 URL 匹配模式...",
  "Enter command (e.g., git, blaze)...": "输入终端命令 (例如 git, npm)...",
  "Enter file or directory path...": "输入文件或目录路径...",
  "Enter tool name or server...": "输入工具名称或服务标识...",
  "Enterprise": "企业版",
  "Error: ": "错误：",
  "Explain and Fix in Current Conversation": "在当前对话中解释并修复",
  "Extension": "编辑器扩展插件",
  "Extension (Cider)": "扩展插件 (Cider)",
  "Extension (Eclipse)": "扩展插件 (Eclipse)",
  "Extension (VS Code)": "扩展插件 (VS Code)",
  "Extension (Visual Studio)": "扩展插件 (Visual Studio)",
  "External": "外部公开用户",
  "Failed to parse settings. Fix and restart.": "解析配置文件失败，请修复后重启客户端。",
  "Feature Environment Override": "特性运行环境覆盖",
  "File Access": "文件访问权限",
  "Flags come from Mendel experiments and from the host app. Overrides are local to this browser and change how every feature gated on the flag resolves. Some features are only read at startup — reload the window if a change does not take effect.": "特性开关来自 Mendel 灰度实验和宿主应用。覆盖项仅作用于本地浏览器，可更改受门控控制的各个特性的表现。部分特性仅在启动时读取，若未生效请重新加载窗口。",
  "Follow the guide at": "参考操作指南：",
  "For Antigravity Business consumption options, see": "关于 AntiGravity 商业版额度使用方案，请参阅",
  "For a full list of available locations and deployment endpoints, please refer to the": "如需查看可用区域与部署端点的完整列表，请参考",
  "Get Anything Done with ": "借助 AI 高效搞定任何任务：",
  "GitHub": "GitHub",
  "Google (internal)": "Google (内部)",
  "Google Chrome": "Google Chrome",
  "Google Cloud Project ID": "Google Cloud 项目 ID",
  "Google3 chats will be regrouped into their workspaces in the sidebar.": "Google3 对话将在侧栏中按对应的工作区进行重新归类分组。",
  "Hand off a feature and come back to working code.": "下发功能需求给智能体，稍后直接收获已实现并经过验证的代码。",
  "Hook will only trigger if the tool name matches run_command or view_file.": "仅当工具名称匹配 run_command 或 view_file 时触发 Hook。",
  "Hook will only trigger if the tool name matches run_command.": "仅当工具名称匹配 run_command 时触发 Hook。",
  "Hook will only trigger if the tool name starts with browser_.": "仅当工具名称以 browser_ 开头时触发 Hook。",
  "Hook will trigger if any tool is executed.": "执行任何工具时均触发 Hook。",
  "Host Environment": "宿主环境",
  "Hub": "中心 Hub",
  "IDE (editor)": "IDE (代码编辑器)",
  "Installed MCP Servers": "已安装的 MCP 服务",
  "Keyboard shortcuts for quick navigation and control.": "用于快速导航与全局控制的键盘快捷键。",
  "Labs": "实验室",
  "Learn more.": "了解详情。",
  "Linux": "Linux",
  "Loading MCP servers...": "正在加载 MCP 服务器...",
  "Loading custom agents...": "正在加载自定义智能体...",
  "Loading licenses...": "正在加载许可协议...",
  "Loading plugins...": "正在加载插件列表...",
  "Local Permissions": "本地权限",
  "Local Windows environment": "本地 Windows 环境",
  "Location": "位置",
  "Location: ": "位置：",
  "MCP Configuration Error:": "MCP 配置错误：",
  "MCP Servers Disabled": "MCP 服务器已禁用",
  "MacOS": "macOS",
  "Manage your plan, credentials, and general preferences.": "管理您的方案套餐、身份凭证与通用偏好。",
  "Managed by Enterprise Gateway": "由企业网关托管",
  "Marketing Emails": "营销与产品资讯邮件",
  "Marketplace": "插件市场",
  "Marketplace Gallery URL": "插件市场服务地址 (Gallery URL)",
  "Marketplace Item URL": "插件市场详情地址 (Item URL)",
  "Navigation": "导航",
  "Next Pane Tab": "下一个分栏标签页",
  "No Custom Agents or Plugins": "暂无自定义智能体或插件",
  "No MCP servers installed": "未安装 MCP 服务器",
  "No Plugins Available": "暂无可用插件",
  "No matching flags": "未找到匹配的特性开关",
  "No matching project folders. Apply to use the custom URI.": "未找到匹配的项目文件夹。点击应用以使用自定义 URI。",
  "No plugins available.": "暂无可用插件。",
  "Not Signed In": "未登录",
  "Not referenced by any feature (": "未被任何特性引用 (",
  "Open File Search": "打开文件搜索",
  "Open MCP Config": "打开 MCP 配置",
  "Operating System": "操作系统",
  "Options": "选项",
  "Organization Allowed Domains (Read-Only)": "组织允许的域名 (只读)",
  "Other License": "其他软件许可",
  "Override feature environment": "覆盖特性运行环境",
  "Paste auth code": "在此粘贴授权码",
  "Path copied!": "路径已复制！",
  "Planning": "规划中",
  "Plugin Operation Error:": "插件操作错误：",
  "Plugin: ": "插件：",
  "Plugins are packaged collections of skills and MCPs to help the Agent": "插件是打包的技能与 MCP 集合，用于扩展智能体能力",
  "Plugins are packaged collections of skills and MCPs to help the Agent in ": "插件是打包的技能与 MCP 集合，用于扩展智能体在特定场景下的能力：",
  "Previous Pane Tab": "上一个分栏标签页",
  "Project 4K": "Project 4K 模式",
  "Project ID: ": "项目 ID：",
  "Recommended": "推荐",
  "Refresh MCP servers": "刷新 MCP 服务器",
  "Regroup Google3 Chats": "重组 Google3 对话",
  "Reopen Locally": "在本地重新打开",
  "Research anything": "研究任何知识与技术",
  "Run the app against a Linux environment. Connecting relaunches the app into the selected WSL distro.": "在 Linux 环境中运行此应用。连接后将重新启动应用并挂载至所选 WSL 发行版。",
  "Search flags": "搜索特性开关...",
  "Select one of the ": "选择以下选项之一：",
  "Select or enter a workspace URI": "选择或输入工作区 URI",
  "Select your license": "选择您的软件许可",
  "Selection Actions": "选区快捷操作",
  "Setup script failed.": "初始化脚本执行失败。",
  "Setup script ran successfully.": "初始化脚本执行成功。",
  "Sign in with a different account": "使用其他账号登录",
  "Simulate a different host (Electron, desktop or mobile Web, Extension, remote control, or installed PWA).": "模拟不同的宿主环境（Electron、桌面端/移动端 Web、扩展插件、远程控制或已安装的 PWA）。",
  "Simulate a different user cohort (Google, External, Enterprise).": "模拟不同的用户群体类型（Google 内部、外部公开用户、企业用户）。",
  "Simulate running on a different OS.": "模拟在不同的操作系统上运行。",
  "Terms of Service": "服务条款",
  "The app is currently connected to a WSL distro. Reopening locally relaunches it directly on Windows.": "应用当前已连接到 WSL 发行版。选择“在本地重新打开”将直接在 Windows 原生环境中重启应用。",
  "The breakdown below shows token usage from customizations like rules, skills, and MCP. If a budget is exceeded, large rules are demoted to path pointers and large customizations are excluded automatically.": "下方明细显示了规则、技能和 MCP 等扩展占用的 Token 用量。若超出限额，较长的规则将降级为路径指针，过大的扩展项将被自动排除。",
  "There are currently no Build with ": "目前暂无可用的 Build with ",
  "There are no customizations enabled.": "当前未启用任何自定义扩展。",
  "These MCP allowlist rules are enforced by your organization's administrator.": "这些 MCP 允许列表规则由组织管理员强制执行。",
  "These allowed domain rules are set by your organization's administrator and cannot be removed.": "这些域名允许规则由您的组织管理员设置，无法移除。",
  "This Google Cloud project is not supported. Input a different project, or sign in with another account.": "不支持此 Google Cloud 项目。请输入其他项目或使用其他账号登录。",
  "This migration may mess up your settings, chats, and sidebar.": "此迁移可能会影响您的偏好设置、历史对话以及侧栏布局。",
  "This project was created for": "此项目创建用于：",
  "This sign-in option is only available to invited teams.": "此登录选项目前仅对受邀团队开放。",
  "Timeout:": "超时时间：",
  "To modify editor settings, open Settings within the editor window.": "如需修改编辑器设置，请在编辑器窗口内打开“设置”。",
  "Try out early-stage features before they ship. These may be changed or removed at any time. These features are experimental, and we make no guarantees about performance or functionality.": "在早期功能公开发布前抢先体验。这些功能可能随时更改或移除，属于实验性质，官方不作功能可用性承诺。",
  "Turn on a flag you don't have": "开启未分配的特性开关",
  "UI Actions": "界面快捷操作",
  "URLs the agent can actuate on in this workspace.": "智能体在此工作区内可执行自动化交互的 URL。",
  "URLs the agent can actuate on using the browser.": "智能体可通过浏览器执行自动化交互的 URL。",
  "URLs the agent can read or open in the browser.": "智能体可通过浏览器读取或打开的 URL。",
  "URLs the agent can read or open in this workspace.": "智能体在此工作区内可读取或打开的 URL。",
  "Use theme to be imported with settings": "使用随设置导入的主题",
  "User Type": "用户群体类型",
  "Validate": "验证",
  "Validating setup script…": "正在验证初始化脚本…",
  "We'll tailor the experience to you.": "我们将为您定制个性化的使用体验。",
  "Web (desktop)": "Web (桌面网页端)",
  "Web (desktop, PWA)": "Web (桌面 PWA 应用)",
  "Web (desktop, remote control)": "Web (桌面远程控制)",
  "Web (desktop, remote control, PWA)": "Web (桌面远程控制 PWA)",
  "Web (mobile)": "Web (移动网页端)",
  "Web (mobile, PWA)": "Web (移动端 PWA 应用)",
  "Web (mobile, remote control)": "Web (移动端远程控制)",
  "Web (mobile, remote control, PWA)": "Web (移动端远程控制 PWA)",
  "What best describes you?": "哪项最符合您的使用需求？",
  "When enabled, 'Explain and Fix' actions will continue in the current conversation instead of starting a new one.": "启用后，“解释并修复”操作将在当前对话中继续，而不是启动新对话。",
  "When enabled, Agent is given awareness of lint errors created by its edits and may fix them without explicit user prompting.": "启用后，智能体将感知其修改产生的 Lint 错误并尝试自动修复。",
  "When enabled, the values below replace the auto-detected OS, host, binary, and user type used for feature gating.": "启用后，下方设置将覆盖自动检测到的操作系统、宿主环境、可执行文件及用户类型等特性门控判定参数。",
  "Windows": "Windows",
  "Windows Subsystem for Linux": "适用于 Linux 的 Windows 子系统 (WSL)",
  "Workspace Command Access": "工作区命令权限",
  "Workspace Creation": "工作区创建",
  "Workspace File Access": "工作区文件权限",
  "Workspace URI Switcher": "工作区 URI 切换器",
  "Workspace URI query parameter": "工作区 URI 查询参数",
  "Workspace Web Access": "工作区网络权限",
  "Write and edit docs": "编写与编辑技术文档",
  "You don't have any custom agents or plugins configured. Create agent scripts in the agents/ directory or add plugins to the plugins/ directory inside your Gemini configuration folder.": "您尚未配置任何自定义智能体或插件。可在 Gemini 配置目录下的 agents/ 目录创建智能体脚本，或在 plugins/ 目录添加插件。",
  "Your administrator has disabled MCP servers for this workspace.": "您的管理员已在此工作区中禁用了 MCP 服务器。",
  "Your agent’s ability to execute commands is also controlled by enterprise security policies.": "您的智能体执行命令的权限同时受企业安全策略管控。",
  "documentation": "官方文档",
  "official documentation": "官方文档",
  "plan": "规划 (plan)",
  "run_command": "运行命令 (run_command)",
  "run_command or view_file": "运行命令或查看文件",
  "the ": " ",
  "Flags come from Mendel experiments and from the host app. Overrides are local to this browser and change how every feature gated on the flag resolves. Some features are only read at startup \\u2014 reload the window if a change does not take effect.": "特性开关来自 Mendel 灰度实验和宿主应用。覆盖项仅作用于本地浏览器，可更改受门控控制的各个特性的表现。部分特性仅在启动时读取，若未生效请重新加载窗口。",
  "Validating setup script\\u2026": "正在验证初始化脚本…",
  "Your agent\\u2019s ability to execute commands is also controlled by enterprise security policies.": "您的智能体执行命令的权限同时受企业安全策略管控。",
  "go/jetski-projects-migration": "项目迁移指南 (go/jetski-projects-migration)",
  "e.g., curl": "例如: curl",
  "e.g., npm test": "例如: npm test",
  "my-project-id": "我的项目ID",
  "File": "文件",
  "View": "视图",
  "Window": "窗口",
  "Help": "帮助",
  "Antigravity": "AntiGravity",
  "Check for Updates": "检查更新...",
  "Create Project": "创建项目",
  "Create Cloud Project": "创建云端项目",
  "Command Palette": "命令面板",
  "Toggle Fullscreen": "切换全屏",
  "Zoom In": "放大",
  "Zoom Out": "缩小",
  "Reset Zoom": "重置缩放",
  "Minimize": "最小化",
  "Maximize": "最大化",
  "Configure the browser subagent. It requires": "配置浏览器子智能体。此功能需要系统中已安装 ",
  "to be installed.": " 浏览器。",
  "The browser subagent can be invoked by typing /browser in the conversation input box.": "在对话输入框中键入 /browser 即可调用浏览器子智能体。",
  "The browser subagent has been disabled by your administrator. Contact your administrator to enable browser use.": "您的管理员已禁用浏览器子智能体。请联系管理员以启用浏览器功能。",
  "not visible in the agent's sandbox and is shared across all your projects.": "在智能体沙盒中不可见，并在所有项目中共享。",
  "Create a token": "创建 Token 凭据",
  "Discover and install more skills at": "💡 在以下网址发现并安装更多技能：",
  ". Learn more about skills at": "；了解关于技能的更多详情：",
  "Show more results on Agent Marketplace": "在 Agent Marketplace 市场查看更多结果",
  "Click to Open Docs": "点击打开官方文档",
  "Click to open docs": "点击打开官方文档",
  "Open Drive bundle": "打开 Drive 资源包",
  "Download PDF": "下载 PDF 文档"
};

  // 2. Build Lowercase Lookup Map for Case-Insensitive Fallback
  const DICT_LOWER = Object.create(null);
  for (const key in DICT) {
    if (Object.prototype.hasOwnProperty.call(DICT, key)) {
      DICT_LOWER[key.toLowerCase()] = DICT[key];
    }
  }

  // 3. Helper to format relative and countdown time strings
  function translateTimePhrases(str) {
    if (!str || typeof str !== 'string') return str;
    return str
      .replace(/([0-9]+)\s*days?,?\s*([0-9]+)\s*hours?/gi, '$1 天 $2 小时')
      .replace(/([0-9]+)\s*hours?,?\s*([0-9]+)\s*minutes?/gi, '$1 小时 $2 分钟')
      .replace(/([0-9]+)\s*minutes?,?\s*([0-9]+)\s*seconds?/gi, '$1 分钟 $2 秒')
      .replace(/([0-9]+)\s*days?/gi, '$1 天')
      .replace(/([0-9]+)\s*hours?/gi, '$1 小时')
      .replace(/([0-9]+)\s*minutes?/gi, '$1 分钟')
      .replace(/([0-9]+)\s*seconds?/gi, '$1 秒');
  }

  // Helper for short duration strings like "6d 23h", "5d 3h", "3h 18m", "<1m"
  function translateShortDuration(str) {
    if (!str || typeof str !== 'string') return str;
    const trimmed = str.trim();
    if (trimmed === '<1m') return '1 分钟内';
    return trimmed
      .replace(/([0-9]+)\s*d\s*([0-9]+)\s*h/gi, '$1 天 $2 小时')
      .replace(/([0-9]+)\s*h\s*([0-9]+)\s*m/gi, '$1 小时 $2 分钟')
      .replace(/([0-9]+)\s*m\s*([0-9]+)\s*s/gi, '$1 分钟 $2 秒')
      .replace(/([0-9]+)\s*d/gi, '$1 天')
      .replace(/([0-9]+)\s*h/gi, '$1 小时')
      .replace(/([0-9]+)\s*m/gi, '$1 分钟')
      .replace(/([0-9]+)\s*s/gi, '$1 秒');
  }

  // 4. High-Precision Regular Expression Patterns
  const PATTERNS = [
    // Dynamic Model Quota Limits (e.g. "Gemini 4 Argon Weekly Limit", "Claude Sonnet 5.5 Weekly Limit")
    {
      regex: /^(.+?)\s+Weekly Limit(?:\s+Remaining)?$/i,
      replacer: function(_, model) {
        return model + ' 每周额度';
      }
    },
    {
      regex: /^(.+?)\s+(?:5-Hour|Five Hour)\s+Limit(?:\s+Remaining)?$/i,
      replacer: function(_, model) {
        return model + ' 5小时滚动额度';
      }
    },
    {
      regex: /^(.+?)\s+Daily Limit(?:\s+Remaining)?$/i,
      replacer: function(_, model) {
        return model + ' 每日额度';
      }
    },
    {
      regex: /^(.+?)\s+Monthly Limit(?:\s+Remaining)?$/i,
      replacer: function(_, model) {
        return model + ' 每月额度';
      }
    },

    // Reset countdowns in quota badge (e.g. "Resets in 6d 23h", "Resets in <1m")
    {
      regex: /^Resets?\s+in\s*(.+)$/i,
      replacer: function(_, dur) {
        return '将在 ' + translateShortDuration(dur) + ' 后重置';
      }
    },
    {
      regex: /^Refreshes?\s+in\s*(.+)$/i,
      replacer: function(_, dur) {
        return '将在 ' + translateShortDuration(dur) + ' 后刷新';
      }
    },

    // Shared with
    {
      regex: /^Shared with:\s*(.+)$/i,
      replacer: function(_, target) {
        return '共享对象：' + target;
      }
    },

    // Model removal notices
    {
      regex: /^(.+?)\s+will be removed from Antigravity on\s*(.+?)\.?$/i,
      replacer: function(_, model, dateStr) {
        const cnDate = dateStr
          .replace(/January\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 1 月 $1 日')
          .replace(/February\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 2 月 $1 日')
          .replace(/March\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 3 月 $1 日')
          .replace(/April\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 4 月 $1 日')
          .replace(/May\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 5 月 $1 日')
          .replace(/June\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 6 月 $1 日')
          .replace(/July\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 7 月 $1 日')
          .replace(/August\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 8 月 $1 日')
          .replace(/September\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 9 月 $1 日')
          .replace(/October\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 10 月 $1 日')
          .replace(/November\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 11 月 $1 日')
          .replace(/December\s+([0-9]+),?\s*([0-9]+)/i, '$2 年 12 月 $1 日');
        return model + ' 将于 ' + cnDate + ' 从 AntiGravity 中下线。';
      }
    },

    // Model selection trigger
    {
      regex: /^Select model, current:\s*(.+)$/i,
      replacer: function(_, cur) {
        return '选择模型，当前：' + cur;
      }
    },
    {
      regex: /^Select model with\s*(.+)$/i,
      replacer: function(_, key) {
        return '使用快捷键 ' + key + ' 选择模型';
      }
    },

    // Dynamic Quota Strings
    {
      regex: /^You have used some of your weekly limit, it will fully refresh in\s*(.+?)\.?$/i,
      replacer: function(_, rest) {
        return '您已使用部分每周额度，将在 ' + translateTimePhrases(rest.replace(/\.$/, '')) + ' 后完全刷新。';
      }
    },
    {
      regex: /^You have used some of your 5-hour limit, it will fully refresh in\s*(.+?)\.?$/i,
      replacer: function(_, rest) {
        return '您已使用部分 5 小时滚动额度，将在 ' + translateTimePhrases(rest.replace(/\.$/, '')) + ' 后完全刷新。';
      }
    },
    {
      regex: /^will fully refresh in\s*(.+?)\.?$/i,
      replacer: function(_, rest) {
        return '将在 ' + translateTimePhrases(rest.replace(/\.$/, '')) + ' 后完全刷新。';
      }
    },
    {
      regex: /^Manage\s+(.+)\s+app settings\.?$/i,
      replacer: function(_, appName) {
        return '管理 ' + appName + ' 客户端应用设置。';
      }
    },
    {
      regex: /^Your Plan:\s*(.+)$/i,
      replacer: function(_, planName) {
        return '当前套餐：' + planName;
      }
    },
    {
      regex: /^Modified in\s*(.+)$/i,
      replacer: function(_, projName) {
        return '已在 ' + projName + ' 中修改';
      }
    },
    {
      regex: /^Learn more about\s*(.+)$/i,
      replacer: function(_, topic) {
        return '了解更多关于 ' + topic + ' 的信息';
      }
    },
    {
      regex: /^Version\s+([0-9.]+)$/i,
      replace: "版本 $1"
    },

    // File and Task Counts
    { regex: /^([0-9]+)\s+files?\s+changed$/i, replace: "$1 个文件已修改" },
    { regex: /^([0-9]+)\s+additions?$/i, replace: "$1 处新增" },
    { regex: /^([0-9]+)\s+deletions?$/i, replace: "$1 处删除" },
    { regex: /^([0-9]+)\s+changes?$/i, replace: "$1 处更改" },
    { regex: /^([0-9]+)\s+tasks?$/i, replace: "$1 个任务" },
    { regex: /^([0-9]+)\s+artifacts?$/i, replace: "$1 个产物" },
    { regex: /^([0-9]+)\s+results?$/i, replace: "$1 条结果" },

    // Relative times
    { regex: /^([0-9]+)s\s+ago$/i, replace: "$1 秒前" },
    { regex: /^([0-9]+)m\s+ago$/i, replace: "$1 分钟前" },
    { regex: /^([0-9]+)h\s+ago$/i, replace: "$1 小时前" },
    { regex: /^([0-9]+)d\s+ago$/i, replace: "$1 天前" },
    { regex: /^([0-9]+)w\s+ago$/i, replace: "$1 周前" },
    { regex: /^([0-9]+)mo\s+ago$/i, replace: "$1 个月前" },
    { regex: /^([0-9]+)y\s+ago$/i, replace: "$1 年前" },

    // Short list dates
    { regex: /^([0-9]+)m$/i, replace: "$1分钟" },
    { regex: /^([0-9]+)h$/i, replace: "$1小时" },
    { regex: /^([0-9]+)d$/i, replace: "$1天" },

    // Build stamps
    { regex: /^Built on:\s*(.+)$/i, replace: "构建时间: $1" },
    { regex: /^Built at CL:\s*(.+)$/i, replace: "构建版本号 (CL): $1" }
  ];

  // 5. Skip code blocks and rich text editors to protect developer code
  function shouldSkip(element) {
    if (!element || element.nodeType !== 1) return false;
    const tagName = element.tagName ? element.tagName.toLowerCase() : '';
    if (tagName === 'pre' || tagName === 'code' || tagName === 'script' || tagName === 'style') {
      return true;
    }
    if (element.closest) {
      if (element.closest('.react-markdown, .markdownChunk, .markdown, .monaco-editor, pre, code, [contenteditable="true"], .agy-token-rate-container, #agy-metrics-popover')) {
        return true;
      }
    }
    return false;
  }

  // 6. Intelligent Translation Core
  function translateString(str) {
    if (!str || typeof str !== 'string') return null;
    const trimmed = str.trim();
    if (!trimmed) return null;

    // A. Direct exact dictionary match
    if (DICT[trimmed]) {
      return str.replace(trimmed, DICT[trimmed]);
    }

    // B. Case-insensitive exact match
    const lower = trimmed.toLowerCase();
    if (DICT_LOWER[lower]) {
      return str.replace(trimmed, DICT_LOWER[lower]);
    }

    // C. Prefix stripped matching (+, -, •, ·, *)
    const prefixMatch = /^([+\-•·*]\s*)(.+)$/.exec(trimmed);
    if (prefixMatch) {
      const sym = prefixMatch[1];
      const rest = prefixMatch[2].trim();
      if (DICT[rest]) {
        return str.replace(trimmed, sym + DICT[rest]);
      }
      if (DICT_LOWER[rest.toLowerCase()]) {
        return str.replace(trimmed, sym + DICT_LOWER[rest.toLowerCase()]);
      }
    }

    // D. Trailing counter stripped matching (e.g. "Tool Permissions 23", "Network Access Rules (6)")
    const counterMatch = /^(.+?)(\s*\([0-9]+\)|\s+[0-9]+)$/.exec(trimmed);
    if (counterMatch) {
      const base = counterMatch[1].trim();
      const countPart = counterMatch[2];
      if (DICT[base]) {
        return str.replace(trimmed, DICT[base] + countPart);
      }
      if (DICT_LOWER[base.toLowerCase()]) {
        return str.replace(trimmed, DICT_LOWER[base.toLowerCase()] + countPart);
      }
    }

    // E. Dynamic patterns
    for (let i = 0; i < PATTERNS.length; i++) {
      const p = PATTERNS[i];
      if (p.regex.test(trimmed)) {
        if (p.replacer) {
          const res = trimmed.replace(p.regex, p.replacer);
          return str.replace(trimmed, res);
        } else if (p.replace) {
          const res = trimmed.replace(p.regex, p.replace);
          return str.replace(trimmed, res);
        }
      }
    }

    // F. Fallback for strings containing "Modified in" or "Learn more about"
    if (trimmed.startsWith("Modified in ")) {
      return str.replace("Modified in ", "修改于项目：");
    }
    if (trimmed.startsWith("Learn more about ")) {
      return str.replace("Learn more about ", "了解更多关于 ");
    }
    if (trimmed.startsWith("Your Plan: ")) {
      return str.replace("Your Plan: ", "当前套餐：");
    }
    if (trimmed.startsWith("Resets in ")) {
      const dur = trimmed.slice("Resets in ".length);
      return str.replace(trimmed, '将在 ' + translateShortDuration(dur) + ' 后重置');
    }
    if (trimmed.startsWith("Shared with: ")) {
      return str.replace("Shared with: ", "共享对象：");
    }
    if (trimmed.endsWith(" Weekly Limit")) {
      const base = trimmed.slice(0, -" Weekly Limit".length);
      return str.replace(trimmed, base + " 每周额度");
    }
    if (trimmed.endsWith(" Weekly Limit Remaining")) {
      const base = trimmed.slice(0, -" Weekly Limit Remaining".length);
      return str.replace(trimmed, base + " 每周剩余额度");
    }

    return null;
  }

  // 7. Translate DOM Node
  function translateNode(node) {
    if (!node) return;

    // Text node
    if (node.nodeType === 3) {
      if (node.parentElement && shouldSkip(node.parentElement)) {
        return;
      }
      const text = node.nodeValue;
      if (text && text.trim().length > 0) {
        const trans = translateString(text);
        if (trans && trans !== text) {
          node.nodeValue = trans;
        }
      }
      return;
    }

    // Element node
    if (node.nodeType === 1) {
      if (shouldSkip(node)) {
        return;
      }

      // Check placeholder, title, aria-label
      const placeholder = node.getAttribute('placeholder');
      if (placeholder) {
        const trans = translateString(placeholder);
        if (trans && trans !== placeholder) node.setAttribute('placeholder', trans);
      }

      const title = node.getAttribute('title');
      if (title) {
        const trans = translateString(title);
        if (trans && trans !== title) node.setAttribute('title', trans);
      }

      const ariaLabel = node.getAttribute('aria-label');
      if (ariaLabel) {
        const trans = translateString(ariaLabel);
        if (trans && trans !== ariaLabel) node.setAttribute('aria-label', trans);
      }

      // Recursively translate children
      let child = node.firstChild;
      while (child) {
        translateNode(child);
        child = child.nextSibling;
      }
    }
  }

  // 8. High-Performance MutationObserver
  let isTranslating = false;
  const observer = new MutationObserver((mutations) => {
    if (isTranslating) return;
    isTranslating = true;

    try {
      for (let i = 0; i < mutations.length; i++) {
        const mut = mutations[i];
        if (mut.type === 'childList') {
          for (let j = 0; j < mut.addedNodes.length; j++) {
            translateNode(mut.addedNodes[j]);
          }
        } else if (mut.type === 'characterData') {
          translateNode(mut.target);
        } else if (mut.type === 'attributes') {
          if (mut.target.nodeType === 1 && !shouldSkip(mut.target)) {
            const attrName = mut.attributeName;
            if (attrName === 'placeholder' || attrName === 'title' || attrName === 'aria-label') {
              const val = mut.target.getAttribute(attrName);
              if (val) {
                const trans = translateString(val);
                if (trans && trans !== val) mut.target.setAttribute(attrName, trans);
              }
            }
          }
        }
      }
    } catch (e) {
      // Fail-safe protection
    } finally {
      isTranslating = false;
    }
  });

  // 9. Initial Scan & Observer Activation
  function init() {
    try {
      if (document.body) {
        translateNode(document.body);
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
          attributes: true,
          attributeFilter: ['placeholder', 'title', 'aria-label']
        });
      }
      console.log('[AntiGravity zh-CN] Complete localization engine active. Entries: ' + Object.keys(DICT).length);
    } catch (err) {
      console.error('[AntiGravity zh-CN] Init error:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
