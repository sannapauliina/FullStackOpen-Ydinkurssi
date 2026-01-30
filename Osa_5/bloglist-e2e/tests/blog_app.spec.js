const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
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
    beforeEach(async ({ page }) => {
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

      const blog = page.locator('text=Playwright testing Test Author').first() 
      await expect(blog).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox').nth(0).fill('mluukkai')
      await page.getByRole('textbox').nth(1).fill('salainen')
      await page.getByRole('button', { name: 'login' }).click()

      await page.getByRole('button', { name: 'create new blog' }).click()
      await page.getByRole('textbox').nth(0).fill('Like test blog')
      await page.getByRole('textbox').nth(1).fill('Author')
      await page.getByRole('textbox').nth(2).fill('http://example.com')
      await page.getByRole('button', { name: 'create' }).click()
    })

    test('a blog can be liked', async ({ page }) => {
      // Etsi kaikki view-napit
      const viewButtons = page.getByRole('button', { name: 'view' })

      // Klikkaa ensimmäistä view-nappia (koska beforeEach loi vain yhden blogin)
      await viewButtons.first().click()

      // Nyt like-nappi on näkyvissä
      const likeButton = page.getByRole('button', { name: 'like' })

      await likeButton.click()

      // Tarkista likes 1
      await expect(page.getByText('likes 1')).toBeVisible()
    })
  })
})
