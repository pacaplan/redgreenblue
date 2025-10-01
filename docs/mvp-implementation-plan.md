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
- [ ] Implement text content state management
- [ ] Add basic local persistence with AsyncStorage
- [ ] Create document auto-save functionality

**Deliverable**: Basic text editor that can input, edit, and persist text locally

### Phase 2: Color System & Manual Prompt Marking (Week 2)

#### 2.1 User can add new text to the document and see it highlighted in blue
- [ ] Define color state types (blue, yellow, red, green, white)
- [ ] Implement text span data structure for color tracking
- [ ] Create custom TextInput with colored text spans
- [ ] Implement real-time blue color highlighting during typing
- [ ] Handle color inheritance for new text input
- [ ] Add color state persistence to local storage

**Deliverable**: User can type text and see it appear highlighted in blue

#### 2.2 User can double-tap blue text to toggle it to yellow (mark as AI prompt)
- [ ] Implement double-tap detection for blue/yellow text
- [ ] Add color toggle functionality (blue ↔ yellow)
- [ ] Create visual feedback for double-tap recognition
- [ ] Add haptic feedback for color changes
- [ ] Create smooth color transition animations

**Deliverable**: User can double-tap blue text to mark it as yellow prompts

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


