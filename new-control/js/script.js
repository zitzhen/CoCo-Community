// 初始化Marked和Highlight.js
marked.setOptions({
    gfm: true,
    breaks: true,
    highlight: function(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
    }
});

// DOM元素
const fileInput = document.getElementById('fileInput');
const fileDropArea = document.getElementById('fileDropArea');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFile = document.getElementById('removeFile');
const uploadBtn = document.getElementById('uploadBtn');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const uploadForm = document.getElementById('uploadForm');
const mdTextarea = document.getElementById('fileDescription');
const mdPreview = document.getElementById('markdownPreview');
const mdTabs = document.querySelectorAll('.md-tab');
const writeContent = document.getElementById('writeContent');
const previewContent = document.getElementById('previewContent');

// 点击上传区域触发文件选择
fileDropArea.addEventListener('click', () => {
    fileInput.click();
});

// 文件选择处理
fileInput.addEventListener('change', handleFileSelect);

// 拖放功能
fileDropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    fileDropArea.classList.add('active');
});

fileDropArea.addEventListener('dragleave', () => {
    fileDropArea.classList.remove('active');
});

fileDropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    fileDropArea.classList.remove('active');
    
    if (e.dataTransfer.files.length) {
        fileInput.files = e.dataTransfer.files;
        handleFileSelect({ target: fileInput });
    }
});

// 处理文件选择
function handleFileSelect(event) {
    const file = event.target.files[0];
    
    if (!file) return;
    
    // 检查文件大小 (100MB限制)
    if (file.size > 100 * 1024 * 1024) {
        alert('文件大小超过100MB限制');
        return;
    }
    
    // 显示文件信息
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
    
    // 更新文件图标
    const fileIcon = filePreview.querySelector('.file-icon i');
    const fileType = getFileType(file.name);
    fileIcon.className = `fas ${getFileIcon(fileType)}`;
    
    // 显示预览
    filePreview.style.display = 'block';
    
    // 启用上传按钮
    uploadBtn.disabled = false;
    uploadBtn.classList.remove('btn-disabled');
}

// 移除文件
removeFile.addEventListener('click', () => {
    fileInput.value = '';
    filePreview.style.display = 'none';
    uploadBtn.disabled = true;
    uploadBtn.classList.add('btn-disabled');
});

// 格式化文件大小
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 获取文件类型
function getFileType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    
    const types = {
        // 文档
        pdf: 'pdf',
        doc: 'word', docx: 'word',
        ppt: 'powerpoint', pptx: 'powerpoint',
        xls: 'excel', xlsx: 'excel',
        txt: 'text', rtf: 'text',
        
        // 图片
        jpg: 'image', jpeg: 'image', png: 'image', gif: 'image',
        webp: 'image', svg: 'image', bmp: 'image',
        
        // 压缩文件
        zip: 'archive', rar: 'archive', '7z': 'archive',
        tar: 'archive', gz: 'archive', bz2: 'archive',
        
        // 音视频
        mp3: 'audio', wav: 'audio', ogg: 'audio',
        mp4: 'video', mkv: 'video', avi: 'video',
        mov: 'video', wmv: 'video',
        
        // 代码
        js: 'code', html: 'code', css: 'code',
        php: 'code', py: 'code', java: 'code',
        cpp: 'code', h: 'code', cs: 'code',
        json: 'code', xml: 'code',
        
        // 可执行文件
        exe: 'executable', msi: 'executable',
        dmg: 'executable', pkg: 'executable'
    };
    
    return types[extension] || 'file';
}

// 获取文件图标
function getFileIcon(fileType) {
    const icons = {
        pdf: 'fa-file-pdf',
        word: 'fa-file-word',
        powerpoint: 'fa-file-powerpoint',
        excel: 'fa-file-excel',
        text: 'fa-file-alt',
        image: 'fa-file-image',
        audio: 'fa-file-audio',
        video: 'fa-file-video',
        archive: 'fa-file-archive',
        code: 'fa-file-code',
        executable: 'fa-file-code',
        file: 'fa-file'
    };
    
    return icons[fileType] || icons.file;
}

// Markdown编辑器功能
mdTextarea.addEventListener('input', updateMarkdownPreview);

function updateMarkdownPreview() {
    mdPreview.innerHTML = marked.parse(mdTextarea.value);
}

// Markdown工具栏功能
document.querySelectorAll('[data-md-command]').forEach(btn => {
    btn.addEventListener('click', function() {
        const command = this.getAttribute('data-md-command');
        executeMarkdownCommand(command);
    });
});

function executeMarkdownCommand(command) {
    const textarea = mdTextarea;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    let newText = '';
    let cursorPos = 0;

    switch(command) {
        case 'bold':
            newText = `**${selectedText}**`;
            cursorPos = start + 2;
            break;
        case 'italic':
            newText = `*${selectedText}*`;
            cursorPos = start + 1;
            break;
        case 'heading':
            newText = `# ${selectedText}`;
            cursorPos = start + 2;
            break;
        case 'quote':
            newText = `> ${selectedText}`;
            cursorPos = start + 2;
            break;
        case 'code':
            if (selectedText.includes('\n')) {
                newText = `\`\`\`\n${selectedText}\n\`\`\``;
                cursorPos = start + 4;
            } else {
                newText = `\`${selectedText}\``;
                cursorPos = start + 1;
            }
            break;
        case 'link':
            newText = `[${selectedText}](url)`;
            cursorPos = start + selectedText.length + 3;
            break;
        case 'image':
            newText = `![${selectedText}](image-url)`;
            cursorPos = start + selectedText.length + 3;
            break;
        case 'ul':
            newText = selectedText.split('\n').map(line => `- ${line}`).join('\n');
            cursorPos = start + 2;
            break;
        case 'ol':
            newText = selectedText.split('\n').map((line, i) => `${i+1}. ${line}`).join('\n');
            cursorPos = start + 3;
            break;
        case 'table':
            newText = `${selectedText}\n| Header | Title |\n| ------ | ----- |\n| Paragraph | Text |`;
            cursorPos = start + selectedText.length + 1;
            break;
        case 'hr':
            newText = `${selectedText}\n\n---\n\n`;
            cursorPos = start + selectedText.length + 6;
            break;
    }

    textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
    textarea.focus();
    textarea.setSelectionRange(cursorPos, cursorPos);
    updateMarkdownPreview();
}

// Markdown标签切换
mdTabs.forEach(tab => {
    tab.addEventListener('click', function() {
        const tabName = this.getAttribute('data-tab');
        
        // 更新标签状态
        mdTabs.forEach(t => t.classList.remove('active'));
        this.classList.add('active');
        
        // 更新编辑器/预览显示
        if (tabName === 'write') {
            writeContent.classList.add('active');
            previewContent.classList.remove('active');
        } else {
            writeContent.classList.remove('active');
            previewContent.classList.add('active');
            updateMarkdownPreview();
        }
    });
});

// 表单提交处理
uploadForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const file = fileInput.files[0];
    if (!file) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', document.getElementById('fileTitle').value);
    formData.append('description', document.getElementById('fileDescription').value);
    formData.append('tags', document.getElementById('fileTags').value);
    formData.append('visibility', document.getElementById('fileVisibility').value);
    
    // 显示进度条
    progressContainer.style.display = 'block';
    
    // 模拟上传过程
    simulateUpload(formData);
});

// 模拟上传过程
function simulateUpload(formData) {
    
}

// 重置表单
function resetForm() {
    uploadForm.reset();
    fileInput.value = '';
    filePreview.style.display = 'none';
    progressContainer.style.display = 'none';
    progressBar.style.width = '0%';
    uploadBtn.disabled = true;
    uploadBtn.classList.add('btn-disabled');
    mdTabs[0].click(); // 切换到编辑标签
}