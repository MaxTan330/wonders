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
import SVGSpriter from 'svg-sprite';
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
export interface IconfontOptions {
    files?: Array<string>;
    filesDest: string;
    dest: string;
    fontName?: string;
    types?: Array<'eot' | 'woff2' | 'woff' | 'ttf' | 'svg'>;
    cssTpl?: string;
    jsTpl?: string;
    htmlTpl?: string;
    writeFiles?: boolean;
}
type Fonts = {
    name: string;
    unicode: string;
};
export class Iconfont {
    /**
     * svg转换成svg Symbols
     * @param files 文件集合
     */
    public async svgtoSymbols(files: Array<string>): Promise<string> {
        const spriterConfig = {
            mode: {
                symbol: true
            },
            svg: {
                doctypeDeclaration: false,
                xmlDeclaration: false
            },
            shape: {
                id: {
                    generator: (name: any) => {
                        const id = path.basename(name, path.extname(name));
                        return id;
                    }
                }
            }
        };
        return new Promise((resolve, reject) => {
            if (files && files.length) {
                const spriter = new SVGSpriter(spriterConfig);
                files.forEach(svgFile => {
                    //添加编译文件
                    spriter.add(path.resolve(svgFile), '', fs.readFileSync(svgFile, { encoding: 'utf-8' }));
                });
                //开始编译
                spriter.compile((error: any, result: any) => {
                    if (error) {
                        console.error(error);
                        reject(error);
                    } else {
                        for (const mode in result) {
                            for (const resource in result[mode]) {
                                //返回编译结果
                                resolve(result[mode][resource].contents);
                            }
                        }
                    }
                });
            } else {
                console.error('没有文件可处理');
                reject();
            }
        });
    }

    /**
     * svg装换成fontsvg
     * @param options 参数
     */
    public svgtoFontsvg(files: Array<string>): Promise<{ fontData: Array<Fonts>; buffers: Buffer }> {
        const result: Array<Fonts> = [];
        return new Promise((resolve, reject) => {
            const buffers: Array<Buffer> = [];
            fontStream
                .on('finish', () => {
                    resolve({
                        fontData: result,
                        buffers: Buffer.concat(buffers)
                    });
                })
                .on('error', (err: any) => {
                    reject(err);
                });
            if (files && files.length) {
                files.forEach(svgFile => {
                    const fileName = path.basename(svgFile, path.extname(svgFile));
                    const glyph: LooseObject = fs.createReadStream(svgFile);
                    let ligature = 0xa001;
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
            } else {
                console.error('没有文件可处理');
                reject();
            }
            fontStream.on('data', (data: Buffer) => {
                buffers.push(data);
            });
            fontStream.end();
        });
    }

    /**
     * 初始化函数
     */
    public async init(options: IconfontOptions): Promise<void> {
        const defaultOptions: IconfontOptions = {
            types: ['eot', 'woff2', 'woff', 'ttf', 'svg'],
            dest: path.join(__dirname, './'),
            fontName: 'iconfont',
            writeFiles: true,
            filesDest: path.join(__dirname, './'),
            files: [],
            cssTpl: path.join(__dirname, './assets/template/css.tpl'),
            jsTpl: path.join(__dirname, './assets/template/js.tpl'),
            htmlTpl: path.join(__dirname, './assets/template/html.tpl')
        };
        //svgfont参数
        const fontSvgOptions: IconfontOptions = Object.assign(defaultOptions, options);
        const destPath = path.join(fontSvgOptions.dest);
        //递归读取文件夹下的的文件
        if (fontSvgOptions.filesDest) {
            if (utils.isDirectory(fontSvgOptions.filesDest)) {
                fontSvgOptions.files = [];
                const svgFiles = utils.readDirFiles(fontSvgOptions.filesDest);
                console.log(svgFiles);
                console.log(fontSvgOptions.filesDest);
                svgFiles.forEach(item => {
                    //只处理svg文件
                    if (path.extname(item) == '.svg') {
                        fontSvgOptions.files && fontSvgOptions.files.push(path.join(fontSvgOptions.filesDest, item));
                    }
                });
            }
        }
        if (fontSvgOptions.files && fontSvgOptions.files.length) {
            // 检查文件夹是否存在，存在则清空
            utils.isDirectory(destPath) && utils.delDirectory(destPath);
            //创建文件夹
            const mkFlag = await utils.mkdir(destPath);
            if (mkFlag) {
                //基础的输出目录
                const basePath = `${destPath}/${fontSvgOptions.fontName}`;
                //svg转换成fontSvg
                const fontSvgs = await this.svgtoFontsvg(fontSvgOptions.files);
                //svg转换成symbols
                const symbols = await this.svgtoSymbols(fontSvgOptions.files);
                //字体引用地址路径
                let fontSrc = '';
                //获取svg Buffer
                const ttfBuff = this.fontsvgtoTtf(fontSvgs.buffers);
                //buffer转换
                if (_.includes(fontSvgOptions.types, 'ttf')) {
                    const ttfUrl = `url("${fontSvgOptions.fontName}.ttf") format("truetype")`;
                    fontSrc += fontSrc == '' ? ttfUrl : `,${ttfUrl}`;
                    fs.writeFileSync(`${basePath}.ttf`, this.ttftoWoff(ttfBuff));
                }
                if (_.includes(fontSvgOptions.types, 'eot')) {
                    const eotUrl = `url("${fontSvgOptions.fontName}.eot")`;
                    fontSrc += fontSrc == '' ? eotUrl : `,${eotUrl}`;
                    fs.writeFileSync(`${basePath}.eot`, this.ttftoEot(ttfBuff));
                }
                if (_.includes(fontSvgOptions.types, 'woff')) {
                    const woffUrl = `url("${fontSvgOptions.fontName}.woff") format("woff")`;
                    fontSrc += fontSrc == '' ? woffUrl : `,${woffUrl}`;
                    fs.writeFileSync(`${basePath}.woff`, this.ttftoWoff(ttfBuff));
                }
                if (_.includes(fontSvgOptions.types, 'woff2')) {
                    const woff2Url = `url("${fontSvgOptions.fontName}.woff2") format("woff2")`;
                    fontSrc += fontSrc == '' ? woff2Url : `,${woff2Url}`;
                    fs.writeFileSync(`${basePath}.woff2`, this.ttftoWoff2(ttfBuff));
                }
                //读取模板文件
                const cssTpl = fontSvgOptions.cssTpl && (await utils.readFile(fontSvgOptions.cssTpl));
                const htmlTpl = fontSvgOptions.htmlTpl && (await utils.readFile(fontSvgOptions.htmlTpl));
                const jsTpl = fontSvgOptions.jsTpl && (await utils.readFile(fontSvgOptions.jsTpl));
                //编译模板
                const cssCompiled = _.template(cssTpl);
                const htmlCompiled = _.template(htmlTpl);
                const jsCompiled = _.template(jsTpl);
                const cssStr = cssCompiled({
                    fontName: fontSvgOptions.fontName,
                    items: fontSvgs.fontData,
                    fontSrc: fontSrc
                });
                const htmlStr = htmlCompiled({ items: fontSvgs.fontData });
                const jsStr = jsCompiled({ svgData: symbols });
                //写入编译结果
                utils.writeFile(`${basePath}.css`, cssStr);
                utils.writeFile(`${basePath}.html`, htmlStr);
                utils.writeFile(`${basePath}.js`, jsStr);
                const demoCssPath = path.join(__dirname, './assets/template/demo.css');
                console.log(demoCssPath);
                utils.writeFile(`${destPath}/demo.css`, await utils.readFile(demoCssPath));
            } else {
                console.error('文件夹创建失败');
            }
        } else {
            console.error('没有需要处理的文件');
        }
    }

    /**
     * fontSvg转ttf字节
     * @param svgBuff svg字节
     */
    public fontsvgtoTtf(svgBuff: Buffer): Buffer {
        const ttf = svg2ttf(svgBuff.toString());
        return Buffer.from(ttf.buffer);
    }

    /**
     * ttf字节转woff字节
     * @param ttfBuff ttf字节
     */
    public ttftoWoff(ttfBuff: Buffer): Buffer {
        const font = ttf2woff(new Uint8Array(ttfBuff));
        return Buffer.from(font.buffer);
    }

    /**
     * ttf字节转woff2字节
     * @param ttfBuff ttf字节
     */
    public ttftoWoff2(ttfBuff: Buffer): Buffer {
        const font = ttf2woff2(new Uint8Array(ttfBuff));
        return Buffer.from(font.buffer);
    }

    /**
     * ttf字节转eot字节
     * @param ttfBuff ttf字节
     */
    public ttftoEot(ttfBuff: Buffer): Buffer {
        const font = ttf2eot(new Uint8Array(ttfBuff));
        return Buffer.from(font.buffer);
    }
}
