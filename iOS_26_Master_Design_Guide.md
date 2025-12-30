# iOS 26 Master Design Guide
## Comprehensive Reference for AI Coding Assistants, Developers & Designers

**Version:** 1.0  
**Compiled:** December 2025  
**Scope:** Complete iOS 26 design system reference with Liquid Glass implementation  
**Primary Sources:** Apple Human Interface Guidelines, WWDC 2025 Sessions, Apple Developer Documentation  
**Document Sources:** This guide synthesizes information from multiple AI-generated reference documents (Claude, ChatGPT, Perplexity) cross-referenced against official Apple documentation.

---

## Table of Contents

1. [Executive Overview](#executive-overview)
2. [What's New in iOS 26](#whats-new-in-ios-26)
3. [Getting Started with Design](#getting-started-with-design)
4. [Design Principles & Architecture](#design-principles--architecture)
5. [Liquid Glass Design System](#liquid-glass-design-system)
6. [Foundations](#foundations)
   - [Accessibility](#accessibility)
   - [Typography](#typography)
   - [Color](#color)
   - [Layout & Spacing](#layout--spacing)
   - [Materials & Visual Effects](#materials--visual-effects)
   - [SF Symbols & Iconography](#sf-symbols--iconography)
   - [Motion](#motion)
7. [Patterns](#patterns)
   - [Navigation](#navigation)
   - [Content Organization](#content-organization)
   - [Search](#search)
   - [Modality & Focus](#modality--focus)
8. [Components & Controls](#components--controls)
9. [Input Methods](#input-methods)
10. [Technologies](#technologies)
11. [App Icons](#app-icons)
12. [SwiftUI Implementation Reference](#swiftui-implementation-reference)
13. [Data Visualization](#data-visualization)
14. [Financial Application Design Patterns](#financial-application-design-patterns)
15. [Platform Considerations](#platform-considerations)
16. [Design Resources & Tools](#design-resources--tools)
17. [Quick API Reference Card](#quick-api-reference-card)
18. [Appendix A: Source Discrepancies & Notes](#appendix-a-source-discrepancies--notes)
19. [Appendix B: References](#appendix-b-references)

---

## Executive Overview

iOS 26 represents Apple's most significant design evolution since iOS 7, introducing **Liquid Glass**—a revolutionary material that combines the optical properties of real glass with fluid, liquid-like motion and behavior. This material creates a distinct functional layer for controls and navigation elements that floats above content, allowing users to see content scroll behind while clearly distinguishing interactive elements.

This guide provides exhaustive technical specifications, SwiftUI implementation patterns, accessibility requirements, and best practices for building iOS 26 applications. AI coding assistants should reference this document when generating iOS 26 code to ensure visual consistency with Apple's Human Interface Guidelines.

### Purpose of This Document

This comprehensive reference serves multiple audiences:

**For AI Code Assistants:** This guide is structured to be AI-friendly. Use it as context when generating code by referencing specific sections. The document includes precise API signatures, code examples, and design specifications that can be directly applied to code generation tasks.

**For Developers:** Reference sections as you implement features. SwiftUI code examples are provided throughout and can be adapted directly for production use. Pay particular attention to the accessibility requirements and performance considerations.

**For Designers:** Use sections on principles, layout, hierarchy, and accessibility to inform design decisions before handoff to developers. The visual specifications and spacing guidelines ensure designs translate accurately to implementation.

---

## What's New in iOS 26

iOS 26 introduces sweeping changes to the visual design language across all Apple platforms. The following summary highlights the most significant updates that developers and designers must understand.

### Liquid Glass Material

Liquid Glass is the defining visual and interactive material of iOS 26. Unlike traditional blur effects that scatter light, Liquid Glass **lenses and concentrates light**, creating depth and a "lit from within" appearance. The material responds to device motion with specular highlights and morphs dynamically between states. Key characteristics include translucency with real-time refraction, dynamic lighting that responds to device orientation via gyroscope input, fluid materialization and morphing transitions, and interactive feedback where the material illuminates from within on touch.

### Unified Design Language

iOS 26 establishes visual consistency across all Apple platforms including iOS, iPadOS, macOS, tvOS, watchOS, and visionOS. Controls, navigation elements, and system components share the same Liquid Glass appearance and behavior, creating a cohesive experience regardless of device.

### Concentricity

A new mathematical approach to shape relationships where controls and navigation features rounded, concentric corners rather than sharp edges. Shapes nest within each other with aligned radii, margins and padding follow mathematical relationships, and corner radius changes are proportional to create visual harmony.

### Enhanced App Icons

App icons now use a layered system with Liquid Glass material effects. Icons respond to device orientation with dynamic lighting, support multiple appearance modes (Light, Dark, Monochrome, Tinted), and use specular highlights that travel around the icon geometry.

### Updated System Components

All standard UIKit and SwiftUI components automatically adopt Liquid Glass styling when compiled with Xcode 26. Navigation bars, tab bars, toolbars, sheets, popovers, and controls receive the new appearance without code changes. Scroll edge effects replace hard dividers, allowing content to glide through navigation elements naturally.

### Tab Bar Enhancements

Tab bars now include a dedicated Search tab role for global search access. The tab bar shrinks on scroll to focus on content while remaining accessible, then expands fluidly when scrolling up. A new bottom accessory API allows persistent features like media playback controls.

### Dynamic Morphing

Controls and interface elements fluidly transition in response to interaction. Glass shapes can merge, split, and transform between states while maintaining the illusion of a singular floating plane that controls inhabit.

---

## Getting Started with Design

### Design Pathway: From Concept to Implementation

Apple's design site provides a structured pathway for learning iOS design. The journey progresses through several stages: learning the building blocks of design, interfacing with the Human Interface Guidelines, assembling your design toolbox, producing prototypes, and gaining inspiration from the developer community. Each stage links to resources including the Human Interface Guidelines, Apple design resources, and SF Symbols.

Use this pathway to orient new team members by starting with fundamentals (typography, color, layout), then moving to platform patterns and components, and finally exploring advanced technologies such as Liquid Glass and generative AI.

### The Four Building Blocks of Design

Great apps feel clear, intuitive, and effortless to use. The foundation of excellent design encompasses four critical dimensions that must work together harmoniously.

**Structure** defines how information is organized and prioritized. A well-structured app immediately answers the questions "Where am I?" and "What can I do?" Essential features should be presented first with related content grouped logically. Users should achieve immediate understanding without mental effort.

**Navigation** determines how users move through the app with confidence and orientation. iOS provides proven navigation patterns including tab bars for primary sections, navigation stacks for hierarchical content, and toolbars for contextual actions. Navigation should feel predictable and reversible.

**Content** organization guides people to what matters most. Use progressive disclosure to show only essential information upfront, then reveal details on interaction. Group content by time, progress, patterns, priority, or status depending on what makes sense for your app's domain.

**Visual Design** communicates personality while supporting usability through hierarchy, typography, images, and color. Visual design should leverage semantic colors for consistency, apply Liquid Glass for material depth, use whitespace to reduce cognitive load, and maintain visual rhythm through consistent spacing.

### Information Architecture

Information architecture is the process of organizing and prioritizing information so people can easily find what they need without friction. The process involves four key steps.

First, **inventory** everything your app does including features, workflows, and nice-to-haves. Write down every capability without filtering at this stage.

Second, **research** how someone would use the app. Consider when they would use it, where they would be, and what context would help them accomplish their goals.

Third, **simplify** by removing non-essential features, renaming unclear elements, and grouping related items. Be ruthless about eliminating complexity that doesn't serve users.

Fourth, **clarify** to ensure the app's core purpose is crystal clear. Every screen should have an obvious primary purpose.

A well-designed information architecture allows users to instantly answer three critical questions at any point: "Where am I?" (current location is clear), "What can I do?" (available actions are discoverable), and "Where can I go from here?" (next steps are evident).

---

## Design Principles & Architecture

### The Three Core Principles

Every design decision for iOS 26 should be guided by three fundamental principles that Apple emphasizes throughout the Human Interface Guidelines.

#### Hierarchy

Hierarchy establishes a clear visual priority where controls and interface elements elevate and distinguish the content beneath them. Rather than relying on decoration, hierarchy should be expressed through layout, grouping, and the strategic use of Liquid Glass materials. Users should instantly understand where to focus their attention.

Effective hierarchy is achieved through multiple techniques working together. Layout and positioning place the most important content higher or more centrally on screen. Size variations make critical elements larger or higher in contrast. System text styles (Large Title, Headline, Body, Caption) create natural information architecture. Color and material depth leverage Liquid Glass translucency to create visual layers. Whitespace creates focus by giving important elements room to breathe.

```swift
// SwiftUI Example: Establishing Hierarchy
// [Source: Claude Doc 2]
VStack(spacing: 16) {
    // Primary heading (hierarchy level 1)
    Text("Account Overview")
        .font(.system(.title, design: .default))
        .fontWeight(.bold)
    
    // Secondary content (hierarchy level 2)
    Text("Your current balance")
        .font(.subheadline)
        .foregroundColor(.secondary)
    
    // Primary data (hierarchy level 1 - draws equal attention to heading)
    Text("$12,450.50")
        .font(.system(size: 32, weight: .bold, design: .default))
    
    // Tertiary actions (hierarchy level 3)
    HStack(spacing: 12) {
        Button(action: {}) {
            Label("Transfer", systemImage: "arrow.up.right")
        }
        .buttonStyle(.glass)
        
        Button(action: {}) {
            Label("More", systemImage: "ellipsis")
        }
        .buttonStyle(.glass)
    }
}
```

#### Harmony

Harmony aligns interface design with the concentric design of both hardware and software, creating unity between interface elements, system experiences, and physical devices. The curvature, size, and proportions of your UI should echo the physical form factors of Apple devices.

The concentricity principle is central to harmony in iOS 26. Shapes nest within each other with aligned radii. Margins and padding follow mathematical relationships where inner radius equals outer radius minus padding. Corner radius changes are proportional throughout the interface. Views center optically or subtly offset when needed for visual balance.

```swift
// Concentric shape example demonstrating harmony
// [Source: Claude Doc 2]
VStack(spacing: 0) {
    // Outer container with larger corner radius
    VStack(spacing: 12) {
        // Inner content with smaller radius (concentric)
        Text("Card Title")
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(12)
            .background(
                RoundedRectangle(cornerRadius: 8)  // Inner radius = 12 - 4 padding consideration
                    .fill(Color.blue.opacity(0.1))
            )
        
        Text("Card content appears here with proper nesting")
            .frame(maxWidth: .infinity, alignment: .leading)
    }
    .padding(16)
    .background(
        RoundedRectangle(cornerRadius: 12)  // Outer radius
            .fill(Color(.systemBackground))
    )
}
```

#### Consistency

Consistency ensures that standard actions and controls behave as users expect, maintaining predictable patterns that continuously adapt across window sizes, displays, and platforms. This doesn't mean uniformity—instead, the behavior and function of elements remain the same even as their appearance adapts to different contexts.

Consistency is maintained through platform conventions (using standard icons for standard actions like magnifying glass for search and trash for delete), predictable layouts (placing controls where users expect them), adaptive design (ensuring components scale appropriately across iPhone, iPad, and Mac), and shared symbols and labels (using SF Symbols and consistent terminology across platforms).

The benefits of maintaining consistency are substantial. Users understand how to interact immediately without learning new patterns. Cognitive load is reduced because familiar patterns work across the app. System updates apply automatically when system-provided components are used. Built-in accessibility support works correctly without additional effort.

---

## Liquid Glass Design System

### Overview and Philosophy

Liquid Glass is the hallmark of iOS 26's design system. It unifies the appearance of controls and navigation across platforms and responds fluidly to user interaction. Unlike traditional blur that scatters light, Liquid Glass **lenses and concentrates light** in real-time, creating depth and making elements appear lit from within.

The material was developed through collaboration between Apple's design and engineering teams, drawing inspiration from the layered icons on visionOS and researching real glass properties. Liquid Glass layers multiple optical effects including edge highlights, frostiness, translucency, refraction, and reflection to create sophisticated depth.

### Core Properties and Behaviors

#### Visual Characteristics

Liquid Glass exhibits several defining visual properties that distinguish it from previous iOS materials.

**Translucency and Refraction** allow content below to remain visible through the material, maintaining context while creating separation. Dynamic refraction bends and shapes light in real-time rather than simply scattering it. The material refracts content from below while reflecting light and surrounding context.

**Lensing Effects** create pronounced visual distortion along edges that gives interfaces a sense of depth and dimension. Lensing effects vary based on material thickness—larger elements have more pronounced effects. Edge highlights travel around the material geometry, responding to lighting conditions.

**Dynamic Lighting** through specular highlights responds to geometry and environmental lighting. The lighting responds to device motion through gyroscope input, making the interface feel aware of its position in the real world. On device unlock, lights move in space causing illumination to travel around material silhouettes.

**Shadows and Depth** through soft, dynamic shadows help elements feel grounded and defined. Shadow depth increases with interaction, providing tactile feedback. Larger Liquid Glass elements cast deeper, richer shadows to simulate thicker material.

#### Motion and Interaction Behaviors

The motion characteristics of Liquid Glass are as carefully designed as its visual properties.

**Fluid Materialization** describes how elements materialize in and out by gradually modulating light bending and lensing. Transitions preserve the optical integrity of the material rather than using simple fade effects. This creates a sense that glass is forming or dissolving rather than appearing or disappearing.

**Responsive Flexibility** means the material instantly flexes and energizes with light on interaction. The gel-like flexibility communicates the material's transient and malleable nature. Movement aligns with the fluidity and dynamism of user thinking and interaction.

**Context Morphing** allows Liquid Glass to dynamically morph between controls in different app contexts. This maintains the concept of a singular floating plane that controls inhabit and makes transitions between app sections feel fluid and seamless.

**Interactive Feedback** causes the material to illuminate from within on touch, with a glow spreading from the fingertip. This glow propagates to nearby Liquid Glass elements, creating connected interactions. The interface feels alive and directly connected to physical input.

### The Golden Rule for Liquid Glass

**Liquid Glass applies exclusively to the navigation layer floating above app content.** Never apply glass effects to content itself including lists, tables, charts, or media. This separation maintains the functional distinction between what users interact with (controls) and what they consume (content).

The layer hierarchy in iOS 26 consists of three distinct levels:

1. **Content Layer (bottom):** No glass effects applied. This layer contains your app's actual content including lists, tables, media, charts, and data displays.

2. **Navigation Layer (middle):** Liquid Glass for controls. This layer contains navigation bars, toolbars, tab bars, floating action buttons, sheets, popovers, and menus.

3. **Overlay Layer (top):** Vibrancy and fills on glass. This layer contains text, icons, and interactive elements that appear on top of glass surfaces.

### When to Use Liquid Glass

Liquid Glass should be applied to navigation bars and toolbars, tab bars and bottom accessories, floating action buttons, sheets and popovers and menus, context-sensitive controls, and system-level alerts.

### When NOT to Use Liquid Glass

Avoid applying Liquid Glass to the content layer (lists, tables, media), full-screen backgrounds, scrollable content areas, stacked glass layers (glass-on-glass creates visual confusion), and indiscriminately to every UI element. Overusing Liquid Glass distracts from content and diminishes its effectiveness as a hierarchy signal.

### Glass Material Variants

iOS 26 provides multiple glass variants for different contexts.

**Regular Glass** (`.regular`) is the default adaptive glass with medium transparency and full adaptivity. Use this for most navigation elements and controls. The system automatically adjusts opacity and blur based on the content beneath.

**Clear Glass** (`.clear`) offers high transparency for use over visually rich backgrounds like photos or videos. This variant prioritizes showing the content beneath while still providing the glass material properties. Consider adding a dimming layer (approximately 35% opacity) when content is particularly bright.

**Identity Glass** (`.identity`) applies no effect and is useful for conditional toggling when you want to programmatically enable or disable the glass effect based on state.

```swift
// Glass variant examples
// [Source: Claude Doc 1]

// Standard adaptive glass (default)
Text("Balance: $12,450.32")
    .padding()
    .glassEffect()

// Explicit parameters for regular glass
Text("Transaction")
    .padding()
    .glassEffect(.regular, in: .capsule, isEnabled: true)

// Clear variant for media-rich backgrounds
mediaOverlayView
    .glassEffect(.clear)

// Conditional glass using identity
controlView
    .glassEffect(shouldShowGlass ? .regular : .identity)
```

### Adaptive Properties

Liquid Glass continuously adapts to ensure legibility and appropriate hierarchy across contexts.

**Content Adaptation** adjusts the material based on what appears beneath it. Tint modulation shifts between light and dark to maintain contrast with underlying content. Opacity varies to ensure text and controls remain readable. Background extension allows content to extend beneath Liquid Glass surfaces while maintaining clarity.

**Size-Based Adaptation** changes material characteristics based on element size. Thin materials on buttons and small controls have subtle lensing and shadows. Thick materials on larger elements like menus have more pronounced refraction, deeper shadows, and softer light scattering.

**Accessibility Adaptation** automatically respects system accessibility settings. When Reduced Transparency is enabled, the material becomes frostier and obscures more background content. When Increased Contrast is enabled, elements render predominantly black or white with contrasting borders. When Reduce Motion is enabled, effect intensity decreases and elastic material properties are disabled.

### Automatic Adoption

If you use standard SwiftUI, UIKit, or AppKit components, Liquid Glass is adopted automatically when you build with Xcode 26. No code changes are needed for navigation bars and toolbars, tab bars, buttons and controls, sheets and modals, search bars and toolbars, and popovers.

```swift
// All of these automatically get Liquid Glass with latest SDKs
// [Source: Claude Doc 2]
NavigationStack {
    List(items) { item in
        ItemRow(item)
    }
    .navigationTitle("Items")
}

TabView {
    View1().tabItem { Label("Home", systemImage: "house") }
    View2().tabItem { Label("Search", systemImage: "magnifyingglass") }
}

Button("Action") {
    // Automatically styled with Liquid Glass
}

.sheet(isPresented: $showModal) {
    // Automatically gets Liquid Glass appearance
    ModalView()
}
```

### Removing Custom Backgrounds (Critical)

This is the most important step for adopting Liquid Glass properly. Custom backgrounds on bars, sheets, and controls interfere with Liquid Glass effects and must be removed.

```swift
// INCORRECT - Custom backgrounds block Liquid Glass
// [Source: Claude Doc 2]
VStack {
    HStack {
        Button("Back") { }
        Text("Title").font(.headline)
        Button("Action") { }
    }
    .background(Color.white.opacity(0.9))  // ❌ REMOVE THIS
    .border(Color.gray.opacity(0.3))       // ❌ REMOVE THIS
}

// CORRECT - Let system apply Liquid Glass
VStack {
    HStack {
        Button("Back") { }
        Text("Title").font(.headline)
        Button("Action") { }
    }
    // ✅ No custom background - system applies Liquid Glass
    // ✅ No border - system applies material effects
}
```

Common items to clean up when adopting iOS 26 include `.background(Color.white)` on toolbars, `.background(Material.regular)` (use system defaults instead), `.border()` on navigation elements, custom backdrop filters, `.shadow()` on bars (system applies appropriate shadows), and hard dividers between bars and content.

---

## Foundations

### Accessibility

Accessible user interfaces allow everyone to enjoy your app regardless of their capabilities. An accessible interface is intuitive, perceivable, and adaptable. Accessibility is not optional—it is a fundamental requirement for quality iOS applications.

#### Visual Accessibility

**Ensure Legibility** by supporting larger text sizes. Apple recommends supporting at least 200% growth on iOS. Follow platform-specific default and minimum sizes: iOS default is 17pt with a minimum of 11pt for any text. Adjust font size when using thin weights and test legibility under varied lighting conditions and device contexts.

**Color Contrast** must meet WCAG 2.1 standards. Apple's Accessibility Inspector uses WCAG Level AA as guidance. Small text up to 17pt requires a minimum 4.5:1 contrast ratio. Text at 18pt or bold text can use a 3:1 minimum ratio. Provide higher-contrast schemes when the user enables Increase Contrast. The recommended contrast ratio for optimal accessibility is 7:1.

**Avoid Color-Only Cues** because some users cannot distinguish certain colors. Pair color with icons, shapes, or labels. For example, use both a red octagon with "X" and a green circle with checkmark to differentiate states, never relying on color alone to convey meaning.

**Dynamic Type** allows users to adjust text size system-wide for better readability. Use system text styles which support Dynamic Type automatically. Custom fonts must implement relative scaling with the `relativeTo` parameter. Test across all accessibility sizes from xSmall to AX5 (Accessibility Extra Extra Extra Extra Extra Large).

```swift
// Dynamic Type implementation
// [Source: Perplexity]
Text("Content")
    .font(.title)  // Automatically supports Dynamic Type

// Custom font with Dynamic Type scaling
Text("Content")
    .font(.custom("Avenir-Roman", size: 34, relativeTo: .title))
```

**Bold Text** increases font weight system-wide and improves readability for users with low vision. Test your interface with Bold Text enabled to ensure layouts accommodate the increased weight.

**Reduce Transparency** makes blurs and translucent effects opaque, improving text readability. Liquid Glass automatically adapts when this setting is enabled, becoming frostier and obscuring more background content.

**Smart Invert Colors** provides a system-wide dark mode for light sensitivity with higher contrast than standard Dark Mode. Flag specific views like photos, videos, and icons with `accessibilityIgnoresInvertColors` to prevent inappropriate inversion.

#### Motor Accessibility

**Touch Target Sizes** must be adequate for users with motor impairments. The minimum touch target is **44 × 44 points** for all interactive elements. For critical actions, consider 48×48pt or larger. Provide adequate spacing between interactive elements with a minimum of 8pt separation.

**Gesture Alternatives** ensure all functionality is accessible. Offer alternatives to gestures such as a delete button as well as swipe-to-delete. Ensure that actions are accessible via keyboard and assistive devices. Never require complex gestures for essential functionality.

**Switch Control** support requires full keyboard and switch navigation capability. Ensure logical focus order through your interface and test with hardware keyboard and Switch Control enabled.

#### Hearing Accessibility

**Audio Alternatives** are essential for deaf and hard-of-hearing users. Provide captions for video content. Include visual indicators for audio alerts. Support Live Captions. Provide haptic feedback alongside audio cues and augment audio with visual indicators.

#### Cognitive Accessibility

**Reduce Motion** support simplifies animations for users who experience motion sickness or vestibular disorders. Disable or minimize animations and parallax effects. Use crossfade transitions instead of sliding or scaling. Liquid Glass automatically reduces motion effects when this setting is enabled.

**Clear Language** benefits all users but is essential for cognitive accessibility. Use simple, direct language. Avoid jargon and complex terminology. Provide helpful hints for actions.

**Keep Actions Simple** by avoiding time-boxed elements that auto-dismiss. Let users adjust difficulty in games and control autoplay of media. Ensure users can always recover from mistakes.

#### VoiceOver Support

**Accessibility Labels** provide descriptive labels for all interactive elements. Describe purpose rather than appearance ("Delete message" not "Red button"). Update labels for changing states so users always know the current status.

**Accessibility Hints** offer additional context when labels alone are insufficient. Describe the result of actions ("Double tap and drag to adjust brightness"). Keep hints concise to avoid overwhelming users.

**Accessibility Traits** help VoiceOver users understand element type and state. Apply appropriate traits including Button, Link, Header, Image, and Selected. Combine multiple traits when appropriate.

```swift
// Comprehensive VoiceOver support example
// [Source: Claude Doc 1]
struct AccountBalanceView: View {
    let balance: Decimal
    let change: Double
    
    var body: some View {
        VStack(alignment: .leading) {
            Text(balance, format: .currency(code: "USD"))
                .font(.largeTitle)
                .accessibilityLabel("Account balance")
                .accessibilityValue(balance.formatted(.currency(code: "USD")))
            
            HStack {
                Image(systemName: change >= 0 ? "arrow.up.right" : "arrow.down.right")
                Text(change, format: .percent.precision(.fractionLength(2)))
            }
            .foregroundStyle(change >= 0 ? .green : .red)
            .accessibilityElement(children: .combine)
            .accessibilityLabel(change >= 0 ? "Up" : "Down")
            .accessibilityValue("\(abs(change).formatted(.percent)) today")
        }
        .accessibilityElement(children: .combine)
        .accessibilityHint("Double tap to view transaction history")
    }
}
```

### Typography

Good typography improves legibility and communicates hierarchy. iOS 26 continues Apple's commitment to excellent typography with the San Francisco font system.

#### San Francisco Font System

**SF Pro** is the primary system font for iOS, iPadOS, macOS, and tvOS. It is available in nine weights from Ultralight to Black. The variable font provides seamless Text-to-Display optical sizing, automatically adjusting letterforms based on point size.

**SF Pro Rounded** offers a softer, friendlier alternative to SF Pro while maintaining all weights and sizing characteristics. It is appropriate for apps emphasizing approachability.

**SF Compact** is optimized for space-constrained contexts and is primarily used on watchOS but available system-wide. It preserves legibility in tight layouts.

**SF Mono** is the monospaced variant for code, numbers, and tabular data. It provides perfect vertical alignment for technical content and is available in all standard weights.

**New York** is a serif typeface for editorial and long-form content. It works harmoniously with the SF families and is available for Apps, Books, and content-focused interfaces.

#### Optical Sizing

SF fonts implement automatic optical sizing for optimal legibility. **SF Text** is optimized for 19pt and below with slightly wider letterforms and more open spacing. **SF Display** is optimized for 20pt and above with tighter spacing appropriate for headlines. The transition zone provides smooth interpolation between 17-28pt, and the system automatically applies the appropriate optical size based on point size.

#### Text Styles and Default Sizes

iOS provides predefined text styles that ensure hierarchy and support Dynamic Type. These styles should be used rather than arbitrary point sizes to maintain consistency and accessibility.

| Style | Default Size | Weight | Typical Use Case |
|-------|--------------|--------|------------------|
| `.largeTitle` | 34pt | Regular | Screen titles, portfolio totals, main balances |
| `.title` | 28pt | Regular | Section headers, account names |
| `.title2` | 22pt | Regular | Card titles, subsection headers |
| `.title3` | 20pt | Regular | Subsection headers, prominent labels |
| `.headline` | 17pt | Semibold | Important labels, current values, row titles |
| `.body` | 17pt | Regular | Primary content, descriptions, paragraphs |
| `.callout` | 16pt | Regular | Supporting information, explanations |
| `.subheadline` | 15pt | Regular | Secondary details, metadata |
| `.footnote` | 13pt | Regular | Timestamps, auxiliary metadata |
| `.caption` | 12pt | Regular | Auxiliary information, labels |
| `.caption2` | 11pt | Regular | Fine print, disclaimers, legal text |

The minimum font size for legibility at typical viewing distance is **11pt**. Never use smaller text in production applications.

#### Typography Implementation

```swift
// SwiftUI typography best practices
// [Source: Claude Doc 1]

// Use semantic text styles that scale with Dynamic Type
Text("$45,230.87")
    .font(.largeTitle)
    .fontWeight(.bold)
    .fontDesign(.rounded)  // Optional: Use SF Pro Rounded

Text("Total Portfolio Value")
    .font(.subheadline)
    .foregroundStyle(.secondary)

// Monospaced digits for financial data alignment
Text("Transaction ID: TXN-2025-001234")
    .font(.system(.footnote, design: .monospaced))

// Custom font size with Dynamic Type support
Text("Important")
    .font(.system(size: 17, weight: .semibold, design: .default))
    .dynamicTypeSize(...DynamicTypeSize.xxxLarge)  // Limit max scaling if needed

// Currency formatting with proper typography
Text(amount, format: .currency(code: "USD"))
    .font(.title)
    .fontWeight(.medium)
    .monospacedDigit()  // Ensures digits align in columns
```

#### Dynamic Type Layout Adaptation

Layouts must accommodate larger text sizes without clipping. Adapt your layout structure when text sizes reach accessibility levels.

```swift
// Adapting layout for accessibility text sizes
// [Source: Claude Doc 1]
@Environment(\.dynamicTypeSize) var dynamicTypeSize

var body: some View {
    Group {
        if dynamicTypeSize.isAccessibilitySize {
            // Stack vertically for accessibility sizes
            VStack(alignment: .leading, spacing: 8) {
                transactionDescription
                amountView
                dateView
            }
        } else {
            // Horizontal layout for standard sizes
            HStack {
                transactionDescription
                Spacer()
                VStack(alignment: .trailing) {
                    amountView
                    dateView
                }
            }
        }
    }
}
```

### Color

Color is fundamental to iOS interface design, communicating status, hierarchy, and interactivity while supporting user preferences and accessibility needs.

#### System Colors

iOS provides dynamic system colors that automatically adapt to appearance modes, vibrancy, and accessibility settings. Colors are named after their purpose rather than appearance, ensuring they work correctly across Light Mode, Dark Mode, and accessibility settings.

**Primary System Colors** include Blue (default tint/accent color), Brown, Cyan, Green, Indigo, Mint, Orange, Pink, Purple, Red, Teal, and Yellow. Each is available in multiple adaptive variations.

| Color | Light Mode RGB | Dark Mode RGB | Typical Use Case |
|-------|----------------|---------------|------------------|
| `systemBlue` | (0, 122, 255) | (10, 132, 255) | Primary actions, links, interactive elements |
| `systemGreen` | (52, 199, 89) | (48, 209, 88) | Positive values, success states, gains |
| `systemRed` | (255, 59, 48) | (255, 69, 58) | Negative values, errors, losses, destructive actions |
| `systemYellow` | (255, 204, 0) | (255, 214, 10) | Warnings, pending states, attention |
| `systemOrange` | (255, 149, 0) | (255, 159, 10) | Moderate alerts, secondary warnings |
| `systemTeal` | (90, 200, 250) | (100, 210, 255) | Secondary information, alternative accent |
| `systemPurple` | (175, 82, 222) | (191, 90, 242) | Premium features, special categories |
| `systemIndigo` | (88, 86, 214) | (94, 92, 230) | Categories, segments, groupings |

#### Semantic UI Element Colors

```swift
// Semantic color usage
// [Source: Claude Doc 1]

// Label hierarchy (automatically adapts to appearance)
Color.primary              // Primary text content
Color.secondary            // Secondary text, less prominent
Color(.tertiaryLabel)      // Tertiary text, even less prominent
Color(.quaternaryLabel)    // Quaternary text, least prominent

// Background hierarchy
Color(.systemBackground)           // Primary background
Color(.secondarySystemBackground)  // Elevated surfaces, cards
Color(.tertiarySystemBackground)   // Nested cards, grouped content

// Grouped backgrounds (for settings-style interfaces)
Color(.systemGroupedBackground)
Color(.secondarySystemGroupedBackground)
Color(.tertiarySystemGroupedBackground)

// Fill colors (for shapes, icons, controls)
Color(.systemFill)
Color(.secondarySystemFill)
Color(.tertiarySystemFill)
Color(.quaternarySystemFill)

// Gray scale (6 adaptive levels)
Color(.systemGray)    // through Color(.systemGray6)
```

#### Color Usage Guidelines

**Accessibility Requirements** mandate specific contrast ratios. Normal text requires a minimum 4.5:1 contrast ratio. Large text at 18pt or above can use a minimum 3:1 ratio. Follow WCAG guidelines for all text and interactive elements. The recommended contrast ratio for optimal accessibility is 7:1.

**Semantic Meaning** requires using color consistently to indicate specific states or types. Avoid using the same color for different meanings within your app. Never rely on color alone to convey information—always pair with icons, shapes, or text labels.

**Mode Support** requires designing for both Light and Dark Mode from the start. System colors automatically adapt when using semantic colors. Custom colors require manual Light/Dark variants defined in asset catalogs.

**High Contrast Mode** requires providing alternate high-contrast versions in asset catalogs. Dark colors should get darker in Light Mode high contrast. Light colors should get lighter in Dark Mode high contrast.

#### Liquid Glass Color Considerations

Liquid Glass is inherently colourless and picks up colours from the content behind it. You can add colour to Liquid Glass controls to emphasize actions such as a primary call-to-action button. By default, Liquid Glass backgrounds adapt to light/dark context, and system controls adopt primary or secondary tint colours.

Use tinted glass sparingly to avoid overwhelming the design. Reserve tinting for primary actions and semantic meaning rather than decoration.

```swift
// Tinting glass for semantic meaning
// [Source: Claude Doc 1]

// Positive financial value (green tint)
Text("+$2,340.00")
    .padding()
    .glassEffect(.regular.tint(.green))

// Negative financial value (red tint)
Text("-$450.00")
    .padding()
    .glassEffect(.regular.tint(.red))

// Primary action with tint
Button("Transfer Funds") { }
    .glassEffect(.regular.tint(.blue.opacity(0.8)))
```

### Layout & Spacing

A consistent, adaptable layout makes your app approachable across devices. Layout provides structure and responsive design that adapts to various screen sizes, orientations, and accessibility settings.

#### Safe Areas and Margins

Safe areas prevent content from being obscured by system UI elements including the Dynamic Island, home indicator, and status bar.

| Element | iPhone | iPad | Notes |
|---------|--------|------|-------|
| Top safe area | 44–59pt | 24pt | Varies by notch/Dynamic Island |
| Bottom safe area | 34pt | 20pt | Home indicator |
| Leading/trailing margin | **16pt** | **20pt** | Standard content margins |
| Tab bar height | 83pt | 50pt | Includes home indicator |
| Navigation bar height | 44–96pt | 44–96pt | Varies by title size |
| Status bar height | 54pt | 24pt | Dynamic Island devices |

#### Grid System (8pt Baseline)

iOS uses an 8-point grid system for consistent spacing throughout interfaces. All spacing values should be multiples of 8, with occasional 4pt adjustments for fine-tuning.

```swift
// Standard spacing values
// [Source: Claude Doc 1]
let spacing4: CGFloat = 4    // Tight spacing, fine adjustments
let spacing8: CGFloat = 8    // Compact spacing between related elements
let spacing12: CGFloat = 12  // Related elements with breathing room
let spacing16: CGFloat = 16  // Standard spacing, most common
let spacing20: CGFloat = 20  // Section spacing
let spacing24: CGFloat = 24  // Major sections
let spacing32: CGFloat = 32  // Large gaps, visual separation

// Minimum touch target - ALWAYS enforce this
let minTouchTarget: CGFloat = 44  // 44×44 points minimum
```

#### Layout Best Practices

**Group Related Items** using negative space, background shapes, colours, materials, or separators. Keep controls distinct from content to maintain clarity.

**Expose Essential Information** by giving critical information prominent placement and sufficient space. Move secondary details to secondary views or progressive disclosure.

**Extend Content to Edges** for backgrounds and full-screen artwork. Scrollable layouts should continue to the bottom and sides. Control layers (sidebars, tab bars) float above content and require background extension effects to maintain the illusion of depth.

```swift
// Layout implementation example
// [Source: Claude Doc 1]
struct FinanceHomeView: View {
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                BalanceCard()
                    .padding(.horizontal, 16)  // Standard horizontal margin
                
                TransactionList()
            }
        }
        .safeAreaInset(edge: .bottom) {
            QuickActionsBar()
                .glassEffect()  // Navigation layer floats above content
        }
    }
}
```

#### Adaptive Layout for Different Devices

```swift
// Device-adaptive layout
// [Source: Claude Doc 1]
struct AdaptivePortfolioView: View {
    @Environment(\.horizontalSizeClass) var sizeClass
    
    var body: some View {
        if sizeClass == .compact {
            // iPhone: Vertical stack
            VStack(spacing: 16) {
                ChartView()
                HoldingsList()
            }
        } else {
            // iPad: Side by side
            HStack(spacing: 20) {
                ChartView()
                    .frame(minWidth: 300)
                HoldingsList()
                    .frame(maxWidth: .infinity)
            }
        }
    }
}
```

#### Concentric Shape System

iOS 26 introduces concentricity as a core layout principle. Shapes should nest with mathematically calculated radii for visual harmony with Liquid Glass.

Three shape types support concentric layouts:

1. **Fixed Shapes:** Constant corner radius regardless of context
2. **Capsules:** Radius equals half the container height, creating pill shapes
3. **Concentric Shapes:** Radius equals parent radius minus padding for nested harmony

```swift
// Concentric shape implementation
// [Source: Claude Doc 1]

// Container-concentric corner radius (automatic calculation)
.clipShape(.rect(cornerRadius: .containerConcentric))

// Manual calculation for nested containers
let outerRadius: CGFloat = 20
let padding: CGFloat = 8
let innerRadius = outerRadius - padding  // Results in 12pt

RoundedRectangle(cornerRadius: outerRadius)
    .fill(Color(.secondarySystemBackground))
    .overlay {
        RoundedRectangle(cornerRadius: innerRadius)
            .fill(Color(.tertiarySystemBackground))
            .padding(padding)
    }
```

### Materials & Visual Effects

Materials are visual effects that create depth and hierarchy. Apple's material system includes Liquid Glass and standard materials that work together to establish clear visual layers.

#### Material Types

**Liquid Glass** forms the functional layer. It floats above content to host navigation and controls, allowing content to peek through while maintaining legibility. Do not use Liquid Glass in the content layer except for transient interactive controls like sliders or toggles. Use the effect sparingly; most system components adopt Liquid Glass automatically.

**Standard Materials** in iOS and iPadOS include four levels: ultra-thin, thin, regular, and thick. These are used for the content layer. Select materials based on semantic meaning rather than color. Use vibrant colors on top of materials to ensure contrast. Thicker materials provide better contrast while thinner materials retain more background context.

**Blur Effects** are provided by the system in multiple styles. They automatically adapt to the Reduce Transparency setting and become opaque when accessibility requires it.

**Vibrancy** ensures text and symbols remain legible over blurred backgrounds. It is applied automatically when using system materials and adjusts for context and accessibility settings.

#### Regular vs Clear Glass Variants

Use the **regular variant** for text-heavy components. It blurs and dims background content and uses scroll-edge effects to enhance legibility over scrolling content.

Use the **clear variant** over visually rich backgrounds like photos or videos to prioritize showing the content beneath. Consider adding a dimming layer of approximately 35% opacity when content is particularly bright to maintain legibility.

#### Background Extension

Content can extend beneath Liquid Glass surfaces for immersive layouts. Scroll views extend beneath sidebars and toolbars. Carousels and media glide through navigation naturally. Text and controls should be layered above to avoid distortion from the glass refraction effect.

```swift
// Background extension for immersive layouts
// [Source: Claude Doc 1]
NavigationSplitView {
    List(accounts, selection: $selectedAccount) { account in
        NavigationLink(value: account) {
            AccountRow(account: account)
        }
    }
    .navigationTitle("Accounts")
    .backgroundExtensionEffect()  // Content extends behind sidebar glass
} content: {
    // Content column
} detail: {
    // Detail column
}
```

### SF Symbols & Iconography

SF Symbols provide thousands of configurable icons that align with the San Francisco system font, scale automatically with text, and support variable color and weights.

#### Library Overview

SF Symbols 7 includes over 6,900 symbols available in nine weights matching SF font weights (Ultralight to Black) and three scales (Small, Medium, Large). Symbols automatically align with text baselines and support Dynamic Type sizing.

#### New Features in SF Symbols 7

SF Symbols 7 introduces Draw animations for revealing symbols stroke-by-stroke, variable rendering for partially filled symbols, enhanced Magic Replace for smoother symbol transitions, gradient support for rich color effects, and hundreds of new symbols across categories.

#### Symbol Configuration

Symbols can be configured with weight (Ultralight to Black), scale (Small, Medium, Large), and rendering modes (Monochrome, Hierarchical, Palette, Multicolor). Color customization is available per design requirements.

#### Preferred Glyphs for Common Actions

Apple provides recommended symbols for standard actions to maintain consistency across the platform:

- **Navigation:** chevron.left, chevron.right, chevron.up, chevron.down
- **Actions:** plus, minus, xmark, checkmark
- **Sharing:** square.and.arrow.up
- **Editing:** pencil, trash
- **Organization:** folder, tag
- **Settings:** gearshape
- **Search:** magnifyingglass

#### Custom Symbols

When creating custom symbols, export and edit SF Symbols using vector tools. Maintain shared design characteristics with system symbols. Ensure accessibility features are preserved. Follow template guidelines for weight and scale consistency.

### Motion

Motion enriches the interface but must support the experience without overwhelming users.

#### Purposeful Motion

Add motion only when it supports the experience. Excessive animation can distract or cause discomfort. Provide options to reduce or disable motion through the system Reduce Motion setting. Use haptics or audio as alternative feedback when motion is reduced.

#### Realistic Feedback

Motion should follow user gestures naturally. A view dragged down should dismiss by sliding down, not sideways. Movement should be brief and precise. Avoid animating frequent UI interactions; the system already provides subtle animations for standard controls. Always let users interrupt animations.

#### Leveraging Platform Capabilities

Aim for smooth frame rates of 30-60 fps. Provide options to optimize performance or battery life. In visionOS, avoid motion in peripheral vision and adjust translucency or contrast when moving large objects. Consider fades or instantaneous changes when moving objects across the field of view.

#### Reduce Motion Support

```swift
// Respecting Reduce Motion preference
// [Source: Claude Doc 1]
@Environment(\.accessibilityReduceMotion) var reduceMotion

var body: some View {
    ChartView()
        .animation(reduceMotion ? nil : .spring(), value: chartData)
    
    Button("Refresh") {
        withAnimation(reduceMotion ? nil : .bouncy) {
            refreshData()
        }
    }
}

// Spring animations (preferred in iOS 26) automatically respect Reduce Motion
.animation(.spring(response: 0.55, dampingFraction: 0.825), value: isExpanded)
```

---

## Patterns

### Navigation

Navigation enables users to move through app content confidently and predictably. iOS 26 enhances navigation elements with Liquid Glass while maintaining familiar patterns.

#### Tab Bar

The tab bar provides persistent access to the primary sections of an app. It is the most common navigation pattern for apps with multiple top-level destinations.

**iOS 26 Updates** include a dedicated Search tab role for global search access, automatic shrinking on scroll to focus on content while remaining accessible, fluid expansion when scrolling up, and Liquid Glass material for translucent adaptive appearance.

**Design Guidelines** recommend using 3-5 tabs maximum (most apps use 4-5). Each tab should represent a distinct top-level destination. Labels should be concise, preferably one word. Icons should use standard SF Symbols or clearly communicate their purpose. The selected state must be clearly indicated.

**Implementation Considerations** include keeping the tab bar visible during normal navigation with the exception of full-screen media or immersive experiences. Never use tabs for actions (use toolbar buttons instead). Accessory views can display persistent features like media playback.

```swift
// Tab bar implementation with iOS 26 features
// [Source: Claude Doc 1]
struct FinanceAppTabView: View {
    @State private var selectedTab = 0
    @State private var searchText = ""
    
    var body: some View {
        TabView(selection: $selectedTab) {
            Tab("Accounts", systemImage: "building.columns", value: 0) {
                NavigationStack {
                    AccountsView()
                }
            }
            
            Tab("Transactions", systemImage: "list.bullet.rectangle", value: 1) {
                NavigationStack {
                    TransactionsView()
                }
            }
            
            Tab("Analytics", systemImage: "chart.line.uptrend.xyaxis", value: 2) {
                NavigationStack {
                    AnalyticsView()
                }
            }
            
            // Search tab with special role
            Tab("Search", systemImage: "magnifyingglass", value: 3, role: .search) {
                NavigationStack {
                    SearchView(searchText: $searchText)
                }
            }
            
            Tab("Settings", systemImage: "gear", value: 4) {
                NavigationStack {
                    SettingsView()
                }
            }
        }
        .searchable(text: $searchText)
        .tabBarMinimizeBehavior(.onScrollDown)  // Shrinks on scroll
        .tabViewBottomAccessory {
            // Persistent accessory (e.g., quick transfer)
            if selectedTab == 0 {
                QuickTransferAccessory()
            }
        }
    }
}
```

#### Navigation Bar

The navigation bar provides context, navigation history, and screen-specific actions. It appears at the top of the screen and includes the title (clearly identifying the current screen), back button (returns to previous screen with previous screen's title), and trailing actions (screen-specific controls using SF Symbols).

**iOS 26 Enhancements** include Liquid Glass material for adaptive translucency, content extending beneath for an immersive feel, and scroll edge effects replacing hard dividers.

```swift
// Navigation bar with toolbar
// [Source: Claude Doc 1]
struct TransactionDetailView: View {
    let transaction: Transaction
    @Environment(\.dismiss) var dismiss
    
    var body: some View {
        ScrollView {
            // Content
        }
        .navigationTitle("Transaction")
        .navigationBarTitleDisplayMode(.large)
        .toolbar {
            ToolbarItem(placement: .cancellationAction) {
                Button("Close", systemImage: "xmark") {
                    dismiss()
                }
            }
            
            ToolbarItem(placement: .confirmationAction) {
                Button("Share", systemImage: "square.and.arrow.up") {
                    shareTransaction()
                }
                .buttonStyle(.glassProminent)
            }
        }
    }
}
```

#### Toolbar

Toolbars provide quick access to frequently used actions for the current screen or view. On iOS, toolbars typically appear at the bottom of the screen for comfortable thumb reach. On iPadOS, they may appear at top or bottom depending on context. On macOS, they appear at the top of the window below the title bar.

**Organization** requires grouping related actions using shared Liquid Glass backgrounds. The primary action should remain separate and tinted (often blue checkmark or text button). Use SF Symbols for clarity and consistency.

**Best Practices** include including only essential, frequently-used actions with a maximum of 5-6 actions to avoid crowding. Label actions clearly with symbols or short text.

#### Sidebar

Sidebars organize primary navigation in hierarchical structures and are particularly useful on iPad and Mac.

**iOS 26 Design** features sidebars inset from the edge with rounded corners, built with Liquid Glass for translucent appearance, and content flowing behind the sidebar for immersion.

**Behavior** on iPad includes persistent display in landscape with collapsibility in portrait. The sidebar is accessible via a button when hidden. It refracts underlying content while reflecting wallpaper and surroundings.

```swift
// Sidebar navigation for iPad
// [Source: Claude Doc 1]
struct FinanceNavigationView: View {
    @State private var selectedAccount: Account?
    @State private var selectedTransaction: Transaction?
    
    var body: some View {
        NavigationSplitView {
            // Sidebar: Account list
            List(accounts, selection: $selectedAccount) { account in
                NavigationLink(value: account) {
                    AccountRow(account: account)
                }
            }
            .navigationTitle("Accounts")
            .backgroundExtensionEffect()
        } content: {
            // Middle column: Transactions for selected account
            if let account = selectedAccount {
                TransactionListView(account: account, selection: $selectedTransaction)
            } else {
                ContentUnavailableView("Select an Account", 
                    systemImage: "building.columns")
            }
        } detail: {
            // Detail: Transaction details
            if let transaction = selectedTransaction {
                TransactionDetailView(transaction: transaction)
            } else {
                ContentUnavailableView("Select a Transaction",
                    systemImage: "doc.text")
            }
        }
    }
}
```

#### Modal Presentation

Modals present temporary, focused tasks separate from the main navigation flow.

**Types of Modal Tasks** include simple tasks (single-action like selecting item or confirming choice), multi-step tasks (guided workflow like composing message or creating event), and full-screen tasks (immersive experience like photo editing or media viewing).

**iOS 26 Presentation** uses modal sheets with rounded top corners that slide up from the bottom of the screen. Users dismiss via downward swipe or explicit cancel/done actions.

**Design Guidelines** require each modal to represent a single, self-contained task. Provide a clear completion action (Done, Send, Save) and offer a cancel or close option. Avoid deep navigation within modals and limit modals over modals to prevent jarring experiences.

```swift
// Sheet presentations
// [Source: Claude Doc 1]

// Partial height sheet (floats with Liquid Glass)
.sheet(isPresented: $showTransferSheet) {
    TransferView()
        .presentationDetents([.medium, .large])
        .presentationDragIndicator(.visible)
        .presentationCornerRadius(20)
}

// Full screen cover (no glass, opaque)
.fullScreenCover(isPresented: $showOnboarding) {
    OnboardingView()
}

// Popover (automatic glass)
.popover(isPresented: $showInfo) {
    InfoView()
        .frame(width: 300, height: 200)
}
```

### Content Organization

Content organization guides people to what matters most and helps them understand what they are viewing.

#### Lists and Tables

Lists and tables organize structured information for easy scanning and interaction.

**List Types** include simple lists (single line of text per row), subtitle lists (primary text with secondary detail), value lists (label-value pairs), and custom lists (icons, thumbnails, and rich content).

**Interactive States** include selection (highlighted background with checkmark), swipe actions (contextual actions revealed by swiping), edit mode (reorder handles and batch operations), and loading states (reduced opacity with spinner).

**Design Guidelines** recommend consistent row heights to improve scannability, adequate padding (16pt horizontal is typical), sparing use of separators (group related items instead), and pull-to-refresh support for dynamic content.

```swift
// List with swipe actions
// [Source: Claude Doc 1]
List(transactions) { transaction in
    TransactionRow(transaction: transaction)
        .swipeActions(edge: .trailing, allowsFullSwipe: true) {
            Button(role: .destructive) {
                deleteTransaction(transaction)
            } label: {
                Label("Delete", systemImage: "trash")
            }
            
            Button {
                flagTransaction(transaction)
            } label: {
                Label("Flag", systemImage: "flag")
            }
            .tint(.orange)
        }
        .swipeActions(edge: .leading) {
            Button {
                markAsRead(transaction)
            } label: {
                Label("Read", systemImage: "envelope.open")
            }
            .tint(.blue)
        }
}
```

#### Progressive Disclosure

Progressive disclosure shows only essential information upfront, then reveals additional details on interaction. This reduces initial complexity, maintains focus on primary tasks, prevents overwhelming users with choices, and improves discoverability of secondary features.

**Implementation** includes disclosure controls (chevrons) to indicate expandable content, expandable sections that start collapsed with a summary visible, "Show More" links to reveal additional content, and advanced settings hidden until needed.

#### Content Grouping Strategies

Content can be grouped in several effective ways:

- **By Time:** Recent, Today, This Week, Older (ideal for transaction history, notifications)
- **By Progress:** Active, Completed, Archived (ideal for task management)
- **By Pattern:** Related items, Recommendations (ideal for discovery features)
- **By Priority:** Important, Normal, Low (ideal for task lists)
- **By Status:** Active, Pending, Failed (ideal for transactions, orders)

### Search

Search helps users find specific content quickly and is prominently featured in iOS 26 with a dedicated tab bar role.

**iOS 26 Updates** include a dedicated Search tab in the tab bar for prominent access, global availability across the app, and reduced navigation friction for discovery.

**Search Field Design** uses Liquid Glass appearance for consistency. Placeholder text describes searchable content. A clear button appears when text is entered. An optional cancel button allows dismissing search.

**Search Results** should display as content appears using live search, organized by relevance or category with matching terms highlighted. A "no results" state with helpful suggestions improves the experience.

### Modality & Focus

#### Alerts

Alerts interrupt the current flow to convey important information. They consist of a title (concise description of the situation), message (additional context or consequences), and buttons (1-3 actions, often OK/Cancel or Yes/No).

**Best Practices** require using alerts sparingly only for truly important information. Make consequences clear. Display destructive actions in red. The default button should be the safest option.

#### Action Sheets

Action sheets present a set of options related to a specific context. In iOS 26, they originate from the element that initiates them, creating spatial context. They slide up from bottom on iOS and appear as popovers on iPad.

```swift
// Action sheet with spatial context
// [Source: Claude Doc 2]
@State var showAccountActions = false

Button("More Options") {
    showAccountActions = true
}
.confirmationDialog(
    "Account Actions",
    isPresented: $showAccountActions,
    presenting: account,
    actions: { account in
        Button("View Details") { viewDetails(account) }
        Button("Freeze Account") { freeze(account) }
        Button("Report Issue") { reportIssue(account) }
        Button("Close", role: .cancel) { }
    },
    message: { account in
        Text("What would you like to do with \(account.name)?")
    }
)
```

#### Context Menus

Context menus provide quick access to actions related to a specific item. They are activated by long press on iOS, right-click on macOS, or two-finger tap on trackpad.

**Organization** places the most common actions first with related actions grouped using separators. Destructive actions appear at the bottom. Limit to 5-8 actions maximum.

---

## Components & Controls

### Buttons

Buttons initiate actions and come in several styles for different emphasis levels.

**Filled/Prominent Buttons** have the highest emphasis for primary actions. They use Liquid Glass material with a tinted background and should be used sparingly, typically one per screen.

**Glass Buttons** provide standard emphasis for secondary actions. They use the standard Liquid Glass appearance without additional tinting.

**Plain Buttons** have the lowest emphasis for tertiary actions. They are text-only, often in the accent color, and used for less critical actions.

```swift
// Button styles
// [Source: Claude Doc 1]

// Primary action - prominent glass
Button("Complete Transfer") {
    completeTransfer()
}
.buttonStyle(.glassProminent)
.tint(.blue)
.controlSize(.large)

// Secondary action - standard glass
Button("Cancel") {
    dismiss()
}
.buttonStyle(.glass)

// Destructive action
Button("Delete Account", role: .destructive) {
    deleteAccount()
}
.buttonStyle(.glassProminent)
.tint(.red)

// Icon button with adequate touch target
Button {
    showInfo()
} label: {
    Image(systemName: "info.circle")
}
.buttonStyle(.glass)
.buttonBorderShape(.circle)
.frame(width: 44, height: 44)  // Minimum touch target
```

**Button States** must be clearly indicated: Default (normal appearance), Highlighted (pressed or touched state with glow effect), Selected (current choice in a set), and Disabled (reduced opacity, non-interactive).

### Switches and Toggles

Switches toggle between two mutually exclusive states. iOS 26 updates include Liquid Glass material with reflections and brightness, smooth fluid animation on state change, and enhanced tactile feedback.

**Design Guidelines** require including a descriptive label adjacent to the switch. The default state should be the most common or safest option. Changes take effect immediately without requiring a save action.

```swift
// Toggle implementation
Toggle("Enable Notifications", isOn: $notificationsEnabled)
    .toggleStyle(.switch)
```

### Sliders

Sliders select a value from a continuous range. iOS 26 design includes fluid glass effect on track and thumb with smooth, responsive dragging interaction.

**Best Practices** recommend using sliders for values where precision is less critical. Provide current value display when helpful. Consider steppers for precise value entry.

```swift
// Slider with labels and value display
// [Source: Claude Doc 1]
VStack {
    Slider(value: $riskTolerance, in: 0...100, step: 1) {
        Text("Risk Tolerance")
    } minimumValueLabel: {
        Text("Low")
    } maximumValueLabel: {
        Text("High")
    }
    
    Text("\(Int(riskTolerance))%")
        .font(.headline)
}
```

### Pickers

Pickers let users select from a set of values in various styles.

```swift
// Segmented control for options
Picker("Time Range", selection: $selectedRange) {
    Text("1D").tag(TimeRange.day)
    Text("1W").tag(TimeRange.week)
    Text("1M").tag(TimeRange.month)
    Text("1Y").tag(TimeRange.year)
    Text("All").tag(TimeRange.all)
}
.pickerStyle(.segmented)

// Menu picker for selection
Picker("Account", selection: $selectedAccount) {
    ForEach(accounts) { account in
        Text(account.name).tag(account)
    }
}
.pickerStyle(.menu)

// Date picker
DatePicker("Transaction Date",
    selection: $transactionDate,
    in: ...Date.now,
    displayedComponents: [.date]
)
.datePickerStyle(.compact)
```

### Text Fields

Text fields accept text input from users.

```swift
// Text field variations
// [Source: Claude Doc 1]

// Standard text field
TextField("Account Name", text: $accountName)
    .textFieldStyle(.roundedBorder)
    .textContentType(.name)

// Currency input
TextField("Amount", value: $amount, format: .currency(code: "USD"))
    .keyboardType(.decimalPad)
    .textFieldStyle(.roundedBorder)

// Secure field for sensitive data
SecureField("PIN", text: $pin)
    .keyboardType(.numberPad)
    .textContentType(.oneTimeCode)

// Search field
TextField("Search transactions", text: $searchText)
    .textFieldStyle(.roundedBorder)
    .submitLabel(.search)
    .onSubmit { performSearch() }
```

### Progress Indicators

Progress indicators show that a task is in progress.

```swift
// Determinate progress
ProgressView("Uploading...", value: uploadProgress, total: 100)
    .progressViewStyle(.linear)

// Indeterminate progress
ProgressView()
    .progressViewStyle(.circular)

// Gauge for scores/health indicators
Gauge(value: portfolioScore, in: 0...100) {
    Text("Score")
} currentValueLabel: {
    Text("\(Int(portfolioScore))")
} minimumValueLabel: {
    Text("0")
} maximumValueLabel: {
    Text("100")
}
.gaugeStyle(.accessoryCircular)
.tint(portfolioScore > 70 ? .green : portfolioScore > 40 ? .yellow : .red)
```

---

## Input Methods

### Touch Gestures

iOS supports a rich vocabulary of touch gestures. Standard gestures include tap (primary selection), double tap (zoom or secondary action), long press (context menu), swipe (navigation or reveal actions), pinch (zoom), and rotate (rotation of content).

**Design Considerations** require providing visible affordances for gesture-enabled content, offering alternatives for all gestures (some users cannot perform complex gestures), and ensuring adequate touch target sizes of 44×44pt minimum.

### Keyboard Input

**Keyboard Types** should match the expected input. Default provides the standard keyboard. Email makes @ and . easily accessible. URL makes .com and / accessible. Number pad shows numbers only. Phone pad shows numbers with phone-specific characters.

**Return Key Customization** with `.submitLabel()` sets appropriate text: `.search` for search fields, `.done` for completion, `.next` for multi-field forms, `.send` for messaging.

### Voice and Siri

Apps can integrate with Siri through SiriKit for voice-activated features. Design considerations include providing clear, speakable labels and supporting common voice interactions for your app's domain.

---

## Technologies

### Generative AI Integration

Apple's Generative AI design guidance emphasizes responsible and transparent use.

**Design Responsibly** by considering both direct and indirect impacts of AI features. Provide clear benefits and allow users to opt out or revert changes. Always offer non-AI fallbacks for essential tasks and avoid letting AI actions override user control.

**Inclusivity and Bias** require using diverse, representative training data. Avoid reinforcing stereotypes. Provide content warnings or filters to prevent offensive or inappropriate output. When AI generates content, present multiple options and let users choose or refine results.

**Privacy and Transparency** prefer on-device processing. Ask permission before using personal data. Clearly disclose how models use data and how long data is retained. Warn users about possible hallucinations and encourage them to verify AI output.

**User Guidance** helps users craft effective prompts. Provide suggestions when the model is stuck and explain limitations. Guide users to refine their requests for better results.

### Apple Intelligence Features

iOS 26 deeply integrates Apple Intelligence capabilities including Genmoji (custom emoji from text descriptions), Image Playground (generate custom images), Visual Intelligence (identify objects via camera), and Live Translation (real-time message translation).

**Design Considerations** require clearly communicating when AI is generating or assisting, maintaining user control over AI features, and providing transparency about AI capabilities and limitations.

### Widgets

Widgets provide glanceable information on Home Screen and Lock Screen.

**iOS 26 Updates** include multi-layer icons with Liquid Glass for depth, dynamic lighting effects based on movement, and enhanced customization options including light, dark, and tinted modes.

**Widget Families** include Small (2×2 grid spaces), Medium (4×2 grid spaces), Large (4×4 grid spaces), and Extra Large (iPad only, 4×8 grid spaces).

**Design Guidelines** require showing the most important information, updating content appropriately, having taps open the app to relevant content, and supporting all widget sizes if possible.

### Live Activities

Live Activities display real-time information on Lock Screen and Dynamic Island for use cases like sports scores, delivery tracking, ride sharing status, timers, and music playback.

**iOS 26 Design** uses Liquid Glass material for glanceable cards that adapt tint based on ambient brightness with a relaxed appearance in dark environments.

---

## App Icons

iOS 26 introduces a completely reimagined approach to app icons based on Liquid Glass material properties and layered design techniques.

### Dynamic and Expressive Icons

Icons are no longer static. They respond to device orientation through gyroscope-enabled dynamic lighting. They display dynamic lighting effects based on device tilt. They adapt to wallpaper with colors that interact with the home screen. They include specular highlights that add sophistication. They create depth with multiple layers working with material effects.

### Layering Architecture

Icons are composed of background plus foreground layers. Multiple foreground layers can be stacked for dimensional designs. Layers support translucency, shadows, and depth effects.

### Appearance Modes

Icons support multiple appearance modes including Light Mode (standard appearance with Liquid Glass effects), Dark Mode (automatically adapted for dark environments), Dark Tint (adds color to foreground elements), Light Tint (infuses color directly into glass material), and Monochrome Glass (light or dark translucent treatment).

### Icon Design Guidelines

**Embrace Layering** by using multiple stacked layers to create true dimensionality. Avoid flat 2D perspectives that compete with material effects. Use frontal views that complement glass materiality.

**Leverage Translucency** by applying translucency and blur to add depth. This works beautifully across light, dark, and transparent modes. Wallpaper visible through translucent layers creates richness.

**Simplify Design** by reducing overlapping elements to let material effects shine. Remove baked-in shadows, bevels, and effects. Let the system provide sophistication through Liquid Glass.

**Optimize for Scale** by avoiding sharp edges and thin lines. Use rounder corners for seamless light travel. Use bolder line weights to preserve detail at small sizes.

**Background Considerations** include using soft light-to-dark gradients that harmonize with lighting, applying System Light/Dark gradients instead of pure white/black, and preferring colored backgrounds for better mode distinction.

### Icon Composer Tool

Apple's Icon Composer enables efficient icon creation with capabilities to create icons for all Apple platforms, support for multi-layer icon format, adjustment of Liquid Glass properties, preview with dynamic lighting effects, annotation across appearance modes, export of flattened versions for marketing, and seamless Xcode integration.

---

## SwiftUI Implementation Reference

### Liquid Glass Core API

```swift
// Core glass effect modifier signature
// [Source: Claude Doc 1]
func glassEffect<S: Shape>(
    _ glass: Glass = .regular,
    in shape: S = DefaultGlassEffectShape,
    isEnabled: Bool = true
) -> some View

// CRITICAL: Apply .glassEffect() LAST in your modifier chain
```

### Glass Types and Modifiers

```swift
// Glass material types
Glass.regular              // Default adaptive glass
Glass.clear                // High transparency for media backgrounds
Glass.identity             // No effect (for conditional toggling)

// Glass modifiers
.tint(_ color: Color)      // Semantic coloring for meaning
.interactive()             // Touch feedback effects
```

### Interactive Glass Effects

```swift
// Interactive glass enables enhanced touch feedback
// [Source: Claude Doc 1]
Button("View Details") { }
    .glassEffect(.regular.interactive())
// Enables: scaling on press, bouncing animation, shimmering effect,
// touch-point illumination that radiates to nearby glass elements

// Combined with tint for primary actions
Button("Confirm Payment") { }
    .glassEffect(.regular.tint(.green).interactive())
```

### Custom Shapes for Glass

```swift
// Shape options for glass effects
// [Source: Claude Doc 1]

// Capsule (default) - ideal for buttons
.glassEffect(.regular, in: .capsule)

// Circle - for icon buttons
.glassEffect(.regular, in: .circle)

// Rounded Rectangle with specific radius
.glassEffect(.regular, in: RoundedRectangle(cornerRadius: 16))

// Container-concentric (aligns with parent container corners)
.glassEffect(.regular, in: .rect(cornerRadius: .containerConcentric))
```

### Button Styles

```swift
// Glass button styles
// [Source: Claude Doc 1]

// Standard glass button (secondary actions)
Button("Cancel") { }
    .buttonStyle(.glass)

// Prominent glass button (primary actions)
Button("Complete Transaction") { }
    .buttonStyle(.glassProminent)
    .tint(.blue)

// Control sizes available: .mini, .small, .regular, .large, .extraLarge
Button("Transfer") { }
    .buttonStyle(.glassProminent)
    .controlSize(.large)
    .buttonBorderShape(.capsule)
```

### GlassEffectContainer

GlassEffectContainer is critical for performance optimization when using multiple glass elements. It combines multiple Liquid Glass shapes into a unified composition, sharing sampling regions for improved rendering and enabling morphing transitions.

```swift
// EFFICIENT - Shared sampling region, enables morphing
// [Source: Claude Doc 1]
GlassEffectContainer {
    HStack(spacing: 20) {
        Button("Buy") { }
            .buttonStyle(.glassProminent)
            .tint(.green)
        
        Button("Sell") { }
            .buttonStyle(.glassProminent)
            .tint(.red)
        
        Button("Hold") { }
            .buttonStyle(.glass)
    }
}

// INEFFICIENT - Each element samples independently (avoid this)
HStack(spacing: 20) {
    Button("Buy") { }.glassEffect()
    Button("Sell") { }.glassEffect()
}
```

### Morphing Transitions with glassEffectID

```swift
// Morphing transitions between states
// [Source: Claude Doc 1]
struct ExpandableActionsView: View {
    @State private var isExpanded = false
    @Namespace private var namespace
    
    var body: some View {
        GlassEffectContainer(spacing: 30) {
            VStack(spacing: 12) {
                if isExpanded {
                    Button("Transfer") { }
                        .glassEffect()
                        .glassEffectID("transfer", in: namespace)
                    
                    Button("Pay Bills") { }
                        .glassEffect()
                        .glassEffectID("bills", in: namespace)
                }
                
                Button {
                    withAnimation(.bouncy) {
                        isExpanded.toggle()
                    }
                } label: {
                    Image(systemName: isExpanded ? "xmark" : "plus")
                        .frame(width: 56, height: 56)
                }
                .buttonStyle(.glassProminent)
                .buttonBorderShape(.circle)
                .glassEffectID("toggle", in: namespace)
            }
        }
    }
}
```

**Requirements for morphing transitions:**
1. Elements must be in the same `GlassEffectContainer`
2. Each view needs `glassEffectID` with shared namespace
3. Views conditionally shown/hidden trigger morphing
4. Animation must be applied to state changes

### Tab View APIs

```swift
// iOS 26 Tab View features
.tabBarMinimizeBehavior(.onScrollDown)  // Tab bar shrinks on scroll
.tabViewBottomAccessory { }              // Persistent bottom accessory
Tab("Name", systemImage: "icon", role: .search)  // Search tab role
```

### Effect Modifiers

```swift
// Additional effect modifiers
.backgroundExtensionEffect()                    // Extend content behind navigation
.scrollEdgeEffectStyle(.hard, for: .top)       // Scroll edge effect style
GlassEffectContainer { }                        // Container for multiple glass elements
GlassEffectContainer(spacing: CGFloat) { }     // With morphing threshold
```

---

## Data Visualization

### Swift Charts Implementation

Swift Charts provides powerful data visualization capabilities. Finance applications particularly benefit from line charts, area charts, bar charts, and pie/donut charts.

```swift
// Stock price line chart with area fill
// [Source: Claude Doc 1]
import Charts

struct StockChartView: View {
    let priceData: [PricePoint]
    @State private var selectedPoint: PricePoint?
    
    var body: some View {
        Chart(priceData) { point in
            // Area underneath the line
            AreaMark(
                x: .value("Date", point.date),
                y: .value("Price", point.price)
            )
            .foregroundStyle(
                LinearGradient(
                    colors: [.blue.opacity(0.3), .blue.opacity(0.0)],
                    startPoint: .top,
                    endPoint: .bottom
                )
            )
            
            // Line mark
            LineMark(
                x: .value("Date", point.date),
                y: .value("Price", point.price)
            )
            .foregroundStyle(.blue)
            .lineStyle(StrokeStyle(lineWidth: 2))
            
            // Selected point indicator
            if let selected = selectedPoint, selected.id == point.id {
                PointMark(
                    x: .value("Date", point.date),
                    y: .value("Price", point.price)
                )
                .foregroundStyle(.blue)
                .symbolSize(100)
            }
        }
        .chartXAxis {
            AxisMarks(values: .stride(by: .month)) { value in
                AxisValueLabel(format: .dateTime.month(.abbreviated))
            }
        }
        .chartYAxis {
            AxisMarks(position: .leading) { value in
                AxisValueLabel {
                    if let price = value.as(Double.self) {
                        Text(price, format: .currency(code: "USD"))
                    }
                }
            }
        }
        .chartXSelection(value: $selectedPoint)
        .chartScrollableAxes(.horizontal)
        .frame(height: 200)
    }
}
```

### Portfolio Allocation Chart

```swift
// Donut chart for portfolio allocation
// [Source: Claude Doc 1]
struct AllocationChartView: View {
    let allocations: [Allocation]
    
    var body: some View {
        Chart(allocations) { allocation in
            SectorMark(
                angle: .value("Amount", allocation.percentage),
                innerRadius: .ratio(0.6),  // Donut style
                angularInset: 2
            )
            .foregroundStyle(by: .value("Category", allocation.name))
            .cornerRadius(4)
        }
        .chartLegend(position: .bottom, alignment: .center)
        .chartForegroundStyleScale([
            "Stocks": .blue,
            "Bonds": .green,
            "Real Estate": .orange,
            "Cash": .gray,
            "Crypto": .purple
        ])
        .frame(height: 250)
    }
}
```

### Chart Accessibility

Charts must be accessible to VoiceOver users through `AXChartDescriptor`.

```swift
// Chart accessibility implementation
// [Source: Claude Doc 1]
Chart(data) { item in
    LineMark(x: .value("Date", item.date), y: .value("Price", item.price))
}
.accessibilityLabel("Stock price chart")
.accessibilityValue("Shows price trend from \(startDate) to \(endDate)")
.accessibilityChartDescriptor(StockChartDescriptor(data: data))

// Custom chart descriptor for detailed audio description
struct StockChartDescriptor: AXChartDescriptorRepresentable {
    let data: [PricePoint]
    
    func makeChartDescriptor() -> AXChartDescriptor {
        let xAxis = AXNumericDataAxisDescriptor(
            title: "Date",
            range: Double(data.first!.date.timeIntervalSince1970)...Double(data.last!.date.timeIntervalSince1970),
            gridlinePositions: []
        ) { value in 
            "\(Date(timeIntervalSince1970: value).formatted(date: .abbreviated, time: .omitted))" 
        }
        
        let yAxis = AXNumericDataAxisDescriptor(
            title: "Price",
            range: data.map(\.price).min()!...data.map(\.price).max()!,
            gridlinePositions: []
        ) { value in "$\(value.formatted())" }
        
        let series = AXDataSeriesDescriptor(
            name: "Stock Price",
            isContinuous: true,
            dataPoints: data.map { 
                .init(x: $0.date.timeIntervalSince1970, y: $0.price) 
            }
        )
        
        return AXChartDescriptor(
            title: "Stock Price Over Time",
            summary: "Line chart showing stock price trend",
            xAxis: xAxis,
            yAxis: yAxis,
            additionalAxes: [],
            series: [series]
        )
    }
}
```

---

## Financial Application Design Patterns

This section provides specialized guidance for financial applications, integrating iOS 26 design principles with the unique requirements of finance, banking, and investment apps.

### Information Architecture for Finance Apps

Financial apps should follow a clear, simple structure that prioritizes user confidence and quick access to critical information.

```
Financial App Structure
│
├─ Dashboard / Home (Primary Section)
│  ├─ Account Balance Overview (Most Prominent)
│  ├─ Recent Transactions (Last 5-10)
│  └─ Quick Actions (Transfer, Pay Bill, Invest)
│
├─ Accounts (Secondary Section)
│  ├─ Checking
│  ├─ Savings
│  └─ Investments
│
├─ Send Money (Secondary Section)
│  ├─ Between Own Accounts
│  ├─ Pay Bills
│  └─ Send to People
│
├─ Investments (Secondary Section)
│  ├─ Portfolio Overview
│  ├─ Holdings
│  └─ Market Data
│
└─ Settings (Utility Section)
   ├─ Profile
   ├─ Preferences
   ├─ Security
   └─ About
```

### Financial Data Display

Financial values require careful typography and color treatment to communicate meaning clearly.

```swift
// Positive/negative value indicators
// [Source: Claude Doc 1]
struct ValueChangeView: View {
    let change: Double
    
    var body: some View {
        HStack {
            Image(systemName: change >= 0 ? "arrow.up.right" : "arrow.down.right")
            Text(String(format: "%+.2f%%", change))
        }
        .foregroundStyle(change >= 0 ? Color.green : Color.red)
        .accessibilityLabel(change >= 0 ? "Up \(abs(change)) percent" : "Down \(abs(change)) percent")
    }
}

// Currency display with proper formatting
Text(amount, format: .currency(code: "USD"))
    .font(.title)
    .fontWeight(.medium)
    .monospacedDigit()  // Ensures digits align in columns
```

### Chart Color Palette for Finance

```swift
// Recommended chart colors for portfolio allocation
// [Source: Claude Doc 1]
let chartColors: [Color] = [
    .blue,      // Stocks
    .green,     // Bonds
    .orange,    // Real Estate
    .purple,    // Crypto
    .teal,      // Cash
    .indigo     // Other
]
```

### Complete Portfolio View Example

```swift
// Comprehensive portfolio view implementation
// [Source: Claude Doc 1]
struct PortfolioView: View {
    @State private var timeRange: TimeRange = .month
    @State private var portfolioData: [PortfolioPoint] = []
    @Namespace private var namespace
    
    var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Total Balance Card
                VStack(alignment: .leading, spacing: 8) {
                    Text("Total Balance")
                        .font(.subheadline)
                        .foregroundStyle(.secondary)
                    
                    Text("$125,430.87")
                        .font(.largeTitle)
                        .fontWeight(.bold)
                        .monospacedDigit()
                        .accessibilityLabel("Total balance")
                        .accessibilityValue("$125,430.87")
                    
                    HStack {
                        Image(systemName: "arrow.up.right")
                        Text("+$2,340.00 (1.9%)")
                    }
                    .font(.headline)
                    .foregroundStyle(.green)
                    .accessibilityElement(children: .combine)
                    .accessibilityLabel("Up $2,340, or 1.9 percent today")
                }
                .frame(maxWidth: .infinity, alignment: .leading)
                .padding()
                
                // Time Range Picker
                Picker("Time Range", selection: $timeRange) {
                    Text("1D").tag(TimeRange.day)
                    Text("1W").tag(TimeRange.week)
                    Text("1M").tag(TimeRange.month)
                    Text("1Y").tag(TimeRange.year)
                    Text("All").tag(TimeRange.all)
                }
                .pickerStyle(.segmented)
                .padding(.horizontal)
                
                // Portfolio Chart
                Chart(portfolioData) { point in
                    AreaMark(
                        x: .value("Date", point.date),
                        y: .value("Value", point.value)
                    )
                    .foregroundStyle(
                        LinearGradient(
                            colors: [.blue.opacity(0.3), .clear],
                            startPoint: .top,
                            endPoint: .bottom
                        )
                    )
                    
                    LineMark(
                        x: .value("Date", point.date),
                        y: .value("Value", point.value)
                    )
                    .foregroundStyle(.blue)
                }
                .chartYAxis {
                    AxisMarks(position: .leading) { value in
                        AxisValueLabel {
                            if let v = value.as(Double.self) {
                                Text(v, format: .currency(code: "USD").notation(.compactName))
                            }
                        }
                    }
                }
                .frame(height: 200)
                .padding()
                
                // Holdings List
                VStack(alignment: .leading, spacing: 12) {
                    Text("Holdings")
                        .font(.headline)
                        .padding(.horizontal)
                    
                    ForEach(holdings) { holding in
                        HoldingRow(holding: holding)
                    }
                }
            }
        }
        .navigationTitle("Portfolio")
        .toolbar {
            ToolbarItem(placement: .topBarTrailing) {
                GlassEffectContainer {
                    HStack(spacing: 8) {
                        Button("Add", systemImage: "plus") { }
                            .glassEffect()
                            .glassEffectID("add", in: namespace)
                        
                        Button("Transfer", systemImage: "arrow.left.arrow.right") { }
                            .buttonStyle(.glassProminent)
                            .tint(.blue)
                            .glassEffectID("transfer", in: namespace)
                    }
                }
            }
        }
    }
}

struct HoldingRow: View {
    let holding: Holding
    
    var body: some View {
        HStack {
            VStack(alignment: .leading, spacing: 4) {
                Text(holding.symbol)
                    .font(.headline)
                Text(holding.name)
                    .font(.subheadline)
                    .foregroundStyle(.secondary)
            }
            
            Spacer()
            
            VStack(alignment: .trailing, spacing: 4) {
                Text(holding.value, format: .currency(code: "USD"))
                    .font(.headline)
                    .monospacedDigit()
                
                HStack(spacing: 4) {
                    Image(systemName: holding.change >= 0 ? "arrow.up.right" : "arrow.down.right")
                    Text(holding.change, format: .percent.precision(.fractionLength(2)))
                }
                .font(.subheadline)
                .foregroundStyle(holding.change >= 0 ? .green : .red)
            }
        }
        .padding()
        .background(Color(.secondarySystemBackground))
        .clipShape(RoundedRectangle(cornerRadius: 12))
        .padding(.horizontal)
        .accessibilityElement(children: .combine)
        .accessibilityLabel("\(holding.name), \(holding.symbol)")
        .accessibilityValue("\(holding.value.formatted(.currency(code: "USD"))), \(holding.change >= 0 ? "up" : "down") \(abs(holding.change).formatted(.percent))")
    }
}
```

### Security Considerations for Finance Apps

Financial applications have additional security requirements. Use `SecureField` for sensitive data entry. Support biometric authentication through Face ID and Touch ID. Implement session timeouts for sensitive operations. Provide clear feedback for security-related actions. Never store sensitive data in plain text.

---

## Platform Considerations

### Platform Compatibility

| Platform | Minimum Version |
|----------|-----------------|
| iOS | 26.0 |
| iPadOS | 26.0 |
| macOS | Tahoe (26.0) |
| watchOS | 26.0 |
| tvOS | 26.0 |
| visionOS | 26.0 |

### Development Requirements

- Xcode 26.0 or later
- Device Support: iPhone 11 / iPhone SE (2nd generation) or later

### iPhone Considerations

Single-column vertical layouts are standard. Tab bar at bottom is the primary navigation pattern. Content should be optimized for one-handed use when possible. Support both portrait and landscape orientations.

### iPad Considerations

Multi-column layouts with sidebars and split views are expected. Sidebars are persistent in landscape and collapsible in portrait. Support for pointer/trackpad interactions is important. Design for various Split View configurations where the app should function at any width.

### Mac (Catalyst/Native) Considerations

Expansive canvas with flexible sidebars and toolbars. Menu bar integration for productivity apps. Keyboard shortcuts support is essential. Window resizing and multiple window support should be considered.

### Performance Considerations for Liquid Glass

Liquid Glass is hardware-accelerated but requires performance consideration. Avoid layering many glass effects on top of each other. Use `GlassEffectContainer` for multiple overlapping effects to optimize rendering. Profile your app on real devices to ensure smooth 60fps performance. Test on both high-end and budget devices. Monitor memory usage with heavy glass effects. Combine effects strategically rather than applying them individually.

---

## Design Resources & Tools

### Apple Design Resources

Apple provides comprehensive design resources including UI kits for Sketch, Figma, and Adobe XD with iOS 26 components, production templates for app icons and launch screens, SF Symbols app for browsing and customizing symbols, and Icon Composer for creating layered app icons.

### SF Symbols App

The SF Symbols app allows browsing and searching the symbol library, previewing symbols in different weights and scales, exporting symbols for customization, and creating custom symbols matching system style.

### Xcode Accessibility Inspector

Xcode includes tools for testing accessibility including a Color Contrast Calculator to calculate contrast ratios and verify WCAG compliance, and an Accessibility Audit to scan interfaces for common issues.

### Testing and Validation

**Device Testing** should verify across actual devices including iPhone, iPad, and Mac. Test across different display sizes and resolutions. Validate with various accessibility settings enabled. Ensure performance and responsiveness.

**Simulator Testing** enables quick iteration during development. Test multiple devices without hardware. Simulate accessibility settings. Preview Light/Dark Mode switching.

**Beta Testing** through TestFlight gathers real-world feedback, identifies edge cases and usability issues, and validates design decisions with users.

---

## Quick API Reference Card

### Liquid Glass Core Modifiers

```swift
.glassEffect()
.glassEffect(_ glass: Glass, in: some Shape, isEnabled: Bool)
.glassEffectID<ID: Hashable>(_ id: ID, in: Namespace.ID)
.glassEffectUnion<ID: Hashable>(id: ID, namespace: Namespace.ID)
.glassEffectTransition(_ transition: GlassEffectTransition)
```

### Glass Types

```swift
Glass.regular              // Default adaptive
Glass.clear                // High transparency
Glass.identity             // No effect

// Modifiers
.tint(_ color: Color)      // Semantic coloring
.interactive()             // Touch effects
```

### Button Styles

```swift
.buttonStyle(.glass)            // Secondary actions
.buttonStyle(.glassProminent)   // Primary actions
```

### Tab View

```swift
.tabBarMinimizeBehavior(.onScrollDown)
.tabViewBottomAccessory { }
Tab("Name", systemImage: "icon", role: .search)
```

### Effects

```swift
.backgroundExtensionEffect()
.scrollEdgeEffectStyle(.hard, for: .top)
GlassEffectContainer { }
GlassEffectContainer(spacing: CGFloat) { }
```

---

## Appendix A: Source Discrepancies & Notes

This appendix documents discrepancies found across the source documents used to compile this guide. Where conflicts existed, the Claude-generated documents were given priority as specified, and the most common or likely correct version was selected for the main guide.

### Button Style API Names

Different source documents used varying naming conventions for button styles:

| Source | API Names Used |
|--------|---------------|
| ChatGPT PDF | `GlassButtonStyle`, `GlassProminentButtonStyle` (explicit struct names) |
| Claude Doc 1 | `.buttonStyle(.glass)`, `.buttonStyle(.glassProminent)` |
| Claude Doc 2 | `.buttonStyle(.glass)`, `.buttonStyle(.glassProminent)`, `.buttonStyle(.clearGlass)`, `.buttonStyle(.gray)` |
| Perplexity | `.buttonStyle(.liquidGlass)` |

**Resolution:** This guide uses `.buttonStyle(.glass)` and `.buttonStyle(.glassProminent)` as the primary syntax, following the Claude documents. The explicit struct names (`GlassButtonStyle`, `GlassProminentButtonStyle`) may be valid for direct style instantiation. The `.liquidGlass` naming from Perplexity appears to be an alternative or earlier naming convention.

### Minimum Touch Target Size

| Source | Specification |
|--------|--------------|
| ChatGPT PDF | "iOS minimum 28 × 28 pt; default 44 × 44 pt" |
| Claude Doc 1 | "44×44 point minimum" |
| Perplexity | "44×44 pt minimum (for critical actions, consider 48×48 pt or larger)" |

**Resolution:** This guide uses **44×44 points** as the minimum touch target, which aligns with Apple's official Human Interface Guidelines. The 28pt figure in the ChatGPT PDF appears to be incorrect or may refer to a different specification (possibly visual size versus touch target size).

### Tab Bar Count Guidance

| Source | Recommendation |
|--------|---------------|
| ChatGPT PDF | "2–5 primary sections" |
| Claude Doc 2 | "3-5 primary app sections" |
| Perplexity | "3-5 tabs maximum (most apps use 4-5)" |

**Resolution:** This guide recommends **3-5 tabs** as the standard, noting that most apps use 4-5. While 2 tabs is technically possible, it's generally recommended to use a different navigation pattern for apps with only two sections.

### Glass Effect Container Syntax

| Source | Syntax |
|--------|--------|
| Claude Doc 1 | `GlassEffectContainer { }` and `GlassEffectContainer(spacing: CGFloat)` |
| Perplexity | `.glassEffectContainer()` modifier and `HStack(spacing: .glassEffectContainer)` |
| ChatGPT PDF | `GlassEffectContainer` with `glassEffectUnion()` |

**Resolution:** This guide uses `GlassEffectContainer { }` as the primary syntax, following Claude Doc 1. The `.glassEffectContainer()` modifier syntax from Perplexity may represent an alternative API or different usage pattern. Both may be valid depending on context.

### Optical Sizing Thresholds

Only the Perplexity document explicitly specified SF Text as "optimized for 19pt and below" and SF Display as "optimized for 20pt and above." Other sources did not provide specific point values. This information has been included but noted as from a single source.

### Additional Button Styles

Claude Doc 2 references `.buttonStyle(.clearGlass)` and `.buttonStyle(.gray)` which do not appear in other sources. These have been noted but not emphasized as primary styles in this guide pending official documentation confirmation.

### Spacing Parameter Naming

The Perplexity document uses `HStack(spacing: .glassEffectContainer)` suggesting a named spacing constant, while Claude documents use explicit `CGFloat` values in `GlassEffectContainer(spacing: 40.0)`. Both approaches may be valid.

---

## Appendix B: References

This guide synthesizes information from the following sources:

### Official Apple Resources

- Apple Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/
- Apple Design Resources: https://developer.apple.com/design/resources/
- Apple Design Pathway: https://developer.apple.com/design/get-started/
- Applying Liquid Glass to custom views: https://developer.apple.com/documentation/swiftui/applying-liquid-glass-to-custom-views

### WWDC 2025 Sessions

- Meet Liquid Glass
- Get to know the new design system
- Design foundations from idea to interface
- Say hello to the new look of app icons

### HIG Section References

- Accessibility: https://developer.apple.com/design/human-interface-guidelines/accessibility
- Typography: https://developer.apple.com/design/human-interface-guidelines/typography
- Color: https://developer.apple.com/design/human-interface-guidelines/color
- Layout: https://developer.apple.com/design/human-interface-guidelines/layout
- Motion: https://developer.apple.com/design/human-interface-guidelines/motion
- Materials: https://developer.apple.com/design/human-interface-guidelines/materials
- Generative AI: https://developer.apple.com/design/human-interface-guidelines/generative-ai

### Source Documents

This master guide was compiled from four AI-generated reference documents:

1. **ChatGPT PDF** (_ChatGPT__iOS_26_design_guide.pdf): Comprehensive overview with citations to official Apple documentation
2. **Claude Doc 1** (_Claude__iOS_26_Design_System_Reference_Guide_for_AI_Coding_Assistants.md): Finance-focused technical reference with detailed SwiftUI implementation
3. **Claude Doc 2** (_Claude2__iOS_26_Design_Guide.md): Comprehensive application design guide with HIG section mapping
4. **Perplexity** (_Perplexity__ios-26-design-guide.md): Detailed technical specifications with implementation guidelines

---

*This document should be considered a living reference and updated as Apple releases additional design guidance and platform updates. Last compiled: December 2025.*
