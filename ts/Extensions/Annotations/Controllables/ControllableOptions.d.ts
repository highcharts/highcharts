/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type {
    AlignValue,
    VerticalAlignValue
} from '../../../Core/Renderer/AlignObject';
import type { AnnotationPoint } from '../AnnotationSeries';
import type ColorType from '../../../Core/Color/ColorType';
import type { ControlPointOptionsObject } from '../ControlPointOptions';
import type CSSObject from '../../../Core/Renderer/CSSObject';
import type DashStyleValue from '../../../Core/Renderer/DashStyleValue';
import type {
    DataLabelOverflowValue
} from '../../../Core/Series/DataLabelOptions';
import type FormatUtilities from '../../../Core/FormatUtilities';
import type MockPointOptions from '../MockPointOptions';
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

export interface ControllableLabelOptions extends ControllableOptions {
    align: AlignValue;
    allowOverlap: boolean;
    backgroundColor?: ColorType;
    color?: ColorType;
    borderColor?: ColorType;
    borderRadius?: number;
    borderWidth?: number;
    crop: boolean;
    dashStyle?: DashStyleValue;
    distance?: number;
    format?: string;
    formatter: FormatUtilities.FormatterCallback<AnnotationPoint>;
    includeInDataExport: boolean;
    overflow: DataLabelOverflowValue;
    padding?: number;
    shadow: (boolean|Partial<ShadowOptionsObject>);
    shape: SymbolKey;
    style: CSSObject;
    text?: string;
    useHTML: boolean;
    verticalAlign: VerticalAlignValue;
    x: number;
    xAxis?: number|string;
    y: number;
    yAxis?: number|string;
}

export interface ControllableOptions {
    className?: string;
    controlPointOptions?: ControlPointOptionsObject;
    controlPoints?: Array<ControlPointOptionsObject>;
    id?: (number|string);
    markerEnd?: string;
    markerStart?: string;
    point?: (string|MockPointOptions);
    points?: Array<(string|MockPointOptions)>;
    r?: number;
    rx?: number;
    ry?: number;
    type?: string;
    x?: number;
    y?: number;
}

export interface ControllableShapeOptions extends ControllableOptions {
    d?: (string|Function|SVGPath);
    fill?: ColorType;
    height?: number;
    r: number;
    snap?: number;
    src?: string;
    stroke?: ColorType;
    strokeWidth?: number;
    type?: string;
    width?: number;
}

/* *
 *
 *  Imports
 *
 * */

export default ControllableOptions;
