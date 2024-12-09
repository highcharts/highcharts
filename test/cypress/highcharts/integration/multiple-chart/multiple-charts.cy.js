describe('Multiple charts', () => {

    before(() => {
        cy.visit('/highcharts/cypress/multiple-charts');
    });

    it('#17192, Should not throw when mouse switches chart.', () => {
        cy.on('uncaught:exception', (err, runnable) => {
            assert.isTrue(
                false,
                'Should not throw exception when moving ' +
                'mouse between charts. Error: ' + err
            );
            return false;
        });

        cy.get('#container1')
        .trigger('mousemove', { eventConstructor: 'MouseEvent' });
        cy.get('#container2')
        .trigger('mousemove', { eventConstructor: 'MouseEvent' });

        assert.isTrue(
            true,
            'No exception when moving mouse between charts'
        );
    });
});