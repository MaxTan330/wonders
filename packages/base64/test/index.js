/**
 * @Author: MaxTan
 * @Description: 测试方法
 * @Date: 2020/08/10 15:41:14
 */
const Base64 = require('../lib');
console.log(Base64);
const base64 = new Base64.default();
const testStr = '测试';
const encodeStr = base64.encode(testStr);
const decodeStr = base64.decode(encodeStr);
console.log(encodeStr);
console.log(decodeStr);
console.log(decodeStr == testStr);
