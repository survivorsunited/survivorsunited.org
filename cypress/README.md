# Cypress Test Suite for Survivors United

This directory contains comprehensive end-to-end tests for the Survivors United Docusaurus documentation site.

## Test Structure

### Test Files

- **`navigation.cy.js`** - Tests for navigation functionality
  - Navbar navigation
  - Sidebar navigation
  - Footer links
  - Breadcrumb navigation
  - Mobile navigation
  - Logo links
  - Search functionality

- **`pages.cy.js`** - Tests for page content and structure
  - Page loading
  - Content validation
  - Internal links
  - External links
  - Meta tags
  - Images
  - Heading structure
  - Code blocks
  - Lists
  - 404 handling

- **`search.cy.js`** - Tests for search functionality
  - Search input visibility
  - Search results
  - No results handling
  - Search clearing
  - Navigation from search results
  - Search from different pages
  - Special characters
  - Case sensitivity
  - Search suggestions
  - Keyboard navigation

- **`links.cy.js`** - Tests for link validation
  - Internal navigation links
  - Navbar links
  - Footer links
  - Sidebar links
  - Content links
  - External links
  - Discord links
  - GitHub links
  - Download links
  - Image links
  - Anchor links
  - Breadcrumb links
  - Search result links
  - Broken links

- **`responsive.cy.js`** - Tests for responsive design
  - Desktop layout
  - Tablet layout
  - Mobile layout
  - Mobile navigation menu
  - Mobile search
  - Responsive images
  - Responsive text
  - Responsive tables
  - Responsive code blocks
  - Responsive navigation
  - Responsive footer
  - Responsive search results
  - Responsive sidebar
  - Responsive breadcrumbs

### Support Files

- **`support/e2e.js`** - Global configuration and custom commands
- **`support/commands.js`** - Additional custom commands

## Running Tests

### Prerequisites

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```

3. In a new terminal, run tests:
   ```bash
   npm test
   ```

### Test Commands

#### Basic Commands
- `npm test` - Run all tests in headless mode
- `npm run test:open` - Open Cypress Test Runner
- `npm run test:headless` - Run tests in headless mode

#### Browser-Specific Tests
- `npm run test:chrome` - Run tests in Chrome
- `npm run test:firefox` - Run tests in Firefox
- `npm run test:edge` - Run tests in Edge

#### Viewport-Specific Tests
- `npm run test:mobile` - Run tests with mobile viewport (375x667)
- `npm run test:tablet` - Run tests with tablet viewport (768x1024)
- `npm run test:desktop` - Run tests with desktop viewport (1280x720)

#### Individual Test Suites
- `npm run test:navigation` - Run only navigation tests
- `npm run test:pages` - Run only page content tests
- `npm run test:search` - Run only search tests
- `npm run test:links` - Run only link validation tests
- `npm run test:responsive` - Run only responsive design tests

#### Advanced Commands
- `npm run test:all` - Run all test files
- `npm run test:record` - Record test results (requires Cypress Cloud)
- `npm run test:parallel` - Run tests in parallel (requires Cypress Cloud)
- `npm run test:ci` - Run tests in CI environment

## Test Configuration

### Cypress Configuration (`cypress.config.js`)

- **Base URL**: `http://localhost:3000`
- **Viewport**: 1280x720 (desktop)
- **Video Recording**: Disabled
- **Screenshots**: Enabled on failure
- **Timeouts**: 10 seconds for commands, requests, and responses

### Custom Commands

The test suite includes many custom commands for common testing patterns:

#### Navigation Commands
- `cy.visitPage(path)` - Visit page and verify it loads
- `cy.navigateToPage(pageName)` - Navigate to page via navbar
- `cy.openMobileMenu()` - Open mobile navigation menu
- `cy.closeMobileMenu()` - Close mobile navigation menu

#### Content Validation Commands
- `cy.checkPageContent(expectedContent)` - Check page contains expected text
- `cy.validatePageStructure()` - Validate basic page structure
- `cy.validateContent(expectedContent)` - Validate multiple content items
- `cy.validateImages()` - Validate all images load properly
- `cy.validateLinks()` - Validate all links have href attributes

#### Search Commands
- `cy.performSearch(searchTerm)` - Perform search and verify results
- `cy.clearSearch()` - Clear search and verify results hidden
- `cy.checkSearch(searchTerm)` - Check search functionality

#### Responsive Commands
- `cy.viewportDesktop()` - Set desktop viewport
- `cy.viewportTablet()` - Set tablet viewport
- `cy.viewportMobile()` - Set mobile viewport
- `cy.checkResponsive(viewport)` - Check responsive behavior

#### Link Validation Commands
- `cy.validateInternalLinks()` - Test all internal links
- `cy.validateExternalLinks()` - Validate external link attributes
- `cy.checkExternalLink(linkText, expectedUrl)` - Check specific external link

#### Accessibility Commands
- `cy.checkA11y()` - Basic accessibility checks
- `cy.checkAccessibility()` - Comprehensive accessibility validation

#### Performance Commands
- `cy.checkPerformance()` - Check page load performance
- `cy.checkPageLoad()` - Verify page loads properly

#### Error Handling Commands
- `cy.handle404()` - Test 404 page handling
- `cy.checkErrorHandling()` - Test error handling
- `cy.check404Page()` - Validate 404 page content

## Test Data

### Pages Tested

The test suite covers all major pages:

#### Root Pages
- `/` - Homepage
- `/docs/getting-started` - Getting Started
- `/docs/hytale/getting-started` - Hytale Getting Started
- `/docs/hytale/mods` - Hytale Mods
- `/docs/faq` - FAQ
- `/docs/minecraft/supported-mods/index` - Supported Mods
- `/docs/terminology` - Terminology

#### Minecraft Pages
- `/docs/minecraft/getting-started` - Minecraft Setup Guide
- `/docs/minecraft/faq` - Minecraft FAQ
- `/docs/minecraft/server-info` - Server Information
- `/docs/minecraft/supported-mods/index` - Minecraft Supported Mods
- `/docs/minecraft/terminology` - Minecraft Terminology

### Content Keywords

Tests validate content using these keywords:

#### Technical Terms
- "minecraft", "fabric", "mods", "shaders", "java", "installation"

#### Community Terms
- "discord", "server", "community", "rules"

#### General Terms
- "setup", "guide", "help", "questions", "troubleshooting"

### Viewport Sizes

Tests run on multiple viewport sizes:

- **Mobile Small**: 320x568
- **Mobile**: 375x667
- **Tablet**: 768x1024
- **Desktop Small**: 1024x768
- **Desktop**: 1280x720
- **Desktop Large**: 1920x1080

## Best Practices

### Test Organization

1. **Group Related Tests**: Each test file focuses on a specific area
2. **Use Descriptive Names**: Test names clearly describe what they test
3. **Avoid Hardcoding**: Use data-driven tests where possible
4. **Clean Up**: Each test should clean up after itself

### Test Reliability

1. **Wait for Elements**: Use proper waiting strategies
2. **Handle Async Operations**: Account for loading states
3. **Retry Flaky Tests**: Configure retry attempts for known flaky tests
4. **Handle Exceptions**: Catch and handle non-critical exceptions

### Performance

1. **Optimize Selectors**: Use efficient CSS selectors
2. **Minimize Page Loads**: Reuse page visits where possible
3. **Parallel Execution**: Run tests in parallel when possible
4. **Headless Mode**: Use headless mode for faster execution

### Maintenance

1. **Update Selectors**: Keep selectors up to date with UI changes
2. **Review Test Data**: Regularly update test data and expected content
3. **Monitor Flaky Tests**: Track and fix flaky tests
4. **Document Changes**: Update documentation when tests change

## Troubleshooting

### Common Issues

1. **Tests Fail on CI**: Ensure CI environment matches local setup
2. **Flaky Tests**: Add retry logic or improve waiting strategies
3. **Selector Failures**: Update selectors when UI changes
4. **Performance Issues**: Optimize test execution and reduce page loads

### Debugging

1. **Use Cypress Test Runner**: Run tests in open mode for debugging
2. **Check Screenshots**: Review failure screenshots for visual issues
3. **Review Logs**: Check console logs for JavaScript errors
4. **Network Tab**: Monitor network requests for API issues

### Environment Variables

Tests use these environment variables:

- `CYPRESS_BASE_URL` - Base URL for testing (default: http://localhost:3000)
- `CYPRESS_VIDEO` - Enable/disable video recording
- `CYPRESS_SCREENSHOTS` - Enable/disable screenshots

## Continuous Integration

### GitHub Actions

The test suite can be integrated with GitHub Actions:

```yaml
name: Cypress Tests
on: [push, pull_request]
jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: cypress-io/github-action@v6
        with:
          start: npm start
          wait-on: 'http://localhost:3000'
          browser: chrome
          record: false
```

### Local CI

Run tests locally in CI mode:

```bash
npm run test:ci
```

This command:
1. Starts the development server
2. Waits for the server to be ready
3. Runs tests in headless mode
4. Shuts down the server

## Reporting

### Test Results

Cypress generates several types of reports:

- **Console Output**: Real-time test results in terminal
- **Screenshots**: Images of failed tests
- **Videos**: Recordings of test execution (if enabled)
- **JSON Reports**: Machine-readable test results

### Custom Reports

You can generate custom reports using:

```bash
# Generate JUnit XML report
cypress run --reporter junit --reporter-options "mochaFile=results/results-[hash].xml"

# Generate JSON report
cypress run --reporter json --reporter-options "output=results/results.json"
```

## Contributing

### Adding New Tests

1. **Choose Appropriate File**: Add tests to existing files or create new ones
2. **Follow Naming Convention**: Use descriptive test names
3. **Add Documentation**: Update this README with new test information
4. **Test Locally**: Ensure tests pass before committing

### Test Guidelines

1. **Keep Tests Focused**: Each test should test one specific thing
2. **Use Meaningful Assertions**: Assertions should be specific and meaningful
3. **Handle Edge Cases**: Test both success and failure scenarios
4. **Maintain Independence**: Tests should not depend on each other

### Code Review

When reviewing test changes:

1. **Check Test Logic**: Ensure tests actually test what they claim
2. **Review Selectors**: Verify selectors are robust and maintainable
3. **Validate Coverage**: Ensure new features are properly tested
4. **Check Performance**: Verify tests don't significantly slow down the suite 