/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type { MapViewInsetsOptions } from './MapViewOptions';

import { Palette } from '../Core/Color/Palettes.js';

/**
 * Generic options for the placement and appearance of map insets like
 * non-contiguous territories.
 *
 * @since 10.0.0
 * @product      highmaps
 * @optionparent mapView.insetOptions
 */
const defaultOptions: MapViewInsetsOptions = {
    /**
     * The border color of the insets.
     *
     * @sample maps/mapview/insetoptions-border
     *         Inset border options
     * @type {Highcharts.ColorType}
     */
    borderColor: Palette.neutralColor20,
    /**
     * The pixel border width of the insets.
     *
     * @sample maps/mapview/insetoptions-border
     *         Inset border options
     */
    borderWidth: 1,
    /**
     * @ignore-option
     */
    center: [0, 0],
    /**
     * The padding of the insets. Can be either a number of pixels, a percentage
     * string, or an array of either. If an array is given, it sets the top,
     * right, bottom, left paddings respectively.
     *
     * @type {number|string|Array<number|string>}
     */
    padding: '10%',
    /**
     * What coordinate system the `field` and `borderPath` should relate to. If
     * `plotBox`, they will be fixed to the plot box and responsively move in
     * relation to the main map. If `mapBoundingBox`, they will be fixed to the
     * map bounding box, which is constant and centered in different chart sizes
     * and ratios.
     *
     * @validvalue ["plotBox", "mapBoundingBox"]
     */
    relativeTo: 'mapBoundingBox',
    /**
     * What units to use for the `field` and `borderPath` geometries. If
     * `percent` (default), they relate to the box given in `relativeTo`. If
     * `pixels`, they are absolute values.
     *
     * @validvalue ["percent", "pixels"]
     */
    units: 'percent'
};

/**
 * The individual MapView insets, typically used for non-contiguous areas of a
 * country. Each item inherits from the generic `insetOptions`.
 *
 * Some of the TopoJSON files of the [Highcharts Map
 * Collection](https://code.highcharts.com/mapdata/) include a property called
 * `hc-recommended-mapview`, and some of these include insets. In order to
 * override the recommended inset options, an inset option with a matching id
 * can be applied, and it will be merged into the embedded settings.
 *
 * @sample      maps/mapview/insets-extended
 *              Extending the embedded insets
 * @sample      maps/mapview/insets-complete
 *              Complete inset config from scratch
 *
 * @extends     mapView.insetOptions
 * @type        Array<Object>
 * @product     highmaps
 * @apioption   mapView.insets
 */

/**
 * A geometry object of type `MultiLineString` defining the border path of the
 * inset in terms of `units`. If undefined, a border is rendered around the
 * `field` geometry. It is recommended that the `borderPath` partly follows the
 * outline of the `field` in order to make pointer positioning consistent.
 *
 * @sample    maps/mapview/insets-complete
 *            Complete inset config with `borderPath`
 *
 * @product   highmaps
 * @type      {Object|undefined}
 * @apioption mapView.insets.borderPath
 */

/**
 * A geometry object of type `Polygon` defining where in the chart the inset
 * should be rendered, in terms of `units` and relative to the `relativeTo`
 * setting. If a `borderPath` is omitted, a border is rendered around the field.
 * If undefined, the inset is rendered in the full plot area.
 *
 * @sample    maps/mapview/insets-extended
 *            Border path emitted, field is rendered
 *
 * @product   highmaps
 * @type      {Object|undefined}
 * @apioption mapView.insets.field
 */

/**
 * A geometry object of type `Polygon` encircling the shapes that should be
 * rendered in the inset, in terms of geographic coordinates. Geometries within
 * this geometry are removed from the default map view and rendered in the
 * inset.
 *
 * @sample    maps/mapview/insets-complete
 *            Complete inset config with `geoBounds`
 *
 * @product   highmaps
 * @type      {Object}
 * @apioption mapView.insets.geoBounds
 */

/**
 * The id of the inset, used for internal reference.
 *
 * @sample    maps/mapview/insets-extended
 *            Extending recommended insets by id
 *
 * @product   highmaps
 * @type      {string}
 * @apioption mapView.insets.id
 */

/**
 * The projection options for the inset.
 *
 * @product   highmaps
 * @type      {Object}
 * @extends   mapView.projection
 * @apioption mapView.insets.projection
 */

/* *
 *
 *  Default Export
 *
 * */

export default defaultOptions;
