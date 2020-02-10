/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
'use strict';
import H from './Globals.js';
import U from './Utilities.js';
var attr = U.attr, createElement = U.createElement, css = U.css, defined = U.defined, extend = U.extend, pick = U.pick, pInt = U.pInt;
import './SvgRenderer.js';
var isFirefox = H.isFirefox, isMS = H.isMS, isWebKit = H.isWebKit, SVGElement = H.SVGElement, SVGRenderer = H.SVGRenderer, win = H.win;
/* eslint-disable valid-jsdoc */
// Extend SvgElement for useHTML option.
extend(SVGElement.prototype, /** @lends SVGElement.prototype */ {
    /**
     * Apply CSS to HTML elements. This is used in text within SVG rendering and
     * by the VML renderer
     *
     * @private
     * @function Highcharts.SVGElement#htmlCss
     *
     * @param {Highcharts.CSSObject} styles
     *
     * @return {Highcharts.SVGElement}
     */
    htmlCss: function (styles) {
        var wrapper = this, element = wrapper.element, 
        // When setting or unsetting the width style, we need to update
        // transform (#8809)
        isSettingWidth = (element.tagName === 'SPAN' &&
            styles &&
            'width' in styles), textWidth = pick(isSettingWidth && styles.width, void 0), doTransform;
        if (isSettingWidth) {
            delete styles.width;
            wrapper.textWidth = textWidth;
            doTransform = true;
        }
        if (styles && styles.textOverflow === 'ellipsis') {
            styles.whiteSpace = 'nowrap';
            styles.overflow = 'hidden';
        }
        wrapper.styles = extend(wrapper.styles, styles);
        css(wrapper.element, styles);
        // Now that all styles are applied, to the transform
        if (doTransform) {
            wrapper.htmlUpdateTransform();
        }
        return wrapper;
    },
    /**
     * VML and useHTML method for calculating the bounding box based on offsets.
     *
     * @private
     * @function Highcharts.SVGElement#htmlGetBBox
     *
     * @param {boolean} refresh
     *        Whether to force a fresh value from the DOM or to use the cached
     *        value.
     *
     * @return {Highcharts.BBoxObject}
     *         A hash containing values for x, y, width and height.
     */
    htmlGetBBox: function () {
        var wrapper = this, element = wrapper.element;
        return {
            x: element.offsetLeft,
            y: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    },
    /**
     * VML override private method to update elements based on internal
     * properties based on SVG transform.
     *
     * @private
     * @function Highcharts.SVGElement#htmlUpdateTransform
     * @return {void}
     */
    htmlUpdateTransform: function () {
        // aligning non added elements is expensive
        if (!this.added) {
            this.alignOnAdd = true;
            return;
        }
        var wrapper = this, renderer = wrapper.renderer, elem = wrapper.element, translateX = wrapper.translateX || 0, translateY = wrapper.translateY || 0, x = wrapper.x || 0, y = wrapper.y || 0, align = wrapper.textAlign || 'left', alignCorrection = {
            left: 0, center: 0.5, right: 1
        }[align], styles = wrapper.styles, whiteSpace = styles && styles.whiteSpace;
        /**
         * @private
         * @return {number}
         */
        function getTextPxLength() {
            // Reset multiline/ellipsis in order to read width (#4928,
            // #5417)
            css(elem, {
                width: '',
                whiteSpace: whiteSpace || 'nowrap'
            });
            return elem.offsetWidth;
        }
        // apply translate
        css(elem, {
            marginLeft: translateX,
            marginTop: translateY
        });
        if (!renderer.styledMode && wrapper.shadows) { // used in labels/tooltip
            wrapper.shadows.forEach(function (shadow) {
                css(shadow, {
                    marginLeft: translateX + 1,
                    marginTop: translateY + 1
                });
            });
        }
        // apply inversion
        if (wrapper.inverted) { // wrapper is a group
            [].forEach.call(elem.childNodes, function (child) {
                renderer.invertChild(child, elem);
            });
        }
        if (elem.tagName === 'SPAN') {
            var rotation = wrapper.rotation, baseline, textWidth = wrapper.textWidth && pInt(wrapper.textWidth), currentTextTransform = [
                rotation,
                align,
                elem.innerHTML,
                wrapper.textWidth,
                wrapper.textAlign
            ].join(',');
            // Update textWidth. Use the memoized textPxLength if possible, to
            // avoid the getTextPxLength function using elem.offsetWidth.
            // Calling offsetWidth affects rendering time as it forces layout
            // (#7656).
            if (textWidth !== wrapper.oldTextWidth &&
                ((textWidth > wrapper.oldTextWidth) ||
                    (wrapper.textPxLength || getTextPxLength()) > textWidth) && (
            // Only set the width if the text is able to word-wrap, or
            // text-overflow is ellipsis (#9537)
            /[ \-]/.test(elem.textContent || elem.innerText) ||
                elem.style.textOverflow === 'ellipsis')) { // #983, #1254
                css(elem, {
                    width: textWidth + 'px',
                    display: 'block',
                    whiteSpace: whiteSpace || 'normal' // #3331
                });
                wrapper.oldTextWidth = textWidth;
                wrapper.hasBoxWidthChanged = true; // #8159
            }
            else {
                wrapper.hasBoxWidthChanged = false; // #8159
            }
            // Do the calculations and DOM access only if properties changed
            if (currentTextTransform !== wrapper.cTT) {
                baseline = renderer.fontMetrics(elem.style.fontSize, elem).b;
                // Renderer specific handling of span rotation, but only if we
                // have something to update.
                if (defined(rotation) &&
                    ((rotation !== (wrapper.oldRotation || 0)) ||
                        (align !== wrapper.oldAlign))) {
                    wrapper.setSpanRotation(rotation, alignCorrection, baseline);
                }
                wrapper.getSpanCorrection(
                // Avoid elem.offsetWidth if we can, it affects rendering
                // time heavily (#7656)
                ((!defined(rotation) && wrapper.textPxLength) || // #7920
                    elem.offsetWidth), baseline, alignCorrection, rotation, align);
            }
            // apply position with correction
            css(elem, {
                left: (x + (wrapper.xCorr || 0)) + 'px',
                top: (y + (wrapper.yCorr || 0)) + 'px'
            });
            // record current text transform
            wrapper.cTT = currentTextTransform;
            wrapper.oldRotation = rotation;
            wrapper.oldAlign = align;
        }
    },
    /**
     * Set the rotation of an individual HTML span.
     *
     * @private
     * @function Highcharts.SVGElement#setSpanRotation
     * @param {number} rotation
     * @param {number} alignCorrection
     * @param {number} baseline
     * @return {void}
     */
    setSpanRotation: function (rotation, alignCorrection, baseline) {
        var rotationStyle = {}, cssTransformKey = this.renderer.getTransformKey();
        rotationStyle[cssTransformKey] = rotationStyle.transform =
            'rotate(' + rotation + 'deg)';
        rotationStyle[cssTransformKey + (isFirefox ? 'Origin' : '-origin')] =
            rotationStyle.transformOrigin =
                (alignCorrection * 100) + '% ' + baseline + 'px';
        css(this.element, rotationStyle);
    },
    /**
     * Get the correction in X and Y positioning as the element is rotated.
     *
     * @private
     * @function Highcharts.SVGElement#getSpanCorrection
     * @param {number} width
     * @param {number} baseline
     * @param {number} alignCorrection
     * @return {void}
     */
    getSpanCorrection: function (width, baseline, alignCorrection) {
        this.xCorr = -width * alignCorrection;
        this.yCorr = -baseline;
    }
});
// Extend SvgRenderer for useHTML option.
extend(SVGRenderer.prototype, /** @lends SVGRenderer.prototype */ {
    /**
     * @private
     * @function Highcharts.SVGRenderer#getTransformKey
     *
     * @return {string}
     */
    getTransformKey: function () {
        return isMS && !/Edge/.test(win.navigator.userAgent) ?
            '-ms-transform' :
            isWebKit ?
                '-webkit-transform' :
                isFirefox ?
                    'MozTransform' :
                    win.opera ?
                        '-o-transform' :
                        '';
    },
    /**
     * Create HTML text node. This is used by the VML renderer as well as the
     * SVG renderer through the useHTML option.
     *
     * @private
     * @function Highcharts.SVGRenderer#html
     *
     * @param {string} str
     *        The text of (subset) HTML to draw.
     *
     * @param {number} x
     *        The x position of the text's lower left corner.
     *
     * @param {number} y
     *        The y position of the text's lower left corner.
     *
     * @return {Highcharts.HTMLDOMElement}
     */
    html: function (str, x, y) {
        var wrapper = this.createElement('span'), element = wrapper.element, renderer = wrapper.renderer, isSVG = renderer.isSVG, addSetters = function (gWrapper, style) {
            // These properties are set as attributes on the SVG group, and
            // as identical CSS properties on the div. (#3542)
            ['opacity', 'visibility'].forEach(function (prop) {
                gWrapper[prop + 'Setter'] = function (value, key, elem) {
                    var styleObject = gWrapper.div ?
                        gWrapper.div.style :
                        style;
                    SVGElement.prototype[prop + 'Setter']
                        .call(this, value, key, elem);
                    if (styleObject) {
                        styleObject[key] = value;
                    }
                };
            });
            gWrapper.addedSetters = true;
        };
        // Text setter
        wrapper.textSetter = function (value) {
            if (value !== element.innerHTML) {
                delete this.bBox;
                delete this.oldTextWidth;
            }
            this.textStr = value;
            element.innerHTML = pick(value, '');
            wrapper.doTransform = true;
        };
        // Add setters for the element itself (#4938)
        if (isSVG) { // #4938, only for HTML within SVG
            addSetters(wrapper, wrapper.element.style);
        }
        // Various setters which rely on update transform
        wrapper.xSetter =
            wrapper.ySetter =
                wrapper.alignSetter =
                    wrapper.rotationSetter =
                        function (value, key) {
                            if (key === 'align') {
                                // Do not overwrite the SVGElement.align method. Same as VML.
                                key = 'textAlign';
                            }
                            wrapper[key] = value;
                            wrapper.doTransform = true;
                        };
        // Runs at the end of .attr()
        wrapper.afterSetters = function () {
            // Update transform. Do this outside the loop to prevent redundant
            // updating for batch setting of attributes.
            if (this.doTransform) {
                this.htmlUpdateTransform();
                this.doTransform = false;
            }
        };
        // Set the default attributes
        wrapper
            .attr({
            text: str,
            x: Math.round(x),
            y: Math.round(y)
        })
            .css({
            position: 'absolute'
        });
        if (!renderer.styledMode) {
            wrapper.css({
                fontFamily: this.style.fontFamily,
                fontSize: this.style.fontSize
            });
        }
        // Keep the whiteSpace style outside the wrapper.styles collection
        element.style.whiteSpace = 'nowrap';
        // Use the HTML specific .css method
        wrapper.css = wrapper.htmlCss;
        // This is specific for HTML within SVG
        if (isSVG) {
            wrapper.add = function (svgGroupWrapper) {
                var htmlGroup, container = renderer.box.parentNode, parentGroup, parents = [];
                this.parentGroup = svgGroupWrapper;
                // Create a mock group to hold the HTML elements
                if (svgGroupWrapper) {
                    htmlGroup = svgGroupWrapper.div;
                    if (!htmlGroup) {
                        // Read the parent chain into an array and read from top
                        // down
                        parentGroup = svgGroupWrapper;
                        while (parentGroup) {
                            parents.push(parentGroup);
                            // Move up to the next parent group
                            parentGroup = parentGroup.parentGroup;
                        }
                        // Ensure dynamically updating position when any parent
                        // is translated
                        parents.reverse().forEach(function (parentGroup) {
                            var htmlGroupStyle, cls = attr(parentGroup.element, 'class');
                            /**
                             * Common translate setter for X and Y on the HTML
                             * group. Reverted the fix for #6957 du to
                             * positioning problems and offline export (#7254,
                             * #7280, #7529)
                             * @private
                             * @param {*} value
                             * @param {string} key
                             * @return {void}
                             */
                            function translateSetter(value, key) {
                                parentGroup[key] = value;
                                if (key === 'translateX') {
                                    htmlGroupStyle.left = value + 'px';
                                }
                                else {
                                    htmlGroupStyle.top = value + 'px';
                                }
                                parentGroup.doTransform = true;
                            }
                            // Create a HTML div and append it to the parent div
                            // to emulate the SVG group structure
                            htmlGroup =
                                parentGroup.div =
                                    parentGroup.div || createElement('div', cls ? { className: cls } : void 0, {
                                        position: 'absolute',
                                        left: (parentGroup.translateX || 0) + 'px',
                                        top: (parentGroup.translateY || 0) + 'px',
                                        display: parentGroup.display,
                                        opacity: parentGroup.opacity,
                                        pointerEvents: (parentGroup.styles &&
                                            parentGroup.styles.pointerEvents) // #5595
                                        // the top group is appended to container
                                    }, htmlGroup || container);
                            // Shortcut
                            htmlGroupStyle = htmlGroup.style;
                            // Set listeners to update the HTML div's position
                            // whenever the SVG group position is changed.
                            extend(parentGroup, {
                                // (#7287) Pass htmlGroup to use
                                // the related group
                                classSetter: (function (htmlGroup) {
                                    return function (value) {
                                        this.element.setAttribute('class', value);
                                        htmlGroup.className = value;
                                    };
                                }(htmlGroup)),
                                on: function () {
                                    if (parents[0].div) { // #6418
                                        wrapper.on.apply({ element: parents[0].div }, arguments);
                                    }
                                    return parentGroup;
                                },
                                translateXSetter: translateSetter,
                                translateYSetter: translateSetter
                            });
                            if (!parentGroup.addedSetters) {
                                addSetters(parentGroup);
                            }
                        });
                    }
                }
                else {
                    htmlGroup = container;
                }
                htmlGroup.appendChild(element);
                // Shared with VML:
                wrapper.added = true;
                if (wrapper.alignOnAdd) {
                    wrapper.htmlUpdateTransform();
                }
                return wrapper;
            };
        }
        return wrapper;
    }
});
