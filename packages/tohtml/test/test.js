const toHtml = require('@maxtan/tohtml');
const path = require('path');
//基本使用
const testInit= async () => {
    const workOptions = {
        targetPath : path.resolve(__dirname,'./test.docx'), //源代码路径
        templatePath : path.resolve(__dirname,'./test.template.html'),  //模板路径
        isWirteFile : false //是否写入文件
    };
    const htmlStr = await toHtml.compiledToHtml(workOptions);
    console.log(htmlStr);
};
testInit();
