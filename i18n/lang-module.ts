// @ts-nocheck
import languageOptions from 'langFile';
import H from 'highchartsGlobal';

H.setOptions({
    lang: languageOptions
});

if ('RangeSelector' in H) {
    H.RangeSelector.prototype.defaultButtons = [{
        type: 'month',
        count: 1,
        text: H.getOptions().lang.rangeSelector.monthText,
        title: H.getOptions().lang.rangeSelector.monthTitle
    }, {
        type: 'month',
        count: 3,
        text: H.getOptions().lang.rangeSelector.monthText,
        title: H.getOptions().lang.rangeSelector.monthTitle
    }, {
        type: 'month',
        count: 6,
        text: H.getOptions().lang.rangeSelector.monthText,
        title: H.getOptions().lang.rangeSelector.monthTitle
    }, {
        type: 'ytd',
        text: H.getOptions().lang.rangeSelector.YTDText,
        title: H.getOptions().lang.rangeSelector.YTDTitle
    }, {
        type: 'year',
        count: 1,
        text: H.getOptions().lang.rangeSelector.yearText,
        title: H.getOptions().lang.rangeSelector.yearTitle
    }, {
        type: 'all',
        text: 'All',
        title: H.getOptions().lang.rangeSelector.allTitle
    }]
}
