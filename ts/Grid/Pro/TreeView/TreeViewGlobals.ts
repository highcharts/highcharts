/* *
 *
 *  Grid Tree View globals
 *
 *  (c) 2020-2026 Highsoft AS
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
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
    tbodySticky: Globals.classNamePrefix + 'tbody-sticky',
    tbodyStickyActive: Globals.classNamePrefix + 'tbody-sticky-active',
    tree: Globals.classNamePrefix + 'tree',
    toggle: Globals.classNamePrefix + 'tree-toggle',
    toggleIcon: Globals.classNamePrefix + 'tree-toggle-icon',
    value: Globals.classNamePrefix + 'tree-value'
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
