describe('Grid responsive rules.', () => {
    const wrapperSelector = '#wrapper';
    const captionSelector = '.hcg-caption';

    const setWrapperWidth = (width) => {
        cy.get(wrapperSelector).then(($wrapper) => {
            $wrapper[0].style.width = `${width}px`;
        });
    };
    const assertColumns = (expectedIds) => {
        cy.get('th[data-column-id]').then(($headers) => {
            const ids = [...$headers].map((el) => el.dataset.columnId);
            expect(ids).to.deep.equal(expectedIds);
        });
    };

    beforeEach(() => {
        cy.visit('grid-lite/cypress/grid-responsive');
    });

    it('should render desktop layout by default', () => {
        cy.get(captionSelector)
            .should('be.visible')
            .and('contain', 'Desktop: full data set');
        assertColumns([
            'firstName',
            'lastName',
            'email',
            'mobile',
            'street',
            'city',
            'state',
            'zip'
        ]);
        cy.get('.hcg-row[data-row-index="0"] td[data-column-id="firstName"]')
            .first()
            .should('have.text', 'Liam');
    });

    it('should switch to tablet layout on smaller width', () => {
        setWrapperWidth(700);
        cy.get(captionSelector)
            .should('contain', 'Tablet: fewer columns');
        assertColumns(['firstName', 'email', 'mobile', 'street']);
        cy.get('.hcg-row[data-row-index="0"] td[data-column-id="firstName"]')
            .first()
            .should('have.text', 'Liam Smith');
    });

    it('should switch to mobile layout on smallest width', () => {
        setWrapperWidth(480);
        cy.get(captionSelector)
            .should('contain', 'Mobile: compact view');
        assertColumns(['firstName', 'mobile', 'street']);
        cy.get('.hcg-row[data-row-index="0"] td[data-column-id="firstName"]')
            .first()
            .find('a')
            .should('have.attr', 'href')
            .and('include', 'mailto:liam.smith@example.com');
    });

    it('should restore desktop formatting when width grows again', () => {
        setWrapperWidth(480);
        cy.get(captionSelector)
            .should('contain', 'Mobile: compact view');

        setWrapperWidth(980);
        cy.get(captionSelector)
            .should('contain', 'Desktop: full data set');
        assertColumns([
            'firstName',
            'lastName',
            'email',
            'mobile',
            'street',
            'city',
            'state',
            'zip'
        ]);
        cy.get('.hcg-row[data-row-index="0"] td[data-column-id="firstName"]')
            .first()
            .should('have.text', 'Liam');
    });
});
