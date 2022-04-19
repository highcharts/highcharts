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
import F from '../FormatUtilities.js';
import H from '../Globals.js';
var deg2rad = H.deg2rad;
import U from '../Utilities.js';
var clamp = U.clamp, correctFloat = U.correctFloat, defined = U.defined, destroyObjectProperties = U.destroyObjectProperties, extend = U.extend, fireEvent = U.fireEvent, isNumber = U.isNumber, merge = U.merge, objectEach = U.objectEach, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
/* eslint-disable no-invalid-this, valid-jsdoc */
/**
 * The Tick class.
 *
 * @class
 * @name Highcharts.Tick
 *
 * @param {Highcharts.Axis} axis
 * The axis of the tick.
 *
 * @param {number} pos
 * The position of the tick on the axis in terms of axis values.
 *
 * @param {string} [type]
 * The type of tick, either 'minor' or an empty string
 *
 * @param {boolean} [noLabel=false]
 * Whether to disable the label or not. Defaults to false.
 *
 * @param {Object} [parameters]
 * Optional parameters for the tick.
 */
var Tick = /** @class */ (function () {
    /* *
     *
     *  Constructors
     *
     * */
    function Tick(axis, pos, type, noLabel, parameters) {
        this.isNew = true;
        this.isNewLabel = true;
        /**
         * The related axis of the tick.
         * @name Highcharts.Tick#axis
         * @type {Highcharts.Axis}
         */
        this.axis = axis;
        /**
         * The logical position of the tick on the axis in terms of axis values.
         * @name Highcharts.Tick#pos
         * @type {number}
         */
        this.pos = pos;
        /**
         * The tick type, which can be `"minor"`, or an empty string.
         * @name Highcharts.Tick#type
         * @type {string}
         */
        this.type = type || '';
        this.parameters = parameters || {};
        /**
         * The mark offset of the tick on the axis. Usually `undefined`, numeric
         * for grid axes.
         * @name Highcharts.Tick#tickmarkOffset
         * @type {number|undefined}
         */
        this.tickmarkOffset = this.parameters.tickmarkOffset;
        this.options = this.parameters.options;
        fireEvent(this, 'init');
        if (!type && !noLabel) {
            this.addLabel();
        }
    }
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Write the tick label.
     *
     * @private
     * @function Highcharts.Tick#addLabel
     */
    Tick.prototype.addLabel = function () {
        var tick = this, axis = tick.axis, options = axis.options, chart = axis.chart, categories = axis.categories, log = axis.logarithmic, names = axis.names, pos = tick.pos, labelOptions = pick(tick.options && tick.options.labels, options.labels), tickPositions = axis.tickPositions, isFirst = pos === tickPositions[0], isLast = pos === tickPositions[tickPositions.length - 1], animateLabels = (!labelOptions.step || labelOptions.step === 1) &&
            axis.tickInterval === 1, tickPositionInfo = tickPositions.info;
        var label = tick.label, dateTimeLabelFormat, dateTimeLabelFormats, i;
        // The context value
        var value = this.parameters.category || (categories ?
            pick(categories[pos], names[pos], pos) :
            pos);
        if (log && isNumber(value)) {
            value = correctFloat(log.lin2log(value));
        }
        // Set the datetime label format. If a higher rank is set for this
        // position, use that. If not, use the general format.
        if (axis.dateTime) {
            if (tickPositionInfo) {
                dateTimeLabelFormats = chart.time.resolveDTLFormat(options.dateTimeLabelFormats[(!options.grid &&
                    tickPositionInfo.higherRanks[pos]) ||
                    tickPositionInfo.unitName]);
                dateTimeLabelFormat = dateTimeLabelFormats.main;
            }
            else if (isNumber(value)) { // #1441
                dateTimeLabelFormat = axis.dateTime.getXDateFormat(value, (options.dateTimeLabelFormats || {}));
            }
        }
        // set properties for access in render method
        /**
         * True if the tick is the first one on the axis.
         * @name Highcharts.Tick#isFirst
         * @readonly
         * @type {boolean|undefined}
         */
        tick.isFirst = isFirst;
        /**
         * True if the tick is the last one on the axis.
         * @name Highcharts.Tick#isLast
         * @readonly
         * @type {boolean|undefined}
         */
        tick.isLast = isLast;
        // Get the string
        var ctx = {
            axis: axis,
            chart: chart,
            dateTimeLabelFormat: dateTimeLabelFormat,
            isFirst: isFirst,
            isLast: isLast,
            pos: pos,
            tick: tick,
            tickPositionInfo: tickPositionInfo,
            value: value
        };
        // Fire an event that allows modifying the context for use in
        // `labels.format` and `labels.formatter`.
        fireEvent(this, 'labelFormat', ctx);
        // Label formatting. When `labels.format` is given, we first run the
        // defaultFormatter and append the result to the context as `text`.
        // Handy for adding prefix or suffix while keeping default number
        // formatting.
        var labelFormatter = function (ctx) {
            if (labelOptions.formatter) {
                return labelOptions.formatter.call(ctx, ctx);
            }
            if (labelOptions.format) {
                ctx.text = axis.defaultLabelFormatter.call(ctx);
                return F.format(labelOptions.format, ctx, chart);
            }
            return axis.defaultLabelFormatter.call(ctx, ctx);
        };
        var str = labelFormatter.call(ctx, ctx);
        // Set up conditional formatting based on the format list if existing.
        var list = dateTimeLabelFormats && dateTimeLabelFormats.list;
        if (list) {
            tick.shortenLabel = function () {
                for (i = 0; i < list.length; i++) {
                    extend(ctx, { dateTimeLabelFormat: list[i] });
                    label.attr({
                        text: labelFormatter.call(ctx, ctx)
                    });
                    if (label.getBBox().width <
                        axis.getSlotWidth(tick) - 2 *
                            labelOptions.padding) {
                        return;
                    }
                }
                label.attr({
                    text: ''
                });
            };
        }
        else {
            // #15692
            tick.shortenLabel = void 0;
        }
        // Call only after first render
        if (animateLabels && axis._addedPlotLB) {
            tick.moveLabel(str, labelOptions);
        }
        // First call
        if (!defined(label) && !tick.movedLabel) {
            /**
             * The rendered text label of the tick.
             * @name Highcharts.Tick#label
             * @type {Highcharts.SVGElement|undefined}
             */
            tick.label = label = tick.createLabel({ x: 0, y: 0 }, str, labelOptions);
            // Base value to detect change for new calls to getBBox
            tick.rotation = 0;
            // update
        }
        else if (label && label.textStr !== str && !animateLabels) {
            // When resetting text, also reset the width if dynamically set
            // (#8809)
            if (label.textWidth &&
                !labelOptions.style.width &&
                !label.styles.width) {
                label.css({ width: null });
            }
            label.attr({ text: str });
            label.textPxLength = label.getBBox().width;
        }
    };
    /**
     * Render and return the label of the tick.
     *
     * @private
     * @function Highcharts.Tick#createLabel
     */
    Tick.prototype.createLabel = function (xy, str, labelOptions) {
        var axis = this.axis, chart = axis.chart, label = defined(str) && labelOptions.enabled ?
            chart.renderer
                .text(str, xy.x, xy.y, labelOptions.useHTML)
                .add(axis.labelGroup) :
            null;
        // Un-rotated length
        if (label) {
            // Without position absolute, IE export sometimes is wrong
            if (!chart.styledMode) {
                label.css(merge(labelOptions.style));
            }
            label.textPxLength = label.getBBox().width;
        }
        return label;
    };
    /**
     * Destructor for the tick prototype
     *
     * @private
     * @function Highcharts.Tick#destroy
     */
    Tick.prototype.destroy = function () {
        destroyObjectProperties(this, this.axis);
    };
    /**
     * Gets the x and y positions for ticks in terms of pixels.
     *
     * @private
     * @function Highcharts.Tick#getPosition
     *
     * @param {boolean} horiz
     * Whether the tick is on an horizontal axis or not.
     *
     * @param {number} tickPos
     * Position of the tick.
     *
     * @param {number} tickmarkOffset
     * Tickmark offset for all ticks.
     *
     * @param {boolean} [old]
     * Whether the axis has changed or not.
     *
     * @return {Highcharts.PositionObject}
     * The tick position.
     *
     * @emits Highcharts.Tick#event:afterGetPosition
     */
    Tick.prototype.getPosition = function (horiz, tickPos, tickmarkOffset, old) {
        var axis = this.axis, chart = axis.chart, cHeight = (old && chart.oldChartHeight) || chart.chartHeight, pos = {
            x: horiz ?
                correctFloat(axis.translate(tickPos + tickmarkOffset, null, null, old) +
                    axis.transB) :
                (axis.left +
                    axis.offset +
                    (axis.opposite ?
                        (((old && chart.oldChartWidth) ||
                            chart.chartWidth) -
                            axis.right -
                            axis.left) :
                        0)),
            y: horiz ?
                (cHeight -
                    axis.bottom +
                    axis.offset -
                    (axis.opposite ? axis.height : 0)) :
                correctFloat(cHeight -
                    axis.translate(tickPos + tickmarkOffset, null, null, old) -
                    axis.transB)
        };
        // Chrome workaround for #10516
        pos.y = clamp(pos.y, -1e5, 1e5);
        fireEvent(this, 'afterGetPosition', { pos: pos });
        return pos;
    };
    /**
     * Get the x, y position of the tick label
     * @private
     */
    Tick.prototype.getLabelPosition = function (x, y, label, horiz, labelOptions, tickmarkOffset, index, step) {
        var axis = this.axis, transA = axis.transA, reversed = ( // #7911
        axis.isLinked && axis.linkedParent ?
            axis.linkedParent.reversed :
            axis.reversed), staggerLines = axis.staggerLines, rotCorr = axis.tickRotCorr || { x: 0, y: 0 }, 
        // Adjust for label alignment if we use reserveSpace: true (#5286)
        labelOffsetCorrection = (!horiz && !axis.reserveSpaceDefault ?
            -axis.labelOffset * (axis.labelAlign === 'center' ? 0.5 : 1) :
            0), pos = {};
        var yOffset = labelOptions.y, line;
        if (!defined(yOffset)) {
            if (axis.side === 0) {
                yOffset = label.rotation ? -8 : -label.getBBox().height;
            }
            else if (axis.side === 2) {
                yOffset = rotCorr.y + 8;
            }
            else {
                // #3140, #3140
                yOffset = Math.cos(label.rotation * deg2rad) *
                    (rotCorr.y - label.getBBox(false, 0).height / 2);
            }
        }
        x = x +
            labelOptions.x +
            labelOffsetCorrection +
            rotCorr.x -
            (tickmarkOffset && horiz ?
                tickmarkOffset * transA * (reversed ? -1 : 1) :
                0);
        y = y + yOffset - (tickmarkOffset && !horiz ?
            tickmarkOffset * transA * (reversed ? 1 : -1) : 0);
        // Correct for staggered labels
        if (staggerLines) {
            line = (index / (step || 1) % staggerLines);
            if (axis.opposite) {
                line = staggerLines - line - 1;
            }
            y += line * (axis.labelOffset / staggerLines);
        }
        pos.x = x;
        pos.y = Math.round(y);
        fireEvent(this, 'afterGetLabelPosition', { pos: pos, tickmarkOffset: tickmarkOffset, index: index });
        return pos;
    };
    /**
     * Get the offset height or width of the label
     *
     * @private
     * @function Highcharts.Tick#getLabelSize
     */
    Tick.prototype.getLabelSize = function () {
        return this.label ?
            this.label.getBBox()[this.axis.horiz ? 'height' : 'width'] :
            0;
    };
    /**
     * Extendible method to return the path of the marker
     * @private
     */
    Tick.prototype.getMarkPath = function (x, y, tickLength, tickWidth, horiz, renderer) {
        return renderer.crispLine([[
                'M',
                x,
                y
            ], [
                'L',
                x + (horiz ? 0 : -tickLength),
                y + (horiz ? tickLength : 0)
            ]], tickWidth);
    };
    /**
     * Handle the label overflow by adjusting the labels to the left and right
     * edge, or hide them if they collide into the neighbour label.
     *
     * @private
     * @function Highcharts.Tick#handleOverflow
     */
    Tick.prototype.handleOverflow = function (xy) {
        var tick = this, axis = this.axis, labelOptions = axis.options.labels, pxPos = xy.x, chartWidth = axis.chart.chartWidth, spacing = axis.chart.spacing, leftBound = pick(axis.labelLeft, Math.min(axis.pos, spacing[3])), rightBound = pick(axis.labelRight, Math.max(!axis.isRadial ? axis.pos + axis.len : 0, chartWidth - spacing[1])), label = this.label, rotation = this.rotation, factor = {
            left: 0,
            center: 0.5,
            right: 1
        }[axis.labelAlign || label.attr('align')], labelWidth = label.getBBox().width, slotWidth = axis.getSlotWidth(tick), xCorrection = factor, css = {};
        var modifiedSlotWidth = slotWidth, goRight = 1, leftPos, rightPos, textWidth;
        // Check if the label overshoots the chart spacing box. If it does, move
        // it. If it now overshoots the slotWidth, add ellipsis.
        if (!rotation && labelOptions.overflow === 'justify') {
            leftPos = pxPos - factor * labelWidth;
            rightPos = pxPos + (1 - factor) * labelWidth;
            if (leftPos < leftBound) {
                modifiedSlotWidth =
                    xy.x + modifiedSlotWidth * (1 - factor) - leftBound;
            }
            else if (rightPos > rightBound) {
                modifiedSlotWidth =
                    rightBound - xy.x + modifiedSlotWidth * factor;
                goRight = -1;
            }
            modifiedSlotWidth = Math.min(slotWidth, modifiedSlotWidth); // #4177
            if (modifiedSlotWidth < slotWidth && axis.labelAlign === 'center') {
                xy.x += (goRight *
                    (slotWidth -
                        modifiedSlotWidth -
                        xCorrection * (slotWidth - Math.min(labelWidth, modifiedSlotWidth))));
            }
            // If the label width exceeds the available space, set a text width
            // to be picked up below. Also, if a width has been set before, we
            // need to set a new one because the reported labelWidth will be
            // limited by the box (#3938).
            if (labelWidth > modifiedSlotWidth ||
                (axis.autoRotation && (label.styles || {}).width)) {
                textWidth = modifiedSlotWidth;
            }
            // Add ellipsis to prevent rotated labels to be clipped against the edge
            // of the chart
        }
        else if (rotation < 0 &&
            pxPos - factor * labelWidth < leftBound) {
            textWidth = Math.round(pxPos / Math.cos(rotation * deg2rad) - leftBound);
        }
        else if (rotation > 0 &&
            pxPos + factor * labelWidth > rightBound) {
            textWidth = Math.round((chartWidth - pxPos) /
                Math.cos(rotation * deg2rad));
        }
        if (textWidth) {
            if (tick.shortenLabel) {
                tick.shortenLabel();
            }
            else {
                css.width = Math.floor(textWidth) + 'px';
                if (!(labelOptions.style || {}).textOverflow) {
                    css.textOverflow = 'ellipsis';
                }
                label.css(css);
            }
        }
    };
    /**
     * Try to replace the label if the same one already exists.
     *
     * @private
     * @function Highcharts.Tick#moveLabel
     */
    Tick.prototype.moveLabel = function (str, labelOptions) {
        var tick = this, label = tick.label, axis = tick.axis, reversed = axis.reversed;
        var moved = false, labelPos, xPos, yPos;
        if (label && label.textStr === str) {
            tick.movedLabel = label;
            moved = true;
            delete tick.label;
        }
        else { // Find a label with the same string
            objectEach(axis.ticks, function (currentTick) {
                if (!moved &&
                    !currentTick.isNew &&
                    currentTick !== tick &&
                    currentTick.label &&
                    currentTick.label.textStr === str) {
                    tick.movedLabel = currentTick.label;
                    moved = true;
                    currentTick.labelPos = tick.movedLabel.xy;
                    delete currentTick.label;
                }
            });
        }
        // Create new label if the actual one is moved
        if (!moved && (tick.labelPos || label)) {
            labelPos = tick.labelPos || label.xy;
            xPos = axis.horiz ?
                (reversed ? 0 : axis.width + axis.left) : labelPos.x;
            yPos = axis.horiz ?
                labelPos.y : (reversed ? (axis.width + axis.left) : 0);
            tick.movedLabel = tick.createLabel({ x: xPos, y: yPos }, str, labelOptions);
            if (tick.movedLabel) {
                tick.movedLabel.attr({ opacity: 0 });
            }
        }
    };
    /**
     * Put everything in place
     *
     * @private
     * @param {number} index
     *
     * @param {boolean} [old]
     * Use old coordinates to prepare an animation into new position
     *
     * @param {number} [opacity]
     */
    Tick.prototype.render = function (index, old, opacity) {
        var tick = this, axis = tick.axis, horiz = axis.horiz, pos = tick.pos, tickmarkOffset = pick(tick.tickmarkOffset, axis.tickmarkOffset), xy = tick.getPosition(horiz, pos, tickmarkOffset, old), x = xy.x, y = xy.y, reverseCrisp = ((horiz && x === axis.pos + axis.len) ||
            (!horiz && y === axis.pos)) ? -1 : 1; // #1480, #1687
        var labelOpacity = pick(opacity, tick.label && tick.label.newOpacity, // #15528
        1);
        opacity = pick(opacity, 1);
        this.isActive = true;
        // Create the grid line
        this.renderGridLine(old, opacity, reverseCrisp);
        // create the tick mark
        this.renderMark(xy, opacity, reverseCrisp);
        // the label is created on init - now move it into place
        this.renderLabel(xy, old, labelOpacity, index);
        tick.isNew = false;
        fireEvent(this, 'afterRender');
    };
    /**
     * Renders the gridLine.
     *
     * @private
     * @function Highcharts.Tick#renderGridLine
     * @param {boolean} old  Whether or not the tick is old
     * @param {number} opacity  The opacity of the grid line
     * @param {number} reverseCrisp  Modifier for avoiding overlapping 1 or -1
     */
    Tick.prototype.renderGridLine = function (old, opacity, reverseCrisp) {
        var tick = this, axis = tick.axis, options = axis.options, attribs = {}, pos = tick.pos, type = tick.type, tickmarkOffset = pick(tick.tickmarkOffset, axis.tickmarkOffset), renderer = axis.chart.renderer;
        var gridLine = tick.gridLine, gridLinePath, gridLineWidth = options.gridLineWidth, gridLineColor = options.gridLineColor, dashStyle = options.gridLineDashStyle;
        if (tick.type === 'minor') {
            gridLineWidth = options.minorGridLineWidth;
            gridLineColor = options.minorGridLineColor;
            dashStyle = options.minorGridLineDashStyle;
        }
        if (!gridLine) {
            if (!axis.chart.styledMode) {
                attribs.stroke = gridLineColor;
                attribs['stroke-width'] = gridLineWidth || 0;
                attribs.dashstyle = dashStyle;
            }
            if (!type) {
                attribs.zIndex = 1;
            }
            if (old) {
                opacity = 0;
            }
            /**
             * The rendered grid line of the tick.
             * @name Highcharts.Tick#gridLine
             * @type {Highcharts.SVGElement|undefined}
             */
            tick.gridLine = gridLine = renderer.path()
                .attr(attribs)
                .addClass('highcharts-' + (type ? type + '-' : '') + 'grid-line')
                .add(axis.gridGroup);
        }
        if (gridLine) {
            gridLinePath = axis.getPlotLinePath({
                value: pos + tickmarkOffset,
                lineWidth: gridLine.strokeWidth() * reverseCrisp,
                force: 'pass',
                old: old
            });
            // If the parameter 'old' is set, the current call will be followed
            // by another call, therefore do not do any animations this time
            if (gridLinePath) {
                gridLine[old || tick.isNew ? 'attr' : 'animate']({
                    d: gridLinePath,
                    opacity: opacity
                });
            }
        }
    };
    /**
     * Renders the tick mark.
     *
     * @private
     * @function Highcharts.Tick#renderMark
     * @param {Highcharts.PositionObject} xy  The position vector of the mark
     * @param {number} opacity  The opacity of the mark
     * @param {number} reverseCrisp  Modifier for avoiding overlapping 1 or -1
     */
    Tick.prototype.renderMark = function (xy, opacity, reverseCrisp) {
        var tick = this, axis = tick.axis, options = axis.options, renderer = axis.chart.renderer, type = tick.type, tickSize = axis.tickSize(type ? type + 'Tick' : 'tick'), x = xy.x, y = xy.y, tickWidth = pick(options[type !== 'minor' ? 'tickWidth' : 'minorTickWidth'], !type && axis.isXAxis ? 1 : 0), // X axis defaults to 1
        tickColor = options[type !== 'minor' ? 'tickColor' : 'minorTickColor'];
        var mark = tick.mark;
        var isNewMark = !mark;
        if (tickSize) {
            // negate the length
            if (axis.opposite) {
                tickSize[0] = -tickSize[0];
            }
            // First time, create it
            if (!mark) {
                /**
                 * The rendered mark of the tick.
                 * @name Highcharts.Tick#mark
                 * @type {Highcharts.SVGElement|undefined}
                 */
                tick.mark = mark = renderer.path()
                    .addClass('highcharts-' + (type ? type + '-' : '') + 'tick')
                    .add(axis.axisGroup);
                if (!axis.chart.styledMode) {
                    mark.attr({
                        stroke: tickColor,
                        'stroke-width': tickWidth
                    });
                }
            }
            mark[isNewMark ? 'attr' : 'animate']({
                d: tick.getMarkPath(x, y, tickSize[0], mark.strokeWidth() * reverseCrisp, axis.horiz, renderer),
                opacity: opacity
            });
        }
    };
    /**
     * Renders the tick label.
     * Note: The label should already be created in init(), so it should only
     * have to be moved into place.
     *
     * @private
     * @function Highcharts.Tick#renderLabel
     * @param {Highcharts.PositionObject} xy  The position vector of the label
     * @param {boolean} old  Whether or not the tick is old
     * @param {number} opacity  The opacity of the label
     * @param {number} index  The index of the tick
     */
    Tick.prototype.renderLabel = function (xy, old, opacity, index) {
        var tick = this, axis = tick.axis, horiz = axis.horiz, options = axis.options, label = tick.label, labelOptions = options.labels, step = labelOptions.step, tickmarkOffset = pick(tick.tickmarkOffset, axis.tickmarkOffset), x = xy.x, y = xy.y;
        var show = true;
        if (label && isNumber(x)) {
            label.xy = xy = tick.getLabelPosition(x, y, label, horiz, labelOptions, tickmarkOffset, index, step);
            // Apply show first and show last. If the tick is both first and
            // last, it is a single centered tick, in which case we show the
            // label anyway (#2100).
            if ((tick.isFirst &&
                !tick.isLast &&
                !options.showFirstLabel) ||
                (tick.isLast &&
                    !tick.isFirst &&
                    !options.showLastLabel)) {
                show = false;
                // Handle label overflow and show or hide accordingly
            }
            else if (horiz &&
                !labelOptions.step &&
                !labelOptions.rotation &&
                !old &&
                opacity !== 0) {
                tick.handleOverflow(xy);
            }
            // apply step
            if (step && index % step) {
                // show those indices dividable by step
                show = false;
            }
            // Set the new position, and show or hide
            if (show && isNumber(xy.y)) {
                xy.opacity = opacity;
                label[tick.isNewLabel ? 'attr' : 'animate'](xy);
                tick.isNewLabel = false;
            }
            else {
                label.attr('y', -9999); // #1338
                tick.isNewLabel = true;
            }
        }
    };
    /**
     * Replace labels with the moved ones to perform animation. Additionally
     * destroy unused labels.
     *
     * @private
     * @function Highcharts.Tick#replaceMovedLabel
     */
    Tick.prototype.replaceMovedLabel = function () {
        var tick = this, label = tick.label, axis = tick.axis, reversed = axis.reversed;
        var x, y;
        // Animate and destroy
        if (label && !tick.isNew) {
            x = axis.horiz ? (reversed ? axis.left : axis.width + axis.left) : label.xy.x;
            y = axis.horiz ?
                label.xy.y :
                (reversed ? axis.width + axis.top : axis.top);
            label.animate({ x: x, y: y, opacity: 0 }, void 0, label.destroy);
            delete tick.label;
        }
        axis.isDirty = true;
        tick.label = tick.movedLabel;
        delete tick.movedLabel;
    };
    return Tick;
}());
/* *
 *
 *  Default Export
 *
 * */
export default Tick;
/* *
 *
 *  API Declarations
 *
 * */
/**
 * Optional parameters for the tick.
 * @private
 * @interface Highcharts.TickParametersObject
 */ /**
* Set category for the tick.
* @name Highcharts.TickParametersObject#category
* @type {string|undefined}
*/ /**
* @name Highcharts.TickParametersObject#options
* @type {Highcharts.Dictionary<any>|undefined}
*/ /**
* Set tickmarkOffset for the tick.
* @name Highcharts.TickParametersObject#tickmarkOffset
* @type {number|undefined}
*/
/**
 * Additonal time tick information.
 *
 * @interface Highcharts.TimeTicksInfoObject
 * @extends Highcharts.TimeNormalizedObject
 */ /**
* @name Highcharts.TimeTicksInfoObject#higherRanks
* @type {Array<string>}
*/ /**
* @name Highcharts.TimeTicksInfoObject#totalRange
* @type {number}
*/
(''); // keeps doclets above in JS file
