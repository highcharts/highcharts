/* *
 *
 *  (c) 2014-2021 Highsoft AS
 *
 *  Authors: Jon Arild Nygard / Oystein Moseng
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
/* *
 *
 *  Imports
 *
 * */
import U from '../../Core/Utilities.js';
var objectEach = U.objectEach;
/* *
 *
 *  Namespace
 *
 * */
var TreemapUtilities;
(function (TreemapUtilities) {
    TreemapUtilities.AXIS_MAX = 100;
    /* eslint-disable no-invalid-this, valid-jsdoc */
    /**
     * @todo Similar to eachObject, this function is likely redundant
     */
    function isBoolean(x) {
        return typeof x === 'boolean';
    }
    TreemapUtilities.isBoolean = isBoolean;
    /**
     * @todo Similar to recursive, this function is likely redundant
     */
    function eachObject(list, func, context) {
        context = context || this;
        objectEach(list, function (val, key) {
            func.call(context, val, key, list);
        });
    }
    TreemapUtilities.eachObject = eachObject;
    /**
     * @todo find correct name for this function.
     * @todo Similar to reduce, this function is likely redundant
     */
    function recursive(item, func, context) {
        if (context === void 0) { context = this; }
        var next;
        next = func.call(context, item);
        if (next !== false) {
            recursive(next, func, context);
        }
    }
    TreemapUtilities.recursive = recursive;
})(TreemapUtilities || (TreemapUtilities = {}));
/* *
 *
 *  Default Export
 *
 * */
export default TreemapUtilities;
