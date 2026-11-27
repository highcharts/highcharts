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

import type {
    AlignValue,
    VerticalAlignValue
} from '../../../Core/Renderer/AlignObject';
import type { AnnotationPoint } from '../AnnotationSeries';
import type ColorType from '../../../Core/Color/ColorType';
import type CSSObject from '../../../Core/Renderer/CSSObject';
import type ControlTargetOptions from '../ControlTargetOptions';
import type DashStyleValue from '../../../Core/Renderer/DashStyleValue';
import type {
    DataLabelsOverflowValue
} from '../../../Core/Series/DataLabelOptions';
import type Templating from '../../../Core/Templating';
import type {
    ShadowOptionsObject
} from '../../../Core/Renderer/ShadowOptionsObject';
import type SVGPath from '../../../Core/Renderer/SVG/SVGPath';
import type { SymbolKey } from '../../../Core/Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

/** @internal */
export interface ControllableLabelOptions extends ControllableOptions {
    align?: AlignValue;
    allowOverlap?: boolean;
    backgroundColor?: ColorType;
    color?: ColorType;
    borderColor?: ColorType;
    borderRadius?: number;
    borderWidth?: number;
    crop?: boolean;
    dashStyle?: DashStyleValue;
    distance?: number;
    format?: string;
    formatter?: Templating.FormatterCallback<AnnotationPoint>;
    includeInDataExport?: boolean;
    overflow?: DataLabelsOverflowValue;
    padding?: number;
    shadow?: (boolean|Partial<ShadowOptionsObject>);
    shape?: SymbolKey;
    style?: CSSObject;
    text?: string;
    useHTML?: boolean;
    verticalAlign?: VerticalAlignValue;
    xAxis?: number|string;
    yAxis?: number|string;
}

/** @internal */
export interface ControllableOptions extends ControlTargetOptions {
    id?: (number|string);
    markerEnd?: string;
    markerStart?: string;
    r?: number;
    rx?: number;
    ry?: number;
    type?: string;
}

/** @internal */
export interface ControllableShapeOptions extends ControllableOptions {
    d?: (string|Function|SVGPath);
    fill?: ColorType;
    height?: number;
    snap?: number;
    src?: string;
    stroke?: ColorType;
    strokeWidth?: number;
    width?: number;
    xAxis?: number;
    yAxis?: number;
}

/* *
 *
 *  Imports
 *
 * */

/** @internal */
export default ControllableOptions;
