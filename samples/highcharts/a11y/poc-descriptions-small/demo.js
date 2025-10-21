// Spline w/Plotlines
const chart1desc = `
    <p> Helsinki temperatures rise steadily from winter lows below zero to
    a summer peak around July, before cooling again toward December. Oslo
    temperatures follows a similar pattern, but is generally milder in the
    winter and colder in the summer.
    </p>
    <p>
    The two series cross each other twice during
    the year, once in spring and once in autumn. Showing that Oslo is warmer
    than Helsinki in the winter, while Helsinki becomes warmer through
    summer.</p>
    <ul>
        <li>X-axis: Months January–December</li>
        <li>Y-axis: Temperature in °C, range –10°C to 20°C</li>
        <li>Summer period marked: May–September</li>
        <li>Helsinki highest value: ~17°C in July</li>
        <li>Helsinki lowest value: ~–6°C in February</li>
        <li>Oslo highest value: ~11°C in July–August</li>
        <li>Oslo lowest value: around 0°C in winter months</li>
        <li>Helsinki crosses above freezing in April and below 
        again in November</li>
        <li>Oslo remains mostly above freezing all year</li>
    </ul>
`;

// Stacked column
const chart2desc = `
    <p>Tokyo leads in both Espresso consumption and overall total.</p>
    <ul>
        <li>X-axis: Sydney, Berlin, New York, Tokyo</li>
        <li>Y-axis: Cups of Coffee, range 0–400</li>
        <li>Highest value: 370 total cups in Tokyo</li>
        <li>Lowest value: 260 total cups in Berlin</li>
    </ul>
`;


// Big heatmap
const chart3desc = `
    <p>Temperatures vary by both season and time of day, with the 
    warmest conditions in July and cooler periods at the start and 
    end of the year. Daytime generally warmer than nighttime across 
    all months.</p>
    <ul>
        <li>X-axis: Months January–December (2023)</li>
        <li>Y-axis: Hours of the day (0:00–18:00)</li>
        <li>Range: –10°C to 20°C</li>
        <li>Highest temperature: July, reaching around 20°C</li>
        <li>Lowest temperature: January, dropping to –10°C</li>
        <li>Warmest month average: June</li>
        <li>Coldest month average: December</li>
    </ul>
`;

// Gauge
const chart4desc = `
    <p>The scale is color-coded to show healthy, watch, 
    and overspend ranges. </p>
    <ul>
        <li>Current value: ~92% (yellow watch zone)</li>
        <li>Threshold for watch: above 80%</li>
        <li>Threshold for overspend: above 100%</li>
    </ul>
`;

// Bubble
const chart5desc = `
    <p>Almost all countries exceed safe sugar and fat levels, 
    with the U.S. the clear outlier</p>
    <ul>
        <li>X-axis: Daily fat intake (grams)</li>
        <li>Y-axis: Daily sugar intake (grams)</li>
        <li>Bubble size: Adult obesity percentage</li>
        <li>Reference lines: 
            <ul>
                <li>Safe fat intake: 65g/day (vertical dotted line)</li>
                <li>Safe sugar intake: 50g/day (horizontal dotted line)</li>
            </ul>
        </li>
        <li>Highest sugar intake: U.S. (126 g/day)</li>
        <li>Lowest sugar intake: Russia (20 g/day)</li>
        <li>Highest fat intake: Belgium (95 g/day)</li>
        <li>Lowest fat intake: Portugal (63 g/day) (</li>
        <li>Highest obesity rate: U.S. (35.3%)</li>
        <li>Lowest obesity rate: Italy (10%)</li>
        <li>Closer to safe levels: Portugal (63g fat, 52g sugar), Hungary 
        (65g fat, 51g sugar), Russia (69g fat, 20g sugar)</li>
    </ul>
`;

// Sunburst
const chart6desc = `
    <p>Engineering receives the largest share of the 2025 company budget,
    followed by Sales & Marketing; notable cost centers include Sales,
    Backend, and Frontend, while the smallest line items are discrete tools
    and training costs within HR and teams like QA/Data.</p>
    <ul>
        <li>Hierarchy: Company → Department → Team → Expense type</li>
        <li>Largest departments: Engineering (~$7.2M), 
        Sales & Marketing (~$5.1M)</li>
        <li>Largest teams: Sales (~$3.2M), Backend (~$2.8M), 
        Frontend (~$2.6M)</li>
        <li>Smallest nodes shown: HR Tools (~$50k) and other 
        low-cost tools/training items</li>
    </ul>
`;


const HC_CONFIGS = {
    chart1: { // Spline w/plotlines
        credits: {
            enabled: false
        },
        custom: { autoDesc: chart1desc },
        title: {
            text: 'Average Monthly Temperature: Helsinki vs Oslo',
            align: 'left',
            margin: 25
        },
        yAxis: {
            plotLines: [{
                value: 0,
                color: '#014CE5',
                dashStyle: 'shortDash',
                width: 2
            }],
            title: {
                enabled: false
            },
            labels: {
                format: '{text}°C'
            },
            gridLineWidth: 0
        },

        xAxis: {
            plotBands: [{
                from: 3.5,
                to: 8.5,
                color: 'rgba(16,185,129,0.15)',
                label: { text: 'Summer', align: 'left', x: 10 }
            }],
            plotLines: [{
                value: 3.5,
                color: '#10B981',       // teal edge
                width: 3
            }, {
                value: 8.5,
                color: '#10B981',       // teal edge
                width: 3
            }],
            crosshair: true,
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
                'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
            ]
        },

        legend: { enabled: true },
        tooltip: { shared: true, valueSuffix: '°C' },

        series: [
            {
                name: 'Helsinki',
                data: [-5, -6, -2, 4, 10, 14, 17, 15, 10, 6, 0, -4],
                color: '#014CE5'
            },
            {
                name: 'Oslo',
                data: [0, 0, 1, 3, 6, 9, 11, 11, 8, 5, 2, 0],
                color: '#EA293C'
            }
        ]
    },

    chart2: { // Stacked column
        credits: {
            enabled: false
        },
        custom: { autoDesc: chart2desc },
        chart: {
            type: 'column'
        },
        title: {
            text: 'Coffee Consumption by Office',
            align: 'left'
        },
        xAxis: {
            categories: ['Sydney', 'Berlin', 'New York', 'Tokyo']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Cups of Coffee'
            },
            stackLabels: {
                enabled: true
            }
        },
        tooltip: {
            headerFormat: '{category}<br/>',
            pointFormat:
                '{series.name}: {point.y}<br/>Total: {point.stackTotal}'
        },
        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true
                }
            }
        },
        series: [
            {
                name: 'Espresso',
                data: [120, 90, 80, 160],
                color: '#014CE5'
            },
            {
                name: 'Latte',
                data: [100, 70, 60, 90],
                color: '#10B981'
            },
            {
                name: 'Cappuccino',
                data: [80, 60, 75, 50],
                color: '#EAB308'
            },
            {
                name: 'Americano',
                data: [60, 40, 55, 70],
                color: '#EA293C'
            }
        ]
    },
    chart3: { // Big heatmap
        credits: {
            enabled: false
        },
        custom: {
            autoDesc: chart3desc
        },
        data: {
            csv: document.getElementById('csv').innerHTML
        },

        chart: {
            type: 'heatmap'
        },

        boost: {
            useGPUTranslations: true
        },

        title: {
            text: 'Highcharts heat map',
            align: 'left',
            x: 40
        },

        subtitle: {
            text: 'Temperature variation by day and hour through 2023',
            align: 'left',
            x: 40
        },

        xAxis: {
            type: 'datetime',
            min: '2023-01-01',
            max: '2023-12-31 23:59:59',
            labels: {
                align: 'left',
                x: 5,
                y: 14,
                format: '{value:%B}' // long month
            },
            showLastLabel: false,
            tickLength: 16
        },

        yAxis: {
            title: {
                text: null
            },
            labels: {
                format: '{value}:00'
            },
            minPadding: 0,
            maxPadding: 0,
            startOnTick: false,
            endOnTick: false,
            tickPositions: [0, 6, 12, 18, 24],
            tickWidth: 1,
            min: 0,
            max: 23,
            reversed: true
        },

        colorAxis: {
            stops: [
                [0.00, 'rgba(1, 76, 229, 0.6)'],
                [0.375, 'rgba(16, 185, 129, 0.6)'],
                [0.625, 'rgba(234, 179, 8, 0.6)'],
                [0.875, 'rgba(244, 118, 0, 0.6)'],
                [1.00, 'rgba(234, 41, 60, 0.6)']
            ],
            min: -15,
            max: 25,
            startOnTick: false,
            endOnTick: false,
            labels: {
                format: '{value}℃'
            }
        },

        series: [{
            boostThreshold: 100,
            borderWidth: 0,
            nullColor: '#EFEFEF',
            colsize: 24 * 36e5, // one day
            tooltip: {
                headerFormat: 'Temperature<br/>',
                pointFormat: '{point.x:%e %b, %Y} {point.y}:00: ' +
                    '<b>{point.value} ℃</b>'
            }
        }]
    },
    chart4: {
        credits: {
            enabled: false
        },
        custom: { autoDesc: chart4desc },
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
            height: '80%'
        },

        title: { text: 'Monthly Budget Tracker' },

        pane: {
            startAngle: -90,
            endAngle: 89.9,
            background: null,
            center: ['50%', '75%'],
            size: '110%'
        },

        yAxis: {
            min: 0,
            max: 120, // allow a little overspend
            tickPixelInterval: 72,
            tickPosition: 'inside',
            tickColor: 'var(--highcharts-background-color, #FFFFFF)',
            tickLength: 20,
            tickWidth: 2,
            minorTickInterval: null,
            labels: {
                distance: 20,
                style: { fontSize: '14px' },
                formatter: function () {
                    return this.value + '%';
                }
            },
            lineWidth: 0,
            plotBands: [
                {
                    from: 0,
                    to: 80,
                    color: '#10B981',
                    thickness: 20,
                    borderRadius: '50%'
                }, // green = healthy
                {
                    from: 80,
                    to: 100,
                    color: '#EAB308',
                    thickness: 20,
                    borderRadius: '50%'
                }, // yellow = watch
                {
                    from: 100,
                    to: 120,
                    color: '#EA293C',
                    thickness: 20,
                    borderRadius: '50%'
                }  // red = overspend
            ]
        },

        tooltip: { pointFormat: '<b>{point.y}%</b> of monthly budget used' },

        series: [{
            name: 'Budget used',
            data: [92], // <-- Current usage %
            dataLabels: {
                format: '{y}%',
                borderWidth: 0,
                style: { fontSize: '16px' }
            },
            dial: {
                radius: '80%',
                backgroundColor: 'gray',
                baseWidth: 12,
                baseLength: '0%',
                rearLength: '0%'
            },
            pivot: { backgroundColor: 'gray', radius: 6 }
        }]
    },

    chart5: { // Bubble
        credits: {
            enabled: false
        },
        custom: {
            autoDesc: chart5desc
        },
        chart: {
            type: 'bubble',
            plotBorderWidth: 1,
            zooming: {
                type: 'xy'
            }
        },

        legend: {
            enabled: false
        },

        title: {
            text: 'Sugar and fat intake per country'
        },

        subtitle: {
            text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> and <a href="https://data.oecd.org/">OECD</a>'
        },
        xAxis: {
            gridLineWidth: 1,
            title: {
                text: 'Daily fat intake'
            },
            labels: {
                format: '{value} gr'
            },
            plotLines: [{
                dashStyle: 'dot',
                width: 2,
                value: 65,
                label: {
                    rotation: 0,
                    y: 15,
                    style: {
                        fontStyle: 'italic'
                    },
                    text: 'Safe fat intake 65g/day'
                },
                zIndex: 3
            }]
        },

        yAxis: {
            startOnTick: false,
            endOnTick: false,
            title: {
                text: 'Daily sugar intake'
            },
            labels: {
                format: '{value} gr'
            },
            maxPadding: 0.2,
            plotLines: [{
                dashStyle: 'dot',
                width: 2,
                value: 50,
                label: {
                    align: 'right',
                    style: {
                        fontStyle: 'italic'
                    },
                    text: 'Safe sugar intake 50g/day',
                    x: -10
                },
                zIndex: 3
            }]
        },

        tooltip: {
            useHTML: true,
            headerFormat: '<table>',
            pointFormat: '<tr><th colspan="2"><h3>{point.country}</h3>' +
                '</th></tr>' +
                '<tr><th>Fat intake:</th><td>{point.x}g</td></tr>' +
                '<tr><th>Sugar intake:</th><td>{point.y}g</td></tr>' +
                '<tr><th>Obesity (adults):</th><td>{point.z}%</td></tr>',
            footerFormat: '</table>',
            followPointer: true
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.name}'
                }
            }
        },

        series: [{
            data: [
                {
                    x: 95,
                    y: 95,
                    z: 13.8,
                    name: 'BE',
                    country: 'Belgium',
                    color: '#EAB308'
                },
                {
                    x: 86.5,
                    y: 102.9,
                    z: 14.7,
                    name: 'DE',
                    country: 'Germany',
                    color: '#EA293C'
                },
                {
                    x: 80.8,
                    y: 91.5,
                    z: 15.8,
                    name: 'FI',
                    country: 'Finland',
                    color: '#8132f8'
                },
                {
                    x: 80.4,
                    y: 102.5,
                    z: 12,
                    name: 'NL',
                    country: 'Netherlands',
                    color: '#06B6D4'
                },
                {
                    x: 80.3,
                    y: 86.1,
                    z: 11.8,
                    name: 'SE',
                    country: 'Sweden',
                    color: '#10B981'
                },
                {
                    x: 78.4,
                    y: 70.1,
                    z: 16.6,
                    name: 'ES',
                    country: 'Spain',
                    color: '#EAB308'
                },
                {
                    x: 74.2,
                    y: 68.5,
                    z: 14.5,
                    name: 'FR',
                    country: 'France',
                    color: '#014CE5'
                },
                {
                    x: 73.5,
                    y: 83.1,
                    z: 10,
                    name: 'NO',
                    country: 'Norway',
                    color: '#000000'
                },
                {
                    x: 71,
                    y: 93.2,
                    z: 24.7,
                    name: 'UK',
                    country: 'United Kingdom',
                    color: '#EA293C'
                },
                {
                    x: 69.2,
                    y: 57.6,
                    z: 10.4,
                    name: 'IT',
                    country: 'Italy',
                    color: '#000000'
                },
                {
                    x: 68.6,
                    y: 20,
                    z: 16,
                    name: 'RU',
                    country: 'Russia',
                    color: '#f47600'
                },
                {
                    x: 65.5,
                    y: 126.4,
                    z: 35.3,
                    name: 'US',
                    country: 'United States',
                    color: '#014CE5'
                },
                {
                    x: 65.4,
                    y: 50.8,
                    z: 28.5,
                    name: 'HU',
                    country: 'Hungary',
                    color: '#f47600'
                },
                {
                    x: 63.4,
                    y: 51.8,
                    z: 15.4,
                    name: 'PT',
                    country: 'Portugal',
                    color: '#10B981'
                },
                {
                    x: 64,
                    y: 82.9,
                    z: 31.3,
                    name: 'NZ',
                    country: 'New Zealand',
                    color: '#8132f8'
                }
            ],
            colorByPoint: true
        }]
    },
    chart6: { // Sunburst
        credits: {
            enabled: false
        },
        custom: { autoDesc: chart6desc },
        chart: {
            height: '100%',
            type: 'sunburst'
        },

        // Keep the subtle white center, then default palette
        colors: ['#ffffff01'].concat(Highcharts.getOptions().colors),

        title: {
            text: 'Company Budget 2025'
        },

        subtitle: {
            text: 'Fictional dataset for demo purposes'
        },

        series: [{
            type: 'sunburst',
            name: 'Root',
            colors: [
                '#014CE5',
                '#EA293C',
                '#10B981',
                '#EAB308',
                '#8132F8'
            ],
            allowTraversingTree: true,
            borderRadius: 3,
            cursor: 'pointer',
            dataLabels: {
                format: '{point.name}',
                filter: { property: 'innerArcLength', operator: '>', value: 16 }
            },
            levels: [{
                level: 1,
                levelIsConstant: false,
                dataLabels: {
                    filter: {
                        property: 'outerArcLength',
                        operator: '>',
                        value: 64
                    }
                }
            }, {
                level: 2,
                colorByPoint: true
            }, {
                level: 3,
                colorVariation: { key: 'brightness', to: -1 }
            }, {
                level: 4,
                colorVariation: { key: 'brightness', to: 1 }
            }],
            data: [
                // Root
                { id: '0.0', parent: '', name: 'Company' },

                // Departments
                { id: '1.1', parent: '0.0', name: 'Engineering' },
                { id: '1.2', parent: '0.0', name: 'Sales & Marketing' },
                { id: '1.3', parent: '0.0', name: 'Operations' },
                { id: '1.4', parent: '0.0', name: 'G&A' },
                { id: '1.5', parent: '0.0', name: 'R&D' },

                // Engineering teams
                { id: '2.1', parent: '1.1', name: 'Frontend' },
                { id: '2.2', parent: '1.1', name: 'Backend' },
                { id: '2.3', parent: '1.1', name: 'Data' },
                { id: '2.4', parent: '1.1', name: 'QA' },

                // Frontend expenses (2.6M)
                { id: '3.1', parent: '2.1', name: 'Salaries', value: 1900000 },
                { id: '3.2', parent: '2.1', name: 'Tools', value: 250000 },
                { id: '3.3', parent: '2.1', name: 'Cloud', value: 250000 },
                { id: '3.4', parent: '2.1', name: 'Training', value: 200000 },

                // Backend expenses (2.8M)
                { id: '3.5', parent: '2.2', name: 'Salaries', value: 2000000 },
                { id: '3.6', parent: '2.2', name: 'Tools', value: 200000 },
                { id: '3.7', parent: '2.2', name: 'Cloud', value: 500000 },
                { id: '3.8', parent: '2.2', name: 'Training', value: 100000 },

                // Data expenses (1.0M)
                { id: '3.9',  parent: '2.3', name: 'Salaries', value: 700000 },
                { id: '3.10', parent: '2.3', name: 'Cloud', value: 200000 },
                { id: '3.11', parent: '2.3', name: 'Tools', value: 70000 },
                { id: '3.12', parent: '2.3', name: 'Training', value: 30000 },

                // QA expenses (0.8M)
                { id: '3.13', parent: '2.4', name: 'Salaries', value: 600000 },
                { id: '3.14', parent: '2.4', name: 'Tools', value: 100000 },
                {
                    id: '3.15',
                    parent: '2.4',
                    name: 'Testing Services',
                    value: 100000
                },

                // Sales & Marketing teams
                { id: '2.5', parent: '1.2', name: 'Sales' },
                { id: '2.6', parent: '1.2', name: 'Marketing' },

                // Sales expenses (3.2M)
                { id: '3.16', parent: '2.5', name: 'Salaries', value: 2200000 },
                { id: '3.17', parent: '2.5', name: 'Travel', value: 500000 },
                { id: '3.18', parent: '2.5', name: 'CRM', value: 300000 },
                {
                    id: '3.19',
                    parent: '2.5',
                    name: 'Commissions',
                    value: 200000
                },

                // Marketing expenses (1.9M)
                { id: '3.20', parent: '2.6', name: 'Salaries', value: 1000000 },
                { id: '3.21', parent: '2.6', name: 'Ads', value: 600000 },
                { id: '3.22', parent: '2.6', name: 'Events', value: 200000 },
                { id: '3.23', parent: '2.6', name: 'Tools', value: 100000 },

                // Operations teams
                { id: '2.7', parent: '1.3', name: 'Customer Support' },
                { id: '2.8', parent: '1.3', name: 'IT & Security' },
                { id: '2.9', parent: '1.3', name: 'Facilities' },

                // Ops expenses (1.2M + 1.5M + 0.7M = 3.4M)
                { id: '3.24', parent: '2.7', name: 'Salaries', value: 900000 },
                { id: '3.25', parent: '2.7', name: 'Tools', value: 200000 },
                { id: '3.26', parent: '2.7', name: 'Training', value: 100000 },

                { id: '3.27', parent: '2.8', name: 'Salaries', value: 1000000 },
                {
                    id: '3.28',
                    parent: '2.8',
                    name: 'Security Services',
                    value: 300000
                },
                { id: '3.29', parent: '2.8', name: 'Tools', value: 200000 },

                { id: '3.30', parent: '2.9', name: 'Rent', value: 500000 },
                { id: '3.31', parent: '2.9', name: 'Utilities', value: 200000 },

                // G&A teams
                { id: '2.10', parent: '1.4', name: 'HR' },
                { id: '2.11', parent: '1.4', name: 'Finance & Legal' },

                // G&A expenses (0.7M + 1.3M = 2.0M)
                { id: '3.32', parent: '2.10', name: 'Salaries', value: 500000 },
                { id: '3.33', parent: '2.10', name: 'Tools', value: 50000 },
                {
                    id: '3.34',
                    parent: '2.10',
                    name: 'Recruiting',
                    value: 150000
                },

                { id: '3.35', parent: '2.11', name: 'Salaries', value: 900000 },
                { id: '3.36', parent: '2.11', name: 'Audit', value: 200000 },
                { id: '3.37', parent: '2.11', name: 'Tools', value: 100000 },
                { id: '3.38', parent: '2.11', name: 'Legal', value: 100000 },

                // R&D teams
                { id: '2.12', parent: '1.5', name: 'Incubation' },
                { id: '2.13', parent: '1.5', name: 'Prototyping Lab' },

                // R&D expenses (0.8M + 0.5M = 1.3M)
                { id: '3.39', parent: '2.12', name: 'Salaries', value: 500000 },
                {
                    id: '3.40',
                    parent: '2.12',
                    name: 'Contractors',
                    value: 200000
                },
                { id: '3.41', parent: '2.12', name: 'Tools', value: 100000 },

                {
                    id: '3.42',
                    parent: '2.13',
                    name: 'Equipment',
                    value: 300000
                },
                { id: '3.43', parent: '2.13', name: 'Materials', value: 200000 }
            ]
        }],

        tooltip: {
            headerFormat: '',
            pointFormatter: function () {
                if (typeof this.value === 'number') {
                    return 'Budget for <b>' + this.name + '</b>: <b>$' +
          Highcharts.numberFormat(this.value, 0) + '</b>';
                }
                return '<b>' + this.name + '</b>';
            }
        }
    }

};


const AUTO_DESCS = {
    chart1: chart1desc,
    chart2: chart2desc,
    chart3: chart3desc,
    chart4: chart4desc,
    chart5: chart5desc,
    chart6: chart6desc
};

// Inject custom.autoDesc for every chart (do not override if already set)
Object.keys(AUTO_DESCS).forEach(id => {
    const cfg = HC_CONFIGS[id];
    if (!cfg) {
        return;
    }
    cfg.custom = cfg.custom || {};
    if (cfg.custom.autoDesc === null) {
        cfg.custom.autoDesc = AUTO_DESCS[id];
    }
});

(function POC_A11Y_DESC_PLUGIN(Highcharts) {
    const H = Highcharts;

    H.addEvent(H.Chart, 'beforeA11yUpdate', function (e) {
        if (this.options?.a11y?.enabled === false || !this.a11y) {
            return;
        }

        const basic  = `<p>${basicSummary(this)}</p>`;
        // string | null (or function result)
        const custom = getCustomAutoDesc(this);

        // Always: basic summary, then your per-chart variable (if provided)
        const html = custom ? (basic + custom) : basic;

        // Highcharts hidden a11y region
        e.chartDetailedInfo.chartAutoDescription = html;
        this.__autoDescHTML = html;                      // for your debug panel
        // visible panel below chart
        updateA11yDescPanel(this, html);
    });
}(Highcharts));


function updateA11yDescPanel(chart, html) {
    const chartEl = chart?.renderTo;
    if (!chartEl) {
        return;
    }

    const wrapper = chartEl.parentElement || chartEl;
    const id = chartEl.id ? chartEl.id + '-a11y-debug' : '';
    let panel = wrapper.querySelector('.a11y-debug');
    if (!panel) {
        panel = document.createElement('div');
        panel.className = 'a11y-debug';
        if (id) {
            panel.id = id;
        }
        panel.setAttribute('aria-hidden', 'true');
        wrapper.appendChild(panel);
    }
    panel.innerHTML = `
      <div class="a11y-debug__title">Auto-description:</div>
      <div class="a11y-debug__content">${html}</div>
    `;
}

const NAME_LIMIT = 3;

const getTypeLabel = (rawType, isPolar) => {
    const map = {
        area: 'Area chart',
        arearange: 'Area Range chart',
        bar: 'Bar chart',
        boxplot: 'Box plot',
        bubble: 'Bubble chart',
        column: 'Column chart',
        dependencywheel: 'Dependency wheel chart',
        dumbbell: 'Dumbbell chart',
        funnel: 'Funnel chart',
        gauge: 'Gauge chart',
        heatmap: 'Heatmap',
        histogram: 'Histogram',
        line: 'Line chart',
        networkgraph: 'Network graph',
        organization: 'Organization chart',
        packedbubble: 'Packed bubble chart',
        pie: 'Pie chart',
        pyramid: 'Pyramid chart',
        sankey: 'Sankey diagram',
        scatter: 'Scatter plot',
        solidgauge: 'Gauge',
        spline: 'Line chart',
        sunburst: 'Sunburst chart',
        tilemap: 'Tilemap chart',
        timeline: 'Timeline chart',
        treemap: 'Treemap',
        waterfall: 'Waterfall chart',
        wordcloud: 'Word cloud'
    };
    return isPolar ? 'Radar chart' : (map[rawType] || 'Chart');
};

const visibleSeries = chart =>
    (chart.series || []).filter(s => s.visible !== false);

const seriesType = s => (s.type || s.options?.type || '').toLowerCase();

const hasType = (chart, t) =>
    visibleSeries(chart).some(s => seriesType(s) === t);

const firstSeriesOfType = (chart, t) =>
    visibleSeries(chart).find(s => seriesType(s) === t) ||
    visibleSeries(chart)[0];

const visiblePoints = s =>
    (s?.points || []).filter(p => p.visible !== false);

const plural = (n, sing, plural) => (n === 1 ? sing : (plural || sing + 's'));

const listWithMore = (names, limit) => {
    const show = names.slice(0, limit);
    const remaining = Math.max(0, names.length - show.length);
    return names.length ?
        show.join(', ') + (remaining > 0 ? `, and ${remaining} more` : '') :
        '';
};

const seriesNamesSnippet = ss => {
    const names = ss.map(s => s.name || 'Unnamed');
    if (!names.length) {
        return '';
    }
    if (names.length === 1) {
        return names[0];
    }
    if (names.length === 2) {
        return names.join(' and ');
    }
    return names.slice(0, -1).join(', ') + ', and ' + names.slice(-1);
};


/* Create a basic start of the summary for all charts */
function basicSummary(chart) {
    const rawType = (chart.options?.chart?.type ||
        chart.series?.[0]?.type || '').toLowerCase();
    const typeLabel = getTypeLabel(rawType, !!chart.options?.chart?.polar);
    const vs = visibleSeries(chart);

    const strategies = [
        () => hasType(chart, 'line') && (() =>
            'Line chart showing temperatures for Helsinki and Oslo.')(),
        () => hasType(chart, 'gauge') && (() => 'Gauge showing budget used.')(),

        // Sunburst (root + top-level children)
        () => hasType(chart, 'sunburst') && (() =>
            // const s = firstSeriesOfType(chart, 'sunburst');
            // const src = (Array.isArray(s?.points) && s.points.length) ?
            //     s.points :
            //     (Array.isArray(s?.options?.data) ? s.options.data : []);
            // const norm = src.map((p, i) => ({
            //     id: (p.id ?? p.name ?? `node-${i}`).toString(),
            //     parent: (p.parent ?? '').toString(),
            //     name: (p.name ?? p.id ?? `Node ${i + 1}`).toString(),
            //     visible: (p.visible !== false)
            // }));
            // const vis = norm.filter(n => n.visible);
            // if (!vis.length) {
            //     return `${typeLabel}.`;
            // }
            // const idSet = new Set(norm.map(n => n.id));
            // const root = vis.find(n => !n.parent || !idSet.has(n.parent)) ||
            //     vis[0];
            // const topNames = vis.filter(n => n.parent === root.id)
            //     .map(n => n.name);
            // const namesSnippet = listWithMore(topNames, NAME_LIMIT);
            // return `${typeLabel} with ${vis.length} nodes (root: ${
            //     root.name
            // })${namesSnippet ? `: ${namesSnippet}` : ''}.`;
            `Sunburst chart with 62 nodes in a hierarchy with 4 levels, 
            showing budget (USD) 2025. The first node is "Company". 
            Second level of nodes has Engineering, Sales & Marketing, 
            Operations and two more`
        )(),

        // Bubble (points by friendly name)
        () => hasType(chart, 'bubble') && (() => {
            const s = firstSeriesOfType(chart, 'bubble');
            const pts = visiblePoints(s);
            const names = pts.map((p, i) => {
                const cat = chart.xAxis?.[0]?.categories?.[p.x];
                return p.country || p.name ||
                    (typeof cat === 'string' && cat) || `Point ${i + 1}`;
            });
            const namesSnippet = listWithMore(names, NAME_LIMIT);
            const count = pts.length;
            return `${typeLabel} with ${count} ${plural(count, 'point')}${
                namesSnippet ? `: ${namesSnippet}` : ''
            }.`;
        })(),

        () => hasType(chart, 'column') && (() => `Bar chart showing 4 series
        stacked on top of each other per bar: Espresso, Latte, Cappuccino, 
        and Americano.`)(),

        // Heatmap / tilemap (grid)
        () => (hasType(chart, 'heatmap') ||
            hasType(chart, 'tilemap')) && (() =>
            // const s = vs[0];
            // const xCats = chart.xAxis?.[0]?.categories || [];
            // const yCats = chart.yAxis?.[0]?.categories || [];
            // const dimension = xCats.length && yCats.length ?
            //     `${xCats.length}×${yCats.length} cells` :
            //     `${s?.points?.length || 0} cells`;
            // return `${typeLabel} with ${dimension}${
            //     s?.name ? ` (${s.name})` : ''
            // }.`;
            `
            Heatmap with 8759 cells, showing temperature per hour over a year.`
        )()
    ];

    for (const strat of strategies) {
        const out = typeof strat === 'function' ? strat() : null;
        if (out) {
            return out;
        }
    }

    // Default: series summary
    const formatted = seriesNamesSnippet(vs);
    return `${typeLabel} with ${vs.length} series${
        formatted ? `: ${formatted}` : ''
    }.`;
}


function getCustomAutoDesc(chart) {
    const fromOpts = chart.options?.custom?.autoDesc ??
        chart.options?.chart?.custom?.autoDesc;
    if (typeof fromOpts === 'function') {
        try {
            return fromOpts.call(chart, chart);
        } catch {
            // ignore error
        }
    }
    if (typeof fromOpts === 'string') {
        return fromOpts;
    }
    return null;
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
