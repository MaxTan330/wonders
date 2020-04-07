/**
 *  @des 工具类函数，基于node 10
 *  @author MaxTan
 *  @date 2019/12/20
 */
import fs from 'fs';
import path from 'path';
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
    return new Promise((resolve) => {
        fs.writeFile(path, data, o, (err) => {
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
    return new Promise((resolve) => {
        try {
            fs.stat(path, (err, stat) => {
                resolve(stat && stat.isDirectory());
            });
        } catch (err) {
            resolve(false);
        }
    });
};
/**
 * 判断是否存在该文件
 * @param path 文件夹路径
 */
const isFile = (path: string): Promise<boolean> => {
    return new Promise((resolve) => {
        try {
            fs.stat(path, (err, stat) => {
                resolve(stat && stat.isFile());
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
    return new Promise((resolve) => {
        fs.mkdir(path, { recursive: true }, (err) => {
            resolve(!err);
        });
    });
};
/**
 * 读取文件夹路径
 * @param dirName 文件夹路径
 * @param recursionFlag 筛选规则
 * @param regStr 是否递归
 */
const readFileByDirectory = (dirName: string, recursionFlag = true, regStr?: RegExp): Array<string> => {
    const filesList: Array<string> = [];
    const readFileList = (dir: string, flag?: boolean, reg?: RegExp) => {
        const files = fs.readdirSync(dir);
        files.forEach((item) => {
            const fullPath = path.join(dir, item);
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                //是否递归读取下一级目录
                flag && readFileList(path.join(dir, item), flag, reg); //递归读取文件
            } else {
                const extName = path.extname(fullPath);
                if (reg) {
                    if(reg.test(extName)){
                        filesList.push(fullPath);
                    }
                } else {
                    filesList.push(fullPath);
                }
            }
        });
    };
    readFileList(dirName, recursionFlag, regStr);
    return filesList;
};
export { readFile, writeFile, isDirectory, isFile, mkdir, readFileByDirectory };
