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

import Dashboards from '../../Dashboards/Globals.js';
import Formula from '../../Data/Formula/Formula.js';
import MathModifier from '../../Data/Modifiers/MathModifier.js';

const G: AnyRecord = Dashboards;

if (G) {
    G.Formula = Formula;
    if (G.DataModifier) {
        G.DataModifier.types.Math = MathModifier;
    }
}

const DashboardsMath = {
    Formula,
    MathModifier
};

export default DashboardsMath;
