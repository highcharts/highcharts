const chart = Highcharts.chart('container', {
    chart: {
        type: 'column',
        marginTop: 70
    },
    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<h1>{chartTitle}</h1><p>Interactive bar chart showing total and detailed fruit consumption for 3 persons, with each person\'s total shown as a stacked bar composed of different colors to represent various fruits.</p><p>There is 1 X axis showing persons, and 1 Y axis showing number of fruits consumed.</p>',
            /*
                Ted consumed 12 units, evenly distributed among five fruits,
                Øystein had the most at 13 units with a preference for
                strawberries, and Marita had 11 units, favoring strawberries
                and mango equally.
            */
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
        },
        dataLabels: {
            enabled: true
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
        color: '#ff5757',
        borderWidth: 2,
        borderColor: '#ffffff'
    }, {
        name: 'Mango',
        data: [1, 4, 2],
        color: '#b38f00',
        borderWidth: 2,
        borderColor: '#FFFFFF'
    }, {
        name: 'Blueberries',
        data: [4, 1, 3],
        color: '#369add',
        borderWidth: 2,
        borderColor: '#FFFFFF'
    }, {
        name: 'Kiwi',
        data: [2, 3, 1],
        color: '#68a14a',
        borderWidth: 2,
        borderColor: '#FFFFFF'
    }, {
        name: 'Raspberries',
        data: [2, 3, 1],
        color: '#d270a9',
        borderWidth: 2,
        borderColor: '#ffffff'
    }]
});

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

const helpBtn = document.createElement('button');
helpBtn.setAttribute('aria-label', 'Application, press H for keyboard shortcuts. Total fruit consumption interactive chart.');
helpBtn.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Iconoir_accessibility.svg"> Keyboard shortcuts';
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
    helpBtn.focus();
});

helpBtn.onclick = () => {
    chart.accessibility.keyboardNavigation.blocked = true;
    helpContent.showModal();
};
chart.container.insertBefore(helpBtn, chart.container.firstChild);
chart.container.setAttribute('role', 'application');

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
            },
            speakDataAtCurrent = () => {
                const { drill, x, y } = component.dataPos,
                    content = component.dataContent[drill][x][y];
                highlightCurrent();
                announce(content, 300);
                if (!drill) {
                    announce('Press Enter for details', 3000, false);
                }
            };


        return new Highcharts.KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                [[keys.space, keys.enter], function () {
                    component.dataPos.drill = 1;
                    speakDataAtCurrent();
                    return this.response.success;
                }],

                [[keys.esc], function () {
                    component.dataPos.drill = 0;
                    component.dataPos.y = 0;
                    speakDataAtCurrent();
                    return this.response.success;
                }],

                // H key
                [[72], function () {
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
                    ['Ted, 12 fruits total.'],
                    ['Øystein, 13 fruits total.'],
                    ['Marita, 11 fruits total.']
                ], [
                    ['2 raspberries, Ted.', '2 kiwi, Ted.', '4 blueberries, Ted.', '1 mango, Ted.', '3 strawberries, Ted.'],
                    ['3 raspberries, Øystein.', '3 kiwi, Øystein.', '1 blueberries, Øystein.', '4 mango, Øystein.', '2 strawberries, Øystein.'],
                    ['1 raspberries, Marita.', '1 kiwi, Marita.', '3 blueberries, Marita.', '2 mango, Marita.', '4 strawberries, Marita.']
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


// Update the chart with the new component, also adding it in the keyboard
// navigation order
chart.update({
    chart: {
        events: {
            afterA11yUpdate: function () {
                helpBtn.setAttribute('aria-hidden', 'false');
                helpContent.setAttribute('aria-hidden', 'false');
            }
        }
    },
    accessibility: {
        customComponents: {
            helpBtn: new HelpBtnComponent(chart),
            customSeriesNav: new CustomSeriesNav(chart)
        },
        keyboardNavigation: {
            order: ['helpBtn', 'customSeriesNav']
        }
    }
});

chart.container.setAttribute('aria-label', 'Total fruit consumption, interactive chart.');
chart.container.insertBefore(helpContent, helpBtn.nextSibling);
document.getElementById(closeID).onclick = () => helpContent.close();

document.getElementById('showTable').onclick = function () {
    const table = document.getElementById('highcharts-data-table-0'),
        hidden = table.classList.toggle('hidden');
    this.setAttribute('aria-expanded', !hidden);
};
