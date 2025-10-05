# RedGreenBlue MVP Implementation Plan - UI Prototype

## Overview

This document outlines the implementation plan for a **functional UI prototype** of the RedGreenBlue AI-powered note-taking app. The prototype will run locally on laptop only, use Expo for UI, stub LLM calls, and have no database persistence or authentication.

## Scope & Constraints

### In Scope
- ✅ **Functional UI prototype** with all core interactions
- ✅ **Expo-based mobile app** running locally
- ✅ **Complete color system** (blue → yellow → red/green → white)
- ✅ **Full gesture recognition** (swipe up, tap interactions, double-tap)
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
│   │   ├── GestureHandler.tsx     # Gesture recognition
│   │   ├── ProcessingOverlay.tsx  # AI processing UI
│   │   └── LoadingStates.tsx      # Loading indicators
│   ├── services/
│   │   ├── mockAI.ts              # Stubbed AI service
│   │   ├── storage.ts             # Local persistence
│   │   └── gestures.ts            # Gesture utilities
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
│       ├── colors.ts              # Color system types
│       └── gestures.ts            # Gesture types
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

**Goal**: Break text into multiple separate spans (one per line) so users can double-tap individual lines to mark them as prompts (yellow).

**Approach: Line-Based Spans**
- Each logical line = one span (separated by Enter key / `\n` character)
- A single span can be VERY LONG and wrap to multiple visual lines in the editor
- Only pressing Enter creates a new span
- Double-tapping anywhere on a wrapped line toggles the ENTIRE logical line

**Example:**
```
Line 1 (Span 1): "This is a really cool typing thing. i like to type" 
                 [wraps visually but is ONE span]
[User presses Enter]
Line 2 (Span 2): "another line here"
[User presses Enter]
Line 3 (Span 3): "third line"
```

If user double-taps the first wrapped line, ALL of "This is a really cool typing thing. i like to type" turns yellow, even though it displays across multiple visual lines.

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

#### 2.4 Double-Tap to Toggle Blue → Yellow
- [x] Implement double-tap gesture detection on Text span components:
  - Use `react-native-gesture-handler` TapGestureHandler on individual Text spans
  - Configure for `numberOfTaps={2}`
  - Only enable on blue and yellow spans
- [x] Add color toggle functionality:
  - Find tapped span by id or text position
  - Update span color: blue ↔ yellow
  - Update Zustand store and re-render
- [x] Test: Double-tap wrapped text → entire logical line toggles color

**Deliverable**: User can double-tap blue text spans to toggle them to yellow

#### 2.5 Polish & Testing
- [ ] Add visual feedback for double-tap recognition
- [ ] Add haptic feedback on successful toggle
- [ ] Handle gesture conflicts with text selection
- [ ] Verify inline highlights look good with rounded corners and padding
- [ ] Test with multiple spans of varying lengths and colors
- [ ] Test text wrapping behavior within and across spans
- [ ] Ensure text selection works across multiple colored spans
- [ ] Add smooth color transition animations (optional enhancement)
- [ ] Test edge cases: empty spans, very long spans, special characters

**Deliverable**: Phase 2 complete - functional inline text highlighting with color toggling

### Phase 3: AI Invocation & Processing (Week 3)

#### 3.1 User can swipe up to invoke AI processing and see loading states
- [ ] Configure React Native Gesture Handler
- [ ] Implement swipe up detection for AI processing
- [ ] Create AI processing state machine (idle, processing, complete)
- [ ] Add loading states with progress indicators
- [ ] Implement pulsing animations during processing
- [ ] Create processing overlay with realistic messages

**Deliverable**: User can swipe up and see AI processing begin with loading animation

#### 3.2 AI processing completes and shows realistic mock responses
- [ ] Create stubbed AI service with realistic delays (2-8 seconds)
- [ ] Implement mock response generation based on text content
- [ ] Add variety in mock responses for different scenarios:
  - Shopping list organization
  - Email professionalization
  - Meeting notes formatting
  - General text improvement
- [ ] Create completion animations and state transitions

**Deliverable**: AI processing completes with contextually relevant mock responses

### Phase 4: AI Result Display (Week 4)

#### 4.1 User sees original text in red and AI suggestion in green
- [ ] Implement red/green text display after AI processing
- [ ] Handle text layout for original (red) + suggestion (green)
- [ ] Add proper text positioning and spacing
- [ ] Create visual hierarchy for decision making
- [ ] Add smooth color transition animations (blue/yellow → red, show green)
- [ ] Handle yellow prompt text removal (yellow → red → deleted)

**Deliverable**: After AI processing, user sees original text in red with AI suggestion in green below

#### 4.2 User can tap red text to reject AI suggestion
- [ ] Implement single tap detection on red text
- [ ] Add reject action (red tap → revert to original blue/yellow, delete green)
- [ ] Create smooth state transitions and animations
- [ ] Add haptic feedback for reject actions
- [ ] Handle gesture priority (reject vs cursor positioning)

**Deliverable**: User can reject AI suggestions by tapping red text

### Phase 5: Accept Workflow & Text Editing (Week 5)

#### 5.1 User can tap green text to accept AI suggestion
- [ ] Implement single tap detection on green text
- [ ] Add accept action (green tap → white, delete red)
- [ ] Create smooth state transitions and animations
- [ ] Add haptic feedback for accept actions
- [ ] Add undo functionality for accept/reject actions
- [ ] Handle multiple AI suggestions in one document

**Deliverable**: User can accept AI suggestions by tapping green text, which becomes white

#### 5.2 User can select and edit text across all color states
- [ ] Implement text selection with long press
- [ ] Add cross-color selection support (excluding red text during processing)
- [ ] Implement single tap for cursor positioning (blue/yellow/white text)
- [ ] Add gesture conflict resolution (selection vs swipes)
- [ ] Disable gestures during selection mode
- [ ] Create selection indicators and feedback
- [ ] Handle editing white text (white → blue when edited)

**Deliverable**: Complete text editing experience with selection and cursor positioning across all colors


