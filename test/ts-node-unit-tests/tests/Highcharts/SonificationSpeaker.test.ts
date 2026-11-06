/* *
 *
 *  (c) 2009-2026 Highsoft AS
 *
 *  Integration of this software requires a license.
 *  - For commercial use, see www.highcharts.com/license
 *  - For non-commercial, see www.highcharts.com/license-eula
 *
 * */

'use strict';

import assert from 'node:assert';
import { describe, it } from 'node:test';

describe('SonificationSpeaker', (): void => {
    it('should preserve a zero speech pitch override',
        async (): Promise<void> => {
            let spokenUtterance: { pitch: number } | undefined;
            const globalRecord = global as Record<string, any>,
                globalKeys = [
                    'window',
                    'speechSynthesis',
                    'SpeechSynthesisUtterance'
                ],
                originalGlobals = globalKeys.map((key) => ({
                    exists: Object.hasOwnProperty.call(globalRecord, key),
                    key,
                    value: globalRecord[key]
                })),
                synthesis = {
                    cancel: (): void => {},
                    getVoices: (): never[] => [],
                    onvoiceschanged: void 0,
                    speak: (utterance: { pitch: number }): void => {
                        spokenUtterance = utterance;
                    }
                };

            try {
                global.window = { speechSynthesis: synthesis } as never;
                global.speechSynthesis = synthesis as never;
                global.SpeechSynthesisUtterance = class {
                    public pitch = 1;
                    public rate = 1;
                    public volume = 1;

                    constructor(public text: string) {}
                } as never;

                const { default: SonificationSpeaker } = await import(
                        '../../../../ts/Extensions/Sonification/' +
                        'SonificationSpeaker.js'
                    ),
                    speaker = new SonificationSpeaker({ pitch: 0.5 });

                speaker.say('Low', { pitch: 0 });

                assert.strictEqual(spokenUtterance?.pitch, 0);
            } finally {
                for (const { exists, key, value } of originalGlobals) {
                    if (exists) {
                        globalRecord[key] = value;
                    } else {
                        Reflect.deleteProperty(globalRecord, key);
                    }
                }
            }
        });
});
