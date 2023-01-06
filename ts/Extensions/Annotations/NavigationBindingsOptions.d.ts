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

import type AnnotationOptions from './AnnotationOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Options'{
    interface LangOptions {
        navigation?: LangNavigationOptions;
    }
}

declare module '../Exporting/NavigationOptions' {
    interface NavigationOptions {
        annotationsOptions?: DeepPartial<AnnotationOptions>;
        bindings?: Record<string, NavigationBindingsOptions>;
        bindingsClassName?: string;
        events?: NavigationEventsOptions;
        iconsURL?: string;
    }
}

interface IndicatorAliases {
    [key: string]: Array<string>;
}

export interface LangNavigationOptions {
    popup?: PopupOptions;
}

export interface LangOptions {
    navigation: LangNavigationOptions;
}

interface NavigationBindingsOptions {
    noDataState?: 'normal' | 'disabled';
    className: string;
    end?: Function;
    init?: Function;
    start?: Function;
    steps?: Array<Function>;
}

interface NavigationEventsOptions {
    closePopup?: Function;
    deselectButton?: Function;
    selectButton?: Function;
    showPopup?: Function;
}

export interface NavigationOptions {
    annotationsOptions?: DeepPartial<AnnotationOptions>;
    bindings?: Record<string, NavigationBindingsOptions>;
    bindingsClassName?: string;
    events?: NavigationEventsOptions;
    iconsURL?: string;
}

export interface PopupOptions {
    [key: string]: (string | IndicatorAliases | undefined);
    indicatorAliases?: IndicatorAliases;
}

/* *
 *
 *  Default Export
 *
 * */

export default NavigationBindingsOptions;
