<template>
<footer class="footer">
        <div class="footer-container">
            <!-- 主要链接区域 -->
            <div class="footer-main">
                <div class="footer-section">
                    <h4 class="footer-section-title">CoCo-Community</h4>
                    <ul class="footer-links">
                        <li><a href="https://cc.zitzhen.cn/issues">Issues</a></li>
                        <li><a href="https://cc.zitzhen.cn/safe">安全</a></li>
                        <li><a href="https://cc.zitzhen.cn/user">用户数据</a></li>
                        <li><a href="https://cc.zitzhen.cn/agreement/useragreement">用户协议</a></li>
                        <li><a href="https://cc.zitzhen.cn/agreement/privacypolicy">隐私政策</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4 class="footer-section-title">开源</h4>
                    <ul class="footer-links">
                        <li><a href="https://github.com/zitzhen/CoCo-Community">Github</a></li>
                        <li><a href="https://gitee.com/zitzhen/CoCo-Community">Gitee</a></li>
                        <li><a href="https://gitlab.com/zitzhen/CoCo-Community">GitLab</a></li>
                        <li><a href="https://gitcode.com/zitzhen/CoCo-Community">Gitcode</a></li>
                        <li><a href="https://github.com/zitzhen/CoCo-Community?tab=AGPL-3.0-1-ov-file">开源协议</a></li>
                    </ul>
                </div>

                <div class="footer-section">
                    <h4 class="footer-section-title">支持我们</h4>
                    <ul class="footer-links">
                        <li><a href="https://cc.zitzhen.cn/tipping/">打赏</a></li>
                    </ul>
                </div>
            </div>

            <!-- 底部信息区域 -->
            <div class="footer-bottom">              
                <!-- 版权信息 -->
                <div class="footer-copyright">
                    &copy; 2025 CoCo-Community
                </div>
            </div>
        </div>
    </footer>
</template>
<style scoped>
.footer {
    background-color: #24292e;
    color: #586069;
    padding: 40px 0 20px;
    margin-top: 60px;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* 主要链接区域 */
.footer-main {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 40px;
    margin-bottom: 32px;
    padding-bottom: 32px;
    border-bottom: 1px solid #30363d;
}

.footer-section {
    display: flex;
    flex-direction: column;
}

.footer-section-title {
    font-size: 14px;
    font-weight: 600;
    color: #f0f6fc;
    margin-bottom: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.footer-links {
    list-style: none;
}

.footer-links li {
    margin-bottom: 8px;
}

.footer-links a {
    color: #8b949e;
    text-decoration: none;
    font-size: 14px;
    transition: color 0.2s;
}

.footer-links a:hover {
    color: #58a6ff;
}

/* 底部信息区域 */
.footer-bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 20px;
    padding-top: 20px;
}

.footer-copyright {
    font-size: 14px;
    color: #8b949e;
    text-align: center;
    flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
    .footer-main {
        grid-template-columns: repeat(2, 1fr);
        gap: 24px;
    }

    .footer-bottom {
        flex-direction: column;
        text-align: center;
    }
}

@media (max-width: 480px) {
    .footer-main {
        grid-template-columns: 1fr;
    }
}
</style>