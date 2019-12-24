/**
 * @Author: MaxTan
 * @Description: 命令行工具
 * @Date: 2019/12/23 14:03:00
 */
import program from 'commander';
import { docxtohtml } from './main';
import path from 'path';
program.option('[filePath] [targetPath]').action(function(cmd, env) {
    if (env.length >= 1) {
        const targetPath = path.resolve(__dirname, env[0]);
        docxtohtml({
            targetPath: targetPath,
        });
    }else{
        console.error('参数错误');
    }
});
program.parse(process.argv);
