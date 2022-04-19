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
import H from '../../Globals.js';
var isFirefox = H.isFirefox, isMS = H.isMS, isWebKit = H.isWebKit, win = H.win;
import SVGElement from '../SVG/SVGElement.js';
import U from '../../Utilities.js';
var css = U.css, defined = U.defined, extend = U.extend, pick = U.pick, pInt = U.pInt;
/* *
 *
 *  Class
 *
 * */
/* eslint-disable valid-jsdoc */
var HTMLElement = /** @class */ (function (_super) {
    __extends(HTMLElement, _super);
    function HTMLElement() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* *
     *
     *  Static Functions
     *
     * */
    /**
     * Modifies SVGElement to support HTML elements.
     * @private
     */
    HTMLElement.compose = function (SVGElementClass) {
        if (HTMLElement.composedClasses.indexOf(SVGElementClass) === -1) {
            HTMLElement.composedClasses.push(SVGElementClass);
            var htmlElementProto = HTMLElement.prototype, svgElementProto = SVGElementClass.prototype;
            svgElementProto.getSpanCorrection = htmlElementProto
                .getSpanCorrection;
            svgElementProto.htmlCss = htmlElementProto.htmlCss;
            svgElementProto.htmlGetBBox = htmlElementProto.htmlGetBBox;
            svgElementProto.htmlUpdateTransform = htmlElementProto
                .htmlUpdateTransform;
            svgElementProto.setSpanRotation = htmlElementProto.setSpanRotation;
        }
        return SVGElementClass;
    };
    /* *
     *
     *  Functions
     *
     * */
    /**
     * Get the correction in X and Y positioning as the element is rotated.
     * @private
     */
    HTMLElement.prototype.getSpanCorrection = function (width, baseline, alignCorrection) {
        this.xCorr = -width * alignCorrection;
        this.yCorr = -baseline;
    };
    /**
     * Apply CSS to HTML elements. This is used in text within SVG rendering and
     * by the VML renderer
     * @private
     */
    HTMLElement.prototype.htmlCss = function (styles) {
        var wrapper = this, element = wrapper.element, 
        // When setting or unsetting the width style, we need to update
        // transform (#8809)
        isSettingWidth = (element.tagName === 'SPAN' &&
            styles &&
            'width' in styles), textWidth = pick(isSettingWidth && styles.width, void 0);
        var doTransform;
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
    };
    /**
     * VML and useHTML method for calculating the bounding box based on offsets.
     */
    HTMLElement.prototype.htmlGetBBox = function () {
        var wrapper = this, element = wrapper.element;
        return {
            x: element.offsetLeft,
            y: element.offsetTop,
            width: element.offsetWidth,
            height: element.offsetHeight
        };
    };
    /**
     * VML override private method to update elements based on internal
     * properties based on SVG transform.
     * @private
     */
    HTMLElement.prototype.htmlUpdateTransform = function () {
        // aligning non added elements is expensive
        if (!this.added) {
            this.alignOnAdd = true;
            return;
        }
        var wrapper = this, renderer = wrapper.renderer, elem = wrapper.element, translateX = wrapper.translateX || 0, translateY = wrapper.translateY || 0, x = wrapper.x || 0, y = wrapper.y || 0, align = wrapper.textAlign || 'left', alignCorrection = {
            left: 0, center: 0.5, right: 1
        }[align], styles = wrapper.styles, whiteSpace = styles && styles.whiteSpace;
        /** @private */
        function getTextPxLength() {
            if (wrapper.textPxLength) {
                return wrapper.textPxLength;
            }
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
            var rotation = wrapper.rotation, textWidth = wrapper.textWidth && pInt(wrapper.textWidth), currentTextTransform = [
                rotation,
                align,
                elem.innerHTML,
                wrapper.textWidth,
                wrapper.textAlign
            ].join(',');
            var baseline = void 0, hasBoxWidthChanged = false;
            // Update textWidth. Use the memoized textPxLength if possible, to
            // avoid the getTextPxLength function using elem.offsetWidth.
            // Calling offsetWidth affects rendering time as it forces layout
            // (#7656).
            if (textWidth !== wrapper.oldTextWidth) { // #983, #1254
                var textPxLength = getTextPxLength();
                if (((textWidth > wrapper.oldTextWidth) ||
                    textPxLength > textWidth) && (
                // Only set the width if the text is able to word-wrap,
                // or text-overflow is ellipsis (#9537)
                /[ \-]/.test(elem.textContent || elem.innerText) ||
                    elem.style.textOverflow === 'ellipsis')) {
                    css(elem, {
                        width: (textPxLength > textWidth) || rotation ?
                            textWidth + 'px' :
                            'auto',
                        display: 'block',
                        whiteSpace: whiteSpace || 'normal' // #3331
                    });
                    wrapper.oldTextWidth = textWidth;
                    hasBoxWidthChanged = true; // #8159
                }
            }
            wrapper.hasBoxWidthChanged = hasBoxWidthChanged; // #8159
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
    };
    /**
     * Set the rotation of an individual HTML span.
     * @private
     */
    HTMLElement.prototype.setSpanRotation = function (rotation, alignCorrection, baseline) {
        var getTransformKey = function () { return (isMS &&
            !/Edge/.test(win.navigator.userAgent) ?
            '-ms-transform' :
            isWebKit ?
                '-webkit-transform' :
                isFirefox ?
                    'MozTransform' :
                    win.opera ?
                        '-o-transform' :
                        void 0); };
        var rotationStyle = {}, cssTransformKey = getTransformKey();
        if (cssTransformKey) {
            rotationStyle[cssTransformKey] = rotationStyle.transform =
                'rotate(' + rotation + 'deg)';
            rotationStyle[cssTransformKey + (isFirefox ? 'Origin' : '-origin')] = rotationStyle.transformOrigin =
                (alignCorrection * 100) + '% ' + baseline + 'px';
            css(this.element, rotationStyle);
        }
    };
    /* *
     *
     *  Static Properties
     *
     * */
    HTMLElement.composedClasses = [];
    return HTMLElement;
}(SVGElement));
/* *
 *
 *  Default Export
 *
 * */
export default HTMLElement;
