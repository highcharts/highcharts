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

import type AnnotationsOptions from './AnnotationsOptions';

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/LangOptions'{
    interface LangOptions {
        navigation?: LangNavigationOptions;
    }
}

declare module '../Exporting/NavigationOptions' {
    interface NavigationOptions {
        annotationsOptions?: DeepPartial<AnnotationsOptions>;
        bindings?: Record<string, NavigationBindingOptions>;
        bindingsClassName?: string;
        events?: NavigationEventsOptions;
        iconsURL?: string;
    }
}

interface IndicatorAliases {
    [key: string]: Array<string>;
}

interface LangNavigationOptions {
    popup?: PopupOptions;
}

export interface LangOptions {
    navigation: LangNavigationOptions;
}

interface NavigationBindingOptions {
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
    annotationsOptions?: DeepPartial<AnnotationsOptions>;
    bindings?: Record<string, NavigationBindingOptions>;
    bindingsClassName?: string;
    events?: NavigationEventsOptions;
    iconsURL?: string;
}

interface PopupOptions {
    [key: string]: (string | IndicatorAliases | undefined);
    indicatorAliases?: IndicatorAliases;
}

/* *
 *
 *  Default Export
 *
 * */

export default NavigationBindingOptions;
