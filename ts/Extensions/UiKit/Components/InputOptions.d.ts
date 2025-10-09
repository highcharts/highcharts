/* *
 *
 *  Highcharts UI Kit module - Input
 *
 *  (c) 2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/**
 * Configuration options for the Input component.
 */
export interface InputOptions {
    labelText?: string;
    placeholder?: string;
    value?: string;
    type?: string;
    id?: string;
    className?: string;
    onChange?: (value: string, event: Event, target: HTMLElement) => void;
    onFocus?: (event: Event, target: HTMLElement) => void;
    onBlur?: (event: Event, target: HTMLElement) => void;
}
