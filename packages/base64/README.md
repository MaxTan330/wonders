# Base64 编码

## 安装

    npm install @maxtan/base64

或者使用 yarn:

    yarn add @maxtan/base64

## 引用

**commonJS 规范引用**

    const Base64 = require('@maxtan/base64');
    const base64 = new Base64();

**ESM 规范引用**

    import Base64 from '@maxtan/base64';
    const base64 = new Base64();

**构造方法参数**

| 参数名称 | 描述              | 类型    | 是否必填 | 备注 |
| -------- | ----------------- | ------- | -------- | ---- |
| urlsafe  | 是否 url 安全编码 | boolean | 否       | true |

## URL 安全编码（默认）

使用编码字符集 `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=`

    const testStr = '加密串';
    const encodeStr = base64.encode(testStr); // 加密
    const decodeStr = base64.decode(encodeStr); //解密

## 标准编码

使用编码字符集 `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=`

使用方法

    const base64 = new Base64({
        urlsafe : false
    });
    const testStr = '加密串';
    const encodeStr = base64.encode(testStr); // 加密
    const decodeStr = base64.decode(encodeStr); //解密

## 自定义编码

使用自定义字符编码程序将不对解码串做校验

    base64.setKey('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#+=')
    const testStr = '测试';
    const encodeStr = base64.encode(testStr); // 加密
    const decodeStr = base64.decode(encodeStr); //解密
