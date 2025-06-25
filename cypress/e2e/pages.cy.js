describe("Page Content Tests", () => {
  const pages = [
    {
      path: "/",
      title: "Survivors United",
      contentChecks: ["Minecraft", "survival", "community"]
    },
    {
      path: "/docs/getting-started",
      title: "Getting Started",
      contentChecks: ["setup", "guide", "installation"]
    },
    {
      path: "/docs/faq",
      title: "FAQ",
      contentChecks: ["frequently asked", "questions", "help"]
    },
    {
      path: "/docs/supported-mods",
      title: "Supported Mods",
      contentChecks: ["mods", "fabric", "compatibility"]
    },
    {
      path: "/docs/terminology",
      title: "Terminology",
      contentChecks: ["glossary", "terms", "definitions"]
    },
    {
      path: "/docs/minecraft/getting-started",
      title: "Setup Guide",
      contentChecks: ["minecraft", "setup", "installation"]
    },
    {
      path: "/docs/minecraft/faq",
      title: "FAQ",
      contentChecks: ["minecraft", "questions", "troubleshooting"]
    },
    {
      path: "/docs/minecraft/server-info",
      title: "Server Information",
      contentChecks: ["server", "address", "rules"]
    },
    {
      path: "/docs/minecraft/supported-mods",
      title: "Supported Mods",
      contentChecks: ["mods", "fabric", "server"]
    },
    {
      path: "/docs/minecraft/terminology",
      title: "Terminology",
      contentChecks: ["minecraft", "terms", "glossary"]
    }
  ];

  pages.forEach(({ path, title, contentChecks }) => {
    it(`should load ${path} correctly`, () => {
      cy.visit(path);
      
      // Check page loads
      cy.get("body").should("be.visible");
      
      // Check title contains expected text
      cy.title().should("contain", title);
      
      // Check main content area exists
      cy.get("main").should("be.visible");
      
      // Check for expected content
      contentChecks.forEach(check => {
        cy.get("main").should("contain.text", check);
      });
      
      // Check page has some content (not empty)
      cy.get("main").should("not.be.empty");
    });
  });

  it("should have working internal links", () => {
    cy.visit("/docs/getting-started");
    
    // Find all internal links and test them
    cy.get("main").find("a[href^='/']").each(($link) => {
      const href = $link.attr("href");
      
      // Skip anchor links and external links
      if (href && !href.startsWith("#") && !href.startsWith("http")) {
        cy.wrap($link).click();
        cy.url().should("include", href);
        cy.go("back");
      }
    });
  });

  it("should have working external links", () => {
    cy.visit("/docs/getting-started");
    
    // Test external links (Discord, GitHub, etc.)
    cy.get("main").find("a[href^='http']").each(($link) => {
      const href = $link.attr("href");
      
      // Check link has valid URL
      cy.wrap($link).should("have.attr", "href");
      
      // Check link opens in new tab (if external)
      if (href && !href.includes("localhost")) {
        cy.wrap($link).should("have.attr", "target", "_blank");
      }
    });
  });

  it("should have proper meta tags", () => {
    cy.visit("/");
    
    // Check for essential meta tags
    cy.get('meta[name="description"]').should("exist");
    cy.get('meta[name="viewport"]').should("exist");
  });

  it("should have working images", () => {
    cy.visit("/docs/minecraft/getting-started");
    
    // Check all images load properly
    cy.get("main").find("img").each(($img) => {
      cy.wrap($img).should("be.visible");
      cy.wrap($img).should("have.attr", "src");
      cy.wrap($img).should("have.attr", "alt");
    });
  });

  it("should have proper heading structure", () => {
    cy.visit("/docs/getting-started");
    
    // Check for proper heading hierarchy
    cy.get("main").find("h1").should("have.length.at.least", 1);
    cy.get("main").find("h2").should("have.length.at.least", 1);
    
    // Check headings have content
    cy.get("main").find("h1, h2, h3").each(($heading) => {
      cy.wrap($heading).should("not.be.empty");
    });
  });

  it("should have working code blocks", () => {
    cy.visit("/docs/minecraft/getting-started");
    
    // Check code blocks exist and are properly formatted
    cy.get("main").find("pre").each(($code) => {
      cy.wrap($code).should("be.visible");
      cy.wrap($code).should("not.be.empty");
    });
  });

  it("should have working lists", () => {
    cy.visit("/docs/faq");
    
    // Check for ordered and unordered lists
    cy.get("main").find("ul, ol").should("have.length.at.least", 1);
    
    // Check list items have content
    cy.get("main").find("li").each(($item) => {
      cy.wrap($item).should("not.be.empty");
    });
  });

  it("should handle 404 pages gracefully", () => {
    cy.visit("/non-existent-page", { failOnStatusCode: false });
    
    // Should show 404 page
    cy.get("body").should("contain.text", "404");
    cy.get("body").should("contain.text", "Page Not Found");
  });
}); 