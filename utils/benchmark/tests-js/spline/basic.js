{
    chart: {
        renderTo: 'container'
    },

    series: [{
        type: 'spline',
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 0; j < 40; j++) {
                arr.push(j);
            }
            return arr;
        }())
    }]

}