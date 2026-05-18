<script setup lang="ts">
import { useTheme } from '@/shared/lib/use-theme'
import { useAuth } from '@/entities/user'
import { storeToRefs } from 'pinia'
import { Sun, Moon, ArrowRight, Check, Zap, Mic, Users, Play } from 'lucide-vue-next'

definePageMeta({ layout: 'guest', auth: 'public' })

const { theme, toggle } = useTheme()

// auth: 'public' skips the global guard's fetch, so ensure the session is
// resolved here to decide which CTAs to show.
const auth = useAuth()
const { isAuthenticated } = storeToRefs(auth)
if (!auth.initialised) {
  await auth.fetch()
}
const scrolled = ref(false)

onMounted(() => {
  const handler = () => { scrolled.value = window.scrollY > 8 }
  window.addEventListener('scroll', handler, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', handler))
})

// Animated hero demo — transcript phases
const phase = ref(0)
const TOTAL_PHASES = 5
const PHASE_MS = 3500

onMounted(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) { phase.value = TOTAL_PHASES - 1; return }
  const id = setInterval(() => { phase.value = (phase.value + 1) % TOTAL_PHASES }, PHASE_MS)
  onUnmounted(() => clearInterval(id))
})

// Typewriter composable
function useTyper(getText: () => string, active: () => boolean) {
  const n = ref(0)
  watch(active, (isActive) => {
    const text = getText()
    if (!isActive) { n.value = text.length; return }
    n.value = 0
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { n.value = text.length; return }
    const dur = 2200
    const step = Math.max(15, dur / text.length)
    let i = 0
    const id = setInterval(() => {
      i++; n.value = i
      if (i >= text.length) clearInterval(id)
    }, step)
  }, { immediate: true })
  return n
}

const lines = [
  { speaker: 'Maya', color: 'var(--viz-2)', initials: 'MA', time: '00:01:34', text: 'Eighty-four percent if we get to them inside the thirty-day window. That\'s higher than the cross-cohort average.' },
  { speaker: 'Hugo', color: 'var(--viz-4)', initials: 'HG', time: '00:01:54', text: 'Eighty-four. That\'s a meaningful number — what\'s the rollover assumption?' },
]

const line0Visible = computed(() => phase.value >= 1)
const line1Visible = computed(() => phase.value >= 3)
const coachVisible = computed(() => phase.value >= 4)
const line0Typing = computed(() => phase.value === 1 || phase.value === 2)
const line1Typing = computed(() => phase.value === 3)

const line0 = lines[0]!
const line1 = lines[1]!

const n0 = useTyper(() => line0.text, () => line0Typing.value)
const n1 = useTyper(() => line1.text, () => line1Typing.value)

const displayText0 = computed(() => line0.text.slice(0, n0.value))
const displayText1 = computed(() => line1.text.slice(0, n1.value))
const cursor0 = computed(() => line0Typing.value && n0.value < line0.text.length)
const cursor1 = computed(() => line1Typing.value && n1.value < line1.text.length)

const plans = [
  {
    name: 'Starter',
    tagline: 'For individuals exploring voice intelligence.',
    price: '$0',
    bill: 'Free forever',
    featured: false,
    tag: null,
    features: ['5 hours transcription / month', '3 live sessions', 'Basic coach insights', '7-day history'],
  },
  {
    name: 'Studio',
    tagline: 'For professionals who live on calls.',
    price: '$49',
    bill: 'per seat / month, billed annually',
    featured: true,
    tag: 'Most popular',
    features: ['Unlimited transcription', 'Unlimited live sessions', 'Full AI coach suite', 'Voice cloning (1 voice)', '90-day history', 'API access'],
  },
  {
    name: 'Pro',
    tagline: 'For teams that need scale and control.',
    price: '$129',
    bill: 'per seat / month, billed annually',
    featured: false,
    tag: null,
    features: ['Everything in Studio', 'Unlimited voice clones', 'Shared team workspace', 'SSO + SCIM provisioning', 'Custom data retention', 'Dedicated support'],
  },
]
</script>

<template>
  <div class="hp-root hp-paper" :data-theme="theme">
    <!-- NAV -->
    <nav :class="['hp-nav', { scrolled }]" aria-label="Main navigation">
      <div class="hp-nav-inner">
        <a href="/" class="hp-wordmark" aria-label="Art-Voice home">
          <span class="hp-mark">A</span>
          <span class="hp-brandname">Art<em>-</em>Voice</span>
        </a>

        <div class="hp-nav-center" role="list">
          <a href="#product" role="listitem">Product</a>
          <a href="#pricing" role="listitem">Pricing</a>
          <a href="#trust" role="listitem">Privacy</a>
          <a href="#" role="listitem">Docs</a>
        </div>

        <div class="hp-nav-right">
          <a v-if="!isAuthenticated" href="/sign-in" class="signin">Sign in</a>
          <button type="button" class="hp-theme-btn" :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`" @click="toggle">
            <Sun v-if="theme === 'dark'" :size="14" />
            <Moon v-else :size="14" />
          </button>
          <a
            :href="isAuthenticated ? '/dashboard' : '/sign-up'"
            class="hp-cta-primary"
            style="height:36px;font-size:14px;padding:0 16px;text-decoration:none"
          >
            {{ isAuthenticated ? 'Go to dashboard' : 'Get started free' }}
          </a>
        </div>
      </div>
    </nav>

    <!-- HERO -->
    <section class="hp-hero">
      <div class="hp-container">
        <div class="hp-hero-eyebrow">
          <span class="pill"><span class="dot" />&nbsp;New</span>
          Voice cloning with consent-first design
        </div>

        <h1>
          A studio for your<br />
          <em>working voice.</em>
        </h1>

        <p class="hp-hero-sub">
          Live transcription, real-time coaching, and consent-first voice cloning.
          Built for sales, CX, and ops teams that spend their days on the phone.
        </p>

        <div class="hp-hero-ctas">
          <a
            :href="isAuthenticated ? '/dashboard' : '/sign-up'"
            class="hp-cta-primary"
            style="text-decoration:none"
          >
            {{ isAuthenticated ? 'Go to dashboard' : 'Start free' }} <ArrowRight :size="14" />
          </a>
          <a href="#product" class="hp-cta-secondary" style="text-decoration:none">
            <Play :size="13" /> See it live
          </a>
        </div>

        <div class="hp-hero-meta">
          <span>No credit card required</span>
          <span class="sep" />
          <span>SOC 2 Type II</span>
          <span class="sep" />
          <span>GDPR compliant</span>
          <span class="sep" />
          <span>Consent-first by design</span>
        </div>

        <!-- Animated product preview -->
        <div class="hp-demo" id="product">
          <div class="hp-demo-chrome">
            <div class="dots">
              <span /><span /><span />
            </div>
            <span class="url">app.art-voice.io · Live call</span>
          </div>

          <div class="hp-demo-body">
            <!-- Main transcript panel -->
            <div class="hp-demo-main">
              <div class="hp-demo-header">
                <div>
                  <div class="hp-demo-title">
                    Renewal call · Northbeam
                    <span class="hp-demo-title-meta">00:02:11</span>
                  </div>
                </div>
                <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
                  <span class="status-pill live">
                    <span class="dot" /> Live
                  </span>
                  <span class="latency-badge good">
                    <Zap :size="9" /> 94ms
                  </span>
                </div>
              </div>

              <!-- Waveform -->
              <div class="hp-demo-wave">
                <svg width="100%" height="56" viewBox="0 0 600 56" preserveAspectRatio="none" aria-hidden="true">
                  <polyline
                    points="0,28 12,14 24,38 36,8 48,44 60,20 72,36 84,10 96,42 108,18 120,34 132,6 144,46 156,22 168,30 180,12 192,40 204,24 216,32 228,16 240,44 252,20 264,36 276,10 288,48 300,18 312,34 324,8 336,44 348,22 360,28 372,14 384,40 396,18 408,36 420,12 432,46 444,24 456,32 468,16 480,44 492,20 504,38 516,10 528,42 540,22 552,28 564,18 576,34 588,14 600,28"
                    fill="none"
                    stroke="var(--accent)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>

              <!-- Transcript lines -->
              <div class="hp-demo-transcript" role="log" aria-live="polite" aria-label="Live transcript">
                <div :class="['hp-tx-line', { visible: line0Visible }]">
                  <span class="hp-tx-avatar" :style="{ background: line0.color }">{{ line0.initials }}</span>
                  <div class="hp-tx-body">
                    <div class="hp-tx-meta">
                      <span class="hp-tx-name">{{ line0.speaker }}</span>
                      <span class="hp-tx-time">{{ line0.time }}</span>
                    </div>
                    <p class="hp-tx-text">
                      {{ displayText0 }}<span v-if="cursor0" class="hp-tx-cursor" aria-hidden="true" />
                    </p>
                  </div>
                </div>

                <div :class="['hp-tx-line', { visible: line1Visible }]">
                  <span class="hp-tx-avatar" :style="{ background: line1.color }">{{ line1.initials }}</span>
                  <div class="hp-tx-body">
                    <div class="hp-tx-meta">
                      <span class="hp-tx-name">{{ line1.speaker }}</span>
                      <span class="hp-tx-time">{{ line1.time }}</span>
                    </div>
                    <p class="hp-tx-text">
                      {{ displayText1 }}<span v-if="cursor1" class="hp-tx-cursor" aria-hidden="true" />
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Coach rail -->
            <div class="hp-demo-rail">
              <div class="hp-rail-eyebrow">AI Coach</div>
              <div :class="['hp-coach-card', { visible: coachVisible }]" role="status">
                <div class="hp-coach-card-head">
                  <span class="hp-coach-card-kind">Pace</span>
                  <span class="hp-coach-card-time">00:01:38</span>
                </div>
                <div class="hp-coach-card-title">Slow down slightly</div>
                <div class="hp-coach-card-body">You're speaking at 187 wpm — 15% above your target. A brief pause here lets the metric land.</div>
              </div>
              <div :class="['hp-coach-card', { visible: coachVisible }]" role="status" style="transition-delay:120ms">
                <div class="hp-coach-card-head">
                  <span class="hp-coach-card-kind">Clarity</span>
                  <span class="hp-coach-card-time">00:01:42</span>
                </div>
                <div class="hp-coach-card-title">Strong framing</div>
                <div class="hp-coach-card-body">Leading with the number first is effective. Confidence score 94%.</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- TRUST STRIP -->
    <div class="hp-trust" id="trust">
      <div class="hp-container">
        <p class="hp-trust-label">Trusted by teams at</p>
        <div class="hp-trust-row" aria-label="Customer logos">
          <span class="hp-wm-northbeam">NORTHBEAM</span>
          <span class="hp-wm-lumen">Lumen</span>
          <span class="hp-wm-storyfield">Storyfield</span>
          <span class="hp-wm-halftone">HALFTONE</span>
          <span class="hp-wm-veil">Veil</span>
          <span class="hp-wm-field">FIELD</span>
        </div>
      </div>
    </div>

    <!-- THREE PILLARS -->
    <section class="hp-section">
      <div class="hp-container">
        <div class="hp-section-head">
          <div class="hp-section-eyebrow">Product</div>
          <h2>Three movements,<br /><em>one instrument.</em></h2>
          <p class="hp-section-sub">
            From the moment a call starts to the moment a voice clone is published, Art-Voice handles the whole chain — with your consent at every step.
          </p>
        </div>

        <div class="hp-pillars">
          <!-- Pillar 1: Transcription -->
          <div class="hp-pillar">
            <div class="hp-pillar-num">01</div>
            <div class="hp-pillar-title"><em>Live</em> transcription</div>
            <p class="hp-pillar-body">
              Word-by-word captions as the call happens. Speaker-separated, timestamped, confidence-scored. Latency under 200ms.
            </p>
            <div class="hp-pillar-visual" aria-hidden="true">
              <div class="hp-mini-tx">
                <div class="hp-mini-tx-line">
                  <span class="hp-mini-tx-line av" style="background:var(--viz-2)">MA</span>
                  <span class="hp-mini-tx-line txt" style="font-size:12px">Eighty-four percent retention if we—</span>
                </div>
                <div class="hp-mini-tx-line">
                  <span class="hp-mini-tx-line av" style="background:var(--viz-4)">HG</span>
                  <span class="hp-mini-tx-line txt" style="font-size:12px">That's above the cohort average.</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Pillar 2: Coaching -->
          <div class="hp-pillar">
            <div class="hp-pillar-num">02</div>
            <div class="hp-pillar-title">Real-time <em>coaching</em></div>
            <p class="hp-pillar-body">
              The AI coach reads pace, clarity, and sentiment in real time and surfaces nudges — never interrupting, always useful.
            </p>
            <div class="hp-pillar-visual" aria-hidden="true">
              <div class="hp-mini-coach">
                <div class="hp-mini-coach-kind">
                  <Mic :size="9" /> Pace
                </div>
                <div class="hp-mini-coach-title">Slow down slightly</div>
                <div class="hp-mini-coach-body">187 wpm — 15% above target. Let the number land.</div>
              </div>
            </div>
          </div>

          <!-- Pillar 3: Voice cloning -->
          <div class="hp-pillar">
            <div class="hp-pillar-num">03</div>
            <div class="hp-pillar-title">Consent-first <em>cloning</em></div>
            <p class="hp-pillar-body">
              Clone a voice only after explicit, recorded consent. Every clone ships with an immutable consent receipt. Revocable at any time.
            </p>
            <div class="hp-pillar-visual" aria-hidden="true">
              <div class="hp-mini-clone">
                <div class="hp-mini-clone-row">
                  <span style="color:var(--fg-muted)">Pitch</span>
                  <div class="hp-mini-clone-bar"><div class="fill" style="width:68%" /></div>
                  <span style="color:var(--fg-subtle)">68%</span>
                </div>
                <div class="hp-mini-clone-row">
                  <span style="color:var(--fg-muted)">Timbre</span>
                  <div class="hp-mini-clone-bar"><div class="fill" style="width:82%" /></div>
                  <span style="color:var(--fg-subtle)">82%</span>
                </div>
                <div class="hp-mini-clone-row">
                  <span style="color:var(--fg-muted)">Rhythm</span>
                  <div class="hp-mini-clone-bar"><div class="fill" style="width:91%" /></div>
                  <span style="color:var(--fg-subtle)">91%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- DEEP DIVE: Live call -->
    <section class="hp-section">
      <div class="hp-container">
        <div class="hp-feature">
          <div>
            <div class="hp-section-eyebrow">Live call</div>
            <h2>Calm under <em>real-time</em> motion.</h2>
            <p class="hp-section-sub">
              The live call view is designed for focus. Transcript scrolls. Coach insights appear in the right rail. Nothing blinks for sport.
            </p>
            <div class="hp-feature-list">
              <div class="hp-feature-item">
                <div class="hp-feature-item-icon"><Zap :size="13" /></div>
                <div class="hp-feature-item-text">
                  <strong>Sub-200ms latency</strong>
                  <small>Powered by ATLAS·0·7, our streaming inference model.</small>
                </div>
              </div>
              <div class="hp-feature-item">
                <div class="hp-feature-item-icon"><Users :size="13" /></div>
                <div class="hp-feature-item-text">
                  <strong>Speaker diarisation</strong>
                  <small>Automatic separation of up to 8 speakers per call.</small>
                </div>
              </div>
              <div class="hp-feature-item">
                <div class="hp-feature-item-icon"><Mic :size="13" /></div>
                <div class="hp-feature-item-text">
                  <strong>Live coach rail</strong>
                  <small>Pace, clarity, sentiment, and energy — scored continuously.</small>
                </div>
              </div>
            </div>
          </div>

          <div class="hp-feature-image">
            <div class="hp-mockdash">
              <div class="hp-mockdash-bar"><div class="dots"><span /><span /><span /></div></div>
              <div style="padding:20px 24px">
                <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
                  <span class="status-pill live"><span class="dot" /> Live · 00:04:22</span>
                  <span class="latency-badge good"><Zap :size="9" /> 94ms</span>
                </div>
                <svg width="100%" height="40" viewBox="0 0 400 40" preserveAspectRatio="none" aria-hidden="true" style="display:block;margin-bottom:16px">
                  <polyline points="0,20 16,8 32,30 48,4 64,34 80,12 96,26 112,6 128,32 144,14 160,24 176,4 192,36 208,16 224,22 240,8 256,30 272,18 288,24 304,10 320,34 336,14 352,20 368,8 384,28 400,20" fill="none" stroke="var(--accent)" stroke-width="1.5" stroke-linecap="round" />
                </svg>
                <div style="display:flex;flex-direction:column;gap:12px">
                  <div class="hp-tx-line visible" style="opacity:1;transform:none">
                    <span class="hp-tx-avatar" style="background:var(--viz-2)">MA</span>
                    <div class="hp-tx-body">
                      <div class="hp-tx-meta"><span class="hp-tx-name">Maya</span><span class="hp-tx-time">00:04:10</span></div>
                      <p class="hp-tx-text" style="font-size:14px">The renewal window opens next Tuesday — shall we lock in the terms now?</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ETHICS / EDITORIAL -->
    <section class="hp-section hp-editorial" id="trust">
      <div class="hp-container">
        <div class="hp-section-head">
          <div class="hp-section-eyebrow">Privacy</div>
          <h2>Consent is not a<br /><em>checkbox.</em></h2>
          <p class="hp-section-sub">
            Voice is personal. We designed Art-Voice so that consent is impossible to skip, always revocable, and permanently auditable.
          </p>
        </div>

        <blockquote class="hp-pullquote">
          "Your voice data belongs to <em>you</em> — we are the custodian, not the owner."
          <footer class="hp-pullquote-attrib">Art-Voice Privacy Principles, §1</footer>
        </blockquote>

        <div class="hp-consent-bullets">
          <div class="hp-consent-bullet">
            <h4>Explicit consent gates</h4>
            <p>Voice cloning requires a recorded verbal attestation and a typed signature. No consent, no clone — regardless of account tier.</p>
          </div>
          <div class="hp-consent-bullet">
            <h4>Immutable consent receipts</h4>
            <p>Every consent event is timestamped and hash-anchored. You can export your full consent history at any time.</p>
          </div>
          <div class="hp-consent-bullet">
            <h4>One-click revocation</h4>
            <p>Revoking consent deletes the clone, all derived samples, and all share links — permanently, within 24 hours.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- PRICING -->
    <section class="hp-section" id="pricing">
      <div class="hp-container">
        <div class="hp-section-head">
          <div class="hp-section-eyebrow">Pricing</div>
          <h2>Honest pricing,<br /><em>no surprises.</em></h2>
          <p class="hp-section-sub">
            All plans include unlimited workspaces, SOC 2 Type II coverage, and GDPR compliance tooling. Scale seats as your team grows.
          </p>
        </div>

        <div class="hp-pricing-grid">
          <div v-for="plan in plans" :key="plan.name" :class="['hp-plan', { featured: plan.featured }]">
            <span v-if="plan.tag" class="hp-plan-tag">{{ plan.tag }}</span>
            <div class="hp-plan-name"><em>{{ plan.name }}</em></div>
            <div class="hp-plan-tagline">{{ plan.tagline }}</div>
            <div class="hp-plan-price">
              <span class="hp-plan-price-amount">{{ plan.price }}</span>
              <span class="hp-plan-price-unit">/ mo</span>
            </div>
            <div class="hp-plan-bill">{{ plan.bill }}</div>
            <div class="hp-plan-divider" />
            <ul class="hp-plan-features">
              <li v-for="feat in plan.features" :key="feat">
                <Check :size="13" class="check" />
                {{ feat }}
              </li>
            </ul>
            <a
              :href="plan.featured ? '/sign-up' : '/sign-up'"
              class="hp-plan-cta"
              style="text-decoration:none"
            >
              {{ plan.featured ? 'Start with Studio' : plan.price === '$0' ? 'Get started free' : 'Contact sales' }}
              <ArrowRight :size="13" />
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- FINAL CTA -->
    <section class="hp-final">
      <div class="hp-container">
        <h2>Your voice,<br /><em>at its best.</em></h2>
        <p class="hp-final-sub">
          Join teams using Art-Voice to close more deals, coach more effectively, and understand every conversation at scale.
        </p>
        <div class="hp-final-ctas">
          <a
            :href="isAuthenticated ? '/dashboard' : '/sign-up'"
            class="hp-cta-primary"
            style="text-decoration:none"
          >
            {{ isAuthenticated ? 'Go to dashboard' : 'Start free' }} <ArrowRight :size="14" />
          </a>
          <a
            v-if="!isAuthenticated"
            href="/sign-in"
            class="hp-cta-secondary"
            style="text-decoration:none"
          >Sign in</a>
        </div>
      </div>
    </section>

    <!-- FOOTER -->
    <footer class="hp-footer">
      <div class="hp-container">
        <div class="hp-footer-grid">
          <div class="hp-footer-brand">
            <a href="/" class="hp-wordmark" style="text-decoration:none">
              <span class="hp-mark">A</span>
              <span class="hp-brandname">Art<em>-</em>Voice</span>
            </a>
            <p class="hp-footer-tagline">A studio for your working voice. Live transcription, coaching, and consent-first cloning.</p>
          </div>
          <div class="hp-footer-col">
            <h5>Product</h5>
            <ul>
              <li><a href="#">Transcription</a></li>
              <li><a href="#">AI Coach</a></li>
              <li><a href="#">Voice Cloning</a></li>
              <li><a href="#">Analytics</a></li>
            </ul>
          </div>
          <div class="hp-footer-col">
            <h5>Company</h5>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Blog</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press</a></li>
            </ul>
          </div>
          <div class="hp-footer-col">
            <h5>Legal</h5>
            <ul>
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Consent policy</a></li>
              <li><a href="#">Security</a></li>
            </ul>
          </div>
          <div class="hp-footer-col">
            <h5>Developers</h5>
            <ul>
              <li><a href="#">API docs</a></li>
              <li><a href="#">Status</a></li>
              <li><a href="#">Changelog</a></li>
            </ul>
          </div>
        </div>
        <div class="hp-footer-bot">
          <span>© {{ new Date().getFullYear() }} Art-Voice, Inc.</span>
          <span>SOC 2 Type II · GDPR · CCPA</span>
        </div>
      </div>
    </footer>
  </div>
</template>
