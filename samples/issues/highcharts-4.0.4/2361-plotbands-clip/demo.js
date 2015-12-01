$(function () {


    $('#container').highcharts({

        xAxis: {
            minRange: 1,
            plotBands: [{
                color: '#FCFFC5',
                from: 1,
                to: 3,
                label:{
                    text: "I will dissapear if you zoom in <br/>so the start of the band isn't visible"
                }
            }]
        },

        yAxis: {
            gridLineWidth: 0
        },

        series: [{
            type:"column",
            data: [1,2,3,4,5,6],
            pointPlacement: "between"
        }]
    });

    $('#zoom-in').click(function () {
        $('#container').highcharts().xAxis[0].setExtremes(2, 5);
    });
});