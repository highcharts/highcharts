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
 * Imports
 *
 * */

import type {
    AlignValue,
    VerticalAlignValue
} from '../../Core/Renderer/AlignObject';
import type ColorType from '../../Core/Color/ColorType';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type { DataLabelOverflowValue } from '../../Core/Series/DataLabelOptions';
import type FormatUtilities from '../../Core/FormatUtilities';
import type PointClass from '../../Core/Series/Point';
import type ShadowOptionsObject from '../../Core/Renderer/ShadowOptionsObject';
import type SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer';
import type { SymbolKey } from '../../Core/Renderer/SVG/SymbolType';

/* *
 *
 * Declarations
 *
 * */

export interface AnnotationsOptions {
    // Nothing here
}

export interface AnnotationsLabelOptions extends Highcharts.AnnotationControllableOptionsObject {
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
    formatter: FormatUtilities.FormatterCallback<PointClass>;
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

export default AnnotationsOptions;
