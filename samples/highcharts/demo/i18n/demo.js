function renderChart() {
    Highcharts.chart('container', {
        chart: {
            type: 'column',
            zooming: {
                type: 'x'
            },
            events: {
                render: function () {
                    setTimeout(() => this.hideLoading(), 1000);
                }

            }
        },
        xAxis: {
            type: 'datetime',
            dateTimeLabelFormats: {
                month: '%[BY]'
            }
        },
        series: [
            {
                data: [
                    [1262304000000, 1],
                    [1264982400000, 2],
                    [1267401600000, 3],
                    [1270080000000, 4],
                    [1272672000000, 5],
                    [1275350400000, 6],
                    [1277942400000, 7],
                    [1280620800000, 8],
                    [1283299200000, 9],
                    [1285891200000, 10],
                    [1288569600000, 11],
                    [1291161600000, 12]
                ]
            },
            {
                data: [
                    [1262304000000, 2],
                    [1264982400000, 1],
                    [1267401600000, 4],
                    [1270080000000, 5],
                    [1272672000000, 2],
                    [1275350400000, 1],
                    [1277942400000, 2],
                    [1280620800000, 5],
                    [1283299200000, 6],
                    [1285891200000, 7],
                    [1288569600000, 1],
                    [1291161600000, 2]
                ]
            }
        ]
    },
    function () {
        this.showLoading();
    });
}

renderChart();

document.querySelector('select#lang-select')
    .addEventListener('change', async function (e) {
        const lang = e.target.value === 'default' ? 'lang' : e.target.value;
        const src = `https://code.highcharts.com/i18n/${lang}.json`;

        const langOptions = await fetch(src)
            .then(response => response.json());

        Highcharts.setOptions({
            lang: langOptions
        });

        document.querySelector('#container').setAttribute('lang', lang);

        // As the lang object is global we need to fully re-render the chart
        renderChart();
    });
