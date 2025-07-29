import { test, expect } from '@playwright/test';

test.describe('Contact Form', () => {
  test('should display contact form', async ({ page }) => {
    await page.goto('/contacto');
    
    // Check if contact form is visible
    await expect(page.locator('form[data-testid="contact-form"]')).toBeVisible();
    
    // Check required form fields
    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    await page.goto('/contacto');
    
    // Try to submit empty form
    await page.click('button[type="submit"]');
    
    // Check for validation messages
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });

  test('should submit form with valid data', async ({ page }) => {
    await page.goto('/contacto');
    
    // Fill out the form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');
    
    // Submit the form
    await page.click('button[type="submit"]');
    
    // Check for success message or redirect
    await expect(page.locator('[data-testid="success-message"]')).toBeVisible();
  });

  test('should handle form submission errors gracefully', async ({ page }) => {
    // Mock network failure
    await page.route('**/api/contact', route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Server error' })
      });
    });

    await page.goto('/contacto');
    
    // Fill and submit form
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('textarea[name="message"]', 'This is a test message');
    await page.click('button[type="submit"]');
    
    // Check for error handling
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible();
  });
});