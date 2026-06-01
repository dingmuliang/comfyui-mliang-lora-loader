# MLiang LoRA Loader

A ComfyUI custom node providing folder-tree browsing + multi-slot LoRA loading with preview images. UI design inspired by rgthree Power LoRA Loader.

## Screenshots

| Node UI | Tree Browser | Preview | Workflow |
|---------|-------------|---------|----------|
| ![screenshot1](assets/screenshot1.png) | ![screenshot2](assets/screenshot2.png) | ![screenshot3](assets/screenshot3.png) | ![screenshot4](assets/screenshot4.png) |

## Features

- **Folder-tree browsing** — browse LoRA files by folder hierarchy, expand/collapse until you find your target
- **Real-time search** — filter tree panel by keyword, auto-expand matching branches
- **Keyboard navigation** — ↑↓ arrows to move highlight, Enter to select, Escape to close
- **Multi-slot loading** — add multiple LoRAs, applied sequentially in order
- **Toggle All** — one-click enable/disable all LoRAs
- **Right-click menu** — Show Info / Toggle / Move Up/Down / Remove
- **Hover preview** — mouse over a LoRA file to see preview image
- **Native dark theme** — uses ComfyUI's native color scheme

## Installation

### Method 1: ComfyUI Manager (recommended)

Search for "MLiang LoRA Loader" in ComfyUI Manager and install.

### Method 2: Manual

```bash
cd ComfyUI/custom_nodes/
git clone https://github.com/dingmuliang/comfyui-mliang-lora-loader.git
```

**Restart ComfyUI** (not just refresh the web page).

## Usage

1. Search for **"MLiang LoRA Loader"** in the node list
2. Connect MODEL and CLIP inputs
3. Click the **folder button** to open the tree panel
4. Expand folders → click to select a LoRA file
5. Adjust Strength with text input or ▲▼ arrows
6. Click **"+ Add LoRA"** to add more slots
7. **Right-click** any LoRA row for context menu

## Project Structure

```
comfyui-mliang-lora-loader/
├── __init__.py          # Python backend: LoRA scanning + loading
├── js/
│   ├── tree_data.js     # Auto-generated: folder tree data (updated on ComfyUI start)
│   └── lora_browser.js  # Frontend: custom DOM Widget UI
├── assets/              # Screenshots
├── examples/            # Example workflows
├── .github/             # GitHub Actions workflow
├── README.md
├── LICENSE
├── pyproject.toml
├── requirements.txt
└── .gitignore
```

## Known Limitations

- Need to restart ComfyUI after adding new LoRAs to refresh tree data
- Preview images only work for PNG/JPG files sharing the same name as the LoRA file
- Currently uses a single Strength value for both model and clip

## Compatibility

- ComfyUI (versions with addDOMWidget API)
- All major ComfyUI distributions (including Qiuye integration package v1.7+)

## License

MIT License — see [LICENSE](LICENSE).
