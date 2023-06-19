/* *
 *
 *  (c) 2009-2021 Øystein Moseng
 *
 *  Default options for accessibility.
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

import type Accessibility from '../Accessibility';
import type Chart from '../../Core/Chart/Chart';
import type ColorType from '../../Core/Color/ColorType';
import type { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';
import type Options from '../../Core/Options';
import type Point from '../../Core/Series/Point';
import type Series from '../../Core/Series/Series';

/* *
 *
 *  Declarations
 *
 * */

export interface AccessibilityAnnouncementFormatter {
    (
        updatedSeries: Array<Series>,
        addedSeries?: Series,
        addedPoint?: Point,
    ): false|string;
}

export interface AccessibilityAnnounceNewDataOptions {
    announcementFormatter?: AccessibilityAnnouncementFormatter;
    enabled: boolean;
    interruptUser: boolean;
    minAnnounceInterval: number;
}

export interface AccessibilityKeyboardNavigationFocusBorderOptions {
    enabled: boolean;
    hideBrowserFocusOutline: boolean;
    margin: number;
    style: FocusBorderStyleObject;
}

export interface AccessibilityKeyboardNavigationOptions {
    enabled: boolean;
    focusBorder: AccessibilityKeyboardNavigationFocusBorderOptions;
    order: Array<string>;
    seriesNavigation: (
        AccessibilityKeyboardNavigationSeriesNavigationOptions
    );
    wrapAround: boolean;
}

export interface AccessibilityKeyboardNavigationSeriesNavigationOptions {
    mode?: string;
    pointNavigationEnabledThreshold: (boolean|number);
    skipNullPoints: boolean;
    rememberPointFocus: boolean;
}

export interface AccessibilityOptions {
    announceNewData: AccessibilityAnnounceNewDataOptions;
    customComponents?: AnyRecord;
    description?: string;
    enabled: boolean;
    highContrastTheme: AnyRecord;
    keyboardNavigation: AccessibilityKeyboardNavigationOptions;
    landmarkVerbosity: string;
    linkedDescription: (string|HTMLDOMElement);
    point: AccessibilityPointOptions;
    series: AccessibilitySeriesOptions;
    screenReaderSection: AccessibilityScreenReaderSectionOptions;
    typeDescription?: string;
}

export interface AccessibilityPointOptions {
    dateFormat?: string;
    dateFormatter?: ScreenReaderFormatterCallbackFunction<Point>;
    describeNull: boolean;
    descriptionFormat?: string;
    descriptionFormatter?: ScreenReaderFormatterCallbackFunction<Point>;
    valueDecimals?: number;
    valueDescriptionFormat: string;
    valuePrefix?: string;
    valueSuffix?: string;
}

export interface AccessibilityScreenReaderSectionOptions {
    afterChartFormat: string;
    afterChartFormatter?: ScreenReaderFormatterCallbackFunction<Chart>;
    axisRangeDateFormat: string;
    beforeChartFormat: string;
    beforeChartFormatter?: ScreenReaderFormatterCallbackFunction<Chart>;
    onPlayAsSoundClick?: ScreenReaderClickCallbackFunction;
    onViewDataTableClick?: ScreenReaderClickCallbackFunction;
}

export interface AccessibilitySeriesOptions {
    descriptionFormat: string;
    descriptionFormatter?: (
        ScreenReaderFormatterCallbackFunction<Series>
    );
    describeSingleSeries: boolean;
    pointDescriptionEnabledThreshold: (boolean|number);
}

export interface AnnotationsAccessibilityOptionsObject {
    description?: string;
}

export interface AxisAccessibilityOptions {
    description?: string;
    enabled?: boolean;
    rangeDescription?: string;
}

export interface ExportingAccessibilityOptions {
    enabled: boolean;
}

export interface FocusBorderStyleObject {
    borderRadius?: number;
    color?: ColorType;
    lineWidth?: number;
}

export interface LegendAccessibilityKeyboardNavigationOptions {
    enabled: boolean;
}

export interface LegendAccessibilityOptions {
    enabled: boolean;
    keyboardNavigation: LegendAccessibilityKeyboardNavigationOptions;
}

export interface PointAccessibilityOptionsObject {
    description?: string;
    enabled?: boolean;
}

export interface ScreenReaderClickCallbackFunction {
    (evt: MouseEvent, chart?: Accessibility.ChartComposition): void;
}

export interface ScreenReaderFormatterCallbackFunction<T> {
    (context: T): string;
}

export interface SeriesAccessibilityKeyboardNavigationOptions {
    enabled?: boolean;
}

export interface SeriesAccessibilityOptions {
    description?: string;
    descriptionFormat?: string;
    enabled?: boolean;
    exposeAsGroupOnly?: boolean;
    keyboardNavigation?: (
        SeriesAccessibilityKeyboardNavigationOptions
    );
    point: AccessibilityPointOptions;
}

declare module '../../Core/Axis/AxisOptions' {
    interface AxisOptions {
        accessibility?: AxisAccessibilityOptions;
    }
}

declare module '../../Core/Legend/LegendOptions' {
    interface LegendOptions {
        accessibility?: LegendAccessibilityOptions;
    }
}

declare module '../../Core/Options'{
    interface Options {
        accessibility?: AccessibilityOptions;
    }
}

declare module '../../Core/Series/PointOptions' {
    interface PointOptions {
        accessibility?: PointAccessibilityOptionsObject;
    }
}

declare module '../../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        accessibility?: SeriesAccessibilityOptions;
    }
}

declare module '../../Extensions/Annotations/Controllables/ControllableOptions' {
    interface ControllableLabelOptions {
        accessibility?: AnnotationsAccessibilityOptionsObject;
    }
}

declare module '../../Extensions/Exporting/ExportingOptions' {
    interface ExportingOptions {
        accessibility?: ExportingAccessibilityOptions;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default Options;
