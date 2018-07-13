'use strict';
import H from '../../parts/Globals.js';
import '../../parts/Utilities.js';

var Annotation = H.Annotation,
    CrookedLine = Annotation.types['crooked-line'];

/**
 * @class
 * @extends Annotation.CrookedLine
 * @memberOf Annotation
 */
function ElliottWave() {
    CrookedLine.apply(this, arguments);
}

H.extendAnnotation(ElliottWave, CrookedLine, /** Annotation.CrookedLine# */ {
    addLabels: function () {
        H.each(this.getPointsOptions(), function (point, i) {
            var label = this.initLabel(H.merge(
                point.label, {
                    text: this.options.typeOptions.labels[i],
                    point: function (target) {
                        return target.annotation.points[i];
                    }
                }
            ), false);

            point.label = label.options;
        }, this);
    }
},
    /**
     * An elliott wave annotation.
     *
     * @extends annotations.crooked-line
     * @sample highcharts/annotations-advanced/elliott-wave/
     *         Elliott wave
     * @optionparent annotations.elliott-wave
     */
    {
        typeOptions: {
            /**
             * @type {Object}
             * @extends annotations.base.labelOptions
             * @apioption annotations.crooked-line.typeOptions.points.label
             */

            /**
             * @ignore
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

Annotation.types['elliott-wave'] = ElliottWave;

export default ElliottWave;
