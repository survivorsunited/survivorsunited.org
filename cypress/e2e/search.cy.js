describe("Search Functionality Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should have search input visible", () => {
    cy.get('[data-testid="search-input"]').should("be.visible");
    cy.get('[data-testid="search-input"]').should("have.attr", "placeholder");
  });

  it("should find content when searching for 'minecraft'", () => {
    cy.get('[data-testid="search-input"]').type("minecraft");
    cy.get('[data-testid="search-results"]').should("be.visible");
    cy.get('[data-testid="search-results"]').should("contain.text", "minecraft");
  });

  it("should find content when searching for 'fabric'", () => {
    cy.get('[data-testid="search-input"]').type("fabric");
    cy.get('[data-testid="search-results"]').should("be.visible");
    cy.get('[data-testid="search-results"]').should("contain.text", "fabric");
  });

  it("should find content when searching for 'mods'", () => {
    cy.get('[data-testid="search-input"]').type("mods");
    cy.get('[data-testid="search-results"]').should("be.visible");
    cy.get('[data-testid="search-results"]').should("contain.text", "mods");
  });

  it("should find content when searching for 'installation'", () => {
    cy.get('[data-testid="search-input"]').type("installation");
    cy.get('[data-testid="search-results"]').should("be.visible");
    cy.get('[data-testid="search-results"]').should("contain.text", "installation");
  });

  it("should find content when searching for 'discord'", () => {
    cy.get('[data-testid="search-input"]').type("discord");
    cy.get('[data-testid="search-results"]').should("be.visible");
    cy.get('[data-testid="search-results"]').should("contain.text", "discord");
  });

  it("should handle search with no results", () => {
    cy.get('[data-testid="search-input"]').type("nonexistentcontent12345");
    cy.get('[data-testid="search-results"]').should("contain.text", "No results");
  });

  it("should clear search results when input is cleared", () => {
    cy.get('[data-testid="search-input"]').type("minecraft");
    cy.get('[data-testid="search-results"]').should("be.visible");
    
    cy.get('[data-testid="search-input"]').clear();
    cy.get('[data-testid="search-results"]').should("not.be.visible");
  });

  it("should navigate to search results when clicked", () => {
    cy.get('[data-testid="search-input"]').type("minecraft");
    cy.get('[data-testid="search-results"]').should("be.visible");
    
    // Click on first search result
    cy.get('[data-testid="search-results"]').find("a").first().click();
    
    // Should navigate to the page
    cy.url().should("not.include", "search");
    cy.get("main").should("be.visible");
  });

  it("should search from different pages", () => {
    // Test search from FAQ page
    cy.visit("/docs/faq");
    cy.get('[data-testid="search-input"]').type("minecraft");
    cy.get('[data-testid="search-results"]').should("be.visible");
    
    // Test search from Getting Started page
    cy.visit("/docs/getting-started");
    cy.get('[data-testid="search-input"]').type("fabric");
    cy.get('[data-testid="search-results"]').should("be.visible");
  });

  it("should handle special characters in search", () => {
    cy.get('[data-testid="search-input"]').type("mods & shaders");
    cy.get('[data-testid="search-results"]').should("be.visible");
  });

  it("should handle case insensitive search", () => {
    cy.get('[data-testid="search-input"]').type("MINECRAFT");
    cy.get('[data-testid="search-results"]').should("be.visible");
    cy.get('[data-testid="search-results"]').should("contain.text", "minecraft");
  });

  it("should show search suggestions", () => {
    cy.get('[data-testid="search-input"]').type("mine");
    cy.get('[data-testid="search-results"]').should("be.visible");
    cy.get('[data-testid="search-results"]').should("contain.text", "minecraft");
  });

  it("should handle keyboard navigation in search", () => {
    cy.get('[data-testid="search-input"]').type("minecraft");
    cy.get('[data-testid="search-results"]').should("be.visible");
    
    // Test arrow key navigation
    cy.get('[data-testid="search-input"]').type("{downarrow}");
    cy.get('[data-testid="search-results"]').should("be.visible");
    
    // Test enter key to select
    cy.get('[data-testid="search-input"]').type("{enter}");
    cy.url().should("not.include", "search");
  });

  it("should close search results when clicking outside", () => {
    cy.get('[data-testid="search-input"]').type("minecraft");
    cy.get('[data-testid="search-results"]').should("be.visible");
    
    // Click outside search area
    cy.get("body").click(0, 0);
    cy.get('[data-testid="search-results"]').should("not.be.visible");
  });

  it("should search for technical terms", () => {
    const technicalTerms = ["fabric", "mods", "shaders", "java", "installation"];
    
    technicalTerms.forEach(term => {
      cy.get('[data-testid="search-input"]').clear().type(term);
      cy.get('[data-testid="search-results"]').should("be.visible");
      cy.get('[data-testid="search-results"]').should("contain.text", term);
    });
  });

  it("should search for community terms", () => {
    const communityTerms = ["discord", "server", "community", "rules"];
    
    communityTerms.forEach(term => {
      cy.get('[data-testid="search-input"]').clear().type(term);
      cy.get('[data-testid="search-results"]').should("be.visible");
      cy.get('[data-testid="search-results"]').should("contain.text", term);
    });
  });
}); 