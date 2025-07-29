import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check if the page loads without errors
    await expect(page).toHaveTitle(/HeyMou/);
    
    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for hero section
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should have working language switcher', async ({ page }) => {
    await page.goto('/');
    
    // Check if language switcher exists
    const languageSwitcher = page.locator('[data-testid="language-switcher"]');
    if (await languageSwitcher.isVisible()) {
      await languageSwitcher.click();
      
      // Check if language options are available
      await expect(page.locator('[data-testid="language-option"]')).toHaveCount(2);
    }
  });

  test('should have accessible navigation', async ({ page }) => {
    await page.goto('/');
    
    // Test keyboard navigation
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Check for skip link
    const skipLink = page.locator('[href="#main-content"]');
    if (await skipLink.isVisible()) {
      await expect(skipLink).toHaveText(/skip/i);
    }
  });

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check if mobile menu exists
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    }
  });
});