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

import type AlignObject from '../Renderer/AlignObject';
import type BBoxObject from '../Renderer/BBoxObject';
import type ColorString from '../Color/ColorString';
import type ColumnPoint from '../../Series/Column/ColumnPoint';
import type DataLabelOptions from './DataLabelOptions';
import type Point from './Point';
import type Series from './Series';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';
import type SVGElement from '../Renderer/SVG/SVGElement';
import type SVGLabel from '../Renderer/SVG/SVGLabel';

import A from '../Animation/AnimationUtilities.js';
const { getDeferredAnimation } = A;
import F from '../FormatUtilities.js';
const { format } = F;
import { Palette } from '../Color/Palettes.js';
import R from '../Renderer/RendererUtilities.js';
import U from '../Utilities.js';
const {
    defined,
    extend,
    fireEvent,
    isArray,
    isString,
    merge,
    objectEach,
    pick,
    splat
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module './PointLike' {
    interface PointLike {
        bottom?: number;
        connector?: SVGElement;
        connectors?: Array<SVGElement>;
        contrastColor?: ColorString;
        dataLabel?: SVGLabel;
        dataLabelOnNull?: boolean;
        dataLabelPath?: SVGElement;
        dataLabels?: Array<SVGElement>;
        distributeBox?: R.BoxObject;
        dlBox?: BBoxObject;
        dlOptions?: DataLabelOptions;
        /** @deprecated */
        positionIndex?: unknown;
        top?: number;
        getDataLabelPath(dataLabel: SVGElement): SVGElement;
    }
}

declare module './PointOptions' {
    interface PointOptions {
        dataLabels?: (DataLabelOptions|Array<DataLabelOptions>);
        labelrank?: number;
    }
}

declare module './SeriesLike' {
    interface SeriesLike {
        _hasPointLabels?: boolean;
        dataLabelsGroup?: SVGElement;
        dataLabelPositioners?: DataLabel.PositionersObject;
        alignDataLabel(
            point: Point,
            dataLabel: SVGElement,
            options: DataLabelOptions,
            alignTo: BBoxObject,
            isNew?: boolean
        ): void;
        drawDataLabels(points?:Array<Point>): void;
        justifyDataLabel(
            dataLabel: SVGElement,
            options: DataLabelOptions,
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
}

declare module './SeriesOptions' {
    interface SeriesOptions {
        dataLabels?: (DataLabelOptions|Array<DataLabelOptions>);
    }
}

/* *
 *
 *  Composition
 *
 * */

/* eslint-disable valid-jsdoc */

namespace DataLabel {

    /* *
     *
     *  Declarations
     *
     * */

    export interface PositionersObject {
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

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

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
    function alignDataLabel(
        this: Series,
        point: Point,
        dataLabel: SVGElement,
        options: DataLabelOptions,
        alignTo: BBoxObject,
        isNew?: boolean
    ): void {
        const series = this,
            chart = this.chart,
            inverted = this.isCartesian && chart.inverted,
            enabledDataSorting = this.enabledDataSorting,
            plotX = point.plotX,
            plotY = point.plotY,
            rotation = options.rotation,
            align = options.align,
            isInsidePlot = defined(plotX) &&
                defined(plotY) &&
                chart.isInsidePlot(
                    plotX,
                    Math.round(plotY),
                    {
                        inverted,
                        paneCoordinates: true,
                        series
                    }
                ),
            setStartPos = (alignOptions: AlignObject): void => {
                if (enabledDataSorting && series.xAxis && !justify) {
                    series.setDataLabelStartPos(
                        point as ColumnPoint,
                        dataLabel,
                        isNew,
                        isInsidePlot,
                        alignOptions
                    );
                }
            };

        let baseline,
            rotCorr, // rotation correction
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
                defined(plotX) &&
                (
                    point.series.forceDL ||
                    (enabledDataSorting && !justify) ||
                    isInsidePlot ||
                    (
                        // If the data label is inside the align box, it is
                        // enough that parts of the align box is inside the
                        // plot area (#12370). When stacking, it is always
                        // inside regardless of the option (#15148).
                        pick(options.inside, !!this.options.stacking) &&
                        alignTo &&
                        chart.isInsidePlot(
                            plotX,
                            inverted ?
                                alignTo.x + 1 :
                                alignTo.y + alignTo.height - 1,
                            {
                                inverted,
                                paneCoordinates: true,
                                series
                            }
                        )
                    )
                );

        const pos = point.pos();
        if (visible && pos) {

            if (rotation) {
                dataLabel.attr({ align });
            }
            let bBox = dataLabel.getBBox(true),
                bBoxCorrection = [0, 0];

            baseline = chart.renderer.fontMetrics(
                chart.styledMode ? void 0 : (options.style as any).fontSize,
                dataLabel
            ).b;

            // The alignment box is a singular point
            alignTo = extend({
                x: pos[0],
                y: Math.round(pos[1]),
                width: 0,
                height: 0
            }, alignTo);

            // Add the text size for alignment calculation
            extend<DataLabelOptions|BBoxObject>(options, {
                width: bBox.width,
                height: bBox.height
            });

            // Allow a hook for changing alignment in the last moment, then do
            // the alignment
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

                bBoxCorrection = [
                    bBox.x - Number(dataLabel.attr('x')),
                    bBox.y - Number(dataLabel.attr('y'))
                ];
                setStartPos(alignAttr); // data sorting
                dataLabel[isNew ? 'attr' : 'animate'](alignAttr);

            } else {
                setStartPos(alignTo); // data sorting
                dataLabel.align(options, void 0, alignTo);
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

                let { x, y } = alignAttr;
                x += bBoxCorrection[0];
                y += bBoxCorrection[1];

                // Uncomment this block to visualize the bounding boxes used for
                // determining visibility
                /*
                chart.renderer.rect(
                    chart.plotLeft + alignAttr.x + bBox.x,
                    chart.plotTop + alignAttr.y + bBox.y + 9999,
                    bBox.width,
                    bBox.height
                ).attr({
                    stroke: 'rgba(0, 0, 0, 0.3)',
                    'stroke-width': 0.5
                }).add();
                chart.renderer.circle(
                    chart.plotLeft + alignAttr.x,
                    chart.plotTop + alignAttr.y,
                    2
                ).attr({
                    fill: 'red',
                    zIndex: 20
                }).add();
                // */

                visible =
                    chart.isInsidePlot(
                        x,
                        y,
                        {
                            paneCoordinates: true,
                            series
                        }
                    ) &&
                    chart.isInsidePlot(
                        x + bBox.width,
                        y + bBox.height,
                        {
                            paneCoordinates: true,
                            series
                        }
                    );
            }

            // When we're using a shape, make it possible with a connector or an
            // arrow pointing to thie point
            if (options.shape && !rotation) {
                dataLabel[isNew ? 'attr' : 'animate']({
                    anchorX: pos[0],
                    anchorY: pos[1]
                });
            }
        }
        // To use alignAttr property in hideOverlappingLabels
        if (isNew && enabledDataSorting) {
            dataLabel.placed = false;
        }
        // Show or hide based on the final aligned position
        if (!visible && (!enabledDataSorting || justify)) {
            dataLabel.hide();
            dataLabel.placed = false; // don't animate back in
        } else {
            dataLabel.show();
        }
    }

    /**
     * Handle the dataLabels.filter option.
     * @private
     */
    function applyFilter(
        point: Point,
        options: DataLabelOptions
    ): boolean {
        const filter = options.filter;

        if (filter) {
            const op = filter.operator;
            const prop = (point as any)[filter.property];
            const val = filter.value;
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
     * @private
     */
    export function compose(SeriesClass: typeof Series): void {
        if (composedClasses.indexOf(SeriesClass) === -1) {
            const seriesProto = SeriesClass.prototype;

            composedClasses.push(SeriesClass);

            seriesProto.alignDataLabel = alignDataLabel;
            seriesProto.drawDataLabels = drawDataLabels;
            seriesProto.justifyDataLabel = justifyDataLabel;
            seriesProto.setDataLabelStartPos = setDataLabelStartPos;
        }
    }

    /**
     * Draw the data labels
     * @private
     */
    function drawDataLabels(
        this: Series,
        points: Array<Point> = this.points
    ): void {
        const series = this,
            chart = series.chart,
            seriesOptions = series.options,
            hasRendered = series.hasRendered || 0,
            renderer = chart.renderer,
            { backgroundColor, plotBackgroundColor } = chart.options.chart,
            contrastColor = renderer.getContrast(
                (isString(plotBackgroundColor) && plotBackgroundColor) ||
                (isString(backgroundColor) && backgroundColor) ||
                Palette.neutralColor100
            );

        let seriesDlOptions = seriesOptions.dataLabels,
            pointOptions: Array<DataLabelOptions&AnyRecord>,
            dataLabelsGroup: SVGElement;

        const firstDLOptions = splat(seriesDlOptions)[0],
            dataLabelAnim = firstDLOptions.animation,
            animationConfig = firstDLOptions.defer ?
                getDeferredAnimation(chart, dataLabelAnim, series) :
                { defer: 0, duration: 0 };

        // Merge in plotOptions.dataLabels for series
        seriesDlOptions = mergeArrays(
            mergeArrays(
                chart.options.plotOptions &&
                chart.options.plotOptions.series &&
                chart.options.plotOptions.series.dataLabels as any,
                chart.options.plotOptions &&
                chart.options.plotOptions[series.type] &&
                (
                    chart.options.plotOptions[series.type] as any
                ).dataLabels as any
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
                const group = series.dataLabelsGroup;
                if (group) {
                    if (series.visible) { // #2597, #3023, #3024
                        dataLabelsGroup.show();
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
            points.forEach((point): void => {

                // Merge in series options for the point.
                // @note dataLabelAttribs (like pointAttribs) would eradicate
                // the need for dlOptions, and simplify the section below.
                pointOptions = splat(
                    mergeArrays(
                        seriesDlOptions as any,
                        // dlOptions is used in treemaps
                        (
                            (point.dlOptions as any) ||
                            (point.options && point.options.dataLabels)
                        )
                    )
                );

                // Handle each individual data label for this point
                pointOptions.forEach((labelOptions, i): void => {
                    // Options for one datalabel
                    const labelEnabled = (
                            labelOptions.enabled &&
                            // #2282, #4641, #7112, #10049
                            (!point.isNull || point.dataLabelOnNull) &&
                            applyFilter(point, labelOptions)
                        ),
                        connector = point.connectors ?
                            point.connectors[i] :
                            point.connector;

                    let labelConfig,
                        formatString,
                        labelText,
                        style,
                        rotation,
                        attr: any,
                        dataLabel: SVGLabel = point.dataLabels ?
                            point.dataLabels[i] : point.dataLabel as any,
                        isNew = !dataLabel;

                    const labelDistance = pick(
                        labelOptions.distance,
                        point.labelDistance
                    );

                    if (labelEnabled) {
                        // Create individual options structure that can be
                        // extended without affecting others
                        labelConfig = point.getLabelConfig();

                        formatString = pick(
                            (labelOptions as any)[
                                point.formatPrefix + 'Format'
                            ],
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
                                Palette.neutralColor100
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
                                    contrastColor;
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
                            const {
                                backgroundColor,
                                borderColor
                            } = labelOptions;
                            attr.fill = backgroundColor === 'auto' ?
                                point.color :
                                backgroundColor;
                            attr.stroke = borderColor === 'auto' ?
                                point.color :
                                borderColor;
                            attr['stroke-width'] = labelOptions.borderWidth;
                        }

                        // Remove unused attributes (#947)
                        objectEach(attr, function (
                            val: any,
                            name: string
                        ): void {
                            if (typeof val === 'undefined') {
                                delete attr[name];
                            }
                        });
                    }

                    // If the point is outside the plot area, destroy it. #678,
                    // #820
                    if (
                        dataLabel && (
                            !labelEnabled ||
                            !defined(labelText) ||
                            !!dataLabel.div !== !!labelOptions.useHTML ||
                            (
                                // Change from no rotation to rotation and
                                // vice versa. Don't use defined() because
                                // rotation = 0 means also rotation = undefined
                                (
                                    !dataLabel.rotation ||
                                    !labelOptions.rotation
                                ) &&
                                dataLabel.rotation !== labelOptions.rotation
                            )
                        )
                    ) {
                        isNew = true;
                        point.dataLabel = dataLabel =
                            point.dataLabel && point.dataLabel.destroy() as any;
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
                            point.connector = (
                                point.connector as any
                            ).destroy();
                            if (point.connectors) {
                                // Remove point.connectors if this was the last
                                // one
                                if (point.connectors.length === 1) {
                                    delete point.connectors;
                                } else {
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
                                renderer.text(
                                    labelText,
                                    0,
                                    0,
                                    labelOptions.useHTML)
                                    .addClass('highcharts-data-label') as any :

                                // We can use label
                                renderer.label(
                                    labelText,
                                    0,
                                    0,
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
                                ' highcharts-data-label-color-' +
                                point.colorIndex +
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
                            // Styles must be applied before add in order to
                            // read text bounding box
                            dataLabel.css(style as any).shadow(
                                labelOptions.shadow
                            );
                        }

                        const textPathOptions =
                            labelOptions[point.formatPrefix + 'TextPath'] ||
                            labelOptions.textPath;

                        if (textPathOptions && !labelOptions.useHTML) {
                            dataLabel.setTextPath(
                                (
                                    point.getDataLabelPath &&
                                    point.getDataLabelPath(dataLabel)
                                ) || point.graphic,
                                textPathOptions
                            );

                            if (
                                point.dataLabelPath &&
                                !textPathOptions.enabled
                            ) {
                                // clean the DOM
                                point.dataLabelPath = (
                                    point.dataLabelPath.destroy()
                                );
                            }
                        }

                        if (!dataLabel.added) {
                            dataLabel.add(dataLabelsGroup);
                        }

                        // Now the data label is created and placed at 0,0, so
                        // we need to align it
                        series.alignDataLabel(
                            point, dataLabel, labelOptions, null as any, isNew
                        );
                    } else if (dataLabel) {
                        dataLabel.hide();
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
    function justifyDataLabel(
        this: Series,
        dataLabel: SVGElement,
        options: DataLabelOptions,
        alignAttr: SVGAttributes,
        bBox: BBoxObject,
        alignTo?: BBoxObject,
        isNew?: boolean
    ): (boolean|undefined) {
        const chart = this.chart,
            align = options.align,
            verticalAlign = options.verticalAlign,
            padding = dataLabel.box ? 0 : (dataLabel.padding || 0);

        let { x = 0, y = 0 } = options,
            off,
            justified;

        // Off left
        off = (alignAttr.x || 0) + padding;
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
        off = (alignAttr.x || 0) + bBox.width - padding;
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
        off = (alignAttr.y || 0) + bBox.height - padding;
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
    }

    /**
     * Merge two objects that can be arrays. If one of them is an array, the
     * other is merged into each element. If both are arrays, each element is
     * merged by index. If neither are arrays, we use normal merge.
     * @private
     */
    function mergeArrays(
        one: (DataLabelOptions|Array<DataLabelOptions>),
        two: (DataLabelOptions|Array<DataLabelOptions>)
    ): (DataLabelOptions|Array<DataLabelOptions>) {
        let res: (DataLabelOptions|Array<DataLabelOptions>) = [],
            i: number;

        if (isArray(one) && !isArray(two)) {
            res = (one as any).map(
                function (el: DataLabelOptions): DataLabelOptions {
                    return merge(el, two);
                }
            );
        } else if (isArray(two) && !isArray(one)) {
            res = (two as any).map(
                function (el: DataLabelOptions): DataLabelOptions {
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

    /**
     * Set starting position for data label sorting animation.
     * @private
     */
    function setDataLabelStartPos(
        this: Series,
        point: ColumnPoint,
        dataLabel: SVGElement,
        isNew: boolean,
        isInside: boolean,
        alignOptions: AlignObject
    ): void {
        const chart = this.chart,
            inverted = chart.inverted,
            xAxis = this.xAxis,
            reversed = xAxis.reversed,
            labelCenter = inverted ? dataLabel.height / 2 : dataLabel.width / 2,
            pointWidth = point.pointWidth,
            halfWidth = pointWidth ? pointWidth / 2 : 0;

        dataLabel.startXPos = inverted ?
            alignOptions.x :
            (reversed ?
                -labelCenter - halfWidth :
                xAxis.width - labelCenter + halfWidth
            );
        dataLabel.startYPos = inverted ?
            (reversed ?
                this.yAxis.height - labelCenter + halfWidth :
                -labelCenter - halfWidth
            ) : alignOptions.y;

        // We need to handle visibility in case of sorting point outside plot
        // area
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
    }

}

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
