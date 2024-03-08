const chart = Highcharts.chart('container', {
    chart: {
        type: 'column',
        marginTop: 70
    },
    accessibility: {
        screenReaderSection: {
            beforeChartFormat: '<h1>{chartTitle}</h1><p>Interactive bar chart showing total and detailed fruit consumption for 3 persons, with each person\'s total shown as a stacked bar composed of different colors to represent various fruits. Ted consumed 12 units, with a preference for blueberries, Øystein had the most at 13 units with a preference for mangoes, and Marita had 11 units, favoring strawberries.</p><p>There is 1 X axis showing persons, and 1 Y axis showing units of fruits consumed.</p><p>Use tab key to move between chart sections. Use left/right arrow keys to move between bars on the X axis. When on the bars, use the Enter key for more detail, and Backspace for less.</p><p>Sounds play as you navigate the bars. Higher pitched tones indicate higher values.</p>',
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
        },
        reversedStacks: false
    },
    plotOptions: {
        column: {
            stacking: 'normal'
        }
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        reversed: true
    },
    tooltip: {
        pointFormat: '<b><span style="color:{point.color}">●</span> {point.y} {series.name}</b><br>{point.custom.longdesc}'
    },
    series: [{
        name: 'Strawberries',
        data: [{
            y: 3,
            custom: {
                longdesc: '1 from dessert, 2 from salad.'
            }
        }, {
            y: 2,
            custom: {
                longdesc: 'Both from dessert.'
            }
        }, {
            y: 4,
            custom: {
                longdesc: '1 from dessert, 2 from salad, 1 as a snack.'
            }
        }],
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
        data: [{
            y: 1,
            custom: {
                longdesc: 'As a snack.'
            }
        }, {
            y: 4,
            custom: {
                longdesc: '2 as snacks, 2 in salad.'
            }
        }, {
            y: 2,
            custom: {
                longdesc: 'Both from pie.'
            }
        }],
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
        data: [{
            y: 4,
            custom: {
                longdesc: 'All 4 as snacks.'
            }
        }, {
            y: 1,
            custom: {
                longdesc: 'On dessert.'
            }
        }, {
            y: 3,
            custom: {
                longdesc: 'All 3 in salad.'
            }
        }],
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
        data: [{
            y: 2,
            custom: {
                longdesc: 'Both as snacks.'
            }
        }, {
            y: 3,
            custom: {
                longdesc: 'All 3 as snacks.'
            }
        }, {
            y: 1,
            custom: {
                longdesc: 'On dessert.'
            }
        }],
        borderWidth: 2,
        borderColor: '#FFFFFF',
        color: {
            pattern: {
                path: 'M 0 0 L 5 5 M 4.5 -0.5 L 5.5 0.5 M -0.5 4.5 L 0.5 5.5',
                color: '#68a14a',
                backgroundColor: '#68a14a30',
                width: 2.5,
                height: 2.5
            }
        }
    }, {
        name: 'Grapes',
        data: [{
            y: 2,
            custom: {
                longdesc: 'Both as snacks.'
            }
        }, {
            y: 3,
            custom: {
                longdesc: 'All on dessert.'
            }
        }, {
            y: 1,
            custom: {
                longdesc: 'In salad.'
            }
        }],
        color: '#d270a9',
        borderWidth: 2,
        borderColor: '#ffffff'
    }]
});


// Utility function
const play = (instr, note, time, vol) => {
    setTimeout(() =>
        chart.sonification.playNote(instr, {
            note: note,
            noteDuration: 300,
            pan: 0,
            volume: vol || 0.6
        }), time || 0
    );
};

let focusReturnFromHelp;


// ============================================================================
// Announcer
const announcer = document.createElement('div');
announcer.className = 'visually-hidden';
announcer.setAttribute('aria-live', 'assertive');
announcer.setAttribute('aria-hidden', 'false');
let clearAnnounceTimeout, nextAnnounceTimeout;
const announce = (str, delay) => {
    clearTimeout(nextAnnounceTimeout);
    announcer.innerText = '';
    nextAnnounceTimeout = setTimeout(() => {
        clearTimeout(clearAnnounceTimeout);
        announcer.innerText = str;
        clearAnnounceTimeout = setTimeout(() => (announcer.innerText = ''), 3000);
    }, delay || 0);
};
chart.renderTo.appendChild(announcer);


// ============================================================================
// Sound guide

const soundGuide = document.createElement('button');
soundGuide.className = 'sound-button';
soundGuide.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/2/21/Speaker_Icon.svg" alt=""> Sound guide';
soundGuide.setAttribute('aria-label', 'Sound guide, Total fruit consumption');
soundGuide.onclick = () => {
    chart.sonification.speak('Range of tones for bars, values 11 to 13');
    play('flute', 62, 2600);
    play('flute', 66, 3100);

    chart.sonification.speak('Range of tones for bar segments, values 1 to 4', {}, 4200);
    play('vibraphone', 50, 6800);
    play('vibraphone', 58, 7300);
};
chart.renderTo.insertBefore(soundGuide, chart.container);


// ============================================================================
// Help Btn & dialog
const helpBtn = document.createElement('button');
helpBtn.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/8/89/Iconoir_accessibility.svg" alt=""> Keyboard shortcuts';
helpBtn.setAttribute('aria-label', 'Keyboard shortcuts, Total fruit consumption');
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
            <li>Backspace: Drill back up to less details on the data.</li>
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
chart.renderTo.insertBefore(helpBtn, chart.container);
chart.renderTo.insertBefore(helpContent, chart.container);
document.getElementById(closeID).onclick = () => helpContent.close();


// ============================================================================
// Application desc
const desc = document.createElement('button');
desc.innerText = 'Bar chart with 3 bars. Press Tab to interact, or press H for keyboard shortcuts. Total fruit consumption.';
desc.className = 'visually-hidden';
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
        e.preventDefault();
        helpBtn.onclick();
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.onclick();
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
                announce('Bar chart with 3 bars. Press Tab to interact, or press H for keyboard shortcuts. Total fruit consumption.');
                const a11y = chart.accessibility;
                if (a11y) {
                    a11y.keyboardNavigation.tabindexContainer.focus();
                }
            }
        });
    }
});
chart.container.setAttribute('role', 'application');
chart.container.setAttribute('aria-label', 'Total fruit consumption. Press Tab to interact with chart.');


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
                    endPoint = chart.series[0].points[x],
                    startPoint = chart.series[chart.series.length - 1]
                        .points[x];

                if (drill > 1) {
                    const point = chart.highlightedPoint = series.points[x],
                        el = point.graphic.element,
                        labelContent = el.getAttribute('aria-label');

                    el.setAttribute('aria-hidden', 'true');
                    el.removeAttribute('tabindex');
                    el.removeAttribute('aria-label');

                    point.onMouseOver();
                    chart.sonification.playNote(drill === 1 ? 'piano' : 'vibraphone', {
                        note: point.y * 2 + 50,
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
                } else if (drill === 1) {
                    unHighlight();
                    chart.sonification.playNote('flute', {
                        note: startPoint.stackTotal * 2 + 40,
                        noteDuration: 300,
                        pan: 0,
                        volume: 0.6
                    });
                } else {
                    play('flute', 12 * 2 + 40, 0);
                    play('flute', 13 * 2 + 40, 300);
                    play('flute', 11 * 2 + 40, 600);
                    unHighlight();
                }

                // Bar indicator
                component.focusIndicators.forEach(e => e.destroy());

                if (drill) {
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
                } else {
                    component.focusIndicators = [chart.renderer
                        .rect(
                            chart.plotLeft,
                            chart.plotTop,
                            chart.plotWidth,
                            chart.plotHeight,
                            2
                        )
                        .addClass('highcharts-focus-border')
                        .attr({
                            zIndex: 99,
                            stroke: '#446299',
                            'stroke-width': '4px'
                        })
                        .add(chart.seriesGroup)];
                }

                chart.accessibility.keyboardNavigation
                    .tabindexContainer.focus();
            },
            speakDataAtCurrent = drillChange => {
                const { drill, x, y } = component.dataPos,
                    content = component.dataContent[drill][x][y],
                    drillAnnouncement = drillChange ? `Detail level ${drill}. ` : '';
                highlightCurrent();
                announce(drillAnnouncement + (drillChange ?
                    [
                        content + ' Press Enter to interact.',
                        content + ' Use left/right arrow to move between bars, Enter for more detail, or Backspace for less.',
                        content + ' Use up/down arrow to move between segments, left/right to move between bars, Enter for more detail, or Backspace for less.',
                        content + ' Use up/down arrow to move between segments, left/right to move between bars, or Backspace for less detail.'
                    ][drill] : [
                        content + ' Press Enter to interact.',
                        content + ' Use left/right arrow to move between bars, Enter for more detail, or Backspace for less.',
                        content + ' Use up/down arrow to move between segments, left/right to move between bars, Enter for more detail, or Backspace for less.',
                        content + ' Use up/down arrow to move between segments, left/right to move between bars, or Backspace for less detail.'
                    ][drill]
                ), drill ? 300 : 900);
            };


        return new Highcharts.KeyboardNavigationHandler(chart, {
            keyCodeMap: [
                [[keys.space, keys.enter], function () {
                    component.dataPos.drill = Math.min(
                        3, component.dataPos.drill + 1
                    );
                    speakDataAtCurrent(true);
                    return this.response.success;
                }],

                [[keys.esc, 8], function () { // 8 is backspace
                    if (!component.dataPos.drill) {
                        return this.response.prev;
                    }
                    component.dataPos.drill = Math.max(
                        0, component.dataPos.drill - 1
                    );
                    if (component.dataPos.drill < 2) {
                        component.dataPos.y = 0;
                    }
                    if (component.dataPos.drill < 1) {
                        component.dataPos.x = 0;
                    }
                    speakDataAtCurrent(true);
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
                        maxLen = component.dataContent[drill][x].length - 1,
                        dir = keyCode === keys.up ? -1 : 1;

                    if (maxLen) {
                        if (y === 0 && dir < 0 || y === maxLen && dir > 0) {
                            play('chop', 1);
                        } else {
                            component.dataPos.y = clamp(y + dir, 0, maxLen);
                            speakDataAtCurrent();
                        }
                    } else {
                        play('chop', 1);
                        announce('Use left/right arrow to move between bars.', 300);
                    }
                    return this.response.success;
                }],

                [[keys.left, keys.right], function (keyCode) {
                    const { drill, x } = component.dataPos,
                        maxLen = component.dataContent[drill].length - 1,
                        dir = keyCode === keys.right ? 1 : -1;

                    if (x === 0 && dir < 0 || x === maxLen && dir > 0) {
                        play('chop', 1);
                    } else {
                        component.dataPos.x = clamp(x + dir, 0, maxLen);
                        speakDataAtCurrent();
                    }

                    return this.response.success;
                }]
            ],

            init: function () {
                component.focusIndicators = component.focusIndicators || [];
                component.dataContent = [[
                    ['3 bars. Ted, Øystein, Marita.']
                ], [
                    ['Ted, 12 fruits total. Bar 1 of 3 with 5 elements.'],
                    ['Øystein, 13 fruits total. Bar 2 of 3 with 5 elements.'],
                    ['Marita, 11 fruits total. Bar 3 of 3 with 5 elements.']
                ], [
                    ['2 grapes, Ted. 1 of 5 elements.', '2 kiwi, Ted. 2 of 5 elements.', '4 blueberries, Ted. 3 of 5 elements.', '1 mango, Ted. 4 of 5 elements.', '3 strawberries, Ted. 5 of 5 elements.'],
                    ['3 grapes, Øystein. 1 of 5 elements.', '3 kiwi, Øystein. 2 of 5 elements.', '1 blueberries, Øystein. 3 of 5 elements.', '4 mango, Øystein. 4 of 5 elements.', '2 strawberries, Øystein. 5 of 5 elements.'],
                    ['1 grapes, Marita. 1 of 5 elements.', '1 kiwi, Marita. 2 of 5 elements.', '3 blueberries, Marita. 3 of 5 elements.', '2 mango, Marita. 4 of 5 elements.', '4 strawberries, Marita. 5 of 5 elements.']
                ], [
                    ['2 grapes, Ted. Both as snacks. 1 of 5 elements.', '2 kiwi, Ted. Both as snacks. 2 of 5 elements.', '4 blueberries, Ted. All 4 as snacks. 3 of 5 elements.', '1 mango, Ted. As a snack. 4 of 5 elements.', '3 strawberries, Ted. 1 from dessert, 2 from salad. 5 of 5 elements.'],
                    ['3 grapes, Øystein. All on dessert. 1 of 5 elements.', '3 kiwi, Øystein. All 3 as snacks. 2 of 5 elements.', '1 blueberries, Øystein. On dessert. 3 of 5 elements.', '4 mango, Øystein. 2 as snacks, 2 in salad. 4 of 5 elements.', '2 strawberries, Øystein. Both from dessert. 5 of 5 elements.'],
                    ['1 grapes, Marita. In salad. 1 of 5 elements.', '1 kiwi, Marita. On dessert. 2 of 5 elements.', '3 blueberries, Marita. All 3 in salad. 3 of 5 elements.', '2 mango, Marita. Both from pie. 4 of 5 elements.', '4 strawberries, Marita. 1 from dessert, 2 from salad, 1 as a snack. 5 of 5 elements.']
                ]];
                component.dataPos = { x: 0, y: 0, drill: 0 };
                speakDataAtCurrent();
            },

            terminate: function () {
                component.focusIndicators.forEach(e => e.destroy());
                announce('');
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
                desc.setAttribute('aria-hidden', 'false');
                helpBtn.setAttribute('aria-hidden', 'false');
                soundGuide.setAttribute('aria-hidden', 'false');
                helpContent.setAttribute('aria-hidden', 'false');
                chart.container.style.outline = '';
            }
        }
    },
    accessibility: {
        customComponents: {
            customContainer: new CustomContainerComponent(chart),
            customSeriesNav: new CustomSeriesNav(chart)
        },
        keyboardNavigation: {
            order: ['customContainer', 'customSeriesNav']
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
