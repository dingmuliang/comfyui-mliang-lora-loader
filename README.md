# ComfyUI LoRA Browser

一个 ComfyUI 自定义节点，提供文件夹树形浏览 + 多槽位 LoRA 加载功能，设计灵感来自 rgthree Power LoRA Loader。

## 功能

- **📂 文件夹树形浏览** — 在节点内按文件夹层级浏览 LoRA 文件，逐级展开直到选到目标
- **🔍 实时搜索过滤** — 树面板顶部搜索框，输入关键字即时过滤
- **⌨️ 键盘导航** — ↑↓ 箭头键移动高亮，Enter 确认选择，Escape 关闭
- **🔗 多槽位串联** — 支持添加多个 LoRA，按顺序依次应用
- **🔄 Toggle All** — 一键开关所有 LoRA
- **🖱️ 右键菜单** — Show Info / Toggle / Move Up/Down / Remove
- **🎨 原生风格** — 采用 ComfyUI 原生暗色配色，不自定义颜色

## 安装

### 方法一：ComfyUI Manager（推荐）

在 ComfyUI Manager 中搜索 "LoRA Browser" 安装。

### 方法二：手动安装

```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/<your-username>/comfyui-lora-browser.git
```

重启 ComfyUI（不是刷新网页！）。

## 使用

1. 在节点列表中搜索 **"LoRA Browser"**
2. 连接 MODEL 和 CLIP 输入端
3. 点击 **"📂 浏览"** 按钮打开文件夹树
4. 逐级展开文件夹 → 点击选中 LoRA 文件
5. 调节 Strength 值（点击数值输入或按 ▲▼ 微调）
6. 点击 **"+ Add LoRA"** 添加更多槽位
7. 右键点击任意 LoRA 行查看菜单

## 项目结构

```
comfyui-lora-browser/
├── __init__.py          # Python 后端：LoRA 扫描 + 加载
├── js/
│   ├── tree_data.js     # 自动生成：文件夹树数据（ComfyUI 启动时更新）
│   └── lora_browser.js  # 前端：自定义 DOM Widget UI
├── examples/            # 示例工作流
├── .github/             # GitHub Actions 工作流
├── README.md
├── LICENSE
├── pyproject.toml
├── requirements.txt
└── .gitignore
```

## 已知限制

- 添加新 LoRA 后需重启 ComfyUI 刷新树数据
- 预览图仅支持与 LoRA 文件同名的 PNG/JPG
- 目前 Strength 仅支持单值（model 和 clip 共用）

## 兼容性

- ComfyUI 秋叶整合包 v1.7+
- ComfyUI 原版（使用 addDOMWidget API 的版本）
- LiteGraph 标准节点系统

## License

MIT License — 详见 [LICENSE](LICENSE) 文件。
