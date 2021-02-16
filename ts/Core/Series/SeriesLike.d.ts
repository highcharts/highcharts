/* *
 *
 *  (c) 2010-2021 Torstein Honsi
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

import type PointLike from './PointLike';
import type SeriesOptions from './SeriesOptions';
import type { StatesOptionsKey } from './StatesOptions';
import type SVGElement from '../Renderer/SVG/SVGElement';

/* *
 *
 *  Declarations
 *
 * */

/**
 * Helper interface for series types to add optional members to all series
 * instances.
 *
 * Use the `declare module 'Types'` pattern to overload the interface in this
 * definition file.
 */
export interface SeriesLike {
    colorIndex?: number;
    finishedAnimating?: boolean;
    index?: number;
    isDirty?: boolean;
    group?: SVGElement;
    linkedParent?: SeriesLike;
    linkedSeries: Array<SeriesLike>;
    markerGroup?: SVGElement;
    name: string;
    opacity?: number;
    options: SeriesOptions;
    points: Array<PointLike>;
    state?: StatesOptionsKey;
    type: string;
    userOptions: DeepPartial<SeriesOptions>;
    visible: boolean;
    render(): void;
    translate(): void;
    update(options: DeepPartial<SeriesOptions>): void;
}

/* *
 *
 *  Export
 *
 * */

export default SeriesLike;
