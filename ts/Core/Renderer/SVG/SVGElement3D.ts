/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  Extensions to the SVGRenderer class to enable 3D shapes
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

import type AnimationOptions from '../../Animation/AnimationOptions';
import type ColorType from '../../Color/ColorType';
import type SVGArc3D from './SVGArc3D';
import type SVGAttributes3D from './SVGAttributes3D';
import type SVGCuboid from './SVGCuboid';
import type SVGPath from './SVGPath';
import type SVGRenderer3D from './SVGRenderer3D';

import Color from '../../Color/Color.js';
const { parse: color } = Color;
import RendererRegistry from '../RendererRegistry.js';
const {
    Element: SVGElement
} = RendererRegistry.getRendererType().prototype;
import U from '../../Utilities.js';
const {
    defined,
    pick
} = U;

/* *
 *
 *  Class
 *
 * */

class SVGElement3D extends SVGElement {

    /* *
     *
     *  Static Properties
     *
     * */

    public static types: Record<string, typeof SVGElement3D> = {
        base: SVGElement3D,
        cuboid: SVGElement3D
    };

    /* *
     *
     *  Properties
     *
     * */

    public parts = ['front', 'top', 'side'];

    public pathType = 'cuboid';

    /* *
     *
     *  Functions
     *
     * */

    /**
     * The init is used by base - renderer.Element
     * @private
     */
    public initArgs(
        args: SVGAttributes3D
    ): void {
        const elem3d = this,
            renderer = elem3d.renderer,
            paths: (SVGArc3D|SVGCuboid) =
                (renderer as any)[elem3d.pathType + 'Path'](args),
            zIndexes = (paths as any).zIndexes;

        // build parts
        for (const part of elem3d.parts) {
            const attribs: SVGAttributes3D = {
                'class': 'highcharts-3d-' + part,
                zIndex: zIndexes[part] || 0
            };
            if (renderer.styledMode) {
                if (part === 'top') {
                    attribs.filter = 'url(#highcharts-brighter)';
                } else if (part === 'side') {
                    attribs.filter = 'url(#highcharts-darker)';
                }
            }
            elem3d[part] = renderer.path((paths as any)[part])
                .attr(attribs)
                .add(elem3d);
        }

        elem3d.attr({
            'stroke-linejoin': 'round',
            zIndex: zIndexes.group
        });

        // Store information if any side of element was rendered by force.
        elem3d.forcedSides = (paths as any).forcedSides;

    }

    /**
     * Single property setter that applies options to each part
     * @private
     */
    public singleSetterForParts(
        prop: string,
        val: any,
        values?: AnyRecord,
        verb?: string,
        duration?: any,
        complete?: any
    ): this {
        const elem3d = this,
            newAttr = {} as AnyRecord,
            optionsToApply = [null, null, (verb || 'attr'), duration, complete],
            hasZIndexes = values && values.zIndexes;

        if (!values) {
            newAttr[prop] = val;
            optionsToApply[0] = newAttr;
        } else {
            // It is needed to deal with the whole group zIndexing
            // in case of graph rotation
            if (hasZIndexes && hasZIndexes.group) {
                elem3d.attr({
                    zIndex: hasZIndexes.group
                });
            }
            for (const part of Object.keys(values)) {
                newAttr[part] = {};
                newAttr[part][prop] = values[part];

                // include zIndexes if provided
                if (hasZIndexes) {
                    newAttr[part].zIndex = values.zIndexes[part] || 0;
                }
            }
            optionsToApply[1] = newAttr;
        }

        return this.processParts.apply(elem3d, optionsToApply as any);
    }

    /**
     * Calls function for each part. Used for attr, animate and destroy.
     * @private
     */
    public processParts(
        props: any,
        partsProps: (AnyRecord|null),
        verb: string,
        duration?: any,
        complete?: any
    ): this {
        const elem3d = this;

        for (const part of elem3d.parts) {
            // if different props for different parts
            if (partsProps) {
                props = pick(partsProps[part], false);
            }

            // only if something to set, but allow undefined
            if (props !== false) {
                elem3d[part][verb](props, duration, complete);
            }
        }
        return elem3d;
    }

    /**
     * Destroy all parts
     * @private
     */
    public destroy(): undefined {
        this.processParts(null, null, 'destroy');
        return super.destroy();
    }

    // Following functions are SVGElement3DCuboid (= base)

    public attr(
        args: (string|SVGAttributes3D),
        val?: (number|string|ColorType|SVGPath),
        complete?: Function,
        continueAnimation?: boolean
    ): (number|string|this) {
        // Resolve setting attributes by string name
        if (typeof args === 'string' && typeof val !== 'undefined') {
            const key = args;

            args = {} as SVGAttributes3D;
            (args as any)[key] = val;
        }

        if ((args as any).shapeArgs || defined((args as any).x)) {
            return this.singleSetterForParts(
                'd',
                null,
                (this.renderer as any)[this.pathType + 'Path'](
                    (args as any).shapeArgs || args
                )
            );
        }

        return super.attr(args as any, void 0, complete, continueAnimation);
    }

    public animate(
        args: SVGAttributes3D,
        duration?: (boolean|Partial<AnimationOptions>),
        complete?: Function
    ): this {
        if (defined(args.x) && defined(args.y)) {
            const paths = (this.renderer as any)[this.pathType + 'Path'](args),
                forcedSides = paths.forcedSides;
            this.singleSetterForParts(
                'd', null, paths, 'animate', duration, complete
            );

            this.attr({
                zIndex: paths.zIndexes.group
            });

            // If sides that are forced to render changed, recalculate colors.
            if (forcedSides !== this.forcedSides) {
                this.forcedSides = forcedSides;
                if (!this.renderer.styledMode) {
                    this.fillSetter(this.fill);
                }
            }
        } else {
            super.animate(args, duration, complete);
        }
        return this;
    }

    public fillSetter(
        fill: ColorType
    ): this {
        const elem3d = this;

        elem3d.forcedSides = elem3d.forcedSides || [];
        elem3d.singleSetterForParts('fill', null, {
            front: fill,
            // Do not change color if side was forced to render.
            top: color(fill).brighten(
                elem3d.forcedSides.indexOf('top') >= 0 ? 0 : 0.1
            ).get(),
            side: color(fill).brighten(
                elem3d.forcedSides.indexOf('side') >= 0 ? 0 : -0.1
            ).get()
        });

        // fill for animation getter (#6776)
        elem3d.color = elem3d.fill = fill;

        return elem3d;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface SVGElement3D {
    renderer: SVGRenderer3D.Composition;
    add(parent?: SVGElement3D): this;
    attr(key: string): (number|string);
    attr(
        key: string,
        val: (number|string|ColorType|SVGPath),
        complete?: Function,
        continueAnimation?: boolean
    ): this;
    attr(
        hash: SVGAttributes3D,
        val?: undefined,
        complete?: Function,
        continueAnimation?: boolean
    ): this;
}

/* *
 *
 *  Default Export
 *
 * */

export default SVGElement3D;
