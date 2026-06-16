import { useCallback, useEffect, useState } from 'react'

export function useSiteChatbotSettings() {
  const [enabled, setEnabled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = useCallback(() => {
    return fetch('/api/site-chatbot-settings')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return
        setEnabled(Boolean(data.website_enabled))
        setError('')
      })
      .catch(() => {
        setError('Could not load chatbot setting')
      })
  }, [])

  useEffect(() => {
    let cancelled = false
    load().finally(() => {
      if (!cancelled) setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [load])

  const update = useCallback(
    async (next) => {
      if (saving || loading || enabled === next) return
      const previous = enabled
      setSaving(true)
      setError('')
      setEnabled(next)
      try {
        const res = await fetch('/api/site-chatbot-settings', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ website_enabled: next }),
        })
        if (!res.ok) throw new Error('save failed')
        const data = await res.json()
        setEnabled(Boolean(data.website_enabled))
      } catch {
        setEnabled(previous)
        setError('Could not save — try again')
      } finally {
        setSaving(false)
      }
    },
    [enabled, loading, saving],
  )

  const toggle = useCallback(() => {
    if (loading) return
    update(!enabled)
  }, [enabled, loading, update])

  return { enabled, loading, saving, error, toggle, update, reload: load }
}
