import { Link } from 'react-router-dom'
import './AdminBlogToolbar.css'

/**
 * Shared navigation for blog admin: list, new post, submissions, analytics.
 * @param {'posts' | 'new' | 'editor' | 'submissions' | 'analytics'} active — use `editor` when editing an existing post (highlights All posts).
 */
export default function AdminBlogToolbar({ active = 'posts' }) {
  const postsActive = active === 'posts' || active === 'editor'
  const newActive = active === 'new'

  return (
    <nav className="admin-blog-toolbar" aria-label="Blog admin sections">
      <Link
        to="/admin/blogs"
        className={`btn btn-sm rounded-pill admin-blog-toolbar__btn${postsActive ? ' admin-blog-toolbar__btn--active' : ''}`}
      >
        All posts
      </Link>
      <Link
        to="/admin/blogs/new"
        className={`btn btn-sm rounded-pill admin-blog-toolbar__btn${newActive ? ' admin-blog-toolbar__btn--active' : ''}`}
      >
        New post
      </Link>
      <Link
        to="/admin/blogs/submissions"
        className={`btn btn-sm rounded-pill admin-blog-toolbar__btn${active === 'submissions' ? ' admin-blog-toolbar__btn--active' : ''}`}
      >
        Blogs data
      </Link>
      <Link
        to="/admin/blogs/analytics"
        className={`btn btn-sm rounded-pill admin-blog-toolbar__btn${active === 'analytics' ? ' admin-blog-toolbar__btn--active' : ''}`}
      >
        Analytics
      </Link>
    </nav>
  )
}
