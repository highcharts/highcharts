const HC_CONFIGS = {
    // ===== Row 1: Time series (line) =====
    chart1: {
        a11y: { enabled: true },
        title: { text: 'U.S Solar Employment Growth', align: 'left' },
        subtitle: {
            text: 'By Job Category. Source: <a href="https://irecusa.org/' +
                  'programs/solar-jobs-census/" target="_blank">IREC</a>.',
            align: 'left'
        },
        yAxis: { title: { text: 'Number of Employees' } },
        legend: { layout: 'vertical', align: 'right', verticalAlign: 'middle' },
        plotOptions: {
            series: {
                label: { connectorAllowed: false },
                pointStart: 2010
            }
        },
        series: [
            {
                name: 'Installation & Developers',
                data: [
                    43934, 48656, 65165, 81827, 112143, 142383, 171533,
                    165174, 155157, 161454, 154610, 168960, 171558
                ]
            },
            {
                name: 'Manufacturing',
                data: [
                    24916, 37941, 29742, 29851, 32490, 30282, 38121,
                    36885, 33726, 34243, 31050, 33099, 33473
                ]
            },
            {
                name: 'Sales & Distribution',
                data: [
                    11744, 30000, 16005, 19771, 20185, 24377, 32147,
                    30912, 29243, 29213, 25663, 28978, 30618
                ]
            },
            {
                name: 'Operations & Maintenance',
                data: [
                    null, null, null, null, null, null, null, null,
                    11164, 11218, 10077, 12530, 16585
                ]
            },
            {
                name: 'Other',
                data: [
                    21908, 5548, 8105, 11248, 8989, 11816, 18274,
                    17300, 13053, 11906, 10073, 11471, 11648
                ]
            }
        ]
    },
    chart2: {
        chart: { type: 'line' },
        title: { text: 'Placeholder TS 2' },
        series: [{ data: [1, 2, 3] }]
    },
    chart3: {
        chart: { type: 'line' },
        title: { text: 'Placeholder TS 3' },
        series: [{ data: [1, 2, 3] }]
    },

    // ===== Row 2: Categorical (column) =====
    chart4: {
        chart: { type: 'column' },
        title: { text: 'Corn vs wheat estimated production for 2023' },
        xAxis: {
            categories: ['USA', 'China', 'Brazil', 'EU', 'Argentina', 'India'],
            crosshair: true
        },
        yAxis: { min: 0, title: { text: '1000 metric tons (MT)' } },
        tooltip: { valueSuffix: ' (1000 MT)' },
        series: [
            {
                name: 'Corn',
                data: [387749, 280000, 129000, 64300, 54000, 34300]
            },
            {
                name: 'Wheat',
                data: [45321, 140000, 10000, 140500, 19500, 113500]
            }
        ]
    },
    chart5: {
        chart: { type: 'column' },
        title: { text: 'Placeholder Cat 2' },
        series: [{ data: [1, 2, 3] }]
    },
    chart6: {
        chart: { type: 'column' },
        title: { text: 'Placeholder Cat 3' },
        series: [{ data: [1, 2, 3] }]
    },

    // ===== Row 3: Composition (pie) =====
    chart7: {
        chart: { type: 'pie' },
        title: { text: 'Egg Yolk Composition' },
        series: [{
            name: 'Percentage',
            colorByPoint: true,
            data: [
                { name: 'Water', y: 55.02 },
                { name: 'Fat', y: 26.71 },
                { name: 'Carbohydrates', y: 1.09 },
                { name: 'Protein', y: 15.5 },
                { name: 'Ash', y: 1.68 }
            ]
        }]
    },
    chart8: {
        chart: { type: 'pie' },
        title: { text: 'Placeholder Pie 2' },
        series: [{ data: [1, 2, 3] }]
    },
    chart9: {
        chart: { type: 'pie' },
        title: { text: 'Placeholder Pie 3' },
        series: [{ data: [1, 2, 3] }]
    },

    // ===== Row 4: Flow (sankey) =====
    chart10: {
        chart: {
            zooming: { type: 'xy' },
            panning: { enabled: true, type: 'xy' },
            panKey: 'shift'
        },
        title: { text: 'Estimated US Energy Consumption in 2022' },
        tooltip: {
            headerFormat: null,
            pointFormat:
                '{point.fromNode.name} \u2192 {point.toNode.name}: ' +
                '{point.weight:.2f} quads',
            nodeFormat: '{point.name}: {point.sum:.2f} quads'
        },
        series: [{
            type: 'sankey',
            keys: ['from', 'to', 'weight'],
            nodes: [
                { id: 'Electricity & Heat', color: '#ffa500', offset: -110 },
                { id: 'Net Import', color: '000000' },
                { id: 'Residential', color: '#74ffe7', column: 2, offset: 50 },
                { id: 'Commercial', color: '#8cff74', column: 2, offset: 50 },
                { id: 'Industrial', color: '#ff8da1', column: 2, offset: 50 },
                {
                    id: 'Transportation',
                    color: '#f4c0ff',
                    column: 2,
                    offset: 50
                },
                {
                    id: 'Rejected Energy',
                    color: '#e6e6e6',
                    column: 3,
                    offset: -30
                },
                { id: 'Energy Services', color: '#F9E79F', column: 3 },
                { id: 'Solar', color: '#009c00' },
                { id: 'Nuclear', color: '#1a8dff' },
                { id: 'Hydro', color: '#009c00' },
                { id: 'Wind', color: '#009c00' },
                { id: 'Geothermal', color: '#009c00' },
                { id: 'Natural Gas', color: '#1a8dff' },
                { id: 'Biomass', color: '#009c00' },
                { id: 'Coal', color: '#989898' },
                { id: 'Petroleum', color: '#989898', offset: -1 }
            ],
            data: [
                ['Net Import', 'Electricity & Heat', 0.14],
                ['Solar', 'Electricity & Heat', 1.28],
                ['Nuclear', 'Electricity & Heat', 8.05],
                ['Hydro', 'Electricity & Heat', 2.31],
                ['Wind', 'Electricity & Heat', 3.84],
                ['Geothermal', 'Electricity & Heat', 0.15],
                ['Natural Gas', 'Electricity & Heat', 12.5],
                ['Coal', 'Electricity & Heat', 8.9],
                ['Biomass', 'Electricity & Heat', 0.41],
                ['Petroleum', 'Electricity & Heat', 0.24],

                ['Electricity & Heat', 'Residential', 5.19],
                ['Solar', 'Residential', 0.4],
                ['Geothermal', 'Residential', 0.04],
                ['Natural Gas', 'Residential', 5.17],
                ['Biomass', 'Residential', 0.48],
                ['Petroleum', 'Residential', 0.98],

                ['Electricity & Heat', 'Commercial', 4.69],
                ['Solar', 'Commercial', 0.16],
                ['Geothermal', 'Commercial', 0.02],
                ['Natural Gas', 'Commercial', 3.65],
                ['Coal', 'Commercial', 0.02],
                ['Biomass', 'Commercial', 0.15],
                ['Petroleum', 'Commercial', 0.88],

                ['Electricity & Heat', 'Industrial', 3.44],
                ['Solar', 'Industrial', 0.04],
                ['Natural Gas', 'Industrial', 10.8],
                ['Coal', 'Industrial', 0.99],
                ['Biomass', 'Industrial', 2.27],
                ['Petroleum', 'Industrial', 9.13],

                ['Electricity & Heat', 'Transportation', 0.02],
                ['Natural Gas', 'Transportation', 1.29],
                ['Biomass', 'Transportation', 1.57],
                ['Petroleum', 'Transportation', 24.6],

                ['Electricity & Heat', 'Rejected Energy', 24.3],
                ['Residential', 'Rejected Energy', 4.29],
                ['Commercial', 'Rejected Energy', 3.35],
                ['Industrial', 'Rejected Energy', 13.6],
                ['Transportation', 'Rejected Energy', 21.7],

                ['Residential', 'Energy Services', 7.97],
                ['Commercial', 'Energy Services', 6.22],
                ['Industrial', 'Energy Services', 13.1],
                ['Transportation', 'Energy Services', 5.77]
            ],
            dataLabels: {
                style: { color: 'var(--highcharts-neutral-color-100, #000)' }
            }
        }]
    },
    chart11: {
        chart: { },
        title: { text: 'Placeholder Sankey 2' },
        series: [{ type: 'sankey', data: [['A', 'B', 1], ['B', 'C', 2]] }]
    },
    chart12: {
        chart: { },
        title: { text: 'Placeholder Sankey 3' },
        series: [{ type: 'sankey', data: [['X', 'Y', 2], ['Y', 'Z', 1]] }]
    },

    // ===== Row 5: Distribution (histogram) =====
    chart13: {
        chart: { type: 'column' },
        title: { text: 'Histogram using a column chart' },
        xAxis: {
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            crosshair: true
        },
        yAxis: { min: 0, title: { text: '' } },
        tooltip: {
            headerFormat:
                '<span style="font-size:10px">{point.key}</span><table>',
            pointFormat:
                '<tr><td style="color:{series.color};padding:0">' +
                '{series.name}: </td>' +
                '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
            footerFormat: '</table>',
            shared: true,
            useHTML: true
        },
        plotOptions: {
            column: {
                pointPadding: 0,
                borderWidth: 0,
                groupPadding: 0,
                shadow: false
            }
        },
        series: [{
            name: 'Data',
            data: [
                49.9, 71.5, 106.4, 129.2, 144.0, 176.0,
                135.6, 124.1, 95.6, 54.4
            ]
        }]
    },

    chart14: {
        chart: { type: 'histogram' },
        title: { text: 'Placeholder Hist 2' },
        series: [{ data: [1, 2, 3] }]
    },
    chart15: {
        chart: { type: 'histogram' },
        title: { text: 'Placeholder Hist 3' },
        series: [{ data: [1, 2, 3] }]
    },

    // ===== Row 6: Distribution (boxplot) =====
    chart16: {
        chart: { type: 'boxplot' },
        title: { text: 'Boxplot A' },
        xAxis: { categories: ['A'] },
        series: [{ data: [[760, 801, 848, 895, 965]] }]
    },
    chart17: {
        chart: { type: 'boxplot' },
        title: { text: 'Boxplot B' },
        xAxis: { categories: ['B'] },
        series: [{ data: [[610, 680, 735, 802, 980]] }]
    },
    chart18: {
        chart: { type: 'boxplot' },
        title: { text: 'Boxplot C' },
        xAxis: { categories: ['C'] },
        series: [{ data: [[510, 590, 640, 690, 760]] }]
    },

    // ===== Row 7: Continuous scatter (bubble) =====
    chart19: {
        chart: { type: 'bubble' },
        title: { text: 'Bubble A' },
        series: [{
            data: [
                { x: 1, y: 1, z: 1 },
                { x: 2, y: 2, z: 2 },
                { x: 3, y: 3, z: 3 }
            ]
        }]
    },
    chart20: {
        chart: { type: 'bubble' },
        title: { text: 'Bubble B' },
        series: [{
            data: [
                { x: 3, y: 1, z: 2 },
                { x: 4, y: 2, z: 1 },
                { x: 5, y: 3, z: 2 }
            ]
        }]
    },
    chart21: {
        chart: { type: 'bubble' },
        title: { text: 'Bubble C' },
        series: [{
            data: [
                { x: 2, y: 3, z: 1 },
                { x: 3, y: 2, z: 2 },
                { x: 4, y: 1, z: 3 }
            ]
        }]
    },

    // ===== Row 8: Hierarchical composition (treemap) =====
    chart22: {
        title: { text: 'Treemap A' },
        series: [{
            type: 'treemap',
            data: [
                { name: 'A', value: 6 },
                { name: 'B', value: 3 },
                { name: 'C', value: 1 }
            ]
        }]
    },
    chart23: {
        title: { text: 'Treemap B' },
        series: [{
            type: 'treemap',
            data: [
                { name: 'A', value: 4 },
                { name: 'B', value: 4 },
                { name: 'C', value: 2 }
            ]
        }]
    },
    chart24: {
        title: { text: 'Treemap C' },
        series: [{
            type: 'treemap',
            data: [
                { name: 'A', value: 5 },
                { name: 'B', value: 2 },
                { name: 'C', value: 3 }
            ]
        }]
    },

    // ===== Row 9: Sequential (waterfall) =====
    chart25: {
        chart: { type: 'waterfall' },
        title: { text: 'Waterfall A' },
        xAxis: { categories: ['Start', 'Step 1', 'Step 2', 'End'] },
        series: [{
            data: [
                { y: 10, isSum: true },
                5, -3,
                { y: 12, isSum: true }
            ]
        }]
    },
    chart26: {
        chart: { type: 'waterfall' },
        title: { text: 'Waterfall B' },
        xAxis: { categories: ['Start', 'Up', 'Down', 'End'] },
        series: [{
            data: [
                { y: 8, isSum: true },
                2, -1,
                { y: 9, isSum: true }
            ]
        }]
    },
    chart27: {
        chart: { type: 'waterfall' },
        title: { text: 'Waterfall C' },
        xAxis: { categories: ['Start', 'Adj', 'Adj', 'End'] },
        series: [{ data: [{ y: 6, isSum: true }, 1, 1, { y: 8, isSum: true }] }]
    },

    // ===== Row 10: Textual (wordcloud) =====
    chart28: {
        title: { text: 'Wordcloud A' },
        series: [
            {
                type: 'wordcloud',
                data: [
                    { name: 'alpha', weight: 3 },
                    { name: 'beta', weight: 2 },
                    { name: 'gamma', weight: 1 }
                ]
            }
        ]
    },
    chart29: {
        title: { text: 'Wordcloud B' },
        series: [
            {
                type: 'wordcloud',
                data: [
                    { name: 'delta', weight: 2 },
                    { name: 'epsilon', weight: 2 },
                    { name: 'zeta', weight: 1 }
                ]
            }
        ]
    },
    chart30: {
        title: { text: 'Wordcloud C' },
        series: [
            {
                type: 'wordcloud',
                data: [
                    { name: 'eta', weight: 3 },
                    { name: 'theta', weight: 1 },
                    { name: 'iota', weight: 1 }
                ]
            }
        ]
    },

    // ===== Row 11: KPI (solid gauge) =====
    chart31: {
        chart: { type: 'solidgauge' },
        title: { text: 'KPI A' },
        pane: {
            startAngle: -90,
            endAngle: 90,
            background: [{ outerRadius: '100%', innerRadius: '60%' }]
        },
        yAxis: { min: 0, max: 100, title: { text: null } },
        series: [{ data: [55] }]
    },
    chart32: {
        chart: { type: 'solidgauge' },
        title: { text: 'KPI B' },
        pane: {
            startAngle: -90,
            endAngle: 90,
            background: [{ outerRadius: '100%', innerRadius: '60%' }]
        },
        yAxis: { min: 0, max: 100, title: { text: null } },
        series: [{ data: [72] }]
    },
    chart33: {
        chart: { type: 'solidgauge' },
        title: { text: 'KPI C' },
        pane: {
            startAngle: -90,
            endAngle: 90,
            background: [{ outerRadius: '100%', innerRadius: '60%' }]
        },
        yAxis: { min: 0, max: 100, title: { text: null } },
        series: [{ data: [38] }]
    },

    // ===== Row 12: Polar/Radar (line, polar) =====
    chart34: {
        chart: { polar: true, type: 'line' },
        title: { text: 'Radar A' },
        xAxis: {
            categories: ['M', 'T', 'W', 'T', 'F'],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0, min: 0 },
        series: [{
            name: 'Series 1',
            data: [1, 2, 3, 2, 1],
            pointPlacement: 'on'
        }]
    },
    chart35: {
        chart: { polar: true, type: 'line' },
        title: { text: 'Radar B' },
        xAxis: {
            categories: ['A', 'B', 'C', 'D', 'E'],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0, min: 0 },
        series: [{
            name: 'Series 1',
            data: [2, 1, 2, 3, 2],
            pointPlacement: 'on'
        }]
    },
    chart36: {
        chart: { polar: true, type: 'line' },
        title: { text: 'Radar C' },
        xAxis: {
            categories: ['P', 'Q', 'R', 'S', 'T'],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },
        yAxis: { gridLineInterpolation: 'polygon', lineWidth: 0, min: 0 },
        series: [{
            name: 'Series 1',
            data: [3, 2, 1, 2, 3],
            pointPlacement: 'on'
        }]
    }
};


(function POC_A11Y_DESC_PLUGIN(Highcharts) {
    const H = Highcharts;

    H.addEvent(H.Chart, 'beforeA11yUpdate', function (e) {
        if (this.options?.a11y?.enabled === false || !this.a11y) {
            return;
        }

        const fam = familyOf(this);
        let html = `<p>${basicSummary(this)}</p>`;
        if (fam === 'timeseries') {
            html += describeTimeseries(this);
        } else if (fam === 'categorical') {
            html += describeCategorical(this);
        } else if (fam === 'composition') {
            html += describeComposition(this);
        } else if (fam === 'flow') {
            html += describeSankey(this);
        } else if (fam === 'distribution') {
            html += describeDistribution(this);
        } else if (fam === 'grid') {
            html += describeHeatmap(this);
        }

        e.chartDetailedInfo.chartAutoDescription = html;

        // --- NEW: keep a copy and paint the debug panel
        this.__autoDescHTML = html;
        updateA11yDebugPanel(this, html);
    });
}(Highcharts));

function updateA11yDebugPanel(chart, html) {
    const chartEl = chart?.renderTo; // the <div id="chartX">
    if (!chartEl) {
        return;
    }

    // container where we’ll append the debug div (chart wrapper if present)
    const wrapper = chartEl.parentElement || chartEl;

    // find or create the panel
    const id = chartEl.id ? chartEl.id + '-a11y-debug' : '';
    let panel = wrapper.querySelector('.a11y-debug');
    if (!panel) {
        panel = document.createElement('div');
        panel.className = 'a11y-debug';
        if (id) {
            panel.id = id;
        }
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-label', 'Auto-description debug');
        // Put it right after the chart area
        wrapper.appendChild(panel);
    }

    // inject the HTML we just produced
    panel.innerHTML = `
      <div class="a11y-debug__title">Auto-description:</div>
      <div class="a11y-debug__content">${html}</div>
    `;
}


/* Sort chart types into families */
function familyOf(chart) {
    const override = chart.options?.custom?.family;
    if (override) {
        return override;
    }

    const t =
    (chart.options?.chart?.type || chart.series?.[0]?.type || '').toLowerCase();

    if (t === 'column') {
        return chart.xAxis?.[0]?.isDatetimeAxis ? 'timeseries' : 'categorical';
    }
    if (t === 'pie') {
        return 'composition';
    }
    if (t === 'heatmap') {
        return 'grid';
    }
    if (t === 'sankey') {
        return 'flow';
    }
    if (t === 'histogram') {
        return 'distribution';
    }
    if (
        [
            'line', 'spline', 'area', 'arearange',
            'areaspline', 'streamgraph', 'xrange'
        ]
            .includes(t)
    ) {
        return 'timeseries';
    }
    return 'generic';
}

/* Create a basic start of the summary for all charts*/
function basicSummary(chart) {
    const type = (chart.options?.chart?.type ||
        chart.series?.[0]?.type || '').toLowerCase();

    const typeLabel = ({
        line: 'Line chart',
        spline: 'Line chart',
        area: 'Area chart',
        column: 'Column chart',
        bar: 'Bar chart',
        pie: 'Pie chart',
        heatmap: 'Heatmap',
        sankey: 'Sankey diagram',
        histogram: 'Histogram'
    })[type] || 'Chart';

    const family = familyOf(chart);
    const visibleSeries = chart.series.filter(s => s.visible !== false);

    // For pie, report slices instead of series.
    if (family === 'composition') {
        const s = visibleSeries[0]; // pie has one series visually
        const slices = (s?.points || []).filter(p => p.visible !== false);
        const names = slices.map(p => p.name || 'Unnamed slice');

        const formatted = names.length <= 1 ?
            (names[0] || '') :
            names.length === 2 ?
                names.join(' and ') :
                names.slice(0, -1).join(', ') + ', and ' + names.slice(-1);

        return `${typeLabel} with ${slices.length} 
            slices${formatted ? `: ${formatted}` : ''}.`;
    }

    // For sankey, report nodes and links instead of series.
    if (family === 'flow') {

        const sankeySeries =
            visibleSeries.filter(s => (s.type || s.options?.type) === 'sankey');

        const allNodes = new Map();
        let linkCount = 0;

        sankeySeries.forEach(s => {
            const nodesOpt = s.options?.nodes || [];
            const linksOpt = s.options?.data || [];
            linkCount += Array.isArray(linksOpt) ? linksOpt.length : 0;

            nodesOpt.forEach(n => {
                const key = (n.id ?? n.name ?? '').toString();
                if (key) {
                    allNodes.set(key, n.name || n.id);
                }
            });
        });

        const nodeNames = Array.from(allNodes.values());
        const nodeCount = nodeNames.length;

        let namesSnippet = '';
        if (nodeNames.length) {
            const show = nodeNames.slice(0, 6);
            const remaining = nodeNames.length - show.length;
            namesSnippet = show.join(', ') +
                (remaining > 0 ? `, and ${remaining} more` : '');
        }

        return `${typeLabel} with ${nodeCount} nodes and 
        ${linkCount} links${namesSnippet ? `: ${namesSnippet}` : ''}.`;
    }

    if (family === 'grid') {
        const s = chart.series[0]; // most heatmaps only have 1 series (?)
        const xCategory = chart.xAxis?.[0]?.categories || [];
        const yCategory = chart.yAxis?.[0]?.categories || [];
        const dimension = xCategory.length && yCategory.length ?
            `${xCategory.length}×${yCategory.length} cells` :
            `${s?.points?.length || 0} cells`;

        // Not sure if we can use cells, since heatmaps are not strictly
        // 2D, but the chart family says grid.
        return `${typeLabel} with ${dimension}${s?.name ?
            ` (${s.name})` : ''}.`;
    }


    // Default
    const seriesNames = visibleSeries.map(s => s.name || 'Unnamed');
    const formatted = seriesNames.length <= 1 ?
        (seriesNames[0] || '') :
        seriesNames.length === 2 ?
            seriesNames.join(' and ') :
            seriesNames.slice(0, -1)
                .join(', ') + ', and ' + seriesNames.slice(-1);

    return `${typeLabel} with ${visibleSeries.length} 
        series${formatted ? `: ${formatted}` : ''}.`;
}


function describeTimeseries() {
    return `
    <p>Installation & Developers dominates and has a growing peak from 
    2010-1016, the other categories stay consistent and move in parallel
    throughout the years</p>
    <ul>
        <li>X-axis: 2010–2022</li>
        <li>Y-axis: Number of Employees, range 5,548 – 171,558</li>
    </ul>
    <ul>
        <li>
        Highest value: 171,558 in series Installation & Developers in 2022
        </li>
        <li>Lowest value: 5,548 in series Other in 2011</li>
        <li>
        Largest change: increase of 30,316 between 2013–2014 in series 
        Installation & Developers
        </li>
    </ul>
    `;
}

function describeCategorical() {
    return `
    <ul>
        <li>X-axis: USA, China, Brazil, EU, Argentina, and India</li>
        <li>Y-axis: 1000 metric tons (MT)</li>
    </ul>
    <ul>
        <li>Highest value: 387,749 in Corn (USA)</li>
        <li>Lowest value: 10,000 in Wheat (Brazil)</li>
        <li>Corn peaks at 387,749 in USA</li>
        <li>Wheat peaks at 140,500 in EU</li>

    </ul>`;
}

function describeComposition() { // 5 slices
    return `
    <p>Water takes up over half of the yolk's composition!</p>
`;
}

function describeSankey() { // Wording like largest is good, need to fix desc
    return `
    <p>
        Energy flows primarily into Electricity & Heat,
        but large amounts are lost as Rejected Energy.
    </p>
    <ul>
        <li>Largest source: Petroleum.</li>
        <li>Main conversion hub: Electricity & Heat.</li>
        <li>Largest losses: Rejected Energy.</li>
    </ul>
    <p>Top flows:</p>
    <ul>
        <li>Petroleum to Transportation (24.6 quads)</li>
        <li>Electricity & Heat to Rejected Energy (24.3 quads)</li>
        <li>Natural Gas to Electricity & Heat (12.5 quads)</li>
    </ul>
    `;
}

function describeDistribution() {

    return `
    <p>Overall overview: gradual increase from Jan, 
        peaking mid-year, then decreasing toward Oct</p>
    <ul>
        <li>X-axis: Jan–Oct</li>
        <li>Y-axis: Values, Range: 50–176 mm</li>
    </ul>
    <ul>
        <li>Lowest bin: Jan and Oct, around 50 mm</li>
        <li>Peak: June, with 176 mm</li>
    </ul>`;
}

function describeHeatmap() { // Heatmap showing sales per employee
    return `
    <p>Overall overview: sales vary widely by employee, with Sophia 
        and Lukas consistently high, Anna consistently low</p>
    <ul>
        <li>X-axis: Employees (Alexander, Marie, Maximilian, 
        Sophia, Lukas, Maria, Leon, Anna, Tim, Laura)</li>
        <li>Y-axis: Weekdays (Monday–Friday)</li>
        <li>Range: 1–132 sales</li>
    </ul>
    <ul>
        <li>Highest sales: 132 by Sophia on Tuesday</li>
        <li>Lowest sales: 1 by Anna on Tuesday</li>
    </ul>`;
}

/* CHART SETUP */
const charts = {};
document.addEventListener('DOMContentLoaded', () => {
    Object.keys(HC_CONFIGS).forEach(id => {
        const el = document.getElementById(id);
        if (!el) {
            console.warn(`Missing container #${id}`);
            return;
        }
        charts[id] = Highcharts.chart(id, HC_CONFIGS[id]);
    });
});
