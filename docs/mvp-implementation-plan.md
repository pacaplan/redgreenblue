# RedGreenBlue MVP Implementation Plan - UI Prototype

## Overview

This document outlines the implementation plan for a **functional UI prototype** of the RedGreenBlue AI-powered note-taking app. The prototype will run locally on laptop only, use Expo for UI, stub LLM calls, and have no database persistence or authentication.

## Scope & Constraints

### In Scope
- ✅ **Functional UI prototype** with all core interactions
- ✅ **Expo-based mobile app** running locally
- ✅ **Complete color system** (blue → yellow → red/green → white)
- ✅ **Button-based controls** (color toggle, AI processing, accept/reject actions)
- ✅ **Text selection and editing** with cross-color support
- ✅ **Stubbed AI processing** with realistic delays and mock responses
- ✅ **Basic document persistence** (local storage only)
- ✅ **Loading states** (happy path only)

### Out of Scope
- ❌ Real LLM API calls (stubbed with mock data)
- ❌ Database persistence (local storage only)
- ❌ User authentication or accounts
- ❌ Cloud deployment or Vercel hosting
- ❌ Polished UI/UX (functional but not production-ready)
- ❌ App store deployment
- ❌ **Error handling and edge cases**

## Technical Architecture

### Tech Stack
```
┌─────────────────┐
│   Expo App      │
│   React Native  │
│   TypeScript    │
└─────────────────┘
         │
┌─────────────────┐
│   Local State   │
│   Zustand       │
│   AsyncStorage  │
└─────────────────┘
         │
┌─────────────────┐
│   Mock AI API   │
│   Stubbed LLM   │
│   Local Logic   │
└─────────────────┘
```

### Core Dependencies
```json
{
  "dependencies": {
    "expo": "~50.0.0",
    "react-native": "0.73.0",
    "typescript": "^5.0.0",
    "zustand": "^4.4.0",
    "@react-native-async-storage/async-storage": "^1.19.0",
    "react-native-gesture-handler": "~2.14.0",
    "react-native-reanimated": "~3.6.0",
    "react-native-haptics": "^1.4.0",
    "react-native-svg": "^14.1.0"
  }
}
```

## File Structure

```
redgreenblue/
├── App.tsx                 # Main app component
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── src/
│   ├── components/
│   │   ├── TextEditor.tsx         # Main editor component
│   │   ├── ColoredText.tsx        # Colored text rendering
│   │   ├── ProcessAIButton.tsx    # AI processing button
│   │   ├── ProcessingOverlay.tsx  # AI processing UI
│   │   └── LoadingStates.tsx      # Loading indicators
│   ├── services/
│   │   ├── mockAI.ts              # Stubbed AI service
│   │   └── storage.ts             # Local persistence
│   ├── store/
│   │   ├── documentStore.ts       # Main document state
│   │   ├── aiStore.ts             # AI processing state
│   │   └── types.ts               # TypeScript definitions
│   ├── utils/
│   │   ├── colorSystem.ts         # Color state logic
│   │   ├── textProcessing.ts      # Text manipulation
│   │   └── constants.ts           # App constants
│   └── types/
│       ├── document.ts            # Document type definitions
│       └── colors.ts              # Color system types
```

## Implementation Phases

### Phase 1: Project Setup & Basic Editor (Week 1)

#### 1.1 Project Initialization
- [x] Create new Expo project with TypeScript template. Important: use a starter kit to create this 
- [x] Install core dependencies (gesture handler, reanimated, zustand)
- [x] Set up basic project structure and navigation
- [x] Configure TypeScript and linting

#### 1.2 Basic Text Editor
- [x] Create plain text editor component with TextInput
- [x] Implement basic text input and cursor positioning
- [x] Add character counting and document size limits (2000 chars)
- [x] Set up basic styling and layout

#### 1.3 State Management Setup
- [x] Create Zustand store for document state
- [x] Implement text content state management
- [x] Add basic local persistence with AsyncStorage
- [x] Create document auto-save functionality

**Deliverable**: Basic text editor that can input, edit, and persist text locally

### Phase 2: Color System & Manual Prompt Marking (Week 2)

**Design Approach** (Simplified):
- Text spans display with inline background highlights (not full-width)
- Highlights have slightly rounded corners and padding around text
- Uses standard TextInput with nested styled Text components
- Much simpler than dual-layer architecture while maintaining core functionality

**Technical Approach**:
Single TextInput with styled Text spans - leverages React Native's built-in text styling capabilities.

#### 2.1 Core Data Model & Color System
- [x] Define color state types (blue, yellow, red, green, white)
- [x] Implement text span data structure:
  - Each span: `{ text: string, color: ColorState, id: string }`
  - Spans stored as array in document state
  - New text creates new blue spans (separated by word boundaries or user-defined breaks)
- [x] Add color state persistence to local storage
- [x] Define color constants with exact hex values from design system

**Deliverable**: Data model ready to support colored text spans

#### 2.2 Styled TextInput with Colored Text Spans
- [x] Create enhanced TextEditor component using standard TextInput
- [x] Implement text span rendering within TextInput:
  - Map over text span array to create nested Text components
  - Apply inline styles to each Text span:
    - `backgroundColor` based on span color
    - `borderRadius: 4` for rounded corners
    - `paddingHorizontal: 4, paddingVertical: 2` for text padding
    - Maintain text flow and wrapping
- [x] Implement real-time blue highlighting for new text:
  - New characters get added to current span or create new blue span
  - Handle span boundary logic (spaces, punctuation, or manual breaks)
- [x] Ensure native text editing behavior works (cursor, selection, copy/paste)

**Deliverable**: User can type text and see it appear with inline blue highlights

#### 2.3 Line-Based Text Span Management

**Current State**: Right now, ALL typed text is stored as a single blue span. User types "hello world" → one span with text "hello world".

**Goal**: Break text into multiple separate spans (one per line) so users can use the toggle button to mark individual lines as prompts (yellow).

**Approach: Line-Based Spans**
- Each logical line = one span (separated by Enter key / `\n` character)
- A single span can be VERY LONG and wrap to multiple visual lines in the editor
- Only pressing Enter creates a new span
- Toggle button appears when cursor is on a line, clicking it toggles the ENTIRE logical line

**Example:**
```
Line 1 (Span 1): "This is a really cool typing thing. i like to type" 
                 [wraps visually but is ONE span]
[User presses Enter]
Line 2 (Span 2): "another line here"
[User presses Enter]
Line 3 (Span 3): "third line"
```

If user clicks the toggle button while cursor is on the first wrapped line, ALL of "This is a really cool typing thing. i like to type" turns yellow, even though it displays across multiple visual lines.

**Implementation Steps:**

- [x] **Parse text into line-based spans**
  - Split input text by `\n` (newline character)
  - Each segment becomes a separate span
  - Empty lines create empty spans (preserve line breaks)
  
- [x] **Handle new line creation (Enter key)**
  - Detect Enter key press in TextInput
  - Split current span at cursor position
  - Create new span with text after cursor
  - Insert `\n` between spans
  
- [x] **Handle editing within a line**
  - Identify which span the cursor is in (based on character position)
  - Update only that span's text when user types
  - Preserve the span's color (blue or yellow)
  
- [x] **Handle backspace at start of line (merge spans)**
  - Detect cursor at position 0 of a span
  - When backspace pressed, merge current span with previous span
  - Remove the `\n` between them
  - Preserve color of first span

- [x] **Handle text wrapping display**
  - Ensure ColoredText component allows text wrapping within spans
  - Long spans should wrap naturally to multiple visual lines
  - No special handling needed (React Native Text wraps by default)

- [x] **Preserve colors during all operations**
  - When editing a blue span → stays blue
  - When editing a yellow span → stays yellow
  - When merging spans → keep color of first/surviving span

**Testing Scenarios:**
- [x] Type a long line that wraps → single span, wraps visually
- [x] Press Enter mid-line → splits into two spans
- [x] Type multiple lines separated by Enter → multiple spans
- [x] Edit text within a span → span updates, color preserved
- [x] Backspace at start of line → merges with previous span

**Deliverable**: Text is broken into line-based spans with proper text wrapping support

#### 2.4 Toggle Blue → Yellow
- [x] ~~Implement double-tap gesture detection on Text span components~~
  - **Changed approach**: Double-tap on Text components is unreliable on Android/web
- [x] Implement floating action button for color toggling:
  - Button appears when cursor is on blue or yellow line
  - Shows context-aware label ("Mark as Prompt" / "Mark as Text")
  - Color-coded to show target color
  - Uses Pressable for reliable cross-platform interaction
- [x] Add color toggle functionality:
  - Detect current line based on cursor position
  - Update span color: blue ↔ yellow
  - Update Zustand store and re-render
- [x] Test: Button toggles current line color reliably on all platforms

**Deliverable**: User can toggle blue/yellow text color using a floating button (more reliable than double-tap)

#### 2.5 Polish & Testing
- [x] Verify inline highlights look good with rounded corners and padding
- [x] Test with multiple spans of varying lengths and colors
- [x] Test text wrapping behavior within and across spans
- [x] Ensure text selection works across multiple colored spans
- [ ] Add smooth color transition animations (optional enhancement)
- [x] Test edge cases: empty spans, very long spans, special characters
- [x] Test toggle functionality on Android and web platforms

**Deliverable**: Phase 2 complete - functional inline text highlighting with color toggling

### Phase 3: AI Invocation & Processing (Week 3)

#### 3.1 User can click "Process with AI" button to invoke AI processing and see loading states
- [x] Create "Process with AI" button component
- [x] Implement button visibility logic (show when document has blue or yellow text)
- [x] Add button positioning (fixed at bottom of screen or floating)
- [x] Create AI processing state machine (idle, processing, complete)
- [x] Add loading states with progress indicators
- [x] Implement pulsing animations during processing
- [x] Create processing overlay with realistic messages
- [x] Disable all buttons during AI processing

**Deliverable**: User can click "Process with AI" button and see AI processing begin with loading animation

#### 3.2 AI processing completes and shows realistic mock responses
- [x] Create stubbed AI service with realistic delays (2-8 seconds)
- [x] Implement mock response generation based on text content
- [x] Add variety in mock responses for different scenarios:
  - Shopping list organization
  - Email professionalization
  - Meeting notes formatting
  - General text improvement
- [x] Create completion animations and state transitions

**Deliverable**: AI processing completes with contextually relevant mock responses

### Phase 4: AI Result Display & Accept / Reject workflow (Week 4)

**Approach**: Use the `diff` npm package to generate **line-level diffs** between original and AI-generated text. Display changes grouped into independent "change groups" with per-change accept/reject:
- **Red** = deleted/replaced lines (original)
- **Green** = added/replacement lines (AI-generated)
- **White** = unchanged lines (context)
- **Change groups** = contiguous added/removed lines with their own Accept/Reject buttons

**Rationale**: 
- The `diff` package is small (~20KB), pure JS, battle-tested, and handles all edge cases automatically
- **Line-level diffing** (`diffLines()`) provides clean, readable diffs without word-level noise
- **Independent change groups** give users granular control to accept/reject each change separately
- Unchanged lines (white) provide context between change groups
- Automatically handles: multiple changes, unchanged sections, additions-only, deletions-only
- **Visual mockups**: See [`docs/ui-mockups.md`](ui-mockups.md) for detailed UI examples

**Technical Implementation**:
```typescript
import { diffLines } from 'diff';

// Generate line-level diff between original and AI text
const diff = diffLines(originalText, aiGeneratedText);

// Group contiguous changes into change groups
interface ChangeGroup {
  id: string;
  removed: string[];  // RED lines
  added: string[];    // GREEN lines
}

// Each change group gets its own Accept/Reject buttons
```

#### 4.1 Implement diff-based text display with change groups
- [x] Install `diff` package: `pnpm add diff`
- [x] Install types: `pnpm add -D @types/diff`
- [x] Create utility function to generate **line-level diff** using `diffLines()`
- [x] Create utility function to group contiguous changes into "change groups"
- [x] Create utility function to convert diff output to text spans with change group metadata
- [x] Create ChangeGroup component with per-group Accept/Reject buttons
- [x] Update AI processing flow to generate line-level diff between original and AI text
- [x] Group contiguous changes into independent change groups
- [x] Convert diff output to text spans (red = removed lines, green = added lines, white = unchanged lines)
- [x] Handle yellow prompt text (should appear as removed/red in diff)
- [x] Render change groups with visual borders and labels ("Change 1", "Change 2", etc.)
- [x] Add Accept/Reject buttons to each change group
- [x] Display unchanged lines (white) between change groups for context
- [x] Test edge cases:
  - All text changed (single change group: 100% red → 100% green)
  - Minimal changes (small change groups with lots of white context)
  - Only additions (change group with no red, just green)
  - Only deletions (change group with just red, no green)
  - Multiple separate changes (multiple change groups with white between)
  - Yellow prompts removed (show as red, disappear on accept)
  - Mixed accept/reject (accept Change 1, reject Change 2, accept Change 3)

**Deliverable**: After AI processing, user sees line-level diff organized into independent change groups, each with Accept/Reject buttons

#### 4.2 Implement per-change accept/reject
- [ ] Implement Accept button per change group
  - Clicking Accept on a change group: RED lines deleted, GREEN lines → WHITE
  - Other change groups remain unchanged
  - Change group disappears after acceptance
- [ ] Implement Reject button per change group
  - Clicking Reject on a change group: RED lines → revert to blue/yellow, GREEN lines deleted
  - Other change groups remain unchanged
  - Change group disappears after rejection
- [ ] Handle mixed accept/reject scenarios (some groups accepted, others rejected)
- [ ] Store original spans before diff so rejected groups can restore original text
- [ ] Create smooth state transitions and animations
- [ ] Update document state as change groups are resolved

**Deliverable**: User can independently accept or reject each change group, with granular control over which AI suggestions to keep

#### 4.3 Continue editing after accepting/rejecting changes
- [ ] After all change groups are resolved, document returns to normal editing mode
- [ ] Accepted text (white) can be edited (becomes blue when edited)
- [ ] Handle edge case: If user edits white text, it becomes blue (new input)
- [ ] Support multiple AI processing rounds on the same document
- [ ] Add undo functionality for accept/reject actions (store previous state)

**Deliverable**: Complete workflow supporting multiple rounds of AI processing with granular accept/reject

### Phase 5: Polish & Optimization (Week 6)

#### 5.1 User can select and edit text across all color states
- [ ] Implement text selection with long press
- [ ] Add cross-color selection support (excluding red text during processing)
- [ ] Implement single tap for cursor positioning (blue/yellow/white text)
- [ ] Add button state management during text selection
- [ ] Create selection indicators and feedback
- [ ] Handle editing white text (white → blue when edited)

**Deliverable**: Complete text editing experience with selection and cursor positioning across all colors

#### 5.2 Haptic Feedback & Animations
- [ ] Add haptic feedback for toggle button press
- [ ] Add haptic feedback for "Process with AI" button press
- [ ] Add haptic feedback for accept button press
- [ ] Add haptic feedback for reject button press
- [ ] Add smooth color transition animations for all state changes
- [ ] Optimize animation performance for smooth 60fps experience

#### 5.3 Final Testing & Bug Fixes
- [ ] Comprehensive testing across all phases
- [ ] Test on multiple devices (iOS, Android, web)
- [ ] Performance testing and optimization
- [ ] Fix any remaining bugs or edge cases
- [ ] Document known limitations

**Deliverable**: Polished MVP prototype with smooth animations and haptic feedback


