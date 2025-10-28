/* *
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

import type {
    ControllableLabelOptions
} from '../Controllables/ControllableOptions';
import type ColorType from '../../../Core/Color/ColorType';

import Annotation from '../Annotation.js';
import CrookedLine from './CrookedLine.js';
import D from '../../../Core/Defaults.js';
const { defaultOptions } = D;
import U from '../../../Core/Utilities.js';
import { Palette } from '../../../Core/Color/Palettes';
const { merge } = U;

if (defaultOptions.annotations) {
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
         * @requires     modules/annotations-advanced
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
                overflow: 'none' as any,
                type: 'rect',
                backgroundColor: 'none',
                borderWidth: 0,
                y: -5,
                style: {
                    color: Palette.neutralColor80
                }
            } as any
        }
    );
}

/* *
 *
 *  Class
 *
 * */

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
                label = this.initLabel(merge(
                    point.label, {
                        text: typeOptions.labels[i],
                        point: function (target: any): any {
                            return target.annotation.points[i];
                        }
                    }
                ), false as any);

            point.label = label.options;
        });
    }
}

/* *
 *
 *  Class Prototype
 *
 * */

interface ElliottWave {

}

/* *
 *
 *  Class Namespace
 *
 * */

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
