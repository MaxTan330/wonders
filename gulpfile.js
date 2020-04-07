/**
 * @Author: MaxTan
 * @Description: wonders-icon入口文件
 * @Date: 2019/12/16 17:13:52
 */
'use strict';
const { series, src, dest } = require('gulp');
const gulpWatch = require('gulp-watch');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const gulpClean = require('gulp-clean');
const tohtmlConf = {
    projectPath: './packages/tohtml',
    outPath: './packages/tohtml/lib'
};
const iconfontConf = {
    projectPath: './packages/iconfont',
    outPath: './packages/iconfont/lib'
};
//清空tohtml的lib目录
const cleanTohtmlLib = () => {
    return src(tohtmlConf.outPath, { read: false, allowEmpty: true }).pipe(gulpClean({ force: true }));
};
//拷贝tohtml的assets文件
const copyTohtml = () => {
    return src(`${tohtmlConf.projectPath}/src/assets/**/*`).pipe(dest(`${tohtmlConf.outPath}/assets`));
};
//编译tohtml 项目ts文件
const tsTohtmlTask = () => {
    return src(`${tohtmlConf.projectPath}/src/**/*.ts`)
        .pipe(tsProject())
        .pipe(dest(tohtmlConf.outPath));
};
//清空iconfont的lib目录
const cleanIconfontLib = () => {
    return src(iconfontConf.outPath, { read: false, allowEmpty: true }).pipe(gulpClean({ force: true }));
};
//拷贝iconfont的assets文件
const copyIconfont = () => {
    return src(`${iconfontConf.projectPath}/src/assets/**/*`).pipe(dest(`${iconfontConf.outPath}/assets`));
};
//编译iconfont 项目ts文件
const tsIconfontTask = () => {
    return src(`${iconfontConf.projectPath}/src/**/*.ts`)
        .pipe(tsProject())
        .pipe(dest(iconfontConf.outPath));
};
const IconfontSingleTask = series(copyIconfont, tsIconfontTask);
const TohtmlSingleTask = series(copyTohtml, tsTohtmlTask);
//监听tohtml编译任务
const watchBuildTohtml = () => {
    return gulpWatch(`${tohtmlConf.projectPath}/src/**/*`, TohtmlSingleTask);
};
//监听iconfont编译任务
const watchBuildIconfont = () => {
    return gulpWatch(`${iconfontConf.projectPath}/src/**/*`, IconfontSingleTask);
};
const TohtmlTask = series(cleanTohtmlLib, TohtmlSingleTask, watchBuildTohtml);
const IconfontTask = series(cleanIconfontLib, IconfontSingleTask, watchBuildIconfont);
exports.default = TohtmlTask;
