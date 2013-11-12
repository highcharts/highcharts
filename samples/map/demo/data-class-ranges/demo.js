$(function () {

    


    // Load the data from a Google Spreadsheet 
    // https://docs.google.com/a/highsoft.com/spreadsheet/pub?hl=en_GB&hl=en_GB&key=0AoIaUO7wH1HwdFJHaFI4eUJDYlVna3k5TlpuXzZubHc&output=html
    Highcharts.data({

        
        googleSpreadsheetKey: '0AoIaUO7wH1HwdFJHaFI4eUJDYlVna3k5TlpuXzZubHc',
        
        // custom handler when the spreadsheet is parsed
        parsed: function (columns) {
            
            // Read the columns into the data array
            var data = [];
            $.each(columns[0], function (i, code) {
                data.push({
                    code: code.toUpperCase(),
                    value: parseFloat(columns[2][i]),
                    name: columns[1][i]
                })
            });

            
            // Initiate the chart
            $('#container').highcharts('Map', {
                chart : {
                    borderWidth : 1
                },
                
                title : {
                    text : 'Population density by country (/km²)'
                },

                mapNavigation: {
                    enabled: true
                },
                
                legend: {
                    title: {
                        text: 'Individuals per km²'
                    },
                    align: 'left',
                    verticalAlign: 'bottom',
                    floating: true,
                    layout: 'vertical',
                    valueDecimals: 0,
                    backgroundColor: 'rgba(255,255,255,0.9)'
                },

                colorAxis: {
                    dataClasses: [{
                        to: 3,
                        color: 'rgba(19,64,117,0.05)'
                    }, {
                        from: 3,
                        to: 10,
                        color: 'rgba(19,64,117,0.2)'
                    }, {
                        from: 10,
                        to: 30,
                        color: 'rgba(19,64,117,0.4)'
                    }, {
                        from: 30,
                        to: 100,
                        color: 'rgba(19,64,117,0.5)'
                    }, {
                        from: 100,
                        to: 300,
                        color: 'rgba(19,64,117,0.6)'
                    }, {
                        from: 300,
                        to: 1000,
                        color: 'rgba(19,64,117,0.8)'
                    }, {
                        from: 1000,
                        color: 'rgba(19,64,117,1)'
                    }]
                },

                series : [{
                    data : data,
                    mapData: Highcharts.maps.world,
                    joinBy: 'code',
                    name: 'Population density',
                    states: {
                        hover: {
                            color: '#BADA55'
                        }
                    },
                    tooltip: {
                        valueSuffix: '/km²'
                    },
                }]
            });
        }
    });
});