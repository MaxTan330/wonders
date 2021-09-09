/**
 * @Author: MaxTan
 * @Description: 日历入口文件
 * @Date: 2021/09/08 17:07:02
 */
import { Lunar } from './lunar';
const lun = new Lunar();
import fs from 'fs';
fs.writeFile('./1.json', JSON.stringify(lun.yueLiHTML(2021, 9)), () => {
  console.log('写入完成');
});
