/* global buriedDefaults */
const { Color } = Highcharts;

const rgbToHex = rgb => {
    const [r, g, b] = Color.parse(rgb).rgba;
    return '#' + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
};

const chartPreview = theme => {
    Highcharts.setOptions(theme);

    Highcharts.chart('container', {
        chart: {
            type: 'area',
            zooming: {
                type: 'x'
            }
        },
        title: {
            text: 'Chart preview'
        },
        series: [{
            data: [1, 3, 2, 4]
        }, {
            data: [4, 2, 3, 1]
        }]
    });
};

const buildDefaults = () => {
    buriedDefaults.yAxis = Highcharts.merge(
        buriedDefaults.xAxis,
        buriedDefaults.yAxis
    );
    return Highcharts.merge(
        Highcharts.defaultOptions,
        buriedDefaults
    );
};

const defaultOptions = buildDefaults();

const generate = () => {

    const palette = {};

    const backgroundColor = document.querySelector(
            'input[name="background-color"]'
        ).value,
        neutralColor100 = document.querySelector(
            'input[name="neutral-color"]'
        ).value,
        highlightColor100 = document.querySelector(
            'input[name="highlight-color"]'
        ).value;

    const pre = document.getElementById('css'),
        neutralPreview = document.getElementById('neutral-preview'),
        highlightPreview = document.getElementById('highlight-preview');
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.color = neutralColor100;
    [...document.querySelectorAll('.demo-content pre,.demo-content a')].forEach(
        element => {
            element.style.color = highlightColor100;
        }
    );

    palette.backgroundColor = backgroundColor;
    pre.innerText = '/* Background color */\n' +
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
            neutralPreview.appendChild(preview);

            const label = document.createElement('div');
            label.innerText = `Neutral ${weight}`;
            neutralPreview.appendChild(label);
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
            highlightPreview.appendChild(preview);

            const label = document.createElement('div');
            label.innerText = `Highlight ${weight}`;
            highlightPreview.appendChild(label);
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
                    }
                    const color = palette[paletteKey];
                    if (!color) {
                        console.error(`Color missing for ${value} in palette`);
                    }
                    theme[key] = color;
                }
            }
        }
        return Object.keys(theme).length ? theme : undefined;
    };
    const theme = findColors(defaultOptions);

    document.getElementById('js').innerText = JSON.stringify(theme, null, '  ');

    chartPreview(theme);
};

[...document.querySelectorAll('input')]
    .forEach(input => input.addEventListener('change', generate));
generate();