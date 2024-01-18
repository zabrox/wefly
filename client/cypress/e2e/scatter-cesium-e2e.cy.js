describe('WeFly Application Launch and Initial Display', () => {
    beforeEach(() => {
        cy.visit('http://localhost:3000');
        cy.get('.MuiCircularProgress-root').should('be.visible');
        cy.get('#track-list-body').find('tr', { timeout: 10000 }).should('have.length', 122);
        cy.get('.MuiCircularProgress-root').should('not.be.visible');
    });

    it('displays track groups', async () => {
        const win = await cy.window()
        const cesiumViewer = win.cesiumViewer;
        expect(cesiumViewer).to.not.be.undefined;
    });
});