const chart = Highcharts.chart('container', {
    exporting: {
        chartOptions: { // specific options for the exported image
            plotOptions: {
                series: {
                    dataLabels: {
                        enabled: true
                    }
                }
            }
        },
        sourceWidth: 400,
        sourceHeight: 300,
        scale: 1,
        fallbackToExportServer: false,
        buttons: {
            contextButton: {
                menuItems: [
                    'viewFullscreen',
                    'printChart',
                    'separator',
                    'downloadPNG',
                    'downloadJPEG',
                    'downloadSVG',
                    'downloadPDF'
                ]
            }
        }
    },

    title: {
        text: 'Offline export',
        style: {
            fontFamily: 'Iceberg'
        }
    },

    subtitle: {
        text: 'Click the button to download as PNG, JPEG, SVG or PDF'
    },

    chart: {
        type: 'area',
        style: {
            fontFamily: 'Ole',
            fontWeight: '800'
        }
    },

    xAxis: {
        categories: [
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
        ]
    },

    series: [{
        data: [
            29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6,
            126.0, 148.5, 216.4, 194.1, 95.6, 54.4
        ]
    }]

});

function renderSVGToCanvas(svgEl, canvas) {
    const xml = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            const ctx = canvas.getContext('2d');
            // optionally resize canvas to match SVG
            canvas.width = svgEl.viewBox.baseVal.width || svgEl.clientWidth;
            canvas.height = svgEl.viewBox.baseVal.height || svgEl.clientHeight;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);

            URL.revokeObjectURL(url);
            resolve();
        };
        img.onerror = e => {
            URL.revokeObjectURL(url);
            reject(e);
        };
        img.src = url;
    });
}

(async () => {
    const svgDoc = new DOMParser().parseFromString(chart.getSVG(), 'image/svg+xml');
    const svg = svgDoc.querySelector('svg');

    document.querySelector('#dataurl-target-no-inline').src =
        `data:image/svg+xml,${encodeURIComponent(svg.outerHTML)}`;

    svg.innerHTML = await Highcharts.Exporting.inlineFonts(svg?.outerHTML);

    // export & render…
    document.querySelector('#dataurl-target-inlined').src =
        `data:image/svg+xml,${encodeURIComponent(svg.outerHTML)}`;

    renderSVGToCanvas(svg, document.querySelector('#svg-canvas'));
})();
