/**
 * @Author: MaxTan
 * @Description: 农历日历
 * @Date: 2021/09/09 14:00:56
 */
import Dynasty from './dynasty';
import { Dtlpq, dt_T, int2 } from './utils/base';
import { GAN, J2000, JQMC, PI2, RQMC, SX, XZ, YXMC, ZHI } from './utils/const';
import JD from './utils/jd';
import SSQ from './utils/ssq';
import XL from './utils/xl';
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
  private lun_dn = 0;
  private nianhao = '';
  private pg1 = '';
  private pg2 = '';
  private w0 = 0;
  private y = 0;
  private m = 0;
  private d0 = 0;
  private dn = 0;
  private Ly = '';
  private ShX = '';
  constructor() {
    let i;
    for (i = 0; i < 31; i++) {
      this.lun[i] = {};
    }
  }
  substr2(s: string, n: number, end: string) {
    s = s.replace(/(^\s*)|(\s*$)/g, '');
    if (s.length > n + 1) return s.substr(0, n) + end;
    return s;
  }
  yueLiCalc(By: number, Bm: any) {
    let i, j;
    (JD.h = 12), (JD.m = 0), (JD.s = 0.1);
    JD.Y = By;
    JD.M = Bm;
    JD.D = 1;
    const Bd0 = int2(JD.toJD()) - J2000;
    JD.M++;
    if (JD.M > 12) JD.Y++, (JD.M = 1);
    const Bdn = int2(JD.toJD()) - J2000 - Bd0;
    this.w0 = (Bd0 + J2000 + 1 + 7000000) % 7;
    this.y = By;
    this.m = Bm;
    this.d0 = Bd0;
    this.dn = Bdn;
    const c = By - 1984 + 12000;
    this.Ly = GAN[c % 10] + ZHI[c % 12];
    this.ShX = SX[c % 12];
    this.nianhao = Dynasty.getNH(By);
    let D, w, ob, ob2;
    for (i = 0, j = 0; i < Bdn; i++) {
      ob = this.lun[i];
      ob.d0 = Bd0 + i;
      ob.di = i;
      ob.y = By;
      ob.m = Bm;
      ob.dn = Bdn;
      ob.week0 = this.w0;
      ob.week = (this.w0 + i) % 7;
      ob.weeki = int2((this.w0 + i) / 7);
      ob.weekN = int2((this.w0 + Bdn - 1) / 7) + 1;
      JD.setFromJD(ob.d0 + J2000);
      ob.d = JD.D;
      if (!SSQ.ZQ.length || ob.d0 < SSQ.ZQ[0] || ob.d0 >= SSQ.ZQ[24]) SSQ.calcY(ob.d0);
      let mk = int2((ob.d0 - SSQ.HS[0]) / 30);
      if (mk < 13 && SSQ.HS[mk + 1] <= ob.d0) mk++;
      ob.Ldi = ob.d0 - SSQ.HS[mk];
      ob.Ldc = RQMC[ob.Ldi];
      ob.cur_dz = ob.d0 - SSQ.ZQ[0];
      ob.cur_xz = ob.d0 - SSQ.ZQ[12];
      ob.cur_lq = ob.d0 - SSQ.ZQ[15];
      ob.cur_mz = ob.d0 - SSQ.ZQ[11];
      ob.cur_xs = ob.d0 - SSQ.ZQ[13];
      if (ob.d0 == SSQ.HS[mk] || ob.d0 == Bd0) {
        ob.Lmc = SSQ.ym[mk];
        ob.Ldn = SSQ.dx[mk];
        ob.Lleap = SSQ.leap && SSQ.leap == mk ? '闰' : '';
        ob.Lmc2 = mk < 13 ? SSQ.ym[mk + 1] : '未知';
      } else {
        ob2 = this.lun[i - 1];
        (ob.Lmc = ob2.Lmc), (ob.Ldn = ob2.Ldn);
        (ob.Lleap = ob2.Lleap), (ob.Lmc2 = ob2.Lmc2);
      }
      let qk = int2((ob.d0 - SSQ.ZQ[0] - 7) / 15.2184);
      if (qk < 23 && ob.d0 >= SSQ.ZQ[qk + 1]) qk++;
      if (ob.d0 == SSQ.ZQ[qk]) ob.Ljq = JQMC[qk];
      else ob.Ljq = '';
      ob.dtpq = Dtlpq(qk, By, Bm);
      ob.yxmc = ob.yxjd = ob.yxsj = '';
      ob.jqmc = ob.jqjd = ob.jqsj = '';
      D = SSQ.ZQ[3] + (ob.d0 < SSQ.ZQ[3] ? -365 : 0) + 365.25 * 16 - 35;
      ob.Lyear = Math.floor(D / 365.2422 + 0.5);
      D = SSQ.HS[2];
      for (j = 0; j < 14; j++) {
        if (SSQ.ym[j] != '正' || (SSQ.leap == j && j)) continue;
        D = SSQ.HS[j];
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
      mk = int2((ob.d0 - SSQ.ZQ[0]) / 30.43685);
      if (mk < 12 && ob.d0 >= SSQ.ZQ[2 * mk + 1]) mk++;
      D = mk + int2((SSQ.ZQ[12] + 390) / 365.2422) * 12 + 900000;
      ob.Lmonth = D % 12;
      ob.Lmonth2 = GAN[D % 10] + ZHI[D % 12];
      D = ob.d0 - 6 + 9000000;
      ob.Lday2 = GAN[D % 10] + ZHI[D % 12];
      mk = int2((ob.d0 - SSQ.ZQ[0] - 15) / 30.43685);
      if (mk < 11 && ob.d0 >= SSQ.ZQ[2 * mk + 2]) mk++;
      ob.XiZ = XZ[(mk + 12) % 12] + '座';
      // oba.getHuiLi(ob.d0, ob);
      ob.A = ob.B = ob.C = '';
      ob.Fjia = 0;
      // oba.getDayName(ob, ob);
      // obb.getDayName(ob, ob);
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
  }
  yueLiHTML(By: any, Bm: any, curJD?: any) {
    const sty_head = ' style="font-family: 宋体; font-size: 14px; text-align: center; background-color: #E0E0FF; color: #000000; font-weight: bold" ';
    const sty_body = ' style="font-family: 宋体; font-size: 12px; text-align: center " ';
    const sty_date = ' style="font-family: Arial Black; text-align: center;font-size: 20px" ';
    const sty_date2 = ' style="font-family: Arial Black; text-align: center;font-size: 20px; color: #FF0000" ';
    const sty_cur = ' style="background-color:#90D050" ';
    let i,
      j,
      c,
      c2,
      cr = '',
      isM;
    let ob;
    this.yueLiCalc(By, Bm);
    c = this.nianhao + ' 农历' + this.Ly + '年【' + this.ShX + '年】';
    if (c.length > 33) c = '<span style="font-size:12px">' + c + '</span>';
    else c = '<span style="font-size:16px;font-weight:bold">' + c + '</span>';
    let ta0 = '<tr><td colspan=7 style="background-color:#00AFFF" style="color=#FFFF00">' + c + '</td></tr>';
    ta0 +=
      '<tr>' +
      '<td' +
      sty_head +
      'width="%14">日</td>' +
      '<td' +
      sty_head +
      'width="%14">一</td>' +
      '<td' +
      sty_head +
      'width="%14">二</td>' +
      '<td' +
      sty_head +
      'width="%14">三</td>' +
      '<td' +
      sty_head +
      'width="%14">四</td>' +
      '<td' +
      sty_head +
      'width="%14">五</td>' +
      '<td' +
      sty_head +
      'width="%14">六</td></tr>';
    for (i = 0; i < this.dn; i++) {
      ob = this.lun[i];
      if (!i) {
        for (j = 0; j < this.w0; j++) cr += '<td' + sty_body + '></td>';
      }
      (c = ''), (isM = '');
      if (ob.A) c += '<font color=red>' + this.substr2(ob.A, 4, '..') + '</font>';
      if (!c && ob.B) c = '<font color=blue>' + this.substr2(ob.B, 4, '..') + '</font>';
      if (!c && ob.Ldc == '初一') c = ob.Lleap + ob.Lmc + '月' + (ob.Ldn == 30 ? '大' : '小');
      if (!c) c = ob.Ldc;
      if (ob.yxmc == '朔') isM = '<font color=#505000>●</font>';
      if (ob.yxmc == '望') isM = '<font color=#F0B000>●</font>';
      if (ob.yxmc == '上弦') isM = '<font color=#F0B000><b>∪</b></font>';
      if (ob.yxmc == '下弦') isM = '<font color=#F0B000><b>∩</b></font>';
      if (ob.jqmc) isM += '<font color=#00C000>◆</font>';
      if (ob.Fjia) c2 = sty_date2;
      else c2 = sty_date;
      c2 += ' onmouseover="showMessD(' + i + ')"';
      c2 += ' onmouseout ="showMessD(-1)"';
      c2 = '<span' + c2 + '>' + ob.d + '<br/>' + ob.Lday2 + '</span>';
      if (ob.d0 == curJD) c2 = '<span' + sty_cur + '>' + c2 + '</span>';
      cr += '<td' + sty_body + 'width="14%">' + c2 + '<br>' + isM + c + '</td>';
      if (i == this.dn - 1) {
        for (j = 0; j < 6 - ob.week; j++) cr += '<td' + sty_body + '></td>';
      }
      if (i == this.dn - 1 || ob.week == 6) (ta0 += '<tr>' + cr + '</tr>'), (cr = '');
    }
    this.pg1 = '<table border=0 cellpadding=3 cellspacing=1 width="100%">' + ta0 + '</table>';
    let b2 = '',
      b3 = '',
      b4 = '';
    for (i = 0; i < this.dn; i++) {
      ob = this.lun[i];
      c = i + 1;
      if (c < 10) c = '&nbsp;' + c;
      if (ob.yxmc == '朔' || ob.yxmc == '望') b2 += c + '日 ' + ob.yxsj + ob.yxmc + '月 &nbsp;';
      if (ob.yxmc == '上弦' || ob.yxmc == '下弦') b3 += c + '日 ' + ob.yxsj + ob.yxmc + ' &nbsp;';
      if (ob.jqmc) b4 += c + '日 ' + ob.jqsj + ob.jqmc + ' &nbsp;';
    }
    this.pg2 = b2 + '<br>' + b3 + '<br>' + b4;
    return this.lun;
  }
}
