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
interface IconfontOptions {
    files: Array<string>;
    filesDest: string;
    dest: string;
    fontName: string;
    types: Array<'eot' | 'woff2' | 'woff' | 'ttf' | 'svg'>;
    writeFiles: boolean;
}
type Fonts = {
    name: string;
    unicode: string;
};
export class Iconfont {
    constructor() {
        this.init();
    }

    /**
     * svg转换成svg Symbols
     * @param files 文件集合
     */
    private async svgtoSymbols(files: Array<string>): Promise<string> {
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
    private svgtoFontsvg(files: Array<string>): Promise<{ fontData: Array<Fonts>; buffers: Buffer }> {
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
    private async init(): Promise<void> {
        const defaultOptions: IconfontOptions = {
            types: ['eot', 'woff2', 'woff', 'ttf', 'svg'],
            dest: './dist',
            fontName: 'iconfont',
            writeFiles: true,
            filesDest: './lib/assets/svgs',
            files: []
        };
        const destPath = path.join(defaultOptions.dest);
        //递归读取文件夹下的的文件
        if (defaultOptions.filesDest) {
            if (utils.isDirectory(defaultOptions.filesDest)) {
                defaultOptions.files = [];
                const svgFiles = utils.readDirFiles(defaultOptions.filesDest);
                svgFiles.forEach(item => {
                    //只处理svg文件
                    if (path.extname(item) == '.svg') {
                        defaultOptions.files.push(path.join(defaultOptions.filesDest, item));
                    }
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
            const fontSvgOptions: IconfontOptions = Object.assign(defaultOptions, {});
            //svg转换成fontSvg
            const fontSvgs = await this.svgtoFontsvg(fontSvgOptions.files);
            //svg转换成symbols
            const symbols = await this.svgtoSymbols(fontSvgOptions.files);
            //字体引用地址路径
            let fontSrc = '';
            //获取svg Buffer
            const ttfBuff = this.fontsvgtoTtf(fontSvgs.buffers);
            //buffer转换
            if (_.includes(defaultOptions.types, 'ttf')) {
                const ttfUrl = `url("${defaultOptions.fontName}.ttf") format("truetype")`;
                fontSrc += fontSrc == '' ? ttfUrl : `,${ttfUrl}`;
                fs.writeFileSync(`${basePath}.ttf`, this.ttftoWoff(ttfBuff));
            }
            if (_.includes(defaultOptions.types, 'eot')) {
                const eotUrl = `url("${defaultOptions.fontName}.eot")`;
                fontSrc += fontSrc == '' ? eotUrl : `,${eotUrl}`;
                fs.writeFileSync(`${basePath}.eot`, this.ttftoEot(ttfBuff));
            }
            if (_.includes(defaultOptions.types, 'woff')) {
                const woffUrl = `url("${defaultOptions.fontName}.woff") format("woff")`;
                fontSrc += fontSrc == '' ? woffUrl : `,${woffUrl}`;
                fs.writeFileSync(`${basePath}.woff`, this.ttftoWoff(ttfBuff));
            }
            if (_.includes(defaultOptions.types, 'woff2')) {
                const woff2Url = `url("${defaultOptions.fontName}.woff2") format("woff2")`;
                fontSrc += fontSrc == '' ? woff2Url : `,${woff2Url}`;
                fs.writeFileSync(`${basePath}.woff2`, this.ttftoWoff2(ttfBuff));
            }
            //读取模板文件
            const cssTpl = await utils.readFile('./lib/assets/template/css.tpl');
            const htmlTpl = await utils.readFile('./lib/assets/template/html.tpl');
            const jsTpl = await utils.readFile('./lib/assets/template/js.tpl');
            //编译模板
            const cssCompiled = _.template(cssTpl);
            const htmlCompiled = _.template(htmlTpl);
            const jsCompiled = _.template(jsTpl);
            const cssStr = cssCompiled({
                fontName: defaultOptions.fontName,
                items: fontSvgs.fontData,
                fontSrc: fontSrc
            });
            const htmlStr = htmlCompiled({ items: fontSvgs.fontData });
            const jsStr = jsCompiled({ svgData: symbols });
            //写入编译结果
            utils.writeFile(`${basePath}.css`, cssStr);
            utils.writeFile(`${basePath}.html`, htmlStr);
            utils.writeFile(`${basePath}.js`, jsStr);
            utils.writeFile(`${destPath}/demo.css`, await utils.readFile('./lib/assets/template/demo.css'));
        } else {
            console.error('文件夹创建失败');
        }
    }
    /**
     *
     * @param svgBuff svg字节
     */
    private fontsvgtoTtf(svgBuff: Buffer): Buffer {
        const ttf = svg2ttf(svgBuff.toString());
        return Buffer.from(ttf.buffer);
    }

    /**
     * ttf字节转woff字节
     * @param ttfBuff ttf字节
     */
    private ttftoWoff(ttfBuff: Buffer): Buffer {
        const font = ttf2woff(new Uint8Array(ttfBuff));
        return Buffer.from(font.buffer);
    }

    /**
     * ttf字节转woff2字节
     * @param ttfBuff ttf字节
     */
    private ttftoWoff2(ttfBuff: Buffer): Buffer {
        const font = ttf2woff2(new Uint8Array(ttfBuff));
        return Buffer.from(font.buffer);
    }

    /**
     * ttf字节转eot字节
     * @param ttfBuff ttf字节
     */
    private ttftoEot(ttfBuff: Buffer): Buffer {
        const font = ttf2eot(new Uint8Array(ttfBuff));
        return Buffer.from(font.buffer);
    }
}
const iconfont = new Iconfont();
