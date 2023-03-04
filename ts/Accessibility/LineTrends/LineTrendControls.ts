/* *
 *
 *  (c) 2023 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Add trend controls to line chart.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import type Accessibility from '../Accessibility';
import type Chart from '../../Core/Chart/Chart';
import type Point from '../../Core/Series/Point';

import HU from '../Utils/HTMLUtilities.js';
const {
    getHeadingTagNameForElement
} = HU;
import SL from './SimplifyLine.js';
const {
    simplifyLine
} = SL;


// Announce message to screen readers
const announce = (
    chart: Accessibility.ChartComposition, msg: string
): void | undefined =>
    chart.accessibility && chart.accessibility.components.infoRegions
        .announcer.announce(msg);


type SimplifiedChartSeries = Accessibility.SeriesComposition & {
    _isSimplifiedSeries?: boolean;
};

type SimplifiedChart = Accessibility.ChartComposition & {
    _resetTrendDetail?: Function;
};


/**
 * Play or pause chart.
 * @private
 */
function chartPlayPause(chart: Chart): void {
    const timeline = chart.sonification && chart.sonification.timeline;
    if (!chart.sonification) {
        return;
    }
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    if (timeline && chart.sonification.isPlaying()) {
        timeline.pause();
    } else if (timeline && timeline.isPaused) {
        timeline.resume();
    } else {
        chart.sonify();
    }
}


/**
 * Set up keyboard nav for chart sonification on a div with role="application".
 * @private
 */
function initSonificationKeyboardNav(
    chart: Chart, keysource: HTMLElement, liveRegion: HTMLElement
): void {
    let announceTimeout: number;
    const afterNavigate = (
        t: unknown, pointsPlayed: Accessibility.PointComposition[]
    ): void => {
        if (!pointsPlayed.length) {
            return;
        }
        announceTimeout = setTimeout((): unknown => (
            liveRegion.textContent = pointsPlayed.reduce((acc, cur): string => {
                const el = cur.graphic && cur.graphic.element,
                    label = el && el.getAttribute('aria-label');
                if (!label) {
                    return acc;
                }
                return acc ? ` ${label}` : label;
            }, '')), 200);
    };

    keysource.addEventListener('keydown', (e): void => {
        if (!chart.sonification) {
            return;
        }
        liveRegion.textContent = '';
        clearTimeout(announceTimeout);
        switch (e.key) {
            case 'ArrowUp':
            case 'ArrowLeft':
                if (chart.sonification.timeline) {
                    (chart.sonification.timeline as any)._navigating = true;
                }
                chart.sonification.playAdjacent(false, afterNavigate,
                    (e): boolean => !!e.relatedPoint);
                if (chart.sonification.timeline) {
                    delete (chart.sonification.timeline as any)._navigating;
                }
                e.preventDefault();
                break;
            case 'ArrowDown':
            case 'ArrowRight':
                if (chart.sonification.timeline) {
                    (chart.sonification.timeline as any)._navigating = true;
                }
                chart.sonification.playAdjacent(true, afterNavigate,
                    (e): boolean => !!e.relatedPoint);
                if (chart.sonification.timeline) {
                    delete (chart.sonification.timeline as any)._navigating;
                }
                e.preventDefault();
                break;
            case ' ':
                chartPlayPause(chart);
                e.preventDefault();
                break;
            case 'Escape':
                chart.sonification.cancel();
                break;
        }
    });
}

/**
 * Set the detail level of the chart
 * @private
 */
function setDetailLevel(
    chart: SimplifiedChart, detail: 'full'|'medium'|'low'
): void {
    if (chart._resetTrendDetail) {
        chart._resetTrendDetail();
    }

    if (detail !== 'full') {
        const numPoints = detail === 'low' ? 7 : 25,
            newSeries = chart.series.map(
                (s): Point[] => simplifyLine(s.points, numPoints)
            );
        chart.series.forEach((series): void => series.setVisible(false, false));
        newSeries.forEach((points, ix): void => {
            const origSeries = chart.series[ix],
                s = chart.addSeries({
                    name: origSeries.name + ` (${detail} detail)`,
                    color: origSeries.color,
                    data: points.map((p): number[] => [p.x, p.y as number]),
                    animation: false
                }, false);
            (s as SimplifiedChartSeries)._isSimplifiedSeries = true;
        });
    }

    chart.redraw();

    const numPoints = chart.series.reduce((acc, cur): number =>
            acc + (cur.visible ? cur.points.length : 0), 0),
        msg = `Set smoothing to ${detail}. Chart now has ${numPoints} data points in total.`;
    announce(chart, msg);
}


/**
 * Add HTML trend controls to a line chart.
 * @private
 */
function addLineTrendControls(chart: Accessibility.ChartComposition): void {
    const rootHLevel = parseInt(
            getHeadingTagNameForElement(chart.renderTo)[1] || '1', 10
        ),
        el = document.createElement('div'),
        contentEl = document.createElement('div'),
        heading = document.createElement('h' + (rootHLevel + 1)),
        explanatoryP = document.createElement('p'),
        detailFieldset = document.createElement('fieldset'),
        fieldsetLegend = document.createElement('legend'),
        viewTableButton = document.createElement('button'),
        playAsSoundButton = document.createElement('button');

    el.className = 'highcharts-trend-controls';
    contentEl.className = 'highcharts-trend-controls-content';
    heading.textContent = 'Controls for interactive chart';
    explanatoryP.textContent = 'Set detail level for the interactive chart ' +
        'below, play the chart as sound, or view it as a data table.';
    detailFieldset.appendChild(fieldsetLegend);

    let count = 0;
    const addRadio = (
        label: string, onClick: EventListener
    ): HTMLInputElement => {
        const id = `highcharts-trend-ctrl-input-${count++}`,
            inputEl = document.createElement('input'),
            labelEl = document.createElement('label');
        inputEl.id = id;
        inputEl.type = 'radio';
        inputEl.name = 'detailLevel';
        if (count === 1) {
            inputEl.checked = true;
        }
        inputEl.addEventListener('click', onClick);
        labelEl.textContent = label;
        labelEl.setAttribute('for', id);
        detailFieldset.appendChild(inputEl);
        detailFieldset.appendChild(labelEl);
        return inputEl;
    };

    fieldsetLegend.innerText = 'Apply chart smoothing';
    const fullDetail = addRadio('Full detail',
        (): void => setDetailLevel(chart, 'full'));
    addRadio('Medium detail', (): void => setDetailLevel(chart, 'medium'));
    addRadio('Overall shape only',
        (): void => setDetailLevel(chart, 'low'));

    (chart as SimplifiedChart)._resetTrendDetail = (check?: boolean): void => {
        let i = chart.series.length;
        while (i--) {
            const s = chart.series[i] as SimplifiedChartSeries;
            if (s._isSimplifiedSeries) {
                s.remove();
            } else {
                s.setVisible(true, false);
            }
        }
        if (check && !fullDetail.checked) {
            fullDetail.checked = true;
            announce(chart, 'Showing full detail');
        }
    };

    viewTableButton.textContent = 'Show data table';
    viewTableButton.setAttribute('aria-expanded', false);
    viewTableButton.onclick = (): void => {
        if (chart.isDataTableVisible) {
            viewTableButton.textContent = 'Show data table';
            chart.hideData();
        } else {
            viewTableButton.textContent = 'Hide data table';
            chart.viewData();
        }
        viewTableButton.setAttribute('aria-expanded',
            !!chart.isDataTableVisible);
    };

    el.appendChild(heading);
    el.appendChild(explanatoryP);
    contentEl.appendChild(detailFieldset);

    if ((chart as any).sonify) {
        const sonificationDialog = document.createElement('dialog'),
            closeDialog = document.createElement('button'),
            sonifyButton = document.createElement('button'),
            application = document.createElement('div');

        sonificationDialog.className = 'highcharts-sonification-dialog';

        closeDialog.textContent = 'Close';
        closeDialog.onclick = (): void => {
            sonificationDialog.close();
            if (chart.sonification) {
                chart.sonification.cancel();
            }
        };
        sonificationDialog.appendChild(closeDialog);

        sonifyButton.textContent = 'Play';
        sonifyButton.onclick = (): void => chartPlayPause(chart);
        sonificationDialog.appendChild(sonifyButton);

        application.textContent = 'Press Spacebar to play and pause, and use ' +
            'arrow keys to move around the chart. Press ESC to end.';
        application.setAttribute('role', 'application');
        application.setAttribute('tabindex', 0);
        application.setAttribute('aria-label', 'Audio Chart');
        application.autofocus = true;
        sonificationDialog.appendChild(application);

        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'assertive');
        liveRegion.style.opacity = '0';
        liveRegion.style.position = 'absolute';
        liveRegion.style.width = '1px';
        liveRegion.style.height = '1px';

        playAsSoundButton.textContent = 'Play chart as sound';
        playAsSoundButton.onclick = (): void => {
            sonificationDialog.showModal();
            setTimeout((): unknown => application.focus(), 200);
            setTimeout((): unknown =>
                (liveRegion.textContent = application.textContent), 1000);
        };
        initSonificationKeyboardNav(chart, sonificationDialog, liveRegion);
        sonificationDialog.appendChild(liveRegion);
        contentEl.appendChild(playAsSoundButton);
        contentEl.appendChild(sonificationDialog);
    }

    contentEl.appendChild(viewTableButton);
    el.appendChild(contentEl);
    chart.renderTo.parentNode.insertBefore(el, chart.renderTo);
}


/* *
 *
 *  Default Export
 *
 * */

export default addLineTrendControls;
