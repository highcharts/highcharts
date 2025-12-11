// Spline w/Plotlines
const chart1typedesc = `
<p>
    Line chart with 2 series: JAWS (primary screen reader) 
    and NVDA (primary screen reader).
</p>
`;
const chart1desc = `
    <p>
      JAWS usage starts very high in 2009 and gradually declines before rising
      again in 2017 and 2021, while NVDA grows steadily from a low starting
      point and levels off in later years.
    </p>
    <p>
      NVDA and JAWS move closer together over time, with NVDA overtaking JAWS
      once in 2019, and the two ending at nearly the same level again in 2024.
    </p>
    <ul>
        <li>X-axis: Survey years 2009–2024</li>
        <li>Y-axis: Primary screen reader usage (%)</li>
        <li>JAWS highest value: 74% (2009)</li>
        <li>JAWS lowest value: 30% (2014–2015)</li>
        <li>NVDA highest value: 41% (2019)</li>
        <li>NVDA lowest value: 8% (2009)</li>
        <li>Only year NVDA overtakes JAWS: 2019</li>
        <li>Ending values (2024): JAWS 41%, NVDA 38%</li>
    </ul>
`;

// Stacked column
const chart2typedesc = `
<p>
    Bar chart showing 4 series stacked on top of each other per bar. 
    One bar for each sector. Each sector consists of Captions, 
    Transcripts, Audio descriptions and Sign language.
</p>
`;
const chart2desc = `
    <p>
      The chart compares how often four accessibility features are provided
      for video content across the sectors: Government, Education,
      Entertainment and Corporate.
    </p>
    <p>
      Government and education sectors provide captions and transcripts
      more often than entertainment and corporate, while audio description
      and sign language remain rare in every sector, with only modestly
      higher levels in entertainment and government.
    </p>
    <ul>
        <li>X-axis: Sector (Government, Education, Entertainment, 
        Corporate)</li>
        <li>Y-axis: Share of video content that provides each feature (%)</li>
        <li>Most common feature in all sectors: Captions; rarest everywhere: 
        Sign language</li>
    </ul>
`;
const chart2visualdesc = `
    <p>Four vertical bars side by side. Each bar is stacked in
    colored layers, like a cake. The layers show sectors,
    and each bar represents an sector to show video accessibility features.</p>
`;

// Big heatmap
const chart3typedesc = `
<p>
    Heatmap with 8759 cells, showing temperature per hour over a year.
</p>
`;
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

// Gauge
const chart4typedesc = `
<p>
    Gauge scale showing budget used, current value 92%
</p>
`;

const chart4desc = `
  <p>The gauge scale goes from 0-120%, and is divided into the
  following zones: Healthy (up to 80%), Watch (80-100%),
  Overspend (above 100%). Current value 92% is in the Watch zone.</p>
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

// Bubble
const chart5typedesc = `
<p>
    Bubble chart with 15 points: Belgium, Germany, Finland, and 12 more.
</p>
`;
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
const chart6typedesc = `
<p>
    Sunburst chart with 62 nodes in a hierarchy with 
    4 levels. Chart shows budget (USD) in 2025. Hierarchy 
    structure: The first node is "Company". Below that, 
    the second level of nodes has Engineering, Sales & Marketing, 
    Operations and two more. The third level shows teams, and the 
    fourth level shows expense types.
</p>
`;
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
    chart1: { // Spline w/plotlines -> Screen reader usage over time
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
            typeDesc: chart1typedesc,
            autoDesc: chart1desc,
            hasDataTable: true,
            tableConfig: {
                columnHeaderFormatter: function (item, key) {
                    if (key === 'x') {
                        return 'Survey year';
                    }
                    if (key === 'y') {
                        return item.name + ' (primary usage %)';
                    }
                    return item.name || 'Series';
                }
            }
        },
        chart: {
            type: 'spline'
        },
        title: {
            text: 'Primary screen reader usage: JAWS vs NVDA'
        },
        subtitle: {
            text: 'From 2009 to 2024'
        },
        yAxis: {
            title: {
                text: 'Respondents using as primary screen reader (%)'
            },
            labels: {
                format: '{value}%'
            }
        },

        xAxis: {
            crosshair: true,
            categories: [
                '2009',
                '2010',
                '2012',
                '2014',
                '2015',
                '2017',
                '2019',
                '2021',
                '2024'
            ]
        },

        legend: { enabled: true },

        tooltip: {
            shared: true,
            valueSuffix: '%'
        },

        series: [
            {
                name: 'JAWS (primary screen reader)',
                data: [74, 59, 49, 30, 30, 46, 40, 54, 41],
                color: '#014CE5'
            },
            {
                name: 'NVDA (primary screen reader)',
                data: [8, 14, 31, 26, 31, 31, 41, 31, 38],
                color: '#EA293C'
            }
        ]
    },


    chart2: { // Stacked column – Video accessibility features by sector
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
            typeDesc: chart2typedesc,
            autoDesc: chart2desc,
            visualDesc: chart2visualdesc,
            hasDataTable: true,
            tableConfig: {
                columnHeaderFormatter: function (item, key) {
                    if (key === 'x') {
                        return 'Sector';
                    }
                    if (key === 'y') {
                        return item.name + ' (% of video content)';
                    }
                    return item.name || 'Accessibility feature';
                }
            }
        },

        chart: {
            type: 'column'
        },

        title: {
            text: 'Video Accessibility Features by Sector',
            align: 'left'
        },

        xAxis: {
            categories: [
                'Government',
                'Education',
                'Entertainment',
                'Corporate'
            ]
        },

        yAxis: {
            min: 0,
            max: 200, // enough room for stacked totals
            title: {
                text: '% of video content with each feature'
            },
            stackLabels: {
                enabled: true,
                formatter: function () {
                    return this.total.toFixed(0) + '%';
                }
            }
        },

        tooltip: {
            headerFormat: '{category}<br/>',
            pointFormat:
            '{series.name}: {point.y}%<br/>' +
            'Sum of shown features: {point.stackTotal}%<br/>' +
            '<span style="font-size: 11px">(A single video can have multiple ' +
            'features, so totals can exceed 100%.)</span>'
        },

        plotOptions: {
            column: {
                stacking: 'normal',
                dataLabels: {
                    enabled: true,
                    format: '{point.y}%',
                    style: {
                        textOutline: 'none'
                    }
                }
            }
        },

        series: [
            {
                name: 'Captions',
                data: [85, 70, 60, 50],
                color: '#014CE5'
            },
            {
                name: 'Transcripts',
                data: [60, 55, 35, 30],
                color: '#10B981'
            },
            {
                name: 'Audio descriptions',
                data: [25, 15, 40, 10],
                color: '#EAB308'
            },
            {
                name: 'Sign language',
                data: [10, 5, 2, 1],
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
            typeDesc: chart3typedesc,
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
            typeDesc: chart4typedesc,
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
            typeDesc: chart5typedesc,
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
            typeDesc: chart6typedesc,
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

        const basic  = getCustomTypeDesc(this);
        const custom = getCustomAutoDesc(this);
        const visual = getCustomVisualDesc(this);
        const hasTable = this.options?.custom?.hasDataTable === true;

        // For screen reader: basic + visual toggle + table toggle + custom
        let srHtml;
        if (visual !== null) {
            // default falses (hidden)
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
            const visualExpanded = chart.visualDescVisible === true;
            btn.setAttribute(
                'aria-expanded', visualExpanded ? 'true' : 'false'
            );
            content.className = visualExpanded ?
                'visual-desc-content visible' :
                'visual-desc-content hidden';
            const btnTextSpan = btn.querySelector('span');
            if (btnTextSpan) {
                btnTextSpan.textContent = visualExpanded ?
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
}


// Generic helper function to get custom descriptions
function getCustomDesc(chart, propName) {
    const fromOpts = chart.options?.custom?.[propName] ??
        chart.options?.chart?.custom?.[propName];
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

// Convenience functions using the generic helper
function getCustomTypeDesc(chart) {
    return getCustomDesc(chart, 'typeDesc');
}

function getCustomAutoDesc(chart) {
    return getCustomDesc(chart, 'autoDesc');
}

function getCustomVisualDesc(chart) {
    return getCustomDesc(chart, 'visualDesc');
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
