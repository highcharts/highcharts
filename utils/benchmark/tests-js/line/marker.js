{
    chart: {
        renderTo: 'container'
    },

    series: [{
        type: 'line',
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 0; j < 50; j++) {
                arr.push(j);
            }
            return arr;
        }())
    }]

}