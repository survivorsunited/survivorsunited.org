describe("Responsive Design Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display correctly on desktop", () => {
    cy.viewport(1280, 720);
    cy.get("nav").should("be.visible");
    cy.get("main").should("be.visible");
    cy.get("footer").should("be.visible");
  });

  it("should display correctly on tablet", () => {
    cy.viewport(768, 1024);
    cy.get("nav").should("be.visible");
    cy.get("main").should("be.visible");
    cy.get("footer").should("be.visible");
  });

  it("should display correctly on mobile", () => {
    cy.viewport(375, 667);
    cy.get("nav").should("be.visible");
    cy.get("main").should("be.visible");
    cy.get("footer").should("be.visible");
  });

  it("should handle mobile navigation menu", () => {
    cy.viewport(375, 667);
    // Docusaurus automatically adapts navigation for mobile
    cy.get("nav").should("be.visible");
    // Test that navigation links are accessible
    cy.get("nav").contains("Getting Started").should("be.visible");
  });

  it("should handle mobile search", () => {
    cy.viewport(375, 667);
    cy.get('button[aria-label="Search"]').should("be.visible");
    cy.get('button[aria-label="Search"]').click();
    cy.get('input[type="search"]').should("be.visible");
  });

  it("should handle responsive images", () => {
    cy.get("img").each(($img) => {
      cy.wrap($img).should("be.visible");
      cy.wrap($img).should("have.attr", "src");
    });
  });

  it("should handle responsive text", () => {
    cy.get("main").should("be.visible");
    cy.get("main").should("contain.text", "Survivors United");
  });

  it("should handle responsive tables", () => {
    // Visit a page that might have tables
    cy.visit("/docs/supported-mods");
    cy.get("main").should("be.visible");
    // Check if tables exist and are responsive
    cy.get("table").should("exist");
  });

  it("should handle responsive code blocks", () => {
    // Visit a page that might have code blocks
    cy.visit("/docs/minecraft/installation/java");
    cy.get("main").should("be.visible");
    // Check if code blocks exist
    cy.get("pre").should("exist");
  });

  it("should handle responsive navigation on different pages", () => {
    const pages = [
      "/docs/getting-started",
      "/docs/faq",
      "/docs/supported-mods",
      "/docs/terminology"
    ];

    pages.forEach(page => {
      cy.visit(page);
      cy.viewport(375, 667); // Mobile viewport
      cy.get("nav").should("be.visible");
      cy.get("main").should("be.visible");
    });
  });

  it("should handle responsive footer", () => {
    cy.get("footer").should("be.visible");
    cy.get("footer").should("contain.text", "Docs");
    cy.get("footer").should("contain.text", "Community");
  });

  it("should handle responsive search results", () => {
    cy.viewport(375, 667);
    cy.get('button[aria-label="Search"]').click();
    cy.get('input[type="search"]').type("minecraft");
    cy.get('.search-result').should("be.visible");
  });

  it("should handle responsive sidebar", () => {
    cy.visit("/docs/getting-started");
    cy.get("aside").should("be.visible");
    // Test on mobile
    cy.viewport(375, 667);
    cy.get("aside").should("be.visible");
  });

  it("should handle responsive breadcrumbs", () => {
    cy.visit("/docs/minecraft/getting-started");
    // Docusaurus shows breadcrumbs on documentation pages
    cy.get("nav").should("be.visible");
    // Test on mobile
    cy.viewport(375, 667);
    cy.get("nav").should("be.visible");
  });
}); 