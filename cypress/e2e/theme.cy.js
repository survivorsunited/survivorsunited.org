const deviceTheme = (value) => cy.then(() => Cypress.automation('remote:debugger:protocol', {
  command: 'Emulation.setEmulatedMedia',
  params: {features: [{name: 'prefers-color-scheme', value}]},
}));
const toggle = () => cy.get('.navbar button[aria-label^="Switch between Automatic"]').filter(':visible');
const appearance = (choice, theme) => {
  cy.get('html').should('have.attr', 'data-theme-choice', choice).and('have.attr', 'data-theme', theme);
};

describe('Theme selector', () => {
  afterEach(() => deviceTheme(''));

  for (const theme of ['light', 'dark']) {
    it(`defaults to Automatic on a device using ${theme} appearance`, () => {
      deviceTheme(theme);
      cy.visit('/');
      appearance('system', theme);
      toggle().should('have.attr', 'title', 'Automatic');
    });
  }

  it('cycles through all three states, remembers manual choices, and returns to Automatic', () => {
    deviceTheme('dark');
    cy.visit('/');
    toggle().click();
    appearance('light', 'light');
    cy.reload();
    appearance('light', 'light');
    toggle().click();
    appearance('dark', 'dark');
    deviceTheme('light');
    appearance('dark', 'dark');
    cy.reload();
    appearance('dark', 'dark');
    toggle().click();
    appearance('system', 'light');
    cy.reload();
    appearance('system', 'light');
    deviceTheme('dark');
    appearance('system', 'dark');
  });

  it('provides the same three choices in the mobile menu', () => {
    deviceTheme('light');
    cy.viewport(375, 812);
    cy.visit('/docs/minecraft/installation');
    cy.get('button[aria-label="Toggle navigation bar"]').click();
    toggle().should('have.attr', 'title', 'Automatic').click();
    appearance('light', 'light');
    toggle().click();
    appearance('dark', 'dark');
    toggle().click();
    appearance('system', 'light');
  });
});
