# Github OAuth后端请求
后端边缘函数源代码：[Code](https://github.com/zitzhen/CoCo-Community/blob/main/functions/auth/github.ts)
## API简介
用于Github OAuth的登录，通过Github返回的code换取`accessToken`并生成最大生命周期JWT令牌，并保存到用户的httponly cookie。
## 请求方法

| 请求方法 | 是否可用 |
| ---- | ---- |
| GET  | ✅Yes |
| POST | ❌No  |
## 全流程
```mermaid
flowchart TD
A[Github回调/被请求]-->B[后端收到]-->C{检查是否携带code}
C-->|是|D[向Github请求accessToken]
C-->|否|E[HTTP 400]
D-->|请求成功|F[正确解析json]-->I{如果令牌长度小于10}
D-->|请求失败|H[HTTP500]
I-->|是|J[HTTP401]
I-->|否|K[请求用户Github信息]
K-->|是|M[设置key_maximum_lifespan数组]-->N[使用 jose 库创建 JWT]-->O[设置关于accessToken的Cookie]-->P[设置关于maximum_lifespan_Token的Cookie]-->Q[设置返回响应Set-Cookie]-->R[设置HTTP302返回]-->V[用户会到社区首页，流程结束]
K-->|否|L[HTTP500]
```
## 意外错误捕捉
```mermaid
flowchart TD
A[catch捕捉到错误]-->B[总结错误为JSON]-->C[设置HTTP状态为500]-->D[设置响应体为application/json]-->E[用户看到错误]
```
# 增加下载量API
后端边缘函数源代码：[Code](https://github.com/zitzhen/CoCo-Community/blob/main/functions/api/download.ts)
## API简介
当用户点击CoCo-Community中的下载按钮时，CoCo-Community会自动请求此API以记录下载量。
## 请求方法
| 请求方法 | 是否可用 |
| ---- | ---- |
| GET  | ✅Yes |
| POST | ❌No  |
## 全流程
```mermaid
flowchart TD
A[当用户点击下载]-->B[Cloudflare收到]-->C{检查GET参数中是否包含name}
C-->|包含|D[检查请求控件是否存在与查值]
C-->|不包含|E[HTTP400]
D-->|存在|F{下载量是否有数据}
D-->|不存在|H[HTTP404]
F-->|有|I[更新数据库下载量值+1]
F-->|没有|J[重置下载量数据为0]-->I
I-->|更新成功|L[HTTP 200流程结束]
I-->|更新失败|P[HTTP 500]
```
## 意外错误捕捉
```mermaid
flowchart TD
A[catch捕捉到错误]-->B[总结错误为JSON]-->C[设置HTTP状态为500]-->D[设置响应体为application/json]-->E[用户看到错误]
```
