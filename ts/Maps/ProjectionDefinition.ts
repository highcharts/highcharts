/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type ProjectionOptions from './ProjectionOptions';

export type ProjectionFunction = {
    (coords: [number, number]): [number, number];
}

export type Projector = {
    forward: ProjectionFunction;
    inverse: ProjectionFunction;
}

export type ProjectionDefinition = {
    forward: ProjectionFunction;
    inverse: ProjectionFunction;
    init?(options: ProjectionOptions): void;
    maxLatitude?: number;
}

export default ProjectionDefinition;
