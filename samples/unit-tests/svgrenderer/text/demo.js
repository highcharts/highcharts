QUnit.test('titleSetter', function (assert) {
    var chart = Highcharts.chart('container', {
        }),
        str = 'The quick brown fox<br> jumps over the lazy dog',
        newTitle = 'Quick brown fox',
        text = chart.renderer.text(str, 100, 100).css({ width: 100, textOverflow: 'ellipsis' }).add();

    assert.strictEqual(
        text.element.getElementsByTagName('title')[0].textContent, // Ideally there should be a titleGetter. text.attr('title')
        str.replace('<br>', ''),
        'Text element has a correct title. #5211'
    );

    // Update the title tag with a shorter text
    text.attr('title', newTitle);
    assert.strictEqual(
        text.element.getElementsByTagName('title')[0].textContent, // Ideally there should be a titleGetter. text.attr('title')
        newTitle,
        'Text element title has been updated. #5211'
    );
});
