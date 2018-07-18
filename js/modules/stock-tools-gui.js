/**
 * GUI generator for Stock tools
 *
 * (c) 2009-2017 Sebastian Bochan
 *
 * License: www.highcharts.com/license
 */
'use strict';
import H from '../parts/Globals.js';

// TODO:
// + submenu
// + use createElement from HC ?
// +- refactoring
// - prototypes
// - icons
// - remove extra buttons

var addEvent = H.addEvent,
    createElement = H.createElement,
    doc = H.doc,
    each = H.each,
    fireEvent = H.fireEvent,
    getStyle = H.getStyle,
    css = H.css,
    DIV = 'div',
    SPAN = 'span',
    UL = 'ul',
    PREFIX = 'highcharts-',
    activeClass = PREFIX + 'active';

H.setOptions({
    stockTools: {
        gui: {
            enabled: true,
            className: 'stocktools-wrapper',
            toolbarClassName: 'stocktools-toolbar',
            buttons: [
                'lines',
                'separator',
                'crookedLines',
                'measure',
                'advanced'
            ],
            definitions: {
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
                    className: 'highcharts-annotations-lines',
                    symbol: 'url(https://www.highcharts.com/samples/graphics/line.svg)',
                    segment: {
                        className: 'highcharts-segment',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/line.svg)'
                    },
                    arrowSegment: {
                        className: 'highcharts-arrow-segment',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/line.svg)'
                    },
                    ray: {
                        className: 'highcharts-ray',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/line.svg)'
                    },
                    arrowRay: {
                        className: 'highcharts-arrow-ray',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/line.svg)'
                    },
                    line: {
                        type: 'aaa',
                        label: 'bbb',
                        className: 'highcharts-infinity-line',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/line.svg)'
                    },
                    arrowLine: {
                        className: 'highcharts-arrow-infinity-line',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/line.svg)'
                    },
                    verticalLine: {
                        className: 'highcharts-vertical-line',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/line.svg)'
                    },
                    horizontalLine: {
                        className: 'highcharts-horizontal-line',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/line.svg)'
                    }
                },
                crookedLines: {
                    items: ['crooked3', 'crooked5', 'elliot3', 'elliot5'],
                    className: 'crooked-class',
                    symbol: 'url(https://www.highcharts.com/samples/graphics/reset.svg)',
                    crooked3: {
                        className: 'segmend-class-1',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/circle.svg)'
                    },
                    crooked5: {
                        className: 'segmend-class-2',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/cursor.svg)'
                    },
                    elliot3: {
                        className: 'segmend-class-3',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/reset.svg)'
                    },
                    elliot5: {
                        className: 'segmend-class-4',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/flag.svg)'
                    }
                },
                advanced: {
                    items: ['fibonacci', 'pitchfork', 'parallel-channel'],
                    className: 'highcharts-advanced',
                    pitchfork: {
                        className: 'highcharts-pitchfork',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/tunnel.svg)'
                    },
                    fibonacci: {
                        className: 'highcharts-fibonacci',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/fibonacci.svg)'
                    },
                    'parallel-channel': {
                        className: 'highcharts-parallel-channel',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/tunnel.svg)'
                    }
                },
                measure: {
                    className: 'highcharts-measure',
                    symbol: 'url(https://www.highcharts.com/samples/graphics/sun.png)'
                }
            }
        }
    }
});

// HTML generator
addEvent(H.Chart.prototype, 'afterInit', function () {
    var chart = this,
        chartOptions = chart.options,
        guiOptions = chartOptions.stockTools && chartOptions.stockTools.gui,
        container = doc.getElementById(chart.renderTo),
        toolbar,
        stockToolbar,
        listWrapper,
        wrapper;

    if (!guiOptions.enabled) {
        return;
    }

    wrapper = createElement(DIV, {
        className: guiOptions.className
    });

    container.parentNode.insertBefore(wrapper, container);
    wrapper.appendChild(container);

    // GENERAL STRUCTURE

    // toolbar
    toolbar = createElement(UL, {
        className: guiOptions.toolbarClassName
    });

    listWrapper = createElement(DIV, {
        className: 'menu-wrapper'
    });

    wrapper.insertBefore(listWrapper, wrapper.childNodes[0]);
    listWrapper.insertBefore(toolbar, listWrapper.childNodes[0]);

    // generate buttons
    chart.stockToolbar = stockToolbar = new H.Toolbar(guiOptions, chart);

    // show hide toolbar
    createElement(DIV, {
        className: 'showhide-showbar'
    }, null, wrapper);

    H.Toolbar.prototype.showHideToolbar();

    // arrows
    // 50px space for arrows
    if (toolbar.offsetHeight > (wrapper.offsetHeight - 50)) {
        // arrow wrapper
        stockToolbar.arrowWrapper = createElement(DIV, {
            className: 'arrow-wrapper'
        });

        stockToolbar.arrowUp = createElement(SPAN, {
            className: 'arrow-up',
            innerHTML: '&rsaquo;'
        }, null, stockToolbar.arrowWrapper);

        stockToolbar.arrowDown = createElement(SPAN, {
            className: 'arrow-down',
            innerHTML: '&lsaquo;'
        }, null, stockToolbar.arrowWrapper);

        wrapper.insertBefore(stockToolbar.arrowWrapper, wrapper.childNodes[0]);
        stockToolbar.scrollButtons(guiOptions);
    }
});

H.Toolbar = function (options, chart) {
    this.init(options, chart);
};

H.Toolbar.prototype = {
    init: function (guiOptions, chart) {
        var _self = this,
            addButton = _self.addButton,
            addSubmenu = _self.addSubmenu,
            toolbar = doc
                .getElementsByClassName(guiOptions.toolbarClassName)[0],
            buttons = guiOptions.buttons,
            defs = guiOptions.definitions,
            button;

        _self.chart = chart;

        each(buttons, function (btn) {
            if (btn === 'separator') {
                button = addButton(toolbar, 'separator');
            } else {
                button = addButton(toolbar, defs[btn]);
                if (defs[btn].items && defs[btn].items.length > 0) {
                    // create submenu buttons
                    addSubmenu.call(_self, button, defs[btn], guiOptions);
                }
            }
        });

        // TO REMOVE -> extra loops for more buttons
        each(buttons, function (btn) {
            if (btn === 'separator') {
                button = addButton(toolbar, 'separator');
            } else {
                button = addButton(toolbar, defs[btn]);
                if (defs[btn].items && defs[btn].items.length > 0) {
                    addSubmenu.call(_self, button, defs[btn], guiOptions);
                }
            }
        });

        each(buttons, function (btn) {
            if (btn === 'separator') {
                button = addButton(toolbar, 'separator');
            } else {
                button = addButton(toolbar, defs[btn]);
                if (defs[btn].items && defs[btn].items.length > 0) {
                    addSubmenu.call(_self, button, defs[btn], guiOptions);
                }
            }
        });

        each(buttons, function (btn) {
            if (btn === 'separator') {
                button = addButton(toolbar, 'separator');
            } else {
                button = addButton(toolbar, defs[btn]);
                if (defs[btn].items && defs[btn].items.length > 0) {
                    addSubmenu.call(_self, button, defs[btn], guiOptions);
                }
            }
        });

        // END OF TO REMOVE SECTION

        fireEvent(this, 'afterInit');
    },
    addSubmenu: function (parentBtn, buttons, guiOptions) {
        var _self = this,
            items = buttons.items,
            addButton = this.addButton,
            submenuArrow = parentBtn.submenuArrow,
            buttonWrapper = parentBtn.buttonWrapper,
            buttonWidth = getStyle(buttonWrapper, 'width'),
            wrapper = doc.getElementsByClassName(guiOptions.className)[0],
            allButtons = doc
                .getElementsByClassName(
                    guiOptions.toolbarClassName
                )[0].childNodes,
            topMargin = 0,
            submenuWrapper,
            firstSubmenuItem,
            submenuItems,
            submenuBtn;

        // create submenu container
        submenuWrapper = createElement(UL, {
            className: 'submenu-wrapper'
        }, null, buttonWrapper);

        // add items to submenu
        each(items, function (btn) {
            // add buttons to submenu
            submenuBtn = addButton(submenuWrapper, buttons[btn]);

            addEvent(submenuBtn.mainButton, 'click', function () {
                _self.switchSymbol(this, buttonWrapper, true);
                submenuWrapper.style.display = 'none';
            });
        });

        firstSubmenuItem = submenuWrapper
                .querySelectorAll('li > .menu-item-btn')[0];

        this.switchSymbol(firstSubmenuItem, false);

        // show / hide submenu
        addEvent(submenuArrow, 'click', function () {
            // Erase active class on all other buttons
            each(allButtons, function (btn) {
                if (btn !== buttonWrapper) {
                    btn.classList.remove('current');
                    submenuItems = btn.querySelectorAll('.submenu-wrapper');

                    if (submenuItems.length > 0) {
                        submenuItems[0].style.display = 'none';
                    }
                }
            });

            // show menu
            if (buttonWrapper.className.indexOf('current') >= 0) {
                buttonWrapper.classList.remove('current');
                submenuWrapper.style.display = 'none';
            } else {

                topMargin = buttonWrapper.offsetTop;

                if (
                    (submenuWrapper.offsetHeight + topMargin) >
                    wrapper.offsetHeight
                ) {
                    topMargin -= (submenuWrapper.offsetHeight + topMargin) -
                        wrapper.offsetHeight;
                }

                css(submenuWrapper, {
                    top: topMargin + 'px',
                    left: buttonWidth + 'px',
                    display: 'block'
                });

                buttonWrapper.className += ' current';
            }
        });
    },
    addButton: function (target, options) {
        var SPAN = 'span',
            LI = 'li',
            items = options.items,
            mainButton,
            submenuArrow,
            buttonWrapper;

        buttonWrapper = createElement(LI, {
            className: options.className
        }, null, target);

        // single button
        mainButton = createElement(SPAN, {
            className: 'menu-item-btn'
        }, null, buttonWrapper);


        // submenu
        if (items && items.length > 1) {

            submenuArrow = createElement(SPAN, {
                className: 'submenu-item-arrow'
            }, null, buttonWrapper);

            // replace with arrow background (add it in CSS class)
            submenuArrow.innerHTML = '>';
        } else {
            mainButton.style['background-image'] = options.symbol;
        }

        // TODO: add icons!!!
        if (options === 'separator') {
            css(mainButton, {
                height: '25px',
                cursor: 'default',
                'text-align': 'center'
            });
            // TODO: replace with icon
            mainButton.innerHTML = '. . .';
        }

        return {
            buttonWrapper: buttonWrapper,
            mainButton: mainButton,
            submenuArrow: submenuArrow
        };
    },
    scrollButtons: function (guiOptions) {
        var toolbar = doc
                .getElementsByClassName(guiOptions.toolbarClassName)[0],
            wrapper = doc.getElementsByClassName(guiOptions.className)[0],
            arrowUp = doc.getElementsByClassName('arrow-up')[0],
            arrowDown = doc.getElementsByClassName('arrow-down')[0],
            toolbarHeight = toolbar.offsetHeight,
            wrapperHeight = wrapper.offsetHeight,
            targetY = 0,
            step = 0.2 * wrapperHeight; // 0.1 = 20%

        addEvent(arrowUp, 'click', function () {
            if (targetY > 0) {
                targetY -= step;
                toolbar.style['margin-top'] = -targetY + 'px';
            }
        });

        addEvent(arrowDown, 'click', function () {
            if (wrapperHeight + targetY < toolbarHeight) {
                targetY += step;
                toolbar.style['margin-top'] = -targetY + 'px';
            }
        });
    },
    showHideToolbar: function () {
        var toolbar = doc.getElementsByClassName('menu-wrapper')[0],
            submenu = doc.getElementById('submenu'),
            showhideBtn = doc.getElementsByClassName('showhide-showbar')[0];

        // replace by icon
        showhideBtn.innerHTML = '<';

        // toggle menu
        addEvent(showhideBtn, 'click', function () {
            if (toolbar.className.indexOf('hide') >= 0) {
                toolbar.classList.remove('hide');
                submenu.style.display = 'block';
                showhideBtn.innerHTML = '<';
            } else {
                toolbar.className += ' hide';
                submenu.style.display = 'none';
                showhideBtn.innerHTML = '>';
            }
        });
    },
    switchSymbol: function (button, redraw) {
        var buttonWrapper = button.parentNode,
            buttonWrapperClass = buttonWrapper.classList.value,
            mainNavButton = buttonWrapper.parentNode.parentNode;
        // set class
        mainNavButton.classList = buttonWrapperClass;

        // set icon
        mainNavButton
            .style['background-image'] = button.style['background-image'];

        // set active class
        if (redraw) {
            this.selectButton(mainNavButton);
        }
    },
    selectButton: function (btn) {
        if (btn.className.indexOf(activeClass) >= 0) {
            btn.classList.remove(activeClass);
        } else {
            btn.className += ' ' + activeClass;
        }
    },
    unselectAllButtons: function (btn) {
        var activeButtons = btn.parentNode.querySelectorAll('.' + activeClass);

        each(activeButtons, function (activeBtn) {
            if (activeBtn !== btn) {
                activeBtn.classList.remove(activeClass);
            }
        });
    }
};
