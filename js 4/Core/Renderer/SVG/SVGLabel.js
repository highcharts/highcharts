/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */
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
import SVGElement from './SVGElement.js';
import U from '../../Utilities.js';
var defined = U.defined, extend = U.extend, isNumber = U.isNumber, merge = U.merge, pick = U.pick, removeEvent = U.removeEvent;
/* *
 *
 *  Class
 *
 * */
/**
 * SVG label to render text.
 * @private
 * @class
 * @name Highcharts.SVGLabel
 * @augments Highcharts.SVGElement
 */
var SVGLabel = /** @class */ (function (_super) {
    __extends(SVGLabel, _super);
    /* *
     *
     *  Constructor
     *
     * */
    function SVGLabel(renderer, str, x, y, shape, anchorX, anchorY, useHTML, baseline, className) {
        var _this = _super.call(this) || this;
        _this.paddingLeftSetter = _this.paddingSetter;
        _this.paddingRightSetter = _this.paddingSetter;
        _this.init(renderer, 'g');
        _this.textStr = str;
        _this.x = x;
        _this.y = y;
        _this.anchorX = anchorX;
        _this.anchorY = anchorY;
        _this.baseline = baseline;
        _this.className = className;
        _this.addClass(className === 'button' ?
            'highcharts-no-tooltip' :
            'highcharts-label');
        if (className) {
            _this.addClass('highcharts-' + className);
        }
        // Create the text element. An undefined text content prevents redundant
        // box calculation (#16121)
        _this.text = renderer.text(void 0, 0, 0, useHTML).attr({ zIndex: 1 });
        // Validate the shape argument
        var hasBGImage;
        if (typeof shape === 'string') {
            hasBGImage = /^url\((.*?)\)$/.test(shape);
            if (hasBGImage || _this.renderer.symbols[shape]) {
                _this.symbolKey = shape;
            }
        }
        _this.bBox = SVGLabel.emptyBBox;
        _this.padding = 3;
        _this.baselineOffset = 0;
        _this.needsBox = renderer.styledMode || hasBGImage;
        _this.deferredAttr = {};
        _this.alignFactor = 0;
        return _this;
    }
    /* *
     *
     *  Functions
     *
     * */
    SVGLabel.prototype.alignSetter = function (value) {
        var alignFactor = ({
            left: 0,
            center: 0.5,
            right: 1
        })[value];
        if (alignFactor !== this.alignFactor) {
            this.alignFactor = alignFactor;
            // Bounding box exists, means we're dynamically changing
            if (this.bBox && isNumber(this.xSetting)) {
                this.attr({ x: this.xSetting }); // #5134
            }
        }
    };
    SVGLabel.prototype.anchorXSetter = function (value, key) {
        this.anchorX = value;
        this.boxAttr(key, Math.round(value) - this.getCrispAdjust() - this.xSetting);
    };
    SVGLabel.prototype.anchorYSetter = function (value, key) {
        this.anchorY = value;
        this.boxAttr(key, value - this.ySetting);
    };
    /*
     * Set a box attribute, or defer it if the box is not yet created
     */
    SVGLabel.prototype.boxAttr = function (key, value) {
        if (this.box) {
            this.box.attr(key, value);
        }
        else {
            this.deferredAttr[key] = value;
        }
    };
    /*
     * Pick up some properties and apply them to the text instead of the
     * wrapper.
     */
    SVGLabel.prototype.css = function (styles) {
        if (styles) {
            var textStyles_1 = {};
            // Create a copy to avoid altering the original object
            // (#537)
            styles = merge(styles);
            SVGLabel.textProps.forEach(function (prop) {
                if (typeof styles[prop] !== 'undefined') {
                    textStyles_1[prop] = styles[prop];
                    delete styles[prop];
                }
            });
            this.text.css(textStyles_1);
            var isWidth = 'width' in textStyles_1, isFontStyle = ('fontSize' in textStyles_1 ||
                'fontWeight' in textStyles_1);
            // Update existing text, box (#9400, #12163)
            if (isFontStyle) {
                this.updateTextPadding();
            }
            else if (isWidth) {
                this.updateBoxSize();
            }
        }
        return SVGElement.prototype.css.call(this, styles);
    };
    /*
     * Destroy and release memory.
     */
    SVGLabel.prototype.destroy = function () {
        // Added by button implementation
        removeEvent(this.element, 'mouseenter');
        removeEvent(this.element, 'mouseleave');
        if (this.text) {
            this.text.destroy();
        }
        if (this.box) {
            this.box = this.box.destroy();
        }
        // Call base implementation to destroy the rest
        SVGElement.prototype.destroy.call(this);
        return void 0;
    };
    SVGLabel.prototype.fillSetter = function (value, key) {
        if (value) {
            this.needsBox = true;
        }
        // for animation getter (#6776)
        this.fill = value;
        this.boxAttr(key, value);
    };
    /*
     * Return the bounding box of the box, not the group.
     */
    SVGLabel.prototype.getBBox = function () {
        // If we have a text string and the DOM bBox was 0, it typically means
        // that the label was first rendered hidden, so we need to update the
        // bBox (#15246)
        if (this.textStr && this.bBox.width === 0 && this.bBox.height === 0) {
            this.updateBoxSize();
        }
        var padding = this.padding;
        var paddingLeft = pick(this.paddingLeft, padding);
        return {
            width: this.width,
            height: this.height,
            x: this.bBox.x - paddingLeft,
            y: this.bBox.y - padding
        };
    };
    SVGLabel.prototype.getCrispAdjust = function () {
        return this.renderer.styledMode && this.box ?
            this.box.strokeWidth() % 2 / 2 :
            (this['stroke-width'] ? parseInt(this['stroke-width'], 10) : 0) % 2 / 2;
    };
    SVGLabel.prototype.heightSetter = function (value) {
        this.heightSetting = value;
    };
    /*
     * After the text element is added, get the desired size of the border
     * box and add it before the text in the DOM.
     */
    SVGLabel.prototype.onAdd = function () {
        var str = this.textStr;
        this.text.add(this);
        this.attr({
            // Alignment is available now  (#3295, 0 not rendered if given
            // as a value)
            text: (defined(str) ? str : ''),
            x: this.x,
            y: this.y
        });
        if (this.box && defined(this.anchorX)) {
            this.attr({
                anchorX: this.anchorX,
                anchorY: this.anchorY
            });
        }
    };
    SVGLabel.prototype.paddingSetter = function (value, key) {
        if (!isNumber(value)) {
            this[key] = void 0;
        }
        else if (value !== this[key]) {
            this[key] = value;
            this.updateTextPadding();
        }
    };
    SVGLabel.prototype.rSetter = function (value, key) {
        this.boxAttr(key, value);
    };
    SVGLabel.prototype.shadow = function (b) {
        if (b && !this.renderer.styledMode) {
            this.updateBoxSize();
            if (this.box) {
                this.box.shadow(b);
            }
        }
        return this;
    };
    SVGLabel.prototype.strokeSetter = function (value, key) {
        // for animation getter (#6776)
        this.stroke = value;
        this.boxAttr(key, value);
    };
    SVGLabel.prototype['stroke-widthSetter'] = function (value, key) {
        if (value) {
            this.needsBox = true;
        }
        this['stroke-width'] = value;
        this.boxAttr(key, value);
    };
    SVGLabel.prototype['text-alignSetter'] = function (value) {
        this.textAlign = value;
    };
    SVGLabel.prototype.textSetter = function (text) {
        if (typeof text !== 'undefined') {
            // Must use .attr to ensure transforms are done (#10009)
            this.text.attr({ text: text });
        }
        this.updateTextPadding();
    };
    /*
     * This function runs after the label is added to the DOM (when the bounding
     * box is available), and after the text of the label is updated to detect
     * the new bounding box and reflect it in the border box.
     */
    SVGLabel.prototype.updateBoxSize = function () {
        var style = this.text.element.style, attribs = {}, padding = this.padding, 
        // #12165 error when width is null (auto)
        // #12163 when fontweight: bold, recalculate bBox withot cache
        // #3295 && 3514 box failure when string equals 0
        bBox = this.bBox = (((!isNumber(this.widthSetting) ||
            !isNumber(this.heightSetting) ||
            this.textAlign) && defined(this.text.textStr)) ?
            this.text.getBBox() :
            SVGLabel.emptyBBox);
        var crispAdjust;
        this.width = this.getPaddedWidth();
        this.height = (this.heightSetting || bBox.height || 0) + 2 * padding;
        var metrics = this.renderer.fontMetrics(style && style.fontSize, this.text);
        // Update the label-scoped y offset. Math.min because of inline
        // style (#9400)
        this.baselineOffset = padding + Math.min(
        // When applicable, use the font size of the first line (#15707)
        (this.text.firstLineMetrics || metrics).b, 
        // When the height is 0, there is no bBox, so go with the font
        // metrics. Highmaps CSS demos.
        bBox.height || Infinity);
        // #15491: Vertical centering
        if (this.heightSetting) {
            this.baselineOffset += (this.heightSetting - metrics.h) / 2;
        }
        if (this.needsBox) {
            // Create the border box if it is not already present
            if (!this.box) {
                // Symbol definition exists (#5324)
                var box = this.box = this.symbolKey ?
                    this.renderer.symbol(this.symbolKey) :
                    this.renderer.rect();
                box.addClass(// Don't use label className for buttons
                (this.className === 'button' ?
                    '' : 'highcharts-label-box') +
                    (this.className ?
                        ' highcharts-' + this.className + '-box' : ''));
                box.add(this);
            }
            crispAdjust = this.getCrispAdjust();
            attribs.x = crispAdjust;
            attribs.y = ((this.baseline ? -this.baselineOffset : 0) + crispAdjust);
            // Apply the box attributes
            attribs.width = Math.round(this.width);
            attribs.height = Math.round(this.height);
            this.box.attr(extend(attribs, this.deferredAttr));
            this.deferredAttr = {};
        }
    };
    /*
     * This function runs after setting text or padding, but only if padding
     * is changed.
     */
    SVGLabel.prototype.updateTextPadding = function () {
        var text = this.text;
        this.updateBoxSize();
        // Determine y based on the baseline
        var textY = this.baseline ? 0 : this.baselineOffset;
        var textX = pick(this.paddingLeft, this.padding);
        // compensate for alignment
        if (defined(this.widthSetting) &&
            this.bBox &&
            (this.textAlign === 'center' || this.textAlign === 'right')) {
            textX += { center: 0.5, right: 1 }[this.textAlign] * (this.widthSetting - this.bBox.width);
        }
        // update if anything changed
        if (textX !== text.x || textY !== text.y) {
            text.attr('x', textX);
            // #8159 - prevent misplaced data labels in treemap
            // (useHTML: true)
            if (text.hasBoxWidthChanged) {
                this.bBox = text.getBBox(true);
            }
            if (typeof textY !== 'undefined') {
                text.attr('y', textY);
            }
        }
        // record current values
        text.x = textX;
        text.y = textY;
    };
    SVGLabel.prototype.widthSetter = function (value) {
        // width:auto => null
        this.widthSetting = isNumber(value) ? value : void 0;
    };
    SVGLabel.prototype.getPaddedWidth = function () {
        var padding = this.padding;
        var paddingLeft = pick(this.paddingLeft, padding);
        var paddingRight = pick(this.paddingRight, padding);
        return ((this.widthSetting || this.bBox.width || 0) +
            paddingLeft +
            paddingRight);
    };
    SVGLabel.prototype.xSetter = function (value) {
        this.x = value; // for animation getter
        if (this.alignFactor) {
            value -= this.alignFactor * this.getPaddedWidth();
            // Force animation even when setting to the same value (#7898)
            this['forceAnimate:x'] = true;
        }
        this.xSetting = Math.round(value);
        this.attr('translateX', this.xSetting);
    };
    SVGLabel.prototype.ySetter = function (value) {
        this.ySetting = this.y = Math.round(value);
        this.attr('translateY', this.ySetting);
    };
    /* *
     *
     *  Static Properties
     *
     * */
    SVGLabel.emptyBBox = {
        width: 0,
        height: 0,
        x: 0,
        y: 0
    };
    /**
     * For labels, these CSS properties are applied to the `text` node directly.
     *
     * @private
     * @name Highcharts.SVGLabel#textProps
     * @type {Array<string>}
     */
    SVGLabel.textProps = [
        'color', 'direction', 'fontFamily', 'fontSize', 'fontStyle',
        'fontWeight', 'lineHeight', 'textAlign', 'textDecoration',
        'textOutline', 'textOverflow', 'width'
    ];
    return SVGLabel;
}(SVGElement));
/* *
 *
 *  Default Export
 *
 * */
export default SVGLabel;
