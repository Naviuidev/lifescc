import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { estimateReadMinutes, excerptFromBlog, formatBlogDate, publicAssetUrl } from '../utils/blogPublic.js'
import './BlogListingPage.css'

const DISPLAY_AUTHOR = 'Lifescc'

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M10.5 18a7.5 7.5 0 110-15 7.5 7.5 0 010 15zm0-2a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"
        fill="currentColor"
        opacity="0.45"
      />
      <path d="M15.446 15.446l4.243 4.243" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

export default function BlogListingPage() {
  const [rawPosts, setRawPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('recent')

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/blogs/public')
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not load articles')
        setRawPosts([])
        return
      }
      setRawPosts(Array.isArray(data.blogs) ? data.blogs : [])
    } catch {
      setError('Network error')
      setRawPosts([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filteredSorted = useMemo(() => {
    let list = [...rawPosts]
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter((b) => {
        const title = String(b.title || '').toLowerCase()
        const sum = String(b.listing_summary || '').toLowerCase()
        const sub = String(b.banner_subtitle || '').toLowerCase()
        return title.includes(q) || sum.includes(q) || sub.includes(q)
      })
    }
    if (sort === 'oldest') {
      list.reverse()
    }
    return list
  }, [rawPosts, search, sort])

  const featured = filteredSorted[0] ?? null
  const gridPosts = filteredSorted.slice(1)

  return (
    <div className="blog-listing-page">
      <Navbar />
      <main className="blog-listing-page__main">
        <header className="blog-listing-page__hero text-center">
          <span className="blog-listing-page__eyebrow">Read our blog</span>
          <h1 className="blog-listing-page__title">Browse our resources</h1>
          <p className="blog-listing-page__lead">Tips and insights from our team—wellness, care, and what to expect.</p>
        </header>

        <div className="blog-listing-page__layout container-wide">
          <aside className="blog-listing-page__sidebar" aria-label="Filters">
            <div className="blog-listing-card">
              <label className="blog-listing-page__side-label" htmlFor="blog-search">
                Search articles
              </label>
              <div className="blog-listing-page__search-wrap">
                <span className="blog-listing-page__search-icon">
                  <SearchIcon />
                </span>
                <input
                  id="blog-search"
                  type="search"
                  className="form-control blog-listing-page__search-input"
                  placeholder="Search by title or content…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="blog-listing-card">
              <label className="blog-listing-page__side-label" htmlFor="blog-sort">
                Sort
              </label>
              <select
                id="blog-sort"
                className="form-select blog-listing-page__select"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
              >
                <option value="recent">Most recent</option>
                <option value="oldest">Oldest first</option>
              </select>
            </div>
          </aside>

          <div className="blog-listing-page__content">
            {error ? <p className="text-danger blog-listing-page__banner">{error}</p> : null}

            {loading ? (
              <p className="blog-listing-page__muted">Loading articles…</p>
            ) : null}

            {!loading && !error && filteredSorted.length === 0 ? (
              <p className="blog-listing-page__muted">
                No published articles yet. Check back soon or explore{' '}
                <Link to="/contact-us">contact us</Link>.
              </p>
            ) : null}

            {!loading && featured ? (
              <article className="blog-listing-feature">
                <Link to={`/blog/${encodeURIComponent(featured.slug)}`} className="blog-listing-feature__media">
                  {featured.cover_image ? (
                    <img src={publicAssetUrl(featured.cover_image)} alt="" className="blog-listing-feature__img" />
                  ) : (
                    <div className="blog-listing-feature__img blog-listing-feature__img--placeholder" aria-hidden />
                  )}
                </Link>
                <div className="blog-listing-feature__body">
                  <span className="blog-listing-page__pill blog-listing-page__pill--featured">Featured</span>
                  <h2 className="blog-listing-feature__heading">
                    <Link to={`/blog/${encodeURIComponent(featured.slug)}`}>{featured.title}</Link>
                  </h2>
                  <p className="blog-listing-feature__excerpt">{excerptFromBlog(featured, 260)}</p>
                  <div className="blog-listing-feature__meta">
                    <span className="blog-listing-feature__avatar" aria-hidden>
                      {DISPLAY_AUTHOR.charAt(0)}
                    </span>
                    <span className="blog-listing-feature__author">{DISPLAY_AUTHOR}</span>
                    <span className="blog-listing-feature__dot" aria-hidden>
                      ·
                    </span>
                    <span>{estimateReadMinutes(featured)} min read</span>
                    {featured.created_at ? (
                      <>
                        <span className="blog-listing-feature__dot" aria-hidden>
                          ·
                        </span>
                        <time dateTime={String(featured.created_at)}>{formatBlogDate(featured.created_at)}</time>
                      </>
                    ) : null}
                  </div>
                </div>
              </article>
            ) : null}

            {gridPosts.length > 0 ? (
              <div className="blog-listing-grid">
                {gridPosts.map((post) => (
                  <article key={post.id} className="blog-listing-card-post">
                    <Link to={`/blog/${encodeURIComponent(post.slug)}`} className="blog-listing-card-post__media">
                      {post.cover_image ? (
                        <img src={publicAssetUrl(post.cover_image)} alt="" className="blog-listing-card-post__img" />
                      ) : (
                        <div className="blog-listing-card-post__img blog-listing-card-post__img--placeholder" aria-hidden />
                      )}
                    </Link>
                    <span className="blog-listing-page__pill blog-listing-page__pill--soft">Article</span>
                    <h3 className="blog-listing-card-post__title">
                      <Link to={`/blog/${encodeURIComponent(post.slug)}`}>{post.title}</Link>
                    </h3>
                    <p className="blog-listing-card-post__excerpt">{excerptFromBlog(post, 140)}</p>
                    <div className="blog-listing-card-post__foot">
                      <span>{estimateReadMinutes(post)} min read</span>
                      {post.created_at ? (
                        <>
                          <span className="blog-listing-feature__dot" aria-hidden>
                            ·
                          </span>
                          <time dateTime={String(post.created_at)}>{formatBlogDate(post.created_at)}</time>
                        </>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
