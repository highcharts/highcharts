/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Class representing an Instrument with mappable parameters for sonification.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import SynthPatch from './SynthPatch.js';
import U from '../../Core/Utilities.js';
const {
    defined,
    extend
} = U;

interface SonificationInstrumentCapabilitiesOptions {
    filters?: boolean;
    tremolo?: boolean;
    pan: boolean;
}

interface SonificationInstrumentOptions {
    synthPatch: SynthPatch.SynthPatchOptions;
    capabilities?: SonificationInstrumentCapabilitiesOptions;
}

namespace SonificationInstrument {
    export interface ScheduledEventOptions {
        note?: number|string;
        noteDuration?: number;
        tremoloDepth?: number;
        tremoloSpeed?: number;
        pan?: number;
        volume?: number;
        lowpassFreq?: number;
        lowpassResonance?: number;
        highpassFreq?: number;
        highpassResonance?: number;
    }
}

/**
 * @private
 */
class SonificationInstrument {
    private static rampTime = SynthPatch.stopRampTime / 4;
    private masterVolNode: GainNode;
    private volumeNode: GainNode;
    private synthPatch: SynthPatch;
    private panNode?: StereoPannerNode;
    private lowpassNode?: BiquadFilterNode;
    private highpassNode?: BiquadFilterNode;
    private tremoloOsc?: OscillatorNode;
    private tremoloDepth?: GainNode;


    constructor(
        private audioContext: AudioContext,
        outputNode: AudioNode,
        options: SonificationInstrumentOptions
    ) {
        this.masterVolNode = new GainNode(audioContext);
        this.masterVolNode.connect(outputNode);
        this.volumeNode = new GainNode(audioContext);

        this.createNodesFromCapabilities(extend({
            pan: true
        } as SonificationInstrumentCapabilitiesOptions,
        options.capabilities || {}));

        this.connectCapabilityNodes(this.volumeNode, this.masterVolNode);
        this.synthPatch = new SynthPatch(audioContext, options.synthPatch);
        this.synthPatch.startSilently();
        this.synthPatch.connect(this.volumeNode);
    }


    setMasterVolume(volume: number): void {
        this.masterVolNode.gain.setTargetAtTime(
            volume, 0, SonificationInstrument.rampTime);
    }


    // Schedule an event at a certain time, whether it is playing a note
    // or changing the parameters of the instrument. Time is given in seconds,
    // where 0 is now.
    scheduleEventAtTime(
        time: number,
        params: SonificationInstrument.ScheduledEventOptions
    ): void {
        const audioTime = this.audioContext.currentTime + time;
        if (defined(params.note)) {
            this.synthPatch.playFreqAtTime(
                audioTime,
                SonificationInstrument.musicalNoteToFrequency(params.note),
                params.noteDuration
            );
        }
        if (defined(params.tremoloDepth) || defined(params.tremoloSpeed)) {
            this.setTremoloAtTime(
                audioTime, params.tremoloDepth, params.tremoloSpeed
            );
        }
        if (defined(params.pan)) {
            this.setPanAtTime(audioTime, params.pan);
        }
        if (defined(params.volume)) {
            this.setVolumeAtTime(audioTime, params.volume);
        }
        if (defined(params.lowpassFreq) || defined(params.lowpassResonance)) {
            this.setFilterAtTime('lowpass', audioTime,
                params.lowpassFreq, params.lowpassResonance);
        }
        if (defined(params.highpassFreq) || defined(params.highpassResonance)) {
            this.setFilterAtTime('highpass', audioTime,
                params.highpassFreq, params.highpassResonance);
        }
    }


    // Time is given in seconds, where 0 is now.
    silenceAtTime(time: number): void {
        this.synthPatch.silenceAtTime(this.audioContext.currentTime + time);
    }


    // Time is given in AudioContext timespace.
    setPanAtTime(time: number, pan: number): void {
        if (this.panNode) {
            this.panNode.pan.setTargetAtTime(
                pan, time, SonificationInstrument.rampTime);
        }
    }


    // Time is given in AudioContext timespace.
    setFilterAtTime(
        filter: 'lowpass'|'highpass',
        time: number,
        frequency?: number,
        resonance?: number
    ): void {
        const node: BiquadFilterNode = (this as any)[filter + 'Node'];
        if (node) {
            if (defined(resonance)) {
                node.Q.setTargetAtTime(
                    resonance, time, SonificationInstrument.rampTime);
            }
            if (defined(frequency)) {
                node.frequency.setTargetAtTime(
                    frequency, time, SonificationInstrument.rampTime);
            }
        }
    }


    // Time is given in AudioContext timespace.
    setVolumeAtTime(time: number, volume: number): void {
        if (this.volumeNode) {
            this.volumeNode.gain.setTargetAtTime(
                volume, time, SonificationInstrument.rampTime);
        }
    }


    // Speed and depth go from 0 to 1.
    // Time is given in AudioContext timespace.
    setTremoloAtTime(
        time: number, depth?: number, speed?: number
    ): void {
        if (this.tremoloDepth && defined(depth)) {
            this.tremoloDepth.gain.setTargetAtTime(
                depth, time, SonificationInstrument.rampTime);
        }
        if (this.tremoloOsc && defined(speed)) {
            this.tremoloOsc.frequency.setTargetAtTime(
                15 * speed, time, SonificationInstrument.rampTime);
        }
    }


    cancelScheduled(): void {
        this.synthPatch.cancelScheduled();
        [
            this.tremoloDepth && this.tremoloDepth.gain,
            this.tremoloOsc && this.tremoloOsc.frequency,
            this.lowpassNode && this.lowpassNode.frequency,
            this.lowpassNode && this.lowpassNode.Q,
            this.highpassNode && this.highpassNode.frequency,
            this.highpassNode && this.highpassNode.Q,
            this.panNode && this.panNode.pan,
            this.volumeNode.gain
        ].forEach((p): unknown => (p && p.cancelScheduledValues(0)));
    }


    private createNodesFromCapabilities(
        capabilities: SonificationInstrumentCapabilitiesOptions
    ): void {
        const ctx = this.audioContext;
        if (capabilities.pan) {
            this.panNode = new StereoPannerNode(ctx);
        }
        if (capabilities.tremolo) {
            this.tremoloOsc = new OscillatorNode(ctx, {
                type: 'sine',
                frequency: 3
            });
            this.tremoloDepth = new GainNode(ctx);
            this.tremoloOsc.connect(this.tremoloDepth);
            this.tremoloDepth.connect(this.masterVolNode.gain);
            this.tremoloOsc.start();
        }
        if (capabilities.filters) {
            this.lowpassNode = new BiquadFilterNode(ctx, {
                type: 'lowpass',
                frequency: 20000
            });
            this.highpassNode = new BiquadFilterNode(ctx, {
                type: 'highpass',
                frequency: 0
            });
        }
    }


    // Connect audio node chain from output down to input, depending on
    // which nodes exist.
    private connectCapabilityNodes(input: AudioNode, output: AudioNode): void {
        [
            this.panNode,
            this.lowpassNode,
            this.highpassNode,
            input
        ].reduce((prev, cur): AudioNode =>
            (cur ?
                (cur.connect(prev as AudioNode), cur as AudioNode) :
                prev as AudioNode
            ), output);
    }


    // Note can be a string 'c0' to 'b8' or a number of semitones from c0.
    private static musicalNoteToFrequency(note: string|number): number {
        let notesFromC0 = note as number;
        if (typeof note === 'string') {
            const match = note.match(/^([a-g][#b]?)([0-8])$/ui),
                semitone = match ? match[1] : 'a',
                wholetone = semitone[0].toLowerCase(),
                accidental = semitone[1],
                octave = match ? parseInt(match[2], 10) : 4,
                accidentalOffset = accidental === '#' ?
                    1 : accidental === 'b' ? -1 : 0;
            notesFromC0 = ({
                c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11
            }[wholetone] || 0) + accidentalOffset + octave * 12;
        }
        return 16.3516 * Math.pow(2, Math.min(notesFromC0, 107) / 12);
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SonificationInstrument;
