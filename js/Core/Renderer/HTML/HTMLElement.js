/* *
 *
 *  (c) 2010-2020 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
import H from '../../Globals.js';
import SVGElement from '../SVG/SVGElement.js';
import U from '../../Utilities.js';
var css = U.css, defined = U.defined, extend = U.extend, pick = U.pick, pInt = U.pInt;
/**
 * Element placebo
 * @private
 */
var HTMLElement = SVGElement;
var isFirefox = H.isFirefox;
/* eslint-disable valid-jsdoc */
// Extend SvgElement for useHTML option.
extend(HTMLElement.prototype, /** @lends SVGElement.prototype */ {
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
export default HTMLElement;
