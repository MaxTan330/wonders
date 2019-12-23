/**
 * @Author: MaxTan
 * @Description: 命令行工具
 * @Date: 2019/12/23 14:03:00
 */
import program from 'commander';
import { task, series } from 'gulp';
import { taskClean, docxtohtml } from './main';
program.option('[filePath] [targetPath]').action(function(cmd, env) {
    console.log(1);
    task(
        'default',
        function(){
            console.log(2);
        }
        // series(taskClean, function() {
        //     docxtohtml({
        //         targetPath: env[0],
        //         templatePath: env[1]
        //     });
        // })
    );
});
program.parse(process.argv);
