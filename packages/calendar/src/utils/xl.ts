/**
 * @Author: MaxTan
 * @Description: xl
 * @Date: 2021/09/09 14:29:26
 */
import { CS_REAR, GXC_MOONLON, RAD } from './const';
import { XL0, XL1 } from './xl0';
import { CS_SMOON, gxc_sunLon, int2, nutationLon2 } from './base';
const XL0_xzb = [
  -0.08631, +0.00039, -0.00008, -0.07447, +0.00006, +0.00017, -0.07135, -0.00026, -0.00176, -0.20239, +0.00273, -0.00347, -0.25486, +0.00276, +0.42926, +0.24588, +0.00345, -14.46266, -0.95116,
  +0.02481, +58.30651,
];
const XL1_calc = (zn: number, t: number, n: number) => {
  const ob = XL1[zn];
  let F;
  let N;
  let v = 0;
  let tn = 1;
  let t2 = t * t;
  let t3 = t2 * t;
  let t4 = t3 * t;
  const t5 = t4 * t;
  const tx = t - 10;
  if (zn == 0) {
    v += (3.81034409 + 8399.684730072 * t - 3.319e-5 * t2 + 3.11e-8 * t3 - 2.033e-10 * t4) * RAD;
    v += 5028.792262 * t + 1.1124406 * t2 + 0.00007699 * t3 - 0.000023479 * t4 - 0.0000000178 * t5;
    if (tx > 0) v += -0.866 + 1.43 * tx + 0.054 * tx * tx;
  }
  (t2 /= 1e4), (t3 /= 1e8), (t4 /= 1e8);
  n *= 6;
  if (n < 0) n = ob[0].length;
  for (let i = 0; i < ob.length; i++, tn *= t) {
    F = ob[i];
    N = int2((n * F.length) / ob[0].length + 0.5);
    if (i) N += 6;
    if (N >= F.length) N = F.length;
    let c = 0;
    for (let j = 0; j < N; j += 6) {
      c += F[j] * Math.cos(F[j + 1] + t * F[j + 2] + t2 * F[j + 3] + t3 * F[j + 4] + t4 * F[j + 5]);
    }
    v += c * tn;
  }
  if (zn != 2) v /= RAD;
  return v;
};
const XL0_calc = (xt: number, zn: number, t: number, n: number) => {
  t /= 10;
  let i,
    j,
    v = 0,
    tn = 1,
    c;
  const F = XL0[xt];
  let n1, n2, N;
  let n0;
  const pn = zn * 6 + 1;
  const N0 = F[pn + 1] - F[pn];
  for (i = 0; i < 6; i++, tn *= t) {
    (n1 = F[pn + i]), (n2 = F[pn + 1 + i]), (n0 = n2 - n1);
    if (!n0) continue;
    if (n < 0) N = n2;
    else {
      N = int2((3 * n * n0) / N0 + 0.5) + n1;
      if (i) N += 3;
      if (N > n2) N = n2;
    }
    for (j = n1, c = 0; j < N; j += 3) c += F[j] * Math.cos(F[j + 1] + t * F[j + 2]);
    v += c * tn;
  }
  v /= F[0];
  if (xt == 0) {
    const t2 = t * t,
      t3 = t2 * t;
    if (zn == 0) v += (-0.0728 - 2.7702 * t - 1.1019 * t2 - 0.0996 * t3) / RAD;
    if (zn == 1) v += (+0.0 + 0.0004 * t + 0.0004 * t2 - 0.0026 * t3) / RAD;
    if (zn == 2) v += (-0.002 + 0.0044 * t + 0.0213 * t2 - 0.025 * t3) / 1000000;
  } else {
    const dv = XL0_xzb[(xt - 1) * 3 + zn];
    if (zn == 0) v += (-3 * t) / RAD;
    if (zn == 2) v += dv / 1000000;
    else v += dv / RAD;
  }
  return v;
};
class XL {
  E_Lon(t: number, n: number) {
    return XL0_calc(0, 0, t, n);
  }
  M_Lon(t: number, n: number) {
    return XL1_calc(0, t, n);
  }
  E_v(t: number) {
    const f = 628.307585 * t;
    return 628.332 + 21 * Math.sin(1.527 + f) + 0.44 * Math.sin(1.48 + f * 2) + 0.129 * Math.sin(5.82 + f) * t + 0.00055 * Math.sin(4.21 + f) * t * t;
  }
  M_v(t: number) {
    let v = 8399.71 - 914 * Math.sin(0.7848 + 8328.691425 * t + 0.0001523 * t * t);
    v -=
      179 * Math.sin(2.543 + 15542.7543 * t) +
      160 * Math.sin(0.1874 + 7214.0629 * t) +
      62 * Math.sin(3.14 + 16657.3828 * t) +
      34 * Math.sin(4.827 + 16866.9323 * t) +
      22 * Math.sin(4.9 + 23871.4457 * t) +
      12 * Math.sin(2.59 + 14914.4523 * t) +
      7 * Math.sin(0.23 + 6585.7609 * t) +
      5 * Math.sin(0.9 + 25195.624 * t) +
      5 * Math.sin(2.32 - 7700.3895 * t) +
      5 * Math.sin(3.88 + 8956.9934 * t) +
      5 * Math.sin(0.49 + 7771.3771 * t);
    return v;
  }
  MS_aLon(t: number, Mn: number, Sn: number) {
    return this.M_Lon(t, Mn) + GXC_MOONLON - (this.E_Lon(t, Sn) + gxc_sunLon(t) + Math.PI);
  }
  S_aLon(t: number, n: number) {
    return this.E_Lon(t, n) + nutationLon2(t) + gxc_sunLon(t) + Math.PI;
  }
  E_Lon_t(W: number) {
    let t,
      v = 628.3319653318;
    t = (W - 1.75347) / v;
    v = this.E_v(t);
    t += (W - this.E_Lon(t, 10)) / v;
    v = this.E_v(t);
    t += (W - this.E_Lon(t, -1)) / v;
    return t;
  }
  M_Lon_t(W: number) {
    let t,
      v = 8399.70911033384;
    t = (W - 3.81034) / v;
    t += (W - this.M_Lon(t, 3)) / v;
    v = this.M_v(t);
    t += (W - this.M_Lon(t, 20)) / v;
    t += (W - this.M_Lon(t, -1)) / v;
    return t;
  }
  MS_aLon_t(W: number) {
    let t,
      v = 7771.37714500204;
    t = (W + 1.08472) / v;
    t += (W - this.MS_aLon(t, 3, 3)) / v;
    v = this.M_v(t) - this.E_v(t);
    t += (W - this.MS_aLon(t, 20, 10)) / v;
    t += (W - this.MS_aLon(t, -1, 60)) / v;
    return t;
  }
  S_aLon_t(W: number) {
    let t,
      v = 628.3319653318;
    t = (W - 1.75347 - Math.PI) / v;
    v = this.E_v(t);
    t += (W - this.S_aLon(t, 10)) / v;
    v = this.E_v(t);
    t += (W - this.S_aLon(t, -1)) / v;
    return t;
  }
  MS_aLon_t2(W: number) {
    let t,
      v = 7771.37714500204;
    t = (W + 1.08472) / v;
    const t2 = t * t;
    t -=
      (-0.00003309 * t2 +
        0.10976 * Math.cos(0.784758 + 8328.6914246 * t + 0.000152292 * t2) +
        0.02224 * Math.cos(0.1874 + 7214.0628654 * t - 0.00021848 * t2) -
        0.03342 * Math.cos(4.669257 + 628.307585 * t)) /
      v;
    const L =
      this.M_Lon(t, 20) -
      (4.8950632 +
        628.3319653318 * t +
        0.000005297 * t * t +
        0.0334166 * Math.cos(4.669257 + 628.307585 * t) +
        0.0002061 * Math.cos(2.67823 + 628.307585 * t) * t +
        0.000349 * Math.cos(4.6261 + 1256.61517 * t) -
        20.5 / RAD);
    v = 7771.38 - 914 * Math.sin(0.7848 + 8328.691425 * t + 0.0001523 * t * t) - 179 * Math.sin(2.543 + 15542.7543 * t) - 160 * Math.sin(0.1874 + 7214.0629 * t);
    t += (W - L) / v;
    return t;
  }
  S_aLon_t2(W: number) {
    let t;
    const v = 628.3319653318;
    t = (W - 1.75347 - Math.PI) / v;
    t -= (0.000005297 * t * t + 0.0334166 * Math.cos(4.669257 + 628.307585 * t) + 0.0002061 * Math.cos(2.67823 + 628.307585 * t) * t) / v;
    t += (W - this.E_Lon(t, 8) - Math.PI + (20.5 + 17.2 * Math.sin(2.1824 - 33.75705 * t)) / RAD) / v;
    return t;
  }
  moonIll(t: number) {
    const t2 = t * t,
      t3 = t2 * t,
      t4 = t3 * t;
    const dm = Math.PI / 180;
    const D = (297.8502042 + 445267.1115168 * t - 0.00163 * t2 + t3 / 545868 - t4 / 113065000) * dm;
    const M = (357.5291092 + 35999.0502909 * t - 0.0001536 * t2 + t3 / 24490000) * dm;
    const m = (134.9634114 + 477198.8676313 * t + 0.008997 * t2 + t3 / 69699 - t4 / 14712000) * dm;
    const a = Math.PI - D + (-6.289 * Math.sin(m) + 2.1 * Math.sin(M) - 1.274 * Math.sin(D * 2 - m) - 0.658 * Math.sin(D * 2) - 0.214 * Math.sin(m * 2) - 0.11 * Math.sin(D)) * dm;
    return (1 + Math.cos(a)) / 2;
  }
  moonRad(r: number, h: number) {
    return (CS_SMOON / r) * (1 + (Math.sin(h) * CS_REAR) / r);
  }
  moonMinR(t: number, min: any) {
    const a = 27.55454988 / 36525;
    const b = min ? -10.3302 / 36525 : 3.4471 / 36525;
    t = b + a * int2((t - b) / a + 0.5);
    let r1, r2, r3, dt;
    dt = 2 / 36525;
    r1 = XL1_calc(2, t - dt, 10);
    r2 = XL1_calc(2, t, 10);
    r3 = XL1_calc(2, t + dt, 10);
    t += (((r1 - r3) / (r1 + r3 - 2 * r2)) * dt) / 2;
    dt = 0.5 / 36525;
    r1 = XL1_calc(2, t - dt, 20);
    r2 = XL1_calc(2, t, 20);
    r3 = XL1_calc(2, t + dt, 20);
    t += (((r1 - r3) / (r1 + r3 - 2 * r2)) * dt) / 2;
    dt = 1200 / 86400 / 36525;
    r1 = XL1_calc(2, t - dt, -1);
    r2 = XL1_calc(2, t, -1);
    r3 = XL1_calc(2, t + dt, -1);
    t += (((r1 - r3) / (r1 + r3 - 2 * r2)) * dt) / 2;
    r2 += (((r1 - r3) / (r1 + r3 - 2 * r2)) * (r3 - r1)) / 8;
    const re = [t, r2];
    return re;
  }
  moonNode(t: number, asc: any) {
    const a = 27.21222082 / 36525;
    const b = asc ? 21 / 36525 : 35 / 36525;
    t = b + a * int2((t - b) / a + 0.5);
    let w, v, w2, dt;
    dt = 0.5 / 36525;
    w = XL1_calc(1, t, 10);
    w2 = XL1_calc(1, t + dt, 10);
    v = (w2 - w) / dt;
    t -= w / v;
    dt = 0.05 / 36525;
    w = XL1_calc(1, t, 40);
    w2 = XL1_calc(1, t + dt, 40);
    v = (w2 - w) / dt;
    t -= w / v;
    w = XL1_calc(1, t, -1);
    t -= w / v;
    const re = [t, XL1_calc(0, t, -1)];
    return re;
  }
  earthMinR(t: number, min: any) {
    const a = 365.25963586 / 36525;
    const b = min ? 1.7 / 36525 : 184.5 / 36525;
    t = b + a * int2((t - b) / a + 0.5);
    let r1, r2, r3, dt;
    dt = 3 / 36525;
    r1 = XL0_calc(0, 2, t - dt, 10);
    r2 = XL0_calc(0, 2, t, 10);
    r3 = XL0_calc(0, 2, t + dt, 10);
    t += (((r1 - r3) / (r1 + r3 - 2 * r2)) * dt) / 2;
    dt = 0.2 / 36525;
    r1 = XL0_calc(0, 2, t - dt, 80);
    r2 = XL0_calc(0, 2, t, 80);
    r3 = XL0_calc(0, 2, t + dt, 80);
    t += (((r1 - r3) / (r1 + r3 - 2 * r2)) * dt) / 2;
    dt = 0.01 / 36525;
    r1 = XL0_calc(0, 2, t - dt, -1);
    r2 = XL0_calc(0, 2, t, -1);
    r3 = XL0_calc(0, 2, t + dt, -1);
    t += (((r1 - r3) / (r1 + r3 - 2 * r2)) * dt) / 2;
    r2 += (((r1 - r3) / (r1 + r3 - 2 * r2)) * (r3 - r1)) / 8;
    const re = [t, r2];
    return re;
  }
}
export default new XL();
