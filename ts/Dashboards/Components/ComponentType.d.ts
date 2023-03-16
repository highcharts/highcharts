/* *
 *
 *  Data Layer
 *
 *  (c) 2012-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type DataGridComponent from '../../Extensions/DashboardPlugins/DataGridComponent';
import type HighchartsComponent from '../../Extensions/DashboardPlugins/HighchartsComponent';
import type HTMLComponent from './HTMLComponent';
import type KPIComponent from './KPIComponent';
import type ThresholdComponent from './ThresholdComponent';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Contains all possible types of the class registry.
 */
// export type ComponentType =
// ComponentTypeRegistry[keyof ComponentTypeRegistry];

export type ComponentTypes =
    DataGridComponent.ComponentType |
    HighchartsComponent.ComponentType |
    HTMLComponent.ComponentType |
    KPIComponent.ComponentType |
    ThresholdComponent.ComponentType;

/**
 * Describes the class registry as a record object with class name and their
 * class types (aka class constructor).
 */
export interface ComponentTypeRegistry {
    // nothing here yet
}

/* *
 *
 *  Export
 *
 * */

export default ComponentTypes;
