/**
 * @Author: MaxTan
 * @Description: wonders-icon入口文件
 * @Date: 2019/12/16 17:13:52
 */
const { series, src, dest } = require('gulp');
const gulpClean = require('gulp-clean');
const gulpWatch = require('gulp-watch');
const gulpIconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const fontName = 'wonders-icons';
const watch = () => {
    return gulpWatch('../assets/*', () => {
        series(clean, move, iconfont); //执行任务
    });
};
const clean = () => {
    return src('../build', { read: false }).pipe(gulpClean({ force: true }));
};
const move = done => {
    src('../assets/css/demo.css').pipe(dest('../build/css'));
    src('../assets/index.html').pipe(dest('../build'));
    done && done();
};
const iconfont = done => {
    src('../assets/svgs/*.svg')
        .pipe(
            iconfontCss({
                fontName: fontName,
                path: '../assets/css/template.scss',
                fontPath: '../build/',
                cssClass: 'wonders-icons',
                targetPath: 'css/wonders-icons.css'
            })
        )
        .pipe(
            gulpIconfont({
                formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
                fontName: fontName
            })
        )
        .pipe(dest('../build'));
    done && done();
};
exports.default = series(clean, move, iconfont, watch);
