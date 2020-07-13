/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Point from './Point';
import type SVGElement from '../Renderer/SVG/SVGElement';
import H from '../Globals.js';
const {
    noop,
    seriesTypes
} = H;
import U from '../Utilities.js';
const {
    arrayMax,
    clamp,
    defined,
    extend,
    fireEvent,
    format,
    getDeferredAnimation,
    isArray,
    merge,
    objectEach,
    pick,
    relativeLength,
    splat,
    stableSort
} = U;

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type DataLabelsFilterOperatorValue = ('>'|'<'|'>='|'<='|'=='|'===');
        type DataLabelsOverflowValue = ('allow'|'justify');
        interface DataLabelsBoxArray extends Array<DataLabelsBoxObject> {
            reducedLen?: number;
        }
        interface DataLabelsBoxObject {
            align?: number;
            pos?: number;
            rank?: (number|null);
            size: number;
            target: number;
            targets?: Array<number>;
        }
        interface DataLabelsFilterOptionsObject {
            operator: DataLabelsFilterOperatorValue;
            property: string;
            value: (null|number);
        }
        interface DataLabelsFormatterCallbackFunction {
            (this: PointLabelObject): (
                number|string|null|undefined
            );
        }
        interface DataLabelsOptions {
            animation?: (boolean|Partial<AnimationOptionsObject>);
            align?: AlignValue;
            allowOverlap?: boolean;
            backgroundColor?: (ColorString|GradientColorObject|PatternObject);
            borderColor?: (ColorString|GradientColorObject|PatternObject);
            borderRadius?: number;
            borderWidth?: number;
            className?: string;
            color?: (ColorString|GradientColorObject|PatternObject);
            crop?: boolean;
            defer?: boolean;
            enabled?: boolean;
            filter?: DataLabelsFilterOptionsObject;
            format?: string;
            formatter?: DataLabelsFormatterCallbackFunction;
            inside?: boolean;
            nullFormat?: (boolean|string);
            overflow?: DataLabelsOverflowValue;
            padding?: number;
            rotation?: number;
            shadow?: (boolean|Partial<ShadowOptionsObject>);
            shape?: string;
            style?: CSSObject;
            textPath?: DataLabelsTextPathOptionsObject;
            useHTML?: boolean;
            verticalAlign?: VerticalAlignValue;
            x?: number;
            y?: number;
            zIndex?: number;
        }
        interface DataLabelsTextPathOptionsObject {
            attributes?: SVGAttributes;
            enabled?: boolean;
        }
        interface PointLike {
            bottom?: number;
            connector?: SVGElement;
            connectors?: Array<SVGElement>;
            contrastColor?: ColorString;
            dataLabel?: SVGElement;
            dataLabelPath?: SVGElement;
            dataLabels?: Array<SVGElement>;
            distributeBox?: DataLabelsBoxObject;
            dlBox?: BBoxObject;
            dlOptions?: DataLabelsOptions;
            graphic?: SVGElement;
            /** @deprecated */
            positionIndex?: unknown;
            top?: number;
            getDataLabelPath(dataLabel: SVGElement): SVGElement;
        }
        interface PointOptionsObject {
            dataLabels?: (
                DataLabelsOptions|
                Array<DataLabelsOptions>
            );
            labelrank?: number;
        }
        interface Series {
            /** @deprecated */
            dataLabelsGroup?: SVGElement;
            dataLabelPositioners?: SeriesDataLabelPositionersObject;
            alignDataLabel(
                point: Point,
                dataLabel: SVGElement,
                options: DataLabelsOptions,
                alignTo: BBoxObject,
                isNew?: boolean
            ): void;
            drawDataLabels(): void;
            justifyDataLabel(
                dataLabel: SVGElement,
                options: DataLabelsOptions,
                alignAttr: SVGAttributes,
                bBox: BBoxObject,
                alignTo?: BBoxObject,
                isNew?: boolean
            ): (boolean|undefined);
            placeDataLabels?(): void;
            setDataLabelStartPos(
                point: ColumnPoint,
                dataLabel: SVGElement,
                isNew: boolean|undefined,
                isInside: boolean,
                alignOptions: AlignObject
            ): void;
            verifyDataLabelOverflow?(overflow: Array<number>): boolean;
        }
        interface SeriesDataLabelPositionersObject {
            alignToConnectors(
                points: Array<Point>,
                half: boolean,
                plotWidth: number,
                plotLeft: number
            ): number;
            alignToPlotEdges(
                dataLabel: SVGElement,
                half: boolean,
                plotWidth: number,
                plotLeft: number
            ): number;
            justify(
                point: Point,
                radius: number,
                seriesCenter: Array<number>
            ): number;
            radialDistributionX(
                series: Series,
                point: Point,
                y: number,
                naturalY: number
            ): number;
            radialDistributionY(point: Point): number;
        }
        function distribute(
            boxes: DataLabelsBoxArray,
            len: number,
            maxDistance?: number
        ): void;
    }
}

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

import './Series.js';
var Series = H.Series;

/* eslint-disable valid-jsdoc */

/**
 * General distribution algorithm for distributing labels of differing size
 * along a confined length in two dimensions. The algorithm takes an array of
 * objects containing a size, a target and a rank. It will place the labels as
 * close as possible to their targets, skipping the lowest ranked labels if
 * necessary.
 *
 * @private
 * @function Highcharts.distribute
 * @param {Highcharts.DataLabelsBoxArray} boxes
 * @param {number} len
 * @param {number} [maxDistance]
 * @return {void}
 */
H.distribute = function (
    boxes: Highcharts.DataLabelsBoxArray,
    len: number,
    maxDistance?: number
): void {

    var i: number,
        overlapping = true,
        origBoxes = boxes, // Original array will be altered with added .pos
        restBoxes: Highcharts.DataLabelsBoxArray = [], // The outranked overshoot
        box,
        target,
        total = 0,
        reducedLen = origBoxes.reducedLen || len;

    /**
     * @private
     */
    function sortByTarget(
        a: Highcharts.DataLabelsBoxObject,
        b: Highcharts.DataLabelsBoxObject
    ): number {
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
        stableSort(boxes, function (
            a: Highcharts.DataLabelsBoxObject,
            b: Highcharts.DataLabelsBoxObject
        ): number {
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
    boxes = boxes.map(function (
        box: Highcharts.DataLabelsBoxObject
    ): Highcharts.DataLabelsBoxObject {
        return {
            size: box.size,
            targets: [box.target],
            align: pick(box.align, 0.5)
        } as any;
    }) as any;

    while (overlapping) {
        // Initial positions: target centered in box
        i = boxes.length;
        while (i--) {
            box = boxes[i];
            // Composite box, average of targets
            target = (
                Math.min.apply(0, box.targets as any) +
                Math.max.apply(0, box.targets as any)
            ) / 2;
            box.pos = clamp(
                target - box.size * (box.align as any), 0, len - box.size
            );
        }

        // Detect overlap and join boxes
        i = boxes.length;
        overlapping = false;
        while (i--) {
            // Overlap
            if (i > 0 &&
                (boxes[i - 1].pos as any) + boxes[i - 1].size >
                (boxes[i].pos as any)
            ) {
                // Add this size to the previous box
                boxes[i - 1].size += boxes[i].size;
                boxes[i - 1].targets = (boxes[i - 1]
                    .targets as any)
                    .concat(boxes[i].targets);
                boxes[i - 1].align = 0.5;

                // Overlapping right, push left
                if ((boxes[i - 1].pos as any) + boxes[i - 1].size > len) {
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
    boxes.some(function (
        box: Highcharts.DataLabelsBoxObject
    ): (boolean|undefined) {
        var posInCompositeBox = 0;

        if ((box.targets as any).some(function (): (boolean|undefined) {
            origBoxes[i].pos = (box.pos as any) + posInCompositeBox;

            // If the distance between the position and the target exceeds
            // maxDistance, abort the loop and decrease the length in increments
            // of 10% to recursively reduce the  number of visible boxes by
            // rank. Once all boxes are within the maxDistance, we're good.
            if (
                typeof maxDistance !== 'undefined' &&
                Math.abs((origBoxes[i].pos as any) - origBoxes[i].target) > maxDistance
            ) {
                // Reset the positions that are already set
                origBoxes.slice(0, i + 1).forEach(
                    function (box: Highcharts.DataLabelsBoxObject): void {
                        delete box.pos;
                    }
                );

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

        } as any)) {
            // Exceeded maxDistance => abort
            return true;
        }
    } as any);

    // Add the rest (hidden) boxes and sort by target
    stableSort(origBoxes, sortByTarget);
};


/**
 * Draw the data labels
 *
 * @private
 * @function Highcharts.Series#drawDataLabels
 * @return {void}
 * @fires Highcharts.Series#event:afterDrawDataLabels
 */
Series.prototype.drawDataLabels = function (this: Highcharts.Series): void {
    var series = this,
        chart = series.chart,
        seriesOptions = series.options,
        seriesDlOptions = seriesOptions.dataLabels,
        points = series.points,
        pointOptions,
        hasRendered = series.hasRendered || 0,
        dataLabelsGroup: Highcharts.SVGElement,
        dataLabelAnim = (seriesDlOptions as any).animation,
        animationConfig = (seriesDlOptions as any).defer ?
            getDeferredAnimation(chart, dataLabelAnim, series) :
            { defer: 0, duration: 0 },
        renderer = chart.renderer;

    /**
     * Handle the dataLabels.filter option.
     * @private
     */
    function applyFilter(
        point: Point,
        options: Highcharts.DataLabelsOptions
    ): boolean {
        var filter = options.filter,
            op,
            prop,
            val;

        if (filter) {
            op = filter.operator;
            prop = (point as any)[filter.property];
            val = filter.value;
            if (
                (op === '>' && prop > (val as any)) ||
                (op === '<' && prop < (val as any)) ||
                (op === '>=' && prop >= (val as any)) ||
                (op === '<=' && prop <= (val as any)) ||
                (op === '==' && prop == val) || // eslint-disable-line eqeqeq
                (op === '===' && prop === val)
            ) {
                return true;
            }
            return false;
        }
        return true;
    }

    /**
     * Merge two objects that can be arrays. If one of them is an array, the
     * other is merged into each element. If both are arrays, each element is
     * merged by index. If neither are arrays, we use normal merge.
     * @private
     */
    function mergeArrays(
        one: (
            Highcharts.DataLabelsOptions|
            Array<Highcharts.DataLabelsOptions>
        ),
        two: (
            Highcharts.DataLabelsOptions|
            Array<Highcharts.DataLabelsOptions>
        )
    ): (
        Highcharts.DataLabelsOptions|
        Array<Highcharts.DataLabelsOptions>
    ) { // eslint-disable-line @typescript-eslint/indent
        var res = [] as (
                Highcharts.DataLabelsOptions|
                Array<Highcharts.DataLabelsOptions>
            ),
            i;

        if (isArray(one) && !isArray(two)) {
            res = (one as any).map(
                function (
                    el: Highcharts.DataLabelsOptions
                ): Highcharts.DataLabelsOptions {
                    return merge(el, two);
                }
            );
        } else if (isArray(two) && !isArray(one)) {
            res = (two as any).map(
                function (
                    el: Highcharts.DataLabelsOptions
                ): Highcharts.DataLabelsOptions {
                    return merge(one, el);
                }
            );
        } else if (!isArray(one) && !isArray(two)) {
            res = merge(one, two);
        } else {
            i = Math.max((one as any).length, (two as any).length);
            while (i--) {
                (res as any)[i] = merge((one as any)[i], (two as any)[i]);
            }
        }
        return res;
    }


    // Merge in plotOptions.dataLabels for series
    seriesDlOptions = mergeArrays(
        mergeArrays(
            chart.options.plotOptions &&
            chart.options.plotOptions.series &&
            chart.options.plotOptions.series.dataLabels as any,
            chart.options.plotOptions &&
            chart.options.plotOptions[series.type] &&
            (chart.options.plotOptions[series.type] as any).dataLabels as any
        ),
        seriesDlOptions as any
    );

    fireEvent(this, 'drawDataLabels');

    if (
        isArray(seriesDlOptions) ||
        (seriesDlOptions as any).enabled ||
        series._hasPointLabels
    ) {

        // Create a separate group for the data labels to avoid rotation
        dataLabelsGroup = series.plotGroup(
            'dataLabelsGroup',
            'data-labels',
            !hasRendered ? 'hidden' : 'inherit', // #5133, #10220
            (seriesDlOptions as any).zIndex || 6
        );

        dataLabelsGroup.attr({ opacity: +hasRendered }); // #3300
        if (!hasRendered) {
            var group = series.dataLabelsGroup;
            if (group) {
                if (series.visible) { // #2597, #3023, #3024
                    dataLabelsGroup.show(true);
                }
                (group[
                    seriesOptions.animation ? 'animate' : 'attr'
                ] as any)(
                    { opacity: 1 },
                    animationConfig
                );
            }
        }

        // Make the labels for each point
        points.forEach(function (point: Point): void {

            // Merge in series options for the point.
            // @note dataLabelAttribs (like pointAttribs) would eradicate
            // the need for dlOptions, and simplify the section below.
            pointOptions = splat(
                mergeArrays(
                    seriesDlOptions as any,
                    (point.dlOptions as any) || // dlOptions is used in treemaps
                        (point.options && point.options.dataLabels)
                )
            );

            // Handle each individual data label for this point
            pointOptions.forEach(function (
                labelOptions: Highcharts.DataLabelsOptions,
                i: number
            ): void {
                // Options for one datalabel
                var labelEnabled = (
                        labelOptions.enabled &&
                        // #2282, #4641, #7112, #10049
                        (!point.isNull || point.dataLabelOnNull) &&
                        applyFilter(point, labelOptions as any)
                    ),
                    labelConfig,
                    formatString,
                    labelText,
                    style,
                    rotation,
                    attr: any,
                    dataLabel = point.dataLabels ? point.dataLabels[i] :
                        point.dataLabel,
                    connector = point.connectors ? point.connectors[i] :
                        point.connector,
                    labelDistance = pick(
                        (labelOptions as any).distance,
                        (point as Highcharts.PiePoint).labelDistance
                    ),
                    isNew = !dataLabel;

                if (labelEnabled) {
                    // Create individual options structure that can be extended
                    // without affecting others
                    labelConfig = point.getLabelConfig();

                    formatString = pick(
                        (labelOptions as any)[point.formatPrefix + 'Format'],
                        labelOptions.format
                    );

                    labelText = defined(formatString) ?
                        format(formatString, labelConfig, chart) :
                        (
                            (labelOptions as any)[
                                point.formatPrefix + 'Formatter'
                            ] ||
                            labelOptions.formatter
                        ).call(labelConfig, labelOptions);

                    style = labelOptions.style;
                    rotation = labelOptions.rotation;

                    if (!chart.styledMode) {
                        // Determine the color
                        (style as any).color = pick(
                            labelOptions.color,
                            (style as any).color,
                            series.color,
                            '${palette.neutralColor100}'
                        );
                        // Get automated contrast color
                        if ((style as any).color === 'contrast') {
                            point.contrastColor = renderer.getContrast(
                                (point.color || series.color) as any
                            );
                            (style as any).color = (
                                !defined(labelDistance) &&
                                    labelOptions.inside
                            ) ||
                                labelDistance < 0 ||
                                !!seriesOptions.stacking ?
                                point.contrastColor :
                                '${palette.neutralColor100}';
                        } else {
                            delete point.contrastColor;
                        }
                        if (seriesOptions.cursor) {
                            (style as any).cursor = seriesOptions.cursor;
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
                    objectEach(attr, function (val: any, name: string): void {
                        if (typeof val === 'undefined') {
                            delete attr[name];
                        }
                    });
                }

                // If the point is outside the plot area, destroy it. #678, #820
                if (dataLabel && (!labelEnabled || !defined(labelText))) {
                    point.dataLabel =
                        point.dataLabel && point.dataLabel.destroy();
                    if (point.dataLabels) {
                        // Remove point.dataLabels if this was the last one
                        if (point.dataLabels.length === 1) {
                            delete point.dataLabels;
                        } else {
                            delete point.dataLabels[i];
                        }
                    }
                    if (!i) {
                        delete point.dataLabel;
                    }
                    if (connector) {
                        point.connector = (point.connector as any).destroy();
                        if (point.connectors) {
                            // Remove point.connectors if this was the last one
                            if (point.connectors.length === 1) {
                                delete point.connectors;
                            } else {
                                delete point.connectors[i];
                            }
                        }
                    }

                // Individual labels are disabled if the are explicitly disabled
                // in the point options, or if they fall outside the plot area.
                } else if (labelEnabled && defined(labelText)) {

                    if (!dataLabel) {
                        // Create new label element
                        point.dataLabels = point.dataLabels || [];
                        dataLabel = point.dataLabels[i] = rotation ?

                            // Labels don't rotate, use text element
                            renderer.text(
                                labelText,
                                0,
                                -9999,
                                labelOptions.useHTML)
                                .addClass('highcharts-data-label') :

                            // We can use label
                            renderer.label(
                                labelText,
                                0,
                                -9999,
                                labelOptions.shape as any,
                                null as any,
                                null as any,
                                labelOptions.useHTML,
                                null as any,
                                'data-label'
                            );

                        // Store for backwards compatibility
                        if (!i) {
                            point.dataLabel = dataLabel;
                        }

                        dataLabel.addClass(
                            ' highcharts-data-label-color-' + point.colorIndex +
                            ' ' + (labelOptions.className || '') +
                            ( // #3398
                                labelOptions.useHTML ?
                                    ' highcharts-tracker' :
                                    ''
                            )
                        );
                    } else {
                        // Use old element and just update text
                        attr.text = labelText;
                    }

                    // Store data label options for later access
                    dataLabel.options = labelOptions;

                    dataLabel.attr(attr);

                    if (!chart.styledMode) {
                        // Styles must be applied before add in order to read
                        // text bounding box
                        dataLabel.css(style as any).shadow(labelOptions.shadow);
                    }

                    if (!dataLabel.added) {
                        dataLabel.add(dataLabelsGroup);
                    }

                    if (labelOptions.textPath && !labelOptions.useHTML) {
                        dataLabel.setTextPath(
                            (
                                point.getDataLabelPath &&
                                point.getDataLabelPath(dataLabel)
                            ) || point.graphic,
                            labelOptions.textPath
                        );

                        if (
                            point.dataLabelPath &&
                            !labelOptions.textPath.enabled
                        ) {
                            // clean the DOM
                            point.dataLabelPath = point.dataLabelPath.destroy();
                        }
                    }

                    // Now the data label is created and placed at 0,0, so we
                    // need to align it
                    series.alignDataLabel(
                        point, dataLabel, labelOptions, null as any, isNew
                    );
                }
            });
        });
    }

    fireEvent(this, 'afterDrawDataLabels');
};

/**
 * Align each individual data label.
 *
 * @private
 * @function Highcharts.Series#alignDataLabel
 * @param {Highcharts.Point} point
 * @param {Highcharts.SVGElement} dataLabel
 * @param {Highcharts.DataLabelsOptions} options
 * @param {Highcharts.BBoxObject} alignTo
 * @param {boolean} [isNew]
 * @return {void}
 */
Series.prototype.alignDataLabel = function (
    this: Highcharts.Series,
    point: Point,
    dataLabel: SVGElement,
    options: Highcharts.DataLabelsOptions,
    alignTo: Highcharts.BBoxObject,
    isNew?: boolean
): void {
    var series = this,
        chart = this.chart,
        inverted = this.isCartesian && chart.inverted,
        enabledDataSorting = this.enabledDataSorting,
        plotX = pick(
            point.dlBox && (point.dlBox as any).centerX,
            point.plotX,
            -9999
        ),
        plotY = pick(point.plotY, -9999),
        bBox = dataLabel.getBBox(),
        baseline,
        rotation = options.rotation,
        normRotation,
        negRotation,
        align = options.align,
        rotCorr, // rotation correction
        isInsidePlot = chart.isInsidePlot(plotX, Math.round(plotY), inverted),
        // Math.round for rounding errors (#2683), alignTo to allow column
        // labels (#2700)
        alignAttr, // the final position;
        justify = pick(
            options.overflow,
            (enabledDataSorting ? 'none' : 'justify')
        ) === 'justify',
        visible =
            this.visible &&
            point.visible !== false &&
            (
                point.series.forceDL ||
                (enabledDataSorting && !justify) ||
                isInsidePlot ||
                (
                    // If the data label is inside the align box, it is enough
                    // that parts of the align box is inside the plot area
                    // (#12370)
                    options.inside && alignTo && chart.isInsidePlot(
                        plotX,
                        inverted ?
                            alignTo.x + 1 :
                            alignTo.y + alignTo.height - 1,
                        inverted
                    )
                )
            ),
        setStartPos = function (alignOptions: Highcharts.AlignObject): void {
            if (enabledDataSorting && series.xAxis && !justify) {
                series.setDataLabelStartPos(
                    point as Highcharts.ColumnPoint,
                    dataLabel,
                    isNew,
                    isInsidePlot,
                    alignOptions
                );
            }
        };

    if (visible) {

        baseline = chart.renderer.fontMetrics(
            chart.styledMode ? void 0 : (options.style as any).fontSize,
            dataLabel
        ).b;

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
                x: (
                    alignTo.x +
                    (options.x || 0) +
                    alignTo.width / 2 +
                    rotCorr.x
                ),
                y: (
                    alignTo.y +
                    (options.y || 0) +
                    ({ top: 0, middle: 0.5, bottom: 1 } as any)[
                        options.verticalAlign as any
                    ] *
                    alignTo.height
                )
            };
            setStartPos(alignAttr); // data sorting
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
            setStartPos(alignTo); // data sorting
            dataLabel.align(options as any, null as any, alignTo);
            alignAttr = dataLabel.alignAttr;
        }

        // Handle justify or crop
        if (justify && alignTo.height >= 0) { // #8830
            this.justifyDataLabel(
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
                anchorX: inverted ?
                    chart.plotWidth - (point.plotY as any) :
                    point.plotX,
                anchorY: inverted ?
                    chart.plotHeight - (point.plotX as any) :
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
};

/**
 * Set starting position for data label sorting animation.
 *
 * @private
 * @function Highcharts.Series#setDataLabelStartPos
 * @param {Highcharts.SVGElement} dataLabel
 * @param {Highcharts.ColumnPoint} point
 * @param {boolean | undefined} [isNew]
 * @param {boolean} [isInside]
 * @param {Highcharts.AlignObject} [alignOptions]
 *
 * @return {void}
 */
Series.prototype.setDataLabelStartPos = function (
    this: Highcharts.Series,
    point: Highcharts.ColumnPoint,
    dataLabel: Highcharts.SVGElement,
    isNew: boolean,
    isInside: boolean,
    alignOptions: Highcharts.AlignObject
): void {
    var chart = this.chart,
        inverted = chart.inverted,
        xAxis = this.xAxis,
        reversed = xAxis.reversed,
        labelCenter = inverted ? dataLabel.height / 2 : dataLabel.width / 2,
        pointWidth = point.pointWidth,
        halfWidth = pointWidth ? pointWidth / 2 : 0,
        startXPos,
        startYPos;

    startXPos = inverted ?
        alignOptions.x :
        (reversed ?
            -labelCenter - halfWidth :
            xAxis.width - labelCenter + halfWidth
        );

    startYPos = inverted ?
        (reversed ?
            this.yAxis.height - labelCenter + halfWidth :
            -labelCenter - halfWidth
        ) : alignOptions.y;

    dataLabel.startXPos = startXPos;
    dataLabel.startYPos = startYPos;

    // We need to handle visibility in case of sorting point outside plot area
    if (!isInside) {
        dataLabel
            .attr({ opacity: 1 })
            .animate(
                { opacity: 0 },
                void 0,
                dataLabel.hide
            );

    } else if (dataLabel.visibility === 'hidden') {
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
};

/**
 * If data labels fall partly outside the plot area, align them back in, in a
 * way that doesn't hide the point.
 *
 * @private
 * @function Highcharts.Series#justifyDataLabel
 * @param {Highcharts.SVGElement} dataLabel
 * @param {Highcharts.DataLabelsOptions} options
 * @param {Highcharts.SVGAttributes} alignAttr
 * @param {Highcharts.BBoxObject} bBox
 * @param {Highcharts.BBoxObject} [alignTo]
 * @param {boolean} [isNew]
 * @return {boolean|undefined}
 */
Series.prototype.justifyDataLabel = function (
    this: Highcharts.Series,
    dataLabel: Highcharts.SVGElement,
    options: Highcharts.DataLabelsOptions,
    alignAttr: Highcharts.SVGAttributes,
    bBox: Highcharts.BBoxObject,
    alignTo?: Highcharts.BBoxObject,
    isNew?: boolean
): (boolean|undefined) {
    var chart = this.chart,
        align = options.align,
        verticalAlign = options.verticalAlign,
        off,
        justified,
        padding = dataLabel.box ? 0 : (dataLabel.padding || 0);

    let { x = 0, y = 0 } = options;

    // Off left
    off = alignAttr.x + padding;
    if (off < 0) {
        if (align === 'right' && x >= 0) {
            options.align = 'left';
            options.inside = true;
        } else {
            x -= off;
        }
        justified = true;
    }

    // Off right
    off = alignAttr.x + bBox.width - padding;
    if (off > chart.plotWidth) {
        if (align === 'left' && x <= 0) {
            options.align = 'right';
            options.inside = true;
        } else {
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
        } else {
            y -= off;
        }
        justified = true;
    }

    // Off bottom
    off = alignAttr.y + bBox.height - padding;
    if (off > chart.plotHeight) {
        if (verticalAlign === 'top' && y <= 0) {
            options.verticalAlign = 'bottom';
            options.inside = true;
        } else {
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
};

if (seriesTypes.pie) {
    seriesTypes.pie.prototype.dataLabelPositioners = {

        // Based on the value computed in Highcharts' distribute algorithm.
        radialDistributionY: function (point: Highcharts.PiePoint): number {
            return point.top + (point.distributeBox as any).pos;
        },
        // get the x - use the natural x position for labels near the
        // top and bottom, to prevent the top and botton slice
        // connectors from touching each other on either side

        // Based on the value computed in Highcharts' distribute algorithm.
        radialDistributionX: function (
            series: Highcharts.PieSeries,
            point: Highcharts.PiePoint,
            y: number,
            naturalY: number
        ): number {
            return series.getX(
                y < (point.top as any) + 2 || y > (point.bottom as any) - 2 ?
                    naturalY :
                    y,
                point.half as any,
                point
            );
        },

        // dataLabels.distance determines the x position of the label
        justify: function (
            point: Highcharts.PiePoint,
            radius: number,
            seriesCenter: Array<number>
        ): number {
            return seriesCenter[0] + (point.half ? -1 : 1) *
            (radius + (point.labelDistance as any));
        },

        // Left edges of the left-half labels touch the left edge of the plot
        // area. Right edges of the right-half labels touch the right edge of
        // the plot area.
        alignToPlotEdges: function (
            dataLabel: Highcharts.SVGElement,
            half: boolean,
            plotWidth: number,
            plotLeft: number
        ): number {
            var dataLabelWidth = dataLabel.getBBox().width;

            return half ? dataLabelWidth + plotLeft :
                plotWidth - dataLabelWidth - plotLeft;
        },

        // Connectors of each side end in the same x position. Labels are
        // aligned to them. Left edge of the widest left-half label touches the
        // left edge of the plot area. Right edge of the widest right-half label
        // touches the right edge of the plot area.
        alignToConnectors: function (
            points: Array<Highcharts.PiePoint>,
            half: boolean,
            plotWidth: number,
            plotLeft: number
        ): number {
            var maxDataLabelWidth = 0,
                dataLabelWidth;

            // find widest data label
            points.forEach(function (point: Highcharts.PiePoint): void {
                dataLabelWidth = (point.dataLabel as any).getBBox().width;
                if (dataLabelWidth > maxDataLabelWidth) {
                    maxDataLabelWidth = dataLabelWidth;
                }
            });
            return half ? maxDataLabelWidth + plotLeft :
                plotWidth - maxDataLabelWidth - plotLeft;
        }
    };

    /**
     * Override the base drawDataLabels method by pie specific functionality
     *
     * @private
     * @function Highcharts.seriesTypes.pie#drawDataLabels
     * @return {void}
     */
    seriesTypes.pie.prototype.drawDataLabels = function (
        this: Highcharts.PieSeries
    ): void {
        var series = this,
            data = series.data,
            point,
            chart = series.chart,
            options = series.options.dataLabels || {},
            connectorPadding = (options as any).connectorPadding,
            connectorWidth,
            plotWidth = chart.plotWidth,
            plotHeight = chart.plotHeight,
            plotLeft = chart.plotLeft,
            maxWidth = Math.round(chart.chartWidth / 3),
            connector,
            seriesCenter = series.center,
            radius = seriesCenter[2] / 2,
            centerY = seriesCenter[1],
            dataLabel,
            dataLabelWidth,
            // labelPos,
            labelPosition,
            labelHeight: number,
            // divide the points into right and left halves for anti collision
            halves = [
                [], // right
                [] // left
            ] as [Array<Highcharts.PiePoint>, Array<Highcharts.PiePoint>],
            x,
            y,
            visibility,
            j,
            overflow = [0, 0, 0, 0], // top, right, bottom, left
            dataLabelPositioners = series.dataLabelPositioners,
            pointDataLabelsOptions;

        // get out if not enabled
        if (!series.visible ||
            (!(options as any).enabled &&
            !series._hasPointLabels)
        ) {
            return;
        }

        // Reset all labels that have been shortened
        data.forEach(function (point: Highcharts.PiePoint): void {
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

        data.forEach(function (point: Highcharts.PiePoint): void {
            if (point.dataLabel) {

                if (point.visible) { // #407, #2510

                    // Arrange points for detection collision
                    halves[point.half as any].push(point);

                    // Reset positions (#4905)
                    point.dataLabel._pos = null;

                    // Avoid long labels squeezing the pie size too far down
                    if (!defined((options as any).style.width) &&
                        !defined(
                            point.options.dataLabels &&
                            (point.options.dataLabels as any).style &&
                            (point.options.dataLabels as any).style.width
                        )
                    ) {
                        if (point.dataLabel.getBBox().width > maxWidth) {
                            point.dataLabel.css({
                                // Use a fraction of the maxWidth to avoid
                                // wrapping close to the end of the string.
                                width: Math.round(maxWidth * 0.7) + 'px'
                            });
                            point.dataLabel.shortened = true;
                        }
                    }
                } else {
                    point.dataLabel = point.dataLabel.destroy();
                    // Workaround to make pies destroy multiple datalabels
                    // correctly. This logic needs rewriting to support multiple
                    // datalabels fully.
                    if (point.dataLabels && point.dataLabels.length === 1) {
                        delete point.dataLabels;
                    }
                }
            }
        });

        /* Loop over the points in each half, starting from the top and bottom
         * of the pie to detect overlapping labels.
         */
        halves.forEach(function (
            points: Array<Highcharts.PiePoint>,
            i: number
        ): void {

            var top,
                bottom,
                length = points.length,
                positions =
                    [] as Array<Highcharts.DataLabelsBoxObject>,
                naturalY,
                sideOverflow,
                size: any,
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
                points.forEach(function (point: Highcharts.PiePoint): void {
                    // check if specific points' label is outside the pie
                    if ((point.labelDistance as any) > 0 && point.dataLabel) {
                        // point.top depends on point.labelDistance value
                        // Used for calculation of y value in getX method
                        point.top = Math.max(
                            0,
                            centerY - radius - (point.labelDistance as any)
                        );
                        point.bottom = Math.min(
                            centerY + radius + (point.labelDistance as any),
                            chart.plotHeight
                        );
                        size = point.dataLabel.getBBox().height || 21;

                        // point.positionsIndex is needed for getting index of
                        // parameter related to specific point inside positions
                        // array - not every point is in positions array.
                        point.distributeBox = {
                            target: (point.labelPosition as any).natural.y -
                                point.top + size / 2,
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
                // labelPos = point.labelPos;
                labelPosition = point.labelPosition;
                dataLabel = point.dataLabel;
                visibility = point.visible === false ? 'hidden' : 'inherit';
                naturalY = (labelPosition as any).natural.y;
                y = naturalY;

                if (positions && defined(point.distributeBox)) {
                    if (
                        typeof (point.distributeBox as any).pos === 'undefined'
                    ) {
                        visibility = 'hidden';
                    } else {
                        labelHeight = (point.distributeBox as any).size;
                        // Find label's y position
                        y = (dataLabelPositioners as any)
                            .radialDistributionY(point);
                    }
                }

                // It is needed to delete point.positionIndex for
                // dynamically added points etc.

                delete point.positionIndex; // @todo unused

                // Find label's x position
                // justify is undocumented in the API - preserve support for it
                if ((options as any).justify) {
                    x = (dataLabelPositioners as any).justify(
                        point,
                        radius,
                        seriesCenter
                    );
                } else {
                    switch ((options as any).alignTo) {
                    case 'connectors':
                        x = (dataLabelPositioners as any).alignToConnectors(
                            points,
                            i as any,
                            plotWidth,
                            plotLeft
                        );
                        break;
                    case 'plotEdges':
                        x = (dataLabelPositioners as any).alignToPlotEdges(
                            dataLabel as any,
                            i as any,
                            plotWidth,
                            plotLeft
                        );
                        break;
                    default:
                        x = (dataLabelPositioners as any).radialDistributionX(
                            series,
                            point,
                            y,
                            naturalY
                        );
                    }
                }

                // Record the placement and visibility
                (dataLabel as any)._attr = {
                    visibility: visibility,
                    align: (labelPosition as any).alignment
                };

                pointDataLabelsOptions = point.options.dataLabels || {};

                (dataLabel as any)._pos = {
                    x: (
                        x +
                        pick(pointDataLabelsOptions.x, options.x) + // (#12985)
                        (({
                            left: connectorPadding,
                            right: -connectorPadding
                        } as any)[(labelPosition as any).alignment] || 0)
                    ),

                    // 10 is for the baseline (label vs text)
                    y: (
                        y +
                        pick(pointDataLabelsOptions.y, options.y) - // (#12985)
                        10
                    )
                };
                // labelPos.x = x;
                // labelPos.y = y;
                (labelPosition as any).final.x = x;
                (labelPosition as any).final.y = y;

                // Detect overflowing data labels
                if (pick((options as any).crop, true)) {
                    dataLabelWidth = (dataLabel as any).getBBox().width;

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
                    (dataLabel as any).sideOverflow = sideOverflow;
                }
            } // for each point
        }); // for each half

        // Do not apply the final placement and draw the connectors until we
        // have verified that labels are not spilling over.
        if (arrayMax(overflow) === 0 ||
            (this.verifyDataLabelOverflow as any)(overflow)
        ) {

            // Place the labels in the final position
            (this.placeDataLabels as any)();


            this.points.forEach(function (point: Highcharts.PiePoint): void {
                // #8864: every connector can have individual options
                pointDataLabelsOptions =
                    merge(options, point.options.dataLabels);
                connectorWidth =
                    pick((pointDataLabelsOptions as any).connectorWidth, 1);

                // Draw the connector
                if (connectorWidth) {
                    var isNew;

                    connector = point.connector;
                    dataLabel = point.dataLabel;

                    if (dataLabel &&
                        dataLabel._pos &&
                        point.visible &&
                        (point.labelDistance as any) > 0
                    ) {
                        visibility = dataLabel._attr.visibility;

                        isNew = !connector;

                        if (isNew) {
                            point.connector = connector = chart.renderer
                                .path()
                                .addClass(
                                    'highcharts-data-label-connector ' +
                                    ' highcharts-color-' + point.colorIndex +
                                    (
                                        point.className ?
                                            ' ' + point.className :
                                            ''
                                    )
                                )
                                .add(series.dataLabelsGroup);


                            if (!chart.styledMode) {
                                connector.attr({
                                    'stroke-width': connectorWidth,
                                    'stroke': (
                                        (
                                            pointDataLabelsOptions as any
                                        ).connectorColor ||
                                        point.color ||
                                        '${palette.neutralColor60}'
                                    )
                                });
                            }
                        }
                        (connector as any)[isNew ? 'attr' : 'animate']({
                            d: point.getConnectorPath()
                        });
                        (connector as any).attr('visibility', visibility);

                    } else if (connector) {
                        point.connector = connector.destroy();
                    }
                }
            });
        }
    };

    /**
     * Extendable method for getting the path of the connector between the data
     * label and the pie slice.
     *
     * @private
     * @function Highcharts.seriesTypes.pie#connectorPath
     *
     * @param {*} labelPos
     *
     * @return {Highcharts.SVGPathArray}
     */
    // TODO: depracated - remove it
    /*
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
    */


    /**
     * Perform the final placement of the data labels after we have verified
     * that they fall within the plot area.
     *
     * @private
     * @function Highcharts.seriesTypes.pie#placeDataLabels
     * @return {void}
     */
    seriesTypes.pie.prototype.placeDataLabels = function (
        this: Highcharts.PieSeries
    ): void {
        this.points.forEach(function (point: Point): void {
            var dataLabel = point.dataLabel,
                _pos;

            if (dataLabel && point.visible) {
                _pos = dataLabel._pos;
                if (_pos) {

                    // Shorten data labels with ellipsis if they still overflow
                    // after the pie has reached minSize (#223).
                    if (dataLabel.sideOverflow) {
                        dataLabel._attr.width =
                            Math.max(dataLabel.getBBox().width -
                            dataLabel.sideOverflow, 0);

                        dataLabel.css({
                            width: dataLabel._attr.width + 'px',
                            textOverflow: (
                                ((this.options.dataLabels as any).style || {})
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
            // Clear for update
            delete point.distributeBox;
        }, this);
    };

    seriesTypes.pie.prototype.alignDataLabel = noop as any;

    /**
     * Verify whether the data labels are allowed to draw, or we should run more
     * translation and data label positioning to keep them inside the plot area.
     * Returns true when data labels are ready to draw.
     *
     * @private
     * @function Highcharts.seriesTypes.pie#verifyDataLabelOverflow
     * @param {Array<number>} overflow
     * @return {boolean}
     */
    seriesTypes.pie.prototype.verifyDataLabelOverflow = function (
        this: Highcharts.PieSeries,
        overflow: Array<number>
    ): boolean {

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
            if ((centerOption as any)[0] !== null) { // Fixed center
                newSize = Math.max(center[2] -
                    Math.max(overflow[1], overflow[3]), minSize as any);

            } else { // Auto center
                newSize = Math.max(
                    // horizontal overflow
                    center[2] - overflow[1] - overflow[3],
                    minSize as any
                );
                // horizontal center
                center[0] += (overflow[3] - overflow[1]) / 2;
            }

            // Handle vertical size and center
            if ((centerOption as any)[1] !== null) { // Fixed center
                newSize = clamp(
                    newSize,
                    minSize as any,
                    center[2] - Math.max(overflow[0], overflow[2])
                );
            } else { // Auto center
                newSize = clamp(
                    newSize,
                    minSize as any,
                    // vertical overflow
                    center[2] - overflow[0] - overflow[2]
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
     * @private
     * @function Highcharts.seriesTypes.column#alignDataLabel
     * @param {Highcharts.Point} point
     * @param {Highcharts.SVGElement} dataLabel
     * @param {Highcharts.DataLabelsOptions} options
     * @param {Highcharts.BBoxObject} alignTo
     * @param {boolean} [isNew]
     * @return {void}
     */
    seriesTypes.column.prototype.alignDataLabel = function (
        this: Highcharts.ColumnSeries,
        point: Point,
        dataLabel: SVGElement,
        options: Highcharts.DataLabelsOptions,
        alignTo: Highcharts.BBoxObject,
        isNew?: boolean
    ): void {
        var inverted = this.chart.inverted,
            series = point.series,
            // data label box for alignment
            dlBox = point.dlBox || point.shapeArgs,
            below = pick(
                (point as Highcharts.AreaRangePoint).below, // range series
                (point.plotY as any) >
                    pick(this.translatedThreshold, series.yAxis.len)
            ),
            // draw it inside the box?
            inside = pick(options.inside, !!this.options.stacking),
            overshoot;

        // Align to the column itself, or the top of it
        if (dlBox) { // Area range uses this method but not alignTo
            alignTo = merge(dlBox) as any;
            if (alignTo.y < 0) {
                alignTo.height += alignTo.y;
                alignTo.y = 0;
            }

            // If parts of the box overshoots outside the plot area, modify the
            // box to center the label inside
            overshoot = alignTo.y + alignTo.height - series.yAxis.len;
            if (overshoot > 0 && overshoot < alignTo.height) {
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
        if (options.inside && point.contrastColor) {
            dataLabel.css({
                color: point.contrastColor
            });
        }
    };
}
