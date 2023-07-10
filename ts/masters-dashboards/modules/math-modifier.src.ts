/**
 * @license Highcharts Dashboards Math @product.version@ (@product.date@)
 * @module dashboards/modules/math-modifier
 * @requires dashboards
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


import Globals from '../../Dashboards/Globals.js';
import Formula from '../../Data/Formula/Formula.js';

// Fill registries
import '../../Data/Modifiers/MathModifier.js';


/* *
 *
 *  Declarations
 *
 * */


declare global {
    interface Dashboards {
        Formula: typeof Formula;
        // MathModifier registeres itself in DataModifier.types
    }
}


/* *
 *
 *  Namespace
 *
 * */


const G = Globals as unknown as Dashboards;

G.Formula = Formula;


/* *
 *
 *  Default Export
 *
 * */


export default G;
