const { test, expect } = require('@playwright/test');

test.describe('SauceDemo E2E Tests', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com');
    });

    test('1. Login berhasil dengan standard_user', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page).toHaveURL(/inventory/);
        await expect(page.locator('.title')).toHaveText('Products');
    });

    test('2. Login gagal dengan password salah', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'wrong_password');
        await page.click('#login-button');

        const error = page.locator('[data-test="error"]');
        await expect(error).toBeVisible();
        await expect(error).toContainText('Username and password do not match');
    });

    test('3. Login gagal dengan locked_out_user', async ({ page }) => {
        await page.fill('#user-name', 'locked_out_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await expect(page.locator('[data-test="error"]'))
            .toContainText('Sorry, this user has been locked out');
    });

    test('4. Tambah produk ke cart', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });

    test('5. Complete Checkout Flow', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');

        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await expect(page).toHaveURL(/cart/);

        await page.click('[data-test="checkout"]');
        await page.fill('[data-test="firstName"]', 'Achmad');
        await page.fill('[data-test="lastName"]', 'Fauzi');
        await page.fill('[data-test="postalCode"]', '60294');
        await page.click('[data-test="continue"]');

        await page.click('[data-test="finish"]');
        await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    });
});