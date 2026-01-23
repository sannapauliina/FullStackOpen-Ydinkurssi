import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component', () => {

  test('renders title and author but not url or likes by default', () => {
    const blog = {
      title: 'Testing React components',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 10,
      user: {
        username: 'tester',
        name: 'Test User'
      }
    }

    const user = { username: 'tester' }

    render(<Blog blog={blog} user={user} />)

    // näkyvät
    expect(screen.getByText(/Testing React components/i)).toBeInTheDocument()
    expect(screen.getByText(/Test Author/i)).toBeInTheDocument()

    // eivät näy oletuksena
    expect(screen.queryByText('http://example.com')).toBeNull()
    expect(screen.queryByText(/likes 10/i)).toBeNull()
  })

  test('renders url, likes and user after clicking the view button', async () => {
    const blog = {
      title: 'Testing React components',
      author: 'Test Author',
      url: 'http://example.com',
      likes: 10,
      user: {
        username: 'tester',
        name: 'Test User'
      }
    }

    const user = { username: 'tester' }

    render(<Blog blog={blog} user={user} />)

    const userSim = userEvent.setup()

    // Etsi view-nappi
    const button = screen.getByText('view')

    // Klikkaa sitä
    await userSim.click(button)

    // Nyt url, likes ja user.name pitäisi näkyä
    expect(screen.getByText('http://example.com')).toBeInTheDocument()
    expect(screen.getByText(/likes 10/i)).toBeInTheDocument()
    expect(screen.getByText('Test User')).toBeInTheDocument()
  })
})
