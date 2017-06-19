/*******************************************************************************

  Highcharts Cloud

  Copyright (c), Highsoft AS 2017
  All rights reserved.

  This application may only be used with a valid license.

  Original Authors: Christer Vaseng

  Typecheck functions and other usefull things

 ******************************************************************************/

module.exports = {
  isNull: (what) => {
    return (typeof what === 'undefined' || what === null);
  },

  isStr: (what) => {
    return (typeof what === 'string' || what instanceof String);
  },

  isNum: (what) => {
    return !isNaN(parseFloat(what)) && isFinite(what);
  },

  isFn: (what) => {
    return (what && (typeof what === 'function') || (what instanceof Function));
  },

  isArr: (what) => {
    return (!module.exports.isNull(what) && what.constructor.toString().indexOf('Array') > -1);
  },

  isBool: (what) => {
    return (what === true || what === false);
  },

  isBasic: (what) => {
    return !module.exports.isArr(what) && (module.exports.isStr(what) || module.exports.isNum(what) || module.exports.isBool(what) || module.exports.isFn(what));
  },

  mergeObj: (a, b, ignoreEmpty, excludeMap) => {
    if (!a || !b) return a || b;

    if (ignoreEmpty && Object.keys(b).length === 0) {
      return;
    }

    Object.keys(b).forEach(function (bk) {
      if (excludeMap && excludeMap[bk]) {
        return;
      }

      if (module.exports.isNull(b[bk]) || module.exports.isBasic(b[bk])) {
        a[bk] = b[bk];
      } else if (module.exports.isArr(b[bk])) {

        a[bk] = [];

        b[bk].forEach(function (i) {
         if (module.exports.isNull(i) || module.exports.isBasic(i)) {
           a[bk].push(i);
         } else {
           a[bk].push(module.exports.mergeObj(module.exports.isArr(i) ? [] : {}, i));
         }
       });
      } else {

        if (ignoreEmpty && Object.keys(b[bk]).length === 0) {
          return;
        }

        a[bk] = a[bk] || {};
        module.exports.mergeObj(a[bk], b[bk]);
      }
    });
    return a;
  }
};
