/**
 * GUI generator for Stock tools
 *
 * (c) 2009-2017 Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';

var addEvent = H.addEvent,
    createElement = H.createElement,
    pick = H.pick,
    isArray = H.isArray,
    fireEvent = H.fireEvent,
    getStyle = H.getStyle,
    merge = H.merge,
    css = H.css,
    win = H.win,
    DIV = 'div',
    SPAN = 'span',
    UL = 'ul',
    LI = 'li',
    PREFIX = 'highcharts-',
    activeClass = PREFIX + 'active';

H.setOptions({
    /**
     * @optionparent lang
     */
    lang: {
        /**
         * Configure the stockTools GUI titles(hints) in the chart. Requires
         * the `stock-tools.js` module to be loaded.
         *
         * @product         highstock
         * @since           7.0.0
         * @type            {Object}
         */
        stockTools: {
            gui: {
                // Main buttons:
                simpleShapes: 'Simple shapes',
                lines: 'Lines',
                crookedLines: 'Crooked lines',
                measure: 'Measure',
                advanced: 'Advanced',
                toggleAnnotations: 'Toggle annotations',
                verticalLabels: 'Vertical labels',
                flags: 'Flags',
                zoomChange: 'Zoom change',
                typeChange: 'Type change',
                saveChart: 'Save chart',
                indicators: 'Indicators',
                currentPriceIndicator: 'Current Price Indicators',

                // Other features:
                zoomX: 'Zoom X',
                zoomY: 'Zoom Y',
                zoomXY: 'Zooom XY',
                fullScreen: 'Fullscreen',
                typeOHLC: 'OHLC',
                typeLine: 'Line',
                typeCandlestick: 'Candlestick',

                // Basic shapes:
                circle: 'Circle',
                label: 'Label',
                rectangle: 'Rectangle',

                // Flags:
                flagCirclepin: 'Flag circle',
                flagDiamondpin: 'Flag diamond',
                flagSquarepin: 'Flag square',
                flagSimplepin: 'Flag simple',

                // Measures:
                measureXY: 'Measure XY',
                measureX: 'Measure X',
                measureY: 'Measure Y',

                // Segment, ray and line:
                segment: 'Segment',
                arrowSegment: 'Arrow segment',
                ray: 'Ray',
                arrowRay: 'Arrow ray',
                line: 'Line',
                arrowLine: 'Arrow line',
                horizontalLine: 'Horizontal line',
                verticalLine: 'Vertical line',
                infinityLine: 'Infinity line',

                // Crooked lines:
                crooked3: 'Crooked 3 line',
                crooked5: 'Crooked 5 line',
                elliott3: 'Elliott 3 line',
                elliott5: 'Elliott 5 line',

                // Counters:
                verticalCounter: 'Vertical counter',
                verticalLabel: 'Vertical label',
                verticalArrow: 'Vertical arrow',

                // Advanced:
                fibonacci: 'Fibonacci',
                pitchfork: 'Pitchfork',
                parallelChannel: 'Parallel channel'
            }
        },
        navigation: {
            popup: {
                // Annotations:
                circle: 'Circle',
                rectangle: 'Rectangle',
                label: 'Label',
                segment: 'Segment',
                arrowSegment: 'Arrow segment',
                ray: 'Ray',
                arrowRay: 'Arrow ray',
                line: 'Line',
                arrowLine: 'Arrow line',
                horizontalLine: 'Horizontal line',
                verticalLine: 'Vertical line',
                crooked3: 'Crooked 3 line',
                crooked5: 'Crooked 5 line',
                elliott3: 'Elliott 3 line',
                elliott5: 'Elliott 5 line',
                verticalCounter: 'Vertical counter',
                verticalLabel: 'Vertical label',
                verticalArrow: 'Vertical arrow',
                fibonacci: 'Fibonacci',
                pitchfork: 'Pitchfork',
                parallelChannel: 'Parallel channel',
                infinityLine: 'Infinity line',
                measure: 'Measure',
                measureXY: 'Measure XY',
                measureX: 'Measure X',
                measureY: 'Measure Y',

                // Flags:
                flags: 'Flags',

                // GUI elements:
                addButton: 'add',
                saveButton: 'save',
                editButton: 'edit',
                removeButton: 'remove',
                series: 'Series',
                volume: 'Volume',
                connector: 'Connector',

                // Field names:
                innerBackground: 'Inner background',
                outerBackground: 'Outer background',
                crosshairX: 'Crosshair X',
                crosshairY: 'Crosshair Y',
                tunnel: 'Tunnel',
                background: 'Background'
            }
        }
    },
    /**
     * Configure the stockTools gui strings in the chart. Requires the
     * [stockTools module]() to be loaded. For a description of the module
     * and information on its features, see [Highcharts StockTools]().
     *
     * @product highstock
     *
     * @sample stock/demo/stock-tools-gui Stock Tools GUI
     *
     * @sample stock/demo/stock-tools-custom-gui Stock Tools customized GUI
     *
     * @since 7.0.0
     * @type {Object}
     * @optionparent stockTools
     */
    stockTools: {
        /**
         * Definitions of buttons in Stock Tools GUI.
         */
        gui: {
            /**
             * Enable or disable the stockTools gui.
             *
             * @type      {boolean}
             * @default true
             */
            enabled: true,
            /**
             * A CSS class name to apply to the stocktools' div,
             * allowing unique CSS styling for each chart.
             *
             * @type      {string}
             * @default 'highcharts-bindings-wrapper'
             *
             */
            className: 'highcharts-bindings-wrapper',
            /**
             * A CSS class name to apply to the container of buttons,
             * allowing unique CSS styling for each chart.
             *
             * @type      {string}
             * @default 'stocktools-toolbar'
             *
             */
            toolbarClassName: 'stocktools-toolbar',
            /**
             * Path where Highcharts will look for icons. Change this to use
             * icons from a different server.
             */
            iconsURL: 'https://code.highcharts.com/@product.version@/gfx/stock-icons/',
            /**
             * A collection of strings pointing to config options for the
             * toolbar items. Each name refers to unique key from definitions
             * object.
             *
             * @type      {array}
             *
             * @default [
             *  'indicators',
             *   'separator',
             *   'simpleShapes',
             *   'lines',
             *   'crookedLines',
             *   'measure',
             *   'advanced',
             *   'toggleAnnotations',
             *   'separator',
             *   'verticalLabels',
             *   'flags',
             *   'separator',
             *   'zoomChange',
             *   'fullScreen',
             *   'typeChange',
             *   'separator',
             *   'currentPriceIndicator',
             *   'saveChart'
             *  ]
             */
            buttons: [
                'indicators',
                'separator',
                'simpleShapes',
                'lines',
                'crookedLines',
                'measure',
                'advanced',
                'toggleAnnotations',
                'separator',
                'verticalLabels',
                'flags',
                'separator',
                'zoomChange',
                'fullScreen',
                'typeChange',
                'separator',
                'currentPriceIndicator',
                'saveChart'
            ],
            /**
             * An options object of the buttons definitions. Each name refers to
             * unique key from buttons array.
             *
             * @type      {object}
             *
             */
            definitions: {
                separator: {
                    /**
                     * A predefined background symbol for the button.
                     *
                     * @type   {string}
                     */
                    symbol: 'separator.svg'
                },
                simpleShapes: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'label',
                     *   'circle',
                     *   'rectangle'
                     * ]
                     *
                     */
                    items: [
                        'label',
                        'circle',
                        'rectangle'
                    ],
                    circle: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         *
                         */
                        symbol: 'circle.svg'
                    },
                    rectangle: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         *
                         */
                        symbol: 'rectangle.svg'
                    },
                    label: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         *
                         */
                        symbol: 'label.svg'
                    }
                },
                flags: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'flagCirclepin',
                     *   'flagDiamondpin',
                     *   'flagSquarepin',
                     *   'flagSimplepin'
                     * ]
                     *
                     */
                    items: [
                        'flagCirclepin',
                        'flagDiamondpin',
                        'flagSquarepin',
                        'flagSimplepin'
                    ],
                    flagSimplepin: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         *
                         */
                        symbol: 'flag-basic.svg'
                    },
                    flagDiamondpin: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         *
                         */
                        symbol: 'flag-diamond.svg'
                    },
                    flagSquarepin: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'flag-trapeze.svg'
                    },
                    flagCirclepin: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'flag-elipse.svg'
                    }
                },
                lines: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'segment',
                     *   'arrowSegment',
                     *   'ray',
                     *   'arrowRay',
                     *   'line',
                     *   'arrowLine',
                     *   'horizontalLine',
                     *   'verticalLine'
                     * ]
                     */
                    items: [
                        'segment',
                        'arrowSegment',
                        'ray',
                        'arrowRay',
                        'line',
                        'arrowLine',
                        'horizontalLine',
                        'verticalLine'
                    ],
                    segment: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'segment.svg'
                    },
                    arrowSegment: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'arrow-segment.svg'
                    },
                    ray: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'ray.svg'
                    },
                    arrowRay: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'arrow-ray.svg'
                    },
                    line: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'line.svg'
                    },
                    arrowLine: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'arrow-line.svg'
                    },
                    verticalLine: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'vertical-line.svg'
                    },
                    horizontalLine: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'horizontal-line.svg'
                    }
                },
                crookedLines: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'elliott3',
                     *   'elliott5',
                     *   'crooked3',
                     *   'crooked5'
                     * ]
                     *
                     */
                    items: [
                        'elliott3',
                        'elliott5',
                        'crooked3',
                        'crooked5'
                    ],
                    crooked3: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'crooked-3.svg'
                    },
                    crooked5: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'crooked-5.svg'
                    },
                    elliott3: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'elliott-3.svg'
                    },
                    elliott5: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'elliott-5.svg'
                    }
                },
                verticalLabels: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'verticalCounter',
                     *   'verticalLabel',
                     *   'verticalArrow'
                     * ]
                     */
                    items: [
                        'verticalCounter',
                        'verticalLabel',
                        'verticalArrow'
                    ],
                    verticalCounter: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'vertical-counter.svg'
                    },
                    verticalLabel: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'vertical-label.svg'
                    },
                    verticalArrow: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'vertical-arrow.svg'
                    }
                },
                advanced: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'fibonacci',
                     *   'pitchfork',
                     *   'parallelChannel'
                     * ]
                     */
                    items: [
                        'fibonacci',
                        'pitchfork',
                        'parallelChannel'
                    ],
                    pitchfork: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'pitchfork.svg'
                    },
                    fibonacci: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'fibonacci.svg'
                    },
                    parallelChannel: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'parallel-channel.svg'
                    }
                },
                measure: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'measureXY',
                     *   'measureX',
                     *   'measureY'
                     * ]
                     */
                    items: [
                        'measureXY',
                        'measureX',
                        'measureY'
                    ],
                    measureX: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'measure-x.svg'
                    },
                    measureY: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'measure-y.svg'
                    },
                    measureXY: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'measure-xy.svg'
                    }
                },
                toggleAnnotations: {
                    /**
                     * A predefined background symbol for the button.
                     *
                     * @type   {string}
                     */
                    symbol: 'annotations-visible.svg'
                },
                currentPriceIndicator: {
                    /**
                     * A predefined background symbol for the button.
                     *
                     * @type   {string}
                     */
                    symbol: 'current-price-show.svg'
                },
                indicators: {
                    /**
                     * A predefined background symbol for the button.
                     *
                     * @type   {string}
                     */
                    symbol: 'indicators.svg'
                },
                zoomChange: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'zoomX',
                     *   'zoomY',
                     *   'zoomXY'
                     * ]
                     */
                    items: [
                        'zoomX',
                        'zoomY',
                        'zoomXY'
                    ],
                    zoomX: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'zoom-x.svg'
                    },
                    zoomY: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'zoom-y.svg'
                    },
                    zoomXY: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'zoom-xy.svg'
                    }
                },
                typeChange: {
                    /**
                     * A collection of strings pointing to config options for
                     * the items.
                     *
                     * @type {array}
                     * @default [
                     *   'typeOHLC',
                     *   'typeLine',
                     *   'typeCandlestick'
                     * ]
                     */
                    items: [
                        'typeOHLC',
                        'typeLine',
                        'typeCandlestick'
                    ],
                    typeOHLC: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'series-ohlc.svg'
                    },
                    typeLine: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'series-line.svg'
                    },
                    typeCandlestick: {
                        /**
                         * A predefined background symbol for the button.
                         *
                         * @type   {string}
                         */
                        symbol: 'series-candlestick.svg'
                    }
                },
                fullScreen: {
                    /**
                     * A predefined background symbol for the button.
                     *
                     * @type   {string}
                     */
                    symbol: 'fullscreen.svg'
                },
                saveChart: {
                    /**
                     * A predefined background symbol for the button.
                     *
                     * @type   {string}
                     */
                    symbol: 'save-chart.svg'
                }
            }
        }
    }
});

// Run HTML generator
addEvent(H.Chart, 'afterGetContainer', function () {
    this.setStockTools();
});

addEvent(H.Chart, 'getMargins', function () {
    var listWrapper = this.stockTools && this.stockTools.listWrapper,
        offsetWidth = listWrapper && (
            (
                listWrapper.startWidth +
                H.getStyle(listWrapper, 'padding-left') +
                H.getStyle(listWrapper, 'padding-right')
            ) || listWrapper.offsetWidth
        );

    if (offsetWidth && offsetWidth < this.plotWidth) {
        this.plotLeft += offsetWidth;
    }
});

addEvent(H.Chart, 'destroy', function () {
    if (this.stockTools) {
        this.stockTools.destroy();
    }
});

addEvent(H.Chart, 'redraw', function () {
    if (this.stockTools && this.stockTools.guiEnabled) {
        this.stockTools.redraw();
    }
});

/*
 * Toolbar Class
 *
 * @param {Object} - options of toolbar
 * @param {Chart} - Reference to chart
 *
 */

H.Toolbar = function (options, langOptions, chart) {
    this.chart = chart;
    this.options = options;
    this.lang = langOptions;

    this.guiEnabled = options.enabled;
    this.visible = pick(options.visible, true);
    this.placed = pick(options.placed, false);

    // General events collection which should be removed upon destroy/update:
    this.eventsToUnbind = [];

    if (this.guiEnabled) {
        this.createHTML();

        this.init();

        this.showHideNavigatorion();
    }

    fireEvent(this, 'afterInit');
};

H.extend(H.Chart.prototype, {
    /*
     * Verify if Toolbar should be added.
     *
     * @param {Object} - chart options
     *
     */
    setStockTools: function (options) {
        var chartOptions = this.options,
            lang = chartOptions.lang,
            guiOptions = merge(
                chartOptions.stockTools && chartOptions.stockTools.gui,
                options && options.gui
            ),
            langOptions = lang.stockTools && lang.stockTools.gui;

        this.stockTools = new H.Toolbar(guiOptions, langOptions, this);

        if (this.stockTools.guiEnabled) {
            this.isDirtyBox = true;
        }
    }
});

H.Toolbar.prototype = {
    /*
     * Initialize the toolbar. Create buttons and submenu for each option
     * defined in `stockTools.gui`.
     *
     */
    init: function () {
        var _self = this,
            lang = this.lang,
            guiOptions = this.options,
            toolbar = this.toolbar,
            addSubmenu = _self.addSubmenu,
            buttons = guiOptions.buttons,
            defs = guiOptions.definitions,
            allButtons = toolbar.childNodes,
            inIframe = this.inIframe(),
            button;

        // create buttons
        buttons.forEach(function (btnName) {

            button = _self.addButton(toolbar, defs, btnName, lang);

            if (inIframe && btnName === 'fullScreen') {
                button.buttonWrapper.className += ' ' + PREFIX + 'disabled-btn';
            }

            ['click', 'touchstart'].forEach(function (eventName) {
                addEvent(button.buttonWrapper, eventName, function () {
                    _self.eraseActiveButtons(
                        allButtons,
                        button.buttonWrapper
                    );
                });
            });

            if (isArray(defs[btnName].items)) {
                // create submenu buttons
                addSubmenu.call(_self, button, defs[btnName]);
            }
        });
    },
    /*
     * Create submenu (list of buttons) for the option. In example main button
     * is Line, in submenu will be buttons with types of lines.
     *
     * @param {Object} - button which has submenu
     * @param {Array} - list of all buttons
     *
     */
    addSubmenu: function (parentBtn, button) {
        var _self = this,
            submenuArrow = parentBtn.submenuArrow,
            buttonWrapper = parentBtn.buttonWrapper,
            buttonWidth = getStyle(buttonWrapper, 'width'),
            wrapper = this.wrapper,
            menuWrapper = this.listWrapper,
            allButtons = this.toolbar.childNodes,
            topMargin = 0,
            submenuWrapper;

        // create submenu container
        this.submenu = submenuWrapper = createElement(UL, {
            className: PREFIX + 'submenu-wrapper'
        }, null, buttonWrapper);

        // create submenu buttons and select the first one
        this.addSubmenuItems(buttonWrapper, button);

        // show / hide submenu
        ['click', 'touchstart'].forEach(function (eventName) {
            addEvent(submenuArrow, eventName, function (e) {

                e.stopPropagation();
                // Erase active class on all other buttons
                _self.eraseActiveButtons(allButtons, buttonWrapper);

                // hide menu
                if (buttonWrapper.className.indexOf(PREFIX + 'current') >= 0) {
                    menuWrapper.style.width = menuWrapper.startWidth + 'px';
                    buttonWrapper.classList.remove(PREFIX + 'current');
                    submenuWrapper.style.display = 'none';
                } else {
                    // show menu
                    // to calculate height of element
                    submenuWrapper.style.display = 'block';

                    topMargin = submenuWrapper.offsetHeight -
                                buttonWrapper.offsetHeight - 3;

                    // calculate position of submenu in the box
                    // if submenu is inside, reset top margin
                    if (
                        // cut on the bottom
                        !(submenuWrapper.offsetHeight +
                            buttonWrapper.offsetTop >
                        wrapper.offsetHeight &&
                        // cut on the top
                        buttonWrapper.offsetTop > topMargin)
                    ) {
                        topMargin = 0;
                    }

                    // apply calculated styles
                    css(submenuWrapper, {
                        top: -topMargin + 'px',
                        left: buttonWidth + 3 + 'px'
                    });

                    buttonWrapper.className += ' ' + PREFIX + 'current';
                    menuWrapper.startWidth = wrapper.offsetWidth;
                    menuWrapper.style.width = menuWrapper.startWidth +
                                    H.getStyle(menuWrapper, 'padding-left') +
                                    submenuWrapper.offsetWidth + 3 + 'px';
                }
            });
        });
    },
    /*
     * Create buttons in submenu
     *
     * @param {HTMLDOMElement} - button where submenu is placed
     * @param {Array} - list of all buttons options
     *
     */
    addSubmenuItems: function (buttonWrapper, button) {
        var _self = this,
            submenuWrapper = this.submenu,
            lang = this.lang,
            menuWrapper = this.listWrapper,
            items = button.items,
            firstSubmenuItem,
            submenuBtn;

        // add items to submenu
        items.forEach(function (btnName) {
            // add buttons to submenu
            submenuBtn = _self.addButton(
                submenuWrapper,
                button,
                btnName,
                lang
            );

            ['click', 'touchstart'].forEach(function (eventName) {
                addEvent(submenuBtn.mainButton, eventName, function () {
                    _self.switchSymbol(this, buttonWrapper, true);
                    menuWrapper.style.width = menuWrapper.startWidth + 'px';
                    submenuWrapper.style.display = 'none';
                });
            });
        });

        // select first submenu item
        firstSubmenuItem = submenuWrapper
            .querySelectorAll('li > .' + PREFIX + 'menu-item-btn')[0];

        // replace current symbol, in main button, with submenu's button style
        _self.switchSymbol(firstSubmenuItem, false);
    },
    /*
     * Erase active class on all other buttons.
     *
     * @param {Array} - Array of HTML buttons
     * @param {HTMLDOMElement} - Current HTML button
     *
     */
    eraseActiveButtons: function (buttons, currentButton, submenuItems) {
        [].forEach.call(buttons, function (btn) {
            if (btn !== currentButton) {
                btn.classList.remove(PREFIX + 'current');
                btn.classList.remove(PREFIX + 'active');
                submenuItems =
                    btn.querySelectorAll('.' + PREFIX + 'submenu-wrapper');

                // hide submenu
                if (submenuItems.length > 0) {
                    submenuItems[0].style.display = 'none';
                }
            }
        });
    },
    /*
     * Create single button. Consist of `<li>` , `<span>` and (if exists)
     * submenu container.
     *
     * @param {HTMLDOMElement} - HTML reference, where button should be added
     * @param {Object} - all options, by btnName refer to particular button
     * @param {String} - name of functionality mapped for specific class
     * @param {Object} - All titles, by btnName refer to particular button
     *
     * @return {Object} - references to all created HTML elements
     */
    addButton: function (target, options, btnName, lang) {
        var guiOptions = this.options,
            btnOptions = options[btnName],
            items = btnOptions.items,
            classMapping = H.Toolbar.prototype.classMapping,
            userClassName = btnOptions.className || '',
            mainButton,
            submenuArrow,
            buttonWrapper;

        // main button wrapper
        buttonWrapper = createElement(LI, {
            className: pick(classMapping[btnName], '') + ' ' + userClassName,
            title: lang[btnName] || btnName
        }, null, target);

        // single button
        mainButton = createElement(SPAN, {
            className: PREFIX + 'menu-item-btn'
        }, null, buttonWrapper);


        // submenu
        if (items && items.length > 1) {

            // arrow is a hook to show / hide submenu
            submenuArrow = createElement(SPAN, {
                className: PREFIX + 'submenu-item-arrow ' +
                    PREFIX + 'arrow-right'
            }, null, buttonWrapper);
        } else {
            mainButton.style['background-image'] = 'url(' +
                guiOptions.iconsURL + btnOptions.symbol + ')';
        }

        return {
            buttonWrapper: buttonWrapper,
            mainButton: mainButton,
            submenuArrow: submenuArrow
        };
    },
    /*
     * Create navigation's HTML elements: container and arrows.
     *
     */
    addNavigation: function () {
        var stockToolbar = this,
            wrapper = stockToolbar.wrapper;

        // arrow wrapper
        stockToolbar.arrowWrapper = createElement(DIV, {
            className: PREFIX + 'arrow-wrapper'
        });

        stockToolbar.arrowUp = createElement(DIV, {
            className: PREFIX + 'arrow-up'
        }, null, stockToolbar.arrowWrapper);

        stockToolbar.arrowDown = createElement(DIV, {
            className: PREFIX + 'arrow-down'
        }, null, stockToolbar.arrowWrapper);

        wrapper.insertBefore(
            stockToolbar.arrowWrapper,
            wrapper.childNodes[0]
        );

        // attach scroll events
        stockToolbar.scrollButtons();
    },
    /*
     * Add events to navigation (two arrows) which allows user to scroll
     * top/down GUI buttons, if container's height is not enough.
     *
     */
    scrollButtons: function () {
        var targetY = 0,
            _self = this,
            wrapper = _self.wrapper,
            toolbar = _self.toolbar,
            step = 0.1 * wrapper.offsetHeight; // 0.1 = 10%

        ['click', 'touchstart'].forEach(function (eventName) {
            addEvent(_self.arrowUp, eventName, function () {
                if (targetY > 0) {
                    targetY -= step;
                    toolbar.style['margin-top'] = -targetY + 'px';
                }
            });

            addEvent(_self.arrowDown, eventName, function () {
                if (
                    wrapper.offsetHeight + targetY <=
                    toolbar.offsetHeight + step
                ) {
                    targetY += step;
                    toolbar.style['margin-top'] = -targetY + 'px';
                }
            });
        });
    },
    /*
     * Create stockTools HTML main elements.
     *
     */
    createHTML: function () {
        var stockToolbar = this,
            chart = stockToolbar.chart,
            guiOptions = stockToolbar.options,
            container = chart.container,
            navigation = chart.options.navigation,
            bindingsClassName = navigation && navigation.bindingsClassName,
            listWrapper,
            toolbar,
            wrapper;

        // create main container
        stockToolbar.wrapper = wrapper = createElement(DIV, {
            className: PREFIX + 'stocktools-wrapper ' +
                guiOptions.className + ' ' + bindingsClassName
        });
        container.parentNode.insertBefore(wrapper, container);

        // toolbar
        stockToolbar.toolbar = toolbar = createElement(UL, {
            className: PREFIX + 'stocktools-toolbar ' +
                    guiOptions.toolbarClassName
        });

        // add container for list of buttons
        stockToolbar.listWrapper = listWrapper = createElement(DIV, {
            className: PREFIX + 'menu-wrapper'
        });

        wrapper.insertBefore(listWrapper, wrapper.childNodes[0]);
        listWrapper.insertBefore(toolbar, listWrapper.childNodes[0]);

        stockToolbar.showHideToolbar();

        // add navigation which allows user to scroll down / top GUI buttons
        stockToolbar.addNavigation();
    },
    /*
     * Function called in redraw verifies if the navigation should be visible.
     *
     */
    showHideNavigatorion: function () {
        // arrows
        // 50px space for arrows
        if (
            this.visible &&
            this.toolbar.offsetHeight > (this.wrapper.offsetHeight - 50)
        ) {
            this.arrowWrapper.style.display = 'block';
        } else {
            // reset margin if whole toolbar is visible
            this.toolbar.style.marginTop = '0px';

            // hide arrows
            this.arrowWrapper.style.display = 'none';
        }
    },
    /*
     * Create button which shows or hides GUI toolbar.
     *
     */
    showHideToolbar: function () {
        var stockToolbar = this,
            chart = this.chart,
            wrapper = stockToolbar.wrapper,
            toolbar = this.listWrapper,
            submenu = this.submenu,
            visible = this.visible,
            showhideBtn;

        // Show hide toolbar
        this.showhideBtn = showhideBtn = createElement(DIV, {
            className: PREFIX + 'toggle-toolbar ' + PREFIX + 'arrow-left'
        }, null, wrapper);

        if (!visible) {
            // hide
            if (submenu) {
                submenu.style.display = 'none';
            }
            showhideBtn.style.left = '0px';
            stockToolbar.visible = visible = false;

            toolbar.classList.add(PREFIX + 'hide');
            showhideBtn.classList.toggle(PREFIX + 'arrow-right');
            wrapper.style.height = showhideBtn.offsetHeight + 'px';
        } else {
            wrapper.style.height = '100%';
            showhideBtn.style.top = H.getStyle(toolbar, 'padding-top') + 'px';
            showhideBtn.style.left = (
                wrapper.offsetWidth +
                H.getStyle(toolbar, 'padding-left')
            ) + 'px';
        }

        // toggle menu
        ['click', 'touchstart'].forEach(function (eventName) {
            addEvent(showhideBtn, eventName, function () {
                chart.update({
                    stockTools: {
                        gui: {
                            visible: !visible,
                            placed: true
                        }
                    }
                });
            });
        });
    },
    /*
     * In main GUI button, replace icon and class with submenu button's
     * class / symbol.
     *
     * @param {HTMLDOMElement} - submenu button
     * @param {Boolean} - true or false
     *
     */
    switchSymbol: function (button, redraw) {
        var buttonWrapper = button.parentNode,
            buttonWrapperClass = buttonWrapper.classList.value,
            // main button in first level og GUI
            mainNavButton = buttonWrapper.parentNode.parentNode;

        // set class
        mainNavButton.className = '';
        if (buttonWrapperClass) {
            mainNavButton.classList.add(buttonWrapperClass.trim());
        }

        // set icon
        mainNavButton.querySelectorAll('.' + PREFIX + 'menu-item-btn')[0]
            .style['background-image'] = button.style['background-image'];

        // set active class
        if (redraw) {
            this.selectButton(mainNavButton);
        }
    },
    /*
     * Set select state (active class) on button.
     *
     * @param {HTMLDOMElement} - button
     *
     */
    selectButton: function (btn) {
        if (btn.className.indexOf(activeClass) >= 0) {
            btn.classList.remove(activeClass);
        } else {
            btn.classList.add(activeClass);
        }
    },
    /*
     * Remove active class from all buttons except defined.
     *
     * @param {HTMLDOMElement} - button which should not be deactivated
     *
     */
    unselectAllButtons: function (btn) {
        var activeButtons = btn.parentNode.querySelectorAll('.' + activeClass);

        [].forEach.call(activeButtons, function (activeBtn) {
            if (activeBtn !== btn) {
                activeBtn.classList.remove(activeClass);
            }
        });
    },
    /*
     * Verify if chart is in iframe.
     *
     * @return {Object} - elements translations.
     */
    inIframe: function () {
        try {
            return win.self !== win.top;
        } catch (e) {
            return true;
        }
    },
    /*
     * Update GUI with given options.
     *
     * @param {Object} - general options for Stock Tools
     */
    update: function (options) {
        merge(true, this.chart.options.stockTools, options);
        this.destroy();
        this.chart.setStockTools(options);

        // If Stock Tools are updated, then bindings should be updated too:
        if (this.chart.navigationBindings) {
            this.chart.navigationBindings.update();
        }
    },
    /*
     * Destroy all HTML GUI elements.
     *
     */
    destroy: function () {
        var stockToolsDiv = this.wrapper,
            parent = stockToolsDiv && stockToolsDiv.parentNode;

        this.eventsToUnbind.forEach(function (unbinder) {
            unbinder();
        });

        // Remove the empty element
        if (parent) {
            parent.removeChild(stockToolsDiv);
        }

        // redraw
        this.chart.isDirtyBox = true;
        this.chart.redraw();
    },
    /*
     * Redraw, GUI requires to verify if the navigation should be visible.
     *
     */
    redraw: function () {
        this.showHideNavigatorion();
    },
    /*
     * Mapping JSON fields to CSS classes.
     *
     */
    classMapping: {
        circle: PREFIX + 'circle-annotation',
        rectangle: PREFIX + 'rectangle-annotation',
        label: PREFIX + 'label-annotation',
        segment: PREFIX + 'segment',
        arrowSegment: PREFIX + 'arrow-segment',
        ray: PREFIX + 'ray',
        arrowRay: PREFIX + 'arrow-ray',
        line: PREFIX + 'infinity-line',
        arrowLine: PREFIX + 'arrow-infinity-line',
        verticalLine: PREFIX + 'vertical-line',
        horizontalLine: PREFIX + 'horizontal-line',
        crooked3: PREFIX + 'crooked3',
        crooked5: PREFIX + 'crooked5',
        elliott3: PREFIX + 'elliott3',
        elliott5: PREFIX + 'elliott5',
        pitchfork: PREFIX + 'pitchfork',
        fibonacci: PREFIX + 'fibonacci',
        parallelChannel: PREFIX + 'parallel-channel',
        measureX: PREFIX + 'measure-x',
        measureY: PREFIX + 'measure-y',
        measureXY: PREFIX + 'measure-xy',
        verticalCounter: PREFIX + 'vertical-counter',
        verticalLabel: PREFIX + 'vertical-label',
        verticalArrow: PREFIX + 'vertical-arrow',
        currentPriceIndicator: PREFIX + 'current-price-indicator',
        indicators: PREFIX + 'indicators',
        flagCirclepin: PREFIX + 'flag-circlepin',
        flagDiamondpin: PREFIX + 'flag-diamondpin',
        flagSquarepin: PREFIX + 'flag-squarepin',
        flagSimplepin: PREFIX + 'flag-simplepin',
        zoomX: PREFIX + 'zoom-x',
        zoomY: PREFIX + 'zoom-y',
        zoomXY: PREFIX + 'zoom-xy',
        typeLine: PREFIX + 'series-type-line',
        typeOHLC: PREFIX + 'series-type-ohlc',
        typeCandlestick: PREFIX + 'series-type-candlestick',
        fullScreen: PREFIX + 'full-screen',
        toggleAnnotations: PREFIX + 'toggle-annotations',
        saveChart: PREFIX + 'save-chart',
        separator: PREFIX + 'separator'
    }
};

// Comunication with bindings:
addEvent(H.NavigationBindings, 'selectButton', function (event) {
    var button = event.button,
        className = PREFIX + 'submenu-wrapper',
        gui = this.chart.stockTools;

    if (gui && gui.guiEnabled) {
        // Unslect other active buttons
        gui.unselectAllButtons(event.button);

        // If clicked on a submenu, select state for it's parent
        if (button.parentNode.className.indexOf(className) >= 0) {
            button = button.parentNode.parentNode;
        }
        // Set active class on the current button
        gui.selectButton(button);
    }
});


addEvent(H.NavigationBindings, 'deselectButton', function (event) {
    var button = event.button,
        className = PREFIX + 'submenu-wrapper',
        gui = this.chart.stockTools;

    if (gui && gui.guiEnabled) {
        // If deselecting a button from a submenu, select state for it's parent
        if (button.parentNode.className.indexOf(className) >= 0) {
            button = button.parentNode.parentNode;
        }
        gui.selectButton(button);
    }
});
