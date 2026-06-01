# Design System Inspired by Muonnha

## 1. Visual Theme & Atmosphere

Muonnha embodies a clean, minimal, and security-focused design aesthetic that prioritizes clarity and trust. The interface features a spacious, light background with deliberate use of dark typography and strategic blue accents to guide user attention. The design conveys professionalism and reliability through restrained color choices, generous whitespace, and straightforward messaging. The overall impression is one of transparency and protection—a reassuring presence during security verification moments. The aesthetic reflects modern web standards while maintaining timeless simplicity.

**Key Characteristics**

- Clean, light-dominant color scheme with abundant whitespace
- Security-oriented messaging hierarchy
- Minimal interactive elements with strong affordance
- System typography for approachability and clarity
- High contrast for accessibility and readability
- Calm, neutral atmosphere with blue trust indicators

## 2. Color Palette & Roles

### Primary

- **Primary Action Blue** (`#0000EE`): Used for interactive links and call-to-action elements; signals user interaction and trust in security context

### Neutral Scale

- **Text Primary** (`#313131`): Primary body text and heading content; represents the dominant dark color used throughout 56% of the interface
- **Text Dark** (`#000000`): High-contrast text elements; used sparingly for emphasis
- **Neutral Border** (`#D9D9D9`): Subtle dividers and borders; provides visual separation without disruption

### Surface & Borders

- **Background** (`#FFFFFF`): Main page background; creates light, clean canvas
- **Divider** (`#D9D9D9`): Horizontal rule separating content sections

## 3. Typography Rules

### Font Family

- **Primary**: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif` — modern system stack for performance and familiarity
- **Secondary**: `Arial, sans-serif` — fallback for form inputs and system-level elements
- **Code**: `"Courier New", monospace` — for technical identifiers and ray IDs

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|-------------|----------------|-------|
| Display/H1 | system-ui | 40px | 600 | 50px | normal | Page title; "muonnha.com.vn" |
| Heading/H2 | system-ui | 24px | 600 | 30px | normal | Section headers; "Performing security verification" |
| Body | system-ui | 16px | 400 | 24px | normal | Main content paragraphs and descriptions |
| Caption/Small | system-ui | 12px | 400 | 18px | normal | Metadata, secondary info, footer text |
| Input | Arial | 13.33px | 400 | normal | normal | Form inputs and text fields |
| Code | monospace | 12px | 400 | 18px | normal | Ray ID and technical identifiers |

### Principles

- Hierarchy driven by size and weight rather than color variation
- Consistent line-height ratios maintain visual rhythm (1.25x and 1.5x multipliers)
- System fonts prioritize performance and platform consistency
- Generous line heights improve readability in security-critical messaging
- Minimal font weights (400 and 600) reduce cognitive load

## 4. Component Stylings

### Buttons

**Primary Button**
- `background-color: #0000EE`
- `color: #FFFFFF`
- `font-family: system-ui`
- `font-size: 16px`
- `font-weight: 600`
- `padding: 12px 32px`
- `border-radius: 4px`
- `border: none`
- `line-height: 24px`
- `cursor: pointer`
- Hover: `background-color: #0000CC`
- Active: `background-color: #0000AA`
- Disabled: `background-color: #CCCCCC; color: #666666`

**Ghost Button**
- `background-color: transparent`
- `color: #0000EE`
- `font-family: system-ui`
- `font-size: 16px`
- `font-weight: 400`
- `padding: 12px 16px`
- `border-radius: 0px`
- `border: none`
- `line-height: 24px`
- `cursor: pointer`
- Hover: `color: #0000CC`
- Active: `color: #0000AA`

### Links

**Default Link**
- `background-color: transparent`
- `color: #0000EE`
- `font-family: system-ui`
- `font-size: 12px`
- `font-weight: 400`
- `padding: 0px`
- `border: none`
- `border-radius: 0px`
- `text-decoration: underline`
- `line-height: 18px`
- `cursor: pointer`
- `box-shadow: none`
- Hover: `color: #0000CC; text-decoration-thickness: 2px`
- Active: `color: #0000AA`
- Visited: `color: #551A8B`

### Cards & Containers

**Main Content Card**
- `background-color: #FFFFFF`
- `border: 1px solid #D9D9D9`
- `border-radius: 8px`
- `padding: 32px`
- `box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1)`
- `margin: 0px auto`

**Section Container**
- `background-color: #FFFFFF`
- `padding: 32px`
- `margin-bottom: 16px`
- `border: none`
- `border-radius: 0px`

### Inputs & Forms

**Text Input**
- `background-color: #FFFFFF`
- `color: #313131`
- `font-family: Arial, sans-serif`
- `font-size: 13.33px`
- `font-weight: 400`
- `padding: 8px 12px`
- `border: 1px solid #D9D9D9`
- `border-radius: 4px`
- `line-height: normal`
- Focus: `border-color: #0000EE; outline: 2px solid rgba(0, 0, 238, 0.2)`
- Disabled: `background-color: #F5F5F5; color: #999999`

### Navigation

**Footer Navigation Links**
- `background-color: transparent`
- `color: #0000EE`
- `font-family: system-ui`
- `font-size: 12px`
- `font-weight: 400`
- `padding: 0px 8px`
- `border: none`
- `line-height: 18px`
- `display: inline-block`
- Separator: `color: #313131; margin: 0px 4px`
- Hover: `text-decoration: underline`

### Loading Indicator

**Spinner**
- `color: #313131`
- `width: 40px`
- `height: 40px`
- `animation: spin 1s linear infinite`
- `border: 4px solid #D9D9D9`
- `border-top: 4px solid #313131`
- `border-radius: 50%`

## 5. Layout Principles

### Spacing System

Base unit: **8px**

Scale:
- **8px**: Tight spacing between related elements, component gaps
- **16px**: Standard spacing between sections and block elements
- **32px**: Generous padding for main containers and card interiors
- **128px**: Large margins for page-level spacing and hero sections

Usage:
- Gap between stacked elements: `8px` or `16px`
- Padding inside cards: `32px`
- Margin between sections: `16px` to `32px`
- Outer margins from viewport: `32px` minimum

### Grid & Container

- **Max-width**: 1200px for main content area (inferred from modern standards)
- **Container**: Centered with auto left/right margins
- **Columns**: Single-column layout on mobile, supporting readability of security messaging
- **Gutter**: 16px between logical sections

### Whitespace Philosophy

Generous, purposeful whitespace dominates the design. Space is used to create visual hierarchy and reduce cognitive load during security verification. Content is centered with significant breathing room, making the interface feel trustworthy and unhurried. Whitespace emphasizes each content block independently.

### Border Radius Scale

- **0px**: Links, text elements, full-width containers
- **4px**: Input fields, compact buttons
- **8px**: Card containers, elevated containers
- **50%**: Circular elements (loading spinners, avatars)

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat | `box-shadow: none` | Text, links, backgrounds |
| Raised | `box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1)` | Cards, containers, modest elevation |
| Elevated | `box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15)` | Modals, floating elements, focus states |
| Deep | `box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.2)` | Overlays, high-priority interactions |

**Shadow Philosophy**

Shadows are used sparingly to maintain the minimal aesthetic. Elevation is conveyed primarily through spatial arrangement and whitespace rather than dramatic shadow effects. Where shadows appear, they are subtle and serve functional purposes—clarifying interactive affordance or separating layered content. The overall approach prioritizes flatness and clarity over depth perception.

## 7. Do's and Don'ts

### Do

- Use the system font stack for performance and consistency across platforms
- Maintain generous padding (32px) in card and container elements for breathing room
- Apply the blue accent (`#0000EE`) exclusively to interactive elements (links, buttons, CTAs)
- Use `#313131` for all body text to ensure strong contrast and readability
- Keep line heights at 1.5x or greater for body text to support accessibility
- Use 8px or 16px gaps consistently between related elements
- Leverage whitespace to create visual hierarchy and reduce cognitive load
- Test link underlines for clarity and accessibility compliance
- Employ the monospace font strictly for technical identifiers and code values
- Support focus states visually for all interactive elements using outline or border

### Don't

- Don't use colors outside the defined palette; avoid custom grays or accent colors
- Don't mix font families within a single logical component
- Don't reduce padding below 12px in interactive buttons or form fields
- Don't apply heavy shadows (box-shadow > 0px 4px 12px) to routine components
- Don't use `#000000` for primary text; reserve it for high-contrast accents only
- Don't create line heights below 18px for body text; maintain readability
- Don't nest interactive elements without clear visual separation
- Don't use border-radius greater than 8px except for fully circular elements
- Don't apply color to plain text links; use underline and blue color alone for affordance
- Don't reduce font sizes below 12px for caption text; maintain usability

## 8. Responsive Behavior

### Breakpoints

| Breakpoint | Width | Key Changes |
|------------|-------|-------------|
| Mobile | 320px–639px | Single-column layout, 16px side padding, stacked sections, 40px H1 remains, reduced max-width to 100% |
| Tablet | 640px–1023px | Single-column with 32px padding, 24px H2, slightly increased spacing |
| Desktop | 1024px+ | Centered container max-width 1200px, full typography scale, optimal spacing ratios |

### Touch Targets

- Minimum interactive element size: `44px × 44px` (buttons, links)
- Link padding: `8px` minimum for comfortable mobile tapping
- Button padding: `12px 32px` to exceed touch target minimum
- Form input height: `40px` minimum (including padding and border)
- Spacing between clickable elements: `8px` minimum

### Collapsing Strategy

- **Mobile**: Full-width containers with 16px side margins; stack all sections vertically; reduce margins between sections to 16px
- **Tablet**: Introduce subtle centering; maintain single column; increase side padding to 32px
- **Desktop**: Center content in max-width container; apply full typography and spacing scales; introduce subtle horizontal spacing if multi-column is needed

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA**: Primary Action Blue (`#0000EE`)
- **Text (Primary)**: Text Primary (`#313131`)
- **Text (Emphasis)**: Text Dark (`#000000`)
- **Borders & Dividers**: Neutral Border (`#D9D9D9`)
- **Background**: White (`#FFFFFF`)
- **Links**: Primary Action Blue (`#0000EE`)

### Iteration Guide

1. **Color Constraint**: Use only the five core colors (`#0000EE`, `#313131`, `#000000`, `#D9D9D9`, `#FFFFFF`). Blue is reserved for interactive elements; all other blues are forbidden.

2. **Typography Foundation**: Default to `system-ui` font stack. Use only two weights: `400` (regular) and `600` (bold). Match sizes and line heights exactly to the hierarchy table; infer intermediate sizes by the 1.5x scale.

3. **Spacing Discipline**: Base all spacing on 8px units. Primary gaps are 8px, 16px, and 32px; use 128px only for major page margins. Never introduce custom spacing values outside this scale.

4. **Button & Link States**: All interactive elements require a blue default (`#0000EE`), darker blue hover (`#0000CC`), darkest blue active (`#0000AA`), and disabled gray state (`#CCCCCC`). Links have no padding and no background; buttons have padding and may have backgrounds.

5. **Elevation Minimalism**: Shadows are optional and subtle. Use `box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1)` for light cards only. Never exceed `0px 8px 24px rgba(0, 0, 0, 0.2)` for depth.

6. **Whitespace Priority**: Maintain at least 32px padding inside containers and 16px margins between sections. Generous whitespace is the primary design principle; never compress spacing to save vertical real estate.

7. **Accessibility & Readability**: Set minimum line-height to 1.5x font size. Never reduce font size below 12px for body content. Always provide focus states (outline or border change) for keyboard navigation.

8. **Responsive Uniformity**: Mobile designs use full-width single columns with 16px side padding. Tablet and desktop scale up spacing and introduce centering within a max-width container. Typography hierarchy remains consistent across all breakpoints.

9. **Component Consistency**: Buttons, links, inputs, and cards follow the defined color and spacing rules. Variant states (hover, active, disabled, focus) are required for all interactive elements. Never deviate from padding, radius, and font specifications without explicit redesign rationale.

10. **Loading & Async States**: Spinner uses `#313131` as primary color and `#D9D9D9` as secondary. Animations (spin, fade, pulse) use ease-in-out timing. Loading text defaults to body font at 16px with 24px line-height.