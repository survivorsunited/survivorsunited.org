describe("Link Validation Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should validate all internal navigation links", () => {
    const internalLinks = [
      "/docs/getting-started",
      "/docs/faq",
      "/docs/supported-mods",
      "/docs/terminology",
      "/docs/minecraft/getting-started",
      "/docs/minecraft/faq",
      "/docs/minecraft/server-info",
      "/docs/minecraft/supported-mods",
      "/docs/minecraft/terminology"
    ];

    internalLinks.forEach(link => {
      cy.visit(link);
      cy.get("body").should("be.visible");
      cy.get("main").should("not.be.empty");
    });
  });

  it("should validate all navbar links", () => {
    cy.get("nav").within(() => {
      // Test each navbar link
      cy.get("a").each(($link) => {
        const href = $link.attr("href");
        if (href && href.startsWith("/")) {
          cy.wrap($link).click();
          cy.url().should("include", href);
          cy.get("main").should("be.visible");
          cy.go("back");
        }
      });
    });
  });

  it("should validate all footer links", () => {
    cy.get("footer").within(() => {
      cy.get("a").each(($link) => {
        const href = $link.attr("href");
        if (href) {
          // Check link has valid href
          cy.wrap($link).should("have.attr", "href");
          
          // For internal links, test navigation
          if (href.startsWith("/")) {
            cy.wrap($link).click();
            cy.url().should("include", href);
            cy.go("back");
          }
          
          // For external links, check they open in new tab
          if (href.startsWith("http") && !href.includes("localhost")) {
            cy.wrap($link).should("have.attr", "target", "_blank");
          }
        }
      });
    });
  });

  it("should validate sidebar links", () => {
    cy.visit("/docs/getting-started");
    
    cy.get('[data-testid="sidebar"]').within(() => {
      cy.get("a").each(($link) => {
        const href = $link.attr("href");
        if (href && href.startsWith("/")) {
          cy.wrap($link).click();
          cy.url().should("include", href);
          cy.get("main").should("be.visible");
          cy.go("back");
        }
      });
    });
  });

  it("should validate content links", () => {
    cy.visit("/docs/getting-started");
    
    cy.get("main").within(() => {
      cy.get("a").each(($link) => {
        const href = $link.attr("href");
        if (href && href.startsWith("/")) {
          cy.wrap($link).click();
          cy.url().should("include", href);
          cy.get("main").should("be.visible");
          cy.go("back");
        }
      });
    });
  });

  it("should validate external links have proper attributes", () => {
    cy.visit("/docs/getting-started");
    
    cy.get("main").within(() => {
      cy.get("a[href^='http']").each(($link) => {
        const href = $link.attr("href");
        
        // Check external links open in new tab
        if (href && !href.includes("localhost")) {
          cy.wrap($link).should("have.attr", "target", "_blank");
          cy.wrap($link).should("have.attr", "rel", "noopener");
        }
      });
    });
  });

  it("should validate Discord links", () => {
    cy.visit("/docs/getting-started");
    
    // Find Discord links
    cy.get("main").find("a[href*='discord']").each(($link) => {
      const href = $link.attr("href");
      
      // Check Discord links are valid
      cy.wrap($link).should("have.attr", "href");
      cy.wrap($link).should("have.attr", "target", "_blank");
      cy.wrap($link).should("have.attr", "rel", "noopener");
      
      // Check Discord URL format
      expect(href).to.match(/^https:\/\/discord\.gg\/[a-zA-Z0-9]+$/);
    });
  });

  it("should validate GitHub links", () => {
    cy.visit("/docs/getting-started");
    
    // Find GitHub links
    cy.get("main").find("a[href*='github']").each(($link) => {
      const href = $link.attr("href");
      
      // Check GitHub links are valid
      cy.wrap($link).should("have.attr", "href");
      cy.wrap($link).should("have.attr", "target", "_blank");
      cy.wrap($link).should("have.attr", "rel", "noopener");
      
      // Check GitHub URL format
      expect(href).to.match(/^https:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+/);
    });
  });

  it("should validate download links", () => {
    cy.visit("/docs/minecraft/getting-started");
    
    // Find download links
    cy.get("main").find("a[href*='.jar'], a[href*='.zip']").each(($link) => {
      const href = $link.attr("href");
      
      // Check download links are valid
      cy.wrap($link).should("have.attr", "href");
      cy.wrap($link).should("have.attr", "target", "_blank");
      cy.wrap($link).should("have.attr", "rel", "noopener");
      
      // Check file extension
      expect(href).to.match(/\.(jar|zip)$/);
    });
  });

  it("should validate image links", () => {
    cy.visit("/docs/minecraft/getting-started");
    
    // Find image links
    cy.get("main").find("img").each(($img) => {
      const src = $img.attr("src");
      
      // Check image has src and alt attributes
      cy.wrap($img).should("have.attr", "src");
      cy.wrap($img).should("have.attr", "alt");
      
      // Check image loads
      cy.wrap($img).should("be.visible");
    });
  });

  it("should validate anchor links", () => {
    cy.visit("/docs/faq");
    
    // Find anchor links
    cy.get("main").find("a[href^='#']").each(($link) => {
      const href = $link.attr("href");
      
      // Check anchor link format
      expect(href).to.match(/^#[a-zA-Z0-9-]+$/);
      
      // Test anchor link navigation
      cy.wrap($link).click();
      cy.url().should("include", href);
    });
  });

  it("should validate breadcrumb links", () => {
    cy.visit("/docs/minecraft/getting-started");
    
    cy.get('[data-testid="breadcrumbs"]').within(() => {
      cy.get("a").each(($link) => {
        const href = $link.attr("href");
        if (href && href.startsWith("/")) {
          cy.wrap($link).click();
          cy.url().should("include", href);
          cy.get("main").should("be.visible");
          cy.go("back");
        }
      });
    });
  });

  it("should validate search result links", () => {
    cy.get('[data-testid="search-input"]').type("minecraft");
    cy.get('[data-testid="search-results"]').should("be.visible");
    
    cy.get('[data-testid="search-results"]').find("a").each(($link) => {
      const href = $link.attr("href");
      if (href && href.startsWith("/")) {
        cy.wrap($link).click();
        cy.url().should("include", href);
        cy.get("main").should("be.visible");
        cy.go("back");
      }
    });
  });

  it("should handle broken links gracefully", () => {
    // Test a known broken link (if any)
    cy.visit("/docs/non-existent-page", { failOnStatusCode: false });
    cy.get("body").should("contain.text", "404");
  });

  it("should validate all links on multiple pages", () => {
    const pagesToTest = [
      "/docs/getting-started",
      "/docs/faq",
      "/docs/supported-mods",
      "/docs/minecraft/getting-started"
    ];

    pagesToTest.forEach(page => {
      cy.visit(page);
      
      // Test all links on each page
      cy.get("main").find("a").each(($link) => {
        const href = $link.attr("href");
        if (href && href.startsWith("/")) {
          cy.wrap($link).click();
          cy.url().should("include", href);
          cy.get("main").should("be.visible");
          cy.go("back");
        }
      });
    });
  });
}); 