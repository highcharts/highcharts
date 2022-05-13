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

type EnvelopePoint = Record<'t'|'vol', number>;
type Envelope = Array<EnvelopePoint>;
type OscType = 'sine'|'square'|'sawtooth'|'triangle'|'whitenoise';

interface FilterOptions {
    frequency?: number;
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


class Oscillator {
    private oscNode?: OscillatorNode;

    constructor(
        audioContext: AudioContext, destination: AudioNode, options: OscOptions
    ) {
        const type = options.type || 'sine';
        if (type !== 'whitenoise') {
            this.oscNode = new OscillatorNode(audioContext, {
                type,
                detune: options.detune,
                frequency: (options.fixedFrequency || 0) *
                    (options.freqMultiplier || 1)
            });
            this.oscNode.connect(destination);
        }
    }

    public start(): void {
        if (this.oscNode) {
            this.oscNode.start();
        }
    }

    public stopAtTime(time: number): void {
        if (this.oscNode) {
            this.oscNode.stop(time);
        }
    }

    public setFreqAtTime(time: number, frequency: number): void {
        if (this.oscNode) {
            this.oscNode.frequency.cancelScheduledValues(time);
            this.oscNode.frequency.setValueAtTime(frequency, time);
        }
    }

    public glideToFreqAtTime(
        time: number, frequency: number, glideDuration: number
    ): void {
        if (this.oscNode) {
            this.oscNode.frequency.cancelScheduledValues(time);
            this.oscNode.frequency.setTargetAtTime(
                frequency, time, glideDuration / 1000 / 3
            );
            this.oscNode.frequency.setValueAtTime(
                frequency, time + glideDuration / 1000
            );
        }
    }
}


/* *
 *
 *  Class
 *
 * */
class SynthPatch {
    public static stopRampTime = 0.007; // Ramp time to 0 when stopping sound
    private outputNode: GainNode;
    private oscillators: Array<Oscillator>;

    constructor(
        private audioContext: AudioContext,
        private options: SynthPatchOptions
    ) {
        this.outputNode = new GainNode(audioContext);
        this.oscillators = (this.options.oscillators || []).map(
            (oscOpts): Oscillator => new Oscillator(
                audioContext, this.outputNode, oscOpts
            ));
    }


    // Start the oscillators, but don't output sound
    public startSilently(): void {
        this.outputNode.gain.value = 0;
        this.oscillators.forEach((o): void => o.start());
    }


    // Stop (can't be started again)
    public stop(): void {
        const endTime = this.audioContext.currentTime + SynthPatch.stopRampTime;
        this.miniRampToVolAtTime(endTime, 0);
        this.oscillators.forEach((o): void => o.stopAtTime(endTime));
    }


    // Mute sound at time (in seconds, in the AudioContext timespace)
    public silenceAtTime(time: number): void {
        this.miniRampToVolAtTime(time || this.audioContext.currentTime, 0);
    }


    // Play a frequency at time (in seconds, in the AudioContext timespace)
    // Note duration is given in milliseconds
    public playFreqAtTime(
        time: number, frequency: number, noteDuration: number
    ): void {
        const t = time || this.audioContext.currentTime;
        this.oscillators.forEach((o): void => o.setFreqAtTime(t, frequency));
        this.miniRampToVolAtTime(t, 1);

        if (noteDuration) {
            this.miniRampToVolAtTime(t + noteDuration / 1000, 0);
        }
    }


    // Play a frequency at time (in seconds, in the AudioContext timespace)
    // Note duration and glide duration is given in milliseconds
    public glideToFreqAtTime(
        time: number,
        frequency: number,
        noteDuration: number,
        glideDuration: number
    ): void {
        const t = time || this.audioContext.currentTime;
        this.oscillators.forEach(
            (o): void => o.glideToFreqAtTime(t, frequency, glideDuration));
        this.miniRampToVolAtTime(t, 1);

        if (noteDuration) {
            this.miniRampToVolAtTime(t + noteDuration / 1000, 0);
        }
    }


    // Cancel any scheduled muting of sound
    public cancelScheduled(): void {
        this.outputNode.gain.cancelScheduledValues(
            this.audioContext.currentTime);
    }


    // Connect the SynthPatch output to an audio node / destination
    public connect(destinationNode: AudioNode): AudioNode {
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
