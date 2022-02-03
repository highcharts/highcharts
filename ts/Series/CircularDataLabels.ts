/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
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


import type SunburstSeries from './Sunburst/SunburstSeries.js';
import type SunburstDataLabelOptions from '../Series/Sunburst/SunburstDataLabelOptions';
import type DependencyWheelSeries from './DependencyWheel/DependencyWheelSeries.js';

import U from '../Core/Utilities.js';
const {
    isNumber,
    isObject,
    merge,
    splat
} = U;

/* *
 *
 *  Composition
 *
 * */

namespace CircularDataLabels {

    /* *
     *
     *  Declarations
     *
     * */
    export interface CicrularDlOptionsParams extends SunburstSeries.DlOptionsParams {

    }

    export interface CicrularDlOptions extends SunburstDataLabelOptions {

    }

    /* *
     *
     *  Constants
     *
     * */

    const rad2deg = 180 / Math.PI;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /** @private */
    export function compose(
        circularSeries: typeof SunburstSeries|DependencyWheelSeries
    ): void {

        (circularSeries as any).prototype.getDlOptions = getDlOptions;
    }

    function getDlOptions(
        params: CicrularDlOptionsParams
    ): any {
        // Set options to new object to avoid problems with scope
        let point = params.point,
            shape: Partial<SunburstSeries.NodeValuesObject> =
                isObject(params.shapeArgs) ? params.shapeArgs : {},
            optionsPoint = (
                isObject(params.optionsPoint) ?
                    params.optionsPoint.dataLabels :
                    {}
            ),
            // The splat was used because levels dataLabels
            // options doesn't work as an array
            optionsLevel = splat(
                isObject(params.level) ?
                    params.level.dataLabels :
                    {}
            )[0],
            optionsSeries = point.series.options.dataLabels,
            options = merge<CicrularDlOptions>(
                {
                    style: {}
                },
                optionsSeries,
                optionsLevel,
                optionsPoint
            ),
            rotationRad: (number|undefined),
            rotation: (number|undefined),
            rotationMode = options.rotationMode;

        if (!isNumber(options.rotation)) {
            if (rotationMode === 'auto' || rotationMode === 'circular') {
                if (
                    (point.innerArcLength as any) < 1 &&
                    (point.outerArcLength as any) > (shape.radius as any)
                ) {
                    rotationRad = 0;
                    // Triger setTextPath function to get textOutline etc.
                    if (point.dataLabelPath && rotationMode === 'circular') {
                        options.textPath = {
                            enabled: true
                        };
                    }
                } else if (
                    (point.innerArcLength as any) > 1 &&
                    (point.outerArcLength as any) > 1.5 * (shape.radius as any)
                ) {
                    if (rotationMode === 'circular') {
                        options.textPath = {
                            enabled: true,
                            attributes: {
                                dy: 5
                            }
                        };
                    } else {
                        rotationMode = 'parallel';
                    }
                } else {
                    // Trigger the destroyTextPath function
                    if (
                        point.dataLabel &&
                        point.dataLabel.textPathWrapper &&
                        rotationMode === 'circular'
                    ) {
                        options.textPath = {
                            enabled: false
                        };
                    }
                    rotationMode = 'perpendicular';
                }
            }

            if (
                rotationMode !== 'auto' &&
                rotationMode !== 'circular' &&
                !options.textPath
            ) {
                rotationRad = (
                    (shape.end as any) -
                    ((shape.end as any) - (shape.start as any)) / 2
                );
            }

            if (rotationMode === 'parallel') {
                (options.style as any).width = Math.min(
                    (shape.radius as any) * 2.5,
                    ((point.outerArcLength as any) + point.innerArcLength) / 2
                );
            } else {
                (options.style as any).width = shape.radius;
            }

            if (
                rotationMode === 'perpendicular' &&
                point.series.chart.renderer.fontMetrics(
                    (options.style as any).fontSize
                ).h > (point.outerArcLength as any)
            ) {
                (options.style as any).width = 1;
            }

            // Apply padding (#8515)
            (options.style as any).width = Math.max(
                (options.style as any).width - 2 * (options.padding || 0),
                1
            );

            rotation = ((rotationRad as any) * rad2deg) % 180;
            if (rotationMode === 'parallel') {
                rotation -= 90;
            }

            // Prevent text from rotating upside down
            if (rotation > 90) {
                rotation -= 180;
            } else if (rotation < -90) {
                rotation += 180;
            }

            options.rotation = rotation;
        }

        if (options.textPath) {
            if (
                point.shapeExisting &&
                point.shapeExisting.innerR === 0 &&
                options.textPath.enabled
            ) {
                // Enable rotation to render text
                options.rotation = 0;
                // Center dataLabel - disable textPath
                options.textPath.enabled = false;
                // Setting width and padding
                (options.style as any).width = Math.max(
                    (point.shapeExisting.r * 2) -
                    2 * (options.padding || 0), 1);
            } else if (
                point.dlOptions &&
                point.dlOptions.textPath &&
                !point.dlOptions.textPath.enabled &&
                (rotationMode === 'circular')
            ) {
                // Bring dataLabel back if was a center dataLabel
                options.textPath.enabled = true;
            }
            if (options.textPath.enabled) {
                // Enable rotation to render text
                if (point.series.is('sunburst')) {
                    options.rotation = 0;
                }
                // Setting width and padding
                (options.style as any).width = Math.max(
                    ((point.outerArcLength as any) +
                    (point.innerArcLength as any)) / 2 -
                    2 * (options.padding || 0), 1);
            }
        }
        // NOTE: alignDataLabel positions the data label differntly when
        // rotation is 0. Avoiding this by setting rotation to a small number.
        if (options.rotation === 0) {
            options.rotation = 0.001;
        }
        return options;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default CircularDataLabels;
