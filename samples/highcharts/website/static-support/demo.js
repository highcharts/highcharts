Math.easeInSine = function (pos) {
    return -Math.cos(pos * (Math.PI / 2)) + 1;
};

Math.easeOutQuint = function (pos) {
    return (Math.pow((pos - 1), 5) + 1);
};
// Math.easeInQuint = function (pos) {
//     return Math.pow(pos, 5);
// },

Math.easeOutBounce = pos => {
    if ((pos) < (1 / 2.75)) {
        return (7.5625 * pos * pos);
    }
    if (pos < (2 / 2.75)) {
        return (7.5625 * (pos -= (1.5 / 2.75)) * pos + 0.75);
    }
    if (pos < (2.5 / 2.75)) {
        return (7.5625 * (pos -= (2.25 / 2.75)) * pos + 0.9375);
    }
    return (7.5625 * (pos -= (2.625 / 2.75)) * pos + 0.984375);
};

const text = 'Highcharts Sonification dynamic organization chart NetworkGraph candlestick dynamic zoom Highcharts .NET wordcloud Local Export Server  Labels live-data example columns xAxis candlestick  x-axis Windrose table data series  tooltip y-axis  Synchronize Highcharts.Point Barchart Text Navigator width dynamically    windbarbs  dataseries type angular Tooltip horizontally series  HighChart Heatmap.  Export   Export  JSON  value candlestick yAxis  yAxis crosshair  tickPositions  drilldown graph Dotnet Highcharts LegendItemClick  line chart color Stacked waterfall chart time series xAxis. Highcharts server PhantomJs  Radial Gradient Gauge Exporting  Date format xAxis Stairs lines Gradient plotline  crosshair barchart areachart  Treemap',
    lines = text.split(/[,\. ]+/u),
    data = lines.reduce((arr, word) => {
        let obj = Highcharts.find(arr, obj => obj.name === word);
        if (obj) {
            obj.weight += 1;
        } else {
            obj = {
                name: word,
                weight: 1
            };
            arr.push(obj);
        }
        return arr;
    }, []);

const words = {
    chart: {
        animation: {
            enabled: true,
            duration: 5000,
            easing: 'easeOutQuint'
        },
        events: {
            load: function () {
                const chart = this;
                chart.series[0].data[0].update({
                    opacity: 1,
                    color: 'transparent'
                });

            }
        },
        styledMode: false,
        margin: 0
    },
    colors: ['#8087E8', '#A3EDBA', '#87B4E7'],
    title: {
        text: `<div class="title-container">
                  <p>popular words from the</p>
                    <h1>Highcharts</h1>
                    <p>forum</p>
                   
                </div>`,
        useHTML: true,
        verticalAlign: 'middle',
        y: 20
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        enabled: true
    },
    plotOptions: {
        series: {
            borderWidth: 0,
            animation: false,
            opacity: 1,
            fillOpacity: 1,
            dataLabels: {
                enabled: true,
                crop: false
            },
            marker: {
                enabled: false,
                allowOverlap: true
            },
            states: {
                hover: {
                    enabled: false
                },
                inactive: {
                    enabled: false
                }
            },
            lineColor: 'transparent'
        }
    },
    series: [
        {
            type: 'wordcloud',
            maxFontSize: 33,
            opacity: 0.8,
            minFontSize: 9,
            data,
            name: 'Occurrences'
        }
    ]

};

Highcharts.chart('support', words);
