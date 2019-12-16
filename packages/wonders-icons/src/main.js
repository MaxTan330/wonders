/**
 * @Author: MaxTan
 * @Description: wonders-icon入口文件
 * @Date: 2019/12/16 17:13:52
 */
const gulp = require('gulp');
const iconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const fontName = 'icons';
gulp.task('default', function() {
    gulp.src(['../assets/svgs/test.svg'])
        .pipe(
            iconfontCss({
                fontName: fontName,
                path: '../assets/css/icon.scss',
                fontPath: '../../fonts/icons/'
            })
        )
        .pipe(
            iconfont({
                fontName: fontName
            })
        )
        .pipe(gulp.dest('../assets/fonts/icons/'));
});
