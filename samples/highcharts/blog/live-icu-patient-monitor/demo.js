const createChart = dataTable => Highcharts.chart('container', {

    dataTable,

    chart: {
        style: { fontFamily: '\'Courier New\', monospace' },
        animation: { duration: 500 }
    },

    time: { useUTC: false },

    title: {
        text: '⚠ ICU Patient Monitor - Live Feed',
        style: { fontSize: '15px', fontWeight: '600' }
    },
    subtitle: {
        text: 'ICU Bed 3 · Patient ID 7742 · ' +
            'Crisis event will trigger at t+30s',
        style: { color: '#ef4444', fontSize: '11px' }
    },

    xAxis: {
        type: 'datetime',
        tickPixelInterval: 120,
        maxPadding: 0.1
    },

    yAxis: [{
        title: {
            text: 'HR / RR'
        },
        min: 0,
        max: 160,
        plotBands: [{
            from: 60,
            to: 100,
            color: 'rgba(52, 211, 153, 0.05)'
        }],
        plotLines: [{
            value: 100,
            color: '#ef444433',
            width: 1,
            dashStyle: 'Dot'
        }]
    }, {
        title: {
            text: 'SpO₂ / SBP'
        },
        min: 60,
        max: 200,
        opposite: true,
        plotBands: [{
            from: 95,
            to: 100,
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
        shadow: false,
        headerFormat: '<b style="color:#94a3b8">{point.key}</b><br/>'
    },

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

    plotOptions: {
        series: {
            dataMapping: { x: 'time' },
            lineWidth: 2,
            marker: { radius: 3, enabled: false },
            states: {
                hover: { lineWidthPlus: 0 }
            }
        }
    },

    series: [{
        name: 'Heart rate',
        yAxis: 0,
        type: 'spline',
        dataMapping: { y: 'hr' },
        lineWidth: 2,
        marker: { radius: 3, enabled: false },
        tooltip: { valueSuffix: ' bpm' }
    }, {
        name: 'SpO₂',
        yAxis: 1,
        type: 'spline',
        dataMapping: { y: 'spo2' },
        lineWidth: 2,
        marker: { radius: 3, enabled: false },
        tooltip: { valueSuffix: ' %' }
    }, {
        name: 'Systolic BP',
        yAxis: 1,
        type: 'spline',
        dataMapping: { y: 'sbp' },
        lineWidth: 2,
        marker: { radius: 3, enabled: false },
        tooltip: { valueSuffix: ' mmHg' }
    }, {
        name: 'Respiratory rate',
        yAxis: 0,
        type: 'spline',
        dataMapping: { y: 'rr' },
        lineWidth: 2,
        dashStyle: 'ShortDot',
        marker: { radius: 3, enabled: false },
        tooltip: { valueSuffix: ' breaths/min' }
    }],

    credits: { enabled: false }
});

// Palette — centralized color system for dark ICU theme
Highcharts.setOptions({
    palette: {
        colorScheme: 'dark',
        dark: {
            backgroundColor: '#0d1117',
            neutralColor: '#e2e8f0',
            highlightColor: '#ef4444',
            colors: [
                '#ef4444',   // Heart rate – red
                '#38bdf8',   // SpO₂ – sky blue
                '#f59e0b',   // Systolic BP – amber
                '#a78bfa'    // Respiratory rate – violet
            ]
        }
    }
});

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
    }, 100);
});

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
const now = new Date().getTime();

const dataTable = new Highcharts.DataTable();
for (let i = -29; i <= 0; i++) {
    dataTable.setRow({ time: now + i * 1000, ...getNextVitals() });
}

createChart(dataTable);

// Update vitals every second
setInterval(() => {
    const v = getNextVitals();
    dataTable.deleteRows(0);
    dataTable.setRow({
        time: new Date().getTime(),
        hr: v.hr,
        spo2: v.spo2,
        sbp: v.sbp,
        rr: v.rr
    });
}, 1000);