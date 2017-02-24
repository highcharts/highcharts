
Highcharts.mapChart('container', {
    chart: {
        map: 'custom/europe'
    },

    title: {
        text: 'Nordic countries'
    },

    series: [{
        data: [
            ['is', 1],
            ['no', 1],
            ['se', 1],
            ['dk', 1],
            ['fi', 1]
        ],
        dataLabels: {
            enabled: true,
            formatter: function () {
                return this.point.value ? this.point.name : '';
            }
        },
        showInLegend: false
    }]
});
