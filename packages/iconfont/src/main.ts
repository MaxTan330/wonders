/**
 * @Author: MaxTan
 * @Description: iconfont入口文件
 * @Date: 2019/12/16 17:13:52
 */
// const SVGIcons2SVGFontStream = require('svgicons2svgfont');
const webfontsGenerator = require('webfonts-generator');
import fs from 'fs';
webfontsGenerator(
    {
        files: ['./lib/assets/svgs/test.svg'],
        dest: 'dest/'
    },
    function(error: any) {
        if (error) {
            console.log('Fail!', error);
        } else {
            console.log('Done!');
        }
    }
);
