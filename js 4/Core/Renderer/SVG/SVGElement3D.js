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
import Color from '../../Color/Color.js';
var color = Color.parse;
import SVGElement from './SVGElement.js';
import U from '../../Utilities.js';
var defined = U.defined, merge = U.merge, objectEach = U.objectEach, pick = U.pick;
/* *
 *
 *  Constants
 *
 * */
var SVGElement3D = {};
SVGElement3D.base = {
    /* eslint-disable valid-jsdoc */
    /**
     * The init is used by base - renderer.Element
     * @private
     */
    initArgs: function (args) {
        var elem3d = this, renderer = elem3d.renderer, paths = renderer[elem3d.pathType + 'Path'](args), zIndexes = paths.zIndexes;
        // build parts
        elem3d.parts.forEach(function (part) {
            var attribs = {
                'class': 'highcharts-3d-' + part,
                zIndex: zIndexes[part] || 0
            };
            if (renderer.styledMode) {
                if (part === 'top') {
                    attribs.filter = 'url(#highcharts-brighter)';
                }
                else if (part === 'side') {
                    attribs.filter = 'url(#highcharts-darker)';
                }
            }
            elem3d[part] = renderer.path(paths[part])
                .attr(attribs)
                .add(elem3d);
        });
        elem3d.attr({
            'stroke-linejoin': 'round',
            zIndex: zIndexes.group
        });
        // store original destroy
        elem3d.originalDestroy = elem3d.destroy;
        elem3d.destroy = elem3d.destroyParts;
        // Store information if any side of element was rendered by force.
        elem3d.forcedSides = paths.forcedSides;
    },
    /**
     * Single property setter that applies options to each part
     * @private
     */
    singleSetterForParts: function (prop, val, values, verb, duration, complete) {
        var elem3d = this, newAttr = {}, optionsToApply = [null, null, (verb || 'attr'), duration, complete], hasZIndexes = values && values.zIndexes;
        if (!values) {
            newAttr[prop] = val;
            optionsToApply[0] = newAttr;
        }
        else {
            // It is needed to deal with the whole group zIndexing
            // in case of graph rotation
            if (hasZIndexes && hasZIndexes.group) {
                this.attr({
                    zIndex: hasZIndexes.group
                });
            }
            objectEach(values, function (partVal, part) {
                newAttr[part] = {};
                newAttr[part][prop] = partVal;
                // include zIndexes if provided
                if (hasZIndexes) {
                    newAttr[part].zIndex = values.zIndexes[part] || 0;
                }
            });
            optionsToApply[1] = newAttr;
        }
        return elem3d.processParts.apply(elem3d, optionsToApply);
    },
    /**
     * Calls function for each part. Used for attr, animate and destroy.
     * @private
     */
    processParts: function (props, partsProps, verb, duration, complete) {
        var elem3d = this;
        elem3d.parts.forEach(function (part) {
            // if different props for different parts
            if (partsProps) {
                props = pick(partsProps[part], false);
            }
            // only if something to set, but allow undefined
            if (props !== false) {
                elem3d[part][verb](props, duration, complete);
            }
        });
        return elem3d;
    },
    /**
     * Destroy all parts
     * @private
     */
    destroyParts: function () {
        this.processParts(null, null, 'destroy');
        return this.originalDestroy();
    }
    /* eslint-enable valid-jsdoc */
};
SVGElement3D.cuboid = merge(SVGElement3D.base, {
    parts: ['front', 'top', 'side'],
    pathType: 'cuboid',
    attr: function (args, val, complete, continueAnimation) {
        // Resolve setting attributes by string name
        if (typeof args === 'string' && typeof val !== 'undefined') {
            var key = args;
            args = {};
            args[key] = val;
        }
        if (args.shapeArgs || defined(args.x)) {
            return this.singleSetterForParts('d', null, this.renderer[this.pathType + 'Path'](args.shapeArgs || args));
        }
        return SVGElement.prototype.attr.call(this, args, void 0, complete, continueAnimation);
    },
    animate: function (args, duration, complete) {
        if (defined(args.x) && defined(args.y)) {
            var paths = this.renderer[this.pathType + 'Path'](args), forcedSides = paths.forcedSides;
            this.singleSetterForParts('d', null, paths, 'animate', duration, complete);
            this.attr({
                zIndex: paths.zIndexes.group
            });
            // If sides that are forced to render changed, recalculate colors.
            if (forcedSides !== this.forcedSides) {
                this.forcedSides = forcedSides;
                if (!this.renderer.styledMode) {
                    SVGElement3D.cuboid.fillSetter.call(this, this.fill);
                }
            }
        }
        else {
            SVGElement.prototype.animate.call(this, args, duration, complete);
        }
        return this;
    },
    fillSetter: function (fill) {
        var elem3d = this;
        elem3d.forcedSides = elem3d.forcedSides || [];
        elem3d.singleSetterForParts('fill', null, {
            front: fill,
            // Do not change color if side was forced to render.
            top: color(fill).brighten(elem3d.forcedSides.indexOf('top') >= 0 ? 0 : 0.1).get(),
            side: color(fill).brighten(elem3d.forcedSides.indexOf('side') >= 0 ? 0 : -0.1).get()
        });
        // fill for animation getter (#6776)
        elem3d.color = elem3d.fill = fill;
        return elem3d;
    }
});
/* *
 *
 *  Default Export
 *
 * */
export default SVGElement3D;
