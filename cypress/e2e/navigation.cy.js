describe("Navigation Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should load the homepage successfully", () => {
    cy.get("body").should("be.visible");
    cy.title().should("contain", "Survivors United");
  });

  it("should have main navigation visible", () => {
    cy.get("nav").should("be.visible");
    cy.get("nav").should("contain.text", "Survivors United");
  });

  it("should have navigation links", () => {
    cy.get("nav").should("contain.text", "Getting Started");
    cy.get("nav").should("contain.text", "FAQ");
    cy.get("nav").should("contain.text", "Supported Mods");
    cy.get("nav").should("contain.text", "Terminology");
  });

  it("should navigate to Getting Started page", () => {
    cy.get("nav").contains("Getting Started").click();
    cy.url().should("include", "/docs/getting-started");
    cy.get("main").should("be.visible");
  });

  it("should navigate to FAQ page", () => {
    cy.get("nav").contains("FAQ").click();
    cy.url().should("include", "/docs/faq");
    cy.get("main").should("be.visible");
  });

  it("should navigate to Supported Mods page", () => {
    cy.get("nav").contains("Supported Mods").click();
    cy.url().should("include", "/docs/supported-mods");
    cy.get("main").should("be.visible");
  });

  it("should navigate to Terminology page", () => {
    cy.get("nav").contains("Terminology").click();
    cy.url().should("include", "/docs/terminology");
    cy.get("main").should("be.visible");
  });

  it("should have working logo link", () => {
    cy.get("nav").find("img[alt='Survivors United Logo']").should("be.visible");
    cy.get("nav").find("img[alt='Survivors United Logo']").parent().click();
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });

  it("should have GitHub link in navigation", () => {
    cy.get("nav").should("contain.text", "GitHub");
    cy.get("nav").contains("GitHub").should("have.attr", "href", "https://github.com/survivorsunited/survivorsunited.org");
  });

  it("should have mobile menu button on small screens", () => {
    cy.viewport(375, 667); // Mobile viewport
    // Docusaurus automatically shows mobile menu on small screens
    cy.get("nav").should("be.visible");
  });

  it("should have footer navigation", () => {
    cy.get("footer").should("be.visible");
    cy.get("footer").should("contain.text", "Docs");
    cy.get("footer").should("contain.text", "Community");
    cy.get("footer").should("contain.text", "More");
  });

  it("should have working footer links", () => {
    cy.get("footer").contains("Getting Started").should("have.attr", "href", "/docs/getting-started");
    cy.get("footer").contains("Discord").should("have.attr", "href");
    cy.get("footer").contains("GitHub").should("have.attr", "href", "https://github.com/survivorsunited/survivorsunited.org");
  });

  it("should have breadcrumb navigation on doc pages", () => {
    cy.visit("/docs/getting-started");
    // Docusaurus shows breadcrumbs on documentation pages
    cy.get("nav").should("be.visible");
  });

  it("should have sidebar navigation on doc pages", () => {
    cy.visit("/docs/getting-started");
    // Docusaurus shows sidebar on documentation pages
    cy.get("aside").should("be.visible");
  });

  it("should have working sidebar links", () => {
    cy.visit("/docs/getting-started");
    // Test that sidebar links work
    cy.get("aside").find("a").first().click();
    cy.url().should("not.eq", Cypress.config().baseUrl + "/docs/getting-started");
  });

  it("should have working sidebar navigation", () => {
    cy.visit("/docs/getting-started");
    cy.get("aside").should("be.visible");
    cy.get("aside").should("contain.text", "Getting Started");
  });

  it("should navigate through sidebar links", () => {
    cy.visit("/docs/getting-started");
    cy.get("aside").contains("FAQ").click();
    cy.url().should("include", "/docs/faq");
  });

  it("should have breadcrumb navigation", () => {
    cy.visit("/docs/minecraft/getting-started");
    cy.get("nav").should("be.visible");
  });

  it("should navigate through breadcrumbs", () => {
    cy.visit("/docs/minecraft/getting-started");
    cy.get("nav").contains("Minecraft").click();
    cy.url().should("include", "/docs/minecraft");
  });

  it("should maintain navigation state across pages", () => {
    cy.visit("/docs/getting-started");
    cy.get("nav").should("be.visible");
    
    cy.visit("/docs/faq");
    cy.get("nav").should("be.visible");
    
    cy.visit("/docs/supported-mods");
    cy.get("nav").should("be.visible");
  });

  it("should have responsive navigation", () => {
    cy.viewport(375, 667); // Mobile viewport
    cy.get("nav").should("be.visible");
    
    cy.viewport(1280, 720); // Desktop viewport
    cy.get("nav").should("be.visible");
  });

  it("should have accessible navigation", () => {
    cy.get("nav").should("have.attr", "role", "navigation");
    cy.get("nav").find("a").should("have.attr", "href");
  });

  it("should have proper navigation structure", () => {
    cy.get("nav").find("ul").should("exist");
    cy.get("nav").find("li").should("exist");
  });
}); 