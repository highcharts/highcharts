/* *
 *
 *  Highcharts Breadcrumbs module
 *
 *  Authors: Grzegorz Blachlinski, Karol Kolodziej
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
import type { ButtonRelativeToValue } from '../../Maps/MapNavigationOptions';
import type ButtonThemeObject from '../../Core/Renderer/SVG/ButtonThemeObject';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type {
    PointOptions,
    PointShortOptions
} from '../../Core/Series/PointOptions';
import type SeriesOptions from '../../Core/Series/SeriesOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/Treemap/TreemapSeriesOptions' {
    interface DrilldownOptions {
        breadcrumbs?: BreadcrumbsOptions;
    }
}

declare module '../../Series/Treemap/TreemapSeriesOptions' {
    interface TreemapSeriesOptions {
        breadcrumbs?: BreadcrumbsOptions;
    }
}

declare module '../../Extensions/Exporting/NavigationOptions' {
    interface NavigationOptions {
        breadcrumbs?: BreadcrumbsOptions;
    }
}

/* *
 *
 *  API Options
 *
 * */

export type BreadcrumbOptions = {
    level: number,
    levelOptions: (SeriesOptions|PointOptions|PointShortOptions)
};

export interface BreadcrumbsAlignOptions {
    align: AlignValue;
    verticalAlign: VerticalAlignValue;
    x: number;
    y?: number;
    width?: number;
    height?: number;
}

export interface BreadcrumbsButtonsEventsOptions {
    click?: BreadcrumbsClickCallbackFunction;
}

export interface BreadcrumbsButtonsFormatter {
    (breadcrumb: BreadcrumbOptions): string;
}

export interface BreadcrumbsClickCallbackFunction {
    (e: Event, breadcrumb: BreadcrumbOptions): (boolean|undefined);
}

export interface BreadcrumbsOptions {
    buttonTheme: ButtonThemeObject;
    buttonSpacing: number;
    events?: BreadcrumbsButtonsEventsOptions;
    floating: boolean;
    format?: string;
    formatter?: BreadcrumbsButtonsFormatter;
    relativeTo?: ButtonRelativeToValue;
    rtl: boolean;
    position: BreadcrumbsAlignOptions;
    separator: BreadcrumbsSeparatorOptions;
    showFullPath: boolean;
    style: CSSObject;
    useHTML: boolean;
    zIndex: number;
}

export interface BreadcrumbsSeparatorOptions {
    text: string;
    style: CSSObject
}

/* *
 *
 *  Default Export
 *
 * */

export default BreadcrumbsOptions;
