/**
 * @Author: MaxTan
 * @Description:
 * @Date: 2021/09/09 16:21:25
 */
import { dt_T, int2 } from './base';
import { J2000, YMC } from './const';
import XL from './xl';
const SUO_KB = [
  1457698.231017, 29.53067166, 1546082.512234, 29.53085106, 1640640.7353, 29.5306, 1642472.151543, 29.53085439, 1683430.5093, 29.53086148, 1752148.041079, 29.53085097, 1807665.420323, 29.53059851,
  1883618.1141, 29.5306, 1907360.7047, 29.5306, 1936596.2249, 29.5306, 1939135.6753, 29.5306, 1947168.0,
];
const QI_KB = [
  1640650.479938, 15.218425, 1642476.703182, 15.21874996, 1683430.515601, 15.218750011, 1752157.640664, 15.218749978, 1807675.003759, 15.218620279, 1883627.765182, 15.218612292, 1907369.1281,
  15.218449176, 1936603.140413, 15.218425, 1939145.52418, 15.218466998, 1947180.7983, 15.218524844, 1964362.041824, 15.218533526, 1987372.340971, 15.218513908, 1999653.819126, 15.218530782,
  2007445.469786, 15.218535181, 2021324.917146, 15.218526248, 2047257.232342, 15.218519654, 2070282.898213, 15.218425, 2073204.87285, 15.218515221, 2080144.500926, 15.218530782, 2086703.688963,
  15.218523776, 2110033.182763, 15.218425, 2111190.300888, 15.218425, 2113731.271005, 15.218515671, 2120670.840263, 15.218425, 2123973.309063, 15.218425, 2125068.997336, 15.218477932, 2136026.312633,
  15.218472436, 2156099.495538, 15.218425, 2159021.324663, 15.218425, 2162308.575254, 15.218461742, 2178485.706538, 15.218425, 2178759.662849, 15.218445786, 2185334.0208, 15.218425, 2187525.481425,
  15.218425, 2188621.191481, 15.218437494, 2322147.76,
];
const SUO_S = [
  'EqoFscDcrFpmEsF2DfFideFelFpFfFfFiaipqti1ksttikptikqckstekqttgkqttgkqteksttikptikq2fjstgjqttjkqttgkqt',
  'ekstfkptikq2tijstgjiFkirFsAeACoFsiDaDiADc1AFbBfgdfikijFifegF1FhaikgFag1E2btaieeibggiffdeigFfqDfaiBkF',
  '1kEaikhkigeidhhdiegcFfakF1ggkidbiaedksaFffckekidhhdhdikcikiakicjF1deedFhFccgicdekgiFbiaikcfi1kbFibef',
  'gEgFdcFkFeFkdcfkF1kfkcickEiFkDacFiEfbiaejcFfffkhkdgkaiei1ehigikhdFikfckF1dhhdikcfgjikhfjicjicgiehdik',
  'cikggcifgiejF1jkieFhegikggcikFegiegkfjebhigikggcikdgkaFkijcfkcikfkcifikiggkaeeigefkcdfcfkhkdgkegieid',
  'hijcFfakhfgeidieidiegikhfkfckfcjbdehdikggikgkfkicjicjF1dbidikFiggcifgiejkiegkigcdiegfggcikdbgfgefjF1',
  'kfegikggcikdgFkeeijcfkcikfkekcikdgkabhkFikaffcfkhkdgkegbiaekfkiakicjhfgqdq2fkiakgkfkhfkfcjiekgFebicg',
  'gbedF1jikejbbbiakgbgkacgiejkijjgigfiakggfggcibFifjefjF1kfekdgjcibFeFkijcfkfhkfkeaieigekgbhkfikidfcje',
  'aibgekgdkiffiffkiakF1jhbakgdki1dj1ikfkicjicjieeFkgdkicggkighdF1jfgkgfgbdkicggfggkidFkiekgijkeigfiski',
  'ggfaidheigF1jekijcikickiggkidhhdbgcfkFikikhkigeidieFikggikhkffaffijhidhhakgdkhkijF1kiakF1kfheakgdkif',
  'iggkigicjiejkieedikgdfcggkigieeiejfgkgkigbgikicggkiaideeijkefjeijikhkiggkiaidheigcikaikffikijgkiahi1',
  'hhdikgjfifaakekighie1hiaikggikhkffakicjhiahaikggikhkijF1kfejfeFhidikggiffiggkigicjiekgieeigikggiffig',
  'gkidheigkgfjkeigiegikifiggkidhedeijcfkFikikhkiggkidhh1ehigcikaffkhkiggkidhh1hhigikekfiFkFikcidhh1hit',
  'cikggikhkfkicjicghiediaikggikhkijbjfejfeFhaikggifikiggkigiejkikgkgieeigikggiffiggkigieeigekijcijikgg',
  'ifikiggkideedeijkefkfckikhkiggkidhh1ehijcikaffkhkiggkidhh1hhigikhkikFikfckcidhh1hiaikgjikhfjicjicgie',
  'hdikcikggifikigiejfejkieFhegikggifikiggfghigkfjeijkhigikggifikiggkigieeijcijcikfksikifikiggkidehdeij',
  'cfdckikhkiggkhghh1ehijikifffffkhsFngErD1pAfBoDd1BlEtFqA2AqoEpDqElAEsEeB2BmADlDkqBtC1FnEpDqnEmFsFsAFn',
  'llBbFmDsDiCtDmAB2BmtCgpEplCpAEiBiEoFqFtEqsDcCnFtADnFlEgdkEgmEtEsCtDmADqFtAFrAtEcCqAE1BoFqC1F1DrFtBmF',
  'tAC2ACnFaoCgADcADcCcFfoFtDlAFgmFqBq2bpEoAEmkqnEeCtAE1bAEqgDfFfCrgEcBrACfAAABqAAB1AAClEnFeCtCgAADqDoB',
  'mtAAACbFiAAADsEtBqAB2FsDqpFqEmFsCeDtFlCeDtoEpClEqAAFrAFoCgFmFsFqEnAEcCqFeCtFtEnAEeFtAAEkFnErAABbFkAD',
  'nAAeCtFeAfBoAEpFtAABtFqAApDcCGJ',
];
const QI_S = [
  'FrcFs22AFsckF2tsDtFqEtF1posFdFgiFseFtmelpsEfhkF2anmelpFlF1ikrotcnEqEq2FfqmcDsrFor22FgFrcgDscFs22FgEe',
  'FtE2sfFs22sCoEsaF2tsD1FpeE2eFsssEciFsFnmelpFcFhkF2tcnEqEpFgkrotcnEqrEtFermcDsrE222FgBmcmr22DaEfnaF22',
  '2sD1FpeForeF2tssEfiFpEoeFssD1iFstEqFppDgFstcnEqEpFg11FscnEqrAoAF2ClAEsDmDtCtBaDlAFbAEpAAAAAD2FgBiBqo',
  'BbnBaBoAAAAAAAEgDqAdBqAFrBaBoACdAAf1AACgAAAeBbCamDgEifAE2AABa1C1BgFdiAAACoCeE1ADiEifDaAEqAAFe1AcFbcA',
  'AAAAF1iFaAAACpACmFmAAAAAAAACrDaAAADG0',
];
class SSQ {
  private SB = '';
  private QB = '';
  private leap = 0;
  private ym: any[] = [];
  private ZQ: number[] = [];
  private HS: number[] = [];
  private dx: number[] = [];
  private Yn = [];
  private PE1 = 0;
  private PE2 = 0;
  constructor() {
    this.SB = this.jieya(SUO_S.join(''));
    this.QB = this.jieya(QI_S.join(''));
  }
  getZQ() {
    return this.ZQ;
  }
  getHS() {
    return this.HS;
  }
  getYm() {
    return this.ym;
  }
  getDx() {
    return this.dx;
  }
  getLeap() {
    return this.leap;
  }
  soLow(W: number) {
    const v = 7771.37714500204;
    let t = (W + 1.08472) / v;
    t -=
      (-0.0000331 * t * t + 0.10976 * Math.cos(0.785 + 8328.6914 * t) + 0.02224 * Math.cos(0.187 + 7214.0629 * t) - 0.03342 * Math.cos(4.669 + 628.3076 * t)) / v +
      (32 * (t + 1.8) * (t + 1.8) - 20) / 86400 / 36525;
    return t * 36525 + 8 / 24;
  }
  qiLow(W: number) {
    const v = 628.3319653318;
    let t = (W - 4.895062166) / v;
    t -= (53 * t * t + 334116 * Math.cos(4.67 + 628.307585 * t) + 2061 * Math.cos(2.678 + 628.3076 * t) * t) / v / 10000000;
    const L =
      48950621.66 +
      6283319653.318 * t +
      53 * t * t +
      334166 * Math.cos(4.669257 + 628.307585 * t) +
      3489 * Math.cos(4.6261 + 1256.61517 * t) +
      2060.6 * Math.cos(2.67823 + 628.307585 * t) * t -
      994 -
      834 * Math.sin(2.1824 - 33.75705 * t);
    t -= (L / 10000000 - W) / 628.332 + (32 * (t + 1.8) * (t + 1.8) - 20) / 86400 / 36525;
    return t * 36525 + 8 / 24;
  }
  qiHigh(W: number) {
    let t = XL.S_aLon_t2(W) * 36525;
    t = t - dt_T(t) + 8 / 24;
    const v = ((t + 0.5) % 1) * 86400;
    if (v < 1200 || v > 86400 - 1200) t = XL.S_aLon_t(W) * 36525 - dt_T(t) + 8 / 24;
    return t;
  }
  soHigh(W: number) {
    let t = XL.MS_aLon_t2(W) * 36525;
    t = t - dt_T(t) + 8 / 24;
    const v = ((t + 0.5) % 1) * 86400;
    if (v < 1800 || v > 86400 - 1800) t = XL.MS_aLon_t(W) * 36525 - dt_T(t) + 8 / 24;
    return t;
  }
  jieya(s: string) {
    const o = '0000000000',
      o2 = o + o;
    s = s.replace(/J/g, '00');
    s = s.replace(/I/g, '000');
    s = s.replace(/H/g, '0000');
    s = s.replace(/G/g, '00000');
    s = s.replace(/t/g, '02');
    s = s.replace(/s/g, '002');
    s = s.replace(/r/g, '0002');
    s = s.replace(/q/g, '00002');
    s = s.replace(/p/g, '000002');
    s = s.replace(/o/g, '0000002');
    s = s.replace(/n/g, '00000002');
    s = s.replace(/m/g, '000000002');
    s = s.replace(/l/g, '0000000002');
    s = s.replace(/k/g, '01');
    s = s.replace(/j/g, '0101');
    s = s.replace(/i/g, '001');
    s = s.replace(/h/g, '001001');
    s = s.replace(/g/g, '0001');
    s = s.replace(/f/g, '00001');
    s = s.replace(/e/g, '000001');
    s = s.replace(/d/g, '0000001');
    s = s.replace(/c/g, '00000001');
    s = s.replace(/b/g, '000000001');
    s = s.replace(/a/g, '0000000001');
    s = s.replace(/A/g, o2 + o2 + o2);
    s = s.replace(/B/g, o2 + o2 + o);
    s = s.replace(/C/g, o2 + o2);
    s = s.replace(/D/g, o2 + o);
    s = s.replace(/E/g, o2);
    s = s.replace(/F/g, o);
    return s;
  }
  calc(jd: number, qs: string) {
    jd += 2451545;
    let i, D, n;
    const B = qs == '气' ? QI_KB : SUO_KB;
    const pc = qs == '气' ? 7 : 14;
    const f1 = B[0] - pc,
      f2 = B[B.length - 1] - pc,
      f3 = 2436935;
    if (jd < f1 || jd >= f3) {
      if (qs == '气') return Math.floor(this.qiHigh((Math.floor(((jd + pc - 2451259) / 365.2422) * 24) * Math.PI) / 12) + 0.5);
      else return Math.floor(this.soHigh(Math.floor((jd + pc - 2451551) / 29.5306) * Math.PI * 2) + 0.5);
    }
    if (jd >= f1 && jd < f2) {
      for (i = 0; i < B.length; i += 2) if (jd + pc < B[i + 2]) break;
      D = B[i] + B[i + 1] * Math.floor((jd + pc - B[i]) / B[i + 1]);
      D = Math.floor(D + 0.5);
      if (D == 1683460) D++;
      return D - 2451545;
    }
    if (jd >= f2 && jd < f3) {
      if (qs == '气') {
        D = Math.floor(this.qiLow((Math.floor(((jd + pc - 2451259) / 365.2422) * 24) * Math.PI) / 12) + 0.5);
        n = this.QB.substr(Math.floor(((jd - f2) / 365.2422) * 24), 1);
      } else {
        D = Math.floor(this.soLow(Math.floor((jd + pc - 2451551) / 29.5306) * Math.PI * 2) + 0.5);
        n = this.SB.substr(Math.floor((jd - f2) / 29.5306), 1);
      }
      if (n == '1') return D + 1;
      if (n == '2') return D - 1;
      return D;
    }
    return -1;
  }
  calcY(jd: number) {
    const A = this.ZQ;
    const B = this.HS;
    let i, w;
    let W = int2((jd - 355 + 183) / 365.2422) * 365.2422 + 355;
    if (this.calc(W, '气') > jd) {
      W -= 365.2422;
    }
    for (i = 0; i < 25; i++) {
      A[i] = this.calc(W + 15.2184 * i, '气');
    }
    this.PE1 = this.calc(W - 15.2, '气');
    this.PE2 = this.calc(W - 30.4, '气');
    w = this.calc(A[0], '朔');
    if (w > A[0]) w -= 29.53;
    for (i = 0; i < 15; i++) B[i] = this.calc(w + 29.5306 * i, '朔');
    this.leap = 0;
    for (i = 0; i < 14; i++) {
      this.dx[i] = this.HS[i + 1] - this.HS[i];
      this.ym[i] = i;
    }
    const YY = int2((this.ZQ[0] + 10 + 180) / 365.2422) + 2000;
    if (YY >= -721 && YY <= -104) {
      const ns: any[] = [];
      let yy;
      for (i = 0; i < 3; i++) {
        yy = YY + i - 1;
        if (yy >= -721) (ns[i] = this.calc(1457698 - J2000 + int2(0.342 + (yy + 721) * 12.368422) * 29.5306, '朔')), (ns[i + 3] = '十三'), (ns[i + 6] = 2);
        if (yy >= -479) (ns[i] = this.calc(1546083 - J2000 + int2(0.5 + (yy + 479) * 12.368422) * 29.5306, '朔')), (ns[i + 3] = '十三'), (ns[i + 6] = 2);
        if (yy >= -220) (ns[i] = this.calc(1640641 - J2000 + int2(0.866 + (yy + 220) * 12.369) * 29.5306, '朔')), (ns[i + 3] = '后九'), (ns[i + 6] = 11);
      }
      let nn, f1;
      for (i = 0; i < 14; i++) {
        for (nn = 2; nn >= 0; nn--) if (this.HS[i] >= ns[nn]) break;
        f1 = int2((this.HS[i] - ns[nn] + 15) / 29.5306);
        if (f1 < 12) this.ym[i] = YMC[(f1 + ns[nn + 6]) % 12];
        else this.ym[i] = ns[nn + 3];
      }
      return;
    }
    if (B[13] <= A[24]) {
      for (i = 1; B[i + 1] > A[2 * i] && i < 13; i++);
      this.leap = i;
      for (; i < 14; i++) this.ym[i]--;
    }
    for (i = 0; i < 14; i++) {
      const Dm = this.HS[i] + J2000;
      const v2 = this.ym[i];
      let mc = YMC[v2 % 12];
      if (Dm >= 1724360 && Dm <= 1729794) mc = YMC[(v2 + 1) % 12];
      else if (Dm >= 1807724 && Dm <= 1808699) mc = YMC[(v2 + 1) % 12];
      else if (Dm >= 1999349 && Dm <= 1999467) mc = YMC[(v2 + 2) % 12];
      else if (Dm >= 1973067 && Dm <= 1977052) {
        if (v2 % 12 == 0) mc = '正';
        if (v2 == 2) mc = '一';
      }
      if (Dm == 1729794 || Dm == 1808699) mc = '拾贰';
      this.ym[i] = mc;
    }
  }
}
export default new SSQ();
