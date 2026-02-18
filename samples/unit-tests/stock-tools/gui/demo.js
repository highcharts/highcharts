QUnit.test('Stocktools GUI', function (assert) {
    const chart = Highcharts.stockChart('container', {
        stockTools: {
            gui: {
                enabled: true,
                definitions: {
                    measure: {
                        items: ['measureX']
                    }
                }
            }
        },
        title: {
            text: 'Chart title',
            align: 'left'
        },
        legend: {
            enabled: true,
            align: 'left'
        },
        series: [
            {
                data: [1, 2, 3]
            }
        ]
    });

    assert.ok(
        1,
        'No errors should be thrown after setting just one item (#10980)'
    );

    // This doesnt work outside highcharts-utils, possibly because it needs
    // the css
    /*
    const spacing = Highcharts.defaultOptions.chart.spacing[3];
    const offset = spacing + chart.stockTools.listWrapper.offsetWidth;

    assert.strictEqual(
        chart.legend.group.translateX,
        offset,
        '#9744: Legend should have correct position'
    );
    assert.strictEqual(
        chart.title.attr('x'),
        offset,
        '#9744: Title should have the correct position'
    );

    Highcharts.fireEvent(chart.stockTools.showhideBtn, 'click');

    assert.strictEqual(
        chart.legend.group.translateX,
        spacing,
        '#9744: Legend should have correct position after hiding toolbar'
    );
    assert.strictEqual(
        chart.title.attr('x'),
        spacing,
        '#9744: Title should have the correct position after hiding toolbar'
    );
    */

    // Get the aria label of the indicators button
    const indicatorsAria = document
        .querySelector('.highcharts-indicators > *')
        ?.getAttribute('aria-label');

    assert.strictEqual(
        indicatorsAria,
        'Indicators',
        'Toolbar buttons should have aria labels'
    );
    // Shorthand for selecting a button


    function selectButton(name, text = '') {

        let button = document.getElementsByClassName('highcharts-' + name)[0];

        if (button.tagName === 'UL' && text !== '') {

            button = button.getElementsByTagName('li');
            let found = false,
                i = -1;

            while (!found && ++i < button.length) { // Find the button with text
                if (button[i].innerHTML.indexOf(text) !== -1) {
                    found = true;
                    button = button[i].childNodes[0];
                    button.click();
                }
            }
        } else {
            button.click();
        }

    }

    selectButton('indicators'); // Click on indicators
    selectButton('indicator-list', 'APO'); // Click on APO.

    const textLabel = chart
        .navigationBindings
        .popup.container
        .childNodes[3]
        .childNodes[1]
        .childNodes[0]
        .childNodes[6]
        .firstChild
        .data; // Periods textLabel of APO

    assert.strictEqual(
        textLabel,
        'Periods', 'APO should have Periods text-label.'
    );
});

QUnit.test('Stocktools GUI update', function (assert) {
    let redrawsAmount = 0;
    const chart = Highcharts.stockChart('container', {
        chart: {
            events: {
                redraw: function () {
                    redrawsAmount++;
                }
            }
        },
        series: [
            {
                data: [1, 2, 3]
            }
        ]
    });

    chart.update({
        stockTools: {
            gui: {
                enabled: true,
                buttons: ['indicators', 'measure'],
                className: 'updatedClassName',
                toolbarClassName: 'updatedToolbarClassName'
            }
        }
    });

    assert.strictEqual(
        redrawsAmount,
        1,
        'Updating Stock Tools should trigger redraw only once.'
    );

    assert.ok(
        chart.stockTools.wrapper.classList.contains('updatedClassName'),
        'Stock Tools should have updated class name.'
    );

    assert.ok(
        chart.stockTools.toolbar.classList.contains('updatedToolbarClassName'),
        'Toolbar should have updated class name.'
    );

    assert.strictEqual(
        chart.stockTools.toolbar.children.length,
        2,
        'Stock Tools should have correct number of buttons after update.'
    );

    chart.update({
        stockTools: {
            gui: {
                enabled: false
            }
        }
    });

    assert.strictEqual(
        document.querySelector('.highcharts-stocktools-wrapper'),
        null,
        'Stock Tools should be destroyed after disabling.'
    );
});
