/**
 *  @des 文档转换成html
 *  @author MaxTan
 *  @date 2019/12/20
 */
import * as path from 'path';
import _ from 'lodash';
import { docxParser } from './parser';
import { readFile, writeFile } from './utils';
const assetsPath = path.join(__dirname, './assets/');
interface WorkOptions {
    targetPath: string; //源文件路径
    templatePath?: string; //模板路径
    isWirteFile?: boolean; //是否写入文件
}
//docxhtml转换成html
const docxtohtml = async (options: WorkOptions) => {
    let defaultOptions = {
        targetPath: path.join(assetsPath, 'test.docx'),
        templatePath: path.join(assetsPath, 'template/base.template.html'),
        isWirteFile: true
    };
    defaultOptions = Object.assign(defaultOptions, options);
    const items = await docxParser(defaultOptions.targetPath);
    //读取模板文件
    const htmlTemp = await readFile(defaultOptions.templatePath);
    const compiled = _.template(htmlTemp);
    //编译模板数据
    const htmlStr = compiled({ items });
    const writePath = path.resolve('index.html');
    if (defaultOptions.isWirteFile) {
        writeFile(writePath, htmlStr);
    } else {
        return { htmlStr };
    }
};
export { docxtohtml };
