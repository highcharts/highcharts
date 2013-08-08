{
    chart: {
        renderTo: 'container'
    },
    
    title: {
        text: null
    },
    
    credits: {
        enabled: false
    },
    
    xAxis: {
        labels: {
            enabled: false
        },
        tickLength: 0,
        lineWidth: 0
    },
    
    yAxis: {
        labels: {
            enabled: false
        },
        gridLineWidth: 0,
        title: {
            text: null
        }
    },
    
    legend: {
        enabled: false
    },

    tooltip: {
        enabled: false
    },

    plotOptions: {
        series: {
            stacking: 'percent'
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
        }()),
        marker: {
             enabled: false
        }
    }, 
    {
        type: 'area',
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 100; j < 200; j++) {
                arr.push(j);
            }
            return arr;
        }()),
        marker: {
             enabled: false
        }
    }, 
    {
        type: 'area',
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 200; j < 300; j++) {
                arr.push(j);
            }
            return arr;
        }()),
        marker: {
             enabled: false
        }
    }, 
    {
        type: 'area',
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 300; j < 400; j++) {
                arr.push(j);
            }
            return arr;
        }()),
        marker: {
             enabled: false
        }
    }, 
    {
        type: 'area',
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 500; j < 600; j++) {
                arr.push(j);
            }
            return arr;
        }()),
        marker: {
             enabled: false
        }
    }]

}