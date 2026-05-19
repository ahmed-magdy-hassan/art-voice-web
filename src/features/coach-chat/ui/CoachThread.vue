<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import type { ChatMessage } from '@/shared/api/contracts/coach'
import { useCoachChat } from '../api/use-coach-chat'

const props = defineProps<{ threadId: string }>()

const { history, pending, error, send } = useCoachChat(props.threadId)
const inputText = ref('')
const threadEl = ref<HTMLElement | null>(null)

async function submit() {
  const msg = inputText.value.trim()
  if (!msg || pending.value) return
  inputText.value = ''
  await send(msg)
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    submit()
  }
}

watch(
  () => history.value.length,
  async () => {
    await nextTick()
    if (threadEl.value) {
      threadEl.value.scrollTop = threadEl.value.scrollHeight
    }
  },
)
</script>

<template>
  <div class="coach-thread">
    <div ref="threadEl" class="messages" role="log" aria-live="polite" aria-label="Coach conversation">
      <div v-if="history.length === 0" class="empty-state">
        <p>Ask your AI coach anything about your voice practice.</p>
        <ul class="suggestions">
          <li><button type="button" @click="inputText = 'How can I reduce filler words?'">How can I reduce filler words?</button></li>
          <li><button type="button" @click="inputText = 'What pace should I target?'">What pace should I target?</button></li>
          <li><button type="button" @click="inputText = 'Help me build a practice routine'">Help me build a practice routine</button></li>
        </ul>
      </div>

      <article
        v-for="(msg, i) in history"
        :key="i"
        class="message"
        :class="msg.role"
        :aria-label="`${msg.role === 'user' ? 'You' : 'Coach'}: ${msg.content}`"
      >
        <span class="avatar" aria-hidden="true">{{ msg.role === 'user' ? 'Y' : 'C' }}</span>
        <div class="bubble">{{ msg.content }}</div>
      </article>

      <div v-if="pending" class="message assistant" aria-label="Coach is typing">
        <span class="avatar" aria-hidden="true">C</span>
        <div class="bubble typing">
          <span /><span /><span />
        </div>
      </div>
    </div>

    <p v-if="error" class="error-banner" role="alert">{{ error }}</p>

    <form class="compose" @submit.prevent="submit">
      <textarea
        v-model="inputText"
        class="compose-input"
        rows="2"
        placeholder="Ask your coach…"
        :disabled="pending"
        @keydown="onKeydown"
      />
      <button type="submit" class="send-btn" :disabled="pending || !inputText.trim()">
        Send
      </button>
    </form>
  </div>
</template>

<style scoped>
.coach-thread {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
}
.messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  scroll-behavior: smooth;
}
.empty-state {
  color: #6b7280;
  font-size: 0.9375rem;
  text-align: center;
  margin-top: 2rem;
}
.suggestions {
  list-style: none;
  padding: 0;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}
.suggestions button {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 999px;
  padding: 0.375rem 0.875rem;
  font-size: 0.875rem;
  color: #374151;
  cursor: pointer;
}
.suggestions button:hover { background: #f3f4f6; }
.message {
  display: flex;
  gap: 0.625rem;
  align-items: flex-end;
}
.message.user { flex-direction: row-reverse; }
.avatar {
  width: 1.75rem;
  height: 1.75rem;
  border-radius: 50%;
  background: #e5e7eb;
  color: #374151;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.message.assistant .avatar { background: #1d4ed8; color: #fff; }
.bubble {
  max-width: 70%;
  padding: 0.625rem 0.875rem;
  border-radius: 1rem;
  font-size: 0.9375rem;
  line-height: 1.55;
  white-space: pre-wrap;
}
.message.user .bubble {
  background: #1d4ed8;
  color: #fff;
  border-bottom-right-radius: 0.25rem;
}
.message.assistant .bubble {
  background: #f3f4f6;
  color: #111827;
  border-bottom-left-radius: 0.25rem;
}
.typing {
  display: flex;
  gap: 0.25rem;
  align-items: center;
  padding: 0.75rem 1rem;
}
.typing span {
  display: block;
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  background: #9ca3af;
  animation: bounce 1.2s infinite;
}
.typing span:nth-child(2) { animation-delay: 0.2s; }
.typing span:nth-child(3) { animation-delay: 0.4s; }
@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-5px); }
}
.error-banner {
  font-size: 0.875rem;
  color: #991b1b;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 0.375rem;
  padding: 0.5rem 0.875rem;
  margin: 0 1rem;
}
.compose {
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-top: 1px solid #e5e7eb;
  background: #fff;
}
.compose-input {
  flex: 1;
  resize: none;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.9375rem;
  font-family: inherit;
  color: #111827;
  outline: none;
}
.compose-input:focus { border-color: #6366f1; }
.compose-input:disabled { background: #f9fafb; }
.send-btn {
  align-self: flex-end;
  background: #1d4ed8;
  color: #fff;
  border: 0;
  border-radius: 0.5rem;
  padding: 0.5rem 1.25rem;
  font-size: 0.9375rem;
  font-weight: 500;
  cursor: pointer;
}
.send-btn:disabled { opacity: 0.5; cursor: not-allowed; }
.send-btn:not(:disabled):hover { background: #1e40af; }
</style>
