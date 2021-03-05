/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  Support for old IE browsers (6, 7 and 8) in Highcharts v6+.
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type { AlignValue } from '../../Core/Renderer/AlignObject';
import type ColorString from '../../Core/Color/ColorString';
import type ColorType from '../../Core/Color/ColorType';
import type CSSObject from '../../Core/Renderer/CSSObject';
import type GradientColor from '../../Core/Color/GradientColor';
import { HTMLDOMElement } from '../../Core/Renderer/DOMElementType';
import type HTMLElement from '../../Core/Renderer/HTML/HTMLElement';
import type HTMLRenderer from '../../Core/Renderer/HTML/HTMLRenderer';
import type PointerEvent from '../../Core/PointerEvent';
import type ShadowOptionsObject from '../../Core/Renderer/ShadowOptionsObject';
import type SizeObject from '../../Core/Renderer/SizeObject';
import type SVGPath from '../../Core/Renderer/SVG/SVGPath';
import Chart from '../../Core/Chart/Chart.js';
import Color from '../../Core/Color/Color.js';
const color = Color.parse;
import H from '../../Core/Globals.js';
const {
    deg2rad,
    doc,
    noop,
    svg,
    win
} = H;
import palette from '../../Core/Color/Palette.js';
import Pointer from '../../Core/Pointer.js';
import SVGElement from '../../Core/Renderer/SVG/SVGElement.js';
import SVGRenderer from '../../Core/Renderer/SVG/SVGRenderer3D.js';
import U from '../../Core/Utilities.js';
const {
    addEvent,
    createElement,
    css,
    defined,
    discardElement,
    erase,
    extend,
    extendClass,
    getOptions,
    isArray,
    isNumber,
    isObject,
    merge,
    offset,
    pick,
    pInt,
    setOptions,
    uniqueKey
} = U;
import VMLRenderer3D from './VMLRenderer3D.js';

declare module '../../Core/Chart/ChartLike'{
    interface ChartLike {
        /** @requires highcharts/modules/oldies */
        ieSanitizeSVG(svg: string): string;
        /** @requires highcharts/modules/oldies */
        isReadyToRender(): boolean;
    }
}

/**
 * Internal types
 * @private
 */
declare global {
    namespace Highcharts {
        interface EventCallbackFunction<T> {
            /** @requires highcharts/modules/oldies */
            hcKey?: string;
        }
        interface GlobalOptions {
            /** @requires highcharts/modules/oldies */
            VMLRadialGradientURL?: string;
        }
        interface SVGRenderer {
            /** @requires highcharts/modules/oldies */
            isVML?: boolean;
            /** @requires highcharts/modules/oldies */
            getSpanWidth(wrapper: SVGElement, tspan: HTMLDOMElement): number;
            /** @requires highcharts/modules/oldies */
            invertChild(
                element: HTMLDOMElement,
                parentNode: HTMLDOMElement
            ): void;
            /** @requires highcharts/modules/oldies */
            measureSpanWidth(text: string, style: CSSObject): number;
        }
        /** @requires highcharts/modules/oldies */
        interface VMLAttributes extends Record<string, any> {
            d?: VMLPathArray;
            end?: number;
            innerR?: number;
            r?: number;
            src?: string;
            start?: number;
        }
        /** @requires highcharts/modules/oldies */
        interface VMLClipRectObject extends VMLElement {
            count: number;
            height: number;
            left: number;
            members: Array<VMLElement>;
            top: number;
            width: number;
            getCSS(wrapper: VMLElement): CSSObject;
            updateClipping(): void;
        }
        /** @requires highcharts/modules/oldies */
        interface VMLDOMElement extends HTMLDOMElement {
            /** @deprecated */
            [attributeKey: string]: any;
            cutOff?: number;
            path?: VMLPathString;
            stroked?: boolean;
        }
        /** @requires highcharts/modules/oldies */
        interface VMLPathArray extends Array<(number|string)> {
            isArc?: boolean;
        }
        interface VMLPathString extends String {
            value?: string;
        }
        /** @requires highcharts/modules/oldies */
        class VMLElement {
            public added?: boolean;
            public alignOnAdd?: unknown; // @todo
            public className?: string;
            public d?: string;
            public deferUpdateTransform?: unknown; // @todo
            public destroyClip?: Function;
            public docMode8: boolean;
            public element: VMLDOMElement;
            public elemHeight?: number;
            public getBBox: SVGElement['getBBox'];
            public heightSetter: VMLElement['xSetter'];
            public inverted?: boolean;
            public isCircle?: boolean;
            public onAdd?: Function;
            public opacitySetter: Function;
            public parentGroup?: VMLElement;
            public r?: number;
            public renderer: VMLRenderer;
            public rotation?: number;
            public shadows?: Array<VMLDOMElement>;
            public 'stroke-opacitySetter': VMLElement['fill-opacitySetter'];
            public updateShadows: Function;
            public updateTransform: HTMLElement['htmlUpdateTransform'];
            public widthSetter: VMLElement['xSetter'];
            public xCorr?: number;
            public yCorr?: number;
            public ySetter: VMLElement['xSetter'];
            public add(parent?: VMLElement): VMLElement;
            public attr(attr?: VMLAttributes): VMLElement;
            public attr(key: string, val: string): VMLElement;
            public classGetter(): string;
            public classSetter(value: string): void;
            public clip(clipRect: VMLClipRectObject): VMLElement;
            public css(style: CSSObject): VMLElement;
            public cutOffPath(path: string, length: number): string;
            public dashstyleSetter(
                value: string,
                key: string,
                element: HTMLDOMElement
            ): void;
            public destroy(): void;
            public dSetter(
                value: VMLPathArray,
                key: string,
                element: HTMLDOMElement
            ): void;
            public 'fill-opacitySetter'(
                value: number,
                key: string,
                element: VMLDOMElement
            ): void;
            public fillGetter(): string;
            public fillSetter(
                value: string,
                key: string,
                element: VMLDOMElement
            ): void;
            public getAttr(key: string): (null|string);
            public getSpanCorrection(
                width: number,
                baseline: number,
                alignCorrection: number,
                rotation: number,
                align: AlignValue
            ): void;
            public init(
                renderer: VMLRenderer,
                nodeName: string
            ): void;
            public on(
                eventType: string,
                handler: Function
            ): VMLElement;
            public pathToVML(value: VMLPathArray): string;
            public rotationSetter(
                value: string,
                key: string,
                element: VMLDOMElement
            ): void;
            public safeRemoveChild(element: HTMLDOMElement): void;
            public setAttr(key: string, value: string): void;
            public setSpanRotation(): void;
            public shadow(
                shadowOptions: Partial<ShadowOptionsObject>,
                group: VMLElement,
                cutOff: boolean
            ): VMLElement;
            public strokeGetter(): string;
            public strokeSetter(
                value: string,
                key: string,
                element: VMLDOMElement
            ): void;
            public 'stroke-widthSetter'(
                value: string,
                key: string,
                element: VMLDOMElement
            ): void;
            public titleSetter(value: string, key: string): void;
            public updateClipping(): void;
            public visibilitySetter(
                value: string,
                key: string,
                element: VMLDOMElement
            ): void;
            public xSetter(
                value: string,
                key: string,
                element: VMLDOMElement
            ): void;
            public zIndexSetter(
                value: string,
                key: string,
                element: VMLDOMElement
            ): void;
        }
        /** @requires highcharts/modules/oldies */
        class VMLRenderer {
            public Element: typeof VMLElement;
            public alignedObjects: SVGRenderer['alignedObjects'];
            public box: HTMLDOMElement;
            public boxWrapper: VMLElement;
            public cache: SVGRenderer['cache'];
            public cacheKeys: SVGRenderer['cacheKeys'];
            public gradients: SVGRenderer['gradients'];
            public imgCount: number;
            public isIE8: boolean;
            public isVML: true;
            public setSize: SVGRenderer['setSize'];
            public symbols: SVGRenderer['symbols'];
            public circle(obj: Record<string, number>): VMLElement;
            public circle(x: number, y: number, r: number): VMLElement;
            public clipRect(size: SizeObject): VMLClipRectObject;
            public clipRect(
                x: number,
                y: number,
                width: number,
                height: number
            ): VMLClipRectObject;
            public color<T extends ColorType>(
                color: T,
                elem: VMLDOMElement,
                prop: string,
                wrapper: VMLElement
            ): T;
            public createElement(nodeName: string): VMLElement;
            public crispPolyLine(points: SVGPath, width: number): SVGPath;
            public g(name: string): VMLElement;
            public image(
                src: string,
                x: number,
                y: number,
                width: number,
                height: number
            ): VMLElement;
            public init(
                container: HTMLDOMElement,
                width: number,
                height: number
            ): void;
            public invertChild(
                element: HTMLDOMElement,
                parentNode: HTMLDOMElement
            ): void;
            public isHidden(): boolean;
            public path(path?: (VMLAttributes|VMLPathArray)): VMLElement;
            public prepVML(markup: Array<number|string>): string;
            public symbol(name: string): VMLElement;
            public text(str: string, x: number, y: number): HTMLElement;
        }
        /** @requires highcharts/modules/oldies */
        function addEventListenerPolyfill<T extends EventTarget>(
            this: T,
            type: string,
            fn: EventCallbackFunction<T>
        ): void;
        /** @requires highcharts/modules/oldies */
        function removeEventListenerPolyfill<T extends EventTarget> (
            this: T,
            type: string,
            fn: EventCallbackFunction<T>
        ): void;
    }
    interface CSSStyleSheet {
        /** @deprecated */
        cssText: string;
    }
    interface Document {
        /** @deprecated */
        documentMode?: number;
        /** @deprecated */
        namespaces?: TridentNamespaceCollection;
        /** @deprecated */
        createStyleSheet(url?: string, index?: number): CSSStyleSheet;
    }
    interface EventTarget {
        /** @requires highcharts/modules/oldies */
        hcEventsIE?: { [key: string]: (e: Event) => void };
        /** @deprecated */
        attachEvent(event: string, pDisp: Function): boolean;
        /** @deprecated */
        detachEvent(event: string, pDisp: Function): (number|true);
    }
    /** @deprecated */
    interface TridentNamespace {
        readonly name: string;
        onreadystatechange?: Function;
        readonly readyState: (
            'complete'|'interactive'|'loaded'|'loading'|'uninitialized'
        );
        readonly urn: string;
        attachEvent(evtName: string, fn: Function): boolean;
        detachEvent(evtName: string, fn: Function): void;
        doImport(url: string): void;
    }
    /** @deprecated */
    interface TridentNamespaceCollection {
        [key: string]: (Function|TridentNamespace);
        add(name: string, urn: string, url?: string): TridentNamespace;
        item(name: string): TridentNamespace;
    }
}

let VMLRenderer: typeof Highcharts.VMLRenderer,
    VMLElement: typeof Highcharts.VMLElement;

/**
 * Path to the pattern image required by VML browsers in order to
 * draw radial gradients.
 *
 * @type      {string}
 * @default   http://code.highcharts.com/{version}/gfx/vml-radial-gradient.png
 * @since     2.3.0
 * @requires  modules/oldie
 * @apioption global.VMLRadialGradientURL
 */
(getOptions().global as any).VMLRadialGradientURL =
    'http://code.highcharts.com/@product.version@/gfx/vml-radial-gradient.png';


// Utilites
if (doc && !doc.defaultView) {
    (H as any).getStyle = U.getStyle = function (
        el: HTMLDOMElement,
        prop: string
    ): number {
        var val: string,
            alias = ({
                width: 'clientWidth',
                height: 'clientHeight'
            } as Record<string, string>)[prop];

        if (el.style[prop as any]) {
            return pInt(el.style[prop as any]);
        }
        if (prop === 'opacity') {
            prop = 'filter';
        }

        // Getting the rendered width and height
        if (alias) {
            el.style.zoom = 1 as any;
            return Math.max(
                (el as any)[alias] - 2 * (U.getStyle(el, 'padding') as number),
                0
            );
        }

        val = (el.currentStyle as any)[prop.replace(
            /\-(\w)/g,
            function (a: string, b: string): string {
                return b.toUpperCase();
            }
        )];
        if (prop === 'filter') {
            val = val.replace(
                /alpha\(opacity=([0-9]+)\)/,
                function (a: string, b: string): string {
                    return ((b as any) / 100) as any;
                }
            );
        }

        return val === '' ? 1 : pInt(val);
    };
}

/* eslint-disable no-invalid-this, valid-jsdoc */

if (!svg) {

    // Prevent wrapping from creating false offsetWidths in export in legacy IE.
    // This applies only to charts for export, where IE runs the SVGRenderer
    // instead of the VMLRenderer
    // (#1079, #1063)
    addEvent(SVGElement, 'afterInit', function (
        this: SVGElement
    ): void {
        if (this.element.nodeName === 'text') {
            this.css({
                position: 'absolute'
            });
        }
    });

    /**
     * Old IE override for pointer normalize, adds chartX and chartY to event
     * arguments.
     *
     * @ignore
     * @function Highcharts.Pointer#normalize
     * @param {global.PointerEvent} e
     * @param {boolean} [chartPosition=false]
     * @return {Highcharts.PointerEventObject}
     */
    Pointer.prototype.normalize = function<T extends PointerEvent> (
        e: (T|MouseEvent|PointerEvent|TouchEvent),
        chartPosition?: Highcharts.ChartPositionObject
    ): T {

        e = e || win.event;
        if (!e.target) {
            (e as any).target = e.srcElement;
        }

        // Get mouse position
        if (!chartPosition) {
            this.chartPosition = chartPosition = this.getChartPosition();
        }

        return extend(e, {
            // #2005, #2129: the second case is for IE10 quirks mode within
            // framesets
            chartX: Math.round(Math.max((e as any).x, (e as any).clientX - chartPosition.left)),
            chartY: Math.round((e as any).y)
        }) as T;
    };

    /**
     * Further sanitize the mock-SVG that is generated when exporting charts in
     * oldIE.
     *
     * @private
     * @function Highcharts.Chart#ieSanitizeSVG
     */
    Chart.prototype.ieSanitizeSVG = function (svg: string): string {
        svg = svg
            .replace(/<IMG /g, '<image ')
            .replace(/<(\/?)TITLE>/g, '<$1title>')
            .replace(/height=([^" ]+)/g, 'height="$1"')
            .replace(/width=([^" ]+)/g, 'width="$1"')
            .replace(/hc-svg-href="([^"]+)">/g, 'xlink:href="$1"/>')
            .replace(/ id=([^" >]+)/g, ' id="$1"') // #4003
            .replace(/class=([^" >]+)/g, 'class="$1"')
            .replace(/ transform /g, ' ')
            .replace(/:(path|rect)/g, '$1')
            .replace(/style="([^"]+)"/g, function (s: string): string {
                return s.toLowerCase();
            });

        return svg;
    };

    /**
     * VML namespaces can't be added until after complete. Listening
     * for Perini's doScroll hack is not enough.
     *
     * @private
     * @function Highcharts.Chart#isReadyToRender
     */
    Chart.prototype.isReadyToRender = function (): boolean {
        var chart = this;

        // Note: win == win.top is required
        if (!svg &&
            (win == win.top && // eslint-disable-line eqeqeq
            doc.readyState !== 'complete')
        ) {
            doc.attachEvent('onreadystatechange', function (): void {
                doc.detachEvent('onreadystatechange', chart.firstRender);
                if (doc.readyState === 'complete') {
                    chart.firstRender();
                }
            });
            return false;
        }
        return true;
    };

    // IE compatibility hack for generating SVG content that it doesn't really
    // understand. Used by the exporting module.
    if (!doc.createElementNS) {
        doc.createElementNS = function (
            ns: string,
            tagName: string
        ): HTMLDOMElement {
            return doc.createElement(tagName);
        } as any;
    }

    /**
     * Old IE polyfill for addEventListener, called from inside the addEvent
     * function.
     *
     * @private
     * @function Highcharts.addEventListenerPolyfill<T>
     * @param {string} type
     * @param {Highcharts.EventCallbackFunction<T>} fn
     * @return {void}
     */
    H.addEventListenerPolyfill = function<T extends EventTarget> (
        this: T,
        type: string,
        fn: Highcharts.EventCallbackFunction<T>
    ): void {
        var el = this;

        /**
         * @private
         */
        function wrappedFn(e: Event): void {
            (e as any).target = e.srcElement || win; // #2820
            fn.call(el, e);
        }

        if (el.attachEvent) {
            if (!el.hcEventsIE) {
                el.hcEventsIE = {};
            }

            // unique function string (#6746)
            if (!fn.hcKey) {
                fn.hcKey = uniqueKey();
            }

            // Link wrapped fn with original fn, so we can get this in
            // removeEvent
            el.hcEventsIE[fn.hcKey] = wrappedFn;

            el.attachEvent('on' + type, wrappedFn);
        }

    };
    /**
     * @private
     * @function Highcharts.removeEventListenerPolyfill<T>
     * @param {string} type
     * @param {Highcharts.EventCallbackFunction<T>} fn
     * @return {void}
     */
    H.removeEventListenerPolyfill = function<T extends EventTarget> (
        this: T,
        type: string,
        fn: Highcharts.EventCallbackFunction<T>
    ): void {
        if (this.detachEvent) {
            fn = (this.hcEventsIE as any)[fn.hcKey as any];
            this.detachEvent('on' + type, fn);
        }
    };


    /**
     * The VML element wrapper.
     *
     * @private
     * @class
     * @name Highcharts.VMLElement
     *
     * @augments Highcharts.SVGElement
     */
    VMLElement = {

        docMode8: doc && doc.documentMode === 8,

        /**
         * Initialize a new VML element wrapper. It builds the markup as a
         * string to minimize DOM traffic.
         *
         * @function Highcharts.VMLElement#init
         * @param {Highcharts.VMLRenderer} renderer
         * @param {string} nodeName
         */
        init: function (
            this: Highcharts.VMLElement,
            renderer: Highcharts.VMLRenderer,
            nodeName: string
        ): void {
            var wrapper = this,
                markup = ['<', nodeName, ' filled="f" stroked="f"'],
                style = ['position: ', 'absolute', ';'],
                isDiv = nodeName === 'div';

            // divs and shapes need size
            if (nodeName === 'shape' || isDiv) {
                style.push('left:0;top:0;width:1px;height:1px;');
            }
            style.push('visibility: ', isDiv ? 'hidden' : 'visible');

            markup.push(' style="', style.join(''), '"/>');

            // create element with default attributes and style
            if (nodeName) {
                markup = isDiv || nodeName === 'span' || nodeName === 'img' ?
                    (markup.join('')as any) :
                    renderer.prepVML(markup);
                wrapper.element = createElement(markup as any);
            }

            wrapper.renderer = renderer;
        },

        /**
         * Add the node to the given parent
         *
         * @function Highcharts.VMLElement
         * @param {Highcharts.VMLElement} parent
         * @return {Highcharts.VMLElement}
         */
        add: function (
            this: Highcharts.VMLElement,
            parent: Highcharts.VMLElement
        ): Highcharts.VMLElement {
            var wrapper = this,
                renderer = wrapper.renderer,
                element = wrapper.element,
                box = renderer.box,
                inverted = parent && parent.inverted,

                // get the parent node
                parentNode = parent ?
                    parent.element || parent :
                    box;

            if (parent) {
                this.parentGroup = parent;
            }

            // if the parent group is inverted, apply inversion on all children
            if (inverted) { // only on groups
                renderer.invertChild(element, parentNode);
            }

            // append it
            parentNode.appendChild(element);

            // align text after adding to be able to read offset
            wrapper.added = true;
            if (wrapper.alignOnAdd && !wrapper.deferUpdateTransform) {
                wrapper.updateTransform();
            }

            // fire an event for internal hooks
            if (wrapper.onAdd) {
                wrapper.onAdd();
            }

            // IE8 Standards can't set the class name before the element is
            // appended
            if (this.className) {
                this.attr('class', this.className);
            }

            return wrapper;
        },

        /**
         * VML always uses htmlUpdateTransform
         *
         * @function Highcharts.VMLElement#updateTransform
         */
        updateTransform: SVGElement.prototype.htmlUpdateTransform as HTMLElement['htmlUpdateTransform'],

        /**
         * Set the rotation of a span with oldIE's filter
         *
         * @function Highcharts.VMLElement#setSpanRotation
         * @return {void}
         */
        setSpanRotation: function (this: Highcharts.VMLElement): void {
            // Adjust for alignment and rotation. Rotation of useHTML content is
            // not yet implemented but it can probably be implemented for
            // Firefox 3.5+ on user request. FF3.5+ has support for CSS3
            // transform. The getBBox method also needs to be updated to
            // compensate for the rotation, like it currently does for SVG.
            // Test case: https://jsfiddle.net/highcharts/Ybt44/

            var rotation = this.rotation,
                costheta = Math.cos((rotation as any) * deg2rad),
                sintheta = Math.sin((rotation as any) * deg2rad);

            css(this.element, {
                filter: rotation ? [
                    'progid:DXImageTransform.Microsoft.Matrix(M11=', costheta,
                    ', M12=', -sintheta, ', M21=', sintheta, ', M22=', costheta,
                    ', sizingMethod=\'auto expand\')'
                ].join('') : 'none'
            });
        },

        /**
         * Get the positioning correction for the span after rotating.
         *
         * @function Highcharts.VMLElement#getSpanCorrection
         */
        getSpanCorrection: function (
            this: Highcharts.VMLElement,
            width: number,
            baseline: number,
            alignCorrection: number,
            rotation: number,
            align: AlignValue
        ): void {

            var costheta = rotation ? Math.cos(rotation * deg2rad) : 1,
                sintheta = rotation ? Math.sin(rotation * deg2rad) : 0,
                height = pick(this.elemHeight, this.element.offsetHeight),
                quad,
                nonLeft = align && align !== 'left';

            // correct x and y
            this.xCorr = (costheta < 0 && -width) as any;
            this.yCorr = (sintheta < 0 && -height) as any;

            // correct for baseline and corners spilling out after rotation
            quad = costheta * sintheta < 0;
            (this.xCorr as any) += (
                sintheta *
                baseline *
                (quad ? 1 - alignCorrection : alignCorrection)
            );
            (this.yCorr as any) -= (
                costheta *
                baseline *
                (rotation ? (quad ? alignCorrection : 1 - alignCorrection) : 1)
            );
            // correct for the length/height of the text
            if (nonLeft) {
                (this.xCorr as any) -=
                    width * alignCorrection * (costheta < 0 ? -1 : 1);
                if (rotation) {
                    (this.yCorr as any) -= (
                        height *
                        alignCorrection *
                        (sintheta < 0 ? -1 : 1)
                    );
                }
                css(this.element, {
                    textAlign: align
                });
            }
        },

        /**
         * Converts a subset of an SVG path definition to its VML counterpart.
         * Takes an array as the parameter and returns a string.
         *
         * @function Highcharts.VMLElement#pathToVML
         */
        pathToVML: function (
            this: Highcharts.VMLElement,
            value: Highcharts.VMLPathArray
        ): string {
            // convert paths
            var i = value.length,
                path = [];

            while (i--) {

                // Multiply by 10 to allow subpixel precision.
                // Substracting half a pixel seems to make the coordinates
                // align with SVG, but this hasn't been tested thoroughly
                if (isNumber(value[i])) {
                    path[i] = Math.round((value[i] as any) * 10) - 5;
                } else if (value[i] === 'Z') { // close the path
                    path[i] = 'x';
                } else {
                    path[i] = value[i];

                    // When the start X and end X coordinates of an arc are too
                    // close, they are rounded to the same value above. In this
                    // case, substract or add 1 from the end X and Y positions.
                    // #186, #760, #1371, #1410.
                    if (
                        value.isArc &&
                        (value[i] === 'wa' || value[i] === 'at')
                    ) {
                        // Start and end X
                        if (path[i + 5] === path[i + 7]) {
                            (path as any)[i + 7] +=
                                value[i + 7] > value[i + 5] ? 1 : -1;
                        }
                        // Start and end Y
                        if (path[i + 6] === path[i + 8]) {
                            (path as any)[i + 8] +=
                                value[i + 8] > value[i + 6] ? 1 : -1;
                        }
                    }
                }
            }

            return path.join(' ') || 'x';
        },

        /**
         * Set the element's clipping to a predefined rectangle
         *
         * @function Highcharts.VMLElement#clip
         * @param {Highcharts.VMLClipRectObject} clipRect
         * @return {Highcharts.VMLElement}
         */
        clip: function (
            this: Highcharts.VMLElement,
            clipRect: Highcharts.VMLClipRectObject
        ): Highcharts.VMLElement {
            var wrapper = this,
                clipMembers: Array<Highcharts.VMLElement>,
                cssRet;

            if (clipRect) {
                clipMembers = clipRect.members;

                // Ensure unique list of elements (#1258)
                erase(clipMembers, wrapper);
                clipMembers.push(wrapper);
                wrapper.destroyClip = function (): void {
                    erase(clipMembers, wrapper);
                };
                cssRet = clipRect.getCSS(wrapper);

            } else {
                if (wrapper.destroyClip) {
                    wrapper.destroyClip();
                }
                cssRet = {
                    clip: wrapper.docMode8 ? 'inherit' : 'rect(auto)'
                }; // #1214
            }

            return wrapper.css(cssRet);

        },

        /**
         * Set styles for the element
         *
         * @function Highcharts.VMLElement#css
         * @param {Highcharts.CSSObject} styles
         * @return {Highcharts.VMLElement}
         */
        css: SVGElement.prototype.htmlCss as any,

        /**
         * Removes a child either by removeChild or move to garbageBin.
         * Issue 490; in VML removeChild results in Orphaned nodes according to
         * sIEve, discardElement does not.
         *
         * @function Highcharts.VMLElement#safeRemoveChild
         * @param {Highcharts.HTMLDOMElement} element
         * @return {void}
         */
        safeRemoveChild: function (
            this: Highcharts.VMLElement,
            element: HTMLDOMElement
        ): void {
            // discardElement will detach the node from its parent before
            // attaching it to the garbage bin. Therefore it is important that
            // the node is attached and have parent.
            if (element.parentNode) {
                discardElement(element);
            }
        },

        /**
         * Extend element.destroy by removing it from the clip members array
         *
         * @function Highcharts.VMLElement#destroy
         */
        destroy: function (this: Highcharts.VMLElement): void {
            if (this.destroyClip) {
                this.destroyClip();
            }

            return SVGElement.prototype.destroy.apply(this);
        },

        /**
         * Add an event listener. VML override for normalizing event parameters.
         *
         * @function Highcharts.VMLElement#on
         * @param {string} eventType
         * @param {Function} handler
         * @return {Highcharts.VMLElement}
         */
        on: function (
            this: Highcharts.VMLElement,
            eventType: string,
            handler: Highcharts.EventCallbackFunction<void>
        ): Highcharts.VMLElement {
            // simplest possible event model for internal use
            this.element['on' + eventType] = function (): void {
                var e = win.event as Event;

                (e.target as any) = e.srcElement;
                handler(e);
            };
            return this;
        },

        /**
         * In stacked columns, cut off the shadows so that they don't overlap
         *
         * @function Highcharts.VMLElement#cutOffPath
         * @param {string} path
         * @param {number} length
         * @return {string}
         */
        cutOffPath: function (
            this: Highcharts.VMLElement,
            path: string,
            length: number
        ): string {

            var len;

            // The extra comma tricks the trailing comma remover in
            // "gulp scripts" task
            path = path.split(/[ ,,]/) as any;
            len = path.length;

            if (len === 9 || len === 11) {
                (path[len - 4] as any) = (path[len - 2] as any) =
                    pInt(path[len - 2]) - 10 * length;
            }
            return (path as any).join(' ');
        },

        /**
         * Apply a drop shadow by copying elements and giving them different
         * strokes.
         *
         * @function Highcharts.VMLElement#shadow
         * @param {Highcharts.ShadowOptionsObject} shadowOptions
         * @param {Highcharts.VMLElement} group
         * @param {boolean} cutOff
         * @return {Highcharts.VMLElement}
         */
        shadow: function (
            this: Highcharts.VMLElement,
            shadowOptions: Partial<ShadowOptionsObject>,
            group: Highcharts.VMLElement,
            cutOff: boolean
        ): Highcharts.VMLElement {
            var shadows = [],
                i,
                element = this.element,
                renderer = this.renderer,
                shadow: Highcharts.VMLDOMElement,
                elemStyle = element.style,
                markup,
                path = element.path,
                strokeWidth,
                modifiedPath,
                shadowWidth,
                shadowElementOpacity;

            // some times empty paths are not strings
            if (path && typeof path.value !== 'string') {
                path = 'x';
            }
            modifiedPath = path;

            if (shadowOptions) {
                shadowWidth = pick(shadowOptions.width, 3);
                shadowElementOpacity =
                    (shadowOptions.opacity || 0.15) / shadowWidth;
                for (i = 1; i <= 3; i++) {

                    strokeWidth = (shadowWidth * 2) + 1 - (2 * i);

                    // Cut off shadows for stacked column items
                    if (cutOff) {
                        modifiedPath = this.cutOffPath(
                            (path as any).value,
                            strokeWidth + 0.5
                        );
                    }

                    markup = [
                        '<shape isShadow="true" strokeweight="', strokeWidth,
                        '" filled="false" path="', modifiedPath,
                        '" coordsize="10 10" style="', element.style.cssText,
                        '" />'
                    ];

                    shadow = createElement(
                        renderer.prepVML(markup as any),
                        null as any,
                        {
                            left: (pInt(elemStyle.left) +
                                pick(shadowOptions.offsetX, 1)) + 'px',
                            top: (pInt(elemStyle.top) +
                                pick(shadowOptions.offsetY, 1)) + 'px'
                        }
                    );
                    if (cutOff) {
                        shadow.cutOff = strokeWidth + 1;
                    }

                    // apply the opacity
                    markup = [
                        '<stroke color="',
                        shadowOptions.color || palette.neutralColor100,
                        '" opacity="', shadowElementOpacity * i, '"/>'];
                    createElement(
                        renderer.prepVML(markup),
                        null as any,
                        null as any,
                        shadow
                    );


                    // insert it
                    if (group) {
                        group.element.appendChild(shadow);
                    } else {
                        (element.parentNode as any)
                            .insertBefore(shadow, element);
                    }

                    // record it
                    shadows.push(shadow);

                }

                this.shadows = shadows;
            }
            return this;
        },
        updateShadows: noop, // Used in SVG only

        setAttr: function (
            this: Highcharts.VMLElement,
            key: string,
            value: string
        ): void {
            if (this.docMode8) { // IE8 setAttribute bug
                this.element[key] = value;
            } else {
                this.element.setAttribute(key, value);
            }
        },
        getAttr: function (
            this: Highcharts.VMLElement,
            key: string
        ): (null|string) {
            if (this.docMode8) { // IE8 setAttribute bug
                return this.element[key];
            }
            return this.element.getAttribute(key);
        },
        classSetter: function (
            this: Highcharts.VMLElement,
            value: string
        ): void {
            // IE8 Standards mode has problems retrieving the className unless
            // set like this. IE8 Standards can't set the class name before the
            // element is appended.
            (this.added ? this.element : this).className = value;
        },
        dashstyleSetter: function (
            this: Highcharts.VMLElement,
            value: string,
            key: string,
            element: HTMLDOMElement
        ): void {
            var strokeElem =
                element.getElementsByTagName('stroke')[0] as (
                    Highcharts.VMLDOMElement
                ) ||
                createElement(
                    this.renderer.prepVML(['<stroke/>']),
                    null as any,
                    null as any,
                    element
                );

            strokeElem[key] = value || 'solid';
            // Because changing stroke-width will change the dash length and
            // cause an epileptic effect
            (this as any)[key] = value;
        },
        dSetter: function (
            this: Highcharts.VMLElement,
            value: Highcharts.VMLPathArray,
            key: string,
            element: Highcharts.VMLDOMElement
        ): void {
            var i,
                shadows = this.shadows;

            value = value || [];
            // Used in getter for animation
            this.d = value.join && value.join(' ');

            element.path = (value as any) = this.pathToVML(value);

            // update shadows
            if (shadows) {
                i = shadows.length;
                while (i--) {
                    shadows[i].path = shadows[i].cutOff ?
                        this.cutOffPath(
                            value as any, shadows[i].cutOff as any
                        ) :
                        (value as any);
                }
            }
            this.setAttr(key, value as any);
        },
        fillSetter: function (
            this: Highcharts.VMLElement,
            value: string,
            key: string,
            element: Highcharts.VMLDOMElement
        ): void {
            var nodeName = element.nodeName;

            if (nodeName === 'SPAN') { // text color
                element.style.color = value;
            } else if (nodeName !== 'IMG') { // #1336
                element.filled = value !== 'none';
                this.setAttr(
                    'fillcolor',
                    this.renderer.color(value, element, key, this)
                );
            }
        },
        'fill-opacitySetter': function (
            this: Highcharts.VMLElement,
            value: number,
            key: string,
            element: Highcharts.VMLDOMElement
        ): void {
            createElement(
                this.renderer.prepVML(
                    ['<', key.split('-')[0], ' opacity="', value, '"/>']
                ),
                null as any,
                null as any,
                element
            );
        },
        // Don't bother - animation is too slow and filters introduce artifacts
        opacitySetter: noop,
        rotationSetter: function (
            this: Highcharts.VMLElement,
            value: string,
            key: string,
            element: Highcharts.VMLDOMElement
        ): void {
            var style = element.style;

            // style is for #1873:
            (this as any)[key] = style[key as any] = value;

            // Correction for the 1x1 size of the shape container. Used in gauge
            // needles.
            style.left =
                -Math.round(Math.sin((value as any) * deg2rad) + 1) + 'px';
            style.top =
                Math.round(Math.cos((value as any) * deg2rad)) + 'px';
        },
        strokeSetter: function (
            this: Highcharts.VMLElement,
            value: string,
            key: string,
            element: Highcharts.VMLDOMElement
        ): void {
            this.setAttr(
                'strokecolor',
                this.renderer.color(value, element, key, this)
            );
        },
        'stroke-widthSetter': function (
            this: Highcharts.VMLElement,
            value: (number|string),
            key: string,
            element: Highcharts.VMLDOMElement
        ): void {
            element.stroked = !!value; // VML "stroked" attribute
            (this as any)[key] = value; // used in getter, issue #113
            if (isNumber(value)) {
                value += 'px' as any;
            }
            this.setAttr('strokeweight', value as any);
        },
        titleSetter: function (
            this: Highcharts.VMLElement,
            value: string,
            key: string
        ): void {
            this.setAttr(key, value);
        },
        visibilitySetter: function (
            this: Highcharts.VMLElement,
            value: string,
            key: string,
            element: Highcharts.VMLDOMElement
        ): void {

            // Handle inherited visibility
            if (value === 'inherit') {
                value = 'visible';
            }

            // Let the shadow follow the main element
            if (this.shadows) {
                this.shadows.forEach(function (
                    shadow: Highcharts.VMLDOMElement
                ): void {
                    shadow.style[key as any] = value;
                });
            }

            // Instead of toggling the visibility CSS property, move the div out
            // of the viewport. This works around #61 and #586
            if (element.nodeName === 'DIV') {
                value = value === 'hidden' ? '-999em' : (0 as any);

                // In order to redraw, IE7 needs the div to be visible when
                // tucked away outside the viewport. So the visibility is
                // actually opposite of the expected value. This applies to the
                // tooltip only.
                if (!this.docMode8) {
                    element.style[key as any] = value ? 'visible' : 'hidden';
                }
                key = 'top';
            }
            element.style[key as any] = value;
        },
        xSetter: function (
            this: Highcharts.VMLElement,
            value: string,
            key: string,
            element: Highcharts.VMLDOMElement
        ): void {
            (this as any)[key] = value; // used in getter

            if (key === 'x') {
                key = 'left';
            } else if (key === 'y') {
                key = 'top';
            }

            // clipping rectangle special
            if (this.updateClipping) {
                // the key is now 'left' or 'top' for 'x' and 'y'
                (this as any)[key] = value;
                this.updateClipping();
            } else {
                // normal
                element.style[key as any] = value;
            }
        },
        zIndexSetter: function (
            this: Highcharts.VMLElement,
            value: string,
            key: string,
            element: Highcharts.VMLDOMElement
        ): void {
            element.style[key as any] = value;
        },
        fillGetter: function (this: Highcharts.VMLElement): string {
            return this.getAttr('fillcolor') || '';
        },
        strokeGetter: function (this: Highcharts.VMLElement): string {
            return this.getAttr('strokecolor') || '';
        },
        // #7850
        classGetter: function (this: Highcharts.VMLElement): string {
            return this.getAttr('className') || '';
        }
    } as any;
    (VMLElement as any)['stroke-opacitySetter'] =
        (VMLElement as any)['fill-opacitySetter'];
    H.VMLElement = VMLElement = extendClass(SVGElement, VMLElement);

    // Some shared setters
    VMLElement.prototype.ySetter =
        VMLElement.prototype.widthSetter =
        VMLElement.prototype.heightSetter =
        VMLElement.prototype.xSetter;


    /**
     * The VML renderer
     *
     * @private
     * @class
     * @name Highcharts.VMLRenderer
     *
     * @augments Highcharts.SVGRenderer
     */
    const VMLRendererExtension = { // inherit SVGRenderer

        Element: VMLElement,
        isIE8: win.navigator.userAgent.indexOf('MSIE 8.0') > -1,


        /**
         * Initialize the VMLRenderer.
         *
         * @function Highcharts.VMLRenderer#init
         * @param {Highcharts.HTMLDOMElement} container
         * @param {number} width
         * @param {number} height
         * @return {void}
         */
        init: function (
            this: Highcharts.VMLRenderer,
            container: HTMLDOMElement,
            width: number,
            height: number
        ): void {
            var renderer = this,
                boxWrapper,
                box,
                css;

            // Extended SVGRenderer member
            this.crispPolyLine = SVGRenderer.prototype.crispPolyLine;

            renderer.alignedObjects = [];

            boxWrapper = renderer.createElement('div')
                .css({ position: 'relative' });
            box = boxWrapper.element;
            container.appendChild(boxWrapper.element);


            // generate the containing box
            renderer.isVML = true;
            renderer.box = box;
            renderer.boxWrapper = boxWrapper;
            renderer.gradients = {};
            renderer.cache = {}; // Cache for numerical bounding boxes
            renderer.cacheKeys = [];
            renderer.imgCount = 0;


            renderer.setSize(width, height, false);

            // The only way to make IE6 and IE7 print is to use a global
            // namespace. However, with IE8 the only way to make the dynamic
            // shapes visible in screen and print mode seems to be to add the
            // xmlns attribute and the behaviour style inline.
            if (!(doc.namespaces as any).hcv) {

                (doc.namespaces as any).add(
                    'hcv', 'urn:schemas-microsoft-com:vml'
                );

                // Setup default CSS (#2153, #2368, #2384)
                css = 'hcv\\:fill, hcv\\:path, hcv\\:shape, hcv\\:stroke' +
                    '{ behavior:url(#default#VML); display: inline-block; } ';
                try {
                    doc.createStyleSheet().cssText = css;
                } catch (e) {
                    (doc.styleSheets[0] as any).cssText += css;
                }

            }
        },


        /**
         * Detect whether the renderer is hidden. This happens when one of the
         * parent elements has display: none
         *
         * @function Highcharts.VMLRenderer#isHidden
         */
        isHidden: function (this: Highcharts.VMLRenderer): boolean {
            return !this.box.offsetWidth;
        },

        /**
         * Define a clipping rectangle. In VML it is accomplished by storing the
         * values for setting the CSS style to all associated members.
         *
         * @function Highcharts.VMLRenderer#clipRect
         * @param {number|Highcharts.SizeObject} x
         * @param {number} y
         * @param {number} width
         * @param {number} height
         * @return {Highcharts.VMLElement}
         */
        clipRect: function (
            this: Highcharts.VMLRenderer,
            x: (number|SizeObject),
            y: number,
            width: number,
            height: number
        ): Highcharts.VMLClipRectObject {

            // create a dummy element
            var clipRect = (this.createElement as any)(),
                isObj = isObject(x);

            // mimic a rectangle with its style object for automatic updating in
            // attr
            return extend(clipRect, {
                members: [],
                count: 0,
                left: (isObj ? (x as any).x : x) + 1,
                top: (isObj ? (x as any).y : y) + 1,
                width: (isObj ? (x as any).width : width) - 1,
                height: (isObj ? (x as any).height : height) - 1,
                getCSS: function (
                    this: Highcharts.VMLClipRectObject,
                    wrapper: Highcharts.VMLElement
                ): CSSObject {
                    var element = wrapper.element,
                        nodeName = element.nodeName,
                        isShape = nodeName === 'shape',
                        inverted = wrapper.inverted,
                        rect = this,
                        top = rect.top - (isShape ? element.offsetTop : 0),
                        left = rect.left,
                        right = left + rect.width,
                        bottom = top + rect.height,
                        ret = {
                            clip: 'rect(' +
                                Math.round(inverted ? left : top) + 'px,' +
                                Math.round(inverted ? bottom : right) + 'px,' +
                                Math.round(inverted ? right : bottom) + 'px,' +
                                Math.round(inverted ? top : left) + 'px)'
                        };

                    // issue 74 workaround
                    if (!inverted && wrapper.docMode8 && nodeName === 'DIV') {
                        extend(ret, {
                            width: right + 'px',
                            height: bottom + 'px'
                        });
                    }
                    return ret;
                },

                // used in attr and animation to update the clipping of all
                // members
                updateClipping: function (this: Highcharts.VMLElement): void {
                    clipRect.members.forEach(function (
                        member: Highcharts.VMLElement
                    ): void {
                        // Member.element is falsy on deleted series, like in
                        // stock/members/series-remove demo. Should be removed
                        // from members, but this will do.
                        if (member.element) {
                            member.css(clipRect.getCSS(member));
                        }
                    });
                }
            });

        },


        /**
         * Take a color and return it if it's a string, make it a gradient if
         * it's a gradient configuration object, and apply opacity.
         *
         * @function Highcharts.VMLRenderer#color<T>
         *
         * @param {T} color
         *        The color or config object
         *
         * @return {T}
         */
        color: function<T extends ColorType> (
            this: Highcharts.VMLRenderer,
            colorOption: T,
            elem: Highcharts.VMLDOMElement,
            prop: string,
            wrapper: Highcharts.VMLElement
        ): T {
            var renderer = this,
                colorObject,
                regexRgba = /^rgba/,
                markup: Array<number|string>,
                fillType: ('gradient'|'pattern'|undefined),
                ret = 'none' as T;

            // Check for linear or radial gradient
            if (
                colorOption &&
                (colorOption as GradientColor).linearGradient
            ) {
                fillType = 'gradient';
            } else if (
                colorOption &&
                (colorOption as GradientColor).radialGradient
            ) {
                fillType = 'pattern';
            }


            if (fillType) {

                var stopColor: (ColorString|undefined),
                    stopOpacity: number,
                    gradient: (
                        GradientColor['linearGradient']|
                        GradientColor['radialGradient']
                    ) = (
                        (
                            colorOption as GradientColor
                        ).linearGradient ||
                        (
                            colorOption as GradientColor
                        ).radialGradient
                    ) as any,
                    x1,
                    y1,
                    x2,
                    y2,
                    opacity1: number,
                    opacity2: number,
                    color1: (ColorString|undefined),
                    color2: (ColorString|undefined),
                    fillAttr = '',
                    stops = (colorOption as GradientColor).stops,
                    firstStop,
                    lastStop,
                    colors: Array<ColorString> = [],
                    addFillNode = function (): void {
                        // Add the fill subnode. When colors attribute is used,
                        // the meanings of opacity and o:opacity2 are reversed.
                        markup = ['<fill colors="' + colors.join(',') +
                            '" opacity="', opacity2, '" o:opacity2="',
                        opacity1, '" type="', fillType as any, '" ', fillAttr,
                        'focus="100%" method="any" />'];
                        createElement(
                            renderer.prepVML(markup),
                            null as any,
                            null as any,
                            elem
                        );
                    };

                // Extend from 0 to 1
                firstStop = stops[0];
                lastStop = stops[stops.length - 1];
                if (firstStop[0] > 0) {
                    stops.unshift([
                        0,
                        firstStop[1]
                    ]);
                }
                if (lastStop[0] < 1) {
                    stops.push([
                        1,
                        lastStop[1]
                    ]);
                }

                // Compute the stops
                stops.forEach(function (
                    stop: GradientColor['stops'][0],
                    i: number
                ): void {
                    if (regexRgba.test(stop[1])) {
                        colorObject = color(stop[1]);
                        stopColor = colorObject.get('rgb') as any;
                        stopOpacity = colorObject.get('a') as any;
                    } else {
                        stopColor = stop[1];
                        stopOpacity = 1;
                    }

                    // Build the color attribute
                    colors.push((stop[0] * 100) + '% ' + stopColor);

                    // Only start and end opacities are allowed, so we use the
                    // first and the last
                    if (!i) {
                        opacity1 = stopOpacity as any;
                        color2 = stopColor;
                    } else {
                        opacity2 = stopOpacity as any;
                        color1 = stopColor;
                    }
                });

                // Apply the gradient to fills only.
                if (prop === 'fill') {

                    // Handle linear gradient angle
                    if (fillType === 'gradient') {
                        x1 = (gradient as any).x1 || (gradient as any)[0] || 0;
                        y1 = (gradient as any).y1 || (gradient as any)[1] || 0;
                        x2 = (gradient as any).x2 || (gradient as any)[2] || 0;
                        y2 = (gradient as any).y2 || (gradient as any)[3] || 0;
                        fillAttr = 'angle="' + (90 - Math.atan(
                            (y2 - y1) / // y vector
                            (x2 - x1) // x vector
                        ) * 180 / Math.PI) + '"';

                        addFillNode();

                    // Radial (circular) gradient
                    } else {

                        var r = (gradient as any).r,
                            sizex = r * 2,
                            sizey = r * 2,
                            cx = (gradient as any).cx,
                            cy = (gradient as any).cy,
                            radialReference = elem.radialReference,
                            bBox,
                            applyRadialGradient = function (): void {
                                if (radialReference) {
                                    bBox = wrapper.getBBox();
                                    cx += (radialReference[0] - bBox.x) /
                                        bBox.width - 0.5;
                                    cy += (radialReference[1] - bBox.y) /
                                        bBox.height - 0.5;
                                    sizex *= radialReference[2] / bBox.width;
                                    sizey *= radialReference[2] / bBox.height;
                                }
                                fillAttr =
                                    'src="' + (
                                        getOptions().global as any
                                    ).VMLRadialGradientURL +
                                    '" ' +
                                    'size="' + sizex + ',' + sizey + '" ' +
                                    'origin="0.5,0.5" ' +
                                    'position="' + cx + ',' + cy + '" ' +
                                    'color2="' + color2 + '" ';

                                addFillNode();
                            };

                        // Apply radial gradient
                        if (wrapper.added) {
                            applyRadialGradient();
                        } else {
                            // We need to know the bounding box to get the size
                            // and position right
                            wrapper.onAdd = applyRadialGradient;
                        }

                        // The fill element's color attribute is broken in IE8
                        // standards mode, so we need to set the parent shape's
                        // fillcolor attribute instead.
                        ret = color1 as any;
                    }

                // Gradients are not supported for VML stroke, return the first
                // color. #722.
                } else {
                    ret = stopColor as any;
                }

            // If the color is an rgba color, split it and add a fill node
            // to hold the opacity component
            } else if (regexRgba.test(colorOption as any) && elem.tagName !== 'IMG') {

                colorObject = color(colorOption);

                (wrapper as any)[prop + '-opacitySetter'](
                    colorObject.get('a'),
                    prop,
                    elem
                );

                ret = colorObject.get('rgb') as any;


            } else {
                // 'stroke' or 'fill' node
                var propNodes = elem.getElementsByTagName(prop) as any;

                if (propNodes.length) {
                    propNodes[0].opacity = 1;
                    propNodes[0].type = 'solid';
                }
                ret = colorOption;
            }

            return ret;
        },

        /**
         * Take a VML string and prepare it for either IE8 or IE6/IE7.
         *
         * @function Highcharts.VMLRenderer#prepVML
         *
         * @param {Array<(number|string)>} markup
         *        A string array of the VML markup to prepare
         *
         * @return {string}
         */
        prepVML: function (
            this: Highcharts.VMLRenderer,
            markup: Array<(number|string)>
        ): string {
            var vmlStyle = 'display:inline-block;behavior:url(#default#VML);',
                isIE8 = this.isIE8;

            markup = markup.join('') as any;

            if (isIE8) { // add xmlns and style inline
                markup = (markup as any).replace(
                    '/>',
                    ' xmlns="urn:schemas-microsoft-com:vml" />'
                );
                if (markup.indexOf('style="') === -1) {
                    markup = (markup as any).replace(
                        '/>',
                        ' style="' + vmlStyle + '" />'
                    );
                } else {
                    markup = (markup as any).replace(
                        'style="',
                        'style="' + vmlStyle
                    );
                }

            } else { // add namespace
                markup = (markup as any).replace('<', '<hcv:');
            }

            return markup as any;
        },

        /**
         * Create rotated and aligned text
         *
         * @function Highcharts.VMLRenderer#text
         *
         * @param {string} str
         *
         * @param {number} x
         *
         * @param {number} y
         */
        text: (SVGRenderer.prototype as HTMLRenderer).html,

        /**
         * Create and return a path element
         *
         * @function Highcharts.VMLRenderer#path
         *
         * @param {Highcharts.VMLAttributes|Highcharts.VMLPathArray} [path]
         */
        path: function (
            this: Highcharts.VMLRenderer,
            path?: (Highcharts.VMLAttributes|Highcharts.VMLPathArray)
        ): Highcharts.VMLElement {
            var attr = {
                // subpixel precision down to 0.1 (width and height = 1px)
                coordsize: '10 10'
            } as Highcharts.VMLAttributes;

            if (isArray(path)) {
                attr.d = path as any;
            } else if (isObject(path)) { // attributes
                extend(attr, path as any);
            }
            // create the shape
            return this.createElement('shape').attr(attr);
        },

        /**
         * Create and return a circle element. In VML circles are implemented as
         * shapes, which is faster than v:oval
         *
         * @function Highcharts.VMLRenderer#circle
         * @param {number|Highcharts.Dictionary<number>} x
         * @param {number} [y]
         * @param {number} [r]
         * @return {Highcharts.VMLElement}
         */
        circle: function (
            this: Highcharts.VMLRenderer,
            x: number,
            y?: number,
            r?: number
        ): Highcharts.VMLElement {
            var circle = this.symbol('circle');

            if (isObject(x)) {
                r = (x as any).r;
                y = (x as any).y;
                x = (x as any).x;
            }
            circle.isCircle = true; // Causes x and y to mean center (#1682)
            circle.r = r;
            return circle.attr({ x: x, y: y });
        },

        /**
         * Create a group using an outer div and an inner v:group to allow
         * rotating and flipping. A simple v:group would have problems with
         * positioning child HTML elements and CSS clip.
         *
         * @function Highcharts.VMLRenderer#g
         *
         * @param {string} name
         *        The name of the group
         *
         * @return {Highcharts.VMLElement}
         */
        g: function (
            this: Highcharts.VMLRenderer,
            name: string
        ): Highcharts.VMLElement {
            var wrapper,
                attribs: (Highcharts.VMLAttributes|undefined);

            // set the class name
            if (name) {
                attribs = {
                    'className': 'highcharts-' + name,
                    'class': 'highcharts-' + name
                };
            }

            // the div to hold HTML and clipping
            wrapper = this.createElement('div').attr(attribs);

            return wrapper;
        },

        /**
         * VML override to create a regular HTML image.
         *
         * @function Highcharts.VMLRenderer#image
         *
         * @param {string} src
         *
         * @param {number} x
         *
         * @param {number} y
         *
         * @param {number} width
         *
         * @param {number} height
         * @return {Highcharts.VMLElement}
         */
        image: function (
            this: Highcharts.VMLRenderer,
            src: string,
            x: number,
            y: number,
            width: number,
            height: number
        ): Highcharts.VMLElement {
            var obj = this.createElement('img').attr({ src: src });

            if (arguments.length > 1) {
                obj.attr({
                    x: x,
                    y: y,
                    width: width,
                    height: height
                });
            }
            return obj;
        },

        /**
         * For rectangles, VML uses a shape for rect to overcome bugs and
         * rotation problems
         *
         * @function Highcharts.VMLRenderer#createElement
         * @param {string} nodeName
         * @return {Highcharts.VMLElement}
         */
        createElement: function (
            this: Highcharts.VMLRenderer,
            nodeName: string
        ): Highcharts.VMLElement {
            return nodeName === 'rect' ?
                this.symbol(nodeName) :
                SVGRenderer.prototype.createElement.call(this, nodeName) as any;
        },

        /**
         * In the VML renderer, each child of an inverted div (group) is
         * inverted
         *
         * @function Highcharts.VMLRenderer#invertChild
         *
         * @param {Highcharts.HTMLDOMElement} element
         *
         * @param {Highcharts.HTMLDOMElement} parentNode
         */
        invertChild: function (
            this: Highcharts.VMLRenderer,
            element: HTMLDOMElement,
            parentNode: HTMLDOMElement
        ): void {
            var ren = this,
                parentStyle = parentNode.style,
                imgStyle = element.tagName === 'IMG' && element.style; // #1111

            css(element, {
                flip: 'x',
                left: (pInt(parentStyle.width) -
                    (imgStyle ? pInt(imgStyle.top) : 1)) + 'px',
                top: (pInt(parentStyle.height) -
                    (imgStyle ? pInt(imgStyle.left) : 1)) + 'px',
                rotation: -90
            });

            // Recursively invert child elements, needed for nested composite
            // shapes like box plots and error bars. #1680, #1806.
            [].forEach.call(element.childNodes, function (
                child: HTMLDOMElement
            ): void {
                ren.invertChild(child, element);
            });
        },

        /**
         * Symbol definitions that override the parent SVG renderer's symbols
         *
         * @name Highcharts.VMLRenderer#symbols
         * @type {Highcharts.Dictionary<Function>}
         */
        symbols: {
            // VML specific arc function
            arc: function (
                x: number,
                y: number,
                w: number,
                h: number,
                options: Highcharts.VMLAttributes
            ): Highcharts.VMLPathArray {
                var start = options.start as any,
                    end = options.end as any,
                    radius = options.r || w || h,
                    innerRadius = options.innerR as any,
                    cosStart = Math.cos(start),
                    sinStart = Math.sin(start),
                    cosEnd = Math.cos(end),
                    sinEnd = Math.sin(end),
                    ret: Highcharts.VMLPathArray;

                if (end - start === 0) { // no angle, don't show it.
                    return ['x'];
                }

                ret = [
                    'wa', // clockwise arc to
                    x - radius, // left
                    y - radius, // top
                    x + radius, // right
                    y + radius, // bottom
                    x + radius * cosStart, // start x
                    y + radius * sinStart, // start y
                    x + radius * cosEnd, // end x
                    y + radius * sinEnd // end y
                ];

                if (options.open && !innerRadius) {
                    ret.push(
                        'e',
                        'M',
                        x, // - innerRadius,
                        y // - innerRadius
                    );
                }

                ret.push(
                    'at', // anti clockwise arc to
                    x - innerRadius, // left
                    y - innerRadius, // top
                    x + innerRadius, // right
                    y + innerRadius, // bottom
                    x + innerRadius * cosEnd, // start x
                    y + innerRadius * sinEnd, // start y
                    x + innerRadius * cosStart, // end x
                    y + innerRadius * sinStart, // end y
                    'x', // finish path
                    'e' // close
                );

                ret.isArc = true;
                return ret;

            },
            // Add circle symbol path. This performs significantly faster than
            // v:oval.
            circle: function (
                x: number,
                y: number,
                w: number,
                h: number,
                wrapper: SVGElement
            ): Highcharts.VMLPathArray {

                if (wrapper && defined(wrapper.r)) {
                    w = h = 2 * (wrapper.r as any);
                }

                // Center correction, #1682
                if (wrapper && wrapper.isCircle) {
                    x -= w / 2;
                    y -= h / 2;
                }

                // Return the path
                return [
                    'wa', // clockwisearcto
                    x, // left
                    y, // top
                    x + w, // right
                    y + h, // bottom
                    x + w, // start x
                    y + h / 2, // start y
                    x + w, // end x
                    y + h / 2, // end y
                    'e' // close
                ];
            },
            /**
             * Add rectangle symbol path which eases rotation and omits arcsize
             * problems compared to the built-in VML roundrect shape. When
             * borders are not rounded, use the simpler square path, else use
             * the callout path without the arrow.
             */
            rect: function (
                x: number,
                y: number,
                w: number,
                h: number,
                options: Highcharts.SymbolOptionsObject
            ): SVGPath {
                return SVGRenderer.prototype.symbols[
                    !defined(options) || !options.r ? 'square' : 'callout'
                ].call(0, x, y, w, h, options);
            }
        }
    };
    H.VMLRenderer = VMLRenderer = function (
        this: Highcharts.VMLRenderer
    ): void {
        this.init.apply(this, arguments as any);
    } as any;
    extend(VMLRenderer.prototype, SVGRenderer.prototype);
    extend(VMLRenderer.prototype, VMLRendererExtension);

    // general renderer
    H.Renderer = VMLRenderer as any;

    // 3D additions
    VMLRenderer3D.compose(VMLRenderer, SVGRenderer);
}

SVGRenderer.prototype.getSpanWidth = function (
    this: SVGRenderer,
    wrapper: SVGElement,
    tspan: HTMLDOMElement
): number {
    var renderer = this,
        bBox = wrapper.getBBox(true),
        actualWidth = bBox.width;

    // Old IE cannot measure the actualWidth for SVG elements (#2314)
    if (!svg && renderer.forExport) {
        actualWidth = renderer.measureSpanWidth(
            (tspan.firstChild as any).data,
            wrapper.styles as any
        );
    }
    return actualWidth;
};

// This method is used with exporting in old IE, when emulating SVG (see #2314)
SVGRenderer.prototype.measureSpanWidth = function (
    this: SVGRenderer,
    text: string,
    styles: CSSObject
): number {
    var measuringSpan = doc.createElement('span'),
        offsetWidth,
        textNode = doc.createTextNode(text);

    measuringSpan.appendChild(textNode);
    css(measuringSpan, styles);
    this.box.appendChild(measuringSpan);
    offsetWidth = measuringSpan.offsetWidth;
    discardElement(measuringSpan); // #2463
    return offsetWidth;
};
