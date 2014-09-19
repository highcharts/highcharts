{
    chart: {
        renderTo: 'container'
    },

    series: [{
        type: 'pie',
        showInLegend: true,
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 0; j < 16; j++) {
                arr.push(1);
            }
            return arr;
        }()),
        dataLabels: {
            enabled: false
        }
    }]

}