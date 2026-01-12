/* *
 *
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type ColorType from '../../../Core/Color/ColorType';

import Annotation from '../Annotation.js';
import CrookedLine from './CrookedLine.js';
import D from '../../../Core/Defaults.js';
const { defaultOptions } = D;
import U from '../../../Core/Utilities.js';
import { AnnotationLabelOptionsOptions } from '../AnnotationOptions';
const { merge } = U;

if (defaultOptions.annotations?.types) {
    defaultOptions.annotations.types.elliottWave = merge(
        defaultOptions.annotations.types.crookedLine,
        /**
         * Options for the elliott wave annotation type.
         *
         * @sample highcharts/annotations-advanced/elliott-wave/
         *         Elliott wave
         *
         * @extends      annotations.types.crookedLine
         * @product      highstock
         * @optionparent annotations.types.elliottWave
         */
        {
            typeOptions: {

                /**
                 * @extends   annotations.types.crookedLine.labelOptions
                 * @apioption annotations.types.elliottWave.typeOptions.points.label
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
                overflow: 'none',
                type: 'rect',
                backgroundColor: 'none',
                borderWidth: 0,
                y: -5,
                style: {
                    color: 'var(--highcharts-neutralColor80)'
                }
            }
        }
    );
}

/* *
 *
 *  Class
 *
 * */

/** @internal */
class ElliottWave extends CrookedLine {

    /* *
     *
     * Functions
     *
     * */

    public addLabels(): void {
        this.getPointsOptions().forEach((point, i): void => {
            const typeOptions = (
                    this.options.typeOptions as ElliottWave.TypeOptions
                ),
                label = this.initLabel(
                    merge(
                        point.label,
                        {
                            text: typeOptions.labels[i],
                            point: function (target: any): any {
                                return target.annotation.points[i];
                            }
                        }
                    ),
                    false as any
                );

            point.label = label.options;
        });
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

/** @internal */
interface ElliottWave {

}

/* *
 *
 *  Class Namespace
 *
 * */

namespace ElliottWave {
    export interface LabelOptions extends AnnotationLabelOptionsOptions {
        backgroundColor: ColorType;
        borderWidth: number;
        y: number;
    }

    /**
     * Options for the elliott wave annotation type.
     *
     * @sample highcharts/annotations-advanced/elliott-wave/
     *         Elliott wave
     *
     * @extends      annotations.types.crookedLine
     * @product      highstock
     * @optionparent annotations.types.elliottWave
     */
    export interface Options extends CrookedLine.Options {
        labelOptions: LabelOptions;
        typeOptions: TypeOptions;
    }
    export interface TypeOptions extends CrookedLine.TypeOptions {
        /** @internal */
        labels: Array<string>;
    }
}

/* *
 *
 *  Registry
 *
 * */

/** @internal */
declare module './AnnotationType' {
    interface AnnotationTypeRegistry {
        elliottWave: typeof ElliottWave;
    }
}

Annotation.types.elliottWave = ElliottWave;

/* *
 *
 *  Default Export
 *
 * */

export default ElliottWave;
