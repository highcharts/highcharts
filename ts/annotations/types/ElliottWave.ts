/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';
import H from '../../parts/Globals.js';

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
        class AnnotationElliottWave extends CrookedLine {
            public options: AnnotationElliottWaveOptionsObject;
        }
        interface AnnotationElliottWaveLabelOptionsObject extends AnnotationsLabelOptions {
            backgroundColor: ColorType;
            borderWidth: number;
            y: number;
        }
        interface AnnotationElliottWaveOptionsObject extends AnnotationCrookedLineOptionsObject {
            labelOptions: AnnotationElliottWaveLabelOptionsObject;
            typeOptions: AnnotationElliottWaveTypeOptionsObject;
        }
        interface AnnotationElliottWaveTypeOptionsObject extends AnnotationCrookedLineTypeOptionsObject {
            labels: Array<string>;
        }
        interface AnnotationMockPointOptionsObject {
            label?: AnnotationsLabelOptions;
        }
        interface AnnotationTypesDictionary {
            elliottWave: typeof ElliottWave;
        }
    }
}


import '../../parts/Utilities.js';

var Annotation = H.Annotation,
    CrookedLine = Annotation.types.crookedLine;

/* eslint-disable no-invalid-this, valid-jsdoc */

const ElliottWave: typeof Highcharts.AnnotationElliottWave = function (this: Highcharts.AnnotationCrookedLine): void {
    CrookedLine.apply(this, arguments as any);
} as any;

H.extendAnnotation(ElliottWave, CrookedLine,
    {
        addLabels: function (this: Highcharts.AnnotationElliottWave): void {
            this.getPointsOptions().forEach(function (
                this: Highcharts.AnnotationElliottWave,
                point: Highcharts.AnnotationMockPointOptionsObject,
                i: number
            ): void {
                var label = this.initLabel(H.merge(
                    point.label, {
                        text: this.options.typeOptions.labels[i],
                        point: function (target: any): any {
                            return target.annotation.points[i];
                        }
                    }
                ), false as any);

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
            overflow: 'none' as any,
            type: 'rect',
            backgroundColor: 'none',
            borderWidth: 0,
            y: -5
        }
    });

Annotation.types.elliottWave = ElliottWave;

export default ElliottWave;
