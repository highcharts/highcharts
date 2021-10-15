describe('Stock Tools', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
    });

    it('Adding annotation after deselecting the button should not be allowed, #16485.', () => {
        cy.get('.highcharts-label-annotation')
            .first()
            .click();
        cy.get('.highcharts-label-annotation')
            .first()
            .click();
        cy.get('.highcharts-container')
            .click(100, 210)

    cy.chart().should(chart =>
            assert.notOk(
                chart.annotations.length,
                'Annotation should not be added.'
            )
        );
    });

    it('#15730: Should close popup after hiding annotation', () => {
        cy.get('.highcharts-label-annotation').first().click();
        cy.get('.highcharts-container').click();
        cy.chart().should(chart =>
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
        cy.chart().should(chart =>
            chart.annotations[1].points.forEach(point =>
                assert.ok(point.y > -50 && point.y < 50)
            )
        );
    });

    it('#16158: Should use correct default series in popup', () => {
        cy.get('.highcharts-indicators').click();
        cy.get('.highcharts-indicator-list').contains('Accumulation').click();
        cy.get('.highcharts-tab-item-show #highcharts-select-series').should('have.value', 'aapl-ohlc');
        cy.get('.highcharts-tab-item-show #highcharts-select-volume').should('have.value', 'aapl-volume');
        cy.addIndicator();

        cy.get('.highcharts-indicators').click();
        cy.get('.highcharts-tab-item').contains('edit').click();
        cy.get('.highcharts-tab-item-show #highcharts-select-series').should('have.value', 'aapl-ohlc');
        cy.get('.highcharts-tab-item-show #highcharts-select-volume').should('have.value', 'aapl-volume');
        cy.get('.highcharts-popup-rhs-col button').contains('save').click();
    });

    it('For some indicators params, there should be a dropdown with options in popup, #16159.', () => {
        cy.openIndicators();
        cy.get('.highcharts-indicator-list')
            .contains('Disparity Index')
            .click();

        cy.get('#highcharts-select-params\\.average')
            .select('ema')
        cy.addIndicator();
    });
});
