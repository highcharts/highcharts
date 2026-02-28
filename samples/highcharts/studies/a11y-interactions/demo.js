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

    .hc-all-connections {
        .inner-content {
            display: flex;
            justify-content: space-around;
            overflow-y: scroll;
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
        p,
        .inner-content {
            max-width: 500px;
            margin: 40px auto 0;
        }

        .hc-a11y-query-inputs {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            margin-top: 20px;

            select {
                padding: 5px;
                border-radius: 4px;
                border: 1px solid #ccc;
                background-color: transparent;
                font-size: 0.9em;
            }

            .grow {
                flex: 1;
            }
        }

        .hc-a11y-query-result:focus {
            outline: none;
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
const setCSSPosToOverlay = (targetEl, sourceEl, attrs, margin = 0) => {
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
        computedStyle = window.getComputedStyle(svgEl),
        setSize = () => {
            const bbox = svgEl.getBoundingClientRect(),
                containerBBox = container.getBoundingClientRect();

            Object.assign(el.style, {
                left: bbox.x - containerBBox.x + 'px',
                top: bbox.y - containerBBox.y + 'px',
                width: bbox.width + 'px',
                height: bbox.height + 'px',
                overflow: 'hidden',
                cursor: computedStyle.cursor,
                tabindex: '-1'
            });
        },
        resizeObserver = new ResizeObserver(setSize);

    resizeObserver.observe(svgEl);
    setSize();

    [
        'mousedown', 'mouseup', 'mouseenter', 'mouseover', 'mouseout',
        'mouseleave', 'pointerdown', 'pointerup', 'pointermove',
        'pointercancel', 'pointerleave', 'pointerenter', 'wheel',
        'dragstart', 'dragend', 'dragenter', 'dragleave', 'dragover',
        'drop', 'click'
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
// Line simplification (from 2023 CSUN work)

const defined = n => typeof n !== 'undefined' && n !== null;

// Minimal binary min heap implementation for points that compare by a function.
// The function takes a pointA and a pointB, and should return true if pointA is
// smaller than pointB.
class BinaryMinHeap {
    constructor(compareIsSmallerThan) {
        this.heap = [];
        this.compareIsSmallerThan = compareIsSmallerThan;
    }

    // Add point to heap, inserted in the right place based on comparison fn
    push(point) {
        this.heap.push(point);
        this.sortUpFromIndex(this.heap.length - 1);
    }

    // Remove minimum point from heap, updating the rest of the heap
    popMin() {
        if (!this.heap.length) {
            return null;
        }
        const min = this.heap[0],
            last = this.heap.pop();
        if (last) {
            if (!this.heap.length) {
                return last;
            }
            this.heap[0] = last;
            this.sortDownFromIndex(0);
        }
        return min;
    }

    length() {
        return this.heap.length;
    }

    updateNode(point) {
        const index = this.heap.indexOf(point);
        if (index > -1) {
            this.sortUpFromIndex(index);
            this.sortDownFromIndex(index);
        }
    }

    sortUpFromIndex(index) {
        const point = this.heap[index];
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2),
                parentPoint = this.heap[parentIndex];
            if (this.compareIsSmallerThan(point, parentPoint)) {
                // Swap nodes
                this.heap[parentIndex] = point;
                this.heap[index] = parentPoint;
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    sortDownFromIndex(index) {
        const length = this.heap.length,
            point = this.heap[index];
        let ix = index;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const leftNodeIx = 2 * ix + 1,
                rightNodeIx = 2 * ix + 2;
            let leftPoint,
                righPoint,
                swapIndex = null;
            if (leftNodeIx < length) {
                leftPoint = this.heap[leftNodeIx];
                if (this.compareIsSmallerThan(leftPoint, point)) {
                    swapIndex = leftNodeIx;
                }
            }
            if (rightNodeIx < length) {
                righPoint = this.heap[rightNodeIx];
                const shouldSwapRight =
                    swapIndex !== null && leftPoint ?
                        this.compareIsSmallerThan(righPoint, leftPoint) :
                        this.compareIsSmallerThan(righPoint, point);
                if (shouldSwapRight) {
                    swapIndex = rightNodeIx;
                }
            }
            if (swapIndex === null) {
                break;
            }
            this.heap[ix] = this.heap[swapIndex];
            this.heap[swapIndex] = point;
            ix = swapIndex;
        }
    }
}

// Get the area of a triangle of points
function getAreaForPoint(point, prev, next) {
    if (!prev || !next) {
        return Infinity;
    }
    const { plotX: x1, plotY: y1 } = point,
        { plotX: x2, plotY: y2 } = prev,
        { plotX: x3, plotY: y3 } = next;

    if (![x1, x2, x3, y1, y2, y3].every(defined)) {
        return Infinity;
    }
    return Math.abs(
        0.5 * (
            (x1 * (y2 - y3)) +
            (x2 * (y3 - y1)) +
            (x3 * (y1 - y2))
        )
    );
}

// Simplify large XY data sets before further processing, by keeping
// the min and max point for each pixel only.
function preprocessSimplify(points) {
    if (points.length < 2000) {
        return points;
    }
    const simplified = [],
        len = points.length,
        groupMin = [Infinity, null],
        groupMax = [-Infinity, null],
        addGroup = () => {
            const min = groupMin[1],
                max = groupMax[1];
            if (min && max) {
                if (min === max) {
                    simplified.push(min);
                } else {
                    const minFirst = min.x < max.x;
                    simplified.push(
                        minFirst ? min : max, minFirst ? max : min
                    );
                }
            }
        };
    let groupX = Infinity;
    for (let i = 0, p, y; i < len; ++i) {
        p = points[i];
        y = p.y;
        if (p.plotX !== void 0 && y !== void 0 && y !== null) {
            const x = Math.round(p.plotX);
            if (x !== groupX) {
                // New group
                addGroup();
                groupX = x;
                groupMin[0] = groupMax[0] = y;
                groupMin[1] = groupMax[1] = p;
            } else {
                // Within group
                if (y > groupMax[0]) {
                    groupMax[0] = y;
                    groupMax[1] = p;
                }
                if (y < groupMin[0]) {
                    groupMin[0] = y;
                    groupMin[1] = p;
                }
            }
        }
    }
    addGroup();
    return simplified;
}

/* eslint-disable no-underscore-dangle */

// Get simplified array of points, supplying the target number of points in
// the resulting simplified array.
// Based on the Visvalingam-Whyatt algorithm.
function subtractiveVisvalingam(points, numPoints) {
    const heap = new BinaryMinHeap((pointA, pointB) => (
        defined(pointA._visvalingamArea) &&
        defined(pointB._visvalingamArea) ?
            pointA._visvalingamArea < pointB._visvalingamArea :
            false
    ));

    // First compute area for all points, and add them to the heap.
    // Also link them so we can keep the order updated as we remove.
    points.forEach((p, ix) => {
        p._prevPoint = points[ix - 1] || undefined;
        p._nextPoint = points[ix + 1] || undefined;
        p._visvalingamArea = getAreaForPoint(p, p._prevPoint, p._nextPoint);
        if (p._visvalingamArea < Infinity) {
            heap.push(p);
        }
    });

    // Then remove points until we reach the target
    while (heap.length() > numPoints) {
        const removed = heap.popMin(),
            next = removed._nextPoint,
            prev = removed._prevPoint;

        // Recalc linked list references & area around removed point
        if (next) {
            next._prevPoint = removed._prevPoint;
            next._visvalingamArea = getAreaForPoint(
                next, next._prevPoint, next._nextPoint
            );
            if (next._visvalingamArea < Infinity) {
                heap.updateNode(next);
            }
        }
        if (prev) {
            prev._nextPoint = removed._nextPoint;
            prev._visvalingamArea = getAreaForPoint(
                prev, prev._prevPoint, prev._nextPoint
            );
            if (prev._visvalingamArea < Infinity) {
                heap.updateNode(prev);
            }
        }
        removed._nextPoint = removed._prevPoint =
            removed._visvalingamArea = undefined;
    }

    const simplified = [];
    let simplifiedPoint = points[0];
    while (simplifiedPoint) {
        if (defined(simplifiedPoint.y)) {
            simplified.push(simplifiedPoint);
        }
        delete simplifiedPoint._visvalingamArea;
        simplifiedPoint = simplifiedPoint._nextPoint;
    }

    return simplified;
}

// Get simplified array of points, supplying the target number of points in
// the resulting simplified array.
// Based on a modified Visvalingam-Whyatt algorithm, where we are adding the
// most impactful points rather than subtracting the least impactful ones.
function additiveVisvalingam(points, numPoints) {
    const findInsertionIx = (points, candidateX) => {
        let start = 0,
            end = points.length - 1;
        while (start <= end) {
            const mid = Math.floor((start + end) / 2),
                midX = points[mid].x;
            if (midX === candidateX) {
                return mid;
            }
            if (midX < candidateX) {
                start = mid + 1;
            } else {
                end = mid - 1;
            }
        }
        return start;
    };

    const candidatePoints = points.filter(p => defined(p.y));

    if (candidatePoints.length < 3) {
        return candidatePoints;
    }

    // Always include end points
    const simplified = [
        candidatePoints[0],
        candidatePoints[candidatePoints.length - 1]
    ];
    candidatePoints.shift();
    candidatePoints.pop();

    // Calculate the area for each candidate point as if it was
    // added to the simplified line
    candidatePoints.forEach(cp => {
        cp._avArea = getAreaForPoint(
            cp,
            simplified[0],
            simplified[1]
        );
    });

    // Build up the simplified line by adding points
    while (simplified.length < numPoints && candidatePoints.length) {
        let i = candidatePoints.length,
            maxArea = 0,
            maxAreaIx = -1;
        while (i--) {
            const candidatePoint = candidatePoints[i],
                area = candidatePoint._avArea || 0;
            if (area > maxArea && area < Infinity) {
                maxArea = area;
                maxAreaIx = i;
            }
        }

        if (maxAreaIx > -1) {
            const addedPoint = candidatePoints[maxAreaIx],
                insertionIx = findInsertionIx(simplified, addedPoint.x);
            candidatePoints.splice(maxAreaIx, 1);
            simplified.splice(insertionIx, 0, addedPoint);

            // Recalculate area of candidate points between the newly added
            // point’s neighbors.
            const prevSimplified = simplified[insertionIx - 1],
                nextSimplified = simplified[insertionIx + 1],
                startX = prevSimplified && prevSimplified.x,
                endX = nextSimplified && nextSimplified.x;
            let candidateIx = findInsertionIx(candidatePoints, startX),
                candidatePoint = candidatePoints[candidateIx];
            while (candidatePoint && candidatePoint.x < endX) {
                const isBeforeInserted = candidatePoint.x < addedPoint.x;
                candidatePoint._avArea = getAreaForPoint(
                    candidatePoint,
                    isBeforeInserted ? prevSimplified : addedPoint,
                    isBeforeInserted ? addedPoint : nextSimplified
                );
                candidatePoint = candidatePoints[++candidateIx];
            }
        } else {
            break;
        }
    }

    return simplified;
}

// Simplify points in a line/XY series using cascading algorithms.
// Points are first preprocessed for speed, then simplified via a subtractive
// and an additive Visvalingam-Whyatt algorithm.
function simplifyLine(points, numPoints) {
    const preprocessed = preprocessSimplify(points),
        stage1Threshold = Math.max(numPoints * 1.1, numPoints + 10),
        subtracted = subtractiveVisvalingam(preprocessed, stage1Threshold);
    return additiveVisvalingam(subtracted, numPoints);
}


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
    spline: `This line chart shows the average airfare prices in the US from
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
    around 272 dollars in 2023.`,

    networkgraph: `This network graph illustrates the connections between
    selected airports in the United States, showing how many direct routes each
    airport has. The chart contains a total of 1241 data points representing
    various airports and the number of direct connections each has. The airports
    listed include major hubs like Chicago, Dallas-Fort Worth, and Atlanta, as
    well as smaller airports like Alexandria and Garden City.\nThe most
    important insight from this chart is that Dallas-Fort Worth has the highest
    number of direct connections at 81, indicating its significant role in the
    airline network in the US. Additionally, airports like Denver and Houston
    also have a high number of routes, with 80 and 76 connections respectively,
    showcasing them as key locations in air travel across the country. In
    contrast, some smaller airports, such as Alexandria, Garden City, and
    Montgomery, have only one direct route, highlighting the disparity in
    airline connectivity across different regions.`,

    wordcloud: `This word cloud chart summarizes key terms found in recent
    travel news articles from various sources. It features a total of 100 unique
    words, with the frequency of each word indicating its prominence in the news
    articles. The word 'city' and 'island' are tied for the highest occurrences
    at 34 each, while other noteworthy terms include 'travel' at 28, and various
    other related words such as 'family', 'hotel', and 'people' which also
    appear frequently. The most significant insight from this chart is that
    'city' and 'island' are currently the most discussed topics in travel news.
    Additional insights include a strong focus on themes related to destinations
    (such as 'hotel', 'airport', and 'tourism'), activities (exemplified by
    words like 'adventure' and 'explore'), and types of experiences (as shown by
    terms like 'food' and 'culture'), suggesting a diverse landscape of travel
    interests at this time.`
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
// Infographic bar chart model

const delaysModel = chart => {
    const container = chart.addProxyContainerEl('div'),
        overlay = () => {
            container.innerHTML = '';
            chart.addProxyEl(
                chart.seriesGroup.element,
                'p', 'Chart. 77.89% On time. 22.11% Delayed (>15 min).',
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
    }. Starts at $${
        s.data[0].y
    }, and ends at ${
        s.data[s.data.length - 1].y
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
    const setSimplifyLevel = (chart, numPoints = null) => {
        chart.sonification.cancel();

        if (!numPoints) {
            let i = chart.series.length;
            while (i--) {
                const s = chart.series[i];
                if (s._isSimplifiedSeries) {
                    s.remove();
                } else {
                    s.update({ visible: true, showInLegend: true }, false);
                }
            }
            chart.redraw();
            return;
        }

        const newSeries = chart.series.map(
            s => simplifyLine(s.points, numPoints)
        );
        chart.series.forEach(
            s => s.update({ visible: false, showInLegend: false }, false)
        );
        newSeries.forEach((points, ix) => {
            const origSeries = chart.series[ix],
                s = chart.addSeries({
                    name: origSeries.name,
                    color: origSeries.color,
                    data: points.map(p => [p.x, p.y]),
                    animation: false,
                    type: 'line'
                }, false);
            s._isSimplifiedSeries = true;
        });
        chart.redraw();
        chart.series[0].points[0].onMouseOver();
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

    // Gets a summary of:
    // - Number of lines, what they represent
    // - Which lines had the overall chart min and max value
    // - If all lines consistently trend up or down from start
    // - If any of the lines have more significant variance/change than others
    const getLineChartSummary = chart => {
        const series = chart.series,
            seriesNames = series.map(s => s.name),
            chartMaxSeries = series.reduce(
                (acc, cur) => (cur.dataMax > acc.dataMax ? cur : acc)
            ),
            chartMinSeries = series.reduce(
                (acc, cur) => (cur.dataMin < acc.dataMin ? cur : acc)
            ),
            allUp = series.every(s => lineTrend(s).indexOf('up') > -1),
            allDown = series.every(s => lineTrend(s).indexOf('down') > -1),
            avgVariance = series.map(s => s.dataMax - s.dataMin).reduce(
                (a, b) => a + b
            ) / series.length,
            outlierHighVariance = series.find(
                v => v.dataMax - v.dataMin > avgVariance * 1.5
            ),
            outlierLowVariance = series.find(
                v => v.dataMax - v.dataMin < avgVariance * 0.5
            ),
            summary = `Chart has ${series.length} lines: ${
                seriesNames.join(', ')
            }. The highest value is $${
                chartMaxSeries.dataMax
            } in ${chartMaxSeries.name}, and the lowest value is $${
                chartMinSeries.dataMin
            } in ${chartMinSeries.name}. ${
                allUp ? 'All lines trend up' :
                    allDown ? 'All lines trend down' :
                        'Lines have mixed trends'
            }.${outlierHighVariance ? ` ${outlierHighVariance.name}
                has the most drastic change in values.` : ''}${
                outlierLowVariance ? ` ${outlierLowVariance.name}
                has the most consistent values.` : ''}${
                !outlierHighVariance && !outlierLowVariance ?
                    ' All lines had similar amounts of variation in values.' :
                    ''}`;
        return summary;
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

        // Play current line
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
            const msg = getLineChartSummary(chart);
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
        },

        // Sound guide
        g: chart => {
            const msg = 'The chart will play sounds as you navigate. ' +
                'Lower tones means lower price, higher tones means higher ' +
                'price. Sounds are played from left to right, where left ' +
                'is on the left side of the chart, and right is on the right ' +
                'side of the chart. When at the end of one line, the ' +
                'navigation will continue at the start of the next line.';

            playMinMax(chart, () => {
                announce(msg);
                showToast(chart, msg);
            });
            prevActionWasLR = false;
        },

        // Simplify chart
        e: chart => {
            chart.simplified = !chart.simplified;
            setSimplifyLevel(chart, chart.simplified ? 8 : null);
            const totalPoints = chart.series.reduce((acc, cur) =>
                    acc + (cur.visible ? cur.points.length : 0), 0
                ),
                msg = `Smoothing ${chart.simplified ? 'on' : 'off'
                }. Showing ${
                    chart.simplified ?
                        'only major data changes, hiding fluctuations' :
                        'all data'
                }. Chart now has ${totalPoints} data points in total.`;
            announce(msg);
            showToast(chart, msg);
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

const historicalKbdDescriptions = {
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
        desc: 'Play line as audio (autopilot)'
    },
    s: {
        name: 'S',
        desc: 'Toggle play speed for autopilot'
    },
    i: {
        name: 'I',
        desc: 'Chart information summary'
    },
    l: {
        name: 'L',
        desc: 'Read summary of line'
    },
    d: {
        name: 'D',
        desc: 'Describe chart with AI'
    },
    e: {
        name: 'E',
        desc: 'Toggle easy mode - simplify chart'
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
    }
};

const historicalExplanation = chart => {
    chart.addSROnly(
        'p', 'The chart is showing price over time, from 1993 to 2023.'
    );
    chart.addSROnly(
        'p', 'Chart has audio features and additional interactive tools.'
    );
};

const historicalOverlay = (chart, parent) => {
    const container = chart.addProxyContainerEl('div', parent),
        seriesDescs = chart.series.map(seriesDesc),
        overlay = () => {
            container.innerHTML = '';
            // Short chart desc
            chart.addSROnly(
                'p', 'Line chart with 4 lines. Text summary.', container
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
// Network graph model

const nodesHaveLink = (fromNode, toNode) =>
    fromNode.linksTo.some(l => l.fromNode === toNode) ||
    toNode.linksTo.some(l => l.fromNode === fromNode);

// Query dialog
const queryDialog = createDialog(
    'Search connections in network', `
    <p>
    Find connections between nodes. Select two node names below to see if they
    have a direct connection.
    </p>
    <div class="hc-a11y-query-inputs">
        <label for="hc-a11y-query-firstnode">First node</label>
        <select id="hc-a11y-query-firstnode"></select>
        <div class="grow"></div>
        <label for="hc-a11y-query-secondnode">Second node</label>
        <select id="hc-a11y-query-secondnode"></select>
    </div>
    <button class="hc-action">Search</button>
    <p class="hc-a11y-query-result" tabindex="-1"></p>
    `, 'hc-a11y-query-dialog'
);
const queryButton = queryDialog.querySelector('.hc-action'),
    queryResult = queryDialog.querySelector('.hc-a11y-query-result'),
    fromInput = queryDialog.querySelector('#hc-a11y-query-firstnode'),
    toInput = queryDialog.querySelector('#hc-a11y-query-secondnode');

const showQueryDialog = chart => {
    queryResult.textContent = fromInput.value = toInput.value = '';

    // Populate with nodes
    fromInput.innerHTML = toInput.innerHTML = chart.precomputedNetwork.slice(0)
        .sort((a, b) => a.name.localeCompare(b.name)).reduce(
            (acc, cur) => (acc +=
            `<option value="${
                chart.precomputedNetwork.indexOf(cur)
            }">${cur.name}</option>`), ''
        );

    setCSSPosToOverlay(queryDialog, chart.renderTo);
    queryButton.onclick = () => {
        const fromNode = chart.precomputedNetwork[fromInput.value],
            toNode = chart.precomputedNetwork[toInput.value],
            play = (note, delay) => chart.sonification.playNote(
                'plucked', { note, volume: 0.5, tremoloDepth: 0 }, delay
            ),
            sad = () => chart.sonification.playNote(
                'chop', { volume: 0.4 }, 200
            ),
            numConn = n => n.linksFrom.length + n.linksTo.length;

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

        setTimeout(() => queryResult.focus(), 200);
    };

    queryDialog.showModal();
};

// All connections dialog
const allConnectionsDialog = createDialog('', '', 'hc-all-connections'),
    showAllConns = node => {
        allConnectionsDialog.querySelector('h3').textContent =
            'All connections for ' + node.name;
        allConnectionsDialog.querySelector('.inner-content').innerHTML = `
        <div><h4>Connections to ${node.name}</h4>
        <ul role="list">
        ${node.linksTo.map(l => l.from).sort()
        .map(l => `<li>${l}</li>`).join('')}
        </ul></div><div>
        <h4>Connections from ${node.name}</h4>
        <ul role="list">
        ${node.linksFrom.map(l => l.to).sort()
        .map(l => `<li>${l}</li>`).join('')}
        </ul></div>
        `;

        setCSSPosToOverlay(allConnectionsDialog, node.series.chart.renderTo);
        allConnectionsDialog.showModal();
    };

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
        const p = chart.precomputedNetwork[kbdState.point + direction],
            playSounds = !getSettingValue('muteSounds');
        if (!p) {
            if (playSounds) {
                chart.sonification.playNote('chop', { volume: 0.2 });
            }
            announce('No more data.', 200);
        } else {
            if (playSounds) {
                sonifyNode(chart, p);
                announceNode(p, 300);
            } else {
                p.onMouseOver();
                announceNode(p);
            }
            kbdState.point += direction;
        }
    };

    const startEnd = (chart, end) => {
        clearSonification();
        kbdState.point = end ? chart.precomputedNetwork.length - 1 : 0;
        const p = chart.precomputedNetwork[kbdState.point],
            playSounds = !getSettingValue('muteSounds');

        if (playSounds) {
            sonifyNode(chart, p);
            announceNode(p, 300);
        } else {
            p.onMouseOver();
            announceNode(p);
        }
    };

    const playMinMax = (chart, onEnd) => {
        clearSonification();
        const maxNode = chart.precomputedNetwork[0],
            minNode = chart.precomputedNetwork[
                chart.precomputedNetwork.length - 1
            ];
        chart.sonification.speak(
            'Largest', { rate: 1.2 }, 0, () => {
                sonifyNode(chart, maxNode, false);
                chart.sonification.speak(
                    'Smallest', { rate: 1.2 }, 1000, () => {
                        sonifyNode(chart, minNode, false);
                        onEnd();
                    }
                );
            }
        );
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
            chart.tooltip.hide(0);
            const speed = {
                Slow: 1.5,
                Normal: 1,
                Fast: 0.7
            }[getSettingValue('playSpeed')];
            const sonify = () => chart.precomputedNetwork.forEach(
                (node, i) => sonificationSchedule.push(
                    setTimeout(
                        () => sonifyNode(chart, node, false),
                        speed * i * 100 + 200
                    )
                ));
            chart.sonification.speak(
                'Network graph, all nodes, largest to smallest', {
                    rate: 1.5
                }, 0, sonify
            );
        },

        Escape: clearSonification,

        i: chart => {
            clearSonification();
            const msg = `Network graph with 44 nodes and ${
                chart.precomputedNetwork.reduce(
                    (acc, n) => acc + n.linksFrom.length + n.linksTo.length, 0
                )
            } connections. Top nodes are: ${
                chart.precomputedNetwork
                    .slice(0, 5)
                    .map(n => n.name)
                    .join(', ')
            }.`;
            announce(msg);
            showToast(chart, msg);
        },

        n: chart => {
            clearSonification();
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

        l: chart => showAllConns(
            chart.precomputedNetwork[kbdState.point] ||
            chart.precomputedNetwork[0]
        ),

        c: showQueryDialog,

        g: chart => {
            clearSonification();
            const msg = 'The chart will play sounds as you navigate. ' +
            'Lower and stronger tones means a bigger node with more ' +
            'connections. Higher and weaker tones means a smaller node ' +
            'with fewer connections.';

            playMinMax(chart, () => {
                announce(msg);
                showToast(chart, msg);
            });
        },

        d: showLLMDialog,

        s: chart => {
            clearSonification();
            const msg = 'Play speed: ' + toggleSetting('playSpeed');
            announce(msg);
            showToast(chart, msg);
        },

        f: chart => showFindDialog(chart, p => {
            const pIndex = chart.precomputedNetwork.indexOf(p);
            if (pIndex > -1) {
                navigate(chart, pIndex - kbdState.point);
            }
        }),

        m: chart => {
            clearSonification();
            const msg = 'Navigation sounds ' +
                (toggleSetting('muteSounds') ? 'off' : 'on');
            announce(msg);
            showToast(chart, msg);
        }
    };
})();

const networkKbdDescriptions = {
    arrows: {
        name: 'Arrows ←↓↑→',
        srName: 'Arrows left, down, up, right',
        desc: 'Navigate data, sorted largest to smallest'
    },
    g: {
        name: 'G',
        desc: 'Read guide for sounds'
    },
    a: {
        name: 'A',
        desc: 'Play whole network as audio (autopilot), large nodes first'
    },
    s: {
        name: 'S',
        desc: 'Toggle play speed for autopilot'
    },
    m: {
        name: 'M',
        desc: 'Toggle mute navigation sounds'
    },
    c: {
        name: 'C',
        desc: 'Search connections'
    },
    f: {
        name: 'F',
        desc: 'Find in chart'
    },
    i: {
        name: 'I',
        desc: 'Chart information summary'
    },
    n: {
        name: 'N',
        desc: 'Read top connections to and from node'
    },
    l: {
        name: 'L',
        desc: 'List all connections for node'
    },
    d: {
        name: 'D',
        desc: 'Describe chart with AI'
    },
    Home: {
        name: 'Home',
        desc: 'Go to largest node'
    },
    End: {
        name: 'End',
        desc: 'Go to smallest node'
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
    chart.addSROnly(
        'p',
        'Chart has audio features, search, and additional interactive tools.'
    );
};

const networkOverlay = (chart, parent) => {
    const container = chart.addProxyContainerEl('div', parent),
        overlay = () => {
            container.innerHTML = '';
            chart.addSROnly(
                'p', 'Network graph with 44 nodes. Text summary.', container
            );
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
    let pointIndex = 0;
    const clearSonification = () => {
        pointIndex = -1;
    };

    const getPointXPos = point => {
        const pos = point.graphic.element.getBoundingClientRect(),
            offsetPos = point.series.chart.renderTo.getBoundingClientRect();
        return (pos.left - offsetPos.left) / offsetPos.width;
    };

    const sonifyWord = (chart, point, onEnd) => {
        const maxWeight = chart.series[0].points[0].weight,
            value = point.weight / maxWeight,
            xPos = getPointXPos(point),
            speechFactor = {
                Slow: 0.7,
                Normal: 1,
                Fast: 1.25
            }[getSettingValue('playSpeed')];
        chart.sonification.playNote(
            'vibraphone',
            {
                volume: value,
                note: 70 - Math.round(value * 40),
                noteDuration: 400 * value,
                tremoloDepth: 0,
                pan: xPos * 2 - 1
            }
        );
        chart.sonification.speak(
            point.name,
            {
                name: 'Samantha',
                volume: value * 0.8 + 0.2,
                rate: speechFactor * 3.5 - value * 2,
                pitch: 1.4 - value * 0.8
            },
            50,
            onEnd
        );
    };

    const announceWord = (point, delay) => announce(
        `${point.name}, ${point.weight} occurrences.`, delay
    );

    const navigate = (chart, direction) => {
        clearSonification();
        const p = chart.series[0].points[kbdState.point + direction],
            playSounds = !getSettingValue('muteSounds');
        if (!p) {
            if (playSounds) {
                chart.sonification.playNote('chop', { volume: 0.2 });
            }
            announce('No more data.', 200);
        } else {
            if (playSounds) {
                sonifyWord(chart, p);
            }
            announceWord(p, 500);
            p.onMouseOver();
            kbdState.point += direction;
        }
    };

    const startEnd = (chart, end) => {
        clearSonification();
        kbdState.point = end ? chart.series[0].points.length - 1 : 0;
        const p = chart.series[0].points[kbdState.point],
            playSounds = !getSettingValue('muteSounds');
        p.onMouseOver();
        if (playSounds) {
            sonifyWord(chart, p);
            announceWord(p, 500);
        } else {
            announceWord(p);
        }
    };

    // Highlight without showing tooltip
    const highlight = point => {
        point.setState('hover');
        setTimeout(() => point.setState('inactive'), 500);
    };

    const playMinMax = (chart, onEnd) => {
        clearSonification();
        const series = chart.series[0],
            maxP = series.points[0],
            minP = series.points[
                series.points.length - 1
            ];
        chart.sonification.speak(
            'Largest', { rate: 1.2 }, 0, () => sonifyWord(
                chart, maxP,
                () => chart.sonification.speak(
                    'Smallest', { rate: 1.2 }, 1000,
                    () => sonifyWord(chart, minP, onEnd)
                )
            )
        );
    };

    return {
        ArrowLeft: chart => navigate(chart, -1),
        ArrowRight: chart => navigate(chart, 1),
        ArrowUp: chart => navigate(chart, -1),
        ArrowDown: chart => navigate(chart, 1),
        Home: chart => startEnd(chart),
        End: chart => startEnd(chart, true),
        a: chart => {
            if (pointIndex > 0) {
                clearSonification();
                return;
            }
            pointIndex = 0;

            chart.tooltip.hide(0);
            const sonify = () => {
                const p = chart.series[0].points[pointIndex];
                if (!p) {
                    clearSonification();
                    return;
                }
                if (p === p.series.points[p.series.points.length - 1]) {
                    p.onMouseOver();
                } else {
                    highlight(p);
                }
                sonifyWord(chart, p, sonify);
                pointIndex++;
            };
            chart.sonification.speak(
                'Word cloud, all words, largest to smallest', {
                    rate: 1.5
                }, 0, sonify
            );
        },
        i: chart => {
            clearSonification();
            const msg = `Word cloud with 100 words. Top words are: ${
                chart.series[0].points
                    .slice(0, 5)
                    .map(n => n.name)
                    .join(', ')
            }.`;
            announce(msg);
            showToast(chart, msg);
        },
        g: chart => {
            clearSonification();
            const msg = 'The chart will play sounds and speak the words ' +
            'as you navigate. Lower tones, stronger, and slower words ' +
            'means a bigger word with more occurrences. Higher tones, ' +
            'weaker and faster words means a smaller word with fewer ' +
            'occurrences.';

            playMinMax(chart, () => {
                announce(msg);
                showToast(chart, msg);
            });
        },
        s: chart => {
            clearSonification();
            const msg = 'Speech: ' + toggleSetting('playSpeed');
            announce(msg);
            showToast(chart, msg);
        },
        m: chart => {
            clearSonification();
            const msg = 'Navigation sounds ' +
                (toggleSetting('muteSounds') ? 'off' : 'on');
            announce(msg);
            showToast(chart, msg);
        },
        d: showLLMDialog,
        f: chart => showFindDialog(chart, p => {
            const pIndex = chart.series[0].points.indexOf(p);
            if (pIndex > -1) {
                navigate(chart, pIndex - kbdState.point);
            }
        }),
        Escape: clearSonification
    };
})();

const wordcloudKbdDescriptions = {
    arrows: {
        name: 'Arrows ←↓↑→',
        srName: 'Arrows left, down, up, right',
        desc: 'Navigate data, sorted largest to smallest'
    },
    g: {
        name: 'G',
        desc: 'Read guide for sounds'
    },
    a: {
        name: 'A',
        desc: 'Play whole word cloud as audio (autopilot), large words first'
    },
    s: {
        name: 'S',
        desc: 'Toggle speaking speed for words'
    },
    m: {
        name: 'M',
        desc: 'Toggle mute navigation sounds'
    },
    f: {
        name: 'F',
        desc: 'Find in chart'
    },
    i: {
        name: 'I',
        desc: 'Chart information summary'
    },
    d: {
        name: 'D',
        desc: 'Describe chart with AI'
    },
    Home: {
        name: 'Home',
        desc: 'Go to largest word'
    },
    End: {
        name: 'End',
        desc: 'Go to smallest word'
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
    chart.addSROnly(
        'p', 'Chart has audio features and additional interactive tools.'
    );
};
const wordcloudOverlay = (chart, parent) => {
    const container = chart.addProxyContainerEl('div', parent),
        overlay = () => {
            container.innerHTML = '';
            chart.addSROnly(
                'p', 'Word cloud with 100 words. Text summary.', container
            );
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
};


// ============================================================================
// Load models

const a11yModels = {
    delays: delaysModel,
    accidents: accidentsModel,
    historical: (chart, titleEl) => {
        historicalExplanation(chart);
        const app = chart.addA11yApplication(
            historicalInit,
            historicalKbdHandlers,
            historicalKbdDescriptions,
            titleEl
        );
        historicalOverlay(chart, app);
    },
    network: (chart, titleEl) => {
        networkExplanation(chart);

        // Precompute network order
        chart.precomputedNetwork = chart.series[0].nodes.slice(0).sort(
            (a, b) => b.linksFrom.length + b.linksTo.length -
                a.linksFrom.length - a.linksTo.length
        );

        const app = chart.addA11yApplication(
            networkInit,
            networkKbdHandlers,
            networkKbdDescriptions,
            titleEl
        );
        networkOverlay(chart, app);
    },
    wordcloud: (chart, titleEl) => {
        wordcloudExplanation(chart);
        const app = chart.addA11yApplication(
            wordcloudInit,
            wordcloudKbdHandlers,
            wordcloudKbdDescriptions,
            titleEl
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
        marginTop: 80,
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
            color: c('#000', '#fff', 'CanvasText'),
            textDecoration: 'underline',
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
                    textOutline: 'none',
                    fontWeight: 'normal'
                }
            }
        }
    },
    series: [{
        name: 'On time',
        color: c('#16A27F', '#16A27F', 'CanvasText'),
        data: [77.89]
    }, {
        name: 'Delayed (>15 min)',
        color: c('#DB3D6D', '#DB3D6D', 'CanvasText'),
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
        c('#393B3C', '#797F81', 'CanvasText'),
        c('#258AE9', '#258AE9', 'CanvasText'),
        c('#E23689', '#E23689', 'CanvasText'),
        c('#B78D1A', '#B78D1A', 'CanvasText'),
        c('#6D9C82', '#6D9C82', 'CanvasText'),
        { patternIndex: 0 }
    ],
    tooltip: {
        followPointer: false,
        headerFormat: '',
        pointFormat: '{point.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        series: {
            innerSize: '50%',
            cursor: 'pointer',
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
                    backgroundColor: c(
                        'rgba(250, 250, 250, 0.75)',
                        'rgba(0, 0, 0, 0.75)',
                        'Canvas'
                    ),
                    borderRadius: 8,
                    style: {
                        textOutline: 'none',
                        padding: 8
                    }
                },
                events: {
                    click: () => alert('clicked on turbulence encounter')
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
    colors: [
        c('#3B73ED', '#5787EF', '#3B73ED'),
        '#16a34a',
        '#d97706',
        c('#dc2626', '#E25050', '#dc2626')
    ],
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
    colors = [
        c('#0D47A1', '#347FEF', 'CanvasText'),
        c('#2D4791', '#5B79CD', 'CanvasText'),
        c('#1976D2', '#2D8AE6', 'CanvasText'),
        c('#0097A7', '#00BCD1', 'CanvasText'),
        c('#00796B', '#00CCB4', 'CanvasText')
    ],
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
    colors: [
        c('#4a5a6a', '#788FA1', 'CanvasText'),
        c('#8b6a58', '#A48470', 'CanvasText'),
        c('#3b5c5c', '#5F9595', 'CanvasText'),
        c('#7a6b42', '#A99860', 'CanvasText'),
        c('#5e4630', '#B08763', 'CanvasText'),
        c('#2a3b4e', '#708DB2', 'CanvasText')
    ],
    title: {
        text: 'Word cloud of recent travel news'
    },
    subtitle: {
        text: 'From a collection of news articles across the web'
    },
    tooltip: {
        followPointer: false,
        positioner: function (lW, lH) {
            const chart = this.chart,
                pos = chart.hoverPoint?.graphic.element.getBoundingClientRect(),
                offsetPos = chart.renderTo.getBoundingClientRect();
            if (!pos) {
                return {
                    x: 10,
                    y: 10
                };
            }
            return {
                x: Math.min(pos.x - offsetPos.x, chart.plotWidth - lW),
                y: Math.max(0, pos.y - offsetPos.y - lH)
            };
        },
        shape: 'rect',
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
                color: c('#222', '#eee', 'CanvasText')
            }
        },
        name: 'Occurrences',
        rotation: {
            to: 0
        },
        maxFontSize: 42
    }]
});
