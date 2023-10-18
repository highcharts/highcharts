/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { MapBounds } from './MapViewOptions';
import type { ProjectionRegistryName } from './Projections/ProjectionRegistry';

/* *
 *
 *  Declarations
 *
 * */

export type ProjectionRotationOption = (
    [number, number]|[number, number, number]
);

export interface ProjectionOptions {
    projectedBounds?: ('world'|MapBounds);
    name?: ProjectionRegistryName;
    parallels?: number[];
    rotation?: ProjectionRotationOption;
}

/* *
 *
 *  Default Export
 *
 * */

export default ProjectionOptions;
