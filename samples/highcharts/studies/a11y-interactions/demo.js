// ============================================================================
// ============================================================================
// A11y PoC for this dashboard
//
//    +-------------------------------------------------+
// 12 |                     *                           |
// 11 |                    * *                          |
// 10 |                   *   *                         |
//  9 |                  *     *              *         |
//  8 |                 *       *            * *        |
//  7 |                *         *          *   *       |
//  6 |               *           *        *     *      |
//  5 |              *             *      *       *     |
//  4 |             *               *    *         *    |
//  3 |            *                 *  *           *   |
//  2 |           *                   **            *   |
//  1 |          *                                   *  |
//  0 +---------*-------------------------------------*-+
//       0    1    2    3    4    5    6    7    8    9
//
// ============================================================================
// Focus border utils

const focusBorder = document.createElement('div');
Object.assign(focusBorder.style, {
    position: 'absolute',
    display: 'none',
    zIndex: 1,
    pointerEvents: 'none',
    border: '2px solid #000',
    borderRadius: '3px',
    outline: '2px solid #fff'
});
document.body.appendChild(focusBorder);

const showFocusOnEl = el => {
    const bbox = el.getBoundingClientRect(),
        bodyOffset = document.body.getBoundingClientRect();
    Object.assign(focusBorder.style, {
        display: 'block',
        left: bbox.x - bodyOffset.x + 'px',
        top: bbox.y - bodyOffset.y + 'px',
        width: bbox.width + 'px',
        height: bbox.height + 'px'
    });
};
const hideFocus = () => {
    focusBorder.style.display = 'none';
};


// ============================================================================
// Utilities for proxy elements

// Plain element, basic. Used by other proxy functions.
Highcharts.Chart.prototype.addPlainA11yEl =
function (elType, content, parent) {
    const el = document.createElement(elType),
        container = parent || this.proxyContainer;
    Object.assign(el.style, {
        position: 'absolute',
        margin: 0,
        padding: 0
    });
    if (content) {
        el.innerHTML = content;
    }
    container.appendChild(el);
    return el;
};

// SR only element, not touchable, not proxying
Highcharts.Chart.prototype.addSROnly =
function (elType, content, parent) {
    const el = this.addPlainA11yEl(elType, content, parent);
    Object.assign(el.style, {
        width: '1px',
        height: '1px',
        margin: '-1px',
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        clip: 'rect(0 0 0 0)',
        clipPath: 'inset(50%)'
    });
    return el;
};

// Container for touchable proxy elements. Will overflow.
Highcharts.Chart.prototype.addProxyContainerEl =
function (elType, parent) {
    const el = this.addPlainA11yEl(elType, null, parent);
    Object.assign(el.style, {
        width: '1px',
        height: '1px',
        top: 0,
        left: 0,
        whiteSpace: 'nowrap'
    });
    return el;
};

// Add touchable proxy element
Highcharts.Chart.prototype.addProxyEl =
function (svgEl, elType, content, parent) {
    const container = parent || this.proxyContainer,
        el = this.addPlainA11yEl(elType, content, container),
        bbox = svgEl.getBoundingClientRect(),
        containerBBox = container.getBoundingClientRect();

    Object.assign(el.style, {
        left: bbox.x - containerBBox.x + 'px',
        top: bbox.y - containerBBox.y + 'px',
        width: bbox.width + 'px',
        height: bbox.height + 'px',
        overflow: 'hidden'
    });

    [
        'mousedown', 'mouseup', 'mouseover', 'mouseout', 'click',
        'touchstart', 'touchend', 'touchmove', 'touchcancel'
    ].forEach(
        type => el.addEventListener(
            type, e => svgEl.dispatchEvent(new e.constructor(e.type, e))
        )
    );

    return el;
};


// ============================================================================
// Application utils

// Add application with keyboard handlers
Highcharts.Chart.prototype.addA11yApplication =
function (desc, onInit, kbdHandlers) {
    const chart = this,
        chartTitle = chart.options.title.text,
        app = chart.addSROnly('div'),
        fallbackBtn = chart.addSROnly(
            'button',
            `${desc}. Click to interact. ${chartTitle}.`,
            app
        );

    fallbackBtn.setAttribute('tabindex', '-1');
    app.setAttribute('role', 'application');
    app.setAttribute(
        'aria-label', `${chartTitle}. Press Enter to interact with chart.`
    );
    app.setAttribute('tabindex', 0);
    app.onfocus = () => {
        showFocusOnEl(chart.renderTo);
        app.focus();
    };
    app.onblur = hideFocus;

    // Keyboard state handling
    let entered = false;
    app.onkeydown = e => {
        // Let user tab through
        if (e.key === 'Tab') {
            entered = false;
            return;
        }

        // Handle init
        if (!entered && e.key === 'Enter') {
            entered = true;
            onInit(chart);
        } else if (entered && kbdHandlers[e.key]) {
            kbdHandlers[e.key](chart, e);
        }

        // Stop bubbling & default actions
        e.stopPropagation();
        e.preventDefault();
    };

    // Fallback button
    fallbackBtn.onclick = () => {
        app.focus();
        entered = true;
        onInit(chart);
    };
};


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
        clearAnnounceTimeout = setTimeout(
            () => (announcer.innerText = ''),
            3000
        );
    }, delay || 0);
};
document.body.appendChild(announcer);


// ============================================================================
// Historical chart model

const historicalInit = chart => {
    chart.sonification.playNote('piano', { note: 'c4' });
};

const historicalKbdHandlers = {
    Enter: chart => {
        console.log('Enter');
        chart.sonification.playNote('saxophone', { note: 'e4' });
    },
    ' ': () => {},
    ArrowLeft: chart => {
        console.log('ArrowLeft');
        chart.sonification.playNote('trumpet', { note: 'g4' });
    },
    ArrowRight: () => {},
    ArrowUp: () => {},
    ArrowDown: () => {},
    Home: () => {},
    End: () => {},
    PageUp: () => {},
    PageDown: () => {},
    Backspace: () => {},
    Escape: chart => {
        console.log('Escape');
        chart.sonification.playNote('vibraphone', { note: 'b4' });
    },
    '+': () => {},
    '-': () => {}
};


// ============================================================================
// Network graph model

const networkInit = chart => {
    chart.sonification.playNote('lead', { note: 'c4' });
};


// ============================================================================
// Add a11y models for each chart
const a11yModels = {

    // Simple infographic
    delays: chart => {
        const container = chart.addProxyContainerEl('div');
        Highcharts.addEvent(
            chart.series[0], 'afterAnimate',
            () => setTimeout(() => {
                container.innerHTML = '';
                chart.addProxyEl(
                    chart.seriesGroup.element,
                    'p', '77.89% On time. 22.11% Delayed (>15 min).',
                    container
                );
                chart.addSROnly(
                    'p', 'Bar chart with 2 bars.',
                    container
                );
            }, 0)
        );
    },

    // Simple pie chart with HTML overlay
    accidents: chart => {
        chart.addSROnly('p', 'Pie chart with 6 slices.');

        const ol = chart.addProxyContainerEl('ol');
        ol.setAttribute('role', 'list');

        Highcharts.addEvent(
            chart.series[0], 'afterAnimate',
            () => setTimeout(() => {
                ol.innerHTML = '';
                chart.series[0].points.forEach(point => {
                    const li = chart.addProxyEl(
                        point.graphic.element,
                        'li',
                        `${point.name}: ${point.percentage.toFixed(1)}%`,
                        ol
                    );
                    li.setAttribute('tabindex', 0);
                    li.onfocus = () => {
                        point.onMouseOver();
                        showFocusOnEl(li);
                        li.focus();
                    };
                    li.onblur = hideFocus;
                });
            }, 0));
    },

    // Medium complexity line chart
    historical: chart => {
        chart.addA11yApplication(
            'Line chart with 4 lines and 124 data points',
            historicalInit,
            historicalKbdHandlers
        );
    },
    network: chart => {
        chart.addA11yApplication(
            'Network graph',
            networkInit,
            {}
        );
    },
    wordcloud: chart => {}
};


// ============================================================================
// Load models
Highcharts.addEvent(Highcharts.Chart, 'load', function () {
    const chart = this,
        container = chart.container,
        svgBox = chart.renderer.box,
        renderTo = chart.renderTo;

    // Hide chart
    container.setAttribute('role', 'presentation');
    container.setAttribute('aria-hidden', true);
    svgBox.setAttribute('role', 'presentation');

    // Create HTML container & run relevant model
    const proxyContainer = document.createElement('div');
    Object.assign(proxyContainer.style, {
        position: 'relative',
        zIndex: 9999,
        padding: 0,
        margin: '-1px',
        width: '1px',
        height: '1px',
        whiteSpace: 'nowrap',
        opacity: 0,
        border: 0
    });
    chart.proxyContainer = proxyContainer;
    renderTo.insertBefore(proxyContainer, renderTo.firstChild);

    chart.addProxyEl(chart.title.element, 'h2', chart.options.title.text);
    chart.addProxyEl(chart.subtitle.element, 'p', chart.options.subtitle.text);

    a11yModels[renderTo.id](chart);
});


// ============================================================================
// ============================================================================
// Dashboard setup ------------------------------------------------------------
// This is straightforward Highcharts config.

Highcharts.patterns[0].color = '#ccc';
Highcharts.setOptions({
    chart: {
        marginTop: 80
    },
    accessibility: {
        enabled: false
    },
    title: {
        align: 'left'
    },
    credits: {
        enabled: false
    }
});


// Bar chart
Highcharts.chart('delays', {
    chart: {
        type: 'bar',
        marginTop: 40
    },
    title: {
        text: 'Flights delayed on average'
    },
    subtitle: {
        text: 'Source: Bureau of Transportation Statistics'
    },
    xAxis: {
        visible: false
    },
    yAxis: {
        visible: false,
        max: 100,
        endOnTick: false
    },
    legend: {
        enabled: false
    },
    plotOptions: {
        series: {
            stacking: 'percentage',
            borderRadius: 5,
            borderWidth: 3,
            enableMouseTracking: false,
            dataLabels: {
                enabled: true,
                y: 80,
                format: '{series.name}<br><b>{point.y:.2f}%</b>',
                style: {
                    color: '#222',
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series: [{
        name: 'On time',
        color: '#16A27F',
        data: [77.89]
    }, {
        name: 'Delayed (>15 min)',
        color: '#DB3D6D',
        data: [22.11]
    }]
});


// Pie chart
Highcharts.chart('accidents', {
    chart: {
        marginTop: 50,
        marginBottom: 0
    },
    title: {
        text: 'Accident causes for large aircrafts'
    },
    subtitle: {
        text: '2023 numbers. Source: National Transportation Safety Board'
    },
    colors: [
        '#393B3C', '#258AE9', '#E23689', '#B78D1A', '#6D9C82',
        { patternIndex: 0 }
    ],
    tooltip: {
        headerFormat: '',
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        series: {
            innerSize: '50%',
            borderWidth: 3,
            dataLabels: {
                enabled: true,
                format: '{point.name}: {point.percentage:.1f}%'
            }
        }
    },
    series: [{
        type: 'pie',
        data: [
            {
                name: 'Turbulence encounter',
                y: 16,
                dataLabels: {
                    distance: -25,
                    backgroundColor: 'rgba(250, 250, 250, 0.75)',
                    borderRadius: 8,
                    style: {
                        textOutline: 'none',
                        color: '#222',
                        padding: 8
                    }
                }
            },
            ['Abnormal Runway Contact', 6],
            ['System/component failure', 2],
            ['Bird strike', 1],
            ['Ground collision', 1],
            ['Other', 5]
        ]
    }]
});


// Line chart
const historicalData = document.getElementById('historical-data')
    .textContent.split('\n').map(line =>
        line.split(',').map(
            (val, i) => (i ? parseFloat(val) : val)
        )
    );

Highcharts.chart('historical', {
    chart: {
        type: 'spline',
        marginTop: 60
    },
    colors: ['#3B73ED', '#16a34a', '#d97706', '#dc2626'],
    title: {
        text: 'Average airfare prices in the US'
    },
    subtitle: {
        text: 'Source: Bureau of Transportation Statistics'
    },
    yAxis: {
        title: {
            enabled: false
        },
        labels: {
            format: '${value}'
        },
        max: 550,
        endOnTick: false
    },
    plotOptions: {
        series: {
            pointStart: 1993,
            marker: {
                enabled: false
            }
        }
    },
    legend: {
        layout: 'proximate',
        align: 'right',
        verticalAlign: 'middle',
        width: '20%'
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    width: '25%'
                }
            }
        }]
    },
    series: historicalData.slice(1).map(s => ({ name: s[0], data: s.slice(1) }))
});


// Network graph
const links = document.getElementById('airline-routes')
        .textContent.split('\n').map(line => line.split(',')),
    // Define nodes based on links, bigger nodes for more connections
    nodesObj = links.reduce((acc, [src, dest]) => {
        acc[src] = acc[src] || [];
        if (!acc[src].includes(dest)) {
            acc[src].push(dest);
        }
        return acc;
    }, {}),
    maxLen = Math.max(...Object.values(nodesObj).map(val => val.length)),
    colors = ['#0D47A1', '#2D4791', '#1976D2', '#0097A7', '#00796B'],
    nodes = Object.entries(nodesObj).map(([key, val]) => ({
        id: key,
        marker: {
            radius: Math.max(2, Math.round(val.length / maxLen * 20))
        },
        color: colors[Math.round(val.length / maxLen * (colors.length - 1))]
    }));

// Create the chart
Highcharts.chart('network', {
    chart: {
        marginTop: 30
    },
    title: {
        text: 'Airline routes in the US'
    },
    subtitle: {
        text: 'Selected airports and routes<br>Source: OpenFlight'
    },
    series: [{
        type: 'networkgraph',
        keys: ['from', 'to'],
        draggable: false,
        color: colors[0],
        layoutAlgorithm: {
            enableSimulation: true,
            maxIterations: 120,
            approximation: 'barnes-hut',
            integration: 'verlet',
            linkLength: 260,
            friction: -0.6,
            maxSpeed: 0.5,
            repulsiveForce: (d, k) => (k - d) / d * (k > d ? 1 : 0.1)
        },
        link: {
            color: '#689',
            opacity: 0.15
        },
        states: {
            inactive: {
                opacity: 0.3,
                linkOpacity: 0.05
            },
            hover: {
                linkOpacity: 0.5,
                lineWidthPlus: 2,
                halo: false
            }
        },
        dataLabels: {
            enabled: true,
            filter: {
                operator: '>',
                property: 'mass',
                value: 12
            },
            linkFormat: ''
        },
        nodes,
        data: links
    }]
});


// Wordcloud
const wordcloudData = document.getElementById('wordcloud-data')
    .textContent.split('\n').map(line => {
        const arr = line.split(',');
        return [arr[0], parseFloat(arr[1])];
    });

Highcharts.chart('wordcloud', {
    colors: ['#4a5a6a', '#8b6a58', '#3b5c5c', '#7a6b42', '#5e4630', '#2a3b4e'],
    title: {
        text: 'Word cloud of recent travel news'
    },
    subtitle: {
        text: 'From a collection of news articles across the web'
    },
    tooltip: {
        enabled: false
    },
    series: [{
        type: 'wordcloud',
        data: wordcloudData,
        inactiveOtherPoints: true,
        states: {
            inactive: {
                opacity: 0.4
            },
            hover: {
                color: '#222'
            }
        },
        name: 'Occurrences',
        rotation: {
            to: 0
        },
        maxFontSize: 42
    }]
});
