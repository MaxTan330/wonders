/**
 * @Author: MaxTan
 * @Description: iconfont入口文件
 * @Date: 2019/12/16 17:13:52
 */
// const SVGIcons2SVGFontStream = require('svgicons2svgfont');
const webfontsGenerator = require('webfonts-generator');
// import { generateFonts } from './generate';
// import path from 'path';
webfontsGenerator(
    {
        files: ['./lib/assets/svgs/test.svg','./lib/assets/svgs/history.svg','./lib/assets/svgs/eye_protection.svg','./lib/assets/svgs/nickname.svg'],
        dest: 'dest',
        cssTemplate: './lib/assets/template/css.hbs',
        types: ['eot', 'woff2', 'woff', 'ttf', 'svg'],
        html: true,
        htmlTemplate: './lib/assets/template/html2.hbs'
    },
    function(err: any,result: any) {
        if (err) {
            console.log(err);
        }
    }
);
