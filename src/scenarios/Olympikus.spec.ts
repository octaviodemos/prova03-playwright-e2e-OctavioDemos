import { expect, test } from '@playwright/test';

test.describe('Olympikus E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.olympikus.com.br/', {
      waitUntil: 'domcontentloaded'
    });

    const acceptCookies = page.getByRole('button', { name: /aceitar/i });
    if (await acceptCookies.isVisible({ timeout: 3000 }).catch(() => false)) {
      await acceptCookies.click();
    }
  });

  test('deve carregar a home da Olympikus', async ({ page }) => {
    await expect(page).toHaveURL(/olympikus\.com\.br/);
    await expect(page).toHaveTitle(/Olympikus/i);
    await expect(
      page
        .getByRole('link', { name: 'Masculino', exact: true })
        .filter({ visible: true })
        .first()
    ).toBeVisible();
  });

  test('deve acessar a categoria Masculino pelo menu', async ({ page }) => {
    await page
      .getByRole('link', { name: 'Masculino', exact: true })
      .filter({ visible: true })
      .first()
      .click();

    await expect(page).toHaveURL(/\/masculino/);
    await expect(
      page.locator('a[href$="/p"]').filter({ visible: true }).first()
    ).toBeVisible();
  });

  test('deve abrir a página de um produto', async ({ page }) => {
    await page.goto('https://www.olympikus.com.br/masculino/calcados/corrida', {
      waitUntil: 'domcontentloaded'
    });

    const firstProduct = page
      .locator('a[href$="/p"]')
      .filter({ visible: true })
      .first();
    await expect(firstProduct).toBeVisible();
    await firstProduct.click();

    await expect(page).toHaveURL(/\/p(\?.*)?$/);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });
});
