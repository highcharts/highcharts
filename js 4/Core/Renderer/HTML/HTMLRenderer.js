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
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import AST from './AST.js';
import SVGElement from '../SVG/SVGElement.js';
import SVGRenderer from '../SVG/SVGRenderer.js';
import U from '../../Utilities.js';
var attr = U.attr, createElement = U.createElement, extend = U.extend, pick = U.pick;
/* *
 *
 *  Class
 *
 * */
/* eslint-disable valid-jsdoc */
// Extend SvgRenderer for useHTML option.
var HTMLRenderer = /** @class */ (function (_super) {
    __extends(HTMLRenderer, _super);
    function HTMLRenderer() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /** @private */
    HTMLRenderer.compose = function (SVGRendererClass) {
        if (HTMLRenderer.composedClasses.indexOf(SVGRendererClass) === -1) {
            HTMLRenderer.composedClasses.push(SVGRendererClass);
            var htmlRendererProto = HTMLRenderer.prototype, svgRendererProto = SVGRendererClass.prototype;
            svgRendererProto.html = htmlRendererProto.html;
        }
        return SVGRendererClass;
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Create HTML text node. This is used by the VML renderer as well as the
     * SVG renderer through the useHTML option.
     *
     * @private
     * @function Highcharts.SVGRenderer#html
     *
     * @param {string} str
     * The text of (subset) HTML to draw.
     *
     * @param {number} x
     * The x position of the text's lower left corner.
     *
     * @param {number} y
     * The y position of the text's lower left corner.
     *
     * @return {Highcharts.HTMLDOMElement}
     * HTML element.
     */
    HTMLRenderer.prototype.html = function (str, x, y) {
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
            if (value !== this.textStr) {
                delete this.bBox;
                delete this.oldTextWidth;
                AST.setElementHTML(this.element, pick(value, ''));
                this.textStr = value;
                wrapper.doTransform = true;
            }
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
                                wrapper.alignValue = wrapper.textAlign = value;
                            }
                            else {
                                wrapper[key] = value;
                            }
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
                var container = renderer.box.parentNode, parents = [];
                var htmlGroup, parentGroup;
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
                            var cls = attr(parentGroup.element, 'class');
                            /**
                             * Common translate setter for X and Y on the HTML
                             * group. Reverted the fix for #6957 du to
                             * positioning problems and offline export (#7254,
                             * #7280, #7529)
                             * @private
                             * @param {*} value
                             * @param {string} key
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
                            var parentGroupStyles = parentGroup.styles || {};
                            htmlGroup =
                                parentGroup.div =
                                    parentGroup.div || createElement('div', cls ? { className: cls } : void 0, {
                                        position: 'absolute',
                                        left: (parentGroup.translateX || 0) + 'px',
                                        top: (parentGroup.translateY || 0) + 'px',
                                        display: parentGroup.display,
                                        opacity: parentGroup.opacity,
                                        cursor: parentGroupStyles.cursor,
                                        pointerEvents: (
                                        // #5595
                                        parentGroupStyles.pointerEvents),
                                        visibility: parentGroup.visibility
                                        // the top group is appended to container
                                    }, htmlGroup || container);
                            // Shortcut
                            var htmlGroupStyle = htmlGroup.style;
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
                                        wrapper.on.apply({
                                            element: parents[0].div,
                                            onEvents: parentGroup.onEvents
                                        }, arguments);
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
    };
    /* *
     *
     *  Static Properties
     *
     * */
    HTMLRenderer.composedClasses = [];
    return HTMLRenderer;
}(SVGRenderer));
/* *
 *
 *  Default Export
 *
 * */
export default HTMLRenderer;
