/**
 * @license Highcharts Dashboards v0.0.2 (@product.date@)
 * @module highsoft/dashboard
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
import Globals from '../Core/Globals.js';
import MathModifier from '../Data/Modifiers/MathModifier.js';


/* *
 *
 *  Namespace
 *
 * */


const D: AnyRecord = Globals;

D.Formula = Formula;


/* *
 *
 *  Classic Exports
 *
 * */


const Dashboards = D.win.Dashboards;


if (Dashboards) {
    Dashboards.DataModifier.types.Math = MathModifier;
    Dashboards.Formula = Formula;
}


export default (Dashboards || D);
