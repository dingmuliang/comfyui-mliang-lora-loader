<p align="center">
  <img src="https://img.shields.io/badge/ComfyUI-Custom%20Node-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20Linux-lightgrey?style=for-the-badge" />
</p>

<p align="center">
  <button onclick="switchLang('en')" style="padding:4px 12px;background:#333;color:#fff;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:12px;margin:2px">English</button>
  <button onclick="switchLang('zh')" style="padding:4px 12px;background:#333;color:#fff;border:1px solid #555;border-radius:3px;cursor:pointer;font-size:12px;margin:2px">中文</button>
</p>

<style>
.zh, .en { display: none; }
.zh.active, .en.active { display: block; }
.zh.inline, .en.inline { display: none; }
.zh.inline.active, .en.inline.active { display: inline; }
</style>

<script>
function switchLang(lang) {
  document.querySelectorAll('.zh').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.en').forEach(e => e.classList.remove('active'));
  document.querySelectorAll('.' + lang).forEach(e => e.classList.add('active'));
  localStorage.setItem('lang', lang);
}
(function() {
  var lang = localStorage.getItem('lang') || 'en';
  switchLang(lang);
})();
</script>

<!-- ========== ENGLISH ========== -->
<div class="en active">

<h1 align="center">🎨 MLiang LoRA Loader</h1>
<p align="center"><b>A professional ComfyUI custom node — folder-tree LoRA browser with multi-slot loading and instant preview.</b></p>

---

## 📸 Screenshots

| Node UI | Tree Browser | Preview | Workflow |
|---------|-------------|---------|----------|
| <img src="assets/screenshot1.png" width="180"> | <img src="assets/screenshot2.png" width="180"> | <img src="assets/screenshot3.png" width="180"> | <img src="assets/screenshot4.png" width="180"> |

---

## ✨ Features

- **🗂️ Folder-tree Browsing** — Navigate your LoRA collection by real folder hierarchy, expand/collapse any level
- **🔍 Real-time Search** — Type to instantly filter, auto-expand matching branches
- **⌨️ Keyboard Navigation** — `↑↓` to move highlight, `Enter` to select, `Escape` to close
- **🔗 Multi-slot Loading** — Add unlimited LoRA slots, applied sequentially in order
- **🎛️ Strength Control** — Text input with `▲▼` arrow fine-tuning per slot
- **🖼️ Hover Preview** — Mouse over any LoRA file to see preview image instantly
- **📋 Right-click Menu** — Show Info / Toggle / Move Up/Down / Remove
- **🔄 Toggle All** — One-click enable/disable all LoRAs
- **💾 Workflow Save/Restore** — Full serialization support

---

## 🚀 Quick Start

### ① Installation

**Method A — ComfyUI Manager** (recommended)
> Search `MLiang LoRA Loader` in ComfyUI Manager → Install → Restart ComfyUI

**Method B — Git Clone**
```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/dingmuliang/comfyui-mliang-lora-loader.git
# Restart ComfyUI
```

**Method C — Download ZIP**
> Download ZIP from GitHub → Extract to `ComfyUI/custom_nodes/` → Restart ComfyUI

### ② Add the Node

1. Search **`MLiang LoRA Loader`** in the node list
2. Double-click or drag to canvas

### ③ Connect

```
[Load Checkpoint] → MODEL → [MLiang LoRA Loader] → MODEL → [KSampler]
                   → CLIP  →                        → CLIP  →
```

### ④ Select LoRAs

| Step | Action |
|------|--------|
| 1 | Click the **file button** (next to `Choose LoRA...` placeholder) |
| 2 | A tree panel opens showing your LoRA folder structure |
| 3 | Click folders to expand/contract, click files to select |
| 4 | Or type in the search box to filter by keyword |
| 5 | Press `Enter` or click to confirm selection |

### ⑤ Adjust & Add

- Change **Strength** by typing a number or clicking `▲▼` arrows
- Click **`+ Add LoRA`** to add more slots
- Click **Toggle All** to enable/disable all at once
- **Right-click** any LoRA row for context menu

---

## 📁 Project Structure

```
comfyui-mliang-lora-loader/
├── __init__.py              ← Python backend (LoRA scanning + loading)
├── js/
│   ├── lora_browser.js      ← Frontend DOM widget (full UI logic)
│   └── tree_data.js         ← Auto-generated folder tree (on startup)
├── assets/                  ← Screenshots & QR codes
├── .github/workflows/       ← CI/CD (auto-publish on tag)
├── README.md
├── LICENSE
├── pyproject.toml
└── requirements.txt
```

---

## ⚠️ Known Limitations

| Limitation | Workaround |
|------------|------------|
| New LoRAs require ComfyUI restart | Close and reopen ComfyUI |
| Preview needs same-name PNG/JPG | Rename preview to match LoRA file |
| Single strength for model+clip | Future update planned |

---

## 🙏 Credits

This project was inspired by and references:

- [rgthree-comfy](https://github.com/rgthree/rgthree-comfy) — UI design inspiration (Power LoRA Loader)
- [ComfyUI-Lora-Manager](https://github.com/willmiao/ComfyUI-Lora-Manager) — `addDOMWidget` architecture reference
- [ComfyUI-Custom-Scripts](https://github.com/pythongosssss/ComfyUI-Custom-Scripts) — Extension patterns reference

---

## 🤝 Community

<table>
<tr>
<td align="center"><b>💬 QQ Group</b><br><img src="assets/qq-group.jpg" width="120"><br><code>1084104075</code></td>
<td align="center"><b>☕ Support</b><br><img src="assets/wechat-pay.png" width="120"><br>WeChat Pay</td>
</tr>
</table>

---

## 📄 License

MIT © [dingmuliang](https://github.com/dingmuliang)

</div>

<!-- ========== 中文 ========== -->
<div class="zh">

<h1 align="center">🎨 MLiang LoRA 加载器</h1>
<p align="center"><b>专业的 ComfyUI 自定义节点 — 文件夹树形 LoRA 浏览器，支持多槽位加载和即时预览。</b></p>

---

## 📸 截图展示

| 节点界面 | 树形浏览器 | 预览图 | 工作流 |
|---------|-----------|------|--------|
| <img src="assets/screenshot1.png" width="180"> | <img src="assets/screenshot2.png" width="180"> | <img src="assets/screenshot3.png" width="180"> | <img src="assets/screenshot4.png" width="180"> |

---

## ✨ 功能特点

- **🗂️ 文件夹树形浏览** — 按真实文件夹层级浏览 LoRA 收藏，任意层级展开/折叠
- **🔍 实时搜索过滤** — 打字即时过滤，自动展开匹配分支
- **⌨️ 键盘导航** — `↑↓` 移动高亮，`Enter` 确认选择，`Escape` 关闭
- **🔗 多槽位加载** — 不限数量添加 LoRA 槽位，按顺序依次应用
- **🎛️ 强度调节** — 文本输入 + `▲▼` 箭头逐槽微调
- **🖼️ 悬停预览** — 鼠标悬停 LoRA 文件即时显示预览图
- **📋 右键菜单** — 查看信息 / 开关 / 上移下移 / 删除
- **🔄 一键全开关** — Toggle All 控制所有 LoRA
- **💾 工作流保存** — 完整序列化支持，保存加载不丢配置

---

## 🚀 快速上手

### ① 安装

**方法A — ComfyUI Manager**（推荐）
> 在 ComfyUI Manager 搜索 `MLiang LoRA Loader` → 安装 → 重启 ComfyUI

**方法B — Git 克隆**
```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/dingmuliang/comfyui-mliang-lora-loader.git
# 重启 ComfyUI
```

**方法C — 下载 ZIP**
> GitHub 下载 ZIP → 解压到 `ComfyUI/custom_nodes/` → 重启 ComfyUI

### ② 添加节点

1. 搜索 **`MLiang LoRA Loader`**
2. 双击或拖入画布

### ③ 连线

```
[加载检查点] → MODEL → [MLiang LoRA 加载器] → MODEL → [KSampler]
              → CLIP  →                      → CLIP  →
```

### ④ 选择 LoRA

| 步骤 | 操作 |
|------|------|
| 1 | 点击 **文件按钮**（"选择 LoRA..." 占位文字旁边） |
| 2 | 弹出树形面板，显示你的 LoRA 文件夹结构 |
| 3 | 点击文件夹展开/折叠，点击文件选中 |
| 4 | 或在搜索框输入关键字过滤 |
| 5 | 按 `Enter` 或点击确认选择 |

### ⑤ 调节与添加

- 修改 **Strength** 值（直接输入或点 `▲▼` 箭头）
- 点击 **`+ Add LoRA`** 添加更多槽位
- 点击 **Toggle All** 一键开关全部
- **右键** 任意 LoRA 行弹出菜单

---

## 📁 项目结构

```
comfyui-mliang-lora-loader/
├── __init__.py              ← Python 后端（LoRA扫描 + 加载）
├── js/
│   ├── lora_browser.js      ← 前端 DOM 组件（完整UI逻辑）
│   └── tree_data.js         ← 自动生成（启动时更新文件夹树）
├── assets/                  ← 截图 & 二维码
├── .github/workflows/       ← CI/CD（打tag自动发布）
├── README.md
├── LICENSE
├── pyproject.toml
└── requirements.txt
```

---

## ⚠️ 已知限制

| 限制 | 解决方法 |
|------|----------|
| 新增 LoRA 需重启 ComfyUI | 关闭再打开 ComfyUI |
| 预览图需同名 PNG/JPG | 将预览图重命名为与 LoRA 文件同名 |
| 当前 model/clip 共用强度值 | 后续更新计划支持分离 |

---

## 🙏 致谢

本项目灵感来源及参考：

- [rgthree-comfy](https://github.com/rgthree/rgthree-comfy) — UI 设计灵感（Power LoRA Loader）
- [ComfyUI-Lora-Manager](https://github.com/willmiao/ComfyUI-Lora-Manager) — addDOMWidget 架构参考
- [ComfyUI-Custom-Scripts](https://github.com/pythongosssss/ComfyUI-Custom-Scripts) — 扩展模式参考

---

## 🤝 社区交流

<table>
<tr>
<td align="center"><b>💬 QQ 交流群</b><br><img src="assets/qq-group.jpg" width="120"><br><code>1084104075</code></td>
<td align="center"><b>☕ 赞赏支持</b><br><img src="assets/wechat-pay.png" width="120"><br>微信收款码</td>
</tr>
</table>

---

## 📄 许可证

MIT © [dingmuliang](https://github.com/dingmuliang)

</div>
