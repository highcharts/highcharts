let success = 0,
    failed = 0;

// gantt test
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
        await Highcharts.ganttChart(container, {
            title: {
                text: 'Testing gantt'
            },
            series: [{
                type: 'gantt',
                data: [
                    { start: 1, end: 2, y: 0 },
                    { start: 1, end: 3, y: 1 },
                    { start: 2, end: 5, y: 2 }
                ]
            }]
        });
        success++;
        document.getElementById('success').innerText = success;
    } catch (e) {
        container.innerText = 'gantt failed';
        container.className += ' failed';
        failed++;
        document.getElementById('failed').innerText = failed;
        console.error('Failed to load gantt', e);
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
        await Highcharts.ganttChart(container, {
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
