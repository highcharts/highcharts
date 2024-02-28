function renderChart() {
    Highcharts.chart('container', {
        xAxis: {
            type: 'datetime'
        },
        series: [
            {
                data: [
                    [Date.UTC(2010, 0, 1), 29.9],
                    [Date.UTC(2010, 2, 1), 71.5],
                    [Date.UTC(2010, 3, 1), 106.4],
                    [Date.UTC(2010, 4, 1), 129.2]
                ]
            }
        ]
    });
}

renderChart();

// Save the default language options
const defaultLangOptions =
    JSON.parse(JSON.stringify(Highcharts.defaultOptions.lang));

document.querySelector('select#lang-select').addEventListener('change', async function (e) {
    const lang = e.target.value;

    if (lang === 'default') {
        Highcharts.setOptions({
            lang: defaultLangOptions
        });
    } else {
        const src = `https://code.highcharts.com/i18n/${lang}.json`;

        const langOptions = await fetch(src)
            .then(response => response.json());

        Highcharts.setOptions({
            lang: langOptions
        });
    }

    // As the lang object is global we need to fully re-render the chart
    renderChart();
});
