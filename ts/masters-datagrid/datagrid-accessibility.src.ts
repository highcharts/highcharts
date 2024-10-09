/**
 * @license Highcharts DataGrid Accessibility @product.version@ (@product.date@)
 * @module dashboards/modules/layout
 * @requires dashboards
 *
 * (c) 2009-2024 Highsoft AS
 *
 * License: www.highcharts.com/license
 */


'use strict';


/* *
 *
 *  Imports
 *
 * */


import Globals from '../DataGrid/Globals.js';

// Fill registries
import '../DataGrid/DataGridAccessibility.js';
import DataGridAccessibility from '../DataGrid/DataGridAccessibility.js';


/* *
 *
 *  Declarations
 *
 * */


declare global {
    interface DataGrid {
        DataGridAccessibility: typeof DataGridAccessibility
    }
}


/* *
 *
 *  Namespace
 *
 * */


const G = Globals as unknown as DataGrid;

G.DataGridAccessibility = DataGridAccessibility;


/* *
 *
 *  Default Export
 *
 * */


export default G;