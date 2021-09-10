/**
 * @Author: MaxTan
 * @Description: 日历入口文件
 * @Date: 2021/09/08 17:07:02
 */
import { Lunar } from './lunar';
const lun = new Lunar();
console.log(lun.getLunarDate(2021,9,10));
// import fs from 'fs';
// fs.writeFile('./1.json', JSON.stringify(lun.yueLiCalc(2021, 9)), () => {
//   console.log('写入完成');
// });
