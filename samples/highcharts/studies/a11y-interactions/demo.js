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
// Dynamic CSS styles used by generated elements (avoids CSP issues)

const hcCSS = new CSSStyleSheet();
hcCSS.replaceSync(`
    .hc-a11y-proxy-container {
        position: relative;
        z-index: 20;
        padding: 0;
        margin: -1px;
        width: 1px;
        height: 1px;
        white-space: nowrap;
        opacity: 0;
        border: 0;

        ol, ul, li {
            list-style-type: none;
        }
    }

    .hc-a11y-sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        margin: -1px;
        overflow: hidden;
        white-space: nowrap;
        clip: rect(0 0 0 0);
        clip-path: inset(50%);
    }

    .hc-a11y-focus-indicator {
        position: absolute;
        display: none;
        z-index: 1;
        pointer-events: none;
        border: 2px solid #000;
        border-radius: 3px;
        outline: 2px solid #fff;
    }

    .hc-a11y-kbd-hint {
        position: absolute;
        display: flex;
        align-items: center;
        z-index: 2;
        margin: 5px;
        transition: opacity 0.3s;
        font-size: 0.7em;
        padding: 8px 12px;
        overflow: hidden;
        pointer-events: none;
        border-radius: 8px;
        background-color: #fff;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
    }

    .hc-a11y-kbd-key {
        border: 1px solid #aaa;
        color: #333;
        padding: 2px 5px;
        border-radius: 4px;
        background-color: #f5f5f8;
        font-size: 0.8em;
        margin: 0 5px;
        font-weight: bold;
    }

    .hc-a11y-kbd-hints-dialog {
        position: absolute;
        padding: 20px;
        margin: 0;
        box-sizing: border-box;
        background-color: #fff;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        border: none;
        font-size: 0.9em;
        overflow-y: auto;

        ul {
            list-style-type: none;
            padding: 0;
        }
        li {
            padding: 5px 0;
            display: flex;
            align-items: center;
        }
        .hc-a11y-kbd-hints-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
            h3 {
                margin: 0;
            }
            button {
                font-size: 1.2em;
                background: none;
                border: none;
                cursor: pointer;
            }
        }
    }

    .hc-a11y-toast {
        position: absolute;
        z-index: 20;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        overflow: hidden;
        transition: opacity 0.3s;
        background-color: rgba(255, 255, 255, 0.6);

        p {
            margin: 0;
            padding: 10px 20px;
            border-radius: 8px;
            background-color: #fff;
            box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
            font-size: 0.8em;
            border: 1px solid #ccc;
            max-width: 300px;
        }
    }

    .hc-a11y-query-dialog {
        position: absolute;
        align-items: center;
        padding: 20px;
        margin: 0;
        box-sizing: border-box;
        background-color: #fff;
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        border: none;
        font-size: 0.9em;
        overflow-y: auto;

        .hc-a11y-query-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            h3 {
                margin: 0;
            }
            button {
                font-size: 1.2em;
                background: none;
                border: none;
                cursor: pointer;
            }
        }

        p {
            max-width: 500px;
            margin: 40px auto 0;
        }

        .hc-a11y-query-inputs {
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 20px 0;
            gap: 10px;

            input {
                padding: 5px;
                border-radius: 4px;
                border: 1px solid #ccc;
                font-size: 0.9em;
            }
        }

        .hc-a11y-query-btn {
            display: block;
            margin: 20px auto;
            padding: 10px 20px;
            border: none;
            border-radius: 6px;
            background-color: #007bff;
            color: #fff;
            cursor: pointer;
            font-size: 1em;
        }

        .hc-a11y-query-result:focus {
            outline: none;
        }
    }

`);
document.adoptedStyleSheets.push(hcCSS);

// Helper function to handle CSS positioning
const setCSSPosToOverlay = (targetEl, sourceEl) => {
    const bbox = sourceEl.getBoundingClientRect(),
        bodyOffset = document.body.getBoundingClientRect();
    Object.assign(targetEl.style, {
        left: bbox.x - bodyOffset.x + 'px',
        top: bbox.y - bodyOffset.y + 'px',
        width: bbox.width + 'px',
        height: bbox.height + 'px'
    });
};


// ============================================================================
// Minimal announcer

const announcer = document.createElement('div');
announcer.className = 'hc-a11y-sr-only';
announcer.setAttribute('aria-live', 'assertive');
announcer.setAttribute('aria-hidden', 'false');
announcer.setAttribute('lang', 'en-US');
document.body.appendChild(announcer);
let clearAnnounceTimeout, nextAnnounceTimeout;

// Announce some text
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

// Cancel next announcement
const cancelNextAnnouncement = () => {
    clearTimeout(nextAnnounceTimeout);
    announcer.innerText = '';
};


// ============================================================================
// Visual toast message

const toastContainer = document.createElement('div'),
    toastMessage = document.createElement('p');
toastContainer.className = 'hc-a11y-toast';
toastContainer.setAttribute('aria-hidden', true);
toastContainer.appendChild(toastMessage);
document.body.appendChild(toastContainer);

// Show a toast message for a chart
const showToast = (chart, message) => {
    setCSSPosToOverlay(toastContainer, chart.renderTo);
    toastMessage.textContent = message;
    toastContainer.style.opacity = 1;
};

const hideToast = () => {
    Object.assign(toastContainer.style, {
        width: '1px',
        height: '1px',
        opacity: 0,
        left: 0
    });
};
document.addEventListener('mousedown', hideToast);


// ============================================================================
// Focus border utils

const focusBorder = document.createElement('div');
focusBorder.className = 'hc-a11y-focus-indicator';
document.body.appendChild(focusBorder);
let focusVisible = false;

// Show a focus border on an element
const showFocusOnEl = el => {
    setCSSPosToOverlay(focusBorder, el);
    focusBorder.style.display = focusVisible ? 'block' : 'none';
};

// Hide current focus border
const hideFocus = () => {
    focusBorder.style.display = 'none';
};

// Show focus only when keyboard navigating
document.addEventListener('keydown', () => (focusVisible = true));
document.addEventListener('mousedown', () => (focusVisible = false));


// ============================================================================
// Keyboard hint tooltip

const kbdHint = (() => {
    const kbdHint = document.createElement('div'),
        keySpan = document.createElement('span'),
        preSpan = document.createElement('span'),
        postSpan = document.createElement('span');
    kbdHint.className = 'hc-a11y-kbd-hint';
    keySpan.className = 'hc-a11y-kbd-key';
    preSpan.textContent = 'Press ';
    keySpan.textContent = 'T';
    postSpan.textContent = ' for tools';
    kbdHint.appendChild(preSpan);
    kbdHint.appendChild(keySpan);
    kbdHint.appendChild(postSpan);
    document.body.appendChild(kbdHint);
    return kbdHint;
})();

let hideKbdHintTimeout,
    kbdHintOwner;

// Show kbd hint on a container
const showKbdHint = el => {
    (kbdHintOwner = el).style.opacity = 0.5; // Dim owner
    clearTimeout(hideKbdHintTimeout);
    setCSSPosToOverlay(kbdHint, el);
    Object.assign(kbdHint.style, {
        opacity: 1,
        width: 'auto',
        height: 'auto'
    });
};

// Hide current kbd hint
const hideKbdHint = () => {
    clearTimeout(hideKbdHintTimeout);
    kbdHint.style.opacity = 0;
    if (kbdHintOwner) {
        kbdHintOwner.style.opacity = 1; // Undim owner
    }
    hideKbdHintTimeout = setTimeout(() => {
        kbdHint.style.width = '1px';
        kbdHint.style.height = '1px';
    }, 300);
};

hideKbdHint();
document.addEventListener('mousedown', hideKbdHint);


// ============================================================================
// Keyboard hints dialog

const kbdHintsDialog = (function buildKbdHintsDialog() {
    const dialog = document.createElement('dialog');
    dialog.className = 'hc-a11y-kbd-hints-dialog';
    document.body.appendChild(dialog);
    return dialog;
}());

const hideKbdHintsDialog = () => kbdHintsDialog.close();

// Show keyboard hints dialog for a container, with list of hints
const showKbdDialog = (parent, hints) => {
    kbdHintsDialog.innerHTML = '';
    const header = document.createElement('div'),
        heading = document.createElement('h3'),
        closeBtn = document.createElement('button'),
        ul = document.createElement('ul');

    header.className = 'hc-a11y-kbd-hints-header';
    heading.textContent = 'Keyboard shortcuts and tools';
    closeBtn.textContent = 'X';
    closeBtn.onclick = hideKbdHintsDialog;
    closeBtn.setAttribute('aria-label', 'Close keyboard shortcuts');
    header.appendChild(heading);
    header.appendChild(closeBtn);
    kbdHintsDialog.appendChild(header);

    ul.setAttribute('role', 'list');
    kbdHintsDialog.appendChild(ul);

    Object.values(hints).forEach(hint => {
        const li = document.createElement('li');
        li.innerHTML = `<span class="hc-a11y-kbd-key">${hint.name}</span>
            <span class="hc-a11y-sr-only">.</span>
            <span>${hint.desc}</span>`;
        if (hint.srOnly) {
            li.className = 'hc-a11y-sr-only';
        }
        ul.appendChild(li);
    });

    const bbox = parent.getBoundingClientRect(),
        bodyOffset = document.body.getBoundingClientRect();

    Object.assign(kbdHintsDialog.style, {
        left: bbox.x - bodyOffset.x + 'px',
        top: bbox.y - bodyOffset.y + 'px',
        height: bbox.height + 'px',
        width: bbox.width + 'px'
    });

    kbdHintsDialog.showModal();
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
        padding: 0,
        border: 0
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
    el.className = 'hc-a11y-sr-only';
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
        setSize = () => {
            const bbox = svgEl.getBoundingClientRect(),
                containerBBox = container.getBoundingClientRect();

            Object.assign(el.style, {
                left: bbox.x - containerBBox.x + 'px',
                top: bbox.y - containerBBox.y + 'px',
                width: bbox.width + 'px',
                height: bbox.height + 'px',
                overflow: 'hidden'
            });
        },
        resizeObserver = new ResizeObserver(setSize);

    resizeObserver.observe(svgEl);
    setSize();

    [
        'mousedown', 'mouseup', 'mouseenter', 'mouseover', 'mouseout',
        'mouseleave', 'click', 'touchstart', 'touchend', 'touchmove',
        'touchcancel'
    ].forEach(
        type => el.addEventListener(
            type, e => svgEl.dispatchEvent(new e.constructor(e.type, e))
        )
    );

    return el;
};

// Handy utility to do something on viewport resize
const onViewportResize = handler => {
    if (window.visualViewport) {
        window.visualViewport.addEventListener('resize', handler);
    }
};


// ============================================================================
// Application utils

// Constantly updated kbd state
const kbdState = {
    series: 0,
    point: 0
};


// Shortcut to highlight current point
Highcharts.Chart.prototype.highlightCurPoint = function () {
    this.series[kbdState.series].points[kbdState.point].onMouseOver();
};


// Add application with keyboard handlers
Highcharts.Chart.prototype.addA11yApplication =
function (onInit, kbdHandlers, kbdDescriptions) {
    const chart = this,
        chartTitle = chart.options.title.text,
        appLabel = `Interactive audio chart. ${chartTitle}. Click to interact.`,
        initNotify = 'Chart. Press T for tools. Use arrow keys to explore.',
        app = chart.addProxyContainerEl('div'),
        fallbackButton = chart.addSROnly(
            'button', `Interact with chart, ${chartTitle}.`, app
        );

    app.style.height = chart.container.clientHeight + 'px';
    app.setAttribute('role', 'application');
    app.setAttribute('aria-label', appLabel);
    app.setAttribute('tabindex', 0);
    app.onfocus = () => {
        showToast(chart, 'Press Enter to explore audio chart.');
        showFocusOnEl(chart.renderTo);
        app.focus();
        announce(appLabel, 10);
    };
    app.onblur = () => {
        hideToast();
        hideFocus();
        chart.sonification.cancel();
    };

    // Keyboard state handling
    let entered = false;
    const init = () => {
        cancelNextAnnouncement();
        entered = true;
        hideToast();
        showKbdHint(chart.renderTo);
        announce(initNotify, 100);
        announce(initNotify, 1500);
        kbdState.series = 0;
        kbdState.point = 0;
        onInit(chart);
    };
    app.onkeydown = e => {
        hideKbdHint();
        hideFocus();
        hideToast();
        const key = (e.key || '').toLowerCase();

        // Let user tab through
        if (key === 'tab') {
            entered = false;
            return;
        }

        // Let user exit
        if (key === 'escape') {
            entered = false;
            chart.sonification.cancel();
            app.onfocus();
            return;
        }

        // Handle init
        if (!entered && (key === 'enter' || key === ' ')) {
            init();
        } else if (entered && key === 't') {
            showKbdDialog(
                chart.renderTo,
                Object.assign({
                    t: {
                        name: 'T',
                        desc: 'Show keyboard shortcuts'
                    }
                }, kbdDescriptions)
            );
        } else if (entered && kbdHandlers[e.key]) {
            kbdHandlers[e.key](chart, e);
        } else if (!entered) {
            return; // Let default actions happen if not entered
        }

        // Stop bubbling & default actions
        e.stopPropagation();
        e.preventDefault();
    };
    app.onclick = e => {
        // Only accept direct clicks, not through-clicks from elements within
        if (e.target === app) {
            app.focus();
            init();
        }
    };
    // Fallback button for screen readers who don't announce the application
    // or won't accept clicks on it.
    fallbackButton.setAttribute('tabindex', -1);
    fallbackButton.onclick = () => {
        app.focus();
        init();
    };
    document.addEventListener('mousedown', () => (entered = false));

    return app;
};


// ============================================================================
// Infographic bar chart model

const delaysModel = chart => {
    const container = chart.addProxyContainerEl('div'),
        overlay = () => {
            container.innerHTML = '';
            chart.addProxyEl(
                chart.seriesGroup.element,
                'p', '77.89% On time. 22.11% Delayed (>15 min).',
                container
            );
            chart.addSROnly(
                'p', 'Bar chart with 2 bars: On time, Delayed.',
                container
            );
        };

    Highcharts.addEvent(
        chart.series[0], 'afterAnimate', () => setTimeout(overlay, 0)
    );
    onViewportResize(overlay);
};


// ============================================================================
// Pie chart model

const accidentsModel = chart => {
    chart.addSROnly('p', 'Pie chart with 6 slices.');

    const ol = chart.addProxyContainerEl('ol');
    ol.setAttribute('role', 'list');

    const overlay = () => {
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
    };

    Highcharts.addEvent(
        chart.series[0], 'afterAnimate', () => setTimeout(overlay, 0)
    );
    onViewportResize(overlay);
};


// ============================================================================
// Historical chart model

const historicalInit = chart => {
    chart.sonification.cancel();
    chart.sonification.playNote('vibraphone', { note: 'c4', tremoloDepth: 0 });
    chart.highlightCurPoint();
};

// Utils
const lineTrend = series => {
    const startY = series.data[0].y,
        endY = series.data[series.data.length - 1].y,
        normalized = (endY - startY) / (series.dataMax - series.dataMin);
    if (Math.abs(normalized) < 0.1) {
        return 'roughly flat';
    }
    if (normalized >= 0.1 && normalized < 0.3) {
        return 'up';
    }
    if (normalized >= 0.3) {
        return 'significantly up';
    }
    if (normalized <= -0.1 && normalized > -0.3) {
        return 'down';
    }
    if (normalized <= -0.3) {
        return 'significantly down';
    }
};
const seriesDesc = s => {
    const maxVal = Math.max(...s.data.map(p => p.y)),
        minVal = Math.min(...s.data.map(p => p.y));
    return `${s.name}. ${s.data.length
    } data points. Overall trending ${
        lineTrend(s)
    }. Highest value is $${
        maxVal}, occuring at ${
        s.points.find(p => p.y === maxVal).x
    }. Lowest value is $${minVal}, occuring at ${
        s.points.find(p => p.y === minVal).x
    }.`;
};

// The handlers
const historicalKbdHandlers = (() => {
    const getCurPoint = chart => chart.sonification.getLastPlayedPoint() ||
        chart.series[0].points[0];

    let prevActionWasLR = false;
    const leftRight = (chart, next) => {
        const prevPoint = getCurPoint(chart);
        chart.sonification.playAdjacent(
            next, e => {
                const p = e.pointsPlayed[0] || prevPoint;
                announce(
                    // Sometimes announce series as well
                    `${prevPoint.series !== p.series || !prevActionWasLR ?
                        p.series.name + ', ' : ''
                    }$${p.y}. ${p.category}`, 600
                );
                setTimeout(() => p.onMouseOver(), 0);
                prevActionWasLR = true;
            }
        );
    };
    const upDown = (chart, next) => {
        const { series: prevSeries, index } = getCurPoint(chart),
            sortedSeries = chart.series.sort(
                (a, b) => b.points[index].y - a.points[index].y
            ),
            ix = sortedSeries.findIndex(s => s === prevSeries),
            nextSeries = sortedSeries[next ? ix + 1 : ix - 1],
            np = nextSeries && nextSeries.points[index];
        if (np) {
            np.sonify(
                () => {
                    announce(
                        `${nextSeries.name}, $${np.y}. ${np.category}`,
                        200
                    );
                    setTimeout(() => np.onMouseOver(), 0);
                });
        } else {
            chart.options.sonification.events.onBoundaryHit({ chart });
        }
    };
    const homeEnd = (chart, end) => {
        const prevPoint = getCurPoint(chart),
            p = prevPoint.series.points[
                end ? prevPoint.series.points.length - 1 : 0];
        p.sonify(() => announce(`$${p.y}. ${p.category}`, 200));
    };
    const pageUpDown = (chart, max) => {
        const series = getCurPoint(chart).series,
            poi = series.points.reduce((acc, p) => {
                if (max) {
                    return p.y > acc.y ? p : acc;
                }
                return p.y < acc.y ? p : acc;
            }, series.points[0]);
        poi.sonify(() => announce(
            `${max ? 'Maximum' : 'Minimum'}, $${poi.y}. ${poi.category}`, 200
        ));
    };

    return {
        ArrowLeft: chart => leftRight(chart, false),
        ArrowRight: chart => leftRight(chart, true),
        ArrowUp: chart => upDown(chart, false),
        ArrowDown: chart => upDown(chart, true),
        Home: chart => homeEnd(chart),
        End: chart => homeEnd(chart, true),
        PageUp: chart => pageUpDown(chart, true),
        PageDown: chart => pageUpDown(chart, false),
        Escape: chart => {
            chart.highlightCurPoint();
            prevActionWasLR = false;
        },

        // Play current line
        a: chart => {
            const p = getCurPoint(chart);
            p.onMouseOver();
            chart.sonification.speak(
                p.series.name, {
                    rate: 1.5
                }, 0,
                () => p.series.sonify()
            );
            prevActionWasLR = false;
        },

        // Read chart summary
        c: chart => {
            const msg = `${chart.options.title.text
            }. Line chart with 4 lines, ${
                chart.series.map(s => s.name).join(', ')
            }.`;
            announce(msg);
            showToast(chart, msg);
            prevActionWasLR = false;
        },

        // Read line summary
        l: chart => {
            const msg = seriesDesc(getCurPoint(chart).series);
            announce(msg);
            showToast(chart, msg);
            prevActionWasLR = false;
        }
    };
})();

const historicalKbdDescriptions = {
    arrows: {
        name: 'Arrows ←↓↑→',
        desc: 'Navigate data'
    },
    a: {
        name: 'A',
        desc: 'Play line as audio (autopilot)'
    },
    PageUp: {
        name: 'PageUp',
        desc: 'Go to highest value for line'
    },
    PageDown: {
        name: 'PageDown',
        desc: 'Go to lowest value for line'
    },
    Home: {
        name: 'Home',
        desc: 'Go to start of line'
    },
    End: {
        name: 'End',
        desc: 'Go to end of line'
    },
    Escape: {
        name: 'Esc',
        desc: 'Exit and stop sound'
    },
    c: {
        name: 'C',
        desc: 'Read summary of chart'
    },
    l: {
        name: 'L',
        desc: 'Read summary of line'
    }
};

const historicalExplanation = chart => {
    chart.addSROnly(
        'p', 'The chart is showing price over time, from 1993 to 2023.'
    );
};

const historicalOverlay = (chart, parent) => {
    const container = chart.addProxyContainerEl('div', parent),
        seriesDescs = chart.series.map(seriesDesc),
        overlay = () => {
            container.innerHTML = '';
            // Short chart desc
            chart.addSROnly('p', 'Line chart with 4 lines.', container);
            // Series descriptions
            const ol = chart.addSROnly('ol', '', container);
            ol.setAttribute('role', 'list');
            seriesDescs.forEach(
                desc => chart.addSROnly('li', desc, ol)
            );
        };

    Highcharts.addEvent(
        chart.series[0], 'afterAnimate', () => setTimeout(overlay, 0)
    );
    onViewportResize(overlay);
};


// ============================================================================
// Network graph model

// Search stuff ---------------------------------------------------------------

const levenshteinDistance = (a, b) => {
    const clean = s => s.toLowerCase().replace(/[^a-z]+/g, ''),
        s = clean(a),
        t = clean(b);
    if (!s.length) {
        return t.length;
    }
    if (!t.length) {
        return s.length;
    }
    const arr = [];
    for (let i = 0; i <= t.length; ++i) {
        arr[i] = [i];
        for (let j = 1; j <= s.length; ++j) {
            arr[i][j] =
          i === 0 ?
              j :
              Math.min(
                  arr[i - 1][j] + 1,
                  arr[i][j - 1] + 1,
                  arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1)
              );
        }
    }
    return arr[t.length][s.length];
};

const nodeFromUserInput = (input, chart) => {
    const bestMatch = chart.precomputedNetwork.reduce(
            (acc, node) => {
                const dist = levenshteinDistance(input, node.name);
                return dist < acc.dist ? { node, dist } : acc;
            }, { node: null, dist: Infinity }
        ),
        pctDistance = bestMatch.dist / input.trim().length;
    return pctDistance < 0.3 ? bestMatch.node : null;
};

const nodesHaveLink = (fromNode, toNode) =>
    fromNode.linksTo.some(l => l.fromNode === toNode) ||
    toNode.linksTo.some(l => l.fromNode === fromNode);

// Query dialog
const queryDialog = document.createElement('dialog');
queryDialog.className = 'hc-a11y-query-dialog';
queryDialog.innerHTML = `
    <div class="hc-a11y-query-header">
        <h3>Search connections in network</h3>
        <button aria-label="Close search dialog">X</button>
    </div>
    <p>
    Find connections between nodes. You can search for a single node to see if
    it exists, or for two nodes to see if they are connected. Enter node names
    in the input fields below.
    </p>
    <div class="hc-a11y-query-inputs">
        <label for="hc-a11y-query-firstnode">First node</label>
        <input id="hc-a11y-query-firstnode" type="text">
        <label for="hc-a11y-query-secondnode">Second node</label>
        <input id="hc-a11y-query-secondnode" type="text">
    </div>
    <button class="hc-a11y-query-btn">Search</button>
    <p class="hc-a11y-query-result" tabindex="-1"></p>
`;
document.body.appendChild(queryDialog);
const dialogClose = queryDialog.querySelector('.hc-a11y-query-header button'),
    queryButton = queryDialog.querySelector('.hc-a11y-query-btn'),
    queryResult = queryDialog.querySelector('.hc-a11y-query-result'),
    fromInput = queryDialog.querySelector('#hc-a11y-query-firstnode'),
    toInput = queryDialog.querySelector('#hc-a11y-query-secondnode');

const showQueryDialog = chart => {
    queryResult.textContent = fromInput.value = toInput.value = '';
    setCSSPosToOverlay(queryDialog, chart.renderTo);
    queryButton.onclick = () => {
        const fromNode = nodeFromUserInput(fromInput.value, chart),
            toNode = nodeFromUserInput(toInput.value, chart),
            play = (note, delay) => chart.sonification.playNote(
                'plucked', { note, volume: 0.5, tremoloDepth: 0 }, delay
            ),
            sad = () => chart.sonification.playNote(
                'chop', { volume: 0.4 }, 200
            ),
            numConn = n => n.linksFrom.length + n.linksTo.length;

        if (!fromNode ^ !toNode) {
            const n = fromNode || toNode,
                bothInputs = fromInput.value.trim() && toInput.value.trim();
            queryResult.textContent = `Node "${
                n.name}" found, with connections to ${
                numConn(n)} other nodes.${
                bothInputs ? ' Could not find other node.' : ''}`;
            play('g4', 200);
        } else if (fromNode && toNode) {
            if (nodesHaveLink(fromNode, toNode)) {
                queryResult.textContent =
                    `Found nodes "${fromNode.name}" and "${toNode.name
                    }" that are directly connected. ${fromNode.name} has ${
                        numConn(fromNode)} connections, and ${
                        toNode.name} has ${numConn(toNode)
                    } connections.`;
                play('e4', 200);
                play('b4', 400);
            } else {
                queryResult.textContent =
                    `Found no direct connection between nodes "${
                        fromNode.name}" and "${toNode.name}".`;
                sad();
            }
        } else {
            queryResult.textContent = 'Nothing found.';
            sad();
        }
        setTimeout(() => queryResult.focus(), 200);
    };

    queryDialog.showModal();
};
const hideQueryDialog = () => queryDialog.close();
dialogClose.onclick = hideQueryDialog;

// Model stuff ----------------------------------------------------------------

const networkInit = chart => {
    chart.sonification.cancel();
    chart.sonification.playNote('vibraphone', { note: 'c4', tremoloDepth: 0 });
    chart.precomputedNetwork[0].onMouseOver();
    kbdState.point = -1;
};

const networkKbdHandlers = (() => {

    let sonificationSchedule = [];
    const clearSonification = () => {
        sonificationSchedule.forEach(clearTimeout);
        sonificationSchedule = [];
    };

    const sonifyNode = (chart, node, tooltip = true) => {
        const maxLinks = chart.precomputedNetwork[0].linksFrom.length +
            chart.precomputedNetwork[0].linksTo.length,
            value = (node.linksFrom.length + node.linksTo.length) / maxLinks;
        chart.sonification.playNote(
            'lead',
            {
                volume: value * value,
                note: 70 - Math.round(value * 40),
                noteDuration: 400 * value,
                tremoloDepth: 0
            }
        );
        if (tooltip) {
            node.onMouseOver();
        } else {
            chart.precomputedNetwork.forEach(
                n => n.setState(
                    n === node ? 'hover' : 'inactive'
                )
            );
        }
    };

    const announceNode = (node, delay) => announce(
        `${node.name}, ${
            node.linksFrom.length + node.linksTo.length
        } connections to other nodes.`, delay);

    const navigate = (chart, direction) => {
        clearSonification();
        const p = chart.precomputedNetwork[kbdState.point + direction];
        if (!p) {
            chart.sonification.playNote('chop', { volume: 0.2 });
            announce('End.', 200);
        } else {
            sonifyNode(chart, p);
            announceNode(p, 300);
            kbdState.point += direction;
        }
    };

    const startEnd = (chart, end) => {
        clearSonification();
        kbdState.point = end ? chart.precomputedNetwork.length - 1 : 0;
        const p = chart.precomputedNetwork[kbdState.point];
        sonifyNode(chart, p);
        announceNode(p, 300);
    };

    return {
        ArrowLeft: chart => navigate(chart, -1),
        ArrowRight: chart => navigate(chart, 1),
        ArrowUp: chart => navigate(chart, -1),
        ArrowDown: chart => navigate(chart, 1),
        Home: chart => startEnd(chart),
        End: chart => startEnd(chart, true),
        a: chart => {
            clearSonification();
            const old = chart.sonification.cancel;
            chart.sonification.cancel = () => {
                clearSonification();
                return old.call(chart.sonification);
            };
            chart.tooltip.hide(0);
            const sonify = () => chart.precomputedNetwork.forEach(
                (node, i) => sonificationSchedule.push(
                    setTimeout(
                        () => sonifyNode(chart, node, false),
                        i * 100 + 200
                    )
                ));
            chart.sonification.speak(
                'Network graph, largest to smallest', {
                    rate: 1.5
                }, 0, sonify
            );
        },
        Escape: clearSonification,
        c: chart => {
            clearSonification();
            const msg = `Network graph with 44 nodes. Top nodes are: ${
                chart.precomputedNetwork
                    .slice(0, 5)
                    .map(n => n.name)
                    .join(', ')
            }.`;
            announce(msg);
            showToast(chart, msg);
        },
        n: chart => {
            const node = chart.precomputedNetwork[Math.max(0, kbdState.point)],
                top = nodes => nodes.slice(0).sort(
                    (a, b) => b.mass - a.mass
                ).slice(0, 5).map(n => n.name).join(', '),
                topConnectionsFrom = top(node.linksFrom.map(l => l.toNode)),
                topConnectionsTo = top(node.linksTo.map(l => l.fromNode)),
                msg = `Top connections from ${node.name} include: ${
                    topConnectionsFrom}. Top connections to ${
                    node.name} include: ${topConnectionsTo}.`;
            announce(msg);
            showToast(chart, msg);
        },
        s: chart => showQueryDialog(chart)
    };
})();

const networkKbdDescriptions = {
    arrows: {
        name: 'Arrows ←↓↑→',
        desc: 'Navigate data, largest to smallest'
    },
    a: {
        name: 'A',
        desc: 'Play network as audio (autopilot), large nodes first'
    },
    s: {
        name: 'S',
        desc: 'Search connections'
    },
    Home: {
        name: 'Home',
        desc: 'Go to largest node'
    },
    End: {
        name: 'End',
        desc: 'Go to smallest node'
    },
    Escape: {
        name: 'Esc',
        desc: 'Exit and stop sound'
    },
    c: {
        name: 'C',
        desc: 'Read summary of chart'
    },
    n: {
        name: 'N',
        desc: 'Read top connections from and to node'
    }
};

const networkExplanation = chart => {
    chart.addSROnly('p', 'Network graph with 44 nodes.');
    const ds = chart.addSROnly('details', `
        <summary>What is a network graph?</summary>
        <p>
        A network graph shows connections. It does this by drawing
        dots and lines, where dots are called "nodes", and the lines
        represent connections between the nodes. The nodes are placed
        around the chart area based on their connections. There are
        no axes, but the size of the nodes and the number of
        connections can be used to understand the data. Nodes closely
        related are also generally placed closer to each other.
        </p>
        <p>
        Network graphs are often used to show relationships 
        between data. One example might be a social network, where
        the nodes are people, and the connections are friendships.
        Such a chart would let us see clusters of friends who know each
        other.
        </p>
    `);
    ds.setAttribute('tabindex', -1);
};

const networkOverlay = (chart, parent) => {
    const container = chart.addProxyContainerEl('div', parent),
        overlay = () => {
            container.innerHTML = '';
            const ol = chart.addProxyContainerEl('ol', container);
            ol.setAttribute('role', 'list');
            // Making use of presorted node list
            chart.precomputedNetwork.forEach(node =>
                chart.addProxyEl(
                    node.graphic.element,
                    'li',
                    `${node.name},
                        ${node.linksFrom.length + node.linksTo.length}
                        connections to other nodes.`,
                    ol
                ));
        };

    Highcharts.addEvent(
        chart.series[0], 'afterSimulation', () => setTimeout(overlay, 0)
    );
    onViewportResize(overlay);
};


// ============================================================================
// Word cloud model

const wordcloudInit = chart => {
    chart.sonification.cancel();
    chart.sonification.playNote('vibraphone', { note: 'c4', tremoloDepth: 0 });
    chart.highlightCurPoint();
    kbdState.point = -1;
};

const wordcloudKbdHandlers = (() => {
    let sonificationSchedule = [];
    const clearSonification = () => {
        sonificationSchedule.forEach(clearTimeout);
        sonificationSchedule = [];
    };

    const sonifyWord = (chart, point) => {
        const maxWeight = chart.series[0].points[0].weight,
            value = point.weight / maxWeight;
        chart.sonification.playNote(
            'vibraphone',
            {
                volume: value,
                note: 70 - Math.round(value * 40),
                noteDuration: 400 * value,
                tremoloDepth: 0,
                pan: Math.random() * 2 - 1
            }
        );
        chart.sonification.speak(
            point.name,
            {
                language: 'en-US',
                name: 'Samantha',
                volume: value * 0.8 + 0.2,
                rate: 2.8 - value * 2,
                pitch: 1.4 - value * 0.8
            },
            50
        );
    };

    const announceWord = (point, delay) => announce(
        `${point.name}, ${point.weight} occurrences.`, delay
    );

    const navigate = (chart, direction) => {
        clearSonification();
        const p = chart.series[0].points[kbdState.point + direction];
        if (!p) {
            chart.sonification.playNote('chop', { volume: 0.2 });
            announce('End.', 200);
        } else {
            sonifyWord(chart, p);
            announceWord(p, 500);
            p.onMouseOver();
            kbdState.point += direction;
        }
    };

    const startEnd = (chart, end) => {
        clearSonification();
        kbdState.point = end ? chart.series[0].points.length - 1 : 0;
        const p = chart.series[0].points[kbdState.point];
        sonifyWord(chart, p);
        p.onMouseOver();
        announceWord(p, 500);
    };

    // Highlight without showing tooltip
    const highlight = point => {
        point.setState('hover');
        setTimeout(() => point.setState('inactive'), 500);
    };

    return {
        ArrowLeft: chart => navigate(chart, -1),
        ArrowRight: chart => navigate(chart, 1),
        ArrowUp: chart => navigate(chart, -1),
        ArrowDown: chart => navigate(chart, 1),
        Home: chart => startEnd(chart),
        End: chart => startEnd(chart, true),
        a: chart => {
            const maxWeight = chart.series[0].points[0].weight;
            clearSonification();
            const old = chart.sonification.cancel;
            chart.sonification.cancel = () => {
                clearSonification();
                return old.call(chart.sonification);
            };
            let time = 100;
            chart.tooltip.hide(0);
            const sonify = () => chart.series[0].points.forEach(p => {
                const value = p.weight / maxWeight;
                sonificationSchedule.push(
                    setTimeout(() => sonifyWord(chart, p), time),
                    setTimeout(() => {
                        if (p === p.series.points[p.series.points.length - 1]) {
                            p.onMouseOver();
                        } else {
                            highlight(p);
                        }
                    }, time)
                );
                time += 100 + value * 530;
            });
            chart.sonification.speak(
                'Word cloud, largest to smallest', {
                    rate: 1.5
                }, 0, sonify
            );
        },
        Escape: clearSonification,
        c: chart => {
            clearSonification();
            const msg = `Word cloud with 100 words. Top words are: ${
                chart.series[0].points
                    .slice(0, 5)
                    .map(n => n.name)
                    .join(', ')
            }.`;
            announce(msg);
            showToast(chart, msg);
        }
    };
})();

const wordcloudKbdDescriptions = {
    arrows: {
        name: 'Arrows ←↓↑→',
        desc: 'Navigate data, largest to smallest'
    },
    a: {
        name: 'A',
        desc: 'Play word cloud as audio (autopilot), large words first'
    },
    Home: {
        name: 'Home',
        desc: 'Go to largest word'
    },
    End: {
        name: 'End',
        desc: 'Go to smallest word'
    },
    Escape: {
        name: 'Esc',
        desc: 'Exit and stop sound'
    },
    c: {
        name: 'C',
        desc: 'Read summary of chart'
    }
};

const wordcloudExplanation = chart => {
    chart.addSROnly('p', 'Word cloud with 100 words.');
    const ds = chart.addSROnly('details', `
        <summary>What is a word cloud?</summary>
        <p>
        A word cloud looks like a cloud of words. The words are scattered around
        the chart area - or laid out in a shape. Words are of varying sizes,
        with the most important words being the largest, and easiest to spot.
        </p>
        <p>
        Word clouds are used to represent text data, for example a news article
        or a book. The size of the words often represent the frequency of the
        word in the text - how often it occurs. The most common words are then
        drawn the largest.
        </p>
        <p>
        By looking at a word cloud, you can quickly get an idea of what the text
        is about, and which words are most important.
        </p>
    `);
    ds.setAttribute('tabindex', -1);
};
const wordcloudOverlay = (chart, parent) => {
    const container = chart.addProxyContainerEl('div', parent),
        overlay = () => {
            container.innerHTML = '';
            const ol = chart.addProxyContainerEl('ol', container);
            ol.setAttribute('role', 'list');
            chart.series[0].points.forEach(point =>
                chart.addProxyEl(
                    point.graphic.element,
                    'li',
                    `${point.name}, size ${point.weight}.`,
                    ol
                ));
        };

    Highcharts.addEvent(
        chart.series[0], 'afterAnimate', () => setTimeout(overlay, 0)
    );
    onViewportResize(overlay);
};


// ============================================================================
// Load models

const a11yModels = {
    delays: delaysModel,
    accidents: accidentsModel,
    historical: chart => {
        historicalExplanation(chart);
        const app = chart.addA11yApplication(
            historicalInit,
            historicalKbdHandlers,
            historicalKbdDescriptions
        );
        historicalOverlay(chart, app);
    },
    network: chart => {
        networkExplanation(chart);

        // Precompute network order
        chart.precomputedNetwork = chart.series[0].nodes.slice(0).sort(
            (a, b) => b.linksFrom.length + b.linksTo.length -
                a.linksFrom.length - a.linksTo.length
        );

        const app = chart.addA11yApplication(
            networkInit,
            networkKbdHandlers,
            networkKbdDescriptions
        );
        networkOverlay(chart, app);
    },
    wordcloud: chart => {
        wordcloudExplanation(chart);
        const app = chart.addA11yApplication(
            wordcloudInit,
            wordcloudKbdHandlers,
            wordcloudKbdDescriptions
        );
        wordcloudOverlay(chart, app);
    }
};

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
    proxyContainer.className = 'hc-a11y-proxy-container';
    chart.proxyContainer = proxyContainer;
    renderTo.insertBefore(proxyContainer, renderTo.firstChild);

    chart.addProxyEl(chart.title.element, 'h2', chart.options.title.text);
    chart.addProxyEl(chart.subtitle.element, 'p', chart.options.subtitle.text);

    a11yModels[renderTo.id](chart);
});

// Avoid jsfiddle/codepen link in demo
setTimeout(() => ['jsfiddle', 'codepen'].forEach(id => {
    const el = document.getElementById(id);
    return el && (el.style.display = 'none');
}), 10);


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
    sonification: {
        defaultInstrumentOptions: {
            instrument: 'basic2',
            mapping: {
                pitch: {
                    min: 'g3',
                    max: 'c6'
                }
            }
        },
        events: {
            onBoundaryHit: e => {
                e.chart.sonification.playNote('chop', { volume: 0.2 });
                announce('End.', 200);
            }
        }
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
    sonification: {
        duration: 16000
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
        width: '20%',
        events: {
            itemClick: () => false
        }
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
    tooltip: {
        format: '<b>{point.id}</b><br>Connections: ' +
            '{add point.linksTo.length point.linksFrom.length}'
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
        followPointer: false,
        positioner: function (lW) {
            const chart = this.chart;
            return {
                x: chart.plotWidth - lW,
                y: 10
            };
        },
        shape: 'rect',
        shadow: false,
        style: {
            fontSize: '1em'
        }
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
