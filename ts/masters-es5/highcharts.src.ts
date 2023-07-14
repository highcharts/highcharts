/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/highcharts
 *
 * (c) 2009-2023 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import Highcharts from '../masters/highcharts.src.js';
import MSPointer from '../Core/MSPointer.js';
declare global {
    interface ObjectConstructor {
        setPrototypeOf?<T>(o: T, proto: object | null): T;
    }
}
const G: AnyRecord = Highcharts;
if (MSPointer.isRequired()) {
    G.Pointer.dissolve();
    G.Pointer = MSPointer;
    MSPointer.compose(G.Chart);
}
// Default Export
export default G;
