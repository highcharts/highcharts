/* *
 *
 *  (c) 2016 Highsoft AS
 *  Authors: Øystein Moseng, Lars A. V. Cabrera
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
} from '../Core/Renderer/AlignObject';
import type ColorString from '../Core/Color/ColorString';
import type ColorType from '../Core/Color/ColorType';
import type DashStyleValue from '../Core/Renderer/DashStyleValue';

/* *
 *
 *  Declarations
 *
 * */

declare module '../Core/Options'{
    interface Options {
        connectors?: ConnectorsOptions;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        connectors?: ConnectorsOptions;
    }
}

export interface ConnectorsEndMarkerOptions {
    align?: AlignValue;
    color?: ColorType;
    enabled?: boolean;
    height?: number;
    inside?: boolean;
    lineColor?: ColorString;
    lineWidth?: number;
    radius?: number;
    symbol?: string;
    verticalAlign?: VerticalAlignValue;
    width?: number;
}

export interface ConnectorsMarkerOptions {
    align?: AlignValue;
    color?: ColorType;
    enabled?: boolean;
    height?: number;
    inside?: boolean;
    lineColor?: ColorString;
    lineWidth?: number;
    radius?: number;
    symbol?: string;
    verticalAlign?: VerticalAlignValue;
    width?: number;
}

export interface ConnectorsOptions {
    algorithmMargin?: number;
    dashStyle?: DashStyleValue;
    enabled?: boolean;
    endMarker?: ConnectorsEndMarkerOptions;
    lineColor?: ColorString;
    lineWidth?: number;
    marker?: ConnectorsMarkerOptions;
    radius?: number;
    startMarker?: ConnectorsStartMarkerOptions;
    type?: PathfinderTypeValue;
}

export interface ConnectorsStartMarkerOptions {
    align?: AlignValue;
    color?: ColorType;
    enabled?: boolean;
    height?: number;
    inside?: boolean;
    lineColor?: ColorString;
    lineWidth?: number;
    radius?: number;
    symbol?: string;
    verticalAlign?: VerticalAlignValue;
    width?: number;
}

export type PathfinderTypeValue = (
    'straight'|
    'fastAvoid'|
    'simpleConnect'|
    string
);

/* *
 *
 *  Default Export
 *
 * */

export default ConnectorsOptions;
