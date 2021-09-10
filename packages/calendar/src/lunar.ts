/**
 * @Author: MaxTan
 * @Description: 农历日历
 * @Date: 2021/09/09 14:00:56
 */
import Dynasty from './dynasty';
import { Dtlpq, dt_T, int2 } from './utils/base';
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
export type DateObj = {
  d0: number; // 儒略日2000年天数
  y: number; // 公元年
  m: number; // 公元月
  dn: number; // 公元月最大日
  week0: number; // 1日星期
  week: number; // 星期几,通过字典翻译
  weeki: number; // 第几周
  weekN: number; // 当月一共多少周
  d: number; // 公元日
};
export type LunarObj2 = {
  d0: number; // 儒略日2000年
  di: number; // 序号
  y: number; // 公元年
  m: number; // 公元月
  dn: number; // 公元月最大日
  week0: number; // 1日星期
  week: number; // 星期几,通过字典翻译
  weeki: number; // 第几周
  weekN: number; // 当月一共多少周
  d: number; // 公元日
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
  Ljq?: string; // 农历节气
  dtpq: string; //大统历平气
  yxsj: string; // 月相时间
  yxjd: string; // 月相
  yxmc: string; // 月相名称
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
  XiZ: string; // 星座
  Hyear: number; // 回历年
  Hmonth: number; // 回历月
  Hday: number; // 回历日
  C: string; //道教节日
  B: string; // 农历节日
  A: string; // 公历节日
  Fjia: number; // 放假标识
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
  private lun: Array<any> = [];
  constructor() {
    let i;
    for (i = 0; i < 31; i++) {
      this.lun[i] = {};
    }
  }
  yueLiCalc(By: number, Bm: number) {
    const jdObj: JD_Date = {
      Y: By,
      M: Bm,
      D: 1,
      h: 12,
      m: 0,
      s: 0.1,
    };
    const Bd0 = int2(JD.toJD(jdObj)) - J2000;
    jdObj.M++;
    if (jdObj.M > 12) {
      jdObj.Y++;
      jdObj.M = 1;
    }
    const Bdn = int2(JD.toJD(jdObj)) - J2000 - Bd0;
    const w0 = (Bd0 + J2000 + 1 + 7000000) % 7;
    let D, w, ob, ob2;
    const ZQ = SSQ.getZQ();
    const HS = SSQ.getHS();
    const SSQ_ym = SSQ.getYm();
    const SSQ_dx = SSQ.getDx();
    for (let i = 0; i < Bdn; i++) {
      ob = this.lun[i];
      ob.d0 = Bd0 + i;
      ob.di = i;
      ob.y = By;
      ob.m = Bm;
      ob.dn = Bdn;
      ob.week0 = w0;
      ob.week = (w0 + i) % 7;
      ob.weeki = int2((w0 + i) / 7);
      ob.weekN = int2((w0 + Bdn - 1) / 7) + 1;
      const JD_Obj = JD.DD(ob.d0 + J2000);
      ob.d = JD_Obj.D;
      if (!ZQ.length || ob.d0 < ZQ[0] || ob.d0 >= ZQ[24]) SSQ.calcY(ob.d0);
      let mk = int2((ob.d0 - HS[0]) / 30);
      if (mk < 13 && HS[mk + 1] <= ob.d0) mk++;
      ob.Ldi = ob.d0 - HS[mk];
      ob.Ldc = RQMC[ob.Ldi];
      ob.cur_dz = ob.d0 - ZQ[0];
      ob.cur_xz = ob.d0 - ZQ[12];
      ob.cur_lq = ob.d0 - ZQ[15];
      ob.cur_mz = ob.d0 - ZQ[11];
      ob.cur_xs = ob.d0 - ZQ[13];
      if (ob.d0 == HS[mk] || ob.d0 == Bd0) {
        ob.Lmc = SSQ_ym[mk];
        ob.Ldn = SSQ_dx[mk];
        const SSQ_leap = SSQ.getLeap();
        ob.Lleap = SSQ_leap && SSQ_leap == mk ? '闰' : '';
        ob.Lmc2 = mk < 13 ? SSQ_ym[mk + 1] : '未知';
      } else {
        ob2 = this.lun[i - 1];
        (ob.Lmc = ob2.Lmc), (ob.Ldn = ob2.Ldn);
        (ob.Lleap = ob2.Lleap), (ob.Lmc2 = ob2.Lmc2);
      }
      let qk = int2((ob.d0 - ZQ[0] - 7) / 15.2184);
      if (qk < 23 && ob.d0 >= ZQ[qk + 1]) qk++;
      if (ob.d0 == ZQ[qk]) ob.Ljq = JQMC[qk];
      else ob.Ljq = '';
      ob.dtpq = Dtlpq(qk, By, Bm);
      ob.yxmc = ob.yxjd = ob.yxsj = '';
      ob.jqmc = ob.jqjd = ob.jqsj = '';
      D = ZQ[3] + (ob.d0 < ZQ[3] ? -365 : 0) + 365.25 * 16 - 35;
      ob.Lyear = Math.floor(D / 365.2422 + 0.5);
      D = HS[2];
      for (let j = 0; j < 14; j++) {
        const SSQ_leap = SSQ.getLeap();
        if (SSQ_ym[j] != '正' || (SSQ_leap == j && j)) continue;
        D = HS[j];
        if (ob.d0 < D) {
          D -= 365;
          break;
        }
      }
      D = D + 5810;
      ob.Lyear0 = Math.floor(D / 365.2422 + 0.5);
      D = ob.Lyear + 12000;
      ob.Lyear2 = GAN[D % 10] + ZHI[D % 12];
      D = ob.Lyear0 + 12000;
      ob.Lyear3 = GAN[D % 10] + ZHI[D % 12];
      ob.Lyear4 = ob.Lyear0 + 1984 + 2698;
      mk = int2((ob.d0 - ZQ[0]) / 30.43685);
      if (mk < 12 && ob.d0 >= ZQ[2 * mk + 1]) mk++;
      D = mk + int2((ZQ[12] + 390) / 365.2422) * 12 + 900000;
      ob.Lmonth = D % 12;
      ob.Lmonth2 = GAN[D % 10] + ZHI[D % 12];
      D = ob.d0 - 6 + 9000000;
      ob.Lday2 = GAN[D % 10] + ZHI[D % 12];
      mk = int2((ob.d0 - ZQ[0] - 15) / 30.43685);
      if (mk < 11 && ob.d0 >= ZQ[2 * mk + 2]) mk++;
      ob.XiZ = XZ[(mk + 12) % 12] + '座';
      ob.A = ob.B = ob.C = '';
      ob.Fjia = 0;
    }
    let d, xn;
    const jd2 = Bd0 + dt_T(Bd0) - 8 / 24;
    w = XL.MS_aLon(jd2 / 36525, 10, 3);
    w = (int2(((w - 0.78) / Math.PI) * 2) * Math.PI) / 2;
    do {
      d = so_accurate(w);
      D = int2(d + 0.5);
      xn = int2((w / PI2) * 4 + 4000000.01) % 4;
      w += PI2 / 4;
      if (D >= Bd0 + Bdn) break;
      if (D < Bd0) continue;
      ob = this.lun[D - Bd0];
      ob.yxmc = YXMC[xn];
      ob.yxjd = d;
      ob.yxsj = JD.timeStr(d);
    } while (D + 5 < Bd0 + Bdn);
    w = XL.S_aLon(jd2 / 36525, 3);
    w = (int2(((w - 0.13) / PI2) * 24) * PI2) / 24;
    do {
      d = qi_accurate(w);
      D = int2(d + 0.5);
      xn = int2((w / PI2) * 24 + 24000006.01) % 24;
      w += PI2 / 24;
      if (D >= Bd0 + Bdn) break;
      if (D < Bd0) continue;
      ob = this.lun[D - Bd0];
      ob.jqmc = JQMC[xn];
      ob.jqjd = d;
      ob.jqsj = JD.timeStr(d);
    } while (D + 12 < Bd0 + Bdn);
    return this.lun;
  }
  /**
   * 获取农历相关日期
   * @param jdObj
   */
  getLunarDate(y: number, m: number, d: number) {
    if (y < -4712 || y > 9999){
      throw new Error('仅支持公元前4712至公元9999年的数据计算');
    }
    const jdObj: JD_Date = {
      Y: y,
      M: m,
      D: d,
      h: 12,
      m: 0,
      s: 0.1,
    };
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
    const Bd0 = int2(JD.toJD(jdObj)) - J2000;
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
   * 获取生肖
   * @param y 年份
   * @returns
   */
  getShX(y: number) {
    const c = y - 1984 + 12000;
    return SX[c % 12];
  }
  /**
   * 获取农历年名称
   * @param y 年份
   * @returns
   */
  getLYName(y: number) {
    const c = y - 1984 + 12000;
    return GAN[c % 10] + ZHI[c % 12];
  }
  /**
   * 获取朝代年号
   * @param y 公元纪年
   * @returns
   */
  getNH(y: number) {
    return Dynasty.getNH(y);
  }
  /**
   * 获取星座
   * @param d0 儒略日2000年天数
   * @param zq
   * @returns
   */
  getXZ(d0: number, zq: number[]) {
    let mk = int2((d0 - zq[0] - 15) / 30.43685);
    if (mk < 11 && d0 >= zq[2 * mk + 2]) mk++;
    return XZ[(mk + 12) % 12] + '座';
  }
}
