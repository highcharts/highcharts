QUnit.test('Heading auto detection works as expected', function (assert) {
    document.getElementById('container').innerHTML = `
        <div>
            <div>
                <h2>
                    <div id="1">Should be h3</div>
                </h2>
            </div>
            <div>
                <h4></h4>
                <div>
                    <div id="2">Should be h5</div>
                    <div>
                        <h5></h5>
                        <div id="3">Should be h6</div>
                    </div>
                </div>
                <h3></h3>
            </div>
            <h1>
            </h1>
            <div>
                <div id="4">Should be h2</div>
            </div>
        </div>  
    `;

    const getHeading = Highcharts.A11yHTMLUtilities.getHeadingTagNameForElement;
    const getEl = (e) => document.getElementById(e);

    assert.strictEqual(
        getHeading(document.body),
        'p',
        'document.body should not have a heading.'
    );
    assert.strictEqual(
        getHeading(getEl('1')),
        'h3',
        'Nested inside h2 should give h3.'
    );
    assert.strictEqual(
        getHeading(getEl('2')),
        'h5',
        'Parent previous sibling h4 should give h5.'
    );
    assert.strictEqual(
        getHeading(getEl('3')),
        'h6',
        'Previous sibling h5 should give h6.'
    );
    assert.strictEqual(
        getHeading(getEl('4')),
        'h2',
        'Parent previous sibling h1 should give h2.'
    );
});
