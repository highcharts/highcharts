{
    chart: {
        renderTo: 'container'
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