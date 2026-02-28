/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *  Author: Øystein Moseng
 *
 *  Class representing a speech synthesis voice.
 *
 *  A commercial license may be required depending on use.
 *  See www.highcharts.com/license
 *
 *
 * */

'use strict';

import U from '../../Core/Utilities.js';
const {
    addEvent,
    pick
} = U;

namespace SonificationSpeaker {
    export interface SpeakerOptions {
        name?: string;
        language?: string;
        pitch?: number;
        rate?: number;
        volume?: number;
    }
}


/**
 * The SonificationSpeaker class. This class represents an announcer using
 * speech synthesis. It allows for scheduling speech announcements, as well
 * as speech parameter changes - including rate, volume and pitch.
 *
 * @sample highcharts/demo/sonification-navigation
 *         Demo using SonificationSpeaker directly for some announcements
 *
 * @requires modules/sonification
 *
 * @class
 * @name Highcharts.SonificationSpeaker
 *
 * @param {Highcharts.SonificationSpeakerOptionsObject} options
 *        Configuration for the speaker
 */
class SonificationSpeaker {
    private synthesis: SpeechSynthesis;
    private voice?: SpeechSynthesisVoice;
    private unbindVoicesChanged?: Function;
    private scheduled: number[];
    private masterVolume = 1;

    constructor(private options: SonificationSpeaker.SpeakerOptions) {
        this.synthesis = window.speechSynthesis;
        this.scheduled = [];
        this.setVoice();
        if (
            !this.voice &&
            typeof speechSynthesis.onvoiceschanged !== 'undefined'
        ) {
            this.unbindVoicesChanged = addEvent(
                this.synthesis,
                'voiceschanged',
                this.setVoice.bind(this)
            );
        }
    }


    /**
     * Say a message using the speaker voice. Interrupts other currently
     * speaking announcements from this speaker.
     * @function Highcharts.SonificationSpeaker#say
     * @param {string} message The message to speak.
     * @param {SonificationSpeakerOptionsObject} [options]
     * Optionally override speaker configuration.
     * @param {EventListener} [onEnd]
     * Optionally provide a callback to call when the message has been spoken.
     */
    say(
        message: string,
        options?: SonificationSpeaker.SpeakerOptions,
        onEnd?: EventListener
    ): void {
        if (this.synthesis) {
            this.synthesis.cancel();
            this.setVoice(options);
            const utterance = new SpeechSynthesisUtterance(message);

            utterance.lang = pick(
                options && options.language,
                this.options.language,
                this.voice && this.voice.lang,
                'en'
            );
            if (this.voice) {
                utterance.voice = this.voice;
            }

            if (onEnd) {
                utterance.onend = onEnd as EventListener;
            }

            utterance.rate = options && options.rate || this.options.rate || 1;
            utterance.pitch = options && options.pitch ||
                this.options.pitch || 1;
            utterance.volume = pick(
                options && options.volume,
                this.options.volume, 1
            ) * this.masterVolume;

            this.synthesis.speak(utterance);
        }
    }


    /**
     * Schedule a message using the speaker voice.
     * @function Highcharts.SonificationSpeaker#sayAtTime
     * @param {number} time
     * The time offset to speak at, in milliseconds from now.
     * @param {string} message
     * The message to speak.
     * @param {SonificationSpeakerOptionsObject} [options]
     * Optionally override speaker configuration.
     * @param {EventListener} [onEnd]
     * Optionally provide a callback to call when the message has been spoken.
     */
    sayAtTime(
        time: number,
        message: string,
        options?: SonificationSpeaker.SpeakerOptions,
        onEnd?: EventListener
    ): void {
        this.scheduled.push(
            setTimeout(this.say.bind(this, message, options, onEnd), time)
        );
    }


    /**
     * Clear scheduled announcements, and stop current speech.
     * @function Highcharts.SonificationSpeaker#cancel
     */
    cancel(): void {
        this.scheduled.forEach(clearTimeout);
        this.scheduled = [];
        this.synthesis.cancel();
    }


    /**
     * Stop speech and release any used resources
     * @internal
     */
    destroy(): void {
        // Ran on TimelineChannel.destroy
        // (polymorphism with SonificationInstrument).
        if (this.unbindVoicesChanged) {
            this.unbindVoicesChanged();
            delete this.unbindVoicesChanged;
        }
        this.cancel();
    }


    /**
     * Set speaker overall/master volume modifier. This affects all
     * announcements, and applies in addition to the individual announcement
     * volume.
     * @function Highcharts.SonificationSpeaker#setMasterVolume
     * @param {number} vol Volume from 0 to 1.
     */
    setMasterVolume(vol: number): void {
        this.masterVolume = vol;
    }


    /**
     * Set the active synthesis voice for the speaker.
     * @internal
     */
    private setVoice(
        options?: SonificationSpeaker.SpeakerOptions
    ): void {
        if (this.synthesis) {
            const name = pick(
                    options && options.name,
                    this.options.name,
                    ''
                ).toLowerCase(),
                lang = pick(
                    options && options.language,
                    this.options.language,
                    'en'
                )
                    .toLowerCase().replace(/_/g, '-'),
                baseLang = lang.split('-')[0],
                voices = this.synthesis.getVoices(),
                langMatches = (
                    voiceLang: string,
                    targetLang: string
                ): boolean =>
                    voiceLang === targetLang ||
                    (
                        targetLang.indexOf('-') < 0 &&
                        voiceLang.indexOf(targetLang + '-') === 0
                    );
            let exactNameAndLang,
                exactName,
                fuzzyNameAndLang,
                fuzzyName,
                defaultLangFallback,
                defaultBaseLangFallback,
                defaultFallback;
            for (let i = 0; i < voices.length; ++i) {
                const voice = voices[i],
                    voiceName = voice.name.toLowerCase(),
                    voiceLang = voice.lang.toLowerCase().replace(/_/g, '-');

                if (!defaultFallback && voice.default) {
                    defaultFallback = voice;
                }
                if (
                    !defaultLangFallback &&
                    voice.default &&
                    langMatches(voiceLang, lang)
                ) {
                    defaultLangFallback = voice;
                } else if (
                    !defaultBaseLangFallback &&
                    voice.default &&
                    baseLang !== lang &&
                    baseLang &&
                    langMatches(voiceLang, baseLang)
                ) {
                    defaultBaseLangFallback = voice;
                }

                if (!name) {
                    continue;
                }
                if (voiceName === name) {
                    if (!exactName) {
                        exactName = voice;
                    }
                    if (!exactNameAndLang && langMatches(voiceLang, lang)) {
                        exactNameAndLang = voice;
                        break;
                    }
                    continue;
                }
                if (
                    voiceName.indexOf(name) < 0 &&
                    name.indexOf(voiceName) < 0
                ) {
                    continue;
                }
                if (!fuzzyName) {
                    fuzzyName = voice;
                }
                if (!fuzzyNameAndLang && langMatches(voiceLang, lang)) {
                    fuzzyNameAndLang = voice;
                }
            }

            this.voice = exactNameAndLang ||
                exactName ||
                fuzzyNameAndLang ||
                fuzzyName ||
                defaultLangFallback ||
                defaultBaseLangFallback ||
                defaultFallback;

            if (this.voice && this.unbindVoicesChanged) {
                this.unbindVoicesChanged();
                delete this.unbindVoicesChanged;
            }
        }
    }
}


/* *
 *
 *  Default Export
 *
 * */

export default SonificationSpeaker;


/* *
 *
 *  API declarations
 *
 * */

/**
 * Configuration for a SonificationSpeaker.
 * @requires modules/sonification
 * @interface Highcharts.SonificationSpeakerOptionsObject
 *//**
 * Name of the voice synthesis to use. If not found, reverts to the default
 * voice for the language chosen.
 * @name Highcharts.SonificationSpeakerOptionsObject#name
 * @type {string|undefined}
 *//**
 * The language of the voice synthesis. Defaults to `"en"`.
 * @name Highcharts.SonificationSpeakerOptionsObject#language
 * @type {string|undefined}
 *//**
 * The pitch modifier of the voice. Defaults to `1`. Set higher for a higher
 * voice pitch.
 * @name Highcharts.SonificationSpeakerOptionsObject#pitch
 * @type {number|undefined}
 *//**
 * The speech rate modifier. Defaults to `1`.
 * @name Highcharts.SonificationSpeakerOptionsObject#rate
 * @type {number|undefined}
 *//**
 * The speech volume, from 0 to 1. Defaults to `1`.
 * @name Highcharts.SonificationSpeakerOptionsObject#volume
 * @type {number|undefined}
 */

(''); // Keep above doclets in JS file
