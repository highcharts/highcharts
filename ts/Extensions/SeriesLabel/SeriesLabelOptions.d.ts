/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
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
