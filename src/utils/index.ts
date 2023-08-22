export const numberFormat = (num?: string | number, prefix?: string): string => {
  try {
    if (num) {
      num = (num + '').replace(/[^0-9+\-Ee.]/g, '');
      let n = !isFinite(+num) ? 0 : +num;
      let prec = 6;
      let sep = ',';
      let dec = '.';
      let s: any = '';
      let toFixedFix = (ns: any, precs: any) => {
        if (('' + ns).indexOf('e') === -1) {
          let vls: any = ns + 'e+' + precs;
          return +(Math.round(vls) + 'e-' + prec);
        } else {
          let arr = ('' + n).split('e');
          let sig = '';
          if (+arr[1] + precs > 0) {
            sig = '+';
          }
          let vlss: any = +arr[0] + 'e' + sig + (+arr[1] + precs);
          let vlsss = (+(Math.round(vlss)) + 'e-' + precs);
          return Number(vlsss).toFixed(precs);
        }
      }
      s = (prec ? toFixedFix(n, prec).toString() : '' + Math.round(n)).split('.');
      if (s[0].length > 3) {
        s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
      }
      let result = s.join(dec);
      if (prefix) result = prefix + result;
      return result;
    } else {
      return '0';
    }
  } catch (ex) {
    return '0';
  }
}

export const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const generateRegex = (find: string) => {
  return new RegExp(escapeRegExp(find), 'gmi');
}