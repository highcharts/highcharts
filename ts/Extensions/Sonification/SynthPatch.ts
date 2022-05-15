/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Class representing a Synth Patch, used by Instruments in the
 *  sonification.js module.
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
    fmOscillator?: number;
    highpass?: FilterOptions;
    lowpass?: FilterOptions;
    releaseEnvelope?: Envelope;
    type?: OscType;
    vmOscillator?: number;
    volume?: number;
    volumePitchTrackingMultiplier?: number;
}

interface SynthPatchOptions {
    masterAttackEnvelope?: Envelope;
    masterReleaseEnvelope?: Envelope;
    masterVolume?: number;
    noteGlideDuration?: number;
    oscillators?: Array<OscOptions>;
}


/**
 * Get the multipler value from a pitch tracked multiplier. The parameter
 * specifies the multiplier at ca 3200Hz. It is 1 at ca 50Hz. In between
 * it is mapped logarithmically.
 * @private
 * @param {number} multiplier The multipler to track.
 * @param {number} freq The current frequency.
 */
function getPitchTrackedMultiplierVal(
    multiplier: number, freq: number
): number {
    const a = 0.2414 * multiplier - 0.2414,
        b = (3.5 - 1.7 * multiplier) / 1.8;
    return a * Math.log(freq) + b;
}


/**
 * Schedule a mini ramp to volume at time - avoid clicks/pops.
 * @private
 * @param {Object} gainNode The gain node to schedule for.
 * @param {number} time The time in seconds to start ramp.
 * @param {number} vol The volume to ramp to.
 */
function miniRampToVolAtTime(
    gainNode: GainNode, time: number, vol: number
): void {
    gainNode.gain.cancelScheduledValues(time);
    gainNode.gain.setTargetAtTime(
        vol, time, SynthPatch.stopRampTime / 4
    );
    gainNode.gain.setValueAtTime(
        vol, time + SynthPatch.stopRampTime
    );
}


/**
 * Schedule a gain envelope for a gain node.
 * @private
 * @param {Array<Object>} envelope The envelope to schedule.
 * @param {string} type Type of envelope, attack or release.
 * @param {number} time At what time (in seconds) to start envelope.
 * @param {Object} gainNode The gain node to schedule on.
 * @param {number} [volumeMultiplier] Volume multiplier for the envelope.
 */
function scheduleGainEnvelope(
    envelope: Envelope,
    type: 'attack'|'release',
    time: number,
    gainNode: GainNode,
    volumeMultiplier = 1
): void {
    const isAtk = type === 'attack',
        gain = gainNode.gain;

    gain.cancelScheduledValues(time);
    if (!envelope.length) {
        miniRampToVolAtTime(gainNode, time, isAtk ? volumeMultiplier : 0);
        return;
    }

    if (envelope[0].t > 1) {
        envelope.unshift({ t: 0, vol: isAtk ? 0 : 1 });
    }

    envelope.forEach((ep, ix): void => {
        const prev = envelope[ix - 1],
            delta = prev ? (ep.t - prev.t) / 1000 : 0,
            startTime = time + (
                prev ? prev.t / 1000 + SynthPatch.stopRampTime : 0
            );
        gain.setTargetAtTime(
            ep.vol * volumeMultiplier,
            startTime,
            Math.max(delta, SynthPatch.stopRampTime) / 2
        );
    });
}


/**
 * Internal class used by SynthPatch
 * @class
 * @private
 */
class Oscillator {
    fmOscillatorIx?: number;
    vmOscillatorIx?: number;
    private oscNode?: OscillatorNode;
    private whiteNoise?: AudioBufferSourceNode;
    private gainNode?: GainNode;
    private vmNode?: GainNode;
    private volTrackingNode?: GainNode;
    private lowpassNode?: BiquadFilterNode;
    private highpassNode?: BiquadFilterNode;

    constructor(
        private audioContext: AudioContext,
        public options: OscOptions,
        destination?: AudioNode
    ) {
        this.fmOscillatorIx = options.fmOscillator;
        this.vmOscillatorIx = options.vmOscillator;
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
            this.vmNode,
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


    setFreqAtTime(
        time: number, frequency: number, glideDuration = 0
    ): void {
        const opts = this.options,
            f = pick(opts.fixedFrequency, frequency) *
                (opts.freqMultiplier || 1);
        if (this.oscNode) {
            this.oscNode.frequency.cancelScheduledValues(time);
            if (glideDuration) {
                this.oscNode.frequency.setTargetAtTime(
                    f, time, glideDuration / 1000 / 5
                );
                this.oscNode.frequency.setValueAtTime(
                    f, time + glideDuration / 1000
                );
            } else {
                this.oscNode.frequency.setValueAtTime(f, time);
            }
        }
        this.scheduleVolTrackingChange(f, time, glideDuration);
        this.scheduleFilterTrackingChange(f, time, glideDuration);
    }


    // Get target for FM synthesis if another oscillator wants to modulate.
    getFMTarget(): AudioParam|undefined {
        return this.oscNode && this.oscNode.detune ||
            this.whiteNoise && this.whiteNoise.detune;
    }


    // Get target for volume modulation if another oscillator wants to modulate.
    getVMTarget(): AudioParam|undefined {
        return this.vmNode && this.vmNode.gain;
    }


    // Schedule one of the osciallator envelopes at a specified time in
    // seconds (in AudioContext timespace).
    runEnvelopeAtTime(type: 'attack'|'release', time: number): void {
        if (!this.gainNode) {
            return;
        }
        const env = (type === 'attack' ? this.options.attackEnvelope :
            this.options.releaseEnvelope) || [];
        scheduleGainEnvelope(env, type, time, this.gainNode,
            this.options.volume);
    }


    // Cancel any envelopes currently scheduled
    cancelScheduledEnvelopes(): void {
        if (this.gainNode) {
            this.gainNode.gain
                .cancelScheduledValues(this.audioContext.currentTime);
        }
    }


    // Set the pitch dependent volume to fit some frequency at some time
    private scheduleVolTrackingChange(
        frequency: number, time: number, glideDuration?: number
    ): void {
        if (this.volTrackingNode) {
            const v = getPitchTrackedMultiplierVal(
                    this.options.volumePitchTrackingMultiplier || 1,
                    frequency
                ),
                rampTime = glideDuration ? glideDuration / 1000 :
                    SynthPatch.stopRampTime;
            this.volTrackingNode.gain.cancelScheduledValues(time);
            this.volTrackingNode.gain.setTargetAtTime(
                v, time, rampTime / 5
            );
            this.volTrackingNode.gain.setValueAtTime(
                v, time + rampTime);
        }
    }


    // Set the pitch dependent filter frequency to fit frequency at some time
    private scheduleFilterTrackingChange(
        frequency: number, time: number, glideDuration?: number
    ): void {
        const opts = this.options,
            rampTime = glideDuration ? glideDuration / 1000 :
                SynthPatch.stopRampTime,
            scheduleFilterTarget = (
                filterNode: BiquadFilterNode,
                filterOptions: FilterOptions
            ): void => {
                const multiplier = getPitchTrackedMultiplierVal(
                        filterOptions.frequencyPitchTrackingMultiplier || 1,
                        frequency
                    ),
                    f = (filterOptions.frequency || 1000) * multiplier;
                filterNode.frequency.cancelScheduledValues(time);
                filterNode.frequency.setTargetAtTime(f, time, rampTime / 5);
                filterNode.frequency.setValueAtTime(f, time + rampTime);
            };

        if (this.lowpassNode && opts.lowpass) {
            scheduleFilterTarget(this.lowpassNode, opts.lowpass);
        }
        if (this.highpassNode && opts.highpass) {
            scheduleFilterTarget(this.highpassNode, opts.highpass);
        }
    }


    private createGain(): void {
        const opts = this.options,
            needsGainNode = defined(opts.volume) ||
                opts.attackEnvelope && opts.attackEnvelope.length ||
                opts.releaseEnvelope && opts.releaseEnvelope.length;
        if (needsGainNode) {
            this.gainNode = new GainNode(this.audioContext, {
                gain: pick(opts.volume, 1)
            });
        }
        // We always need VM gain, so make that
        this.vmNode = new GainNode(this.audioContext);
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

    constructor(
        private audioContext: AudioContext,
        private options: SynthPatchOptions
    ) {
        this.outputNode = new GainNode(audioContext);
        this.oscillators = (this.options.oscillators || []).map(
            (oscOpts): Oscillator => new Oscillator(
                audioContext,
                oscOpts,
                defined(oscOpts.fmOscillator) || defined(oscOpts.vmOscillator) ?
                    void 0 : this.outputNode
            ));

        // Now that we have all oscillators, connect the ones
        // that are used for modulation.
        this.oscillators.forEach((osc): void => {
            const connectTarget = (
                targetFunc: 'getFMTarget'|'getVMTarget',
                targetOsc?: Oscillator
            ): void => {
                if (targetOsc) {
                    const target = targetOsc[targetFunc]();
                    if (target) {
                        osc.connect(target);
                    }
                }
            };
            if (defined(osc.fmOscillatorIx)) {
                connectTarget('getFMTarget',
                    this.oscillators[osc.fmOscillatorIx]);
            }
            if (defined(osc.vmOscillatorIx)) {
                connectTarget('getVMTarget',
                    this.oscillators[osc.vmOscillatorIx]);
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
        const curTime = this.audioContext.currentTime,
            endTime = curTime + SynthPatch.stopRampTime;
        miniRampToVolAtTime(this.outputNode, curTime, 0);
        this.oscillators.forEach((o): void => o.stopAtTime(endTime));
    }


    // Mute sound at time (in seconds, in the AudioContext timespace)
    // Will still run release envelope. Note: If scheduled multiple times in
    // succession, the release envelope will run, and that could make sound.
    silenceAtTime(time: number): void {
        if (!time && this.outputNode.gain.value < 0.01) {
            this.outputNode.gain.value = 0;
            return; // Skip if not needed
        }
        this.releaseAtTime(time || this.audioContext.currentTime);
    }


    // Play a frequency at time (in seconds, in the AudioContext timespace).
    // Time denotes when the attack ramp starts. Note duration is given in
    // milliseconds. If note duration is not given, the note plays indefinitely.
    playFreqAtTime(
        time: number,
        frequency: number,
        noteDuration?: number
    ): void {
        const t = time || this.audioContext.currentTime,
            opts = this.options;
        this.oscillators.forEach((o): void => {
            o.setFreqAtTime(t, frequency, opts.noteGlideDuration);
            o.runEnvelopeAtTime('attack', t);
        });
        scheduleGainEnvelope(
            opts.masterAttackEnvelope || [],
            'attack',
            t,
            this.outputNode,
            opts.masterVolume
        );

        if (noteDuration) {
            this.releaseAtTime(t + noteDuration / 1000);
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


    // Fade by release envelopes at time
    private releaseAtTime(time: number): void {
        let maxReleaseDuration = 0;
        this.oscillators.forEach((o): void => {
            const env = o.options.releaseEnvelope;
            if (env && env.length) {
                maxReleaseDuration = Math.max(
                    maxReleaseDuration, env[env.length - 1].t
                );
                o.runEnvelopeAtTime('release', time);
            }
        });

        const masterEnv = this.options.masterReleaseEnvelope || [];
        if (masterEnv.length) {
            scheduleGainEnvelope(
                masterEnv,
                'release',
                time,
                this.outputNode,
                this.options.masterVolume
            );
            maxReleaseDuration = Math.max(
                maxReleaseDuration,
                masterEnv[masterEnv.length - 1].t
            );
        }

        miniRampToVolAtTime(
            this.outputNode, time + maxReleaseDuration / 1000, 0
        );
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SynthPatch;
