/**
 * Synth patch editor for Highcharts Sonification Instruments
 * */

let audioContext;
let uidCounter = 0; // For control IDs
const el = document.getElementById.bind(document),
    childValue = (parent, childSelector) =>
        parent.querySelector(childSelector).value,
    SynthPatch = Highcharts.sonification.SynthPatch,
    synths = [],
    presets = Highcharts.sonification.InstrumentPresets;

// Note: always plays the sequence on the first synth.
function playSequence(notes, durationMultiplier) {
    if (audioContext && synths[0]) {
        notes.forEach(
            (freq, i) => synths[0].synthPatch.playFreqAtTime(
                i * 0.1 * durationMultiplier, freq, 150 * durationMultiplier
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


// Create a chart for defining a volume envelope (attack or release)
function createEnvelopeChart(type, containerEl, onEdit) {
    function cleanSeriesData(series) {
        const newData = series.points.map(o => [o.x, o.y])
            .sort((a, b) => a[0] - b[0]);
        if (newData[0] && newData[0][0] > 1) {
            newData.unshift([0, type === 'attack' ? 0 : 1]);
        }
        series.setData(newData);
        onEdit();
    }

    return Highcharts.chart(containerEl, {
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
                    cleanSeriesData(this.series[0]);
                    onEdit();
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
                        onEdit();
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


function addOscControls(controlsContainerEl, options) {
    let content = '';
    const opts = options || {},
        typeOptions = ['sine', 'sawtooth', 'triangle', 'square', 'whitenoise', 'pulse']
            .reduce((str, option) => `${str}<option value="${option}">${option}</option>`, ''),
        addChartContainer = (id, label) => {
            const uid = `${id}-${uidCounter++}`;
            content += `<div class="chart span2" id="${uid}"></div>
                <label class="chartlabel">${label}</label>`;
            return uid;
        },
        addControl = (type, className, label, controlContent, step) => {
            const uid = `${className}-${uidCounter++}`,
                shared = `id="${uid}" class="span2 ${className}" name="${uid}"`;
            content += `<label for="${uid}">${label}</label>`;
            if (type === 'select') {
                content += `<select ${shared}>${controlContent}</select>`;
            } else if (type === 'input') {
                // eslint-disable-next-line
                content += `<input type="number" ${shared} value="${controlContent}" step="${step}">`;
            }
            return uid;
        };

    const controlIds = {
        type: addControl('select', 'Type', 'Waveform type', typeOptions),
        freqMultiplier: addControl('input', 'FreqMultiplier', 'Freq multiplier',
            opts.freqMultiplier || '', 1),
        fixedFrequency: addControl('input', 'FixedFreq', 'Fixed frequency',
            opts.fixedFrequency || '', 1),
        volume: addControl('input', 'Vol', 'Volume',
            opts.volume || '0.5', 0.05),
        detune: addControl('input', 'Detune', 'Detune (cents)',
            opts.detune || '', 1),
        pulseWidth: addControl('input', 'PulseWidth', 'Pulse width',
            opts.pulseWidth || '', 0.05),
        volPitchTrackingMult: addControl('input', 'VolPitchTrackingMult', 'Volume tracking multiplier',
            opts.volumePitchTrackingMultiplier || '', 0.05),
        lowpassFreq: addControl('input', 'LowpassFreq', 'Lowpass frequency',
            opts.lowpass && opts.lowpass.frequency || '', 1),
        lowpassPitchTrackingMult: addControl('input', 'LowpassPitchTrackingMult', 'Lowpass tracking multiplier',
            opts.lowpass && opts.lowpass.frequencyPitchTrackingMultiplier || '', 0.1),
        lowpassQ: addControl('input', 'LowpassQ', 'Lowpass resonance',
            opts.lowpass && opts.lowpass.Q || '', 0.1),
        highpassFreq: addControl('input', 'HighpassFreq', 'Highpass frequency',
            opts.highpass && opts.highpass.frequency || '', 1),
        highpassPitchTrackingMult: addControl('input', 'HighpassPitchTrackingMult', 'Highpass tracking multiplier',
            opts.highpass && opts.highpass.frequencyPitchTrackingMultiplier || '', 0.1),
        highpassQ: addControl('input', 'HighpassQ', 'Highpass resonance',
            opts.highpass && opts.highpass.Q || '', 0.1),
        fmOsc: addControl('select', 'FMOsc', 'FM oscillator', ''),
        vmOsc: addControl('select', 'VMOsc', 'VM oscillator', ''),
        attackEnvChart: addChartContainer('AttackEnv', 'Attack envelope'),
        releaseEnvChart: addChartContainer('ReleaseEnv', 'Release envelope')
    };

    controlsContainerEl.innerHTML = content;
    return controlIds;
}


class Synth {
    constructor(htmlContainerEl) {
        const synth = this;
        this.container = htmlContainerEl;
        this.oscIdCounter = 1;
        this.synthPatch = null;
        this.oscillators = [];

        // TODO: HTML should probably be generated.
        this.child('.playWideRange').onclick = playWideRange;
        this.child('.addOsc').onclick = this.addOscillator.bind(this);
        this.child('.resetEQ').onclick = this.resetEQ.bind(this);
        this.child('.masterVolume').onchange = this.child('.glideDuration').onchange =
            this.updateFromUI.bind(this);
        this.child('.preset').innerHTML = Object.keys(presets)
            .reduce((str, p) => `${str}<option value="${p}">${p}</option>`, '');
        this.child('.preset').onchange = function () {
            synth.applyPreset(this.value);
            this.blur();
        };
        this.charts = {
            masterAttackEnvChart: createEnvelopeChart(
                'attack', this.child('.masterAttackEnvChart'), this.updateFromUI.bind(this)
            ),
            masterReleaseEnvChart: createEnvelopeChart(
                'release', this.child('.masterReleaseEnvChart'), this.updateFromUI.bind(this)
            )
        };
        this.populateEQSliders();
        setTimeout(() => this.applyPreset('piano'), 0);
    }


    addOscillator(options) {
        const synth = this,
            id = this.oscIdCounter++,
            oscContainer = this.child('.oscillators'),
            cardContainer = document.createElement('div'),
            controls = document.createElement('div'),
            oscillator = {
                id,
                controlIds: addOscControls(controls, options),
                remove() {
                    oscContainer.removeChild(cardContainer);
                    synth.oscillators.splice(
                        synth.oscillators.indexOf(oscillator), 1
                    );
                    synth.charts[oscillator.controlIds.attackEnvChart]
                        .destroy();
                    synth.charts[oscillator.controlIds.releaseEnvChart]
                        .destroy();
                    delete synth.charts[oscillator.controlIds.attackEnvChart];
                    delete synth.charts[oscillator.controlIds.releaseEnvChart];
                    synth.updateModulationLists();
                }
            };

        this.oscillators.push(oscillator);
        controls.className = 'controlsContainer';
        cardContainer.className = 'oscillator';
        const heading = document.createElement('h3');
        heading.textContent = '#' + id;
        const remove = document.createElement('button');
        remove.textContent = 'Remove #' + id;
        remove.onclick = oscillator.remove;

        cardContainer.appendChild(heading);
        cardContainer.appendChild(remove);
        cardContainer.appendChild(controls);
        oscContainer.appendChild(cardContainer);

        setTimeout(() => {
            this.charts[
                oscillator.controlIds.attackEnvChart
            ] = createEnvelopeChart(
                'attack', oscillator.controlIds.attackEnvChart, this.updateFromUI.bind(this)
            );
            this.charts[
                oscillator.controlIds.releaseEnvChart
            ] = createEnvelopeChart(
                'release', oscillator.controlIds.releaseEnvChart, this.updateFromUI.bind(this)
            );
            el(oscillator.controlIds.vmOsc).onchange =
            el(oscillator.controlIds.fmOsc).onchange = function () {
                if (this.value === '' + id) {
                    alert('Oscillator can\'t modulate itself - please assign to a different oscillator.');
                    this.value = '';
                }
            };
            Object.values(oscillator.controlIds).forEach(id => el(id)
                .addEventListener('change', synth.updateModulationLists.bind(synth)));
            synth.updateModulationLists();
        }, 0);
    }


    applyEqToUI(eqDefinitions) {
        const defs = eqDefinitions.slice(0),
            eqContainers = this.container.querySelectorAll('.eqSlider'),
            defaultFrequencies = [200, 400, 800, 1600, 2200, 3600, 6400, 12800];

        let i = 0;
        while (defs.length < eqContainers.length) {
            defs.push({ frequency: defaultFrequencies[i++], gain: 0, Q: 1 });
        }

        defs.sort((a, b) => a.frequency - b.frequency).forEach((def, ix) => {
            const sliderContainer = eqContainers[ix];
            sliderContainer.querySelector('.gain').value = def.gain || 0;
            sliderContainer.querySelector('.freq').value = def.frequency;
            sliderContainer.querySelector('.q').value = def.Q !== void 0 ? def.Q : 1;
        });
    }


    applyPreset(presetId) {
        const options = presets[presetId],
            envToChart = (chart, env) => this.charts[chart].series[0].setData(
                (env || []).map(o => [o.t, o.vol])
            );

        // Reset first
        let i = this.oscillators.length;
        while (i--) {
            this.oscillators[i].remove();
        }
        this.oscIdCounter = 1;

        this.child('.masterVolume').value = options.masterVolume || 1;
        this.child('.glideDuration').value = options.noteGlideDuration || '';
        envToChart('masterAttackEnvChart', options.masterAttackEnvelope);
        envToChart('masterReleaseEnvChart', options.masterReleaseEnvelope);
        this.applyEqToUI(options.eq || []);
        options.oscillators.forEach(this.addOscillator.bind(this));

        setTimeout(() => { // Settimeout to allow charts etc to build
            const opts = options.oscillators;
            this.oscillators.forEach((osc, i) => {
                el(osc.controlIds.type).value = opts[i].type;
                el(osc.controlIds.fmOsc).value =
                    opts[i].fmOscillator !== null ? opts[i].fmOscillator + 1 : '';
                el(osc.controlIds.vmOsc).value =
                    opts[i].vmOscillator !== null ? opts[i].vmOscillator + 1 : '';
                envToChart(osc.controlIds.attackEnvChart,
                    opts[i].attackEnvelope);
                envToChart(osc.controlIds.releaseEnvChart,
                    opts[i].releaseEnvelope);
            });
            setTimeout(this.updateFromUI.bind(this), 0);
            setTimeout(playJingle, 150);
        }, 0);
    }


    child(elSelector) {
        return this.container.querySelector(elSelector);
    }


    getEnvelopeFromChart(chartContainerId) {
        const chart = this.charts[chartContainerId];
        return chart ? chart.series[0].points
            .map(p => ({ t: p.x, vol: p.y })) : [];
    }


    getEqFromUI() {
        return [...this.container.querySelectorAll('.eqSlider')]
            .reduce((definitions, sliderContainer) => {
                const gain = parseFloat(childValue(sliderContainer, '.gain'));
                if (gain < -0.01 || gain > 0.01) {
                    const frequency = parseFloat(childValue(sliderContainer, '.freq')) || 0,
                        Q = parseFloat(childValue(sliderContainer, '.q')) || 1;
                    definitions.push({ frequency, Q, gain });
                }
                return definitions;
            }, []);
    }


    getPatchOptionsFromUI() {
        const val = id => el(id).value,
            getIfNum = (parser, id) => {
                const x = parser(val(id));
                return isNaN(x) ? void 0 : x;
            },
            floatVal = id => getIfNum(parseFloat, id),
            intVal = id => getIfNum(n => parseInt(n, 10), id),
            removeUnusedProps = obj => {
                for (const [key, val] of Object.entries(obj)) {
                    if (
                        typeof val === 'undefined' ||
                        val.length === 0 ||
                        typeof val === 'object' && !Object.values(val)
                            .some(n => typeof n !== 'undefined')
                    ) {
                        delete obj[key];
                    }
                }
                return obj;
            };

        const options = {
            masterVolume: childValue(this.container, '.masterVolume'),
            noteGlideDuration: childValue(this.container, '.glideDuration'),
            masterAttackEnvelope: this.getEnvelopeFromChart('masterAttackEnvChart'),
            masterReleaseEnvelope: this.getEnvelopeFromChart('masterReleaseEnvChart'),
            eq: this.getEqFromUI(),
            oscillators: this.oscillators.map(osc => {
                const i = osc.controlIds,
                    getOscWithId = id => this.oscillators
                        .findIndex(osc => osc.id === id),
                    fmIndex = getOscWithId(intVal(i.fmOsc)),
                    vmIndex = getOscWithId(intVal(i.vmOsc));

                const oscOptions = {
                    type: val(i.type),
                    freqMultiplier: floatVal(i.freqMultiplier),
                    fixedFrequency: floatVal(i.fixedFrequency),
                    volume: floatVal(i.volume),
                    detune: intVal(i.detune),
                    pulseWidth: floatVal(i.pulseWidth),
                    volumePitchTrackingMultiplier:
                        floatVal(i.volPitchTrackingMult),
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
                    attackEnvelope: this.getEnvelopeFromChart(i.attackEnvChart),
                    releaseEnvelope:
                        this.getEnvelopeFromChart(i.releaseEnvChart)
                };

                return removeUnusedProps(oscOptions);
            })
        };
        removeUnusedProps(options);
        return options;
    }


    populateEQSliders() {
        const container = this.child('.eqSliders');
        for (let i = 0; i < 8; ++i) {
            const col = document.createElement('div');
            col.className = 'eqSlider';
            // eslint-disable-next-line
            col.innerHTML = `<input class="gain" orient="vertical" type="range" min="-40" max="20" step="2">
            <input class="freq" type="number">
            <input class="q" type="number">
            `;
            container.appendChild(col);
        }
        setTimeout(() => this.container.querySelectorAll('.eqSliders input')
            .forEach(input => (input.onchange = this.updateFromUI.bind(this))),
        0);
    }


    resetEQ() {
        this.container.querySelectorAll('.eqSliders .gain').forEach(input => (input.value = 0));
        this.updateFromUI();
    }


    updateFromUI() {
        const options = this.getPatchOptionsFromUI();
        this.child('.json').textContent = JSON.stringify(options, null, ' ');

        if (this.synthPatch) {
            this.synthPatch.stop();
        }
        if (audioContext) {
            this.synthPatch = new SynthPatch(audioContext, options);
            this.synthPatch.connect(audioContext.destination);
            this.synthPatch.startSilently();
        }
    }


    // Update the lists of oscillators we can modulate in the UI
    updateModulationLists() {
        const newList = this.oscillators.reduce(
            (str, osc) => `${str}<option value="${osc.id}">#${osc.id}</option>`,
            '<option value=""></option>'
        );
        this.oscillators.forEach(o => {
            const valInList = val => newList.indexOf(`value="${val}"`) > 0,
                fmSel = el(o.controlIds.fmOsc),
                vmSel = el(o.controlIds.vmOsc),
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
        this.updateFromUI();
    }
}


// Use synth --------------------------------------------------------------------------------------------

el('startSynth').onclick = function () {
    audioContext = new AudioContext();
    synths.push(new Synth(el('synthContainer')));

    el('controls').classList.remove('hidden');
    this.classList.add('hidden');
    el('keyStatus').textContent = 'No synth key pressed';
    setTimeout(playJingle, 250);
};


document.querySelectorAll('.json').forEach(el => (el.onclick = () => el.select()));
el('showHelp').onclick = () => el('help').classList.toggle('hidden');


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
    if (freq && !synthKeysPressed.has(e.code) && synths[0].synthPatch) {
        synthKeysPressed.add(e.code);
        el('keyStatus').textContent = 'Synth key pressed';
        synths[0].synthPatch.playFreqAtTime(0, freq); // Play indefinitely
    }
});

document.addEventListener('keyup', e => {
    synthKeysPressed.delete(e.code);
    if (!synthKeysPressed.size) {
        el('keyStatus').textContent = 'No synth key pressed';
        if (synths[0].synthPatch) {
            synths[0].synthPatch.silenceAtTime(0);
        }
    }
});
