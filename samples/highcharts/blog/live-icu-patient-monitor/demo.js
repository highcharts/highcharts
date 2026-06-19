// Simulate realistic vital sign fluctuations around a baseline
function nextValue(current, baseline, variance, min, max) {
    const delta = (Math.random() - 0.5) * variance;
    const pulled = (baseline - current) * 0.15; // gentle pull toward baseline
    return Math.min(max, Math.max(min, current + delta + pulled));
}

// State for each vital
const state = {
    hr: { value: 78, baseline: 78, variance: 4, min: 40, max: 160 },
    spo2: { value: 97, baseline: 97, variance: 1, min: 80, max: 100 },
    sbp: { value: 125, baseline: 125, variance: 4, min: 60, max: 200 },
    rr: { value: 16, baseline: 16, variance: 1.5, min: 8, max: 40 }
};

// Simulate a critical event between t+30s and t+60s
let secondsElapsed = 0;
function inCrisis() {
    return secondsElapsed >= 30 && secondsElapsed <= 60;
}
function postCrisis() {
    return secondsElapsed > 60;
}

function getNextVitals() {
    secondsElapsed++;

    if (inCrisis()) {
        state.hr.baseline   = 135;
        state.hr.variance   = 8;
        state.spo2.baseline = 84;
        state.spo2.variance = 2;
        state.sbp.baseline  = 76;
        state.sbp.variance  = 6;
        state.rr.baseline   = 30;
        state.rr.variance   = 3;
    } else if (postCrisis()) {
        state.hr.baseline   = 82;
        state.hr.variance   = 3;
        state.spo2.baseline = 96;
        state.spo2.variance = 1;
        state.sbp.baseline  = 120;
        state.sbp.variance  = 3;
        state.rr.baseline   = 17;
        state.rr.variance   = 1;
    }

    for (const key of Object.keys(state)) {
        const s = state[key];
        s.value = nextValue(s.value, s.baseline, s.variance, s.min, s.max);
    }

    return {
        hr: Math.round(state.hr.value),
        spo2: parseFloat(state.spo2.value.toFixed(1)),
        sbp: Math.round(state.sbp.value),
        rr: Math.round(state.rr.value)
    };
}

// Seed initial 30 seconds of data
function buildInitialData() {
    const now = new Date().getTime();
    const series = { hr: [], spo2: [], sbp: [], rr: [] };

    for (let i = -29; i <= 0; i++) {
        const t = now + i * 1000;
        const v = getNextVitals();
        series.hr.push([t, v.hr]);
        series.spo2.push([t, v.spo2]);
        series.sbp.push([t, v.sbp]);
        series.rr.push([t, v.rr]);
    }
    return series;
}

// Pulsating marker on new point
Highcharts.addEvent(Highcharts.Series, 'addPoint', e => {
    const point = e.point,
        series = e.target;

    if (!series.pulse) {
        series.pulse = series.chart.renderer.circle().add(series.markerGroup);
    }

    setTimeout(() => {
        series.pulse
            .attr({
                x: series.xAxis.toPixels(point.x, true),
                y: series.yAxis.toPixels(point.y, true),
                r: 4,
                opacity: 1,
                fill: series.color
            })
            .animate({ r: 16, opacity: 0 }, { duration: 900 });
    }, 1);
});

const initial = buildInitialData();

Highcharts.chart('container', {
    chart: {
        backgroundColor: '#0d1117',
        style: { fontFamily: '\'Courier New\', monospace' },
        animation: { duration: 500 },
        events: {
            load: function () {
                const c = this;
                setInterval(function () {
                    const x = new Date().getTime();
                    const v = getNextVitals();
                    c.series[0].addPoint([x, v.hr],   true, true);
                    c.series[1].addPoint([x, v.spo2], true, true);
                    c.series[2].addPoint([x, v.sbp],  true, true);
                    c.series[3].addPoint([x, v.rr],   true, true);
                }, 1000);
            }
        }
    },

    time: { useUTC: false },

    title: {
        text: '⚠ ICU Patient Monitor - Live Feed',
        style: { color: '#e2e8f0', fontSize: '15px', fontWeight: '600' }
    },
    subtitle: {
        text: 'ICU Bed 3 · Patient ID 7742 · ' +
    'Crisis event will trigger at t+30s',
        style: { color: '#ef4444', fontSize: '11px' }
    },

    xAxis: {
        type: 'datetime',
        tickPixelInterval: 120,
        maxPadding: 0.1,
        labels: { style: { color: '#64748b', fontSize: '10px' } },
        lineColor: '#1f2937',
        tickColor: '#1f2937'
    },

    yAxis: [{
        title: { text: 'HR / RR', style: { color: '#64748b', fontSize: '10px' } },
        min: 0,
        max: 160,
        gridLineColor: '#1f2937',
        labels: { style: { color: '#64748b', fontSize: '10px' } },
        plotBands: [{
            from: 60, to: 100,
            color: 'rgba(52, 211, 153, 0.05)'
        }],
        plotLines: [{
            value: 100,
            color: '#ef444433',
            width: 1,
            dashStyle: 'Dot'
        }]
    }, {
        title: { text: 'SpO₂ / SBP', style: { color: '#64748b', fontSize: '10px' } },
        min: 60,
        max: 200,
        opposite: true,
        gridLineColor: '#1f2937',
        labels: { style: { color: '#64748b', fontSize: '10px' } },
        plotBands: [{
            from: 95, to: 100,
            color: 'rgba(56, 189, 248, 0.05)'
        }],
        plotLines: [{
            value: 90,
            color: '#38bdf833',
            width: 1,
            dashStyle: 'Dot'
        }]
    }],

    tooltip: {
        shared: true,
        backgroundColor: '#1f2937',
        borderColor: '#374151',
        style: { color: '#e2e8f0', fontSize: '11px' },
        shadow: false,
        headerFormat: '<b style="color:#94a3b8">{point.key}</b><br/>'
    },

    legend: {
        itemStyle: { color: '#94a3b8', fontSize: '11px' },
        itemHoverStyle: { color: '#e2e8f0' },
        backgroundColor: 'transparent'
    },

    exporting: { enabled: false },

    accessibility: {
        announceNewData: {
            enabled: true,
            minAnnounceInterval: 15000,
            announcementFormatter: function (allSeries, newSeries, newPoint) {
                if (newPoint) {
                    return 'New vitals recorded.';
                }
                return false;
            }
        }
    },

    series: [{
        name: 'Heart rate',
        yAxis: 0,
        type: 'spline',
        data: initial.hr,
        color: '#ef4444',
        lineWidth: 2,
        marker: { radius: 3, enabled: false },
        tooltip: { valueSuffix: ' bpm' }
    }, {
        name: 'SpO₂',
        yAxis: 1,
        type: 'spline',
        data: initial.spo2,
        color: '#38bdf8',
        lineWidth: 2,
        marker: { radius: 3, enabled: false },
        tooltip: { valueSuffix: ' %' }
    }, {
        name: 'Systolic BP',
        yAxis: 1,
        type: 'spline',
        data: initial.sbp,
        color: '#f59e0b',
        lineWidth: 2,
        marker: { radius: 3, enabled: false },
        tooltip: { valueSuffix: ' mmHg' }
    }, {
        name: 'Respiratory rate',
        yAxis: 0,
        type: 'spline',
        data: initial.rr,
        color: '#a78bfa',
        lineWidth: 2,
        dashStyle: 'ShortDot',
        marker: { radius: 3, enabled: false },
        tooltip: { valueSuffix: ' breaths/min' }
    }],

    credits: { enabled: false }
});