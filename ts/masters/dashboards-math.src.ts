/**
 * @license Highcharts Dashboards Math v1.0.0 (@product.date@)
 * @module highsoft/dashboard-math
 * @requires window
 *
 * (c) 2009-2023 Highsoft AS
 *
 * License: www.highcharts.com/license
 */


'use strict';


/* *
 *
 *  Imports
 *
 * */


import Formula from '../Data/Formula/Formula.js';
import MathModifier from '../Data/Modifiers/MathModifier.js';


/* *
 *
 *  Namespace
 *
 * */


const G: AnyRecord = window.Dashboards;

if (G) {
    G.Formula = Formula;
    if (G.DataModifier) {
        G.DataModifier.types.Math = MathModifier;
    }
}


/* *
 *
 *  Default Export
 *
 * */


const DashboardsMath = {
    Formula,
    MathModifier
};

export default DashboardsMath;
