/**
 * An example of branding Highcharts to fit a company style.
 *
 * The design is based on https://design.morningstar.com/foundations/about
 */
Highcharts.setOptions({

    // Step 1: Define the general palette for light and dark mode
    palette: {
        light: {
            colors: [
                '#e32412',
                '#fadb8b',
                '#2364b9',
                '#059649'
            ],
            backgroundColor: '#f6f5f4',
            highlightColor: '#e32412'
        },
        dark: {
            colors: [
                '#e32412',
                '#fadb8b',
                '#2364b9',
                '#059649'
            ],
            backgroundColor: '#1b1918',
            highlightColor: '#fadb8b'
        }
    },

    // Step 2: Define the colors and styles for the specific chart elements,
    // extending the general palette
    yAxis: {
        // 2a. This is how to set a literal color
        gridLineColor: '#888a'
    },

    title: {
        style: {
            // 2b. This is how to use a color from the palette
            color: 'var(--highcharts-neutral-color-60)',
            fontSize: '1.5em'
        }
    },

    tooltip: {
        borderWidth: 1,
        // 2c. This is how to use the `light-dark` CSS function to set a color
        // that adapts to light and dark mode
        borderColor: 'light-dark(#fff, #666)'
    },

    // Step 3: Define the typography
    chart: {
        style: {
            // Arial Narrow serves as a proxy for the Morningstar corporate font
            fontFamily: 'Arial Narrow, sans-serif',
            fontSize: '1.2rem'
        }
    },

    // Step 4: Put the logo in the credits, and link to the company website
    credits: {
        href: 'https://www.morningstar.com',
        text: `<img src="https://cdn.rawgit.com/highcharts/highcharts/25fa36710f14e7418a700cf9e43bd9ed2f344582/samples/graphics/morningstar.svg"
            alt="Morningstar"
            style="width: 95px;height:20px;margin-top:-10px" />`,
        style: {
            cursor: 'pointer'
        },
        useHTML: true
    }
});

Highcharts.chart('container', {
    chart: {
        type: 'column'
    },
    title: {
        text: 'Highcharts with branding'
    },
    subtitle: {
        text: `Subtitle with
            <b style="color: var(--highcharts-highlight-color-100);">
            highlight color</b>`
    },
    xAxis: {
        type: 'datetime'
    },
    plotOptions: {
        series: {
            pointIntervalUnit: 'month',
            pointStart: '2026-01-01'
        }
    },
    series: [{
        data: [3, 6, 5, 6]
    }, {
        data: [2, 5, 4, 5]
    }]
});
