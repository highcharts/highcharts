// Line
const chart1desc = `
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

// Spline w/Plotlines
const chart2desc = `
    <p> Helsinki temperatures rise steadily from winter lows below zero to
    a summer peak around July, before cooling again toward December.
    Summer (May–September) is highlighted as the warmest period. </p>
    <ul>
        <li>X-axis: Months January–December</li>
        <li>Y-axis: Temperature in °C, range –10°C to 20°C</li>
    </ul>
    <ul>
        <li>Highest value: ~17°C in July</li>
        <li>Lowest value: ~–6°C in February</li>
        <li>Summer period marked: May–September</li>
        <li>Crosses above freezing (0°C) in April, falls below again 
        in November</li>
    </ul>
`;

// Arearange
const chart3desc  = `
    <p> Daily temperatures in Bergen fluctuate widely but follow a seasonal 
    pattern: warming from March to a summer peak around July, then steadily 
    cooling toward winter lows by December–January. </p>
    <ul>
        <li>X-axis: March 2023 – January 2024</li>
        <li>Y-axis: Temperature in °C, range –20°C to 30°C</li>
    </ul>
    <ul>
        <li>Highest value: ~28°C in July 2023</li>
        <li>Lowest value: ~–15°C in early 2023</li>
        <li>Temperatures mostly above 0°C from May to October</li>
    </ul>
`;

// Column
const chart4desc  = `
    <ul>
        <li>X-axis: USA, China, Brazil, EU, Argentina, and India</li>
        <li>Y-axis: 1000 metric tons (MT)</li>
    </ul>
    <ul>
        <li>Highest value: 387,749 in Corn (USA)</li>
        <li>Lowest value: 10,000 in Wheat (Brazil)</li>
        <li>Corn peaks at 387,749 in USA</li>
        <li>Wheat peaks at 140,500 in EU</li>

    </ul>
`;

// Stacked column
const chart5desc  = `
    <p> Manchester United dominates in total trophies</p>
    <ul>
        <li>X-axis: Arsenal, Chelsea, Liverpool, Manchester United</li>
        <li>Y-axis: Count trophies, range 0–30</li>
    </ul>
    <ul>
        <li>Highest value: 28 total trophies for Manchester United</li>
        <li>Lowest value: 15 total trophies, shared by Chelsea and 
        Liverpool</li>
        <li>Arsenal leads in FA Cup wins</li>
        <li>Manchester United leads in both BPL and overall total</li>
        <li>Liverpool has the most Champions League titles</li>
    </ul>
`;

// Dumbbell
const chart6desc  = `
    <p> Life expectancy has risen significantly from 1970 to 2021 
    across all listed European countries</p>
    <ul>
        <li>X-axis: Life Expectancy (years), range 65–85</li>
        <li>Y-axis: Countries — Sweden, Greece, Switzerland, Belgium, 
        Austria, Czechia, Romania</li>
    </ul>
    <ul>
        <li>Highest value: ~84 years in Switzerland (2021)</li>
        <li>Lowest value: ~72 years in Romania (1970)</li>
        <li>Largest increase: Romania, ~10 years gained</li>
        <li>Smallest increase: Sweden, ~6 years gained (but already 
        high in 1970)</li>
    </ul>
`;

// Pie
const chart7desc  = `
    <p>Water takes up over half of the yolk's composition!</p>
`;

// Funnel
const chart8desc = `
<p>
Only a small share of website visits turn into finalized sales, with big 
drop-offs at each stage.
</p>
`;

// Gauge
const chart9desc  = `
    <p> The needle points to about 70, which is inside the green safe zone. 
    The scale is color-coded to show safe, caution, and danger ranges. </p>
    <ul>
        <li>Current value: ~70 (green zone)</li>
        <li>Threshold for caution: above 120</li>
        <li>Threshold for danger: above 160</li>
    </ul>
`;

// Sankey
const chart10desc = `
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

// Dependency wheel
const chart11desc = `
    <p>The chart shows strong interconnected flows between countries, 
    with Europe, Africa, and Asia linked by multiple dependencies. </p>
    <ul>
        <li>Largest hubs: China, England, and USA</li>
        <li>Notable European connections: France, Spain, and Portugal</li>
        <li>Strong African links: Morocco, Senegal, and South Africa</li>
    </ul>
    <p>Top flows:</p>
    <ul>
        <li>China to Mali</li>
        <li>England to USA</li>
        <li>Portugal to Brazil</li>
    </ul>
`;

// Network
const chart12desc = `
    <p>The chart shows a circular social network where each 
    person is connected to a few nearby neighbors, forming a continuous ring 
    of relationships. </p> 
    <ul>
        <li>Layout: Nodes arranged in a ring</li>
        <li>Each node: Represents a person (e.g., Alice, Bob, Charlie, 
            etc.)</li>
        <li>Edges: Show direct connections between people</li>
    </ul>
    <p>Key observations:</p>
    <ul>
        <li>Alice, Bob, Charlie, and Nina form a small interconnected 
            cluster within the ring</li>
        <li>Connections are evenly distributed, no single dominant hub</li>
        <li>Overall structure is balanced, suggesting equal participation 
            in the network</li>
    </ul>
`;

// Histogram
const chart13desc = `
    <p>Overall overview: gradual increase from Jan, 
        peaking mid-year, then decreasing toward Oct</p>
    <ul>
        <li>X-axis: Jan–Oct</li>
        <li>Y-axis: Values, Range: 50–176 mm</li>
    </ul>
    <ul>
        <li>Lowest bin: Jan and Oct, around 50 mm</li>
        <li>Peak: June, with 176 mm</li>
    </ul>
`;


// Boxplot
const chart14desc = `
    <p> Most experiments cluster close to the theoretical mean of 932, 
    but there are clear outliers both below and above the main ranges. 
    </p> 
    <ul>
        <li>X-axis: Experiment numbers 1–5</li>
        <li>Y-axis: Observations, range ~600–1200</li>
    </ul>
    <ul>
        <li>Theoretical mean: 932 (red reference line)</li>
        <li>Experiment 1: Outlier at 644, below the main box</li>
        <li>Experiment 2: Tallest spread, ranging from ~700–1100</li>
        <li>Experiment 3: Narrower range, centered below the mean</li>
        <li>Experiment 5: Several outliers above 1000</li>
    </ul>
`;

// Bell curve
const chart15desc = `
    <p>The data follows a normal distribution, forming a symmetric bell curve 
    centered around the middle values, with most points clustering near the 
    peak and fewer outliers at the edges. </p>
    <ul>
        <li>X-axis: Data values, range 0–150</li>
        <li>Y-axis (left): Data observations, range ~1.6–4.8</li>
        <li>Y-axis (right): Bell curve density, range 0–1</li>
    </ul>
    <ul>
        <li>Peak around 75 (center of the distribution)</li>
        <li>Data points spread evenly across the curve with higher density 
        near the middle</li>
        <li>Tails thin out toward the extremes (near 0 and 150)</li>
    </ul>
`;

// Heatmap
const chart16desc = `
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
    </ul>
`;

// Big heatmap
const chart17desc = `
    <p>Temperatures vary by both season and time of day, with the 
    warmest conditions in July and cooler periods at the start and 
    end of the year. </p>
    <ul>
        <li>X-axis: Months January–December (2023)</li>
        <li>Y-axis: Hours of the day (0:00–18:00)</li>
        <li>Range: –10°C to 20°C</li>
    </ul>
    <ul>
        <li>Highest temperatures: July, reaching around 20°C</li>
        <li>Lowest temperatures: January, dropping to –10°C</li>
        <li>Daytime generally warmer than nighttime across all months</li>
    </ul>
`;

// Tilemap
const chart18desc = `
    <p> Population varies widely across U.S. states, with California, 
    Texas, Florida, and New York standing out as the most populous, 
    while states like Wyoming and Vermont have fewer than 1 million people. </p>
`;

// Scatter plot
const chart19desc = `
    <p>Athletes show a strong correlation between height and weight, 
    with basketball and volleyball players generally taller and heavier, 
    while triathletes are shorter and lighter on average. </p>
    <ul>
        <li>X-axis: Height, range 1.4 m – 2.2 m</li>
        <li>Y-axis: Weight, range 0 kg – 150 kg</li>
    </ul>
    <ul>
        <li>Basketball: Tallest athletes, many above 2 m and over 100 kg</li>
        <li>Volleyball: Clustered around 1.8–2.0 m and 70–90 kg</li>
        <li>Triathlon: Shorter athletes, mostly 1.6–1.8 m and 50–70 kg</li>
    </ul>
`;

// Bubble
const chart20desc = `
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
    </ul>
    <ul>
        <li>Highest sugar intake: U.S. (126g/day)</li>
        <li>Highest fat intake: Belgium (95g/day)</li>
        <li>Highest obesity rate: U.S. (35.3%)</li>
        <li>Closer to safe levels: Portugal (63g fat, 52g sugar), Hungary 
        (65g fat, 51g sugar), Russia (69g fat, 20g sugar)</li>
    </ul>
`;

// Packed bubble
const chart21desc = `
    <p>Most of the workload is concentrated in “To Do” and “In Progress,” 
    while “Done” contains only a few smaller completed tasks. </p>
    <ul>
        <li>Categories (series): Backlog, To Do, In Progress, To Verify, 
        Done</li>
        <li>Bubble size: Represents task importance or workload value</li>
    </ul>
`;

// Treemap
const chart22desc = `
    <p>Nord-Norge dominates in area, while Oslo is by far the smallest 
    county</p> 
`;

// Sunburst
const chart23desc = `
    <p>Asia and Africa contain the bulk of the world’s population in 
    2023, with India and China far ahead of all other countries; 
    regional stand-outs include the United States, Indonesia, Brazil, 
    and Nigeria. </p>
    <ul>
        <li>Hierarchy: World → Continent → Subregion → Country</li>
        <li>Measure: Population (people), 2023</li>
    </ul>
    <ul>
        <li>Largest countries overall: India and China</li>
        <li>Smallest nodes shown: Vatican City and 
        Pitcairn Islands</li> 
    </ul>
`;


// Organization
const chart24desc = `
    <p>Carnivora splits into three main families—Felidae (cats), 
    Mustelidae (weasels/otters), and Canidae (dogs)—with each 
    branch showing example genera and species at the leaves. 
    </p>
    <ul>
        <li>Root: Carnivora</li>
        <li>Colors and pictures of the animals distinguish the 
        family branches. Some of the leaf nodes include images 
        and tooltips with short descriptions.</li>
    </ul>
`;

// Waterfall
const chart25desc = `
    <p>Revenues comfortably outweigh costs, yielding a positive final balance 
    of $345k, driven mainly by Product Revenue. </p> 
    <ul>
        <li>X-axis: Start, Product Revenue, Service Revenue, Positive Balance, 
        Fixed Costs, Variable Costs, Balance</li>
        <li>Y-axis: USD</li>
    </ul>
`;

// Pyramid
const chart26desc = `
    <p> Only a small share of visits convert to finalized sales (≈5.4%), 
    with the biggest drop-off early (Visits → Downloads) and a strong 
    close rate from Invoice to Finalized (~87%). </p>
`;

// No chart yet
const chart27desc = `
    <p>No desc</p>
`;

// Timeline
const chart28desc = `
    <ul>
        <li>Axis: Timeline (events listed chronologically, 2000–2024)</li>
    </ul>
`;

// Wordcloud
const chart29desc = `
    <p>The wordcloud highlights the most frequent terms in the excerpt, 
    with “Alice,” “Rabbit,” “sister,” and “book” standing out as central 
    themes.</p>
    <ul>
        <li>Encoding: word size ∝ frequency in the excerpt</li>
    </ul>
`;

// No chart yet
const chart30desc = `
    <p>No desc</p>
`;

// Polar
const chart31desc = `
    <p>Values vary around the circle: columns start high and fall as the 
    angle increases, the line does the opposite (rising steadily), and 
    the area alternates high/low in a repeating pattern. </p> 
    <ul>
        <li>X-axis: 0°–360° (ticks every 45°)</li>
        <li>Y-axis: values ≥ 0</li>
    </ul>
`;

// Wind rose
const chart32desc = `
    <p>Winds are most frequent from the SE–SSE sector, with the vast 
    majority at low speeds (2 m/s); northern and eastern 
    directions are comparatively uncommon.</p>
    <ul>
        <li>Directions: 16 compass points (N → NNW)</li>
        <li>Measure: Frequency (%) stacked by speed bands</li>
        <li>Speed bands: &lt;0.5, 0.5–2, 2–4, 4–6, 6–8, 8–10, 10 m/s</li>
    </ul>
`;

// No chart yet
const chart33desc = `
    <p>No desc</p>
`;

const HC_CONFIGS = {
    // ===== Row 1: Time series (line) =====
    chart1: { // Line
        custom: { autoDesc: chart1desc },

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
    chart2: { // Spline w/plotlines
        custom: { autoDesc: chart2desc },
        title: {
            text: 'Helsinki Average Monthly Temperature',
            align: 'left',
            margin: 25
        },

        sonification: {
            duration: 8000,
            defaultInstrumentOptions: {
                mapping: {
                    pitch: {
                        min: 'c3',
                        max: 'd6'
                    }
                }
            },
            globalContextTracks: [{
            // A repeated piano note for the 0 plot line
                instrument: 'piano',
                valueInterval: 1 / 3, // Play 3 times for every X-value
                mapping: {
                    pitch: {
                        mapTo: 'y',
                        value: 0 // Map to a fixed Y value
                    },
                    volume: 0.1
                }
            }, {
            // Percussion sound indicates the plot band
                instrument: 'shaker',
                activeWhen: {
                    valueProp: 'x', // Active when X is between these values.
                    min: 4,
                    max: 9
                },
                timeInterval: 100, // Play every 100 milliseconds
                mapping: {
                    volume: 0.1
                }
            }, {
            // Speak the plot band label
                type: 'speech',
                valueInterval: 1,
                activeWhen: {
                    crossingUp: 4 // Active when crossing over x = 4
                },
                mapping: {
                    text: 'Summer',
                    rate: 2.5,
                    volume: 0.3
                }
            }]
        },

        yAxis: {
            plotLines: [{
                value: 0,
                color: '#59D',
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
                color: '#00ff8833',
                label: {
                    text: 'Summer',
                    align: 'left',
                    x: 10
                }
            }],
            plotLines: [{
                value: 3.5,
                color: '#4EA291',
                width: 3
            }, {
                value: 8.5,
                color: '#4EA291',
                width: 3
            }],
            crosshair: true,
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
                'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
            ]
        },

        legend: {
            enabled: false
        },

        tooltip: {
            valueSuffix: '°C'
        },

        series: [{
            name: 'Helsinki',
            data: [-5, -6, -2, 4, 10, 14, 17, 15, 10, 6, 0, -4],
            color: 'var(--highcharts-neutral-color-80, #334eff)'
        }]
    },
    chart3: { // Arearange
        custom: {
            autoDesc: chart3desc
        },
        data: {
            csvURL: 'https://cdn.jsdelivr.net/gh/highcharts/highcharts@b99fc27c/samples/data/temp-florida-bergen-2023.csv',
            beforeParse: function (csv) {
                return csv.replace(/\n\n/g, '\n');
            }
        },

        chart: {
            type: 'arearange',
            zooming: {
                type: 'x'
            },
            scrollablePlotArea: {
                minWidth: 600,
                scrollPositionX: 1
            }
        },

        title: {
            text: 'Temperature variation by day',
            align: 'left'
        },

        subtitle: {
            text: 'Source: <a href="https://veret.gfi.uib.no/" target="_blank">Universitetet i Bergen</a>',
            align: 'left'
        },

        xAxis: {
            type: 'datetime'
        },

        yAxis: {
            title: {
                text: null
            }
        },

        tooltip: {
            fixed: true,
            crosshairs: true,
            shared: true,
            valueSuffix: '°C',
            xDateFormat: '%A, %b %e'
        },

        legend: {
            enabled: false
        },

        series: [{
            name: 'Temperatures',
            color: {
                linearGradient: { x1: 0, x2: 0, y1: 0, y2: 1 },
                stops: [
                    [0, '#ff6666'],
                    [1, '#6666ff']
                ]
            }
        }],

        annotations: [{
            labelOptions: {
                backgroundColor: 'rgba(255,255,255,0.9)',
                borderColor: '#999',
                borderRadius: 3,
                padding: 6,
                style: { fontSize: '11px' }
            },
            labels: [{
                point: { xAxis: 0, yAxis: 0, x: Date.UTC(2023, 2, 9), y: -8.3 },
                text: 'Coldest min\n−8.3 °C',
                y: -12
            }, {
                point: { xAxis: 0, yAxis: 0, x: Date.UTC(2023, 5, 9), y: 22.6 },
                text: 'First ≥ 20 °C high\n(22.6 °C)',
                y: -12
            }, {
                point: { xAxis: 0, yAxis: 0, x: Date.UTC(2023, 6, 9), y: 27.2 },
                text: 'Year high\n27.2 °C',
                y: -12
            }, {
                point: {
                    xAxis: 0, yAxis: 0, x: Date.UTC(2023, 8, 18), y: 20.8
                },
                text: 'Last ≥ 20 °C',
                y: -12
            }]
        }]
    },

    // ===== Row 2: Categorical (column) =====
    chart4: { // Column
        custom: {
            autoDesc: chart4desc
        },
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
    chart5: { // Stacked column
        custom: { autoDesc: chart5desc },
        chart: {
            type: 'column'
        },
        title: {
            text: 'Major trophies for some English teams',
            align: 'left'
        },
        xAxis: {
            categories: ['Arsenal', 'Chelsea', 'Liverpool', 'Manchester United']
        },
        yAxis: {
            min: 0,
            title: {
                text: 'Count trophies'
            },
            stackLabels: {
                enabled: true
            }
        },
        legend: {
            align: 'left',
            x: 70,
            verticalAlign: 'top',
            y: 70,
            floating: true,
            backgroundColor: 'var(--highcharts-background-color, #ffffff)',
            borderColor: 'var(--highcharts-neutral-color-20, #cccccc)',
            borderWidth: 1,
            shadow: false
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
        series: [{
            name: 'BPL',
            data: [3, 5, 1, 13]
        }, {
            name: 'FA Cup',
            data: [14, 8, 8, 12]
        }, {
            name: 'CL',
            data: [0, 2, 6, 3]
        }]
    },
    chart6: { // Dumbbell
        custom: { autoDesc: chart6desc },
        chart: {
            type: 'dumbbell',
            inverted: true
        },

        legend: {
            enabled: false
        },

        subtitle: {
            text: '1970 vs 2021 Source: ' +
            '<a href="https://ec.europa.eu/eurostat/en/web/main/data/database"' +
            'target="_blank">Eurostat</a>'
        },

        title: {
            text: 'Change in Life Expectancy'
        },

        tooltip: {
            shared: true
        },

        xAxis: {
            type: 'category'
        },

        yAxis: {
            title: {
                text: 'Life Expectancy (years)'
            }
        },

        plotOptions: {
            series: {
                dataSorting: {
                    enabled: true,
                    sortKey: 'low'
                }
            }
        },

        series: [{
            name: 'Life expectancy change',
            data: [{
                name: 'Austria',
                low: 70.1,
                high: 81.3
            }, {
                name: 'Belgium',
                low: 71.0,
                high: 81.9
            }, {
                name: 'Czechia',
                low: 69.6,
                high: 77.4
            }, {
                name: 'Estonia',
                low: 70.4,
                high: 76.9
            }, {
                name: 'Greece',
                low: 73.8,
                high: 80.3
            }, {
                name: 'Hungary',
                low: 69.2,
                high: 74.5
            }, {
                name: 'Iceland',
                low: 73.8,
                high: 83.2
            }, {
                name: 'Lithuania',
                low: 71.1,
                high: 74.5
            }, {
                name: 'Norway',
                low: 74.3,
                high: 83.2
            }, {
                name: 'Portugal',
                low: 66.7,
                high: 81.2
            }, {
                name: 'Romania',
                low: 68.2,
                high: 72.9
            }, {
                name: 'Slovakia',
                low: 69.8,
                high: 74.8
            }, {
                name: 'Sweden',
                low: 74.7,
                high: 83.2
            }, {
                name: 'Switzerland',
                low: 73.2,
                high: 84.0
            }]
        }]
    },

    // ===== Row 3: Composition (pie) & KPI =====
    chart7: { // Pie
        custom: { autoDesc: chart7desc },
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
    chart8: { // Funnel
        custom: {
            autoDesc: chart8desc
        },
        chart: {
            type: 'funnel'
        },
        title: {
            text: 'Sales funnel'
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    softConnector: true
                },
                center: ['40%', '50%'],
                neckWidth: '30%',
                neckHeight: '25%',
                width: '80%'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Unique users',
            data: [
                ['Website visits', 15654],
                ['Downloads', 4064],
                ['Requested price list', 1987],
                ['Invoice sent', 976],
                ['Finalized', 846]
            ]
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    plotOptions: {
                        series: {
                            dataLabels: {
                                inside: true
                            },
                            center: ['50%', '50%'],
                            width: '100%'
                        }
                    }
                }
            }]
        }
    },
    chart9: { // Gauge
        custom: {
            autoDesc: chart9desc
        },
        chart: {
            type: 'gauge',
            plotBackgroundColor: null,
            plotBackgroundImage: null,
            plotBorderWidth: 0,
            plotShadow: false,
            height: '80%'
        },

        title: {
            text: 'Speedometer'
        },

        pane: {
            startAngle: -90,
            endAngle: 89.9,
            background: null,
            center: ['50%', '75%'],
            size: '110%'
        },

        // the value axis
        yAxis: {
            min: 0,
            max: 200,
            tickPixelInterval: 72,
            tickPosition: 'inside',
            tickColor: 'var(--highcharts-background-color, #FFFFFF)',
            tickLength: 20,
            tickWidth: 2,
            minorTickInterval: null,
            labels: {
                distance: 20,
                style: {
                    fontSize: '14px'
                }
            },
            lineWidth: 0,
            plotBands: [
                {
                    from: 0,
                    to: 120,
                    color: '#55BF3B', // green
                    thickness: 20,
                    borderRadius: '50%'
                },
                {
                    from: 120,
                    to: 160,
                    color: '#DDDF0D', // yellow
                    thickness: 20,
                    borderRadius: '50%'
                },
                {
                    from: 160,
                    to: 200,
                    color: '#DF5353', // red
                    thickness: 20,
                    borderRadius: '50%'
                }
            ]
        },

        series: [
            {
                name: 'Speed',
                data: [80],
                tooltip: {
                    valueSuffix: ' km/h'
                },
                dataLabels: {
                    format: '{y} km/h',
                    borderWidth: 0,
                    color:
          (Highcharts.defaultOptions.title &&
            Highcharts.defaultOptions.title.style &&
            Highcharts.defaultOptions.title.style.color) ||
          '#333333',
                    style: {
                        fontSize: '16px'
                    }
                },
                dial: {
                    radius: '80%',
                    backgroundColor: 'gray',
                    baseWidth: 12,
                    baseLength: '0%',
                    rearLength: '0%'
                },
                pivot: {
                    backgroundColor: 'gray',
                    radius: 6
                }
            }
        ]
    },

    // ===== Row 4: Flow (sankey) =====
    chart10: { // Sankey
        custom: { autoDesc: chart10desc },
        chart: {
            type: 'sankey',
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
                style: {
                    color: 'var(--highcharts-neutral-color-100, #000)'
                }
            }
        }]
    },
    chart11: { // Dependency wheel
        custom: { autoDesc: chart11desc },
        chart: {
            type: 'dependencywheel'
        },
        title: {
            text: 'Highcharts Dependency Wheel'
        },

        series: [{
            keys: ['from', 'to', 'weight'],
            data: [
                ['Brazil', 'Portugal', 5],
                ['Brazil', 'France', 1],
                ['Brazil', 'Spain', 1],
                ['Brazil', 'England', 1],
                ['Canada', 'Portugal', 1],
                ['Canada', 'France', 5],
                ['Canada', 'England', 1],
                ['Mexico', 'Portugal', 1],
                ['Mexico', 'France', 1],
                ['Mexico', 'Spain', 5],
                ['Mexico', 'England', 1],
                ['USA', 'Portugal', 1],
                ['USA', 'France', 1],
                ['USA', 'Spain', 1],
                ['USA', 'England', 5],
                ['Portugal', 'Angola', 2],
                ['Portugal', 'Senegal', 1],
                ['Portugal', 'Morocco', 1],
                ['Portugal', 'South Africa', 3],
                ['France', 'Angola', 1],
                ['France', 'Senegal', 3],
                ['France', 'Mali', 3],
                ['France', 'Morocco', 3],
                ['France', 'South Africa', 1],
                ['Spain', 'Senegal', 1],
                ['Spain', 'Morocco', 3],
                ['Spain', 'South Africa', 1],
                ['England', 'Angola', 1],
                ['England', 'Senegal', 1],
                ['England', 'Morocco', 2],
                ['England', 'South Africa', 7],
                ['South Africa', 'China', 5],
                ['South Africa', 'India', 1],
                ['South Africa', 'Japan', 3],
                ['Angola', 'China', 5],
                ['Angola', 'India', 1],
                ['Angola', 'Japan', 3],
                ['Senegal', 'China', 5],
                ['Senegal', 'India', 1],
                ['Senegal', 'Japan', 3],
                ['Mali', 'China', 5],
                ['Mali', 'India', 1],
                ['Mali', 'Japan', 3],
                ['Morocco', 'China', 5],
                ['Morocco', 'India', 1],
                ['Morocco', 'Japan', 3],
                ['Japan', 'Brazil', 1]
            ],
            type: 'dependencywheel',
            name: 'Dependency wheel series',
            dataLabels: {
                color: 'var(--highcharts-neutral-color-80, #333)',
                style: {
                    textOutline: 'none'
                },
                textPath: {
                    enabled: true
                },
                distance: 10
            },
            size: '95%'
        }]
    },
    chart12: { // Network
        custom: { autoDesc: chart12desc },
        title: {
            text: 'Social Network Graph'
        },
        chart: {
            type: 'networkgraph'
        },
        series: [{
            type: 'networkgraph',
            layoutAlgorithm: {
                enableSimulation: true
            },
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            },
            data: [
                { from: 'Alice', to: 'Bob' },
                { from: 'Alice', to: 'Charlie' },
                { from: 'Bob', to: 'David' },
                { from: 'Charlie', to: 'David' },
                { from: 'David', to: 'Eve' },
                { from: 'Eve', to: 'Frank' },
                { from: 'Frank', to: 'Grace' },
                { from: 'Grace', to: 'Hannah' },
                { from: 'Hannah', to: 'Ivy' },
                { from: 'Ivy', to: 'Jack' },
                { from: 'Jack', to: 'Kathy' },
                { from: 'Kathy', to: 'Liam' },
                { from: 'Liam', to: 'Mona' },
                { from: 'Mona', to: 'Nina' },
                { from: 'Nina', to: 'Oscar' },
                { from: 'Oscar', to: 'Paul' },
                { from: 'Paul', to: 'Quinn' },
                { from: 'Quinn', to: 'Rachel' },
                { from: 'Rachel', to: 'Steve' },
                { from: 'Steve', to: 'Tina' },
                { from: 'Tina', to: 'Uma' },
                { from: 'Uma', to: 'Vera' },
                { from: 'Vera', to: 'Will' },
                { from: 'Will', to: 'Xena' },
                { from: 'Xena', to: 'Yara' },
                { from: 'Yara', to: 'Zane' },
                { from: 'Zane', to: 'Alice' },
                { from: 'Alice', to: 'Oscar' },
                { from: 'Bob', to: 'Mona' },
                { from: 'Charlie', to: 'Nina' },
                { from: 'David', to: 'Paul' },
                { from: 'Eve', to: 'Quinn' },
                { from: 'Frank', to: 'Rachel' },
                { from: 'Grace', to: 'Steve' },
                { from: 'Hannah', to: 'Tina' },
                { from: 'Ivy', to: 'Uma' },
                { from: 'Jack', to: 'Vera' },
                { from: 'Kathy', to: 'Will' },
                { from: 'Liam', to: 'Xena' },
                { from: 'Mona', to: 'Yara' },
                { from: 'Nina', to: 'Zane' }
            ],
            nodes: [
                { id: 'Alice' },
                { id: 'Bob' },
                { id: 'Charlie' },
                { id: 'David' },
                { id: 'Eve' },
                { id: 'Frank' },
                { id: 'Grace' },
                { id: 'Hannah' },
                { id: 'Ivy' },
                { id: 'Jack' },
                { id: 'Kathy' },
                { id: 'Liam' },
                { id: 'Mona' },
                { id: 'Nina' },
                { id: 'Oscar' },
                { id: 'Paul' },
                { id: 'Quinn' },
                { id: 'Rachel' },
                { id: 'Steve' },
                { id: 'Tina' },
                { id: 'Uma' },
                { id: 'Vera' },
                { id: 'Will' },
                { id: 'Xena' },
                { id: 'Yara' },
                { id: 'Zane' }
            ]
        }]
    },

    // ===== Row 5: Distribution (histogram + boxplots) =====
    chart13: { // Histogram
        custom: { autoDesc: chart13desc },
        chart: { type: 'histogram' }, // histogram-like with column
        title: { text: 'Yearly rainfall' },
        xAxis: {
            categories: [
                'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
            ],
            crosshair: true
        },
        yAxis: { min: 0, title: { text: '' } },
        tooltip: {
            headerFormat: '<span style="font-size:10px">' +
                '{point.key}</span><table>',
            pointFormat: '<tr><td style="color:{series.color};' +
                'padding:0">{series.name}: </td>' +
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
    chart14: { // Boxplot
        custom: { autoDesc: chart14desc },
        chart: {
            type: 'boxplot'
        },

        title: {
            text: 'Highcharts Box Plot Example'
        },

        legend: {
            enabled: false
        },

        xAxis: {
            categories: ['1', '2', '3', '4', '5'],
            title: {
                text: 'Experiment No.'
            }
        },

        yAxis: {
            title: {
                text: 'Observations'
            },
            plotLines: [{
                value: 932,
                color: 'red',
                width: 1,
                label: {
                    text: 'Theoretical mean: 932',
                    align: 'center',
                    style: {
                        color: 'gray'
                    }
                }
            }]
        },

        series: [{
            name: 'Observations',
            data: [
                [760, 801, 848, 895, 965],
                [733, 853, 939, 980, 1080],
                [714, 762, 817, 870, 918],
                [724, 802, 806, 871, 950],
                [834, 836, 864, 882, 910]
            ],
            tooltip: {
                headerFormat: '<em>Experiment No {point.key}</em><br/>'
            },
            color: Highcharts.defaultOptions.colors[1]
        }, {
            name: 'Outliers',
            color: Highcharts.defaultOptions.colors[1],
            type: 'scatter',
            data: [ // x, y positions where 0 is the first category
                [0, 644],
                [4, 718],
                [4, 951],
                [4, 969]
            ],
            marker: {
                fillColor: 'white',
                lineWidth: 1,
                lineColor: Highcharts.defaultOptions.colors[1]
            },
            tooltip: {
                pointFormat: 'Observation: {point.y}'
            }
        }]
    },
    chart15: { // Bell curve
        custom: { autoDesc: chart15desc },
        chart: {
            events: {
                render: function () {
                    const chart = this;
                    chart.decoratedBellcurveSeries =
                        chart.decoratedBellcurveSeries || new WeakSet();

                    const bellSeries = chart.series.filter(s =>
                        s.type === 'bellcurve'
                    );
                    bellSeries.forEach(series => {
                        if (chart.decoratedBellcurveSeries.has(series)) {
                            return;
                        }

                        chart.decoratedBellcurveSeries.add(series);

                        const pointsInInterval =
                            series.options.pointsInInterval || 25;
                        const labels = ['3σ', '2σ', 'σ', 'μ', 'σ', '2σ', '3σ'];
                        const opacities = [0.1, 0.2, 0.6, 1, 1, 0.6, 0.2, 0.1];

                        // Sample points at each sigma interval
                        const keyPoints = series.points.filter(
                            (p, i) => i % pointsInInterval === 0
                        );

                        // Build zones for shading
                        const zones = keyPoints.map((p, i) => ({
                            value: p.x,
                            fillColor: `rgba(44, 175, 254, ${
                                opacities[i] || 0
                            })`
                        }));

                        series.update({
                            zoneAxis: 'x',
                            zones
                        }, false);

                        // Add labels safely
                        keyPoints.forEach((p, i) => {
                            if (p && p.update && labels[i]) {
                                try {
                                    p.update({
                                        color: 'black',
                                        dataLabels: {
                                            enabled: true,
                                            format: labels[i],
                                            overflow: 'none',
                                            crop: false,
                                            y: -2,
                                            style: { fontSize: '13px' }
                                        }
                                    }, false);
                                } catch {
                                    // Silently ignore point update errors
                                }
                            }
                        });

                        chart.redraw(false);
                    });
                }
            }
        },

        title: {
            text: 'Bell curve'
        },

        xAxis: [{
            title: { text: 'Data' },
            alignTicks: false
        }, {
            title: { text: 'Bell curve' },
            alignTicks: false,
            opposite: true
        }],

        yAxis: [{
            title: { text: 'Data' }
        }, {
            title: { text: 'Bell curve' },
            opposite: true
        }],

        series: [{
            id: 'bell',
            name: 'Bell curve',
            type: 'bellcurve',
            xAxis: 1,
            yAxis: 1,
            baseSeries: 'data',
            zIndex: -1
        }, {
            id: 'data',
            name: 'Data',
            type: 'scatter',
            marker: { radius: 1.5 },
            data: [
                3.5, 3, 3.2, 3.1, 3.6, 3.9, 3.4, 3.4, 2.9, 3.1, 3.7, 3.4, 3, 3,
                4, 4.4, 3.9, 3.5, 3.8, 3.8, 3.4, 3.7, 3.6, 3.3, 3.4, 3, 3.4,
                3.5, 3.4, 3.2, 3.1, 3.4, 4.1, 4.2, 3.1, 3.2, 3.5, 3.6, 3, 3.4,
                3.5, 2.3, 3.2, 3.5, 3.8, 3, 3.8, 3.2, 3.7, 3.3, 3.2, 3.2, 3.1,
                2.3, 2.8, 2.8, 3.3, 2.4, 2.9, 2.7, 2, 3, 2.2, 2.9, 2.9, 3.1, 3,
                2.7, 2.2, 2.5, 3.2, 2.8, 2.5, 2.8, 2.9, 3, 2.8, 3, 2.9, 2.6,
                2.4, 2.4, 2.7, 2.7, 3, 3.4, 3.1, 2.3, 3, 2.5, 2.6, 3, 2.6, 2.3,
                2.7, 3, 2.9, 2.9, 2.5, 2.8, 3.3, 2.7, 3, 2.9, 3, 3, 2.5, 2.9,
                2.5, 3.6, 3.2, 2.7, 3, 2.5, 2.8, 3.2, 3, 3.8, 2.6, 2.2, 3.2,
                2.8, 2.8, 2.7, 3.3, 3.2, 2.8, 3, 2.8, 3, 2.8, 3.8, 2.8, 2.8,
                2.6, 3, 3.4, 3.1, 3, 3.1, 3.1, 3.1, 2.7, 3.2, 3.3, 3, 2.5, 3,
                3.4, 3
            ]
        }]
    },

    // ===== Row 6: Grid (heat/tiles) =====
    chart16: { // Heatmap
        custom: {
            autoDesc: chart16desc
        },
        chart: {
            type: 'heatmap',
            marginTop: 40,
            marginBottom: 80,
            plotBorderWidth: 1
        },
        title: {
            text: 'Sales per employee per weekday',
            style: { fontSize: '1em' }
        },
        xAxis: {
            categories: [
                'Alexander', 'Marie', 'Maximilian', 'Sophia', 'Lukas',
                'Maria', 'Leon', 'Anna', 'Tim', 'Laura'
            ]
        },
        yAxis: {
            categories: [
                'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
            ],
            title: null,
            reversed: true
        },
        colorAxis: {
            min: 0,
            minColor: 'var(--highcharts-background-color, #FFFFFF)',
            maxColor: Highcharts.getOptions().colors[0]
        },
        legend: {
            align: 'right',
            layout: 'vertical',
            margin: 0,
            verticalAlign: 'top',
            y: 25,
            symbolHeight: 280
        },
        tooltip: {
            format:
              '<b>{series.xAxis.categories.(point.x)}</b> sold<br>' +
              '<b>{point.value}</b> items on <br>' +
              '<b>{series.yAxis.categories.(point.y)}</b>'
        },
        series: [{
            name: 'Sales per employee',
            borderWidth: 1,
            data: [
                [0, 0, 10], [0, 1, 19], [0, 2, 8], [0, 3, 24], [0, 4, 67],
                [1, 0, 92], [1, 1, 58], [1, 2, 78], [1, 3, 117], [1, 4, 48],
                [2, 0, 35], [2, 1, 15], [2, 2, 123], [2, 3, 64], [2, 4, 52],
                [3, 0, 72], [3, 1, 132], [3, 2, 114], [3, 3, 19], [3, 4, 16],
                [4, 0, 38], [4, 1, 5], [4, 2, 8], [4, 3, 117], [4, 4, 115],
                [5, 0, 88], [5, 1, 32], [5, 2, 12], [5, 3, 6], [5, 4, 120],
                [6, 0, 13], [6, 1, 44], [6, 2, 88], [6, 3, 98], [6, 4, 96],
                [7, 0, 31], [7, 1, 1], [7, 2, 82], [7, 3, 32], [7, 4, 30],
                [8, 0, 85], [8, 1, 97], [8, 2, 123], [8, 3, 64], [8, 4, 84],
                [9, 0, 47], [9, 1, 114], [9, 2, 31], [9, 3, 48], [9, 4, 91]
            ],
            dataLabels: { enabled: true, color: 'contrast' }
        }],
        responsive: {
            rules: [{
                condition: { maxWidth: 500 },
                chartOptions: {
                    yAxis: { labels: { format: '{substr value 0 1}' } }
                }
            }]
        }
    },
    chart17: { // Big heatmap
        custom: {
            autoDesc: chart17desc
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
                [0, '#3060cf'],
                [0.5, '#fffbbc'],
                [0.9, '#c4463a'],
                [1, '#c4463a']
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
    chart18: { // Tilemap
        custom: {
            autoDesc: chart18desc
        },
        chart: {
            type: 'tilemap',
            inverted: true,
            height: '80%'
        },
        title: {
            text: 'U.S. states by population in 2023'
        },

        subtitle: {
            text: 'Source:<a href="https://en.wikipedia.org/wiki/List_of_U.S._states_and_territories_by_population">Wikipedia</a>'
        },

        xAxis: {
            visible: false
        },

        yAxis: {
            visible: false
        },

        colorAxis: {
            dataClasses: [{
                from: 0,
                to: 1000000,
                color: '#F9EDB3',
                name: '< 1M'
            }, {
                from: 1000000,
                to: 5000000,
                color: '#FFC428',
                name: '1M - 5M'
            }, {
                from: 5000000,
                to: 20000000,
                color: '#FF7987',
                name: '5M - 20M'
            }, {
                from: 20000000,
                color: '#FF2371',
                name: '> 20M'
            }]
        },

        tooltip: {
            headerFormat: '',
            pointFormat: 'The population of <b> {point.name}</b> is <b>' +
            '{point.value}</b>'
        },

        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '{point.hc-a2}',
                    color: '#000000',
                    style: {
                        textOutline: false
                    }
                }
            }
        },

        series: [{
            name: '',
            data: [{
                'hc-a2': 'AL',
                name: 'Alabama',
                region: 'South',
                x: 6,
                y: 7,
                value: 5108468
            }, {
                'hc-a2': 'AK',
                name: 'Alaska',
                region: 'West',
                x: 0,
                y: 0,
                value: 733406
            }, {
                'hc-a2': 'AZ',
                name: 'Arizona',
                region: 'West',
                x: 5,
                y: 3,
                value: 7431344
            }, {
                'hc-a2': 'AR',
                name: 'Arkansas',
                region: 'South',
                x: 5,
                y: 6,
                value: 3067732
            }, {
                'hc-a2': 'CA',
                name: 'California',
                region: 'West',
                x: 5,
                y: 2,
                value: 38965193
            }, {
                'hc-a2': 'CO',
                name: 'Colorado',
                region: 'West',
                x: 4,
                y: 3,
                value: 5877610
            }, {
                'hc-a2': 'CT',
                name: 'Connecticut',
                region: 'Northeast',
                x: 3,
                y: 11,
                value: 3617176
            }, {
                'hc-a2': 'DE',
                name: 'Delaware',
                region: 'South',
                x: 4,
                y: 9,
                value: 1031890
            }, {
                'hc-a2': 'DC',
                name: 'District of Columbia',
                region: 'South',
                x: 4,
                y: 10,
                value: 678972
            }, {
                'hc-a2': 'FL',
                name: 'Florida',
                region: 'South',
                x: 8,
                y: 8,
                value: 22610726
            }, {
                'hc-a2': 'GA',
                name: 'Georgia',
                region: 'South',
                x: 7,
                y: 8,
                value: 11029227
            }, {
                'hc-a2': 'HI',
                name: 'Hawaii',
                region: 'West',
                x: 8,
                y: 0,
                value: 1435138
            }, {
                'hc-a2': 'ID',
                name: 'Idaho',
                region: 'West',
                x: 3,
                y: 2,
                value: 1964726
            }, {
                'hc-a2': 'IL',
                name: 'Illinois',
                region: 'Midwest',
                x: 3,
                y: 6,
                value: 12549689
            }, {
                'hc-a2': 'IN',
                name: 'Indiana',
                region: 'Midwest',
                x: 3,
                y: 7,
                value: 6862199
            }, {
                'hc-a2': 'IA',
                name: 'Iowa',
                region: 'Midwest',
                x: 3,
                y: 5,
                value: 3207004
            }, {
                'hc-a2': 'KS',
                name: 'Kansas',
                region: 'Midwest',
                x: 5,
                y: 5,
                value: 2940546
            }, {
                'hc-a2': 'KY',
                name: 'Kentucky',
                region: 'South',
                x: 4,
                y: 6,
                value: 4526154
            }, {
                'hc-a2': 'LA',
                name: 'Louisiana',
                region: 'South',
                x: 6,
                y: 5,
                value: 4573749
            }, {
                'hc-a2': 'ME',
                name: 'Maine',
                region: 'Northeast',
                x: 0,
                y: 11,
                value: 1395722
            }, {
                'hc-a2': 'MD',
                name: 'Maryland',
                region: 'South',
                x: 4,
                y: 8,
                value: 6180253
            }, {
                'hc-a2': 'MA',
                name: 'Massachusetts',
                region: 'Northeast',
                x: 2,
                y: 10,
                value: 7001399
            }, {
                'hc-a2': 'MI',
                name: 'Michigan',
                region: 'Midwest',
                x: 2,
                y: 7,
                value: 1037261
            }, {
                'hc-a2': 'MN',
                name: 'Minnesota',
                region: 'Midwest',
                x: 2,
                y: 4,
                value: 5737915
            }, {
                'hc-a2': 'MS',
                name: 'Mississippi',
                region: 'South',
                x: 6,
                y: 6,
                value: 2939690
            }, {
                'hc-a2': 'MO',
                name: 'Missouri',
                region: 'Midwest',
                x: 4,
                y: 5,
                value: 6196156
            }, {
                'hc-a2': 'MT',
                name: 'Montana',
                region: 'West',
                x: 2,
                y: 2,
                value: 1132182
            }, {
                'hc-a2': 'NE',
                name: 'Nebraska',
                region: 'Midwest',
                x: 4,
                y: 4,
                value: 1978379
            }, {
                'hc-a2': 'NV',
                name: 'Nevada',
                region: 'West',
                x: 4,
                y: 2,
                value: 3194176
            }, {
                'hc-a2': 'NH',
                name: 'New Hampshire',
                region: 'Northeast',
                x: 1,
                y: 11,
                value: 1402054
            }, {
                'hc-a2': 'NJ',
                name: 'New Jersey',
                region: 'Northeast',
                x: 3,
                y: 10,
                value: 9290841
            }, {
                'hc-a2': 'NM',
                name: 'New Mexico',
                region: 'West',
                x: 6,
                y: 3,
                value: 2114371
            }, {
                'hc-a2': 'NY',
                name: 'New York',
                region: 'Northeast',
                x: 2,
                y: 9,
                value: 19571216
            }, {
                'hc-a2': 'NC',
                name: 'North Carolina',
                region: 'South',
                x: 5,
                y: 9,
                value: 10835491
            }, {
                'hc-a2': 'ND',
                name: 'North Dakota',
                region: 'Midwest',
                x: 2,
                y: 3,
                value: 783926
            }, {
                'hc-a2': 'OH',
                name: 'Ohio',
                region: 'Midwest',
                x: 3,
                y: 8,
                value: 11785935
            }, {
                'hc-a2': 'OK',
                name: 'Oklahoma',
                region: 'South',
                x: 6,
                y: 4,
                value: 4053824
            }, {
                'hc-a2': 'OR',
                name: 'Oregon',
                region: 'West',
                x: 4,
                y: 1,
                value: 4233358
            }, {
                'hc-a2': 'PA',
                name: 'Pennsylvania',
                region: 'Northeast',
                x: 3,
                y: 9,
                value: 12961683
            }, {
                'hc-a2': 'RI',
                name: 'Rhode Island',
                region: 'Northeast',
                x: 2,
                y: 11,
                value: 1095926
            }, {
                'hc-a2': 'SC',
                name: 'South Carolina',
                region: 'South',
                x: 6,
                y: 8,
                value: 5373555
            }, {
                'hc-a2': 'SD',
                name: 'South Dakota',
                region: 'Midwest',
                x: 3,
                y: 4,
                value: 919318
            }, {
                'hc-a2': 'TN',
                name: 'Tennessee',
                region: 'South',
                x: 5,
                y: 7,
                value: 7126489
            }, {
                'hc-a2': 'TX',
                name: 'Texas',
                region: 'South',
                x: 7,
                y: 4,
                value: 30503301
            }, {
                'hc-a2': 'UT',
                name: 'Utah',
                region: 'West',
                x: 5,
                y: 4,
                value: 3417734
            }, {
                'hc-a2': 'VT',
                name: 'Vermont',
                region: 'Northeast',
                x: 1,
                y: 10,
                value: 647464
            }, {
                'hc-a2': 'VA',
                name: 'Virginia',
                region: 'South',
                x: 5,
                y: 8,
                value: 8715698
            }, {
                'hc-a2': 'WA',
                name: 'Washington',
                region: 'West',
                x: 2,
                y: 1,
                value: 7812880
            }, {
                'hc-a2': 'WV',
                name: 'West Virginia',
                region: 'South',
                x: 4,
                y: 7,
                value: 1770071
            }, {
                'hc-a2': 'WI',
                name: 'Wisconsin',
                region: 'Midwest',
                x: 2,
                y: 5,
                value: 5910955
            }, {
                'hc-a2': 'WY',
                name: 'Wyoming',
                region: 'West',
                x: 3,
                y: 3,
                value: 584057
            }]
        }]
    },

    // ===== Row 7: Points (bubble) =====
    chart19: { // Scatter plot
        custom: {
            autoDesc: chart19desc
        },
        colors: [
            'rgba(5,141,199,0.5)',   // Basketball
            'rgba(80,180,50,0.5)',   // Triathlon
            'rgba(237,86,27,0.5)'    // Volleyball
        ],

        chart: {
            type: 'scatter',
            zooming: { type: 'xy' },
            events: {
                load: async function () {
                    const chart = this;

                    // Fetch data (same endpoint as your snippet)
                    const res = await fetch('https://www.highcharts.com/samples/data/olympic2012.json');
                    const rows = await res.json();

                    // Helper to filter & map by sport
                    const pick = sport =>
                        rows
                            .filter(r => (
                                r.sport === sport && r.weight > 0 &&
                                r.height > 0
                            ))
                            .map(r => [r.height, r.weight]);

                    // Update series by id
                    const map = {
                        basketball: pick('basketball'),
                        triathlon: pick('triathlon'),
                        volleyball: pick('volleyball')
                    };

                    ['basketball', 'triathlon', 'volleyball'].forEach(id => {
                        const s = chart.get(id);
                        if (s) {
                            s.setData(map[id], false);
                        }
                    });

                    chart.redraw();
                }
            }
        },

        title: {
            text: 'Olympics athletes by height and weight'
        },

        subtitle: {
            text:
      'Source: <a href="https://www.theguardian.com/sport/datablog/2012/aug/07/olympics-2012-athletes-age-weight-height">The Guardian</a>'
        },

        xAxis: {
            title: { text: 'Height' },
            labels: { format: '{value} m' },
            startOnTick: true,
            endOnTick: true,
            showLastLabel: true
        },

        yAxis: {
            title: { text: 'Weight' },
            labels: { format: '{value} kg' }
        },

        legend: {
            enabled: true
        },

        tooltip: {
            pointFormat: 'Height: {point.x} m <br/> Weight: {point.y} kg'
        },

        plotOptions: {
            scatter: {
                marker: {
                    radius: 2.5,
                    symbol: 'circle',
                    states: {
                        hover: {
                            enabled: true,
                            lineColor: 'rgb(100,100,100)'
                        }
                    }
                },
                states: {
                    hover: {
                        marker: { enabled: false }
                    }
                },
                jitter: { x: 0.005 }
            }
        },

        series: [
            {
                id: 'basketball',
                name: 'Basketball',
                marker: { symbol: 'circle' },
                data: [] // filled on load
            },
            {
                id: 'triathlon',
                name: 'Triathlon',
                marker: { symbol: 'triangle' },
                data: [] // filled on load
            },
            {
                id: 'volleyball',
                name: 'Volleyball',
                marker: { symbol: 'square' },
                data: [] // filled on load
            }
        ]
    },
    chart20: { // Bubble
        custom: {
            autoDesc: chart20desc
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
                { x: 95, y: 95, z: 13.8, name: 'BE', country: 'Belgium' },
                { x: 86.5, y: 102.9, z: 14.7, name: 'DE', country: 'Germany' },
                { x: 80.8, y: 91.5, z: 15.8, name: 'FI', country: 'Finland' },
                {
                    x: 80.4,
                    y: 102.5,
                    z: 12,
                    name: 'NL',
                    country: 'Netherlands'
                },
                { x: 80.3, y: 86.1, z: 11.8, name: 'SE', country: 'Sweden' },
                { x: 78.4, y: 70.1, z: 16.6, name: 'ES', country: 'Spain' },
                { x: 74.2, y: 68.5, z: 14.5, name: 'FR', country: 'France' },
                { x: 73.5, y: 83.1, z: 10, name: 'NO', country: 'Norway' },
                {
                    x: 71,
                    y: 93.2,
                    z: 24.7,
                    name: 'UK',
                    country: 'United Kingdom'
                },
                { x: 69.2, y: 57.6, z: 10.4, name: 'IT', country: 'Italy' },
                { x: 68.6, y: 20, z: 16, name: 'RU', country: 'Russia' },
                {
                    x: 65.5,
                    y: 126.4,
                    z: 35.3,
                    name:
                    'US',
                    country: 'United States'
                },
                { x: 65.4, y: 50.8, z: 28.5, name: 'HU', country: 'Hungary' },
                { x: 63.4, y: 51.8, z: 15.4, name: 'PT', country: 'Portugal' },
                { x: 64, y: 82.9, z: 31.3, name: 'NZ', country: 'New Zealand' }
            ],
            colorByPoint: true
        }]
    },
    chart21: { // Packed bubble
        custom: {
            autoDesc: chart21desc
        },
        chart: {
            type: 'packedbubble',
            height: '100%'
        },
        title: {
            text: 'Team Dashboard'
        },
        subtitle: {
            text: 'Currently planned work for team'
        },
        tooltip: {
            pointFormat: '<b>{point.name}:</b> {point.value}'
        },
        plotOptions: {
            packedbubble: {
                minSize: '15%',
                maxSize: '50%',
                layoutAlgorithm: {
                    maxSpeed: 2,
                    initialPositionRadius: 1,
                    splitSeries: true,
                    parentNodeLimit: true,
                    dragBetweenSeries: true,
                    friction: -0.9,
                    parentNodeOptions: {
                        maxSpeed: 1,
                        bubblePadding: 20,
                        initialPositionRadius: 120
                    }
                },
                dataLabels: {
                    enabled: true,
                    format: '{point.shortName}',
                    parentNodeFormat: '{point.series.name}'
                }
            }
        },
        series: [{
            name: 'Backlog',
            color: 'rgba(0, 40, 130, 0.8)',
            data: [{
                name: 'Test web page performance',
                shortName: 'Test page',
                value: 5
            }, {
                name: 'Bike trip',
                shortName: 'trip',
                value: 1
            },
            {
                name: 'Code-review meeting',
                shortName: 'CR',
                value: 4
            },
            {
                name: 'Allow user to change nickname',
                shortName: 'Nickname',
                value: 2
            }]
        }, {
            name: 'To Do',
            color: 'rgba(200, 100, 100, 0.8)',
            data: [{
                name: 'Create newsletter template',
                shortName: 'Newsletter',
                value: 2
            }, {
                name: 'Produce financial raport for Q2',
                shortName: 'Report',
                value: 10
            }, {
                name: 'Meeting with sales team',
                shortName: 'Meeting',
                value: 10
            }]
        }, {
            name: 'In Progress',
            color: 'rgba(0,100,100, 0.8)',
            data: [{
                name: 'Develop an android App',
                shortName: 'Development',
                value: 9
            }, {
                name: 'Document the API',
                shortName: 'API',
                value: 7
            }]
        }, {
            name: 'To Verify',
            color: 'rgba(200, 100, 200, 0.8)',
            data: [{
                name: 'Develop an IOS App',
                shortName: 'Development',
                value: 9
            }, {
                name: 'Change default login page',
                shortName: 'webpage',
                value: 5
            }]
        }, {
            name: 'Done',
            color: 'rgba(70,220,50,0.8)',
            data: [{
                name: 'Strategy meeting with Management',
                shortName: 'Meeting',
                value: 5
            }, {
                name: 'Kanban Packed Bubble migration',
                shortName: 'Migration',
                value: 3
            }]
        }]
    },

    // ===== Row 8: Hierarchy (treemap) =====
    chart22: { // Treemap
        custom: {
            autoDesc: chart22desc
        },
        chart: {
            type: 'treemap'
        },
        series: [{
            type: 'treemap',
            name: 'Norge',
            allowTraversingTree: true,
            alternateStartingDirection: true,
            dataLabels: {
                format: '{point.name}',
                style: {
                    textOutline: 'none'
                }
            },
            borderRadius: 3,
            nodeSizeBy: 'leaf',
            levels: [{
                level: 1,
                layoutAlgorithm: 'sliceAndDice',
                groupPadding: 3,
                dataLabels: {
                    headers: true,
                    enabled: true,
                    style: {
                        fontSize: '0.6em',
                        fontWeight: 'normal',
                        textTransform: 'uppercase',
                        color: 'var(--highcharts-neutral-color-100, #000)'
                    }
                },
                borderRadius: 3,
                borderWidth: 1,
                colorByPoint: true

            }, {
                level: 2,
                dataLabels: {
                    enabled: true,
                    inside: false
                }
            }],
            data: [{
                id: 'A',
                name: 'Nord-Norge',
                color: '#50FFB1'
            }, {
                id: 'B',
                name: 'Trøndelag',
                color: '#F5FBEF'
            }, {
                id: 'C',
                name: 'Vestlandet',
                color: '#A09FA8'
            }, {
                id: 'D',
                name: 'Østlandet',
                color: '#E7ECEF'
            }, {
                id: 'E',
                name: 'Sørlandet',
                color: '#A9B4C2'
            }, {
                name: 'Troms og Finnmark',
                parent: 'A',
                value: 70923
            }, {
                name: 'Nordland',
                parent: 'A',
                value: 35759
            }, {
                name: 'Trøndelag',
                parent: 'B',
                value: 39494
            }, {
                name: 'Møre og Romsdal',
                parent: 'C',
                value: 13840
            }, {
                name: 'Vestland',
                parent: 'C',
                value: 31969
            }, {
                name: 'Rogaland',
                parent: 'C',
                value: 8576
            }, {
                name: 'Viken',
                parent: 'D',
                value: 22768
            }, {
                name: 'Innlandet',
                parent: 'D',
                value: 49391
            },
            {
                name: 'Oslo',
                parent: 'D',
                value: 454
            },
            {
                name: 'Vestfold og Telemark',
                parent: 'D',
                value: 15925
            },
            {
                name: 'Agder',
                parent: 'E',
                value: 14981
            }]
        }],
        title: {
            text: 'Norwegian regions and counties by area',
            align: 'left'
        },
        subtitle: {
            text:
            'Source: <a href="https://snl.no/Norge" target="_blank">SNL</a>',
            align: 'left'
        },
        tooltip: {
            useHTML: true,
            pointFormat: 'The area of <b>{point.name}</b> is \
            <b>{point.value} km<sup>2</sup></b>'
        }
    },
    chart23: { // Sunburst
        custom: {
            autoDesc: chart23desc
        },
        chart: {
            height: '100%',
            type: 'sunburst'
        },

        // Let the center circle be white transparent
        colors: ['#ffffff01'].concat(Highcharts.getOptions().colors),

        title: {
            text: 'World population 2023'
        },

        subtitle: {
            text: 'Source <a href="https://en.wikipedia.org/wiki/List_of_countries_by_population_(United_Nations)">Wikipedia</a>'
        },

        series: [{
            type: 'sunburst',
            name: 'Root',
            allowTraversingTree: true,
            borderRadius: 3,
            cursor: 'pointer',
            dataLabels: {
                format: '{point.name}',
                filter: {
                    property: 'innerArcLength',
                    operator: '>',
                    value: 16
                }
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
                colorVariation: {
                    key: 'brightness',
                    to: -1
                }
            }, {
                level: 4,
                colorVariation: {
                    key: 'brightness',
                    to: 1
                }
            }],
            data: [{
                id: '0.0',
                parent: '',
                name: 'The World'
            }, {
                id: '1.3',
                parent: '0.0',
                name: 'Asia'
            }, {
                id: '1.1',
                parent: '0.0',
                name: 'Africa'
            }, {
                id: '1.2',
                parent: '0.0',
                name: 'America'
            }, {
                id: '1.4',
                parent: '0.0',
                name: 'Europe'
            }, {
                id: '1.5',
                parent: '0.0',
                name: 'Oceanic'
            },

            /* Africa */
            {
                id: '2.1',
                parent: '1.1',
                name: 'Eastern Africa'
            },

            {
                id: '3.1',
                parent: '2.1',
                name: 'Ethiopia',
                value: 126527060
            }, {
                id: '3.2',
                parent: '2.1',
                name: 'Tanzania',
                value: 67438106
            }, {
                id: '3.3',
                parent: '2.1',
                name: 'Kenya',
                value: 55100587
            }, {
                id: '3.4',
                parent: '2.1',
                name: 'Uganda',
                value: 48582334
            }, {
                id: '3.5',
                parent: '2.1',
                name: 'Mozambique',
                value: 33897354
            }, {
                id: '3.6',
                parent: '2.1',
                name: 'Madagascar',
                value: 30325732
            }, {
                id: '3.7',
                parent: '2.1',
                name: 'Malawi',
                value: 20931751
            }, {
                id: '3.8',
                parent: '2.1',
                name: 'Zambia',
                value: 20569738
            }, {
                id: '3.9',
                parent: '2.1',
                name: 'Somalia',
                value: 18143379
            }, {
                id: '3.10',
                parent: '2.1',
                name: 'Zimbabwe',
                value: 16665409
            }, {
                id: '3.11',
                parent: '2.1',
                name: 'Rwanda',
                value: 14094683
            }, {
                id: '3.12',
                parent: '2.1',
                name: 'Burundi',
                value: 13238559
            }, {
                id: '3.13',
                parent: '2.1',
                name: 'South Sudan',
                value: 11088796
            }, {
                id: '3.14',
                parent: '2.1',
                name: 'Eritrea',
                value: 3748902
            }, {
                id: '3.15',
                parent: '2.1',
                name: 'Mauritius',
                value: 1300557
            }, {
                id: '3.16',
                parent: '2.1',
                name: 'Djibouti',
                value: 1136455
            }, {
                id: '3.17',
                parent: '2.1',
                name: 'Réunion',
                value: 981796
            }, {
                id: '3.18',
                parent: '2.1',
                name: 'Comoros',
                value: 852075
            }, {
                id: '3.19',
                parent: '2.1',
                name: 'Mayotte',
                value: 335995
            }, {
                id: '3.20',
                parent: '2.1',
                name: 'Seychelles',
                value: 107660
            },

            {
                id: '2.5',
                parent: '1.1',
                name: 'Western Africa'
            },

            {
                id: '3.42',
                parent: '2.5',
                name: 'Nigeria',
                value: 223804632
            }, {
                id: '3.43',
                parent: '2.5',
                name: 'Ghana',
                value: 34121985
            }, {
                id: '3.44',
                parent: '2.5',
                name: 'Ivory Coast',
                value: 28873034
            }, {
                id: '3.45',
                parent: '2.5',
                name: 'Niger',
                value: 27202843
            }, {
                id: '3.46',
                parent: '2.5',
                name: 'Mali',
                value: 23293699
            }, {
                id: '3.47',
                parent: '2.5',
                name: 'Burkina Faso',
                value: 23251485
            }, {
                id: '3.48',
                parent: '2.5',
                name: 'Senegal',
                value: 17763163
            }, {
                id: '3.49',
                parent: '2.5',
                name: 'Guinea',
                value: 14190612
            }, {
                id: '3.50',
                parent: '2.5',
                name: 'Benin',
                value: 13712828
            }, {
                id: '3.51',
                parent: '2.5',
                name: 'Togo',
                value: 9053799
            }, {
                id: '3.52',
                parent: '2.5',
                name: 'Sierra Leone',
                value: 8791092
            }, {
                id: '3.53',
                parent: '2.5',
                name: 'Liberia',
                value: 5418377
            }, {
                id: '3.54',
                parent: '2.5',
                name: 'Mauritania',
                value: 4862989
            }, {
                id: '3.55',
                parent: '2.5',
                name: 'Gambia',
                value: 2773168
            }, {
                id: '3.56',
                parent: '2.5',
                name: 'Guinea-Bissau',
                value: 2150842
            }, {
                id: '3.57',
                parent: '2.5',
                name: 'Cape Verde',
                value: 598682
            }, {
                id: '3.58',
                parent: '2.5',
                name: 'Saint Helena',
                value: 5314
            },

            {
                id: '2.3',
                parent: '1.1',
                name: 'North Africa'
            },

            {
                id: '3.30',
                parent: '2.3',
                name: 'Egypt',
                value: 112716599
            }, {
                id: '3.31',
                parent: '2.3',
                name: 'Sudan',
                value: 48109006
            }, {
                id: '3.32',
                parent: '2.3',
                name: 'Algeria',
                value: 45606481
            }, {
                id: '3.33',
                parent: '2.3',
                name: 'Morocco',
                value: 37840044
            }, {
                id: '3.34',
                parent: '2.3',
                name: 'Tunisia',
                value: 12458223
            }, {
                id: '3.35',
                parent: '2.3',
                name: 'Libya',
                value: 6888388
            }, {
                id: '3.36',
                parent: '2.3',
                name: 'Western Sahara',
                value: 587259
            },

            {
                id: '2.2',
                parent: '1.1',
                name: 'Central Africa'
            },

            {
                id: '3.21',
                parent: '2.2',
                name: 'DR Congo',
                value: 102262809
            }, {
                id: '3.22',
                parent: '2.2',
                name: 'Angola',
                value: 36684203
            }, {
                id: '3.23',
                parent: '2.2',
                name: 'Cameroon',
                value: 28647293
            }, {
                id: '3.24',
                parent: '2.2',
                name: 'Chad',
                value: 18278568
            }, {
                id: '3.25',
                parent: '2.2',
                name: 'Congo',
                value: 6106869
            }, {
                id: '3.26',
                parent: '2.2',
                name: 'Central African Republic',
                value: 5742316
            }, {
                id: '3.27',
                parent: '2.2',
                name: 'Gabon',
                value: 2436567
            }, {
                id: '3.28',
                parent: '2.2',
                name: 'Equatorial Guinea',
                value: 1714672
            }, {
                id: '3.29',
                parent: '2.2',
                name: 'São Tomé and Príncipe',
                value: 231856
            },

            {
                id: '2.4',
                parent: '1.1',
                name: 'South America'
            },

            {
                id: '3.37',
                parent: '2.4',
                name: 'South Africa',
                value: 60414495
            }, {
                id: '3.38',
                parent: '2.4',
                name: 'Botswana',
                value: 2675353
            }, {
                id: '3.39',
                parent: '2.4',
                name: 'Namibia',
                value: 2604172
            }, {
                id: '3.40',
                parent: '2.4',
                name: 'Lesotho',
                value: 2330318
            }, {
                id: '3.41',
                parent: '2.4',
                name: 'Eswatini',
                value: 1210822
            },

            /** *********/

            /* America */
            {
                id: '2.9',
                parent: '1.2',
                name: 'South America'
            },

            {
                id: '3.100',
                parent: '2.9',
                name: 'Brazil',
                value: 216422446
            }, {
                id: '3.101',
                parent: '2.9',
                name: 'Colombia',
                value: 52085168
            }, {
                id: '3.102',
                parent: '2.9',
                name: 'Argentina',
                value: 45773884
            }, {
                id: '3.103',
                parent: '2.9',
                name: 'Peru',
                value: 34352719
            }, {
                id: '3.104',
                parent: '2.9',
                name: 'Venezuela',
                value: 28838499
            }, {
                id: '3.105',
                parent: '2.9',
                name: 'Chile',
                value: 19629590
            }, {
                id: '3.106',
                parent: '2.9',
                name: 'Ecuador',
                value: 18190484
            }, {
                id: '3.107',
                parent: '2.9',
                name: 'Bolivia',
                value: 12388571
            }, {
                id: '3.108',
                parent: '2.9',
                name: 'Paraguay',
                value: 6861524
            }, {
                id: '3.109',
                parent: '2.9',
                name: 'Uruguay',
                value: 3423109
            }, {
                id: '3.110',
                parent: '2.9',
                name: 'Guyana',
                value: 813834
            }, {
                id: '3.111',
                parent: '2.9',
                name: 'Suriname',
                value: 623237
            }, {
                id: '3.112',
                parent: '2.9',
                name: 'French Guiana',
                value: 312155
            }, {
                id: '3.113',
                parent: '2.9',
                name: 'Falkland Islands',
                value: 3791
            },

            {
                id: '2.8',
                parent: '1.2',
                name: 'Northern America'
            },

            {
                id: '3.95',
                parent: '2.8',
                name: 'United States',
                value: 339996564
            }, {
                id: '3.96',
                parent: '2.8',
                name: 'Canada',
                value: 38781292
            }, {
                id: '3.97',
                parent: '2.8',
                name: 'Bermuda',
                value: 64069
            }, {
                id: '3.98',
                parent: '2.8',
                name: 'Greenland',
                value: 56643
            }, {
                id: '3.99',
                parent: '2.8',
                name: 'Saint Pierre and Miquelon',
                value: 5840
            },

            {
                id: '2.7',
                parent: '1.2',
                name: 'Central America'
            },

            {
                id: '3.87',
                parent: '2.7',
                name: 'Mexico',
                value: 128455567
            }, {
                id: '3.88',
                parent: '2.7',
                name: 'Guatemala',
                value: 18092026
            }, {
                id: '3.89',
                parent: '2.7',
                name: 'Honduras',
                value: 10593798
            }, {
                id: '3.90',
                parent: '2.7',
                name: 'Nicaragua',
                value: 7046311
            }, {
                id: '3.91',
                parent: '2.7',
                name: 'El Salvador',
                value: 6364943
            }, {
                id: '3.92',
                parent: '2.7',
                name: 'Costa Rica',
                value: 5212173
            }, {
                id: '3.93',
                parent: '2.7',
                name: 'Panama',
                value: 4468087
            }, {
                id: '3.94',
                parent: '2.7',
                name: 'Belize',
                value: 410825
            },

            {
                id: '2.6',
                parent: '1.2',
                name: 'Caribbean'
            },

            {
                id: '3.59',
                parent: '2.6',
                name: 'Haiti',
                value: 11724764
            }, {
                id: '3.60',
                parent: '2.6',
                name: 'Dominican Republic',
                value: 11332973
            }, {
                id: '3.61',
                parent: '2.6',
                name: 'Cuba',
                value: 11194449
            }, {
                id: '3.62',
                parent: '2.6',
                name: 'Puerto Rico',
                value: 3260314
            }, {
                id: '3.63',
                parent: '2.6',
                name: 'Jamaica',
                value: 2825544
            }, {
                id: '3.64',
                parent: '2.6',
                name: 'Trinidad and Tobago',
                value: 1534937
            }, {
                id: '3.65',
                parent: '2.6',
                name: 'Bahamas',
                value: 412624
            }, {
                id: '3.66',
                parent: '2.6',
                name: 'Guadeloupe',
                value: 395839
            }, {
                id: '3.67',
                parent: '2.6',
                name: 'Martinique',
                value: 366981
            }, {
                id: '3.68',
                parent: '2.6',
                name: 'Barbados',
                value: 281996
            }, {
                id: '3.69',
                parent: '2.6',
                name: 'Curaçao ',
                value: 192077
            }, {
                id: '3.70',
                parent: '2.6',
                name: 'Saint Lucia',
                value: 180251
            }, {
                id: '3.71',
                parent: '2.6',
                name: 'Grenada',
                value: 126184
            }, {
                id: '3.72',
                parent: '2.6',
                name: 'Aruba',
                value: 106277
            }, {
                id: '3.73',
                parent: '2.6',
                name: 'Saint Vincent and the Grenadines',
                value: 103699
            }, {
                id: '3.74',
                parent: '2.6',
                name: 'U.S. Virgin Islands',
                value: 98750
            }, {
                id: '3.75',
                parent: '2.6',
                name: 'Antigua and Barbuda',
                value: 94298
            }, {
                id: '3.76',
                parent: '2.6',
                name: 'Dominica',
                value: 73040
            }, {
                id: '3.77',
                parent: '2.6',
                name: 'Cayman Islands ',
                value: 69310
            }, {
                id: '3.78',
                parent: '2.6',
                name: 'Saint Kitts and Nevis',
                value: 47755
            }, {
                id: '3.79',
                parent: '2.6',
                name: 'Turks and Caicos Islands',
                value: 46062
            }, {
                id: '3.80',
                parent: '2.6',
                name: 'Sint Maarten',
                value: 44222
            }, {
                id: '3.81',
                parent: '2.6',
                name: 'Saint Martin',
                value: 32077
            }, {
                id: '3.82',
                parent: '2.6',
                name: 'British Virgin Islands',
                value: 31538
            }, {
                id: '3.83',
                parent: '2.6',
                name: 'Caribbean Netherlands',
                value: 27148
            }, {
                id: '3.84',
                parent: '2.6',
                name: 'Anguilla',
                value: 15900
            }, {
                id: '3.85',
                parent: '2.6',
                name: 'Saint Barthélemy',
                value: 10994
            }, {
                id: '3.86',
                parent: '2.6',
                name: 'Montserrat',
                value: 4387
            },
            /** *********/

            /* Asia */
            {
                id: '2.13',
                parent: '1.3',
                name: 'Southern Asia'
            },

            {
                id: '3.138',
                parent: '2.13',
                name: 'India',
                value: 1428627663
            }, {
                id: '3.139',
                parent: '2.13',
                name: 'Pakistan',
                value: 240485658
            }, {
                id: '3.140',
                parent: '2.13',
                name: 'Bangladesh',
                value: 172954319
            }, {
                id: '3.141',
                parent: '2.13',
                name: 'Iran',
                value: 89172767
            }, {
                id: '3.142',
                parent: '2.13',
                name: 'Afghanistan',
                value: 42239854
            }, {
                id: '3.143',
                parent: '2.13',
                name: 'Nepal',
                value: 30896590
            }, {
                id: '3.144',
                parent: '2.13',
                name: 'Sri Lanka',
                value: 21893579
            }, {
                id: '3.145',
                parent: '2.13',
                name: 'Bhutan',
                value: 787425
            }, {
                id: '3.146',
                parent: '2.13',
                name: 'Maldives',
                value: 523787
            },

            {
                id: '2.11',
                parent: '1.3',
                name: 'Eastern Asia'
            },

            {
                id: '3.119',
                parent: '2.11',
                name: 'China',
                value: 1425671352
            }, {
                id: '3.120',
                parent: '2.11',
                name: 'Japan',
                value: 123294513
            }, {
                id: '3.121',
                parent: '2.11',
                name: 'South Korea',
                value: 51784059
            }, {
                id: '3.122',
                parent: '2.11',
                name: 'North Korea',
                value: 26160822
            }, {
                id: '3.123',
                parent: '2.11',
                name: 'Taiwan',
                value: 23923277
            }, {
                id: '3.124',
                parent: '2.11',
                name: 'Hong Kong',
                value: 7491609
            }, {
                id: '3.125',
                parent: '2.11',
                name: 'Mongolia',
                value: 3447157
            }, {
                id: '3.126',
                parent: '2.11',
                name: 'Macao',
                value: 704150
            },

            {
                id: '2.12',
                parent: '1.3',
                name: 'South-Eastern Asia'
            },

            {
                id: '3.127',
                parent: '2.12',
                name: 'Indonesia',
                value: 277534123
            }, {
                id: '3.128',
                parent: '2.12',
                name: 'Philippines',
                value: 117337368
            }, {
                id: '3.129',
                parent: '2.12',
                name: 'Vietnam',
                value: 98858950
            }, {
                id: '3.130',
                parent: '2.12',
                name: 'Thailand',
                value: 71801279
            }, {
                id: '3.131',
                parent: '2.12',
                name: 'Myanmar',
                value: 54577997
            }, {
                id: '3.132',
                parent: '2.12',
                name: 'Malaysia',
                value: 34308525
            }, {
                id: '3.133',
                parent: '2.12',
                name: 'Cambodia',
                value: 16944826
            }, {
                id: '3.134',
                parent: '2.12',
                name: 'Laos',
                value: 7633779
            }, {
                id: '3.135',
                parent: '2.12',
                name: 'Singapore',
                value: 6014723
            }, {
                id: '3.136',
                parent: '2.12',
                name: 'East Timor',
                value: 1360596
            }, {
                id: '3.137',
                parent: '2.12',
                name: 'Brunei',
                value: 452524
            },

            {
                id: '2.14',
                parent: '1.3',
                name: 'Western Asia'
            },

            {
                id: '3.147',
                parent: '2.14',
                name: 'Iraq',
                value: 45504560
            }, {
                id: '3.148',
                parent: '2.14',
                name: 'Turkey',
                value: 85816199
            }, {
                id: '3.149',
                parent: '2.14',
                name: 'Saudi Arabia',
                value: 36947025
            }, {
                id: '3.150',
                parent: '2.14',
                name: 'Yemen',
                value: 34449825
            }, {
                id: '3.151',
                parent: '2.14',
                name: 'Syria',
                value: 23227014
            }, {
                id: '3.152',
                parent: '2.14',
                name: 'Jordan',
                value: 11337053
            }, {
                id: '3.153',
                parent: '2.14',
                name: 'Azerbaijan',
                value: 10412652
            }, {
                id: '3.154',
                parent: '2.14',
                name: 'United Arab Emirates',
                value: 9516871
            }, {
                id: '3.155',
                parent: '2.14',
                name: 'Israel',
                value: 9174520
            }, {
                id: '3.156',
                parent: '2.14',
                name: 'Palestine',
                value: 5371230
            }, {
                id: '3.157',
                parent: '2.14',
                name: 'Lebanon',
                value: 5353930
            }, {
                id: '3.158',
                parent: '2.14',
                name: 'Oman',
                value: 4644384
            }, {
                id: '3.159',
                parent: '2.14',
                name: 'Kuwait',
                value: 4310108
            }, {
                id: '3.160',
                parent: '2.14',
                name: 'Georgia',
                value: 3728282
            }, {
                id: '3.161',
                parent: '2.14',
                name: 'Armenia',
                value: 2777971
            }, {
                id: '3.162',
                parent: '2.14',
                name: 'Qatar',
                value: 2716391
            }, {
                id: '3.163',
                parent: '2.14',
                name: 'Bahrain',
                value: 1485510
            }, {
                id: '3.164',
                parent: '2.14',
                name: 'Cyprus',
                value: 1260138
            },

            {
                id: '2.10',
                parent: '1.3',
                name: 'Central Asia'
            },

            {
                id: '3.114',
                parent: '2.10',
                name: 'Uzbekistan',
                value: 35163944
            }, {
                id: '3.115',
                parent: '2.10',
                name: 'Kazakhstan',
                value: 19606634
            }, {
                id: '3.116',
                parent: '2.10',
                name: 'Tajikistan',
                value: 10143543
            }, {
                id: '3.117',
                parent: '2.10',
                name: 'Kyrgyzstan',
                value: 6735348
            }, {
                id: '3.118',
                parent: '2.10',
                name: 'Turkmenistan',
                value: 6516100
            },
            /** *********/

            /* Europe */
            {
                id: '2.15',
                parent: '1.4',
                name: 'Eastern Europe'
            },

            {
                id: '3.165',
                parent: '2.15',
                name: 'Russia',
                value: 144444359
            }, {
                id: '3.166',
                parent: '2.15',
                name: 'Poland',
                value: 41026068
            }, {
                id: '3.167',
                parent: '2.15',
                name: 'Ukraine',
                value: 36744634
            }, {
                id: '3.168',
                parent: '2.15',
                name: 'Romania',
                value: 19892812
            }, {
                id: '3.169',
                parent: '2.15',
                name: 'Czechia',
                value: 10495295
            }, {
                id: '3.170',
                parent: '2.15',
                name: 'Hungary',
                value: 9604000
            }, {
                id: '3.171',
                parent: '2.15',
                name: 'Belarus',
                value: 9498238
            }, {
                id: '3.172',
                parent: '2.15',
                name: 'Bulgaria',
                value: 6687717
            }, {
                id: '3.173',
                parent: '2.15',
                name: 'Slovakia',
                value: 5795199
            }, {
                id: '3.174',
                parent: '2.15',
                name: 'Moldova',
                value: 3435931
            },

            {
                id: '2.16',
                parent: '1.4',
                name: 'Northern Europe'
            },

            {
                id: '3.175',
                parent: '2.16',
                name: 'United Kingdom',
                value: 67736802
            }, {
                id: '3.176',
                parent: '2.16',
                name: 'Sweden',
                value: 10612086
            }, {
                id: '3.177',
                parent: '2.16',
                name: 'Denmark',
                value: 5910913
            }, {
                id: '3.178',
                parent: '2.16',
                name: 'Finland',
                value: 5545475
            }, {
                id: '3.179',
                parent: '2.16',
                name: 'Norway',
                value: 5474360
            }, {
                id: '3.180',
                parent: '2.16',
                name: 'Ireland',
                value: 5056935
            }, {
                id: '3.181',
                parent: '2.16',
                name: 'Lithuania',
                value: 2718352
            }, {
                id: '3.182',
                parent: '2.16',
                name: 'Latvia',
                value: 1830212
            }, {
                id: '3.183',
                parent: '2.16',
                name: 'Estonia',
                value: 1322766
            }, {
                id: '3.184',
                parent: '2.16',
                name: 'Iceland',
                value: 375319
            }, {
                id: '3.185',
                parent: '2.16',
                name: 'Jersey',
                value: 111803
            }, {
                id: '3.186',
                parent: '2.16',
                name: 'Isle of Man',
                value: 84710
            }, {
                id: '3.187',
                parent: '2.16',
                name: 'Guernsey',
                value: 63544
            }, {
                id: '3.188',
                parent: '2.16',
                name: 'Faroe Islands',
                value: 53270
            },

            {
                id: '2.17',
                parent: '1.4',
                name: 'Southern Europe'
            },

            {
                id: '3.189',
                parent: '2.17',
                name: 'Italy',
                value: 58870763
            }, {
                id: '3.190',
                parent: '2.17',
                name: 'Spain',
                value: 47519628
            }, {
                id: '3.191',
                parent: '2.17',
                name: 'Greece',
                value: 10341277
            }, {
                id: '3.192',
                parent: '2.17',
                name: 'Portugal',
                value: 10247605
            }, {
                id: '3.193',
                parent: '2.17',
                name: 'Serbia',
                value: 7149077
            }, {
                id: '3.194',
                parent: '2.17',
                name: 'Croatia',
                value: 4008617
            }, {
                id: '3.195',
                parent: '2.17',
                name: 'Bosnia and Herzegovina',
                value: 3210848
            }, {
                id: '3.196',
                parent: '2.17',
                name: 'Albania',
                value: 2832439
            }, {
                id: '3.197',
                parent: '2.17',
                name: 'Slovenia',
                value: 2119675
            }, {
                id: '3.198',
                parent: '2.17',
                name: 'North Macedonia',
                value: 2085679
            }, {
                id: '3.199',
                parent: '2.17',
                name: 'Kosovo',
                value: 1663595
            }, {
                id: '3.200',
                parent: '2.17',
                name: 'Montenegro',
                value: 626485
            }, {
                id: '3.201',
                parent: '2.17',
                name: 'Malta',
                value: 535065
            }, {
                id: '3.202',
                parent: '2.17',
                name: 'Andorra',
                value: 80088
            }, {
                id: '3.203',
                parent: '2.17',
                name: 'San Marino',
                value: 33642
            }, {
                id: '3.204',
                parent: '2.17',
                name: 'Gibraltar',
                value: 32688
            }, {
                id: '3.205',
                parent: '2.17',
                name: 'Vatican City',
                value: 518
            },

            {
                id: '2.18',
                parent: '1.4',
                name: 'Western Europe'
            },

            {
                id: '3.206',
                parent: '2.18',
                name: 'Germany',
                value: 83294633
            }, {
                id: '3.207',
                parent: '2.18',
                name: 'France',
                value: 64756584
            }, {
                id: '3.208',
                parent: '2.18',
                name: 'Netherlands',
                value: 17618299
            }, {
                id: '3.209',
                parent: '2.18',
                name: 'Belgium',
                value: 11686140
            }, {
                id: '3.210',
                parent: '2.18',
                name: 'Austria',
                value: 8958961
            }, {
                id: '3.211',
                parent: '2.18',
                name: 'Switzerland',
                value: 8796669
            }, {
                id: '3.212',
                parent: '2.18',
                name: 'Luxembourg',
                value: 654768
            }, {
                id: '3.213',
                parent: '2.18',
                name: 'Liechtenstein',
                value: 39585
            }, {
                id: '3.214',
                parent: '2.18',
                name: 'Monaco',
                value: 36298
            },
            /** *********/

            /* Oceania */
            {
                id: '2.19',
                parent: '1.5',
                name: 'Australia and New Zealand'
            },

            {
                id: '3.215',
                parent: '2.19',
                name: 'Australia',
                value: 26439112
            }, {
                id: '3.216',
                parent: '2.19',
                name: 'New Zealand',
                value: 5228100
            },

            {
                id: '2.20',
                parent: '1.5',
                name: 'Melanesia'
            },

            {
                id: '3.217',
                parent: '2.20',
                name: 'Papua New Guinea',
                value: 10329931
            }, {
                id: '3.218',
                parent: '2.20',
                name: 'Fiji',
                value: 936376
            }, {
                id: '3.219',
                parent: '2.20',
                name: 'Solomon Islands',
                value: 740425
            }, {
                id: '3.220',
                parent: '2.20',
                name: 'Vanuatu',
                value: 334506
            }, {
                id: '3.221',
                parent: '2.20',
                name: 'New Caledonia',
                value: 292991
            },

            {
                id: '2.21',
                parent: '1.5',
                name: 'Micronesia'
            },

            {
                id: '3.222',
                parent: '2.21',
                name: 'Guam',
                value: 172952
            }, {
                id: '3.223',
                parent: '2.21',
                name: 'Kiribati',
                value: 133515
            }, {
                id: '3.224',
                parent: '2.21',
                name: 'Micronesia',
                value: 115224
            }, {
                id: '3.225',
                parent: '2.21',
                name: 'Northern Mariana Islands',
                value: 49796
            }, {
                id: '3.226',
                parent: '2.21',
                name: 'Marshall Islands',
                value: 41996
            }, {
                id: '3.227',
                parent: '2.21',
                name: 'Palau',
                value: 18058
            }, {
                id: '3.228',
                parent: '2.21',
                name: 'Nauru',
                value: 12780
            },

            {
                id: '2.22',
                parent: '1.5',
                name: 'Polynesia'
            },

            {
                id: '3.229',
                parent: '2.22',
                name: 'French Polynesia',
                value: 308872
            }, {
                id: '3.230',
                parent: '2.22',
                name: 'Samoa',
                value: 225681
            }, {
                id: '3.231',
                parent: '2.22',
                name: 'Tonga',
                value: 107773
            }, {
                id: '3.232',
                parent: '2.22',
                name: 'American Samoa',
                value: 43915
            }, {
                id: '3.233',
                parent: '2.22',
                name: 'Cook Islands',
                value: 17044
            }, {
                id: '3.234',
                parent: '2.22',
                name: 'Wallis and Futuna',
                value: 11502
            }, {
                id: '3.235',
                parent: '2.22',
                name: 'Tuvalu',
                value: 11396
            }, {
                id: '3.236',
                parent: '2.22',
                name: 'Niue',
                value: 1935
            }, {
                id: '3.237',
                parent: '2.22',
                name: 'Tokelau',
                value: 1893
            }, {
                id: '3.238',
                parent: '2.22',
                name: 'Pitcairn Islands',
                value: 45
            }]
        }],

        tooltip: {
            headerFormat: '',
            pointFormat: 'The population of <b>{point.name}</b> is ' +
                '<b>{point.value}</b>'
        }
    },
    chart24: { // Organization
        custom: {
            autoDesc: chart24desc
        },
        chart: {
            height: 600,
            inverted: false,
            type: 'organization'
        },

        title: {
            text: 'Carnivora Phylogeny'
        },

        subtitle: {
            text: 'Tracing the Evolutionary Relationship of Carnivores'
        },

        plotOptions: {
            series: {
                nodeWidth: '22%'
            }
        },
        series: [{
            type: 'organization',
            name: 'Carnivora Phyologeny',
            keys: ['from', 'to'],
            data: [
                ['Carnivora', 'Felidae'],
                ['Carnivora', 'Mustelidae'],
                ['Carnivora', 'Canidae'],
                ['Felidae', 'Panthera'],
                ['Mustelidae', 'Taxidea'],
                ['Mustelidae', 'Lutra'],
                ['Panthera', 'Panthera pardus'],
                ['Taxidea', 'Taxidea taxus'],
                ['Lutra', 'Lutra lutra'],
                ['Canidae', 'Canis'],
                ['Canis', 'Canis latrans'],
                ['Canis', 'Canis lupus']
            ],
            levels: [{
                level: 0,
                color: '#DEDDCF',
                dataLabels: {
                    color: 'black'
                }
            }, {
                level: 1,
                color: '#DEDDCF',
                dataLabels: {
                    color: 'black'
                },
                height: 25
            }, {
                level: 2,
                color: '#DEDDCF',
                dataLabels: {
                    color: 'black'
                }
            }, {
                level: 3,
                dataLabels: {
                    color: 'black'
                }
            }],
            nodes: [{
                id: 'Carnivora',
                title: null,
                name: 'Carnivora',
                custom: {
                    info: 'Carnivora is a diverse scrotiferan order that ' +
                    'includes over 280 species of placental mammals.'
                }
            }, {
                id: 'Felidae',
                title: null,
                name: 'Felidae',
                color: '#fcc657',
                custom: {
                    info: 'Felidae is a family of mammals in the order ' +
                        'Carnivora, colloquially referred to as cats, and ' +
                        'constitute a clade.'
                }
            }, {
                id: 'Panthera',
                title: null,
                name: 'Panthera',
                color: '#fcc657',
                custom: {
                    info: 'Panthera'
                }
            }, {
                id: 'Panthera pardus',
                title: null,
                name: 'Panthera pardus',
                color: '#fcc657',
                image: 'https://www.highcharts.com/samples/graphics/horizontal-organizational-chart/' +
                'panthera.png',
                custom: {
                    info: 'Panthera is a genus within the Felidae family ' +
                        'that was named and described by Lorenz Oken in 1816 ' +
                        'who placed all the spotted cats in this group.'
                }
            }, {
                id: 'Mustelidae',
                title: null,
                name: 'Mustelidae',
                color: '#C4B1A0',
                custom: {
                    info: 'The Mustelidae are a family of carnivorous ' +
                        'mammals, including weasels, badgers, otters, ' +
                        'ferrets, martens, mink, and wolverines, among others.'
                }
            }, {
                id: 'Taxidea',
                title: null,
                name: 'Taxidea',
                color: '#C4B1A0',
                custom: {
                    info: 'Taxidea'
                }
            }, {
                id: 'Lutra',
                color: '#C4B1A0',
                custom: {
                    info: 'Lutra'
                }
            }, {
                id: 'Taxidea taxus',
                name: 'Taxidea taxus',
                color: '#C4B1A0',
                image: 'https://www.highcharts.com/samples/graphics/horizontal-organizational-chart/taxidea-taxus.png',
                custom: {
                    info: 'Taxidea taxus is a North American badger, ' +
                        'somewhat similar in appearance to the European ' +
                        'badger, although not closely related. It is found ' +
                        'in the western and central United States, northern ' +
                        'Mexico, and south-central Canada to certain areas ' +
                        'of southwestern British Columbia.'
                }
            }, {
                id: 'Lutra lutra',
                name: 'Lutra lutra',
                color: '#C4B1A0',
                image:
                'https://www.highcharts.com/samples/graphics/horizontal-organizational-chart/lutra.png',
                custom: {
                    info: 'Lutra is a semiaquatic mammal native to Eurasia. ' +
                        'The most widely distributed member of the otter ' +
                        'subfamily (Lutrinae) of the weasel family ' +
                        '(Mustelidae), it is found in the waterways and ' +
                        'coasts of Europe, many parts of Asia, and parts of ' +
                        'northern Africa.'
                }
            }, {
                id: 'Canidae',
                name: 'Canidae',
                color: '#B0ACA2',
                custom: {
                    info: 'The biological family Canidae is a lineage of ' +
                    'carnivorans that includes domestic dogs, wolves, ' +
                    'coyotes, foxes, jackals, dingoes, and many other extant ' +
                    'and extinct dog-like mammals. '
                }
            }, {
                id: 'Canis',
                name: 'Canis',
                color: '#B0ACA2',
                custom: {
                    info: 'Canis'
                }
            }, {
                id: 'Canis latrans',
                name: 'Canis latrans',
                color: '#B0ACA2',
                image: 'https://www.highcharts.com/samples/graphics/horizontal-organizational-chart/' +
                'canis-latrans.png',
                custom: {
                    info: 'Canis latrans, is a canine native to North ' +
                        'America. It is smaller than its close relative, the ' +
                        'gray wolf, and slightly smaller than the closely ' +
                        'related eastern wolf and red wolf.'
                }
            }, {
                id: 'Canis lupus',
                name: 'Canis lupus',
                color: '#B0ACA2',
                image: 'https://www.highcharts.com/samples/graphics/horizontal-organizational-chart/' +
                'canis-lupus.png',
                custom: {
                    info: 'Canis lupus is a canine native to the wilderness ' +
                        'and remote areas of Eurasia and North America. ' +
                        'It is the largest extant member of its family, with ' +
                        'males averaging 43–45 kg (95–99 lb) and females ' +
                        '36–38.5 kg (79–85 lb).'
                }
            }],
            colorByPoint: false,
            borderColor: 'black',
            borderWidth: 2
        }],

        tooltip: {
            outside: true,
            format: '{point.custom.info}',
            style: {
                width: '320px'
            }
        },

        exporting: {
            allowHTML: true,
            sourceWidth: 800,
            sourceHeight: 600
        }

    },

    // ===== Row 9: Waterfall =====
    chart25: { // Waterfall
        custom: {
            autoDesc: chart25desc
        },
        chart: {
            type: 'waterfall'
        },

        title: {
            text: 'Highcharts Waterfall'
        },

        xAxis: {
            type: 'category'
        },

        yAxis: {
            title: {
                text: 'USD'
            }
        },

        legend: {
            enabled: false
        },

        tooltip: {
            pointFormat: '<b>${point.y:,.2f}</b> USD'
        },

        series: [{
            upColor: Highcharts.getOptions().colors[2],
            color: Highcharts.getOptions().colors[3],
            data: [{
                name: 'Start',
                y: 120000
            }, {
                name: 'Product Revenue',
                y: 569000
            }, {
                name: 'Service Revenue',
                y: 231000
            }, {
                name: 'Positive Balance',
                isIntermediateSum: true,
                color: Highcharts.getOptions().colors[1]
            }, {
                name: 'Fixed Costs',
                y: -342000
            }, {
                name: 'Variable Costs',
                y: -233000
            }, {
                name: 'Balance',
                isSum: true,
                color: Highcharts.getOptions().colors[1]
            }],
            dataLabels: {
                enabled: true,
                format: '{divide y 1000}k'
            },
            pointPadding: 0
        }]

    },
    chart26: { // Pyramid
        custom: {
            autoDesc: chart26desc
        },
        chart: {
            type: 'pyramid'
        },
        title: {
            text: 'Sales pyramid',
            x: -50
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b> ({point.y:,.0f})',
                    softConnector: true
                },
                center: ['40%', '50%'],
                width: '80%'
            }
        },
        legend: {
            enabled: false
        },
        series: [{
            name: 'Unique users',
            data: [
                ['Website visits',      15654],
                ['Downloads',            4064],
                ['Requested price list', 1987],
                ['Invoice sent',          976],
                ['Finalized',             846]
            ]
        }],

        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    plotOptions: {
                        series: {
                            dataLabels: {
                                inside: true
                            },
                            center: ['50%', '50%'],
                            width: '100%'
                        }
                    }
                }
            }]
        }
    },
    chart27: { // Missing
        chart: { type: 'line' },
        title: { text: 'Placeholder' },
        series: []
    },

    // ===== Row 10: Textual (wordcloud) =====
    chart28: { // Timeline
        custom: {
            autoDesc: chart28desc
        },
        chart: {
            type: 'timeline'
        },
        xAxis: {
            visible: false
        },
        yAxis: {
            visible: false
        },
        title: {
            text: 'Timeline of Space Exploration'
        },
        subtitle: {
            text: 'Info source: <a href="https://en.wikipedia.org/wiki/Timeline_of_space_exploration">www.wikipedia.org</a>'
        },
        colors: [
            '#2caffe', '#33a6f3', '#3a9dea', '#4194e0', '#488bd7', '#406ab2'
        ],
        series: [{
            data: [{
                name: '2000: Orbiting of an asteroid',
                description: '14 February 2000, first orbiting of an ' +
                    'asteroid (433 Eros).'
            }, {
                name: '2005: Landing on Titan.',
                description: '14 January 2005, first soft landing on Titan ' +
                    'also first soft landing in the outer Solar System.'
            }, {
                name: '2011: Orbit of Mercury',
                description: '18 March 2011, first spacecraft to orbit Mercury.'
            }, {
                name: '2015: Food eaten in space',
                description: '10 August 2015, first food grown in space and ' +
                'eaten (lettuce).'
            }, {
                name: '2019: Black hole photograph',
                description: '10 April 2019, first direct photograph of a ' +
                    'black hole and its vicinity.'
            }, {
                name: '2024: Moon Sample',
                description: '25 June 2024, First samples returned from ' +
                    'the far side of the Moon.'
            }]
        }]
    },
    chart29: { // Wordcloud
        custom: {
            autoDesc: chart29desc
        },
        chart: {
            zooming: { type: 'xy' },
            panning: { enabled: true, type: 'xy' },
            panKey: 'shift',
            type: 'wordcloud'
        },
        series: [{
            type: 'wordcloud',
            name: 'Occurrences',
            data: (function () {
                const text =
        'Chapter 1. Down the Rabbit-Hole ' +
        'Alice was beginning to get very tired of sitting by her sister on ' +
        'the bank, and of having nothing to do: ' +
        'once or twice she had peeped into the book her sister was reading, ' +
        'but it had no pictures or conversations ' +
        'in it, \'and what is the use of a book,\' thought Alice ' +
        '\'without pictures or conversation?\'' +
        'So she was considering in her own mind (as well as she could, for ' +
        'the hot day made her feel very sleepy ' +
        'and stupid), whether the pleasure of making a daisy-chain would be ' +
        'worth the trouble of getting up and picking ' +
        'the daisies, when suddenly a White Rabbit with pink eyes ran close ' +
        'by her.';

                const lines = text.replace(/[():'?0-9]+/g, '')
                    .split(/[,\. ]+/g);

                return lines.reduce((arr, word) => {
                    const obj = Highcharts.find(arr, o => o.name === word);
                    if (obj) {
                        obj.weight += 1;
                    } else {
                        arr.push({ name: word, weight: 1 });
                    }
                    return arr;
                }, []);
            }())
        }],
        title: {
            text: 'Wordcloud of Alice\'s Adventures in Wonderland',
            align: 'left'
        },
        subtitle: {
            text: 'An excerpt from chapter 1: Down the Rabbit-Hole',
            align: 'left'
        },
        tooltip: {
            headerFormat:
      '<span style="font-size: 16px"><b>{point.name}</b></span><br>'
        }
    },
    chart30: { // Missing
        chart: { type: 'line' },
        title: { text: 'Placeholder' },
        series: []
    },

    // ===== Row 11: Polar/Radar (line, polar) =====
    chart31: { // Polar
        custom: {
            autoDesc: chart31desc
        },
        chart: {
            polar: true
        },

        title: {
            text: 'Highcharts Polar Chart'
        },

        subtitle: {
            text: 'Also known as Radar Chart'
        },

        pane: {
            startAngle: 0,
            endAngle: 360
        },

        xAxis: {
            tickInterval: 45,
            min: 0,
            max: 360,
            labels: {
                format: '{value}°'
            }
        },

        yAxis: {
            min: 0
        },

        plotOptions: {
            series: {
                pointStart: 0,
                pointInterval: 45
            },
            column: {
                pointPadding: 0,
                groupPadding: 0
            }
        },

        series: [{
            type: 'column',
            name: 'Column',
            data: [8, 7, 6, 5, 4, 3, 2, 1],
            pointPlacement: 'between'
        }, {
            type: 'line',
            name: 'Line',
            data: [1, 2, 3, 4, 5, 6, 7, 8]
        }, {
            type: 'area',
            name: 'Area',
            data: [1, 8, 2, 7, 3, 6, 4, 5]
        }]
    },
    chart32: { // Wind rose
        custom: {
            autoDesc: chart32desc
        },
        chart: {
            polar: true,
            type: 'column'
        },

        title: {
            text: 'Wind rose for South Shore Met Station, Oregon'
        },

        subtitle: {
            text: 'Source: or.water.usgs.gov'
        },

        pane: {
            size: '85%'
        },

        legend: {
            align: 'right',
            verticalAlign: 'top',
            y: 100,
            layout: 'vertical'
        },

        xAxis: {
            categories: [
                'N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE',
                'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'
            ],
            tickmarkPlacement: 'on',
            lineWidth: 0
        },

        yAxis: {
            min: 0,
            endOnTick: false,
            showLastLabel: true,
            title: { text: 'Frequency (%)' },
            labels: {
                formatter: function () {
                    return this.value + '%';
                }
            },
            reversedStacks: false
        },

        tooltip: {
            valueSuffix: '%'
        },

        plotOptions: {
            series: {
                stacking: 'normal',
                shadow: false,
                groupPadding: 0,
                pointPlacement: 'on'
            }
        },

        series: [{
            name: '< 0.5 m/s',
            data: [
                1.81, 0.62, 0.82, 0.59, 0.62, 1.22, 1.61, 2.04,
                2.66, 2.96, 2.53, 1.97, 1.64, 1.32, 1.58, 1.51
            ],
            color: '#4572A7'
        }, {
            name: '0.5-2 m/s',
            data: [
                1.78, 1.09, 0.82, 1.22, 2.20, 2.01, 3.06, 3.42,
                4.74, 4.14, 4.01, 2.66, 1.71, 2.40, 4.28, 5.00
            ],
            color: '#AA4643'
        }, {
            name: '2-4 m/s',
            data: [
                0.16, 0.00, 0.07, 0.07, 0.49, 1.55, 2.37, 1.97,
                0.43, 0.26, 1.22, 1.97, 0.92, 0.99, 1.28, 1.32
            ],
            color: '#89A54E'
        }, {
            name: '4-6 m/s',
            data: [
                0.00, 0.00, 0.00, 0.00, 0.00, 0.30, 2.14, 0.86,
                0.00, 0.00, 0.49, 0.79, 1.45, 1.61, 0.76, 0.13
            ],
            color: '#80699B'
        }, {
            name: '6-8 m/s',
            data: [
                0.00, 0.00, 0.00, 0.00, 0.00, 0.13, 1.74, 0.53,
                0.00, 0.00, 0.13, 0.30, 0.26, 0.33, 0.66, 0.23
            ],
            color: '#3D96AE'
        }, {
            name: '8-10 m/s',
            data: [
                0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.39, 0.49,
                0.00, 0.00, 0.00, 0.00, 0.10, 0.00, 0.69, 0.13
            ],
            color: '#DB843D'
        }, {
            name: '> 10 m/s',
            data: [
                0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.13, 0.00,
                0.00, 0.00, 0.00, 0.00, 0.00, 0.00, 0.03, 0.07
            ],
            color: '#92A8CD'
        }]
    },
    chart33: { // Missing
        chart: { type: 'line' },
        title: { text: 'Placeholder' },
        series: []
    }
};


const AUTO_DESCS = {
    chart1: chart1desc,
    chart2: chart2desc,
    chart3: chart3desc,
    chart4: chart4desc,
    chart5: chart5desc,
    chart6: chart6desc,
    chart7: chart7desc,
    chart8: chart8desc,
    chart9: chart9desc,
    chart10: chart10desc,
    chart11: chart11desc,
    chart12: chart12desc,
    chart13: chart13desc,
    chart14: chart14desc,
    chart15: chart15desc,
    chart16: chart16desc,
    chart17: chart17desc,
    chart18: chart18desc,
    chart19: chart19desc,
    chart20: chart20desc,
    chart21: chart21desc,
    chart22: chart22desc,
    chart23: chart23desc,
    chart24: chart24desc,
    chart25: chart25desc,
    chart26: chart26desc,
    chart27: chart27desc,
    chart28: chart28desc,
    chart29: chart29desc,
    chart30: chart30desc,
    chart31: chart31desc,
    chart32: chart32desc,
    chart33: chart33desc
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
        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-label', 'Auto-description debug');
        wrapper.appendChild(panel);
    }
    panel.innerHTML = `
      <div class="a11y-debug__title">Auto-description:</div>
      <div class="a11y-debug__content">${html}</div>
    `;
}

const NAME_LIMIT = 3;
const NODE_NAME_LIMIT = 6;

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
    const xs = chart.xAxis?.[0]?.categories || [];
    const vs = visibleSeries(chart);

    const strategies = [
    // Word cloud
        () => hasType(chart, 'wordcloud') && (() => {
            const s = firstSeriesOfType(chart, 'wordcloud');
            const pts = visiblePoints(s);
            const top = pts
                .filter(p => (p.name ?? '').toString().trim())
                .slice()
                .sort(
                    (a, b) => (Number(b.weight) || 0) -
                        (Number(a.weight) || 0)
                );
            const namesSnippet = listWithMore(
                top.map(p => String(p.name)), NAME_LIMIT
            );
            const count = pts.length;
            return `${typeLabel} with ${count} ${plural(count, 'word')}${
                namesSnippet ? `: ${namesSnippet}` : ''
            }.`;
        })(),

        // Timeline (minimal)
        () => hasType(chart, 'timeline') && (() => {
            const s = firstSeriesOfType(chart, 'timeline');
            const count = visiblePoints(s).length;
            return `${typeLabel} with ${count} ${plural(count, 'event')}.`;
        })(),

        // Waterfall (steps, rename totals)
        () => hasType(chart, 'waterfall') && (() => {
            const s = firstSeriesOfType(chart, 'waterfall');
            const pts = visiblePoints(s);
            const stepNames = pts.map((p, i) => {
                if (p.isSum) {
                    return 'Total';
                }
                if (p.isIntermediateSum) {
                    return 'Subtotal';
                }
                if (p.name && String(p.name).trim()) {
                    return p.name;
                }
                const cat = xs[p.x];
                return (typeof cat === 'string' && cat.trim()) ?
                    cat : `Step ${i + 1}`;
            });
            const namesSnippet = listWithMore(stepNames, NAME_LIMIT);
            const count = pts.length;
            return `${typeLabel} with ${count} ${plural(count, 'step')}${
                namesSnippet ? `: ${namesSnippet}` : ''
            }.`;
        })(),

        // Sunburst (root + top-level children)
        () => hasType(chart, 'sunburst') && (() => {
            const s = firstSeriesOfType(chart, 'sunburst');
            const src = (Array.isArray(s?.points) && s.points.length) ?
                s.points :
                (Array.isArray(s?.options?.data) ? s.options.data : []);
            const norm = src.map((p, i) => ({
                id: (p.id ?? p.name ?? `node-${i}`).toString(),
                parent: (p.parent ?? '').toString(),
                name: (p.name ?? p.id ?? `Node ${i + 1}`).toString(),
                visible: (p.visible !== false)
            }));
            const vis = norm.filter(n => n.visible);
            if (!vis.length) {
                return `${typeLabel}.`;
            }
            const idSet = new Set(norm.map(n => n.id));
            const root = vis.find(n => !n.parent || !idSet.has(n.parent)) ||
                vis[0];
            const topNames = vis.filter(n => n.parent === root.id)
                .map(n => n.name);
            const namesSnippet = listWithMore(topNames, NAME_LIMIT);
            return `${typeLabel} with ${vis.length} nodes (root: ${
                root.name
            })${namesSnippet ? `: ${namesSnippet}` : ''}.`;
        })(),

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

        // Pie (slices)
        () => hasType(chart, 'pie') && (() => {
            const s = firstSeriesOfType(chart, 'pie');
            const slices = visiblePoints(s);
            const names = slices.map(p => p.name || 'Unnamed slice');
            const formatted = seriesNamesSnippet(names.map(n => ({ name: n })));
            return `${typeLabel} with ${slices.length} ${
                plural(slices.length, 'slice')
            }${formatted ? `: ${formatted}` : ''}.`;
        })(),

        // Funnel / Pyramid (stages)
        () => (hasType(chart, 'funnel') ||
            hasType(chart, 'pyramid')) && (() => {
            const wanted = hasType(chart, 'funnel') ? 'funnel' : 'pyramid';
            const s = firstSeriesOfType(chart, wanted);
            const pts = visiblePoints(s);
            const names = pts.map(p => p.name || 'Unnamed stage');
            const formatted = seriesNamesSnippet(names.map(n => ({ name: n })));
            return `${getTypeLabel(wanted, false)} with ${pts.length} ${
                plural(pts.length, 'stage')
            }${formatted ? `: ${formatted}` : ''}.`;
        })(),

        // Sankey (nodes + links)
        () => hasType(chart, 'sankey') && (() => {
            const ss = visibleSeries(chart)
                .filter(s => seriesType(s) === 'sankey');
            const allNodes = new Map();
            let linkCount = 0;
            ss.forEach(s => {
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
            const namesSnippet = listWithMore(nodeNames, NODE_NAME_LIMIT);
            return `${typeLabel} with ${nodeNames.length} nodes and ${
                linkCount
            } links${namesSnippet ? `: ${namesSnippet}` : ''}.`;
        })(),

        // Dependency wheel (nodes + links)
        () => hasType(chart, 'dependencywheel') && (() => {
            const s = firstSeriesOfType(chart, 'dependencywheel');
            const allNodes = new Map();
            const pts = Array.isArray(s?.points) ? s.points : [];
            (s?.options?.nodes || []).forEach(n => {
                const key = (n.id ?? n.name ?? '').toString();
                if (key) {
                    allNodes.set(key, n.name || n.id);
                }
            });
            pts.forEach(p => {
                const fromNm = p?.fromNode?.name ?? p?.from ?? '';
                const toNm   = p?.toNode?.name   ?? p?.to   ?? '';
                if (fromNm) {
                    allNodes.set(String(fromNm), String(fromNm));
                }
                if (toNm)   {
                    allNodes.set(String(toNm),   String(toNm));
                }
            });
            if (!pts.length && Array.isArray(s?.options?.data)) {
                s.options.data.forEach(row => {
                    if (Array.isArray(row) && row.length >= 2) {
                        const [fromNm, toNm] = row;
                        if (fromNm) {
                            allNodes.set(String(fromNm), String(fromNm));
                        }
                        if (toNm)   {
                            allNodes.set(String(toNm),   String(toNm));
                        }
                    }
                });
            }
            const nodeNames = Array.from(allNodes.values());
            const linkCount = pts.length ||
                (Array.isArray(s?.options?.data) ? s.options.data.length : 0);
            const namesSnippet = listWithMore(nodeNames, NODE_NAME_LIMIT);
            return `${typeLabel} with ${nodeNames.length} nodes and ${
                linkCount
            } links${namesSnippet ? `: ${namesSnippet}` : ''}.`;
        })(),

        () => hasType(chart, 'boxplot') && (() => {
            const s = firstSeriesOfType(chart, 'boxplot');
            let pts = Array.isArray(s?.points) && s.points.length ?
                s.points.map(p => ({
                    name: p.name ?? chart.xAxis?.[0]?.categories?.[p.x],
                    low: p.low,
                    q1: p.q1,
                    median: p.median,
                    q3: p.q3,
                    high: p.high
                })) :
                [];
            if (!pts.length) {
                const dataOpt = s?.options?.data || [];
                pts = dataOpt.map((arr, i) => ({
                    name: chart.xAxis?.[0]?.categories?.[i],
                    low: arr[0],
                    q1: arr[1],
                    median: arr[2],
                    q3: arr[3],
                    high: arr[4]
                }));
            }
            const groups = pts.filter(p => Number.isFinite(p.median));
            if (!groups.length) {
                return 'Box plot.';
            }
            const namesSnippet = listWithMore(
                groups.map(p => p.name).filter(Boolean), NAME_LIMIT
            );
            const medians = groups.map(p => p.median);
            const lows = groups.map(p => p.low);
            const highs = groups.map(p => p.high);
            const minMed = Math.min(...medians),
                maxMed = Math.max(...medians);
            const minLow = Math.min(...lows),
                maxHigh = Math.max(...highs);
            return `Box plot with ${groups.length} ${
                plural(groups.length, 'group')
            }` +
             `${namesSnippet ? ` (${namesSnippet})` : ''}. ` +
             `Medians range ${minMed}–${maxMed}; whiskers span ${
                 minLow
             }–${maxHigh}.`;
        })(),

        // Heatmap / tilemap (grid)
        () => (hasType(chart, 'heatmap') ||
            hasType(chart, 'tilemap')) && (() => {
            const s = vs[0];
            const xCats = chart.xAxis?.[0]?.categories || [];
            const yCats = chart.yAxis?.[0]?.categories || [];
            const dimension = xCats.length && yCats.length ?
                `${xCats.length}×${yCats.length} cells` :
                `${s?.points?.length || 0} cells`;
            return `${typeLabel} with ${dimension}${
                s?.name ? ` (${s.name})` : ''
            }.`;
        })()
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
