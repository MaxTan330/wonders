/**
 *  @des 工具类函数，基于node 10
 *  @author MaxTan
 *  @date 2019/12/20
 */
import * as fs from 'fs';
import { Stats } from 'fs';
import path from 'path';
interface ReadOptions {
    encoding: string; //源文件路径
    flag: string; //文件系统标志`
}
/**
 * 读取文件
 * @param curPath 路径
 * @param options
 */
const readFile = (curPath: string, options?: ReadOptions): Promise<string> => {
    const o = Object.assign({ encoding: 'utf8' }, options);
    return new Promise((resolve, reject) => {
        fs.readFile(curPath, o, (err, data) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};
/**
 * 写入文件
 * @param curPath 写入文件路径
 * @param data 写入数据
 * @param options 写入参数，默认utf8格式
 */
const writeFile = (curPath: string, data: string | Buffer, options?: ReadOptions): Promise<boolean> => {
    const o = Object.assign({ encoding: 'utf8' }, options);
    return new Promise(resolve => {
        fs.writeFile(curPath, data, o, err => {
            err && console.log(err);
            resolve(!err);
        });
    });
};
/**
 * 判断文件或文件夹是否存在
 * @param curPath 文件或文件夹路径
 */
const isExist = (curPath: string): false | Stats => {
    try {
        return fs.statSync(curPath);
    } catch (error) {
        return false;
    }
};
/**
 * 判断是否为文件夹
 * @param curPath 文件夹路径
 */
const isDirectory = (curPath: string): boolean => {
    const stats = isExist(curPath);
    if (stats) {
        return stats.isDirectory();
    } else {
        return false;
    }
};
/**
 * 创建文件夹
 * @param curPath 文件夹路径
 */
const mkdir = (curPath: string): Promise<boolean> => {
    return new Promise(resolve => {
        fs.mkdir(curPath, { recursive: true }, err => {
            resolve(!err);
        });
    });
};
/**
 * 清除文件夹
 * @param path 文件夹路径
 */
const delDirectory = (curPath: string) => {
    if (isDirectory(curPath)) {
        const files = fs.readdirSync(curPath);
        files.forEach(file => {
            const dirPath = `${curPath}/${file}`;
            if (fs.statSync(dirPath).isDirectory()) {
                delDirectory(dirPath); //递归删除文件夹
            } else {
                fs.unlinkSync(dirPath); //删除文件
            }
        });
        fs.rmdirSync(curPath);
    }
};

const readDirFiles = (curPath: string): Array<string> => {
    const result: Array<string> = [];
    if (isDirectory(curPath)) {
        const files = fs.readdirSync(curPath);
        files.forEach(item => {
            const itemPath = path.join(curPath, item);
            if (fs.statSync(itemPath).isDirectory()) {
                readDirFiles(itemPath);
            } else {
                result.push(item);
            }
        });
    }
    return result;
};
export { readFile, writeFile, isExist, isDirectory, delDirectory, readDirFiles, mkdir };
