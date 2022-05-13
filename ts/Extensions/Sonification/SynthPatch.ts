/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Class representing a Synth Patch for sonification module.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import U from '../../Core/Utilities.js';
const {
    defined,
    pick
} = U;

type EnvelopePoint = Record<'t'|'vol', number>;
type Envelope = Array<EnvelopePoint>;
type OscType = 'sine'|'square'|'sawtooth'|'triangle'|'whitenoise';

interface FilterOptions {
    frequency?: number;
    frequencyPitchTrackingMultiplier?: number;
    Q?: number;
}

interface OscOptions {
    attackEnvelope?: Envelope;
    detune?: number;
    freqMultiplier?: number;
    fixedFrequency?: number;
    highpass?: FilterOptions;
    lowpass?: FilterOptions;
    modulateOscillator?: number;
    releaseEnvelope?: Envelope;
    type?: OscType;
    volume?: number;
    volumePitchTrackingMultiplier?: number;
}

interface ReverbOptions {
    decay?: number;
    enabled?: boolean;
    volume?: number;
}

interface DelayOptions {
    enabled?: boolean;
    feedback?: number;
    volume?: number;
}

interface SynthPatchOptions {
    delay?: DelayOptions;
    masterAttackEnvelope?: Envelope;
    masterReleaseEnvelope?: Envelope;
    masterVolume?: number;
    maxFrequency?: number;
    minFrequency?: number;
    oscillators?: Array<OscOptions>;
    reverb?: ReverbOptions;
}


/**
 * Get the multipler value from a pitch tracked multiplier.
 * @private
 * @param {number} multiplier The multipler to track.
 * @param {number} freq The current frequency.
 * @param {boolean} log Use a more logarithmic-like mapping.
 */
function getPitchTrackedMultiplierVal(
    multiplier: number, freq: number, log: boolean = false
): number {
    const d = multiplier - 1,
        f = freq / 5000,
        diff = log ? d * Math.sqrt(Math.sqrt(f)) : d * f;
    return 1 + diff;
}


/**
 * Internal class used by SynthPatch
 * @class
 * @private
 */
class Oscillator {
    modulatesOscillatorIx?: number;
    private oscNode?: OscillatorNode;
    private whiteNoise?: AudioBufferSourceNode;
    private gainNode?: GainNode;
    private volTrackingNode?: GainNode;
    private lowpassNode?: BiquadFilterNode;
    private highpassNode?: BiquadFilterNode;

    constructor(
        private audioContext: AudioContext,
        private options: OscOptions,
        destination?: AudioNode
    ) {
        this.modulatesOscillatorIx = options.modulateOscillator;
        this.createSoundSource();
        this.createGain();
        this.createFilters();
        this.createVolTracking();

        if (destination) {
            this.connect(destination);
        }
    }


    // Connect the node tree from destination down to oscillator,
    // depending on which nodes exist. Done automatically unless
    // no destination was passed to constructor.
    connect(destination: AudioNode|AudioParam): void {
        [
            this.lowpassNode,
            this.highpassNode,
            this.volTrackingNode,
            this.gainNode,
            this.whiteNoise,
            this.oscNode
        ].reduce((prev, cur): AudioNode|AudioParam =>
            (cur ? (cur.connect(prev as AudioNode), cur) : prev), destination);
    }


    start(): void {
        if (this.oscNode) {
            this.oscNode.start();
        }
        if (this.whiteNoise) {
            this.whiteNoise.start();
        }
    }


    stopAtTime(time: number): void {
        if (this.oscNode) {
            this.oscNode.stop(time);
        }
        if (this.whiteNoise) {
            this.whiteNoise.stop(time);
        }
    }


    setFreqAtTime(time: number, frequency: number): void {
        const opts = this.options,
            f = pick(opts.fixedFrequency, frequency) *
                (opts.freqMultiplier || 1);
        if (this.oscNode) {
            this.oscNode.frequency.cancelScheduledValues(time);
            this.oscNode.frequency.setValueAtTime(f, time);
        }
        this.scheduleVolTrackingChange(f, time);
        this.scheduleFilterTrackingChange(f, time);
    }


    glideToFreqAtTime(
        time: number, frequency: number, glideDuration: number
    ): void {
        const f = pick(this.options.fixedFrequency, frequency) *
            (this.options.freqMultiplier || 1);
        if (this.oscNode) {
            this.oscNode.frequency.cancelScheduledValues(time);
            this.oscNode.frequency.setTargetAtTime(
                f, time, glideDuration / 1000 / 3
            );
            this.oscNode.frequency.setValueAtTime(
                f, time + glideDuration / 1000
            );
        }
        this.scheduleVolTrackingChange(f, time);
        this.scheduleFilterTrackingChange(f, time);
    }


    // Get target for FM synthesis if another oscillator wants to modulate.
    getFMTarget(): AudioParam|undefined {
        return this.oscNode && this.oscNode.detune ||
            this.whiteNoise && this.whiteNoise.detune;
    }


    // Set the pitch dependent volume to fit some frequency at some time
    private scheduleVolTrackingChange(frequency: number, time: number): void {
        if (this.volTrackingNode) {
            const v = getPitchTrackedMultiplierVal(
                this.options.volumePitchTrackingMultiplier || 1,
                frequency,
                true
            );
            this.volTrackingNode.gain.cancelScheduledValues(time);
            this.volTrackingNode.gain.setTargetAtTime(
                v, time, SynthPatch.stopRampTime / 6
            );
            this.volTrackingNode.gain.setValueAtTime(
                v, time + SynthPatch.stopRampTime);
        }
    }


    // Set the pitch dependent filter frequency to fit frequency at some time
    private scheduleFilterTrackingChange(
        frequency: number, time: number
    ): void {
        const opts = this.options;
        if (this.lowpassNode && opts.lowpass) {
            const multiplier = getPitchTrackedMultiplierVal(
                    opts.lowpass.frequencyPitchTrackingMultiplier || 1,
                    frequency
                ),
                f = (opts.lowpass.frequency || 20000) * multiplier;
            this.lowpassNode.frequency.cancelScheduledValues(time);
            this.lowpassNode.frequency.setValueAtTime(f, time);
        }
        if (this.highpassNode && opts.highpass) {
            const multiplier = getPitchTrackedMultiplierVal(
                    opts.highpass.frequencyPitchTrackingMultiplier || 1,
                    frequency
                ),
                f = (opts.highpass.frequency || 20000) * multiplier;
            this.highpassNode.frequency.cancelScheduledValues(time);
            this.highpassNode.frequency.setValueAtTime(f, time);
        }
    }


    private createGain(): void {
        const opts = this.options,
            needsGainNode = opts.volume ||
                opts.attackEnvelope && opts.attackEnvelope.length ||
                opts.releaseEnvelope && opts.releaseEnvelope.length;
        if (needsGainNode) {
            this.gainNode = new GainNode(this.audioContext, {
                gain: pick(opts.volume, 1)
            });
        }
    }


    // Create the oscillator or audio buffer acting as the sound source
    private createSoundSource(): void {
        const opts = this.options,
            ctx = this.audioContext;
        if (opts.type === 'whitenoise') {
            const bSize = ctx.sampleRate * 2,
                buffer = ctx.createBuffer(1, bSize, ctx.sampleRate),
                data = buffer.getChannelData(0);
            for (let i = 0; i < bSize; ++i) {
                data[i] = Math.random() * 1.2 - 0.6;
            }
            const wn = this.whiteNoise = ctx.createBufferSource();
            wn.buffer = buffer;
            wn.loop = true;
        } else {
            this.oscNode = new OscillatorNode(ctx, {
                type: opts.type || 'sine',
                detune: opts.detune,
                frequency: (opts.fixedFrequency || 0) *
                    (opts.freqMultiplier || 1)
            });
        }
    }


    // Lowpass/Highpass filters
    private createFilters(): void {
        const opts = this.options;
        if (opts.lowpass && opts.lowpass.frequency) {
            this.lowpassNode = new BiquadFilterNode(this.audioContext, {
                type: 'lowpass',
                Q: opts.lowpass.Q || 1,
                frequency: opts.lowpass.frequency
            });
        }
        if (opts.highpass && opts.highpass.frequency) {
            this.highpassNode = new BiquadFilterNode(this.audioContext, {
                type: 'highpass',
                Q: opts.highpass.Q || 1,
                frequency: opts.highpass.frequency
            });
        }
    }


    // Gain node used for frequency dependent volume tracking
    private createVolTracking(): void {
        const opts = this.options;
        if (opts.volumePitchTrackingMultiplier &&
            opts.volumePitchTrackingMultiplier !== 1) {
            this.volTrackingNode = new GainNode(this.audioContext, {
                gain: 1
            });
        }
    }
}


/**
 * @class
 * @private
 */
class SynthPatch {
    static stopRampTime = 0.007; // Ramp time to 0 when stopping sound
    private outputNode: GainNode;
    private oscillators: Array<Oscillator>;
    private volume: number;

    constructor(
        private audioContext: AudioContext,
        private options: SynthPatchOptions
    ) {
        this.volume = options.masterVolume || 1;
        this.outputNode = new GainNode(audioContext);
        this.oscillators = (this.options.oscillators || []).map(
            (oscOpts): Oscillator => new Oscillator(
                audioContext,
                oscOpts,
                defined(oscOpts.modulateOscillator) ?
                    void 0 : this.outputNode
            ));

        // Now that we have all oscillators, connect the ones
        // that are used for FM.
        this.oscillators.forEach((osc): void => {
            if (defined(osc.modulatesOscillatorIx)) {
                const targetOsc = this.oscillators[osc.modulatesOscillatorIx],
                    fmTarget = targetOsc.getFMTarget();
                if (targetOsc !== osc && fmTarget) {
                    osc.connect(fmTarget);
                }
            }
        });
    }


    // Start the oscillators, but don't output sound
    startSilently(): void {
        this.outputNode.gain.value = 0;
        this.oscillators.forEach((o): void => o.start());
    }


    // Stop (can't be started again)
    stop(): void {
        const endTime = this.audioContext.currentTime + SynthPatch.stopRampTime;
        this.miniRampToVolAtTime(endTime, 0);
        this.oscillators.forEach((o): void => o.stopAtTime(endTime));
    }


    // Mute sound at time (in seconds, in the AudioContext timespace)
    silenceAtTime(time: number): void {
        this.miniRampToVolAtTime(time || this.audioContext.currentTime, 0);
    }


    // Play a frequency at time (in seconds, in the AudioContext timespace)
    // Note duration is given in milliseconds. If note duration is not given,
    // the note plays indefinitely.
    playFreqAtTime(
        time: number, frequency: number, noteDuration?: number|null
    ): void {
        const t = time || this.audioContext.currentTime;
        this.oscillators.forEach((o): void => o.setFreqAtTime(t, frequency));
        this.miniRampToVolAtTime(t, this.volume);

        if (noteDuration) {
            this.miniRampToVolAtTime(t + noteDuration / 1000, 0);
        }
    }


    // Play a frequency at time (in seconds, in the AudioContext timespace).
    // Time denotes when the gliding ramp starts. Note duration and glide
    // duration is given in milliseconds. If note duration is not given,
    // the note plays indefinitely.
    glideToFreqAtTime(
        time: number,
        frequency: number,
        noteDuration: number|null,
        glideDuration: number
    ): void {
        const t = time || this.audioContext.currentTime;
        this.oscillators.forEach(
            (o): void => o.glideToFreqAtTime(t, frequency, glideDuration));
        this.miniRampToVolAtTime(t, this.volume);

        if (noteDuration) {
            this.miniRampToVolAtTime(t + noteDuration / 1000, 0);
        }
    }


    // Cancel any scheduled muting of sound
    cancelScheduled(): void {
        this.outputNode.gain.cancelScheduledValues(
            this.audioContext.currentTime);
    }


    // Connect the SynthPatch output to an audio node / destination
    connect(destinationNode: AudioNode): AudioNode {
        return this.outputNode.connect(destinationNode);
    }


    // Schedule a mini ramp to volume, starting at time
    private miniRampToVolAtTime(time: number, vol: number): void {
        this.outputNode.gain.cancelScheduledValues(time);
        this.outputNode.gain.setTargetAtTime(
            vol, time, SynthPatch.stopRampTime / 6
        );
        this.outputNode.gain.setValueAtTime(
            vol, time + SynthPatch.stopRampTime
        );
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SynthPatch;
