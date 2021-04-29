/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

interface Proj4Instance {
    forward([x, y]: [number, number]): [number, number];
    inverse([x, y]: [number, number]): [number, number];
}
interface Proj4 {
    (
        projString: string
    ): Proj4Instance;
}

export interface ProjectionOptions {
    // d3?: any;
    // proj4?: Proj4;
    projectionName?: string;
    projString?: string;
    lat0?: number;
    latTS?: number;
    lon0?: number;
    over?: boolean;
    x0?: number;
    y0?: number;
}

export default ProjectionOptions;
