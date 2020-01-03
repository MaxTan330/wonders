/**
 * @Author: MaxTan
 * @Description: svg字体项目
 * @Date: 2020/01/02 15:16:13
 */
const SVGIcons2SVGFontStream = require('svgicons2svgfont');
const svg2ttf = require('svg2ttf');
const ttf2woff = require('ttf2woff');
const ttf2woff2 = require('ttf2woff2');
const ttf2eot = require('ttf2eot');
import _ from 'lodash';
import * as utils from './utils';
import fs from 'fs';
import path from 'path';
const fontStream = new SVGIcons2SVGFontStream({
    fontName: 'iconfont'
});
type LooseObject = {
    [key: string]: any;
};
interface DefaultOptions {
    files: Array<string>;
    filesDest: string;
    dest: string;
    fontName: string;
    types: Array<'eot' | 'woff2' | 'woff' | 'ttf' | 'svg'>;
    writeFiles: boolean;
}
type FontSvgOptions = DefaultOptions & {
    writePath: string;
};
type Fonts = {
    name: string;
    unicode: string;
};
export class Iconfont {
    constructor() {
        this.init();
    }
    private svgtoFontsvg(options: FontSvgOptions): Promise<Array<Fonts>> {
        const writePath = options.writePath;
        const result: Array<Fonts> = [];
        return new Promise((resolve, reject) => {
            fontStream
                .pipe(fs.createWriteStream(writePath))
                .on('finish', () => {
                    resolve(result);
                })
                .on('error', (err: any) => {
                    console.log(err);
                    reject();
                });
            if (options.files instanceof Array) {
                options.files.forEach(svgFile => {
                    const fileName = path.basename(svgFile, path.extname(svgFile));
                    const glyph: LooseObject = fs.createReadStream(svgFile);
                    let ligature = 0xA001;
                    for (let i = 0; i < fileName.length; i++) {
                        ligature += fileName.charCodeAt(i);
                    }
                    glyph.metadata = {
                        unicode: [String.fromCharCode(ligature)],
                        name: fileName
                    };
                    result.push({
                        name: fileName,
                        unicode: Number(ligature)
                            .toString(16)
                            .toLocaleUpperCase()
                    });
                    fontStream.write(glyph);
                });
            }
            fontStream.end();
        });
    }
    private async init(): Promise<void> {
        const defaultOptions: DefaultOptions = {
            types: ['eot', 'woff2', 'woff', 'ttf', 'svg'],
            dest: './dist',
            fontName: 'iconfont',
            writeFiles: true,
            filesDest: './lib/assets/svgs',
            files: ['./lib/assets/svgs']
        };
        const destPath = path.join(defaultOptions.dest);
        if (defaultOptions.filesDest) {
            if (utils.isDirectory(defaultOptions.filesDest)) {
                defaultOptions.files = [];
                const svgFiles = utils.readDirFiles(defaultOptions.filesDest);
                svgFiles.forEach(item => {
                    defaultOptions.files.push(path.join(defaultOptions.filesDest, item));
                });
            }
        }
        // 检查文件夹是否存在，存在则清空
        utils.isDirectory(destPath) && utils.delDirectory(destPath);
        //创建文件夹
        const mkFlag = await utils.mkdir(destPath);
        if (mkFlag) {
            //基础的输出目录
            const basePath = `${destPath}/${defaultOptions.fontName}`;
            //svgfont参数
            const fontSvgOptions: FontSvgOptions = Object.assign(defaultOptions, {
                writePath: `${basePath}.svg`
            });
            //转换
            this.svgtoFontsvg(fontSvgOptions).then(async (data: Array<Fonts>) => {
                const cssTpl = await utils.readFile('./lib/assets/template/css.tpl');
                const htmlTpl = await utils.readFile('./lib/assets/template/html.tpl');
                console.log(data);
                const cssCompiled = _.template(cssTpl);
                const fontSrc = 'url("iconfont.ttf?78057823c41ae19beb3b8b19635fb5b0") format("truetype")';
                const cssStr = cssCompiled({ fontName: defaultOptions.fontName,items:data,fontSrc:fontSrc});
                const htmlCompiled = _.template(htmlTpl);
                utils.writeFile(`${basePath}.css`, cssStr);
                const htmlStr = htmlCompiled({ items:data});
                utils.writeFile(`${basePath}.html`, htmlStr);
                utils.writeFile(`${destPath}/demo.css`, await utils.readFile('./lib/assets/template/demo.css'));
                const readPath = fontSvgOptions.writePath;
                //获取ttf Buffer
                const ttfBuff = this.fontsvgtoTtf(readPath);
                if (_.includes(defaultOptions.types, 'ttf')) {
                    fs.writeFileSync(`${basePath}.ttf`, this.ttftoWoff(ttfBuff));
                }
                if (_.includes(defaultOptions.types, 'eot')) {
                    fs.writeFileSync(`${basePath}.eot`, this.ttftoWoff(ttfBuff));
                }
                if (_.includes(defaultOptions.types, 'woff')) {
                    fs.writeFileSync(`${basePath}.woff`, this.ttftoWoff(ttfBuff));
                }
                if (_.includes(defaultOptions.types, 'woff2')) {
                    fs.writeFileSync(`${basePath}.woff2`, this.ttftoWoff(ttfBuff));
                }
            });
        } else {
            console.error('文件夹创建失败');
        }
    }
    /**
     *
     * @param readPath fontsvg文件路径
     * @param writePath ttf文件路径
     */
    private fontsvgtoTtf(readPath: string): Buffer {
        const ttf = svg2ttf(fs.readFileSync(readPath, 'utf8'), {});
        return Buffer.from(ttf.buffer);
    }
    private ttftoWoff(ttfBuff: Buffer) {
        const font = ttf2woff(new Uint8Array(ttfBuff));
        return Buffer.from(font.buffer);
    }
    private ttftoWoff2(ttfBuff: Buffer) {
        const font = ttf2woff2(new Uint8Array(ttfBuff));
        return Buffer.from(font.buffer);
    }
    private ttftoEot(ttfBuff: Buffer) {
        const font = ttf2eot(new Uint8Array(ttfBuff));
        return Buffer.from(font.buffer);
    }
}
const iconfont = new Iconfont();
