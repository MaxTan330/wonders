/**
 * @Author: MaxTan
 * @Description: base编码
 * @Date: 2020/08/10 14:41:37
 */
export type Options = {
    urlsafe?: boolean; // 是否安全编码
};
export default class Base64 {
    private KEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    private SAFEKEY = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=';
    private options: Options;
    private diyFlag: boolean;
    constructor(options?: Options) {
        const defaultOpt: Options = {
            urlsafe: true,
        };
        this.options = Object.assign(defaultOpt, options);
        this.diyFlag = false;
    }
    /**
     * utf-8 编码的私有方法
     * @param str
     */
    private utf8Encode(str: string) {
        str = str.replace(/\r\n/g, '\n');
        let utftext = '';
        for (let n = 0; n < str.length; n++) {
            const c = str.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if (c > 127 && c < 2048) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    }
    /**
     * utf-8 解码的私有方法
     * @param str
     */
    private utf8Decode(utftext: string) {
        let str = '';
        let i = 0;
        let c = 0;
        let c1 = 0;
        let c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                str += String.fromCharCode(c);
                i++;
            } else if (c > 191 && c < 224) {
                c1 = utftext.charCodeAt(i + 1);
                str += String.fromCharCode(((c & 31) << 6) | (c1 & 63));
                i += 2;
            } else {
                c1 = utftext.charCodeAt(i + 1);
                c2 = utftext.charCodeAt(i + 2);
                str += String.fromCharCode(((c & 15) << 12) | ((c1 & 63) << 6) | (c2 & 63));
                i += 3;
            }
        }
        return str;
    }
    /**
     * base64 编码
     * @param encodeStr
     */
    public encode(encodeStr: string) {
        const key = this.options.urlsafe ? this.SAFEKEY : this.KEY;
        if (encodeStr === undefined || encodeStr === '' || encodeStr === null) {
            console.warn('encodeStr Is empty');
        }
        let outputStr = '';
        let chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        let i = 0;
        encodeStr = typeof encodeStr == 'string' ? encodeStr : '' + encodeStr;
        encodeStr = this.utf8Encode(encodeStr);
        while (i < encodeStr.length) {
            chr1 = encodeStr.charCodeAt(i++);
            chr2 = encodeStr.charCodeAt(i++);
            chr3 = encodeStr.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            outputStr = outputStr + key.charAt(enc1) + key.charAt(enc2) + key.charAt(enc3) + key.charAt(enc4);
        }
        return outputStr;
    }
    /**
     * base64 解码
     * @param encodeStr
     */
    public decode(decodeStr: string) {
        const key = this.options.urlsafe ? this.SAFEKEY : this.KEY;
        let outputStr = '';
        let chr1, chr2, chr3;
        let enc1, enc2, enc3, enc4;
        let i = 0;
        decodeStr = typeof decodeStr == 'string' ? decodeStr : '' + decodeStr;
        if (!this.diyFlag) {
            const regStr = this.options.urlsafe ? '[^A-Za-z0-9-_=]' : '[^A-Za-z0-9+/=]';
            const reg = new RegExp(regStr, 'g');
            decodeStr = decodeStr.replace(reg, '');
        }
        while (i < decodeStr.length) {
            enc1 = key.indexOf(decodeStr.charAt(i++));
            enc2 = key.indexOf(decodeStr.charAt(i++));
            enc3 = key.indexOf(decodeStr.charAt(i++));
            enc4 = key.indexOf(decodeStr.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            outputStr = outputStr + String.fromCharCode(chr1);
            if (enc3 != 64) {
                outputStr = outputStr + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                outputStr = outputStr + String.fromCharCode(chr3);
            }
        }
        outputStr = this.utf8Decode(outputStr);
        return outputStr;
    }
    /**
     * 设定元字符
     * @param keyStr
     */
    public setKey(keyStr: string) {
        if (this.options.urlsafe) {
            this.SAFEKEY = keyStr;
        } else {
            this.KEY = keyStr;
        }
        this.diyFlag = true;
    }
}
