"""
MLiang LoRA Loader - ComfyUI Custom Node
Folder-tree browsing + multi-slot LoRA loading + preview

Install: place the entire folder into ComfyUI/custom_nodes/
Restart ComfyUI (not just refresh the web page)
"""
import os
import json
import hashlib
import folder_paths
import comfy.sd
import comfy.utils
from aiohttp import web

# ==================== 预览图路由 ====================

_preview_cache = {}
_routes_registered = False

def _register_routes():
    global _routes_registered
    if _routes_registered:
        return
    _routes_registered = True

    from server import PromptServer
    srv = PromptServer.instance

    @srv.routes.get("/mliang-lora/preview")
    async def get_preview(request):
        h = request.query.get("h", "")
        if not h or h not in _preview_cache:
            return web.Response(status=404)
        fpath = _preview_cache[h]
        if not os.path.isfile(fpath):
            return web.Response(status=404)
        return web.FileResponse(fpath)


def _build_tree():
    """扫描所有 loras 目录，构建文件夹树 + 预览图映射"""
    tree = {}
    previews = {}
    lora_dirs = folder_paths.get_folder_paths("loras")

    for lora_dir in lora_dirs:
        if not os.path.isdir(lora_dir):
            continue
        for root, dirs, files in os.walk(lora_dir):
            rel = os.path.relpath(root, lora_dir)
            if rel == ".":
                rel = ""

            lora_files = sorted([
                f for f in files
                if f.endswith(('.safetensors', '.ckpt', '.pt'))
                and not f.endswith('.safetensors.index.json')
            ])
            if not lora_files and not dirs:
                continue

            parts = rel.split(os.sep) if rel else []
            current = tree
            for part in parts:
                if part not in current:
                    current[part] = {}
                current = current[part]

            if lora_files:
                current["__files__"] = lora_files

            for lf in lora_files:
                base = os.path.splitext(lf)[0]
                for ext in ('.png', '.jpg', '.jpeg', '.webp'):
                    prev = os.path.join(root, base + ext)
                    if os.path.isfile(prev):
                        key = (rel.replace("\\", "/") + "/" + lf) if rel else lf
                        previews[key] = prev
                        break

    return tree, previews


def _write_tree_cache():
    """将树数据写入 js/tree_data.js，预览图通过 API 路由提供"""
    tree, previews = _build_tree()
    js_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "js")
    os.makedirs(js_dir, exist_ok=True)

    # 预览图 → hash 映射（避免泄露本地路径）
    hash_previews = {}
    for key, fpath in previews.items():
        h = hashlib.md5(fpath.encode()).hexdigest()[:12]
        _preview_cache[h] = fpath
        hash_previews[key] = h

    data = {"tree": tree, "previews": hash_previews}
    js_path = os.path.join(js_dir, "tree_data.js")
    with open(js_path, "w", encoding="utf-8") as f:
        f.write("window.__LB_TREE__ = ")
        json.dump(data, f, ensure_ascii=False)
        f.write(";\n")
    return data


# 导入时立即构建缓存
_tree_cache = _write_tree_cache()

# 注册预览图 API 路由
_register_routes()


class MLiangLoraLoader:
    """MLiang LoRA Loader — tree browsing + multi-slot + preview"""

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "model": ("MODEL",),
                "clip": ("CLIP",),
            },
            "optional": {
                "loras_ui": ("STRING", {"default": "[]"}),
            },
        }

    RETURN_TYPES = ("MODEL", "CLIP")
    RETURN_NAMES = ("model", "clip")
    FUNCTION = "load_loras"
    CATEGORY = "loaders"

    def load_loras(self, model, clip, loras_ui=None):
        config = []
        if loras_ui:
            if isinstance(loras_ui, str):
                try:
                    config = json.loads(loras_ui)
                except json.JSONDecodeError:
                    pass
            elif isinstance(loras_ui, list):
                config = loras_ui

        for item in config:
            if not item.get("enabled", True):
                continue
            lora_name = item.get("lora", "")
            if not lora_name or lora_name == "无":
                continue
            strength = float(item.get("strength", 1.0))

            lora_path = folder_paths.get_full_path("loras", lora_name)
            if not lora_path:
                print(f"[MLiang LoRA Loader] LoRA not found: {lora_name}")
                continue

            lora = comfy.utils.load_torch_file(lora_path, safe_load=True)
            model, clip = comfy.sd.load_lora_for_models(
                model, clip, lora, strength, strength
            )

        return (model, clip)


NODE_CLASS_MAPPINGS = {
    "MLiangLoraLoader": MLiangLoraLoader,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "MLiangLoraLoader": "MLiang LoRA Loader",
}

WEB_DIRECTORY = "./js"

__all__ = ["NODE_CLASS_MAPPINGS", "WEB_DIRECTORY"]
