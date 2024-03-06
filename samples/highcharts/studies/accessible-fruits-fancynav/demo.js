const chart = Highcharts.chart('container', {
    chart: {
        type: 'column',
        marginTop: 70
    },
    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<h1>{chartTitle}</h1><p>Interactive bar chart showing total and detailed fruit consumption for 3 persons, with each person\'s total shown as a stacked bar composed of different colors to represent various fruits. Ted consumed 12 units, evenly distributed among five fruits, Øystein had the most at 13 units with a preference for strawberries, and Marita had 11 units, favoring strawberries and mango equally.</p><p>There is 1 X axis showing persons, and 1 Y axis showing number of fruits consumed.</p>',
            afterChartFormat: ''
        },
        landmarkVerbosity: 'disabled'
    },
    lang: {
        accessibility: {
            svgContainerLabel: '',
            chartContainerLabel: ''
        }
    },
    exporting: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    title: {
        text: 'Total fruit consumption',
        align: 'left'
    },
    xAxis: {
        categories: ['Ted', 'Øystein', 'Marita'],
        accessibility: {
            description: 'Persons'
        }
    },
    yAxis: {
        title: {
            text: 'Fruits'
        },
        stackLabels: {
            enabled: true
        }
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },
    series: [{
        name: 'Strawberries',
        data: [3, 2, 4],
        color: {
            pattern: {
                path: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
                color: '#ff4740',
                backgroundColor: '#ff575740',
                width: 4.2,
                height: 4.2
            }
        },
        borderWidth: 2,
        borderColor: '#ffffff'
    }, {
        name: 'Mango',
        data: [1, 4, 2],
        color: {
            pattern: {
                path: 'M 2 0 L 2 5 M 4 0 L 4 5',
                color: '#b38f00',
                backgroundColor: '#b38f0060',
                width: 4,
                height: 4
            }
        },
        borderWidth: 2,
        borderColor: '#FFFFFF'
    }, {
        name: 'Blueberries',
        data: [4, 1, 3],
        color: {
            pattern: {
                path: 'M 0 5 L 5 0 M -0.5 0.5 L 0.5 -0.5 M 4.5 5.5 L 5.5 4.5',
                color: '#369add',
                backgroundColor: '#369add40',
                width: 5,
                height: 3
            }
        },
        borderWidth: 2,
        borderColor: '#FFFFFF'
    }, {
        name: 'Kiwi',
        data: [2, 3, 1],
        borderWidth: 2,
        borderColor: '#FFFFFF',
        color: {
            pattern: {
                path: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
                color: '#68a14a',
                backgroundColor: '#68a14a30',
                width: 3,
                height: 3
            }
        }
    }, {
        name: 'Grapes',
        data: [2, 3, 1],
        color: '#d270a9',
        borderWidth: 2,
        borderColor: '#ffffff'
    }]
});


// ============================================================================
// Announcer
const announcer = document.createElement('div');
announcer.className = 'visually-hidden';
announcer.setAttribute('aria-live', 'assertive');
announcer.setAttribute('aria-hidden', 'false');
let clearAnnounceTimeout, nextAnnounceTimeout;
const announce = (str, delay, clear) => {
    if (clear !== false) {
        clearTimeout(nextAnnounceTimeout);
        announcer.innerText = '';
    }
    nextAnnounceTimeout = setTimeout(() => {
        clearTimeout(clearAnnounceTimeout);
        announcer.innerText = str;
        clearAnnounceTimeout = setTimeout(() => (announcer.innerText = ''), 3000);
    }, delay);
};
chart.renderTo.appendChild(announcer);


let focusReturnFromHelp;

// ============================================================================
// Help Btn & dialog
const helpBtn = document.createElement('button');
helpBtn.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Iconoir_accessibility.svg" alt=""> Keyboard shortcuts';
helpBtn.className = 'hint-button';

const helpContent = document.createElement('dialog'),
    closeID = 'hc-dlg-close-btn' + chart.index;
helpContent.innerHTML = `
    <button id="${closeID}" class="dlg-close">Close</button>
    <div>
        Bar chart, keyboard shortcuts:
        <ul role="list">
            <li>H: Help.</li>
            <li>Tab: Move between chart sections.</li>
            <li>Arrow keys: Move between data points.</li>
            <li>Enter: Drill in to more details on a data point or bar.</li>
            <li>Escape: Drill back up to less details on the data.</li>
        </ul>
    </div>
`;
helpContent.addEventListener('close', () => {
    chart.accessibility.keyboardNavigation.blocked = false;
    if (focusReturnFromHelp) {
        focusReturnFromHelp.focus();
        focusReturnFromHelp = null;
    } else {
        helpBtn.focus();
    }
});

helpBtn.onclick = () => {
    chart.accessibility.keyboardNavigation.blocked = true;
    helpContent.showModal();
};
chart.container.appendChild(helpBtn);
chart.container.appendChild(helpContent);
document.getElementById(closeID).onclick = () => helpContent.close();

const HelpBtnComponent = function (chart) {
    this.initBase(chart);
};
HelpBtnComponent.prototype = new Highcharts.AccessibilityComponent();
Highcharts.extend(HelpBtnComponent.prototype, {
    getKeyboardNavigation: function () {
        const keys = this.keyCodes,
            chart = this.chart,
            component = this;
        return new Highcharts.KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                // Space/enter/H means we click the button
                [[
                    keys.space, keys.enter, 72 /* key === h */
                ], function () {
                    // Fake a click event on the button element
                    component.fakeClickEvent(helpBtn);
                    return this.response.success;
                }]
            ],
            init: function () {
                helpBtn.focus();
            }
        });
    }
});


// ============================================================================
// Application desc
const desc = document.createElement('button');
desc.innerText = 'Bar chart with 3 bars. Press Enter to interact, or press H for keyboard shortcuts. Total fruit consumption.';
desc.className = 'visually-hidden';
desc.setAttribute('aria-hidden', 'false');
desc.onclick = () => {
    const a11y = chart.accessibility;
    if (a11y) {
        a11y.keyboardNavigation.currentModuleIx = 0;
        a11y.keyboardNavigation.modules[0].init();
        a11y.keyboardNavigation.move(1);
    }
};
desc.onkeydown = function (e) {
    if (e.key === 'h') {
        focusReturnFromHelp = desc;
        helpBtn.onclick();
    }
};
chart.container.insertBefore(desc, chart.container.firstChild);


// ============================================================================
// Application
const CustomContainerComponent = function (chart) {
    this.initBase(chart);
};
CustomContainerComponent.prototype = new Highcharts.AccessibilityComponent();
Highcharts.extend(CustomContainerComponent.prototype, {
    getKeyboardNavigation: function () {
        const keys = this.keyCodes,
            chart = this.chart,
            component = this;
        return new Highcharts.KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                // Space/enter means we enter chart
                [[keys.space, keys.enter], function () {
                    return this.response.next;
                }],

                // H key
                [[72], function () {
                    focusReturnFromHelp = chart.container;
                    component.fakeClickEvent(helpBtn);
                    return this.response.success;
                }]
            ],

            init: function () {
                announce('Bar chart with 3 bars. Press Enter to interact, or press H for keyboard shortcuts. Total fruit consumption.');
                const a11y = chart.accessibility;
                if (a11y) {
                    a11y.keyboardNavigation.tabindexContainer.focus();
                }
            }
        });
    }
});
chart.container.setAttribute('role', 'application');
chart.container.setAttribute('aria-label', 'Total fruit consumption.');


// ============================================================================
// Custom series nav
const CustomSeriesNav = function (chart) {
    this.initBase(chart);
};
CustomSeriesNav.prototype = new Highcharts.AccessibilityComponent();
Highcharts.extend(CustomSeriesNav.prototype, {
    getKeyboardNavigation: function () {
        const keys = this.keyCodes,
            chart = this.chart,
            component = this,
            clamp = (value, min, max) => Math.max(min, Math.min(value, max)),
            unHighlight = () => {
                if (chart.tooltip) {
                    chart.tooltip.hide(0);
                }
                if (chart.highlightedPoint &&
                    chart.highlightedPoint.onMouseOut) {
                    chart.highlightedPoint.onMouseOut();
                }
                const hoverSeries = (
                    chart.highlightedPoint && chart.highlightedPoint.series
                );
                if (hoverSeries && hoverSeries.onMouseOut) {
                    hoverSeries.onMouseOut();
                }
                delete chart.highlightedPoint;
            },
            highlightCurrent = () => {
                const { drill, x, y } = component.dataPos,
                    series = chart.series[chart.series.length - 1 - y],
                    startPoint = chart.series[0].points[x],
                    endPoint = chart.series[chart.series.length - 1]
                        .points[x];

                if (drill) {
                    const point = chart.highlightedPoint = series.points[x],
                        el = point.graphic.element,
                        labelContent = el.getAttribute('aria-label');

                    el.setAttribute('aria-hidden', 'true');
                    el.removeAttribute('tabindex');
                    el.removeAttribute('aria-label');

                    point.onMouseOver();
                    chart.sonification.playNote('vibraphone', {
                        note: point.y * 2 + 60,
                        noteDuration: 300,
                        pan: 0,
                        volume: 0.6
                    });

                    if (labelContent) {
                        setTimeout(() => {
                            el.setAttribute('aria-hidden', 'false');
                            el.setAttribute('tabindex', '-1');
                            el.setAttribute('aria-label', labelContent);
                        }, 3000);
                    }
                } else {
                    unHighlight();
                    chart.sonification.playNote('piano', {
                        note: startPoint.stackTotal * 3 + 20,
                        noteDuration: 300,
                        pan: 0,
                        volume: 0.6
                    });
                }

                // Bar indicator
                component.focusIndicators.forEach(e => e.destroy());

                component.focusIndicators = [chart.renderer
                    .rect(
                        startPoint.shapeArgs.x + chart.plotLeft,
                        startPoint.plotY + chart.plotTop,
                        startPoint.shapeArgs.width,
                        endPoint.plotY - startPoint.plotY +
                            endPoint.shapeArgs.height,
                        2
                    )
                    .addClass('highcharts-focus-border')
                    .attr({
                        zIndex: 99,
                        stroke: '#446299',
                        'stroke-width': '4px'
                    })
                    .add(chart.seriesGroup), chart.renderer
                    // -------------------------
                    .rect(
                        startPoint.shapeArgs.x + chart.plotLeft + 1.5,
                        startPoint.plotY + chart.plotTop + 1.5,
                        startPoint.shapeArgs.width - 3,
                        endPoint.plotY - startPoint.plotY +
                            endPoint.shapeArgs.height - 3,
                        2
                    )
                    .addClass('highcharts-focus-border')
                    .attr({
                        zIndex: 99,
                        stroke: '#fff',
                        'stroke-width': '2px'
                    })
                    .add(chart.seriesGroup)
                ];

                chart.accessibility.keyboardNavigation
                    .tabindexContainer.focus();
            },
            speakDataAtCurrent = () => {
                const { drill, x, y } = component.dataPos,
                    content = component.dataContent[drill][x][y];
                highlightCurrent();
                announce(drill ? content : content + ' Press Enter for details.', 300);
            };


        return new Highcharts.KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                [[keys.space, keys.enter], function () {
                    component.dataPos.drill = 1;
                    speakDataAtCurrent();
                    return this.response.success;
                }],

                [[keys.esc], function () {
                    if (!component.dataPos.drill) {
                        return this.response.prev;
                    }
                    component.dataPos.drill = 0;
                    component.dataPos.y = 0;
                    speakDataAtCurrent();
                    return this.response.success;
                }],

                // H key
                [[72], function () {
                    focusReturnFromHelp = chart.container;
                    component.fakeClickEvent(helpBtn);
                    return this.response.prev;
                }],

                [[keys.up, keys.down], function (keyCode) {
                    const { drill, x, y } = component.dataPos,
                        dir = keyCode === keys.up ? 1 : -1;
                    component.dataPos.y = clamp(
                        y + dir, 0, component.dataContent[drill][x].length - 1);
                    speakDataAtCurrent();
                    return this.response.success;
                }],

                [[keys.left, keys.right], function (keyCode) {
                    const { drill, x } = component.dataPos,
                        dir = keyCode === keys.right ? 1 : -1;
                    component.dataPos.x = clamp(
                        x + dir, 0, component.dataContent[drill].length - 1);
                    speakDataAtCurrent();
                    return this.response.success;
                }]
            ],

            init: function () {
                component.focusIndicators = component.focusIndicators || [];
                component.dataContent = [[
                    ['Ted, 12 fruits total. Bar 1 of 3 with 5 elements.'],
                    ['Øystein, 13 fruits total. Bar 2 of 3 with 5 elements.'],
                    ['Marita, 11 fruits total. Bar 3 of 3 with 5 elements.']
                ], [
                    ['2 grapes, Ted. 1 of 5 elements.', '2 kiwi, Ted. 2 of 5 elements.', '4 blueberries, Ted. 3 of 5 elements.', '1 mango, Ted. 4 of 5 elements.', '3 strawberries, Ted. 5 of 5 elements.'],
                    ['3 grapes, Øystein. 1 of 5 elements.', '3 kiwi, Øystein. 2 of 5 elements.', '1 blueberries, Øystein. 3 of 5 elements.', '4 mango, Øystein. 4 of 5 elements.', '2 strawberries, Øystein. 5 of 5 elements.'],
                    ['1 grapes, Marita. 1 of 5 elements.', '1 kiwi, Marita. 2 of 5 elements.', '3 blueberries, Marita. 3 of 5 elements.', '2 mango, Marita. 4 of 5 elements.', '4 strawberries, Marita. 5 of 5 elements.']
                ]];
                component.dataPos = { x: 0, y: 0, drill: 0 };
                speakDataAtCurrent();
            },

            terminate: function () {
                component.focusIndicators.forEach(e => e.destroy());
                announce('', 0);
                unHighlight();
            }
        });
    }
});


// ============================================================================
// Update the chart with the new components, also adding in the keyboard
// navigation order
chart.update({
    chart: {
        events: {
            afterA11yUpdate: function () {
                helpBtn.setAttribute('aria-hidden', 'false');
                helpContent.setAttribute('aria-hidden', 'false');
                chart.container.style.outline = '';
            }
        }
    },
    accessibility: {
        customComponents: {
            customContainer: new CustomContainerComponent(chart),
            helpBtn: new HelpBtnComponent(chart),
            customSeriesNav: new CustomSeriesNav(chart)
        },
        keyboardNavigation: {
            order: ['customContainer', 'customSeriesNav', 'helpBtn']
        }
    }
});


// ============================================================================
// Table
document.getElementById('showTable').onclick = function () {
    const table = document.getElementById('highcharts-data-table-0'),
        hidden = table.classList.toggle('hidden');
    this.setAttribute('aria-expanded', !hidden);
};
