
Highcharts.chart('container', {

    chart: {
        type: 'pie',
        width: 500,
        borderWidth: 2
    },

    title: {
        text: 'Legend styled by CSS'
    },

    credits: {
        enabled: false
    },

    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        y: 30,
        title: {
            text: 'Male name'
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