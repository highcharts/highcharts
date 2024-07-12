/**
 * @license Highcharts Dashboards Layout @product.version@ (@product.date@)
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


import Globals from '../../Dashboards/Globals';

// Fill registries
import '../../Dashboards/EditMode/EditMode.js';
import '../../Dashboards/EditMode/Fullscreen.js';
import EditMode from '../../Dashboards/EditMode/EditMode.js';
import Fullscreen from '../../Dashboards/EditMode/Fullscreen.js';


/* *
 *
 *  Declarations
 *
 * */


declare global {
    interface Dashboards {
        EditMode: typeof EditMode;
        FullScreen: typeof Fullscreen
    }
}


/* *
 *
 *  Namespace
 *
 * */


const G = window.Dashboards ?? Globals as unknown as Dashboards;

G.EditMode = EditMode;
G.FullScreen = Fullscreen;


/* *
 *
 *  Default Export
 *
 * */


export default G;
