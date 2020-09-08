# SVG 转换字体工具

## 全局安装

    npm install @maxtan/iconfont -g

或者使用 yarn:

    yarn add @maxtan/iconfont -g

## 使用

**直接编译文件夹所有文件**

编译 `svgs` 目录下所有的 `svg` 文件 ，默认会递归查找所有 `.svg` 文件

    iconfont ./svgs

**自定义字体 icon 名**

可以配置样式类和文件名的 icon

    iconfont ./svg -n icon

**配置输出目录**

项目默认输出命令的 dist 目录，如果没有，会自动创建，通过 `-o` 参数你可以指定项目目录

    iconfont ./svg -o dist

**使用自定义的 js 模板**

你可以自定义使用 `symbol` 的 `js` 模板,模板语法使用的是[loadsh 模板语法](https://lodash.com/docs/4.17.15#template)，如果不指定 `js` 模板资源，则使用默认的[系统 JS 模板](https://github.com/MaxTan330/wonders/blob/development/packages/iconfont/src/assets/template/js.tpl)

    iconfont ./svg -o dist -jstpl ./a.tpl

**使用自定义的 css 模板**

你可以自定义使用的 `css` 模板,模板语法使用的是[loadsh 模板语法](https://lodash.com/docs/4.17.15#template)，如果不指定 `css` 模板资源，则使用默认的[系统 CSS 模板](https://github.com/MaxTan330/wonders/blob/development/packages/iconfont/src/assets/template/css.tpl)

    iconfont ./svg -o dist -csstpl ./b.tpl

**生成规则**

字符编码起始位`0xe001` 会读取文件命名自动计算，理论上来说，只要保证文件名不变，每次生成的对应字体编码都是一致的

**生成的目录结构**

-   dist
    -   iconfont.css -- 需要导入到项目的 css 文件
    -   iconfont.eot -- 需要导入到项目的 eot 文件
    -   iconfont.html -- 预览的网页 方便查询有哪些字体图标，及使用方法
    -   iconfont.js -- 需要导入到项目的 js 文件,用以支持 Symbol 使用
    -   iconfont.svg -- 需要导入到项目的 svg 文件
    -   iconfont.ttf -- 需要导入到项目的 ttf 文件
    -   iconfont.woff -- 需要导入到项目的 woff 文件
    -   iconfont.woff2 -- 需要导入到项目的 woff2 文件
    -   iconfontdemo.css -- 预览网页的基础 css 文件，不需要导入到项目
