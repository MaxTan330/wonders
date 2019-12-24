/**
 *  @des 工具类函数，基于node 10
 *  @author MaxTan
 *  @date 2019/12/20
 */
import fs from 'fs';
interface ReadOptions {
    encoding: string; //源文件路径
    flag: string; //文件系统标志
}
/**
 * 读取文件
 * @param path 路径
 * @param options
 */
const readFile = (path: string, options?: ReadOptions): Promise<any> => {
    const o = Object.assign({ encoding: 'utf8' }, options);
    return new Promise((resolve, reject) => {
        fs.readFile(path, o, (err, data) => {
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
 * @param path 写入文件路径
 * @param data 写入数据
 * @param options 写入参数，默认utf8格式
 */
const writeFile = (path: string, data: string | Buffer, options?: ReadOptions): Promise<boolean> => {
    const o = Object.assign({ encoding: 'utf8' }, options);
    return new Promise(resolve => {
        fs.writeFile(path, data, o, err => {
            err && console.log(err);
            resolve(!err);
        });
    });
};
/**
 * 判断是否存在该文件夹
 * @param path 文件夹路径
 */
const isDirectory = (path: string): Promise<boolean> => {
    return new Promise(resolve => {
        try {
            fs.stat(path, err => {
                err && console.log(err);
                resolve(!err);
            });
        } catch (err) {
            resolve(false);
        }
    });
};
/**
 * 清除文件夹
 * @param path 文件夹路径
 */
const mkdir = (path: string): Promise<boolean> => {
    return new Promise(resolve => {
        fs.mkdir(path, { recursive: true }, err => {
            resolve(!err);
        });
    });
};
export { readFile, writeFile, isDirectory, mkdir };
