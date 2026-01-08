/* *
 *
 *  (c) 2010-2026 Highsoft AS
 *  Author: Torstein Honsi
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

/* *
 *
 *  Imports
 *
 * */

import type { DeepPartial } from '../../Shared/Types';
import type PointBase from './PointBase';
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
export interface SeriesBase {
    colorIndex?: number;
    finishedAnimating?: boolean;
    index?: number;
    isDirty?: boolean;
    group?: SVGElement;
    linkedParent?: SeriesBase;
    linkedSeries: Array<SeriesBase>;
    markerGroup?: SVGElement;
    name: string;
    opacity?: number;
    options: SeriesOptions;
    points: Array<PointBase>;
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
 *  Default Export
 *
 * */

export default SeriesBase;
