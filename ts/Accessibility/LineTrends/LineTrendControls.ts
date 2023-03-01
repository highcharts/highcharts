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

/**
 * Set the detail level of the chart
 * @private
 */
function setDetailLevel(
    chart: Accessibility.ChartComposition, detail: 'full'|'medium'|'low'
): void {
    let i = chart.series.length;
    while (i--) {
        const s = chart.series[i] as SimplifiedChartSeries;
        if (s._isSimplifiedSeries) {
            s.remove();
        } else {
            s.setVisible(true, false);
        }
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
        msg = `Set detail to ${detail}. Chart now has ${numPoints} data points in total.`;
    announce(chart, msg);
}


/**
 * Start sonification mode
 * @private
 */
function startSonification(chart: Chart): void {
    chart.sonify();
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
        detailFieldset = document.createElement('fieldset'),
        fieldsetLegend = document.createElement('legend'),
        viewTableButton = document.createElement('button'),
        playAsSoundButton = document.createElement('button');

    el.className = 'highcharts-trend-controls';
    contentEl.className = 'highcharts-trend-controls-content';
    heading.textContent = 'Chart Controls';
    detailFieldset.appendChild(fieldsetLegend);

    let count = 0;
    const addRadio = (label: string, onClick: EventListener): void => {
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
    };

    fieldsetLegend.innerText = 'Chart detail level';
    addRadio('Full detail', (): void => setDetailLevel(chart, 'full'));
    addRadio('Medium detail', (): void => setDetailLevel(chart, 'medium'));
    addRadio('Low detail', (): void => setDetailLevel(chart, 'low'));

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
    contentEl.appendChild(detailFieldset);

    if ((chart as any).sonify) {
        playAsSoundButton.textContent = 'Play chart as sound';
        playAsSoundButton.onclick = (): void => startSonification(chart);
        contentEl.appendChild(playAsSoundButton);
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
