/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions';
import type ScatterPointOptions from '../Scatter/ScatterPointOptions';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type { GeoJSONGeometryMultiPoint } from '../../Maps/GeoJSON';
import type { PointMarkerStatesOptions } from '../../Core/Series/PointOptions';

/* *
 *
 *  Declarations
 *
 * */

export interface MapPointOptions extends ScatterPointOptions {
    color?: ColorType;
    dataLabels?: DataLabelOptions;
    drilldown?: string;
    geometry?: GeoJSONGeometryMultiPoint;
    id?: string;
    labelrank?: number;
    middleX?: number;
    middleY?: number;
    name?: string;
    path?: (string|SVGPath);
    properties?: AnyRecord;
    states?: PointMarkerStatesOptions<MapPointOptions>;
    value?: (number|null);
}

/* *
 *
 *  Default Export
 *
 * */

export default MapPointOptions;
