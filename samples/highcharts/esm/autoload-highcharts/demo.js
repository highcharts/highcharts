let success = 0,
    failed = 0;

// arcdiagram test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing arcdiagram'
            },
            series: [{
                type: 'arcdiagram',
                data: [
                    ['A', 'B', 1],
                    ['A', 'C', 1],
                    ['A', 'D', 1],
                    ['B', 'D', 1],
                    ['C', 'D', 1]
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'arcdiagram failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load arcdiagram', e);
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
        await Highcharts.chart(container, {
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
        await Highcharts.chart(container, {
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
        await Highcharts.chart(container, {
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
        await Highcharts.chart(container, {
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

// bar test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing bar'
            },
            series: [{
                type: 'bar',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'bar failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load bar', e);
    }
})();

// bellcurve test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing bellcurve'
            },
            series: [{
                type: 'bellcurve',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'bellcurve failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load bellcurve', e);
    }
})();

// boxplot test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing boxplot'
            },
            series: [{
                type: 'boxplot',
                data: [
                    [1, 2, 3, 4, 5],
                    [2, 3, 4, 5, 6],
                    [3, 4, 5, 6, 7]
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'boxplot failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load boxplot', e);
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
        await Highcharts.chart(container, {
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

// bullet test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing bullet'
            },
            series: [{
                type: 'bullet',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'bullet failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load bullet', e);
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
        await Highcharts.chart(container, {
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
        await Highcharts.chart(container, {
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
        await Highcharts.chart(container, {
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

// cylinder test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing cylinder'
            },
            series: [{
                type: 'cylinder',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'cylinder failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load cylinder', e);
    }
})();

// dependencywheel test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing dependencywheel'
            },
            series: [{
                type: 'dependencywheel',
                data: [
                    ['A', 'B', 1],
                    ['A', 'C', 1],
                    ['A', 'D', 1],
                    ['B', 'D', 1],
                    ['C', 'D', 1]
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'dependencywheel failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load dependencywheel', e);
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
        await Highcharts.chart(container, {
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

// errorbar test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing errorbar'
            },
            series: [{
                type: 'errorbar',
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
        container.innerText = 'errorbar failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load errorbar', e);
    }
})();

// funnel test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing funnel'
            },
            series: [{
                type: 'funnel',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'funnel failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load funnel', e);
    }
})();

// funnel3d test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing funnel3d'
            },
            series: [{
                type: 'funnel3d',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'funnel3d failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load funnel3d', e);
    }
})();

// gauge test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing gauge'
            },
            series: [{
                type: 'gauge',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'gauge failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load gauge', e);
    }
})();

// heatmap test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing heatmap'
            },
            series: [{
                type: 'heatmap',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'heatmap failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load heatmap', e);
    }
})();

// histogram test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing histogram'
            },
            series: [{
                type: 'histogram',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'histogram failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load histogram', e);
    }
})();

// item test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing item'
            },
            series: [{
                type: 'item',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'item failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load item', e);
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
        await Highcharts.chart(container, {
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
        await Highcharts.chart(container, {
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

// networkgraph test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing networkgraph'
            },
            series: [{
                type: 'networkgraph',
                data: [
                    ['A', 'B'],
                    ['A', 'C'],
                    ['A', 'D'],
                    ['B', 'D'],
                    ['C', 'D']
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'networkgraph failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load networkgraph', e);
    }
})();

// organization test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing organization'
            },
            series: [{
                type: 'organization',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'organization failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load organization', e);
    }
})();

// packedbubble test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing packedbubble'
            },
            series: [{
                type: 'packedbubble',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'packedbubble failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load packedbubble', e);
    }
})();

// pareto test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing pareto'
            },
            series: [{
                type: 'pareto',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'pareto failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load pareto', e);
    }
})();

// pictorial test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing pictorial'
            },
            series: [{
                type: 'pictorial',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'pictorial failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load pictorial', e);
    }
})();

// pie test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing pie'
            },
            series: [{
                type: 'pie',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'pie failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load pie', e);
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
        await Highcharts.chart(container, {
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

// pyramid test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing pyramid'
            },
            series: [{
                type: 'pyramid',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'pyramid failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load pyramid', e);
    }
})();

// pyramid3d test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing pyramid3d'
            },
            series: [{
                type: 'pyramid3d',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'pyramid3d failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load pyramid3d', e);
    }
})();

// sankey test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing sankey'
            },
            series: [{
                type: 'sankey',
                data: [
                    ['A', 'B', 1],
                    ['A', 'C', 1],
                    ['A', 'D', 1],
                    ['B', 'D', 1],
                    ['C', 'D', 1]
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'sankey failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load sankey', e);
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
        await Highcharts.chart(container, {
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

// scatter3d test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing scatter3d'
            },
            chart: {
                options3d: {
                    enabled: true
                }
            },
            series: [{
                type: 'scatter3d',
                data: [
                    [1, 2, 3],
                    [2, 3, 4],
                    [3, 4, 5]
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'scatter3d failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load scatter3d', e);
    }
})();

// solidgauge test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing solidgauge'
            },
            series: [{
                type: 'solidgauge',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'solidgauge failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load solidgauge', e);
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
        await Highcharts.chart(container, {
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
        await Highcharts.chart(container, {
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

// sunburst test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing sunburst'
            },
            series: [{
                type: 'sunburst',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'sunburst failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load sunburst', e);
    }
})();

// tilemap test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing tilemap'
            },
            series: [{
                type: 'tilemap',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'tilemap failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load tilemap', e);
    }
})();

// timeline test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing timeline'
            },
            series: [{
                type: 'timeline',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'timeline failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load timeline', e);
    }
})();

// treegraph test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing treegraph'
            },
            series: [{
                type: 'treegraph',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'treegraph failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load treegraph', e);
    }
})();

// treemap test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing treemap'
            },
            series: [{
                type: 'treemap',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'treemap failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load treemap', e);
    }
})();

// variablepie test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing variablepie'
            },
            series: [{
                type: 'variablepie',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'variablepie failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load variablepie', e);
    }
})();

// variwide test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing variwide'
            },
            series: [{
                type: 'variwide',
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
        container.innerText = 'variwide failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load variwide', e);
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
        await Highcharts.chart(container, {
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

// venn test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing venn'
            },
            series: [{
                type: 'venn',
                data: [
                    { sets: ['A'], value: 2 },
                    { sets: ['B'], value: 2 },
                    { sets: ['C'], value: 2 },
                    { sets: ['A', 'B'], value: 1 },
                    { sets: ['A', 'C'], value: 2 },
                    { sets: ['B', 'C'], value: 3 }
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'venn failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load venn', e);
    }
})();

// waterfall test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing waterfall'
            },
            series: [{
                type: 'waterfall',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'waterfall failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load waterfall', e);
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
        await Highcharts.chart(container, {
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

// wordcloud test
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
        await Highcharts.chart(container, {
            title: {
                text: 'Testing wordcloud'
            },
            series: [{
                type: 'wordcloud',
                data: [
                    { name: 'Lorem', weight: 13 },
                    { name: 'Ipsum', weight: 10.5 },
                    { name: 'Dolor', weight: 9.4 },
                    { name: 'Sit', weight: 8 },
                    { name: 'Amet', weight: 6.2 }
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'wordcloud failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load wordcloud', e);
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
        await Highcharts.chart(container, {
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
