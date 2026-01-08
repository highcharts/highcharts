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

    /* *
     *
     *  Properties
     *
     * */

    /** @internal */
    colorIndex?: number;

    /** @internal */
    finishedAnimating?: boolean;

    /** @internal */
    isDirty?: boolean;

    /** @internal */
    group?: SVGElement;

    /** @internal */
    markerGroup?: SVGElement;

    /**
     * The series name as given in the options. Defaults to
     * "Series {n}".
     *
     * @name Highcharts.Series#name
     */
    name: string;

    /** @internal */
    opacity?: number;

    /** @internal */
    points: Array<PointBase>;

    /** @internal */
    state?: StatesOptionsKey;

    /**
     * Read only. The series' visibility state as set by {@link Series#show},
     * {@link Series#hide}, or in the initial configuration.
     *
     * @name Highcharts.Series#visible
     */
    visible: boolean;

    /* *
     *
     *  Functions
     *
     * */

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
