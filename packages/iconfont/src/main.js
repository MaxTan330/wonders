/**
 * @Author: MaxTan
 * @Description: wonders-icon入口文件
 * @Date: 2019/12/16 17:13:52
 */
const { series, src, dest } = require('gulp');
const path = require('path');
const gulpClean = require('gulp-clean');
const gulpWatch = require('gulp-watch');
const gulpIconfont = require('gulp-iconfont');
const iconfontCss = require('gulp-iconfont-css');
const baseName = 'wonders-icons';
const gulpTemplate = require('gulp-template');
const assetsPath = path.join(__dirname, '../assets/');
const buildPath = path.resolve(__dirname, '../build/');
const gulpReplace = require('gulp-replace');
const parser = require('./utils');
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
const compileHtml = () => {
    return;
};
const iconfont = done => {
    const svgPath = path.join(assetsPath, 'svgs/*.svg');
    const template = path.join(assetsPath, 'css/template.scss');
    const fontPath = path.join(buildPath, 'font');
    console.log(fontPath);
    const targetPath = path.join(buildPath, `css/${baseName}.css`);
    src(svgPath)
        .pipe(
            iconfontCss({
                fontName: baseName,
                path: template,
                fontPath: fontPath,
                cssClass: baseName,
                targetPath: targetPath
            })
        )
        .pipe(
            gulpIconfont({
                formats: ['svg', 'ttf', 'eot', 'woff', 'woff2'],
                fontName: baseName
            })
        )
        .on('glyphs', function(glyphs) {
            console.log(glyphs);
        })
        .pipe(dest(buildPath));
    done && done();
};
const wordtohtml = async done => {
    const wordPath = path.join(assetsPath, 'test.docx');
    //读取数据
    const items = await parser(wordPath);
    const htmlPath = path.join(assetsPath, 'word.template.html');
    src(htmlPath)
        .pipe(gulpTemplate({ items }))
        .pipe(dest(buildPath));
    done && done();
};
const babel = require('gulp-babel');
const webpack = require('webpack-stream');
const buildRsa = async done => {
    src(['./rsa.js'])
        .pipe(webpack({}))
        .pipe(
            babel({
                presets: ['@babel/env'],
                plugins: ['@babel/transform-runtime']
            })
        )
        .pipe(dest('dist'));
    done && done();
};
// exports.default = series(clean, move, iconfont, watch);
exports.default = series(clean, wordtohtml);
