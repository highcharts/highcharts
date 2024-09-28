Highcharts.chart('container', {
    chart: {
        type: 'heatmap',
        inverted: false,
        events: {
            load: function () {
                const
                    chart = this,
                    series = chart.series[0],
                    xAxis = series.xAxis,
                    minPadding = xAxis.options.minPadding;

                // setting togglers
                [
                    {
                        id: 'interpolation-toggle',
                        func: e => series.update(
                            { interpolation: e.target.checked }
                        )
                    }, {
                        id: 'data-toggle',
                        func: e => series.update(
                            {
                                data: e.target.checked ?
                                    [
                                        { x: 0, y: 0, value: 1 },
                                        { x: 1, y: 1, value: 20 },
                                        { x: 2, y: 2, value: 12 },
                                        { x: 3, y: 3, value: 8 }
                                    ] :
                                    JSON.parse(
                                        document
                                            .getElementById('data')
                                            .innerText
                                    )
                            }
                        )
                    }, {
                        id: 'y-toggle',
                        func: e => series.yAxis.update(
                            { reversed: e.target.checked }
                        )
                    }, {
                        id: 'x-toggle',
                        func: e => xAxis.update(
                            { reversed: e.target.checked }
                        )
                    }, {
                        id: 'inv-toggle',
                        func: e => chart.update(
                            { chart: { inverted: e.target.checked } }
                        )
                    }
                ].forEach(({ id, func }) => {
                    document
                        .getElementById(id)
                        .addEventListener('click', func);
                });

                if (!minPadding) {
                    xAxis.options.minPadding = 0;
                }

                [
                    {
                        input: 'padMin',
                        output: 'padMinOut',
                        multiplier: 1.0 / 800,
                        callback: value => {
                            xAxis.update({ minPadding: value }, false);
                            series.isDirtyData = true;
                            chart.redraw();
                        }
                    },
                    {
                        input: 'col-range',
                        output: 'col-slider-output',
                        multiplier: 36e5,
                        callback: value => series.update({ colsize: value })
                    }
                ].forEach(entry => {
                    const
                        { input, callback, output, multiplier } = entry,
                        [ctrl, disp] = [
                            input,
                            output
                        ].map(s => document.getElementById(s));

                    disp.innerHTML = `${ctrl.value} * ${multiplier}`;

                    ctrl.addEventListener('input', () => {
                        disp.innerHTML = `${ctrl.value} * ${multiplier}`;
                        callback(ctrl.value * multiplier);
                    });
                });
            }
        }
    },

    title: {
        text: 'Highcharts interpolation study'
    },

    xAxis: {
        type: 'datetime',
        minPadding: 0,
        maxPadding: 0
    },

    colorAxis: {
        stops: [
            [0, '#3060cf'],
            [0.5, '#fffbbc'],
            [0.9, '#c4463a']
        ],
        min: -5,
        max: 25
    },

    series: [{
        colsize: 24 * 36e5, // one day
        data: JSON.parse(document.getElementById('data').innerText),
        interpolation: true
    }]
});
