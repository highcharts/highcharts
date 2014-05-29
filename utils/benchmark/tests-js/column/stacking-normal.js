{
    chart: {
        renderTo: 'container',
        type: 'column'
    },
    
    plotOptions: {
        series: {
            stacking: 'normal'
        }
    },

    series: [{
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 0; j < 20; j++) {
                arr.push(j);
            }
            return arr;
        }())
    }, 
    {
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 0; j < 20; j++) {
                arr.push(j);
            }
            return arr;
        }())
    }, 
    {
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 0; j < 20; j++) {
                arr.push(j);
            }
            return arr;
        }())
    }, 
    {
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 0; j < 20; j++) {
                arr.push(j);
            }
            return arr;
        }())
    }, 
    {
        animation: false,
        data: (function () {
            var arr = [];
            for (var j = 0; j < 20; j++) {
                arr.push(j);
            }
            return arr;
        }())
    }]

}