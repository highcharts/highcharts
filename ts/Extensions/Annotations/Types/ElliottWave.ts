/* *
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type AnnotationChart from '../AnnotationChart';
import type {
    ControllableLabelOptions
} from '../Controllables/ControllableOptions';
import type ColorType from '../../../Core/Color/ColorType';
import type MockPointOptions from '../MockPointOptions';

import Annotation from '../Annotation.js';
import CrookedLine from './CrookedLine.js';
import U from '../../../Core/Utilities.js';
const { merge } = U;

/* eslint-disable no-invalid-this, valid-jsdoc */

class ElliottWave extends CrookedLine {
    public constructor(
        chart: AnnotationChart,
        options: ElliottWave.Options
    ) {
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
            point: MockPointOptions,
            i: number
        ): void {
            const typeOptions = (
                    this.options.typeOptions as ElliottWave.TypeOptions
                ),
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
             * @ignore-option
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

namespace ElliottWave {
    export interface LabelOptions extends ControllableLabelOptions {
        backgroundColor: ColorType;
        borderWidth: number;
        y: number;
    }
    export interface Options extends CrookedLine.Options {
        labelOptions: LabelOptions;
        typeOptions: TypeOptions;
    }
    export interface TypeOptions extends CrookedLine.TypeOptions {
        labels: Array<string>;
    }
}

/* *
 *
 *  Registry
 *
 * */
Annotation.types.elliottWave = ElliottWave;
declare module './AnnotationType'{
    interface AnnotationTypeRegistry {
        elliottWave: typeof ElliottWave;
    }
}

/* *
 *
 *  Default Export
 *
 * */
export default ElliottWave;
