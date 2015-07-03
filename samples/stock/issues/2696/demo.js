$(function () {
    $('#container').highcharts('StockChart', {

        chart: {
            width: 600,
            height: 250,
            type: 'area'
        },

        title: {
            text: 'Highstock <= 1.3.9: Data grouping included single point immediately to the left of zoomed range.'
        },

        xAxis: {
            min: Date.UTC(2004, 0, 11, 12)
        },
        series: [{
            data: [
                [1073433600000,1],
                [1073520000000,1],
                [1073606400000,1],
                [1073692800000,1],
                [1073779200001,0.99999], // This point is included in the week from Jan 12, 2004 when "From" date in rangeSelector is set to Jan 11, 2004
                [1073865600000,1], // Jan 12, 2004
                [1073952000000,1],
                [1074038400000,1],
                [1074124800000,1],
                [1074211200000,1],
                [1074297600000,1],
                [1074384000000,1],
                [1074470400000,1],
                [1074556800000,1],
                [1074643200000,1],
                [1074729600000,1],
                [1074816000000,1],
                [1074902400000,1],
                [1074988800000,1],
                [1075075200000,1],
                [1075161600000,1],
                [1075248000000,1],
                [1075334400000,1],
                [1075420800000,1],
                [1075507200000,1],
                [1075593600000,1],
                [1075680000000,1],
                [1075766400000,1]
            ],
            dataGrouping: {
                enabled: true,
                forced: true,
                units: [
                    [
                        'week',
                        [1]
                    ]
                ],
                approximation: 'sum'
            }
        }]
    });
});
