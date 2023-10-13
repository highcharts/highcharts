/* *
 *
 *  Highcharts Drilldown module
 *
 *  Author: Torstein Honsi
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
    AlignObject,
    AlignValue,
    VerticalAlignValue
} from '../../Core/Renderer/AlignObject';
import type AnimationOptions from '../../Core/Animation/AnimationOptions';
import type {
    BreadcrumbOptions,
    BreadcrumbsOptions
} from '../Breadcrumbs/BreadcrumbsOptions';
import type { ButtonRelativeToValue } from '../../Maps/MapNavigationOptions';
import type {
    CSSObject,
    CursorValue
} from '../../Core/Renderer/CSSObject';
import type { SeriesTypeOptions } from '../../Core/Series/SeriesType';

/* *
 *
 *  Declarations
 *
 * */

export interface DrilldownActiveDataLabelStyleOptions {
    color?: string;
    cursor?: string;
    fontWeight?: string;
    textDecoration?: string;
}

export interface DrilldownOptions {
    activeAxisLabelStyle?: CSSObject;
    activeDataLabelStyle?: (
        CSSObject|DrilldownActiveDataLabelStyleOptions
    );
    allowPointDrilldown?: boolean;
    animation?: (boolean|Partial<AnimationOptions>);
    breadcrumbs?: BreadcrumbsOptions;
    drillUpButton?: DrilldownDrillUpButtonOptions;
    series?: Array<SeriesTypeOptions>;
    mapZooming?: boolean;
}

export interface DrilldownDrillUpButtonOptions {
    position: (AlignObject|DrilldownDrillUpButtonPositionOptions);
    relativeTo?: ButtonRelativeToValue;
    theme?: object;
}

export interface DrilldownDrillUpButtonPositionOptions {
    align?: AlignValue;
    verticalAlign?: VerticalAlignValue;
    x?: number;
    y?: number;
}

/* *
 *
 *  Default Export
 *
 * */

export default DrilldownOptions;
