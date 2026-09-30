/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Hønsi
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../Core/Color/ColorType.js';
import type DataLabelOptions from '../../Core/Series/DataLabelOptions.js';
import type ScatterPointOptions from '../Scatter/ScatterPointOptions.js';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath.js';
import type { GeoJSONGeometryMultiPoint } from '../../Maps/GeoJSON.js';
import type { PointDataLabelOptionsModifier } from '../../Core/Series/DataLabel.js';
import type { PointMarkerStatesOptions } from '../../Core/Series/PointOptions.js';

/* *
 *
 *  Declarations
 *
 * */

export interface MapPointOptions extends ScatterPointOptions {
    color?: ColorType;
    dataLabels?: (MapPointDataLabelOptions | Array<MapPointDataLabelOptions>);
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

export type MapPointDataLabelOptions =
    DataLabelOptions & PointDataLabelOptionsModifier;

/* *
 *
 *  Default Export
 *
 * */

export default MapPointOptions;
