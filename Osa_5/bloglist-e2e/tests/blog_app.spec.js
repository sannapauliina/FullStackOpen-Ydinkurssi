const { test, expect, describe } = require('@playwright/test')

test.beforeEach(async ({ page }) => {
  page.on('console', msg => {
    console.log('FRONTEND LOG:', msg.text())
  })
})

describe('Blog app', () => {
  test.beforeEach(async ({ page }) => {
    const api = page.request

    await api.post('http://localhost:3003/api/testing/reset')

    await api.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    // Tyhjennetään localStorage 
    await page.addInitScript(() => { 
      window.localStorage.clear() 
    })

    await page.context().clearCookies()
    await page.context().clearPermissions()

    await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox').nth(0).fill('mluukkai')
      await page.getByRole('textbox').nth(1).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Matti Luukkainen logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').nth(0).fill('mluukkai')
      await page.getByRole('textbox').nth(1).fill('väärä')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('wrong username/password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole('textbox').nth(0).fill('mluukkai')
      await page.getByRole('textbox').nth(1).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()

      await page.getByRole('textbox').nth(0).fill('Playwright testing')
      await page.getByRole('textbox').nth(1).fill('Test Author')
      await page.getByRole('textbox').nth(2).fill('http://example.com')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(page.getByText('Playwright testing')).toBeVisible()
      await expect(page.getByText('Test Author')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox').nth(0).fill('Like test blog')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).first().click()
      await page.getByRole('button', { name: 'like' }).first().click()

      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('the user who added a blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox').nth(0).fill('Delete test blog')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).first().click()

      page.on('dialog', dialog => dialog.accept())
      await page.getByRole('button', { name: 'delete' }).first().click()

      await expect(page.getByText('Delete test blog')).not.toBeVisible()
    })
  })
})
