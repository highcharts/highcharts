/* *
 *
 *  Timeline Series.
 *
 *  (c) 2010-2021 Highsoft AS
 *
 *  Author: Daniel Studencki
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

import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import type TimelineDataLabelOptions from './TimelineDataLabelOptions';
import type TimelinePointOptions from './TimelinePointOptions';
import type TimelineSeries from './TimelineSeries';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
const {
    series: Series,
    seriesTypes: {
        pie: {
            prototype: {
                pointClass: PiePoint
            }
        }
    }
} = SeriesRegistry;
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import U from '../../Core/Utilities.js';
const {
    defined,
    isNumber,
    merge,
    objectEach,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

class TimelinePoint extends Series.prototype.pointClass {

    /* *
     *
     *  Properties
     *
     * */

    public label?: string;

    public options: TimelinePointOptions = void 0 as any;

    public series: TimelineSeries = void 0 as any;

    public userDLOptions?: TimelineDataLabelOptions;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    public alignConnector(): void {
        var point = this,
            series = point.series,
            connector: SVGElement = point.connector as any,
            dl: SVGElement = point.dataLabel as any,
            dlOptions = (point.dataLabel as any).options = merge(
                series.options.dataLabels,
                point.options.dataLabels
            ),
            chart = point.series.chart,
            bBox = connector.getBBox(),
            plotPos = {
                x: bBox.x + dl.translateX,
                y: bBox.y + dl.translateY
            },
            isVisible;

        // Include a half of connector width in order to run animation,
        // when connectors are aligned to the plot area edge.
        if (chart.inverted) {
            plotPos.y -= dl.options.connectorWidth / 2;
        } else {
            plotPos.x += dl.options.connectorWidth / 2;
        }

        isVisible = chart.isInsidePlot(
            plotPos.x, plotPos.y
        );

        connector[isVisible ? 'animate' : 'attr']({
            d: point.getConnectorPath()
        });

        if (!series.chart.styledMode) {
            connector.attr({
                stroke: dlOptions.connectorColor || point.color,
                'stroke-width': dlOptions.connectorWidth,
                opacity: dl[
                    defined(dl.newOpacity) ? 'newOpacity' : 'opacity'
                ]
            });
        }
    }

    public drawConnector(): void {
        var point = this,
            series = point.series;

        if (!point.connector) {
            point.connector = series.chart.renderer
                .path(point.getConnectorPath())
                .attr({
                    zIndex: -1
                })
                .add(point.dataLabel);
        }

        if (point.series.chart.isInsidePlot( // #10507
            (point.dataLabel as any).x, (point.dataLabel as any).y
        )) {
            point.alignConnector();
        }
    }

    public getConnectorPath(): SVGPath {
        var point = this,
            chart = point.series.chart,
            xAxisLen = point.series.xAxis.len,
            inverted = chart.inverted,
            direction = inverted ? 'x2' : 'y2',
            dl: SVGElement = point.dataLabel as any,
            targetDLPos = dl.targetPosition,
            coords: Record<string, (number|string)> = {
                x1: point.plotX as any,
                y1: point.plotY as any,
                x2: point.plotX as any,
                y2: isNumber(targetDLPos.y) ? targetDLPos.y : dl.y
            },
            negativeDistance = (
                (dl.alignAttr || dl)[direction[0]] <
                    point.series.yAxis.len / 2
            ),
            path: SVGPath;

        // Recalculate coords when the chart is inverted.
        if (inverted) {
            coords = {
                x1: point.plotY as any,
                y1: xAxisLen - (point.plotX as any),
                x2: targetDLPos.x || dl.x,
                y2: xAxisLen - (point.plotX as any)
            };
        }

        // Subtract data label width or height from expected coordinate so
        // that the connector would start from the appropriate edge.
        if (negativeDistance) {
            coords[direction] += dl[inverted ? 'width' : 'height'];
        }

        // Change coordinates so that they will be relative to data label.
        objectEach(coords, function (
            _coord: (number|string),
            i: string
        ): void {
            (coords[i] as any) -= (dl.alignAttr || dl)[i[0]];
        });

        path = chart.renderer.crispLine(
            [
                ['M', coords.x1, coords.y1],
                ['L', coords.x2, coords.y2]
            ] as SVGPath,
            dl.options.connectorWidth
        );

        return path;
    }

    public init(): TimelinePoint {
        var point: TimelinePoint = super.init.apply(this, arguments) as any;

        point.name = pick(point.name, 'Event');
        point.y = 1;

        return point;
    }

    public isValid(): boolean {
        return this.options.y !== null;
    }

    public setState(): void {
        var proceed = super.setState;

        // Prevent triggering the setState method on null points.
        if (!this.isNull) {
            proceed.apply(this, arguments);
        }
    }

    public setVisible(
        visible: boolean,
        redraw?: boolean
    ): void {
        var point = this,
            series = point.series;

        redraw = pick(redraw, series.options.ignoreHiddenPoint);

        PiePoint.prototype.setVisible.call(point, visible, false);
        // Process new data
        series.processData();

        if (redraw) {
            series.chart.redraw();
        }
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Default Export
 *
 * */

export default TimelinePoint;
