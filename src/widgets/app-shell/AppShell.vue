<script setup lang="ts">
import {
  Bell,
  Calendar,
  ChevronDown,
  Home,
  LayoutGrid,
  LineChart,
  ListChecks,
  LogOut,
  MessageSquareText,
  MoreHorizontal,
  PanelLeft,
  Plus,
  Receipt,
  Search,
  Settings,
  Sparkles,
  SwitchCamera,
  Users,
  Waves,
  Sun,
  Moon,
} from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import {
  Kbd,
  LatencyBadge,
  Badge,
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/shared/ui'
import { useTheme } from '@/shared/lib/use-theme'
import { useAuth } from '@/entities/user'

interface Props {
  title: string
  rightRailTitle?: string
}
withDefaults(defineProps<Props>(), { rightRailTitle: 'Activity' })

const { theme, toggle } = useTheme()

// Sidebar collapsed state — ephemeral UI, shared across pages via useState so
// it survives route changes within the shell.
const sidebarCollapsed = useState('shell:sidebar-collapsed', () => false)
function toggleSidebar() {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

const router = useRouter()
const auth = useAuth()
const { email } = storeToRefs(auth)

// Display helpers for the account section. Falls back gracefully before the
// session resolves.
const accountEmail = computed(() => email.value ?? 'Signed in')
const accountInitials = computed(() => {
  const e = email.value
  if (!e) return 'AV'
  return e.slice(0, 2).toUpperCase()
})

// TODO(KAN-345): no billing API yet — treat every user as unsubscribed so the
// Subscribe/Upgrade entry point is always reachable. Wire to real plan state
// once the billing service exposes it on the session.
const isSubscribed = ref(false)

const signingOut = ref(false)
async function signOut() {
  if (signingOut.value) return
  signingOut.value = true
  try {
    await $fetch('/api/auth/sign-out', { method: 'POST' })
  } catch {
    // ignore — the endpoint clears cookies best-effort regardless
  } finally {
    auth.clear()
    // Hard navigation so all in-memory state is dropped and the guard
    // re-evaluates from the now-cleared cookies.
    window.location.href = '/sign-in'
  }
}

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/calls', icon: MessageSquareText, label: 'Calls', count: 14 },
  { to: '/transcripts', icon: ListChecks, label: 'Transcripts' },
  { to: '/studio', icon: Waves, label: 'Voice Studio' },
  { to: '/analytics', icon: LineChart, label: 'Analytics' },
  { to: '/queue', icon: LayoutGrid, label: 'Queue' },
]
const settingsItems = [
  { to: '/team', icon: Users, label: 'Team' },
  { to: '/billing', icon: Receipt, label: 'Billing' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]
const savedViews = [
  { color: 'var(--viz-3)', label: 'Renewals · Q4' },
  { color: 'var(--viz-4)', label: 'Needs review' },
  { color: 'var(--viz-7)', label: 'Customer success' },
]
</script>

<template>
  <div class="shell-app" :class="{ 'shell-collapsed': sidebarCollapsed }">
    <!-- SIDEBAR -->
    <aside class="shell-side">
      <div class="shell-workspace">
        <DropdownMenuRoot>
          <DropdownMenuTrigger as-child>
            <button class="shell-ws-btn" type="button" data-testid="ws-popover-trigger">
              <div class="shell-ws-mark"><span>N</span></div>
              <div class="shell-ws-meta">
                <span class="shell-ws-name">Northbeam</span>
                <span class="shell-ws-plan">Studio · 3 seats</span>
              </div>
              <ChevronDown :size="12" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" :side-offset="6" class="w-[208px]" data-testid="ws-popover-content">
            <DropdownMenuLabel>Workspace</DropdownMenuLabel>
            <DropdownMenuItem data-testid="ws-popover-switch" @select="router.push('/settings')">
              <SwitchCamera :size="14" />
              <span>Switch workspace</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem data-testid="ws-popover-create" @select="router.push('/settings')">
              <Plus :size="14" />
              <span>Create workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenuRoot>
      </div>

      <button class="shell-search" type="button">
        <span class="inline-flex"><Search :size="14" /></span>
        <span>Search</span>
        <span class="ml-auto flex gap-[3px]">
          <Kbd>⌘</Kbd><Kbd>K</Kbd>
        </span>
      </button>

      <nav class="shell-nav">
        <div class="shell-nav-group">
          <div class="shell-nav-label">Workspace</div>
          <NuxtLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            class="shell-nav-item"
            active-class="!bg-subtle !text-fg !font-medium"
            :data-active="$route.path === item.to"
          >
            <component :is="item.icon" :size="14" />
            <span>{{ item.label }}</span>
            <span v-if="item.count" class="shell-nav-count">{{ item.count }}</span>
          </NuxtLink>
        </div>

        <div class="shell-nav-group">
          <div class="shell-nav-label">Settings</div>
          <NuxtLink
            v-for="item in settingsItems"
            :key="item.to"
            :to="item.to"
            class="shell-nav-item"
            :data-active="$route.path === item.to"
          >
            <component :is="item.icon" :size="14" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </div>

        <div class="shell-nav-group">
          <div class="shell-nav-label">Saved views</div>
          <div v-for="v in savedViews" :key="v.label" class="shell-nav-item">
            <span class="shell-nav-bullet" :style="{ background: v.color }" />
            <span>{{ v.label }}</span>
          </div>
        </div>
      </nav>

      <div class="shell-side-foot">
        <div class="shell-usage">
          <div class="mb-[6px] flex justify-between">
            <span class="t-caps !m-0">This month</span>
            <span class="t-mono text-[10px] text-fg-muted">43 / 60 hr</span>
          </div>
          <div class="progress" style="height:3px">
            <div class="progress-fill" style="width:72%" />
          </div>
        </div>
        <div class="shell-account">
          <DropdownMenuRoot>
            <DropdownMenuTrigger as-child>
              <button type="button" class="shell-account-trigger" data-testid="account-popover-trigger">
                <span class="avatar avatar-sm" style="background: var(--viz-2); color: white">{{ accountInitials }}</span>
                <div class="flex min-w-0 flex-1 flex-col text-left">
                  <span class="text-[13px] font-medium truncate">Account</span>
                  <span class="text-[11px] text-fg-subtle truncate">{{ accountEmail }}</span>
                </div>
                <ChevronDown :size="12" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              side="top"
              :side-offset="8"
              class="w-[208px]"
              data-testid="account-popover-content"
            >
              <DropdownMenuLabel>{{ accountEmail }}</DropdownMenuLabel>
              <DropdownMenuItem data-testid="account-popover-settings" @select="router.push('/settings')">
                <Settings :size="14" />
                <span>Account settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                v-if="!isSubscribed"
                data-testid="account-popover-upgrade"
                @select="router.push('/billing')"
              >
                <Sparkles :size="14" />
                <span>Subscribe / Upgrade</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem tone="danger" data-testid="account-popover-signout" :disabled="signingOut" @select="signOut">
                <LogOut :size="14" />
                <span>{{ signingOut ? 'Signing out…' : 'Log out' }}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuRoot>
          <button
            type="button"
            class="btn-icon btn-icon-sm"
            :aria-label="`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`"
            @click="toggle"
          >
            <Sun v-if="theme === 'dark'" :size="14" />
            <Moon v-else :size="14" />
          </button>
        </div>
      </div>
    </aside>

    <!-- MAIN -->
    <div class="shell-main">
      <header class="shell-topbar">
        <div class="shell-topbar-left">
          <button
            type="button"
            class="btn-icon btn-icon-sm"
            :aria-label="sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
            :aria-pressed="sidebarCollapsed"
            @click="toggleSidebar"
          >
            <PanelLeft :size="14" />
          </button>
          <h1 class="shell-title">{{ title }}</h1>
        </div>
        <div class="shell-topbar-right">
          <slot name="top-right">
            <LatencyBadge :ms="148" />
            <Badge tone="accent" class="badge-mono">ATLAS·0·7</Badge>
            <button type="button" class="btn-icon" aria-label="Notifications">
              <Bell :size="14" />
            </button>
            <button type="button" class="btn btn-secondary btn-sm">
              <Calendar :size="12" /> Today
            </button>
            <button type="button" class="btn btn-primary btn-sm">
              <Plus :size="12" /> New call
            </button>
          </slot>
        </div>
      </header>

      <div :class="['shell-body', { 'no-rail': !$slots.rail }]">
        <main class="shell-content"><slot /></main>
        <aside v-if="$slots.rail" class="shell-rail">
          <div class="shell-rail-head">
            <span class="t-caps">{{ rightRailTitle }}</span>
            <button type="button" class="btn-icon btn-icon-sm" aria-label="Hide rail">
              <MoreHorizontal :size="12" />
            </button>
          </div>
          <div class="shell-rail-body">
            <slot name="rail" />
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
