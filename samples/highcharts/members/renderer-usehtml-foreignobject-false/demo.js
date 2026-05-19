/**
 * Highcharts plugin to use HTML labels without foreignObject like prior to v13.
 */
(({
    attr,
    createElement,
    css,
    defined,
    Exporting,
    getAlignFactor,
    isNumber,
    HTMLElement,
    SVGElement,
    SVGRenderer,
    wrap
}) => {

    /**
     * The opacity and visibility properties are set as attributes on the main
     * element and SVG groups, and as identical CSS properties on the HTML
     * element and the ancestry divs. (#3542)
     *
     * @private
     */
    function commonSetter(
        value,
        key,
        elem
    ) {
        const style = this.div?.style;
        SVGElement.prototype[`${key}Setter`].call(this, value, key, elem);
        if (style) {
            elem.style[key] = style[key] = value;
        }
    }

    /**
     * Decorate each SVG group in the ancestry line. Each SVG `g` element that
     * contains children with useHTML, will receive a `div` element counterpart
     * to contain the HTML span. These div elements are translated and styled
     * like original `g` counterparts.
     */
    const decorateSVGGroup = (g, container) => {
        if (!g.div) {
            const className = attr(g.element, 'class'),
                cssProto = g.css;

            // Create the parallel HTML group
            const div = createElement(
                'div',
                className ? { className } : void 0,
                {
                    // Add HTML specific styles
                    position: 'absolute',
                    left: `${g.translateX || 0}px`,
                    top: `${g.translateY || 0}px`,

                    // Add pre-existing styles
                    ...g.styles,

                    // Add g attributes that correspond to CSS
                    display: g.display,
                    opacity: g.opacity, // #5075
                    visibility: g.visibility
                },
                // The top group is appended to container
                g.parentGroup?.div || container
            );

            g.classSetter = (
                value,
                key,
                element
            ) => {
                element.setAttribute('class', value);
                div.className = value;
            };

            /**
             * Common translate setter for X and Y on the HTML group.
             *
             * Reverted the fix for #6957 due to positioning problems and
             * offline export (#7254, #7280, #7529)
             * @private
             */
            g.translateXSetter = g.translateYSetter = (
                value,
                key
            ) => {
                g[key] = value;

                div.style[key === 'translateX' ? 'left' : 'top'] = `${value}px`;

                g.doTransform = true;
            };

            g.scaleXSetter = g.scaleYSetter = (
                value,
                key
            ) => {
                g[key] = value;

                g.doTransform = true;
            };

            g.opacitySetter = g.visibilitySetter = commonSetter;

            // Extend the parent group's css function by updating the parallel
            // div counterpart with the same style.
            g.css = styles => {

                // Call the base css method. The `parentGroup` can be either an
                // SVGElement or an SVGLabel, in which the css method is
                // extended (#19200).
                cssProto.call(g, styles);

                // #6794
                if (styles.cursor) {
                    div.style.cursor = styles.cursor;
                }

                // #18821
                if (styles.pointerEvents) {
                    div.style.pointerEvents = styles.pointerEvents;
                }

                return g;
            };

            // Event handling
            g.on = function () {
                SVGElement.prototype.on.apply({
                    element: div,
                    onEvents: g.onEvents
                }, arguments);
                return g;
            };

            g.div = div;
        }
        return g.div;
    };

    class HTMLElementLegacy extends HTMLElement {
        constructor(renderer, nodeName) {
            super(renderer, nodeName);
            this.foreignObject = this.foreignObject?.destroy();
            this.css({
                position: 'absolute',
                ...(this.renderer.styledMode ? {} : {
                    fontFamily: this.renderer.style.fontFamily,
                    fontSize: this.renderer.style.fontSize
                })
            });
        }

        updateTransform() {
            // Aligning non added elements is expensive
            if (!this.added) {
                this.alignOnAdd = true;
                return;
            }

            const {
                element,
                oldTextWidth,
                renderer,
                rotation,
                rotationOriginX,
                rotationOriginY,
                scaleX,
                scaleY,
                styles: { display = 'inline-block', whiteSpace },
                textAlign = 'left',
                textWidth,
                x = 0,
                y = 0
            } = this;

            // Get the pixel length of the text
            const getTextPxLength = () => {
                if (this.textPxLength) {
                    return this.textPxLength;
                }
                // Reset multiline/ellipsis in order to read width (#4928,
                // #5417)
                css(element, {
                    width: '',
                    whiteSpace: whiteSpace || 'nowrap'
                });
                return element.offsetWidth;
            };

            if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
                const currentTextTransform = [
                        rotation,
                        textAlign,
                        element.innerHTML,
                        textWidth,
                        this.textAlign
                    ].join(','),
                    parentPadding = (this.parentGroup?.padding * -1) || 0;

                let baseline;

                // Update textWidth. Use the memoized textPxLength if possible,
                // to avoid the getTextPxLength function using elem.offsetWidth.
                // Calling offsetWidth affects rendering time as it forces
                // layout (#7656).
                if (textWidth !== oldTextWidth) { // #983, #1254
                    const textPxLength = getTextPxLength(),
                        textWidthNum = textWidth || 0,
                        willOverWrap = !renderer.styledMode &&
                            element.style.textOverflow === '' &&
                            element.style.webkitLineClamp;
                    if (
                        (
                            textWidthNum > oldTextWidth ||
                            textPxLength > textWidthNum ||
                            willOverWrap
                        ) && (
                            // Only set the width if the text is able to
                            // word-wrap, or text-overflow is ellipsis (#9537)
                            /[\-\s\u00AD]/.test(
                                element.textContent || element.innerText
                            ) ||
                            element.style.textOverflow === 'ellipsis'
                        )
                    ) {
                        const usePxWidth = rotation ||
                            scaleX ||
                            textPxLength > textWidthNum ||
                            // Set width to prevent over-wrapping (#22609)
                            willOverWrap;

                        css(element, {
                            width: usePxWidth && isNumber(textWidth) ?
                                textWidth + 'px' : 'auto', // #16261
                            display,
                            whiteSpace: whiteSpace || 'normal' // #3331
                        });
                        this.oldTextWidth = textWidth;
                    }
                }

                // Do the calculations and DOM access only if properties changed
                if (currentTextTransform !== this.cTT) {
                    baseline = renderer.fontMetrics(element).b;

                    // Renderer specific handling of span rotation, but only if
                    // we have something to update.
                    if (
                        defined(rotation) &&
                        (
                            (rotation !== (this.oldRotation || 0)) ||
                            (textAlign !== this.oldAlign)
                        )
                    ) {
                        // CSS transform and transform-origin both supported
                        // without prefix since Firefox 16 (2012), IE 10 (2012),
                        // Chrome 36 (2014), Safari 9 (2015).;
                        css(element, {
                            transform: `rotate(${rotation}deg)`,
                            transformOrigin:
                                `${parentPadding}% ${parentPadding}px`
                        });
                    }

                    this.getSpanCorrection(
                        // Avoid elem.offsetWidth if we can, it affects
                        // rendering time heavily (#7656)
                        (
                            (
                                !defined(rotation) &&
                                !this.textWidth &&
                                this.textPxLength
                            ) || // #7920
                            element.offsetWidth
                        ),
                        baseline,
                        getAlignFactor(textAlign)
                    );
                }

                // Apply position with correction and rotation origin
                const { xCorr = 0, yCorr = 0 } = this,
                    rotOriginX = (rotationOriginX ?? x) - xCorr - x -
                        parentPadding,
                    rotOriginY = (rotationOriginY ?? y) - yCorr - y -
                        parentPadding,
                    styles = {
                        left: `${x + xCorr}px`,
                        top: `${y + yCorr}px`,
                        textAlign,
                        transformOrigin: `${rotOriginX}px ${rotOriginY}px`
                    };

                if (scaleX || scaleY) {
                    styles.transform = `scale(${scaleX ?? 1},${scaleY ?? 1})`;
                }

                css(element, styles);

                // Record current text transform
                this.cTT = currentTextTransform;
                this.oldRotation = rotation;
                this.oldAlign = textAlign;
            }
        }

        add(parentGroup) {
            const { renderer } = this,
                container = renderer.box.parentNode,
                parents = [];

            let div;

            this.parentGroup = parentGroup;

            // Create a parallel divs to hold the HTML elements
            if (parentGroup) {
                div = parentGroup.div;
                if (!div) {

                    // Read the parent chain into an array and read from top
                    // down
                    let svgGroup = parentGroup;
                    while (svgGroup) {

                        parents.push(svgGroup);

                        // Move up to the next parent group
                        svgGroup = svgGroup.parentGroup;
                    }

                    // Decorate each of the ancestor group elements with a
                    // parallel div that reflects translation and styling
                    for (const parentGroup of parents.reverse()) {
                        div = decorateSVGGroup(parentGroup, container);
                    }
                }
            }

            (div || container).appendChild(this.element);

            this.added = true;
            if (this.alignOnAdd) {
                this.updateTransform();
            }

            return this;

        }
    }

    SVGRenderer.prototype.html = function (str, x, y) {
        return new HTMLElementLegacy(this, 'div')
            .attr({
                text: str,
                x: Math.round(x || 0),
                y: Math.round(y || 0)
            });
    };

    wrap(SVGElement.prototype, 'updateTransform', function (proceed) {
        proceed.call(this);

        const {
            padding,
            rotation,
            rotationOriginX,
            rotationOriginY,
            text
        } = this;

        // HTML labels rotation (#20685)
        if (text?.element.tagName === 'SPAN') {
            text.attr({
                rotation,
                rotationOriginX: (rotationOriginX || 0) - padding,
                rotationOriginY: (rotationOriginY || 0) - padding
            });
        }
    });

    wrap(SVGRenderer.prototype, 'destroy', function (proceed) {
        let parentToClean = (
                (this.element?.nodeName === 'SPAN' && this.parentGroup) ||
                void 0
            ),
            grandParent;

        // In case of legacy useHTML, clean up empty containers emulating SVG
        // groups (#1960, #2393, #2697).
        while (
            parentToClean?.div &&
            parentToClean.div.childNodes.length === 0
        ) {
            grandParent = parentToClean.parentGroup;
            this.safeRemoveChild(parentToClean.div);
            delete parentToClean.div;
            parentToClean = grandParent;
        }

        proceed.call(this);

    });

    if (Exporting) {
        wrap(
            Exporting,
            'sanitizeSVG',
            function (proceed, svg, options) {
                const split = svg.indexOf('</svg>') + 6;
                let html = svg.substr(split);

                // Remove any HTML added to the container after the SVG (#894,
                // #9087)
                svg = svg.substr(0, split);

                html = '<foreignObject x="0" y="0" ' +
                        'width="' + options.chart.width + '" ' +
                        'height="' + options.chart.height + '">' +
                    '<body xmlns="http://www.w3.org/1999/xhtml">' +
                    // Some tags needs to be closed in xhtml (#13726)
                    html.replace(/(<(?:img|br).*?(?=\>))>/g, '$1 />') +
                    '</body>' +
                    '</foreignObject>';
                svg = svg.replace('</svg>', html + '</svg>');

                return proceed.call(this, svg, options);
            }
        );
    }
})(Highcharts);

Highcharts.chart('container', {

    chart: {
        type: 'column'
    },

    title: {
        text: 'No <code>foreignObject</code> <i class="fa fa-check"></i>',
        useHTML: true
    },

    subtitle: {
        text: `<table style="border: 1px solid silver">
            <tr><th>This</th><td>is</td></tr>
            <tr><th>a</th><td>table</td></tr>
        </table>`,
        useHTML: true
    },

    yAxis: {
        labels: {
            useHTML: true
        },
        title: {
            text: 'HTML y-axis <i class="fa fa-check"></i>',
            useHTML: true
        }
    },

    xAxis: {
        type: 'category',
        labels: {
            useHTML: true,
            format: '{value} <i class="fa fa-check"></i>',
            style: {
                whiteSpace: 'nowrap'
            }
        }
    },

    legend: {
        useHTML: true
    },

    tooltip: {
        useHTML: true,
        footerFormat: `<table style="border: 1px solid silver">
            <tr><th>This</th><td>is</td></tr>
            <tr><th>a</th><td>table</td></tr>
        </table>`
    },

    series: [{
        data: [
            ['Ein', 1234],
            ['To', 4567],
            ['Tre', 2345],
            ['Fire', 3456]
        ],
        dataLabels: {
            enabled: true,
            useHTML: true,
            format: '{y} <i class="fa fa-check"></i>',
            rotation: -45
        },
        name: 'HTML Series <i class="fa fa-check"></i>'
    }],

    exporting: {
        allowHTML: true
    }

});
