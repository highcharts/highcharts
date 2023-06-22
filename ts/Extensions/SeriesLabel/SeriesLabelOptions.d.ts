/* *
 *
 *  (c) 2009-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

import type CSSObject from '../../Core/Renderer/CSSObject';
import type Templating from '../../Core/Templating';
import type Series from '../../Core/Series/Series';

/* *
 *
 *  Declarations
 *
 * */

export interface LabelIntersectBoxObject {
    bottom: number;
    left: number;
    right: number;
    top: number;
}

export interface SeriesLabelOptions {
    boxesToAvoid?: Array<LabelIntersectBoxObject>;
    connectorAllowed?: boolean;
    connectorNeighbourDistance?: number;
    enabled?: boolean;
    format?: string;
    formatter?: Templating.FormatterCallback<Series>;
    maxFontSize?: (number|null);
    minFontSize?: (number|null);
    onArea?: (boolean|null);
    style?: CSSObject;
    useHTML?: boolean;
}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesLabelOptions;
