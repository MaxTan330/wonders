/**
 * @Author: MaxTan
 * @Description: 基础方法
 * @Date: 2021/09/09 15:05:58
 */

import { CS_K, CS_K2, CS_REAR, DT_AT, GAN, JQJL, JQMC, NUT_B, RAD, SCD, TIMEK, YMC, ZHI } from './const';

/**
 * 数字取整
 * @param n
 * @returns
 */
export function int2(n: number) {
  return Math.floor(n);
}
/**
 *
 * @param t
 * @returns
 */
export function gxc_sunLon(t: number) {
  const v = -0.043126 + 628.301955 * t - 0.000002732 * t * t;
  const e = 0.016708634 - 0.000042037 * t - 0.0000001267 * t * t;
  return (-20.49552 * (1 + e * Math.cos(v))) / RAD;
}
/**
 *
 * @param t
 * @returns
 */
export function nutationLon2(t: number) {
  const t2 = t * t;
  let dL = 0;
  for (let i = 0; i < NUT_B.length; i += 5) {
    const a = i == 0 ? -1.742 * t : 0;
    dL += (NUT_B[i + 3] + a) * Math.sin(NUT_B[i] + NUT_B[i + 1] * t + NUT_B[i + 2] * t2);
  }
  return dL / 100 / RAD;
}
export const CS_SMOON = CS_K * CS_REAR * 1.0000036 * RAD;
export const CS_SMOON2 = CS_K2 * CS_REAR * 1.0000036 * RAD;
/**
 *
 * @param y
 * @param jsd
 * @returns
 */
function dt_ext(y: number, jsd: number) {
  const dy = (y - 1820) / 100;
  return -20 + jsd * dy * dy;
}
/**
 *
 * @param y
 * @returns
 */
export function dt_calc(y: number) {
  const y0 = DT_AT[DT_AT.length - 2];
  const t0 = DT_AT[DT_AT.length - 1];
  if (y >= y0) {
    const jsd = 31;
    if (y > y0 + 100) return dt_ext(y, jsd);
    const v = dt_ext(y, jsd);
    const dv = dt_ext(y0, jsd) - t0;
    return v - (dv * (y0 + 100 - y)) / 100;
  }
  let i;
  const d = DT_AT;
  for (i = 0; i < d.length; i += 5) if (y < d[i + 5]) break;
  const t1 = ((y - d[i]) / (d[i + 5] - d[i])) * 10,
    t2 = t1 * t1,
    t3 = t2 * t1;
  return d[i + 1] + d[i + 2] * t1 + d[i + 3] * t2 + d[i + 4] * t3;
}
/**
 *
 * @param t
 * @returns
 */
export function dt_T(t: number) {
  return dt_calc(t / 365.2425 + 2000) / 86400.0;
}
/**
 *
 * @param c
 * @returns
 */
export function year2Ayear(c: number) {
  let y: any = String(c).replace(/[^0-9Bb\*-]/g, '');
  const q = y.substr(0, 1);
  if (q == 'B' || q == 'b' || q == '*') {
    y = 1 - y.substr(1, y.length);
    if (y > 0) {
      alert('通用纪法的公元前纪法从B.C.1年开始。并且没有公元0年');
      return -10000;
    }
  } else y -= 0;
  if (y < -4712) alert('超过B.C. 4713不准');
  if (y > 9999) alert('超过9999年的农历计算很不准。');
  return y;
}
/**
 *
 * @param pjqn
 * @returns
 */
export function Dtlpq(pjqn: number, year: number, month: number) {
  const y = year2Ayear(year);
  let s = '';
  if (y < 1582 || y > 1644 || (y == 1644 && month == 12)) return s;
  const yearshi = 365.2425;
  const qiying = 55.06;
  const qice = yearshi / 24;
  const pqrgz = ((y - 1281) * yearshi + qiying + pjqn * qice) % 60;
  const pqrtg = GAN[(10 + (int2(pqrgz) % 10)) % 10];
  const pqrdz = ZHI[(12 + (int2(pqrgz) % 12)) % 12];
  s = s + pqrtg + pqrdz + '日 ';
  const pqrhh = (pqrgz - int2(pqrgz)) * 24;
  const pqrsc = ZHI[(12 + (pqrhh + 1) / 2) % 12];
  const pqrsd = SCD[pqrhh % 2];
  const pqrmm = (pqrhh - int2(pqrhh)) * 60;
  const pqrsk = TIMEK[pqrmm / 14.4];
  s = s + pqrsc + pqrsd + ' ' + pqrsk + '刻' + ' ' + JQMC[pjqn] + '<br/>' + YMC[((pjqn + 1) / 2 + 12) % 12] + '月' + JQJL[pjqn % 2];
  return s;
}
