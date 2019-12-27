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
const cleanTohtmlLib = () => {
    return src(tohtmlConf.outPath, { read: false, allowEmpty: true }).pipe(gulpClean({ force: true }));
};
const copyTohtml = () => {
    return src(`${tohtmlConf.projectPath}/src/assets/**/*`).pipe(dest(`${tohtmlConf.outPath}/assets`));
};
const tsTohtmlTask = () => {
    return src(`${tohtmlConf.projectPath}/src/**/*.ts`)
        .pipe(tsProject())
        .pipe(dest(tohtmlConf.outPath));
};
const cleanIconfontLib = () => {
    return src(iconfontConf.outPath, { read: false, allowEmpty: true }).pipe(gulpClean({ force: true }));
};
const copyIconfont = () => {
    return src(`${iconfontConf.projectPath}/src/assets/**/*`).pipe(dest(`${iconfontConf.outPath}/assets`));
};
const tsIconfontTask = () => {
    return src(`${iconfontConf.projectPath}/src/**/*.ts`)
        .pipe(tsProject())
        .pipe(dest(iconfontConf.outPath));
};
const IconfontTask = series(copyIconfont, tsIconfontTask);
const watchBuild = () => {
    return gulpWatch(`${iconfontConf.projectPath}/src/**/*.ts`, IconfontTask);
};
const tohtmlTask = series(cleanTohtmlLib, tsTohtmlTask, copyTohtml);
exports.default = series(cleanIconfontLib, IconfontTask, watchBuild);
