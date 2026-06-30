// ---- Steel data ----
const steelGroups = [
    {
        name: 'Simple carbon steels',
        steels: [
            { name: '1084', a: 58.3, b: 0.0,  c: 41.7, total: 1.44 },
            { name: '1095', a: 70.4, b: 0.0,  c: 29.6, total: 1.35 },
            { name: 'W2',   a: 66.7, b: 0.0,  c: 33.3, total: 1.50 }
        ]
    },
    {
        name: 'Spring & bearing steels',
        steels: [
            { name: '52100', a: 35.7, b: 51.8, c: 12.5, total: 2.80 },
            { name: '5160',  a: 24.0, b: 32.0, c: 44.0, total: 2.50 }
        ]
    },
    {
        name: 'Tool steels',
        steels: [
            { name: 'O1', a: 29.0, b: 16.1, c: 54.9, total: 3.10 },
            { name: 'D2', a: 9.9, b: 78.9, c: 11.2, total: 15.20 },
            { name: 'A2', a: 13.2, b: 69.1, c: 17.7, total: 7.60 },
            { name: 'M4', a: 7.3, b: 20.6, c: 72.1, total: 19.42 }
        ]
    },
    {
        name: 'Stainless steels',
        steels: [
            { name: '440C',   a: 5.4, b: 88.1, c: 6.5, total: 19.35 },
            { name: 'AEB-L',  a: 4.7, b: 90.7, c: 4.6, total: 14.12 },
            { name: '14C28N', a: 4.0, b: 91.3, c: 4.7, total: 15.33 },
            { name: 'N690',   a: 5.1, b: 82.1, c: 12.8, total: 21.07 },
            { name: '154CM',  a: 5.5, b: 73.5, c: 21.0, total: 19.10 }
        ]
    },
    {
        name: 'High-performance / PM steels',
        steels: [
            { name: 'CPM-3V',     a: 6.5, b: 60.7, c: 32.8, total: 12.35 },
            { name: 'S30V',       a: 6.8, b: 65.3, c: 27.9, total: 21.45 },
            { name: 'S35VN',      a: 6.5, b: 65.4, c: 28.1, total: 21.40 },
            { name: 'Elmax',      a: 7.2, b: 75.9, c: 16.9, total: 23.70 },
            { name: 'CruForge V', a: 9.1, b: 72.7, c: 18.2, total: 11.00 }
        ]
    }
];

const groupColors = [
    '#f5a623',
    '#e8734a',
    '#c0ca33',
    '#7b68ee',
    '#3ecfcf'
];

const groupKeys = ['carbon', 'spring', 'tool', 'stainless', 'pm'];

// eslint-disable-next-line max-len
const DEFAULT_DESCRIPTION = 'Choose a steel family above to see what bladesmiths ' +
        'actually use it for, and why its metallurgic composition is ' +
        'suited to that particular job.';

const familyBlurbs = {
    carbon: 'The classic choice for traditional forging. ' +
        'Pure carbon and iron, no chromium. Easy to sharpen and easy ' +
        'to forge. The trade-off: these steels rust if you don\u2019t keep ' +
        'them oiled.',
    spring:
    'These were designed for fatigue strength and rolling contact, not ' +
        'knives. But bladesmiths like them because the toughness that ' +
        'survives a million bearing rotations also survives a chopping blow.',
    tool: 'Built to cut other metal, so wear resistance matters more than ' +
        'corrosion resistance. D2\u2019s chromium content edges toward ' +
        'stainless territory without quite crossing the line.',
    stainless: 'Chromium above roughly 13% forms a passive oxide layer ' +
        'that resists rust. The trade-off: stainless steels are typically ' +
        'harder to sharpen and less tough than simple carbon steel.',
    pm: 'Powder metallurgy allows extreme alloy loading without the carbide ' +
        'segregation that would make the metal unworkable. ' +
        'The result is stainless-level corrosion resistance with wear ' +
        'resistance.'

};

// Flat set of all steel names for easy lookup
// eslint-disable-next-line max-len
const allSteelNames = new Set(steelGroups.flatMap(g => g.steels.map(s => s.name)));

// ---- Active state ----
let activeNames = new Set(allSteelNames);

// ---- Data helpers ----
// Returns only the active points for a given group.
function activeData(gi) {
    return steelGroups[gi].steels
        .filter(s => activeNames.has(s.name))
        .map(s => ({ name: s.name, a: s.a, b: s.b, c: s.c, total: s.total }));
}

// Static series options shared by every group
function seriesOptions(gi) {
    return {
        type: 'ternaryscatter',
        name: steelGroups[gi].name,
        color: groupColors[gi],
        minSize: 10,
        maxSize: 40,
        states: {
            hover: {
                halo: {
                    size: 0
                }
            }
        },
        marker: {
            symbol: 'circle',
            lineWidth: 1,
            lineColor: 'rgba(255,255,255,0.25)'
        },
        dataLabels: {
            enabled: true,
            format: '{point.name}',
            allowOverlap: false,
            style: {
                fontSize: '0.68rem',
                fontWeight: '500',
                textOutline: 'none',
                color: 'var(--highcharts-neutral-color-100)'
            }
        },
        componentColors: {
            a: '#f5a623',
            b: '#7b68ee',
            c: '#3ecfcf',
            alpha: 0.15,
            strokeAlpha: 1
        },
        tooltip: {
            headerFormat:
            '<span class="tooltip-header">{point.name}</span><br/>',
            pointFormat:
                // eslint-disable-next-line max-len
                '<span class="tooltip-color-a">●</span> Carbon: <b>{point.a:.1f}%</b><br/>' +
                // eslint-disable-next-line max-len
                '<span class="tooltip-color-b">●</span> Chromium: <b>{point.b:.1f}%</b><br/>' +
                // eslint-disable-next-line max-len
                '<span class="tooltip-color-c">●</span> Other alloys: <b>{point.c:.1f}%</b><br/>' +
                // eslint-disable-next-line max-len
                '<span class="tooltip-color-total">◎</span> Total alloys: <b>{point.total:.2f}%</b>'
        },
        data: activeData(gi)
    };
}

// ---- Chart ----
const chart = Highcharts.chart('container', {
    chart: {
        ternary: { sumTo: 100 },
        backgroundColor: 'transparent',
        margin: [60, 40, 60, 40]
    },

    title: {
        text: 'Blade Steel Composition',
        style: {
            fontSize: '1.4rem',
            fontWeight: '600'
        }
    },
    subtitle: {
        text: `Common bladesmithing steels mapped by their alloying 
        elements`
    },
    credits: { enabled: false },
    legend: { enabled: false },

    ternaryAxis: {
        common: {
            tickInterval: 25,
            lineColor: 'var(--highcharts-neutral-color-20)',
            lineWidth: 1,
            gridLineColor: 'var(--highcharts-neutral-color-20)',
            gridLineWidth: 1,
            gridLineDashStyle: 'Dash',
            labels: {
                style: {
                    color: 'var(--highcharts-neutral-color-60)',
                    fontSize: '0.6rem'
                }
            }
        },
        a: {
            title: {
                text: `
                    <div class="axis-label-a">
                        <span class="axis-label">Carbon %</span><br>
                        <span>Determines hardness and edge retention</span>
                    </div>`,
                useHTML: true,
                margin: 42
            }
        },
        b: {
            title: {
                text: `
                    <div class="axis-label-b">
                        <span class="axis-label">Chromium %</span><br>
                        <span>Enhances corrosion resistance and hardness</span>
                    </div>`,
                useHTML: true,
                margin: 42
            }
        },
        c: {
            title: {
                text: `
                    <div class="axis-label-c">
                        <span class="axis-label">Other alloys %</span><br>
                        <span>V · W · Mo · Mn · Co</span>
                    </div>`,
                useHTML: true,
                margin: 42
            }
        }
    },

    tooltip: {
        borderRadius: 8,
        style: {
            fontSize: '0.8rem'
        },
        useHTML: true
    },

    series: steelGroups.map((_, gi) => seriesOptions(gi))
});

// ---- Update chart when activeNames changes ----
function updateChart() {
    chart.series.forEach((s, gi) => {
        s.setData(activeData(gi), false, false);
    });
    chart.redraw(false);
}

// ---- Filter UI ----
function initFilter() {
    // "All steels" reset button — already in the HTML
    const allBtn = document.querySelector('[data-preset="all"]');
    if (allBtn) {
        allBtn.addEventListener('click', () => {
            activeNames = new Set(allSteelNames);
            updateChips();
            updatePresetStates();
            updateDescription();
            updateChart();
        });
    }

    // One button per family
    steelGroups.forEach((group, gi) => {
        const btn = document.getElementById(`preset-btn--${groupKeys[gi]}`);
        btn.addEventListener('click', () => {
            const familyNames = new Set(group.steels.map(s => s.name));
            const alreadyIsolated = activeNames.size === familyNames.size &&
                [...familyNames].every(n => activeNames.has(n));

            // Clicking the already-isolated family resets to all
            activeNames = alreadyIsolated ?
                new Set(allSteelNames) :
                new Set(familyNames);

            updateChips();
            updatePresetStates();
            updateDescription();
            updateChart();
        });
    });

    steelGroups.forEach(group => {
        group.steels.forEach(steel => {
            // eslint-disable-next-line max-len
            const chip = document.getElementById(`chip-${steel.name.replace(/\s+/g, '-')}`);

            chip.addEventListener('click', () => {
                if (activeNames.has(steel.name)) {
                    if (activeNames.size === 1) {
                        return;
                    } // keep at least one
                    activeNames.delete(steel.name);
                } else {
                    activeNames.add(steel.name);
                }
                chip.classList.toggle('active', activeNames.has(steel.name));
                updatePresetStates();
                updateDescription();
                updateChart();
            });

        });
    });
}

function updateChips() {
    document.querySelectorAll('[data-name]').forEach(chip => {
        chip.classList.toggle('active', activeNames.has(chip.dataset.name));
    });
}

function updateDescription() {
    const el = document.getElementById('description');
    if (!el) {
        return;
    }

    // Find which single family, if any, is currently isolated
    const isolatedKey = groupKeys.find((key, gi) => {
        const familyNames = steelGroups[gi].steels.map(s => s.name);
        return activeNames.size === familyNames.length &&
            familyNames.every(n => activeNames.has(n));
    });

    // eslint-disable-next-line max-len
    el.textContent = isolatedKey ? familyBlurbs[isolatedKey] : DEFAULT_DESCRIPTION;
}

function updatePresetStates() {
    document.querySelector('[data-preset="all"]')
        .classList.toggle('active', activeNames.size === allSteelNames.size);

    steelGroups.forEach((group, gi) => {
        const familyNames = group.steels.map(s => s.name);
        const isIsolated = activeNames.size === familyNames.length &&
            familyNames.every(n => activeNames.has(n));
        document.querySelector(`[data-preset="${groupKeys[gi]}"]`)
            .classList.toggle('active', isIsolated);
    });
}

initFilter();