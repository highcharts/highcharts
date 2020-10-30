/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type ColorType from '../../../Core/Color/ColorType';
import Annotation from '../Annotations.js';
import CrookedLine from './CrookedLine.js';
import U from '../../../Core/Utilities.js';
const {
    merge
} = U;

/**
 * Internal types.
 * @private
 */
declare global {
    namespace Highcharts {
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
        interface AnnotationTypesRegistry {
            elliottWave: typeof ElliottWave;
        }
    }
}

/* eslint-disable no-invalid-this, valid-jsdoc */

class ElliottWave extends CrookedLine {
    public constructor(chart: Highcharts.AnnotationChart, options: Highcharts.AnnotationElliottWaveOptionsObject) {
        super(chart, options);
    }

    /* *
     *
     * Functions
     *
     * */
    public addLabels(): void {
        this.getPointsOptions().forEach(function (
            this: ElliottWave,
            point: Highcharts.AnnotationMockPointOptionsObject,
            i: number
        ): void {
            var typeOptions = this.options.typeOptions as Highcharts.AnnotationElliottWaveTypeOptionsObject,
                label = this.initLabel(merge(
                    point.label, {
                        text: typeOptions.labels[i],
                        point: function (target: any): any {
                            return target.annotation.points[i];
                        }
                    }
                ), false as any);

            point.label = label.options;
        }, this);
    }
}

interface ElliottWave {
    defaultOptions: CrookedLine['defaultOptions'];
}

ElliottWave.prototype.defaultOptions = merge(
    CrookedLine.prototype.defaultOptions,
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
    }
);

Annotation.types.elliottWave = ElliottWave;

export default ElliottWave;
