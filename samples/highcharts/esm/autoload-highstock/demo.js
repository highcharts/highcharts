let success = 0,
    failed = 0;

// abands test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing abands'
            },
            series: [{
                type: 'abands',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'abands failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load abands', e);
    }
})();

// ad test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing ad'
            },
            series: [{
                type: 'ad',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'ad failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load ad', e);
    }
})();

// ao test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing ao'
            },
            series: [{
                type: 'ao',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'ao failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load ao', e);
    }
})();

// apo test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing apo'
            },
            series: [{
                type: 'apo',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'apo failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load apo', e);
    }
})();

// area test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing area'
            },
            series: [{
                type: 'area',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'area failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load area', e);
    }
})();

// arearange test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing arearange'
            },
            series: [{
                type: 'arearange',
                data: [
                    [0, 1, 2],
                    [1, 2, 3],
                    [2, 3, 4]
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'arearange failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load arearange', e);
    }
})();

// areaspline test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing areaspline'
            },
            series: [{
                type: 'areaspline',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'areaspline failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load areaspline', e);
    }
})();

// areasplinerange test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing areasplinerange'
            },
            series: [{
                type: 'areasplinerange',
                data: [
                    [0, 1, 2],
                    [1, 2, 3],
                    [2, 3, 4]
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'areasplinerange failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load areasplinerange', e);
    }
})();

// aroon test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing aroon'
            },
            series: [{
                type: 'aroon',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'aroon failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load aroon', e);
    }
})();

// aroonoscillator test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing aroonoscillator'
            },
            series: [{
                type: 'aroonoscillator',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'aroonoscillator failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load aroonoscillator', e);
    }
})();

// atr test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing atr'
            },
            series: [{
                type: 'atr',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'atr failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load atr', e);
    }
})();

// bb test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing bb'
            },
            series: [{
                type: 'bb',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'bb failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load bb', e);
    }
})();

// bubble test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing bubble'
            },
            series: [{
                type: 'bubble',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'bubble failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load bubble', e);
    }
})();

// candlestick test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing candlestick'
            },
            series: [{
                type: 'candlestick',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'candlestick failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load candlestick', e);
    }
})();

// cci test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing cci'
            },
            series: [{
                type: 'cci',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'cci failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load cci', e);
    }
})();

// chaikin test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing chaikin'
            },
            series: [{
                type: 'chaikin',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'chaikin failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load chaikin', e);
    }
})();

// cmf test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing cmf'
            },
            series: [{
                type: 'cmf',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'cmf failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load cmf', e);
    }
})();

// cmo test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing cmo'
            },
            series: [{
                type: 'cmo',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'cmo failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load cmo', e);
    }
})();

// column test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing column'
            },
            series: [{
                type: 'column',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'column failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load column', e);
    }
})();

// columnpyramid test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing columnpyramid'
            },
            series: [{
                type: 'columnpyramid',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'columnpyramid failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load columnpyramid', e);
    }
})();

// columnrange test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing columnrange'
            },
            series: [{
                type: 'columnrange',
                data: [
                    [0, 1, 2],
                    [1, 2, 3],
                    [2, 3, 4]
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'columnrange failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load columnrange', e);
    }
})();

// dema test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing dema'
            },
            series: [{
                type: 'dema',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'dema failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load dema', e);
    }
})();

// disparityindex test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing disparityindex'
            },
            series: [{
                type: 'disparityindex',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'disparityindex failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load disparityindex', e);
    }
})();

// dmi test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing dmi'
            },
            series: [{
                type: 'dmi',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'dmi failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load dmi', e);
    }
})();

// dpo test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing dpo'
            },
            series: [{
                type: 'dpo',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'dpo failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load dpo', e);
    }
})();

// dumbbell test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing dumbbell'
            },
            series: [{
                type: 'dumbbell',
                data: [
                    [0, 1, 2],
                    [1, 2, 3],
                    [2, 3, 4]
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'dumbbell failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load dumbbell', e);
    }
})();

// ema test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing ema'
            },
            series: [{
                type: 'ema',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'ema failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load ema', e);
    }
})();

// flags test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing flags'
            },
            series: [{
                type: 'flags',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'flags failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load flags', e);
    }
})();

// heikinashi test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing heikinashi'
            },
            series: [{
                type: 'heikinashi',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'heikinashi failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load heikinashi', e);
    }
})();

// hlc test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing hlc'
            },
            series: [{
                type: 'hlc',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'hlc failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load hlc', e);
    }
})();

// hollowcandlestick test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing hollowcandlestick'
            },
            series: [{
                type: 'hollowcandlestick',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'hollowcandlestick failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load hollowcandlestick', e);
    }
})();

// ikh test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing ikh'
            },
            series: [{
                type: 'ikh',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'ikh failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load ikh', e);
    }
})();

// keltnerchannels test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing keltnerchannels'
            },
            series: [{
                type: 'keltnerchannels',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'keltnerchannels failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load keltnerchannels', e);
    }
})();

// klinger test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing klinger'
            },
            series: [{
                type: 'klinger',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'klinger failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load klinger', e);
    }
})();

// line test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing line'
            },
            series: [{
                type: 'line',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'line failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load line', e);
    }
})();

// linearregression test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing linearregression'
            },
            series: [{
                type: 'linearregression',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'linearregression failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load linearregression', e);
    }
})();

// linearregressionangle test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing linearregressionangle'
            },
            series: [{
                type: 'linearregressionangle',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'linearregressionangle failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load linearregressionangle', e);
    }
})();

// linearregressionintercept test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing linearregressionintercept'
            },
            series: [{
                type: 'linearregressionintercept',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'linearregressionintercept failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load linearregressionintercept', e);
    }
})();

// linearregressionslope test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing linearregressionslope'
            },
            series: [{
                type: 'linearregressionslope',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'linearregressionslope failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load linearregressionslope', e);
    }
})();

// lollipop test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing lollipop'
            },
            series: [{
                type: 'lollipop',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'lollipop failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load lollipop', e);
    }
})();

// macd test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing macd'
            },
            series: [{
                type: 'macd',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'macd failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load macd', e);
    }
})();

// mfi test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing mfi'
            },
            series: [{
                type: 'mfi',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'mfi failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load mfi', e);
    }
})();

// momentum test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing momentum'
            },
            series: [{
                type: 'momentum',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'momentum failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load momentum', e);
    }
})();

// natr test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing natr'
            },
            series: [{
                type: 'natr',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'natr failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load natr', e);
    }
})();

// obv test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing obv'
            },
            series: [{
                type: 'obv',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'obv failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load obv', e);
    }
})();

// ohlc test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing ohlc'
            },
            series: [{
                type: 'ohlc',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'ohlc failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load ohlc', e);
    }
})();

// pc test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing pc'
            },
            series: [{
                type: 'pc',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'pc failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load pc', e);
    }
})();

// pivotpoints test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing pivotpoints'
            },
            series: [{
                type: 'pivotpoints',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'pivotpoints failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load pivotpoints', e);
    }
})();

// pointandfigure test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing pointandfigure'
            },
            series: [{
                type: 'pointandfigure',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'pointandfigure failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load pointandfigure', e);
    }
})();

// polygon test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing polygon'
            },
            series: [{
                type: 'polygon',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'polygon failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load polygon', e);
    }
})();

// ppo test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing ppo'
            },
            series: [{
                type: 'ppo',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'ppo failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load ppo', e);
    }
})();

// priceenvelopes test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing priceenvelopes'
            },
            series: [{
                type: 'priceenvelopes',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'priceenvelopes failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load priceenvelopes', e);
    }
})();

// psar test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing psar'
            },
            series: [{
                type: 'psar',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'psar failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load psar', e);
    }
})();

// renko test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing renko'
            },
            series: [{
                type: 'renko',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'renko failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load renko', e);
    }
})();

// roc test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing roc'
            },
            series: [{
                type: 'roc',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'roc failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load roc', e);
    }
})();

// rsi test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing rsi'
            },
            series: [{
                type: 'rsi',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'rsi failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load rsi', e);
    }
})();

// scatter test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing scatter'
            },
            series: [{
                type: 'scatter',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'scatter failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load scatter', e);
    }
})();

// slowstochastic test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing slowstochastic'
            },
            series: [{
                type: 'slowstochastic',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'slowstochastic failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load slowstochastic', e);
    }
})();

// sma test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing sma'
            },
            series: [{
                type: 'sma',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'sma failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load sma', e);
    }
})();

// spline test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing spline'
            },
            series: [{
                type: 'spline',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'spline failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load spline', e);
    }
})();

// stochastic test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing stochastic'
            },
            series: [{
                type: 'stochastic',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'stochastic failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load stochastic', e);
    }
})();

// streamgraph test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing streamgraph'
            },
            series: [{
                type: 'streamgraph',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'streamgraph failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load streamgraph', e);
    }
})();

// supertrend test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing supertrend'
            },
            series: [{
                data: [1, 3, 2, 4]
            }, {
                type: 'supertrend',
                linkedTo: ':previous'
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'supertrend failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load supertrend', e);
    }
})();

// tema test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing tema'
            },
            series: [{
                type: 'tema',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'tema failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load tema', e);
    }
})();

// trendline test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing trendline'
            },
            series: [{
                type: 'trendline',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'trendline failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load trendline', e);
    }
})();

// trix test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing trix'
            },
            series: [{
                type: 'trix',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'trix failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load trix', e);
    }
})();

// vbp test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing vbp'
            },
            series: [{
                type: 'line',
                id: 'volume',
                data: [1, 3, 2, 4]
            },
            {
                type: 'vbp',
                params: {
                    volumeSeriesID: 'volume'
                }
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'vbp failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load vbp', e);
    }
})();

// vector test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing vector'
            },
            series: [{
                type: 'vector',
                data: [
                    [0, 0, 1, 1],
                    [1, 2, 1, -1],
                    [2, 0, -1, 1]
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'vector failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load vector', e);
    }
})();

// vwap test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing vwap'
            },
            series: [{
                type: 'vwap',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'vwap failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load vwap', e);
    }
})();

// williamsr test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing williamsr'
            },
            series: [{
                type: 'williamsr',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'williamsr failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load williamsr', e);
    }
})();

// windbarb test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing windbarb'
            },
            series: [{
                type: 'windbarb',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'windbarb failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load windbarb', e);
    }
})();

// wma test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing wma'
            },
            series: [{
                type: 'wma',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'wma failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load wma', e);
    }
})();

// xrange test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing xrange'
            },
            series: [{
                type: 'xrange',
                data: [
                    { x: 1, x2: 2, y: 0 },
                    { x: 1, x2: 3, y: 1 },
                    { x: 2, x2: 5, y: 2 }
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'xrange failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load xrange', e);
    }
})();

// zigzag test
(async () => {
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    if (/Compiled on demand/.test(Highcharts.version)) {
        document.getElementById('results').innerText =
            'Compiled on demand is enabled. ' +
            'Please disable it to run the tests.';
        document.getElementById('results').classList.add('failed');
        return;
    }
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);

    try {
        await Highcharts.stockChart(container, {
            title: {
                text: 'Testing zigzag'
            },
            series: [{
                type: 'zigzag',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'zigzag failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load zigzag', e);
    }
})();
