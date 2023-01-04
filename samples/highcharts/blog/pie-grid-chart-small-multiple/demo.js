/* Colors */
var liberal = '#EE696B',
    conservative = '#5A98EA',
    newDemocratic = '#F8A166',
    blocQuebecios = '#80D0F8',
    green = '#99C85F';
var titleStyle = '10px';
const heightChart = 100,
    titleMargin = 0,
    borderWidth = 1;

Highcharts.chart('nl', {
    title: { text: 'NL', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 7 },
            { name: 'Conservative', color: conservative, y: 0 },
            { name: 'New Democratic', color: newDemocratic, y: 0 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 0 }]
    }]
});
Highcharts.chart('ns', {
    title: { text: 'NS', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 11 },
            { name: 'Conservative', color: conservative, y: 0 },
            { name: 'New Democratic', color: newDemocratic, y: 0 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 0 }]
    }]
});
Highcharts.chart('nb', {
    title: { text: 'NB', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 10 },
            { name: 'Conservative', color: conservative, y: 0 },
            { name: 'New Democratic', color: newDemocratic, y: 0 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 0 }]
    }]
});
Highcharts.chart('qc', {
    title: { text: 'Québec', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 40 },
            { name: 'Conservative', color: conservative, y: 12 },
            { name: 'New Democratic', color: newDemocratic, y: 16 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 10 },
            { name: 'Green', color: green, y: 0 }]
    }]
});
Highcharts.chart('on', {
    title: { text: 'Ontario', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 80 },
            { name: 'Conservative', color: conservative, y: 33 },
            { name: 'New Democratic', color: newDemocratic, y: 8 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 0 }]
    }]
});
Highcharts.chart('mb', {
    title: { text: 'Manitoba', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 7 },
            { name: 'Conservative', color: conservative, y: 5 },
            { name: 'New Democratic', color: newDemocratic, y: 2 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 0 }]
    }]
});
Highcharts.chart('sk', {
    title: { text: 'Saskatchewan', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 1 },
            { name: 'Conservative', color: conservative, y: 10 },
            { name: 'New Democratic', color: newDemocratic, y: 3 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 0 }]
    }]
});
Highcharts.chart('ab', {
    title: { text: 'Alberta', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 4 },
            { name: 'Conservative', color: conservative, y: 29 },
            { name: 'New Democratic', color: newDemocratic, y: 1 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 0 }]
    }]
});
Highcharts.chart('bc', {
    title: { text: 'BC', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 17 },
            { name: 'Conservative', color: conservative, y: 10 },
            { name: 'New Democratic', color: newDemocratic, y: 14 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 1 }]
    }]
});
Highcharts.chart('nt', {
    title: { text: 'NT', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 1 },
            { name: 'Conservative', color: conservative, y: 0 },
            { name: 'New Democratic', color: newDemocratic, y: 0 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 0 }]
    }]
});
Highcharts.chart('yt', {
    title: { text: 'Yukon', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 1 },
            { name: 'Conservative', color: conservative, y: 0 },
            { name: 'New Democratic', color: newDemocratic, y: 0 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 0 }]
    }]
});
Highcharts.chart('nu', {
    title: { text: 'Nunavut', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    redits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 1 },
            { name: 'Conservative', color: conservative, y: 0 },
            { name: 'New Democratic', color: newDemocratic, y: 0 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 0 }]
    }]
});
Highcharts.chart('pe', {
    title: { text: 'P.E.I.', style: { fontSize: titleStyle }, margin: titleMargin },
    chart: { type: 'pie', height: heightChart + '%', borderWidth: borderWidth },
    credits: { enabled: false },
    tooltip: { headerFormat: '{point.key}: <b>{point.y}</b>', pointFormat: '' },
    plotOptions: { pie: { allowPointSelect: true, cursor: 'pointer', borderWidth: 0, borderColor: null, dataLabels: { enabled: false }, showInLegend: false } },
    series: [{
        name: 'Seats',
        colorByPoint: true,
        data: [
            { name: 'Liberal', color: liberal, y: 1 },
            { name: 'Conservative', color: conservative, y: 0 },
            { name: 'New Democratic', color: newDemocratic, y: 0 },
            { name: 'Bloc Québécois', color: blocQuebecios, y: 0 },
            { name: 'Green', color: green, y: 0 }]
    }]
});