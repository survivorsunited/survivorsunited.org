// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands for Docusaurus testing
Cypress.Commands.add("visitPage", (path) => {
  cy.visit(path);
  cy.get("body").should("be.visible");
  cy.get("main").should("be.visible");
});

Cypress.Commands.add("checkPageContent", (expectedContent) => {
  cy.get("main").should("contain.text", expectedContent);
});

Cypress.Commands.add("checkNavigation", () => {
  cy.get("nav").should("be.visible");
  cy.get("footer").should("be.visible");
});

Cypress.Commands.add("checkSearch", (searchTerm) => {
  cy.get('[data-testid="search-input"]').type(searchTerm);
  cy.get('[data-testid="search-results"]').should("be.visible");
});

Cypress.Commands.add("checkResponsive", (viewport) => {
  cy.viewport(viewport.width, viewport.height);
  cy.get("body").should("be.visible");
  cy.get("main").should("be.visible");
});

// Add custom assertions
chai.Assertion.addMethod("containText", function(text) {
  const obj = this._obj;
  this.assert(
    obj.text().toLowerCase().includes(text.toLowerCase()),
    `expected #{this} to contain text '${text}'`,
    `expected #{this} to not contain text '${text}'`,
    text,
    obj.text()
  );
});

// Configure retry attempts for flaky tests
Cypress.config("retries", {
  runMode: 2,
  openMode: 0
});

// Configure timeouts
Cypress.config("defaultCommandTimeout", 10000);
Cypress.config("requestTimeout", 10000);
Cypress.config("responseTimeout", 10000);

// Handle uncaught exceptions
Cypress.on("uncaught:exception", (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // for uncaught exceptions that are not critical
  if (err.message.includes("ResizeObserver loop limit exceeded")) {
    return false;
  }
  return true;
});

// Add custom viewport presets
Cypress.Commands.add("viewportDesktop", () => {
  cy.viewport(1280, 720);
});

Cypress.Commands.add("viewportTablet", () => {
  cy.viewport(768, 1024);
});

Cypress.Commands.add("viewportMobile", () => {
  cy.viewport(375, 667);
});

// Add custom navigation commands
Cypress.Commands.add("navigateToPage", (pageName) => {
  cy.get("nav").contains(pageName).click();
  cy.url().should("include", pageName.toLowerCase().replace(" ", "-"));
});

Cypress.Commands.add("checkExternalLink", (linkText, expectedUrl) => {
  cy.contains(linkText).should("have.attr", "href", expectedUrl);
  cy.contains(linkText).should("have.attr", "target", "_blank");
  cy.contains(linkText).should("have.attr", "rel", "noopener");
});

// Add custom content validation commands
Cypress.Commands.add("validatePageStructure", () => {
  cy.get("main").should("be.visible");
  cy.get("main").should("not.be.empty");
  cy.get("main").find("h1, h2, h3").should("have.length.at.least", 1);
});

Cypress.Commands.add("validateImages", () => {
  cy.get("main").find("img").each(($img) => {
    cy.wrap($img).should("be.visible");
    cy.wrap($img).should("have.attr", "src");
    cy.wrap($img).should("have.attr", "alt");
  });
});

Cypress.Commands.add("validateLinks", () => {
  cy.get("main").find("a").each(($link) => {
    cy.wrap($link).should("have.attr", "href");
  });
});

// Add custom search commands
Cypress.Commands.add("performSearch", (searchTerm) => {
  cy.get('[data-testid="search-input"]').clear().type(searchTerm);
  cy.get('[data-testid="search-results"]').should("be.visible");
});

Cypress.Commands.add("clearSearch", () => {
  cy.get('[data-testid="search-input"]').clear();
  cy.get('[data-testid="search-results"]').should("not.be.visible");
});

// Add custom mobile navigation commands
Cypress.Commands.add("openMobileMenu", () => {
  cy.viewportMobile();
  cy.get('[data-testid="mobile-menu-button"]').click();
  cy.get('[data-testid="mobile-menu"]').should("be.visible");
});

Cypress.Commands.add("closeMobileMenu", () => {
  cy.get("body").click(0, 0);
  cy.get('[data-testid="mobile-menu"]').should("not.be.visible");
});

// Add custom error handling
Cypress.Commands.add("handle404", () => {
  cy.visit("/non-existent-page", { failOnStatusCode: false });
  cy.get("body").should("contain.text", "404");
});

// Add custom accessibility commands
Cypress.Commands.add("checkAccessibility", () => {
  cy.get("main").find("img").each(($img) => {
    cy.wrap($img).should("have.attr", "alt");
  });
  
  cy.get("main").find("a").each(($link) => {
    cy.wrap($link).should("have.attr", "href");
  });
  
  cy.get("main").find("button").each(($button) => {
    cy.wrap($button).should("have.attr", "aria-label");
  });
});

// Add custom performance commands
Cypress.Commands.add("checkPageLoad", () => {
  cy.get("body").should("be.visible");
  cy.get("main").should("be.visible");
  cy.get("main").should("not.be.empty");
});

// Add custom content validation
Cypress.Commands.add("validateContent", (expectedContent) => {
  expectedContent.forEach(content => {
    cy.get("main").should("contain.text", content);
  });
});

// Add custom link validation
Cypress.Commands.add("validateInternalLinks", () => {
  cy.get("main").find("a[href^='/']").each(($link) => {
    const href = $link.attr("href");
    if (href && !href.startsWith("#")) {
      cy.wrap($link).click();
      cy.url().should("include", href);
      cy.go("back");
    }
  });
});

// Add custom external link validation
Cypress.Commands.add("validateExternalLinks", () => {
  cy.get("main").find("a[href^='http']").each(($link) => {
    const href = $link.attr("href");
    if (href && !href.includes("localhost")) {
      cy.wrap($link).should("have.attr", "target", "_blank");
      cy.wrap($link).should("have.attr", "rel", "noopener");
    }
  });
}); 