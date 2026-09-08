Highcharts.mapChart('container', {
    chart: {
        margin: 0
    },

    title: {
        text: ''
    },

    accessibility: {
        description: 'A tiled web map of Northern Europe with markers for ' +
            'five capitals. The tiles can be restyled with CSS filter ' +
            'presets, while the markers keep their own colors.'
    },

    navigation: {
        buttonOptions: {
            align: 'left',
            theme: {
                stroke: '#e6e6e6'
            }
        }
    },

    mapNavigation: {
        enabled: true,
        buttonOptions: {
            alignTo: 'spacingBox'
        }
    },

    mapView: {
        center: [14, 57],
        zoom: 4
    },

    legend: {
        enabled: false
    },

    tooltip: {
        pointFormat: '{point.name}'
    },

    series: [{
        type: 'tiledwebmap',
        name: 'Basemap tiles',
        provider: {
            type: 'OpenStreetMap',
            theme: 'Standard'
        }
    }, {
        type: 'mappoint',
        name: 'Capitals',
        color: '#f45b5b',
        marker: {
            radius: 6,
            lineWidth: 2,
            lineColor: '#ffffff'
        },
        dataLabels: {
            style: {
                textOutline: '2px contrast'
            }
        },
        data: [{
            name: 'Oslo',
            lat: 59.9139,
            lon: 10.7522
        }, {
            name: 'Stockholm',
            lat: 59.3293,
            lon: 18.0686
        }, {
            name: 'Copenhagen',
            lat: 55.6761,
            lon: 12.5683
        }, {
            name: 'Berlin',
            lat: 52.52,
            lon: 13.405
        }, {
            name: 'Warsaw',
            lat: 52.2297,
            lon: 21.0122
        }]
    }]
});

const wrap = document.querySelector('.demo-wrap'),
    presetButtons = document.querySelectorAll('.presets button'),
    amount = document.getElementById('amount'),
    amountValue = document.getElementById('amount-value'),
    cssOutput = document.getElementById('css-output');

let activePreset = '';

const tileGroup = document.querySelector('.highcharts-tiledwebmap-series');

// Read the filter back from the tile group, so the snippet always shows what
// the browser resolved the preset to. Mid-transition the computed value is the
// interpolated one, so the snippet is also refreshed once the filter settles.
function showAppliedCSS() {
    cssOutput.textContent = '.highcharts-tiledwebmap-series {\n    filter: ' +
        (tileGroup ? getComputedStyle(tileGroup).filter : 'none') + ';\n}';
}

if (tileGroup) {
    tileGroup.addEventListener('transitionend', showAppliedCSS);
}

function setPreset(preset) {
    if (activePreset) {
        wrap.classList.remove(activePreset);
    }
    if (preset) {
        wrap.classList.add(preset);
    }
    activePreset = preset;

    // Intensity only makes sense once a preset is picked
    amount.disabled = !preset;
    showAppliedCSS();
}

presetButtons.forEach(button => {
    button.addEventListener('click', () => {
        presetButtons.forEach(other => other.setAttribute(
            'aria-pressed', String(other === button)
        ));
        setPreset(button.dataset.filter);
    });
});

amount.addEventListener('input', () => {
    wrap.style.setProperty('--amount', amount.value / 100);
    amountValue.textContent = amount.value + '%';
    showAppliedCSS();
});

showAppliedCSS();
