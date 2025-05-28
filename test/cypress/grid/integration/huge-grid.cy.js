describe('Scrolling in a grid that exceeds max html height', () => {
    before(() => {
        cy.visit('/grid-lite/cypress/huge-grid');
    });

    it('scroll to the bottom and check that rows are correct', () => {
        cy.get('tbody').scrollTo(0, '100%');
        // Wait until the second-to-last row's last cell is not '20'
        // indicating virtualization has updated
        cy.get('tbody tr').eq(-2).find('td').last().should($td => {
          expect($td.attr('data-value')).to.not.equal('20');
        });
        // Now continue with the rest of the assertions
        cy.get('tbody tr')
            .last()
            .find('td')
            .last()
            .invoke('attr', 'data-value')
            .then(value => {
          expect(value).to.be.equal('10000000');
        });
        cy.get('tbody tr')
            .eq(-2)
            .find('td')
            .last()
            .invoke('attr', 'data-value')
            .then(value => {
          expect(value).to.be.equal('99999999');
        });
    });
});
