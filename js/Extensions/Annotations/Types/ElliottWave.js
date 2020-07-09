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
import CrookedLine from './CrookedLine.js';
import U from '../../../Core/Utilities.js';
var merge = U.merge;
/* eslint-disable no-invalid-this, valid-jsdoc */
var ElliottWave = /** @class */ (function (_super) {
    __extends(ElliottWave, _super);
    function ElliottWave(chart, options) {
        return _super.call(this, chart, options) || this;
    }
    /* *
     *
     * Functions
     *
     * */
    ElliottWave.prototype.addLabels = function () {
        this.getPointsOptions().forEach(function (point, i) {
            var typeOptions = this.options.typeOptions, label = this.initLabel(merge(point.label, {
                text: typeOptions.labels[i],
                point: function (target) {
                    return target.annotation.points[i];
                }
            }), false);
            point.label = label.options;
        }, this);
    };
    return ElliottWave;
}(CrookedLine));
ElliottWave.prototype.defaultOptions = merge(CrookedLine.prototype.defaultOptions, 
/**
 * An elliott wave annotation.
 *
 * @sample highcharts/annotations-advanced/elliott-wave/
 *         Elliott wave
 *
 * @extends      annotations.crookedLine
 * @product      highstock
 * @optionparent annotations.elliottWave
 */
{
    typeOptions: {
        /**
         * @extends   annotations.crookedLine.labelOptions
         * @apioption annotations.elliottWave.typeOptions.points.label
         */
        /**
         * @ignore-options
         */
        labels: ['(0)', '(A)', '(B)', '(C)', '(D)', '(E)'],
        line: {
            strokeWidth: 1
        }
    },
    labelOptions: {
        align: 'center',
        allowOverlap: true,
        crop: true,
        overflow: 'none',
        type: 'rect',
        backgroundColor: 'none',
        borderWidth: 0,
        y: -5
    }
});
Annotation.types.elliottWave = ElliottWave;
export default ElliottWave;
