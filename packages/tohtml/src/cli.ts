#!/usr/bin/env node
/**
 * @Author: MaxTan
 * @Description: 命令行工具
 * @Date: 2019/12/23 14:03:00
 */
import program from 'commander';
import { readFile } from './utils';
import * as path from 'path';
import { docxtohtml } from './main';
const getVersions = async (): Promise<string> => {
    const packageObj = await readFile(path.join(__dirname, '../package.json'));
    return JSON.parse(packageObj).version;
};
const initCli = async () => {
    const version = await getVersions();
    program.version(version);
    program.option('-t --template <template>');
    program.option('-r --recursive <recursive>');
    program.parse(process.argv);
    const workOptions: any = {};
    if (program.args[0]) {
        workOptions.targetPath = program.args[0];
    } else {
        console.error('参数异常');
        process.exit(1);
    }
    program.template && (workOptions.templatePath = program.template);
    program.recursive && (workOptions.recursionFlag = program.recursive);
    docxtohtml(workOptions);
};
initCli();
