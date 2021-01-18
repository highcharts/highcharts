/* *
 *
 *  Imports
 *
 * */
import Color from '../../Core/Color/Color.js';
var color = Color.parse;
import H from '../../Core/Globals.js';
var charts = H.charts, _a = H.Renderer.prototype, cuboidPath = _a.cuboidPath, Elements3D = _a.elements3d;
import U from '../../Core/Utilities.js';
var error = U.error, extend = U.extend, merge = U.merge;
import '../../Core/Renderer/SVG/SVGRenderer.js';
/* *
 *
 *  Composition
 *
 * */
/* eslint-disable valid-jsdoc */
Elements3D.funnel3d = merge(Elements3D.cuboid, {
    parts: [
        'top', 'bottom',
        'frontUpper', 'backUpper',
        'frontLower', 'backLower',
        'rightUpper', 'rightLower'
    ],
    mainParts: ['top', 'bottom'],
    sideGroups: [
        'upperGroup', 'lowerGroup'
    ],
    sideParts: {
        upperGroup: ['frontUpper', 'backUpper', 'rightUpper'],
        lowerGroup: ['frontLower', 'backLower', 'rightLower']
    },
    pathType: 'funnel3d',
    // override opacity and color setters to control opacity
    opacitySetter: function (opacity) {
        var funnel3d = this, parts = funnel3d.parts, chart = H.charts[funnel3d.renderer.chartIndex], filterId = 'group-opacity-' + opacity + '-' + chart.index;
        // use default for top and bottom
        funnel3d.parts = funnel3d.mainParts;
        funnel3d.singleSetterForParts('opacity', opacity);
        // restore
        funnel3d.parts = parts;
        if (!chart.renderer.filterId) {
            chart.renderer.definition({
                tagName: 'filter',
                attributes: {
                    id: filterId
                },
                children: [{
                        tagName: 'feComponentTransfer',
                        children: [{
                                tagName: 'feFuncA',
                                attributes: {
                                    type: 'table',
                                    tableValues: '0 ' + opacity
                                }
                            }]
                    }]
            });
            funnel3d.sideGroups.forEach(function (groupName) {
                funnel3d[groupName].attr({
                    filter: 'url(#' + filterId + ')'
                });
            });
            // styled mode
            if (funnel3d.renderer.styledMode) {
                chart.renderer.definition({
                    tagName: 'style',
                    textContent: '.highcharts-' + filterId +
                        ' {filter:url(#' + filterId + ')}'
                });
                funnel3d.sideGroups.forEach(function (group) {
                    group.addClass('highcharts-' + filterId);
                });
            }
        }
        return funnel3d;
    },
    fillSetter: function (fill) {
        // extract alpha channel to use the opacitySetter
        var funnel3d = this, fillColor = color(fill), alpha = fillColor.rgba[3], partsWithColor = {
            // standard color for top and bottom
            top: color(fill).brighten(0.1).get(),
            bottom: color(fill).brighten(-0.2).get()
        };
        if (alpha < 1) {
            fillColor.rgba[3] = 1;
            fillColor = fillColor.get('rgb');
            // set opacity through the opacitySetter
            funnel3d.attr({
                opacity: alpha
            });
        }
        else {
            // use default for full opacity
            fillColor = fill;
        }
        // add gradient for sides
        if (!fillColor.linearGradient &&
            !fillColor.radialGradient &&
            funnel3d.gradientForSides) {
            fillColor = {
                linearGradient: { x1: 0, x2: 1, y1: 1, y2: 1 },
                stops: [
                    [0, color(fill).brighten(-0.2).get()],
                    [0.5, fill],
                    [1, color(fill).brighten(-0.2).get()]
                ]
            };
        }
        // gradient support
        if (fillColor.linearGradient) {
            // color in steps, as each gradient will generate a key
            funnel3d.sideGroups.forEach(function (sideGroupName) {
                var box = funnel3d[sideGroupName].gradientBox, gradient = fillColor.linearGradient, alteredGradient = merge(fillColor, {
                    linearGradient: {
                        x1: box.x + gradient.x1 * box.width,
                        y1: box.y + gradient.y1 * box.height,
                        x2: box.x + gradient.x2 * box.width,
                        y2: box.y + gradient.y2 * box.height
                    }
                });
                funnel3d.sideParts[sideGroupName].forEach(function (partName) {
                    partsWithColor[partName] = alteredGradient;
                });
            });
        }
        else {
            merge(true, partsWithColor, {
                frontUpper: fillColor,
                backUpper: fillColor,
                rightUpper: fillColor,
                frontLower: fillColor,
                backLower: fillColor,
                rightLower: fillColor
            });
            if (fillColor.radialGradient) {
                funnel3d.sideGroups.forEach(function (sideGroupName) {
                    var gradBox = funnel3d[sideGroupName].gradientBox, centerX = gradBox.x + gradBox.width / 2, centerY = gradBox.y + gradBox.height / 2, diameter = Math.min(gradBox.width, gradBox.height);
                    funnel3d.sideParts[sideGroupName].forEach(function (partName) {
                        funnel3d[partName].setRadialReference([
                            centerX, centerY, diameter
                        ]);
                    });
                });
            }
        }
        funnel3d.singleSetterForParts('fill', null, partsWithColor);
        // fill for animation getter (#6776)
        funnel3d.color = funnel3d.fill = fill;
        // change gradientUnits to userSpaceOnUse for linearGradient
        if (fillColor.linearGradient) {
            [funnel3d.frontLower, funnel3d.frontUpper].forEach(function (part) {
                var elem = part.element, grad = elem && funnel3d.renderer.gradients[elem.gradient];
                if (grad && grad.attr('gradientUnits') !== 'userSpaceOnUse') {
                    grad.attr({
                        gradientUnits: 'userSpaceOnUse'
                    });
                }
            });
        }
        return funnel3d;
    },
    adjustForGradient: function () {
        var funnel3d = this, bbox;
        funnel3d.sideGroups.forEach(function (sideGroupName) {
            // use common extremes for groups for matching gradients
            var topLeftEdge = {
                x: Number.MAX_VALUE,
                y: Number.MAX_VALUE
            }, bottomRightEdge = {
                x: -Number.MAX_VALUE,
                y: -Number.MAX_VALUE
            };
            // get extremes
            funnel3d.sideParts[sideGroupName].forEach(function (partName) {
                var part = funnel3d[partName];
                bbox = part.getBBox(true);
                topLeftEdge = {
                    x: Math.min(topLeftEdge.x, bbox.x),
                    y: Math.min(topLeftEdge.y, bbox.y)
                };
                bottomRightEdge = {
                    x: Math.max(bottomRightEdge.x, bbox.x + bbox.width),
                    y: Math.max(bottomRightEdge.y, bbox.y + bbox.height)
                };
            });
            // store for color fillSetter
            funnel3d[sideGroupName].gradientBox = {
                x: topLeftEdge.x,
                width: bottomRightEdge.x - topLeftEdge.x,
                y: topLeftEdge.y,
                height: bottomRightEdge.y - topLeftEdge.y
            };
        });
    },
    zIndexSetter: function () {
        // this.added won't work, because zIndex is set after the prop is set,
        // but before the graphic is really added
        if (this.finishedOnAdd) {
            this.adjustForGradient();
        }
        // run default
        return this.renderer.Element.prototype.zIndexSetter.apply(this, arguments);
    },
    onAdd: function () {
        this.adjustForGradient();
        this.finishedOnAdd = true;
    }
});
extend(H.Renderer.prototype, {
    funnel3d: function (shapeArgs) {
        var renderer = this, funnel3d = renderer.element3d('funnel3d', shapeArgs), styledMode = renderer.styledMode, 
        // hide stroke for Firefox
        strokeAttrs = {
            'stroke-width': 1,
            stroke: 'none'
        };
        // create groups for sides for oppacity setter
        funnel3d.upperGroup = renderer.g('funnel3d-upper-group').attr({
            zIndex: funnel3d.frontUpper.zIndex
        }).add(funnel3d);
        [
            funnel3d.frontUpper,
            funnel3d.backUpper,
            funnel3d.rightUpper
        ].forEach(function (upperElem) {
            if (!styledMode) {
                upperElem.attr(strokeAttrs);
            }
            upperElem.add(funnel3d.upperGroup);
        });
        funnel3d.lowerGroup = renderer.g('funnel3d-lower-group').attr({
            zIndex: funnel3d.frontLower.zIndex
        }).add(funnel3d);
        [
            funnel3d.frontLower,
            funnel3d.backLower,
            funnel3d.rightLower
        ].forEach(function (lowerElem) {
            if (!styledMode) {
                lowerElem.attr(strokeAttrs);
            }
            lowerElem.add(funnel3d.lowerGroup);
        });
        funnel3d.gradientForSides = shapeArgs.gradientForSides;
        return funnel3d;
    },
    /**
     * Generates paths and zIndexes.
     * @private
     */
    funnel3dPath: function (shapeArgs) {
        // Check getCylinderEnd for better error message if
        // the cylinder module is missing
        if (!this.getCylinderEnd) {
            error('A required Highcharts module is missing: cylinder.js', true, charts[this.chartIndex]);
        }
        var renderer = this, chart = charts[renderer.chartIndex], 
        // adjust angles for visible edges
        // based on alpha, selected through visual tests
        alphaCorrection = shapeArgs.alphaCorrection = 90 -
            Math.abs((chart.options.chart.options3d.alpha % 180) - 90), 
        // set zIndexes of parts based on cubiod logic, for consistency
        cuboidData = cuboidPath.call(renderer, merge(shapeArgs, {
            depth: shapeArgs.width,
            width: (shapeArgs.width + shapeArgs.bottom.width) / 2
        })), isTopFirst = cuboidData.isTop, isFrontFirst = !cuboidData.isFront, hasMiddle = !!shapeArgs.middle, 
        //
        top = renderer.getCylinderEnd(chart, merge(shapeArgs, {
            x: shapeArgs.x - shapeArgs.width / 2,
            z: shapeArgs.z - shapeArgs.width / 2,
            alphaCorrection: alphaCorrection
        })), bottomWidth = shapeArgs.bottom.width, bottomArgs = merge(shapeArgs, {
            width: bottomWidth,
            x: shapeArgs.x - bottomWidth / 2,
            z: shapeArgs.z - bottomWidth / 2,
            alphaCorrection: alphaCorrection
        }), bottom = renderer.getCylinderEnd(chart, bottomArgs, true), 
        //
        middleWidth = bottomWidth, middleTopArgs = bottomArgs, middleTop = bottom, middleBottom = bottom, ret, 
        // masking for cylinders or a missing part of a side shape
        useAlphaCorrection;
        if (hasMiddle) {
            middleWidth = shapeArgs.middle.width;
            middleTopArgs = merge(shapeArgs, {
                y: shapeArgs.y + shapeArgs.middle.fraction * shapeArgs.height,
                width: middleWidth,
                x: shapeArgs.x - middleWidth / 2,
                z: shapeArgs.z - middleWidth / 2
            });
            middleTop = renderer.getCylinderEnd(chart, middleTopArgs, false);
            middleBottom = renderer.getCylinderEnd(chart, middleTopArgs, false);
        }
        ret = {
            top: top,
            bottom: bottom,
            frontUpper: renderer.getCylinderFront(top, middleTop),
            zIndexes: {
                group: cuboidData.zIndexes.group,
                top: isTopFirst !== 0 ? 0 : 3,
                bottom: isTopFirst !== 1 ? 0 : 3,
                frontUpper: isFrontFirst ? 2 : 1,
                backUpper: isFrontFirst ? 1 : 2,
                rightUpper: isFrontFirst ? 2 : 1
            }
        };
        ret.backUpper = renderer.getCylinderBack(top, middleTop);
        useAlphaCorrection = (Math.min(middleWidth, shapeArgs.width) /
            Math.max(middleWidth, shapeArgs.width)) !== 1;
        ret.rightUpper = renderer.getCylinderFront(renderer.getCylinderEnd(chart, merge(shapeArgs, {
            x: shapeArgs.x - shapeArgs.width / 2,
            z: shapeArgs.z - shapeArgs.width / 2,
            alphaCorrection: useAlphaCorrection ? -alphaCorrection : 0
        }), false), renderer.getCylinderEnd(chart, merge(middleTopArgs, {
            alphaCorrection: useAlphaCorrection ? -alphaCorrection : 0
        }), !hasMiddle));
        if (hasMiddle) {
            useAlphaCorrection = (Math.min(middleWidth, bottomWidth) /
                Math.max(middleWidth, bottomWidth)) !== 1;
            merge(true, ret, {
                frontLower: renderer.getCylinderFront(middleBottom, bottom),
                backLower: renderer.getCylinderBack(middleBottom, bottom),
                rightLower: renderer.getCylinderFront(renderer.getCylinderEnd(chart, merge(bottomArgs, {
                    alphaCorrection: useAlphaCorrection ?
                        -alphaCorrection : 0
                }), true), renderer.getCylinderEnd(chart, merge(middleTopArgs, {
                    alphaCorrection: useAlphaCorrection ?
                        -alphaCorrection : 0
                }), false)),
                zIndexes: {
                    frontLower: isFrontFirst ? 2 : 1,
                    backLower: isFrontFirst ? 1 : 2,
                    rightLower: isFrontFirst ? 1 : 2
                }
            });
        }
        return ret;
    }
});
/* eslint-enable valid-jsdoc */
