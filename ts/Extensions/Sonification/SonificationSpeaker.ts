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
    find
} = U;


interface SpeakerOptions {
    name?: string;
    language: string;
    pitch?: number;
    rate?: number;
    volume?: number;
}


/**
 * @private
 */
class SonificationSpeaker {
    private synthesis: SpeechSynthesis;
    private voice?: SpeechSynthesisVoice;
    private scheduled: number[];

    constructor(private options: SpeakerOptions) {
        this.synthesis = window.speechSynthesis;
        if (typeof speechSynthesis.onvoiceschanged !== 'undefined') {
            speechSynthesis.onvoiceschanged = this.setVoice.bind(this);
        }
        this.setVoice();
        this.scheduled = [];
    }


    say(message: string): void {
        if (this.synthesis) {
            this.synthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(message);
            if (this.voice) {
                utterance.voice = this.voice;
            }
            utterance.rate = this.options.rate || 1;
            utterance.pitch = this.options.pitch || 1;
            utterance.volume = this.options.volume || 1;
            this.synthesis.speak(utterance);
        }
    }


    // Time in seconds from now
    sayAtTime(time: number, message: string): void {
        this.scheduled.push(
            setTimeout(this.say.bind(this, message), time * 1000)
        );
    }


    cancelScheduled(): void {
        this.scheduled.forEach(clearTimeout);
        this.scheduled = [];
    }


    private setVoice(): void {
        if (this.synthesis) {
            const name = this.options.name,
                lang = this.options.language;
            this.voice = find(
                this.synthesis.getVoices(),
                (voice): boolean => (
                    name ? voice.name === name : voice.lang === lang
                )
            );
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SonificationSpeaker;
