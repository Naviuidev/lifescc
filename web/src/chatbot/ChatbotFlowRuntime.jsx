import { useCallback, useEffect, useMemo, useState } from 'react'
import { previewFlowOrder, resolvePromptText } from './chatbotFlowUtils.js'
import '../pages/AdminChatbotPages.css'

function LogoThumb({ logo, name }) {
  const [broken, setBroken] = useState(false)
  const letter = (String(name ?? '?')[0] || '?').toUpperCase()
  const src = logo ? String(logo).trim() : ''
  if (!src || broken) {
    return <span className="admin-chatbot-preview__logo-fallback">{letter}</span>
  }
  return (
    <img
      className="admin-chatbot-preview__logo-img"
      src={src}
      alt=""
      loading="lazy"
      onError={() => setBroken(true)}
    />
  )
}

function LogoBubble({ logo, name }) {
  const [broken, setBroken] = useState(false)
  const letter = (String(name ?? '?')[0] || '?').toUpperCase()
  const src = logo ? String(logo).trim() : ''
  if (!src || broken) {
    return (
      <span className="admin-chatbot-preview__bubble-logo-fallback" aria-hidden>
        {letter}
      </span>
    )
  }
  return (
    <img
      className="admin-chatbot-preview__bubble-logo-img"
      src={src}
      alt=""
      loading="lazy"
      onError={() => setBroken(true)}
    />
  )
}

function PreviewBotTurn({ logo, name, promptText }) {
  return (
    <div className="admin-chatbot-preview__bubble admin-chatbot-preview__bubble--step">
      <div className="admin-chatbot-preview__bot-brand">
        <LogoBubble logo={logo} name={name} />
      </div>
      <p className="admin-chatbot-preview__bubble-prompt">{promptText || 'Continue…'}</p>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * Shared conversation UI for admin preview and the public site widget.
 * Drives the configured flow (transformations order) with text, branch buttons, and core features.
 */
export default function ChatbotFlowRuntime({
  chatbot,
  flows: flowsProp,
  edges: edgesProp,
  chatbotId,
  onError,
  restartLabel = 'Restart',
  showCloseButton = false,
  onClose,
  showEndChatSave = true,
}) {
  const flows = Array.isArray(flowsProp) ? flowsProp : []
  const edges = Array.isArray(edgesProp) ? edgesProp : []
  const previewSteps = useMemo(() => previewFlowOrder(flows, edges), [flows, edges])
  const previewChainKey = useMemo(() => previewSteps.map((f) => f.id).join(','), [previewSteps])

  const [previewStepIndex, setPreviewStepIndex] = useState(0)
  const [previewReplies, setPreviewReplies] = useState([])
  const [previewDraft, setPreviewDraft] = useState('')
  const [coreMenuExpanded, setCoreMenuExpanded] = useState(false)
  const [endChatSaving, setEndChatSaving] = useState(false)
  const [conversationSavedId, setConversationSavedId] = useState(null)

  useEffect(() => {
    setPreviewStepIndex(0)
    setPreviewReplies([])
    setPreviewDraft('')
    setConversationSavedId(null)
  }, [previewChainKey])

  useEffect(() => {
    setCoreMenuExpanded(false)
  }, [previewStepIndex])

  const submitPreviewStep = (e) => {
    e.preventDefault()
    const text = previewDraft.trim()
    if (text === '') return
    const step = previewSteps[previewStepIndex]
    if (!step) return
    setPreviewReplies((prev) => [...prev, text])
    setPreviewDraft('')
    setPreviewStepIndex((i) => i + 1)
  }

  const previewGoBack = () => {
    if (previewStepIndex <= 0) return
    setPreviewStepIndex((s) => s - 1)
    setPreviewReplies((r) => r.slice(0, -1))
    setPreviewDraft('')
  }

  const saveConversationEnd = useCallback(async () => {
    const messages = []
    for (let i = 0; i < previewReplies.length; i++) {
      const f = previewSteps[i]
      if (!f) break
      messages.push({
        role: 'assistant',
        content: resolvePromptText(f, previewSteps, previewReplies, i),
        flow_id: Number(f.id),
      })
      messages.push({
        role: 'user',
        content: previewReplies[i],
        flow_id: Number(f.id),
      })
    }
    if (messages.length === 0) {
      onError?.('Send at least one reply before ending the chat.')
      return
    }
    setEndChatSaving(true)
    setConversationSavedId(null)
    onError?.(null)
    try {
      const res = await fetch(`/api/chatbots/${chatbotId}/conversations/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        onError?.(typeof data.error === 'string' ? data.error : 'Could not save conversation')
        return
      }
      setConversationSavedId(
        typeof data.conversation_id === 'number' ? data.conversation_id : Number(data.conversation_id) || null
      )
    } catch {
      onError?.('Network error')
    } finally {
      setEndChatSaving(false)
    }
  }, [chatbotId, onError, previewReplies, previewSteps])

  const logo = chatbot?.logo
  const name = chatbot?.name

  return (
    <div className="admin-chatbot-preview">
      <div className="admin-chatbot-preview__head">
        <LogoThumb logo={logo} name={name} />
        <div className="admin-chatbot-preview__head-text">
          <span className="admin-chatbot-preview__name">{String(name ?? 'Chatbot')}</span>
          <span className="admin-chatbot-preview__sub">{String(chatbot?.business_title ?? '')}</span>
        </div>
        {showCloseButton ? (
          <button
            type="button"
            className="admin-chatbot-preview__close"
            aria-label="Close"
            onClick={() => onClose?.()}
          >
            <CloseIcon />
          </button>
        ) : null}
      </div>
      <div className="admin-chatbot-preview__body">
        {previewSteps.length > 0 ? (
          <div className="admin-chatbot-preview__toolbar">
            <button
              type="button"
              className="admin-chatbot-preview__restart"
              onClick={() => {
                setPreviewStepIndex(0)
                setPreviewReplies([])
                setPreviewDraft('')
                setConversationSavedId(null)
                setCoreMenuExpanded(false)
              }}
            >
              {restartLabel}
            </button>
          </div>
        ) : null}
        {conversationSavedId != null ? (
          <p className="admin-chatbot-preview__saved">Conversation saved (id {conversationSavedId}).</p>
        ) : null}
        {previewSteps.length === 0 ? (
          <p className="admin-chatbot-preview__empty">Flows will appear here in conversation order.</p>
        ) : previewStepIndex >= previewSteps.length ? (
          <p className="admin-chatbot-preview__done">End of flow — all steps completed.</p>
        ) : (
          <div className="admin-chatbot-preview__thread">
            {previewSteps.map((f, i) => {
              if (f == null || f.id == null) return null
              const promptText = resolvePromptText(f, previewSteps, previewReplies, i)
              if (i < previewStepIndex) {
                return (
                  <div key={f.id} className="admin-chatbot-preview__step admin-chatbot-preview__step--past">
                    <PreviewBotTurn logo={logo} name={name} promptText={promptText} />
                    <div className="admin-chatbot-preview__user-bubble">{previewReplies[i]}</div>
                  </div>
                )
              }
              if (i === previewStepIndex) {
                const flowType = String(f.flow_type ?? '')
                const coreOpts = Array.isArray(f.options) ? f.options : []
                const isCore = flowType === 'core_features' && coreOpts.length > 0
                const isBranchPick =
                  (flowType === 'collect_location' || flowType === 'query_menu') && coreOpts.length > 0

                const showCoreGate = isCore && !coreMenuExpanded
                const showCorePick = isCore && coreMenuExpanded
                const showTextComposer =
                  !isBranchPick &&
                  (!isCore || coreOpts.length === 0 || (!showCoreGate && !showCorePick))

                return (
                  <div key={f.id} className="admin-chatbot-preview__step admin-chatbot-preview__step--active">
                    <PreviewBotTurn logo={logo} name={name} promptText={promptText} />
                    <button
                      type="button"
                      className="admin-chatbot-preview__go-back"
                      onClick={previewGoBack}
                      disabled={previewStepIndex <= 0}
                    >
                      Go back
                    </button>
                    {showCoreGate ? (
                      <button
                        type="button"
                        className="admin-chatbot-preview__core-features-btn"
                        onClick={() => setCoreMenuExpanded(true)}
                      >
                        Core features
                      </button>
                    ) : null}
                    {showCorePick ? (
                      <div className="admin-chatbot-preview__core-options" role="group" aria-label="Core features">
                        {coreOpts.map((o) => (
                          <button
                            key={o.id ?? `${f.id}-${o.option_key}`}
                            type="button"
                            className="admin-chatbot-preview__core-opt"
                            onClick={() => {
                              setPreviewReplies((r) => [...r, String(o.label ?? '')])
                              setPreviewStepIndex((s) => s + 1)
                              setCoreMenuExpanded(false)
                            }}
                          >
                            {String(o.label ?? o.option_key ?? '')}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {isBranchPick ? (
                      <div className="admin-chatbot-preview__core-options" role="group" aria-label="Choices">
                        {coreOpts.map((o) => (
                          <button
                            key={o.id ?? `${f.id}-${o.option_key}`}
                            type="button"
                            className="admin-chatbot-preview__core-opt"
                            onClick={() => {
                              setPreviewReplies((r) => [...r, String(o.label ?? '')])
                              setPreviewStepIndex((s) => s + 1)
                            }}
                          >
                            {String(o.label ?? o.option_key ?? '')}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    {showTextComposer ? (
                      <div className="admin-chatbot-preview__composer-bar">
                        <form className="admin-chatbot-preview__composer" onSubmit={submitPreviewStep}>
                          <input
                            type="text"
                            className="admin-chatbot-preview__input"
                            placeholder="Your reply…"
                            value={previewDraft}
                            onChange={(e) => setPreviewDraft(e.target.value)}
                            autoComplete="off"
                            aria-label="Your reply"
                          />
                          <button type="submit" className="admin-chatbot-preview__send">
                            Send
                          </button>
                          {showEndChatSave ? (
                            <button
                              type="button"
                              className="admin-chatbot-preview__end-chat"
                              onClick={saveConversationEnd}
                              disabled={endChatSaving}
                            >
                              {endChatSaving ? 'Saving…' : 'End chat & save'}
                            </button>
                          ) : null}
                        </form>
                      </div>
                    ) : null}
                    {showTextComposer ? (
                      <p className="admin-chatbot-preview__wait-hint">
                        Send a reply to move to the next connected flow.
                      </p>
                    ) : null}
                  </div>
                )
              }
              return null
            })}
          </div>
        )}
      </div>
    </div>
  )
}
