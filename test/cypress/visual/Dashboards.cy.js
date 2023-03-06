describe('Dashboards climate demo visual tests', () => {
    before(()=>{
        cy.intercept('/**/world.topo.json').as('getTopo');
        cy.visit('/dashboards/demos/climate');

        cy.wait('@getTopo') // wait for data to be laoded
        cy.board() // ensure dashboard is loaded

        cy.wait(500)
    })

    it('Climate demo', () => {
        cy.get('#demo-content')
            .compareSnapshot('dashboard-climate-loaded', 0.1);
    })

    it('edit mode', ()=>{
        cy.toggleEditMode()
        cy.get('.hd-component').first().click()
        cy.wait(500)
        cy.get('#demo-content')
            .compareSnapshot('dashboard-climate-edit-mode', 0.1);

    })
});
