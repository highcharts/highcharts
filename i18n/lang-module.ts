// @ts-nocheck
import languageOptions from 'langFile';
import H from 'highchartsGlobal';

H.setOptions({
    lang: languageOptions,
    title: {
        text: languageOptions.defaults.chartTitle
    }
});

