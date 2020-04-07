# @maxtan/tohtml

## Node 环境依赖

node 环境需要 v10 以上的

## 作为包依赖安装

    npm install @maxtan/tohtml

或者使用 yarn 安装:

    yarn add @maxtan/tohtml

## 作为包依赖使用

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

## 作为命令行工具安装

    npm install @maxtan/tohtml -g

## 在命令行中使用

    tohtml ./test.docx

### 命令行可配置参数

可以使用自定义模板语法，参考 lodash 模板语法

    tohtml ./test.docx -t test.template.html
