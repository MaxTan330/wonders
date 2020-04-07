# @maxtan/tohtml

## Node environment dependency

Node environment requires more than v10

[Chinese document](https://www.runoob.com/html/html-tutorial.html)

## Install as package dependent

    npm install @maxtan/tohtml

or using yarn:

    yarn add @maxtan/tohtml

## Use as package dependency

    const toHtml = require('@maxtan/tohtml');
    const path = require('path');
    //Basic use
    const testInit= async () => {
        const workOptions = {
            targetPath : path.resolve(__dirname,'./test.docx'), //Source file path
            templatePath : path.resolve(__dirname,'./test.template.html'),  //Template path
            isWirteFile : false //Write file or not
        };
        const htmlStr = await toHtml.compiledToHtml(workOptions);
        console.log(htmlStr);
    };
    testInit();

### Configurable parameters

| Parameter name | describe          | type    | Remarks                                                                                                                                                               |
| -------------- | ----------------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| targetPath     | Source file path  | string  | Incoming absolute address                                                                                                                                             |
| templatePath   | Template path     | string  | Using lodash template syntax                                                                                                                                          |
| isWirteFile    | Write file or not | boolean | Method calls usually do not write to files. When calling the 'compiledtohtml' method, the default is false. When calling the 'docxtohtml' method, the default is true |

## Install as command line tool

    npm install @maxtan/tohtml -g

## Command line use

    tohtml ./test.docx

### Custom template

    tohtml ./test.docx -t test.template.html
