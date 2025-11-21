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
        <li>Period highlighted: May–September</li>
        <li>Helsinki highest value: 17°C in July</li>
        <li>Helsinki lowest value: –6°C in February</li>
        <li>Oslo highest value: 11°C in July–August</li>
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

const chart2visualdesc = `
    <p>Four vertical bars side by side. Each bar is stacked in
    colored layers, like a cake. The layers show coffee types,
    and each bar represents an office to show overall coffee
    consumption.</p>
`;


// Big heatmap
const chart3desc = `
    <p>Temperatures vary by both season and time of day, with the 
    warmest conditions in July and cooler periods at the start and 
    end of the year. Daytime generally warmer than nighttime across 
    all months.</p>
    <ul>
        <li>Warmest month average: June</li>
        <li>Coldest month average: December</li>
        <li>X axis: Days of the year from January-December</li>
        <li>Y-axis: Hours of the day (0:00–18:00)</li>
        <li>Range: –10°C to 20°C</li>
        <li>Highest temperature: July, reaching around 20°C</li>
        <li>Lowest temperature: January, dropping to –10°C</li> 
    </ul>
`;

const chart3visualdesc = `
    <p> A broad grid of color fades from blues on the edges to
    yellows and reds in the center to indicate temperature shifts
    from January to December.</p>
`;

const chart4visualdesc = `
    <p>The gauge displays a semicircular meter from 0% to 120%.
      The gauge has three zones:</p>
      <ul>
        <li>Green (0-80%) for healthy spending.</li>
        <li>Yellow (80-100%) for watch zone.</li>
        <li>Red (100-120%) for overspend.</li>
      </ul>
`;

// Gauge
const chart4desc = `
  <p>The gauge scale goes from 0-120%, and is divided into the
  following zones: Healthy (up to 80%), Watch (80-100%),
  Overspend (above 100%). Current value 92% is in the Watch zone.</p>
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
        <li>Lowest fat intake: Portugal (63 g/day)</li>
        <li>Highest obesity rate: U.S. (35.3%)</li>
        <li>Lowest obesity rate: Italy (10%)</li>
        <li>Closer to safe levels: Portugal (63g fat, 52g sugar), Hungary 
        (65g fat, 51g sugar), Russia (69g fat, 20g sugar)</li>
    </ul>
`;

const chart5visualdesc = `
  <p>A grid-like plot with colored circles of different sizes scattered 
  across it. Most circles appear in the upper-right area, above both 
  dotted guide lines, while a few smaller circles sit near or below them. 
  One noticeably large bubble stands out near the upper edge, and several 
  medium bubbles cluster in the center, with a few smaller ones toward 
  the lower-left.</p>
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
        Sales & Marketing ($5.1M)</li>
        <li>Largest teams: Sales ($3.2M), Backend ($2.8M), 
        Frontend ($2.6M)</li>
        <li>Smallest nodes shown: HR Tools ($50k) and other 
        low-cost tools/training items</li>
    </ul>
`;

const chart6visualdesc = `
  <p>A circular “sun-like” graphic with a bright center and several colored
  rings radiating outward like beams. Each ring is divided into segments of
  different sizes, forming a layered wheel. Large outer segments appear as
  wide arcs, while smaller ones create thin slivers around the edges. The
  colors shift between departments and their sub-sections, giving the whole
  chart the look of a multicolored sunburst.</p>
`;


const HC_CONFIGS = {
    chart1: { // Spline w/plotlines
        credits: {
            enabled: false
        },
        exporting: {
            buttons: {
                contextButton: {
                    enabled: false
                }
            }
        },
        custom: {
            autoDesc: chart1desc,
            hasDataTable: true,  // Enable data table button
            tableConfig: {
                columnHeaderFormatter: function (item, key) {
                    if (key === 'x') {
                        return 'Month';
                    }
                    if (key === 'y') {
                        return item.name + ' Temperature (°C)';
                    }
                    return item.name || 'Series';
                }
            }
        },
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
        exporting: {
            buttons: {
                contextButton: {
                    enabled: false
                }
            }
        },
        custom: {
            autoDesc: chart2desc,
            visualDesc: chart2visualdesc,
            hasDataTable: true,  // Enable data table button
            tableConfig: {
                columnHeaderFormatter: function (item, key) {
                    if (key === 'x') {
                        return 'Office Location';
                    }
                    if (key === 'y') {
                        return item.name + ' (Cups)';
                    }
                    return item.name || 'Coffee Type';
                }
            }
        },
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
        exporting: {
            enabled: false
        },
        custom: {
            autoDesc: chart3desc,
            visualDesc: chart3visualdesc
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
            text: 'Temperature variation 2025',
            align: 'left',
            x: 40
        },

        subtitle: {
            text: 'By day and hour',
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
        exporting: {
            enabled: false
        },
        custom: {
            autoDesc: chart4desc,
            visualDesc: chart4visualdesc
        },
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
        exporting: {
            buttons: {
                contextButton: {
                    enabled: false
                }
            }
        },
        custom: {
            autoDesc: chart5desc,
            visualDesc: chart5visualdesc,
            hasDataTable: true,  // Enable data table button
            tableConfig: {
                columnHeaderFormatter: function (item, key) {
                    if (key === 'x') {
                        return 'Daily Fat Intake (g)';
                    }
                    if (key === 'y') {
                        return 'Daily Sugar Intake (g)';
                    }
                    if (key === 'z') {
                        return 'Adult Obesity (%)';
                    }
                    return item.name || 'Country Data';
                }
            }
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
            text: 'Source: <a href="http://www.euromonitor.com/">Euromonitor</a> ' +
                'and <a href="https://data.oecd.org/">OECD</a>'
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
        exporting: {
            enabled: false
        },
        custom: {
            autoDesc: chart6desc,
            visualDesc: chart6visualdesc
        },
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

// Custom table generation function with better headers
function generateCustomTable(chart, config) {
    if (!chart.series || !chart.series.length) {
        return '<p>No data available</p>';
    }

    let html = '<table class="highcharts-data-table"><thead><tr>';

    // Get first series to determine structure
    const firstSeries = chart.series[0];
    const firstPoint = firstSeries.points && firstSeries.points[0];

    if (!firstPoint) {
        return chart.getTable(); // Fallback to default
    }

    // Determine if this is a bubble chart or other chart type
    const isBubble = firstSeries.type === 'bubble' ||
        (firstPoint.x !== undefined && firstPoint.y !== undefined &&
         firstPoint.z !== undefined);

    if (isBubble) {
        // For bubble charts, add headers for country and dimensions
        html += '<th scope="col">Country</th>';
        html += '<th scope="col">' + (config.columnHeaderFormatter ?
            config.columnHeaderFormatter(firstSeries, 'x') :
            'X Value') + '</th>';
        html += '<th scope="col">' + (config.columnHeaderFormatter ?
            config.columnHeaderFormatter(firstSeries, 'y') :
            'Y Value') + '</th>';
        html += '<th scope="col">' + (config.columnHeaderFormatter ?
            config.columnHeaderFormatter(firstSeries, 'z') :
            'Z Value') + '</th>';
    } else {
        // For regular charts, show categories and series
        if (chart.xAxis[0].categories) {
            html += '<th scope="col">' + (config.columnHeaderFormatter ?
                config.columnHeaderFormatter(firstSeries, 'x') :
                'Category') + '</th>';
        }
        chart.series.forEach(series => {
            if (series.visible !== false) {
                html += '<th scope="col">' + (config.columnHeaderFormatter ?
                    config.columnHeaderFormatter(series, 'y') :
                    series.name || 'Value') + '</th>';
            }
        });
    }

    html += '</tr></thead><tbody>';

    if (isBubble) {
        // For bubble charts, each point is a row
        firstSeries.points.forEach(point => {
            if (point.visible !== false) {
                html += '<tr>';
                html += '<td>' + (point.country || point.name ||
                    'Data Point') + '</td>';
                html += '<td>' + (point.x || '') + '</td>';
                html += '<td>' + (point.y || '') + '</td>';
                html += '<td>' + (point.z || '') + '</td>';
                html += '</tr>';
            }
        });
    } else {
        // For regular charts, categories are rows, series are columns
        const categories = chart.xAxis[0].categories;
        if (categories) {
            categories.forEach((category, i) => {
                html += '<tr>';
                html += '<td>' + category + '</td>';
                chart.series.forEach(series => {
                    if (series.visible !== false) {
                        const point = series.points && series.points[i];
                        html += '<td>' + (point ? point.y : '') + '</td>';
                    }
                });
                html += '</tr>';
            });
        }
    }

    html += '</tbody></table>';
    return html;
}

(function POC_A11Y_DESC_PLUGIN(Highcharts) {
    const H = Highcharts;

    H.addEvent(H.Chart, 'beforeA11yUpdate', function (e) {
        if (this.options?.a11y?.enabled === false || !this.a11y) {
            return;
        }

        const basic  = `<p>${basicSummary(this)}</p>`;
        const custom = getCustomAutoDesc(this);
        const visual = getCustomVisualDesc(this);
        const hasTable = this.options?.custom?.hasDataTable === true;

        // For screen reader: basic + visual toggle + table toggle + custom
        let srHtml;
        if (visual !== null) {
            // default false (hidden)
            const showVisual = this.visualDescVisible === true;
            const chartId = this.renderTo?.id || 'chart';
            const toggleId = `visual-toggle-${chartId}`;
            const contentId = `visual-content-${chartId}`;

            // Create button and toggleable content for screen reader region
            const toggleButton = `<button id="${toggleId}" 
                aria-expanded="${showVisual ? 'true' : 'false'}" 
                aria-controls="${contentId}"
                aria-label="${showVisual ? 'Hide' : 'Show'}
                visual description for chart ${
    this.title?.textStr || 'Untitled Chart'
    }"
                tabindex="-1"
                class="visual-desc-toggle">
                ${showVisual ? 'Hide' : 'Show'} Visual Description
            </button>`;

            const visibilityClass = showVisual ? 'visible' : 'hidden';
            const visualContent = `<div id="${contentId}"
                class="visual-desc-content ${visibilityClass}">
                ${visual}
            </div>`;

            // Add table toggle if chart has showTable enabled
            let tableToggle = '';
            if (hasTable) {
                const showTable = this.tableVisible === true;
                const tableToggleId = `table-toggle-${chartId}`;
                const tableContentId = `table-content-${chartId}`;

                tableToggle = `<button id="${tableToggleId}" 
                    aria-expanded="${showTable ? 'true' : 'false'}" 
                    aria-controls="${tableContentId}"
                    aria-label="${showTable ? 'Hide' : 'Show'}
                     data table for chart ${
    this.title?.textStr || 'Untitled Chart'
    }"
                    tabindex="-1"
                    class="table-toggle">
                    ${showTable ? 'Hide' : 'Show'} Data Table
                </button>
                <div id="${tableContentId}" 
                    class="table-content ${showTable ? 'visible' : 'hidden'}">
                </div>`;
            }

            srHtml = basic + toggleButton + visualContent + tableToggle +
                (custom || '');

            // Add event listener after DOM update using setTimeout
            setTimeout(() => {
                const button = document.getElementById(toggleId);
                const content = document.getElementById(contentId);

                if (
                    button && content &&
                    !button.hasAttribute('data-listener-added')
                ) {
                    button.setAttribute('data-listener-added', 'true');
                    // Capture chart reference in closure
                    const chartRef = this;
                    button.addEventListener('click', function () {
                        const isExpanded =
                            this.getAttribute('aria-expanded') === 'true';
                        const newState = !isExpanded;

                        // Update screen reader button and content
                        this.setAttribute(
                            'aria-expanded',
                            newState ? 'true' : 'false'
                        );
                        content.className = newState ?
                            'visual-desc-content visible' :
                            'visual-desc-content hidden';
                        this.textContent = newState ?
                            'Hide Visual Description' :
                            'Show Visual Description';
                        this.setAttribute(
                            'aria-label',
                            `${newState ? 'Hide' : 'Show'} 
                            visual description for chart ${
    chartRef.title?.textStr || 'Untitled Chart'
    }`
                        );

                        // Persist state on chart
                        chartRef.visualDescVisible = newState;

                        // Update visible panel toggle if it exists
                        const visToggleId = `visual-toggle-visible-${chartId}`;
                        const visContentId =
                            `visual-content-visible-${chartId}`;
                        const visBtn = document.getElementById(visToggleId);
                        const visContent =
                            document.getElementById(visContentId);

                        if (visBtn && visContent) {
                            visBtn.setAttribute(
                                'aria-expanded',
                                newState ? 'true' : 'false'
                            );
                            visContent.className = newState ?
                                'visual-desc-content visible' :
                                'visual-desc-content hidden';
                            visBtn.textContent = newState ?
                                'Hide Visual Description' :
                                'Show Visual Description';
                            visBtn.setAttribute(
                                'aria-label',
                                `${newState ? 'Hide' : 'Show'} 
                                visual description for chart ${
    chartRef.title?.textStr || 'Untitled Chart'
    }`
                            );
                        }
                    });
                }

                // Add table toggle event listeners if table exists
                if (hasTable) {
                    const tableButtonId = `table-toggle-${chartId}`;
                    const tableContentId = `table-content-${chartId}`;
                    const tableButton = document.getElementById(tableButtonId);
                    const tableContent =
                        document.getElementById(tableContentId);

                    if (
                        tableButton && tableContent &&
                        !tableButton.hasAttribute(
                            'data-listener-added'
                        )) {
                        tableButton.setAttribute('data-listener-added', 'true');
                        // Capture chart reference in closure
                        const chartRef = this;
                        tableButton.addEventListener('click', function () {
                            const isExpanded =
                                this.getAttribute('aria-expanded') === 'true';
                            const newState = !isExpanded;

                            // Update screen reader button and content
                            this.setAttribute(
                                'aria-expanded',
                                newState ? 'true' : 'false'
                            );
                            tableContent.className = newState ?
                                'table-content visible' :
                                'table-content hidden';
                            const tableTextSpan = this.querySelector('span');
                            if (tableTextSpan) {
                                tableTextSpan.textContent = newState ?
                                    'Hide Data Table' : 'Show Data Table';
                            }

                            // Persist state on chart
                            chartRef.tableVisible = newState;

                            // Update visible panel toggle if it exists
                            const visTableToggleId =
                                `table-toggle-visible-${chartId}`;
                            const visTableContentId =
                                `table-content-visible-${chartId}`;
                            const visTableBtn =
                                document.getElementById(visTableToggleId);
                            const visTableContent =
                                document.getElementById(visTableContentId);

                            if (visTableBtn && visTableContent) {
                                visTableBtn.setAttribute(
                                    'aria-expanded',
                                    newState ? 'true' : 'false'
                                );
                                visTableContent.className = newState ?
                                    'table-content visible' :
                                    'table-content hidden';
                                const visTableTextSpan =
                                visTableBtn.querySelector('span');
                                if (visTableTextSpan) {
                                    visTableTextSpan.textContent = newState ?
                                        'Hide Data Table' : 'Show Data Table';
                                }
                            }

                            // Generate and insert table content if showing
                            if (newState && chartRef.getTable) {
                                try {
                                    // Check if custom table config exists
                                    const tableConfig =
                                        chartRef.options?.custom?.tableConfig;
                                    let tableHTML;

                                    if (tableConfig) {
                                        // Use custom table generation
                                        // with better headers
                                        tableHTML = generateCustomTable(
                                            chartRef, tableConfig
                                        );
                                    } else {
                                        // Fall back to default Highcharts table
                                        tableHTML = chartRef.getTable();
                                    }

                                    tableContent.innerHTML = tableHTML;
                                    if (visTableContent) {
                                        visTableContent.innerHTML = tableHTML;
                                    }
                                } catch (e) {
                                    console.warn(
                                        'Could not generate table:', e
                                    );
                                }
                            } else if (!newState) {
                                // Clear table content when hiding
                                tableContent.innerHTML = '';
                                if (visTableContent) {
                                    visTableContent.innerHTML = '';
                                }
                            }
                        });
                    }
                }
            }, 100);
        } else {
            // No visual description, but might have table toggle
            if (hasTable) {
                const showTable = this.tableVisible === true;
                const chartId = this.renderTo?.id || 'chart';
                const tableToggleId = `table-toggle-${chartId}`;
                const tableContentId = `table-content-${chartId}`;
                const tableToggle = `<button id="${tableToggleId}" 
                    aria-expanded="${showTable ? 'true' : 'false'}" 
                    aria-controls="${tableContentId}"
                    aria-label="${showTable ? 'Hide' : 'Show'} 
                    data table for chart ${
    this.title?.textStr || 'Untitled Chart'
    }"
                    tabindex="-1"
                    class="table-toggle">
                    ${showTable ? 'Hide' : 'Show'} Data Table
                </button>
                <div id="${tableContentId}" 
                    class="table-content ${showTable ? 'visible' : 'hidden'}">
                </div>`;

                srHtml = basic + tableToggle + (custom || '');

                // Add event listener for table toggle
                setTimeout(() => {
                    const tableButton = document.getElementById(tableToggleId);
                    const tableContent =
                        document.getElementById(tableContentId);

                    if (
                        tableButton && tableContent &&
                        !tableButton.hasAttribute(
                            'data-listener-added'
                        )) {
                        tableButton.setAttribute('data-listener-added', 'true');
                        const chartRef = this;
                        tableButton.addEventListener('click', function () {
                            const isExpanded =
                                this.getAttribute('aria-expanded') === 'true';
                            const newState = !isExpanded;

                            // Update screen reader button and content
                            this.setAttribute(
                                'aria-expanded',
                                newState ? 'true' : 'false'
                            );
                            tableContent.className = newState ?
                                'table-content visible' :
                                'table-content hidden';
                            const tableTextSpan = this.querySelector('span');
                            if (tableTextSpan) {
                                tableTextSpan.textContent = newState ?
                                    'Hide Data Table' : 'Show Data Table';
                            }

                            // Persist state on chart
                            chartRef.tableVisible = newState;

                            // Update visible panel toggle if it exists
                            const visTableToggleId =
                                `table-toggle-visible-
                                ${chartRef.renderTo?.id || 'chart'}`;
                            const visTableContentId =
                                `table-content-visible-
                                ${chartRef.renderTo?.id ||
                                'chart'}`;
                            const visTableBtn =
                                document.getElementById(visTableToggleId);
                            const visTableContent =
                                document.getElementById(visTableContentId);

                            if (visTableBtn && visTableContent) {
                                visTableBtn.setAttribute(
                                    'aria-expanded',
                                    newState ? 'true' : 'false'
                                );
                                visTableContent.className = newState ?
                                    'table-content visible' :
                                    'table-content hidden';
                                const visTableTextSpan =
                                    visTableBtn.querySelector('span');
                                if (visTableTextSpan) {
                                    visTableTextSpan.textContent = newState ?
                                        'Hide Data Table' : 'Show Data Table';
                                }
                            }

                            // Generate and insert table content if showing
                            if (newState && chartRef.getTable) {
                                try {
                                    // Check if custom table config exists
                                    const tableConfig =
                                        chartRef.options?.custom?.tableConfig;
                                    let tableHTML;

                                    if (tableConfig) {
                                        // Use custom table generation with
                                        // better headers
                                        tableHTML = generateCustomTable(
                                            chartRef, tableConfig
                                        );
                                    } else {
                                        // Fall back to default Highcharts table
                                        tableHTML = chartRef.getTable();
                                    }

                                    tableContent.innerHTML = tableHTML;
                                    if (visTableContent) {
                                        visTableContent.innerHTML = tableHTML;
                                    }
                                } catch (e) {
                                    console.warn(
                                        'Could not generate table:', e
                                    );
                                }
                            } else if (!newState) {
                                // Clear table content when hiding
                                tableContent.innerHTML = '';
                                if (visTableContent) {
                                    visTableContent.innerHTML = '';
                                }
                            }
                        });
                    }
                }, 100);
            } else {
                srHtml = custom ? (basic + custom) : basic;
            }
        }

        // For visible panel: include visual description and table toggle
        // like SR region
        let visibleHtml;
        if (visual !== null) {
            // Use same logic as screen reader region for consistency
            const showVisual = this.visualDescVisible === true;
            const chartId = this.renderTo?.id || 'chart';
            const toggleId = `visual-toggle-visible-${chartId}`;
            const contentId = `visual-content-visible-${chartId}`;

            // Create button and toggleable content for visible panel
            const toggleButton = `<button id="${toggleId}" 
                aria-expanded="${showVisual ? 'true' : 'false'}" 
                aria-controls="${contentId}"
                aria-label="${showVisual ? 'Hide' : 'Show'} 
                visual description for chart ${
    this.title?.textStr || 'Untitled Chart'
    }"
                tabindex="-1"
                class="visual-desc-toggle">
                ${showVisual ? 'Hide' : 'Show'} Visual Description
            </button>`;

            const visibilityClass = showVisual ? 'visible' : 'hidden';
            const visualContent = `<div id="${contentId}" 
                class="visual-desc-content ${visibilityClass}">
                ${visual}
            </div>`;

            // Add table toggle for visible panel
            let tableToggle = '';
            if (hasTable) {
                const showTable = this.tableVisible === true;
                const tableToggleId = `table-toggle-visible-${chartId}`;
                const tableContentId = `table-content-visible-${chartId}`;

                tableToggle = `<button id="${tableToggleId}" 
                    aria-expanded="${showTable ? 'true' : 'false'}" 
                    aria-controls="${tableContentId}"
                    aria-label="${showTable ? 'Hide' : 'Show'} 
                    data table for chart ${
    this.title?.textStr || 'Untitled Chart'
    }"
                    tabindex="-1"
                    class="table-toggle">
                    ${showTable ? 'Hide' : 'Show'} Data Table
                </button>
                <div id="${tableContentId}" 
                    class="table-content ${showTable ? 'visible' : 'hidden'}">
                </div>`;
            }

            visibleHtml = basic + toggleButton + visualContent +
                tableToggle + (custom || '');
        } else {
            // No visual description, but might have table toggle
            if (hasTable) {
                const showTable = this.tableVisible === true;
                const chartId = this.renderTo?.id || 'chart';
                const tableToggleId = `table-toggle-visible-${chartId}`;
                const tableContentId = `table-content-visible-${chartId}`;

                const tableToggle = `<button id="${tableToggleId}" 
                    aria-expanded="${showTable ? 'true' : 'false'}" 
                    aria-controls="${tableContentId}"
                    aria-label="${showTable ? 'Hide' : 'Show'} 
                    data table for chart ${
    this.title?.textStr || 'Untitled Chart'
    }"
                    tabindex="-1"
                    class="table-toggle">
                    ${showTable ? 'Hide' : 'Show'} Data Table
                </button>
                <div id="${tableContentId}" 
                    class="table-content ${showTable ? 'visible' : 'hidden'}">
                </div>`;

                visibleHtml = basic + tableToggle + (custom || '');
            } else {
                visibleHtml = custom ? (basic + custom) : basic;
            }
        }

        // Highcharts hidden a11y region gets the full description with visual
        e.chartDetailedInfo.chartAutoDescription = srHtml;
        this.__autoDescHTML = srHtml;

        // visible panel below chart gets description with visual and
        // table toggles
        updateA11yDescPanel(this, visibleHtml, visual !== null, hasTable);

        // Add method to programmatically toggle visual description
        this.toggleVisualDescription = function (forceState) {
            const chartId = this.renderTo?.id || 'chart';
            const srToggleId = `visual-toggle-${chartId}`;
            const visToggleId = `visual-toggle-visible-${chartId}`;

            // Get current state or use forced state
            const currentState = this.visualDescVisible === true;
            const newState = forceState !== undefined ?
                forceState : !currentState;

            // Update chart state
            this.visualDescVisible = newState;

            // Update screen reader toggle
            const srBtn = document.getElementById(srToggleId);
            const srContent =
                document.getElementById(`visual-content-${chartId}`);
            if (srBtn && srContent) {
                srBtn.setAttribute(
                    'aria-expanded',
                    newState ? 'true' : 'false'
                );
                srContent.className = newState ?
                    'visual-desc-content visible' :
                    'visual-desc-content hidden';
                const srTextSpan = srBtn.querySelector('span');
                if (srTextSpan) {
                    srTextSpan.textContent = newState ?
                        'Hide Visual Description' : 'Show Visual Description';
                }
            }

            // Update visible panel toggle
            const visBtn = document.getElementById(visToggleId);
            const visContent =
                document.getElementById(`visual-content-visible-${chartId}`);
            if (visBtn && visContent) {
                visBtn.setAttribute(
                    'aria-expanded',
                    newState ? 'true' : 'false'
                );
                visContent.className = newState ?
                    'visual-desc-content visible' :
                    'visual-desc-content hidden';
                const visTextSpan = visBtn.querySelector('span');
                if (visTextSpan) {
                    visTextSpan.textContent = newState ?
                        'Hide Visual Description' : 'Show Visual Description';
                }
            }

            return newState;
        };

        // Add method to programmatically toggle data table
        this.toggleDataTable = function (forceState) {
            if (!hasTable) {
                return false;
            }
            const chartId = this.renderTo?.id || 'chart';
            const srToggleId = `table-toggle-${chartId}`;
            const visToggleId = `table-toggle-visible-${chartId}`;

            // Get current state or use forced state
            const currentState = this.tableVisible === true;
            const newState = forceState !== undefined ?
                forceState : !currentState;

            // Update chart state
            this.tableVisible = newState;

            // Update screen reader toggle
            const srBtn = document.getElementById(srToggleId);
            const srContent =
                document.getElementById(`table-content-${chartId}`);
            if (srBtn && srContent) {
                srBtn.setAttribute(
                    'aria-expanded',
                    newState ? 'true' : 'false'
                );
                srContent.className = newState ?
                    'table-content visible' :
                    'table-content hidden';
                const srTableTextSpan = srBtn.querySelector('span');
                if (srTableTextSpan) {
                    srTableTextSpan.textContent = newState ?
                        'Hide Data Table' : 'Show Data Table';
                }
            }

            // Update visible panel toggle
            const visBtn = document.getElementById(visToggleId);
            const visContent =
                document.getElementById(`table-content-visible-${chartId}`);
            if (visBtn && visContent) {
                visBtn.setAttribute(
                    'aria-expanded',
                    newState ? 'true' : 'false'
                );
                visContent.className = newState ?
                    'table-content visible' :
                    'table-content hidden';
                const visTableTextSpan = visBtn.querySelector('span');
                if (visTableTextSpan) {
                    visTableTextSpan.textContent = newState ?
                        'Hide Data Table' : 'Show Data Table';
                }
            }

            // Generate and insert table content if showing
            if (newState && this.getTable) {
                try {
                    // Check if custom table config exists
                    const tableConfig = this.options?.custom?.tableConfig;
                    let tableHTML;

                    if (tableConfig) {
                        // Use custom table generation with better headers
                        tableHTML = generateCustomTable(this, tableConfig);
                    } else {
                        // Fall back to default Highcharts table
                        tableHTML = this.getTable();
                    }

                    if (srContent) {
                        srContent.innerHTML = tableHTML;
                    }
                    if (visContent) {
                        visContent.innerHTML = tableHTML;
                    }
                } catch (e) {
                    console.warn('Could not generate table:', e);
                }
            } else if (!newState) {
                // Clear table content when hiding
                if (srContent) {
                    srContent.innerHTML = '';
                }
                if (visContent) {
                    visContent.innerHTML = '';
                }
            }

            return newState;
        };
    });
}(Highcharts));


function updateA11yDescPanel(
    chart,
    html,
    hasVisualDesc = false,
    hasTableDesc = false
) {
    const chartEl = chart?.renderTo;
    if (!chartEl) {
        return;
    }

    const wrapper = chartEl.parentElement || chartEl;

    // Create or get the panel container
    let panel = wrapper.querySelector('.a11y-debug');
    if (!panel) {
        panel = document.createElement('div');
        panel.className = 'a11y-debug';
        if (chartEl.id) {
            panel.id = chartEl.id + '-a11y-debug';
        }
        panel.setAttribute('aria-hidden', 'true');
        wrapper.appendChild(panel);
    }

    // IMPORTANT: read persisted state from the chart instance (default: false)
    const expanded = chart.gaugeDescExpanded === true;

    // Rebuild panel content
    panel.innerHTML = `
      <div class="a11y-debug__title">Auto-description:</div>
      <div class="a11y-debug__content">${html}</div>
    `;

    // Handle visual description toggle if present
    if (hasVisualDesc) {
        const chartId = chartEl.id || 'chart';
        const toggleId = `visual-toggle-visible-${chartId}`;
        const contentId = `visual-content-visible-${chartId}`;

        const btn = panel.querySelector(`#${toggleId}`);
        const content = panel.querySelector(`#${contentId}`);

        if (btn && content) {
            // Apply the persisted state
            btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
            content.className = expanded ?
                'visual-desc-content visible' :
                'visual-desc-content hidden';
            const btnTextSpan = btn.querySelector('span');
            if (btnTextSpan) {
                btnTextSpan.textContent = expanded ?
                    'Hide Visual Description' : 'Show Visual Description';
            }

            // Bind a fresh click handler
            btn.onclick = ev => {
                ev.preventDefault();
                ev.stopPropagation();

                const currentlyExpanded =
                    btn.getAttribute('aria-expanded') === 'true';

                const next = !currentlyExpanded;

                // Update ARIA + visibility
                btn.setAttribute('aria-expanded', next ? 'true' : 'false');
                content.className = next ?
                    'visual-desc-content visible' :
                    'visual-desc-content hidden';
                const btnTextSpan = btn.querySelector('span');
                if (btnTextSpan) {
                    btnTextSpan.textContent = next ?
                        'Hide Visual Description' : 'Show Visual Description';
                }

                // 🔐 Persist for the next render
                chart.visualDescVisible = next;

                // Also update the screen reader region toggle state
                const srToggleId = `visual-toggle-${chartId}`;
                const srContentId = `visual-content-${chartId}`;
                const srBtn = document.getElementById(srToggleId);
                const srContent = document.getElementById(srContentId);

                if (srBtn && srContent) {
                    srBtn.setAttribute(
                        'aria-expanded',
                        next ? 'true' : 'false'
                    );
                    srContent.className = next ?
                        'visual-desc-content visible' :
                        'visual-desc-content hidden';
                    const srBtnTextSpan = srBtn.querySelector('span');
                    if (srBtnTextSpan) {
                        srBtnTextSpan.textContent = next ?
                            'Hide Visual Description' :
                            'Show Visual Description';
                    }
                }
            };
        }
    }

    // Handle table toggle if present
    if (hasTableDesc) {
        const chartId = chartEl.id || 'chart';
        const tableToggleId = `table-toggle-visible-${chartId}`;
        const tableContentId = `table-content-visible-${chartId}`;

        const tableBtn = panel.querySelector(`#${tableToggleId}`);
        const tableContent = panel.querySelector(`#${tableContentId}`);

        if (tableBtn && tableContent) {
            // Apply the persisted state
            const tableExpanded = chart.tableVisible === true;
            tableBtn.setAttribute(
                'aria-expanded',
                tableExpanded ? 'true' : 'false'
            );
            tableContent.className = tableExpanded ?
                'table-content visible' :
                'table-content hidden';
            const tableBtnTextSpan = tableBtn.querySelector('span');
            if (tableBtnTextSpan) {
                tableBtnTextSpan.textContent = tableExpanded ?
                    'Hide Data Table' : 'Show Data Table';
            }

            // Bind a fresh click handler
            tableBtn.onclick = ev => {
                ev.preventDefault();
                ev.stopPropagation();

                const currentlyExpanded =
                    tableBtn.getAttribute('aria-expanded') === 'true';
                const next = !currentlyExpanded;

                // Update ARIA + visibility
                tableBtn.setAttribute('aria-expanded', next ? 'true' : 'false');
                tableContent.className = next ?
                    'table-content visible' :
                    'table-content hidden';
                const tableBtnTextSpan = tableBtn.querySelector('span');
                if (tableBtnTextSpan) {
                    tableBtnTextSpan.textContent = next ?
                        'Hide Data Table' : 'Show Data Table';
                }

                // Persist for the next render
                chart.tableVisible = next;

                // Also update the screen reader region toggle state
                const srTableToggleId = `table-toggle-${chartId}`;
                const srTableContentId = `table-content-${chartId}`;
                const srTableBtn = document.getElementById(srTableToggleId);
                const srTableContent =
                    document.getElementById(srTableContentId);

                if (srTableBtn && srTableContent) {
                    srTableBtn.setAttribute(
                        'aria-expanded',
                        next ? 'true' : 'false'
                    );
                    srTableContent.className = next ?
                        'table-content visible' :
                        'table-content hidden';
                    const srTableBtnTextSpan = srTableBtn.querySelector('span');
                    if (srTableBtnTextSpan) {
                        srTableBtnTextSpan.textContent = next ?
                            'Hide Data Table' : 'Show Data Table';
                    }
                }
                // Generate and insert table content if showing
                if (next && chart.getTable) {
                    try {
                        // Check if custom table config exists
                        const tableConfig = chart.options?.custom?.tableConfig;
                        let tableHTML;

                        if (tableConfig) {
                            // Use custom table generation with better headers
                            tableHTML = generateCustomTable(chart, tableConfig);
                        } else {
                            // Fall back to default Highcharts table
                            tableHTML = chart.getTable();
                        }
                        tableContent.innerHTML = tableHTML;
                        if (srTableContent) {
                            srTableContent.innerHTML = tableHTML;
                        }
                    } catch (e) {
                        console.warn('Could not generate table:', e);
                    }
                } else if (!next) {
                    // Clear table content when hiding
                    tableContent.innerHTML = '';
                    if (srTableContent) {
                        srTableContent.innerHTML = '';
                    }
                }
            };
        }
    }

    // Find old gauge description button (backward compatibility)
    const btn = panel.querySelector('#gauge-description-btn-sr');
    const content = panel.querySelector('#gauge-description-sr');

    if (btn && content) {
        // Apply the persisted state
        btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
        content.className = expanded ?
            'visual-desc-content visible' :
            'visual-desc-content hidden';
        btn.textContent = expanded ? 'Hide Description' : 'Visual Description';

        // Bind a fresh, stateless click handler that
        // reads/writes from the chart
        btn.onclick = ev => {
            ev.preventDefault();
            ev.stopPropagation();

            const currentlyExpanded =
                btn.getAttribute('aria-expanded') === 'true';

            const next = !currentlyExpanded;

            // Update ARIA + visibility
            btn.setAttribute('aria-expanded', next ? 'true' : 'false');
            content.className = next ?
                'visual-desc-content visible' :
                'visual-desc-content hidden';
            btn.textContent = next ? 'Hide Description' : 'Visual Description';

            // 🔐 Persist for the next render
            chart.gaugeDescExpanded = next;
        };
    }
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
        () => hasType(chart, 'gauge') && (() =>
            'Gauge scale showing budget used, current value 92%')(),

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
            `Sunburst chart with 62 nodes in a hierarchy with 4 levels. 
            Chart shows budget (USD) in 2025. Hierarchy structure: The 
            first node is "Company". Below that, the second level of nodes 
            has Engineering, Sales & Marketing, Operations and two more. 
            The third level shows teams, and the fourth level shows expense 
            types.`
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


function getCustomVisualDesc(chart) {
    const fromOpts = chart.options?.custom?.visualDesc ??
        chart.options?.chart?.custom?.visualDesc;

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
            return;
        }
        charts[id] = Highcharts.chart(id, HC_CONFIGS[id]);
    });

    // Hide accessibility menu buttons after charts load
    setTimeout(() => {
        const a11yButtons =
            document.querySelectorAll('.hc-a11y-sr-only.hc-a11y-menu-button');
        a11yButtons.forEach(button => {
            button.style.display = 'none';
        });
    }, 500);

    // Add test function to the global scope for testing
    setTimeout(() => {
        // Add a test function to the global scope for easy testing
        window.testVisualDescSync = function (chartId) {
            const chart = charts[chartId];
            if (!chart || !chart.toggleVisualDescription) {
                return;
            }

            // Toggle and show result
            const newState = chart.toggleVisualDescription();
            return newState;
        };

        // Add a test function for table toggle
        window.testDataTableSync = function (chartId) {
            const chart = charts[chartId];
            if (!chart || !chart.toggleDataTable) {
                return;
            }

            // Toggle and show result
            const newState = chart.toggleDataTable();
            return newState;
        };
    }, 1000);
});
