const { test, expect } = require('@playwright/test');

test.describe('SauceDemo E2E Tests - 15 Test Cases', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://www.saucedemo.com');
    });

    // ==========================================
    // FLOW 1: LOGIN & AUTHENTICATION (5 Test Cases)
    // ==========================================
    test('TC-01: Login berhasil dengan standard_user', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await expect(page).toHaveURL(/inventory/);
        await expect(page.locator('.title')).toHaveText('Products');
    });

    test('TC-02: Login gagal dengan password salah', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'wrong_password');
        await page.click('#login-button');
        const error = page.locator('[data-test="error"]');
        await expect(error).toBeVisible();
        await expect(error).toContainText('Username and password do not match');
    });

    test('TC-03: Login gagal dengan user terkunci (locked_out_user)', async ({ page }) => {
        await page.fill('#user-name', 'locked_out_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await expect(page.locator('[data-test="error"]')).toContainText('Sorry, this user has been locked out');
    });

    test('TC-04: Login gagal jika username kosong', async ({ page }) => {
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
    });

    test('TC-05: Login gagal jika password kosong', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.click('#login-button');
        await expect(page.locator('[data-test="error"]')).toContainText('Password is required');
    });

    // ==========================================
    // FLOW 2: INVENTORY & CART MANAGEMENT (4 Test Cases)
    // ==========================================
    test('TC-06: Tambah 1 produk ke keranjang', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    });

    test('TC-07: Tambah multiple produk ke keranjang', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
        await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
        await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
    });

    test('TC-08: Hapus produk dari halaman Inventory', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('[data-test="remove-sauce-labs-backpack"]');
        await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
    });

    test('TC-09: Hapus produk dari halaman Cart', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await page.click('[data-test="remove-sauce-labs-backpack"]');
        await expect(page.locator('.cart_item')).not.toBeVisible();
    });

    // ==========================================
    // FLOW 3: CHECKOUT PROCESS (4 Test Cases)
    // ==========================================
    test('TC-10: Complete Checkout Flow hingga Finish', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await page.click('[data-test="checkout"]');
        
        await page.fill('[data-test="firstName"]', 'Achmad');
        await page.fill('[data-test="lastName"]', 'Fauzi');
        await page.fill('[data-test="postalCode"]', '60294');
        await page.click('[data-test="continue"]');
        
        await page.click('[data-test="finish"]');
        await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    });

    test('TC-11: Checkout gagal jika First Name kosong', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await page.click('[data-test="checkout"]');
        
        await page.click('[data-test="continue"]');
        await expect(page.locator('[data-test="error"]')).toContainText('Error: First Name is required');
    });

    test('TC-12: Checkout gagal jika Last Name kosong', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await page.click('[data-test="checkout"]');
        
        await page.fill('[data-test="firstName"]', 'Achmad');
        await page.click('[data-test="continue"]');
        await expect(page.locator('[data-test="error"]')).toContainText('Error: Last Name is required');
    });

    test('TC-13: Checkout gagal jika Postal Code kosong', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
        await page.click('.shopping_cart_link');
        await page.click('[data-test="checkout"]');
        
        await page.fill('[data-test="firstName"]', 'Achmad');
        await page.fill('[data-test="lastName"]', 'Fauzi');
        await page.click('[data-test="continue"]');
        await expect(page.locator('[data-test="error"]')).toContainText('Error: Postal Code is required');
    });

    // ==========================================
    // FLOW 4: LOGOUT & PRODUCT NAVIGATION (2 Test Cases)
    // ==========================================
    test('TC-14: Logout dari aplikasi', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        
        await page.click('#react-burger-menu-btn');
        await page.click('#logout_sidebar_link');
        await expect(page).toHaveURL('https://www.saucedemo.com/');
    });

    test('TC-15: Membuka detail produk', async ({ page }) => {
        await page.fill('#user-name', 'standard_user');
        await page.fill('#password', 'secret_sauce');
        await page.click('#login-button');
        
        await page.click('text=Sauce Labs Backpack');
        await expect(page).toHaveURL(/inventory-item/);
        await expect(page.locator('.inventory_details_name')).toHaveText('Sauce Labs Backpack');
    });

});