/**
 *
 *  Events generator for Stock tools
 *
 *  (c) 2009-2021 Paweł Fus
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Annotation from '../Extensions/Annotations/Annotations';
import type { YAxisOptions } from '../Core/Axis/AxisOptions';
import type AxisType from '../Core/Axis/AxisType';
import type Chart from '../Core/Chart/Chart';
import type FlagsPoint from '../Series/Flags/FlagsPoint';
import type { FlagsShapeValue } from '../Series/Flags/FlagsPointOptions';
import type FlagsSeriesOptions from '../Series/Flags/FlagsSeriesOptions';
import type { HTMLDOMElement } from '../Core/Renderer/DOMElementType';
import type Point from '../Core/Series/Point';
import type PointerEvent from '../Core/PointerEvent';
import type { SeriesTypeOptions } from '../Core/Series/SeriesType';
import type SVGElement from '../Core/Renderer/SVG/SVGElement';

import D from '../Core/DefaultOptions.js';
const {
    getOptions,
    setOptions
} = D;
import H from '../Core/Globals.js';
import NavigationBindings from '../Extensions/Annotations/NavigationBindings.js';
import { Palette } from '../Core/Color/Palettes.js';
import Series from '../Core/Series/Series.js';
import U from '../Core/Utilities.js';
import FibonacciTimeZones from '../Extensions/Annotations/Types/FibonacciTimeZones';
const {
    correctFloat,
    defined,
    extend,
    fireEvent,
    isNumber,
    merge,
    pick,
    uniqueKey
} = U;

declare module '../Extensions/Exporting/NavigationOptions' {
    interface NavigationOptions {
        bindings?: Record<string, Highcharts.NavigationBindingsOptionsObject>;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        type NavigationBindingUtils = typeof NavigationBindings.prototype.utils;
        interface StockToolsNavigationBindings extends NavigationBindings {
            toggledAnnotations?: boolean;
            utils: StockToolsNavigationBindingsUtilsObject;
            verticalCounter?: number;
            /** @requires modules/stock-tools */
            getYAxisPositions(
                yAxes: Array<AxisType>,
                plotHeight: number,
                defaultHeight: number,
                removedYAxisProps?: AxisPositions
            ): YAxisPositions;
            /** @requires modules/stock-tools */
            getYAxisResizers(
                yAxes: Array<AxisType>
            ): Array<NavigationBindingsResizerObject>;
            /** @requires modules/stock-tools */
            recalculateYAxisPositions(
                positions: Array<Record<string, number>>,
                changedSpace: number,
                modifyHeight?: boolean,
                adder?: number
            ): Array<Record<string, number>>;
            /** @requires modules/stock-tools */
            resizeYAxes(
                removedYAxisProps?: Highcharts.AxisPositions
            ): void;
        }
        interface NavigationBindingsAttractionObject {
            x: number;
            y: number;
            below: boolean;
            series: Series;
            xAxis: number;
            yAxis: number;
        }

        interface YAxisPositions {
            positions: Array<Record<string, number>>;
            allAxesHeight: number;
        }
        interface AxisPositions {
            top: string;
            height: string;
        }
        interface NavigationBindingsResizerObject {
            controlledAxis?: Record<string, Array<number>>;
            enabled: boolean;
        }
        interface StockToolsNavigationBindingsUtilsObject extends NavigationBindingUtils {
            indicatorsWithAxes: Array<string>;

            addFlagFromForm(this: NavigationBindings, type: string): Function;
            attractToPoint(
                e: Event,
                chart: Chart
            ): NavigationBindingsAttractionObject|void;
            isNotNavigatorYAxis(axis: AxisType): boolean;
            isPriceIndicatorEnabled(series: Series[]): boolean;
            manageIndicators(
                this: NavigationBindings,
                data: StockToolsFieldsObject
            ): void;
            updateHeight(
                this: NavigationBindings,
                e: PointerEvent,
                annotation: Annotation
            ): void;
            updateNthPoint(
                startIndex: number
            ): StockToolsNavigationBindingsUtilsObject['updateHeight'];
        }

        interface StockToolsFieldsObject {
            [key: string]: any;
        }
    }
}

const bindingsUtils: Highcharts.StockToolsNavigationBindingsUtilsObject =
        NavigationBindings.prototype.utils as any,
    PREFIX = 'highcharts-';

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * Generates function which will add a flag series using modal in GUI.
 * Method fires an event "showPopup" with config:
 * `{type, options, callback}`.
 *
 * Example: NavigationBindings.utils.addFlagFromForm('url(...)') - will
 * generate function that shows modal in GUI.
 *
 * @private
 * @function bindingsUtils.addFlagFromForm
 *
 * @param {Highcharts.FlagsShapeValue} type
 *        Type of flag series, e.g. "squarepin"
 *
 * @return {Function}
 *         Callback to be used in `start` callback
 */
bindingsUtils.addFlagFromForm = function (
    this: Highcharts.StockToolsNavigationBindings,
    type: FlagsShapeValue
): Function {
    return function (
        this: Highcharts.StockToolsNavigationBindings,
        e: Event
    ): void {
        let navigation = this,
            chart = navigation.chart,
            toolbar = chart.stockTools,
            getFieldType = bindingsUtils.getFieldType,
            point = bindingsUtils.attractToPoint(e, chart),
            pointConfig,
            seriesOptions: FlagsSeriesOptions;

        if (!point) {
            return;
        }

        pointConfig = {
            x: point.x,
            y: point.y
        };

        seriesOptions = {
            type: 'flags',
            onSeries: point.series.id,
            shape: type,
            data: [pointConfig],
            xAxis: point.xAxis,
            yAxis: point.yAxis,
            point: {
                events: {
                    click: function (this: FlagsPoint): void {
                        const point = this,
                            options = point.options;

                        fireEvent(
                            navigation,
                            'showPopup',
                            {
                                point: point,
                                formType: 'annotation-toolbar',
                                options: {
                                    langKey: 'flags',
                                    type: 'flags',
                                    title: [
                                        options.title,
                                        getFieldType(
                                            options.title as any
                                        )
                                    ],
                                    name: [
                                        options.name,
                                        getFieldType(
                                            options.name as any
                                        )
                                    ]
                                },
                                onSubmit: function (
                                    updated: Highcharts.StockToolsFieldsObject
                                ): void {
                                    if (updated.actionType === 'remove') {
                                        point.remove();
                                    } else {
                                        point.update(
                                            navigation.fieldsToOptions(
                                                updated.fields,
                                                {}
                                            )
                                        );
                                    }
                                }
                            }
                        );
                    } as any
                }
            }
        };

        if (!toolbar || !toolbar.guiEnabled) {
            chart.addSeries(seriesOptions);
        }

        fireEvent(
            navigation,
            'showPopup',
            {
                formType: 'flag',
                // Enabled options:
                options: {
                    langKey: 'flags',
                    type: 'flags',
                    title: ['A', getFieldType('A' as any)],
                    name: ['Flag A', getFieldType('Flag A' as any)]
                },
                // Callback on submit:
                onSubmit: function (
                    data: Highcharts.StockToolsFieldsObject
                ): void {
                    navigation.fieldsToOptions(
                        data.fields,
                        (seriesOptions.data as any)[0]
                    );
                    chart.addSeries(seriesOptions);
                }
            }
        );
    };
};

bindingsUtils.indicatorsWithAxes = [
    'apo',
    'ad',
    'aroon',
    'aroonoscillator',
    'atr',
    'ao',
    'cci',
    'chaikin',
    'cmf',

    'cmo',
    'disparityindex',
    'dmi',
    'dpo',
    'linearRegressionAngle',
    'linearRegressionIntercept',
    'linearRegressionSlope',
    'klinger',
    'macd',
    'mfi',
    'momentum',

    'natr',
    'obv',
    'ppo',
    'roc',
    'rsi',
    'slowstochastic',
    'stochastic',
    'trix',
    'williamsr'

];

bindingsUtils.manageIndicators = function (
    this: Highcharts.StockToolsNavigationBindings,
    data: Highcharts.StockToolsFieldsObject
): void {
    let navigation = this,
        chart = navigation.chart,
        seriesConfig: Highcharts.StockToolsFieldsObject = {
            linkedTo: data.linkedTo,
            type: data.type
        },
        indicatorsWithVolume = [
            'ad',
            'cmf',
            'klinger',
            'mfi',
            'obv',
            'vbp',
            'vwap'
        ],
        indicatorsWithAxes = bindingsUtils.indicatorsWithAxes,
        yAxis,
        parentSeries,
        defaultOptions,
        series: Series;

    if (data.actionType === 'edit') {
        navigation.fieldsToOptions(data.fields, seriesConfig);
        series = chart.get(data.seriesId) as any;

        if (series) {
            series.update(seriesConfig, false);
        }
    } else if (data.actionType === 'remove') {
        series = chart.get(data.seriesId) as any;
        if (series) {
            yAxis = series.yAxis;

            if (series.linkedSeries) {
                series.linkedSeries.forEach(function (linkedSeries): void {
                    linkedSeries.remove(false);
                });
            }

            series.remove(false);

            if (indicatorsWithAxes.indexOf(series.type) >= 0) {
                const removedYAxisProps = {
                    height: yAxis.options.height,
                    top: yAxis.options.top
                } as Highcharts.AxisPositions;
                yAxis.remove(false);
                navigation.resizeYAxes(removedYAxisProps);
            }
        }
    } else {
        seriesConfig.id = uniqueKey();
        navigation.fieldsToOptions(data.fields, seriesConfig);
        parentSeries = chart.get(seriesConfig.linkedTo);
        defaultOptions = getOptions().plotOptions as any;

        // Make sure that indicator uses the SUM approx if SUM approx is used
        // by parent series (#13950).
        if (
            typeof parentSeries !== 'undefined' &&
            parentSeries instanceof Series &&
            parentSeries.getDGApproximation() === 'sum' &&
            // If indicator has defined approx type, use it (e.g. "ranges")
            !defined(
                defaultOptions && defaultOptions[seriesConfig.type] &&
                defaultOptions.dataGrouping &&
                defaultOptions.dataGrouping.approximation
            )
        ) {
            seriesConfig.dataGrouping = {
                approximation: 'sum'
            };
        }

        if (indicatorsWithAxes.indexOf(data.type) >= 0) {
            yAxis = chart.addAxis({
                id: uniqueKey(),
                offset: 0,
                opposite: true,
                title: {
                    text: ''
                },
                tickPixelInterval: 40,
                showLastLabel: false,
                labels: {
                    align: 'left',
                    y: -2
                }
            }, false, false);
            seriesConfig.yAxis = yAxis.options.id;
            navigation.resizeYAxes();
        } else {
            seriesConfig.yAxis = (
                chart.get(data.linkedTo) as any
            ).options.yAxis;
        }

        if (indicatorsWithVolume.indexOf(data.type) >= 0) {
            seriesConfig.params.volumeSeriesID = chart.series.filter(
                function (series): boolean {
                    return series.options.type === 'column';
                }
            )[0].options.id;
        }

        chart.addSeries(seriesConfig, false);
    }

    fireEvent(
        navigation,
        'deselectButton',
        {
            button: navigation.selectedButtonElement
        }
    );

    chart.redraw();
};

/**
 * Update height for an annotation. Height is calculated as a difference
 * between last point in `typeOptions` and current position. It's a value,
 * not pixels height.
 *
 * @private
 * @function bindingsUtils.updateHeight
 *
 * @param {Highcharts.PointerEventObject} e
 *        normalized browser event
 *
 * @param {Highcharts.Annotation} annotation
 *        Annotation to be updated
 *
 * @return {void}
 */
bindingsUtils.updateHeight = function (
    this: Highcharts.StockToolsNavigationBindings,
    e: PointerEvent,
    annotation: Annotation
): void {
    const options = annotation.options.typeOptions,
        yAxis = isNumber(options.yAxis) && this.chart.yAxis[options.yAxis];

    if (yAxis && options.points) {
        annotation.update({
            typeOptions: {
                height: yAxis.toValue(e[yAxis.horiz ? 'chartX' : 'chartY']) -
                    (options.points[1].y || 0)
            }
        });
    }
};

// @todo
// Consider using getHoverData(), but always kdTree (columns?)
bindingsUtils.attractToPoint = function (
    e: PointerEvent,
    chart: Chart
): Highcharts.NavigationBindingsAttractionObject | void {
    let coords = chart.pointer.getCoordinates(e),
        coordsX,
        coordsY,
        distX = Number.MAX_VALUE,
        closestPoint: (Point|undefined),
        x: number,
        y: number;

    if (chart.navigationBindings) {
        coordsX = chart.navigationBindings.utils.getAssignedAxis(coords.xAxis);
        coordsY = chart.navigationBindings.utils.getAssignedAxis(coords.yAxis);
    }

    // Exit if clicked out of axes area.
    if (!coordsX || !coordsY) {
        return;
    }

    x = coordsX.value;
    y = coordsY.value;

    // Search by 'x' but only in yAxis' series.
    coordsY.axis.series.forEach(function (series): void {
        if (series.points) {
            series.points.forEach(function (point): void {
                if (point && distX > Math.abs((point.x as any) - x)) {
                    distX = Math.abs((point.x as any) - x);
                    closestPoint = point;
                }
            });
        }
    });

    if (closestPoint && closestPoint.x && closestPoint.y) {
        return {
            x: closestPoint.x,
            y: closestPoint.y,
            below: y < closestPoint.y,
            series: closestPoint.series,
            xAxis: closestPoint.series.xAxis.options.index || 0,
            yAxis: closestPoint.series.yAxis.options.index || 0
        };
    }
};

/**
 * Shorthand to check if given yAxis comes from navigator.
 *
 * @private
 * @function bindingsUtils.isNotNavigatorYAxis
 *
 * @param {Highcharts.Axis} axis
 * Axis to check.
 *
 * @return {boolean}
 * True, if axis comes from navigator.
 */
bindingsUtils.isNotNavigatorYAxis = function (axis: AxisType): boolean {
    return axis.userOptions.className !== PREFIX + 'navigator-yaxis';
};

/**
 * Check if any of the price indicators are enabled.
 * @private
 * @function bindingsUtils.isLastPriceEnabled
 *
 * @param {Array} series
 *        Array of series.
 *
 * @return {boolean}
 *         Tells which indicator is enabled.
 */
bindingsUtils.isPriceIndicatorEnabled = function (series: Series[]): boolean {

    return series.some(
        (s): (SVGElement|undefined) => s.lastVisiblePrice || s.lastPrice
    );
};

/**
 * Update each point after specified index, most of the annotations use
 * this. For example crooked line: logic behind updating each point is the
 * same, only index changes when adding an annotation.
 *
 * Example: NavigationBindings.utils.updateNthPoint(1) - will generate
 * function that updates all consecutive points except point with index=0.
 *
 * @private
 * @function bindingsUtils.updateNthPoint
 *
 * @param {number} startIndex
 *        Index from each point should udpated
 *
 * @return {Function}
 *         Callback to be used in steps array
 */
bindingsUtils.updateNthPoint = function (
    startIndex: number
): Highcharts.StockToolsNavigationBindingsUtilsObject['updateHeight'] {
    return function (
        this: Highcharts.StockToolsNavigationBindings,
        e: PointerEvent,
        annotation: Annotation
    ): void {
        const options = annotation.options.typeOptions,
            xAxis = isNumber(options.xAxis) && this.chart.xAxis[options.xAxis],
            yAxis = isNumber(options.yAxis) && this.chart.yAxis[options.yAxis];


        if (xAxis && yAxis) {
            (options.points as any).forEach(function (
                point: Point,
                index: number
            ): void {
                if (index >= startIndex) {
                    point.x = xAxis.toValue(
                        e[xAxis.horiz ? 'chartX' : 'chartY']
                    );
                    point.y = yAxis.toValue(
                        e[yAxis.horiz ? 'chartX' : 'chartY']
                    );
                }
            });
            annotation.update({
                typeOptions: {
                    points: options.points
                }
            });
        }
    };
};

// Extends NavigationBindigs to support indicators and resizers:
extend<NavigationBindings|Highcharts.StockToolsNavigationBindings>(NavigationBindings.prototype, {
    /* eslint-disable valid-jsdoc */
    /**
     * Get current positions for all yAxes. If new axis does not have position,
     * returned is default height and last available top place.
     *
     * @private
     * @function Highcharts.NavigationBindings#getYAxisPositions
     *
     * @param {Array<Highcharts.Axis>} yAxes
     *        Array of yAxes available in the chart.
     *
     * @param {number} plotHeight
     *        Available height in the chart.
     *
     * @param {number} defaultHeight
     *        Default height in percents.
     *
     * @param {Highcharts.AxisPositions} removedYAxisProps
     *        Height and top value of the removed yAxis in percents.
     *
     * @return {Highcharts.YAxisPositions}
     *         An object containing an array of calculated positions
     *         in percentages. Format: `{top: Number, height: Number}`
     *         and maximum value of top + height of axes.
     */
    getYAxisPositions: function (
        yAxes: Array<AxisType>,
        plotHeight: number,
        defaultHeight: number,
        removedYAxisProps?: Highcharts.AxisPositions
    ): Highcharts.YAxisPositions {
        let positions: Array<Record<string, number>>|undefined,
            allAxesHeight = 0,
            previousAxisHeight: number,
            removedHeight: number,
            removedTop: number;
        /** @private */
        function isPercentage(prop: number | string | undefined): boolean {
            return defined(prop) && !isNumber(prop) && (prop.match('%') as any);
        }

        if (removedYAxisProps) {
            removedTop = correctFloat(
                (parseFloat(removedYAxisProps.top) / 100)
            );
            removedHeight = correctFloat(
                (parseFloat(removedYAxisProps.height) / 100)
            );
        }

        positions = yAxes.map(function (yAxis: AxisType, index: number): Record<string, number> {
            let height = correctFloat(isPercentage(yAxis.options.height) ?
                    parseFloat(yAxis.options.height as any) / 100 :
                    yAxis.height / plotHeight),
                top = correctFloat(isPercentage(yAxis.options.top) ?
                    parseFloat(yAxis.options.top as any) / 100 :
                    (yAxis.top - yAxis.chart.plotTop) / plotHeight);

            if (!removedHeight) {
                // New axis' height is NaN so we can check if
                // the axis is newly created this way
                if (!isNumber(height)) {
                    // Check if the previous axis is the
                    // indicator axis (every indicator inherits from sma)
                    height = yAxes[index - 1].series
                        .every((s: Series): boolean => s.is('sma')) ?
                        previousAxisHeight : defaultHeight / 100;
                }

                if (!isNumber(top)) {
                    top = allAxesHeight;
                }

                previousAxisHeight = height;

                allAxesHeight = correctFloat(Math.max(
                    allAxesHeight,
                    (top || 0) + (height || 0)
                ));
            } else {
                // Move all axes which were below the removed axis up.
                if (
                    top > removedTop
                ) {
                    top -= removedHeight;
                }

                allAxesHeight = Math.max(
                    allAxesHeight,
                    (top || 0) + (height || 0)
                );
            }

            return {
                height: height * 100,
                top: top * 100
            };
        });

        return { positions, allAxesHeight };
    },

    /**
     * Get current resize options for each yAxis. Note that each resize is
     * linked to the next axis, except the last one which shouldn't affect
     * axes in the navigator. Because indicator can be removed with it's yAxis
     * in the middle of yAxis array, we need to bind closest yAxes back.
     *
     * @private
     * @function Highcharts.NavigationBindings#getYAxisResizers
     *
     * @param {Array<Highcharts.Axis>} yAxes
     *        Array of yAxes available in the chart
     *
     * @return {Array<object>}
     *         An array of resizer options.
     *         Format: `{enabled: Boolean, controlledAxis: { next: [String]}}`
     */
    getYAxisResizers: function (
        yAxes: Array<AxisType>
    ): Array<Highcharts.NavigationBindingsResizerObject> {
        const resizers: Array<Highcharts.NavigationBindingsResizerObject> = [];

        yAxes.forEach(function (_yAxis: AxisType, index: number): void {
            const nextYAxis = yAxes[index + 1];

            // We have next axis, bind them:
            if (nextYAxis) {
                resizers[index] = {
                    enabled: true,
                    controlledAxis: {
                        next: [
                            pick(
                                nextYAxis.options.id,
                                nextYAxis.options.index as any
                            )
                        ]
                    }
                };
            } else {
                // Remove binding:
                resizers[index] = {
                    enabled: false
                };
            }
        });

        return resizers;
    },
    /**
     * Resize all yAxes (except navigator) to fit the plotting height. Method
     * checks if new axis is added, if the new axis will fit under previous
     * axes it is placed there. If not, current plot area is scaled
     * to make room for new axis.
     *
     * If axis is removed, the current plot area streaches to fit into 100%
     * of the plot area.
     *
     * @private
     * @function Highcharts.NavigationBindings#resizeYAxes
     * @param {Highcharts.AxisPositions} [removedYAxisProps]
     *
     *
     */
    resizeYAxes: function (
        this: Highcharts.StockToolsNavigationBindings,
        removedYAxisProps?: Highcharts.AxisPositions
    ): void {
        // The height of the new axis before rescalling. In %, but as a number.
        const defaultHeight = 20;
        const chart = this.chart,
            // Only non-navigator axes
            yAxes = chart.yAxis.filter(bindingsUtils.isNotNavigatorYAxis),
            plotHeight = chart.plotHeight,
            // Gather current heights (in %)
            { positions, allAxesHeight } = this.getYAxisPositions(
                yAxes,
                plotHeight,
                defaultHeight,
                removedYAxisProps
            ),
            resizers = this.getYAxisResizers(yAxes);

        // check if the axis is being either added or removed and
        // if the new indicator axis will fit under existing axes.
        // if so, there is no need to scale them.
        if (
            !removedYAxisProps &&
            allAxesHeight <= correctFloat(0.8 + defaultHeight / 100)
        ) {
            positions[positions.length - 1] = {
                height: defaultHeight,
                top: correctFloat(allAxesHeight * 100 - defaultHeight)
            };
        } else {
            positions.forEach(function (
                position: Record<string, number>
            ): void {
                position.height = (
                    position.height / (allAxesHeight * 100)
                ) * 100;
                position.top = (position.top / (allAxesHeight * 100)) * 100;
            });
        }

        positions.forEach(function (
            position: Record<string, number>, index: number
        ): void {
            yAxes[index].update({
                height: position.height + '%',
                top: position.top + '%',
                resize: resizers[index],
                offset: 0
            }, false);
        });
    },

    /**
     * Utility to modify calculated positions according to the remaining/needed
     * space. Later, these positions are used in `yAxis.update({ top, height })`
     *
     * @private
     * @function Highcharts.NavigationBindings#recalculateYAxisPositions
     * @param {Array<Highcharts.Dictionary<number>>} positions
     * Default positions of all yAxes.
     * @param {number} changedSpace
     * How much space should be added or removed.
     * @param {boolean} modifyHeight
     * Update only `top` or both `top` and `height`.
     * @param {number} adder
     * `-1` or `1`, to determine whether we should add or remove space.
     *
     * @return {Array<object>}
     *         Modified positions,
     */
    recalculateYAxisPositions: function (
        positions: Array<Record<string, number>>,
        changedSpace: number,
        modifyHeight?: boolean,
        adder?: number
    ): Array<Record<string, number>> {
        positions.forEach(function (
            position: Record<string, number>,
            index: number
        ): void {
            const prevPosition = positions[index - 1];

            position.top = !prevPosition ? 0 :
                correctFloat(prevPosition.height + prevPosition.top);

            if (modifyHeight) {
                position.height = correctFloat(
                    position.height + (adder as any) * changedSpace
                );
            }
        });

        return positions;
    }
    /* eslint-enable valid-jsdoc */
});

/**
 * @type         {Highcharts.Dictionary<Highcharts.NavigationBindingsOptionsObject>}
 * @since        7.0.0
 * @optionparent navigation.bindings
 *   @sample {highstock} stock/stocktools/custom-stock-tools-bindings
 *     Custom stock tools bindings
 */
const stockToolsBindings: Record<string, Highcharts.NavigationBindingsOptionsObject> = {
    // Line type annotations:
    /**
     * A segment annotation bindings. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-segment", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    segment: {
        /** @ignore-option */
        className: 'highcharts-segment',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            let coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis),
                navigation = this.chart.options.navigation,
                options;

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            options = merge(
                {
                    langKey: 'segment',
                    type: 'crookedLine',
                    typeOptions: {
                        xAxis: coordsX.axis.options.index,
                        yAxis: coordsY.axis.options.index,
                        points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).segment.annotationsOptions
            );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A segment with an arrow annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-arrow-segment", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    arrowSegment: {
        /** @ignore-option */
        className: 'highcharts-arrow-segment',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            let coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis),
                navigation = this.chart.options.navigation,
                options;

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            options = merge(
                {
                    langKey: 'arrowSegment',
                    type: 'crookedLine',
                    typeOptions: {
                        line: {
                            markerEnd: 'arrow'
                        },
                        xAxis: coordsX.axis.options.index,
                        yAxis: coordsY.axis.options.index,
                        points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).arrowSegment.annotationsOptions
            );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A ray annotation bindings. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-ray", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    ray: {
        /** @ignore-option */
        className: 'highcharts-ray',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            let coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis),
                navigation = this.chart.options.navigation,
                options;

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            options = merge(
                {
                    langKey: 'ray',
                    type: 'infinityLine',
                    typeOptions: {
                        type: 'ray',
                        xAxis: coordsX.axis.options.index,
                        yAxis: coordsY.axis.options.index,
                        points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).ray.annotationsOptions
            );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A ray with an arrow annotation bindings. Includes `start` and one event
     * in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-arrow-ray", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    arrowRay: {
        /** @ignore-option */
        className: 'highcharts-arrow-ray',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            let coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis),
                navigation = this.chart.options.navigation,
                options;

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            options = merge(
                {
                    langKey: 'arrowRay',
                    type: 'infinityLine',
                    typeOptions: {
                        type: 'ray',
                        line: {
                            markerEnd: 'arrow'
                        },
                        xAxis: coordsX.axis.options.index,
                        yAxis: coordsY.axis.options.index,
                        points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).arrowRay.annotationsOptions
            );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A line annotation. Includes `start` and one event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-infinity-line", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    infinityLine: {
        /** @ignore-option */
        className: 'highcharts-infinity-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            let coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis),
                navigation = this.chart.options.navigation,
                options;

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            options = merge(
                {
                    langKey: 'infinityLine',
                    type: 'infinityLine',
                    typeOptions: {
                        type: 'line',
                        xAxis: coordsX.axis.options.index,
                        yAxis: coordsY.axis.options.index,
                        points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).infinityLine.annotationsOptions
            );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A line with arrow annotation. Includes `start` and one event in `steps`
     * array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-arrow-infinity-line", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    arrowInfinityLine: {
        /** @ignore-option */
        className: 'highcharts-arrow-infinity-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            let coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis),
                navigation = this.chart.options.navigation,
                options;

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            options = merge(
                {
                    langKey: 'arrowInfinityLine',
                    type: 'infinityLine',
                    typeOptions: {
                        type: 'line',
                        line: {
                            markerEnd: 'arrow'
                        },
                        xAxis: coordsX.axis.options.index,
                        yAxis: coordsY.axis.options.index,
                        points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }, {
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).arrowInfinityLine
                    .annotationsOptions
            );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    /**
     * A horizontal line annotation. Includes `start` event.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-horizontal-line", "start": function() {}, "annotationsOptions": {}}
     */
    horizontalLine: {
        /** @ignore-option */
        className: 'highcharts-horizontal-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (this: NavigationBindings, e: PointerEvent): void {
            let coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis),
                navigation = this.chart.options.navigation,
                options;

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            options = merge(
                {
                    langKey: 'horizontalLine',
                    type: 'infinityLine',
                    draggable: 'y',
                    typeOptions: {
                        type: 'horizontalLine',
                        xAxis: coordsX.axis.options.index,
                        yAxis: coordsY.axis.options.index,
                        points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).horizontalLine.annotationsOptions
            );

            this.chart.addAnnotation(options);
        }
    },
    /**
     * A vertical line annotation. Includes `start` event.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-vertical-line", "start": function() {}, "annotationsOptions": {}}
     */
    verticalLine: {
        /** @ignore-option */
        className: 'highcharts-vertical-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (this: NavigationBindings, e: PointerEvent): void {
            let coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis),
                navigation = this.chart.options.navigation,
                options;

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            options = merge(
                {
                    langKey: 'verticalLine',
                    type: 'infinityLine',
                    draggable: 'x',
                    typeOptions: {
                        type: 'verticalLine',
                        xAxis: coordsX.axis.options.index,
                        yAxis: coordsY.axis.options.index,
                        points: [{
                            x: coordsX.value,
                            y: coordsY.value
                        }]
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).verticalLine.annotationsOptions
            );

            this.chart.addAnnotation(options);
        }
    },
    /**
     * Crooked line (three points) annotation bindings. Includes `start` and two
     * events in `steps` (for second and third points in crooked line) array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-crooked3", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    // Crooked Line type annotations:
    crooked3: {
        /** @ignore-option */
        className: 'highcharts-crooked3',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            const coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis);

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            const x = coordsX.value,
                y = coordsY.value,
                navigation = this.chart.options.navigation,
                options = merge(
                    {
                        langKey: 'crooked3',
                        type: 'crookedLine',
                        typeOptions: {
                            xAxis: coordsX.axis.options.index,
                            yAxis: coordsY.axis.options.index,
                            points: [
                                { x, y },
                                { x, y },
                                { x, y }
                            ]
                        }
                    },
                    navigation.annotationsOptions,
                    (navigation.bindings as any).crooked3.annotationsOptions
                );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2)
        ]
    },
    /**
     * Crooked line (five points) annotation bindings. Includes `start` and four
     * events in `steps` (for all consequent points in crooked line) array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-crooked5", "start": function() {}, "steps": [function() {}, function() {}, function() {}, function() {}], "annotationsOptions": {}}
     */
    crooked5: {
        /** @ignore-option */
        className: 'highcharts-crooked5',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            const coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis);

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            const x = coordsX.value,
                y = coordsY.value,
                navigation = this.chart.options.navigation,
                options = merge(
                    {
                        langKey: 'crooked5',
                        type: 'crookedLine',
                        typeOptions: {
                            xAxis: coordsX.axis.options.index,
                            yAxis: coordsY.axis.options.index,
                            points: [
                                { x, y },
                                { x, y },
                                { x, y },
                                { x, y },
                                { x, y }
                            ]
                        }
                    },
                    navigation.annotationsOptions,
                    (navigation.bindings as any).crooked5.annotationsOptions
                );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2),
            bindingsUtils.updateNthPoint(3),
            bindingsUtils.updateNthPoint(4)
        ]
    },
    /**
     * Elliott wave (three points) annotation bindings. Includes `start` and two
     * events in `steps` (for second and third points) array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-elliott3", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    elliott3: {
        /** @ignore-option */
        className: 'highcharts-elliott3',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            const coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis);

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            const x = coordsX.value,
                y = coordsY.value,
                navigation = this.chart.options.navigation,
                options = merge(
                    {
                        langKey: 'elliott3',
                        type: 'elliottWave',
                        typeOptions: {
                            xAxis: coordsX.axis.options.index,
                            yAxis: coordsY.axis.options.index,
                            points: [
                                { x, y },
                                { x, y },
                                { x, y },
                                { x, y }
                            ]
                        },
                        labelOptions: {
                            style: {
                                color: Palette.neutralColor60
                            }
                        }
                    },
                    navigation.annotationsOptions,
                    (navigation.bindings as any).elliott3.annotationsOptions
                );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2),
            bindingsUtils.updateNthPoint(3)
        ]
    },
    /**
     * Elliott wave (five points) annotation bindings. Includes `start` and four
     * event in `steps` (for all consequent points in Elliott wave) array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-elliott3", "start": function() {}, "steps": [function() {}, function() {}, function() {}, function() {}], "annotationsOptions": {}}
     */
    elliott5: {
        /** @ignore-option */
        className: 'highcharts-elliott5',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            const coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis);

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            const x = coordsX.value,
                y = coordsY.value,
                navigation = this.chart.options.navigation,
                options = merge(
                    {
                        langKey: 'elliott5',
                        type: 'elliottWave',
                        typeOptions: {
                            xAxis: coordsX.axis.options.index,
                            yAxis: coordsY.axis.options.index,
                            points: [
                                { x, y },
                                { x, y },
                                { x, y },
                                { x, y },
                                { x, y },
                                { x, y }
                            ]
                        },
                        labelOptions: {
                            style: {
                                color: Palette.neutralColor60
                            }
                        }
                    },
                    navigation.annotationsOptions,
                    (navigation.bindings as any).elliott5.annotationsOptions
                );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2),
            bindingsUtils.updateNthPoint(3),
            bindingsUtils.updateNthPoint(4),
            bindingsUtils.updateNthPoint(5)
        ]
    },
    /**
     * A measure (x-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-measure-x", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    measureX: {
        /** @ignore-option */
        className: 'highcharts-measure-x',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            const coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis);

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            const x = coordsX.value,
                y = coordsY.value,
                navigation = this.chart.options.navigation,
                options = merge(
                    {
                        langKey: 'measure',
                        type: 'measure',
                        typeOptions: {
                            selectType: 'x',
                            xAxis: coordsX.axis.options.index,
                            yAxis: coordsY.axis.options.index,
                            point: { x, y },
                            crosshairX: {
                                strokeWidth: 1,
                                stroke: Palette.neutralColor100
                            },
                            crosshairY: {
                                enabled: false,
                                strokeWidth: 0,
                                stroke: Palette.neutralColor100
                            },
                            background: {
                                width: 0,
                                height: 0,
                                strokeWidth: 0,
                                stroke: Palette.backgroundColor
                            }
                        },
                        labelOptions: {
                            style: {
                                color: Palette.neutralColor60
                            }
                        }
                    },
                    navigation.annotationsOptions,
                    (navigation.bindings as any).measureX.annotationsOptions
                );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateRectSize
        ]
    },
    /**
     * A measure (y-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-measure-y", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    measureY: {
        /** @ignore-option */
        className: 'highcharts-measure-y',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            const coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis);

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            const x = coordsX.value,
                y = coordsY.value,
                navigation = this.chart.options.navigation,
                options = merge(
                    {
                        langKey: 'measure',
                        type: 'measure',
                        typeOptions: {
                            selectType: 'y',
                            xAxis: coordsX.axis.options.index,
                            yAxis: coordsY.axis.options.index,
                            point: { x, y },
                            crosshairX: {
                                enabled: false,
                                strokeWidth: 0,
                                stroke: Palette.neutralColor100
                            },
                            crosshairY: {
                                strokeWidth: 1,
                                stroke: Palette.neutralColor100
                            },
                            background: {
                                width: 0,
                                height: 0,
                                strokeWidth: 0,
                                stroke: Palette.backgroundColor
                            }
                        },
                        labelOptions: {
                            style: {
                                color: Palette.neutralColor60
                            }
                        }
                    },
                    navigation.annotationsOptions,
                    (navigation.bindings as any).measureY.annotationsOptions
                );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateRectSize
        ]
    },
    /**
     * A measure (xy-dimension) annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-measure-xy", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    measureXY: {
        /** @ignore-option */
        className: 'highcharts-measure-xy',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            const coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis);

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            const x = coordsX.value,
                y = coordsY.value,
                navigation = this.chart.options.navigation,
                options = merge(
                    {
                        langKey: 'measure',
                        type: 'measure',
                        typeOptions: {
                            selectType: 'xy',
                            xAxis: coordsX.axis.options.index,
                            yAxis: coordsY.axis.options.index,
                            point: { x, y },
                            background: {
                                width: 0,
                                height: 0,
                                strokeWidth: 10
                            },
                            crosshairX: {
                                strokeWidth: 1,
                                stroke: Palette.neutralColor100
                            },
                            crosshairY: {
                                strokeWidth: 1,
                                stroke: Palette.neutralColor100
                            }
                        },
                        labelOptions: {
                            style: {
                                color: Palette.neutralColor60
                            }
                        }
                    },
                    navigation.annotationsOptions,
                    (navigation.bindings as any).measureXY.annotationsOptions
                );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateRectSize
        ]
    },
    // Advanced type annotations:
    /**
     * A fibonacci annotation bindings. Includes `start` and two events in
     * `steps` array (updates second point, then height).
     *
     *   @sample {highstock} stock/stocktools/custom-stock-tools-bindings
     *     Custom stock tools bindings
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-fibonacci", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    fibonacci: {
        /** @ignore-option */
        className: 'highcharts-fibonacci',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            const coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis);

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            const x = coordsX.value,
                y = coordsY.value,
                navigation = this.chart.options.navigation,
                options = merge(
                    {
                        langKey: 'fibonacci',
                        type: 'fibonacci',
                        typeOptions: {
                            xAxis: coordsX.axis.options.index,
                            yAxis: coordsY.axis.options.index,
                            points: [
                                { x, y },
                                { x, y }
                            ]
                        },
                        labelOptions: {
                            style: {
                                color: Palette.neutralColor60
                            }
                        }
                    },
                    navigation.annotationsOptions,
                    (navigation.bindings as any).fibonacci.annotationsOptions
                );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateHeight
        ]
    },
    /**
     * A parallel channel (tunnel) annotation bindings. Includes `start` and
     * two events in `steps` array (updates second point, then height).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-parallel-channel", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    parallelChannel: {
        /** @ignore-option */
        className: 'highcharts-parallel-channel',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            const coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis);

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            const x = coordsX.value,
                y = coordsY.value,
                navigation = this.chart.options.navigation,
                options = merge(
                    {
                        langKey: 'parallelChannel',
                        type: 'tunnel',
                        typeOptions: {
                            xAxis: coordsX.axis.options.index,
                            yAxis: coordsY.axis.options.index,
                            points: [
                                { x, y },
                                { x, y }
                            ]
                        }
                    },
                    navigation.annotationsOptions,
                    (navigation.bindings as any).parallelChannel
                        .annotationsOptions
                );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateHeight
        ]
    },
    /**
     * An Andrew's pitchfork annotation bindings. Includes `start` and two
     * events in `steps` array (sets second and third control points).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-pitchfork", "start": function() {}, "steps": [function() {}, function() {}], "annotationsOptions": {}}
     */
    pitchfork: {
        /** @ignore-option */
        className: 'highcharts-pitchfork',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            const coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis);

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            const x = coordsX.value,
                y = coordsY.value,
                navigation = this.chart.options.navigation,
                options = merge(
                    {
                        langKey: 'pitchfork',
                        type: 'pitchfork',
                        typeOptions: {
                            xAxis: coordsX.axis.options.index,
                            yAxis: coordsY.axis.options.index,
                            points: [{
                                x: coordsX.value,
                                y: coordsY.value,
                                controlPoint: {
                                    style: {
                                        fill: Palette.negativeColor
                                    }
                                }
                            },
                            { x, y },
                            { x, y }],
                            innerBackground: {
                                fill: 'rgba(100, 170, 255, 0.8)'
                            }
                        },
                        shapeOptions: {
                            strokeWidth: 2
                        }
                    },
                    navigation.annotationsOptions,
                    (navigation.bindings as any).pitchfork.annotationsOptions
                );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        steps: [
            bindingsUtils.updateNthPoint(1),
            bindingsUtils.updateNthPoint(2)
        ]
    },
    // Labels with arrow and auto increments
    /**
     * A vertical counter annotation bindings. Includes `start` event. On click,
     * finds the closest point and marks it with a numeric annotation -
     * incrementing counter on each add.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-vertical-counter", "start": function() {}, "annotationsOptions": {}}
     */
    verticalCounter: {
        /** @ignore-option */
        className: 'highcharts-vertical-counter',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: Highcharts.StockToolsNavigationBindings,
            e: PointerEvent
        ): void {
            let closestPoint = bindingsUtils.attractToPoint(e, this.chart),
                navigation = this.chart.options.navigation,
                options,
                annotation;

            // Exit if clicked out of axes area
            if (!closestPoint) {
                return;
            }

            this.verticalCounter = this.verticalCounter || 0;

            options = merge(
                {
                    langKey: 'verticalCounter',
                    type: 'verticalLine',
                    typeOptions: {
                        point: {
                            x: closestPoint.x,
                            y: closestPoint.y,
                            xAxis: closestPoint.xAxis,
                            yAxis: closestPoint.yAxis
                        },
                        label: {
                            offset: closestPoint.below ? 40 : -40,
                            text: this.verticalCounter.toString()
                        }
                    },
                    labelOptions: {
                        style: {
                            color: Palette.neutralColor60,
                            fontSize: '11px'
                        }
                    },
                    shapeOptions: {
                        stroke: 'rgba(0, 0, 0, 0.75)',
                        strokeWidth: 1
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).verticalCounter.annotationsOptions
            );

            annotation = this.chart.addAnnotation(options);

            this.verticalCounter++;

            (annotation.options.events.click as any).call(annotation, {});
        }
    },
    /**
     * A time cycles annotation bindings. Includes `start` event and 1 `step`
     * event. first click marks the beginning of the circle, and the second one
     * sets its diameter.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-time-cycles", "start": function() {}, "steps": [function (){}] "annotationsOptions": {}}
     */
    timeCycles: {
        className: 'highcharts-time-cycles',
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            let closestPoint = bindingsUtils.attractToPoint(e, this.chart),
                navigation = this.chart.options.navigation,
                options,
                annotation;

            // Exit if clicked out of axes area
            if (!closestPoint) {
                return;
            }

            options = merge(
                {
                    langKey: 'timeCycles',
                    type: 'timeCycles',
                    typeOptions: {
                        xAxis: closestPoint.xAxis,
                        yAxis: closestPoint.yAxis,
                        points: [{
                            x: closestPoint.x
                        }, {
                            x: closestPoint.x
                        }],
                        line: {
                            stroke: 'rgba(0, 0, 0, 0.75)',
                            fill: 'transparent',
                            strokeWidth: 2
                        }
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).timeCycles.annotationsOptions
            );
            annotation = this.chart.addAnnotation(options);
            (annotation.options.events.click as any).call(annotation, {});

            return annotation;
        },

        steps: [
            bindingsUtils.updateNthPoint(1)
        ]
    },
    verticalLabel: {
        /** @ignore-option */
        className: 'highcharts-vertical-label',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): void {
            let closestPoint = bindingsUtils.attractToPoint(e, this.chart),
                navigation = this.chart.options.navigation,
                options,
                annotation;

            // Exit if clicked out of axes area
            if (!closestPoint) {
                return;
            }

            options = merge(
                {
                    langKey: 'verticalLabel',
                    type: 'verticalLine',
                    typeOptions: {
                        point: {
                            x: closestPoint.x,
                            y: closestPoint.y,
                            xAxis: closestPoint.xAxis,
                            yAxis: closestPoint.yAxis
                        },
                        label: {
                            offset: closestPoint.below ? 40 : -40
                        }
                    },
                    labelOptions: {
                        style: {
                            color: Palette.neutralColor60,
                            fontSize: '11px'
                        }
                    },
                    shapeOptions: {
                        stroke: 'rgba(0, 0, 0, 0.75)',
                        strokeWidth: 1
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).verticalLabel.annotationsOptions
            );

            annotation = this.chart.addAnnotation(options);

            (annotation.options.events.click as any).call(annotation, {});
        }
    },
    /**
     * A vertical arrow annotation bindings. Includes `start` event. On click,
     * finds the closest point and marks it with an arrow.
     * `${palette.positiveColor}` is the color of the arrow when
     * pointing from above and `${palette.negativeColor}`
     * when pointing from below the point.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-vertical-arrow", "start": function() {}, "annotationsOptions": {}}
     */
    verticalArrow: {
        /** @ignore-option */
        className: 'highcharts-vertical-arrow',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): void {
            let closestPoint = bindingsUtils.attractToPoint(e, this.chart),
                navigation = this.chart.options.navigation,
                options,
                annotation;

            // Exit if clicked out of axes area
            if (!closestPoint) {
                return;
            }

            options = merge(
                {
                    langKey: 'verticalArrow',
                    type: 'verticalLine',
                    typeOptions: {
                        point: {
                            x: closestPoint.x,
                            y: closestPoint.y,
                            xAxis: closestPoint.xAxis,
                            yAxis: closestPoint.yAxis
                        },
                        label: {
                            offset: closestPoint.below ? 40 : -40,
                            format: ' '
                        },
                        connector: {
                            fill: 'none',
                            stroke: closestPoint.below ?
                                Palette.negativeColor : Palette.positiveColor
                        }
                    },
                    shapeOptions: {
                        stroke: 'rgba(0, 0, 0, 0.75)',
                        strokeWidth: 1
                    }
                },
                navigation.annotationsOptions,
                (navigation.bindings as any).verticalArrow.annotationsOptions
            );

            annotation = this.chart.addAnnotation(options);

            (annotation.options.events.click as any).call(annotation, {});
        }
    },
    /**
     * The Fibonacci Time Zones annotation bindings. Includes `start` and one
     * event in `steps` array.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-fibonacci-time-zones", "start": function() {}, "steps": [function() {}], "annotationsOptions": {}}
     */
    fibonacciTimeZones: {
        /** @ignore-option */
        className: 'highcharts-fibonacci-time-zones',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        start: function (
            this: NavigationBindings,
            e: PointerEvent
        ): Annotation|void {
            const coords = this.chart.pointer.getCoordinates(e),
                coordsX = this.utils.getAssignedAxis(coords.xAxis),
                coordsY = this.utils.getAssignedAxis(coords.yAxis);

            // Exit if clicked out of axes area
            if (!coordsX || !coordsY) {
                return;
            }

            const navigation = this.chart.options.navigation,
                options = merge(
                    {
                        type: 'fibonacciTimeZones',
                        langKey: 'fibonacciTimeZones',
                        typeOptions: {
                            xAxis: coordsX.axis.options.index,
                            yAxis: coordsY.axis.options.index,
                            points: [{
                                x: coordsX.value
                            }]
                        }
                    },
                    navigation.annotationsOptions,
                    (navigation.bindings as any).fibonacciTimeZones
                        .annotationsOptions
                );

            return this.chart.addAnnotation(options);
        },
        /** @ignore-option */
        // eslint-disable-next-line valid-jsdoc
        steps: [
            function (
                this: NavigationBindings,
                e: PointerEvent,
                annotation: FibonacciTimeZones
            ): void {
                const mockPointOpts = annotation.options.typeOptions.points,
                    x = mockPointOpts && mockPointOpts[0].x,
                    coords = this.chart.pointer.getCoordinates(e),
                    coordsX = this.utils.getAssignedAxis(coords.xAxis),
                    coordsY = this.utils.getAssignedAxis(coords.yAxis);

                annotation.update({
                    typeOptions: {
                        xAxis: coordsX.axis.options.index,
                        yAxis: coordsY.axis.options.index,
                        points: [{
                            x: x
                        }, {
                            x: coordsX.value
                        }]
                    }
                });
            }
        ]
    },
    // Flag types:
    /**
     * A flag series bindings. Includes `start` event. On click, finds the
     * closest point and marks it with a flag with `'circlepin'` shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-circlepin", "start": function() {}}
     */
    flagCirclepin: {
        /** @ignore-option */
        className: 'highcharts-flag-circlepin',
        /** @ignore-option */
        start: (bindingsUtils.addFlagFromForm as any)('circlepin')
    },
    /**
     * A flag series bindings. Includes `start` event. On click, finds the
     * closest point and marks it with a flag with `'diamondpin'` shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-diamondpin", "start": function() {}}
     */
    flagDiamondpin: {
        /** @ignore-option */
        className: 'highcharts-flag-diamondpin',
        /** @ignore-option */
        start: (bindingsUtils.addFlagFromForm as any)('flag')
    },
    /**
     * A flag series bindings. Includes `start` event.
     * On click, finds the closest point and marks it with a flag with
     * `'squarepin'` shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-squarepin", "start": function() {}}
     */
    flagSquarepin: {
        /** @ignore-option */
        className: 'highcharts-flag-squarepin',
        /** @ignore-option */
        start: (bindingsUtils.addFlagFromForm as any)('squarepin')
    },
    /**
     * A flag series bindings. Includes `start` event.
     * On click, finds the closest point and marks it with a flag without pin
     * shape.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-flag-simplepin", "start": function() {}}
     */
    flagSimplepin: {
        /** @ignore-option */
        className: 'highcharts-flag-simplepin',
        /** @ignore-option */
        start: (bindingsUtils.addFlagFromForm as any)('nopin')
    },
    // Other tools:
    /**
     * Enables zooming in xAxis on a chart. Includes `start` event which
     * changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-zoom-x", "init": function() {}}
     */
    zoomX: {
        /** @ignore-option */
        className: 'highcharts-zoom-x',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: NavigationBindings,
            button: HTMLDOMElement
        ): void {
            this.chart.update({
                chart: {
                    zooming: {
                        type: 'x'
                    }
                }
            });

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Enables zooming in yAxis on a chart. Includes `start` event which
     * changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-zoom-y", "init": function() {}}
     */
    zoomY: {
        /** @ignore-option */
        className: 'highcharts-zoom-y',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: NavigationBindings,
            button: HTMLDOMElement
        ): void {
            this.chart.update({
                chart: {
                    zooming: {
                        type: 'y'
                    }
                }
            });
            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Enables zooming in xAxis and yAxis on a chart. Includes `start` event
     * which changes [chart.zoomType](#chart.zoomType).
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-zoom-xy", "init": function() {}}
     */
    zoomXY: {
        /** @ignore-option */
        className: 'highcharts-zoom-xy',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: NavigationBindings,
            button: HTMLDOMElement
        ): void {
            this.chart.update({
                chart: {
                    zooming: {
                        type: 'xy'
                    }
                }
            });

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Changes main series to `'line'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-line", "init": function() {}}
     */
    seriesTypeLine: {
        /** @ignore-option */
        className: 'highcharts-series-type-line',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: NavigationBindings,
            button: HTMLDOMElement
        ): void {
            this.chart.series[0].update({
                type: 'line',
                useOhlcData: true
            } as any);

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Changes main series to `'ohlc'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-ohlc", "init": function() {}}
     */
    seriesTypeOhlc: {
        /** @ignore-option */
        className: 'highcharts-series-type-ohlc',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: NavigationBindings,
            button: HTMLDOMElement
        ): void {
            this.chart.series[0].update({
                type: 'ohlc'
            });

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Changes main series to `'candlestick'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-candlestick", "init": function() {}}
     */
    seriesTypeCandlestick: {
        /** @ignore-option */
        className: 'highcharts-series-type-candlestick',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: NavigationBindings,
            button: HTMLDOMElement
        ): void {
            this.chart.series[0].update({
                type: 'candlestick'
            });

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Changes main series to `'heikinashi'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-heikinashi", "init": function() {}}
     */
    seriesTypeHeikinAshi: {
        /** @ignore-option */
        className: 'highcharts-series-type-heikinashi',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: NavigationBindings,
            button: HTMLDOMElement
        ): void {
            this.chart.series[0].update({
                type: 'heikinashi'
            });

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Change main series to `'hlc'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-hlc", "init": function () {}}
     */
    seriesTypeHLC: {
        className: 'highcharts-series-type-hlc',
        init: function (
            this: NavigationBindings,
            button: HTMLDOMElement
        ): void {
            this.chart.series[0].update({
                type: 'hlc',
                useOhlcData: true
            });
            fireEvent(this, 'deselectButton', { button });
        }
    },
    /**
     * Changes main series to `'hollowcandlestick'` type.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-series-type-hollowcandlestick", "init": function() {}}
     */
    seriesTypeHollowCandlestick: {
        /** @ignore-option */
        className: 'highcharts-series-type-hollowcandlestick',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: NavigationBindings,
            button: HTMLDOMElement
        ): void {
            this.chart.series[0].update({
                type: 'hollowcandlestick'
            });

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Displays chart in fullscreen.
     *
     * **Note**: Fullscreen is not supported on iPhone due to iOS limitations.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "noDataState": "normal", "highcharts-full-screen", "init": function() {}}
     */
    fullScreen: {
        /** @ignore-option */
        className: 'highcharts-full-screen',
        noDataState: 'normal',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: NavigationBindings,
            button: HTMLDOMElement
        ): void {
            this.chart.fullscreen.toggle();
            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Hides/shows two price indicators:
     * - last price in the dataset
     * - last price in the selected range
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-current-price-indicator", "init": function() {}}
     */
    currentPriceIndicator: {
        /** @ignore-option */
        className: 'highcharts-current-price-indicator',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: NavigationBindings,
            button: HTMLDOMElement
        ): void {
            const chart = this.chart,
                series = chart.series,
                gui = chart.stockTools,
                priceIndicatorEnabled = bindingsUtils.isPriceIndicatorEnabled(
                    chart.series
                );

            if (gui && gui.guiEnabled) {
                series.forEach(function (series): void {
                    series.update({
                        lastPrice: { enabled: !priceIndicatorEnabled },
                        lastVisiblePrice: {
                            enabled: !priceIndicatorEnabled,
                            label: { enabled: true }
                        }
                    }, false);
                });
                chart.redraw();
            }

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Indicators bindings. Includes `init` event to show a popup.
     *
     * Note: In order to show base series from the chart in the popup's
     * dropdown each series requires
     * [series.id](https://api.highcharts.com/highstock/series.line.id) to be
     * defined.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-indicators", "init": function() {}}
     */
    indicators: {
        /** @ignore-option */
        className: 'highcharts-indicators',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (this: Highcharts.StockToolsNavigationBindings): void {
            const navigation = this;

            fireEvent(
                navigation,
                'showPopup',
                {
                    formType: 'indicators',
                    options: {},
                    // Callback on submit:
                    onSubmit: function (data: any): void {
                        navigation.utils.manageIndicators.call(
                            navigation,
                            data
                        );
                    }
                }
            );
        }
    },
    /**
     * Hides/shows all annotations on a chart.
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-toggle-annotations", "init": function() {}}
     */
    toggleAnnotations: {
        /** @ignore-option */
        className: 'highcharts-toggle-annotations',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: Highcharts.StockToolsNavigationBindings,
            button: HTMLDOMElement
        ): void {
            const chart = this.chart,
                gui: Highcharts.Toolbar = chart.stockTools as any,
                iconsURL = gui.getIconsURL();

            this.toggledAnnotations = !this.toggledAnnotations;

            (chart.annotations || []).forEach(function (
                this: Highcharts.StockToolsNavigationBindings,
                annotation: any
            ): void {
                annotation.setVisibility(!this.toggledAnnotations);
            }, this);

            if (gui && gui.guiEnabled) {
                if (this.toggledAnnotations) {
                    (button.firstChild as any).style['background-image'] =
                        'url("' + iconsURL +
                            'annotations-hidden.svg")';
                } else {
                    (button.firstChild as any).style['background-image'] =
                        'url("' + iconsURL +
                            'annotations-visible.svg")';
                }
            }

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    },
    /**
     * Save a chart in localStorage under `highcharts-chart` key.
     * Stored items:
     * - annotations
     * - indicators (with yAxes)
     * - flags
     *
     * @type    {Highcharts.NavigationBindingsOptionsObject}
     * @product highstock
     * @default {"className": "highcharts-save-chart", "noDataState": "normal", "init": function() {}}
     */
    saveChart: {
        /** @ignore-option */
        className: 'highcharts-save-chart',
        noDataState: 'normal',
        // eslint-disable-next-line valid-jsdoc
        /** @ignore-option */
        init: function (
            this: Highcharts.StockToolsNavigationBindings,
            button: HTMLDOMElement
        ): void {
            const navigation = this,
                chart = navigation.chart,
                annotations: Array<Highcharts.AnnotationsOptions> = [],
                indicators: Array<DeepPartial<SeriesTypeOptions>> = [],
                flags: Array<DeepPartial<SeriesTypeOptions>> = [],
                yAxes: Array<YAxisOptions> = [];

            chart.annotations.forEach(function (
                annotation: Annotation,
                index: number
            ): void {
                annotations[index] = annotation.userOptions;
            });

            chart.series.forEach(function (series): void {
                if (series.is('sma')) {
                    indicators.push(series.userOptions);
                } else if (series.type === 'flags') {
                    flags.push(series.userOptions);
                }
            });

            chart.yAxis.forEach(function (yAxis: AxisType): void {
                if (bindingsUtils.isNotNavigatorYAxis(yAxis)) {
                    yAxes.push(yAxis.options);
                }
            });

            H.win.localStorage.setItem(
                PREFIX + 'chart',
                JSON.stringify({
                    annotations: annotations,
                    indicators: indicators,
                    flags: flags,
                    yAxes: yAxes
                })
            );

            fireEvent(
                this,
                'deselectButton',
                { button: button }
            );
        }
    }
};

setOptions({
    navigation: {
        bindings: stockToolsBindings
    }
});

NavigationBindings.prototype.utils = merge(
    bindingsUtils,
    NavigationBindings.prototype.utils
);
