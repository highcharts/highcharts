describe('Stock Tools', () => {
    beforeEach(() => {
        cy.viewport(1000, 500);
    });

    before(() => {
        cy.visit('/stock/demo/stock-tools-gui');
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
    });

    it('#15729: Should keep annotation selected after dragging', () => {
        cy.get('.highcharts-toggle-annotations').click();

        cy.get('.highcharts-annotation')
            .click()
            .trigger('mousedown');
        cy.get('.highcharts-container')
            .trigger('mousemove', 300, 100)
            .trigger('mouseup', 300, 100)
            .trigger('click');
        cy.get('.highcharts-popup').should('be.visible');
    });

    it('#15729: Should keep annotation selected after dragging control point', () => {
        cy.get('.highcharts-control-points')
            .children()
            .first()
            .trigger('mousedown');
        cy.get('.highcharts-container')
            .trigger('mousemove', 600, 200)
            .trigger('mouseup', 600, 200)
            .trigger('click');
        cy.get('.highcharts-popup').should('be.visible');
    });
});
