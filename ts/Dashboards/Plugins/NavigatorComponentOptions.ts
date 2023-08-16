/* *
 *
 *  (c) 2009-2023 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Sophie Bremer
 *
 * */

'use strict';


/* *
 *
 *  Imports
 *
 * */


import type Component from '../Components/Component';
import type {
    Options as HighchartsOptions
} from './HighchartsTypes';


/* *
 *
 *  Declarations
 *
 * */


export interface NavigatorComponentOptions extends Component.ComponentOptions {

    chartOptions?: HighchartsOptions;

    columnAssignments?: Record<string, string | null>;

    type: 'Navigator';

}


/* *
 *
 *  Default Export
 *
 * */


export default NavigatorComponentOptions;
