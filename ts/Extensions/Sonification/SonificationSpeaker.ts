/* *
 *
 *  (c) 2009-2022 Øystein Moseng
 *
 *  Class representing a speech synthesis voice.
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

import U from '../../Core/Utilities.js';
const {
    pick
} = U;

declare global {
    namespace Sonification {
        interface SpeakerOptions {
            // Preferred voice, falls back to language if not found
            name?: string;
            language: string;
            pitch?: number;
            rate?: number;
            volume?: number;
        }
    }
}

/**
 * @private
 */
class SonificationSpeaker {
    private synthesis: SpeechSynthesis;
    private voice?: SpeechSynthesisVoice;
    private scheduled: number[];

    constructor(private options: Sonification.SpeakerOptions) {
        this.synthesis = window.speechSynthesis;
        if (typeof speechSynthesis.onvoiceschanged !== 'undefined') {
            speechSynthesis.onvoiceschanged = this.setVoice.bind(this);
        }
        this.setVoice();
        this.scheduled = [];
    }


    say(message: string, options?: Partial<Sonification.SpeakerOptions>): void {
        if (this.synthesis) {
            this.synthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            if (this.voice) {
                utterance.voice = this.voice;
            }

            utterance.rate = options && options.rate || this.options.rate || 1;
            utterance.pitch = options && options.pitch ||
                this.options.pitch || 1;
            utterance.volume = pick(options && options.volume,
                this.options.volume, 1);

            this.synthesis.speak(utterance);
        }
    }


    // Time in milliseconds from now
    sayAtTime(time: number, message: string, options?: Partial<Sonification.SpeakerOptions>): void {
        this.scheduled.push(
            setTimeout(this.say.bind(this, message, options), time)
        );
    }


    cancel(): void {
        this.scheduled.forEach(clearTimeout);
        this.scheduled = [];
        this.synthesis.cancel();
    }


    // Ran on TimelineChannel.destroy
    destroy(): void {
        // Currently all we need to do is cancel.
        this.cancel();
    }


    setMasterVolume(vol: number): void {
        this.options.volume = vol;
    }


    private setVoice(): void {
        if (this.synthesis) {
            const name = this.options.name,
                lang = this.options.language,
                voices = this.synthesis.getVoices(),
                len = voices.length;
            let langFallback;
            for (let i = 0; i < len; ++i) {
                if (name && voices[i].name === name) {
                    this.voice = voices[i];
                    return;
                }
                if (!langFallback && voices[i].lang === lang) {
                    langFallback = voices[i];
                    if (!name) {
                        break;
                    }
                }
            }
            this.voice = langFallback;
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SonificationSpeaker;
