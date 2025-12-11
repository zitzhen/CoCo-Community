# Essay查询API文档及开发手册
## API简介
客户端通过GET请求本API，本API在Cloudflare D1数据库中的comment中查询所有EssayID=客户端传入的EssayID的值匹配的行，并合成JSON返回给客户端。
## 请求方法
| 请求方法 | 是否可用  |
| ---- | ----- |
| GET  | 可用，唯一 |
| POST | 不可用   |
