{
    chart: {
        renderTo: 'container'
    },

    series: [{
        type: 'scatter',
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 0; j < 100; j++) {
                arr.push(j);
            }
            return arr;
        }())
    }]

}