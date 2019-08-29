QUnit.test('Chart update with map', assert => {
    const options1 = {
        chart: {
            map: 'custom/europe',
            borderWidth: 1
        },

        series: [{
            data: [
                ['is', 1],
                ['no', 1],
                ['se', 1]
            ]
        }]
    };

    const options2 = {
        series: [{
            data: [
                ['is', 1]
            ]
        }]
    };

    const chart = Highcharts.mapChart('container', options1);

    const getAttribs = attr => ({
        iceland: chart.container.querySelector('.highcharts-key-is')
            .getAttribute(attr),
        norway: chart.container.querySelector('.highcharts-key-no')
            .getAttribute(attr),
        germany: chart.container.querySelector('.highcharts-key-de')
            .getAttribute(attr)
    });


    const originalPaths = getAttribs('d');

    assert.deepEqual(
        getAttribs('fill'),
        {
            germany: '#f7f7f7',
            iceland: '#7cb5ec',
            norway: '#7cb5ec'
        },
        'Fill colors should reflect data'
    );

    chart.update(options2);

    assert.deepEqual(
        getAttribs('d'),
        originalPaths,
        'Paths should stay fixed when data values change'
    );

    assert.deepEqual(
        getAttribs('fill'),
        {
            germany: '#f7f7f7',
            iceland: '#7cb5ec',
            norway: '#f7f7f7'
        },
        'Fill colors should reflect data'
    );
});