import { render, screen } from '@testing-library/react'
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
    expect(screen.getByText(/Testing React components/i)).toBeDefined()
    expect(screen.getByText(/Test Author/i)).toBeInTheDocument()

    // eivät näy oletuksena
    const urlElement = screen.queryByText('http://example.com')
    const likesElement = screen.queryByText('likes 10')

    expect(urlElement).toBeNull()
    expect(likesElement).toBeNull()
  })
})
