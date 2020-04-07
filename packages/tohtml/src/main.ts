/**
 *  @des 文档转换成html
 *  @author MaxTan
 *  @date 2019/12/20
 */
import * as path from 'path';
import _ from 'lodash';
import { docxParser } from './parser';
import { readFile, writeFile, isDirectory, isFile, readFileByDirectory } from './utils';
const assetsPath = path.join(__dirname, './assets/');
const docxReg = /.docx$/;
const defaultTemplatePath = path.join(assetsPath, 'template/base.template.html');
interface WorkOptions {
    targetPath: string; //源文件路径
    templatePath?: string; //模板路径
    isWirteFile?: boolean; //是否写入文件
    recursionFlag?: boolean; //是否递归读取
}
/**
 *
 * @param targetPath 源文件路径
 */
const compiledToHtml = async (options: WorkOptions) => {
    const templatePath = options.templatePath || defaultTemplatePath;
    const items = await docxParser(options.targetPath);
    //读取模板文件
    const htmlTemp = await readFile(templatePath);
    const compiled = _.template(htmlTemp);
    let baseName = path.basename(options.targetPath);
    baseName = baseName.replace(docxReg, '');
    //编译模板数据
    const htmlStr = compiled({ items: items, baseName: baseName });
    const writePath = path.resolve(`${baseName}.html`);
    if (options.isWirteFile) {
        writeFile(writePath, htmlStr);
    } else {
        return { htmlStr };
    }
};
//docxhtml转换成html
const docxtohtml = async (options: WorkOptions) => {
    let defaultOptions = {
        targetPath: path.join(assetsPath, 'test.docx'),
        templatePath: defaultTemplatePath,
        isWirteFile: true,
        recursionFlag: false
    };
    defaultOptions = Object.assign(defaultOptions, options);
    if (await isDirectory(defaultOptions.targetPath)) {
        // 读取文件夹下的docx 文件
        const docxFiles = readFileByDirectory(defaultOptions.targetPath, defaultOptions.recursionFlag, docxReg);
        docxFiles.forEach(async (item) => {
            await compiledToHtml({
                targetPath: item,
                isWirteFile: defaultOptions.isWirteFile,
                templatePath: defaultOptions.templatePath,
            });
        });
    } else {
        if (await isFile(defaultOptions.targetPath)) {
            await compiledToHtml(defaultOptions);
        } else {
            console.error('参数无效');
        }
        return;
    }
};
export { docxtohtml, compiledToHtml };
