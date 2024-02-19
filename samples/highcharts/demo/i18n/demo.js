const config = {
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
};

let chart = Highcharts.chart('container', config);

// Save the default language options
const defaultLangOptions =
    JSON.parse(JSON.stringify(Highcharts.defaultOptions.lang));

function reRenderChart() {
    chart.destroy();
    chart = Highcharts.chart('container', config);
}


document.querySelector('select#lang-select').addEventListener('change', async function (e) {
    const lang = e.target.value;
    const langScript = document.querySelector('script[src*="i18n"]');

    if (langScript) {
        langScript.remove();
    }

    if (lang === 'default') {
        Highcharts.setOptions({
            lang: defaultLangOptions
        });
        reRenderChart();
    } else {
        const newScript = document.createElement('script');
        newScript.src = `https://code.highcharts.com/i18n/${lang}.js`;

        document.head.appendChild(newScript);

        newScript.onload = function () {
            // Have to do this currently
            reRenderChart();

            // chart.update({
            //     lang: Highcharts.getOptions().lang
            // });
        };
    }

});
