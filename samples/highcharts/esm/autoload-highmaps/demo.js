let success = 0,
    failed = 0;

// flowmap test
(async () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    try {
        await Highcharts.mapChart(container, {
            title: {
                text: 'Testing flowmap'
            },
            series: [{
                type: 'flowmap',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'flowmap failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load flowmap', e);
    }
})();

// geoheatmap test
(async () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    try {
        await Highcharts.mapChart(container, {
            title: {
                text: 'Testing geoheatmap'
            },
            series: [{
                type: 'geoheatmap',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'geoheatmap failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load geoheatmap', e);
    }
})();

// heatmap test
(async () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    try {
        await Highcharts.mapChart(container, {
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

// map test
(async () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    try {
        await Highcharts.mapChart(container, {
            title: {
                text: 'Testing map'
            },
            series: [{
                type: 'map',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'map failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load map', e);
    }
})();

// mapbubble test
(async () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    try {
        await Highcharts.mapChart(container, {
            title: {
                text: 'Testing mapbubble'
            },
            series: [{
                type: 'mapbubble',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'mapbubble failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load mapbubble', e);
    }
})();

// mapline test
(async () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    try {
        await Highcharts.mapChart(container, {
            title: {
                text: 'Testing mapline'
            },
            series: [{
                type: 'mapline',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'mapline failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load mapline', e);
    }
})();

// mappoint test
(async () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    try {
        await Highcharts.mapChart(container, {
            title: {
                text: 'Testing mappoint'
            },
            series: [{
                type: 'mappoint',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'mappoint failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load mappoint', e);
    }
})();

// pie test
(async () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    try {
        await Highcharts.mapChart(container, {
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

// tiledwebmap test
(async () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    try {
        await Highcharts.mapChart(container, {
            title: {
                text: 'Testing tiledwebmap'
            },
            series: [{
                type: 'tiledwebmap',
                data: [1, 3, 2, 4]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'tiledwebmap failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load tiledwebmap', e);
    }
})();

// tilemap test
(async () => {
    const container = document.createElement('div');
    container.className = 'test-container';
    document.getElementById('container').appendChild(container);
    const { default: Highcharts } = await import(
        'https://code.highcharts.com/esm/highcharts-autoload.js'
    );

    try {
        await Highcharts.mapChart(container, {
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
