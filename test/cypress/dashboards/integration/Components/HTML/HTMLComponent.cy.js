describe('Updating HTML component.', () => {
    before(()=>{
        cy.visit('dashboards/cypress/component-html');
    });

    it('Should update the HTML component title and caption.', () => {
        cy.get('.highcharts-dashboards-component-title').should('have.text', 'Title (original)');
        cy.get('.highcharts-dashboards-component-caption').should('have.text', 'Caption (original)');

        cy.board().then(dashboard => {
            const htmlComp = dashboard.mountedComponents[0].component;

            htmlComp.update({
                title: 'Changed title',
                caption: 'Changed caption'
            });

            cy.get('.highcharts-dashboards-component-title').should('have.text', 'Changed title');
            cy.get('.highcharts-dashboards-component-caption').should('have.text', 'Changed caption');
        })
    });
});
