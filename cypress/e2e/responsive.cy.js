describe("Responsive Design Tests", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should display correctly on desktop", () => {
    cy.viewport(1280, 720);
    
    // Check desktop layout elements
    cy.get("nav").should("be.visible");
    cy.get('[data-testid="sidebar"]').should("be.visible");
    cy.get("main").should("be.visible");
    cy.get("footer").should("be.visible");
    
    // Check desktop navigation
    cy.get("nav").within(() => {
      cy.contains("Getting Started").should("be.visible");
      cy.contains("FAQ").should("be.visible");
      cy.contains("Supported Mods").should("be.visible");
    });
  });

  it("should display correctly on tablet", () => {
    cy.viewport(768, 1024);
    
    // Check tablet layout elements
    cy.get("nav").should("be.visible");
    cy.get("main").should("be.visible");
    cy.get("footer").should("be.visible");
    
    // Check sidebar behavior on tablet
    cy.get('[data-testid="sidebar"]').should("be.visible");
  });

  it("should display correctly on mobile", () => {
    cy.viewport(375, 667);
    
    // Check mobile layout elements
    cy.get("nav").should("be.visible");
    cy.get("main").should("be.visible");
    cy.get("footer").should("be.visible");
    
    // Check mobile menu button exists
    cy.get('[data-testid="mobile-menu-button"]').should("be.visible");
    
    // Check sidebar is hidden by default on mobile
    cy.get('[data-testid="sidebar"]').should("not.be.visible");
  });

  it("should handle mobile navigation menu", () => {
    cy.viewport(375, 667);
    
    // Open mobile menu
    cy.get('[data-testid="mobile-menu-button"]').click();
    cy.get('[data-testid="mobile-menu"]').should("be.visible");
    
    // Test mobile menu navigation
    cy.get('[data-testid="mobile-menu"]').within(() => {
      cy.contains("Getting Started").click();
      cy.url().should("include", "/docs/getting-started");
    });
  });

  it("should handle mobile search", () => {
    cy.viewport(375, 667);
    
    // Check search is accessible on mobile
    cy.get('[data-testid="search-input"]').should("be.visible");
    
    // Test search functionality on mobile
    cy.get('[data-testid="search-input"]').type("minecraft");
    cy.get('[data-testid="search-results"]').should("be.visible");
  });

  it("should handle responsive images", () => {
    cy.visit("/docs/minecraft/getting-started");
    
    // Test different viewport sizes
    const viewports = [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);
      
      // Check images are visible and properly sized
      cy.get("main").find("img").each(($img) => {
        cy.wrap($img).should("be.visible");
        cy.wrap($img).should("have.css", "max-width", "100%");
      });
    });
  });

  it("should handle responsive text", () => {
    const viewports = [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit("/docs/getting-started");
      
      // Check text is readable
      cy.get("main").find("p").each(($p) => {
        cy.wrap($p).should("be.visible");
        cy.wrap($p).should("not.be.empty");
      });
    });
  });

  it("should handle responsive tables", () => {
    cy.visit("/docs/supported-mods");
    
    const viewports = [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);
      
      // Check tables are responsive
      cy.get("main").find("table").each(($table) => {
        cy.wrap($table).should("be.visible");
        cy.wrap($table).should("have.css", "overflow-x", "auto");
      });
    });
  });

  it("should handle responsive code blocks", () => {
    cy.visit("/docs/minecraft/getting-started");
    
    const viewports = [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);
      
      // Check code blocks are responsive
      cy.get("main").find("pre").each(($pre) => {
        cy.wrap($pre).should("be.visible");
        cy.wrap($pre).should("have.css", "overflow-x", "auto");
      });
    });
  });

  it("should handle responsive navigation on different pages", () => {
    const pages = [
      "/docs/getting-started",
      "/docs/faq",
      "/docs/supported-mods",
      "/docs/minecraft/getting-started"
    ];
    
    const viewports = [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    pages.forEach(page => {
      viewports.forEach(viewport => {
        cy.viewport(viewport.width, viewport.height);
        cy.visit(page);
        
        // Check navigation elements are visible
        cy.get("nav").should("be.visible");
        cy.get("main").should("be.visible");
        cy.get("footer").should("be.visible");
        
        // Check mobile menu on small screens
        if (viewport.width <= 768) {
          cy.get('[data-testid="mobile-menu-button"]').should("be.visible");
        }
      });
    });
  });

  it("should handle responsive footer", () => {
    const viewports = [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit("/");
      
      // Check footer is visible and properly laid out
      cy.get("footer").should("be.visible");
      cy.get("footer").within(() => {
        cy.contains("Docs").should("be.visible");
        cy.contains("Community").should("be.visible");
        cy.contains("More").should("be.visible");
      });
    });
  });

  it("should handle responsive search results", () => {
    const viewports = [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);
      cy.visit("/");
      
      // Test search on different screen sizes
      cy.get('[data-testid="search-input"]').type("minecraft");
      cy.get('[data-testid="search-results"]').should("be.visible");
      
      // Check search results are properly displayed
      cy.get('[data-testid="search-results"]').within(() => {
        cy.get("a").should("have.length.at.least", 1);
      });
    });
  });

  it("should handle responsive sidebar", () => {
    cy.visit("/docs/getting-started");
    
    const viewports = [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);
      
      if (viewport.width > 768) {
        // Sidebar should be visible on larger screens
        cy.get('[data-testid="sidebar"]').should("be.visible");
      } else {
        // Sidebar should be hidden on mobile
        cy.get('[data-testid="sidebar"]').should("not.be.visible");
      }
    });
  });

  it("should handle responsive breadcrumbs", () => {
    cy.visit("/docs/minecraft/getting-started");
    
    const viewports = [
      { width: 1280, height: 720 },
      { width: 768, height: 1024 },
      { width: 375, height: 667 }
    ];
    
    viewports.forEach(viewport => {
      cy.viewport(viewport.width, viewport.height);
      
      // Check breadcrumbs are visible and functional
      cy.get('[data-testid="breadcrumbs"]').should("be.visible");
      cy.get('[data-testid="breadcrumbs"]').within(() => {
        cy.get("a").should("have.length.at.least", 1);
      });
    });
  });
}); 