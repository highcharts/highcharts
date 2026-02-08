QUnit.test('Shadow DOM CSS styles', function (assert) {
    // Create a Shadow DOM
    const shadowRoot = document
        .querySelector('#container')
        .attachShadow({
            mode: 'open'
        });

    // Create style element, add styles and append to Shadow DOM
    const shadowStyles = document.createElement('style');
    shadowStyles.textContent = `
        .highcharts-plot-background {
            fill: #7b7b7b;
        }
    `;
    shadowRoot.appendChild(shadowStyles);

    // Create div element, append to Shadow DOM
    const highchartsContainer = document.createElement('div');
    shadowRoot.appendChild(highchartsContainer);

    // Create a chart
    const chart = Highcharts.chart(highchartsContainer, {
        title: {
            text: 'Shadow DOM CSS styles'
        },
        exporting: {
            applyStyleSheets: true,
            includeShadowDOMStyles: true
        },
        series: [
            {
                data: [1, 2, 3]
            }
        ]
    });

    // Get the SVG
    const svg = chart.exporting.getSVG();

    // Parse SVG
    const doc = (new DOMParser()).parseFromString(svg, 'image/svg+xml');

    assert.strictEqual(
        doc.querySelector('rect.highcharts-plot-background')
            .getAttribute('fill'),
        'rgb(123, 123, 123)',
        'Plot background rect has the correct fill color'
    );

    assert.notStrictEqual(
        svg.indexOf('style="'),
        -1,
        'Styles were inlined during export'
    );
});
