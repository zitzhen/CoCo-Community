<template>
        <header>
        <div class="container">
            <h1>ZIT-CoCo-Community</h1>
        </div>
    </header>

    <div class="container">
        <div class="upload-container">
            <div class="upload-header">
                <div class="icon">
                    <i class="fas fa-cloud-upload-alt"></i>
                </div>
                <h2>上传文件</h2>
                <p class="upload-description">
                    分析您的自定义控件，让代码“发扬光大”
                </p>
            </div>

            <form id="uploadForm">
                <div class="form-group">
                    <label for="fileTitle" class="form-label">文件标题</label>
                    <input type="text" id="fileTitle" class="form-control" placeholder="为文件取一个描述性名称" required>
                </div>

                <div class="form-group">
                    <label class="form-label">文件描述</label>
                    <div class="md-container">
                        <div class="md-header">
                            <div class="md-tab active" data-tab="write">编辑</div>
                            <div class="md-tab" data-tab="preview">预览</div>
                        </div>
                        <div class="md-toolbar">
                            <button type="button" class="md-btn" data-md-command="bold" title="加粗"><i class="fas fa-bold"></i></button>
                            <button type="button" class="md-btn" data-md-command="italic" title="斜体"><i class="fas fa-italic"></i></button>
                            <button type="button" class="md-btn" data-md-command="heading" title="标题"><i class="fas fa-heading"></i></button>
                            <button type="button" class="md-btn" data-md-command="quote" title="引用"><i class="fas fa-quote-right"></i></button>
                            <button type="button" class="md-btn" data-md-command="code" title="代码"><i class="fas fa-code"></i></button>
                            <button type="button" class="md-btn" data-md-command="link" title="链接"><i class="fas fa-link"></i></button>
                            <button type="button" class="md-btn" data-md-command="image" title="图片"><i class="fas fa-image"></i></button>
                            <button type="button" class="md-btn" data-md-command="ul" title="无序列表"><i class="fas fa-list-ul"></i></button>
                            <button type="button" class="md-btn" data-md-command="ol" title="有序列表"><i class="fas fa-list-ol"></i></button>
                            <button type="button" class="md-btn" data-md-command="table" title="表格"><i class="fas fa-table"></i></button>
                            <button type="button" class="md-btn" data-md-command="hr" title="分隔线"><i class="fas fa-minus"></i></button>
                        </div>
                        <div id="writeContent" class="md-content active">
                            <textarea id="fileDescription" class="md-editor" placeholder="使用Markdown格式描述文件内容或用途..."></textarea>
                        </div>
                        <div id="previewContent" class="md-content">
                            <div id="markdownPreview" class="md-preview"></div>
                        </div>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">选择文件</label>
                    <div id="fileDropArea" class="file-upload-area">
                        <div class="file-upload-icon">
                            <i class="fas fa-file-upload"></i>
                        </div>
                        <div class="file-upload-text">点击或拖拽文件到此处</div>
                        <div class="file-upload-hint">支持单个文件上传，最大100MB</div>
                        <input type="file" id="fileInput" style="display: none;">
                    </div>
                    <div id="filePreview" class="file-preview">
                        <div class="file-info">
                            <div class="file-icon">
                                <i class="fas fa-file"></i>
                            </div>
                            <div class="file-details">
                                <div class="file-name" id="fileName">未选择文件</div>
                                <div class="file-size" id="fileSize">-</div>
                            </div>
                            <div class="remove-file" id="removeFile">
                                <i class="fas fa-times"></i>
                            </div>
                        </div>
                    </div>
                </div>





                <div id="progressContainer" class="progress-container">
                    <div class="progress-bar">
                        <div id="progressBar" class="progress"></div>
                    </div>
                    <div id="progressText" class="progress-text">准备上传...</div>
                </div>

                <!--人机验证模块-->
                <!--这次使用了测试站点密钥，合并分支前请更换为正式站点密钥-->
                <div style="display: flex; justify-content: center; margin: 20px 0;">
                    <div class="cf-turnstile" data-sitekey="1x00000000000000000000AA"></div>
                </div>


                <div class="form-group">
                    <button type="submit" id="uploadBtn" class="btn btn-block btn-disabled" disabled>
                        <i class="fas fa-upload"></i> 开始上传
                    </button>
                </div>
            </form>

            <div class="upload-requirements">
                <h3><i class="fas fa-info-circle"></i> 上传须知</h3>
                <ul>
                    <li>请勿上传受版权保护的材料，除非您拥有版权或获得明确许可</li>
                    <li>禁止上传恶意软件、病毒或任何有害内容</li>
                    <li>最大文件大小限制为100KIB</li>
                    <li>支持大多数常见文件类型（文档、图片、视频、压缩包等）</li>
                </ul>
            </div>
        </div>
    </div>

    <footer>
        <div class="container">
            <p>© 2025 ZIT-CoCo-Community</p>
        </div>
    </footer>
</template>

<style scoped>
@import '@/assets/style/new-control/style.css';
</style>