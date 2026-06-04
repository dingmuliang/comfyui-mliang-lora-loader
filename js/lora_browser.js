/**
 * MLiang LoRA Loader — rgthree-style UI
 */
import { app } from "../../../scripts/app.js";

var treeData = window.__LB_TREE__ || { tree: {}, previews: {} };

var previewTooltip = null;
function getPreviewTooltip() {
  if (previewTooltip) return previewTooltip;
  previewTooltip = document.createElement("div");
  previewTooltip.style.cssText = "position:fixed;z-index:99999;pointer-events:none;display:none;background:#1a1a1a;border:1px solid #444;border-radius:4px;padding:4px";
  previewTooltip.innerHTML = '<img style="max-width:200px;max-height:200px;display:block;border-radius:2px" src="">';
  document.body.appendChild(previewTooltip);
  return previewTooltip;
}
function showPreview(evt, src) {
  var tt = getPreviewTooltip();
  var img = tt.querySelector("img");
  img.src = src;
  img.onerror = function(){ tt.style.display = "none"; };
  tt.style.display = "block";
  tt.style.left = (evt.clientX + 12) + "px";
  tt.style.top = (evt.clientY - 10) + "px";
}
function hidePreview() {
  if (previewTooltip) previewTooltip.style.display = "none";
}

// 键盘导航高亮样式
(function(){
  var s = document.createElement("style");
  s.textContent = ".lb-selectable.highlight{background:#2a5a3a!important}";
  document.head.appendChild(s);
})();

function fn(path) {
  var p = (path || "").replace(/\\/g, "/").split("/");
  return p[p.length - 1] || path;
}

function truncate(s, len) {
  if (!s || s.length <= len) return s;
  return s.substring(0, len - 2) + "..";
}

/* ========== Tree ========== */

function folderHas(tree, prefix, filter) {
  if (!filter) return true;
  for (var k in tree) {
    if (!tree.hasOwnProperty(k)) continue;
    var v = tree[k];
    if (k === "__files__") {
      for (var j = 0; j < v.length; j++) {
        var fp = prefix ? prefix + "/" + v[j] : v[j];
        if (fp.toLowerCase().indexOf(filter) !== -1) return true;
      }
    } else if (typeof v === "object") {
      if (folderHas(v, prefix ? prefix + "/" + k : k, filter)) return true;
    }
  }
  return false;
}

function renderTree(parent, tree, path, filter, onSel, previews) {
  var folders = [], files = [];
  for (var k in tree) {
    if (!tree.hasOwnProperty(k)) continue;
    var v = tree[k];
    if (k === "__files__") {
      for (var j = 0; j < v.length; j++) {
        var fp = path ? path + "/" + v[j] : v[j];
        if (!filter || fp.toLowerCase().indexOf(filter) !== -1) {
          files.push({ name: v[j], fullPath: fp });
        }
      }
    } else if (typeof v === "object") {
      var fp = path ? path + "/" + k : k;
      var match = !filter || fp.toLowerCase().indexOf(filter) !== -1 || folderHas(v, fp, filter);
      if (match) folders.push({ name: k, children: v, fullPath: fp });
    }
  }
  folders.sort(function(a,b){return a.name.localeCompare(b.name);});
  files.sort(function(a,b){return a.name.localeCompare(b.name);});

  for (var fi = 0; fi < folders.length; fi++) {
    (function(f){
      var node = document.createElement("div");
      var hdr = document.createElement("div");
      hdr.style.cssText = "display:flex;align-items:center;padding:2px 4px;cursor:pointer;font-size:11px;color:#aaa;border-radius:2px";
      hdr.className = "lb-selectable";
      hdr.addEventListener("mouseenter", function(){ hdr.style.background = "#2a2a3a"; });
      hdr.addEventListener("mouseleave", function(){ hdr.style.background = ""; });
      var arrow = document.createElement("span");
      arrow.style.cssText = "width:12px;text-align:center;font-size:9px";
      arrow.textContent = "\u25B6";
      hdr.appendChild(arrow);
      hdr.appendChild(document.createTextNode(" " + f.name));
      hdr.onclick = function(e){
        e.stopPropagation();
        var kids = node.querySelector(".lb-tree-kids");
        if (kids) {
          var h = kids.classList.toggle("hidden");
          arrow.textContent = h ? "\u25B6" : "\u25BC";
        }
      };
      node.appendChild(hdr);
      var kids = document.createElement("div");
      kids.className = "lb-tree-kids hidden";
      kids.style.paddingLeft = "12px";
      renderTree(kids, f.children, f.fullPath, filter, onSel, previews);
      node.appendChild(kids);
      parent.appendChild(node);
      if (filter) { kids.classList.remove("hidden"); arrow.textContent = "\u25BC"; }
    })(folders[fi]);
  }

  for (var fj = 0; fj < files.length; fj++) {
    (function(f){
      var el = document.createElement("div");
      el.style.cssText = "padding:2px 4px 2px 16px;cursor:pointer;font-size:11px;color:#ccc;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;border-radius:2px";
      el.className = "lb-selectable";
      el.addEventListener("mouseenter", function(){ el.style.background = "#2a2a3a"; });
      el.addEventListener("mouseleave", function(){ el.style.background = ""; });
      el.textContent = f.name;
      el.onclick = function(e){ e.stopPropagation(); onSel(f.fullPath); };
      // 预览 tooltip（通过 API 路由，不用 file://）
      if (previews) {
        var ph = previews[f.fullPath];
        if (ph) {
          el.addEventListener("mouseenter", function(evt){
            showPreview(evt, "/mliang-lora/preview?h=" + ph);
          });
          el.addEventListener("mouseleave", function(){
            hidePreview();
          });
        }
      }
      parent.appendChild(el);
    })(files[fj]);
  }

  if (folders.length === 0 && files.length === 0) {
    var emp = document.createElement("div");
    emp.style.cssText = "color:#666;padding:4px;font-size:11px";
    emp.textContent = filter ? "\u65E0\u5339\u914D" : "\u7A7A";
    parent.appendChild(emp);
  }
}

function buildTreePanel(cfg, idx, tree, onCommit, previews) {
  var panel = document.createElement("div");
  panel.style.cssText = "position:absolute;left:0;top:100%;width:100%;max-height:200px;overflow-y:auto;background:#1a1a1a;border:1px solid #444;border-radius:4px;z-index:9999;padding:4px 0";

  // 包装回调：提交时清理事件监听器
  var commit = function(path){
    if (panel._closeHandler) document.removeEventListener("click", panel._closeHandler);
    panel._closeHandler = null;
    onCommit(path);
  };

  var search = document.createElement("input");
  search.style.cssText = "width:calc(100% - 8px);margin:0 4px 4px;padding:3px 6px;background:#222;border:1px solid #444;border-radius:3px;color:#ccc;font-size:11px;box-sizing:border-box;outline:none";
  search.placeholder = "\u641C\u7D22...";
  search.oninput = function(){
    var term = search.value.toLowerCase();
    var children = panel.querySelector(".lb-tree-kids");
    if (children) {
      children.innerHTML = "";
      renderTree(children, tree, "", term, commit, previews);
      var all = children.querySelectorAll(".lb-tree-kids");
      for (var i = 0; i < all.length; i++) all[i].classList.remove("hidden");
    }
  };
  search.onkeydown = function(e){
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      var items = panel.querySelectorAll(".lb-selectable");
      if (items.length === 0) return;
      var current = panel.querySelector(".lb-selectable.highlight");
      var idx = -1;
      for (var i = 0; i < items.length; i++) {
        if (items[i] === current) { idx = i; break; }
      }
      if (current) {
        current.classList.remove("highlight");
        current.style.background = "";
      }
      if (e.key === "ArrowDown") idx = (idx + 1) % items.length;
      else idx = (idx - 1 + items.length) % items.length;
      if (items[idx]) {
        items[idx].classList.add("highlight");
        items[idx].style.background = "#2a5a3a";
        items[idx].scrollIntoView({ block: "nearest" });
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      var sel = panel.querySelector(".lb-selectable.highlight");
      if (sel) { sel.click(); }
    } else if (e.key === "Escape") {
      commit(null);
    }
  };
  panel.appendChild(search);

  var tc = document.createElement("div");
  tc.className = "lb-tree-kids";
  renderTree(tc, tree, "", "", commit, previews);
  panel.appendChild(tc);

  setTimeout(function(){
    // 如果 panel 已经有 closeHandler（前一次没清理），先移除
    if (panel._closeHandler) document.removeEventListener("click", panel._closeHandler);
    var close = function(e){
      if (!panel.contains(e.target)) {
        document.removeEventListener("click", close);
        panel._closeHandler = null;
        onCommit(null);
      }
    };
    panel._closeHandler = close;
    document.addEventListener("click", close);
  }, 50);

  return panel;
}

/* ========== UI ========== */

function saveCfg(ct) {
  // 更新 loras_ui STRING widget（传给 Python 的）
  if (ct._dataWidget) {
    ct._dataWidget.value = JSON.stringify(ct._config);
    if (typeof ct._dataWidget.callback === "function") ct._dataWidget.callback(ct._dataWidget.value);
  }
  // 更新 DOM widget（序列化保存用）
  if (ct._domWidget) {
    ct._domWidget.value = ct._config.slice();
  }
}

function renderUI(ct) {
  ct.innerHTML = "";
  var cfg = ct._config;
  var tree = ct._treeData.tree || {};

  // Toggle All row (rgthree style)
  var tr = document.createElement("div");
  tr.style.cssText = "display:flex;align-items:center;gap:6px;padding:2px 0;margin-bottom:2px";
  var rad = document.createElement("span");
  rad.style.cssText = "width:10px;height:10px;border-radius:50%;border:1px solid #666;display:inline-block;flex-shrink:0;cursor:pointer";
  var allOn = cfg.length > 0 && cfg.every(function(c){ return c.enabled !== false; });
  if (allOn) rad.style.background = "#4a9";
  rad.onclick = function(){
    cfg.forEach(function(c){ c.enabled = !allOn; });
    saveCfg(ct); renderUI(ct);
  };
  tr.appendChild(rad);
  var tl = document.createElement("span");
  tl.style.cssText = "font-size:11px;color:#aaa;cursor:pointer;flex:1";
  tl.textContent = "Toggle All";
  tl.onclick = function(){
    cfg.forEach(function(c){ c.enabled = !allOn; });
    saveCfg(ct); renderUI(ct);
  };
  tr.appendChild(tl);
  ct.appendChild(tr);

  // Separator
  var sep = document.createElement("div");
  sep.style.cssText = "border-bottom:1px solid #333;margin:2px 0";
  ct.appendChild(sep);

  // Slots
  cfg.forEach(function(c, i){
    var row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:3px;height:20px;margin:1px 0;position:relative;border-radius:2px;padding:0 2px";
    row.addEventListener("mouseenter", function(){ row.style.background = "#2a2a3a"; });
    row.addEventListener("mouseleave", function(){ row.style.background = ""; });

    // Radio indicator (rgthree style - no bg when off)
    var r = document.createElement("span");
    r.style.cssText = "width:10px;height:10px;border-radius:50%;border:1px solid #666;cursor:pointer;flex-shrink:0";
    if (c.enabled !== false) { r.style.background = "#4a9"; r.style.border = "1px solid #4a9"; }
    r.onclick = function(){ c.enabled = !c.enabled; saveCfg(ct); renderUI(ct); };
    row.appendChild(r);

    // Name button (opens tree)
    var nameBtn = document.createElement("button");
    nameBtn.style.cssText = "flex:1;min-width:0;display:flex;align-items:center;gap:4px;padding:1px 6px;background:#222;border:1px solid #444;border-radius:3px;color:#ccc;font-size:11px;cursor:pointer;text-align:left;overflow:hidden";
    nameBtn.title = c.lora || "";
    var dot = document.createElement("span");
    dot.style.cssText = "width:6px;height:6px;border-radius:50%;background:#888;flex-shrink:0";
    if (c.lora && c.lora !== "\u65E0") dot.style.background = "#4a9";
    nameBtn.appendChild(dot);
    var txt = document.createElement("span");
    txt.style.cssText = "white-space:nowrap;overflow:hidden;text-overflow:ellipsis;flex:1";
    txt.textContent = truncate((c.lora && c.lora !== "\u65E0") ? fn(c.lora) : "\u9009\u62E9 LoRA...", 18);
    nameBtn.appendChild(txt);
    nameBtn.onclick = function(e){
      e.stopPropagation();
      if (ct._expandedSlot === i) {
        ct._expandedSlot = -1;
        renderUI(ct);
      } else {
        ct._expandedSlot = i;
        renderUI(ct);
      }
    };

    // 已选 LoRA 悬停预览（右侧即时显示）
    if (c.lora && c.lora !== "\u65E0") {
      var ph = (ct._treeData && ct._treeData.previews) ? ct._treeData.previews[c.lora] : null;
      if (ph) {
        nameBtn.addEventListener("mouseenter", function(evt){
          clearTimeout(nameBtn._previewTimer);
          nameBtn._previewTimer = setTimeout(function(){
            showPreview(evt, "/mliang-lora/preview?h=" + ph);
          }, 200);
        });
        nameBtn.addEventListener("mouseleave", function(){
          clearTimeout(nameBtn._previewTimer);
          hidePreview();
        });
      }
    }
    row.appendChild(nameBtn);

    // Strength Model
    var lm = document.createElement("span");
    lm.style.cssText = "font-size:9px;color:#666;margin-right:2px;flex-shrink:0";
    lm.textContent = "M";
    row.appendChild(lm);
    var sm = document.createElement("input");
    sm.type = "text";
    sm.style.cssText = "width:34px;text-align:center;background:#222;border:1px solid #444;border-radius:3px;color:#ccc;font-size:10px;padding:1px;flex-shrink:0";
    sm.value = (c.strength_model != null) ? c.strength_model : (c.strength || 1.0);
    sm.onchange = function(){
      var v = parseFloat(sm.value);
      c.strength_model = isNaN(v) ? 1.0 : v;
      saveCfg(ct);
    };
    row.appendChild(sm);

    var um = document.createElement("span");
    um.style.cssText = "width:12px;height:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:8px;color:#888;flex-shrink:0;margin-right:-2px";
    um.textContent = "\u25B2";
    um.onclick = function(){
      c.strength_model = parseFloat(((c.strength_model != null ? c.strength_model : (c.strength || 1.0)) + 0.05).toFixed(2));
      saveCfg(ct); renderUI(ct);
    };
    row.appendChild(um);

    var dm = document.createElement("span");
    dm.style.cssText = "width:12px;height:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:8px;color:#888;flex-shrink:0;margin-right:4px";
    dm.textContent = "\u25BC";
    dm.onclick = function(){
      c.strength_model = parseFloat(((c.strength_model != null ? c.strength_model : (c.strength || 1.0)) - 0.05).toFixed(2));
      saveCfg(ct); renderUI(ct);
    };
    row.appendChild(dm);

    // Strength Clip
    var lc = document.createElement("span");
    lc.style.cssText = "font-size:9px;color:#666;margin-right:2px;flex-shrink:0";
    lc.textContent = "C";
    row.appendChild(lc);
    var sc = document.createElement("input");
    sc.type = "text";
    sc.style.cssText = "width:34px;text-align:center;background:#222;border:1px solid #444;border-radius:3px;color:#ccc;font-size:10px;padding:1px;flex-shrink:0";
    sc.value = (c.strength_clip != null) ? c.strength_clip : (c.strength || 1.0);
    sc.onchange = function(){
      var v = parseFloat(sc.value);
      c.strength_clip = isNaN(v) ? 1.0 : v;
      saveCfg(ct);
    };
    row.appendChild(sc);

    var uc = document.createElement("span");
    uc.style.cssText = "width:12px;height:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:8px;color:#888;flex-shrink:0;margin-right:-2px";
    uc.textContent = "\u25B2";
    uc.onclick = function(){
      c.strength_clip = parseFloat(((c.strength_clip != null ? c.strength_clip : (c.strength || 1.0)) + 0.05).toFixed(2));
      saveCfg(ct); renderUI(ct);
    };
    row.appendChild(uc);

    var dc = document.createElement("span");
    dc.style.cssText = "width:12px;height:12px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-size:8px;color:#888;flex-shrink:0";
    dc.textContent = "\u25BC";
    dc.onclick = function(){
      c.strength_clip = parseFloat(((c.strength_clip != null ? c.strength_clip : (c.strength || 1.0)) - 0.05).toFixed(2));
      saveCfg(ct); renderUI(ct);
    };
    row.appendChild(dc);

    // 右键菜单
    row.addEventListener("contextmenu", function(e){
      e.preventDefault();
      e.stopPropagation();
      showRowMenu(e.clientX, e.clientY, ct, i);
    });

    // Tree panel
    if (ct._expandedSlot === i) {
      var wrap = document.createElement("div");
      wrap.style.cssText = "position:relative;width:100%";
      var slotIdx = i; // ⚡ 立即捕获索引
      var prevs = ct._treeData ? (ct._treeData.previews || {}) : {};
      wrap.appendChild(buildTreePanel(cfg, slotIdx, tree, function(path){
        if (path !== null) {
          cfg[slotIdx].lora = path;
          saveCfg(ct);
        }
        ct._expandedSlot = -1;
        renderUI(ct);
      }, prevs));
      row.appendChild(wrap);
    }

    ct.appendChild(row);
  });

  // Add button
  var add = document.createElement("button");
  add.style.cssText = "width:100%;margin-top:2px;padding:2px;background:#2a2a2a;border:1px solid #444;border-radius:3px;color:#888;font-size:11px;cursor:pointer";
  add.textContent = "+ Add LoRA";
  add.onclick = function(){ cfg.push({ lora: "\u65E0", strength_model: 1.0, strength_clip: 1.0, enabled: true }); ct._expandedSlot = -1; saveCfg(ct); renderUI(ct); };
  ct.appendChild(add);
}

/* ========== 右键菜单 ========== */

function showRowMenu(x, y, ct, idx) {
  // 移除旧菜单
  var old = document.querySelector(".lb-context-menu");
  if (old) old.remove();

  var cfg = ct._config;
  var c = cfg[idx];

  var menu = document.createElement("div");
  menu.className = "lb-context-menu";
  menu.style.cssText = "position:fixed;z-index:99999;background:#1a1a1a;border:1px solid #444;border-radius:4px;padding:2px 0;min-width:160px;font-size:11px;color:#ccc";

  function addItem(label, onClick) {
    var item = document.createElement("div");
    item.style.cssText = "padding:4px 12px;cursor:pointer;white-space:nowrap";
    item.textContent = label;
    item.addEventListener("mouseenter", function(){ item.style.background = "#333"; });
    item.addEventListener("mouseleave", function(){ item.style.background = ""; });
    item.onclick = function(e){ e.stopPropagation(); menu.remove(); onClick(); };
    menu.appendChild(item);
  }

  function addSep() {
    var s = document.createElement("div");
    s.style.cssText = "border-bottom:1px solid #333;margin:2px 0";
    menu.appendChild(s);
  }

  addItem("\u2139\uFE0F Show Info", function(){
    if (c.lora && c.lora !== "\u65E0") {
      alert("LoRA: " + c.lora + "\nStrength: " + c.strength + "\nEnabled: " + (c.enabled !== false));
    }
  });
  addSep();
  addItem((c.enabled === false ? "\uD83D\uDFE2" : "\u26AB") + " " + (c.enabled === false ? "Toggle On" : "Toggle Off"), function(){
    c.enabled = !c.enabled;
    saveCfg(ct); renderUI(ct);
  });
  addSep();
  addItem("\u2B06\uFE0F Move Up", function(){
    if (idx > 0) {
      var tmp = cfg[idx];
      cfg[idx] = cfg[idx - 1];
      cfg[idx - 1] = tmp;
      saveCfg(ct); renderUI(ct);
    }
  });
  addItem("\u2B07\uFE0F Move Down", function(){
    if (idx < cfg.length - 1) {
      var tmp = cfg[idx];
      cfg[idx] = cfg[idx + 1];
      cfg[idx + 1] = tmp;
      saveCfg(ct); renderUI(ct);
    }
  });
  addSep();
  addItem("\uD83D\uDDD1\uFE0F Remove", function(){
    cfg.splice(idx, 1);
    if (cfg.length === 0) cfg.push({ lora: "\u65E0", strength_model: 1.0, strength_clip: 1.0, enabled: true });
    ct._expandedSlot = -1;
    saveCfg(ct); renderUI(ct);
  });

  // 定位
  menu.style.left = x + "px";
  menu.style.top = y + "px";
  document.body.appendChild(menu);

  // 点击其他地方关闭
  setTimeout(function(){
    var close = function(e){ menu.remove(); document.removeEventListener("click", close); };
    document.addEventListener("click", close);
  }, 0);
}

/* ========== Extension ========== */

app.registerExtension({
  name: "MLiangLoraLoader",

  beforeRegisterNodeDef: function(nodeType, nodeData) {
    if (nodeData.name !== "MLiangLoraLoader") return;

    var origCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function() {
      var result = origCreated ? origCreated.apply(this, arguments) : undefined;
      this.serialize_widgets = true;

      // 找到 loras_ui STRING widget 并隐藏它（数据传给 Python 用，不显示）
      var dataWidget = null;
      for (var wi = 0; wi < (this.widgets || []).length; wi++) {
        if (this.widgets[wi].name === "loras_ui") {
          dataWidget = this.widgets[wi];
          break;
        }
      }
      if (dataWidget && dataWidget.element) {
        dataWidget.element.style.cssText = "display:none!important;width:0!important;height:0!important;padding:0!important;margin:0!important;border:none!important;overflow:hidden!important;position:absolute!important;top:-9999px!important";
      } else if (dataWidget) {
        // element 可能还没创建，延迟隐藏
        setTimeout(function(){
          if (dataWidget.element) {
            dataWidget.element.style.cssText = "display:none!important;width:0!important;height:0!important;padding:0!important;margin:0!important;border:none!important;overflow:hidden!important;position:absolute!important;top:-9999px!important";
          }
        }, 500);
      }

      var config = [];
      if (dataWidget && dataWidget.value) {
        try { config = JSON.parse(dataWidget.value); } catch(e) { config = []; }
      }
      if (!Array.isArray(config) || config.length === 0) {
        config = [{ lora: "\u65E0", strength: 1.0, enabled: true }];
        if (dataWidget) dataWidget.value = JSON.stringify(config);
      }

      var container = document.createElement("div");
      container.style.cssText = "padding:0 4px 2px;width:100%;box-sizing:border-box;overflow:hidden;margin-top:-6px;background:transparent;border:none";
      container._config = config;
      container._dataWidget = dataWidget;
      container._treeData = treeData;
      container._expandedSlot = -1;

      var dw = this.addDOMWidget("_loras_browser_ui", "custom", container, {
        getValue: function() { return container._config.slice(); },
        setValue: function(v) {
          if (Array.isArray(v) && v.length > 0) {
            container._config = v;
            renderUI(container);
          }
        }
      });
      container._domWidget = dw;
      dw.value = config.slice();

      renderUI(container);
      return result;
    };
  },
});

console.log("[MLiang LoRA Loader] Loaded");
