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
    UL = 'ul';

H.setOptions({
    stockTools: {
        gui: {
            enabled: true,
            className: 'stocktools-wrapper',
            toolbarClassName: 'stocktools-toolbar',
            buttons: ['lines', 'separator', 'crookedLines'],
            definitions: {
                lines: {
                    items: ['line', 'segment', 'ray', 'arrowSegment'],
                    className: 'segmend-class',
                    symbol: 'url(https://www.highcharts.com/samples/graphics/save.svg)',
                    segment: {
                        type: 'aaa',
                        label: 'bbb',
                        className: 'segment-class-1',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/feature.svg)'
                    },
                    arrowSegment: {
                        className: 'arrow-class-1',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/sfibonacciun.svg)'
                    },
                    ray: {
                        className: 'ray-class-1',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/rect.svg)'
                    },
                    line: {
                        className: 'line-class-1',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/line.svg)'
                    }
                },
                crookedLines: {
                    items: ['crooked3', 'crooked5', 'elliot3', 'elliot5'],
                    className: 'crooked-class',
                    symbol: 'url(https://www.highcharts.com/samples/graphics/reset.svg)',
                    crooked3: {
                        className: 'segmend-class',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/circle.svg)'
                    },
                    crooked5: {
                        className: 'segmend-class',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/cursor.svg)'
                    },
                    elliot3: {
                        className: 'segmend-class',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/reset.svg)'
                    },
                    elliot5: {
                        className: 'segmend-class',
                        symbol: 'url(https://www.highcharts.com/samples/graphics/flag.svg)'
                    }
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
        submenuWrapper,
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
    // wrapper
    submenuWrapper = createElement(UL, {
        className: 'submenu-wrapper',
        id: 'submenu'
    }, null, wrapper);

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
    stockToolbar.submenuWrapper = submenuWrapper;

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
                if (defs[btn].items.length > 0) {
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
                if (defs[btn].items.length > 0) {
                    addSubmenu.call(_self, button, defs[btn], guiOptions);
                }
            }
        });

        each(buttons, function (btn) {
            if (btn === 'separator') {
                button = addButton(toolbar, 'separator');
            } else {
                button = addButton(toolbar, defs[btn]);
                if (defs[btn].items.length > 0) {
                    addSubmenu.call(_self, button, defs[btn], guiOptions);
                }
            }
        });

        each(buttons, function (btn) {
            if (btn === 'separator') {
                button = addButton(toolbar, 'separator');
            } else {
                button = addButton(toolbar, defs[btn]);
                if (defs[btn].items.length > 0) {
                    addSubmenu.call(_self, button, defs[btn], guiOptions);
                }
            }
        });

        fireEvent('afterInit');
    },
    addSubmenu: function (parentBtn, buttons, guiOptions) {
        var items = buttons.items,
            addButton = this.addButton,
            buttonWidth = getStyle(parentBtn, 'width'),
            submenuWrapper = doc.getElementById('submenu'),
            wrapper = doc.getElementsByClassName(guiOptions.className)[0],
            allButtons = doc
                .getElementsByClassName(
                    guiOptions.toolbarClassName
                )[0].childNodes,
            topMargin = 0;

        this.submenuWrapper = submenuWrapper;

        addEvent(parentBtn, 'click', function () {
            // Erase active class on all other buttons
            each(allButtons, function (btn) {
                if (btn !== parentBtn) {
                    btn.classList.remove('active');
                }
            });

            // show menu
            if (parentBtn.className.indexOf('active') >= 0) {
                parentBtn.classList.remove('active');
                submenuWrapper.style.display = 'none';
            } else {
                submenuWrapper.innerHTML = '';

                each(items, function (btn) {
                    addButton(submenuWrapper, buttons[btn]);
                });

                topMargin = parentBtn.offsetTop;

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

                parentBtn.className += ' active';
            }
        });
    },
    addButton: function (target, options) {
        var button = createElement('li', {
            className: options.className
        }, null, target);

        // TODO: add icons!!!
        if (options === 'separator') {
            css(button, {
                height: '25px',
                cursor: 'default',
                'text-align': 'center'
            });
            // TODO: replace with icon
            button.innerHTML = '. . .';
        } else {
            button.style['background-image'] = options.symbol;
        }

        return button;
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
    }
};
