# WebSQL
## 控件更新：
***1.0.0***
发布控件
## 使用说明
### 1.数据库名
类型: `字符串` 默认值: `new-database`
数据库名称，一般以 英文、杠号连接 命名。
### 2.数据库版本号
类型: `字符串` 默认值: `1.0`
数据库版本号
### 3.数据库展示名
类型: `字符串` 默认值: `新数据库`
数据库展示名
### 4.数据库大小
类型: `数字` 默认值: `1048576(1MB)`
数据库大小，单位：字节
- 1024 1KB
- 1048576 1MB
- 1073741824 1GB
### 5.执行成功时

![当(WebSQL) 执行成功时 [(仅插入)最新行数][查询结果][影响行数]](https://cc.zitzhen.cn/control/WebSQL/images/1.png)

当任务执行成功时触发。

#### 参数说明

|属性名|输入类型|说明|
|---|---|---|
|(仅插入)最新行数|数字|当插入了新的数据时，显示新数据对应的行数（如果有多插入的则显示最后一个插入的）|
|查询结果|列表|程序执行结果|
|影响行数|数字|任务执行共有多少行受到了影响（更改删除等）|

### 6.当执行失败时

![当(WebSql) 执行失败时(错误码) (错误信息)](https://cc.zitzhen.cn/control/WebSQL/images/2.png)

当任务执行失败时触发。

#### 参数说明

|属性名|输入类型|说明|
|---|---|---|
|错误码|数字|错误码|
|错误信息|列表|错误信息|

### 5.执行任务

![调用(WebSQL)执行人物：SQL语句() 嵌入参数()](https://cc.zitzhen.cn/control/WebSQL/images/3.png)

执行读写任务，执行成功则触发 [执行成功时](https://cc.zitzhen.cn/control/WebSQL/images/1.png) 事件，失败则触发 [执行失败时](https://cc.zitzhen.cn/control/WebSQL/images/2.png) 事件。

##### 参数说明
|属性名|输入类型|说明|
|---|---|---|
|SQL语句|字符串|要执行的SQL语句|
|嵌入参数|列表|将列表中参数嵌入到SQL语句对应的?中|

#### 5.1执行只读任务

![调用(WebSQl)执行只读人物 SQl语句() 嵌入参数()](https://cc.zitzhen.cn/control/WebSQL/images/4.png)

执行只读任务，执行成功则触发 [执行成功时](https://cc.zitzhen.cn/control/WebSQL/images/1.png) 事件，失败则触发 [执行失败时](https://cc.zitzhen.cn/control/WebSQL/images/2.png) 事件。

##### 参数说明
|属性名|输入类型|说明|
|---|---|---|
|SQL语句|字符串|要执行的SQL语句|
|嵌入参数|列表|将列表中参数嵌入到SQL语句对应的?中|

# SQL教程
## 1.SQL注释
```sql
-- 注释内容
```
## 2.SQL语句说明
|类型|说明|
|---|---|
|CREATE TABLE|建造表|
|DROP TABLE|删除表|
|INSERT|插入|
|SELECT|查找|
|DELETE|删除|
|UPDATE "表名"|更改"表名"中的数据|
|INTO "表名"|插入至"表名"（配合INSERT语句）|
|FROM "表名"|在"表名"执行操作（配合SELECT、DELETE语句）|
|WHERE "条件"|过滤数据（多个必须条件使用AND间隔，多个可选条件使用OR间隔）|

## 3.SQL储存数据类型
|类型|说明|
|---|---|
|INTEGER|整数|
|REAL|浮点数|
|TEXT|文本|
|BLOB|blob数据|
|NULL|空数据|

## 4.SQL字段参数
|类型|说明|
|---|---|
|PRIMARY KEY|设置该字段为主键|
|NOT NULL|字段不能为空值|

## 5.SQL建造表
```sql
CREATE TABLE `表名` ( -- 建造一个名为"表名"的表
    `字段1` INTEGER PRIMARY KEY, -- "字段1"为整数，该字段为主键
    `字段2` TEXT NOT NULL -- "字段2"为文本，不能为空
);
```
## 6.SQL删除表
```sql
DROP TABLE `表名`; -- 删除"表名"
```
## 7.SQL插入数据
```sql
INSERT INTO `表名` (`字段1`,`字段2`) VALUES (1,'对应字段2的数据') ;
 -- 在`表名`中插入一行， 并且`字段1`的数据为1，`字段2`的数据为"对应字段2的数据"
```
## 8.SQL查找数据
```sql
SELECT * FROM `表名`; -- 查找`表名`全部数据
```
```sql
SELECT * FROM `表名` WHERE `字段1`=1; -- 查找`表名` `字段1`为1的数据
```
```sql
SELECT * FROM `表名` WHERE `字段1`>5 AND `字段2`="%昵称%";
 -- 查找`表名` `字段1`大于5 并且 `字段2`包含"昵称"的数据
```

## 9.SQL删除数据
```sql
DELETE FROM `表名`; -- 删除"表名"的所有数据
```

## 10.SQL更改数据
```sql
UPDATE `表名` SET `字段2`="对应字段2的数据" WHERE `字段1`=1;
 -- 更改 `表名` 中 `字段1`=1 的所有行 中的 `字段2` 为 "对应字段2的数据"
```

- 更多SQL教程请自行查找
- https://www.runoob.com/sqlite/

小宏：感谢你使用该控件，希望这个控件和说明书对你有所帮助
---
文档编写者：小宏
Markdown排版：小圳
