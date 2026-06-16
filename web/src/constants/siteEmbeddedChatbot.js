/**
 * Site visitor chatbot: single embedded flow (edit `siteEmbeddedChatbot.json`).
 * Backend reads the same file for `/api/public/custom-chatbot-submit` validation.
 */
import embedded from './siteEmbeddedChatbot.json'

export const SITE_EMBEDDED_CHATBOT_ID = embedded.id
export const SITE_EMBEDDED_CHATBOT = embedded
