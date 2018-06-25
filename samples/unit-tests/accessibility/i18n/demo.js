QUnit.test('langFormat', function (assert) {
    var chart = Highcharts.chart('container', {
        lang: {
            test: 'Test format',
            parent: {
                sublevel: {
                    test2: 'Test format 2'
                }
            }
        }
    });
    assert.strictEqual(
        chart.langFormat('test'),
        'Test format',
        'Lang format takes simple key'
    );
    assert.strictEqual(
        chart.langFormat('parent.sublevel.test2'),
        'Test format 2',
        'Lang format takes multilevel key'
    );
    assert.notOk(
        chart.langFormat('parent.sublevel'),
        'Non string result'
    );
    assert.notOk(
        chart.langFormat('notexist.parent.sublevel'),
        'Invalid keys 1'
    );
    assert.notOk(
        chart.langFormat('test.notexist.notexisting'),
        'Invalid keys 2'
    );
});

QUnit.test('i18nFormat', function (assert) {
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {substitute}',
            { substitute: 'format' }
        ),
        'Test format',
        'Simple substitution'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {substitute}',
            { substitute: 18 }
        ),
        'Test 18',
        'Simple substitution 2'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {substitute}{substitute}{substitute}{substitute}',
            { substitute: 18 }
        ),
        'Test 18181818',
        'Duplicate substitutions'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {substitute:.2f}',
            { substitute: 3.1415 }
        ),
        'Test 3.14',
        'Formatted substitution'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {arr[0]}, {arr[1]}.',
            { arr: [0, 1, 2, 3, 4, 5] }
        ),
        'Test 0, 1.',
        'Array indexing'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {arr[-1]}, {arr[-2]}, {arr[-3]}.',
            { arr: [0, 1, 2, 3, 4, 5] }
        ),
        'Test 5, 4, 3.',
        'Array reverse indexing'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {arr[10]}, {arr[-10]}.',
            { arr: [0, 1, 2, 3, 4, 5] }
        ),
        'Test 5, 0.',
        'Array overshoot indexing'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {substitute[3]}',
            { substitute: 14 }
        ),
        'Test ',
        'Indexing non-array'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {substitute[3]}',
            { substitute: {} }
        ),
        'Test ',
        'Indexing non-array 2'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {#each(arr)}',
            { arr: [0, 1, 2, 3, 4, 5] }
        ),
        'Test 012345',
        'Simple array each'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {!#each(arr)} {#each(arr)!}.',
            { arr: [0, 1, 2, 3, 4, 5] }
        ),
        'Test !0!1!2!3!4!5 0!1!2!3!4!5!.',
        'Array each pre or post'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {!!#each(arr)??}.',
            { arr: [0, 1, 2, 3, 4, 5] }
        ),
        'Test !!0??!!1??!!2??!!3??!!4??!!5??.',
        'Array each pre and post'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {!!#each(arr)??}.',
            { arr: [0, 1, 2, 3, 4, 5] }
        ),
        'Test !!0??!!1??!!2??!!3??!!4??!!5??.',
        'Array each pre and post'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {#each(arr, 3)}.',
            { arr: [0, 1, 2, 3, 4, 5] }
        ),
        'Test 012.',
        'Array each positive length'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {#each(arr, 30)}{asdf#each(arr, -30)asdf}.',
            { arr: [0, 1, 2, 3, 4, 5] }
        ),
        'Test 012345.',
        'Array each length overshoot'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Test {#each(arr,-2)}.',
            { arr: [0, 1, 2, 3, 4, 5] }
        ),
        'Test 0123.',
        'Array each negative length'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'We have {0.#each(arr, -1), }and 0.{arr[-1]}.',
            { arr: [0, 1, 2, 3, 4, 5] }
        ),
        'We have 0.0, 0.1, 0.2, 0.3, 0.4, and 0.5.',
        'Array each combination'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Items: {#plural(num, many, one)}.',
            { num: 1 }
        ),
        'Items: one.',
        'Plural conditional 1'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Items: {#plural(num, many)}.',
            { num: 1 }
        ),
        'Items: many.',
        'Plural conditional 2'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Items: {#plural(num)}.',
            { num: 1 }
        ),
        'Items: .',
        'Plural conditional 3'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Items: {#plural(num, many, one, two)}.',
            { num: 2 }
        ),
        'Items: two.',
        'Plural conditional 4'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Items: {#plural(num,many,one,two,none)}.',
            { num: 0 }
        ),
        'Items: none.',
        'Plural conditional 5'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Items: {#plural(num, many, one, two, none)}.',
            { num: 19 }
        ),
        'Items: many.',
        'Plural conditional 6'
    );
    assert.strictEqual(
        Highcharts.i18nFormat(
            'Items: {#plural(num, many,)}.',
            { num: 1 }
        ),
        'Items: .',
        'Plural conditional 7'
    );
});

QUnit.test('Chart lang can be configured', function (assert) {
    var chart = Highcharts.chart('container', {
        lang: {
            accessibility: {
                chartContainerLabel: 'testing',
                structureHeading: 'testing2',
                chartTypes: {
                    lineSingle: 'testing3'
                }
            }
        },
        series: [{ data: [1, 2, 3] }]
    });

    assert.strictEqual(chart.renderTo.getAttribute('aria-label'), 'testing',
        'Container label configured');

    assert.ok(chart.screenReaderRegion.innerHTML.indexOf(
        '<h4>testing2</h4><div>testing3</div>'
    ) > 0);
});
