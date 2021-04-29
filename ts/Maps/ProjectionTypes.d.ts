/* *
 *
 *  (c) 2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

type ProjectionDefinition = {
    forward(lonLat: [number, number]): [number, number];
    inverse(xy: [number, number]): [number, number];
    maxLatitude?: number;
}

export default ProjectionDefinition;
