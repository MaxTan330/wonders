/**
 *  @des wonder-tohtml入口文件
 *  @author MaxTan
 *  @date 2019/12/20
 */
import { src, dest } from 'gulp';
import * as path from 'path';
// import gulpReplace from 'gulp-replace';
const gulpTemplate = require('gulp-template');
const gulpClean = require('gulp-clean');
import { docxParser } from './parser';
const buildPath = path.resolve(__dirname, '../build/');
const assetsPath = path.join(__dirname, '../assets/');
//清除构建目录
const taskClean = () => {
    return src(buildPath, { allowEmpty: true, read: false }).pipe(gulpClean({ force: true }));
};
interface WorkOptions {
    targetPath: string; //源文件路径
    templatePath: string; //模板路径
}
//docxhtml转换成html
const docxtohtml = async function(options?: WorkOptions) {
    console.log(options);
    const wordPath = path.join(assetsPath, 'test.docx');
    const htmlPath = path.join(assetsPath, 'template/base.template.html');
    const items = await docxParser(wordPath);
    //读取数据
    return src(htmlPath)
        .pipe(gulpTemplate({ items }))
        .pipe(dest(buildPath));
};
// series(taskClean,docxtohtml);
export { taskClean, docxtohtml };
