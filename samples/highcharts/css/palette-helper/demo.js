/* global ColorScheme */
const { Color } = Highcharts;
const colorScheme = new ColorScheme();

let topology,
    ohlc,
    animation = true;

const rgbToHex = rgb => {
    const [r, g, b] = Color.parse(rgb).rgba;
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
};

const chartPreview = async theme => {
    Highcharts.setOptions(theme);

    Highcharts.chart('container-chart', {

        chart: {
            zooming: {
                type: 'x',
                mouseWheel: {
                    type: ''
                }
            },
            borderRadius: 3
        },

        title: {
            text: ''
        },

        xAxis: {
            width: '40%',
            type: 'category'
        },

        yAxis: {
            width: '40%',
            top: '10%',
            height: '90%',
            title: {
                text: 'kg'
            }
        },

        plotOptions: {
            series: {
                animation
            }
        },

        series: [{
            type: 'pie',
            allowPointSelect: true,
            keys: ['name', 'y', 'selected', 'sliced'],
            data: [
                ['Apples', 29.9, false],
                ['Pears', 71.5, false],
                ['Oranges', 106.4, false],
                ['Plums', 129.2, false],
                ['Bananas', 144.0, false],
                ['Peaches', 176.0, false],
                ['Prunes', 135.6, true, true],
                ['Avocados', 148.5, false]
            ],
            showInLegend: true,
            center: ['75%', '50%']
        }, {
            type: 'column',
            keys: ['name', 'y'],
            data: [
                ['Apples', 29.9, false],
                ['Pears', 71.5, false],
                ['Oranges', 106.4, false],
                ['Plums', 129.2, false],
                ['Bananas', 144.0, false],
                ['Peaches', 176.0, false],
                ['Prunes', 135.6, true, true],
                ['Avocados', 148.5, false]
            ],
            colorByPoint: true,
            showInLegend: false
        }]
    });

    // Map preview
    if (!topology) {
        topology = await fetch(
            'https://code.highcharts.com/mapdata/custom/africa.topo.json'
        ).then(response => response.json());
    }

    const data = [
        ['ug', 10], ['ng', 11], ['st', 12], ['tz', 13], ['sl', 14], ['gw', 15],
        ['cv', 16], ['sc', 17], ['tn', 18], ['mg', 19], ['ke', 20], ['cd', 21],
        ['fr', 22], ['mr', 23], ['dz', 24], ['er', 25], ['gq', 26], ['mu', 27],
        ['sn', 28], ['km', 29], ['et', 30], ['ci', 31], ['gh', 32], ['zm', 33],
        ['na', 34], ['rw', 35], ['sx', 36], ['so', 37], ['cm', 38], ['cg', 39],
        ['eh', 40], ['bj', 41], ['bf', 42], ['tg', 43], ['ne', 44], ['ly', 45],
        ['lr', 46], ['mw', 47], ['gm', 48], ['td', 49], ['ga', 50], ['dj', 51],
        ['bi', 52], ['ao', 53], ['gn', 54], ['zw', 55], ['za', 56], ['mz', 57],
        ['sz', 58], ['ml', 59], ['bw', 60], ['sd', 61], ['ma', 62], ['eg', 63],
        ['ls', 64], ['ss', 65], ['cf', 66]
    ];

    // Create the chart
    Highcharts.mapChart('container-map', {
        chart: {
            map: topology,
            borderRadius: 3
        },

        title: {
            text: 'Map preview'
        },

        subtitle: {
            text: 'Source map: <a href="https://code.highcharts.com/mapdata/custom/africa.topo.json">Africa</a>'
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        colorAxis: {
            min: 0
        },

        series: [{
            data,
            animation,
            name: 'Random data',
            dataLabels: {
                enabled: true,
                format: '{point.name}'
            }
        }]
    });

    // Stock preview
    if (!ohlc) {
        ohlc = await fetch(
            'https://www.highcharts.com/samples/data/aapl-ohlc.json'
        ).then(response => response.json());
    }
    Highcharts.stockChart('container-stock', {
        chart: {
            borderRadius: 3
        },

        rangeSelector: {
            selected: 1
        },

        title: {
            text: 'Stock chart preview'
        },

        series: [{
            type: 'candlestick',
            name: 'AAPL Stock Price',
            data: ohlc,
            animation,
            dataGrouping: {
                units: [
                    [
                        'week', // unit name
                        [1] // allowed multiples
                    ], [
                        'month',
                        [1, 2, 3, 4, 6]
                    ]
                ]
            }
        }]
    });
};

const defaultOptions = Highcharts.merge(Highcharts.defaultOptions);

// Generate a random color scheme using the third-party color-scheme package
// https://github.com/c0bra/color-scheme-js
const getColors = () => {
    const fromHue = Math.round(Math.random() * 256 * 256 * 256),
        scheme = [
            'mono',
            'contrast',
            'triade',
            'tetrade',
            'analogic'
        ][Math.floor(Math.random() * 4.999)],
        variation = [
            'default',
            'pastel',
            'soft',
            'light',
            'hard',
            'pale'
        ][Math.floor(Math.random() * 5.999)],
        distance = Math.random();

    console.log(`
        from_hue: ${fromHue},
        scheme: ${scheme},
        variation: ${variation},
        distance: ${distance}
    `);

    colorScheme
        .from_hue(fromHue)
        .scheme(scheme)
        .distance(distance)
        .variation(variation);

    const colors = colorScheme.colors();

    // Various schemes produce different number of colors
    while (colors.length < 10) {
        colors.push.apply(colors, colors.slice(0, 4));
    }

    return colors.map(c => `#${c}`);
};

const generate = async () => {

    const palette = {};

    const backgroundColor = document.querySelector(
            'input[name="background-color"]'
        ).value,
        neutralColor100 = document.querySelector(
            'input[name="neutral-color"]'
        ).value,
        highlightColor100 = document.querySelector(
            'input[name="highlight-color"]'
        ).value,
        dataColors = Highcharts.getOptions().colors.map((color, i) =>
            document.querySelector(`input[name="data-color-${i}"]`).value
        );

    const pre = document.getElementById('css'),
        neutralPreview = document.getElementById('neutral-preview'),
        highlightPreview = document.getElementById('highlight-preview'),
        pageTextColor = Highcharts.SVGRenderer.prototype
            .getContrast(backgroundColor);
    document.body.style.color = pageTextColor;
    document.body.style.backgroundColor = Highcharts.SVGRenderer.prototype
        .getContrast(document.body.style.color)
        .replace('#000000', '#222222');
    [...document.querySelectorAll('.demo-content pre,.demo-content a')].forEach(
        element => {
            element.style.color = pageTextColor === '#ffffff' ?
                'lightgreen' :
                'green';
        }
    );

    // Data colors
    pre.innerText = '/* Colors for data series and points */\n';
    dataColors.forEach((color, i) => {
        palette[`color${i}`] = color;
        pre.innerText += `--highcharts-color-${i}: ${color};\n`;
    });

    palette.backgroundColor = backgroundColor;
    pre.innerText += '\n/* Background color */\n' +
        `--highcharts-background-color: ${backgroundColor};\n\n`;

    const backgroundColorObj = new Color(backgroundColor),
        neutralColor100Obj = new Color(neutralColor100),
        highlightColor100Obj = new Color(highlightColor100);

    pre.innerText += '/* Neutral color variations */\n';
    [100, 80, 60, 40, 20, 10, 5, 3].forEach(weight => {
        const color = rgbToHex(neutralColor100Obj.tweenTo(
            backgroundColorObj,
            (100 - weight) / 100
        ));

        palette[`neutralColor${weight}`] = color;
        pre.innerText += `--highcharts-neutral-color-${weight}: ${color};\n`;

        let preview = document.getElementById(`neutral-preview-${weight}`);
        if (!preview) {
            preview = document.createElement('div');
            preview.id = `neutral-preview-${weight}`;
            preview.title = `.highcharts-neutral-color-${weight}`;
            neutralPreview.appendChild(preview);
        }
        preview.style.backgroundColor = color;
    });

    pre.innerText += '\n/* Highlight color variations */\n';
    [100, 80, 60, 20, 10].forEach(weight => {
        const color = rgbToHex(highlightColor100Obj.tweenTo(
            backgroundColorObj,
            (100 - weight) / 100
        ));

        palette[`highlightColor${weight}`] = color;
        pre.innerText += `--highcharts-highlight-color-${weight}: ${color};\n`;

        let preview = document.getElementById(`highlight-preview-${weight}`);
        if (!preview) {
            preview = document.createElement('div');
            preview.id = `highlight-preview-${weight}`;
            preview.title = `.highcharts-highlight-color-${weight}`;
            highlightPreview.appendChild(preview);
        }
        preview.style.backgroundColor = color;
    });

    // Map the default color set to palette property names
    const colorMap = {
        '#ffffff': 'backgroundColor',
        '#000000': 'neutralColor100',
        '#333333': 'neutralColor80',
        '#666666': 'neutralColor60',
        '#999999': 'neutralColor40',
        '#cccccc': 'neutralColor20',
        '#e6e6e6': 'neutralColor10',
        '#f2f2f2': 'neutralColor5',
        '#f7f7f7': 'neutralColor3',
        '#0022ff': 'highlightColor100',
        '#334eff': 'highlightColor80',
        '#667aff': 'highlightColor60',
        '#ccd3ff': 'highlightColor20',
        '#e6e9ff': 'highlightColor10'
    };


    // Find colors in default options
    const findColors = obj => {
        const theme = {};
        if (typeof obj === 'object' && !Array.isArray(obj)) {
            for (const [key, value] of Object.entries(obj)) {
                if (value && typeof value === 'object') {
                    const children = findColors(value, key);
                    if (children) {
                        theme[key] = children;
                    }
                } else if (Array.isArray(value)) {
                    // findColors(value, itemPath);
                } else if (
                    typeof value === 'string' &&
                    /#[0-9a-f]{6}/.test(value)
                ) {
                    const paletteKey = colorMap[value];
                    if (!paletteKey) {
                        console.error(`Palette key missing for ${value}`);
                    } else {
                        const color = palette[paletteKey];
                        if (!color) {
                            console.error(
                                `Color missing for ${value} in palette`
                            );
                        }
                        theme[key] = color;
                    }
                }
            }
        }
        return Object.keys(theme).length ? theme : undefined;
    };
    const theme = findColors(defaultOptions);
    theme.colors = dataColors;

    // Further extend the theme with some colors that are computed at runtime
    // and not available through the options structure.
    Highcharts.merge(true, theme, {
        chart: {
            selectionMarkerFill: new Color(palette.highlightColor80)
                .setOpacity(0.25)
                .get()
        },
        navigator: {
            maskFill: new Color(palette.highlightColor60)
                .setOpacity(0.3)
                .get()
        }
    });

    document.getElementById('js').innerText = JSON.stringify(theme, null, '  ');

    await chartPreview(theme);

    // Only animate the first time
    animation = false;
};

(async () => {
    let timer;

    const populateColorInputs = colors => colors.forEach((color, i) => {
        const input = document.querySelector(
            `input[name="data-color-${i}"]`
        );
        if (input) {
            input.value = color;
            input.title = `Color ${i}: ${color}`;
        }
    });

    // Insert default data colors
    populateColorInputs(Highcharts.getOptions().colors);

    // Activate the inputs
    [...document.querySelectorAll('input')]
        .forEach(input => input.addEventListener(
            'input',
            () => {
                clearTimeout(timer);
                timer = setTimeout(generate, 200);
            }
        ));

    // Activate the randomize button
    document.getElementById('randomize').addEventListener('click', () => {
        populateColorInputs(getColors());
        generate();
    });

    await generate();
})();