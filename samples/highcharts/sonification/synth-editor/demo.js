/**
 * Basic synth patch editor for Highcharts Sonification Instruments
 * */

let audioContext;
const SynthPatch = Highcharts.sonification.SynthPatch;
let synthPatch;
let idCount = 1; // Counter used for oscillator IDs
const oscillators = []; // The current oscillators we have settings for
const charts = {}; // Our envelope chart references
const el = el => document.getElementById(el);
const presets = {
    basic: el('preset-basic').textContent,
    saxophone: el('preset-saxophone').textContent,
    whirlwind: el('preset-whirlwind').textContent,
    rock: el('preset-rock').textContent,
    test: el('preset-test').textContent
};

// Get envelope options from an envelope chart
function getChartEnvelope(chartContainerId) {
    const chart = charts[chartContainerId];
    return chart ? chart.series[0].points
        .map(p => ({ t: p.x, vol: p.y })) : [];
}


// Get EQ settings from UI
function getEq() {
    return [...document.querySelectorAll('.eqSlider')]
        .reduce((definitions, container) => {
            const gain = parseFloat(container.querySelector('input[type="range"]').value);
            if (gain < -0.01 || gain > 0.01) {
                const frequency = parseFloat(container.querySelector('.freq').value) || 0,
                    Q = parseFloat(container.querySelector('.q').value) || 1;
                definitions.push({
                    frequency,
                    Q,
                    gain
                });
            }
            return definitions;
        }, []);
}


// Apply preset EQ to UI
function applyEq(eqDefinitions) {
    const defs = eqDefinitions.slice(0),
        eqContainers = [...document.querySelectorAll('.eqSlider')],
        defaultFrequencies = [200, 400, 800, 1600, 2200, 3600, 6400, 12800];

    let i = 0;
    while (defs.length < eqContainers.length) {
        defs.push({
            frequency: defaultFrequencies[i],
            gain: 0,
            Q: 1
        });
        ++i;
    }

    defs.sort((a, b) => a.frequency - b.frequency).forEach((def, ix) => {
        const container = eqContainers[ix];
        container.querySelector('input[type="range"]').value = def.gain;
        container.querySelector('.freq').value = def.frequency;
        container.querySelector('.q').value = def.Q;
    });
}


// Update the patch options and JSON from the current UI settings
function updatePatch() {
    const val = id => el(id).value,
        floatVal = id => {
            const x = parseFloat(val(id));
            return isNaN(x) ? void 0 : x;
        },
        intVal = id => {
            const x = parseInt(val(id), 10);
            return isNaN(x) ? void 0 : x;
        };
    const options = {
        masterVolume: el('masterVolume').value,
        noteGlideDuration: el('glideDuration').value,
        masterAttackEnvelope: getChartEnvelope('masterAttackEnvChart'),
        masterReleaseEnvelope: getChartEnvelope('masterReleaseEnvChart'),
        eq: getEq(),
        oscillators: oscillators.map(osc => {
            const i = osc.inputs,
                getOscWithId = id => oscillators
                    .findIndex(osc => osc.id === id),
                fmIndex = getOscWithId(intVal(i.fmOsc)),
                vmIndex = getOscWithId(intVal(i.vmOsc));
            return {
                type: val(i.type),
                freqMultiplier: floatVal(i.freqMultiplier),
                fixedFrequency: floatVal(i.fixedFrequency),
                volume: floatVal(i.volume),
                detune: intVal(i.detune),
                pulseWidth: floatVal(i.pulseWidth),
                volumePitchTrackingMultiplier: floatVal(i.volPitchTrackingMult),
                lowpass: {
                    frequency: floatVal(i.lowpassFreq),
                    frequencyPitchTrackingMultiplier:
                        floatVal(i.lowpassPitchTrackingMult),
                    Q: floatVal(i.lowpassQ)
                },
                highpass: {
                    frequency: floatVal(i.highpassFreq),
                    frequencyPitchTrackingMultiplier:
                        floatVal(i.highpassPitchTrackingMult),
                    Q: floatVal(i.highpassQ)
                },
                fmOscillator: fmIndex > -1 ? fmIndex : void 0,
                vmOscillator: vmIndex > -1 ? vmIndex : void 0,
                attackEnvelope: getChartEnvelope(i.attackEnvChart),
                releaseEnvelope: getChartEnvelope(i.releaseEnvChart)
            };
        })
    };
    for (const [key, val] of Object.entries(options)) {
        if (val.length === 0) {
            delete options[key];
        }
    }
    el('json').textContent = JSON.stringify(options, null, ' ');

    if (synthPatch) {
        synthPatch.stop();
    }
    if (audioContext) {
        synthPatch = new SynthPatch(audioContext, options);
        synthPatch.connect(audioContext.destination);
        synthPatch.startSilently();
    }
}


// Create a chart for defining a volume envelope (attack or release)
function createEnvelopeChart(type, container) {
    function cleanSeriesData(series) {
        const newData = series.points.map(o => [o.x, o.y])
            .sort((a, b) => a[0] - b[0]);
        if (newData[0] && newData[0][0] > 1) {
            newData.unshift([0, type === 'attack' ? 0 : 1]);
        }
        series.setData(newData);
        updatePatch();
    }

    charts[container] = Highcharts.chart(container, {
        title: { text: null },
        credits: { enabled: false },
        accessibility: { enabled: false },
        legend: { enabled: false },
        tooltip: { enabled: false },
        chart: {
            backgroundColor: 'transparent',
            plotBorderWidth: 1,
            spacing: [10, 5, 0, 0],
            events: {
                click: function (e) {
                    this.series[0].addPoint([
                        Math.round(e.xAxis[0].value),
                        Math.round(e.yAxis[0].value * 100) / 100
                    ]);
                    updatePatch();
                },
                load: function () {
                    const btn = document.createElement('button');
                    let hideTimeout;
                    this.container.appendChild(btn);
                    btn.classList.add('chartReset', 'hidden');
                    btn.textContent = 'Reset';
                    btn.onclick = e => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.series[0].setData([]);
                        updatePatch();
                    };
                    this.renderTo.addEventListener('mouseenter', () => {
                        clearTimeout(hideTimeout);
                        btn.classList.remove('hidden');
                    });
                    this.renderTo.addEventListener('mouseleave', () => {
                        hideTimeout = setTimeout(() => btn.classList.add('hidden'), 400);
                    });
                }
            }
        },
        yAxis: {
            min: 0,
            max: 1,
            tickAmount: 3,
            minPadding: 0,
            maxPadding: 0,
            minRange: 0,
            startOnTick: false,
            endOnTick: false,
            title: {
                enabled: false
            }
        },
        xAxis: {
            min: 0,
            max: 600,
            minPadding: 0,
            maxPadding: 0,
            tickAmount: 3,
            minRange: 0,
            startOnTick: false,
            endOnTick: false
        },
        series: [{
            cursor: 'pointer',
            pointInterval: 50,
            marker: {
                enabled: true
            },
            dragDrop: {
                draggableY: true,
                draggableX: true,
                dragMaxX: 600,
                dragMinX: 1,
                dragMaxY: 1,
                dragMinY: 0
            },
            point: {
                events: {
                    click: function () {
                        const series = this.series;
                        this.remove(false);
                        cleanSeriesData(series);
                    },
                    drop: function (e) {
                        const point = e.newPoints[e.newPointId].point,
                            { x, y } = e.newPoint;
                        e.preventDefault();
                        point.update({
                            x: Math.round(x),
                            y: Math.round(y * 100) / 100
                        }, false);
                        cleanSeriesData(point.series);
                    }
                }
            },
            data: []
        }]
    });
}


// Update the lists of oscillators we can modulate in the UI
function updateModulationLists() {
    const newList = oscillators.reduce(
        (str, osc) => `${str}<option value="${osc.id}">#${osc.id}</option>`,
        '<option value=""></option>'
    );
    oscillators.forEach(o => {
        const valInList = val => newList.indexOf(`value="${val}"`) > 0,
            fmSel = el(o.inputs.fmOsc),
            vmSel = el(o.inputs.vmOsc),
            oldFMVal = fmSel.value,
            oldVMVal = vmSel.value;
        vmSel.innerHTML = fmSel.innerHTML = newList;
        // Don't remove existing values if we don't have to
        if (valInList(oldFMVal)) {
            fmSel.value = oldFMVal;
        }
        if (valInList(oldVMVal)) {
            vmSel.value = oldVMVal;
        }
    });
    updatePatch();
}


// A class for abstracting the Oscillator cards in the UI
class Oscillator {
    constructor(options) {
        this.options = options || {};
        this.container = el('oscillators');
        this.id = idCount++;
        this.htmlNode = document.createElement('div');
        this.htmlNode.className = 'oscillator';
        this.content = `<h3>#${this.id}</h3>
            <button class="span2" id="removeOsc${this.id}">
                Remove #${this.id}
            </button>`;
        this.addControls();
        this.render();
        setTimeout(() => updateModulationLists(), 0);
        this.container.appendChild(this.htmlNode);
        el('removeOsc' + this.id).onclick = () => this.remove();
    }

    remove() {
        this.container.removeChild(this.htmlNode);
        oscillators.splice(oscillators.indexOf(this), 1);
        delete this.container;
        delete charts[this.inputs.attackEnvChart];
        delete charts[this.inputs.releaseEnvChart];
        updateModulationLists();
    }

    addControl(type, className, label, controlContent, step) {
        const identifier = `osc${this.id}${className}`,
            nameAndId = `name="${identifier}" id="${identifier}"`,
            classStr = `class="span2 ${className}"`;
        this.content += `<label for="${identifier}">${label}</label>`;

        if (type === 'select') {
            // eslint-disable-next-line
            this.content += `<select ${classStr} ${nameAndId}>${controlContent}</select>`;
        } else if (type === 'input') {
            // eslint-disable-next-line
            this.content += `<input ${classStr} type="number" ${nameAndId} value="${controlContent}" step="${step}">`;
        }

        return identifier;
    }

    addChartContainer(id, label) {
        const identifier = `osc${this.id}${id}`;
        this.content += `<div class="chart span2" id="${identifier}"></div>
            <label class="chartlabel">${label}</label>`;
        return identifier;
    }

    addControls() {
        const opts = this.options,
            typeOptions = ['sine', 'sawtooth', 'triangle', 'square', 'whitenoise', 'pulse']
                .reduce((str, option) => `${str}<option value="${option}">${option}</option>`, '');
        this.inputs = {
            type: this.addControl('select', 'Type', 'Waveform type', typeOptions),
            freqMultiplier: this.addControl('input', 'FreqMultiplier', 'Freq multiplier',
                opts.freqMultiplier || '', 1),
            fixedFrequency: this.addControl('input', 'FixedFreq', 'Fixed frequency',
                opts.fixedFrequency || '', 1),
            volume: this.addControl('input', 'Vol', 'Volume',
                opts.volume || '0.5', 0.05),
            detune: this.addControl('input', 'Detune', 'Detune (cents)',
                opts.detune || '', 1),
            pulseWidth: this.addControl('input', 'PulseWidth', 'Pulse width',
                opts.pulseWidth || '', 0.05),
            volPitchTrackingMult: this.addControl('input', 'VolPitchTrackingMult', 'Volume tracking multiplier',
                opts.volPitchTrackingMult || '', 0.05),
            lowpassFreq: this.addControl('input', 'lowpassFreq', 'Lowpass frequency',
                opts.lowpassFreq || '', 1),
            lowpassPitchTrackingMult: this.addControl('input', 'LowpassPitchTrackingMult', 'Lowpass tracking multiplier',
                opts.lowpassPitchTrackingMult || '', 0.1),
            lowpassQ: this.addControl('input', 'lowpassQ', 'Lowpass resonance',
                opts.lowpassQ || '', 0.1),
            highpassFreq: this.addControl('input', 'highpassFreq', 'Highpass frequency',
                opts.highpassFreq || '', 1),
            highpassPitchTrackingMult: this.addControl('input', 'HighpassPitchTrackingMult', 'Highpass tracking multiplier',
                opts.highpassPitchTrackingMult || '', 0.1),
            highpassQ: this.addControl('input', 'highpassQ', 'Highpass resonance',
                opts.highpassQ || '', 0.1),
            fmOsc: this.addControl('select', 'FMOsc', 'FM oscillator', ''),
            vmOsc: this.addControl('select', 'VMOsc', 'VM oscillator', ''),
            attackEnvChart: this.addChartContainer('AttackEnv', 'Attack envelope'),
            releaseEnvChart: this.addChartContainer('ReleaseEnv', 'Release envelope')
        };
    }

    render() {
        const oscillator = this;
        this.htmlNode.innerHTML = this.content;
        this.content = '';
        setTimeout(() => {
            if (!oscillator.container) {
                return;
            }
            createEnvelopeChart('attack', this.inputs.attackEnvChart);
            createEnvelopeChart('release', this.inputs.releaseEnvChart);
            el(this.inputs.vmOsc).onchange =
            el(this.inputs.fmOsc).onchange = function () {
                if (this.value === '' + oscillator.id) {
                    alert("Oscillator can't modulate itself - please assign to a different oscillator.");
                    this.value = '';
                }
            };
            Object.values(this.inputs).forEach(id => el(id).addEventListener('change', updatePatch));
        }, 0);
    }
}


function playSequence(notes, durationMultiplier) {
    if (audioContext && synthPatch) {
        const t = audioContext.currentTime;
        notes.forEach(
            (freq, i) => synthPatch.playFreqAtTime(
                t + i * 0.1 * durationMultiplier, freq, 150 * durationMultiplier
            )
        );
    }
}
const playJingle = () => playSequence([261.63, 329.63, 392, 523.25], 1);
const playWideRange = () => playSequence([
    49.00, 65.41, 82.41, 87.31, 130.81, 174.61, 220.00, 261.63, 329.63,
    392.00, 493.88, 523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98,
    1975.53, 2093.00
], 1.5);


// Apply a preset to UI and patch settings
function applyPreset(presetId) {
    const options = JSON.parse(presets[presetId]),
        envToChart = (chart, env) => charts[chart].series[0].setData(
            (env || []).map(o => [o.t, o.vol])
        );

    // Reset first
    let i = oscillators.length;
    while (i--) {
        oscillators[i].remove();
    }
    idCount = 1;

    el('masterVolume').value = options.masterVolume || 1;
    el('glideDuration').value = options.noteGlideDuration || '';
    envToChart('masterAttackEnvChart', options.masterAttackEnvelope);
    envToChart('masterReleaseEnvChart', options.masterReleaseEnvelope);
    applyEq(options.eq || []);
    options.oscillators.forEach(opts => {
        oscillators.push(new Oscillator({
            freqMultiplier: opts.freqMultiplier,
            fixedFrequency: opts.fixedFrequency,
            volume: opts.volume,
            detune: opts.detune,
            pulseWidth: opts.pulseWidth,
            volPitchTrackingMult: opts.volumePitchTrackingMultiplier,
            lowpassFreq: opts.lowpass && opts.lowpass.frequency,
            lowpassPitchTrackingMult: opts.lowpass && opts.lowpass
                .frequencyPitchTrackingMultiplier,
            lowpassQ: opts.lowpass && opts.lowpass.Q,
            highpassFreq: opts.highpass && opts.highpass.frequency,
            highpassPitchTrackingMult: opts.highpass && opts.highpass
                .frequencyPitchTrackingMultiplier,
            highpassQ: opts.highpass && opts.highpass.Q
        }));
    });

    setTimeout(() => {
        const opts = options.oscillators;
        let i = opts.length;
        while (i--) {
            el(oscillators[i].inputs.type).value = opts[i].type;
            el(oscillators[i].inputs.fmOsc).value =
                opts[i].fmOscillator !== null ? opts[i].fmOscillator + 1 : '';
            el(oscillators[i].inputs.vmOsc).value =
                opts[i].vmOscillator !== null ? opts[i].vmOscillator + 1 : '';
            envToChart(oscillators[i].inputs.attackEnvChart,
                opts[i].attackEnvelope);
            envToChart(oscillators[i].inputs.releaseEnvChart,
                opts[i].releaseEnvelope);
        }

        setTimeout(updatePatch, 0);
        setTimeout(playJingle, 50);
    }, 100);
}


function populateEQSliders() {
    const container = el('eqSliders');
    for (let i = 0; i < 8; ++i) {
        const col = document.createElement('div');
        col.className = 'eqSlider';
        // eslint-disable-next-line
        col.innerHTML = `<input orient="vertical" type="range" min="-40" max="20" step="2">
        <input class="freq" type="number">
        <input class="q" type="number">
        `;
        container.appendChild(col);
    }
    setTimeout(() => document.querySelectorAll('#eqSliders input')
        .forEach(input => (input.onchange = updatePatch)), 10);
}


function resetEQ() {
    document.querySelectorAll('#eqSliders input[type="range"]')
        .forEach(input => (input.value = 0));
    updatePatch();
}


const synthKeysPressed = new Set();
document.addEventListener('keydown', e => {
    const freq = {
        KeyA: 261.63, // C4
        KeyW: 277.18,
        KeyS: 293.66,
        KeyE: 311.13,
        KeyD: 329.63,
        KeyF: 349.23,
        KeyT: 369.99,
        KeyG: 392,
        KeyY: 415.30,
        KeyH: 440,
        KeyU: 466.16,
        KeyJ: 493.88,
        KeyK: 523.25, // C5
        KeyO: 554.37,
        KeyL: 587.33
    }[e.code];
    if (freq && synthPatch && !synthKeysPressed.has(e.code)) {
        synthKeysPressed.add(e.code);
        el('keyStatus').textContent = 'Synth key pressed';
        synthPatch.playFreqAtTime(0, freq); // Play indefinitely
    }
});

document.addEventListener('keyup', e => {
    synthKeysPressed.delete(e.code);
    if (!synthKeysPressed.size) {
        el('keyStatus').textContent = 'No synth key pressed';
        if (synthPatch) {
            synthPatch.silenceAtTime(0);
        }
    }
});


el('preset').innerHTML = Object.keys(presets)
    .reduce((str, p) => `${str}<option value="${p}">${p}</option>`, '');

el('addOsc').onclick = () => oscillators.push(new Oscillator());
el('startSynth').onclick = function () {
    audioContext = new AudioContext();
    updatePatch();
    el('controls').classList.remove('hidden');
    this.classList.add('hidden');
    el('keyStatus').textContent = 'No synth key pressed';
    setTimeout(playJingle, 50);
};
el('playWideRange').onclick = playWideRange;
el('showHelp').onclick = () => el('help').classList.toggle('hidden');
el('resetEQ').onclick = resetEQ;
el('masterVolume').onchange = el('glideDuration').onchange = updatePatch;
el('json').onclick = function () {
    this.select();
};
el('preset').onchange = function () {
    applyPreset(this.value);
    this.blur();
};
createEnvelopeChart('attack', 'masterAttackEnvChart');
createEnvelopeChart('release', 'masterReleaseEnvChart');
populateEQSliders();
applyPreset('basic');
