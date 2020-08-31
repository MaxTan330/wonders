# docx 转换 HTML

## 简介

将 docx 文件快速转换成可维护性高的HTML网页。主要应用场景：应用的隐私政策，用户协议等 docx 文件快速构建出网页，避免手动复制粘贴导致的文本错误问题。

**Node 环境需要 v10 及以上**

## 作为命令行工具安装

    npm install @maxtan/tohtml -g

### 在命令行中使用

    tohtml ./test.docx

### 命令行可配置参数

可以使用自定义模板语法，参考 lodash 模板语法

    tohtml ./test.docx -t test.template.html

## 作为包依赖安装

    npm install @maxtan/tohtml

### 作为包依赖使用

    const toHtml = require('@maxtan/tohtml');
    const path = require('path');
    //Basic use
    const testInit= async () => {
        const workOptions = {
            targetPath : path.resolve(__dirname,'./test.docx'), //源文件路径
            templatePath : path.resolve(__dirname,'./test.template.html'),  //模板文件路径
            isWirteFile : false //是否写入文件
        };
        const htmlStr = await toHtml.compiledToHtml(workOptions);
        console.log(htmlStr);
    };
    testInit();

### 配置项参数

| 参数名       | 描述         | 类型    | 备注                                                                                               |
| ------------ | ------------ | ------- | -------------------------------------------------------------------------------------------------- |
| targetPath   | 源文件路径   | string  | 传入绝对地址路径                                                                                   |
| templatePath | 模板文件路径 | string  | 使用 lodash 模板语法                                                                               |
| isWirteFile  | 是否写入文件 | boolean | 方法调用通常不写入文件，调用 `compiledToHtml` 方法时 默认 false 调用 `docxtohtml` 方法时 默认 true |

## 已知存在的问题

-   1.目前仅支持 docx 文件。
-   2.格式刷标识的序号可能会被忽略。请对生成的网页自行检查。
