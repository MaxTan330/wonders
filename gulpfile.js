/**
 * @Author: MaxTan
 * @Description: wonders-icon入口文件
 * @Date: 2019/12/16 17:13:52
 */
'use strict';
const { series, src, dest } = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const gulpClean = require('gulp-clean');
const tohtmlConf = {
    projectPath: './packages/tohtml',
    outPath: './packages/tohtml/lib'
};
const cleanLib = () => {
    return src(tohtmlConf.outPath, { read: false, allowEmpty: true }).pipe(gulpClean({ force: true }));
};
const copy = () => {
    return src(`${tohtmlConf.projectPath}/src/assets/**/*`).pipe(dest(`${tohtmlConf.outPath}/assets`));
};

const tsTask = () => {
    return src(`${tohtmlConf.projectPath}/src/**/*.ts`)
        .pipe(tsProject())
        .pipe(dest(tohtmlConf.outPath));
};
const tohtmlTask = series(cleanLib, tsTask, copy);
exports.default = series(tohtmlTask);
