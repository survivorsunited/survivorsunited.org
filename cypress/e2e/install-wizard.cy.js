describe('Install or Upgrade wizard', () => {
  it('asks for a computer before showing any instructions', () => {
    cy.visit('/docs/minecraft/installation');
    cy.get('main').contains('h1', 'Install or Upgrade');
    cy.get('main').contains('button', 'I use Windows').should('be.visible');
    cy.get('main').contains('button', 'I use a Mac').should('be.visible');
    cy.get('main').should('not.contain.text', 'Step 1 of 8');
    cy.get('main').should('not.contain.text', '(1) Download the modpack');
  });

  for (const computer of ['windows', 'mac']) {
    it(`keeps the ${computer} path through Next, Back, and refresh`, () => {
      cy.visit('/docs/minecraft/installation');
      cy.get('main').contains('button', computer === 'windows' ? 'I use Windows' : 'I use a Mac').click();
      cy.get('main').contains('h2', '(1) Download the modpack');
      cy.get('main').should('contain.text', computer === 'windows' ? 'Extract All' : 'double-click the ZIP');
      cy.get('main').should('not.contain.text', '(2) Open Minecraft Launcher');
      cy.get('main').contains('a', 'Download modpack ZIP').should('have.attr', 'href').and('match', /^https:\/\/github\.com\/survivorsunited\/minecraft-mods-manager\/releases\/download\/.+\/modpack-1\.21\.11\.zip$/);
      cy.get('main').contains('button', 'Next').click();
      cy.get('main').contains('h2', '(2) Open Minecraft Launcher');
      cy.reload();
      cy.get('main').contains('h2', '(2) Open Minecraft Launcher');
      cy.get('main').contains('button', 'Back').click();
      cy.get('main').contains('h2', '(1) Download the modpack');
      cy.get('main').contains('button', 'Change computer').click();
      cy.get('main').contains('h2', 'Which computer do you use?');
    });

    it(`provides the complete ${computer} install and upgrade path`, () => {
      cy.visit(`/docs/minecraft/installation/${computer}`);
      for (let step = 1; step < 4; step++) cy.get('main').contains('button', 'Next').click();
      cy.get('main').contains('h2', '(4) Install Fabric');
      cy.get('main').should('contain.text', computer === 'windows' ? 'fabric-installer-1.1.0.exe' : 'fabric-installer-1.1.0.jar');
      cy.get('main').should('contain.text', 'Loader Version: 0.19.5');
      cy.get('main').contains('button', 'Next').click();
      cy.get('main').contains('h2', '(5) Back up your old mods');
      cy.get('main').should('contain.text', 'Keep your worlds and settings.');
      cy.get('main').should('contain.text', computer === 'windows' ? '%appdata%\\.minecraft' : '~/Library/Application Support/minecraft');
      cy.get('main').contains('button', 'Next').click();
      cy.get('main').contains('h2', '(6) Copy the new mods');
      cy.get('main').should('contain.text', 'mods → optional');
      cy.get('main').contains('button', 'Next').click();
      cy.get('main').contains('h2', '(7) Launch Minecraft');
      cy.get('main').contains('button', 'Next').click();
      cy.get('main').contains('h2', '(8) Join Survivors United');
      cy.get('main').should('contain.text', 'minecraft.survivorsunited.org');
      cy.get('main').contains('a', 'What to do after joining').should('have.attr', 'href', '/docs/minecraft/first-steps/things-to-do-first');
      cy.get('main').contains('button', 'Next').should('not.exist');
    });
  }

  it('keeps the computer choice usable on a narrow screen', () => {
    cy.viewport(375, 667);
    cy.visit('/docs/minecraft/installation');
    cy.get('main').contains('button', 'I use Windows').should('be.visible');
    cy.get('main').contains('button', 'I use a Mac').click();
    cy.get('main').contains('h2', '(1) Download the modpack');
    cy.get('main').contains('button', 'Next').should('be.visible');
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(375));
  });

  it('handles an invalid saved step without blank or missing instructions', () => {
    cy.visit('/docs/minecraft/installation?computer=windows&step=99');
    cy.get('main').contains('h2', '(1) Download the modpack');
    cy.get('main').contains('button', 'Back').should('be.disabled');
  });

  it('makes choices keyboard reachable and focuses the new step', () => {
    cy.visit('/docs/minecraft/installation');
    cy.get('main').contains('button', 'I use Windows').focus();
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.focused().should('contain.text', 'I use a Mac').click();
    cy.focused().should('contain.text', '(1) Download the modpack');
    cy.get('main').contains('button', 'Next').click();
    cy.focused().should('contain.text', '(2) Open Minecraft Launcher');
  });

  it('copies the server address and offers a fallback when clipboard access fails', () => {
    cy.visit('/docs/minecraft/installation?computer=mac&step=8');
    cy.window().then(win => cy.stub(win.navigator.clipboard, 'writeText').resolves().as('copy'));
    cy.get('main').contains('button', /^Copy$/).click();
    cy.get('@copy').should('have.been.calledWith', 'minecraft.survivorsunited.org');
    cy.get('main').contains('button', 'Copied');
    cy.reload();
    cy.window().then(win => cy.stub(win.navigator.clipboard, 'writeText').rejects());
    cy.get('main').contains('button', /^Copy$/).click();
    cy.get('main').contains('button', 'Select and copy the text');
    cy.get('main').contains('code', 'minecraft.survivorsunited.org').should('be.visible');
  });
});
