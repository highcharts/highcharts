document.getElementById('export').onclick = () => {
    Highcharts.downloadSVGLocal(
        document.getElementById('svg').outerHTML, {
            filename: 'exported',
            type: 'image/png'
        }
    );
};