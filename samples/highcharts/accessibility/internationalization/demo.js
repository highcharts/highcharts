const languages = {
    no: {
        lang: {
            decimalPoint: ',',
            thousandsSep: '.',
            loading: 'Later­...',
            months: ['Januar', 'Februar', 'Mars', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Desember'],
            shortMonths: ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Des'],
            weekdays: ['Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag', 'Søndag­'],
            exportButtonTitle: 'Eksporter',
            printButtonTitle: 'Print',
            printChart: 'Skriv ut diagram',
            viewFullscreen: 'Se i fullskjerm',
            rangeSelectorFrom: 'Fra',
            rangeSelectorTo: 'Til',
            rangeSelectorZoom: 'Zoom',
            downloadPNG: 'Last ned som PNG-bilde',
            downloadJPEG: 'Last ned som JPEG-bilde',
            downloadPDF: 'Last ned som PDF-dokument',
            downloadSVG: 'Last ned som SVG-bilde',
            title: 'AAPL Aksjekurs'
        }
    },
    de: {
        lang: {
            decimalPoint: ',',
            thousandsSep: '.',
            loading: 'Daten werden geladen...',
            months: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
            weekdays: ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
            shortMonths: ['Jan', 'Feb', 'Mrz', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
            exportButtonTitle: "Exportieren",
            printButtonTitle: "Drucken",
            printChart: 'Diagramm ausdrucken',
            viewFullscreen: 'Im Vollbild anschauen',
            rangeSelectorFrom: "Von",
            rangeSelectorTo: "Bis",
            rangeSelectorZoom: "Zeitraum",
            downloadPNG: 'Download als PNG-Bild',
            downloadJPEG: 'Download als JPEG-Bild',
            downloadPDF: 'Download als PDF-Dokument',
            downloadSVG: 'Download als SVG-Bild',
            resetZoom: "Zoom zurücksetzen",
            resetZoomTitle: "Zoom zurücksetzen",
            title: 'AAPL Aktienkurs'
        }
    }
};

Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-c.json', data => {

    const chartOptions = {
        chart: {
            style: {
                fontFamily: 'Arial'
            }
        },

        rangeSelector: {
            selected: 1,
            labelStyle: {
                fontWeight: 'bold',
                color: '#000',
                fontSize: '14px',
                padding: '10px'
            }
        },

        title: {
            text: 'AAPL Stock Price'
        },

        xAxis: {
            labels: {
                style: {
                    fontWeight: 'bold',
                    color: '#000',
                    fontSize: '12px'
                }
            }
        },

        navigator: {
            xAxis: {
                labels: {
                    style: {
                        color: '#000'
                    }
                }
            },
            series: {
                label: {
                    enabled: false
                }
            }
        },

        series: [{
            name: 'AAPL',
            data: data,
            tooltip: {
                valueDecimals: 2
            }
        }]
    };

    function createChart(options) {
        return new Highcharts.stockChart('container', options);
    }

    let chart = createChart(chartOptions);
    const initialOptions = JSON.parse(JSON.stringify(Highcharts.getOptions()));

    function resetOptions() {
        Highcharts.setOptions(initialOptions);
    }

    document.getElementById('en').addEventListener('click', function () {
        chart.destroy();
        resetOptions();
        Highcharts.setOptions(initialOptions);
        chart = createChart(chartOptions);
    });

    document.getElementById('no').addEventListener('click', function () {
        chart.destroy();
        Highcharts.setOptions(languages.no);
        chart = createChart(Highcharts.merge(chartOptions, {
            title: { text: Highcharts.getOptions().lang.title }
        }));
    });

    document.getElementById('de').addEventListener('click', function () {
        chart.destroy();
        Highcharts.setOptions(languages.de);
        chart = createChart(Highcharts.merge(chartOptions, {
            title: { text: Highcharts.getOptions().lang.title }
        }));
    });
});
