/**
 * @Author: MaxTan
 * @Description: gulp构建文件
 * @Date: 2019/12/19 10:58:30
 */
const { series, src, dest } = require('gulp');
const path = require('path');
const gulpClean = require('gulp-clean');
const gulpWatch = require('gulp-watch');
const buildPath = path.resolve(__dirname, '../build/');
const clean = () => {
    return src(buildPath, { read: false }).pipe(gulpClean({ force: true }));
};
const wordtohtml = async done => {
    const wordPath = path.join(assetsPath, 'test.docx');
    //读取数据
    const items = await parser(wordPath)
    const htmlPath = path.join(assetsPath, 'word.template.html');
    src(htmlPath)
        .pipe(gulpTemplate({ items }))
        .pipe(dest(buildPath))
    done && done();
};

