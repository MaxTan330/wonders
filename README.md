# wonders

## 项目简介

**tohtml**
一般 word 会自带 word 转换 html 的系统工具，但是转出的文档维护性差，虽然样式，字体等都可以还原，但是我们常常针对类似于用户协议，隐私政策等，需要把文案提取成 html 的，然后作为单独的文件嵌入 App 或者部署在静态服务器上提供给项目使用

**base64**
针对 base64 编码，可以使用 url 安全编码，也可以使用自定义编码

**iconfont**
基于 node 环境的字体图标制作工具

**ntsRouter**
基于 express 的路由处理器，使用 ts 装饰器，简化控制器的定义和参数的处理，同时提供中间件能力，可实现自定义的中间件处理业务处理前和业务处理后的数据

## 构建配置

### 构建 tohtml

    开发模式编译

    npm run dev:tohtml

    构建模式编译

    npm run build:tohtml

### 构建 base64

    开发模式编译

    npm run dev:base64

    构建模式编译

    npm run build:base64

### 构建 iconfont

    开发模式编译

    npm run dev:iconfont

    构建模式编译

    npm run build:iconfont

### 构建 ntsRouter

    开发模式编译

    npm run dev:ntsRouter

    构建模式编译

    npm run build:ntsRouter
