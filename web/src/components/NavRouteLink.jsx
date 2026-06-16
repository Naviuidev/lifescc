import { useNavigate } from 'react-router-dom'
import { withAppBase } from '../utils/appBase.js'

/**
 * Internal nav link with correct /test/ prefix on subfolder deploy.
 * Uses explicit href (for open-in-new-tab) + client-side navigate.
 */
export default function NavRouteLink({ to, className, children, onClick, ...rest }) {
  const navigate = useNavigate()
  const path = String(to ?? '').trim() || '/'

  return (
    <a
      {...rest}
      href={withAppBase(path)}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
        e.preventDefault()
        onClick?.(e)
        navigate(path)
      }}
    >
      {children}
    </a>
  )
}
