/**
 * (c) 2010-2017 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */

/**
 * A label box.
 *
 * @typedef {object} Highcharts.DataLabelBoxObject
 *
 * @property {number} align
 *
 * @property {number} pos
 *
 * @property {number} rank
 *
 * @property {number} size
 *
 * @property {number} target
 */

/**
 * Alignment offset for a label.
 *
 * @typedef {object} Highcharts.DataLabelAlignObject
 *
 * @property {number} x
 *
 * @property {number} y
 */

/**
 * Label position for a pie slice.
 *
 * @typedef {Array<number|string>} Highcharts.DataLabelPiePosObject
 *
 * @property {number} x
 *
 * @property {number} y
 */

'use strict';
import H from './Globals.js';
import './Utilities.js';
import './Series.js';
var addEvent = H.addEvent,
    arrayMax = H.arrayMax,
    defined = H.defined,
    each = H.each,
    extend = H.extend,
    format = H.format,
    map = H.map,
    merge = H.merge,
    noop = H.noop,
    pick = H.pick,
    relativeLength = H.relativeLength,
    Series = H.Series,
    seriesTypes = H.seriesTypes,
    some = H.some,
    stableSort = H.stableSort;


/**
 * General distribution algorithm for distributing labels of differing size
 * along a confined length in two dimensions. The algorithm takes an array of
 * objects containing a size, a target and a rank. It will place the labels as
 * close as possible to their targets, skipping the lowest ranked labels if
 * necessary.
 *
 * @function Highcharts.distribute
 *
 * @param  {Array<Highcharts.DataLabelBoxObject>} boxes
 *
 * @param  {number} len
 *
 * @param  {number} maxDistance
 *
 * @return {void}
 */
H.distribute = function (boxes, len, maxDistance) {

    var i,
        overlapping = true,
        origBoxes = boxes, // Original array will be altered with added .pos
        restBoxes = [], // The outranked overshoot
        box,
        target,
        total = 0,
        reducedLen = origBoxes.reducedLen || len;

    function sortByTarget(a, b) {
        return a.target - b.target;
    }

    // If the total size exceeds the len, remove those boxes with the lowest
    // rank
    i = boxes.length;
    while (i--) {
        total += boxes[i].size;
    }

    // Sort by rank, then slice away overshoot
    if (total > reducedLen) {
        stableSort(boxes, function (a, b) {
            return (b.rank || 0) - (a.rank || 0);
        });
        i = 0;
        total = 0;
        while (total <= reducedLen) {
            total += boxes[i].size;
            i++;
        }
        restBoxes = boxes.splice(i - 1, boxes.length);
    }

    // Order by target
    stableSort(boxes, sortByTarget);


    // So far we have been mutating the original array. Now
    // create a copy with target arrays
    boxes = map(boxes, function (box) {
        return {
            size: box.size,
            targets: [box.target],
            align: pick(box.align, 0.5)
        };
    });

    while (overlapping) {
        // Initial positions: target centered in box
        i = boxes.length;
        while (i--) {
            box = boxes[i];
            // Composite box, average of targets
            target = (
                Math.min.apply(0, box.targets) +
                Math.max.apply(0, box.targets)
            ) / 2;
            box.pos = Math.min(
                Math.max(0, target - box.size * box.align),
                len - box.size
            );
        }

        // Detect overlap and join boxes
        i = boxes.length;
        overlapping = false;
        while (i--) {
            // Overlap
            if (i > 0 && boxes[i - 1].pos + boxes[i - 1].size > boxes[i].pos) {
                // Add this size to the previous box
                boxes[i - 1].size += boxes[i].size;
                boxes[i - 1].targets = boxes[i - 1]
                    .targets
                    .concat(boxes[i].targets);
                boxes[i - 1].align = 0.5;

                // Overlapping right, push left
                if (boxes[i - 1].pos + boxes[i - 1].size > len) {
                    boxes[i - 1].pos = len - boxes[i - 1].size;
                }
                boxes.splice(i, 1); // Remove this item
                overlapping = true;
            }
        }
    }

    // Add the rest (hidden boxes)
    origBoxes.push.apply(origBoxes, restBoxes);


    // Now the composite boxes are placed, we need to put the original boxes
    // within them
    i = 0;
    some(boxes, function (box) {
        var posInCompositeBox = 0;
        if (some(box.targets, function () {
            origBoxes[i].pos = box.pos + posInCompositeBox;

            // If the distance between the position and the target exceeds
            // maxDistance, abort the loop and decrease the length in increments
            // of 10% to recursively reduce the  number of visible boxes by
            // rank. Once all boxes are within the maxDistance, we're good.
            if (
                Math.abs(origBoxes[i].pos - origBoxes[i].target) >
                maxDistance
            ) {
                // Reset the positions that are already set
                each(origBoxes.slice(0, i + 1), function (box) {
                    delete box.pos;
                });

                // Try with a smaller length
                origBoxes.reducedLen =
                    (origBoxes.reducedLen || len) - (len * 0.1);

                // Recurse
                if (origBoxes.reducedLen > len * 0.1) {
                    H.distribute(origBoxes, len, maxDistance);
                }

                // Exceeded maxDistance => abort
                return true;
            }

            posInCompositeBox += origBoxes[i].size;
            i++;

        })) {
            // Exceeded maxDistance => abort
            return true;
        }
    });

    // Add the rest (hidden) boxes and sort by target
    stableSort(origBoxes, sortByTarget);
};


/**
 * Draw the data labels
 *
 * @function Highcharts.Series#drawDataLabels
 *
 * @return {void}
 *
 * @todo
 * Make events official: Fires the event `afterDrawDataLabels`.
 */
Series.prototype.drawDataLabels = function () {
    var series = this,
        chart = series.chart,
        seriesOptions = series.options,
        options = seriesOptions.dataLabels,
        points = series.points,
        pointOptions,
        generalOptions,
        hasRendered = series.hasRendered || 0,
        str,
        dataLabelsGroup,
        defer = pick(options.defer, !!seriesOptions.animation),
        renderer = chart.renderer;

    /*
     * Handle the dataLabels.filter option.
     */
    function applyFilter(point, options) {
        var filter = options.filter,
            op,
            prop,
            val;
        if (filter) {
            op = filter.operator;
            prop = point[filter.property];
            val = filter.value;
            if (
                (op === '>' && prop > val) ||
                (op === '<' && prop < val) ||
                (op === '>=' && prop >= val) ||
                (op === '<=' && prop <= val) ||
                (op === '==' && prop == val) || // eslint-disable-line eqeqeq
                (op === '===' && prop === val)
            ) {
                return true;
            }
            return false;
        }
        return true;
    }

    if (options.enabled || series._hasPointLabels) {

        // Process default alignment of data labels for columns
        if (series.dlProcessOptions) {
            series.dlProcessOptions(options);
        }

        // Create a separate group for the data labels to avoid rotation
        dataLabelsGroup = series.plotGroup(
            'dataLabelsGroup',
            'data-labels',
            defer && !hasRendered ? 'hidden' : 'visible', // #5133
            options.zIndex || 6
        );

        if (defer) {
            dataLabelsGroup.attr({ opacity: +hasRendered }); // #3300
            if (!hasRendered) {
                addEvent(series, 'afterAnimate', function () {
                    if (series.visible) { // #2597, #3023, #3024
                        dataLabelsGroup.show(true);
                    }
                    dataLabelsGroup[
                        seriesOptions.animation ? 'animate' : 'attr'
                    ]({ opacity: 1 }, { duration: 200 });
                });
            }
        }

        // Make the labels for each point
        generalOptions = options;
        each(points, function (point) {
            var enabled,
                dataLabel = point.dataLabel,
                labelConfig,
                attr,
                rotation,
                connector = point.connector,
                isNew = !dataLabel,
                style,
                formatString;

            // Determine if each data label is enabled
            // @note dataLabelAttribs (like pointAttribs) would eradicate
            // the need for dlOptions, and simplify the section below.
            pointOptions = point.dlOptions || // dlOptions is used in treemaps
                (point.options && point.options.dataLabels);
            enabled = pick(
                pointOptions && pointOptions.enabled,
                generalOptions.enabled
            ) && !point.isNull; // #2282, #4641, #7112

            if (enabled) {
                enabled = applyFilter(point, pointOptions || options) === true;
            }

            if (enabled) {
                // Create individual options structure that can be extended
                // without affecting others
                options = merge(generalOptions, pointOptions);
                labelConfig = point.getLabelConfig();
                formatString = (
                    options[point.formatPrefix + 'Format'] ||
                    options.format
                );

                str = defined(formatString) ?
                    format(formatString, labelConfig, chart.time) :
                    (
                        options[point.formatPrefix + 'Formatter'] ||
                        options.formatter
                    ).call(labelConfig, options);

                style = options.style;
                rotation = options.rotation;
                /*= if (build.classic) { =*/
                // Determine the color
                style.color = pick(
                    options.color,
                    style.color,
                    series.color,
                    '${palette.neutralColor100}'
                );
                // Get automated contrast color
                if (style.color === 'contrast') {
                    point.contrastColor =
                        renderer.getContrast(point.color || series.color);
                    style.color = options.inside ||
                        pick(point.labelDistance, options.distance) < 0 ||
                        !!seriesOptions.stacking ?
                            point.contrastColor :
                            '${palette.neutralColor100}';
                }
                if (seriesOptions.cursor) {
                    style.cursor = seriesOptions.cursor;
                }
                /*= } =*/

                attr = {
                    /*= if (build.classic) { =*/
                    fill: options.backgroundColor,
                    stroke: options.borderColor,
                    'stroke-width': options.borderWidth,
                    /*= } =*/
                    r: options.borderRadius || 0,
                    rotation: rotation,
                    padding: options.padding,
                    zIndex: 1
                };

                // Remove unused attributes (#947)
                H.objectEach(attr, function (val, name) {
                    if (val === undefined) {
                        delete attr[name];
                    }
                });
            }
            // If the point is outside the plot area, destroy it. #678, #820
            if (dataLabel && (!enabled || !defined(str))) {
                point.dataLabel = dataLabel = dataLabel.destroy();
                if (connector) {
                    point.connector = connector.destroy();
                }
            // Individual labels are disabled if the are explicitly disabled
            // in the point options, or if they fall outside the plot area.
            } else if (enabled && defined(str)) {
                // create new label
                if (!dataLabel) {
                    dataLabel = point.dataLabel = rotation ?

                        renderer
                            .text( // labels don't rotate
                                str,
                                0,
                                -9999,
                                options.useHTML
                            )
                            .addClass('highcharts-data-label') :

                        renderer.label(
                            str,
                            0,
                            -9999,
                            options.shape,
                            null,
                            null,
                            options.useHTML,
                            null,
                            'data-label'
                        );

                    dataLabel.addClass(
                        ' highcharts-data-label-color-' + point.colorIndex +
                        ' ' + (options.className || '') +
                        (options.useHTML ? ' highcharts-tracker' : '') // #3398
                    );
                } else {
                    attr.text = str;
                }
                dataLabel.attr(attr);
                /*= if (build.classic) { =*/
                // Styles must be applied before add in order to read text
                // bounding box
                dataLabel.css(style).shadow(options.shadow);
                /*= } =*/

                if (!dataLabel.added) {
                    dataLabel.add(dataLabelsGroup);
                }
                // Now the data label is created and placed at 0,0, so we need
                // to align it
                series.alignDataLabel(point, dataLabel, options, null, isNew);
            }
        });
    }

    H.fireEvent(this, 'afterDrawDataLabels');
};

/**
 * Align each individual data label.
 *
 * @function Highcharts.Series#alignDataLabel
 *
 * @param  {Highcharts.Point} point
 *
 * @param  {Highcharts.SVGElement} dataLabel
 *
 * @param  {Highcharts.PlotSeriesDataLabelsOptions} options
 *
 * @param  {Highcharts.BBoxObject} alignTo
 *
 * @param  {boolean} isNew
 *
 * @return {void}
 */
Series.prototype.alignDataLabel = function (
    point,
    dataLabel,
    options,
    alignTo,
    isNew
) {
    var chart = this.chart,
        inverted = chart.inverted,
        plotX = pick(point.dlBox && point.dlBox.centerX, point.plotX, -9999),
        plotY = pick(point.plotY, -9999),
        bBox = dataLabel.getBBox(),
        fontSize,
        baseline,
        rotation = options.rotation,
        normRotation,
        negRotation,
        align = options.align,
        rotCorr, // rotation correction
        // Math.round for rounding errors (#2683), alignTo to allow column
        // labels (#2700)
        visible =
            this.visible &&
            (
                point.series.forceDL ||
                chart.isInsidePlot(plotX, Math.round(plotY), inverted) ||
                (
                    alignTo && chart.isInsidePlot(
                        plotX,
                        inverted ?
                            alignTo.x + 1 :
                            alignTo.y + alignTo.height - 1,
                        inverted
                    )
                )
            ),
        alignAttr, // the final position;
        justify = pick(options.overflow, 'justify') === 'justify';

    if (visible) {

        /*= if (build.classic) { =*/
        fontSize = options.style.fontSize;
        /*= } =*/

        baseline = chart.renderer.fontMetrics(fontSize, dataLabel).b;

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

        // Allow a hook for changing alignment in the last moment, then do the
        // alignment
        if (rotation) {
            justify = false; // Not supported for rotated text
            rotCorr = chart.renderer.rotCorr(baseline, rotation); // #3723
            alignAttr = {
                x: alignTo.x + options.x + alignTo.width / 2 + rotCorr.x,
                y: (
                    alignTo.y +
                    options.y +
                    { top: 0, middle: 0.5, bottom: 1 }[options.verticalAlign] *
                        alignTo.height
                )
            };
            dataLabel[isNew ? 'attr' : 'animate'](alignAttr)
                .attr({ // #3003
                    align: align
                });

            // Compensate for the rotated label sticking out on the sides
            normRotation = (rotation + 720) % 360;
            negRotation = normRotation > 180 && normRotation < 360;

            if (align === 'left') {
                alignAttr.y -= negRotation ? bBox.height : 0;
            } else if (align === 'center') {
                alignAttr.x -= bBox.width / 2;
                alignAttr.y -= bBox.height / 2;
            } else if (align === 'right') {
                alignAttr.x -= bBox.width;
                alignAttr.y -= negRotation ? 0 : bBox.height;
            }
            dataLabel.placed = true;
            dataLabel.alignAttr = alignAttr;

        } else {
            dataLabel.align(options, null, alignTo);
            alignAttr = dataLabel.alignAttr;
        }

        // Handle justify or crop
        if (justify && alignTo.height >= 0) { // #8830
            point.isLabelJustified = this.justifyDataLabel(
                dataLabel,
                options,
                alignAttr,
                bBox,
                alignTo,
                isNew
            );

        // Now check that the data label is within the plot area
        } else if (pick(options.crop, true)) {
            visible =
                chart.isInsidePlot(
                    alignAttr.x,
                    alignAttr.y
                ) &&
                chart.isInsidePlot(
                    alignAttr.x + bBox.width,
                    alignAttr.y + bBox.height
                );
        }

        // When we're using a shape, make it possible with a connector or an
        // arrow pointing to thie point
        if (options.shape && !rotation) {
            dataLabel[isNew ? 'attr' : 'animate']({
                anchorX: inverted ? chart.plotWidth - point.plotY : point.plotX,
                anchorY: inverted ? chart.plotHeight - point.plotX : point.plotY
            });
        }
    }

    // Show or hide based on the final aligned position
    if (!visible) {
        dataLabel.attr({ y: -9999 });
        dataLabel.placed = false; // don't animate back in
    }

};

/**
 * If data labels fall partly outside the plot area, align them back in, in a
 * way that doesn't hide the point.
 *
 * @function Highcharts.Series#justifyDataLabel
 *
 * @param  {Highcharts.SVGElement} dataLabel
 *
 * @param  {Highcharts.PlotSeriesDataLabelsOptions} options
 *
 * @param  {Highcharts.DataLabelAlignObject} alignAttr
 *
 * @param  {Highcharts.BBoxObject} bBox
 *
 * @param  {boolean} isNew
 *
 * @return {boolean}
 */
Series.prototype.justifyDataLabel = function (
    dataLabel,
    options,
    alignAttr,
    bBox,
    alignTo,
    isNew
) {
    var chart = this.chart,
        align = options.align,
        verticalAlign = options.verticalAlign,
        off,
        justified,
        padding = dataLabel.box ? 0 : (dataLabel.padding || 0);

    // Off left
    off = alignAttr.x + padding;
    if (off < 0) {
        if (align === 'right') {
            options.align = 'left';
        } else {
            options.x = -off;
        }
        justified = true;
    }

    // Off right
    off = alignAttr.x + bBox.width - padding;
    if (off > chart.plotWidth) {
        if (align === 'left') {
            options.align = 'right';
        } else {
            options.x = chart.plotWidth - off;
        }
        justified = true;
    }

    // Off top
    off = alignAttr.y + padding;
    if (off < 0) {
        if (verticalAlign === 'bottom') {
            options.verticalAlign = 'top';
        } else {
            options.y = -off;
        }
        justified = true;
    }

    // Off bottom
    off = alignAttr.y + bBox.height - padding;
    if (off > chart.plotHeight) {
        if (verticalAlign === 'top') {
            options.verticalAlign = 'bottom';
        } else {
            options.y = chart.plotHeight - off;
        }
        justified = true;
    }

    if (justified) {
        dataLabel.placed = !isNew;
        dataLabel.align(options, null, alignTo);
    }

    return justified;
};

if (seriesTypes.pie) {
    /**
     * Override the base drawDataLabels method by pie specific functionality
     *
     * @function Highcharts.seriesTypes.pie#drawDataLabels
     *
     * @return {void}
     */
    seriesTypes.pie.prototype.drawDataLabels = function () {
        var series = this,
            data = series.data,
            point,
            chart = series.chart,
            options = series.options.dataLabels,
            connectorPadding = pick(options.connectorPadding, 10),
            connectorWidth = pick(options.connectorWidth, 1),
            plotWidth = chart.plotWidth,
            plotHeight = chart.plotHeight,
            maxWidth = Math.round(chart.chartWidth / 3),
            connector,
            seriesCenter = series.center,
            radius = seriesCenter[2] / 2,
            centerY = seriesCenter[1],
            dataLabel,
            dataLabelWidth,
            labelPos,
            labelHeight,
            // divide the points into right and left halves for anti collision
            halves = [
                [], // right
                []  // left
            ],
            x,
            y,
            visibility,
            j,
            overflow = [0, 0, 0, 0]; // top, right, bottom, left

        // get out if not enabled
        if (!series.visible || (!options.enabled && !series._hasPointLabels)) {
            return;
        }

        // Reset all labels that have been shortened
        each(data, function (point) {
            if (point.dataLabel && point.visible && point.dataLabel.shortened) {
                point.dataLabel
                    .attr({
                        width: 'auto'
                    }).css({
                        width: 'auto',
                        textOverflow: 'clip'
                    });
                point.dataLabel.shortened = false;
            }
        });


        // run parent method
        Series.prototype.drawDataLabels.apply(series);

        each(data, function (point) {
            if (point.dataLabel) {

                if (point.visible) { // #407, #2510

                    // Arrange points for detection collision
                    halves[point.half].push(point);

                    // Reset positions (#4905)
                    point.dataLabel._pos = null;

                    // Avoid long labels squeezing the pie size too far down
                    /*= if (build.classic) { =*/
                    if (
                        !defined(options.style.width) &&
                        !defined(
                            point.options.dataLabels &&
                            point.options.dataLabels.style &&
                            point.options.dataLabels.style.width
                        )
                    ) {
                    /*= } =*/
                        if (point.dataLabel.getBBox().width > maxWidth) {
                            point.dataLabel.css({
                                // Use a fraction of the maxWidth to avoid
                                // wrapping close to the end of the string.
                                width: maxWidth * 0.7
                            });
                            point.dataLabel.shortened = true;
                        }
                    /*= if (build.classic) { =*/
                    }
                    /*= } =*/
                } else {
                    point.dataLabel = point.dataLabel.destroy();
                }
            }
        });

        /* Loop over the points in each half, starting from the top and bottom
         * of the pie to detect overlapping labels.
         */
        each(halves, function (points, i) {

            var top,
                bottom,
                length = points.length,
                positions = [],
                naturalY,
                sideOverflow,
                size,
                distributionLength;

            if (!length) {
                return;
            }

            // Sort by angle
            series.sortByAngle(points, i - 0.5);
            // Only do anti-collision when we have dataLabels outside the pie
            // and have connectors. (#856)
            if (series.maxLabelDistance > 0) {
                top = Math.max(
                    0,
                    centerY - radius - series.maxLabelDistance
                );
                bottom = Math.min(
                    centerY + radius + series.maxLabelDistance,
                    chart.plotHeight
                );
                each(points, function (point) {
                    // check if specific points' label is outside the pie
                    if (point.labelDistance > 0 && point.dataLabel) {
                        // point.top depends on point.labelDistance value
                        // Used for calculation of y value in getX method
                        point.top = Math.max(
                            0,
                            centerY - radius - point.labelDistance
                        );
                        point.bottom = Math.min(
                            centerY + radius + point.labelDistance,
                            chart.plotHeight
                        );
                        size = point.dataLabel.getBBox().height || 21;

                        // point.positionsIndex is needed for getting index of
                        // parameter related to specific point inside positions
                        // array - not every point is in positions array.
                        point.distributeBox = {
                            target: point.labelPos[1] - point.top + size / 2,
                            size: size,
                            rank: point.y
                        };
                        positions.push(point.distributeBox);
                    }
                });
                distributionLength = bottom + size - top;
                H.distribute(
                    positions,
                    distributionLength,
                    distributionLength / 5
                );
            }

            // Now the used slots are sorted, fill them up sequentially
            for (j = 0; j < length; j++) {

                point = points[j];
                labelPos = point.labelPos;
                dataLabel = point.dataLabel;
                visibility = point.visible === false ? 'hidden' : 'inherit';
                naturalY = labelPos[1];
                y = naturalY;

                if (positions && defined(point.distributeBox)) {
                    if (point.distributeBox.pos === undefined) {
                        visibility = 'hidden';
                    } else {
                        labelHeight = point.distributeBox.size;
                        y = point.top + point.distributeBox.pos;
                    }
                }

                // It is needed to delete point.positionIndex for
                // dynamically added points etc.

                delete point.positionIndex;

                // get the x - use the natural x position for labels near the
                // top and bottom, to prevent the top and botton slice
                // connectors from touching each other on either side
                if (options.justify) {
                    x = seriesCenter[0] +
                        (i ? -1 : 1) * (radius + point.labelDistance);
                } else {
                    x = series.getX(
                        y < point.top + 2 || y > point.bottom - 2 ?
                            naturalY :
                            y,
                        i,
                        point
                    );
                }


                // Record the placement and visibility
                dataLabel._attr = {
                    visibility: visibility,
                    align: labelPos[6]
                };
                dataLabel._pos = {
                    x: (
                        x +
                        options.x +
                        ({
                            left: connectorPadding,
                            right: -connectorPadding
                        }[labelPos[6]] || 0)
                    ),

                    // 10 is for the baseline (label vs text)
                    y: y + options.y - 10
                };
                labelPos.x = x;
                labelPos.y = y;


                // Detect overflowing data labels
                if (pick(options.crop, true)) {
                    dataLabelWidth = dataLabel.getBBox().width;

                    sideOverflow = null;
                    // Overflow left
                    if (
                        x - dataLabelWidth < connectorPadding &&
                        i === 1 // left half
                    ) {
                        sideOverflow = Math.round(
                            dataLabelWidth - x + connectorPadding
                        );
                        overflow[3] = Math.max(sideOverflow, overflow[3]);

                    // Overflow right
                    } else if (
                        x + dataLabelWidth > plotWidth - connectorPadding &&
                        i === 0 // right half
                    ) {
                        sideOverflow = Math.round(
                            x + dataLabelWidth - plotWidth + connectorPadding
                        );
                        overflow[1] = Math.max(sideOverflow, overflow[1]);
                    }

                    // Overflow top
                    if (y - labelHeight / 2 < 0) {
                        overflow[0] = Math.max(
                            Math.round(-y + labelHeight / 2),
                            overflow[0]
                        );

                    // Overflow left
                    } else if (y + labelHeight / 2 > plotHeight) {
                        overflow[2] = Math.max(
                            Math.round(y + labelHeight / 2 - plotHeight),
                            overflow[2]
                        );
                    }
                    dataLabel.sideOverflow = sideOverflow;
                }
            } // for each point
        }); // for each half

        // Do not apply the final placement and draw the connectors until we
        // have verified that labels are not spilling over.
        if (
            arrayMax(overflow) === 0 ||
            this.verifyDataLabelOverflow(overflow)
        ) {

            // Place the labels in the final position
            this.placeDataLabels();

            // Draw the connectors
            if (connectorWidth) {
                each(this.points, function (point) {
                    var isNew;

                    connector = point.connector;
                    dataLabel = point.dataLabel;

                    if (
                        dataLabel &&
                        dataLabel._pos &&
                        point.visible &&
                        point.labelDistance > 0
                    ) {
                        visibility = dataLabel._attr.visibility;

                        isNew = !connector;

                        if (isNew) {
                            point.connector = connector = chart.renderer.path()
                                .addClass('highcharts-data-label-connector ' +
                                    ' highcharts-color-' + point.colorIndex +
                                    (
                                        point.className ?
                                            ' ' + point.className :
                                            ''
                                    )
                                )
                                .add(series.dataLabelsGroup);

                            /*= if (build.classic) { =*/
                            connector.attr({
                                'stroke-width': connectorWidth,
                                'stroke': (
                                    options.connectorColor ||
                                    point.color ||
                                    '${palette.neutralColor60}'
                                )
                            });
                            /*= } =*/
                        }
                        connector[isNew ? 'attr' : 'animate']({
                            d: series.connectorPath(point.labelPos)
                        });
                        connector.attr('visibility', visibility);

                    } else if (connector) {
                        point.connector = connector.destroy();
                    }
                });
            }
        }
    };

    /**
     * Extendable method for getting the path of the connector between the data
     * label and the pie slice.
     *
     * @function Highcharts.seriesTypes.pie#connectorPath
     *
     * @param  {Highcharts.DataLabelPiePosObject} labelPos
     *
     * @return {Highcharts.PathObject}
     */
    seriesTypes.pie.prototype.connectorPath = function (labelPos) {
        var x = labelPos.x,
            y = labelPos.y;
        return pick(this.options.dataLabels.softConnector, true) ? [
            'M',
            // end of the string at the label
            x + (labelPos[6] === 'left' ? 5 : -5), y,
            'C',
            x, y, // first break, next to the label
            2 * labelPos[2] - labelPos[4], 2 * labelPos[3] - labelPos[5],
            labelPos[2], labelPos[3], // second break
            'L',
            labelPos[4], labelPos[5] // base
        ] : [
            'M',
            // end of the string at the label
            x + (labelPos[6] === 'left' ? 5 : -5), y,
            'L',
            labelPos[2], labelPos[3], // second break
            'L',
            labelPos[4], labelPos[5] // base
        ];
    };

    /**
     * Perform the final placement of the data labels after we have verified
     * that they fall within the plot area.
     *
     * @function Highcharts.seriesTypes.pie#placeDataLabels
     *
     * @return {void}
     */
    seriesTypes.pie.prototype.placeDataLabels = function () {
        each(this.points, function (point) {
            var dataLabel = point.dataLabel,
                _pos;
            if (dataLabel && point.visible) {
                _pos = dataLabel._pos;
                if (_pos) {

                    // Shorten data labels with ellipsis if they still overflow
                    // after the pie has reached minSize (#223).
                    if (dataLabel.sideOverflow) {
                        dataLabel._attr.width =
                            dataLabel.getBBox().width - dataLabel.sideOverflow;

                        dataLabel.css({
                            width: dataLabel._attr.width + 'px',
                            textOverflow: (
                                (this.options.dataLabels.style || {})
                                    .textOverflow ||
                                'ellipsis'
                            )
                        });
                        dataLabel.shortened = true;
                    }

                    dataLabel.attr(dataLabel._attr);
                    dataLabel[dataLabel.moved ? 'animate' : 'attr'](_pos);
                    dataLabel.moved = true;
                } else if (dataLabel) {
                    dataLabel.attr({ y: -9999 });
                }
            }
        }, this);
    };

    seriesTypes.pie.prototype.alignDataLabel = noop;

    /**
     * Verify whether the data labels are allowed to draw, or we should run more
     * translation and data label positioning to keep them inside the plot area.
     * Returns true when data labels are ready to draw.
     *
     * @function Highcharts.seriesTypes.pie#verifyDataLabelOverflow
     *
     * @param  {boolean} overflow
     *
     * @return {boolean}
     */
    seriesTypes.pie.prototype.verifyDataLabelOverflow = function (overflow) {

        var center = this.center,
            options = this.options,
            centerOption = options.center,
            minSize = options.minSize || 80,
            newSize = minSize,
            // If a size is set, return true and don't try to shrink the pie
            // to fit the labels.
            ret = options.size !== null;

        if (!ret) {
            // Handle horizontal size and center
            if (centerOption[0] !== null) { // Fixed center
                newSize = Math.max(center[2] -
                    Math.max(overflow[1], overflow[3]), minSize);

            } else { // Auto center
                newSize = Math.max(
                    // horizontal overflow
                    center[2] - overflow[1] - overflow[3],
                    minSize
                );
                // horizontal center
                center[0] += (overflow[3] - overflow[1]) / 2;
            }

            // Handle vertical size and center
            if (centerOption[1] !== null) { // Fixed center
                newSize = Math.max(Math.min(newSize, center[2] -
                    Math.max(overflow[0], overflow[2])), minSize);

            } else { // Auto center
                newSize = Math.max(
                    Math.min(
                        newSize,
                        // vertical overflow
                        center[2] - overflow[0] - overflow[2]
                    ),
                    minSize
                );
                // vertical center
                center[1] += (overflow[0] - overflow[2]) / 2;
            }

            // If the size must be decreased, we need to run translate and
            // drawDataLabels again
            if (newSize < center[2]) {
                center[2] = newSize;
                center[3] = Math.min( // #3632
                    relativeLength(options.innerSize || 0, newSize),
                    newSize
                );
                this.translate(center);

                if (this.drawDataLabels) {
                    this.drawDataLabels();
                }
            // Else, return true to indicate that the pie and its labels is
            // within the plot area
            } else {
                ret = true;
            }
        }
        return ret;
    };
}

if (seriesTypes.column) {

    /**
     * Override the basic data label alignment by adjusting for the position of
     * the column.
     *
     * @function Highcharts.seriesTypes.column#alignDataLabel
     *
     * @param  {Highcharts.Point} point
     *
     * @param  {Highcharts.SVGElement} dataLabel
     *
     * @param  {Highcharts.PlotSeriesDataLabelsOptions} options
     *
     * @param  {Highcharts.BBoxObject} alignTo
     *
     * @param  {boolean} isNew
     *
     * @return {void}
     */
    seriesTypes.column.prototype.alignDataLabel = function (
        point,
        dataLabel,
        options,
        alignTo,
        isNew
    ) {
        var inverted = this.chart.inverted,
            series = point.series,
            // data label box for alignment
            dlBox = point.dlBox || point.shapeArgs,
            below = pick(
                point.below, // range series
                point.plotY > pick(this.translatedThreshold, series.yAxis.len)
            ),
            // draw it inside the box?
            inside = pick(options.inside, !!this.options.stacking),
            overshoot;

        // Align to the column itself, or the top of it
        if (dlBox) { // Area range uses this method but not alignTo
            alignTo = merge(dlBox);

            if (alignTo.y < 0) {
                alignTo.height += alignTo.y;
                alignTo.y = 0;
            }
            overshoot = alignTo.y + alignTo.height - series.yAxis.len;
            if (overshoot > 0) {
                alignTo.height -= overshoot;
            }

            if (inverted) {
                alignTo = {
                    x: series.yAxis.len - alignTo.y - alignTo.height,
                    y: series.xAxis.len - alignTo.x - alignTo.width,
                    width: alignTo.height,
                    height: alignTo.width
                };
            }

            // Compute the alignment box
            if (!inside) {
                if (inverted) {
                    alignTo.x += below ? 0 : alignTo.width;
                    alignTo.width = 0;
                } else {
                    alignTo.y += below ? alignTo.height : 0;
                    alignTo.height = 0;
                }
            }
        }


        // When alignment is undefined (typically columns and bars), display the
        // individual point below or above the point depending on the threshold
        options.align = pick(
            options.align,
            !inverted || inside ? 'center' : below ? 'right' : 'left'
        );
        options.verticalAlign = pick(
            options.verticalAlign,
            inverted || inside ? 'middle' : below ? 'top' : 'bottom'
        );

        // Call the parent method
        Series.prototype.alignDataLabel.call(
            this,
            point,
            dataLabel,
            options,
            alignTo,
            isNew
        );

        // If label was justified and we have contrast, set it:
        if (point.isLabelJustified && point.contrastColor) {
            point.dataLabel.css({
                color: point.contrastColor
            });
        }
    };
}
