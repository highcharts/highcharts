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
import A from '../Animation/AnimationUtilities.js';
var getDeferredAnimation = A.getDeferredAnimation;
import F from '../FormatUtilities.js';
var format = F.format;
import U from '../Utilities.js';
var defined = U.defined, extend = U.extend, fireEvent = U.fireEvent, isArray = U.isArray, merge = U.merge, objectEach = U.objectEach, pick = U.pick, splat = U.splat;
/* *
 *
 *  Composition
 *
 * */
/* eslint-disable valid-jsdoc */
var DataLabel;
(function (DataLabel) {
    /* *
     *
     *  Declarations
     *
     * */
    /* *
     *
     *  Constants
     *
     * */
    var composedClasses = [];
    /* *
     *
     *  Functions
     *
     * */
    /* eslint-disable valid-jsdoc */
    /**
     * Align each individual data label.
     * @private
     */
    function alignDataLabel(point, dataLabel, options, alignTo, isNew) {
        var series = this, chart = this.chart, inverted = this.isCartesian && chart.inverted, enabledDataSorting = this.enabledDataSorting, plotX = pick(point.dlBox && point.dlBox.centerX, point.plotX, -9999), plotY = pick(point.plotY, -9999), bBox = dataLabel.getBBox(), rotation = options.rotation, align = options.align, isInsidePlot = chart.isInsidePlot(plotX, Math.round(plotY), {
            inverted: inverted,
            paneCoordinates: true,
            series: series
        }), setStartPos = function (alignOptions) {
            if (enabledDataSorting && series.xAxis && !justify) {
                series.setDataLabelStartPos(point, dataLabel, isNew, isInsidePlot, alignOptions);
            }
        };
        var baseline, normRotation, negRotation, rotCorr, // rotation correction
        // Math.round for rounding errors (#2683), alignTo to allow column
        // labels (#2700)
        alignAttr, // the final position;
        justify = pick(options.overflow, (enabledDataSorting ? 'none' : 'justify')) === 'justify', visible = this.visible &&
            point.visible !== false &&
            (point.series.forceDL ||
                (enabledDataSorting && !justify) ||
                isInsidePlot ||
                (
                // If the data label is inside the align box, it is
                // enough that parts of the align box is inside the
                // plot area (#12370). When stacking, it is always
                // inside regardless of the option (#15148).
                pick(options.inside, !!this.options.stacking) &&
                    alignTo &&
                    chart.isInsidePlot(plotX, inverted ?
                        alignTo.x + 1 :
                        alignTo.y + alignTo.height - 1, {
                        inverted: inverted,
                        paneCoordinates: true,
                        series: series
                    })));
        if (visible) {
            baseline = chart.renderer.fontMetrics(chart.styledMode ? void 0 : options.style.fontSize, dataLabel).b;
            // The alignment box is a singular point
            alignTo = extend({
                x: inverted ? this.yAxis.len - plotY : plotX,
                y: Math.round(inverted ? this.xAxis.len - plotX : plotY),
                width: 0,
                height: 0
            }, alignTo);
            // Add the text size for alignment calculation
            extend(options, {
                width: bBox.width,
                height: bBox.height
            });
            // Allow a hook for changing alignment in the last moment, then do
            // the alignment
            if (rotation) {
                justify = false; // Not supported for rotated text
                rotCorr = chart.renderer.rotCorr(baseline, rotation); // #3723
                alignAttr = {
                    x: (alignTo.x +
                        (options.x || 0) +
                        alignTo.width / 2 +
                        rotCorr.x),
                    y: (alignTo.y +
                        (options.y || 0) +
                        { top: 0, middle: 0.5, bottom: 1 }[options.verticalAlign] *
                            alignTo.height)
                };
                setStartPos(alignAttr); // data sorting
                dataLabel[isNew ? 'attr' : 'animate'](alignAttr)
                    .attr({
                    align: align
                });
                // Compensate for the rotated label sticking out on the sides
                normRotation = (rotation + 720) % 360;
                negRotation = normRotation > 180 && normRotation < 360;
                if (align === 'left') {
                    alignAttr.y -= negRotation ? bBox.height : 0;
                }
                else if (align === 'center') {
                    alignAttr.x -= bBox.width / 2;
                    alignAttr.y -= bBox.height / 2;
                }
                else if (align === 'right') {
                    alignAttr.x -= bBox.width;
                    alignAttr.y -= negRotation ? 0 : bBox.height;
                }
                dataLabel.placed = true;
                dataLabel.alignAttr = alignAttr;
            }
            else {
                setStartPos(alignTo); // data sorting
                dataLabel.align(options, void 0, alignTo);
                alignAttr = dataLabel.alignAttr;
            }
            // Handle justify or crop
            if (justify && alignTo.height >= 0) { // #8830
                this.justifyDataLabel(dataLabel, options, alignAttr, bBox, alignTo, isNew);
                // Now check that the data label is within the plot area
            }
            else if (pick(options.crop, true)) {
                visible =
                    chart.isInsidePlot(alignAttr.x, alignAttr.y, {
                        paneCoordinates: true,
                        series: series
                    }) &&
                        chart.isInsidePlot(alignAttr.x + bBox.width, alignAttr.y + bBox.height, {
                            paneCoordinates: true,
                            series: series
                        });
            }
            // When we're using a shape, make it possible with a connector or an
            // arrow pointing to thie point
            if (options.shape && !rotation) {
                dataLabel[isNew ? 'attr' : 'animate']({
                    anchorX: inverted ?
                        chart.plotWidth - point.plotY :
                        point.plotX,
                    anchorY: inverted ?
                        chart.plotHeight - point.plotX :
                        point.plotY
                });
            }
        }
        // To use alignAttr property in hideOverlappingLabels
        if (isNew && enabledDataSorting) {
            dataLabel.placed = false;
        }
        // Show or hide based on the final aligned position
        if (!visible && (!enabledDataSorting || justify)) {
            dataLabel.hide(true);
            dataLabel.placed = false; // don't animate back in
        }
    }
    /**
     * Handle the dataLabels.filter option.
     * @private
     */
    function applyFilter(point, options) {
        var filter = options.filter;
        if (filter) {
            var op = filter.operator;
            var prop = point[filter.property];
            var val = filter.value;
            if ((op === '>' && prop > val) ||
                (op === '<' && prop < val) ||
                (op === '>=' && prop >= val) ||
                (op === '<=' && prop <= val) ||
                (op === '==' && prop == val) || // eslint-disable-line eqeqeq
                (op === '===' && prop === val)) {
                return true;
            }
            return false;
        }
        return true;
    }
    /**
     * @private
     */
    function compose(SeriesClass) {
        if (composedClasses.indexOf(SeriesClass) === -1) {
            var seriesProto = SeriesClass.prototype;
            composedClasses.push(SeriesClass);
            seriesProto.alignDataLabel = alignDataLabel;
            seriesProto.drawDataLabels = drawDataLabels;
            seriesProto.justifyDataLabel = justifyDataLabel;
            seriesProto.setDataLabelStartPos = setDataLabelStartPos;
        }
    }
    DataLabel.compose = compose;
    /**
     * Draw the data labels
     * @private
     */
    function drawDataLabels() {
        var series = this, chart = series.chart, seriesOptions = series.options, points = series.points, hasRendered = series.hasRendered || 0, renderer = chart.renderer;
        var seriesDlOptions = seriesOptions.dataLabels, pointOptions, dataLabelsGroup;
        var dataLabelAnim = seriesDlOptions.animation, animationConfig = seriesDlOptions.defer ?
            getDeferredAnimation(chart, dataLabelAnim, series) :
            { defer: 0, duration: 0 };
        // Merge in plotOptions.dataLabels for series
        seriesDlOptions = mergeArrays(mergeArrays(chart.options.plotOptions &&
            chart.options.plotOptions.series &&
            chart.options.plotOptions.series.dataLabels, chart.options.plotOptions &&
            chart.options.plotOptions[series.type] &&
            chart.options.plotOptions[series.type].dataLabels), seriesDlOptions);
        fireEvent(this, 'drawDataLabels');
        if (isArray(seriesDlOptions) ||
            seriesDlOptions.enabled ||
            series._hasPointLabels) {
            // Create a separate group for the data labels to avoid rotation
            dataLabelsGroup = series.plotGroup('dataLabelsGroup', 'data-labels', !hasRendered ? 'hidden' : 'inherit', // #5133, #10220
            seriesDlOptions.zIndex || 6);
            dataLabelsGroup.attr({ opacity: +hasRendered }); // #3300
            if (!hasRendered) {
                var group = series.dataLabelsGroup;
                if (group) {
                    if (series.visible) { // #2597, #3023, #3024
                        dataLabelsGroup.show(true);
                    }
                    group[seriesOptions.animation ? 'animate' : 'attr']({ opacity: 1 }, animationConfig);
                }
            }
            // Make the labels for each point
            points.forEach(function (point) {
                // Merge in series options for the point.
                // @note dataLabelAttribs (like pointAttribs) would eradicate
                // the need for dlOptions, and simplify the section below.
                pointOptions = splat(mergeArrays(seriesDlOptions, 
                // dlOptions is used in treemaps
                (point.dlOptions ||
                    (point.options && point.options.dataLabels))));
                // Handle each individual data label for this point
                pointOptions.forEach(function (labelOptions, i) {
                    // Options for one datalabel
                    var labelEnabled = (labelOptions.enabled &&
                        // #2282, #4641, #7112, #10049
                        (!point.isNull || point.dataLabelOnNull) &&
                        applyFilter(point, labelOptions)), connector = point.connectors ?
                        point.connectors[i] :
                        point.connector;
                    var labelConfig, formatString, labelText, style, rotation, attr, dataLabel = point.dataLabels ?
                        point.dataLabels[i] : point.dataLabel, isNew = !dataLabel;
                    var labelDistance = pick(labelOptions.distance, point.labelDistance);
                    if (labelEnabled) {
                        // Create individual options structure that can be
                        // extended without affecting others
                        labelConfig = point.getLabelConfig();
                        formatString = pick(labelOptions[point.formatPrefix + 'Format'], labelOptions.format);
                        labelText = defined(formatString) ?
                            format(formatString, labelConfig, chart) :
                            (labelOptions[point.formatPrefix + 'Formatter'] ||
                                labelOptions.formatter).call(labelConfig, labelOptions);
                        style = labelOptions.style;
                        rotation = labelOptions.rotation;
                        if (!chart.styledMode) {
                            // Determine the color
                            style.color = pick(labelOptions.color, style.color, series.color, "#000000" /* neutralColor100 */);
                            // Get automated contrast color
                            if (style.color === 'contrast') {
                                point.contrastColor = renderer.getContrast((point.color || series.color));
                                style.color = (!defined(labelDistance) &&
                                    labelOptions.inside) ||
                                    labelDistance < 0 ||
                                    !!seriesOptions.stacking ?
                                    point.contrastColor :
                                    "#000000" /* neutralColor100 */;
                            }
                            else {
                                delete point.contrastColor;
                            }
                            if (seriesOptions.cursor) {
                                style.cursor = seriesOptions.cursor;
                            }
                        }
                        attr = {
                            r: labelOptions.borderRadius || 0,
                            rotation: rotation,
                            padding: labelOptions.padding,
                            zIndex: 1
                        };
                        if (!chart.styledMode) {
                            attr.fill = labelOptions.backgroundColor;
                            attr.stroke = labelOptions.borderColor;
                            attr['stroke-width'] = labelOptions.borderWidth;
                        }
                        // Remove unused attributes (#947)
                        objectEach(attr, function (val, name) {
                            if (typeof val === 'undefined') {
                                delete attr[name];
                            }
                        });
                    }
                    // If the point is outside the plot area, destroy it. #678,
                    // #820
                    if (dataLabel && (!labelEnabled ||
                        !defined(labelText) ||
                        !!dataLabel.div !== !!labelOptions.useHTML ||
                        (
                        // Change from no rotation to rotation and
                        // vice versa. Don't use defined() because
                        // rotation = 0 means also rotation = undefined
                        (!dataLabel.rotation ||
                            !labelOptions.rotation) &&
                            dataLabel.rotation !== labelOptions.rotation))) {
                        isNew = true;
                        point.dataLabel = dataLabel =
                            point.dataLabel && point.dataLabel.destroy();
                        if (point.dataLabels) {
                            // Remove point.dataLabels if this was the last one
                            if (point.dataLabels.length === 1) {
                                delete point.dataLabels;
                            }
                            else {
                                delete point.dataLabels[i];
                            }
                        }
                        if (!i) {
                            delete point.dataLabel;
                        }
                        if (connector) {
                            point.connector = point.connector.destroy();
                            if (point.connectors) {
                                // Remove point.connectors if this was the last
                                // one
                                if (point.connectors.length === 1) {
                                    delete point.connectors;
                                }
                                else {
                                    delete point.connectors[i];
                                }
                            }
                        }
                    }
                    // Individual labels are disabled if the are explicitly
                    // disabled in the point options, or if they fall outside
                    // the plot area.
                    if (labelEnabled && defined(labelText)) {
                        if (!dataLabel) {
                            // Create new label element
                            point.dataLabels = point.dataLabels || [];
                            dataLabel = point.dataLabels[i] = rotation ?
                                // Labels don't rotate, use text element
                                renderer.text(labelText, 0, -9999, labelOptions.useHTML)
                                    .addClass('highcharts-data-label') :
                                // We can use label
                                renderer.label(labelText, 0, -9999, labelOptions.shape, null, null, labelOptions.useHTML, null, 'data-label');
                            // Store for backwards compatibility
                            if (!i) {
                                point.dataLabel = dataLabel;
                            }
                            dataLabel.addClass(' highcharts-data-label-color-' +
                                point.colorIndex +
                                ' ' + (labelOptions.className || '') +
                                ( // #3398
                                labelOptions.useHTML ?
                                    ' highcharts-tracker' :
                                    ''));
                        }
                        else {
                            // Use old element and just update text
                            attr.text = labelText;
                        }
                        // Store data label options for later access
                        dataLabel.options = labelOptions;
                        dataLabel.attr(attr);
                        if (!chart.styledMode) {
                            // Styles must be applied before add in order to
                            // read text bounding box
                            dataLabel.css(style).shadow(labelOptions.shadow);
                        }
                        if (!dataLabel.added) {
                            dataLabel.add(dataLabelsGroup);
                        }
                        if (labelOptions.textPath && !labelOptions.useHTML) {
                            dataLabel.setTextPath((point.getDataLabelPath &&
                                point.getDataLabelPath(dataLabel)) || point.graphic, labelOptions.textPath);
                            if (point.dataLabelPath &&
                                !labelOptions.textPath.enabled) {
                                // clean the DOM
                                point.dataLabelPath = (point.dataLabelPath.destroy());
                            }
                        }
                        // Now the data label is created and placed at 0,0, so
                        // we need to align it
                        series.alignDataLabel(point, dataLabel, labelOptions, null, isNew);
                    }
                });
            });
        }
        fireEvent(this, 'afterDrawDataLabels');
    }
    /**
     * If data labels fall partly outside the plot area, align them back in, in
     * a way that doesn't hide the point.
     * @private
     */
    function justifyDataLabel(dataLabel, options, alignAttr, bBox, alignTo, isNew) {
        var chart = this.chart, align = options.align, verticalAlign = options.verticalAlign, padding = dataLabel.box ? 0 : (dataLabel.padding || 0);
        var _a = options.x, x = _a === void 0 ? 0 : _a, _b = options.y, y = _b === void 0 ? 0 : _b, off, justified;
        // Off left
        off = (alignAttr.x || 0) + padding;
        if (off < 0) {
            if (align === 'right' && x >= 0) {
                options.align = 'left';
                options.inside = true;
            }
            else {
                x -= off;
            }
            justified = true;
        }
        // Off right
        off = (alignAttr.x || 0) + bBox.width - padding;
        if (off > chart.plotWidth) {
            if (align === 'left' && x <= 0) {
                options.align = 'right';
                options.inside = true;
            }
            else {
                x += chart.plotWidth - off;
            }
            justified = true;
        }
        // Off top
        off = alignAttr.y + padding;
        if (off < 0) {
            if (verticalAlign === 'bottom' && y >= 0) {
                options.verticalAlign = 'top';
                options.inside = true;
            }
            else {
                y -= off;
            }
            justified = true;
        }
        // Off bottom
        off = (alignAttr.y || 0) + bBox.height - padding;
        if (off > chart.plotHeight) {
            if (verticalAlign === 'top' && y <= 0) {
                options.verticalAlign = 'bottom';
                options.inside = true;
            }
            else {
                y += chart.plotHeight - off;
            }
            justified = true;
        }
        if (justified) {
            options.x = x;
            options.y = y;
            dataLabel.placed = !isNew;
            dataLabel.align(options, void 0, alignTo);
        }
        return justified;
    }
    /**
     * Merge two objects that can be arrays. If one of them is an array, the
     * other is merged into each element. If both are arrays, each element is
     * merged by index. If neither are arrays, we use normal merge.
     * @private
     */
    function mergeArrays(one, two) {
        var res = [], i;
        if (isArray(one) && !isArray(two)) {
            res = one.map(function (el) {
                return merge(el, two);
            });
        }
        else if (isArray(two) && !isArray(one)) {
            res = two.map(function (el) {
                return merge(one, el);
            });
        }
        else if (!isArray(one) && !isArray(two)) {
            res = merge(one, two);
        }
        else {
            i = Math.max(one.length, two.length);
            while (i--) {
                res[i] = merge(one[i], two[i]);
            }
        }
        return res;
    }
    /**
     * Set starting position for data label sorting animation.
     * @private
     */
    function setDataLabelStartPos(point, dataLabel, isNew, isInside, alignOptions) {
        var chart = this.chart, inverted = chart.inverted, xAxis = this.xAxis, reversed = xAxis.reversed, labelCenter = inverted ? dataLabel.height / 2 : dataLabel.width / 2, pointWidth = point.pointWidth, halfWidth = pointWidth ? pointWidth / 2 : 0;
        dataLabel.startXPos = inverted ?
            alignOptions.x :
            (reversed ?
                -labelCenter - halfWidth :
                xAxis.width - labelCenter + halfWidth);
        dataLabel.startYPos = inverted ?
            (reversed ?
                this.yAxis.height - labelCenter + halfWidth :
                -labelCenter - halfWidth) : alignOptions.y;
        // We need to handle visibility in case of sorting point outside plot
        // area
        if (!isInside) {
            dataLabel
                .attr({ opacity: 1 })
                .animate({ opacity: 0 }, void 0, dataLabel.hide);
        }
        else if (dataLabel.visibility === 'hidden') {
            dataLabel.show();
            dataLabel
                .attr({ opacity: 0 })
                .animate({ opacity: 1 });
        }
        // Save start position on first render, but do not change position
        if (!chart.hasRendered) {
            return;
        }
        // Set start position
        if (isNew) {
            dataLabel.attr({ x: dataLabel.startXPos, y: dataLabel.startYPos });
        }
        dataLabel.placed = true;
    }
})(DataLabel || (DataLabel = {}));
/* *
 *
 *  Default Export
 *
 * */
export default DataLabel;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * Callback JavaScript function to format the data label as a string. Note that
 * if a `format` is defined, the format takes precedence and the formatter is
 * ignored.
 *
 * @callback Highcharts.DataLabelsFormatterCallbackFunction
 *
 * @param {Highcharts.PointLabelObject} this
 * Data label context to format
 *
 * @param {Highcharts.DataLabelsOptions} options
 * [API options](/highcharts/plotOptions.series.dataLabels) of the data label
 *
 * @return {number|string|null|undefined}
 * Formatted data label text
 */
/**
 * Values for handling data labels that flow outside the plot area.
 *
 * @typedef {"allow"|"justify"} Highcharts.DataLabelsOverflowValue
 */
''; // keeps doclets above in JS file
