import { apiFetch } from '@/shared/api/client'
import { ChatResponse, type ChatMessage } from '@/shared/api/contracts/coach'
import { ref } from 'vue'

export function useCoachChat(threadId: string) {
  const history = ref<ChatMessage[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)

  async function send(message: string): Promise<ChatMessage | null> {
    pending.value = true
    error.value = null
    try {
      const response = await apiFetch('/api/coach/chat' as `/api/${string}`, {
        method: 'POST',
        body: {
          thread_id: threadId,
          history: history.value,
          message,
        },
        schema: ChatResponse,
      })
      const userMsg: ChatMessage = { role: 'user', content: message }
      const assistantMsg: ChatMessage = { role: 'assistant', content: response.safety_flagged ? response.reply : response.reply }
      history.value = [...history.value, userMsg, assistantMsg]
      return assistantMsg
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to send message'
      return null
    } finally {
      pending.value = false
    }
  }

  function reset() {
    history.value = []
    error.value = null
  }

  return { history, pending, error, send, reset }
}
