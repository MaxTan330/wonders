/**
 * @Author: MaxTan
 * @Description: 农历日历
 * @Date: 2021/09/09 14:00:56
 */
import Dynasty from './dynasty';
import { dt_T, int2 } from './utils/base';
import { GAN, J2000, JQMC, PI2, RQMC, SX, XZ, YXMC, ZHI } from './utils/const';
import JD, { JD_Date } from './utils/jd';
import SSQ from './utils/ssq';
import XL from './utils/xl';
export type LunarObj = {
  Ldi: number; // 农历日期序号
  Ldc: string; // 农历日
  cur_dz: number; //距离当年冬至日期
  cur_xz: number; //距离当年夏至日期
  cur_lq: number; //距离当年立秋日期
  cur_mz: number; //距离当年芒种日期
  cur_xs: number; //距离当年小暑日期
  Lmc: string; // 农历月份
  Ldn: number; // 农历月总天数
  Lleap: string; // 是否闰月
  Lmc2: string; // 农历月份别名
  Ljq: string; // 农历节气
  jqsj: string; // 节气时间
  jqjd: number; // 节气儒略日
  jqmc: string; // 节气名称
  Lyear: number; // 甲子周期年
  Lyear0: number; // 甲子周期年
  Lyear2: string; // 农历天干地支年份
  Lyear3: string; // 黄历年
  Lyear4: number; // 黄历纪年
  Lmonth: number; // 农历月
  Lmonth2: string; // 农历天干地支月份
  Lday2: string; // 农历天干地支日期
};
export type YXObj = {
  yxsj: string; // 月相时间
  yxjd: number; // 月相儒略2000日
  yxmc: string; // 月相名称
};
export type JQObj = {
  jqsj: string; // 节气时间
  jqjd: number; // 节气儒略日
  jqmc: string; // 节气名称
};
export type HLObj = {
  Hday: number; //回历年
  Hmonth: number; //回历月
  Hyear: number; //回历日
};
const qi_accurate = (W: number) => {
  const t = XL.S_aLon_t(W) * 36525;
  return t - dt_T(t) + 8 / 24;
};
const so_accurate = (W: number) => {
  const t = XL.MS_aLon_t(W) * 36525;
  return t - dt_T(t) + 8 / 24;
};
export class Lunar {
  /**
   * 获取儒略日
   * @param y 公元年
   * @param m 公元月
   * @param d 公元日
   * @returns
   */
  getJDCount(y: number, m: number, d: number): number {
    const jdObj: JD_Date = {
      Y: y,
      M: m,
      D: d,
      h: 12,
      m: 0,
      s: 0.1,
    };
    return int2(JD.toJD(jdObj));
  }
  /**
   * 获取儒略2000日
   * @param y 公元年
   * @param m 公元月
   * @param d 公元日
   * @returns
   */
  getJD2000Count(y: number, m: number, d: number): number {
    return this.getJDCount(y, m, d) - J2000;
  }
  /**
   * 获取农历相关日期
   * @param y 公元年
   * @param m 公元月
   * @param d 公元日
   * @returns
   */
  getLunarDate(y: number, m: number, d: number): LunarObj {
    if (y < -4712 || y > 9999) {
      throw new Error('仅支持公元前4712至公元9999年的数据计算');
    }
    const ob: LunarObj = {
      Ldi: -1,
      Ldc: '',
      cur_dz: -1,
      cur_xz: -1,
      cur_lq: -1,
      cur_mz: -1,
      cur_xs: -1,
      Lmc: '',
      Ldn: -1,
      Lleap: '',
      Lmc2: '',
      Ljq: '',
      jqsj: '',
      jqjd: -1,
      jqmc: '',
      Lyear: -1,
      Lyear0: -1,
      Lyear2: '',
      Lyear3: '',
      Lyear4: -1,
      Lmonth: -1,
      Lmonth2: '',
      Lday2: '',
    };
    const Bd0 = this.getJD2000Count(y, m, d);
    const ZQ = SSQ.getZQ();
    const SSQ_ym = SSQ.getYm();
    if (!ZQ.length || Bd0 < ZQ[0] || Bd0 >= ZQ[24]) {
      SSQ.calcY(Bd0);
    }
    const SSQ_leap = SSQ.getLeap();
    const SSQ_dx = SSQ.getDx();
    const HS = SSQ.getHS();
    let mk = int2((Bd0 - HS[0]) / 30);
    if (mk < 13 && HS[mk + 1] <= Bd0) {
      mk++;
    }
    ob.Ldi = Bd0 - HS[mk];
    ob.Ldc = RQMC[ob.Ldi];
    ob.cur_dz = Bd0 - ZQ[0];
    ob.cur_xz = Bd0 - ZQ[12];
    ob.cur_lq = Bd0 - ZQ[15];
    ob.cur_mz = Bd0 - ZQ[11];
    ob.cur_xs = Bd0 - ZQ[13];
    ob.Lmc = SSQ_ym[mk];
    ob.Ldn = SSQ_dx[mk];
    ob.Lleap = SSQ_leap && SSQ_leap == mk ? '闰' : '';
    ob.Lmc2 = mk < 13 ? SSQ_ym[mk + 1] : '未知';
    let qk = int2((Bd0 - ZQ[0] - 7) / 15.2184);
    if (qk < 23 && Bd0 >= ZQ[qk + 1]) qk++;
    ob.Ljq = Bd0 == ZQ[qk] ? (ob.Ljq = JQMC[qk]) : '';
    let D = ZQ[3] + (Bd0 < ZQ[3] ? -365 : 0) + 365.25 * 16 - 35;
    ob.Lyear = int2(D / 365.2422 + 0.5);
    D = HS[2];
    for (let j = 0; j < 14; j++) {
      if (SSQ_ym[j] != '正' || (SSQ_leap == j && j)) continue;
      D = HS[j];
      if (Bd0 < D) {
        D -= 365;
        break;
      }
    }
    D = D + 5810;
    ob.Lyear0 = int2(D / 365.2422 + 0.5);
    D = ob.Lyear + 12000;
    ob.Lyear2 = GAN[D % 10] + ZHI[D % 12];
    D = ob.Lyear0 + 12000;
    ob.Lyear3 = GAN[D % 10] + ZHI[D % 12];
    ob.Lyear4 = ob.Lyear0 + 1984 + 2698;
    mk = int2((Bd0 - ZQ[0]) / 30.43685);
    if (mk < 12 && Bd0 >= ZQ[2 * mk + 1]) mk++;
    D = mk + int2((ZQ[12] + 390) / 365.2422) * 12 + 900000;
    ob.Lmonth = D % 12;
    ob.Lmonth2 = GAN[D % 10] + ZHI[D % 12];
    D = Bd0 - 6 + 9000000;
    ob.Lday2 = GAN[D % 10] + ZHI[D % 12];
    return ob;
  }
  /**
   * 获取月相信息
   * @param y 公元年
   * @param m 公元月
   * @param d 公元日
   */
  getYXInfo(y: number, m: number, d: number): YXObj {
    const Bd0 = this.getJD2000Count(y, m, d);
    const yxObj: YXObj = {
      yxjd: -1,
      yxmc: '',
      yxsj: '',
    };
    let day, xn, D, w;
    const jd2 = Bd0 + dt_T(Bd0) - 8 / 24;
    const nextM = m++;
    const Bdn = this.getJD2000Count(nextM > 12 ? y++ : y, nextM > 12 ? 1 : nextM, d) - Bd0;
    w = XL.MS_aLon(jd2 / 36525, 10, 3);
    w = (int2(((w - 0.78) / Math.PI) * 2) * Math.PI) / 2;
    do {
      day = so_accurate(w);
      D = int2(day + 0.5);
      xn = int2((w / PI2) * 4 + 4000000.01) % 4;
      w += PI2 / 4;
      if (D >= Bd0 + Bdn) break;
      if (D < Bd0) continue;
      if (D === Bd0) {
        yxObj.yxmc = YXMC[xn];
        yxObj.yxjd = day;
        yxObj.yxsj = JD.timeStr(day);
      }
    } while (D + 5 < Bd0 + Bdn);
    return yxObj;
  }
  /**
   * 获取节气信息
   * @param y 公元年
   * @param m 公元月
   * @param d 公元日
   */
  getJQInfo(y: number, m: number, d: number) {
    const Bd0 = this.getJD2000Count(y, m, d);
    const nextM = m++;
    const Bdn = this.getJD2000Count(nextM > 12 ? y++ : y, nextM > 12 ? 1 : nextM, d) - Bd0;
    const jqObj: JQObj = {
      jqsj: '',
      jqjd: -1,
      jqmc: '',
    };
    let day, xn, D, w;
    const jd2 = Bd0 + dt_T(Bd0) - 8 / 24;
    w = XL.S_aLon(jd2 / 36525, 3);
    w = (int2(((w - 0.13) / PI2) * 24) * PI2) / 24;
    do {
      day = qi_accurate(w);
      D = int2(day + 0.5);
      xn = int2((w / PI2) * 24 + 24000006.01) % 24;
      w += PI2 / 24;
      if (D >= Bd0 + Bdn) break;
      if (D < Bd0) continue;
      if (D === Bd0) {
        jqObj.jqmc = JQMC[xn];
        jqObj.jqjd = day;
        jqObj.jqsj = JD.timeStr(day);
      }
    } while (D + 12 < Bd0 + Bdn);
    return jqObj;
  }
  /**
   * 获取回历
   * @param d0 儒略2000日
   */
  getHuiLi(d0: number): HLObj {
    const hl: HLObj = {
      Hday: -1,
      Hmonth: -1,
      Hyear: -1,
    };
    let d = d0 + 503105;
    const z = int2(d / 10631);
    d -= z * 10631;
    const y = int2((d + 0.5) / 354.366);
    d -= int2(y * 354.366 + 0.5);
    const m = int2((d + 0.11) / 29.51);
    d -= int2(m * 29.5 + 0.5);
    hl.Hyear = z * 30 + y + 1;
    hl.Hmonth = m + 1;
    hl.Hday = d + 1;
    return hl;
  }
  /**
   * 获取生肖
   * @param y 年份
   * @returns
   */
  getShX(y: number): string {
    const c = y - 1984 + 12000;
    return SX[c % 12];
  }
  /**
   * 获取农历年名称
   * @param y 年份
   * @returns
   */
  getLYName(y: number): string {
    const c = y - 1984 + 12000;
    return GAN[c % 10] + ZHI[c % 12];
  }
  /**
   * 获取朝代年号
   * @param y 公元纪年
   * @returns
   */
  getNH(y: number): string {
    return Dynasty.getNH(y);
  }
  /**
   * 获取星座
   * @param d0 儒略日2000年天数
   * @param zq
   * @returns
   */
  getXZ(d0: number, zq: number[]): string {
    let mk = int2((d0 - zq[0] - 15) / 30.43685);
    if (mk < 11 && d0 >= zq[2 * mk + 2]) mk++;
    return XZ[(mk + 12) % 12] + '座';
  }
}
