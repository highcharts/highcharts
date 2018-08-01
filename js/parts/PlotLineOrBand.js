/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from './Globals.js';
import Axis from './Axis.js';
import './Utilities.js';
var arrayMax = H.arrayMax,
    arrayMin = H.arrayMin,
    defined = H.defined,
    destroyObjectProperties = H.destroyObjectProperties,
    each = H.each,
    erase = H.erase,
    merge = H.merge,
    pick = H.pick;
/*
 * The object wrapper for plot lines and plot bands
 * @param {Object} options
 */
H.PlotLineOrBand = function (axis, options) {
    this.axis = axis;

    if (options) {
        this.options = options;
        this.id = options.id;
    }
};

H.PlotLineOrBand.prototype = {

    /**
     * Render the plot line or plot band. If it is already existing,
     * move it.
     */
    render: function () {
        var plotLine = this,
            axis = plotLine.axis,
            horiz = axis.horiz,
            options = plotLine.options,
            optionsLabel = options.label,
            label = plotLine.label,
            to = options.to,
            from = options.from,
            value = options.value,
            isBand = defined(from) && defined(to),
            isLine = defined(value),
            svgElem = plotLine.svgElem,
            isNew = !svgElem,
            path = [],
            color = options.color,
            zIndex = pick(options.zIndex, 0),
            events = options.events,
            attribs = {
                'class': 'highcharts-plot-' + (isBand ? 'band ' : 'line ') +
                    (options.className || '')
            },
            groupAttribs = {},
            renderer = axis.chart.renderer,
            groupName = isBand ? 'bands' : 'lines',
            group;

        // logarithmic conversion
        if (axis.isLog) {
            from = axis.log2lin(from);
            to = axis.log2lin(to);
            value = axis.log2lin(value);
        }

        /*= if (build.classic) { =*/
        // Set the presentational attributes
        if (isLine) {
            attribs.stroke = color;
            attribs['stroke-width'] = options.width;
            if (options.dashStyle) {
                attribs.dashstyle = options.dashStyle;
            }

        } else if (isBand) { // plot band
            if (color) {
                attribs.fill = color;
            }
            if (options.borderWidth) {
                attribs.stroke = options.borderColor;
                attribs['stroke-width'] = options.borderWidth;
            }
        }
        /*= } =*/

        // Grouping and zIndex
        groupAttribs.zIndex = zIndex;
        groupName += '-' + zIndex;

        group = axis.plotLinesAndBandsGroups[groupName];
        if (!group) {
            axis.plotLinesAndBandsGroups[groupName] = group =
                renderer.g('plot-' + groupName)
                    .attr(groupAttribs).add();
        }

        // Create the path
        if (isNew) {
            plotLine.svgElem = svgElem =
                renderer
                    .path()
                    .attr(attribs).add(group);
        }


        // Set the path or return
        if (isLine) {
            path = axis.getPlotLinePath(value, svgElem.strokeWidth());
        } else if (isBand) { // plot band
            path = axis.getPlotBandPath(from, to, options);
        } else {
            return;
        }


        // common for lines and bands
        if (isNew && path && path.length) {
            svgElem.attr({ d: path });

            // events
            if (events) {
                H.objectEach(events, function (event, eventType) {
                    svgElem.on(eventType, function (e) {
                        events[eventType].apply(plotLine, [e]);
                    });
                });
            }
        } else if (svgElem) {
            if (path) {
                svgElem.show();
                svgElem.animate({ d: path });
            } else {
                svgElem.hide();
                if (label) {
                    plotLine.label = label = label.destroy();
                }
            }
        }

        // the plot band/line label
        if (
            optionsLabel &&
            defined(optionsLabel.text) &&
            path &&
            path.length &&
            axis.width > 0 &&
            axis.height > 0 &&
            !path.isFlat
        ) {
            // apply defaults
            optionsLabel = merge({
                align: horiz && isBand && 'center',
                x: horiz ? !isBand && 4 : 10,
                verticalAlign: !horiz && isBand && 'middle',
                y: horiz ? isBand ? 16 : 10 : isBand ? 6 : -4,
                rotation: horiz && !isBand && 90
            }, optionsLabel);

            this.renderLabel(optionsLabel, path, isBand, zIndex);

        } else if (label) { // move out of sight
            label.hide();
        }

        // chainable
        return plotLine;
    },

    /**
     * Render and align label for plot line or band.
     */
    renderLabel: function (optionsLabel, path, isBand, zIndex) {
        var plotLine = this,
            label = plotLine.label,
            renderer = plotLine.axis.chart.renderer,
            attribs,
            xBounds,
            yBounds,
            x,
            y;

        // add the SVG element
        if (!label) {
            attribs = {
                align: optionsLabel.textAlign || optionsLabel.align,
                rotation: optionsLabel.rotation,
                'class': 'highcharts-plot-' + (isBand ? 'band' : 'line') +
                    '-label ' + (optionsLabel.className || '')
            };

            attribs.zIndex = zIndex;

            plotLine.label = label = renderer.text(
                    optionsLabel.text,
                    0,
                    0,
                    optionsLabel.useHTML
                )
                .attr(attribs)
                .add();

            /*= if (build.classic) { =*/
            label.css(optionsLabel.style);
            /*= } =*/
        }

        // get the bounding box and align the label
        // #3000 changed to better handle choice between plotband or plotline
        xBounds = path.xBounds ||
            [path[1], path[4], (isBand ? path[6] : path[1])];
        yBounds = path.yBounds ||
            [path[2], path[5], (isBand ? path[7] : path[2])];

        x = arrayMin(xBounds);
        y = arrayMin(yBounds);

        label.align(optionsLabel, false, {
            x: x,
            y: y,
            width: arrayMax(xBounds) - x,
            height: arrayMax(yBounds) - y
        });
        label.show();
    },

    /**
     * Remove the plot line or band
     */
    destroy: function () {
        // remove it from the lookup
        erase(this.axis.plotLinesAndBands, this);

        delete this.axis;
        destroyObjectProperties(this);
    }
};

/**
 * Object with members for extending the Axis prototype
 * @todo Extend directly instead of adding object to Highcharts first
 */

H.extend(Axis.prototype, /** @lends Highcharts.Axis.prototype */ {

    /**
     * Internal function to create the SVG path definition for a plot band.
     *
     * @param  {Number} from
     *         The axis value to start from.
     * @param  {Number} to
     *         The axis value to end on.
     *
     * @return {Array<String|Number>}
     *         The SVG path definition in array form.
     */
    getPlotBandPath: function (from, to) {
        var toPath = this.getPlotLinePath(to, null, null, true),
            path = this.getPlotLinePath(from, null, null, true),
            result = [],
            i,
            // #4964 check if chart is inverted or plotband is on yAxis
            horiz = this.horiz,
            plus = 1,
            isFlat,
            outside =
                (from < this.min && to < this.min) ||
                (from > this.max && to > this.max);

        if (path && toPath) {

            // Flat paths don't need labels (#3836)
            if (outside) {
                isFlat = path.toString() === toPath.toString();
                plus = 0;
            }

            // Go over each subpath - for panes in Highstock
            for (i = 0; i < path.length; i += 6) {

                // Add 1 pixel when coordinates are the same
                if (horiz && toPath[i + 1] === path[i + 1]) {
                    toPath[i + 1] += plus;
                    toPath[i + 4] += plus;
                } else if (!horiz && toPath[i + 2] === path[i + 2]) {
                    toPath[i + 2] += plus;
                    toPath[i + 5] += plus;
                }

                result.push(
                    'M',
                    path[i + 1],
                    path[i + 2],
                    'L',
                    path[i + 4],
                    path[i + 5],
                    toPath[i + 4],
                    toPath[i + 5],
                    toPath[i + 1],
                    toPath[i + 2],
                    'z'
                );
                result.isFlat = isFlat;
            }

        } else { // outside the axis area
            path = null;
        }

        return result;
    },

    /**
     * Add a plot band after render time.
     *
     * @param  {AxisPlotBandsOptions} options
     *         A configuration object for the plot band, as defined in {@link
     *         https://api.highcharts.com/highcharts/xAxis.plotBands|
     *         xAxis.plotBands}.
     * @return {Object}
     *         The added plot band.
     * @sample highcharts/members/axis-addplotband/
     *         Toggle the plot band from a button
     */
    addPlotBand: function (options) {
        return this.addPlotBandOrLine(options, 'plotBands');
    },

    /**
     * Add a plot line after render time.
     *
     * @param  {AxisPlotLinesOptions} options
     *         A configuration object for the plot line, as defined in {@link
     *         https://api.highcharts.com/highcharts/xAxis.plotLines|
     *         xAxis.plotLines}.
     * @return {Object}
     *         The added plot line.
     * @sample highcharts/members/axis-addplotline/
     *         Toggle the plot line from a button
     */
    addPlotLine: function (options) {
        return this.addPlotBandOrLine(options, 'plotLines');
    },

    /**
     * Add a plot band or plot line after render time. Called from addPlotBand
     * and addPlotLine internally.
     *
     * @private
     * @param  options {AxisPlotLinesOptions|AxisPlotBandsOptions}
     *         The plotBand or plotLine configuration object.
     */
    addPlotBandOrLine: function (options, coll) {
        var obj = new H.PlotLineOrBand(this, options).render(),
            userOptions = this.userOptions;

        if (obj) { // #2189
            // Add it to the user options for exporting and Axis.update
            if (coll) {
                userOptions[coll] = userOptions[coll] || [];
                userOptions[coll].push(options);
            }
            this.plotLinesAndBands.push(obj);
        }

        return obj;
    },

    /**
     * Remove a plot band or plot line from the chart by id. Called internally
     * from `removePlotBand` and `removePlotLine`.
     *
     * @private
     * @param {String} id
     */
    removePlotBandOrLine: function (id) {
        var plotLinesAndBands = this.plotLinesAndBands,
            options = this.options,
            userOptions = this.userOptions,
            i = plotLinesAndBands.length;
        while (i--) {
            if (plotLinesAndBands[i].id === id) {
                plotLinesAndBands[i].destroy();
            }
        }
        each([
            options.plotLines || [],
            userOptions.plotLines || [],
            options.plotBands || [],
            userOptions.plotBands || []
        ], function (arr) {
            i = arr.length;
            while (i--) {
                if (arr[i].id === id) {
                    erase(arr, arr[i]);
                }
            }
        });
    },

    /**
     * Remove a plot band by its id.
     *
     * @param  {String} id
     *         The plot band's `id` as given in the original configuration
     *         object or in the `addPlotBand` option.
     * @sample highcharts/members/axis-removeplotband/
     *         Remove plot band by id
     * @sample highcharts/members/axis-addplotband/
     *         Toggle the plot band from a button
     */
    removePlotBand: function (id) {
        this.removePlotBandOrLine(id);
    },

    /**
     * Remove a plot line by its id.
     * @param  {String} id
     *         The plot line's `id` as given in the original configuration
     *         object or in the `addPlotLine` option.
     * @sample highcharts/xaxis/plotlines-id/
     *         Remove plot line by id
     * @sample highcharts/members/axis-addplotline/
     *         Toggle the plot line from a button
     */
    removePlotLine: function (id) {
        this.removePlotBandOrLine(id);
    }
});
