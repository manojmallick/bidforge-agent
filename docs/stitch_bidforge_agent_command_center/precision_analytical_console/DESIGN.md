---
name: Precision Analytical Console
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#44474c'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#74777d'
  outline-variant: '#c4c6cd'
  surface-tint: '#4f6073'
  primary: '#041627'
  on-primary: '#ffffff'
  primary-container: '#1a2b3c'
  on-primary-container: '#8192a7'
  inverse-primary: '#b7c8de'
  secondary: '#006a6a'
  on-secondary: '#ffffff'
  secondary-container: '#90efef'
  on-secondary-container: '#006e6e'
  tertiary: '#221200'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e2400'
  on-tertiary-container: '#ca8100'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d2e4fb'
  primary-fixed-dim: '#b7c8de'
  on-primary-fixed: '#0b1d2d'
  on-primary-fixed-variant: '#38485a'
  secondary-fixed: '#93f2f2'
  secondary-fixed-dim: '#76d6d5'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f4f'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  display-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  mono-sm:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1440px
  sidebar-width: 240px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
---

## Brand & Style

The design system is engineered for the high-stakes environment of enterprise procurement and automated bidding. The brand personality is clinical, authoritative, and reliable, prioritizing cognitive efficiency over emotional flourish. The aesthetic follows a **Corporate / Modern** direction with a focus on high information density and structural clarity.

The interface serves professional procurement officers and data analysts who require a "heads-up display" for complex agent activities. Every visual element exists to support decision-making, utilizing a restrained palette and strict alignment to minimize visual noise. The experience should feel like a sophisticated instrument—precise, responsive, and sober.

## Colors

The color palette is functional rather than decorative, using color primarily to denote status and hierarchy.

- **Primary (#1A2B3C):** Used for deep-sky navy text, headers, and navigation backgrounds to establish a grounded, professional foundation.
- **Secondary (#008080):** A sophisticated teal reserved for primary actions, active states, and focus indicators.
- **Backgrounds:** Use a soft gray (#F3F4F6) for the main application canvas to provide contrast against pure white (#FFFFFF) content cards and table rows.
- **Status Tints:** 
  - **Amber (#F59E0B):** For non-blocking risks and warnings.
  - **Red (#DC2626):** For critical failures or high-risk bid deviations.
  - **Green (#10B981):** For successful submissions and validated data.

## Typography

This design system utilizes **Inter** for all UI elements to ensure maximum legibility at small sizes. A monospaced font (JetBrains Mono) is introduced sparingly for IDs, currency values, and timestamps to maintain vertical alignment in dense tables.

Scale is compact to allow for high information density. Headers use a semi-bold weight for clear sectioning without requiring excessive whitespace. Body text is predominantly 14px, dropping to 13px for secondary metadata or sidebar items. Labels use a slightly tighter letter spacing and uppercase styling for "all-caps" utility indicators.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. The sidebar remains at a fixed width of 240px, while the main content area stretches to a maximum of 1440px to prevent excessive line lengths on ultra-wide monitors.

A strict 4px/8px baseline grid governs all spacing.
- **Desktop:** Features a persistent left sidebar for global navigation. Content is grouped into logical modules using cards with 16px internal padding.
- **Mobile:** The sidebar collapses into a bottom navigation bar or a top-header "hamburger" menu. Content margins reduce to 16px.
- **Density:** Vertical spacing is minimized; table rows should target a 40px height to maximize the number of visible records on a single screen.

## Elevation & Depth

This design system uses **Low-contrast outlines** and subtle tonal layering rather than heavy shadows to denote depth.

- **Level 0 (Surface):** The background layer (#F3F4F6).
- **Level 1 (Card):** White surfaces (#FFFFFF) with a 1px solid border (#E5E7EB). No shadow is used for standard containers.
- **Level 2 (Overlay/Drawer):** Citation drawers and modals utilize a very soft, high-diffusion shadow (0px 10px 15px -3px rgba(0, 0, 0, 0.05)) and a 1px border to separate them from the underlying content.
- **Active State:** Selected items or focused inputs use the secondary teal (#008080) for a 1px or 2px border stroke to indicate focus without shifting layout.

## Shapes

The shape language is disciplined and geometric. A standard radius of **6px** is applied to all primary containers, buttons, and input fields. This "soft-square" approach maintains the professional, industrial feel of the tool while avoiding the aggressive sharpness of 0px corners.

- **Containers & Inputs:** 6px (Soft).
- **Status Badges/Chips:** 4px (to appear proportional at smaller scales).
- **Checkboxes:** 4px.

## Components

### Data Tables
Tables are the core component of the system. They must feature:
- 1px bottom borders for rows; no vertical borders.
- Hover states using a subtle gray (#F9FAFB).
- High-density row height (36px-40px).
- Sticky headers during scroll.

### Status Badges & Risk Chips
- **Status Badges:** Solid backgrounds with white text for high-level status (e.g., "Active", "Complete").
- **Risk Chips:** Light tinted backgrounds with dark text (e.g., Light Red background with Dark Red text) for granular risk indicators within tables.

### Progress Timelines
A vertical or horizontal "stepper" using thin 2px lines and 8px circular nodes. Completed steps use the teal accent; pending steps use a medium gray.

### Citation Drawers
Sliding panels that emerge from the right edge. They must have a distinct white background, 1px left border, and a header containing the source document name and a "Close" action.

### Buttons
- **Primary:** Solid Teal (#008080) with White text.
- **Secondary:** White background with a 1px gray border and Navy text.
- **Danger:** Ghost style (transparent background) with Red text for destructive actions.

### File Upload Zones
Dashed 1px border containers with a centered icon and "Drag and Drop" text, utilizing a light teal tint on drag-over states.