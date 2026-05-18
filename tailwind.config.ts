import type { Config } from 'tailwindcss'

export default <Partial<Config>>{
  darkMode: ['class', '[data-theme="dark"]'],
  content: [
    './src/**/*.{vue,ts,js}',
    './src/app.vue',
    './src/error.vue',
  ],
  theme: {
    extend: {
      // ---------------------------------------------------------------
      // Brand-native tokens (Moss / Studio & Editorial).
      // Use these in new code: bg-canvas, text-fg, text-fg-muted, etc.
      // ---------------------------------------------------------------
      colors: {
        canvas: 'var(--canvas)',
        surface: 'var(--surface)',
        subtle: 'var(--subtle)',
        raised: 'var(--raised)',
        inset: 'var(--inset)',

        fg: {
          DEFAULT: 'var(--fg)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
          faint: 'var(--fg-faint)',
          'on-accent': 'var(--fg-on-accent)',
        },

        border: {
          DEFAULT: 'var(--border)',
          strong: 'var(--border-strong)',
          subtle: 'var(--border-subtle)',
        },

        accent: {
          DEFAULT: 'var(--accent)',
          hover: 'var(--accent-hover)',
          active: 'var(--accent-active)',
          subtle: 'var(--accent-subtle)',
          fg: 'var(--accent-fg)',
          border: 'var(--accent-border)',
          // shadcn-vue compatibility — `accent-foreground`
          foreground: 'var(--accent-foreground)',
        },

        success: {
          DEFAULT: 'var(--success)',
          subtle: 'var(--success-subtle)',
          border: 'var(--success-border)',
          fg: 'var(--success-fg)',
        },
        warning: {
          DEFAULT: 'var(--warning)',
          subtle: 'var(--warning-subtle)',
          border: 'var(--warning-border)',
          fg: 'var(--warning-fg)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          subtle: 'var(--danger-subtle)',
          border: 'var(--danger-border)',
          fg: 'var(--danger-fg)',
        },
        info: {
          DEFAULT: 'var(--info)',
          subtle: 'var(--info-subtle)',
          border: 'var(--info-border)',
          fg: 'var(--info-fg)',
        },

        viz: {
          1: 'var(--viz-1)',
          2: 'var(--viz-2)',
          3: 'var(--viz-3)',
          4: 'var(--viz-4)',
          5: 'var(--viz-5)',
          6: 'var(--viz-6)',
          7: 'var(--viz-7)',
          8: 'var(--viz-8)',
        },

        // ---------------------------------------------------------------
        // shadcn-vue semantic aliases (kept so existing primitives work).
        // These resolve to the Moss tokens via CSS variables.
        // ---------------------------------------------------------------
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        input: 'var(--input)',
        ring: 'var(--ring)',
      },

      fontFamily: {
        display: 'var(--font-display)',
        sans: 'var(--font-sans)',
        mono: 'var(--font-mono)',
      },

      borderRadius: {
        DEFAULT: 'var(--r-2)',
        none: '0',
        xs: 'var(--r-1)',
        sm: 'var(--r-2)',
        md: 'var(--r-3)',
        lg: 'var(--r-4)',
        xl: 'var(--r-5)',
        full: 'var(--r-full)',
      },

      boxShadow: {
        1: 'var(--shadow-1)',
        2: 'var(--shadow-2)',
        3: 'var(--shadow-3)',
        4: 'var(--shadow-4)',
        5: 'var(--shadow-5)',
      },

      transitionTimingFunction: {
        out: 'var(--e-out)',
        in: 'var(--e-in)',
        inout: 'var(--e-inout)',
      },
      transitionDuration: {
        instant: '80ms',
        fast: '140ms',
        base: '200ms',
        slow: '320ms',
      },
    },
  },
  plugins: [],
}
