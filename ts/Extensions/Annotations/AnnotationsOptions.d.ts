/* *
 *
 *  (c) 2009-2021 Highsoft, Black Label
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
} from '../../Core/Renderer/AlignObject';
import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type Annotation from './Annotation';
import type AnnotationControllableOptionsObject from './Mixins/ControllableOptions';
import type {
    AnnotationControlPointOptionsObject
} from './ControlPointOptions';
import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type { DataLabelOverflowValue } from '../../Core/Series/DataLabelOptions';
import type { EventCallback } from '../../Core/Callback';
import type FormatUtilities from '../../Core/FormatUtilities';
import type MockPointOptions from './MockPointOptions';
import type Point from '../../Core/Series/Point';
import type ShadowOptionsObject from '../../Core/Renderer/ShadowOptionsObject';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';

/* *
 *
 *  Declarations
 *
 * */

export type AnnotationDraggableValue = (''|'x'|'y'|'xy');

export interface AnnotationsEventsOptions {
    afterUpdate?: EventCallback<Annotation>;
    add?: EventCallback<Annotation>;
    click?: EventCallback<Annotation>;
    remove?: EventCallback<Annotation>;
}
export interface AnnotationsLabelOptions extends AnnotationControllableOptionsObject {
    align: AlignValue;
    allowOverlap: boolean;
    backgroundColor: ColorType;
    borderColor: ColorType;
    borderRadius: number;
    borderWidth: number;
    className: string;
    crop: boolean;
    distance?: number;
    format?: string;
    formatter: FormatUtilities.FormatterCallback<Point>;
    includeInDataExport: boolean;
    overflow: DataLabelOverflowValue;
    padding: number;
    shadow: (boolean|Partial<ShadowOptionsObject>);
    shape: SymbolKey;
    style: CSSObject;
    text?: string;
    type?: string;
    useHTML: boolean;
    verticalAlign: VerticalAlignValue;
    x: number;
    y: number;
}
export interface AnnotationsLabelsOptions extends AnnotationsLabelOptions {
    color?: ColorType;
    dashStyle?: DashStyleValue;
    // formatter: FormatterCallbackFunction<T>;
    point?: (string|MockPointOptions);
    itemType?: string;
    vertical?: VerticalAlignValue;
    xAxis?: number|string;
    yAxis?: number|string;
}
export interface AnnotationsOptions extends AnnotationControllableOptionsObject { // @todo AnnotationOptions.d.ts
    animation: Partial<AnimationOptions>;
    controlPointOptions: AnnotationControlPointOptionsObject;
    crop: boolean;
    draggable: AnnotationDraggableValue;
    events: AnnotationsEventsOptions;
    id?: (number|string);
    itemType?: string;
    labelOptions?: AnnotationsLabelOptions;
    labels: Array<AnnotationsLabelsOptions>;
    shapeOptions: AnnotationsShapeOptions;
    shapes?: Array<AnnotationsShapesOptions>;
    type?: string;
    typeOptions: AnnotationsTypeOptions;
    visible: boolean;
    zIndex: number;
}
export interface AnnotationsShapeOptions extends AnnotationControllableOptionsObject {
    d?: (string|Function|SVGPath);
    fill: ColorType;
    height?: number;
    r: number;
    ry: number;
    shapes: Array<AnnotationsShapeOptions>;
    snap: number;
    src: string;
    stroke: ColorString;
    strokeWidth: number;
    type: string;
    width?: number;
}
export interface AnnotationsShapesOptions extends AnnotationsShapeOptions {
    markerEnd?: string;
    markerStart?: string;
    point?: (string|MockPointOptions);
    points?: Array<(string|MockPointOptions)>;
}
export interface AnnotationsTypeOptions {
    background?: AnnotationsShapeOptions;
    height?: number;
    line?: AnnotationsShapeOptions;
    point: MockPointOptions;
    points?: Array<AnnotationsTypePointsOptions>;
    xAxis?: number;
    yAxis?: number;
}
export interface AnnotationsTypePointsOptions {
    controlPoint?: number;
    x?: number;
    xAxis?: number;
    y?: number;
    yAxis?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default AnnotationsOptions;
