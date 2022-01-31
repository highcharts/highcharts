/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2015-2021 yWorks GmbH
 * Copyright (c) 2013-2015 by Vitaly Puzrin
 *
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jspdf')) :
    typeof define === 'function' && define.amd ? define(['exports', 'jspdf'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.svg2pdf = {}, global.jspdf));
}(this, (function (exports, jsPDF) { 'use strict';

    var jsPDF__default = 'default' in jsPDF ? jsPDF['default'] : jsPDF;

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    }

    /* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types */
    var RGBColor = /** @class */ (function () {
        function RGBColor(colorString) {
            this.a = undefined;
            this.r = 0;
            this.g = 0;
            this.b = 0;
            this.simpleColors = {};
            // eslint-disable-next-line @typescript-eslint/ban-types
            this.colorDefs = [];
            this.ok = false;
            if (!colorString) {
                return;
            }
            // strip any leading #
            if (colorString.charAt(0) == '#') {
                // remove # if any
                colorString = colorString.substr(1, 6);
            }
            colorString = colorString.replace(/ /g, '');
            colorString = colorString.toLowerCase();
            // before getting into regexps, try simple matches
            // and overwrite the input
            this.simpleColors = {
                aliceblue: 'f0f8ff',
                antiquewhite: 'faebd7',
                aqua: '00ffff',
                aquamarine: '7fffd4',
                azure: 'f0ffff',
                beige: 'f5f5dc',
                bisque: 'ffe4c4',
                black: '000000',
                blanchedalmond: 'ffebcd',
                blue: '0000ff',
                blueviolet: '8a2be2',
                brown: 'a52a2a',
                burlywood: 'deb887',
                cadetblue: '5f9ea0',
                chartreuse: '7fff00',
                chocolate: 'd2691e',
                coral: 'ff7f50',
                cornflowerblue: '6495ed',
                cornsilk: 'fff8dc',
                crimson: 'dc143c',
                cyan: '00ffff',
                darkblue: '00008b',
                darkcyan: '008b8b',
                darkgoldenrod: 'b8860b',
                darkgray: 'a9a9a9',
                darkgrey: 'a9a9a9',
                darkgreen: '006400',
                darkkhaki: 'bdb76b',
                darkmagenta: '8b008b',
                darkolivegreen: '556b2f',
                darkorange: 'ff8c00',
                darkorchid: '9932cc',
                darkred: '8b0000',
                darksalmon: 'e9967a',
                darkseagreen: '8fbc8f',
                darkslateblue: '483d8b',
                darkslategray: '2f4f4f',
                darkslategrey: '2f4f4f',
                darkturquoise: '00ced1',
                darkviolet: '9400d3',
                deeppink: 'ff1493',
                deepskyblue: '00bfff',
                dimgray: '696969',
                dimgrey: '696969',
                dodgerblue: '1e90ff',
                feldspar: 'd19275',
                firebrick: 'b22222',
                floralwhite: 'fffaf0',
                forestgreen: '228b22',
                fuchsia: 'ff00ff',
                gainsboro: 'dcdcdc',
                ghostwhite: 'f8f8ff',
                gold: 'ffd700',
                goldenrod: 'daa520',
                gray: '808080',
                grey: '808080',
                green: '008000',
                greenyellow: 'adff2f',
                honeydew: 'f0fff0',
                hotpink: 'ff69b4',
                indianred: 'cd5c5c',
                indigo: '4b0082',
                ivory: 'fffff0',
                khaki: 'f0e68c',
                lavender: 'e6e6fa',
                lavenderblush: 'fff0f5',
                lawngreen: '7cfc00',
                lemonchiffon: 'fffacd',
                lightblue: 'add8e6',
                lightcoral: 'f08080',
                lightcyan: 'e0ffff',
                lightgoldenrodyellow: 'fafad2',
                lightgray: 'd3d3d3',
                lightgrey: 'd3d3d3',
                lightgreen: '90ee90',
                lightpink: 'ffb6c1',
                lightsalmon: 'ffa07a',
                lightseagreen: '20b2aa',
                lightskyblue: '87cefa',
                lightslateblue: '8470ff',
                lightslategray: '778899',
                lightslategrey: '778899',
                lightsteelblue: 'b0c4de',
                lightyellow: 'ffffe0',
                lime: '00ff00',
                limegreen: '32cd32',
                linen: 'faf0e6',
                magenta: 'ff00ff',
                maroon: '800000',
                mediumaquamarine: '66cdaa',
                mediumblue: '0000cd',
                mediumorchid: 'ba55d3',
                mediumpurple: '9370d8',
                mediumseagreen: '3cb371',
                mediumslateblue: '7b68ee',
                mediumspringgreen: '00fa9a',
                mediumturquoise: '48d1cc',
                mediumvioletred: 'c71585',
                midnightblue: '191970',
                mintcream: 'f5fffa',
                mistyrose: 'ffe4e1',
                moccasin: 'ffe4b5',
                navajowhite: 'ffdead',
                navy: '000080',
                oldlace: 'fdf5e6',
                olive: '808000',
                olivedrab: '6b8e23',
                orange: 'ffa500',
                orangered: 'ff4500',
                orchid: 'da70d6',
                palegoldenrod: 'eee8aa',
                palegreen: '98fb98',
                paleturquoise: 'afeeee',
                palevioletred: 'd87093',
                papayawhip: 'ffefd5',
                peachpuff: 'ffdab9',
                peru: 'cd853f',
                pink: 'ffc0cb',
                plum: 'dda0dd',
                powderblue: 'b0e0e6',
                purple: '800080',
                red: 'ff0000',
                rosybrown: 'bc8f8f',
                royalblue: '4169e1',
                saddlebrown: '8b4513',
                salmon: 'fa8072',
                sandybrown: 'f4a460',
                seagreen: '2e8b57',
                seashell: 'fff5ee',
                sienna: 'a0522d',
                silver: 'c0c0c0',
                skyblue: '87ceeb',
                slateblue: '6a5acd',
                slategray: '708090',
                slategrey: '708090',
                snow: 'fffafa',
                springgreen: '00ff7f',
                steelblue: '4682b4',
                tan: 'd2b48c',
                teal: '008080',
                thistle: 'd8bfd8',
                tomato: 'ff6347',
                turquoise: '40e0d0',
                violet: 'ee82ee',
                violetred: 'd02090',
                wheat: 'f5deb3',
                white: 'ffffff',
                whitesmoke: 'f5f5f5',
                yellow: 'ffff00',
                yellowgreen: '9acd32'
            };
            for (var key in this.simpleColors) {
                if (colorString == key) {
                    colorString = this.simpleColors[key];
                }
            }
            // emd of simple type-in colors
            // array of color definition objects
            this.colorDefs = [
                {
                    re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
                    example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
                    process: function (bits) {
                        return [parseInt(bits[1]), parseInt(bits[2]), parseInt(bits[3])];
                    }
                },
                {
                    re: /^(\w{2})(\w{2})(\w{2})$/,
                    example: ['#00ff00', '336699'],
                    process: function (bits) {
                        return [parseInt(bits[1], 16), parseInt(bits[2], 16), parseInt(bits[3], 16)];
                    }
                },
                {
                    re: /^(\w{1})(\w{1})(\w{1})$/,
                    example: ['#fb0', 'f0f'],
                    process: function (bits) {
                        return [
                            parseInt(bits[1] + bits[1], 16),
                            parseInt(bits[2] + bits[2], 16),
                            parseInt(bits[3] + bits[3], 16)
                        ];
                    }
                }
            ];
            // search through the definitions to find a match
            for (var i = 0; i < this.colorDefs.length; i++) {
                var re = this.colorDefs[i].re;
                var processor = this.colorDefs[i].process;
                var bits = re.exec(colorString);
                if (bits) {
                    var channels = processor(bits);
                    this.r = channels[0];
                    this.g = channels[1];
                    this.b = channels[2];
                    this.ok = true;
                }
            }
            // validate/cleanup values
            this.r = this.r < 0 || isNaN(this.r) ? 0 : this.r > 255 ? 255 : this.r;
            this.g = this.g < 0 || isNaN(this.g) ? 0 : this.g > 255 ? 255 : this.g;
            this.b = this.b < 0 || isNaN(this.b) ? 0 : this.b > 255 ? 255 : this.b;
        }
        RGBColor.prototype.toRGB = function () {
            return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
        };
        RGBColor.prototype.toRGBA = function () {
            return 'rgba(' + this.r + ', ' + this.g + ', ' + this.b + ', ' + (this.a || '1') + ')';
        };
        RGBColor.prototype.toHex = function () {
            var r = this.r.toString(16);
            var g = this.g.toString(16);
            var b = this.b.toString(16);
            if (r.length == 1)
                r = '0' + r;
            if (g.length == 1)
                g = '0' + g;
            if (b.length == 1)
                b = '0' + b;
            return '#' + r + g + b;
        };
        // help
        RGBColor.prototype.getHelpXML = function () {
            var examples = [];
            // add regexps
            for (var i = 0; i < this.colorDefs.length; i++) {
                var example = this.colorDefs[i].example;
                for (var j = 0; j < example.length; j++) {
                    examples[examples.length] = example[j];
                }
            }
            // add type-in colors
            for (var sc in this.simpleColors) {
                examples[examples.length] = sc;
            }
            var xml = document.createElement('ul');
            xml.setAttribute('id', 'rgbcolor-examples');
            for (var i = 0; i < examples.length; i++) {
                try {
                    var listItem = document.createElement('li');
                    var listColor = new RGBColor(examples[i]);
                    var exampleDiv = document.createElement('div');
                    exampleDiv.style.cssText =
                        'margin: 3px; ' +
                            'border: 1px solid black; ' +
                            'background:' +
                            listColor.toHex() +
                            '; ' +
                            'color:' +
                            listColor.toHex();
                    exampleDiv.appendChild(document.createTextNode('test'));
                    var listItemValue = document.createTextNode(' ' + examples[i] + ' -> ' + listColor.toRGB() + ' -> ' + listColor.toHex());
                    listItem.appendChild(exampleDiv);
                    listItem.appendChild(listItemValue);
                    xml.appendChild(listItem);
                }
                catch (e) { }
            }
            return xml;
        };
        return RGBColor;
    }());

    var ColorFill = /** @class */ (function () {
        function ColorFill(color) {
            this.color = color;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        ColorFill.prototype.getFillData = function (forNode, context) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, undefined];
                });
            });
        };
        return ColorFill;
    }());

    var AttributeState = /** @class */ (function () {
        function AttributeState() {
            this.xmlSpace = '';
            this.fill = null;
            this.fillOpacity = 1.0;
            // public fillRule: string = null
            this.fontFamily = '';
            this.fontSize = 16;
            this.fontStyle = '';
            // public fontVariant: string
            this.fontWeight = '';
            this.opacity = 1.0;
            this.stroke = null;
            this.strokeDasharray = null;
            this.strokeDashoffset = 0;
            this.strokeLinecap = '';
            this.strokeLinejoin = '';
            this.strokeMiterlimit = 4.0;
            this.strokeOpacity = 1.0;
            this.strokeWidth = 1.0;
            // public textAlign: string
            this.alignmentBaseline = '';
            this.textAnchor = '';
            this.visibility = '';
            this.color = null;
        }
        AttributeState.prototype.clone = function () {
            var clone = new AttributeState();
            clone.xmlSpace = this.xmlSpace;
            clone.fill = this.fill;
            clone.fillOpacity = this.fillOpacity;
            // clone.fillRule = this.fillRule;
            clone.fontFamily = this.fontFamily;
            clone.fontSize = this.fontSize;
            clone.fontStyle = this.fontStyle;
            // clone.fontVariant = this.fontVariant;
            clone.fontWeight = this.fontWeight;
            clone.opacity = this.opacity;
            clone.stroke = this.stroke;
            clone.strokeDasharray = this.strokeDasharray;
            clone.strokeDashoffset = this.strokeDashoffset;
            clone.strokeLinecap = this.strokeLinecap;
            clone.strokeLinejoin = this.strokeLinejoin;
            clone.strokeMiterlimit = this.strokeMiterlimit;
            clone.strokeOpacity = this.strokeOpacity;
            clone.strokeWidth = this.strokeWidth;
            // clone.textAlign = this.textAlign;
            clone.textAnchor = this.textAnchor;
            clone.alignmentBaseline = this.alignmentBaseline;
            clone.visibility = this.visibility;
            clone.color = this.color;
            return clone;
        };
        AttributeState.default = function () {
            var attributeState = new AttributeState();
            attributeState.xmlSpace = 'default';
            attributeState.fill = new ColorFill(new RGBColor('rgb(0, 0, 0)'));
            attributeState.fillOpacity = 1.0;
            // attributeState.fillRule = "nonzero";
            attributeState.fontFamily = 'times';
            attributeState.fontSize = 16;
            attributeState.fontStyle = 'normal';
            // attributeState.fontVariant = "normal";
            attributeState.fontWeight = 'normal';
            attributeState.opacity = 1.0;
            attributeState.stroke = null;
            attributeState.strokeDasharray = null;
            attributeState.strokeDashoffset = 0;
            attributeState.strokeLinecap = 'butt';
            attributeState.strokeLinejoin = 'miter';
            attributeState.strokeMiterlimit = 4.0;
            attributeState.strokeOpacity = 1.0;
            attributeState.strokeWidth = 1.0;
            // attributeState.textAlign = "start";
            attributeState.alignmentBaseline = 'baseline';
            attributeState.textAnchor = 'start';
            attributeState.visibility = 'visible';
            attributeState.color = new RGBColor('rgb(0, 0, 0)');
            return attributeState;
        };
        return AttributeState;
    }());

    var iriReference = /url\(["']?#([^"']+)["']?\)/;
    var alignmentBaselineMap = {
        bottom: 'bottom',
        'text-bottom': 'bottom',
        top: 'top',
        'text-top': 'top',
        hanging: 'hanging',
        middle: 'middle',
        central: 'middle',
        center: 'middle',
        mathematical: 'middle',
        ideographic: 'ideographic',
        alphabetic: 'alphabetic',
        baseline: 'alphabetic'
    };
    var svgNamespaceURI = 'http://www.w3.org/2000/svg';

    var TextMeasure = /** @class */ (function () {
        function TextMeasure() {
            this.measureMethods = {};
        }
        TextMeasure.prototype.getTextOffset = function (text, attributeState) {
            var textAnchor = attributeState.textAnchor;
            if (textAnchor === 'start') {
                return 0;
            }
            var width = this.measureTextWidth(text, attributeState);
            var xOffset = 0;
            switch (textAnchor) {
                case 'end':
                    xOffset = width;
                    break;
                case 'middle':
                    xOffset = width / 2;
                    break;
            }
            return xOffset;
        };
        TextMeasure.prototype.measureTextWidth = function (text, attributeState) {
            if (text.length === 0) {
                return 0;
            }
            var fontFamily = attributeState.fontFamily;
            var measure = this.getMeasureFunction(fontFamily);
            return measure.call(this, text, attributeState.fontFamily, attributeState.fontSize + 'px', attributeState.fontStyle, attributeState.fontWeight);
        };
        TextMeasure.prototype.getMeasurementTextNode = function () {
            if (!this.textMeasuringTextElement) {
                this.textMeasuringTextElement = document.createElementNS(svgNamespaceURI, 'text');
                var svg = document.createElementNS(svgNamespaceURI, 'svg');
                svg.appendChild(this.textMeasuringTextElement);
                svg.style.setProperty('position', 'absolute');
                svg.style.setProperty('visibility', 'hidden');
                document.body.appendChild(svg);
            }
            return this.textMeasuringTextElement;
        };
        TextMeasure.prototype.canvasTextMeasure = function (text, fontFamily, fontSize, fontStyle, fontWeight) {
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            if (context != null) {
                context.font = [fontStyle, fontWeight, fontSize, fontFamily].join(' ');
                return context.measureText(text).width;
            }
            return 0;
        };
        TextMeasure.prototype.svgTextMeasure = function (text, fontFamily, fontSize, fontStyle, fontWeight, measurementTextNode) {
            if (measurementTextNode === void 0) { measurementTextNode = this.getMeasurementTextNode(); }
            var textNode = measurementTextNode;
            textNode.setAttribute('font-family', fontFamily);
            textNode.setAttribute('font-size', fontSize);
            textNode.setAttribute('font-style', fontStyle);
            textNode.setAttribute('font-weight', fontWeight);
            textNode.setAttributeNS('http://www.w3.org/XML/1998/namespace', 'xml:space', 'preserve');
            textNode.textContent = text;
            return textNode.getBBox().width;
        };
        /**
         * Canvas text measuring is a lot faster than svg measuring. However, it is inaccurate for some fonts. So test each
         * font once and decide if canvas is accurate enough.
         */
        TextMeasure.prototype.getMeasureFunction = function (fontFamily) {
            var method = this.measureMethods[fontFamily];
            if (!method) {
                var fontSize = '16px';
                var fontStyle = 'normal';
                var fontWeight = 'normal';
                var canvasWidth = this.canvasTextMeasure(TextMeasure.testString, fontFamily, fontSize, fontStyle, fontWeight);
                var svgWidth = this.svgTextMeasure(TextMeasure.testString, fontFamily, fontSize, fontStyle, fontWeight);
                method =
                    Math.abs(canvasWidth - svgWidth) < TextMeasure.epsilon
                        ? this.canvasTextMeasure
                        : this.svgTextMeasure;
                this.measureMethods[fontFamily] = method;
            }
            return method;
        };
        TextMeasure.prototype.cleanupTextMeasuring = function () {
            if (this.textMeasuringTextElement) {
                var parentNode = this.textMeasuringTextElement.parentNode;
                if (parentNode) {
                    document.body.removeChild(parentNode);
                }
                this.textMeasuringTextElement = undefined;
            }
        };
        TextMeasure.testString = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ 0123456789!"$%&/()=?\'\\+*-_.:,;^}][{#~|<>';
        TextMeasure.epsilon = 0.1;
        return TextMeasure;
    }());

    /**
     *
     * @package
     * @param values
     * @constructor
     * @property pdf
     * @property attributeState  Keeps track of parent attributes that are inherited automatically
     * @property refsHandler  The handler that will render references on demand
     * @property styleSheets
     * @property textMeasure
     * @property transform The current transformation matrix
     * @property withinClipPath
     */
    var Context = /** @class */ (function () {
        function Context(pdf, values) {
            var _a, _b, _c, _d, _e, _f;
            this.pdf = pdf;
            this.svg2pdfParameters = values.svg2pdfParameters;
            this.attributeState = values.attributeState
                ? values.attributeState.clone()
                : AttributeState.default();
            this.viewport = values.viewport;
            this.refsHandler = (_a = values.refsHandler) !== null && _a !== void 0 ? _a : null;
            this.styleSheets = (_b = values.styleSheets) !== null && _b !== void 0 ? _b : null;
            this.textMeasure = (_c = values.textMeasure) !== null && _c !== void 0 ? _c : new TextMeasure();
            this.transform = (_d = values.transform) !== null && _d !== void 0 ? _d : this.pdf.unitMatrix;
            this.withinClipPath = (_e = values.withinClipPath) !== null && _e !== void 0 ? _e : false;
            this.withinUse = (_f = values.withinUse) !== null && _f !== void 0 ? _f : false;
        }
        Context.prototype.clone = function (values) {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            if (values === void 0) { values = {}; }
            return new Context(this.pdf, {
                svg2pdfParameters: (_a = values.svg2pdfParameters) !== null && _a !== void 0 ? _a : this.svg2pdfParameters,
                attributeState: values.attributeState
                    ? values.attributeState.clone()
                    : this.attributeState.clone(),
                viewport: (_b = values.viewport) !== null && _b !== void 0 ? _b : this.viewport,
                refsHandler: (_c = values.refsHandler) !== null && _c !== void 0 ? _c : this.refsHandler,
                styleSheets: (_d = values.styleSheets) !== null && _d !== void 0 ? _d : this.styleSheets,
                textMeasure: (_e = values.textMeasure) !== null && _e !== void 0 ? _e : this.textMeasure,
                transform: (_f = values.transform) !== null && _f !== void 0 ? _f : this.transform,
                withinClipPath: (_g = values.withinClipPath) !== null && _g !== void 0 ? _g : this.withinClipPath,
                withinUse: (_h = values.withinUse) !== null && _h !== void 0 ? _h : this.withinUse
            });
        };
        return Context;
    }());

    /*! https://mths.be/cssesc v3.0.0 by @mathias */

    var object = {};
    var hasOwnProperty = object.hasOwnProperty;
    var merge = function merge(options, defaults) {
    	if (!options) {
    		return defaults;
    	}
    	var result = {};
    	for (var key in defaults) {
    		// `if (defaults.hasOwnProperty(key) { … }` is not needed here, since
    		// only recognized option names are used.
    		result[key] = hasOwnProperty.call(options, key) ? options[key] : defaults[key];
    	}
    	return result;
    };

    var regexAnySingleEscape = /[ -,\.\/:-@\[-\^`\{-~]/;
    var regexSingleEscape = /[ -,\.\/:-@\[\]\^`\{-~]/;
    var regexExcessiveSpaces = /(^|\\+)?(\\[A-F0-9]{1,6})\x20(?![a-fA-F0-9\x20])/g;

    // https://mathiasbynens.be/notes/css-escapes#css
    var cssesc = function cssesc(string, options) {
    	options = merge(options, cssesc.options);
    	if (options.quotes != 'single' && options.quotes != 'double') {
    		options.quotes = 'single';
    	}
    	var quote = options.quotes == 'double' ? '"' : '\'';
    	var isIdentifier = options.isIdentifier;

    	var firstChar = string.charAt(0);
    	var output = '';
    	var counter = 0;
    	var length = string.length;
    	while (counter < length) {
    		var character = string.charAt(counter++);
    		var codePoint = character.charCodeAt();
    		var value = void 0;
    		// If it’s not a printable ASCII character…
    		if (codePoint < 0x20 || codePoint > 0x7E) {
    			if (codePoint >= 0xD800 && codePoint <= 0xDBFF && counter < length) {
    				// It’s a high surrogate, and there is a next character.
    				var extra = string.charCodeAt(counter++);
    				if ((extra & 0xFC00) == 0xDC00) {
    					// next character is low surrogate
    					codePoint = ((codePoint & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000;
    				} else {
    					// It’s an unmatched surrogate; only append this code unit, in case
    					// the next code unit is the high surrogate of a surrogate pair.
    					counter--;
    				}
    			}
    			value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
    		} else {
    			if (options.escapeEverything) {
    				if (regexAnySingleEscape.test(character)) {
    					value = '\\' + character;
    				} else {
    					value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
    				}
    			} else if (/[\t\n\f\r\x0B]/.test(character)) {
    				value = '\\' + codePoint.toString(16).toUpperCase() + ' ';
    			} else if (character == '\\' || !isIdentifier && (character == '"' && quote == character || character == '\'' && quote == character) || isIdentifier && regexSingleEscape.test(character)) {
    				value = '\\' + character;
    			} else {
    				value = character;
    			}
    		}
    		output += value;
    	}

    	if (isIdentifier) {
    		if (/^-[-\d]/.test(output)) {
    			output = '\\-' + output.slice(1);
    		} else if (/\d/.test(firstChar)) {
    			output = '\\3' + firstChar + ' ' + output.slice(1);
    		}
    	}

    	// Remove spaces after `\HEX` escapes that are not followed by a hex digit,
    	// since they’re redundant. Note that this is only possible if the escape
    	// sequence isn’t preceded by an odd number of backslashes.
    	output = output.replace(regexExcessiveSpaces, function ($0, $1, $2) {
    		if ($1 && $1.length % 2) {
    			// It’s not safe to remove the space, so don’t.
    			return $0;
    		}
    		// Strip the space.
    		return ($1 || '') + $2;
    	});

    	if (!isIdentifier && options.wrap) {
    		return quote + output + quote;
    	}
    	return output;
    };

    // Expose default options (so they can be overridden globally).
    cssesc.options = {
    	'escapeEverything': false,
    	'isIdentifier': false,
    	'quotes': 'single',
    	'wrap': false
    };

    cssesc.version = '3.0.0';

    var cssesc_1 = cssesc;

    var ReferencesHandler = /** @class */ (function () {
        function ReferencesHandler(idMap) {
            this.renderedElements = {};
            this.idMap = idMap;
            this.idPrefix = String(ReferencesHandler.instanceCounter++);
        }
        ReferencesHandler.prototype.getRendered = function (id, color, renderCallback) {
            return __awaiter(this, void 0, void 0, function () {
                var key, svgNode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            key = this.generateKey(id, color);
                            if (this.renderedElements.hasOwnProperty(key)) {
                                return [2 /*return*/, this.renderedElements[id]];
                            }
                            svgNode = this.get(id);
                            this.renderedElements[key] = svgNode;
                            return [4 /*yield*/, renderCallback(svgNode)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/, svgNode];
                    }
                });
            });
        };
        ReferencesHandler.prototype.get = function (id) {
            return this.idMap[cssesc_1(id, { isIdentifier: true })];
        };
        ReferencesHandler.prototype.generateKey = function (id, color) {
            return this.idPrefix + '|' + id + '|' + (color || new RGBColor('rgb(0,0,0)')).toRGBA();
        };
        ReferencesHandler.instanceCounter = 0;
        return ReferencesHandler;
    }());

    function getAngle(from, to) {
        return Math.atan2(to[1] - from[1], to[0] - from[0]);
    }
    var cToQ = 2 / 3; // ratio to convert quadratic bezier curves to cubic ones
    // transforms a cubic bezier control point to a quadratic one: returns from + (2/3) * (to - from)
    function toCubic(from, to) {
        return [cToQ * (to[0] - from[0]) + from[0], cToQ * (to[1] - from[1]) + from[1]];
    }
    function normalize(v) {
        var length = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        return [v[0] / length, v[1] / length];
    }
    function getDirectionVector(from, to) {
        var v = [to[0] - from[0], to[1] - from[1]];
        return normalize(v);
    }
    function addVectors(v1, v2) {
        return [v1[0] + v2[0], v1[1] + v2[1]];
    }
    // multiplies a vector with a matrix: vec' = vec * matrix
    function multVecMatrix(vec, matrix) {
        var x = vec[0];
        var y = vec[1];
        return [matrix.a * x + matrix.c * y + matrix.e, matrix.b * x + matrix.d * y + matrix.f];
    }

    var Path = /** @class */ (function () {
        function Path() {
            this.segments = [];
        }
        Path.prototype.moveTo = function (x, y) {
            this.segments.push(new MoveTo(x, y));
            return this;
        };
        Path.prototype.lineTo = function (x, y) {
            this.segments.push(new LineTo(x, y));
            return this;
        };
        Path.prototype.curveTo = function (x1, y1, x2, y2, x, y) {
            this.segments.push(new CurveTo(x1, y1, x2, y2, x, y));
            return this;
        };
        Path.prototype.close = function () {
            this.segments.push(new Close());
            return this;
        };
        /**
         * Transforms the path in place
         */
        Path.prototype.transform = function (matrix) {
            this.segments.forEach(function (seg) {
                if (seg instanceof MoveTo || seg instanceof LineTo || seg instanceof CurveTo) {
                    var p = multVecMatrix([seg.x, seg.y], matrix);
                    seg.x = p[0];
                    seg.y = p[1];
                }
                if (seg instanceof CurveTo) {
                    var p1 = multVecMatrix([seg.x1, seg.y1], matrix);
                    var p2 = multVecMatrix([seg.x2, seg.y2], matrix);
                    seg.x1 = p1[0];
                    seg.y1 = p1[1];
                    seg.x2 = p2[0];
                    seg.y2 = p2[1];
                }
            });
        };
        Path.prototype.draw = function (context) {
            var p = context.pdf;
            this.segments.forEach(function (s) {
                if (s instanceof MoveTo) {
                    p.moveTo(s.x, s.y);
                }
                else if (s instanceof LineTo) {
                    p.lineTo(s.x, s.y);
                }
                else if (s instanceof CurveTo) {
                    p.curveTo(s.x1, s.y1, s.x2, s.y2, s.x, s.y);
                }
                else {
                    p.close();
                }
            });
        };
        return Path;
    }());
    var MoveTo = /** @class */ (function () {
        function MoveTo(x, y) {
            this.x = x;
            this.y = y;
        }
        return MoveTo;
    }());
    var LineTo = /** @class */ (function () {
        function LineTo(x, y) {
            this.x = x;
            this.y = y;
        }
        return LineTo;
    }());
    var CurveTo = /** @class */ (function () {
        function CurveTo(x1, y1, x2, y2, x, y) {
            this.x1 = x1;
            this.y1 = y1;
            this.x2 = x2;
            this.y2 = y2;
            this.x = x;
            this.y = y;
        }
        return CurveTo;
    }());
    var Close = /** @class */ (function () {
        function Close() {
        }
        return Close;
    }());

    function nodeIs(node, tagsString) {
        return tagsString.split(',').indexOf((node.nodeName || node.tagName).toLowerCase()) >= 0;
    }
    function forEachChild(node, fn) {
        // copy list of children, as the original might be modified
        var children = [];
        for (var i = 0; i < node.childNodes.length; i++) {
            var childNode = node.childNodes[i];
            if (childNode.nodeName.charAt(0) !== '#')
                children.push(childNode);
        }
        for (var i = 0; i < children.length; i++) {
            fn(i, children[i]);
        }
    }
    // returns an attribute of a node, either from the node directly or from css
    function getAttribute(node, styleSheets, propertyNode, propertyCss) {
        if (propertyCss === void 0) { propertyCss = propertyNode; }
        var attribute = node.style.getPropertyValue(propertyCss);
        if (attribute) {
            return attribute;
        }
        else {
            var propertyValue = styleSheets.getPropertyValue(node, propertyCss);
            if (propertyValue) {
                return propertyValue;
            }
            else if (node.hasAttribute(propertyNode)) {
                return node.getAttribute(propertyNode) || undefined;
            }
            else {
                return undefined;
            }
        }
    }
    function svgNodeIsVisible(svgNode, parentVisible, context) {
        if (getAttribute(svgNode.element, context.styleSheets, 'display') === 'none') {
            return false;
        }
        var visible = parentVisible;
        var visibility = getAttribute(svgNode.element, context.styleSheets, 'visibility');
        if (visibility) {
            visible = visibility !== 'hidden';
        }
        return visible;
    }
    function svgNodeAndChildrenVisible(svgNode, parentVisible, context) {
        var visible = svgNodeIsVisible(svgNode, parentVisible, context);
        if (svgNode.element.childNodes.length === 0) {
            return false;
        }
        svgNode.children.forEach(function (child) {
            if (child.isVisible(visible, context)) {
                visible = true;
            }
        });
        return visible;
    }

    /**
     * @constructor
     * @property {Marker[]} markers
     */
    var MarkerList = /** @class */ (function () {
        function MarkerList() {
            this.markers = [];
        }
        MarkerList.prototype.addMarker = function (markers) {
            this.markers.push(markers);
        };
        MarkerList.prototype.draw = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var i, marker, tf, angle, anchor, cos, sin;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            i = 0;
                            _a.label = 1;
                        case 1:
                            if (!(i < this.markers.length)) return [3 /*break*/, 4];
                            marker = this.markers[i];
                            tf = void 0;
                            angle = marker.angle, anchor = marker.anchor;
                            cos = Math.cos(angle);
                            sin = Math.sin(angle);
                            // position at and rotate around anchor
                            tf = context.pdf.Matrix(cos, sin, -sin, cos, anchor[0], anchor[1]);
                            // scale with stroke-width
                            tf = context.pdf.matrixMult(context.pdf.Matrix(context.attributeState.strokeWidth, 0, 0, context.attributeState.strokeWidth, 0, 0), tf);
                            tf = context.pdf.matrixMult(tf, context.transform);
                            // as the marker is already scaled by the current line width we must not apply the line width twice!
                            context.pdf.saveGraphicsState();
                            return [4 /*yield*/, context.refsHandler.getRendered(marker.id, null, function (node) {
                                    return node.apply(context);
                                })];
                        case 2:
                            _a.sent();
                            context.pdf.doFormObject(marker.id, tf);
                            context.pdf.restoreGraphicsState();
                            _a.label = 3;
                        case 3:
                            i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        return MarkerList;
    }());
    /**
     * @param {string} id
     * @param {[number,number]} anchor
     * @param {number} angle
     */
    var Marker = /** @class */ (function () {
        function Marker(id, anchor, angle) {
            this.id = id;
            this.anchor = anchor;
            this.angle = angle;
        }
        return Marker;
    }());

    /**
     * Convert em, px and bare number attributes to pixel values
     * @param {string} value
     * @param {number} pdfFontSize
     */
    function toPixels(value, pdfFontSize) {
        var match;
        // em
        match = value && value.toString().match(/^([\-0-9.]+)em$/);
        if (match) {
            return parseFloat(match[1]) * pdfFontSize;
        }
        // pixels
        match = value && value.toString().match(/^([\-0-9.]+)(px|)$/);
        if (match) {
            return parseFloat(match[1]);
        }
        return 0;
    }
    function mapAlignmentBaseline(value) {
        return alignmentBaselineMap[value] || 'alphabetic';
    }

    /**
     * parses a comma, sign and/or whitespace separated string of floats and returns
     * the single floats in an array
     */
    function parseFloats(str) {
        var floats = [];
        var regex = /[+-]?(?:(?:\d+\.?\d*)|(?:\d*\.?\d+))(?:[eE][+-]?\d+)?/g;
        var match;
        while ((match = regex.exec(str))) {
            floats.push(parseFloat(match[0]));
        }
        return floats;
    }
    /**
     * extends RGBColor by rgba colors as RGBColor is not capable of it
     * currentcolor: the color to return if colorString === 'currentcolor'
     */
    function parseColor(colorString, currentcolor) {
        if (colorString === 'transparent') {
            var transparent = new RGBColor('rgb(0,0,0)');
            transparent.a = 0;
            return transparent;
        }
        if (colorString.toLowerCase() === 'currentcolor') {
            return currentcolor || new RGBColor('rgb(0,0,0)');
        }
        var match = /\s*rgba\(((?:[^,\)]*,){3}[^,\)]*)\)\s*/.exec(colorString);
        if (match) {
            var floats = parseFloats(match[1]);
            var color = new RGBColor('rgb(' + floats.slice(0, 3).join(',') + ')');
            color.a = floats[3];
            return color;
        }
        else {
            return new RGBColor(colorString);
        }
    }

    // parse
    // =====

    // states
    // ------

    var PLAIN                = 0;
    var STRINGS              = 1;
    var ESCAPING             = 2;
    var IDENTIFIER           = 3;
    var SEPARATING           = 4;
    var SPACEAFTERIDENTIFIER = 5;

    // patterns
    // --------

    var identifierPattern = /[a-z0-9_-]/i;
    var spacePattern      = /[\s\t]/;

    // ---

    var parse = function(str) {

      // vars
      // ----

      var starting = true;
      var state    = PLAIN;
      var buffer   = '';
      var i        = 0;
      var quote;
      var c;

      // result
      // ------

      var names  = [];

      // parse
      // -----

      while (true) {

        c = str[i];

        if (state === PLAIN) {

          if (!c && starting) {

            break;

          } else if (!c && !starting) {

            throw new Error('Parse error');

          } else if (c === '"' || c === "'") {

            quote = c;
            state = STRINGS;
            starting = false;

          } else if (spacePattern.test(c)) ; else if (identifierPattern.test(c)) {

            state = IDENTIFIER;
            starting = false;
            i--;

          } else {

            throw new Error('Parse error');

          }

        } else if (state === STRINGS) {

          if (!c) {

            throw new Error('Parse Error');

          } else if (c === "\\") {

            state = ESCAPING;

          } else if (c === quote) {

            names.push(buffer);
            buffer = '';
            state = SEPARATING;

          } else {

            buffer += c;

          }

        } else if (state === ESCAPING) {

          if (c === quote || c === "\\") {

            buffer += c;
            state = STRINGS;

          } else {

            throw new Error('Parse error');

          }

        } else if (state === IDENTIFIER) {

          if (!c) {

            names.push(buffer);
            break;

          } else if (identifierPattern.test(c)) {

            buffer += c;

          } else if (c === ',') {

            names.push(buffer);
            buffer = '';
            state = PLAIN;

          } else if (spacePattern.test(c)) {

            state = SPACEAFTERIDENTIFIER;
          } else {

            throw new Error('Parse error');

          }
        } else if (state === SPACEAFTERIDENTIFIER) {

          if (!c) {

            names.push(buffer);
            break;

          } else if (identifierPattern.test(c)) {

            buffer += ' ' + c;
            state = IDENTIFIER;

          } else if (c === ',') {

            names.push(buffer);
            buffer = '';
            state = PLAIN;

          } else if (spacePattern.test(c)) ; else {

            throw new Error('Parse error');

          }

        } else if (state === SEPARATING) {

          if (!c) {

            break;

          } else if (c === ',') {

            state = PLAIN;

          } else if (spacePattern.test(c)) ; else {

            throw new Error('Parse error');

          }

        }

        i++;

      }

      // result
      // ------

      return names;

    };

    // stringify
    // =========

    // pattern
    // -------

    var stringsPattern = /[^a-z0-9_-]/i;

    // ---

    var stringify = function(names, options) {

      // quote
      // -----

      var quote = options && options.quote || '"';
      if (quote !== '"' && quote !== "'") {
        throw new Error('Quote must be `\'` or `"`');
      }
      var quotePattern = new RegExp(quote, 'g');

      // stringify
      // ---------

      var safeNames = [];

      for (var i = 0; i < names.length; ++i) {
        var name = names[i];

        if (stringsPattern.test(name)) {
          name = name
            .replace(/\\/g, "\\\\")
            .replace(quotePattern, "\\" + quote);
          name = quote + name + quote;
        }
        safeNames.push(name);
      }

      // result
      // ------

      return safeNames.join(', ');
    };

    // export
    // ======

    var C__Users_hollaender_Documents_github_svg2pdf_node_modules_fontFamilyPapandreou = {
      parse:     parse,
      stringify: stringify,
    };

    var fontAliases = {
        'sans-serif': 'helvetica',
        verdana: 'helvetica',
        arial: 'helvetica',
        fixed: 'courier',
        monospace: 'courier',
        terminal: 'courier',
        serif: 'times',
        cursive: 'times',
        fantasy: 'times'
    };
    function findFirstAvailableFontFamily(attributeState, fontFamilies, context) {
        var fontType = combineFontStyleAndFontWeight(attributeState.fontStyle, attributeState.fontWeight);
        var availableFonts = context.pdf.getFontList();
        var firstAvailable = '';
        var fontIsAvailable = fontFamilies.some(function (font) {
            var availableStyles = availableFonts[font];
            if (availableStyles && availableStyles.indexOf(fontType) >= 0) {
                firstAvailable = font;
                return true;
            }
            font = font.toLowerCase();
            if (fontAliases.hasOwnProperty(font)) {
                firstAvailable = font;
                return true;
            }
            return false;
        });
        if (!fontIsAvailable) {
            firstAvailable = 'times';
        }
        return firstAvailable;
    }
    var isJsPDF23 = (function () {
        var parts = jsPDF__default.version.split('.');
        return parseFloat(parts[0]) === 2 && parseFloat(parts[1]) === 3;
    })();
    function combineFontStyleAndFontWeight(fontStyle, fontWeight) {
        if (isJsPDF23) {
            return fontWeight == 400
                ? fontStyle == 'italic'
                    ? 'italic'
                    : 'normal'
                : fontWeight == 700 && fontStyle !== 'italic'
                    ? 'bold'
                    : fontStyle + '' + fontWeight;
        }
        else {
            return fontWeight == 400 || fontWeight === 'normal'
                ? fontStyle === 'italic'
                    ? 'italic'
                    : 'normal'
                : (fontWeight == 700 || fontWeight === 'bold') && fontStyle === 'normal'
                    ? 'bold'
                    : (fontWeight == 700 ? 'bold' : fontWeight) + '' + fontStyle;
        }
    }

    function getBoundingBoxByChildren(context, svgnode) {
        if (getAttribute(svgnode.element, context.styleSheets, 'display') === 'none') {
            return [0, 0, 0, 0];
        }
        var boundingBox = [0, 0, 0, 0];
        svgnode.children.forEach(function (child) {
            var nodeBox = child.getBoundingBox(context);
            boundingBox = [
                Math.min(boundingBox[0], nodeBox[0]),
                Math.min(boundingBox[1], nodeBox[1]),
                Math.max(boundingBox[0] + boundingBox[2], nodeBox[0] + nodeBox[2]) -
                    Math.min(boundingBox[0], nodeBox[0]),
                Math.max(boundingBox[1] + boundingBox[3], nodeBox[1] + nodeBox[3]) -
                    Math.min(boundingBox[1], nodeBox[1])
            ];
        });
        return boundingBox;
    }
    function defaultBoundingBox(element, context) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        var pf = parseFloat;
        // TODO: check if there are other possible coordinate attributes
        var x1 = pf(element.getAttribute('x1')) ||
            pf(getAttribute(element, context.styleSheets, 'x')) ||
            pf(getAttribute(element, context.styleSheets, 'cx')) -
                pf(getAttribute(element, context.styleSheets, 'r')) ||
            0;
        var x2 = pf(element.getAttribute('x2')) ||
            x1 + pf(getAttribute(element, context.styleSheets, 'width')) ||
            pf(getAttribute(element, context.styleSheets, 'cx')) +
                pf(getAttribute(element, context.styleSheets, 'r')) ||
            0;
        var y1 = pf(element.getAttribute('y1')) ||
            pf(getAttribute(element, context.styleSheets, 'y')) ||
            pf(getAttribute(element, context.styleSheets, 'cy')) -
                pf(getAttribute(element, context.styleSheets, 'r')) ||
            0;
        var y2 = pf(element.getAttribute('y2')) ||
            y1 + pf(getAttribute(element, context.styleSheets, 'height')) ||
            pf(getAttribute(element, context.styleSheets, 'cy')) +
                pf(getAttribute(element, context.styleSheets, 'r')) ||
            0;
        return [
            Math.min(x1, x2),
            Math.min(y1, y2),
            Math.max(x1, x2) - Math.min(x1, x2),
            Math.max(y1, y2) - Math.min(y1, y2)
        ];
    }

    function computeViewBoxTransform(node, viewBox, eX, eY, eWidth, eHeight, context, noTranslate) {
        if (noTranslate === void 0) { noTranslate = false; }
        var vbX = viewBox[0];
        var vbY = viewBox[1];
        var vbWidth = viewBox[2];
        var vbHeight = viewBox[3];
        var scaleX = eWidth / vbWidth;
        var scaleY = eHeight / vbHeight;
        var align, meetOrSlice;
        var preserveAspectRatio = node.getAttribute('preserveAspectRatio');
        if (preserveAspectRatio) {
            var alignAndMeetOrSlice = preserveAspectRatio.split(' ');
            if (alignAndMeetOrSlice[0] === 'defer') {
                alignAndMeetOrSlice = alignAndMeetOrSlice.slice(1);
            }
            align = alignAndMeetOrSlice[0];
            meetOrSlice = alignAndMeetOrSlice[1] || 'meet';
        }
        else {
            align = 'xMidYMid';
            meetOrSlice = 'meet';
        }
        if (align !== 'none') {
            if (meetOrSlice === 'meet') {
                // uniform scaling with min scale
                scaleX = scaleY = Math.min(scaleX, scaleY);
            }
            else if (meetOrSlice === 'slice') {
                // uniform scaling with max scale
                scaleX = scaleY = Math.max(scaleX, scaleY);
            }
        }
        if (noTranslate) {
            return context.pdf.Matrix(scaleX, 0, 0, scaleY, 0, 0);
        }
        var translateX = eX - vbX * scaleX;
        var translateY = eY - vbY * scaleY;
        if (align.indexOf('xMid') >= 0) {
            translateX += (eWidth - vbWidth * scaleX) / 2;
        }
        else if (align.indexOf('xMax') >= 0) {
            translateX += eWidth - vbWidth * scaleX;
        }
        if (align.indexOf('YMid') >= 0) {
            translateY += (eHeight - vbHeight * scaleY) / 2;
        }
        else if (align.indexOf('YMax') >= 0) {
            translateY += eHeight - vbHeight * scaleY;
        }
        var translate = context.pdf.Matrix(1, 0, 0, 1, translateX, translateY);
        var scale = context.pdf.Matrix(scaleX, 0, 0, scaleY, 0, 0);
        return context.pdf.matrixMult(scale, translate);
    }
    // parses the "transform" string
    function parseTransform(transformString, context) {
        if (!transformString || transformString === 'none')
            return context.pdf.unitMatrix;
        var mRegex = /^[\s,]*matrix\(([^)]+)\)\s*/, tRegex = /^[\s,]*translate\(([^)]+)\)\s*/, rRegex = /^[\s,]*rotate\(([^)]+)\)\s*/, sRegex = /^[\s,]*scale\(([^)]+)\)\s*/, sXRegex = /^[\s,]*skewX\(([^)]+)\)\s*/, sYRegex = /^[\s,]*skewY\(([^)]+)\)\s*/;
        var resultMatrix = context.pdf.unitMatrix;
        var m;
        var tSLength;
        while (transformString.length > 0 && transformString.length !== tSLength) {
            tSLength = transformString.length;
            var match = mRegex.exec(transformString);
            if (match) {
                m = parseFloats(match[1]);
                resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(m[0], m[1], m[2], m[3], m[4], m[5]), resultMatrix);
                transformString = transformString.substr(match[0].length);
            }
            match = rRegex.exec(transformString);
            if (match) {
                m = parseFloats(match[1]);
                var a = (Math.PI * m[0]) / 180;
                resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0), resultMatrix);
                if (m[1] || m[2]) {
                    var t1 = context.pdf.Matrix(1, 0, 0, 1, m[1], m[2]);
                    var t2 = context.pdf.Matrix(1, 0, 0, 1, -m[1], -m[2]);
                    resultMatrix = context.pdf.matrixMult(t2, context.pdf.matrixMult(resultMatrix, t1));
                }
                transformString = transformString.substr(match[0].length);
            }
            match = tRegex.exec(transformString);
            if (match) {
                m = parseFloats(match[1]);
                resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(1, 0, 0, 1, m[0], m[1] || 0), resultMatrix);
                transformString = transformString.substr(match[0].length);
            }
            match = sRegex.exec(transformString);
            if (match) {
                m = parseFloats(match[1]);
                if (!m[1])
                    m[1] = m[0];
                resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(m[0], 0, 0, m[1], 0, 0), resultMatrix);
                transformString = transformString.substr(match[0].length);
            }
            match = sXRegex.exec(transformString);
            if (match) {
                m = parseFloat(match[1]);
                m *= Math.PI / 180;
                resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(1, 0, Math.tan(m), 1, 0, 0), resultMatrix);
                transformString = transformString.substr(match[0].length);
            }
            match = sYRegex.exec(transformString);
            if (match) {
                m = parseFloat(match[1]);
                m *= Math.PI / 180;
                resultMatrix = context.pdf.matrixMult(context.pdf.Matrix(1, Math.tan(m), 0, 1, 0, 0), resultMatrix);
                transformString = transformString.substr(match[0].length);
            }
        }
        return resultMatrix;
    }

    var SvgNode = /** @class */ (function () {
        function SvgNode(element, children) {
            this.element = element;
            this.children = children;
            this.parent = null;
        }
        SvgNode.prototype.setParent = function (parent) {
            this.parent = parent;
        };
        SvgNode.prototype.getParent = function () {
            return this.parent;
        };
        SvgNode.prototype.getBoundingBox = function (context) {
            if (getAttribute(this.element, context.styleSheets, 'display') === 'none') {
                return [0, 0, 0, 0];
            }
            return this.getBoundingBoxCore(context);
        };
        SvgNode.prototype.computeNodeTransform = function (context) {
            var nodeTransform = this.computeNodeTransformCore(context);
            var transformString = getAttribute(this.element, context.styleSheets, 'transform');
            if (!transformString)
                return nodeTransform;
            else
                return context.pdf.matrixMult(nodeTransform, parseTransform(transformString, context));
        };
        return SvgNode;
    }());

    var NonRenderedNode = /** @class */ (function (_super) {
        __extends(NonRenderedNode, _super);
        function NonRenderedNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        NonRenderedNode.prototype.render = function (parentContext) {
            return Promise.resolve();
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        NonRenderedNode.prototype.getBoundingBoxCore = function (context) {
            return [];
        };
        NonRenderedNode.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        return NonRenderedNode;
    }(SvgNode));

    var Gradient = /** @class */ (function (_super) {
        __extends(Gradient, _super);
        function Gradient(pdfGradientType, element, children) {
            var _this = _super.call(this, element, children) || this;
            _this.pdfGradientType = pdfGradientType;
            _this.contextColor = undefined;
            return _this;
        }
        Gradient.prototype.apply = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var id, colors, opacitySum, hasOpacity, gState, pattern;
                return __generator(this, function (_a) {
                    id = this.element.getAttribute('id');
                    if (!id) {
                        return [2 /*return*/];
                    }
                    colors = this.getStops(context.styleSheets);
                    opacitySum = 0;
                    hasOpacity = false;
                    colors.forEach(function (_a) {
                        var opacity = _a.opacity;
                        if (opacity && opacity !== 1) {
                            opacitySum += opacity;
                            hasOpacity = true;
                        }
                    });
                    if (hasOpacity) {
                        gState = new jsPDF.GState({ opacity: opacitySum / colors.length });
                    }
                    pattern = new jsPDF.ShadingPattern(this.pdfGradientType, this.getCoordinates(), colors, gState);
                    context.pdf.addShadingPattern(id, pattern);
                    return [2 /*return*/];
                });
            });
        };
        Gradient.prototype.getStops = function (styleSheets) {
            var _this = this;
            if (this.stops) {
                return this.stops;
            }
            // Only need to calculate contextColor once
            if (this.contextColor === undefined) {
                this.contextColor = null;
                var ancestor = this;
                while (ancestor) {
                    var colorAttr = getAttribute(ancestor.element, styleSheets, 'color');
                    if (colorAttr) {
                        this.contextColor = parseColor(colorAttr, null);
                        break;
                    }
                    ancestor = ancestor.getParent();
                }
            }
            var stops = [];
            this.children.forEach(function (stop) {
                if (stop.element.tagName.toLowerCase() === 'stop') {
                    var colorAttr = getAttribute(stop.element, styleSheets, 'color');
                    var color = parseColor(getAttribute(stop.element, styleSheets, 'stop-color') || '', colorAttr ? parseColor(colorAttr, null) : _this.contextColor);
                    var opacity = parseFloat(getAttribute(stop.element, styleSheets, 'stop-opacity') || '1');
                    stops.push({
                        offset: Gradient.parseGradientOffset(stop.element.getAttribute('offset') || '0'),
                        color: [color.r, color.g, color.b],
                        opacity: opacity
                    });
                }
            });
            return (this.stops = stops);
        };
        Gradient.prototype.getBoundingBoxCore = function (context) {
            return defaultBoundingBox(this.element, context);
        };
        Gradient.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        Gradient.prototype.isVisible = function (parentVisible, context) {
            return svgNodeAndChildrenVisible(this, parentVisible, context);
        };
        /**
         * Convert percentage to decimal
         */
        Gradient.parseGradientOffset = function (value) {
            var parsedValue = parseFloat(value);
            if (!isNaN(parsedValue) && value.indexOf('%') >= 0) {
                return parsedValue / 100;
            }
            return parsedValue;
        };
        return Gradient;
    }(NonRenderedNode));

    var LinearGradient = /** @class */ (function (_super) {
        __extends(LinearGradient, _super);
        function LinearGradient(element, children) {
            return _super.call(this, 'axial', element, children) || this;
        }
        LinearGradient.prototype.getCoordinates = function () {
            return [
                parseFloat(this.element.getAttribute('x1') || '0'),
                parseFloat(this.element.getAttribute('y1') || '0'),
                parseFloat(this.element.getAttribute('x2') || '1'),
                parseFloat(this.element.getAttribute('y2') || '0')
            ];
        };
        return LinearGradient;
    }(Gradient));

    var RadialGradient = /** @class */ (function (_super) {
        __extends(RadialGradient, _super);
        function RadialGradient(element, children) {
            return _super.call(this, 'radial', element, children) || this;
        }
        RadialGradient.prototype.getCoordinates = function () {
            var cx = this.element.getAttribute('cx');
            var cy = this.element.getAttribute('cy');
            var fx = this.element.getAttribute('fx');
            var fy = this.element.getAttribute('fy');
            return [
                parseFloat(fx || cx || '0.5'),
                parseFloat(fy || cy || '0.5'),
                0,
                parseFloat(cx || '0.5'),
                parseFloat(cy || '0.5'),
                parseFloat(this.element.getAttribute('r') || '0.5')
            ];
        };
        return RadialGradient;
    }(Gradient));

    var GradientFill = /** @class */ (function () {
        function GradientFill(key, gradient) {
            this.key = key;
            this.gradient = gradient;
        }
        GradientFill.prototype.getFillData = function (forNode, context) {
            return __awaiter(this, void 0, void 0, function () {
                var gradientUnitsMatrix, bBox, gradientTransform;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, context.refsHandler.getRendered(this.key, null, function (node) {
                                return node.apply(new Context(context.pdf, {
                                    refsHandler: context.refsHandler,
                                    textMeasure: context.textMeasure,
                                    styleSheets: context.styleSheets,
                                    viewport: context.viewport,
                                    svg2pdfParameters: context.svg2pdfParameters
                                }));
                            })
                            // matrix to convert between gradient space and user space
                            // for "userSpaceOnUse" this is the current transformation: tfMatrix
                            // for "objectBoundingBox" or default, the gradient gets scaled and transformed to the bounding box
                        ];
                        case 1:
                            _a.sent();
                            if (!this.gradient.element.hasAttribute('gradientUnits') ||
                                this.gradient.element.getAttribute('gradientUnits').toLowerCase() === 'objectboundingbox') {
                                bBox = forNode.getBoundingBox(context);
                                gradientUnitsMatrix = context.pdf.Matrix(bBox[2], 0, 0, bBox[3], bBox[0], bBox[1]);
                            }
                            else {
                                gradientUnitsMatrix = context.pdf.unitMatrix;
                            }
                            gradientTransform = parseTransform(getAttribute(this.gradient.element, context.styleSheets, 'gradientTransform', 'transform'), context);
                            return [2 /*return*/, {
                                    key: this.key,
                                    matrix: context.pdf.matrixMult(gradientTransform, gradientUnitsMatrix)
                                }];
                    }
                });
            });
        };
        return GradientFill;
    }());

    var Pattern = /** @class */ (function (_super) {
        __extends(Pattern, _super);
        function Pattern() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Pattern.prototype.apply = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var id, bBox, pattern, _i, _a, child;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            id = this.element.getAttribute('id');
                            if (!id) {
                                return [2 /*return*/];
                            }
                            bBox = this.getBoundingBox(context);
                            pattern = new jsPDF.TilingPattern([bBox[0], bBox[1], bBox[0] + bBox[2], bBox[1] + bBox[3]], bBox[2], bBox[3]);
                            context.pdf.beginTilingPattern(pattern);
                            _i = 0, _a = this.children;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            child = _a[_i];
                            return [4 /*yield*/, child.render(new Context(context.pdf, {
                                    attributeState: context.attributeState,
                                    refsHandler: context.refsHandler,
                                    styleSheets: context.styleSheets,
                                    viewport: context.viewport,
                                    svg2pdfParameters: context.svg2pdfParameters
                                }))];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            context.pdf.endTilingPattern(id, pattern);
                            return [2 /*return*/];
                    }
                });
            });
        };
        Pattern.prototype.getBoundingBoxCore = function (context) {
            return defaultBoundingBox(this.element, context);
        };
        Pattern.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        Pattern.prototype.isVisible = function (parentVisible, context) {
            return svgNodeAndChildrenVisible(this, parentVisible, context);
        };
        return Pattern;
    }(NonRenderedNode));

    var PatternFill = /** @class */ (function () {
        function PatternFill(key, pattern) {
            this.key = key;
            this.pattern = pattern;
        }
        PatternFill.prototype.getFillData = function (forNode, context) {
            return __awaiter(this, void 0, void 0, function () {
                var patternData, bBox, patternUnitsMatrix, fillBBox, x, y, width, height, patternContentUnitsMatrix, fillBBox, x, y, width, height, patternTransformMatrix, patternTransform, matrix;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, context.refsHandler.getRendered(this.key, null, function (node) {
                                return node.apply(new Context(context.pdf, {
                                    refsHandler: context.refsHandler,
                                    textMeasure: context.textMeasure,
                                    styleSheets: context.styleSheets,
                                    viewport: context.viewport,
                                    svg2pdfParameters: context.svg2pdfParameters
                                }));
                            })];
                        case 1:
                            _a.sent();
                            patternData = {
                                key: this.key,
                                boundingBox: undefined,
                                xStep: 0,
                                yStep: 0,
                                matrix: undefined
                            };
                            patternUnitsMatrix = context.pdf.unitMatrix;
                            if (!this.pattern.element.hasAttribute('patternUnits') ||
                                this.pattern.element.getAttribute('patternUnits').toLowerCase() === 'objectboundingbox') {
                                bBox = forNode.getBoundingBox(context);
                                patternUnitsMatrix = context.pdf.Matrix(1, 0, 0, 1, bBox[0], bBox[1]);
                                fillBBox = this.pattern.getBoundingBox(context);
                                x = fillBBox[0] * bBox[0] || 0;
                                y = fillBBox[1] * bBox[1] || 0;
                                width = fillBBox[2] * bBox[2] || 0;
                                height = fillBBox[3] * bBox[3] || 0;
                                patternData.boundingBox = [x, y, x + width, y + height];
                                patternData.xStep = width;
                                patternData.yStep = height;
                            }
                            patternContentUnitsMatrix = context.pdf.unitMatrix;
                            if (this.pattern.element.hasAttribute('patternContentUnits') &&
                                this.pattern.element.getAttribute('patternContentUnits').toLowerCase() ===
                                    'objectboundingbox') {
                                bBox || (bBox = forNode.getBoundingBox(context));
                                patternContentUnitsMatrix = context.pdf.Matrix(bBox[2], 0, 0, bBox[3], 0, 0);
                                fillBBox = patternData.boundingBox || this.pattern.getBoundingBox(context);
                                x = fillBBox[0] / bBox[0] || 0;
                                y = fillBBox[1] / bBox[1] || 0;
                                width = fillBBox[2] / bBox[2] || 0;
                                height = fillBBox[3] / bBox[3] || 0;
                                patternData.boundingBox = [x, y, x + width, y + height];
                                patternData.xStep = width;
                                patternData.yStep = height;
                            }
                            patternTransformMatrix = context.pdf.unitMatrix;
                            patternTransform = getAttribute(this.pattern.element, context.styleSheets, 'patternTransform', 'transform');
                            if (patternTransform) {
                                patternTransformMatrix = parseTransform(patternTransform, context);
                            }
                            matrix = patternContentUnitsMatrix;
                            matrix = context.pdf.matrixMult(matrix, patternUnitsMatrix); // translate by
                            matrix = context.pdf.matrixMult(matrix, patternTransformMatrix);
                            matrix = context.pdf.matrixMult(matrix, context.transform);
                            patternData.matrix = matrix;
                            return [2 /*return*/, patternData];
                    }
                });
            });
        };
        return PatternFill;
    }());

    function parseFill(fill, context) {
        var url = iriReference.exec(fill);
        if (url) {
            var fillUrl = url[1];
            var fillNode = context.refsHandler.get(fillUrl);
            if (fillNode && (fillNode instanceof LinearGradient || fillNode instanceof RadialGradient)) {
                return getGradientFill(fillUrl, fillNode, context);
            }
            else if (fillNode && fillNode instanceof Pattern) {
                return new PatternFill(fillUrl, fillNode);
            }
            else {
                // unsupported fill argument -> fill black
                return new ColorFill(new RGBColor('rgb(0, 0, 0)'));
            }
        }
        else {
            // plain color
            var fillColor = parseColor(fill, context.attributeState.color);
            if (fillColor.ok) {
                return new ColorFill(fillColor);
            }
            else if (fill === 'none') {
                return null;
            }
            else {
                return null;
            }
        }
    }
    function getGradientFill(fillUrl, gradient, context) {
        // "It is necessary that at least two stops are defined to have a gradient effect. If no stops are
        // defined, then painting shall occur as if 'none' were specified as the paint style. If one stop
        // is defined, then paint with the solid color fill using the color defined for that gradient
        // stop."
        var stops = gradient.getStops(context.styleSheets);
        if (stops.length === 0) {
            return null;
        }
        if (stops.length === 1) {
            var stopColor = stops[0].color;
            var rgbColor = new RGBColor();
            rgbColor.ok = true;
            rgbColor.r = stopColor[0];
            rgbColor.g = stopColor[1];
            rgbColor.b = stopColor[2];
            rgbColor.a = stops[0].opacity;
            return new ColorFill(rgbColor);
        }
        return new GradientFill(fillUrl, gradient);
    }

    function parseAttributes(context, svgNode, node) {
        var domNode = node || svgNode.element;
        // update color first so currentColor becomes available for this node
        var color = getAttribute(domNode, context.styleSheets, 'color');
        if (color) {
            var fillColor = parseColor(color, context.attributeState.color);
            if (fillColor.ok) {
                context.attributeState.color = fillColor;
            }
            else {
                // invalid color passed, reset to black
                context.attributeState.color = new RGBColor('rgb(0,0,0)');
            }
        }
        var visibility = getAttribute(domNode, context.styleSheets, 'visibility');
        if (visibility) {
            context.attributeState.visibility = visibility;
        }
        // fill mode
        var fill = getAttribute(domNode, context.styleSheets, 'fill');
        if (fill) {
            context.attributeState.fill = parseFill(fill, context);
        }
        // opacity is realized via a pdf graphics state
        var fillOpacity = getAttribute(domNode, context.styleSheets, 'fill-opacity');
        if (fillOpacity) {
            context.attributeState.fillOpacity = parseFloat(fillOpacity);
        }
        var strokeOpacity = getAttribute(domNode, context.styleSheets, 'stroke-opacity');
        if (strokeOpacity) {
            context.attributeState.strokeOpacity = parseFloat(strokeOpacity);
        }
        var opacity = getAttribute(domNode, context.styleSheets, 'opacity');
        if (opacity) {
            context.attributeState.opacity = parseFloat(opacity);
        }
        // stroke mode
        var strokeWidth = getAttribute(domNode, context.styleSheets, 'stroke-width');
        if (strokeWidth !== void 0 && strokeWidth !== '') {
            context.attributeState.strokeWidth = Math.abs(parseFloat(strokeWidth));
        }
        var stroke = getAttribute(domNode, context.styleSheets, 'stroke');
        if (stroke) {
            if (stroke === 'none') {
                context.attributeState.stroke = null;
            }
            else {
                // gradients, patterns not supported for strokes ...
                var strokeRGB = parseColor(stroke, context.attributeState.color);
                if (strokeRGB.ok) {
                    context.attributeState.stroke = new ColorFill(strokeRGB);
                }
            }
        }
        var lineCap = getAttribute(domNode, context.styleSheets, 'stroke-linecap');
        if (lineCap) {
            context.attributeState.strokeLinecap = lineCap;
        }
        var lineJoin = getAttribute(domNode, context.styleSheets, 'stroke-linejoin');
        if (lineJoin) {
            context.attributeState.strokeLinejoin = lineJoin;
        }
        var dashArray = getAttribute(domNode, context.styleSheets, 'stroke-dasharray');
        if (dashArray) {
            var dashOffset = parseInt(getAttribute(domNode, context.styleSheets, 'stroke-dashoffset') || '0');
            context.attributeState.strokeDasharray = parseFloats(dashArray);
            context.attributeState.strokeDashoffset = dashOffset;
        }
        var miterLimit = getAttribute(domNode, context.styleSheets, 'stroke-miterlimit');
        if (miterLimit !== void 0 && miterLimit !== '') {
            context.attributeState.strokeMiterlimit = parseFloat(miterLimit);
        }
        var xmlSpace = domNode.getAttribute('xml:space');
        if (xmlSpace) {
            context.attributeState.xmlSpace = xmlSpace;
        }
        var fontWeight = getAttribute(domNode, context.styleSheets, 'font-weight');
        if (fontWeight) {
            context.attributeState.fontWeight = fontWeight;
        }
        var fontStyle = getAttribute(domNode, context.styleSheets, 'font-style');
        if (fontStyle) {
            context.attributeState.fontStyle = fontStyle;
        }
        var fontFamily = getAttribute(domNode, context.styleSheets, 'font-family');
        if (fontFamily) {
            var fontFamilies = C__Users_hollaender_Documents_github_svg2pdf_node_modules_fontFamilyPapandreou.parse(fontFamily);
            context.attributeState.fontFamily = findFirstAvailableFontFamily(context.attributeState, fontFamilies, context);
        }
        var fontSize = getAttribute(domNode, context.styleSheets, 'font-size');
        if (fontSize) {
            var pdfFontSize = context.pdf.getFontSize();
            context.attributeState.fontSize = toPixels(fontSize, pdfFontSize);
        }
        var alignmentBaseline = getAttribute(domNode, context.styleSheets, 'vertical-align') ||
            getAttribute(domNode, context.styleSheets, 'alignment-baseline');
        if (alignmentBaseline) {
            var matchArr = alignmentBaseline.match(/(baseline|text-bottom|alphabetic|ideographic|middle|central|mathematical|text-top|bottom|center|top|hanging)/);
            if (matchArr) {
                context.attributeState.alignmentBaseline = matchArr[0];
            }
        }
        var textAnchor = getAttribute(domNode, context.styleSheets, 'text-anchor');
        if (textAnchor) {
            context.attributeState.textAnchor = textAnchor;
        }
    }
    function applyAttributes(childContext, parentContext, node) {
        var fillOpacity = 1.0, strokeOpacity = 1.0;
        fillOpacity *= childContext.attributeState.fillOpacity;
        fillOpacity *= childContext.attributeState.opacity;
        if (childContext.attributeState.fill instanceof ColorFill &&
            typeof childContext.attributeState.fill.color.a !== 'undefined') {
            fillOpacity *= childContext.attributeState.fill.color.a;
        }
        strokeOpacity *= childContext.attributeState.strokeOpacity;
        strokeOpacity *= childContext.attributeState.opacity;
        if (childContext.attributeState.stroke instanceof ColorFill &&
            typeof childContext.attributeState.stroke.color.a !== 'undefined') {
            strokeOpacity *= childContext.attributeState.stroke.color.a;
        }
        var hasFillOpacity = fillOpacity < 1.0;
        var hasStrokeOpacity = strokeOpacity < 1.0;
        // This is a workaround for symbols that are used multiple times with different
        // fill/stroke attributes. All paths within symbols are both filled and stroked
        // and we set the fill/stroke to transparent if the use element has
        // fill/stroke="none".
        if (nodeIs(node, 'use')) {
            hasFillOpacity = true;
            hasStrokeOpacity = true;
            fillOpacity *= childContext.attributeState.fill ? 1 : 0;
            strokeOpacity *= childContext.attributeState.stroke ? 1 : 0;
        }
        else if (childContext.withinUse) {
            if (childContext.attributeState.fill !== parentContext.attributeState.fill) {
                hasFillOpacity = true;
                fillOpacity *= childContext.attributeState.fill ? 1 : 0;
            }
            else if (hasFillOpacity && !childContext.attributeState.fill) {
                fillOpacity = 0;
            }
            if (childContext.attributeState.stroke !== parentContext.attributeState.stroke) {
                hasStrokeOpacity = true;
                strokeOpacity *= childContext.attributeState.stroke ? 1 : 0;
            }
            else if (hasStrokeOpacity && !childContext.attributeState.stroke) {
                strokeOpacity = 0;
            }
        }
        if (hasFillOpacity || hasStrokeOpacity) {
            var gState = {};
            hasFillOpacity && (gState['opacity'] = fillOpacity);
            hasStrokeOpacity && (gState['stroke-opacity'] = strokeOpacity);
            childContext.pdf.setGState(new jsPDF.GState(gState));
        }
        if (childContext.attributeState.fill &&
            childContext.attributeState.fill !== parentContext.attributeState.fill &&
            childContext.attributeState.fill instanceof ColorFill &&
            childContext.attributeState.fill.color.ok &&
            !nodeIs(node, 'text')) {
            // text fill color will be applied through setTextColor()
            childContext.pdf.setFillColor(childContext.attributeState.fill.color.r, childContext.attributeState.fill.color.g, childContext.attributeState.fill.color.b);
        }
        if (childContext.attributeState.strokeWidth !== parentContext.attributeState.strokeWidth) {
            childContext.pdf.setLineWidth(childContext.attributeState.strokeWidth);
        }
        if (childContext.attributeState.stroke !== parentContext.attributeState.stroke &&
            childContext.attributeState.stroke instanceof ColorFill) {
            childContext.pdf.setDrawColor(childContext.attributeState.stroke.color.r, childContext.attributeState.stroke.color.g, childContext.attributeState.stroke.color.b);
        }
        if (childContext.attributeState.strokeLinecap !== parentContext.attributeState.strokeLinecap) {
            childContext.pdf.setLineCap(childContext.attributeState.strokeLinecap);
        }
        if (childContext.attributeState.strokeLinejoin !== parentContext.attributeState.strokeLinejoin) {
            childContext.pdf.setLineJoin(childContext.attributeState.strokeLinejoin);
        }
        if ((childContext.attributeState.strokeDasharray !== parentContext.attributeState.strokeDasharray ||
            childContext.attributeState.strokeDashoffset !==
                parentContext.attributeState.strokeDashoffset) &&
            childContext.attributeState.strokeDasharray) {
            childContext.pdf.setLineDashPattern(childContext.attributeState.strokeDasharray, childContext.attributeState.strokeDashoffset);
        }
        if (childContext.attributeState.strokeMiterlimit !== parentContext.attributeState.strokeMiterlimit) {
            childContext.pdf.setLineMiterLimit(childContext.attributeState.strokeMiterlimit);
        }
        var font;
        if (childContext.attributeState.fontFamily !== parentContext.attributeState.fontFamily) {
            if (fontAliases.hasOwnProperty(childContext.attributeState.fontFamily)) {
                font = fontAliases[childContext.attributeState.fontFamily];
            }
            else {
                font = childContext.attributeState.fontFamily;
            }
        }
        if (childContext.attributeState.fill &&
            childContext.attributeState.fill !== parentContext.attributeState.fill &&
            childContext.attributeState.fill instanceof ColorFill &&
            childContext.attributeState.fill.color.ok) {
            var fillColor = childContext.attributeState.fill.color;
            childContext.pdf.setTextColor(fillColor.r, fillColor.g, fillColor.b);
        }
        var fontStyle;
        if (childContext.attributeState.fontWeight !== parentContext.attributeState.fontWeight ||
            childContext.attributeState.fontStyle !== parentContext.attributeState.fontStyle) {
            fontStyle = combineFontStyleAndFontWeight(childContext.attributeState.fontStyle, childContext.attributeState.fontWeight);
        }
        if (font !== undefined || fontStyle !== undefined) {
            if (font === undefined) {
                if (fontAliases.hasOwnProperty(childContext.attributeState.fontFamily)) {
                    font = fontAliases[childContext.attributeState.fontFamily];
                }
                else {
                    font = childContext.attributeState.fontFamily;
                }
            }
            childContext.pdf.setFont(font, fontStyle);
        }
        if (childContext.attributeState.fontSize !== parentContext.attributeState.fontSize) {
            // correct for a jsPDF-instance measurement unit that differs from `pt`
            childContext.pdf.setFontSize(childContext.attributeState.fontSize * childContext.pdf.internal.scaleFactor);
        }
    }
    function applyContext(context) {
        var attributeState = context.attributeState, pdf = context.pdf;
        var fillOpacity = 1.0, strokeOpacity = 1.0;
        fillOpacity *= attributeState.fillOpacity;
        fillOpacity *= attributeState.opacity;
        if (attributeState.fill instanceof ColorFill &&
            typeof attributeState.fill.color.a !== 'undefined') {
            fillOpacity *= attributeState.fill.color.a;
        }
        strokeOpacity *= attributeState.strokeOpacity;
        strokeOpacity *= attributeState.opacity;
        if (attributeState.stroke instanceof ColorFill &&
            typeof attributeState.stroke.color.a !== 'undefined') {
            strokeOpacity *= attributeState.stroke.color.a;
        }
        var gState = {};
        gState['opacity'] = fillOpacity;
        gState['stroke-opacity'] = strokeOpacity;
        pdf.setGState(new jsPDF.GState(gState));
        if (attributeState.fill &&
            attributeState.fill instanceof ColorFill &&
            attributeState.fill.color.ok) {
            // text fill color will be applied through setTextColor()
            pdf.setFillColor(attributeState.fill.color.r, attributeState.fill.color.g, attributeState.fill.color.b);
        }
        else {
            pdf.setFillColor(0, 0, 0);
        }
        pdf.setLineWidth(attributeState.strokeWidth);
        if (attributeState.stroke instanceof ColorFill) {
            pdf.setDrawColor(attributeState.stroke.color.r, attributeState.stroke.color.g, attributeState.stroke.color.b);
        }
        else {
            pdf.setDrawColor(0, 0, 0);
        }
        pdf.setLineCap(attributeState.strokeLinecap);
        pdf.setLineJoin(attributeState.strokeLinejoin);
        if (attributeState.strokeDasharray) {
            pdf.setLineDashPattern(attributeState.strokeDasharray, attributeState.strokeDashoffset);
        }
        else {
            pdf.setLineDashPattern([], 0);
        }
        pdf.setLineMiterLimit(attributeState.strokeMiterlimit);
        var font;
        if (fontAliases.hasOwnProperty(attributeState.fontFamily)) {
            font = fontAliases[attributeState.fontFamily];
        }
        else {
            font = attributeState.fontFamily;
        }
        if (attributeState.fill &&
            attributeState.fill instanceof ColorFill &&
            attributeState.fill.color.ok) {
            var fillColor = attributeState.fill.color;
            pdf.setTextColor(fillColor.r, fillColor.g, fillColor.b);
        }
        else {
            pdf.setTextColor(0, 0, 0);
        }
        var fontStyle = '';
        if (attributeState.fontWeight === 'bold') {
            fontStyle = 'bold';
        }
        if (attributeState.fontStyle === 'italic') {
            fontStyle += 'italic';
        }
        if (fontStyle === '') {
            fontStyle = 'normal';
        }
        if (font !== undefined || fontStyle !== undefined) {
            if (font === undefined) {
                if (fontAliases.hasOwnProperty(attributeState.fontFamily)) {
                    font = fontAliases[attributeState.fontFamily];
                }
                else {
                    font = attributeState.fontFamily;
                }
            }
            pdf.setFont(font, fontStyle);
        }
        else {
            pdf.setFont('helvetica', fontStyle);
        }
        // correct for a jsPDF-instance measurement unit that differs from `pt`
        pdf.setFontSize(attributeState.fontSize * pdf.internal.scaleFactor);
    }

    function getClipPathNode(clipPathAttr, targetNode, context) {
        var match = iriReference.exec(clipPathAttr);
        if (!match) {
            return undefined;
        }
        var clipPathId = match[1];
        var clipNode = context.refsHandler.get(clipPathId);
        return clipNode || undefined;
    }
    function applyClipPath(targetNode, clipPathNode, context) {
        return __awaiter(this, void 0, void 0, function () {
            var clipContext, bBox;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        clipContext = context.clone();
                        if (clipPathNode.element.hasAttribute('clipPathUnits') &&
                            clipPathNode.element.getAttribute('clipPathUnits').toLowerCase() === 'objectboundingbox') {
                            bBox = targetNode.getBoundingBox(context);
                            clipContext.transform = context.pdf.matrixMult(context.pdf.Matrix(bBox[2], 0, 0, bBox[3], bBox[0], bBox[1]), context.transform);
                        }
                        return [4 /*yield*/, clipPathNode.apply(clipContext)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }

    var RenderedNode = /** @class */ (function (_super) {
        __extends(RenderedNode, _super);
        function RenderedNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        RenderedNode.prototype.render = function (parentContext) {
            return __awaiter(this, void 0, void 0, function () {
                var context, clipPathAttribute, hasClipPath, clipNode;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isVisible(parentContext.attributeState.visibility !== 'hidden', parentContext)) {
                                return [2 /*return*/];
                            }
                            context = parentContext.clone();
                            context.transform = context.pdf.matrixMult(this.computeNodeTransform(context), parentContext.transform);
                            parseAttributes(context, this);
                            clipPathAttribute = getAttribute(this.element, context.styleSheets, 'clip-path');
                            hasClipPath = clipPathAttribute && clipPathAttribute !== 'none';
                            if (!hasClipPath) return [3 /*break*/, 5];
                            clipNode = getClipPathNode(clipPathAttribute, this, context);
                            if (!clipNode) return [3 /*break*/, 4];
                            if (!clipNode.isVisible(true, context)) return [3 /*break*/, 2];
                            context.pdf.saveGraphicsState();
                            return [4 /*yield*/, applyClipPath(this, clipNode, context)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2: return [2 /*return*/];
                        case 3: return [3 /*break*/, 5];
                        case 4:
                            hasClipPath = false;
                            _a.label = 5;
                        case 5:
                            if (!context.withinClipPath) {
                                context.pdf.saveGraphicsState();
                            }
                            applyAttributes(context, parentContext, this.element);
                            return [4 /*yield*/, this.renderCore(context)];
                        case 6:
                            _a.sent();
                            if (!context.withinClipPath) {
                                context.pdf.restoreGraphicsState();
                            }
                            if (hasClipPath) {
                                context.pdf.restoreGraphicsState();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        return RenderedNode;
    }(SvgNode));

    var GraphicsNode = /** @class */ (function (_super) {
        __extends(GraphicsNode, _super);
        function GraphicsNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        return GraphicsNode;
    }(RenderedNode));

    var GeometryNode = /** @class */ (function (_super) {
        __extends(GeometryNode, _super);
        function GeometryNode(hasMarkers, element, children) {
            var _this = _super.call(this, element, children) || this;
            _this.cachedPath = null;
            _this.hasMarkers = hasMarkers;
            return _this;
        }
        GeometryNode.prototype.renderCore = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var path;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            path = this.getCachedPath(context);
                            if (path === null || path.segments.length === 0) {
                                return [2 /*return*/];
                            }
                            if (context.withinClipPath) {
                                path.transform(context.transform);
                            }
                            else {
                                context.pdf.setCurrentTransformationMatrix(context.transform);
                            }
                            path.draw(context);
                            return [4 /*yield*/, this.fillOrStroke(context)];
                        case 1:
                            _a.sent();
                            if (!this.hasMarkers) return [3 /*break*/, 3];
                            return [4 /*yield*/, this.drawMarkers(context, path)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        GeometryNode.prototype.getCachedPath = function (context) {
            return this.cachedPath || (this.cachedPath = this.getPath(context));
        };
        GeometryNode.prototype.drawMarkers = function (context, path) {
            return __awaiter(this, void 0, void 0, function () {
                var markers;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            markers = this.getMarkers(path, context);
                            return [4 /*yield*/, markers.draw(context.clone({ transform: context.pdf.unitMatrix }))];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        GeometryNode.prototype.fillOrStroke = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var fill, stroke, fillData, _a, isNodeFillRuleEvenOdd;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (context.withinClipPath) {
                                return [2 /*return*/];
                            }
                            fill = context.attributeState.fill;
                            stroke = context.attributeState.stroke && context.attributeState.strokeWidth !== 0;
                            if (!fill) return [3 /*break*/, 2];
                            return [4 /*yield*/, fill.getFillData(this, context)];
                        case 1:
                            _a = _b.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            _a = undefined;
                            _b.label = 3;
                        case 3:
                            fillData = _a;
                            isNodeFillRuleEvenOdd = getAttribute(this.element, context.styleSheets, 'fill-rule') === 'evenodd';
                            // This is a workaround for symbols that are used multiple times with different
                            // fill/stroke attributes. All paths within symbols are both filled and stroked
                            // and we set the fill/stroke to transparent if the use element has
                            // fill/stroke="none".
                            if ((fill && stroke) || context.withinUse) {
                                if (isNodeFillRuleEvenOdd) {
                                    context.pdf.fillStrokeEvenOdd(fillData);
                                }
                                else {
                                    context.pdf.fillStroke(fillData);
                                }
                            }
                            else if (fill) {
                                if (isNodeFillRuleEvenOdd) {
                                    context.pdf.fillEvenOdd(fillData);
                                }
                                else {
                                    context.pdf.fill(fillData);
                                }
                            }
                            else if (stroke) {
                                context.pdf.stroke();
                            }
                            else {
                                context.pdf.discardPath();
                            }
                            return [2 /*return*/];
                    }
                });
            });
        };
        GeometryNode.prototype.getBoundingBoxCore = function (context) {
            var path = this.getCachedPath(context);
            if (!path) {
                return [0, 0, 0, 0];
            }
            var minX = Number.POSITIVE_INFINITY;
            var minY = Number.POSITIVE_INFINITY;
            var maxX = Number.NEGATIVE_INFINITY;
            var maxY = Number.NEGATIVE_INFINITY;
            var x = 0, y = 0;
            for (var i = 0; i < path.segments.length; i++) {
                var seg = path.segments[i];
                if (seg instanceof MoveTo || seg instanceof LineTo || seg instanceof CurveTo) {
                    x = seg.x;
                    y = seg.y;
                }
                if (seg instanceof CurveTo) {
                    minX = Math.min(minX, x, seg.x1, seg.x2, seg.x);
                    maxX = Math.max(maxX, x, seg.x1, seg.x2, seg.x);
                    minY = Math.min(minY, y, seg.y1, seg.y2, seg.y);
                    maxY = Math.max(maxY, y, seg.y1, seg.y2, seg.y);
                }
                else {
                    minX = Math.min(minX, x);
                    maxX = Math.max(maxX, x);
                    minY = Math.min(minY, y);
                    maxY = Math.max(maxY, y);
                }
            }
            return [minX, minY, maxX - minX, maxY - minY];
        };
        GeometryNode.prototype.getMarkers = function (path, context) {
            var markerStart = getAttribute(this.element, context.styleSheets, 'marker-start');
            var markerMid = getAttribute(this.element, context.styleSheets, 'marker-mid');
            var markerEnd = getAttribute(this.element, context.styleSheets, 'marker-end');
            var markers = new MarkerList();
            if (markerStart || markerMid || markerEnd) {
                markerEnd && (markerEnd = iri(markerEnd));
                markerStart && (markerStart = iri(markerStart));
                markerMid && (markerMid = iri(markerMid));
                var list_1 = path.segments;
                var prevAngle = [1, 0], curAngle = void 0, first = false, firstAngle = [1, 0], last_1 = false;
                var _loop_1 = function (i) {
                    var curr = list_1[i];
                    var hasStartMarker = markerStart &&
                        (i === 1 || (!(list_1[i] instanceof MoveTo) && list_1[i - 1] instanceof MoveTo));
                    if (hasStartMarker) {
                        list_1.forEach(function (value, index) {
                            if (!last_1 && value instanceof Close && index > i) {
                                var tmp = list_1[index - 1];
                                last_1 =
                                    (tmp instanceof MoveTo || tmp instanceof LineTo || tmp instanceof CurveTo) && tmp;
                            }
                        });
                    }
                    var hasEndMarker = markerEnd &&
                        (i === list_1.length - 1 || (!(list_1[i] instanceof MoveTo) && list_1[i + 1] instanceof MoveTo));
                    var hasMidMarker = markerMid && i > 0 && !(i === 1 && list_1[i - 1] instanceof MoveTo);
                    var prev = list_1[i - 1] || null;
                    if (prev instanceof MoveTo || prev instanceof LineTo || prev instanceof CurveTo) {
                        if (curr instanceof CurveTo) {
                            hasStartMarker &&
                                markers.addMarker(new Marker(markerStart, [prev.x, prev.y], 
                                // @ts-ignore
                                getAngle(last_1 ? [last_1.x, last_1.y] : [prev.x, prev.y], [curr.x1, curr.y1])));
                            hasEndMarker &&
                                markers.addMarker(new Marker(markerEnd, [curr.x, curr.y], getAngle([curr.x2, curr.y2], [curr.x, curr.y])));
                            if (hasMidMarker) {
                                curAngle = getDirectionVector([prev.x, prev.y], [curr.x1, curr.y1]);
                                curAngle =
                                    prev instanceof MoveTo ? curAngle : normalize(addVectors(prevAngle, curAngle));
                                markers.addMarker(new Marker(markerMid, [prev.x, prev.y], Math.atan2(curAngle[1], curAngle[0])));
                            }
                            prevAngle = getDirectionVector([curr.x2, curr.y2], [curr.x, curr.y]);
                        }
                        else if (curr instanceof MoveTo || curr instanceof LineTo) {
                            curAngle = getDirectionVector([prev.x, prev.y], [curr.x, curr.y]);
                            if (hasStartMarker) {
                                // @ts-ignore
                                var angle = last_1 ? getDirectionVector([last_1.x, last_1.y], [curr.x, curr.y]) : curAngle;
                                markers.addMarker(new Marker(markerStart, [prev.x, prev.y], Math.atan2(angle[1], angle[0])));
                            }
                            hasEndMarker &&
                                markers.addMarker(new Marker(markerEnd, [curr.x, curr.y], Math.atan2(curAngle[1], curAngle[0])));
                            if (hasMidMarker) {
                                var angle = curr instanceof MoveTo
                                    ? prevAngle
                                    : prev instanceof MoveTo
                                        ? curAngle
                                        : normalize(addVectors(prevAngle, curAngle));
                                markers.addMarker(new Marker(markerMid, [prev.x, prev.y], Math.atan2(angle[1], angle[0])));
                            }
                            prevAngle = curAngle;
                        }
                        else if (curr instanceof Close) {
                            // @ts-ignore
                            curAngle = getDirectionVector([prev.x, prev.y], [first.x, first.y]);
                            if (hasMidMarker) {
                                var angle = prev instanceof MoveTo ? curAngle : normalize(addVectors(prevAngle, curAngle));
                                markers.addMarker(new Marker(markerMid, [prev.x, prev.y], Math.atan2(angle[1], angle[0])));
                            }
                            if (hasEndMarker) {
                                var angle = normalize(addVectors(curAngle, firstAngle));
                                markers.addMarker(
                                // @ts-ignore
                                new Marker(markerEnd, [first.x, first.y], Math.atan2(angle[1], angle[0])));
                            }
                            prevAngle = curAngle;
                        }
                    }
                    else {
                        first = curr instanceof MoveTo && curr;
                        var next = list_1[i + 1];
                        if (next instanceof MoveTo || next instanceof LineTo || next instanceof CurveTo) {
                            // @ts-ignore
                            firstAngle = getDirectionVector([first.x, first.y], [next.x, next.y]);
                        }
                    }
                };
                for (var i = 0; i < list_1.length; i++) {
                    _loop_1(i);
                }
            }
            return markers;
        };
        return GeometryNode;
    }(GraphicsNode));
    function iri(attribute) {
        var match = iriReference.exec(attribute);
        return (match && match[1]) || undefined;
    }

    var Line = /** @class */ (function (_super) {
        __extends(Line, _super);
        function Line(node, children) {
            return _super.call(this, true, node, children) || this;
        }
        Line.prototype.getPath = function (context) {
            if (context.withinClipPath || context.attributeState.stroke === null) {
                return null;
            }
            var x1 = parseFloat(this.element.getAttribute('x1') || '0'), y1 = parseFloat(this.element.getAttribute('y1') || '0');
            var x2 = parseFloat(this.element.getAttribute('x2') || '0'), y2 = parseFloat(this.element.getAttribute('y2') || '0');
            if (!(x1 || x2 || y1 || y2)) {
                return null;
            }
            return new Path().moveTo(x1, y1).lineTo(x2, y2);
        };
        Line.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        Line.prototype.isVisible = function (parentVisible, context) {
            return svgNodeIsVisible(this, parentVisible, context);
        };
        Line.prototype.fillOrStroke = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            context.attributeState.fill = null;
                            return [4 /*yield*/, _super.prototype.fillOrStroke.call(this, context)];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        return Line;
    }(GeometryNode));

    var Symbol$1 = /** @class */ (function (_super) {
        __extends(Symbol, _super);
        function Symbol() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Symbol.prototype.apply = function (parentContext) {
            return __awaiter(this, void 0, void 0, function () {
                var context, clipPathAttribute, hasClipPath, clipNode, _i, _a, child;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.isVisible(parentContext.attributeState.visibility !== 'hidden', parentContext)) {
                                return [2 /*return*/];
                            }
                            context = parentContext.clone();
                            context.transform = context.pdf.unitMatrix;
                            parseAttributes(context, this);
                            clipPathAttribute = getAttribute(this.element, context.styleSheets, 'clip-path');
                            hasClipPath = clipPathAttribute && clipPathAttribute !== 'none';
                            if (!hasClipPath) return [3 /*break*/, 3];
                            clipNode = getClipPathNode(clipPathAttribute, this, context);
                            if (!clipNode) return [3 /*break*/, 3];
                            if (!clipNode.isVisible(true, context)) return [3 /*break*/, 2];
                            return [4 /*yield*/, applyClipPath(this, clipNode, context)];
                        case 1:
                            _b.sent();
                            return [3 /*break*/, 3];
                        case 2: return [2 /*return*/];
                        case 3:
                            applyAttributes(context, parentContext, this.element);
                            _i = 0, _a = this.children;
                            _b.label = 4;
                        case 4:
                            if (!(_i < _a.length)) return [3 /*break*/, 7];
                            child = _a[_i];
                            return [4 /*yield*/, child.render(context)];
                        case 5:
                            _b.sent();
                            _b.label = 6;
                        case 6:
                            _i++;
                            return [3 /*break*/, 4];
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        Symbol.prototype.getBoundingBoxCore = function (context) {
            return getBoundingBoxByChildren(context, this);
        };
        Symbol.prototype.isVisible = function (parentVisible, context) {
            return svgNodeAndChildrenVisible(this, parentVisible, context);
        };
        Symbol.prototype.computeNodeTransformCore = function (context) {
            var x = parseFloat(getAttribute(this.element, context.styleSheets, 'x') || '0');
            var y = parseFloat(getAttribute(this.element, context.styleSheets, 'y') || '0');
            // TODO: implement refX/refY - this is still to do because common browsers don't seem to support the feature yet
            // x += parseFloat(this.element.getAttribute("refX")) || 0; ???
            // y += parseFloat(this.element.getAttribute("refY")) || 0; ???
            var viewBox = this.element.getAttribute('viewBox');
            if (viewBox) {
                var box = parseFloats(viewBox);
                var width = parseFloat(getAttribute(this.element, context.styleSheets, 'width') ||
                    getAttribute(this.element.ownerSVGElement, context.styleSheets, 'width') ||
                    viewBox[2]);
                var height = parseFloat(getAttribute(this.element, context.styleSheets, 'height') ||
                    getAttribute(this.element.ownerSVGElement, context.styleSheets, 'height') ||
                    viewBox[3]);
                return computeViewBoxTransform(this.element, box, x, y, width, height, context);
            }
            else {
                return context.pdf.Matrix(1, 0, 0, 1, x, y);
            }
        };
        return Symbol;
    }(NonRenderedNode));

    var Viewport = /** @class */ (function () {
        function Viewport(width, height) {
            this.width = width;
            this.height = height;
        }
        return Viewport;
    }());

    /**
     * Draws the element referenced by a use node, makes use of pdf's XObjects/FormObjects so nodes are only written once
     * to the pdf document. This highly reduces the file size and computation time.
     */
    var Use = /** @class */ (function (_super) {
        __extends(Use, _super);
        function Use() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Use.prototype.renderCore = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var pf, url, id, refNode, refNodeOpensViewport, x, y, width, height, t, viewBox, refContext, color;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            pf = parseFloat;
                            url = this.element.getAttribute('href') || this.element.getAttribute('xlink:href');
                            // just in case someone has the idea to use empty use-tags, wtf???
                            if (!url)
                                return [2 /*return*/];
                            id = url.substring(1);
                            refNode = context.refsHandler.get(id);
                            refNodeOpensViewport = nodeIs(refNode.element, 'symbol,svg') && refNode.element.hasAttribute('viewBox');
                            x = pf(getAttribute(this.element, context.styleSheets, 'x') || '0');
                            y = pf(getAttribute(this.element, context.styleSheets, 'y') || '0');
                            width = undefined;
                            height = undefined;
                            if (refNodeOpensViewport) {
                                //  <use> inherits width/height only to svg/symbol
                                // if there is no viewBox attribute, width/height don't have an effect
                                // in theory, the default value for width/height is 100%, but we currently don't support this
                                width = pf(getAttribute(this.element, context.styleSheets, 'width') ||
                                    getAttribute(refNode.element, context.styleSheets, 'width') ||
                                    '0');
                                height = pf(getAttribute(this.element, context.styleSheets, 'height') ||
                                    getAttribute(refNode.element, context.styleSheets, 'height') ||
                                    '0');
                                //  accumulate x/y to calculate the viewBox transform
                                x += pf(getAttribute(refNode.element, context.styleSheets, 'x') || '0');
                                y += pf(getAttribute(refNode.element, context.styleSheets, 'y') || '0');
                                viewBox = parseFloats(refNode.element.getAttribute('viewBox'));
                                t = computeViewBoxTransform(refNode.element, viewBox, x, y, width, height, context);
                            }
                            else {
                                t = context.pdf.Matrix(1, 0, 0, 1, x, y);
                            }
                            refContext = new Context(context.pdf, {
                                refsHandler: context.refsHandler,
                                styleSheets: context.styleSheets,
                                withinUse: true,
                                viewport: refNodeOpensViewport ? new Viewport(width, height) : context.viewport,
                                svg2pdfParameters: context.svg2pdfParameters
                            });
                            color = context.attributeState.color;
                            return [4 /*yield*/, context.refsHandler.getRendered(id, color, function (node) {
                                    return Use.renderReferencedNode(node, id, color, refContext);
                                })];
                        case 1:
                            _a.sent();
                            context.pdf.saveGraphicsState();
                            context.pdf.setCurrentTransformationMatrix(context.transform);
                            //  apply the bbox (i.e. clip) if needed
                            if (refNodeOpensViewport &&
                                getAttribute(refNode.element, context.styleSheets, 'overflow') !== 'visible') {
                                context.pdf.rect(x, y, width, height);
                                context.pdf.clip().discardPath();
                            }
                            context.pdf.doFormObject(context.refsHandler.generateKey(id, color), t);
                            context.pdf.restoreGraphicsState();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Use.renderReferencedNode = function (node, id, color, refContext) {
            return __awaiter(this, void 0, void 0, function () {
                var bBox;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            bBox = node.getBoundingBox(refContext);
                            // The content of a PDF form object is implicitly clipped at its /BBox property.
                            // SVG, however, applies its clip rect at the <use> attribute, which may modify it.
                            // So, make the bBox a lot larger than it needs to be and hope any thick strokes are
                            // still within.
                            bBox = [bBox[0] - 0.5 * bBox[2], bBox[1] - 0.5 * bBox[3], bBox[2] * 2, bBox[3] * 2];
                            // set the color to use for the referenced node
                            refContext.attributeState.color = color;
                            refContext.pdf.beginFormObject(bBox[0], bBox[1], bBox[2], bBox[3], refContext.pdf.unitMatrix);
                            if (!(node instanceof Symbol$1)) return [3 /*break*/, 2];
                            return [4 /*yield*/, node.apply(refContext)];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 4];
                        case 2: return [4 /*yield*/, node.render(refContext)];
                        case 3:
                            _a.sent();
                            _a.label = 4;
                        case 4:
                            refContext.pdf.endFormObject(refContext.refsHandler.generateKey(id, color));
                            return [2 /*return*/];
                    }
                });
            });
        };
        Use.prototype.getBoundingBoxCore = function (context) {
            return defaultBoundingBox(this.element, context);
        };
        Use.prototype.isVisible = function (parentVisible, context) {
            return svgNodeIsVisible(this, parentVisible, context);
        };
        Use.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        return Use;
    }(GraphicsNode));

    var Rect = /** @class */ (function (_super) {
        __extends(Rect, _super);
        function Rect(element, children) {
            return _super.call(this, false, element, children) || this;
        }
        Rect.prototype.getPath = function (context) {
            var w = parseFloat(getAttribute(this.element, context.styleSheets, 'width') || '0');
            var h = parseFloat(getAttribute(this.element, context.styleSheets, 'height') || '0');
            if (!isFinite(w) || w <= 0 || !isFinite(h) || h <= 0) {
                return null;
            }
            var rxAttr = getAttribute(this.element, context.styleSheets, 'rx');
            var ryAttr = getAttribute(this.element, context.styleSheets, 'ry');
            var rx = Math.min(parseFloat(rxAttr || ryAttr || '0'), w * 0.5);
            var ry = Math.min(parseFloat(ryAttr || rxAttr || '0'), h * 0.5);
            var x = parseFloat(getAttribute(this.element, context.styleSheets, 'x') || '0');
            var y = parseFloat(getAttribute(this.element, context.styleSheets, 'y') || '0');
            var arc = (4 / 3) * (Math.SQRT2 - 1);
            if (rx === 0 && ry === 0) {
                return new Path()
                    .moveTo(x, y)
                    .lineTo(x + w, y)
                    .lineTo(x + w, y + h)
                    .lineTo(x, y + h)
                    .close();
            }
            else {
                return new Path()
                    .moveTo((x += rx), y)
                    .lineTo((x += w - 2 * rx), y)
                    .curveTo(x + rx * arc, y, x + rx, y + (ry - ry * arc), (x += rx), (y += ry))
                    .lineTo(x, (y += h - 2 * ry))
                    .curveTo(x, y + ry * arc, x - rx * arc, y + ry, (x -= rx), (y += ry))
                    .lineTo((x += -w + 2 * rx), y)
                    .curveTo(x - rx * arc, y, x - rx, y - ry * arc, (x -= rx), (y -= ry))
                    .lineTo(x, (y += -h + 2 * ry))
                    .curveTo(x, y - ry * arc, x + rx * arc, y - ry, (x += rx), (y -= ry))
                    .close();
            }
        };
        Rect.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        Rect.prototype.isVisible = function (parentVisible, context) {
            return svgNodeIsVisible(this, parentVisible, context);
        };
        return Rect;
    }(GeometryNode));

    var EllipseBase = /** @class */ (function (_super) {
        __extends(EllipseBase, _super);
        function EllipseBase(element, children) {
            return _super.call(this, false, element, children) || this;
        }
        EllipseBase.prototype.getPath = function (context) {
            var rx = this.getRx(context);
            var ry = this.getRy(context);
            if (!isFinite(rx) || ry <= 0 || !isFinite(ry) || ry <= 0) {
                return null;
            }
            var x = parseFloat(getAttribute(this.element, context.styleSheets, 'cx') || '0'), y = parseFloat(getAttribute(this.element, context.styleSheets, 'cy') || '0');
            var lx = (4 / 3) * (Math.SQRT2 - 1) * rx, ly = (4 / 3) * (Math.SQRT2 - 1) * ry;
            return new Path()
                .moveTo(x + rx, y)
                .curveTo(x + rx, y - ly, x + lx, y - ry, x, y - ry)
                .curveTo(x - lx, y - ry, x - rx, y - ly, x - rx, y)
                .curveTo(x - rx, y + ly, x - lx, y + ry, x, y + ry)
                .curveTo(x + lx, y + ry, x + rx, y + ly, x + rx, y);
        };
        EllipseBase.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        EllipseBase.prototype.isVisible = function (parentVisible, context) {
            return svgNodeIsVisible(this, parentVisible, context);
        };
        return EllipseBase;
    }(GeometryNode));

    var Ellipse = /** @class */ (function (_super) {
        __extends(Ellipse, _super);
        function Ellipse(element, children) {
            return _super.call(this, element, children) || this;
        }
        Ellipse.prototype.getRx = function (context) {
            return parseFloat(getAttribute(this.element, context.styleSheets, 'rx') || '0');
        };
        Ellipse.prototype.getRy = function (context) {
            return parseFloat(getAttribute(this.element, context.styleSheets, 'ry') || '0');
        };
        return Ellipse;
    }(EllipseBase));

    function getTextRenderingMode(attributeState) {
        var renderingMode = 'invisible';
        if (attributeState.fill && attributeState.stroke) {
            renderingMode = 'fillThenStroke';
        }
        else if (attributeState.fill) {
            renderingMode = 'fill';
        }
        else if (attributeState.stroke) {
            renderingMode = 'stroke';
        }
        return renderingMode;
    }
    function transformXmlSpace(trimmedText, attributeState) {
        trimmedText = removeNewlines(trimmedText);
        trimmedText = replaceTabsBySpace(trimmedText);
        if (attributeState.xmlSpace === 'default') {
            trimmedText = trimmedText.trim();
            trimmedText = consolidateSpaces(trimmedText);
        }
        return trimmedText;
    }
    function removeNewlines(str) {
        return str.replace(/[\n\r]/g, '');
    }
    function replaceTabsBySpace(str) {
        return str.replace(/[\t]/g, ' ');
    }
    function consolidateSpaces(str) {
        return str.replace(/ +/g, ' ');
    }
    // applies text transformations to a text node
    function transformText(node, text, context) {
        var textTransform = getAttribute(node, context.styleSheets, 'text-transform');
        switch (textTransform) {
            case 'uppercase':
                return text.toUpperCase();
            case 'lowercase':
                return text.toLowerCase();
            default:
                return text;
            // TODO: capitalize, full-width
        }
    }
    function trimLeft(str) {
        return str.replace(/^\s+/, '');
    }
    function trimRight(str) {
        return str.replace(/\s+$/, '');
    }

    /**
     * @param {string} textAnchor
     * @param {number} originX
     * @param {number} originY
     * @constructor
     */
    var TextChunk = /** @class */ (function () {
        function TextChunk(parent, textAnchor, originX, originY) {
            this.textNode = parent;
            this.texts = [];
            this.textNodes = [];
            this.contexts = [];
            this.textAnchor = textAnchor;
            this.originX = originX;
            this.originY = originY;
            this.textMeasures = [];
        }
        TextChunk.prototype.setX = function (originX) {
            this.originX = originX;
        };
        TextChunk.prototype.setY = function (originY) {
            this.originY = originY;
        };
        TextChunk.prototype.add = function (tSpan, text, context) {
            this.texts.push(text);
            this.textNodes.push(tSpan);
            this.contexts.push(context);
        };
        TextChunk.prototype.rightTrimText = function () {
            for (var r = this.texts.length - 1; r >= 0; r--) {
                if (this.contexts[r].attributeState.xmlSpace === 'default') {
                    this.texts[r] = trimRight(this.texts[r]);
                }
                // If find a letter, stop right-trimming
                if (this.texts[r].match(/[^\s]/)) {
                    return false;
                }
            }
            return true;
        };
        TextChunk.prototype.measureText = function (context) {
            for (var i = 0; i < this.texts.length; i++) {
                this.textMeasures.push({
                    width: context.textMeasure.measureTextWidth(this.texts[i], this.contexts[i].attributeState),
                    length: this.texts[i].length
                });
            }
        };
        TextChunk.prototype.put = function (context, charSpace) {
            var i, textNode, textNodeContext, textMeasure;
            var alreadySeen = [];
            var xs = [], ys = [];
            var currentTextX = this.originX, currentTextY = this.originY;
            var minX = currentTextX, maxX = currentTextX;
            for (i = 0; i < this.textNodes.length; i++) {
                textNode = this.textNodes[i];
                textNodeContext = this.contexts[i];
                textMeasure = this.textMeasures[i] || {
                    width: context.textMeasure.measureTextWidth(this.texts[i], this.contexts[i].attributeState),
                    length: this.texts[i].length
                };
                var x = currentTextX;
                var y = currentTextY;
                if (textNode.nodeName !== '#text') {
                    if (!alreadySeen.includes(textNode)) {
                        alreadySeen.push(textNode);
                        var tSpanDx = textNode.getAttribute('dx');
                        if (tSpanDx !== null) {
                            x += toPixels(tSpanDx, textNodeContext.attributeState.fontSize);
                        }
                        var tSpanDy = textNode.getAttribute('dy');
                        if (tSpanDy !== null) {
                            y += toPixels(tSpanDy, textNodeContext.attributeState.fontSize);
                        }
                    }
                }
                xs[i] = x;
                ys[i] = y;
                currentTextX = x + textMeasure.width + textMeasure.length * charSpace;
                currentTextY = y;
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, currentTextX);
            }
            var textOffset = 0;
            switch (this.textAnchor) {
                case 'start':
                    textOffset = 0;
                    break;
                case 'middle':
                    textOffset = (maxX - minX) / 2;
                    break;
                case 'end':
                    textOffset = maxX - minX;
                    break;
            }
            for (i = 0; i < this.textNodes.length; i++) {
                textNode = this.textNodes[i];
                textNodeContext = this.contexts[i];
                if (textNode.nodeName !== '#text') {
                    if (textNodeContext.attributeState.visibility === 'hidden') {
                        continue;
                    }
                }
                context.pdf.saveGraphicsState();
                applyAttributes(textNodeContext, context, textNode);
                var alignmentBaseline = textNodeContext.attributeState.alignmentBaseline;
                var textRenderingMode = getTextRenderingMode(textNodeContext.attributeState);
                context.pdf.text(this.texts[i], xs[i] - textOffset, ys[i], {
                    baseline: mapAlignmentBaseline(alignmentBaseline),
                    angle: context.transform,
                    renderingMode: textRenderingMode === 'fill' ? void 0 : textRenderingMode,
                    charSpace: charSpace === 0 ? void 0 : charSpace
                });
                context.pdf.restoreGraphicsState();
            }
            return [currentTextX, currentTextY];
        };
        return TextChunk;
    }());

    var TextNode = /** @class */ (function (_super) {
        __extends(TextNode, _super);
        function TextNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        TextNode.prototype.processTSpans = function (textNode, node, context, textChunks, currentTextSegment, trimInfo) {
            var pdfFontSize = context.pdf.getFontSize();
            var xmlSpace = context.attributeState.xmlSpace;
            var firstText = true, initialSpace = false;
            for (var i = 0; i < node.childNodes.length; i++) {
                var childNode = node.childNodes[i];
                if (!childNode.textContent) {
                    continue;
                }
                var textContent = childNode.textContent;
                if (childNode.nodeName === '#text') {
                    var trimmedText = removeNewlines(textContent);
                    trimmedText = replaceTabsBySpace(trimmedText);
                    if (xmlSpace === 'default') {
                        trimmedText = consolidateSpaces(trimmedText);
                        // If first text in tspan and starts with a space
                        if (firstText && trimmedText.match(/^\s/)) {
                            initialSpace = true;
                        }
                        // No longer the first text if we've found a letter
                        if (trimmedText.match(/[^\s]/)) {
                            firstText = false;
                        }
                        // Consolidate spaces across different children
                        if (trimInfo.prevText.match(/\s$/)) {
                            trimmedText = trimLeft(trimmedText);
                        }
                    }
                    var transformedText = transformText(node, trimmedText, context);
                    currentTextSegment.add(node, transformedText, context);
                    trimInfo.prevText = textContent;
                    trimInfo.prevContext = context;
                }
                else if (nodeIs(childNode, 'title')) ;
                else if (nodeIs(childNode, 'tspan')) {
                    var tSpan = childNode;
                    var tSpanAbsX = tSpan.getAttribute('x');
                    if (tSpanAbsX !== null) {
                        var x = toPixels(tSpanAbsX, pdfFontSize);
                        currentTextSegment = new TextChunk(this, getAttribute(tSpan, context.styleSheets, 'text-anchor') ||
                            context.attributeState.textAnchor, x, 0);
                        textChunks.push({ type: 'y', chunk: currentTextSegment });
                    }
                    var tSpanAbsY = tSpan.getAttribute('y');
                    if (tSpanAbsY !== null) {
                        var y = toPixels(tSpanAbsY, pdfFontSize);
                        currentTextSegment = new TextChunk(this, getAttribute(tSpan, context.styleSheets, 'text-anchor') ||
                            context.attributeState.textAnchor, 0, y);
                        textChunks.push({ type: 'x', chunk: currentTextSegment });
                    }
                    var childContext = context.clone();
                    parseAttributes(childContext, textNode, tSpan);
                    this.processTSpans(textNode, tSpan, childContext, textChunks, currentTextSegment, trimInfo);
                }
            }
            return initialSpace;
        };
        TextNode.prototype.renderCore = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var xOffset, charSpace, lengthAdjustment, pdfFontSize, textX, textY, dx, dy, textLength, visibility, tSpanCount, textContent, trimmedText, transformedText, defaultSize, alignmentBaseline, textRenderingMode, textChunks, currentTextSegment, initialSpace, trimRight, r, totalDefaultWidth_1, totalLength_1;
                return __generator(this, function (_a) {
                    context.pdf.saveGraphicsState();
                    xOffset = 0;
                    charSpace = 0;
                    lengthAdjustment = 1;
                    pdfFontSize = context.pdf.getFontSize();
                    textX = toPixels(this.element.getAttribute('x'), pdfFontSize);
                    textY = toPixels(this.element.getAttribute('y'), pdfFontSize);
                    dx = toPixels(this.element.getAttribute('dx'), pdfFontSize);
                    dy = toPixels(this.element.getAttribute('dy'), pdfFontSize);
                    textLength = parseFloat(this.element.getAttribute('textLength') || '0');
                    visibility = context.attributeState.visibility;
                    tSpanCount = this.element.childElementCount;
                    if (tSpanCount === 0) {
                        textContent = this.element.textContent || '';
                        trimmedText = transformXmlSpace(textContent, context.attributeState);
                        transformedText = transformText(this.element, trimmedText, context);
                        xOffset = context.textMeasure.getTextOffset(transformedText, context.attributeState);
                        if (textLength > 0) {
                            defaultSize = context.textMeasure.measureTextWidth(transformedText, context.attributeState);
                            if (context.attributeState.xmlSpace === 'default' && textContent.match(/^\s/)) {
                                lengthAdjustment = 0;
                            }
                            charSpace = (textLength - defaultSize) / (transformedText.length - lengthAdjustment) || 0;
                        }
                        if (visibility === 'visible') {
                            alignmentBaseline = context.attributeState.alignmentBaseline;
                            textRenderingMode = getTextRenderingMode(context.attributeState);
                            context.pdf.text(transformedText, textX + dx - xOffset, textY + dy, {
                                baseline: mapAlignmentBaseline(alignmentBaseline),
                                angle: context.transform,
                                renderingMode: textRenderingMode === 'fill' ? void 0 : textRenderingMode,
                                charSpace: charSpace === 0 ? void 0 : charSpace
                            });
                        }
                    }
                    else {
                        textChunks = [];
                        currentTextSegment = new TextChunk(this, context.attributeState.textAnchor, textX + dx, textY + dy);
                        textChunks.push({ type: '', chunk: currentTextSegment });
                        initialSpace = this.processTSpans(this, this.element, context, textChunks, currentTextSegment, 
                        // Set prevText to ' ' so any spaces on left of <text> are trimmed
                        { prevText: ' ', prevContext: context });
                        lengthAdjustment = initialSpace ? 0 : 1;
                        trimRight = true;
                        for (r = textChunks.length - 1; r >= 0; r--) {
                            if (trimRight) {
                                trimRight = textChunks[r].chunk.rightTrimText();
                            }
                        }
                        if (textLength > 0) {
                            totalDefaultWidth_1 = 0;
                            totalLength_1 = 0;
                            textChunks.forEach(function (_a) {
                                var chunk = _a.chunk;
                                chunk.measureText(context);
                                chunk.textMeasures.forEach(function (_a) {
                                    var width = _a.width, length = _a.length;
                                    totalDefaultWidth_1 += width;
                                    totalLength_1 += length;
                                });
                            });
                            charSpace = (textLength - totalDefaultWidth_1) / (totalLength_1 - lengthAdjustment);
                        }
                        // Put the textchunks
                        textChunks.reduce(function (lastPositions, _a) {
                            var type = _a.type, chunk = _a.chunk;
                            if (type === 'x') {
                                chunk.setX(lastPositions[0]);
                            }
                            else if (type === 'y') {
                                chunk.setY(lastPositions[1]);
                            }
                            return chunk.put(context, charSpace);
                        }, [0, 0]);
                    }
                    context.pdf.restoreGraphicsState();
                    return [2 /*return*/];
                });
            });
        };
        TextNode.prototype.isVisible = function (parentVisible, context) {
            return svgNodeAndChildrenVisible(this, parentVisible, context);
        };
        TextNode.prototype.getBoundingBoxCore = function (context) {
            return defaultBoundingBox(this.element, context);
        };
        TextNode.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        return TextNode;
    }(GraphicsNode));

    var paramCounts = { a: 7, c: 6, h: 1, l: 2, m: 2, r: 4, q: 4, s: 4, t: 2, v: 1, z: 0 };

    var SPECIAL_SPACES = [
      0x1680, 0x180E, 0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006,
      0x2007, 0x2008, 0x2009, 0x200A, 0x202F, 0x205F, 0x3000, 0xFEFF
    ];

    function isSpace(ch) {
      return (ch === 0x0A) || (ch === 0x0D) || (ch === 0x2028) || (ch === 0x2029) || // Line terminators
        // White spaces
        (ch === 0x20) || (ch === 0x09) || (ch === 0x0B) || (ch === 0x0C) || (ch === 0xA0) ||
        (ch >= 0x1680 && SPECIAL_SPACES.indexOf(ch) >= 0);
    }

    function isCommand(code) {
      /*eslint-disable no-bitwise*/
      switch (code | 0x20) {
        case 0x6D/* m */:
        case 0x7A/* z */:
        case 0x6C/* l */:
        case 0x68/* h */:
        case 0x76/* v */:
        case 0x63/* c */:
        case 0x73/* s */:
        case 0x71/* q */:
        case 0x74/* t */:
        case 0x61/* a */:
        case 0x72/* r */:
          return true;
      }
      return false;
    }

    function isArc(code) {
      return (code | 0x20) === 0x61;
    }

    function isDigit(code) {
      return (code >= 48 && code <= 57);   // 0..9
    }

    function isDigitStart(code) {
      return (code >= 48 && code <= 57) || /* 0..9 */
              code === 0x2B || /* + */
              code === 0x2D || /* - */
              code === 0x2E;   /* . */
    }


    function State(path) {
      this.index  = 0;
      this.path   = path;
      this.max    = path.length;
      this.result = [];
      this.param  = 0.0;
      this.err    = '';
      this.segmentStart = 0;
      this.data   = [];
    }

    function skipSpaces(state) {
      while (state.index < state.max && isSpace(state.path.charCodeAt(state.index))) {
        state.index++;
      }
    }


    function scanFlag(state) {
      var ch = state.path.charCodeAt(state.index);

      if (ch === 0x30/* 0 */) {
        state.param = 0;
        state.index++;
        return;
      }

      if (ch === 0x31/* 1 */) {
        state.param = 1;
        state.index++;
        return;
      }

      state.err = 'SvgPath: arc flag can be 0 or 1 only (at pos ' + state.index + ')';
    }


    function scanParam(state) {
      var start = state.index,
          index = start,
          max = state.max,
          zeroFirst = false,
          hasCeiling = false,
          hasDecimal = false,
          hasDot = false,
          ch;

      if (index >= max) {
        state.err = 'SvgPath: missed param (at pos ' + index + ')';
        return;
      }
      ch = state.path.charCodeAt(index);

      if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
        index++;
        ch = (index < max) ? state.path.charCodeAt(index) : 0;
      }

      // This logic is shamelessly borrowed from Esprima
      // https://github.com/ariya/esprimas
      //
      if (!isDigit(ch) && ch !== 0x2E/* . */) {
        state.err = 'SvgPath: param should start with 0..9 or `.` (at pos ' + index + ')';
        return;
      }

      if (ch !== 0x2E/* . */) {
        zeroFirst = (ch === 0x30/* 0 */);
        index++;

        ch = (index < max) ? state.path.charCodeAt(index) : 0;

        if (zeroFirst && index < max) {
          // decimal number starts with '0' such as '09' is illegal.
          if (ch && isDigit(ch)) {
            state.err = 'SvgPath: numbers started with `0` such as `09` are illegal (at pos ' + start + ')';
            return;
          }
        }

        while (index < max && isDigit(state.path.charCodeAt(index))) {
          index++;
          hasCeiling = true;
        }
        ch = (index < max) ? state.path.charCodeAt(index) : 0;
      }

      if (ch === 0x2E/* . */) {
        hasDot = true;
        index++;
        while (isDigit(state.path.charCodeAt(index))) {
          index++;
          hasDecimal = true;
        }
        ch = (index < max) ? state.path.charCodeAt(index) : 0;
      }

      if (ch === 0x65/* e */ || ch === 0x45/* E */) {
        if (hasDot && !hasCeiling && !hasDecimal) {
          state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
          return;
        }

        index++;

        ch = (index < max) ? state.path.charCodeAt(index) : 0;
        if (ch === 0x2B/* + */ || ch === 0x2D/* - */) {
          index++;
        }
        if (index < max && isDigit(state.path.charCodeAt(index))) {
          while (index < max && isDigit(state.path.charCodeAt(index))) {
            index++;
          }
        } else {
          state.err = 'SvgPath: invalid float exponent (at pos ' + index + ')';
          return;
        }
      }

      state.index = index;
      state.param = parseFloat(state.path.slice(start, index)) + 0.0;
    }


    function finalizeSegment(state) {
      var cmd, cmdLC;

      // Process duplicated commands (without comand name)

      // This logic is shamelessly borrowed from Raphael
      // https://github.com/DmitryBaranovskiy/raphael/
      //
      cmd   = state.path[state.segmentStart];
      cmdLC = cmd.toLowerCase();

      var params = state.data;

      if (cmdLC === 'm' && params.length > 2) {
        state.result.push([ cmd, params[0], params[1] ]);
        params = params.slice(2);
        cmdLC = 'l';
        cmd = (cmd === 'm') ? 'l' : 'L';
      }

      if (cmdLC === 'r') {
        state.result.push([ cmd ].concat(params));
      } else {

        while (params.length >= paramCounts[cmdLC]) {
          state.result.push([ cmd ].concat(params.splice(0, paramCounts[cmdLC])));
          if (!paramCounts[cmdLC]) {
            break;
          }
        }
      }
    }


    function scanSegment(state) {
      var max = state.max,
          cmdCode, is_arc, comma_found, need_params, i;

      state.segmentStart = state.index;
      cmdCode = state.path.charCodeAt(state.index);
      is_arc = isArc(cmdCode);

      if (!isCommand(cmdCode)) {
        state.err = 'SvgPath: bad command ' + state.path[state.index] + ' (at pos ' + state.index + ')';
        return;
      }

      need_params = paramCounts[state.path[state.index].toLowerCase()];

      state.index++;
      skipSpaces(state);

      state.data = [];

      if (!need_params) {
        // Z
        finalizeSegment(state);
        return;
      }

      comma_found = false;

      for (;;) {
        for (i = need_params; i > 0; i--) {
          if (is_arc && (i === 3 || i === 4)) scanFlag(state);
          else scanParam(state);

          if (state.err.length) {
            return;
          }
          state.data.push(state.param);

          skipSpaces(state);
          comma_found = false;

          if (state.index < max && state.path.charCodeAt(state.index) === 0x2C/* , */) {
            state.index++;
            skipSpaces(state);
            comma_found = true;
          }
        }

        // after ',' param is mandatory
        if (comma_found) {
          continue;
        }

        if (state.index >= state.max) {
          break;
        }

        // Stop on next segment
        if (!isDigitStart(state.path.charCodeAt(state.index))) {
          break;
        }
      }

      finalizeSegment(state);
    }


    /* Returns array of segments:
     *
     * [
     *   [ command, coord1, coord2, ... ]
     * ]
     */
    var path_parse = function pathParse(svgPath) {
      var state = new State(svgPath);
      var max = state.max;

      skipSpaces(state);

      while (state.index < max && !state.err.length) {
        scanSegment(state);
      }

      if (state.err.length) {
        state.result = [];

      } else if (state.result.length) {

        if ('mM'.indexOf(state.result[0][0]) < 0) {
          state.err = 'SvgPath: string should start with `M` or `m`';
          state.result = [];
        } else {
          state.result[0][0] = 'M';
        }
      }

      return {
        err: state.err,
        segments: state.result
      };
    };

    // combine 2 matrixes
    // m1, m2 - [a, b, c, d, e, g]
    //
    function combine(m1, m2) {
      return [
        m1[0] * m2[0] + m1[2] * m2[1],
        m1[1] * m2[0] + m1[3] * m2[1],
        m1[0] * m2[2] + m1[2] * m2[3],
        m1[1] * m2[2] + m1[3] * m2[3],
        m1[0] * m2[4] + m1[2] * m2[5] + m1[4],
        m1[1] * m2[4] + m1[3] * m2[5] + m1[5]
      ];
    }


    function Matrix() {
      if (!(this instanceof Matrix)) { return new Matrix(); }
      this.queue = [];   // list of matrixes to apply
      this.cache = null; // combined matrix cache
    }


    Matrix.prototype.matrix = function (m) {
      if (m[0] === 1 && m[1] === 0 && m[2] === 0 && m[3] === 1 && m[4] === 0 && m[5] === 0) {
        return this;
      }
      this.cache = null;
      this.queue.push(m);
      return this;
    };


    Matrix.prototype.translate = function (tx, ty) {
      if (tx !== 0 || ty !== 0) {
        this.cache = null;
        this.queue.push([ 1, 0, 0, 1, tx, ty ]);
      }
      return this;
    };


    Matrix.prototype.scale = function (sx, sy) {
      if (sx !== 1 || sy !== 1) {
        this.cache = null;
        this.queue.push([ sx, 0, 0, sy, 0, 0 ]);
      }
      return this;
    };


    Matrix.prototype.rotate = function (angle, rx, ry) {
      var rad, cos, sin;

      if (angle !== 0) {
        this.translate(rx, ry);

        rad = angle * Math.PI / 180;
        cos = Math.cos(rad);
        sin = Math.sin(rad);

        this.queue.push([ cos, sin, -sin, cos, 0, 0 ]);
        this.cache = null;

        this.translate(-rx, -ry);
      }
      return this;
    };


    Matrix.prototype.skewX = function (angle) {
      if (angle !== 0) {
        this.cache = null;
        this.queue.push([ 1, 0, Math.tan(angle * Math.PI / 180), 1, 0, 0 ]);
      }
      return this;
    };


    Matrix.prototype.skewY = function (angle) {
      if (angle !== 0) {
        this.cache = null;
        this.queue.push([ 1, Math.tan(angle * Math.PI / 180), 0, 1, 0, 0 ]);
      }
      return this;
    };


    // Flatten queue
    //
    Matrix.prototype.toArray = function () {
      if (this.cache) {
        return this.cache;
      }

      if (!this.queue.length) {
        this.cache = [ 1, 0, 0, 1, 0, 0 ];
        return this.cache;
      }

      this.cache = this.queue[0];

      if (this.queue.length === 1) {
        return this.cache;
      }

      for (var i = 1; i < this.queue.length; i++) {
        this.cache = combine(this.cache, this.queue[i]);
      }

      return this.cache;
    };


    // Apply list of matrixes to (x,y) point.
    // If `isRelative` set, `translate` component of matrix will be skipped
    //
    Matrix.prototype.calc = function (x, y, isRelative) {
      var m;

      // Don't change point on empty transforms queue
      if (!this.queue.length) { return [ x, y ]; }

      // Calculate final matrix, if not exists
      //
      // NB. if you deside to apply transforms to point one-by-one,
      // they should be taken in reverse order

      if (!this.cache) {
        this.cache = this.toArray();
      }

      m = this.cache;

      // Apply matrix to point
      return [
        x * m[0] + y * m[2] + (isRelative ? 0 : m[4]),
        x * m[1] + y * m[3] + (isRelative ? 0 : m[5])
      ];
    };


    var matrix = Matrix;

    var operations = {
      matrix: true,
      scale: true,
      rotate: true,
      translate: true,
      skewX: true,
      skewY: true
    };

    var CMD_SPLIT_RE    = /\s*(matrix|translate|scale|rotate|skewX|skewY)\s*\(\s*(.+?)\s*\)[\s,]*/;
    var PARAMS_SPLIT_RE = /[\s,]+/;


    var transform_parse = function transformParse(transformString) {
      var matrix$1 = new matrix();
      var cmd, params;

      // Split value into ['', 'translate', '10 50', '', 'scale', '2', '', 'rotate',  '-45', '']
      transformString.split(CMD_SPLIT_RE).forEach(function (item) {

        // Skip empty elements
        if (!item.length) { return; }

        // remember operation
        if (typeof operations[item] !== 'undefined') {
          cmd = item;
          return;
        }

        // extract params & att operation to matrix
        params = item.split(PARAMS_SPLIT_RE).map(function (i) {
          return +i || 0;
        });

        // If params count is not correct - ignore command
        switch (cmd) {
          case 'matrix':
            if (params.length === 6) {
              matrix$1.matrix(params);
            }
            return;

          case 'scale':
            if (params.length === 1) {
              matrix$1.scale(params[0], params[0]);
            } else if (params.length === 2) {
              matrix$1.scale(params[0], params[1]);
            }
            return;

          case 'rotate':
            if (params.length === 1) {
              matrix$1.rotate(params[0], 0, 0);
            } else if (params.length === 3) {
              matrix$1.rotate(params[0], params[1], params[2]);
            }
            return;

          case 'translate':
            if (params.length === 1) {
              matrix$1.translate(params[0], 0);
            } else if (params.length === 2) {
              matrix$1.translate(params[0], params[1]);
            }
            return;

          case 'skewX':
            if (params.length === 1) {
              matrix$1.skewX(params[0]);
            }
            return;

          case 'skewY':
            if (params.length === 1) {
              matrix$1.skewY(params[0]);
            }
            return;
        }
      });

      return matrix$1;
    };

    // Convert an arc to a sequence of cubic bézier curves


    var TAU = Math.PI * 2;


    /* eslint-disable space-infix-ops */

    // Calculate an angle between two unit vectors
    //
    // Since we measure angle between radii of circular arcs,
    // we can use simplified math (without length normalization)
    //
    function unit_vector_angle(ux, uy, vx, vy) {
      var sign = (ux * vy - uy * vx < 0) ? -1 : 1;
      var dot  = ux * vx + uy * vy;

      // Add this to work with arbitrary vectors:
      // dot /= Math.sqrt(ux * ux + uy * uy) * Math.sqrt(vx * vx + vy * vy);

      // rounding errors, e.g. -1.0000000000000002 can screw up this
      if (dot >  1.0) { dot =  1.0; }
      if (dot < -1.0) { dot = -1.0; }

      return sign * Math.acos(dot);
    }


    // Convert from endpoint to center parameterization,
    // see http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
    //
    // Return [cx, cy, theta1, delta_theta]
    //
    function get_arc_center(x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi) {
      // Step 1.
      //
      // Moving an ellipse so origin will be the middlepoint between our two
      // points. After that, rotate it to line up ellipse axes with coordinate
      // axes.
      //
      var x1p =  cos_phi*(x1-x2)/2 + sin_phi*(y1-y2)/2;
      var y1p = -sin_phi*(x1-x2)/2 + cos_phi*(y1-y2)/2;

      var rx_sq  =  rx * rx;
      var ry_sq  =  ry * ry;
      var x1p_sq = x1p * x1p;
      var y1p_sq = y1p * y1p;

      // Step 2.
      //
      // Compute coordinates of the centre of this ellipse (cx', cy')
      // in the new coordinate system.
      //
      var radicant = (rx_sq * ry_sq) - (rx_sq * y1p_sq) - (ry_sq * x1p_sq);

      if (radicant < 0) {
        // due to rounding errors it might be e.g. -1.3877787807814457e-17
        radicant = 0;
      }

      radicant /=   (rx_sq * y1p_sq) + (ry_sq * x1p_sq);
      radicant = Math.sqrt(radicant) * (fa === fs ? -1 : 1);

      var cxp = radicant *  rx/ry * y1p;
      var cyp = radicant * -ry/rx * x1p;

      // Step 3.
      //
      // Transform back to get centre coordinates (cx, cy) in the original
      // coordinate system.
      //
      var cx = cos_phi*cxp - sin_phi*cyp + (x1+x2)/2;
      var cy = sin_phi*cxp + cos_phi*cyp + (y1+y2)/2;

      // Step 4.
      //
      // Compute angles (theta1, delta_theta).
      //
      var v1x =  (x1p - cxp) / rx;
      var v1y =  (y1p - cyp) / ry;
      var v2x = (-x1p - cxp) / rx;
      var v2y = (-y1p - cyp) / ry;

      var theta1 = unit_vector_angle(1, 0, v1x, v1y);
      var delta_theta = unit_vector_angle(v1x, v1y, v2x, v2y);

      if (fs === 0 && delta_theta > 0) {
        delta_theta -= TAU;
      }
      if (fs === 1 && delta_theta < 0) {
        delta_theta += TAU;
      }

      return [ cx, cy, theta1, delta_theta ];
    }

    //
    // Approximate one unit arc segment with bézier curves,
    // see http://math.stackexchange.com/questions/873224
    //
    function approximate_unit_arc(theta1, delta_theta) {
      var alpha = 4/3 * Math.tan(delta_theta/4);

      var x1 = Math.cos(theta1);
      var y1 = Math.sin(theta1);
      var x2 = Math.cos(theta1 + delta_theta);
      var y2 = Math.sin(theta1 + delta_theta);

      return [ x1, y1, x1 - y1*alpha, y1 + x1*alpha, x2 + y2*alpha, y2 - x2*alpha, x2, y2 ];
    }

    var a2c = function a2c(x1, y1, x2, y2, fa, fs, rx, ry, phi) {
      var sin_phi = Math.sin(phi * TAU / 360);
      var cos_phi = Math.cos(phi * TAU / 360);

      // Make sure radii are valid
      //
      var x1p =  cos_phi*(x1-x2)/2 + sin_phi*(y1-y2)/2;
      var y1p = -sin_phi*(x1-x2)/2 + cos_phi*(y1-y2)/2;

      if (x1p === 0 && y1p === 0) {
        // we're asked to draw line to itself
        return [];
      }

      if (rx === 0 || ry === 0) {
        // one of the radii is zero
        return [];
      }


      // Compensate out-of-range radii
      //
      rx = Math.abs(rx);
      ry = Math.abs(ry);

      var lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
      if (lambda > 1) {
        rx *= Math.sqrt(lambda);
        ry *= Math.sqrt(lambda);
      }


      // Get center parameters (cx, cy, theta1, delta_theta)
      //
      var cc = get_arc_center(x1, y1, x2, y2, fa, fs, rx, ry, sin_phi, cos_phi);

      var result = [];
      var theta1 = cc[2];
      var delta_theta = cc[3];

      // Split an arc to multiple segments, so each segment
      // will be less than τ/4 (= 90°)
      //
      var segments = Math.max(Math.ceil(Math.abs(delta_theta) / (TAU / 4)), 1);
      delta_theta /= segments;

      for (var i = 0; i < segments; i++) {
        result.push(approximate_unit_arc(theta1, delta_theta));
        theta1 += delta_theta;
      }

      // We have a bezier approximation of a unit circle,
      // now need to transform back to the original ellipse
      //
      return result.map(function (curve) {
        for (var i = 0; i < curve.length; i += 2) {
          var x = curve[i + 0];
          var y = curve[i + 1];

          // scale
          x *= rx;
          y *= ry;

          // rotate
          var xp = cos_phi*x - sin_phi*y;
          var yp = sin_phi*x + cos_phi*y;

          // translate
          curve[i + 0] = xp + cc[0];
          curve[i + 1] = yp + cc[1];
        }

        return curve;
      });
    };

    /* eslint-disable space-infix-ops */

    // The precision used to consider an ellipse as a circle
    //
    var epsilon = 0.0000000001;

    // To convert degree in radians
    //
    var torad = Math.PI / 180;

    // Class constructor :
    //  an ellipse centred at 0 with radii rx,ry and x - axis - angle ax.
    //
    function Ellipse$1(rx, ry, ax) {
      if (!(this instanceof Ellipse$1)) { return new Ellipse$1(rx, ry, ax); }
      this.rx = rx;
      this.ry = ry;
      this.ax = ax;
    }

    // Apply a linear transform m to the ellipse
    // m is an array representing a matrix :
    //    -         -
    //   | m[0] m[2] |
    //   | m[1] m[3] |
    //    -         -
    //
    Ellipse$1.prototype.transform = function (m) {
      // We consider the current ellipse as image of the unit circle
      // by first scale(rx,ry) and then rotate(ax) ...
      // So we apply ma =  m x rotate(ax) x scale(rx,ry) to the unit circle.
      var c = Math.cos(this.ax * torad), s = Math.sin(this.ax * torad);
      var ma = [
        this.rx * (m[0]*c + m[2]*s),
        this.rx * (m[1]*c + m[3]*s),
        this.ry * (-m[0]*s + m[2]*c),
        this.ry * (-m[1]*s + m[3]*c)
      ];

      // ma * transpose(ma) = [ J L ]
      //                      [ L K ]
      // L is calculated later (if the image is not a circle)
      var J = ma[0]*ma[0] + ma[2]*ma[2],
          K = ma[1]*ma[1] + ma[3]*ma[3];

      // the discriminant of the characteristic polynomial of ma * transpose(ma)
      var D = ((ma[0]-ma[3])*(ma[0]-ma[3]) + (ma[2]+ma[1])*(ma[2]+ma[1])) *
              ((ma[0]+ma[3])*(ma[0]+ma[3]) + (ma[2]-ma[1])*(ma[2]-ma[1]));

      // the "mean eigenvalue"
      var JK = (J + K) / 2;

      // check if the image is (almost) a circle
      if (D < epsilon * JK) {
        // if it is
        this.rx = this.ry = Math.sqrt(JK);
        this.ax = 0;
        return this;
      }

      // if it is not a circle
      var L = ma[0]*ma[1] + ma[2]*ma[3];

      D = Math.sqrt(D);

      // {l1,l2} = the two eigen values of ma * transpose(ma)
      var l1 = JK + D/2,
          l2 = JK - D/2;
      // the x - axis - rotation angle is the argument of the l1 - eigenvector
      /*eslint-disable indent*/
      this.ax = (Math.abs(L) < epsilon && Math.abs(l1 - K) < epsilon) ?
        90
      :
        Math.atan(Math.abs(L) > Math.abs(l1 - K) ?
          (l1 - J) / L
        :
          L / (l1 - K)
        ) * 180 / Math.PI;
      /*eslint-enable indent*/

      // if ax > 0 => rx = sqrt(l1), ry = sqrt(l2), else exchange axes and ax += 90
      if (this.ax >= 0) {
        // if ax in [0,90]
        this.rx = Math.sqrt(l1);
        this.ry = Math.sqrt(l2);
      } else {
        // if ax in ]-90,0[ => exchange axes
        this.ax += 90;
        this.rx = Math.sqrt(l2);
        this.ry = Math.sqrt(l1);
      }

      return this;
    };

    // Check if the ellipse is (almost) degenerate, i.e. rx = 0 or ry = 0
    //
    Ellipse$1.prototype.isDegenerate = function () {
      return (this.rx < epsilon * this.ry || this.ry < epsilon * this.rx);
    };

    var ellipse = Ellipse$1;

    // Class constructor
    //
    function SvgPath(path) {
      if (!(this instanceof SvgPath)) { return new SvgPath(path); }

      var pstate = path_parse(path);

      // Array of path segments.
      // Each segment is array [command, param1, param2, ...]
      this.segments = pstate.segments;

      // Error message on parse error.
      this.err      = pstate.err;

      // Transforms stack for lazy evaluation
      this.__stack    = [];
    }

    SvgPath.from = function (src) {
      if (typeof src === 'string') return new SvgPath(src);

      if (src instanceof SvgPath) {
        // Create empty object
        var s = new SvgPath('');

        // Clone properies
        s.err = src.err;
        s.segments = src.segments.map(function (sgm) { return sgm.slice(); });
        s.__stack = src.__stack.map(function (m) {
          return matrix().matrix(m.toArray());
        });

        return s;
      }

      throw new Error('SvgPath.from: invalid param type ' + src);
    };


    SvgPath.prototype.__matrix = function (m) {
      var self = this, i;

      // Quick leave for empty matrix
      if (!m.queue.length) { return; }

      this.iterate(function (s, index, x, y) {
        var p, result, name, isRelative;

        switch (s[0]) {

          // Process 'assymetric' commands separately
          case 'v':
            p      = m.calc(0, s[1], true);
            result = (p[0] === 0) ? [ 'v', p[1] ] : [ 'l', p[0], p[1] ];
            break;

          case 'V':
            p      = m.calc(x, s[1], false);
            result = (p[0] === m.calc(x, y, false)[0]) ? [ 'V', p[1] ] : [ 'L', p[0], p[1] ];
            break;

          case 'h':
            p      = m.calc(s[1], 0, true);
            result = (p[1] === 0) ? [ 'h', p[0] ] : [ 'l', p[0], p[1] ];
            break;

          case 'H':
            p      = m.calc(s[1], y, false);
            result = (p[1] === m.calc(x, y, false)[1]) ? [ 'H', p[0] ] : [ 'L', p[0], p[1] ];
            break;

          case 'a':
          case 'A':
            // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]

            // Drop segment if arc is empty (end point === start point)
            /*if ((s[0] === 'A' && s[6] === x && s[7] === y) ||
                (s[0] === 'a' && s[6] === 0 && s[7] === 0)) {
              return [];
            }*/

            // Transform rx, ry and the x-axis-rotation
            var ma = m.toArray();
            var e = ellipse(s[1], s[2], s[3]).transform(ma);

            // flip sweep-flag if matrix is not orientation-preserving
            if (ma[0] * ma[3] - ma[1] * ma[2] < 0) {
              s[5] = s[5] ? '0' : '1';
            }

            // Transform end point as usual (without translation for relative notation)
            p = m.calc(s[6], s[7], s[0] === 'a');

            // Empty arcs can be ignored by renderer, but should not be dropped
            // to avoid collisions with `S A S` and so on. Replace with empty line.
            if ((s[0] === 'A' && s[6] === x && s[7] === y) ||
                (s[0] === 'a' && s[6] === 0 && s[7] === 0)) {
              result = [ s[0] === 'a' ? 'l' : 'L', p[0], p[1] ];
              break;
            }

            // if the resulting ellipse is (almost) a segment ...
            if (e.isDegenerate()) {
              // replace the arc by a line
              result = [ s[0] === 'a' ? 'l' : 'L', p[0], p[1] ];
            } else {
              // if it is a real ellipse
              // s[0], s[4] and s[5] are not modified
              result = [ s[0], e.rx, e.ry, e.ax, s[4], s[5], p[0], p[1] ];
            }

            break;

          case 'm':
            // Edge case. The very first `m` should be processed as absolute, if happens.
            // Make sense for coord shift transforms.
            isRelative = index > 0;

            p = m.calc(s[1], s[2], isRelative);
            result = [ 'm', p[0], p[1] ];
            break;

          default:
            name       = s[0];
            result     = [ name ];
            isRelative = (name.toLowerCase() === name);

            // Apply transformations to the segment
            for (i = 1; i < s.length; i += 2) {
              p = m.calc(s[i], s[i + 1], isRelative);
              result.push(p[0], p[1]);
            }
        }

        self.segments[index] = result;
      }, true);
    };


    // Apply stacked commands
    //
    SvgPath.prototype.__evaluateStack = function () {
      var m, i;

      if (!this.__stack.length) { return; }

      if (this.__stack.length === 1) {
        this.__matrix(this.__stack[0]);
        this.__stack = [];
        return;
      }

      m = matrix();
      i = this.__stack.length;

      while (--i >= 0) {
        m.matrix(this.__stack[i].toArray());
      }

      this.__matrix(m);
      this.__stack = [];
    };


    // Convert processed SVG Path back to string
    //
    SvgPath.prototype.toString = function () {
      var elements = [], skipCmd, cmd;

      this.__evaluateStack();

      for (var i = 0; i < this.segments.length; i++) {
        // remove repeating commands names
        cmd = this.segments[i][0];
        skipCmd = i > 0 && cmd !== 'm' && cmd !== 'M' && cmd === this.segments[i - 1][0];
        elements = elements.concat(skipCmd ? this.segments[i].slice(1) : this.segments[i]);
      }

      return elements.join(' ')
        // Optimizations: remove spaces around commands & before `-`
        //
        // We could also remove leading zeros for `0.5`-like values,
        // but their count is too small to spend time for.
        .replace(/ ?([achlmqrstvz]) ?/gi, '$1')
        .replace(/ \-/g, '-')
        // workaround for FontForge SVG importing bug
        .replace(/zm/g, 'z m');
    };


    // Translate path to (x [, y])
    //
    SvgPath.prototype.translate = function (x, y) {
      this.__stack.push(matrix().translate(x, y || 0));
      return this;
    };


    // Scale path to (sx [, sy])
    // sy = sx if not defined
    //
    SvgPath.prototype.scale = function (sx, sy) {
      this.__stack.push(matrix().scale(sx, (!sy && (sy !== 0)) ? sx : sy));
      return this;
    };


    // Rotate path around point (sx [, sy])
    // sy = sx if not defined
    //
    SvgPath.prototype.rotate = function (angle, rx, ry) {
      this.__stack.push(matrix().rotate(angle, rx || 0, ry || 0));
      return this;
    };


    // Skew path along the X axis by `degrees` angle
    //
    SvgPath.prototype.skewX = function (degrees) {
      this.__stack.push(matrix().skewX(degrees));
      return this;
    };


    // Skew path along the Y axis by `degrees` angle
    //
    SvgPath.prototype.skewY = function (degrees) {
      this.__stack.push(matrix().skewY(degrees));
      return this;
    };


    // Apply matrix transform (array of 6 elements)
    //
    SvgPath.prototype.matrix = function (m) {
      this.__stack.push(matrix().matrix(m));
      return this;
    };


    // Transform path according to "transform" attr of SVG spec
    //
    SvgPath.prototype.transform = function (transformString) {
      if (!transformString.trim()) {
        return this;
      }
      this.__stack.push(transform_parse(transformString));
      return this;
    };


    // Round coords with given decimal precition.
    // 0 by default (to integers)
    //
    SvgPath.prototype.round = function (d) {
      var contourStartDeltaX = 0, contourStartDeltaY = 0, deltaX = 0, deltaY = 0, l;

      d = d || 0;

      this.__evaluateStack();

      this.segments.forEach(function (s) {
        var isRelative = (s[0].toLowerCase() === s[0]);

        switch (s[0]) {
          case 'H':
          case 'h':
            if (isRelative) { s[1] += deltaX; }
            deltaX = s[1] - s[1].toFixed(d);
            s[1] = +s[1].toFixed(d);
            return;

          case 'V':
          case 'v':
            if (isRelative) { s[1] += deltaY; }
            deltaY = s[1] - s[1].toFixed(d);
            s[1] = +s[1].toFixed(d);
            return;

          case 'Z':
          case 'z':
            deltaX = contourStartDeltaX;
            deltaY = contourStartDeltaY;
            return;

          case 'M':
          case 'm':
            if (isRelative) {
              s[1] += deltaX;
              s[2] += deltaY;
            }

            deltaX = s[1] - s[1].toFixed(d);
            deltaY = s[2] - s[2].toFixed(d);

            contourStartDeltaX = deltaX;
            contourStartDeltaY = deltaY;

            s[1] = +s[1].toFixed(d);
            s[2] = +s[2].toFixed(d);
            return;

          case 'A':
          case 'a':
            // [cmd, rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
            if (isRelative) {
              s[6] += deltaX;
              s[7] += deltaY;
            }

            deltaX = s[6] - s[6].toFixed(d);
            deltaY = s[7] - s[7].toFixed(d);

            s[1] = +s[1].toFixed(d);
            s[2] = +s[2].toFixed(d);
            s[3] = +s[3].toFixed(d + 2); // better precision for rotation
            s[6] = +s[6].toFixed(d);
            s[7] = +s[7].toFixed(d);
            return;

          default:
            // a c l q s t
            l = s.length;

            if (isRelative) {
              s[l - 2] += deltaX;
              s[l - 1] += deltaY;
            }

            deltaX = s[l - 2] - s[l - 2].toFixed(d);
            deltaY = s[l - 1] - s[l - 1].toFixed(d);

            s.forEach(function (val, i) {
              if (!i) { return; }
              s[i] = +s[i].toFixed(d);
            });
            return;
        }
      });

      return this;
    };


    // Apply iterator function to all segments. If function returns result,
    // current segment will be replaced to array of returned segments.
    // If empty array is returned, current regment will be deleted.
    //
    SvgPath.prototype.iterate = function (iterator, keepLazyStack) {
      var segments = this.segments,
          replacements = {},
          needReplace = false,
          lastX = 0,
          lastY = 0,
          countourStartX = 0,
          countourStartY = 0;
      var i, j, newSegments;

      if (!keepLazyStack) {
        this.__evaluateStack();
      }

      segments.forEach(function (s, index) {

        var res = iterator(s, index, lastX, lastY);

        if (Array.isArray(res)) {
          replacements[index] = res;
          needReplace = true;
        }

        var isRelative = (s[0] === s[0].toLowerCase());

        // calculate absolute X and Y
        switch (s[0]) {
          case 'm':
          case 'M':
            lastX = s[1] + (isRelative ? lastX : 0);
            lastY = s[2] + (isRelative ? lastY : 0);
            countourStartX = lastX;
            countourStartY = lastY;
            return;

          case 'h':
          case 'H':
            lastX = s[1] + (isRelative ? lastX : 0);
            return;

          case 'v':
          case 'V':
            lastY = s[1] + (isRelative ? lastY : 0);
            return;

          case 'z':
          case 'Z':
            // That make sence for multiple contours
            lastX = countourStartX;
            lastY = countourStartY;
            return;

          default:
            lastX = s[s.length - 2] + (isRelative ? lastX : 0);
            lastY = s[s.length - 1] + (isRelative ? lastY : 0);
        }
      });

      // Replace segments if iterator return results

      if (!needReplace) { return this; }

      newSegments = [];

      for (i = 0; i < segments.length; i++) {
        if (typeof replacements[i] !== 'undefined') {
          for (j = 0; j < replacements[i].length; j++) {
            newSegments.push(replacements[i][j]);
          }
        } else {
          newSegments.push(segments[i]);
        }
      }

      this.segments = newSegments;

      return this;
    };


    // Converts segments from relative to absolute
    //
    SvgPath.prototype.abs = function () {

      this.iterate(function (s, index, x, y) {
        var name = s[0],
            nameUC = name.toUpperCase(),
            i;

        // Skip absolute commands
        if (name === nameUC) { return; }

        s[0] = nameUC;

        switch (name) {
          case 'v':
            // v has shifted coords parity
            s[1] += y;
            return;

          case 'a':
            // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
            // touch x, y only
            s[6] += x;
            s[7] += y;
            return;

          default:
            for (i = 1; i < s.length; i++) {
              s[i] += i % 2 ? x : y; // odd values are X, even - Y
            }
        }
      }, true);

      return this;
    };


    // Converts segments from absolute to relative
    //
    SvgPath.prototype.rel = function () {

      this.iterate(function (s, index, x, y) {
        var name = s[0],
            nameLC = name.toLowerCase(),
            i;

        // Skip relative commands
        if (name === nameLC) { return; }

        // Don't touch the first M to avoid potential confusions.
        if (index === 0 && name === 'M') { return; }

        s[0] = nameLC;

        switch (name) {
          case 'V':
            // V has shifted coords parity
            s[1] -= y;
            return;

          case 'A':
            // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
            // touch x, y only
            s[6] -= x;
            s[7] -= y;
            return;

          default:
            for (i = 1; i < s.length; i++) {
              s[i] -= i % 2 ? x : y; // odd values are X, even - Y
            }
        }
      }, true);

      return this;
    };


    // Converts arcs to cubic bézier curves
    //
    SvgPath.prototype.unarc = function () {
      this.iterate(function (s, index, x, y) {
        var new_segments, nextX, nextY, result = [], name = s[0];

        // Skip anything except arcs
        if (name !== 'A' && name !== 'a') { return null; }

        if (name === 'a') {
          // convert relative arc coordinates to absolute
          nextX = x + s[6];
          nextY = y + s[7];
        } else {
          nextX = s[6];
          nextY = s[7];
        }

        new_segments = a2c(x, y, nextX, nextY, s[4], s[5], s[1], s[2], s[3]);

        // Degenerated arcs can be ignored by renderer, but should not be dropped
        // to avoid collisions with `S A S` and so on. Replace with empty line.
        if (new_segments.length === 0) {
          return [ [ s[0] === 'a' ? 'l' : 'L', s[6], s[7] ] ];
        }

        new_segments.forEach(function (s) {
          result.push([ 'C', s[2], s[3], s[4], s[5], s[6], s[7] ]);
        });

        return result;
      });

      return this;
    };


    // Converts smooth curves (with missed control point) to generic curves
    //
    SvgPath.prototype.unshort = function () {
      var segments = this.segments;
      var prevControlX, prevControlY, prevSegment;
      var curControlX, curControlY;

      // TODO: add lazy evaluation flag when relative commands supported

      this.iterate(function (s, idx, x, y) {
        var name = s[0], nameUC = name.toUpperCase(), isRelative;

        // First command MUST be M|m, it's safe to skip.
        // Protect from access to [-1] for sure.
        if (!idx) { return; }

        if (nameUC === 'T') { // quadratic curve
          isRelative = (name === 't');

          prevSegment = segments[idx - 1];

          if (prevSegment[0] === 'Q') {
            prevControlX = prevSegment[1] - x;
            prevControlY = prevSegment[2] - y;
          } else if (prevSegment[0] === 'q') {
            prevControlX = prevSegment[1] - prevSegment[3];
            prevControlY = prevSegment[2] - prevSegment[4];
          } else {
            prevControlX = 0;
            prevControlY = 0;
          }

          curControlX = -prevControlX;
          curControlY = -prevControlY;

          if (!isRelative) {
            curControlX += x;
            curControlY += y;
          }

          segments[idx] = [
            isRelative ? 'q' : 'Q',
            curControlX, curControlY,
            s[1], s[2]
          ];

        } else if (nameUC === 'S') { // cubic curve
          isRelative = (name === 's');

          prevSegment = segments[idx - 1];

          if (prevSegment[0] === 'C') {
            prevControlX = prevSegment[3] - x;
            prevControlY = prevSegment[4] - y;
          } else if (prevSegment[0] === 'c') {
            prevControlX = prevSegment[3] - prevSegment[5];
            prevControlY = prevSegment[4] - prevSegment[6];
          } else {
            prevControlX = 0;
            prevControlY = 0;
          }

          curControlX = -prevControlX;
          curControlY = -prevControlY;

          if (!isRelative) {
            curControlX += x;
            curControlY += y;
          }

          segments[idx] = [
            isRelative ? 'c' : 'C',
            curControlX, curControlY,
            s[1], s[2], s[3], s[4]
          ];
        }
      });

      return this;
    };


    var svgpath = SvgPath;

    var svgpath$1 = svgpath;

    var PathNode = /** @class */ (function (_super) {
        __extends(PathNode, _super);
        function PathNode(node, children) {
            return _super.call(this, true, node, children) || this;
        }
        PathNode.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        PathNode.prototype.isVisible = function (parentVisible, context) {
            return svgNodeIsVisible(this, parentVisible, context);
        };
        PathNode.prototype.getPath = function (context) {
            var svgPath = new svgpath$1(getAttribute(this.element, context.styleSheets, 'd') || '')
                .unshort()
                .unarc()
                .abs();
            var path = new Path();
            var prevX;
            var prevY;
            svgPath.iterate(function (seg) {
                var type = seg[0];
                switch (type) {
                    case 'M':
                        path.moveTo(seg[1], seg[2]);
                        break;
                    case 'L':
                        path.lineTo(seg[1], seg[2]);
                        break;
                    case 'H':
                        path.lineTo(seg[1], prevY);
                        break;
                    case 'V':
                        path.lineTo(prevX, seg[1]);
                        break;
                    case 'C':
                        path.curveTo(seg[1], seg[2], seg[3], seg[4], seg[5], seg[6]);
                        break;
                    case 'Q':
                        var p2 = toCubic([prevX, prevY], [seg[1], seg[2]]);
                        var p3 = toCubic([seg[3], seg[4]], [seg[1], seg[2]]);
                        path.curveTo(p2[0], p2[1], p3[0], p3[1], seg[3], seg[4]);
                        break;
                    case 'Z':
                        path.close();
                        break;
                }
                switch (type) {
                    case 'M':
                    case 'L':
                        prevX = seg[1];
                        prevY = seg[2];
                        break;
                    case 'H':
                        prevX = seg[1];
                        break;
                    case 'V':
                        prevY = seg[1];
                        break;
                    case 'C':
                        prevX = seg[5];
                        prevY = seg[6];
                        break;
                    case 'Q':
                        prevX = seg[3];
                        prevY = seg[4];
                        break;
                }
            });
            return path;
        };
        return PathNode;
    }(GeometryNode));

    // groups: 1: mime-type (+ charset), 2: mime-type (w/o charset), 3: charset, 4: base64?, 5: body
    var dataUriRegex = /^\s*data:(([^/,;]+\/[^/,;]+)(?:;([^,;=]+=[^,;=]+))?)?(?:;(base64))?,(.*\s*)$/i;
    var ImageNode = /** @class */ (function (_super) {
        __extends(ImageNode, _super);
        function ImageNode(element, children) {
            var _this = _super.call(this, element, children) || this;
            _this.imageLoadingPromise = null;
            _this.imageUrl = _this.element.getAttribute('xlink:href') || _this.element.getAttribute('href');
            if (_this.imageUrl) {
                // start loading the image as early as possible
                _this.imageLoadingPromise = ImageNode.fetchImageData(_this.imageUrl);
            }
            return _this;
        }
        ImageNode.prototype.renderCore = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var width, height, x, y, _a, data, format, parser, svgElement, preserveAspectRatio, idMap, svgnode, dataUri;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.imageLoadingPromise) {
                                return [2 /*return*/];
                            }
                            context.pdf.setCurrentTransformationMatrix(context.transform);
                            width = parseFloat(getAttribute(this.element, context.styleSheets, 'width') || '0'), height = parseFloat(getAttribute(this.element, context.styleSheets, 'height') || '0'), x = parseFloat(getAttribute(this.element, context.styleSheets, 'x') || '0'), y = parseFloat(getAttribute(this.element, context.styleSheets, 'y') || '0');
                            if (!isFinite(width) || width <= 0 || !isFinite(height) || height <= 0) {
                                return [2 /*return*/];
                            }
                            return [4 /*yield*/, this.imageLoadingPromise];
                        case 1:
                            _a = _b.sent(), data = _a.data, format = _a.format;
                            if (!(format.indexOf('svg') === 0)) return [3 /*break*/, 3];
                            parser = new DOMParser();
                            svgElement = parser.parseFromString(data, 'image/svg+xml').firstElementChild;
                            preserveAspectRatio = this.element.getAttribute('preserveAspectRatio');
                            if (!preserveAspectRatio ||
                                preserveAspectRatio.indexOf('defer') < 0 ||
                                !svgElement.getAttribute('preserveAspectRatio')) {
                                svgElement.setAttribute('preserveAspectRatio', preserveAspectRatio || '');
                            }
                            svgElement.setAttribute('x', String(x));
                            svgElement.setAttribute('y', String(y));
                            svgElement.setAttribute('width', String(width));
                            svgElement.setAttribute('height', String(height));
                            idMap = {};
                            svgnode = parse$1(svgElement, idMap);
                            return [4 /*yield*/, svgnode.render(new Context(context.pdf, {
                                    refsHandler: new ReferencesHandler(idMap),
                                    styleSheets: context.styleSheets,
                                    viewport: new Viewport(width, height),
                                    svg2pdfParameters: context.svg2pdfParameters
                                }))];
                        case 2:
                            _b.sent();
                            return [2 /*return*/];
                        case 3:
                            dataUri = "data:image/" + format + ";base64," + btoa(data);
                            try {
                                context.pdf.addImage(dataUri, '', // will be ignored anyways if imageUrl is a data url
                                x, y, width, height);
                            }
                            catch (e) {
                                typeof console === 'object' &&
                                    console.warn &&
                                    console.warn("Could not load image " + this.imageUrl + ".\n" + e);
                            }
                            _b.label = 4;
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ImageNode.prototype.getBoundingBoxCore = function (context) {
            return defaultBoundingBox(this.element, context);
        };
        ImageNode.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        ImageNode.prototype.isVisible = function (parentVisible, context) {
            return svgNodeIsVisible(this, parentVisible, context);
        };
        ImageNode.fetchImageData = function (imageUrl) {
            return __awaiter(this, void 0, void 0, function () {
                var data, format, match, mimeType, mimeTypeParts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            match = imageUrl.match(dataUriRegex);
                            if (!match) return [3 /*break*/, 1];
                            mimeType = match[2];
                            mimeTypeParts = mimeType.split('/');
                            if (mimeTypeParts[0] !== 'image') {
                                throw new Error("Unsupported image URL: " + imageUrl);
                            }
                            format = mimeTypeParts[1];
                            data = match[5];
                            if (match[4] === 'base64') {
                                data = atob(data);
                            }
                            else {
                                data = decodeURIComponent(data);
                            }
                            return [3 /*break*/, 3];
                        case 1: return [4 /*yield*/, ImageNode.fetchImage(imageUrl)];
                        case 2:
                            data = _a.sent();
                            format = imageUrl.substring(imageUrl.lastIndexOf('.') + 1);
                            _a.label = 3;
                        case 3: return [2 /*return*/, {
                                data: data,
                                format: format
                            }];
                    }
                });
            });
        };
        ImageNode.fetchImage = function (imageUrl) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', imageUrl, true);
                xhr.responseType = 'arraybuffer';
                xhr.onload = function () {
                    if (xhr.status !== 200) {
                        throw new Error("Error " + xhr.status + ": Failed to load image '" + imageUrl + "'");
                    }
                    var bytes = new Uint8Array(xhr.response);
                    var data = '';
                    for (var i = 0; i < bytes.length; i++) {
                        data += String.fromCharCode(bytes[i]);
                    }
                    resolve(data);
                };
                xhr.onerror = reject;
                xhr.onabort = reject;
                xhr.send(null);
            });
        };
        ImageNode.getMimeType = function (format) {
            format = format.toLowerCase();
            switch (format) {
                case 'jpg':
                case 'jpeg':
                    return 'image/jpeg';
                default:
                    return "image/" + format;
            }
        };
        return ImageNode;
    }(GraphicsNode));

    var Traverse = /** @class */ (function (_super) {
        __extends(Traverse, _super);
        function Traverse(closed, node, children) {
            var _this = _super.call(this, true, node, children) || this;
            _this.closed = closed;
            return _this;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Traverse.prototype.getPath = function (context) {
            if (!this.element.hasAttribute('points') || this.element.getAttribute('points') === '') {
                return null;
            }
            // @ts-ignore
            var points = Traverse.parsePointsString(this.element.getAttribute('points'));
            var path = new Path();
            if (points.length < 1) {
                return path;
            }
            path.moveTo(points[0][0], points[0][1]);
            for (var i = 1; i < points.length; i++) {
                path.lineTo(points[i][0], points[i][1]);
            }
            if (this.closed) {
                path.close();
            }
            return path;
        };
        Traverse.prototype.isVisible = function (parentVisible, context) {
            return svgNodeIsVisible(this, parentVisible, context);
        };
        Traverse.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        Traverse.parsePointsString = function (string) {
            var floats = parseFloats(string);
            var result = [];
            for (var i = 0; i < floats.length - 1; i += 2) {
                var x = floats[i];
                var y = floats[i + 1];
                result.push([x, y]);
            }
            return result;
        };
        return Traverse;
    }(GeometryNode));

    var Polygon = /** @class */ (function (_super) {
        __extends(Polygon, _super);
        function Polygon(node, children) {
            return _super.call(this, true, node, children) || this;
        }
        return Polygon;
    }(Traverse));

    var VoidNode = /** @class */ (function (_super) {
        __extends(VoidNode, _super);
        function VoidNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        VoidNode.prototype.render = function (parentContext) {
            return Promise.resolve();
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        VoidNode.prototype.getBoundingBoxCore = function (context) {
            return [0, 0, 0, 0];
        };
        VoidNode.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        VoidNode.prototype.isVisible = function (parentVisible, context) {
            return svgNodeIsVisible(this, parentVisible, context);
        };
        return VoidNode;
    }(SvgNode));

    var MarkerNode = /** @class */ (function (_super) {
        __extends(MarkerNode, _super);
        function MarkerNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        MarkerNode.prototype.apply = function (parentContext) {
            return __awaiter(this, void 0, void 0, function () {
                var tfMatrix, bBox, childContext, _i, _a, child;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            tfMatrix = this.computeNodeTransform(parentContext);
                            bBox = this.getBoundingBox(parentContext);
                            parentContext.pdf.beginFormObject(bBox[0], bBox[1], bBox[2], bBox[3], tfMatrix);
                            childContext = new Context(parentContext.pdf, {
                                refsHandler: parentContext.refsHandler,
                                styleSheets: parentContext.styleSheets,
                                viewport: parentContext.viewport,
                                svg2pdfParameters: parentContext.svg2pdfParameters
                            });
                            // "Properties do not inherit from the element referencing the 'marker' into the contents of the
                            // marker. However, by using the context-stroke value for the fill or stroke on elements in its
                            // definition, a single marker can be designed to match the style of the element referencing the
                            // marker."
                            // -> we need to reset all attributes
                            applyContext(childContext);
                            _i = 0, _a = this.children;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            child = _a[_i];
                            return [4 /*yield*/, child.render(childContext)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            parentContext.pdf.endFormObject(this.element.getAttribute('id'));
                            return [2 /*return*/];
                    }
                });
            });
        };
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        MarkerNode.prototype.getBoundingBoxCore = function (context) {
            var viewBox = this.element.getAttribute('viewBox');
            var vb;
            if (viewBox) {
                vb = parseFloats(viewBox);
            }
            return [
                (vb && vb[0]) || 0,
                (vb && vb[1]) || 0,
                (vb && vb[2]) || parseFloat(this.element.getAttribute('markerWidth') || '3'),
                (vb && vb[3]) || parseFloat(this.element.getAttribute('markerHeight') || '3')
            ];
        };
        MarkerNode.prototype.computeNodeTransformCore = function (context) {
            var refX = parseFloat(this.element.getAttribute('refX') || '0');
            var refY = parseFloat(this.element.getAttribute('refY') || '0');
            var viewBox = this.element.getAttribute('viewBox');
            var nodeTransform;
            if (viewBox) {
                var bounds = parseFloats(viewBox);
                // "Markers are drawn such that their reference point (i.e., attributes ‘refX’ and ‘refY’)
                // is positioned at the given vertex." - The "translate" part of the viewBox transform is
                // ignored.
                nodeTransform = computeViewBoxTransform(this.element, bounds, 0, 0, parseFloat(this.element.getAttribute('markerWidth') || '3'), parseFloat(this.element.getAttribute('markerHeight') || '3'), context, true);
                nodeTransform = context.pdf.matrixMult(context.pdf.Matrix(1, 0, 0, 1, -refX, -refY), nodeTransform);
            }
            else {
                nodeTransform = context.pdf.Matrix(1, 0, 0, 1, -refX, -refY);
            }
            return nodeTransform;
        };
        MarkerNode.prototype.isVisible = function (parentVisible, context) {
            return svgNodeAndChildrenVisible(this, parentVisible, context);
        };
        return MarkerNode;
    }(NonRenderedNode));

    var Circle = /** @class */ (function (_super) {
        __extends(Circle, _super);
        function Circle(node, children) {
            return _super.call(this, node, children) || this;
        }
        Circle.prototype.getR = function (context) {
            var _a;
            return ((_a = this.r) !== null && _a !== void 0 ? _a : (this.r = parseFloat(getAttribute(this.element, context.styleSheets, 'r') || '0')));
        };
        Circle.prototype.getRx = function (context) {
            return this.getR(context);
        };
        Circle.prototype.getRy = function (context) {
            return this.getR(context);
        };
        return Circle;
    }(EllipseBase));

    var Polyline = /** @class */ (function (_super) {
        __extends(Polyline, _super);
        function Polyline(node, children) {
            return _super.call(this, false, node, children) || this;
        }
        return Polyline;
    }(Traverse));

    var ContainerNode = /** @class */ (function (_super) {
        __extends(ContainerNode, _super);
        function ContainerNode() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ContainerNode.prototype.renderCore = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var _i, _a, child;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _i = 0, _a = this.children;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            child = _a[_i];
                            return [4 /*yield*/, child.render(context)];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4: return [2 /*return*/];
                    }
                });
            });
        };
        ContainerNode.prototype.getBoundingBoxCore = function (context) {
            return getBoundingBoxByChildren(context, this);
        };
        return ContainerNode;
    }(RenderedNode));

    var Svg = /** @class */ (function (_super) {
        __extends(Svg, _super);
        function Svg() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Svg.prototype.isVisible = function (parentVisible, context) {
            return svgNodeAndChildrenVisible(this, parentVisible, context);
        };
        Svg.prototype.render = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var x, y, width, height, transform;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.isVisible(context.attributeState.visibility !== 'hidden', context)) {
                                return [2 /*return*/];
                            }
                            x = this.getX(context);
                            y = this.getY(context);
                            width = this.getWidth(context);
                            height = this.getHeight(context);
                            context.pdf.saveGraphicsState();
                            transform = context.transform;
                            if (this.element.hasAttribute('transform')) {
                                // SVG 2 allows transforms on SVG elements
                                // "The transform should be applied as if the ‘svg’ had a parent element with that transform set."
                                transform = context.pdf.matrixMult(
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                parseTransform(this.element.getAttribute('transform'), context), transform);
                            }
                            context.pdf.setCurrentTransformationMatrix(transform);
                            if (!context.withinUse &&
                                getAttribute(this.element, context.styleSheets, 'overflow') !== 'visible') {
                                // establish a new viewport
                                context.pdf
                                    .rect(x, y, width, height)
                                    .clip()
                                    .discardPath();
                            }
                            return [4 /*yield*/, _super.prototype.render.call(this, context.clone({
                                    transform: context.pdf.unitMatrix,
                                    viewport: context.withinUse ? context.viewport : new Viewport(width, height)
                                }))];
                        case 1:
                            _a.sent();
                            context.pdf.restoreGraphicsState();
                            return [2 /*return*/];
                    }
                });
            });
        };
        Svg.prototype.computeNodeTransform = function (context) {
            return this.computeNodeTransformCore(context);
        };
        Svg.prototype.computeNodeTransformCore = function (context) {
            if (context.withinUse) {
                return context.pdf.unitMatrix;
            }
            var x = this.getX(context);
            var y = this.getY(context);
            var viewBox = this.getViewBox();
            var nodeTransform;
            if (viewBox) {
                var width = this.getWidth(context);
                var height = this.getHeight(context);
                nodeTransform = computeViewBoxTransform(this.element, viewBox, x, y, width, height, context);
            }
            else {
                nodeTransform = context.pdf.Matrix(1, 0, 0, 1, x, y);
            }
            return nodeTransform;
        };
        Svg.prototype.getWidth = function (context) {
            if (this.width !== undefined) {
                return this.width;
            }
            var width;
            var parameters = context.svg2pdfParameters;
            if (this.isOutermostSvg(context)) {
                // special treatment for the outermost SVG element
                if (parameters.width != null) {
                    // if there is a user defined width, use it
                    width = parameters.width;
                }
                else {
                    // otherwise check if the SVG element defines the width itself
                    var widthAttr = getAttribute(this.element, context.styleSheets, 'width');
                    if (widthAttr) {
                        width = parseFloat(widthAttr);
                    }
                    else {
                        // if not, check if we can figure out the aspect ratio from the viewBox attribute
                        var viewBox = this.getViewBox();
                        if (viewBox &&
                            (parameters.height != null || getAttribute(this.element, context.styleSheets, 'height'))) {
                            // if there is a viewBox and the height is defined, use the width that matches the height together with the aspect ratio
                            var aspectRatio = viewBox[2] / viewBox[3];
                            width = this.getHeight(context) * aspectRatio;
                        }
                        else {
                            // if there is no viewBox use a default of 300 or the largest size that fits into the outer viewport
                            // at an aspect ratio of 2:1
                            width = Math.min(300, context.viewport.width, context.viewport.height * 2);
                        }
                    }
                }
            }
            else {
                var widthAttr = getAttribute(this.element, context.styleSheets, 'width');
                width = widthAttr ? parseFloat(widthAttr) : context.viewport.width;
            }
            return (this.width = width);
        };
        Svg.prototype.getHeight = function (context) {
            if (this.height !== undefined) {
                return this.height;
            }
            var height;
            var parameters = context.svg2pdfParameters;
            if (this.isOutermostSvg(context)) {
                // special treatment for the outermost SVG element
                if (parameters.height != null) {
                    // if there is a user defined height, use it
                    height = parameters.height;
                }
                else {
                    // otherwise check if the SVG element defines the height itself
                    var heightAttr = getAttribute(this.element, context.styleSheets, 'height');
                    if (heightAttr) {
                        height = parseFloat(heightAttr);
                    }
                    else {
                        // if not, check if we can figure out the aspect ratio from the viewBox attribute
                        var viewBox = this.getViewBox();
                        if (viewBox) {
                            // if there is a viewBox, use the height that matches the width together with the aspect ratio
                            var aspectRatio = viewBox[2] / viewBox[3];
                            height = this.getWidth(context) / aspectRatio;
                        }
                        else {
                            // if there is no viewBox use a default of 150 or the largest size that fits into the outer viewport
                            // at an aspect ratio of 2:1
                            height = Math.min(150, context.viewport.width / 2, context.viewport.height);
                        }
                    }
                }
            }
            else {
                var heightAttr = getAttribute(this.element, context.styleSheets, 'height');
                height = heightAttr ? parseFloat(heightAttr) : context.viewport.height;
            }
            return (this.height = height);
        };
        Svg.prototype.getX = function (context) {
            if (this.x !== undefined) {
                return this.x;
            }
            if (this.isOutermostSvg(context)) {
                return (this.x = 0);
            }
            var xAttr = getAttribute(this.element, context.styleSheets, 'x');
            return (this.x = xAttr ? parseFloat(xAttr) : 0);
        };
        Svg.prototype.getY = function (context) {
            if (this.y !== undefined) {
                return this.y;
            }
            if (this.isOutermostSvg(context)) {
                return (this.y = 0);
            }
            var yAttr = getAttribute(this.element, context.styleSheets, 'y');
            return (this.y = yAttr ? parseFloat(yAttr) : 0);
        };
        Svg.prototype.getViewBox = function () {
            if (this.viewBox !== undefined) {
                return this.viewBox;
            }
            var viewBox = this.element.getAttribute('viewBox');
            return (this.viewBox = viewBox ? parseFloats(viewBox) : undefined);
        };
        Svg.prototype.isOutermostSvg = function (context) {
            return context.svg2pdfParameters.element === this.element;
        };
        return Svg;
    }(ContainerNode));

    var Group = /** @class */ (function (_super) {
        __extends(Group, _super);
        function Group() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        Group.prototype.isVisible = function (parentVisible, context) {
            return svgNodeAndChildrenVisible(this, parentVisible, context);
        };
        Group.prototype.computeNodeTransformCore = function (context) {
            return context.pdf.unitMatrix;
        };
        return Group;
    }(ContainerNode));

    var ClipPath = /** @class */ (function (_super) {
        __extends(ClipPath, _super);
        function ClipPath() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ClipPath.prototype.apply = function (context) {
            return __awaiter(this, void 0, void 0, function () {
                var clipPathMatrix, _i, _a, child;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!this.isVisible(true, context)) {
                                return [2 /*return*/];
                            }
                            clipPathMatrix = context.pdf.matrixMult(this.computeNodeTransform(context), context.transform);
                            context.pdf.setCurrentTransformationMatrix(clipPathMatrix);
                            _i = 0, _a = this.children;
                            _b.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 4];
                            child = _a[_i];
                            return [4 /*yield*/, child.render(new Context(context.pdf, {
                                    refsHandler: context.refsHandler,
                                    styleSheets: context.styleSheets,
                                    viewport: context.viewport,
                                    withinClipPath: true,
                                    svg2pdfParameters: context.svg2pdfParameters
                                }))];
                        case 2:
                            _b.sent();
                            _b.label = 3;
                        case 3:
                            _i++;
                            return [3 /*break*/, 1];
                        case 4:
                            context.pdf.clip().discardPath();
                            // as we cannot use restoreGraphicsState() to reset the transform (this would reset the clipping path, as well),
                            // we must append the inverse instead
                            context.pdf.setCurrentTransformationMatrix(clipPathMatrix.inversed());
                            return [2 /*return*/];
                    }
                });
            });
        };
        ClipPath.prototype.getBoundingBoxCore = function (context) {
            return getBoundingBoxByChildren(context, this);
        };
        ClipPath.prototype.isVisible = function (parentVisible, context) {
            return svgNodeAndChildrenVisible(this, parentVisible, context);
        };
        return ClipPath;
    }(NonRenderedNode));

    function parse$1(node, idMap) {
        var svgnode;
        var children = [];
        forEachChild(node, function (i, n) { return children.push(parse$1(n, idMap)); });
        switch (node.tagName.toLowerCase()) {
            case 'a':
            case 'g':
                svgnode = new Group(node, children);
                break;
            case 'circle':
                svgnode = new Circle(node, children);
                break;
            case 'clippath':
                svgnode = new ClipPath(node, children);
                break;
            case 'ellipse':
                svgnode = new Ellipse(node, children);
                break;
            case 'lineargradient':
                svgnode = new LinearGradient(node, children);
                break;
            case 'image':
                svgnode = new ImageNode(node, children);
                break;
            case 'line':
                svgnode = new Line(node, children);
                break;
            case 'marker':
                svgnode = new MarkerNode(node, children);
                break;
            case 'path':
                svgnode = new PathNode(node, children);
                break;
            case 'pattern':
                svgnode = new Pattern(node, children);
                break;
            case 'polygon':
                svgnode = new Polygon(node, children);
                break;
            case 'polyline':
                svgnode = new Polyline(node, children);
                break;
            case 'radialgradient':
                svgnode = new RadialGradient(node, children);
                break;
            case 'rect':
                svgnode = new Rect(node, children);
                break;
            case 'svg':
                svgnode = new Svg(node, children);
                break;
            case 'symbol':
                svgnode = new Symbol$1(node, children);
                break;
            case 'text':
                svgnode = new TextNode(node, children);
                break;
            case 'use':
                svgnode = new Use(node, children);
                break;
            default:
                svgnode = new VoidNode(node, children);
                break;
        }
        if (idMap != undefined && svgnode.element.hasAttribute('id')) {
            var id = cssesc_1(svgnode.element.id, { isIdentifier: true });
            idMap[id] = idMap[id] || svgnode;
        }
        svgnode.children.forEach(function (c) { return c.setParent(svgnode); });
        return svgnode;
    }

    // Calculate the specificity for a selector by dividing it into simple selectors and counting them

    /**
     * Calculates the specificity of CSS selectors
     * http://www.w3.org/TR/css3-selectors/#specificity
     *
     * Returns an object with the following properties:
     *  - selector: the input
     *  - specificity: e.g. 0,1,0,0
     *  - parts: array with details about each part of the selector that counts towards the specificity
     *  - specificityArray: e.g. [0, 1, 0, 0]
     */
    var calculateSingle = function(input) {
    	var selector = input,
    		findMatch,
    		typeCount = {
    			'a': 0,
    			'b': 0,
    			'c': 0
    		},
    		parts = [],
    		// The following regular expressions assume that selectors matching the preceding regular expressions have been removed
    		attributeRegex = /(\[[^\]]+\])/g,
    		idRegex = /(#[^\#\s\+>~\.\[:\)]+)/g,
    		classRegex = /(\.[^\s\+>~\.\[:\)]+)/g,
    		pseudoElementRegex = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi,
    		// A regex for pseudo classes with brackets - :nth-child(), :nth-last-child(), :nth-of-type(), :nth-last-type(), :lang()
    		// The negation psuedo class (:not) is filtered out because specificity is calculated on its argument
    		// :global and :local are filtered out - they look like psuedo classes but are an identifier for CSS Modules
    		pseudoClassWithBracketsRegex = /(:(?!not|global|local)[\w-]+\([^\)]*\))/gi,
    		// A regex for other pseudo classes, which don't have brackets
    		pseudoClassRegex = /(:(?!not|global|local)[^\s\+>~\.\[:]+)/g,
    		elementRegex = /([^\s\+>~\.\[:]+)/g;

    	// Find matches for a regular expression in a string and push their details to parts
    	// Type is "a" for IDs, "b" for classes, attributes and pseudo-classes and "c" for elements and pseudo-elements
    	findMatch = function(regex, type) {
    		var matches, i, len, match, index, length;
    		if (regex.test(selector)) {
    			matches = selector.match(regex);
    			for (i = 0, len = matches.length; i < len; i += 1) {
    				typeCount[type] += 1;
    				match = matches[i];
    				index = selector.indexOf(match);
    				length = match.length;
    				parts.push({
    					selector: input.substr(index, length),
    					type: type,
    					index: index,
    					length: length
    				});
    				// Replace this simple selector with whitespace so it won't be counted in further simple selectors
    				selector = selector.replace(match, Array(length + 1).join(' '));
    			}
    		}
    	};

    	// Replace escaped characters with plain text, using the "A" character
    	// https://www.w3.org/TR/CSS21/syndata.html#characters
    	(function() {
    		var replaceWithPlainText = function(regex) {
    				var matches, i, len, match;
    				if (regex.test(selector)) {
    					matches = selector.match(regex);
    					for (i = 0, len = matches.length; i < len; i += 1) {
    						match = matches[i];
    						selector = selector.replace(match, Array(match.length + 1).join('A'));
    					}
    				}
    			},
    			// Matches a backslash followed by six hexadecimal digits followed by an optional single whitespace character
    			escapeHexadecimalRegex = /\\[0-9A-Fa-f]{6}\s?/g,
    			// Matches a backslash followed by fewer than six hexadecimal digits followed by a mandatory single whitespace character
    			escapeHexadecimalRegex2 = /\\[0-9A-Fa-f]{1,5}\s/g,
    			// Matches a backslash followed by any character
    			escapeSpecialCharacter = /\\./g;

    		replaceWithPlainText(escapeHexadecimalRegex);
    		replaceWithPlainText(escapeHexadecimalRegex2);
    		replaceWithPlainText(escapeSpecialCharacter);
    	}());

    	// Remove anything after a left brace in case a user has pasted in a rule, not just a selector
    	(function() {
    		var regex = /{[^]*/gm,
    			matches, i, len, match;
    		if (regex.test(selector)) {
    			matches = selector.match(regex);
    			for (i = 0, len = matches.length; i < len; i += 1) {
    				match = matches[i];
    				selector = selector.replace(match, Array(match.length + 1).join(' '));
    			}
    		}
    	}());

    	// Add attribute selectors to parts collection (type b)
    	findMatch(attributeRegex, 'b');

    	// Add ID selectors to parts collection (type a)
    	findMatch(idRegex, 'a');

    	// Add class selectors to parts collection (type b)
    	findMatch(classRegex, 'b');

    	// Add pseudo-element selectors to parts collection (type c)
    	findMatch(pseudoElementRegex, 'c');

    	// Add pseudo-class selectors to parts collection (type b)
    	findMatch(pseudoClassWithBracketsRegex, 'b');
    	findMatch(pseudoClassRegex, 'b');

    	// Remove universal selector and separator characters
    	selector = selector.replace(/[\*\s\+>~]/g, ' ');

    	// Remove any stray dots or hashes which aren't attached to words
    	// These may be present if the user is live-editing this selector
    	selector = selector.replace(/[#\.]/g, ' ');

    	// Remove the negation psuedo-class (:not) but leave its argument because specificity is calculated on its argument
     	// Remove non-standard :local and :global CSS Module identifiers because they do not effect the specificity
    	selector = selector.replace(/:not/g, '    ');
    	selector = selector.replace(/:local/g, '      ');
    	selector = selector.replace(/:global/g, '       ');
    	selector = selector.replace(/[\(\)]/g, ' ');

    	// The only things left should be element selectors (type c)
    	findMatch(elementRegex, 'c');

    	// Order the parts in the order they appear in the original selector
    	// This is neater for external apps to deal with
    	parts.sort(function(a, b) {
    		return a.index - b.index;
    	});

    	return {
    		selector: input,
    		specificity: '0,' + typeCount.a.toString() + ',' + typeCount.b.toString() + ',' + typeCount.c.toString(),
    		specificityArray: [0, typeCount.a, typeCount.b, typeCount.c],
    		parts: parts
    	};
    };

    /**
     * Compares two CSS selectors for specificity
     * Alternatively you can replace one of the CSS selectors with a specificity array
     *
     *  - it returns -1 if a has a lower specificity than b
     *  - it returns 1 if a has a higher specificity than b
     *  - it returns 0 if a has the same specificity than b
     */
    var compare = function(a, b) {
    	var aSpecificity,
    		bSpecificity,
    		i;

    	if (typeof a ==='string') {
    		if (a.indexOf(',') !== -1) {
    			throw 'Invalid CSS selector';
    		} else {
    			aSpecificity = calculateSingle(a)['specificityArray'];
    		}
    	} else if (Array.isArray(a)) {
    		if (a.filter(function(e) { return (typeof e === 'number'); }).length !== 4) {
    			throw 'Invalid specificity array';
    		} else {
    			aSpecificity = a;
    		}
    	} else {
    		throw 'Invalid CSS selector or specificity array';
    	}

    	if (typeof b ==='string') {
    		if (b.indexOf(',') !== -1) {
    			throw 'Invalid CSS selector';
    		} else {
    			bSpecificity = calculateSingle(b)['specificityArray'];
    		}
    	} else if (Array.isArray(b)) {
    		if (b.filter(function(e) { return (typeof e === 'number'); }).length !== 4) {
    			throw 'Invalid specificity array';
    		} else {
    			bSpecificity = b;
    		}
    	} else {
    		throw 'Invalid CSS selector or specificity array';
    	}

    	for (i = 0; i < 4; i += 1) {
    		if (aSpecificity[i] < bSpecificity[i]) {
    			return -1;
    		} else if (aSpecificity[i] > bSpecificity[i]) {
    			return 1;
    		}
    	}

    	return 0;
    };

    var StyleSheets = /** @class */ (function () {
        function StyleSheets(rootSvg, loadExtSheets) {
            this.rootSvg = rootSvg;
            this.loadExternalSheets = loadExtSheets;
            this.styleSheets = [];
        }
        StyleSheets.prototype.load = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sheetTexts;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.collectStyleSheetTexts()];
                        case 1:
                            sheetTexts = _a.sent();
                            this.parseCssSheets(sheetTexts);
                            return [2 /*return*/];
                    }
                });
            });
        };
        StyleSheets.prototype.collectStyleSheetTexts = function () {
            return __awaiter(this, void 0, void 0, function () {
                var sheetTexts, i, node, styleElements, i, styleElement;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            sheetTexts = [];
                            if (this.loadExternalSheets && this.rootSvg.ownerDocument) {
                                for (i = 0; i < this.rootSvg.ownerDocument.childNodes.length; i++) {
                                    node = this.rootSvg.ownerDocument.childNodes[i];
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-ignore
                                    if (node.nodeName === 'xml-stylesheet' && typeof node.data === 'string') {
                                        sheetTexts.push(StyleSheets.loadSheet(
                                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                        // @ts-ignore
                                        node.data
                                            .match(/href=["'].*?["']/)[0]
                                            .split('=')[1]
                                            .slice(1, -1)));
                                    }
                                }
                            }
                            styleElements = this.rootSvg.querySelectorAll('style,link');
                            for (i = 0; i < styleElements.length; i++) {
                                styleElement = styleElements[i];
                                if (nodeIs(styleElement, 'style')) {
                                    sheetTexts.push(styleElement.textContent);
                                }
                                else if (this.loadExternalSheets &&
                                    nodeIs(styleElement, 'link') &&
                                    styleElement.getAttribute('rel') === 'stylesheet' &&
                                    styleElement.hasAttribute('href')) {
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    sheetTexts.push(StyleSheets.loadSheet(styleElement.getAttribute('href')));
                                }
                            }
                            return [4 /*yield*/, Promise.all(sheetTexts)];
                        case 1: return [2 /*return*/, (_a.sent()).filter(function (sheet) { return sheet !== null; })];
                    }
                });
            });
        };
        StyleSheets.prototype.parseCssSheets = function (sheetTexts) {
            var styleDoc = document.implementation.createHTMLDocument('');
            for (var _i = 0, sheetTexts_1 = sheetTexts; _i < sheetTexts_1.length; _i++) {
                var sheetText = sheetTexts_1[_i];
                var style = styleDoc.createElement('style');
                style.textContent = sheetText;
                styleDoc.body.appendChild(style);
                var sheet = style.sheet;
                if (sheet instanceof CSSStyleSheet) {
                    for (var i = sheet.cssRules.length - 1; i >= 0; i--) {
                        var cssRule = sheet.cssRules[i];
                        if (!(cssRule instanceof CSSStyleRule)) {
                            sheet.deleteRule(i);
                            continue;
                        }
                        var cssStyleRule = cssRule;
                        if (cssStyleRule.selectorText.indexOf(',') >= 0) {
                            sheet.deleteRule(i);
                            var body = cssStyleRule.cssText.substring(cssStyleRule.selectorText.length);
                            var selectors = StyleSheets.splitSelectorAtCommas(cssStyleRule.selectorText);
                            for (var j = 0; j < selectors.length; j++) {
                                sheet.insertRule(selectors[j] + body, i + j);
                            }
                        }
                    }
                    this.styleSheets.push(sheet);
                }
            }
        };
        StyleSheets.splitSelectorAtCommas = function (selectorText) {
            var initialRegex = /,|["']/g;
            var closingDoubleQuotesRegex = /[^\\]["]/g;
            var closingSingleQuotesRegex = /[^\\][']/g;
            var parts = [];
            var state = 'initial';
            var match;
            var lastCommaIndex = -1;
            var closingQuotesRegex = closingDoubleQuotesRegex;
            for (var i = 0; i < selectorText.length;) {
                switch (state) {
                    case 'initial':
                        initialRegex.lastIndex = i;
                        match = initialRegex.exec(selectorText);
                        if (match) {
                            if (match[0] === ',') {
                                parts.push(selectorText.substring(lastCommaIndex + 1, initialRegex.lastIndex - 1).trim());
                                lastCommaIndex = initialRegex.lastIndex - 1;
                            }
                            else {
                                state = 'withinQuotes';
                                closingQuotesRegex =
                                    match[0] === '"' ? closingDoubleQuotesRegex : closingSingleQuotesRegex;
                            }
                            i = initialRegex.lastIndex;
                        }
                        else {
                            parts.push(selectorText.substring(lastCommaIndex + 1).trim());
                            i = selectorText.length;
                        }
                        break;
                    case 'withinQuotes':
                        closingQuotesRegex.lastIndex = i;
                        match = closingQuotesRegex.exec(selectorText);
                        if (match) {
                            i = closingQuotesRegex.lastIndex;
                            state = 'initial';
                        }
                        // else this is a syntax error - omit the last part...
                        break;
                }
            }
            return parts;
        };
        StyleSheets.loadSheet = function (url) {
            return (new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.open('GET', url, true);
                xhr.responseType = 'text';
                xhr.onload = function () {
                    if (xhr.status !== 200) {
                        reject(new Error("Error " + xhr.status + ": Failed to load '" + url + "'"));
                    }
                    resolve(xhr.responseText);
                };
                xhr.onerror = reject;
                xhr.onabort = reject;
                xhr.send(null);
            })
                // ignore the error since some stylesheets may not be accessible
                // due to CORS policies
                .catch(function () { return null; }));
        };
        StyleSheets.prototype.getPropertyValue = function (node, propertyCss) {
            var matchingRules = [];
            for (var _i = 0, _a = this.styleSheets; _i < _a.length; _i++) {
                var sheet = _a[_i];
                for (var i = 0; i < sheet.cssRules.length; i++) {
                    var rule = sheet.cssRules[i];
                    if (rule.style.getPropertyValue(propertyCss) && node.matches(rule.selectorText)) {
                        matchingRules.push(rule);
                    }
                }
            }
            if (matchingRules.length === 0) {
                return undefined;
            }
            var compare$1 = function (a, b) {
                var priorityA = a.style.getPropertyPriority(propertyCss);
                var priorityB = b.style.getPropertyPriority(propertyCss);
                if (priorityA !== priorityB) {
                    return priorityA === 'important' ? 1 : -1;
                }
                return compare(a.selectorText, b.selectorText);
            };
            var mostSpecificRule = matchingRules.reduce(function (previousValue, currentValue) {
                return compare$1(previousValue, currentValue) === 1 ? previousValue : currentValue;
            });
            return mostSpecificRule.style.getPropertyValue(propertyCss) || undefined;
        };
        return StyleSheets;
    }());

    function svg2pdf(element, pdf, options) {
        var _a, _b, _c;
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var x, y, extCss, idMap, refsHandler, styleSheets, viewport, svg2pdfParameters, context, fill, node;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        x = (_a = options.x) !== null && _a !== void 0 ? _a : 0.0;
                        y = (_b = options.y) !== null && _b !== void 0 ? _b : 0.0;
                        extCss = (_c = options.loadExternalStyleSheets) !== null && _c !== void 0 ? _c : false;
                        idMap = {};
                        refsHandler = new ReferencesHandler(idMap);
                        styleSheets = new StyleSheets(element, extCss);
                        return [4 /*yield*/, styleSheets.load()
                            // start with the entire page size as viewport
                        ];
                    case 1:
                        _d.sent();
                        viewport = new Viewport(pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
                        svg2pdfParameters = __assign(__assign({}, options), { element: element });
                        context = new Context(pdf, { refsHandler: refsHandler, styleSheets: styleSheets, viewport: viewport, svg2pdfParameters: svg2pdfParameters });
                        pdf.advancedAPI();
                        pdf.saveGraphicsState();
                        // set offsets
                        pdf.setCurrentTransformationMatrix(pdf.Matrix(1, 0, 0, 1, x, y));
                        // set default values that differ from pdf defaults
                        pdf.setLineWidth(context.attributeState.strokeWidth);
                        fill = context.attributeState.fill.color;
                        pdf.setFillColor(fill.r, fill.g, fill.b);
                        pdf.setFont(context.attributeState.fontFamily);
                        // correct for a jsPDF-instance measurement unit that differs from `pt`
                        pdf.setFontSize(context.attributeState.fontSize * pdf.internal.scaleFactor);
                        node = parse$1(element, idMap);
                        return [4 /*yield*/, node.render(context)];
                    case 2:
                        _d.sent();
                        pdf.restoreGraphicsState();
                        pdf.compatAPI();
                        context.textMeasure.cleanupTextMeasuring();
                        return [2 /*return*/, pdf];
                }
            });
        });
    }
    jsPDF.jsPDF.API.svg = function (element, options) {
        if (options === void 0) { options = {}; }
        return svg2pdf(element, this, options);
    };

    exports.svg2pdf = svg2pdf;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=svg2pdf.umd.js.map
