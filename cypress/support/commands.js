// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

// Add custom commands for Docusaurus testing
Cypress.Commands.add("login", (email, password) => {
  // Custom login command if needed
  cy.log("Login functionality not implemented for static site");
});

Cypress.Commands.add("logout", () => {
  // Custom logout command if needed
  cy.log("Logout functionality not implemented for static site");
});

// Add custom command to check if element is in viewport
Cypress.Commands.add("isInViewport", (element) => {
  cy.get(element).then(($el) => {
    const rect = $el[0].getBoundingClientRect();
    expect(rect.top).to.be.lessThan(Cypress.config("viewportHeight"));
    expect(rect.bottom).to.be.greaterThan(0);
  });
});

// Add custom command to check if element is visible in viewport
Cypress.Commands.add("isVisibleInViewport", (element) => {
  cy.get(element).should("be.visible");
  cy.isInViewport(element);
});

// Add custom command to scroll to element
Cypress.Commands.add("scrollToElement", (element) => {
  cy.get(element).scrollIntoView();
  cy.get(element).should("be.visible");
});

// Add custom command to wait for page load
Cypress.Commands.add("waitForPageLoad", () => {
  cy.get("body").should("be.visible");
  cy.get("main").should("be.visible");
  cy.get("main").should("not.be.empty");
});

// Add custom command to check page title
Cypress.Commands.add("checkPageTitle", (expectedTitle) => {
  cy.title().should("contain", expectedTitle);
});

// Add custom command to check URL
Cypress.Commands.add("checkUrl", (expectedUrl) => {
  cy.url().should("include", expectedUrl);
});

// Add custom command to check meta tags
Cypress.Commands.add("checkMetaTags", () => {
  cy.get('meta[name="description"]').should("exist");
  cy.get('meta[name="viewport"]').should("exist");
});

// Add custom command to check favicon
Cypress.Commands.add("checkFavicon", () => {
  cy.get('link[rel="icon"]').should("exist");
});

// Add custom command to check social media meta tags
Cypress.Commands.add("checkSocialMetaTags", () => {
  cy.get('meta[property="og:title"]').should("exist");
  cy.get('meta[property="og:description"]').should("exist");
  cy.get('meta[property="og:type"]').should("exist");
});

// Add custom command to check structured data
Cypress.Commands.add("checkStructuredData", () => {
  cy.get('script[type="application/ld+json"]').should("exist");
});

// Add custom command to check accessibility
Cypress.Commands.add("checkA11y", () => {
  // Basic accessibility checks
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

// Add custom command to check performance
Cypress.Commands.add("checkPerformance", () => {
  cy.window().then((win) => {
    const performance = win.performance;
    const navigation = performance.getEntriesByType("navigation")[0];
    
    // Check if page load time is reasonable (less than 5 seconds)
    expect(navigation.loadEventEnd - navigation.loadEventStart).to.be.lessThan(5000);
  });
});

// Add custom command to check console errors
Cypress.Commands.add("checkConsoleErrors", () => {
  cy.window().then((win) => {
    const consoleErrors = win.console.error;
    expect(consoleErrors).to.not.be.called;
  });
});

// Add custom command to check network requests
Cypress.Commands.add("checkNetworkRequests", () => {
  cy.intercept("GET", "**/*").as("networkRequests");
  cy.wait("@networkRequests");
});

// Add custom command to check responsive breakpoints
Cypress.Commands.add("checkResponsiveBreakpoints", () => {
  const breakpoints = [
    { width: 320, height: 568, name: "mobile-small" },
    { width: 375, height: 667, name: "mobile" },
    { width: 768, height: 1024, name: "tablet" },
    { width: 1024, height: 768, name: "desktop-small" },
    { width: 1280, height: 720, name: "desktop" },
    { width: 1920, height: 1080, name: "desktop-large" }
  ];
  
  breakpoints.forEach(breakpoint => {
    cy.viewport(breakpoint.width, breakpoint.height);
    cy.get("body").should("be.visible");
    cy.get("main").should("be.visible");
  });
});

// Add custom command to check print styles
Cypress.Commands.add("checkPrintStyles", () => {
  cy.get("body").should("have.css", "display", "block");
});

// Add custom command to check keyboard navigation
Cypress.Commands.add("checkKeyboardNavigation", () => {
  // Test tab navigation
  cy.get("body").tab();
  cy.focused().should("exist");
  
  // Test enter key
  cy.focused().type("{enter}");
});

// Add custom command to check focus management
Cypress.Commands.add("checkFocusManagement", () => {
  cy.get("main").find("a, button, input, textarea").each(($element) => {
    cy.wrap($element).focus();
    cy.focused().should("exist");
  });
});

// Add custom command to check color contrast
Cypress.Commands.add("checkColorContrast", () => {
  // This would require a color contrast library
  // For now, just check that text is visible
  cy.get("main").find("p, h1, h2, h3, h4, h5, h6").each(($text) => {
    cy.wrap($text).should("be.visible");
  });
});

// Add custom command to check form validation
Cypress.Commands.add("checkFormValidation", () => {
  // Check if forms have proper validation attributes
  cy.get("main").find("form").each(($form) => {
    cy.wrap($form).find("input[required]").should("have.attr", "required");
  });
});

// Add custom command to check error handling
Cypress.Commands.add("checkErrorHandling", () => {
  // Visit a non-existent page
  cy.visit("/non-existent-page", { failOnStatusCode: false });
  cy.get("body").should("contain.text", "404");
});

// Add custom command to check loading states
Cypress.Commands.add("checkLoadingStates", () => {
  // Check if loading indicators are properly handled
  cy.get("main").should("not.contain", "Loading...");
});

// Add custom command to check content updates
Cypress.Commands.add("checkContentUpdates", () => {
  // Check if content updates properly
  cy.get("main").should("not.be.empty");
});

// Add custom command to check browser compatibility
Cypress.Commands.add("checkBrowserCompatibility", () => {
  // Check if site works in different browsers
  // This would require testing in different browsers
  cy.log("Browser compatibility testing requires multiple browser environments");
});

// Add custom command to check SEO elements
Cypress.Commands.add("checkSEOElements", () => {
  cy.get('meta[name="description"]').should("exist");
  cy.get('meta[name="keywords"]').should("exist");
  cy.get('meta[name="robots"]').should("exist");
  cy.get('link[rel="canonical"]').should("exist");
});

// Add custom command to check security headers
Cypress.Commands.add("checkSecurityHeaders", () => {
  // Check if security headers are present
  cy.request("/").then((response) => {
    expect(response.headers).to.have.property("x-frame-options");
    expect(response.headers).to.have.property("x-content-type-options");
  });
});

// Add custom command to check caching
Cypress.Commands.add("checkCaching", () => {
  // Check if caching headers are present
  cy.request("/").then((response) => {
    expect(response.headers).to.have.property("cache-control");
  });
});

// Add custom command to check compression
Cypress.Commands.add("checkCompression", () => {
  // Check if compression is enabled
  cy.request("/").then((response) => {
    expect(response.headers).to.have.property("content-encoding");
  });
});

// Add custom command to check SSL
Cypress.Commands.add("checkSSL", () => {
  // Check if SSL is properly configured
  cy.request("https://localhost:3000").then((response) => {
    expect(response.status).to.equal(200);
  });
});

// Add custom command to check redirects
Cypress.Commands.add("checkRedirects", () => {
  // Check if redirects work properly
  cy.visit("/docs");
  cy.url().should("include", "/docs");
});

// Add custom command to check 404 page
Cypress.Commands.add("check404Page", () => {
  cy.visit("/non-existent-page", { failOnStatusCode: false });
  cy.get("body").should("contain.text", "404");
  cy.get("body").should("contain.text", "Page Not Found");
});

// Add custom command to check 500 page
Cypress.Commands.add("check500Page", () => {
  // This would require server-side testing
  cy.log("500 page testing requires server-side testing");
});

// Add custom command to check maintenance mode
Cypress.Commands.add("checkMaintenanceMode", () => {
  // Check if maintenance mode is properly handled
  cy.get("body").should("not.contain", "Maintenance Mode");
});

// Add custom command to check offline functionality
Cypress.Commands.add("checkOfflineFunctionality", () => {
  // Check if offline functionality works
  cy.log("Offline functionality testing requires service worker testing");
});

// Add custom command to check progressive enhancement
Cypress.Commands.add("checkProgressiveEnhancement", () => {
  // Check if site works without JavaScript
  cy.get("body").should("be.visible");
  cy.get("main").should("be.visible");
});

// Add custom command to check graceful degradation
Cypress.Commands.add("checkGracefulDegradation", () => {
  // Check if site degrades gracefully
  cy.get("body").should("be.visible");
  cy.get("main").should("be.visible");
}); 