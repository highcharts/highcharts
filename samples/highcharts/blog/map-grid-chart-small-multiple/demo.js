/* Colors */
var liberal = '#EE696B',
    conservative = '#5A98EA',
    newDemocratic = '#F8A166',
    blocQuebecios = '#80D0F8',
    green = '#99C85F';

var parties = [{
        name: 'Liberal',
        color: liberal
    }, {
        name: 'Conservative',
        color: conservative
    }, {
        name: 'NewDemocratic',
        color: newDemocratic
    }, {
        name: 'Bloc Québécois',
        color: blocQuebecios
    }, {
        name: 'Green',
        color: green
    }],
    seats = [{
        bc: '<b>Number of seats per party</b> <br/>',
        data: [17, 10, 14, 0, 1]
    },
    {
        ab: '<b>Number of seats per party</b>  <br/>',
        data: [4, 29, 1, 0, 0]
    },
    {
        sk: '<b>Number of seats per party</b>  <br/>',
        data: [1, 10, 3, 0, 0]
    },
    {
        mb: '<b>Number of seats per party</b>  <br/>',
        data: [7, 5, 2, 0, 0]
    },
    {
        on: '<b>Number of seats per party</b>  <br/>',
        data: [80, 33, 8, 0, 0]
    },
    {
        qc: '<b>Number of seats per party</b>  <br/>',
        data: [40, 12, 16, 10, 0]
    },
    {
        nb: '<b>Number of seats per party</b>  <br/>',
        data: [10, 0, 0, 0, 0]
    },
    {
        ns: '<b>Number of seats per party</b>  <br/>',
        data: [11, 0, 0, 0, 0]
    },
    {
        pe: '<b>Number of seats per party</b>  <br/>',
        data: [4, 0, 0, 0, 0]
    },
    {
        nl: '<b>Number of seats per party</b>  <br/>',
        data: [7, 0, 0, 0, 0]
    },
    {
        yt: '<b>Number of seats per party</b>  <br/>',
        data: [1, 0, 0, 0, 0]
    },
    {
        nt: '<b>Number of seats per party</b>  <br/>',
        data: [1, 0, 0, 0, 0]
    },
    {
        nu: '<b>Number of seats per party</b>  <br/>',
        data: [1, 0, 0, 0, 0]
    }
    ];
var bc = 0,
    ab = 1,
    sk = 2,
    mb = 3,
    on = 4,
    qc = 5,
    nb = 6,
    ns = 7,
    pe = 8,
    nl = 9,
    yt = 10,
    nt = 11,
    nu = 12;

for (let i = 0; i < seats.length; i++) {
    for (let j = 0; j < seats[i].data.length; j++) {
        seats[i][Object.keys(seats[i])[0]] = seats[i][Object.keys(seats[i])[0]] + '<span style="color:' + parties[j].color + '">\u25CF</span>' + parties[j].name + ' ' + seats[i].data[j] + '<br>';
    }
}
var titleStyle = '14px';

Highcharts.mapChart('nl', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'Newfoundland and Labrador', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[nl][Object.keys(seats[nl])[0]];
        }
    },
    series: [{
        data: [
            ['ca-nl', 5]
        ],
        color: liberal,
        name: null,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('ns', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'Nova Scotia', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[ns][Object.keys(seats[ns])[0]];
        }
    },
    series: [{
        data: [
            ['ca-ns', 11]
        ],
        name: null,
        color: liberal,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('nb', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'New Brunswick', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[nb][Object.keys(seats[nb])[0]];
        }
    },
    series: [{
        data: [
            ['ca-nb', 10]
        ],
        name: null,
        color: liberal,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('qc', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'Québec', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[qc][Object.keys(seats[qc])[0]];
        }
    },
    series: [{
        data: [
            ['ca-qc', 1]
        ],
        name: null,
        color: liberal,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('on', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'Ontario', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[on][Object.keys(seats[on])[0]];
        }
    },
    series: [{
        data: [
            ['ca-on', 1]
        ],
        name: null,
        color: liberal,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('mb', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'Manitoba', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[mb][Object.keys(seats[mb])[0]];
        }
    },
    series: [{
        data: [
            ['ca-mb', 1]
        ],
        name: null,
        color: liberal,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('sk', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'Saskatchewan', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[sk][Object.keys(seats[sk])[0]];
        }
    },
    series: [{
        data: [
            ['ca-sk', 1]
        ],
        name: null,
        color: conservative,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('ab', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'Alberta', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[ab][Object.keys(seats[ab])[0]];
        }
    },
    series: [{
        data: [
            ['ca-ab', 1]
        ],
        name: null,
        color: conservative,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('bc', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'British Columbia', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[bc][Object.keys(seats[bc])[0]];
        }
    },
    series: [{
        data: [
            ['ca-bc', 1]
        ],
        name: null,
        color: liberal,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('nt', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'Northwest Territories', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[nt][Object.keys(seats[nt])[0]];
        }
    },
    series: [{
        data: [
            ['ca-nt', 1]
        ],
        name: null,
        color: liberal,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('yt', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'Yukon', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[yt][Object.keys(seats[yt])[0]];
        }
    },
    series: [{
        data: [
            ['ca-yt', 1]
        ],
        name: null,
        color: liberal,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('nu', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'Nunavut', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[nu][Object.keys(seats[nu])[0]];
        }
    },
    series: [{
        data: [
            ['ca-nu', 1]
        ],
        name: null,
        color: liberal,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
Highcharts.mapChart('pe', {
    chart: {
        map: 'countries/ca/ca-all'
    },
    title: {
        text: 'Prince Edward Island', style: { fontSize: titleStyle }
    },
    subtitle: {
        text: null
    },
    legend: {
        enabled: false
    },
    credits: {
        enabled: false
    },
    tooltip: {
        formatter: function () {
            return seats[pe][Object.keys(seats[pe])[0]];
        }
    },
    series: [{
        data: [
            ['ca-pe', 1]
        ],
        name: null,
        color: liberal,
        allAreas: false,
        dataLabels: {
            enabled: false
        }
    }]
});
