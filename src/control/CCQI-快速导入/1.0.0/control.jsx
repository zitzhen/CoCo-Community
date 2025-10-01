// ==UserScript==
// @name         CoCo Quick Import
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  拖动控件文件至“导航栏-文件”选项上即可快速导入控件
// @author       Inventocode
// @match        https://coco.codemao.cn/*
// @icon         http://coco.codemao.cn/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    function upload_widget(file) {
        let fileInput = document.querySelector("div>span>input[type=file]");
        if (!fileInput) { document.querySelector("#root > div > header > div > div.Header_left__1k2WD > div.Header_menu__Zy7KP > div.coco-dropdown.Header_fileDropdown__3MYW_ > div > div.coco-popover-children > div").click(); }
        let dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInput.files = dataTransfer.files;
        let event = new Event('change', { bubbles: true });
        fileInput.dispatchEvent(event);
        setTimeout(() => {
            let replace_btn = document.querySelector('button.coco-button.coco-button-primary.coco-button-dangerous.coco-button-circle');
            if (replace_btn) { replace_btn.click(); }
        }, 150);
    }
    let upload_mask = document.createElement("div");
    // let target = document.querySelector("#root > div > header > div > div.Header_left__1k2WD > div.Header_menu__Zy7KP > div.coco-dropdown.Header_fileDropdown__3MYW_ > div > div.coco-popover-children > div");
    // upload_mask.innerHTML = '<input type="file" accept=".js,.jsx" style="height:100%;width:100%;opacity:0;">';
    upload_mask.style.backgroundColor = "#00000055";
    upload_mask.style.position = "absolute";
    upload_mask.style.top = "0";
    upload_mask.style.left = "0";
    upload_mask.style.width = "100%";
    upload_mask.style.height = "100%";
    upload_mask.style.zIndex = "1001";
    upload_mask.style.display = "none";
    upload_mask.style.backgroundImage = "url(https://static.codemao.cn/pickduck/Syg_0dQ-gl.png)";
    upload_mask.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    upload_mask.style.backgroundRepeat = "no-repeat";
    upload_mask.style.backgroundSize = "contain";
    upload_mask.style.backgroundPosition = "center center";
    document.body.appendChild(upload_mask);
    // target.ondragenter = () => { upload_mask.style.display = "block"; };
    // let file_input = upload_mask.querySelector('input');
    // file_input.onchange = () => { upload_mask.style.display = "none"; setTimeout(upload_widget(file_input.files[0]), 200) }

    document.addEventListener('dragenter', (event) => {
        // 如果已经显示了遮罩，就不再判断
        if (upload_mask.style.display == "block") return;

        // 如果没有拖入文件，跳过
        const items = event.dataTransfer.items;
        if (![...items].filter(e => e.kind == 'file').length) return;

        // 满足条件，显示遮罩
        upload_mask.style.display = "block";
        event.preventDefault();
        event.stopPropagation();
    }, false)

    document.addEventListener('dragover', (event) => {
        event.preventDefault();
        event.stopPropagation();
    }, false);

    document.addEventListener('dragleave', (event) => {
        event.preventDefault();
        event.stopPropagation();
    }, false);

    upload_mask.addEventListener('dragleave', () => {
        upload_mask.style.display = "none";
    });

    document.addEventListener('drop', (event) => {
        upload_mask.style.display = "none";
        event.preventDefault();
        event.stopPropagation();

        // 递归导入
        let readyToImport = [];
        function importOne() {
            let item = readyToImport.pop()
            upload_widget(item);
            setTimeout(() => {
                if (readyToImport.length) importOne();
            }, 155)
        }

        // 获取需要导入的文件
        for (let file of event.dataTransfer.files) {
            const fileName = file.name.toLowerCase();

            // 如果有 js, jsx 扩展名，则认为是控件文件
            if (fileName.endsWith('.js') || fileName.endsWith('.jsx')) {
                readyToImport.push(file)
            }
        }
        if (!readyToImport.length) return; // 如果没有找到控件文件，跳过

        setTimeout(importOne, 200);
    }, false);
})();