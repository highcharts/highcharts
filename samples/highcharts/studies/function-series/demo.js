// FUNCTION SERIES DEFINITION
(function (Highcharts) {
    // create shortcuts
    const defaultOptions = Highcharts.getOptions(),
        defaultPlotOptions = defaultOptions.plotOptions,
        seriesTypes = Highcharts.Series.types,
        merge = Highcharts.merge,
        each = Highcharts.each;

    defaultPlotOptions.functionseries = merge(defaultPlotOptions.line, {
        marker: {
            enabled: false
        }
    });

    seriesTypes.functionseries = Highcharts.extendClass(
        Highcharts.Series.types.line,
        {
            type: 'functionseries',

            setData: function () {
                const series = this,
                    dataFunction = series.options.dataFunction,
                    xAxis = series.xAxis,
                    points = xAxis.len,
                    min = xAxis.userMin || series.options.min,
                    max = xAxis.userMax || series.options.max,
                    data = [];

                let x,
                    y;

                for (let i = 0; i < points; i += 1) {
                    x = min + (i * ((max - min) / points));
                    y = dataFunction(x);
                    data.push([x, y]);
                }

                arguments[0] = data;

                Highcharts.Series.prototype.setData.apply(this, arguments);
            },
            bindAxes: function () {
                Highcharts.Series.prototype.bindAxes.apply(this, arguments);
                const series = this,
                    xAxis = this.xAxis;

                xAxis.setExtremes = function ()  {
                    Highcharts.Axis.prototype.setExtremes
                        .apply(this, arguments);
                    series.setData([]);
                };
            }

        }
    );

    Highcharts.wrap(Highcharts.Chart.prototype, 'init', function (proceed) {
        proceed.apply(this, [].slice.call(arguments, 1));

        each(this.series, function (serie) {
            if (serie.type === 'functionseries') {
                serie.setData([]);
            }
        });

    });
}(Highcharts));
// END OF FUNCTION SERIES

const scatterData = [];

for (let i = 0; i < 100; i += 0.1) {
    scatterData.push([i, Math.sin(i / 10) + Math.random() - 0.5]);
}

Highcharts.chart('container', {
    chart: {
        zoomType: 'x'
    },
    title: {
        text: 'Measured vs Expected Data'
    },
    subtitle: {
        text: 'y = sin(x)'
    },
    series: [{
        type: 'scatter',
        name: 'Measured',
        data: scatterData,
        marker: {
            radius: 1
        }
    }, {
        type: 'functionseries',
        name: 'Expected',
        min: 0,
        max: 100,
        dataFunction: function (x) {
            return Math.sin(x / 10);
        }
    }]
});