/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from '../../parts/Globals.js';
import U from '../../parts/Utilities.js';
var merge = U.merge;
var Annotation = H.Annotation, CrookedLine = Annotation.types.crookedLine;
/* eslint-disable no-invalid-this, valid-jsdoc */
var ElliottWave = function () {
    CrookedLine.apply(this, arguments);
};
H.extendAnnotation(ElliottWave, CrookedLine, {
    addLabels: function () {
        this.getPointsOptions().forEach(function (point, i) {
            var label = this.initLabel(merge(point.label, {
                text: this.options.typeOptions.labels[i],
                point: function (target) {
                    return target.annotation.points[i];
                }
            }), false);
            point.label = label.options;
        }, this);
    }
}, 
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
