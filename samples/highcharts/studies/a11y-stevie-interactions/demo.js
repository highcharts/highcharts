// ============================================================================
// ============================================================================
// Steve version of the a11y-interactions demo
// ============================================================================
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

    .hc-hidden {
        display: none;
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

    .hc-dialog {
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
        h3 {
            margin: 0;
            &:focus {
                outline: none;
            }
        }
        button.close {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 1.2em;
            background: none;
            border: none;
            cursor: pointer;
        }
        .content {
            position: relative;
            height: 100%;
            display: flex;
            flex-direction: column;
        }
        .inner-content {
            flex: 1;
            min-height: 0;
        }

        button.hc-action {
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

        .hc-warn {
            background-color:#fdf7f8;
            color:rgb(71, 13, 19);
            border-color: #f5c6cb;
            padding: 10px;
            margin: 10px auto;
            max-width: 550px;
        }
    }

    .hc-a11y-find-dialog {
        background-color: rgba(255, 255, 255, 0.7);
        box-shadow: none;
        h3 {
            opacity: 0;
            position: absolute;
        }
        
        .content {
            right: 0;
            top: 0;
            height: auto;
            flex-direction: row;
            justify-content: flex-end;
        }
        
        .inner-content {
            flex: none;
            search {
                position: relative;
            }
            input {
                font-size: 0.8em;
                padding: 5px;
                width: 11em;
                padding-right: 3em;
                border: none;
            }
            label {
                position: absolute;
                left: 3px;
                top: 2.5em;
                font-size: 0.8em;
            }
            button {
                background: none;
                border: none;
                cursor: pointer;
                padding: 3px;
                margin: 0;
                position: absolute;
                right: 1.25em;
                top: 1px;
                width: 1.7em;
            }
        }

        button.close {
            font-size: 1em;
            right: 3px;
            top: 4px;
        }
    }

    .hc-a11y-ai-dialog {
        .hc-ai-result {
            max-width: 500px;
            margin: 20px auto;
        }
        .inner-content {
            overflow-y: scroll;
        }
    }

    .hc-a11y-kbd-hints-dialog {
        ul {
            display: flex;
            flex: 1;
            flex-flow: column wrap;
            gap: 5px;
        }
        li {
            padding: 5px 0;
            display: flex;
            align-items: center;
        }
        .inner-content {
            display: flex;
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

    .hc-a11y-table {
        --bg-color: #ffffff;
        --text-color: #333;
        --border-color: #ddd;
        --header-bg: #f8f9fa;
        --row-alt-bg: #f1f3f5;
        --hover-bg: #e9ecef;

        .inner-content {
            overflow-y: scroll;
        }
        table {
            margin-top: 20px;
            width: 100%;
            border-collapse: collapse;
            background: var(--bg-color);
            color: var(--text-color);
            border: 1px solid var(--border-color);
            border-radius: 8px;
            overflow: hidden;
        }
        thead {
            background: var(--header-bg);
        }
        th, td {
            padding: 12px 16px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        tbody tr:nth-child(even) {
            background: var(--row-alt-bg);
        }
        tbody tr:hover {
            background: var(--hover-bg);
        }
        th {
            font-weight: 600;
        }
        th[scope="col"] {
            text-align: left;
        }
    }

    @media (prefers-color-scheme: dark) {
        .hc-dialog,
        .hc-a11y-kbd-hint {
            background-color: #333;
            color: #fff;
            border: 1px solid #555;
        }

        .hc-a11y-toast {
            background-color: rgba(0, 0, 0, 0.6);

            p {
                box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);
                border: 1px solid #888;
            }
        }

        .hc-dialog button.close {
            color: #fff;
        }

        .hc-a11y-find-dialog {
            background-color: rgba(0, 0, 0, 0.7);
            input {
                color: #fff;
                background-color: #333;
            }
            button {
                color: #fff;
            }
            .hc-action {
                filter: invert(1);
            }
        }

        .hc-a11y-query-dialog select {
            color: #fff;
        }

        .hc-a11y-table {
            --bg-color: #1e1e1e;
            --text-color: #f1f1f1;
            --border-color: #444;
            --header-bg: #2a2a2a;
            --row-alt-bg: #242424;
            --hover-bg: #333;
        }
    }
`);
document.adoptedStyleSheets.push(hcCSS);

// Helper function to handle CSS positioning
const setCSSPosToOverlay = (targetEl, sourceEl, attrs, margin) => {
    const setSize = () => {
            const bbox = sourceEl.getBoundingClientRect(),
                bodyOffset = document.body.getBoundingClientRect(),
                attributes = Object.assign({
                    left: bbox.x - bodyOffset.x - margin + 'px',
                    top: bbox.y - bodyOffset.y - margin + 'px',
                    width: bbox.width + 2 * margin + 'px',
                    height: bbox.height + 2 * margin + 'px'
                }, attrs || {});
            Object.assign(targetEl.style, attributes);
        },
        resizeObserver = new ResizeObserver(setSize);

    resizeObserver.observe(sourceEl);
    setSize();
};


// ============================================================================
// Toggleable settings

const settings = {
    muteSounds: false,
    playSpeed: {
        states: ['Slow', 'Normal', 'Fast'],
        current: 1
    }
};

const toggleSetting = settingName => {
    const setting = settings[settingName];
    if (typeof setting === 'boolean') {
        return (settings[settingName] = !setting);
    }
    // Tristate (or multi-state) toggle
    return setting.states[(
        setting.current = (setting.current + 1) % setting.states.length
    )];
};

const getSettingValue = settingName => {
    const setting = settings[settingName];
    if (typeof setting === 'object' && setting.states) {
        return setting.states[setting.current];
    }
    return setting;
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
// Dialog features

const createDialog = (heading, content, className) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'hc-dialog ' + className;
    dialog.innerHTML = `
        <div class="content" role="document" lang="en">
            <h3 tabindex="-1" autofocus>${heading}</h3>
            <div class="inner-content">${content}</div>
            <button class="close" aria-label="Close dialog">X</button>
        </div>`;
    document.body.appendChild(dialog);
    dialog.querySelector('button.close').onclick = () => dialog.close();
    return dialog;
};

// Set to true if app focus should avoid announcements on dialog close
let fromCloseDialog = false;


// ============================================================================
// Kbd hints dialog

const kbdHintsDialog = createDialog(
        'Keyboard shortcuts and tools', '', 'hc-a11y-kbd-hints-dialog'
    ),
    showKbdDialog = (parent, hints) => {
        kbdHintsDialog.querySelector('.inner-content').innerHTML = `
            <ul role="list">
                ${Object.values(hints).map(hint => `
                    <li${hint.srOnly ? ' class="hc-a11y-sr-only"' : ''}>
                        <span class="hc-a11y-kbd-key"
                            ${hint.srName ? 'aria-hidden="true"' : ''}
                            >${hint.name}</span>
                        <span class="hc-a11y-sr-only"
                            >${hint.srName || ''}.</span>
                        <span>${hint.desc}</span>
                    </li>
                `).join('')}
            </ul>`;
        setCSSPosToOverlay(kbdHintsDialog, parent);
        kbdHintsDialog.showModal();
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
// Data table dialog

const dataTableDialog = createDialog('Data table', '', 'hc-a11y-table'),
    showTableDialog = chart => {
        dataTableDialog.querySelector('h3').textContent =
            'Data table for ' + chart.options.title.text;
        dataTableDialog.querySelector('.inner-content').innerHTML = `
    <table>
        <thead>
        <tr>
            <th scope="col">Year</th>
            ${chart.series.map(s => `<th scope="col">${s.name}</th>`).join('')}
        </tr>
        </thead>
        <tbody>
        ${chart.series[0].points.map((point, i) => `
        <tr>
            <th scope="row">${point.x}</th>
            ${chart.series.map(s => `<td>$${s.data[i].y}</td>`).join('')}
        </tr>
        `).join('')}
        </table>`;
        setCSSPosToOverlay(dataTableDialog, chart.renderTo);
        dataTableDialog.showModal();
    };


// ============================================================================
// Focus border utils

const focusBorder = document.createElement('div');
focusBorder.className = 'hc-a11y-focus-indicator';
document.body.appendChild(focusBorder);
let focusVisible = false;

// Show a focus border on an element
const showFocusOnEl = el => {
    setCSSPosToOverlay(focusBorder, el, {}, 8);
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

const kbdHint = document.createElement('div');
kbdHint.className = 'hc-a11y-kbd-hint';
kbdHint.innerHTML = `<span>Press <span
    class="hc-a11y-kbd-key">T</span> for tools</span>`;
document.body.appendChild(kbdHint);

let hideKbdHintTimeout,
    kbdHintOwner;

// Show kbd hint on a container
const showKbdHint = el => {
    (kbdHintOwner = el).style.opacity = 0.5; // Dim owner
    clearTimeout(hideKbdHintTimeout);
    setCSSPosToOverlay(kbdHint, el, {
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
                overflow: 'hidden',
                tabindex: '-1'
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
            type, e => {
                svgEl.dispatchEvent(new e.constructor(e.type, e));
                e.stopPropagation();
                e.preventDefault();
            }
        )
    );

    return el;
};


// ============================================================================
// Find in chart

const levenshteinDistance = (a, b) => {
    const s = a.toLowerCase(),
        t = b.toLowerCase();
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


// Find a point in the chart by text search
Highcharts.Chart.prototype.findPointByText = function (text) {
    const input = text.trim().toLowerCase(),
        pointDesc = point => ((
            (point.name || point.x) ?? point.series.name
        ) + '').trim().toLowerCase();

    // Find the best matching point
    const bestPointMatch = this.series.flatMap(s => s.nodes || s.points)
        .reduce((best, point) => {
            const pDesc = pointDesc(point);
            if (pDesc.indexOf(input) > -1) {
                return best.distance > 0 ? { distance: 0, point } : best;
            }
            const d = levenshteinDistance(input, pDesc);
            return d < best.distance ? { distance: d, point } : best;
        }, { distance: Infinity, point: null });

    const pctDistance = bestPointMatch.distance / input.length;
    if (pctDistance < 0.2) {
        return bestPointMatch.point;
    }

    // Check if we may be searching for a series name
    const bestSeriesMatch = this.series.reduce((best, series) => {
        const sDesc = series.name.trim().toLowerCase();
        if (sDesc.indexOf(input) > -1) {
            return { distance: 0, series };
        }
        const d = levenshteinDistance(input, sDesc);
        return d < best.distance ? { distance: d, series } : best;
    }, { distance: Infinity, series: null });

    const pctSeriesDistance = bestSeriesMatch.distance / input.length;
    return pctSeriesDistance < 0.3 ?
        bestSeriesMatch.series.nodes?.[0] ||
        bestSeriesMatch.series.points?.[0] :
        null;
};


// ============================================================================
// Find dialog

const findDialog = createDialog(
        /* eslint-disable max-len */
        'Find in chart', `
        <search title="Chart">
            <label for="hc-a11y-find">Find in chart</label>
            <input autofocus type="text" id="hc-a11y-find">
            <button class="hc-action" aria-label="search">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="100%" height="100%">
                    <path d="M0 0h24v24H0z" fill="none"/>
                    <path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
                </svg>
            </button>
        </search>
        `, 'hc-a11y-find-dialog'
        /* eslint-enable max-len */
    ),
    findBtn = findDialog.querySelector('button.hc-action'),
    findInput = findDialog.querySelector('input');

findInput.onkeydown = e => {
    if (e.key === 'Enter' && findInput.value) {
        findBtn.click();
    }
};

const showFindDialog = (chart, onHit) => {
    const closeDlg = () => {
        findDialog.close();
        setTimeout(() => {
            hideKbdHint();
            hideFocus();
        }, 100);
    };
    fromCloseDialog = true; // Avoid onfocus announcement on dialog close
    findInput.value = '';
    findBtn.onclick = () => {
        const point = chart.findPointByText(findInput.value);
        if (point) {
            closeDlg();
            setTimeout(() => onHit(point), 200);
        } else {
            closeDlg();
            setTimeout(() => announce('No match found'), 150);
            showToast(chart, 'No match found');
        }
    };
    setCSSPosToOverlay(findDialog, chart.renderTo);
    findDialog.showModal();
    findInput.focus();
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
function (onInit, kbdHandlers, kbdDescriptions, exitEl) {
    const chart = this,
        chartTitle = chart.options.title.text,
        initNotify = 'In chart. Press T for tools and help. ' +
            'Use arrow keys to explore.',
        appLabel = `Interactive audio chart. ${
            chartTitle}. Press Enter to interact.`,
        app = chart.addProxyContainerEl('div'),
        fallbackButton = chart.addSROnly(
            'button', `Interact with chart, ${chartTitle}.`, app
        );

    if (exitEl.getAttribute('tabindex') === null) {
        exitEl.setAttribute('tabindex', -1);
    }

    app.style.height = chart.container.clientHeight + 'px';
    app.setAttribute('role', 'application');
    app.setAttribute('aria-label', appLabel);
    app.setAttribute('tabindex', 0);

    // Keyboard state handling
    let oneShotAnnouncement;
    const init = () => {
        cancelNextAnnouncement();
        hideToast();
        showKbdHint(chart.renderTo);
        announce(initNotify, 100);
        announce(initNotify, 1500);
        kbdState.series = 0;
        kbdState.point = 0;
        onInit(chart);
    };
    app.onfocus = () => {
        if (fromCloseDialog) {
            fromCloseDialog = false;
            return;
        }
        showFocusOnEl(chart.renderTo);
        app.focus();
        init();
    };
    app.onblur = () => {
        hideToast();
        hideFocus();
        chart.sonification.cancel();
    };
    app.onkeydown = e => {
        if (oneShotAnnouncement !== null) {
            clearTimeout(oneShotAnnouncement);
            oneShotAnnouncement = setTimeout(() => {
                if (oneShotAnnouncement !== null) {
                    announce(initNotify);
                }
                oneShotAnnouncement = null;
            }, 6000);
        }
        hideKbdHint();
        hideFocus();
        hideToast();
        const key = (e.key || '').toLowerCase();

        // Let user tab through
        if (key === 'tab') {
            return;
        }

        // Let user exit
        if (key === 'escape') {
            chart.sonification.cancel();
            if (kbdHandlers.Escape) {
                kbdHandlers.Escape(chart, e);
            }
            exitEl.focus();
            return;
        }

        if (key === 't') {
            oneShotAnnouncement = null;
            showKbdDialog(
                chart.renderTo,
                {
                    t: {
                        name: 'T',
                        desc: 'Show keyboard shortcuts'
                    },
                    ...kbdDescriptions,
                    esc: {
                        name: 'Escape',
                        desc: 'Exit and stop sound'
                    }
                }
            );
        } else if (kbdHandlers[e.key]) {
            if (e.key.indexOf('Arrow') < 0) {
                oneShotAnnouncement = null;
            }
            kbdHandlers[e.key](chart, e);
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
    fallbackButton.onkeydown = function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
            this.onclick();
        }
    };

    return app;
};


// ============================================================================
// LLM - fake generator, for testing purposes
// Generated with 4o-mini, in json_schema using the following system prompt:
/*
    You are an expert in data visualization and analytics. You excel at
    describing complex data in a way that is easy to understand. You are asked
    to describe a chart to someone who is visually impaired, and may not be
    able to see the chart. The user does not care much about the appearance of
    the chart, but they do want to gain insights from the data.

    ## Description format:

    Your descriptions are structured as follows:
        - You start with a very brief summary of the purpose of the chart,
        what the chart is showing.
        - You give a brief overview of the structure of the chart, for
        example the chart type, axes, the number of data points and the
        range of values.
        - If the data supports it, you then give in a single sentence,
        the single most important insight someone will gain from the chart.
        - If the data supports it, you follow this up with more detailed
        insights, explaining the main learnings one can take away from the
        chart. You make connections to current and past events to explain
        the data, but make a clear distinction between the data and your
        interpretation. You never make up insights.

    ## Further rules:

    If you do not have sufficient data to provide insights, leave them
    out entirely. Instead focus on the data description without speculation.

    Use clear, accessible language that avoids reliance on visual metaphors.

    ## Important background:

    You know that the charts are built with Highcharts, which may affect
    how you interpret series types and terminology. You do not disclose
    this to the user unless asked. You translate Highcharts terminology to
    something understandable by the general public. For example, a "spline"
    or "area" chart would be considered a line chart for most people.

    ## Output format:

    You reply with only the description. The reply is formatted as valid
    JSON, with a single "description" child, so that it may be picked up for
    further processing. Example:
    {
        "description": "This line chart shows..."
    }
    Return only the JSON object, with no additional text, explanations, or
    formatting
*/
// Line charts with >100 data points are simplified before sending in. In this
// case, we added the following to the prompt:
/*
    The data has been simplified to make it easier to process. Small
    fluctuations in the data have been removed, while keeping the main
    trends. This may cause gaps in the data that are not present in what
    the user sees. You do not disclose this simplification to the user
    unless asked, but use the simplified data to the best of your ability.
*/
// Data sent in was in JSON form as well, containing data points, axis info,
// type info, and titles.

const descriptions = {
    column: `This line chart shows the average airfare prices in the US from
    1993 to 2023 for four different cities: New York (JFK), Houston
    (Intercontinental), Phoenix, and Las Vegas. The x-axis represents the years,
    ranging from 1993 to 2023, while the y-axis indicates the average airfare
    prices, with values ranging from 100 to 550 dollars. There are 31 data
    points for each city over the specified period. The most important
    insight is that airfare prices have generally increased over time, with
    significant variations among the cities. Detailed insights reveal that New
    York consistently has the highest average airfare, peaking in 2000 at around
    455 dollars and showing moderate fluctuations afterwards. Houston's prices
    have varied with a peak in 2012 at approximately 507 dollars. Phoenix has
    seen a lower range of fares compared to the other cities, with its highest
    in 2023 at about 374 dollars, while Las Vegas has maintained the lowest
    prices throughout, starting from under 150 dollars in 1993 and peaking
    around 272 dollars in 2023.`
};

const describeChartWithLLM = async chart => new Promise(resolve =>
    setTimeout(() => resolve(descriptions[chart.series[0].type]), 3000)
);

const llmDialog = createDialog('AI description', '', 'hc-a11y-ai-dialog'),
    showLLMDialog = chart => {
        const desc = chart.llmDescription;

        llmDialog.querySelector('.inner-content').innerHTML = `
            <p class="hc-warn">
            Note: Automatic AI descriptions may convincingly lie about data.
            Always verify important information by going through the data
            yourself.
            </p>
            <p tabindex="-1" aria-live="polite" class="hc-ai-result">
            ${desc ? desc :
        'Describing this chart will send its data to OpenAI. Proceed?'}</p>
            ${desc ? '' : '<button class="hc-action">Describe</button>'}
        `;
        const btn = llmDialog.querySelector('button.hc-action');
        if (btn) {
            btn.onclick = async () => {
                const resEl = llmDialog.querySelector('.hc-ai-result');
                resEl.textContent = 'Describing...';
                resEl.focus();
                btn.style.display = 'none';
                chart.llmDescription = resEl.textContent =
                    await describeChartWithLLM(chart);
                resEl.focus();
            };
        }
        setCSSPosToOverlay(llmDialog, chart.renderTo);
        llmDialog.showModal();
    };


// ============================================================================
// Stevie chart model

const stevieInit = chart => {
    chart.sonification.cancel();
    chart.sonification.playNote('vibraphone', { note: 'c4', tremoloDepth: 0 });
    chart.highlightCurPoint();
};

// The handlers
const stevieKbdHandlers = (() => {
    const getCurPoint = chart => chart.sonification.getLastPlayedPoint() ||
        chart.series[0].points[0];

    const singlePointInfo = (point, announcemsg) => point.sonify(() => {
        announce(announcemsg, 200);
        setTimeout(() => point.onMouseOver(), 0);
    });

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
        const { series: prevSeries, x } = getCurPoint(chart),
            closestPointToX = series => series.points.reduce(
                (acc, p) => (Math.abs(p.x - x) < Math.abs(acc.x - x) ? p : acc)
            ),
            sortedSeries = chart.series.filter(
                s => s.visible
            ).sort(
                (a, b) => closestPointToX(b).y - closestPointToX(a).y
            ),
            ix = sortedSeries.findIndex(s => s === prevSeries),
            nextSeries = sortedSeries[next ? ix + 1 : ix - 1],
            np = nextSeries && closestPointToX(nextSeries);
        if (np) {
            singlePointInfo(np, `${nextSeries.name}, $${np.y}. ${np.category}`);
        } else {
            chart.options.sonification.events.onBoundaryHit({ chart });
        }
    };
    const homeEnd = (chart, end) => {
        const prevPoint = getCurPoint(chart),
            p = prevPoint.series.points[
                end ? prevPoint.series.points.length - 1 : 0];
        singlePointInfo(p, `$${p.y}. ${p.category}`);
    };
    const pageUpDown = (chart, max) => {
        const series = getCurPoint(chart).series,
            poi = series.points.reduce((acc, p) => {
                if (max) {
                    return p.y > acc.y ? p : acc;
                }
                return p.y < acc.y ? p : acc;
            }, series.points[0]);
        singlePointInfo(
            poi,
            `${max ? 'Maximum' : 'Minimum'}, $${poi.y}. ${poi.category}`
        );
    };

    const playMinMax = (chart, onEnd) => {
        const { minPoint, maxPoint } = chart.series.filter(s => s.visible)
            .reduce((extremes, series) => series.points.reduce(
                (e, point) => ({
                    minPoint: !e.minPoint ? point :
                        point.y < e.minPoint.y ?
                            point : e.minPoint,
                    maxPoint: !e.maxPoint ? point :
                        point.y > e.maxPoint.y ?
                            point : e.maxPoint
                }), extremes
            ),
            { minPoint: null, maxPoint: null }
            );
        chart.sonification.cancel();
        chart.sonification.speak(
            'Minimum', { rate: 1.2 }, 0, () => {
                minPoint.sonify();
                chart.sonification.speak(
                    'Maximum', { rate: 1.2 }, 1000, () => maxPoint.sonify(onEnd)
                );
            }
        );
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

        // Play current series
        a: chart => {
            const son = chart.sonification,
                p = getCurPoint(chart);
            if (son.isPlaying()) {
                son.cancel();
                return;
            }
            p.onMouseOver();
            son.speak(
                p.series.name, {
                    rate: 1.5
                }, 0,
                () => p.series.sonify()
            );
            prevActionWasLR = false;
        },

        // Read chart summary
        i: chart => {
            const msg = 'summary placeholder';
            announce(msg);
            showToast(chart, msg);
            prevActionWasLR = false;
        },

        // Sound guide
        g: chart => {
            const msg = 'The chart will play sounds as you navigate. ' +
                'Lower tones means lower price, higher tones means higher ' +
                'price. Sounds are played from left to right, where left ' +
                'is on the left side of the chart, and right is on the right ' +
                'side of the chart.';

            playMinMax(chart, () => {
                announce(msg);
                showToast(chart, msg);
            });
            prevActionWasLR = false;
        },

        // Show table
        b: showTableDialog,

        // Describe chart with AI
        d: showLLMDialog,

        // Play speed/duration
        s: chart => {
            chart.sonification.cancel();
            const msg = 'Play speed: ' + toggleSetting('playSpeed'),
                duration = {
                    Slow: 22000,
                    Normal: 16000,
                    Fast: 10000
                }[getSettingValue('playSpeed')];
            chart.update({ sonification: { duration } });
            chart.redraw();
            announce(msg);
            showToast(chart, msg);
        },

        // Find in chart
        f: chart => showFindDialog(chart, p =>
            singlePointInfo(p, `${p.series.name}, $${p.y}. ${p.category}`)
        )
    };
})();

const stevieKbdDescriptions = {
    arrows: {
        name: 'Arrows ←↓↑→',
        srName: 'Arrows left, down, up, right',
        desc: 'Navigate data'
    },
    g: {
        name: 'G',
        desc: 'Guide for sounds'
    },
    a: {
        name: 'A',
        desc: 'Play bars as audio (autopilot)'
    },
    s: {
        name: 'S',
        desc: 'Toggle play speed for autopilot'
    },
    i: {
        name: 'I',
        desc: 'Chart information summary'
    },
    d: {
        name: 'D',
        desc: 'Describe chart with AI'
    },
    b: {
        name: 'B',
        desc: 'View data table'
    },
    f: {
        name: 'F',
        desc: 'Find in chart'
    },
    PageUp: {
        name: 'PageUp',
        desc: 'Go to highest value for series'
    },
    PageDown: {
        name: 'PageDown',
        desc: 'Go to lowest value for series'
    },
    Home: {
        name: 'Home',
        desc: 'Go to start of series'
    },
    End: {
        name: 'End',
        desc: 'Go to end of series'
    }
};

const stevieExplanation = chart => {
    chart.addSROnly(
        'p', 'This bar chart is showing grammy nominations and wins over ' +
        'time, from 1967 to 2010. The chart has two data series, wins and ' +
        'nominations.'
    );
    chart.addSROnly(
        'p', 'Chart has audio features and additional interactive tools.'
    );
};

const stevieOverlay = (chart, parent) => {
    const container = chart.addProxyContainerEl('div', parent),
        seriesDescs = chart.series.map(() => 'placeholder'),
        overlay = () => {
            container.innerHTML = '';
            // Short chart desc
            chart.addSROnly(
                'p', 'Bar chart with 2 data series. Text summary.', container
            );
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
};


// ============================================================================
// Load models

const a11yModels = {
    grammys: (chart, titleEl) => {
        stevieExplanation(chart);
        const app = chart.addA11yApplication(
            stevieInit,
            stevieKbdHandlers,
            stevieKbdDescriptions,
            titleEl
        );
        stevieOverlay(chart, app);
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

    const titleEl = chart.addProxyEl(
        chart.title.element, 'h2', chart.options.title.text
    );
    chart.addProxyEl(chart.subtitle.element, 'p', chart.options.subtitle.text);

    a11yModels[renderTo.id](chart, titleEl);
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

const hasForcedColors = matchMedia('(forced-colors: active)').matches;
const hasDarkMode = matchMedia('(prefers-color-scheme: dark)').matches;
const c = (c1, c2, c3) => (hasForcedColors ? c3 : hasDarkMode ? c2 : c1);

Highcharts.patterns[0].color = c('#ccc', '#666', '#666');
Highcharts.setOptions({
    chart: {
        backgroundColor: c('#fff', '#222', 'Canvas')
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
                announce('No more data.', 200);
            }
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                style: {
                    color: c('#222', '#eee', 'CanvasText')
                }
            },
            borderColor: c('#fff', '#222', 'Canvas')
        }
    },
    legend: {
        itemStyle: {
            color: c('#333', '#ccc', 'CanvasText')
        },
        itemHoverStyle: {
            cursor: 'unset'
        }
    },
    tooltip: {
        backgroundColor: c('#fff', '#444', 'Canvas'),
        style: {
            color: c('#333', '#eee', 'CanvasText')
        }
    },
    title: {
        align: 'left',
        style: {
            color: c('#222', '#eee', 'CanvasText')
        }
    },
    subtitle: {
        style: {
            color: c('#222', '#eee', 'CanvasText')
        }
    },
    xAxis: {
        labels: {
            style: {
                color: c('#333', '#ccc', 'CanvasText')
            }
        },
        lineColor: c('#333', '#ccc', 'CanvasText'),
        tickColor: c('#333', '#ccc', 'CanvasText')
    },
    yAxis: {
        labels: {
            style: {
                color: c('#333', '#ccc', 'CanvasText')
            }
        },
        lineColor: c('#333', '#ccc', 'CanvasText'),
        tickColor: c('#333', '#ccc', 'CanvasText'),
        gridLineColor: c('#e6e6e6', '#444', 'Canvas')
    },
    credits: {
        enabled: false
    }
});
if (hasForcedColors) {
    Highcharts.setOptions({
        plotOptions: {
            series: {
                dataLabels: {
                    backgroundColor: 'Canvas',
                    style: { textOutline: 'none' }
                }
            }
        }
    });
}


// Bar chart
const dataLines = document.getElementById('grammy-data')
        .textContent.split('\n').slice(1).map(line =>
            line.split(';').map(
                (val, i) => (!i ? parseInt(val, 10) : val)
            )
        ),
    chartData = {
        Nominated: [],
        Won: []
    };

dataLines.forEach(line => {
    if (!line[3]) {
        const nullPoint = { x: line[0], y: null };
        chartData.Nominated.push(nullPoint);
        chartData.Won.push(nullPoint);
        return;
    }
    const arr = chartData[line[3]],
        lastItem = arr[arr.length - 1],
        award = { work: line[1], award: line[2] };
    if (line[0] === lastItem?.x) {
        lastItem.y++;
        lastItem.awards.push(award);
    } else {
        arr.push({
            x: line[0],
            y: 1,
            awards: [award]
        });
    }
});

Highcharts.addEvent(Highcharts.Legend, 'afterRender', function () {
    const clipEl = this.chart.renderer.path([
        'M', 7.00, 0.00,
        'L', 9.66, 4.56,
        'L', 14.00, 5.15,
        'L', 10.63, 8.35,
        'L', 11.33, 13.26,
        'L', 7.00, 10.88,
        'L', 2.67, 13.26,
        'L', 3.37, 8.35,
        'L', 0.00, 5.15,
        'L', 4.34, 4.56,
        'Z'
    ]).translate(0, 4);
    this.chart.series[1].legendItem.symbol.clip(clipEl);
});

Highcharts.chart('grammys', {
    chart: {
        type: 'column',
        marginTop: 80,
        height: 460
    },
    colors: [
        c('#257274', '#34A0A2', 'CanvasText'),
        '#C86F65'
    ],
    title: {
        text: 'Stevie Wonder Grammy Awards'
    },
    subtitle: {
        text: 'Nominations and Wins'
    },
    sonification: {
        duration: 16000,
        order: 'simultaneous'
    },
    tooltip: {
        shared: true,
        formatter: function () {
            const { points, total } = this,
                header = `<b>${points[0].x}</b><br>` + points.map(p =>
                    `<span style="color:${p.color}">\u25CF</span> ${
                        p.y} ${p.series.name}`
                ).reverse().join('<br>'),
                totalDesc = points.length > 1 ?
                    `<br><b>Total: ${total}</b>` : '',
                awards = points.flatMap(
                    p => p.point.awards.map(a => a.work)
                ).reverse(),
                awardsDesc = '<br>' + (awards.length > 3 ?
                    awards.slice(0, 3).join('<br>') + '<br>...' :
                    awards.join('<br>'));

            return header + totalDesc + '<br>' + awardsDesc;
        }
    },
    yAxis: {
        reversedStacks: false,
        title: {
            enabled: false
        }
    },
    legend: {
        symbolRadius: 4,
        symbolWidth: 14,
        symbolHeight: 14,
        events: {
            itemClick: () => false
        }
    },
    plotOptions: {
        series: {
            stacking: 'normal',
            states: {
                inactive: {
                    enabled: false
                }
            },
            dataLabels: {
                style: {
                    fontSize: '11px'
                }
            },
            pointPadding: 0,
            groupPadding: 0.05
        }
    },
    responsive: {
        rules: [{
            condition: {
                maxWidth: 550
            },
            chartOptions: {
                chart: {
                    type: 'bar',
                    height: 850
                }
            }
        }, {
            condition: {
                maxWidth: 650
            },
            chartOptions: {
                plotOptions: {
                    series: {
                        dataLabels: {
                            style: {
                                fontSize: '8px'
                            },
                            y: -2
                        }
                    }
                }
            }
        }]
    },
    series: [{
        name: 'Nominated',
        data: chartData.Nominated
    }, {
        name: 'Won',
        data: chartData.Won,
        sonification: {
            tracks: [{
                instrument: 'vibraphone',
                mapping: {
                    pitch: {
                        min: 'c5',
                        max: 'c7'
                    }
                }
            }]
        },
        dataLabels: {
            enabled: true,
            inside: true,
            format: '★',
            backgroundColor: c('transparent', 'transparent', '#C86F65'),
            padding: 0,
            style: {
                color: '#fff',
                textOutline: 'none'
            }
        }
    }]
});
