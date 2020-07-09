/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import Annotation from '../Annotations.js';
import MockPoint from '../MockPoint.js';
import U from '../../../Core/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
var VerticalLine = /** @class */ (function (_super) {
    __extends(VerticalLine, _super);
    /* *
     *
     *  Constructors
     *
     * */
    function VerticalLine(chart, userOptions) {
        return _super.call(this, chart, userOptions) || this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    VerticalLine.connectorFirstPoint = function (target) {
        var annotation = target.annotation, point = annotation.points[0], xy = MockPoint.pointToPixels(point, true), y = xy.y, offset = annotation.options.typeOptions.label.offset;
        if (annotation.chart.inverted) {
            y = xy.x;
        }
        return {
            x: point.x,
            xAxis: point.series.xAxis,
            y: y + offset
        };
    };
    VerticalLine.connectorSecondPoint = function (target) {
        var annotation = target.annotation, typeOptions = annotation.options.typeOptions, point = annotation.points[0], yOffset = typeOptions.yOffset, xy = MockPoint.pointToPixels(point, true), y = xy[annotation.chart.inverted ? 'x' : 'y'];
        if (typeOptions.label.offset < 0) {
            yOffset *= -1;
        }
        return {
            x: point.x,
            xAxis: point.series.xAxis,
            y: y + yOffset
        };
    };
    /* *
     *
     *  Functions
     *
     * */
    VerticalLine.prototype.getPointsOptions = function () {
        return [this.options.typeOptions.point];
    };
    VerticalLine.prototype.addShapes = function () {
        var typeOptions = this.options.typeOptions, connector = this.initShape(merge(typeOptions.connector, {
            type: 'path',
            points: [
                VerticalLine.connectorFirstPoint,
                VerticalLine.connectorSecondPoint
            ]
        }), false);
        typeOptions.connector = connector.options;
    };
    VerticalLine.prototype.addLabels = function () {
        var typeOptions = this.options.typeOptions, labelOptions = typeOptions.label, x = 0, y = labelOptions.offset, verticalAlign = labelOptions.offset < 0 ? 'bottom' : 'top', align = 'center';
        if (this.chart.inverted) {
            x = labelOptions.offset;
            y = 0;
            verticalAlign = 'middle';
            align = labelOptions.offset < 0 ? 'right' : 'left';
        }
        var label = this.initLabel(merge(labelOptions, {
            verticalAlign: verticalAlign,
            align: align,
            x: x,
            y: y
        }));
        typeOptions.label = label.options;
    };
    return VerticalLine;
}(Annotation));
VerticalLine.prototype.defaultOptions = merge(Annotation.prototype.defaultOptions, 
/**
 * A vertical line annotation.
 *
 * @sample highcharts/annotations-advanced/vertical-line/
 *         Vertical line
 *
 * @extends      annotations.crookedLine
 * @excluding    labels, shapes, controlPointOptions
 * @product      highstock
 * @optionparent annotations.verticalLine
 */
{
    typeOptions: {
        /**
         * @ignore
         */
        yOffset: 10,
        /**
         * Label options.
         *
         * @extends annotations.crookedLine.labelOptions
         */
        label: {
            offset: -40,
            point: function (target) {
                return target.annotation.points[0];
            },
            allowOverlap: true,
            backgroundColor: 'none',
            borderWidth: 0,
            crop: true,
            overflow: 'none',
            shape: 'rect',
            text: '{y:.2f}'
        },
        /**
         * Connector options.
         *
         * @extends   annotations.crookedLine.shapeOptions
         * @excluding height, r, type, width
         */
        connector: {
            strokeWidth: 1,
            markerEnd: 'arrow'
        }
    }
});
Annotation.types.verticalLine = VerticalLine;
export default VerticalLine;
