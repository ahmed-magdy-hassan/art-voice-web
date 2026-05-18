// UC-19.2 — sidebar module list per acceptance criteria.
// Each entry can be marked pro-only; the AppShell renders an upgrade badge
// and clicking such a link routes through /upgrade?from=<route>.

import {
  Activity,
  AudioLines,
  BarChart3,
  Bot,
  CreditCard,
  FileAudio,
  Globe2,
  Headphones,
  Home,
  LineChart,
  ListChecks,
  ListOrdered,
  MessageSquareText,
  PieChart,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Upload,
  User,
  Users,
  Waves,
  Webhook,
} from 'lucide-vue-next'

export interface NavItem {
  to: string
  icon: typeof Home
  label: string
  proOnly?: boolean
  count?: number
}

export interface NavGroup {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'Workspace',
    items: [
      { to: '/', icon: Home, label: 'Dashboard' },
      { to: '/analyses', icon: ListChecks, label: 'Analyses' },
      { to: '/upload', icon: Upload, label: 'Upload' },
      { to: '/calls', icon: Headphones, label: 'Calls' },
      { to: '/transcripts', icon: MessageSquareText, label: 'Transcripts' },
      { to: '/queue', icon: ListOrdered, label: 'Queue' },
      { to: '/live', icon: Activity, label: 'Live', proOnly: true },
      { to: '/profile', icon: User, label: 'Profile' },
    ],
  },
  {
    label: 'Train',
    items: [
      { to: '/training', icon: BarChart3, label: 'Training' },
      { to: '/exercises', icon: AudioLines, label: 'Exercises' },
      { to: '/coach', icon: Bot, label: 'Coach', proOnly: true },
      { to: '/reports', icon: LineChart, label: 'Reports' },
      { to: '/analytics', icon: PieChart, label: 'Analytics' },
    ],
  },
  {
    label: 'Voice',
    items: [
      { to: '/cloning', icon: Waves, label: 'Cloning', proOnly: true },
      { to: '/studio', icon: Sparkles, label: 'Studio' },
      { to: '/compare', icon: FileAudio, label: 'Compare' },
      { to: '/marketplace', icon: ShoppingBag, label: 'Marketplace' },
      { to: '/community', icon: Globe2, label: 'Community' },
    ],
  },
  {
    label: 'Account',
    items: [
      { to: '/team', icon: Users, label: 'Team' },
      { to: '/billing', icon: CreditCard, label: 'Billing' },
      { to: '/api', icon: Webhook, label: 'API' },
      { to: '/security', icon: ShieldCheck, label: 'Security' },
      { to: '/settings', icon: Settings, label: 'Settings' },
    ],
  },
]
