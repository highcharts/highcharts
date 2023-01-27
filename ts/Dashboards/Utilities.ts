/* *
 *
 *  (c) 2009 - 2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sebastian Bochan
 *  - Wojciech Chmiel
 *  - Gøran Slettemark
 *  - Sophie Bremer
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import U from '../Core/Utilities.js';
const { uniqueKey: coreUniqueKey } = U;

/* *
 *
 *  Functions
 *
 * */

/**
 * Creates a session-dependent unique key string for reference purposes.
 *
 * @function Dashboard.uniqueKey
 *
 * @return {string}
 * Unique key string
 */
function uniqueKey(): string {
    return `dashboard-${coreUniqueKey().replace('highcharts-', '')}`;
}

/* *
 *
 *  Default Export
 *
 * */

const Utilities = {
    uniqueKey
};

export default Utilities;
