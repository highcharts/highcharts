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
    each = H.each,
    pick = H.pick,
    isArray = H.isArray,
    fireEvent = H.fireEvent,
    getStyle = H.getStyle,
    merge = H.merge,
    css = H.css,
    DIV = 'div',
    SPAN = 'span',
    UL = 'ul',
    LI = 'li',
    PREFIX = 'highcharts-',
    activeClass = PREFIX + 'active';

H.setOptions({
    lang: {
        /**
         * Configure the stockTools gui strings in the chart. Requires the
         * [stockTools module]() to be loaded. For a description of the module
         * and information on its features, see [Highcharts StockTools]().
         *
         * @since 7.0.0
         * @type {Object}
         * @optionparent lang.stockTools
         */
        stockTools: {
            gui: {
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
                indicators: 'Indicators',
                currentPriceIndicator: 'Current Price Indicators',
                saveChart: 'Save chart',
                circle: 'Circle',
                rectangle: 'Rectangle',
                label: 'Label',
                flagCirclepin: 'Flag circle',
                flagDiamondpin: 'Flag diamond',
                flagSquarepin: 'Flag square',
                flagSimplepin: 'Flag simple',
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
                verticalDoubleArrow: 'Vertical double arrow',
                fibonacci: 'Fibonacci',
                pitchfork: 'Pitchfork',
                'parallel-channel': 'Parallel channel',
                measureXY: 'Measure XY',
                measureX: 'Measure X',
                measureY: 'Measure Y',
                zoomX: 'Zoom X',
                zoomY: 'Zoom Y',
                zoomXY: 'Zooom XY',
                typeOHLC: 'OHLC',
                typeLine: 'Line',
                typeCandlestick: 'Candlestick',
                fill: 'Fill',
                strokeWidth: 'Line width',
                stroke: 'Line color',
                title: 'Title',
                name: 'Name',
                labelOptions: 'Label options',
                backgroundColor: 'Background color',
                backgroundColosr: 'Background colors',
                borderColor: 'Border color',
                borderRadius: 'Border radius',
                borderWidth: 'Border width',
                style: 'Style',
                padding: 'Padding',
                fontSize: 'Font size',
                color: 'Color',
                shapeOptions: 'Shape options',
                typeOptions: 'Details',
                innerBackground: 'Inner background',
                outerBackground: 'Outer background',
                height: 'Height',
                crosshairX: 'Crosshair X',
                crosshairY: 'crosshair Y',
                tunnel: 'Tunnel',
                background: 'Background'
            }
        }
    },
    stockTools: {
        gui: {
            enabled: true,
            className: 'stocktools-wrapper',
            toolbarClassName: 'stocktools-toolbar',
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
                'typeChange',
                'separator',
                'currentPriceIndicator',
                'saveChart'
            ],
            definitions: {
                separator: {
                    symbol: 'url(http://utils.highcharts.local/samples/graphics/separator.svg)'
                },
                simpleShapes: {
                    items: ['circle', 'rectangle', 'label'],
                    circle: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/circle.svg)'
                    },
                    rectangle: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/rectangle.svg)'
                    },
                    label: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/label.svg)'
                    }
                },
                flags: {
                    items: [
                        'flagCirclepin',
                        'flagDiamondpin',
                        'flagSquarepin',
                        'flagSimplepin'
                    ],
                    flagSimplepin: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/flag-basic.svg)'
                    },
                    flagDiamondpin: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/flag-diamond.svg)'
                    },
                    flagSquarepin: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/flag-trapeze.svg)'
                    },
                    flagCirclepin: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/flag-elipse.svg)'
                    }
                },
                lines: {
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
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/segment.svg)'
                    },
                    arrowSegment: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/arrow-segment.svg)'
                    },
                    ray: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/ray.svg)'
                    },
                    arrowRay: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/arrow-ray.svg)'
                    },
                    line: {
                        type: 'aaa',
                        label: 'bbb',
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/line.svg)'
                    },
                    arrowLine: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/arrow-line.svg)'
                    },
                    verticalLine: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/vertical-line.svg)'
                    },
                    horizontalLine: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/horizontal-line.svg)'
                    }
                },
                crookedLines: {
                    items: ['elliott3', 'elliott5', 'crooked3', 'crooked5'],
                    crooked3: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/crooked-3.svg)'
                    },
                    crooked5: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/crooked-5.svg)'
                    },
                    elliott3: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/elliott-3.svg)'
                    },
                    elliott5: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/elliott-5.svg)'
                    }
                },
                verticalLabels: {
                    items: [
                        'verticalCounter',
                        'verticalLabel',
                        'verticalArrow',
                        'verticalDoubleArrow'
                    ],
                    verticalCounter: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/vertical-counter.svg)'
                    },
                    verticalLabel: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/vertical-label.svg)'
                    },
                    verticalArrow: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/vertical-arrow.svg)'
                    },
                    verticalDoubleArrow: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/vertical-double-arrow.svg)'
                    }
                },
                advanced: {
                    items: ['fibonacci', 'pitchfork', 'parallel-channel'],
                    pitchfork: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/pitchfork.svg)'
                    },
                    fibonacci: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/fibonacci.svg)'
                    },
                    'parallel-channel': {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/parallel-channel.svg)'
                    }
                },
                measure: {
                    items: ['measureXY', 'measureX', 'measureY'],
                    measureX: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/measure-x.svg)'
                    },
                    measureY: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/measure-y.svg)'
                    },
                    measureXY: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/measure-xy.svg)'
                    }
                },
                toggleAnnotations: {
                    symbol: 'url(http://utils.highcharts.local/samples/graphics/annotations-visible.svg)'
                },
                currentPriceIndicator: {
                    symbol: 'url(http://utils.highcharts.local/samples/graphics/current-price-show.svg)'
                },
                indicators: {
                    symbol: 'url(http://utils.highcharts.local/samples/graphics/indicators.svg)'
                },
                zoomChange: {
                    items: ['zoomX', 'zoomY', 'zoomXY'],
                    zoomX: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/zoom-x.svg)'
                    },
                    zoomY: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/zoom-y.svg)'
                    },
                    zoomXY: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/zoom-xy.svg)'
                    }
                },
                typeChange: {
                    items: ['typeOHLC', 'typeLine', 'typeCandlestick'],
                    typeOHLC: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/series-ohlc.svg)'
                    },
                    typeLine: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/series-line.svg)'
                    },
                    typeCandlestick: {
                        symbol: 'url(http://utils.highcharts.local/samples/graphics/series-candlestick.svg)'
                    }
                },
                saveChart: {
                    symbol: 'url(http://utils.highcharts.local/samples/graphics/save-storage.svg)'
                }
            }
        }
    }
});

// Run HTML generator
addEvent(H.Chart, 'afterGetContainer', function (options) {
    H.Chart.prototype.setStockTools.call(this, options);
});

addEvent(H.Chart, 'destroy', function () {
    if (this.stockToolbar) {
        this.stockToolbar.destroy();
    }
});

addEvent(H.Chart, 'redraw', function () {
    if (this.stockToolbar) {
        this.stockToolbar.redraw();
    }
});

addEvent(H.Chart, 'update', function (options) {
    if (this.stockToolbar) {
        this.stockToolbar.destroy();
    }

    H.Chart.prototype.setStockTools.call(this, options);
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

    this.visible = pick(options.enabled, true);
    this.placed = false;

    this.createHTML();

    // add popup to main container
    this.popup = new H.Popup(chart.container);
    this.init();

    this.showHideNavigatorion();
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
            paramOptionsGui = options.options && options.options.stockTools,
            guiOptions = merge(
                chartOptions.stockTools && chartOptions.stockTools.gui,
                paramOptionsGui && paramOptionsGui.gui
            ),
            langOptions = lang.stockTools && lang.stockTools.gui;

        if (guiOptions.enabled) {
            this.stockToolbar = new H.Toolbar(guiOptions, langOptions, this);
            this.stockToolbar.setToolbarSpace();
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
            addButton = _self.addButton,
            addSubmenu = _self.addSubmenu,
            buttons = guiOptions.buttons,
            defs = guiOptions.definitions,
            button;

        // create buttons
        each(buttons, function (btnName) {

            button = addButton(toolbar, defs, btnName, lang);

            if (isArray(defs[btnName].items)) {
                // create submenu buttons
                addSubmenu.call(_self, button, defs[btnName]);
            }
        });

        fireEvent(this, 'afterInit');
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
            submenuWrapper,
            submenuItems;

        // create submenu container
        this.submenu = submenuWrapper = createElement(UL, {
            className: PREFIX + 'submenu-wrapper'
        }, null, buttonWrapper);

        // create submenu buttons and select the first one
        this.addSubmenuItems.call(this, buttonWrapper, button);

        // show / hide submenu
        addEvent(submenuArrow, 'click', function () {

            // Erase active class on all other buttons
            _self.eraseActiveButtons(allButtons, buttonWrapper, submenuItems);

            // hide menu
            if (buttonWrapper.className.indexOf(PREFIX + 'current') >= 0) {
                menuWrapper.style.width = '40px';
                buttonWrapper.classList.remove(PREFIX + 'current');
                submenuWrapper.style.display = 'none';
            } else {
                // show menu
                // to calculate height of element
                submenuWrapper.style.display = 'block';

                topMargin = submenuWrapper.offsetHeight -
                            buttonWrapper.offsetHeight - 3;

                // calculate if submenu is in the box, if yes, reset top margin
                if (
                    // cut on the bottom
                    !(submenuWrapper.offsetHeight + buttonWrapper.offsetTop >
                    wrapper.offsetHeight &&
                    // cut on the top
                    buttonWrapper.offsetTop > topMargin)
                ) {
                    topMargin = 0;
                }

                // apply calculated styles
                css(submenuWrapper, {
                    top: -topMargin + 'px',
                    left: buttonWidth + 'px'
                });

                buttonWrapper.className += ' ' + PREFIX + 'current';
                menuWrapper.style.width = '80px';
            }
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
            addButton = this.addButton,
            menuWrapper = this.listWrapper,
            items = button.items,
            firstSubmenuItem,
            submenuBtn;

        // add items to submenu
        each(items, function (btnName) {
            // add buttons to submenu
            submenuBtn = addButton(submenuWrapper, button, btnName, lang);

            addEvent(submenuBtn.mainButton, 'click', function () {
                _self.switchSymbol(this, buttonWrapper, true);
                menuWrapper.style.width = '40px';
                submenuWrapper.style.display = 'none';
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
     * @param {Array} - List of HTML submenus
     *
     */
    eraseActiveButtons: function (buttons, currentButton, submenuItems) {
        each(buttons, function (btn) {
            if (btn !== currentButton) {
                btn.classList.remove(PREFIX + 'current');
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
        var btnOptions = options[btnName],
            items = btnOptions.items,
            classMapping = H.Toolbar.prototype.classMapping,
            userClassName = btnOptions.className || '',
            mainButton,
            submenuArrow,
            buttonWrapper;

        // main button wrapper
        buttonWrapper = createElement(LI, {
            className: classMapping[btnName] + ' ' + userClassName,
            title: lang[btnName]
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
            mainButton.style['background-image'] = btnOptions.symbol;
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
            wrapper = this.wrapper,
            toolbar = this.toolbar,
            step = 0.1 * wrapper.offsetHeight; // 0.1 = 10%

        addEvent(this.arrowUp, 'click', function () {
            if (targetY > 0) {
                targetY -= step;
                toolbar.style['margin-top'] = -targetY + 'px';
            }
        });

        addEvent(this.arrowDown, 'click', function () {
            if (
                wrapper.offsetHeight + targetY <=
                toolbar.offsetHeight + step
            ) {
                targetY += step;
                toolbar.style['margin-top'] = -targetY + 'px';
            }
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
            listWrapper,
            toolbar,
            wrapper;

        // create main container
        stockToolbar.wrapper = wrapper = createElement(DIV, {
            className: PREFIX + 'stocktools-wrapper ' +
                    guiOptions.className
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
            visible,
            showhideBtn;

        // Show hide toolbar
        this.showhideBtn = showhideBtn = createElement(DIV, {
            className: PREFIX + 'toggle-toolbar ' + PREFIX + 'arrow-left'
        }, null, wrapper);

        // toggle menu
        addEvent(showhideBtn, 'click', function () {
            if (toolbar.className.indexOf(PREFIX + 'hide') >= 0) {
                if (submenu) {
                    submenu.style.display = 'block';
                }
                showhideBtn.style.left = '40px';
                stockToolbar.visible = visible = true;
            } else {
                if (submenu) {
                    submenu.style.display = 'none';
                }
                showhideBtn.style.left = '0px';
                stockToolbar.visible = visible = false;
            }
            toolbar.classList.toggle(PREFIX + 'hide');
            showhideBtn.classList.toggle(PREFIX + 'arrow-left');
            showhideBtn.classList.toggle(PREFIX + 'arrow-right');

            chart.update({
                stockTools: {
                    visible: visible
                }
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
        mainNavButton.classList = buttonWrapperClass;

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
            btn.className += ' ' + activeClass;
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

        each(activeButtons, function (activeBtn) {
            if (activeBtn !== btn) {
                activeBtn.classList.remove(activeClass);
            }
        });
    },
    /*
     * Show popup.
     *
     * @param {String} - type of popup (indicator, annotation)
     * @param {Object} - options
     * @param {Function} - callback called when user clicks on button in popup
     *
     */
    showForm: function (type, options, callback) {
        H.Popup.prototype.showForm(type, this.chart, options, callback);
    },
    /*
     * Add / remove space for toolbar.
     *
     */
    setToolbarSpace: function () {

        var marginLeft = this.chart.options.chart.marginLeft || 0,
            stockToolbar = this.chart.stockToolbar;

        if (stockToolbar.visible && !stockToolbar.placed) {

            this.chart.options.chart.marginLeft = marginLeft + 50;
            stockToolbar.placed = true;

        } else if (!stockToolbar.visible && stockToolbar.placed) {

            this.chart.options.chart.marginLeft = marginLeft - 50;
            stockToolbar.placed = false;
        }
    },
    /*
     * Destroy all HTML GUI elements.
     *
     */
    destroy: function () {
        var stockToolsDiv = this.wrapper,
            parent = stockToolsDiv.parentNode,
            chartOptions = this.chart.options,
            marginLeft = chartOptions.chart.marginLeft || 0;

        // Remove the empty element
        if (parent) {
            parent.removeChild(stockToolsDiv);
        }

        // delete stockToolbar reference
        delete this.chart.stockToolbar;

        // remove extra space
        this.chart.options.chart.marginLeft = marginLeft - 50;

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
        'parallel-channel': PREFIX + 'parallel-channel',
        measureX: PREFIX + 'measureX',
        measureY: PREFIX + 'measureY',
        measureXY: PREFIX + 'measureXY',
        verticalCounter: PREFIX + 'vertical-counter',
        verticalLabel: PREFIX + 'vertical-label',
        verticalArrow: PREFIX + 'vertical-arrow',
        verticalDoubleArrow: PREFIX + 'vertical-double-arrow',
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
        toggleAnnotations: PREFIX + 'toggle-annotations',
        saveChart: PREFIX + 'save-chart',
        separator: PREFIX + 'separator'
    }
};
