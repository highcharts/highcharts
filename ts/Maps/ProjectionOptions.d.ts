/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

export type ProjectionRotationOption = [number, number]|[number, number, number];

export interface ProjectionOptions {
    // d3?: any;
    // proj4?: Proj4;
    projectionName?: string;
    // projString?: string;
    // lat0?: number;
    // latTS?: number;
    // lon0?: number;
    // over?: boolean;
    rotation?: ProjectionRotationOption;
    // x0?: number;
    // y0?: number;
}

export default ProjectionOptions;
