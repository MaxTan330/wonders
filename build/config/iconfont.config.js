/**
 * @Author: MaxTan
 * @Description: iconfont的构建配置文件
 * @Date: 2020/12/23 15:29:44
 */
const path = require('path');
const { series, src, dest } = require('gulp');
const gulpWatch = require('gulp-watch');
const gulpTs = require('gulp-typescript');
const tsProject = gulpTs.createProject('tsconfig.json');
const gulpClean = require('gulp-clean');
const projectName = 'iconfont';
const srcPath = path.join(__dirname, `../../packages/${projectName}`);
const config = {
    srcPath,
    outPath: path.join(srcPath, 'lib'),
    copyPath: path.join(srcPath, 'src/assets/**/*'),
    watchPath: path.join(srcPath, 'src/**/*'),
    tsPath: path.join(srcPath, 'src/**/*.ts'),
};
//清空lib目录
const cleanLib = () => {
    return src(config.outPath, { read: false, allowEmpty: true }).pipe(gulpClean({ force: true }));
};
//拷贝assets文件夹
const copyAssets = () => {
    return src(config.copyPath).pipe(dest(`${config.outPath}/assets`));
};
//编译ts任务
const tsTask = () => {
    return src(config.tsPath).pipe(tsProject()).pipe(dest(config.outPath));
};
//单任务编译
const singleTask = series(copyAssets, tsTask);
//监听任务编译
const watchTask = () => {
    return gulpWatch(config.watchPath, singleTask);
};
const devTask = series(cleanLib, tsTask, watchTask);
const buildTask = series(cleanLib, tsTask);
module.exports = {
    devTask,
    buildTask,
};
