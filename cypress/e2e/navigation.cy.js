describe("Navigation Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the homepage successfully", () => {
    cy.get("body").should("be.visible");
    cy.title().should("contain", "Survivors United");
  });

  it("should have working navbar navigation", () => {
    // Check main navbar items
    cy.get("nav").within(() => {
      // Getting Started
      cy.contains("Getting Started").click();
      cy.url().should("include", "/docs/getting-started");
      
      // FAQ
      cy.contains("FAQ").click();
      cy.url().should("include", "/docs/faq");
      
      // Supported Mods
      cy.contains("Supported Mods").click();
      cy.url().should("include", "/docs/supported-mods");
      
      // Terminology
      cy.contains("Terminology").click();
      cy.url().should("include", "/docs/terminology");
    });
  });

  it("should have working sidebar navigation", () => {
    // Visit a page with sidebar
    cy.visit("/docs/getting-started");
    
    // Check sidebar is visible
    cy.get('[data-testid="sidebar"]').should("be.visible");
    
    // Test sidebar links (check a few key ones)
    cy.get('[data-testid="sidebar"]').within(() => {
      // Check for common sidebar items
      cy.contains("Getting Started").should("be.visible");
      cy.contains("FAQ").should("be.visible");
      cy.contains("Supported Mods").should("be.visible");
    });
  });

  it("should have working footer links", () => {
    cy.get("footer").within(() => {
      // Check footer sections exist
      cy.contains("Docs").should("be.visible");
      cy.contains("Community").should("be.visible");
      cy.contains("More").should("be.visible");
      
      // Test footer links
      cy.contains("Getting Started").should("have.attr", "href");
      cy.contains("Discord").should("have.attr", "href");
      cy.contains("GitHub").should("have.attr", "href");
    });
  });

  it("should have working breadcrumb navigation", () => {
    // Visit a nested page to test breadcrumbs
    cy.visit("/docs/minecraft/getting-started");
    
    // Check breadcrumbs exist
    cy.get('[data-testid="breadcrumbs"]').should("be.visible");
    
    // Test breadcrumb links work
    cy.get('[data-testid="breadcrumbs"]').within(() => {
      cy.get("a").each(($link) => {
        cy.wrap($link).should("have.attr", "href");
      });
    });
  });

  it("should handle mobile navigation", () => {
    // Set mobile viewport
    cy.viewport(375, 667);
    
    // Check mobile menu button exists
    cy.get('[data-testid="mobile-menu-button"]').should("be.visible");
    
    // Test mobile menu opens
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should("be.visible");
    
    // Test mobile menu navigation
    cy.get('[data-testid="mobile-menu"]').within(() => {
      cy.contains("Getting Started").click();
      cy.url().should("include", "/docs/getting-started");
    });
  });

  it("should have working logo link", () => {
    cy.get('[data-testid="logo"]').click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("should have working search functionality", () => {
    // Check search input exists
    cy.get('[data-testid="search-input"]').should("be.visible");
    
    // Test search functionality
    cy.get('[data-testid="search-input"]').type("minecraft");
    cy.get('[data-testid="search-results"]').should("be.visible");
    
    // Test search result links work
    cy.get('[data-testid="search-results"]').within(() => {
      cy.get("a").first().click();
      cy.url().should("not.include", "search");
    });
  });
}); 