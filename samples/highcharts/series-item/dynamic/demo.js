Highcharts.chart('container', {

    chart: {
        type: 'item'
    },

    title: {
        text: 'Highcharts item chart'
    },

    subtitle: {
        text: 'Parliament visualization'
    },

    legend: {
        labelFormat: '{name} <span style="opacity: 0.4">{y}</span>'
    },

    series: [{
        name: 'Representatives',
        keys: ['name', 'y', 'color', 'label'],
        data: [
            ['The Left', 69, '#BE3075', 'DIE LINKE'],
            ['Social Democratic Party', 153, '#EB001F', 'SPD'],
            ['Alliance 90/The Greens', 67, '#64A12D', 'GRÜNE'],
            ['Free Democratic Party', 80, '#FFED00', 'FDP'],
            ['Christian Democratic Union', 200, '#000000', 'CDU'],
            ['Christian Social Union in Bavaria', 46, '#008AC5', 'CSU'],
            ['Alternative for Germany', 94, '#009EE0', 'AfD']
        ],
        dataLabels: {
            enabled: true,
            format: '{point.label}'
        },

        // Circular options
        center: ['50%', '88%'],
        size: '170%',
        startAngle: -100,
        endAngle: 100
    }]

});

document.getElementById('gb').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        data: [
            ['Conservative', 318],
            ['Labour', 262],
            ['Scottish National Party', 35],
            ['Liberal Democrat', 12],
            ['Democratic Unionist Party', 10],
            ['Sinn Fein', 7],
            ['Plaid Cymru', 4],
            ['Green Party', 1],
            ['Others', 1]
        ],

        dataLabels: {
            enabled: false
        }
    });
});

document.getElementById('de').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        data: [
            ['The Left', 69, '#BE3075', 'DIE LINKE'],
            ['Social Democratic Party', 153, '#EB001F', 'SPD'],
            ['Alliance 90/The Greens', 67, '#64A12D', 'GRÜNE'],
            ['Free Democratic Party', 80, '#FFED00', 'FDP'],
            ['Christian Democratic Union', 200, '#000000', 'CDU'],
            ['Christian Social Union in Bavaria', 46, '#008AC5', 'CSU'],
            ['Alternative for Germany', 94, '#009EE0', 'AfD']
        ],

        dataLabels: {
            enabled: true
        }
    });
});

document.getElementById('no').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        data: [
            ['Rødt', 1, '#851914', 'R'],
            ['Sosialistisk Venstreparti', 11, '#B0185B', 'SV'],
            ['Arbeiderpartiet', 49, '#C6191D', 'AP'],
            ['Senterpartiet', 19, '#5CA92E', 'SP'],
            ['Miljøpartiet De Grønne', 1, '#024B26', 'MDG'],
            ['Kristelig Folkeparti', 8, '#F9B234', 'KrF'],
            ['Venstre', 8, '#036766', 'V'],
            ['Høyre', 45, '#4677BA', 'H'],
            ['Fremskrittspartiet', 27, '#262955', 'FrP']
        ],
        dataLabels: {
            enabled: true
        }
    });
});

document.getElementById('parliament').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        center: ['50%', '88%'],
        size: '170%',
        startAngle: -100,
        endAngle: 100
    });
});

document.getElementById('rectangle').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        startAngle: null,
        endAngle: null
    });
});

document.getElementById('circle').addEventListener('click', function () {
    Highcharts.charts[0].series[0].update({
        center: ['50%', '50%'],
        size: '100%',
        startAngle: 0,
        endAngle: 360
    });
});

document.getElementById('rows').addEventListener('change', function () {
    Highcharts.charts[0].series[0].update({
        rows: Number(this.value)
    });
});

document.getElementById('innersize').addEventListener('change', function () {
    Highcharts.charts[0].series[0].update({
        innerSize: this.value + '%'
    });
});
