#!/usr/bin/env node
/**
 * @Author: MaxTan
 * @Description: 命令行工具
 * @Date: 2019/12/23 14:03:00
 */
import program from 'commander';
import { readFile, isDirectory } from './utils';
import * as path from 'path';
import { Iconfont, IconfontOptions } from './main';
const getVersions = async (): Promise<string> => {
    const packageObj = await readFile(path.join(__dirname, '../package.json'));
    return JSON.parse(packageObj).version;
};
const initCli = async () => {
    const version = await getVersions();
    program.version(version);
    program.option('-csstpl --cssTemplate <cssTemplate>');
    program.option('-jstpl --jsTemplate <jsTemplate>');
    program.option('-o --outPath <outPath>');
    program.option('-n --fontName <fontName>');
    program.parse(process.argv);
    const workOptions: IconfontOptions = {};
    if (program.args[0]) {
        const filePath = path.resolve(program.args[0]);
        if (isDirectory(filePath)) {
            workOptions.filesDest = filePath;
        } else {
            workOptions.filesDest = undefined;
            workOptions.files = [program.args[0]];
        }
    } else {
        console.error('参数异常');
        process.exit(1);
    }
    program.cssTemplate && (workOptions.cssTpl = path.resolve(program.cssTemplate));
    program.jsTemplate && (workOptions.jsTpl = path.resolve(program.jsTemplate));
    workOptions.dest = program.outPath ? path.resolve(program.outPath) : './dist';
    workOptions.fontName = program.fontName ? program.fontName : 'iconfont';
    const iconfont = new Iconfont();
    iconfont.init(workOptions);
};
initCli();
