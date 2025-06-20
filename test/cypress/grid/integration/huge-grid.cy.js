describe('Scrolling in 10 million row grid', () => {
    before(() => {
        // Visit the sample page containing both grids once per suite
        cy.visit('/grid-lite/cypress/huge-grid');
    });

    it('scrolls to the bottom of the 10 million row grid and verifies the last rows', () => {
        cy.get('#grid-1 tbody').scrollTo(0, '100%');

        // Wait until virtualization updates the rows (the placeholder value "20" disappears)
        cy.get('#grid-1 tbody tr')
            .eq(-2)
            .find('td')
            .last()
            .should($td => {
                expect($td.attr('data-value')).to.not.equal('20');
            });

        // Verify last row value
        cy.get('#grid-1 tbody tr')
            .last()
            .find('td')
            .last()
            .invoke('attr', 'data-value')
            .then(value => {
                expect(value).to.be.equal('10000000');
            });

        // Verify second-to-last row value
        cy.get('#grid-1 tbody tr')
            .eq(-2)
            .find('td')
            .last()
            .invoke('attr', 'data-value')
            .then(value => {
                expect(value).to.be.equal('9999999');
            });
    });
});

describe('Scrolling in 1 million row grid', () => {
    before(() => {
        // Reuse the same page visit
        cy.visit('/grid-lite/cypress/huge-grid');
    });

    it('scrolls to the bottom of the 1 million row grid and verifies the last rows', () => {
        cy.get('#grid-2 tbody').scrollTo(0, '100%');

        // Wait until virtualization updates the rows (the placeholder value "20" disappears)
        cy.get('#grid-2 tbody tr')
            .eq(-2)
            .find('td')
            .last()
            .should($td => {
                expect($td.attr('data-value')).to.not.equal('20');
            });

        // Verify last row value
        cy.get('#grid-2 tbody tr')
            .last()
            .find('td')
            .last()
            .invoke('attr', 'data-value')
            .then(value => {
                expect(value).to.be.equal('1000000');
            });

        // Verify second-to-last row value
        cy.get('#grid-2 tbody tr')
            .eq(-2)
            .find('td')
            .last()
            .invoke('attr', 'data-value')
            .then(value => {
                expect(value).to.be.equal('999999');
            });
    });
});
