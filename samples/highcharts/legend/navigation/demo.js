$(function () {
    $('#container').highcharts({

        chart: {
            type: 'pie',
            width: 500,
            borderWidth: 2
        },

        title: {
            text: 'Legend navigation demo'
        },

        credits: {
            enabled: false
        },

        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'top',
            y: 30,
            navigation: {
                activeColor: '#3E576F',
                animation: true,
                arrowSize: 12,
                inactiveColor: '#CCC',
                style: {
                    fontWeight: 'bold',
                    color: '#333',
                    fontSize: '12px'
                }
            }
        },

        series: [{
            data: (function () {
                var names = 'Ari,Bjartur,Bogi,Bragi,Dánjal,Dávur,Eli,Emil,Fróði,Hákun,Hanus,Hjalti,Ísakur,' +
                    'Johan,Jóhan,Julian,Kristian,Leon,Levi,Magnus,Martin,Mattias,Mikkjal,Nóa,Óli,Pauli,Petur,Rói,Sveinur,Teitur',
                    arr = [];

                Highcharts.each(names.split(','), function (name) {
                    arr.push({
                        name: name,
                        y: Math.round(Math.random() * 100)
                    });
                });

                return arr;
            }()),
            showInLegend: true
        }]

    });
});