/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type { MapBounds } from './MapViewOptions';

export type ProjectionRotationOption = (
    [number, number]|[number, number, number]
);

export interface ProjectionOptions {
    projectedBounds?: 'world'|MapBounds;
    name?: string;
    parallels?: number[];
    rotation?: ProjectionRotationOption;
}

export default ProjectionOptions;
