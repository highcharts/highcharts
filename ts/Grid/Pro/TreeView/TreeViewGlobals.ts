/* *
 *
 *  Grid Tree View globals
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *  Authors:
 *  - Dawid Dragula
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */

import Globals from '../../Core/Globals.js';


/* *
 *
 *  Constants
 *
 * */

export const classNames = {
    cellAggregated: Globals.classNamePrefix + 'cell-aggregated',
    cellTree: Globals.classNamePrefix + 'cell-tree',
    disclosure: Globals.classNamePrefix + 'disclosure',
    disclosureIcon: Globals.classNamePrefix + 'disclosure-icon',
    disclosureToggle: Globals.classNamePrefix + 'disclosure-toggle',
    disclosureValue: Globals.classNamePrefix + 'disclosure-value',
    rowCollapsed: Globals.classNamePrefix + 'row-collapsed',
    rowExpanded: Globals.classNamePrefix + 'row-expanded',
    rowTree: Globals.classNamePrefix + 'row-tree',
    tbodySticky: Globals.classNamePrefix + 'tbody-sticky',
    tbodyStickyActive: Globals.classNamePrefix + 'tbody-sticky-active'
} as const;

export const cssVariables = {
    depth: '--ig-tree-depth'
} as const;


/* *
 *
 *  Default Export
 *
 * */

export default {
    classNames,
    cssVariables
} as const;
