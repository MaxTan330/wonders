/**
 * @Author: MaxTan
 * @Description: 日历入口文件
 * @Date: 2021/09/08 17:07:02
 */
import { Lunar, LunarObj, YXObj, JQObj, HLObj } from './lunar';
const lun = new Lunar();
type BaseDateObj = LunarObj & YXObj & JQObj & HLObj;
/**
 * 获取各个时间转换
 * @param y 年
 * @param m 月
 * @param d 日
 */
export function getBaseDate(y?: number, m?: number, d?: number): BaseDateObj {
  const now = new Date();
  const year = y || now.getFullYear();
  const month = m || now.getMonth() + 1;
  const day = d || now.getDate();
  const lunarObj = lun.getLunarDate(year, month, day);
  const yxObj = lun.getYXInfo(year, month, day);
  const jqObj = lun.getJQInfo(year, month, day);
  const hlObj = lun.getHuiLi(lun.getJD2000Count(year, month, day));
  return { ...lunarObj, ...yxObj, ...jqObj, ...hlObj };
}
