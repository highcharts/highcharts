/**
 * (c) 2009-2017 Highsoft, Black Label
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';
import '../parts/Utilities.js';
import '../parts/Chart.js';
import '../parts/Series.js';
import '../parts/Tooltip.js';

var merge = H.merge,
    addEvent = H.addEvent,
    extend = H.extend,
    each = H.each,
    isString = H.isString,
    isNumber = H.isNumber,
    defined = H.defined,
    isObject = H.isObject,
    inArray = H.inArray,
    erase = H.erase,
    find = H.find,
    format = H.format,
    pick = H.pick,
    objectEach = H.objectEach,
    uniqueKey = H.uniqueKey,
    doc = H.doc,
    splat = H.splat,
    destroyObjectProperties = H.destroyObjectProperties,
    grep = H.grep,

    tooltipPrototype = H.Tooltip.prototype,
    seriesPrototype = H.Series.prototype,
    chartPrototype = H.Chart.prototype;


/* ***************************************************************************
*
* MARKER SECTION
* Contains objects and functions for adding a marker element to a path element
*
**************************************************************************** */

/**
 * Options for configuring markers for annotations.
 *
 * An example of the arrow marker:
 * <pre>
 * {
 *   arrow: {
 *     id: 'arrow',
 *     tagName: 'marker',
 *     refY: 5,
 *     refX: 5,
 *     markerWidth: 10,
 *     markerHeight: 10,
 *     children: [{
 *       tagName: 'path',
 *       attrs: {
 *         d: 'M 0 0 L 10 5 L 0 10 Z',
 *         strokeWidth: 0
 *       }
 *     }]
 *   }
 * }
 * </pre>
 * @type {Object}
 * @sample highcharts/annotations/custom-markers/
 *         Define a custom marker for annotations
 * @sample highcharts/css/annotations-markers/
 *         Define markers in a styled mode
 * @since 6.0.0
 * @apioption defs
 */
var defaultMarkers = {
    arrow: {
        tagName: 'marker',
        render: false,
        id: 'arrow',
        refY: 5,
        refX: 5,
        markerWidth: 10,
        markerHeight: 10,
        children: [{
            tagName: 'path',
            d: 'M 0 0 L 10 5 L 0 10 Z', // triangle (used as an arrow)
            /*= if (build.classic) { =*/
            strokeWidth: 0
            /*= } =*/
        }]
    }
};

var MarkerMixin = {
    markerSetter: function (markerType) {
        return function (value) {
            this.attr(markerType, 'url(#' + value + ')');
        };
    }
};

extend(MarkerMixin, {
    markerEndSetter: MarkerMixin.markerSetter('marker-end'),
    markerStartSetter: MarkerMixin.markerSetter('marker-start')
});

/*= if (build.classic) { =*/
// In a styled mode definition is implemented
H.SVGRenderer.prototype.definition = function (def) {
    var ren = this;

    function recurse(config, parent) {
        var ret;
        each(splat(config), function (item) {
            var node = ren.createElement(item.tagName),
                attr = {};

            // Set attributes
            objectEach(item, function (val, key) {
                if (
          key !== 'tagName' &&
          key !== 'children' &&
          key !== 'textContent'
        ) {
                    attr[key] = val;
                }
            });
            node.attr(attr);

            // Add to the tree
            node.add(parent || ren.defs);

            // Add text content
            if (item.textContent) {
                node.element.appendChild(
          doc.createTextNode(item.textContent)
        );
            }

            // Recurse
            recurse(item.children || [], node);

            ret = node;
        });

        // Return last node added (on top level it's the only one)
        return ret;
    }
    return recurse(def);
};
/*= } =*/

H.SVGRenderer.prototype.addMarker = function (id, markerOptions) {
    var options = { id: id };

    /*= if (build.classic) { =*/
    var attrs = {
        stroke: markerOptions.color || 'none',
        fill: markerOptions.color || 'rgba(0, 0, 0, 0.75)'
    };

    options.children = H.map(markerOptions.children, function (child) {
        return merge(attrs, child);
    });
    /*= } =*/

    var marker = this.definition(merge({
        markerWidth: 20,
        markerHeight: 20,
        refX: 0,
        refY: 0,
        orient: 'auto'
    }, markerOptions, options));

    marker.id = id;

    return marker;
};


/* ***************************************************************************
*
* MOCK POINT
*
**************************************************************************** */

/**
 * A mock point configuration.
 *
 * @typedef {Object} MockPointOptions
 * @property {Number} x - x value for the point in xAxis scale or pixels
 * @property {Number} y - y value for the point in yAxis scale or pixels
 * @property {String|Number} [xAxis] - xAxis index or id
 * @property {String|Number} [yAxis] - yAxis index or id
 */


/**
 * A trimmed point object which imitates {@link Highchart.Point} class.
 * It is created when there is a need of pointing to some chart's position
 * using axis values or pixel values
 *
 * @class MockPoint
 * @memberof Highcharts
 * @private
 *
 * @param {Highcharts.Chart} - the chart object
 * @param {MockPointOptions} - the options object
 */
var MockPoint = H.MockPoint = function (chart, options) {
    this.mock = true;
    this.series = {
        visible: true,
        chart: chart,
        getPlotBox: seriesPrototype.getPlotBox
    };

    // this.plotX
    // this.plotY

    /* Those might not exist if a specific axis was not found/defined */
    // this.x?
    // this.y?

    this.init(chart, options);
};

/**
 * A factory function for creating a mock point object
 *
 * @function #mockPoint
 * @memberof Highcharts
 *
 * @param {MockPointOptions} mockPointOptions
 * @return {MockPoint} a mock point
 */
var mockPoint = H.mockPoint = function (chart, mockPointOptions) {
    return new MockPoint(chart, mockPointOptions);
};

MockPoint.prototype = {
    /**
     * Initialisation of the mock point
     *
     * @function init
     * @memberof Highcharts.MockPoint#
     *
     * @param {Highcharts.Chart} chart - a chart object to which the mock point
     * is attached
     * @param {MockPointOptions} options - a config for the mock point
     */
    init: function (chart, options) {
        var xAxisId = options.xAxis,
            xAxis = defined(xAxisId) ?
                chart.xAxis[xAxisId] || chart.get(xAxisId) :
                null,

            yAxisId = options.yAxis,
            yAxis = defined(yAxisId) ?
                chart.yAxis[yAxisId] || chart.get(yAxisId) :
                null;


        if (xAxis) {
            this.x = options.x;
            this.series.xAxis = xAxis;
        } else {
            this.plotX = options.x;
        }

        if (yAxis) {
            this.y = options.y;
            this.series.yAxis = yAxis;
        } else {
            this.plotY = options.y;
        }
    },

    /**
     * Update of the point's coordinates (plotX/plotY)
     *
     * @function translate
     * @memberof Highcharts.MockPoint#
     *
     * @return {undefined}
     */
    translate: function () {
        var series = this.series,
            xAxis = series.xAxis,
            yAxis = series.yAxis;

        if (xAxis) {
            this.plotX = xAxis.toPixels(this.x, true);
        }

        if (yAxis) {
            this.plotY = yAxis.toPixels(this.y, true);
        }

        this.isInside = this.isInsidePane();
    },

    /**
     * Returns a box to which an item can be aligned to
     *
     * @function #alignToBox
     * @memberof Highcharts.MockPoint#
     *
     * @param {Boolean} [forceTranslate=false] - whether to update the point's
     * coordinates
     * @return {Array<Number>} A quadruple of numbers which denotes x, y,
     * width and height of the box
    **/
    alignToBox: function (forceTranslate) {
        if (forceTranslate) {
            this.translate();
        }

        var x = this.plotX,
            y = this.plotY,
            temp;


        if (this.series.chart.inverted) {
            temp = x;
            x = y;
            y = temp;
        }

        return [x, y, 0, 0];
    },

    /**
     * Returns a label config object -
     * the same as Highcharts.Point.prototype.getLabelConfig
     *
     * @function getLabelConfig
     * @memberof Highcharts.MockPoint#
     *
     * @return {Object} labelConfig - label config object
     * @return {Number|undefined} labelConfig.x
     *         X value translated to x axis scale
     * @return {Number|undefined} labelConfig.y
     *         Y value translated to y axis scale
     * @return {MockPoint} labelConfig.point
     *         The instance of the point
     */
    getLabelConfig: function () {
        return {
            x: this.x,
            y: this.y,
            point: this
        };
    },

    isInsidePane: function () {
        var plotX = this.plotX,
            plotY = this.plotY,
            xAxis = this.series.xAxis,
            yAxis = this.series.yAxis,
            isInside = true;

        if (xAxis) {
            isInside = defined(plotX) && plotX >= 0 && plotX <= xAxis.len;
        }

        if (yAxis) {
            isInside =
                isInside &&
                defined(plotY) &&
                plotY >= 0 && plotY <= yAxis.len;
        }

        return isInside;
    }
};


/* ***************************************************************************
*
* ANNOTATION
*
**************************************************************************** */

H.defaultOptions.annotations = [];

/**
 * An annotation class which serves as a container for items like labels or
 * shapes. Created items are positioned on the chart either by linking them to
 * existing points or created mock points
 *
 * @class Annotation
 * @memberof Highcharts
 *
 * @param {Chart} - the chart object
 * @param {AnnotationOptions} - the options object
 */
var Annotation = H.Annotation = function (chart, userOptions) {

    /**
     * The chart that the annotation belongs to.
     *
     * @name chart
     * @memberof Highcharts.Annotation#
     * @type {Chart}
     */
    this.chart = chart;

    /**
     * The array of labels which belong to the annotation.
     *
     * @name labels
     * @memberof Highcharts.Annotation#
     * @type {Array<Highcharts.SVGElement>}
     */
    this.labels = [];

    /**
     * The array of shapes which belong to the annotation.
     *
     * @name shapes
     * @memberof Highcharts.Annotation#
     * @type {Array<Highcharts.SVGElement>}
     */
    this.shapes = [];

    /**
     * The user options for the annotations.
     *
     * @name options
     * @memberof Highcharts.Annotation#
     * @type {AnnotationOptions}
     */
    this.userOptions = userOptions;

    /**
     * The options for the annotations. It contains user defined options
     * merged with the default options.
     *
     * @name options
     * @memberof Highcharts.Annotation#
     * @type {AnnotationOptions}
     */
    this.options = merge(this.defaultOptions, userOptions);

    /**
     * The callback that reports to the overlapping-labels module which
     * labels it should account for.
     *
     * @name labelCollector
     * @memberof Highcharts.Annotation#
     * @type {Function}
     * @private
     */

    /**
     * The group element of the annotation.
     *
     * @name group
     * @memberof Highcharts.Annotation#
     * @type {Highcharts.SVGElement}
     * @private
     */

    /**
     * The group element of the annotation's shapes.
     *
     * @name shapesGroup
     * @memberof Highcharts.Annotation#
     * @type {Highcharts.SVGElement}
     * @private
     */

    /**
     * The group element of the annotation's labels.
     *
     * @name labelsGroup
     * @memberof Highcharts.Annotation#
     * @type {Highcharts.SVGElement}
     * @private
     */

    this.init(chart, userOptions);
};

Annotation.prototype = /** @lends Highcharts.Annotation# */ {
    /**
     * Shapes which do not have background - the object is used for proper
     * setting of the contrast color
     *
     * @type {Array<String>}
     * @private
     */
    shapesWithoutBackground: ['connector'],

    /**
     * A map object which allows to map options attributes to element
     * attributes.
     *
     * @type {Object}
     * @private
     */
    attrsMap: {
        /*= if (build.classic) { =*/
        backgroundColor: 'fill',
        borderColor: 'stroke',
        borderWidth: 'stroke-width',
        dashStyle: 'dashstyle',
        strokeWidth: 'stroke-width',
        stroke: 'stroke',
        fill: 'fill',

        /*= } =*/
        zIndex: 'zIndex',
        width: 'width',
        height: 'height',
        borderRadius: 'r',
        r: 'r',
        padding: 'padding'
    },

    /**
     * Options for configuring annotations, for example labels, arrows or
     * shapes. Annotations can be tied to points, axis coordinates or chart
     * pixel coordinates.
     *
     * @private
     * @type {Array<Object>}
     * @sample highcharts/annotations/basic/
     *         Basic annotations
     * @sample highcharts/demo/annotations/
     *         Advanced annotations
     * @sample highcharts/css/annotations
     *         Styled mode
     * @sample {highstock} stock/annotations/fibonacci-retracements
     *         Custom annotation, Fibonacci retracement
     * @since 6.0.0
     * @optionparent annotations
     */
    defaultOptions: {

        /**
         * Whether the annotation is visible.
         *
         * @sample highcharts/annotations/visible/
         *         Set annotation visibility
         */
        visible: true,

        /**
         * Options for annotation's labels. Each label inherits options
         * from the labelOptions object. An option from the labelOptions can be
         * overwritten by config for a specific label.
         */
        labelOptions: {

            /**
             * The alignment of the annotation's label. If right,
             * the right side of the label should be touching the point.
             *
             * @validvalue ["left", "center", "right"]
             * @sample highcharts/annotations/label-position/
             *         Set labels position
             */
            align: 'center',

            /**
             * Whether to allow the annotation's labels to overlap.
             * To make the labels less sensitive for overlapping,
             * the can be set to 0.
             *
             * @sample highcharts/annotations/tooltip-like/
             *         Hide overlapping labels
             */
            allowOverlap: false,

            /**
             * The background color or gradient for the annotation's label.
             *
             * @type {Color}
             * @sample highcharts/annotations/label-presentation/
             *         Set labels graphic options
             */
            backgroundColor: 'rgba(0, 0, 0, 0.75)',

            /**
             * The border color for the annotation's label.
             *
             * @type {Color}
             * @sample highcharts/annotations/label-presentation/
             *         Set labels graphic options
             */
            borderColor: 'black',

            /**
             * The border radius in pixels for the annotaiton's label.
             *
             * @sample highcharts/annotations/label-presentation/
             *         Set labels graphic options
             */
            borderRadius: 3,

            /**
             * The border width in pixels for the annotation's label
             *
             * @sample highcharts/annotations/label-presentation/
             *         Set labels graphic options
             */
            borderWidth: 1,

            /**
             * A class name for styling by CSS.
             *
             * @sample highcharts/css/annotations
             *         Styled mode annotations
             * @since 6.0.5
             */
            className: '',

            /**
             * Whether to hide the annotation's label that is outside the plot
             * area.
             *
             * @sample highcharts/annotations/label-crop-overflow/
             *         Crop or justify labels
             */
            crop: false,

            /**
             * The label's pixel distance from the point.
             *
             * @type {Number}
             * @sample highcharts/annotations/label-position/
             *         Set labels position
             * @default undefined
             * @apioption annotations.labelOptions.distance
             */

            /**
             * A [format](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting) string for the data label.
             *
             * @type {String}
             * @see    [plotOptions.series.dataLabels.format](
             *         plotOptions.series.dataLabels.format.html)
             * @sample highcharts/annotations/label-text/
             *         Set labels text
             * @default undefined
             * @apioption annotations.labelOptions.format
             */

            /**
             * Alias for the format option.
             *
             * @type {String}
             * @see [format](annotations.labelOptions.format.html)
             * @sample highcharts/annotations/label-text/
             *         Set labels text
             * @default undefined
             * @apioption annotations.labelOptions.text
             */

            /**
             * Callback JavaScript function to format the annotation's label.
             * Note that if a `format` or `text` are defined, the format or text
             * take precedence and the formatter is ignored. `This` refers to a
             * point object.
             *
             * @type {Function}
             * @sample highcharts/annotations/label-text/
             *         Set labels text
             * @default function () {
             *     return defined(this.y) ? this.y : 'Annotation label';
             * }
             */
            formatter: function () {
                return defined(this.y) ? this.y : 'Annotation label';
            },

            /**
             * How to handle the annotation's label that flow outside the plot
             * area. The justify option aligns the label inside the plot area.
             *
             * @validvalue ["allow", "justify"]
             * @sample highcharts/annotations/label-crop-overflow/
             *         Crop or justify labels
             **/
            overflow: 'justify',

            /**
             * When either the borderWidth or the backgroundColor is set,
             * this    is the padding within the box.
             *
             * @sample highcharts/annotations/label-presentation/
             *         Set labels graphic options
             */
            padding: 5,

            /**
             * The shadow of the box. The shadow can be an object configuration
             * containing `color`, `offsetX`, `offsetY`, `opacity` and `width`.
             *
             * @type {Boolean|Object}
             * @sample highcharts/annotations/label-presentation/
             *         Set labels graphic options
             */
            shadow: false,

            /**
             * The name of a symbol to use for the border around the label.
             * Symbols are predefined functions on the Renderer object.
             *
             * @type {String}
             * @sample highcharts/annotations/shapes/
             *         Available shapes for labels
             */
            shape: 'callout',

            /**
             * Styles for the annotation's label.
             *
             * @type {CSSObject}
             * @sample highcharts/annotations/label-presentation/
             *         Set labels graphic options
             * @see    [plotOptions.series.dataLabels.style](
             *         plotOptions.series.dataLabels.style.html)
             */
            style: {
                fontSize: '11px',
                fontWeight: 'normal',
                color: 'contrast'
            },

            /**
             * Whether to [use HTML](https://www.highcharts.com/docs/chart-concepts/labels-and-string-formatting#html)
             * to render the annotation's label.
              *
              * @type {Boolean}
               * @default false
             */
            useHTML: false,

            /**
             * The vertical alignment of the annotation's label.
             *
             * @type {String}
             * @validvalue ["top", "middle", "bottom"]
             * @sample highcharts/annotations/label-position/
             *         Set labels position
             */
            verticalAlign: 'bottom',

            /**
             * The x position offset of the label relative to the point.
             * Note that if a `distance` is defined, the distance takes
             * precedence over `x` and `y` options.
             *
             * @sample highcharts/annotations/label-position/
             *         Set labels position
             */
            x: 0,

            /**
             * The y position offset of the label relative to the point.
             * Note that if a `distance` is defined, the distance takes
             * precedence over `x` and `y` options.
             *
             * @sample highcharts/annotations/label-position/
             *         Set labels position
             */
            y: -16
        },

        /**
         * An array of labels for the annotation. For options that apply to
         * multiple labels, they can be added to the
         * [labelOptions](annotations.labelOptions.html).
         *
         * @type {Array<Object>}
         * @extends annotations.labelOptions
         * @apioption annotations.labels
         */

        /**
         * This option defines the point to which the label will be connected.
         * It can be either the point which exists in the series - it is
         * referenced by the point's id - or a new point with defined x, y
         * properies and optionally axes.
         *
         * @type {String|Object}
         * @sample highcharts/annotations/mock-point/
         *         Attach annotation to a mock point
         * @apioption annotations.labels.point
         */

        /**
         * The x position of the point. Units can be either in axis
         * or chart pixel coordinates.
         *
         * @type {Number}
         * @apioption annotations.labels.point.x
         */

        /**
         * The y position of the point. Units can be either in axis
         * or chart pixel coordinates.
         *
         * @type {Number}
         * @apioption annotations.labels.point.y
         */

        /**
         * This number defines which xAxis the point is connected to. It refers
         * to either the axis id or the index of the axis in the xAxis array.
         * If the option is not configured or the axis is not found the point's
         * x coordinate refers to the chart pixels.
         *
         * @type {Number|String}
         * @apioption annotations.labels.point.xAxis
         */

        /**
         * This number defines which yAxis the point is connected to. It refers
         * to either the axis id or the index of the axis in the yAxis array.
         * If the option is not configured or the axis is not found the point's
         * y coordinate refers to the chart pixels.
         *
         * @type {Number|String}
         * @apioption annotations.labels.point.yAxis
         */



        /**
         * An array of shapes for the annotation. For options that apply to
         * multiple shapes, then can be added to the
         * [shapeOptions](annotations.shapeOptions.html).
         *
         * @type {Array<Object>}
         * @extends annotations.shapeOptions
         * @apioption annotations.shapes
         */

        /**
         * This option defines the point to which the shape will be connected.
         * It can be either the point which exists in the series - it is
         * referenced by the point's id - or a new point with defined x, y
         * properties and optionally axes.
         *
         * @type {String|Object}
         * @extends annotations.labels.point
         * @apioption annotations.shapes.point
         */

        /**
         * An array of points for the shape. This option is available for shapes
         * which can use multiple points such as path. A point can be either
         * a point object or a point's id.
         *
         * @type {Array}
         * @see [annotations.shapes.point](annotations.shapes.point.html)
         * @apioption annotations.shapes.points
         */

        /**
         * Id of the marker which will be drawn at the final vertex of the path.
         * Custom markers can be defined in defs property.
         *
         * @type {String}
         * @see [defs.markers](defs.markers.html)
         * @sample highcharts/annotations/custom-markers/
         *         Define a custom marker for annotations
         * @apioption annotations.shapes.markerEnd
         */

        /**
         * Id of the marker which will be drawn at the first vertex of the path.
         * Custom markers can be defined in defs property.
         *
         * @type {String}
         * @see [defs.markers](defs.markers.html)
         * @sample {highcharts} highcharts/annotations/custom-markers/
         *         Define a custom marker for annotations
          * @apioption annotations.shapes.markerStart
         */


        /**
         * Options for annotation's shapes. Each shape inherits options
         * from the shapeOptions object. An option from the shapeOptions can be
         * overwritten by config for a specific shape.
         *
         * @type {Object}
         */
        shapeOptions: {

            /**
             * The width of the shape.
             *
             * @type {Number}
             * @sample highcharts/annotations/shape/
             *         Basic shape annotation
             * @apioption annotations.shapeOptions.width
             **/

            /**
             * The height of the shape.
             *
             * @type {Number}
             * @sample highcharts/annotations/shape/
             *         Basic shape annotation
             * @apioption annotations.shapeOptions.height
             */

            /**
             * The color of the shape's stroke.
             *
             * @type {Color}
             * @sample highcharts/annotations/shape/
             *         Basic shape annotation
             */
            stroke: 'rgba(0, 0, 0, 0.75)',

            /**
             * The pixel stroke width of the shape.
             *
             * @sample highcharts/annotations/shape/
             *         Basic shape annotation
             */
            strokeWidth: 1,

            /**
             * The color of the shape's fill.
             *
             * @type {Color}
             * @sample highcharts/annotations/shape/
             *         Basic shape annotation
             */
            fill: 'rgba(0, 0, 0, 0.75)',

            /**
             * The type of the shape, e.g. circle or rectangle.
             *
             * @type {String}
             * @sample highcharts/annotations/shape/
             *         Basic shape annotation
             * @default 'rect'
             * @apioption annotations.shapeOptions.type
             */

            /**
             * The radius of the shape.
             *
             * @sample highcharts/annotations/shape/
             *         Basic shape annotation
             */
            r: 0
        },

        /**
         * The Z index of the annotation.
         *
         * @type {Number}
         * @default 6
         */
        zIndex: 6
    },

    /**
     * Initialize the annotation.
     *
     * @param {Chart} - the chart
     * @param {AnnotationOptions} - the user options for the annotation
     */
    init: function () {
        var anno = this;
        each(this.options.labels || [], this.initLabel, this);
        each(this.options.shapes || [], this.initShape, this);

        this.labelCollector = function () {
            return grep(anno.labels, function (label) {
                return !label.options.allowOverlap;
            });
        };

        this.chart.labelCollectors.push(this.labelCollector);
    },

    /**
     * Main method for drawing an annotation.
    **/
    redraw: function () {
        if (!this.group) {
            this.render();
        }

        this.redrawItems(this.shapes);
        this.redrawItems(this.labels);
    },

    /**
     * @private
     * @param {Array<Object>} items
    **/
    redrawItems: function (items) {
        var i = items.length;

        // needs a backward loop
        // labels/shapes array might be modified due to destruction of the item
        while (i--) {
            this.redrawItem(items[i]);
        }
    },

    /**
     * Render the annotation.
    **/
    render: function () {
        var renderer = this.chart.renderer;

        var group = this.group = renderer.g('annotation')
            .attr({
                zIndex: this.options.zIndex,
                visibility: this.options.visible ? 'visible' : 'hidden'
            })
            .add();

        this.shapesGroup = renderer.g('annotation-shapes').add(group);

        this.labelsGroup = renderer.g('annotation-labels').attr({
      // hideOverlappingLabels requires translation
            translateX: 0,
            translateY: 0
        }).add(group);

        this.shapesGroup.clip(this.chart.plotBoxClip);
    },

    /**
     * Set the annotation's visibility.
     *
     * @param {Boolean} [visibility] - Whether to show or hide an annotation.
     * If the param is omitted, the annotation's visibility is toggled.
     **/
    setVisible: function (visibility) {
        var options = this.options,
            visible = pick(visibility, !options.visible);

        this.group.attr({
            visibility: visible ? 'visible' : 'hidden'
        });

        options.visible = visible;
    },


    /**
     * Destroy the annotation. This function does not touch the chart
     * that the annotation belongs to (all annotations are kept in
     * the chart.annotations array) - it is recommended to use
     * {@link Highcharts.Chart#removeAnnotation} instead.
    **/
    destroy: function () {
        var chart = this.chart,
            destroyItem = function (item) {
                item.destroy();
            };

        erase(this.chart.labelCollectors, this.labelCollector);

        each(this.labels, destroyItem);
        each(this.shapes, destroyItem);

        destroyObjectProperties(this, chart);
    },


    /* ***********************************************************************
     * ITEM SECTION
     * Contains methods for handling a single item in an annotation
     *********************************************************************** */

    /**
     * Initialisation of a single shape
     *
     * @private
     * @param {Object} shapeOptions - a confg object for a single shape
    **/
    initShape: function (shapeOptions) {
        var renderer = this.chart.renderer,
            options = merge(this.options.shapeOptions, shapeOptions),
            attr = this.attrsFromOptions(options),

            type = renderer[options.type] ? options.type : 'rect',
            shape = renderer[type](0, -9e9, 0, 0);

        shape.points = [];
        shape.type = type;
        shape.options = options;
        shape.itemType = 'shape';

        if (type === 'path') {
            extend(shape, {
                markerStartSetter: MarkerMixin.markerStartSetter,
                markerEndSetter: MarkerMixin.markerEndSetter,
                markerStart: MarkerMixin.markerStart,
                markerEnd: MarkerMixin.markerEnd
            });
        }

        shape.attr(attr);


        if (options.className) {
            shape.addClass(options.className);
        }

        this.shapes.push(shape);
    },

    /**
     * Initialisation of a single label
     *
     * @private
     * @param {Object} labelOptions
    **/
    initLabel: function (labelOptions) {
        var options = merge(this.options.labelOptions, labelOptions),
            attr = this.attrsFromOptions(options),

            label = this.chart.renderer.label(
                '',
                0, -9e9,
                options.shape,
                null,
                null,
                options.useHTML,
                null,
                'annotation-label'
            );

        label.points = [];
        label.options = options;
        label.itemType = 'label';

        // Labelrank required for hideOverlappingLabels()
        label.labelrank = options.labelrank;
        label.annotation = this;

        label.attr(attr);

        /*= if (build.classic) { =*/
        var style = options.style;
        if (style.color === 'contrast') {
            style.color = this.chart.renderer.getContrast(
                inArray(options.shape, this.shapesWithoutBackground) > -1 ?
                '#FFFFFF' :
                options.backgroundColor
            );
        }
        label.css(style).shadow(options.shadow);
        /*= } =*/

        if (options.className) {
            label.addClass(options.className);
        }


        this.labels.push(label);
    },

    /**
     * Redrawing a single item
     *
     * @private
     * @param {SVGElement} item
     */
    redrawItem: function (item) {
        var points = this.linkPoints(item),
            itemOptions = item.options,
            text,
            time = this.chart.time;

        if (!points.length) {
            this.destroyItem(item);

        } else {
            if (!item.parentGroup) {
                this.renderItem(item);
            }

            if (item.itemType === 'label') {
                text = itemOptions.format || itemOptions.text;
                item.attr({
                    text: text ?
                        format(text, points[0].getLabelConfig(), time) :
                        itemOptions.formatter.call(points[0])
                });
            }


            if (item.type === 'path') {
                this.redrawPath(item);

            } else {
                this.alignItem(item, !item.placed);
            }
        }
    },

    /**
     * Destroing a single item
     *
     * @private
     * @param {SVGElement} item
     */
    destroyItem: function (item) {
        // erase from shapes or labels array
        erase(this[item.itemType + 's'], item);
        item.destroy();
    },

    /**
     * Returns a point object
     *
     * @private
     * @param {Object} pointOptions
     * @param {Highcharts.MockPoint|Highcharts.Point} point
     * @return {Highcharts.MockPoint|Highcharts.Point|null} if the point is
     * found/exists returns this point, otherwise null
     */
    pointItem: function (pointOptions, point) {
        if (!point || point.series === null) {
            if (isObject(pointOptions)) {
                point = mockPoint(this.chart, pointOptions);

            } else if (isString(pointOptions)) {
                point = this.chart.get(pointOptions) || null;
            }
        }

        return point;
    },

    /**
     * Linking item with the point or points and returning an array of linked
     * points.
     *
     * @private
     * @param {SVGElement} item
     * @return {
     *     Highcharts.Point|
     *     Highcharts.MockPoint|
     *     Array<Highcharts.Point|Highcharts.MockPoint>
     *    }
     */
    linkPoints: function (item) {
        var pointsOptions = (
                item.options.points ||
                (item.options.point && H.splat(item.options.point))
            ),
            points = item.points,
            len = pointsOptions && pointsOptions.length,
            i,
            point;

        for (i = 0; i < len; i++) {
            point = this.pointItem(pointsOptions[i], points[i]);

            if (!point) {
                return (item.points = []);
            }

            points[i] = point;
        }

        return points;
    },

    /**
     * Aligning the item and setting its anchor
     *
     * @private
     * @param {SVGElement} item
     * @param {Boolean} isNew
     *        If the label is re-positioned (is not new) it is animated
     * @return {undefined}
     */
    alignItem: function (item, isNew) {
        var anchor = this.itemAnchor(item, item.points[0]),
            attrs = this.itemPosition(item, anchor);

        if (attrs) {
            item.alignAttr = attrs;
            item.placed = true;

            attrs.anchorX = anchor.absolutePosition.x;
            attrs.anchorY = anchor.absolutePosition.y;

            item[isNew ? 'attr' : 'animate'](attrs);

        } else {
            item.placed = false;

            item.attr({
                x: 0,
                y: -9e9
            });
        }
    },

    /**
     * @private
     */
    redrawPath: function (pathItem, isNew) {
        var points = pathItem.points,
            strokeWidth = pathItem['stroke-width'] || 1,
            d = ['M'],
            pointIndex = 0,
            dIndex = 0,
            len = points && points.length,
            crispSegmentIndex,
            anchor,
            point,
            showPath;

        if (len) {
            do {
                point = points[pointIndex];

                anchor = this.itemAnchor(pathItem, point).absolutePosition;
                d[++dIndex] = anchor.x;
                d[++dIndex] = anchor.y;

                // Crisping line, it might be replaced with
                // Renderer.prototype.crispLine but it requires creating many
                // temporary arrays
                crispSegmentIndex = dIndex % 5;
                if (crispSegmentIndex === 0) {
                    if (d[crispSegmentIndex + 1] === d[crispSegmentIndex + 4]) {
                        d[crispSegmentIndex + 1] = d[crispSegmentIndex + 4] =
                            Math.round(d[crispSegmentIndex + 1]) -
                            (strokeWidth % 2 / 2);
                    }

                    if (d[crispSegmentIndex + 2] === d[crispSegmentIndex + 5]) {
                        d[crispSegmentIndex + 2] = d[crispSegmentIndex + 5] =
                            Math.round(d[crispSegmentIndex + 2]) +
                            (strokeWidth % 2 / 2);
                    }
                }

                if (pointIndex < len - 1) {
                    d[++dIndex] = 'L';
                }

                showPath = point.series.visible;

            } while (++pointIndex < len && showPath);
        }


        if (showPath) {
            pathItem[isNew ? 'attr' : 'animate']({
                d: d
            });

        } else {
            pathItem.attr({
                d: 'M 0 ' + -9e9
            });
        }

        pathItem.placed = showPath;
    },

    /*
     * @private
     */
    renderItem: function (item) {
        item.add(
            item.itemType === 'label' ?
                this.labelsGroup :
                this.shapesGroup
        );

        this.setItemMarkers(item);
    },

    /*
     * @private
     */
    setItemMarkers: function (item) {
        var itemOptions = item.options,
            chart = this.chart,
            defs = chart.options.defs,
            fill = itemOptions.fill,
            color = defined(fill) && fill !== 'none' ?
                fill :
                itemOptions.stroke,


            setMarker = function (markerType) {
                var markerId = itemOptions[markerType],
                    def,
                    predefinedMarker,
                    key,
                    marker;

                if (markerId) {
                    for (key in defs) {
                        def = defs[key];
                        if (markerId === def.id && def.tagName === 'marker') {
                            predefinedMarker = def;
                            break;
                        }
                    }

                    if (predefinedMarker) {
                        marker = item[markerType] = chart.renderer.addMarker(
                            (itemOptions.id || uniqueKey()) + '-' +
                                predefinedMarker.id,
                            merge(predefinedMarker, { color: color })
                        );

                        item.attr(markerType, marker.attr('id'));
                    }
                }
            };

        each(['markerStart', 'markerEnd'], setMarker);
    },

    /**
     * An object which denotes an anchor position
     *
     * @typedef {Object} AnchorPosition
     * @property {Number} AnchorPosition.x
     * @property {Number} AnchorPosition.y
     * @property {Number} AnchorPosition.height
     * @property {Number} AnchorPosition.width
     */

    /**
     * Returns object which denotes anchor position - relative and absolute
     *
     * @private
     * @param {SVGElement} item
     * @param {Highcharts.Point|Highcharts.MockPoint} point
     * @return {Object} anchor
     * @return {AnchorPosition} anchor.relativePosition
     *         Relative to the plot area position
     * @return {AnchorPosition} anchor.absolutePosition
     *         Absolute position
     */
    itemAnchor: function (item, point) {
        var plotBox = point.series.getPlotBox(),

            box = point.mock ?
                point.alignToBox(true) :
                tooltipPrototype.getAnchor.call({
                    chart: this.chart
                }, point),

            anchor = {
                x: box[0],
                y: box[1],
                height: box[2] || 0,
                width: box[3] || 0
            };

        return {
            relativePosition: anchor,
            absolutePosition: merge(anchor, {
                x: anchor.x + plotBox.translateX,
                y: anchor.y + plotBox.translateY
            })
        };
    },

    /**
     * Returns the item position
     *
     * @private
     * @param {SVGElement} item
     * @param {AnchorPosition} anchor
     * @return {Object|null} position
     * @return {Number} position.x
     * @return {Number} position.y
     */
    itemPosition: function (item, anchor) {
        var chart = this.chart,
            point = item.points[0],
            itemOptions = item.options,
            anchorAbsolutePosition = anchor.absolutePosition,
            anchorRelativePosition = anchor.relativePosition,
            itemPosition,
            alignTo,
            itemPosRelativeX,
            itemPosRelativeY,

            showItem =
                point.series.visible &&
                MockPoint.prototype.isInsidePane.call(point);

        if (showItem) {

            if (defined(itemOptions.distance) || itemOptions.positioner) {
                itemPosition = (
                    itemOptions.positioner ||
                    tooltipPrototype.getPosition
                ).call(
                    {
                        chart: chart,
                        distance: pick(itemOptions.distance, 16)
                    },
                    item.width,
                    item.height,
                    {
                        plotX: anchorRelativePosition.x,
                        plotY: anchorRelativePosition.y,
                        negative: point.negative,
                        ttBelow: point.ttBelow,
                        h: anchorRelativePosition.height ||
                            anchorRelativePosition.width
                    }
                );

            } else {
                alignTo = {
                    x: anchorAbsolutePosition.x,
                    y: anchorAbsolutePosition.y,
                    width: 0,
                    height: 0
                };

                itemPosition = this.alignedPosition(
                    extend(itemOptions, {
                        width: item.width,
                        height: item.height
                    }),
                    alignTo
                );

                if (item.options.overflow === 'justify') {
                    itemPosition = this.alignedPosition(
                        this.justifiedOptions(item, itemOptions, itemPosition),
                        alignTo
                    );
                }
            }


            if (itemOptions.crop) {
                itemPosRelativeX = itemPosition.x - chart.plotLeft;
                itemPosRelativeY = itemPosition.y - chart.plotTop;

                showItem =
                    chart.isInsidePlot(itemPosRelativeX, itemPosRelativeY) &&
                    chart.isInsidePlot(
                        itemPosRelativeX + item.width,
                        itemPosRelativeY + item.height
                    );
            }
        }

        return showItem ? itemPosition : null;
    },

    /**
     * Returns new aligned position based alignment options and box to align to.
     * It is almost a one-to-one copy from SVGElement.prototype.align
     * except it does not use and mutate an element
     *
     * @private
     * @param {Object} alignOptions
     * @param {Object} box
     * @return {Object} aligned position
    **/
    alignedPosition: function (alignOptions, box) {
        var align = alignOptions.align,
            vAlign = alignOptions.verticalAlign,
            x = (box.x || 0) + (alignOptions.x || 0),
            y = (box.y || 0) + (alignOptions.y || 0),

            alignFactor,
            vAlignFactor;

        if (align === 'right') {
            alignFactor = 1;
        } else if (align === 'center') {
            alignFactor = 2;
        }
        if (alignFactor) {
            x += (box.width - (alignOptions.width || 0)) / alignFactor;
        }

        if (vAlign === 'bottom') {
            vAlignFactor = 1;
        } else if (vAlign === 'middle') {
            vAlignFactor = 2;
        }
        if (vAlignFactor) {
            y += (box.height - (alignOptions.height || 0)) / vAlignFactor;
        }

        return {
            x: Math.round(x),
            y: Math.round(y)
        };
    },

    /**
     * Returns new alignment options for a label if the label is outside the
     * plot area. It is almost a one-to-one copy from
     * Series.prototype.justifyDataLabel except it does not mutate the label and
     * it works with absolute instead of relative position.
     *
     * @private
     * @param {Object} label
     * @param {Object} alignOptions
     * @param {Object} alignAttr
     * @return {Object} justified options
    **/
    justifiedOptions: function (label, alignOptions, alignAttr) {
        var chart = this.chart,
            align = alignOptions.align,
            verticalAlign = alignOptions.verticalAlign,
            padding = label.box ? 0 : (label.padding || 0),
            bBox = label.getBBox(),
            off,

            options = {
                align: align,
                verticalAlign: verticalAlign,
                x: alignOptions.x,
                y: alignOptions.y,
                width: label.width,
                height: label.height
            },

            x = alignAttr.x - chart.plotLeft,
            y = alignAttr.y - chart.plotTop;

        // Off left
        off = x + padding;
        if (off < 0) {
            if (align === 'right') {
                options.align = 'left';
            } else {
                options.x = -off;
            }
        }

        // Off right
        off = x + bBox.width - padding;
        if (off > chart.plotWidth) {
            if (align === 'left') {
                options.align = 'right';
            } else {
                options.x = chart.plotWidth - off;
            }
        }

        // Off top
        off = y + padding;
        if (off < 0) {
            if (verticalAlign === 'bottom') {
                options.verticalAlign = 'top';
            } else {
                options.y = -off;
            }
        }

        // Off bottom
        off = y + bBox.height - padding;
        if (off > chart.plotHeight) {
            if (verticalAlign === 'top') {
                options.verticalAlign = 'bottom';
            } else {
                options.y = chart.plotHeight - off;
            }
        }

        return options;
    },


    /**
     * Utility function for mapping item's options to element's attribute
     *
     * @private
     * @param {Object} options
     * @return {Object} mapped options
    **/
    attrsFromOptions: function (options) {
        var map = this.attrsMap,
            attrs = {},
            key,
            mappedKey;

        for (key in options) {
            mappedKey = map[key];
            if (mappedKey) {
                attrs[mappedKey] = options[key];
            }
        }

        return attrs;
    }
};

/* ***************************************************************************
*
* EXTENDING CHART PROTOTYPE
*
**************************************************************************** */

H.extend(chartPrototype, /** @lends Chart# */ {
    /**
     * Add an annotation to the chart after render time.
     *
     * @param  {AnnotationOptions} options
     *         The series options for the new, detailed series.
     *
     * @return {Highcharts.Annotation} - The newly generated annotation.
     */
    addAnnotation: function (userOptions, redraw) {
        var annotation = new Annotation(this, userOptions);

        this.annotations.push(annotation);
        this.options.annotations.push(userOptions);

        if (pick(redraw, true)) {
            annotation.redraw();
        }

        return annotation;
    },

    /**
     * Remove an annotation from the chart.
     *
     * @param {String} id - The annotation's id.
     */
    removeAnnotation: function (id) {
        var annotations = this.annotations,
            annotation = find(annotations, function (annotation) {
                return annotation.options.id === id;
            });

        if (annotation) {
            erase(this.options.annotations, annotation.userOptions);
            erase(annotations, annotation);
            annotation.destroy();
        }
    },

    /**
     * @private
     * @memberof Highcharts.Chart#
     * @function drawAnnotations
     */
    drawAnnotations: function () {
        var clip = this.plotBoxClip,
            plotBox = this.plotBox;

        if (clip) {
            clip.attr(plotBox);
        } else {
            this.plotBoxClip = this.renderer.clipRect(plotBox);
        }

        each(this.annotations, function (annotation) {
            annotation.redraw();
        });
    }
});


chartPrototype.callbacks.push(function (chart) {
    chart.annotations = [];

    each(chart.options.annotations, function (annotationOptions) {
        chart.annotations.push(
            new Annotation(chart, annotationOptions)
        );
    });

    chart.drawAnnotations();
    addEvent(chart, 'redraw', chart.drawAnnotations);
    addEvent(chart, 'destroy', function () {
        var plotBoxClip = chart.plotBoxClip;

        if (plotBoxClip && plotBoxClip.destroy) {
            plotBoxClip.destroy();
        }
    });
});



addEvent(H.Chart, 'afterGetContainer', function () {
    this.options.defs = merge(defaultMarkers, this.options.defs || {});

    /*= if (build.classic) { =*/
    objectEach(this.options.defs, function (def) {
        if (def.tagName === 'marker' && def.render !== false) {
            this.renderer.addMarker(def.id, def);
        }
    }, this);
    /*= } =*/
});


/* ************************************************************************* */

/**
 * General symbol definition for labels with connector
 */
H.SVGRenderer.prototype.symbols.connector = function (x, y, w, h, options) {
    var anchorX = options && options.anchorX,
        anchorY = options && options.anchorY,
        path,
        yOffset,
        lateral = w / 2;

    if (isNumber(anchorX) && isNumber(anchorY)) {

        path = ['M', anchorX, anchorY];

        // Prefer 45 deg connectors
        yOffset = y - anchorY;
        if (yOffset < 0) {
            yOffset = -h - yOffset;
        }
        if (yOffset < w) {
            lateral = anchorX < x + (w / 2) ? yOffset : w - yOffset;
        }

        // Anchor below label
        if (anchorY > y + h) {
            path.push('L', x + lateral, y + h);

        // Anchor above label
        } else if (anchorY < y) {
            path.push('L', x + lateral, y);

        // Anchor left of label
        } else if (anchorX < x) {
            path.push('L', x, y + h / 2);

        // Anchor right of label
        } else if (anchorX > x + w) {
            path.push('L', x + w, y + h / 2);
        }
    }
    return path || [];
};
