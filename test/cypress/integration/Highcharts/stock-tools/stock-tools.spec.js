describe('Stock Tools annotation popup, #15725', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });

    it('Adding annotation after deselecting the button should not be allowed, #16485.', () => {
        cy.get('.highcharts-label-annotation').first().click();
        cy.get('.highcharts-label-annotation').first().click();
        cy.get('.highcharts-container').click(100, 210);

        cy.chart().should((chart) =>
            assert.notOk(
                chart.annotations.length,
                'Annotation should not be added.'
            )
        );
    });

    it('#15730: Should close popup after hiding annotation', () => {
        cy.get('.highcharts-label-annotation').first().click();
        cy.get('.highcharts-container').click();
        cy.chart().should((chart) =>
            assert.strictEqual(chart.annotations.length, 1)
        );
        cy.get('.highcharts-annotation').click();
        cy.get('.highcharts-popup').should('be.visible');
        cy.get('.highcharts-toggle-annotations').click();
        cy.get('.highcharts-popup').should('be.hidden');
        cy.get('.highcharts-toggle-annotations').click();
    });

    it('#15729: Should keep annotation selected after dragging', () => {
        cy.get('.highcharts-annotation')
            .click()
            .dragTo('.highcharts-container', 300, 100);
        cy.get('.highcharts-popup').should('be.visible');
    });

    it('#15729: Should keep annotation selected after dragging control point', () => {
        cy.get('.highcharts-control-points')
            .children()
            .first()
            .dragTo('.highcharts-container', 600, 200);
        cy.get('.highcharts-popup').should('be.visible');
    });

    it('#15727: Should keep popup open after dragging from input to outside popup', () => {
        cy.get('.highcharts-annotation-edit-button').click();
        cy.get('.highcharts-popup input')
            .first()
            .dragTo('.highcharts-container', 100, 200);
        cy.get('.highcharts-popup').should('be.visible');
    });

    it('#15725: Should use the same axis for all points in multi-step annotation', () => {
        cy.get('.highcharts-elliott3').first().click();
        cy.get('.highcharts-container')
            .click(100, 210)
            .click(120, 260)
            .click(140, 210)
            .click(160, 260);
        cy.chart().should((chart) =>
            chart.annotations[1].points.forEach((point) =>
                assert.ok(point.y > -50 && point.y < 50)
            )
        );
    });

    it('#16158: Should use correct default series in popup', () => {
        cy.get('.highcharts-indicators').click();
        cy.get('.highcharts-indicator-list').contains('Accumulation').click();
        cy.get('.highcharts-tab-item-show #highcharts-select-series').should(
            'have.value',
            'aapl-ohlc'
        );
        cy.get('.highcharts-tab-item-show #highcharts-select-volume').should(
            'have.value',
            'aapl-volume'
        );
        cy.addIndicator();

        cy.get('.highcharts-indicators').click();
        cy.get('.highcharts-tab-item').contains('edit').click();
        cy.get('.highcharts-tab-item-show #highcharts-select-series').should(
            'have.value',
            'aapl-ohlc'
        );
        cy.get('.highcharts-tab-item-show #highcharts-select-volume').should(
            'have.value',
            'aapl-volume'
        );
        cy.get('.highcharts-popup-rhs-col button').contains('save').click();
    });

    it('For some indicators params, there should be a dropdown with options in popup, #16159.', () => {
        cy.openIndicators();
        cy.get('.highcharts-indicator-list')
            .contains('Disparity Index')
            .click();

        cy.get('#highcharts-select-params\\.average').select('ema');
        cy.addIndicator();
    });
});

describe('Indicator popup searchbox, #16019.', () => {
    beforeEach(() => {
        cy.viewport(1000, 800);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });

    it('Search indicator input should filter and sort the list, #16019.', () => {
        cy.openIndicators();

        // Test if searching works.
        cy.get('input[name="highcharts-input-search-indicators"]')
            .click()
            .type('ac');
        cy.get('.highcharts-indicator-list').should(($p) => {
            expect($p).to.have.length(5);
        });

        // Test the sorting.
        cy.get('input[name="highcharts-input-search-indicators"]').type('c');
        cy.get('.highcharts-indicator-list li:first').should(
            'contain.text',
            'Acceleration Bands'
        );

        // Test if regex works.
        cy.get('input[name="highcharts-input-search-indicators"]').clear();
        cy.get('input[name="highcharts-input-search-indicators"]').type('cd');
        cy.get('.highcharts-indicator-list li:first').should(
            'contain.text',
            'MACD'
        );
    });

    it('Clicking the reset button should reset the indicator list, #16019.', () => {
        cy.get('.clear-filter-button').click();

        cy.get('input[name="highcharts-input-search-indicators"]').should(
            'have.value',
            ''
        );

        cy.get('.highcharts-indicator-list').should('have.length', 50);
    });

    it('Indicators should be accessible through aliases, #16019.', () => {
        cy.get('input[name="highcharts-input-search-indicators"]').type('boll');

        cy.get('.highcharts-indicator-list li:first').should(
            'contain.text',
            'BB'
        );
    });

    it('Popup should warn when no items are found using the filter, #16019.', () => {
        cy.get('input[name="highcharts-input-search-indicators"]').type('dada');

        cy.get('.highcharts-popup-rhs-col-wrapper').should(
            'contain.text',
            'No match'
        );

        cy.get('.clear-filter-button').click();

        cy.get('.highcharts-indicator-list li:first').should(
            'contain.text',
            'Acceleration Bands'
        );
    });
});
