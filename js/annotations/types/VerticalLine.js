/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import Annotation from '../annotations.src.js';
import H from '../../parts/Globals.js';
import MockPoint from '../MockPoint.js';
import U from '../../parts/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
var VerticalLine = function () {
    Annotation.apply(this, arguments);
};
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
H.extendAnnotation(VerticalLine, null, {
    getPointsOptions: function () {
        return [this.options.typeOptions.point];
    },
    addShapes: function () {
        var typeOptions = this.options.typeOptions, connector = this.initShape(merge(typeOptions.connector, {
            type: 'path',
            points: [
                VerticalLine.connectorFirstPoint,
                VerticalLine.connectorSecondPoint
            ]
        }), false);
        typeOptions.connector = connector.options;
    },
    addLabels: function () {
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
    }
}, 
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
