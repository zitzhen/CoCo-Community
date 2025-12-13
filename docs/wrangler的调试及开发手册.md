# wrangler的调试及开发手册
## 运行wrangler
```bash
wrangler dev
```
## 使用TLS/SSL证书
我们的配置文件中，已自动写入开启HTTPS，使用的Cloudflare的默认证书。如果您有需要，可以在操作系统中安装此证书。
### 使用自定义TLS/SSL证书
由于Wrangler 不支持自定义SSL证书，如您想使用自定义的TLS/SSL证书，请看下文配置Nginx反向代理。
