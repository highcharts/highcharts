/* *
 *
 *  Highcharts UI Kit module - Button
 *
 *  (c) 2025 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

/**
 * Button variant types for styling.
 */
export type ButtonVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger';

/**
 * Button size options.
 */
export type ButtonSize = 'small' | 'medium' | 'large';

/**
 * Configuration options for the Button component.
 */
export interface ButtonOptions {
    text?: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    active?: boolean;
    id?: string;
    className?: string;
    onClick?: (event: Event, target: HTMLElement) => void;
}
