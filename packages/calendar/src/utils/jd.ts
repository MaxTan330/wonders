/**
 * @Author: MaxTan
 * @Description:
 * @Date: 2021/09/09 16:35:43
 */
import { int2 } from './base';
class JD {
  public Y = 2000;
  public M = 1;
  public D = 1;
  public h = 12;
  public m = 0;
  public s = 0;
  public Weeks = ['日', '一', '二', '三', '四', '五', '六', '七'];
  JD(y: number, m: number, d: number) {
    let n = 0,
      G = 0;
    if (y * 372 + m * 31 + int2(d) >= 588829) G = 1;
    if (m <= 2) (m += 12), y--;
    if (G) (n = int2(y / 100)), (n = 2 - n + int2(n / 4));
    return int2(365.25 * (y + 4716)) + int2(30.6001 * (m + 1)) + d + n - 1524.5;
  }
  DD(jd: number) {
    const r: any = {};
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
  DD2str(r: Record<string, any>) {
    let Y = '     ' + r.Y,
      M = '0' + r.M,
      D = '0' + r.D;
    let h = r.h,
      m = r.m,
      s = int2(r.s + 0.5) as any;
    if (s >= 60) (s -= 60), m++;
    if (m >= 60) (m -= 60), h++;
    h = '0' + h;
    m = '0' + m;
    s = '0' + s;
    Y = Y.substr(Y.length - 5, 5);
    M = M.substr(M.length - 2, 2);
    D = D.substr(D.length - 2, 2);
    h = h.substr(h.length - 2, 2);
    m = m.substr(m.length - 2, 2);
    s = s.substr(s.length - 2, 2);
    return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
  }
  JD2str(jd: any) {
    const r = this.DD(jd);
    return this.DD2str(r);
  }

  toJD() {
    return this.JD(this.Y, this.M, this.D + ((this.s / 60 + this.m) / 60 + this.h) / 24);
  }
  setFromJD(jd: any) {
    const r = this.DD(jd);
    (this.Y = r.Y), (this.M = r.M), (this.D = r.D), (this.m = r.m), (this.h = r.h), (this.s = r.s);
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
    return h.substr(h.length - 2, 2) + ':' + m.substr(m.length - 2, 2) + ':' + s.substr(s.length - 2, 2);
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
