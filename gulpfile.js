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
    outPath: './packages/tohtml/lib',
};
const iconfontConf = {
    projectPath: './packages/iconfont',
    outPath: './packages/iconfont/lib',
};
const base64Conf = {
    projectPath: './packages/base64',
    outPath: './packages/base64/lib',
};
const ntsRouterConf = {
    projectPath: './packages/nts-router',
    outPath: './packages/nts-router/lib',
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
    return src(`${tohtmlConf.projectPath}/src/**/*.ts`).pipe(tsProject()).pipe(dest(tohtmlConf.outPath));
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
    return src(`${iconfontConf.projectPath}/src/**/*.ts`).pipe(tsProject()).pipe(dest(iconfontConf.outPath));
};
//清空base64的lib目录
const cleanBase64Lib = () => {
    return src(base64Conf.outPath, { read: false, allowEmpty: true }).pipe(gulpClean({ force: true }));
};
//编译base64 项目ts文件
const tsBase64Task = () => {
    return src(`${base64Conf.projectPath}/src/**/*.ts`).pipe(tsProject()).pipe(dest(base64Conf.outPath));
};
//清空nts-router的lib目录
const cleanNtsRouterLib = () => {
    return src(ntsRouterConf.outPath, { read: false, allowEmpty: true }).pipe(gulpClean({ force: true }));
};
//编译nts-router项目ts文件
const tsNtsRouterTask = () => {
    return src(`${ntsRouterConf.projectPath}/src/**/*.ts`).pipe(tsProject()).pipe(dest(ntsRouterConf.outPath));
};
const IconfontSingleTask = series(copyIconfont, tsIconfontTask);
const TohtmlSingleTask = series(copyTohtml, tsTohtmlTask);
const Base64SingleTask = series(tsBase64Task);
const NtsRouterSingleTask = series(tsNtsRouterTask);
//监听tohtml编译任务
const watchBuildTohtml = () => {
    return gulpWatch(`${tohtmlConf.projectPath}/src/**/*`, TohtmlSingleTask);
};
//监听iconfont编译任务
const watchBuildIconfont = () => {
    return gulpWatch(`${iconfontConf.projectPath}/src/**/*`, IconfontSingleTask);
};
//监听base64编译任务
const watchBuildBase64 = () => {
    return gulpWatch(`${base64Conf.projectPath}/src/**/*`, Base64SingleTask);
};
//监听nts-router编译任务
const watchBuildNtsRouter = () => {
    return gulpWatch(`${ntsRouterConf.projectPath}/src/**/*`, NtsRouterSingleTask);
};
//tohtml 开发任务
const tohtmlDev = series(cleanTohtmlLib, TohtmlSingleTask, watchBuildTohtml);
//iconfont 开发任务
const iconfontDev = series(cleanIconfontLib, IconfontSingleTask, watchBuildIconfont);
//base64 开发任务
const base64Dev = series(cleanBase64Lib, Base64SingleTask, watchBuildBase64);
//nts-router 开发任务
const ntsRouterDev = series(cleanNtsRouterLib, NtsRouterSingleTask, watchBuildNtsRouter);
//tohtml 构建任务
const tohtmlBuild = series(cleanTohtmlLib, TohtmlSingleTask);
//iconfont 构建任务
const iconfontBuild = series(cleanIconfontLib, IconfontSingleTask);
//base64 构建任务
const base64Build = series(cleanBase64Lib, Base64SingleTask);
//nts-router 构建任务
const ntsRouterBuild = series(cleanNtsRouterLib, NtsRouterSingleTask);

exports.tohtmlDev = tohtmlDev;
exports.iconfontDev = iconfontDev;
exports.tohtmlBuild = tohtmlBuild;
exports.iconfontBuild = iconfontBuild;
exports.base64Dev = base64Dev;
exports.base64Build = base64Build;
exports.ntsRouterDev = ntsRouterDev;
exports.ntsRouterBuild = ntsRouterBuild;
