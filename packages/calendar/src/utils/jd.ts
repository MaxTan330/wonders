/**
 * @Author: MaxTan
 * @Description:
 * @Date: 2021/09/09 16:35:43
 */
import { int2 } from './base';
export type JD_Date = {
  Y: number;
  M: number;
  D: number;
  h: number;
  m: number;
  s: number;
};
class JD {
  public Weeks = ['日', '一', '二', '三', '四', '五', '六'];
  JD(y: number, m: number, d: number) {
    let n = 0,
      G = 0;
    if (y * 372 + m * 31 + int2(d) >= 588829) G = 1;
    if (m <= 2) (m += 12), y--;
    if (G) (n = int2(y / 100)), (n = 2 - n + int2(n / 4));
    return int2(365.25 * (y + 4716)) + int2(30.6001 * (m + 1)) + d + n - 1524.5;
  }
  DD(jd: number): JD_Date {
    const r: JD_Date = {
      Y: 0,
      M: 0,
      D: 0,
      h: 0,
      m: 0,
      s: 0,
    };
    let D = int2(jd + 0.5);
    let F = jd + 0.5 - D;
    let c;
    if (D >= 2299161) (c = int2((D - 1867216.25) / 36524.25)), (D += 1 + c - int2(c / 4));
    D += 1524;
    r.Y = int2((D - 122.1) / 365.25);
    D -= int2(365.25 * r.Y);
    r.M = int2(D / 30.601);
    D -= int2(30.601 * r.M);
    r.D = D;
    if (r.M > 13) (r.M -= 13), (r.Y -= 4715);
    else (r.M -= 1), (r.Y -= 4716);
    F *= 24;
    r.h = int2(F);
    F -= r.h;
    F *= 60;
    r.m = int2(F);
    F -= r.m;
    F *= 60;
    r.s = F;
    return r;
  }
  DD2str(r: JD_Date) {
    let Y = '     ' + r.Y,
      M = '0' + r.M,
      D = '0' + r.D;
    let h = r.h,
      m = r.m,
      s = int2(r.s + 0.5);
    if (s >= 60) (s -= 60), m++;
    if (m >= 60) (m -= 60), h++;
    let hStr = '0' + h;
    let mStr = '0' + m;
    let sStr = '0' + s;
    Y = Y.substr(Y.length - 5, 5);
    M = M.substr(M.length - 2, 2);
    D = D.substr(D.length - 2, 2);
    hStr = hStr.substr(hStr.length - 2, 2);
    mStr = hStr.substr(mStr.length - 2, 2);
    sStr = hStr.substr(sStr.length - 2, 2);
    return `${Y}-${M}-${D} ${hStr}:${mStr}:${sStr}`;
  }
  JD2str(jd: number) {
    const r = this.DD(jd);
    return this.DD2str(r);
  }

  toJD(r: JD_Date) {
    return this.JD(r.Y, r.M, r.D + ((r.s / 60 + r.m) / 60 + r.h) / 24);
  }
  timeStr(jd: number) {
    let h, m, s;
    jd += 0.5;
    jd = jd - int2(jd);
    s = int2(jd * 86400 + 0.5);
    h = int2(s / 3600);
    s -= h * 3600;
    m = int2(s / 60);
    s -= m * 60;
    h = '0' + h;
    m = '0' + m;
    s = '0' + s;
    return `${h.substr(h.length - 2, 2)}:${m.substr(m.length - 2, 2)}:${s.substr(s.length - 2, 2)}`;
  }
  getWeek(jd: number) {
    return int2(jd + 1.5 + 7000000) % 7;
  }
  nnweek(y: number, m: number, n: number, w: number) {
    const jd = this.JD(y, m, 1.5);
    const w0 = (jd + 1 + 7000000) % 7;
    let r = jd - w0 + 7 * n + w;
    if (w >= w0) r -= 7;
    if (n == 5) {
      m++;
      if (m > 12) (m = 1), y++;
      if (r >= this.JD(y, m, 1.5)) r -= 7;
    }
    return r;
  }
}
export default new JD();
