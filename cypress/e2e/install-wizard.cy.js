const next = () => {
  cy.get('main').contains('button', 'Next').should('be.disabled');
  cy.get('main').find('label').last().find('input').check().uncheck();
  cy.get('main').contains('button', 'Next').should('be.disabled');
  cy.get('main').find('label').last().find('input').check();
  cy.get('main').contains('button', 'Next').should('be.enabled').click();
};

const ready = () => {
  cy.get('main').contains('label', 'I have Minecraft Launcher installed').find('input').check();
  cy.get('main').contains('label', 'My account owns Minecraft: Java Edition').find('input').check();
  cy.get('main').contains('label', 'I have Java 21 or newer installed').find('input').check();
  cy.get('main').contains('label', 'I reached the main menu').find('input').check();
  cy.get('main').contains('button', 'Continue to install or upgrade').click();
};

describe('Setup Wizard', () => {
  for (const computer of ['windows', 'mac']) {
    it(`offers automatic ${computer} setup without making users repeat manual prerequisites`, () => {
      cy.visit(`/docs/minecraft/installation/${computer}`);
      cy.get('main').contains('button', 'Automatic ·').should('have.attr', 'aria-pressed', 'true');
      cy.get('main').contains('h2', 'Let the setup script help');
      cy.get('main').should('contain.text', computer === 'windows' ? 'iwr -UseBasicParsing' : 'curl -fsSL');
      cy.get('main').find('code').should('have.length', 1);
      cy.get('main').find('code').should('contain.text', `https://survivorsunited.org/setup/${computer === 'windows' ? 'windows.ps1' : 'mac.sh'}`).and('not.contain.text', '127.0.0.1');
      cy.get('main').should('contain.text', computer === 'windows' ? '| iex' : 'bash -c');
      cy.get('main').contains('a', 'Read the setup script').should('have.attr', 'href', computer === 'windows' ? '/setup/windows.ps1' : '/setup/mac.sh');
      cy.request(computer === 'windows' ? '/setup/windows.ps1' : '/setup/mac.sh').its('status').should('eq', 200);
      cy.reload();
      cy.get('main').contains('h2', 'Let the setup script help');
      cy.get('main').contains('button', 'Manual ·').click();
      cy.reload();
      cy.location('search').should('contain', 'method=manual');
      cy.get('main').contains('h2', 'Let’s check what you already have');
      cy.get('main').contains('button', 'Continue to install or upgrade').should('be.disabled');
    });
  }
  it('starts with an explicit computer choice and gated checklist', () => {
    cy.visit('/docs/minecraft/installation');
    cy.get('main').contains('h1', 'Setup Wizard');
    cy.get('main').contains('button', 'I use Windows').click();
    cy.get('main').contains('h2', 'Let the setup script help');
    cy.get('main').contains('button', 'Manual ·').click();
    cy.get('main').contains('h2', 'Let’s check what you already have');
    cy.get('main').contains('button', 'Continue to install or upgrade').should('be.disabled');
    cy.get('main').contains('label', 'I reached the main menu').find('input').should('be.disabled');
    cy.get('main').should('not.contain.text', 'Download the modpack');
  });

  for (const computer of ['windows', 'mac']) {
    it(`returns from all ${computer} prerequisite branches without claiming completion`, () => {
      cy.visit(`/docs/minecraft/installation/${computer}`);
      cy.get('main').contains('button', 'Manual ·').click();
      cy.get('main').contains('button', 'Install the launcher').click();
      cy.get('main').should('contain.text', computer === 'mac' ? '.dmg' : 'winget install');
      cy.get('main').contains('button', 'Return to checklist').click();
      cy.get('main').contains('label', 'I have Minecraft Launcher installed').find('input').should('not.be.checked');
      cy.get('main').contains('button', 'Check my account').click();
      cy.get('main').should('contain.text', 'Play Demo');
      cy.get('main').contains('button', 'Return to checklist').click();
      cy.get('main').contains('button', 'Install Java /').click();
      cy.get('main').should('contain.text', computer === 'mac' ? 'Apple silicon' : 'EclipseAdoptium.Temurin.21.JDK');
      if (computer === 'mac') cy.get('main').should('contain.text', 'Intel');
      cy.get('main').contains('button', 'Return to checklist').click();
      cy.get('main').contains('button', 'Continue to install or upgrade').should('be.disabled');
    });

    it(`completes and remembers the shared ${computer} install and upgrade path`, () => {
      cy.visit('/docs/minecraft/installation');
      cy.get('main').contains('button', computer === 'windows' ? 'I use Windows' : 'I use a Mac').click();
      cy.get('main').contains('button', 'Manual ·').click();
      ready();
      cy.get('main').contains('h2', 'Download the modpack');
      cy.get('main').contains('h2', 'Download the modpack').should('not.contain.text', '(1)');
      cy.get('main').should('contain.text', computer === 'windows' ? 'Extract All' : 'double-click the ZIP');
      next();
      cy.reload();
      cy.get('main').contains('h2', 'Install Fabric');
      cy.get('main').should('contain.text', computer === 'windows' ? 'fabric-installer-1.1.0.exe' : 'fabric-installer-1.1.0.jar');
      cy.get('main').should('contain.text', 'Loader Version: 0.19.5');
      cy.get('main').contains('button', 'Back').click();
      cy.get('main').contains('h2', 'Download the modpack');
      next();
      next();
      cy.get('main').contains('h2', 'Back up your old mods');
      cy.get('main').should('contain.text', 'Keep your worlds and settings.');
      cy.get('main').should('contain.text', computer === 'windows' ? '%appdata%\\.minecraft' : '~/Library/Application Support/minecraft');
      next();
      cy.get('main').contains('h2', 'Copy the new mods');
      cy.get('main').should('contain.text', 'mods → optional');
      next();
      cy.get('main').contains('h2', 'Launch Minecraft');
      next();
      cy.get('main').contains('h2', 'Join Survivors United');
      cy.get('main').contains('button', 'What to do after joining').should('be.disabled');
      cy.get('main').contains('label', 'I connected to Survivors United').find('input').check();
      cy.get('main').contains('a', 'What to do after joining').should('be.visible');
      cy.get('main').contains('button', 'Check prerequisites').click();
      cy.get('main').contains('label', 'I have Java 21 or newer installed').find('input').should('be.checked').uncheck();
      cy.get('main').contains('label', 'I reached the main menu').find('input').should('not.be.checked');
      cy.get('main').contains('button', 'Continue to install or upgrade').should('be.disabled');
      cy.reload();
      cy.get('main').contains('label', 'I have Java 21 or newer installed').find('input').should('not.be.checked');
    });
  }

  it('does not skip prerequisites via a saved step URL or carry confirmations to another computer', () => {
    cy.visit('/docs/minecraft/installation?computer=windows&step=6&method=manual');
    cy.get('main').contains('h2', 'Let’s check what you already have');
    ready();
    cy.get('main').contains('button', 'Change computer').click();
    cy.get('main').contains('button', 'I use a Mac').click();
    cy.get('main').contains('h2', 'Let the setup script help');
    cy.get('main').contains('button', 'Manual ·').click();
    cy.get('main').contains('button', 'Continue to install or upgrade').should('be.disabled');
  });

  it('supports the checklist, branch and steps on a narrow screen', () => {
    cy.viewport(375, 812);
    cy.visit('/docs/minecraft/installation/mac?method=manual');
    cy.get('main').contains('button', 'Install Java /').click();
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(375));
    cy.get('main').contains('button', 'Return to checklist').click();
    ready();
    for (let i = 1; i < 6; i++) next();
    cy.get('main').contains('h2', 'Join Survivors United');
    cy.document().then(doc => expect(doc.documentElement.scrollWidth).to.be.at.most(375));
  });

  it('focuses branch, checklist and step headings after keyboard reachable actions', () => {
    cy.visit('/docs/minecraft/installation');
    cy.get('main').contains('button', 'I use Windows').focus();
    cy.press(Cypress.Keyboard.Keys.TAB);
    cy.focused().should('contain.text', 'I use a Mac').click();
    cy.focused().should('contain.text', 'Let the setup script help');
    cy.get('main').contains('button', 'Manual ·').click();
    cy.focused().should('contain.text', 'Let’s check');
    cy.get('main').contains('button', 'Check my account').click();
    cy.focused().should('contain.text', 'Check my account');
    cy.get('main').contains('button', 'Return to checklist').click();
    cy.focused().should('contain.text', 'Let’s check');
    ready();
    cy.focused().should('contain.text', 'Download the modpack');
  });

  it('copies the address and gives a fallback if clipboard access fails', () => {
    cy.visit('/docs/minecraft/installation/mac?method=manual');
    ready();
    for (let i = 1; i < 6; i++) next();
    cy.window().then(win => cy.stub(win.navigator.clipboard, 'writeText').resolves().as('copy'));
    cy.get('main').contains('button', /^Copy$/).click();
    cy.get('@copy').should('have.been.calledWith', 'minecraft.survivorsunited.org');
    cy.reload();
    cy.window().then(win => cy.stub(win.navigator.clipboard, 'writeText').rejects());
    cy.get('main').contains('button', /^Copy$/).click();
    cy.get('main').contains('button', 'Select and copy the text');
  });

  it('provides independent platform reference guides with existing illustrations', () => {
    cy.visit('/docs/minecraft/installation/fabric');
    cy.get('main').contains('h2', 'Configure and install');
    cy.get('main').should('contain.text', 'powershell.exe');
    cy.get('main').should('contain.text', '-mcversion 1.21.11 -loader 0.19.5');
    cy.get('main').should('contain.text', 'fabric-installer-1.1.0.jar');
    cy.get('main').find('img[alt="Java Edition, Fabric profile selector and Play button highlighted"]').should('be.visible');
    cy.get('main').should('contain.text', 'choose 1.21.11');
    cy.visit('/docs/minecraft/installation/minecraft');
    cy.get('main').find('img[alt="Minecraft Launcher signing in"]').should('exist');
  });
});
