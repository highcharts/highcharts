/**
 * @license Highcharts JS v@product.version@ (@product.date@)
 * @module highcharts/highcharts
 *
 * (c) 2009-2024 Torstein Honsi
 *
 * License: www.highcharts.com/license
 */
'use strict';
declare global {
    interface Math {
        sign(x: number): number;
    }
    interface ObjectConstructor {
        setPrototypeOf<T>(o: T, proto: object | null): T;
    }
}
// Loads polyfills as a module to force them to load first.
import './polyfills.js';
import Highcharts from '../masters/highcharts.src.js';
import MSPointer from '../Core/MSPointer.js';
import ShadowOptionsObject from '../Core/Renderer/ShadowOptionsObject.js';
const G: AnyRecord = Highcharts;
if (MSPointer.isRequired()) {
    G.Pointer = MSPointer;
    MSPointer.compose(G.Chart);
}
// SVG 1.1 shadow filter override, IE11 compatible. #21098
G.SVGRenderer.getShadowFilterContent = function (
    options: ShadowOptionsObject
): any[] {
    return [
        {
            tagName: 'feFlood',
            attributes: {
                "flood-color": options.color,
                "flood-opacity": options.opacity,
                result: 'flood'
            }
        },
        {
            tagName: 'feComposite',
            attributes: {
                in: 'flood',
                in2: 'SourceAlpha',
                operator: 'in',
                result: 'shadowColor'
            }
        },
        {
            tagName: 'feOffset',
            attributes: {
                dx: options.offsetX,
                dy: options.offsetY,
                result: 'offsetShadow'
            }
        },
        {
            tagName: 'feGaussianBlur',
            attributes: {
            in: 'offsetShadow',
                stdDeviation: options.width / 2,
                result: 'offsetShadow'
            }
        },
        {
            tagName: 'feMerge',
            children: [
                { tagName: 'feMergeNode', attributes: { in: 'blurredShadow' } },
                { tagName: 'feMergeNode', attributes: { in: 'SourceGraphic' } }
            ]
        }
    ];
};
// Default Export
export default G;
