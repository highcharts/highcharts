{
    chart: {
        renderTo: 'container'
    },
    
    xAxis: {
        gridLineWidth: 1,
        tickLength: 0,
        lineWidth: 0,
        minorTickInterval: "auto"
    },
    
    yAxis: {
        gridLineWidth: 1,
        minorTickInterval: "auto",
        title: {
            text: null
        }
    },
    
    series: [{
        type: 'area',
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