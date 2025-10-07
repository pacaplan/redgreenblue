# AI-Powered Note-Taking App - Functional Specification

## Overview

A mobile-first, AI-powered note-taking and personal writing application that seamlessly blends human input with AI assistance through an intuitive color-coded interface and gesture-based interactions.

## Core Concept

The app transforms traditional note-taking by allowing users to write naturally while AI intelligently identifies prompts and provides contextual assistance. The interface uses color coding to distinguish between different types of content and their processing states.

## User Interface

### Main Interface
- **Minimalist plain text editor** as the primary interface
- Mobile-first design optimized for touch interactions
- Clean, distraction-free writing environment
- Real-time color coding based on content type and processing state

### Color System

| Color | Meaning | State |
|-------|---------|-------|
| **Blue** | Human-written text, unedited by AI | Active input |
| **Yellow** | AI prompt/instruction | Identified for processing |
| **Red** | Text marked for deletion/replacement | Pending user decision |
| **Green** | AI-generated replacement text | Pending user approval |
| **White** | Finalized text (human-written, AI-edited) | Accepted/completed |

## Core Workflow

### 1. Text Input Phase
- User types in the plain text editor
- Text appears with **blue highlighting** as they type
- Each paragraph is treated as a discrete unit

### 2. Manual Prompt Marking Phase (MVP)
- All text remains **blue** by default
- User manually marks prompts by **clicking the "Mark as Prompt" button** to change blue text to **yellow**
- Button appears after 500ms of cursor inactivity on blue or yellow lines
- No automatic AI analysis or prompt detection
- User has full control over what is treated as content vs. instructions

### 3. AI Processing Phase (Triggered by "Process with AI" button)
- **Blue text** → **Red** (marked for potential editing)
- AI generates improved/edited version
- AI-generated text appears **below** the red text in **green**
- **Yellow text** (prompts) → **Red** (will be removed after processing)

### 4. User Decision Phase
- User reviews AI suggestions
- **Accept**: Click "Accept" button → green text becomes white, red text is deleted
- **Reject**: Click "Reject" button → red text reverts to previous color (blue/yellow), green text disappears

## Interaction Controls

### Touch Interactions
- **Single tap**: Position cursor (standard text editing behavior)
- **Three-finger tap**: Undo last action

### Button Controls
Context-aware buttons appear for specific actions:
- **Toggle Button** (blue/yellow lines): "→ Mark as Prompt" or "→ Mark as Text" button appears after 500ms of cursor inactivity on blue or yellow text
- **Process AI Button**: "✨ Process with AI" button appears at bottom of screen when document contains blue or yellow text
- **Accept Button** (green text): "Accept" button appears when AI suggestion is present
- **Reject Button** (red text): "Reject" button appears when AI suggestion is present

### Swipe Gestures (Future)
- **Swipe down**: Navigate to settings screen
- **Swipe left**: Enter "pretty view" (formatted markdown, read-only)

## Text Selection & Editing Behavior

### Text Selection Rules
- **Standard Selection**: Long press + drag works within blue, yellow, green, and white text
- **Red Text Restriction**: Red text cannot be selected or edited (read-only during AI processing)
- **Cross-Color Selection**: Users can select across different colored sections (excluding red)
- **Selection Appearance**: Selected text shows standard iOS selection highlight over the color coding
- **Copy Behavior**: Copied text retains formatting but pastes as blue (new input)
- **Cut Behavior**: Cut text is removed, leaving gaps that close automatically

### Cursor Positioning
- **Single Tap to Position**: Places cursor within blue, yellow, green, red, and white text
- **Color Toggle Button**: Appears after 500ms of cursor inactivity on blue/yellow lines
- **Color Inheritance**: New text typed at cursor inherits the color of surrounding text
- **Boundary Behavior**: Cursor at color boundaries defaults to the following color
- **Editing White Text**: Any edit to white text immediately changes it to blue
- **Visual Feedback**: Button appearance indicates available actions for current line

### Tap Behavior Hierarchy
The system uses button-based controls instead of tap-based actions:

1. **Single Tap**: 
   - **All text colors**: Position cursor (standard editing behavior)
   - No immediate actions triggered by tapping text

2. **Button Interactions**:
   - **Toggle Button** (blue/yellow): Click to toggle between "Mark as Prompt" and "Mark as Text"
   - **Accept Button** (green): Click to accept AI suggestion
   - **Reject Button** (red): Click to reject AI suggestion

3. **Visual Feedback**:
   - **Button press**: Standard button press animation + haptic feedback
   - **Button appearance**: Smooth fade-in after 500ms of cursor inactivity
   - **Button styling**: Color-coded to match the action (yellow for prompts, blue for text)

### Interaction Conflict Resolution
- **Selection Priority**: When text is selected, all buttons except the text editing controls remain visible
- **Long Press Detection**: System distinguishes between:
  - Long press (0.5s) → Text selection mode
  - Button press → Specific action (toggle, AI processing, accept, reject)
- **Clear Selection**: Tap empty area to clear selection
- **Button Hiding**: Toggle button automatically hides when cursor moves or user types
- **Process AI Button**: Always visible at bottom when applicable (not affected by cursor position)

## AI Processing States

### Loading States
- **Immediate Feedback**: Button press triggers instant visual confirmation
- **Processing Indicator**: Subtle animation on text being processed
- **Progress States**:
  - **Analyzing** (0-2s): "AI is reading your text..."
  - **Generating** (2-10s): "AI is writing suggestions..."
  - **Finalizing** (10-15s): "AI is finishing up..."

### Visual Processing Feedback
- **Blue/Yellow Text**: Gentle pulsing animation during processing
- **Loading Overlay**: Translucent overlay with progress indicator
- **Button Blocking**: All buttons disabled during AI processing
- **Cancel Option**: Tap "Cancel" button to cancel AI processing (if taking >5s)

### Processing States
```
[BLUE TEXT] → [BLUE TEXT + PULSE] → [RED TEXT] + [GREEN TEXT BELOW]
     ↓              ↓                    ↓
Button Press   Processing           Complete
```

### Error States
- **Network Error**: "Connection lost. Tap to retry."
- **AI Error**: "AI unavailable. Try again in a moment."
- **Timeout**: "Taking too long. Tap to try again."
- **Recovery**: Failed text reverts to original color, buttons re-enabled

## Example User Flows

### 1. Shopping List Organization
**Initial Input:**
1. **User types**: "milk" + [return] → Text stays **blue**
2. **User types**: "bananas" + [return] → Text stays **blue**
3. **User types**: "organize shopping list" + [return] → Text stays **blue**
4. **User clicks** "→ Mark as Prompt" button on the last line → Text turns **yellow**

**AI Processing:**
5. **User clicks "✨ Process with AI" button**: AI processes
   - "milk" and "bananas" turn **red**
   - "organize shopping list" turns **red**
   - **Green text appears**:
     ```
     ## Dairy
     - [ ] milk
     
     ## Produce  
     - [ ] bananas
     ```

**User Decision:**
6. **User clicks "Accept" button**: Accepts the organization
   - Green text becomes **white**
   - All red text disappears
   - **Result**: Organized markdown checklist

### 2. Email Draft Improvement
**Initial Input:**
1. **User types**: "Hey Sarah, hope you're doing well. I wanted to reach out about the project deadline. We might need to push it back a few days because of the technical issues we've been having." + [return] → Text stays **blue**
2. **User types**: "make this more professional" + [return] → Text stays **blue**
3. **User clicks** "→ Mark as Prompt" button on the last line → Text turns **yellow**

**AI Processing:**
4. **User clicks "✨ Process with AI" button**: AI processes
   - Original email text turns **red**
   - "make this more professional" turns **red**
   - **Green text appears**:
     ```
     Dear Sarah,
     
     I hope this message finds you well. I'm writing to discuss the upcoming project deadline for [Project Name].
     
     Due to some technical challenges we've encountered, we may need to extend the deadline by a few days to ensure quality delivery. I wanted to give you advance notice so we can discuss any scheduling implications.
     
     Please let me know your availability to discuss this further.
     
     Best regards,
     [Your name]
     ```

**User Decision:**
5. **User clicks "Accept" button**: Accepts the professional version
   - **Result**: Polished, professional email ready to send

### 3. Meeting Notes Structuring
**Initial Input:**
1. **User types**: "discussed quarterly goals" + [return] → Text stays **blue**
2. **User types**: "sarah will handle marketing campaign" + [return] → Text stays **blue**
3. **User types**: "need to follow up on budget by friday" + [return] → Text stays **blue**
4. **User types**: "john mentioned the new hire starts monday" + [return] → Text stays **blue**
5. **User types**: "format as meeting minutes" + [return] → Text stays **blue**
6. **User clicks** "→ Mark as Prompt" button on the last line → Text turns **yellow**

**AI Processing:**
7. **User clicks "✨ Process with AI" button**: AI processes
   - All previous text turns **red**
   - **Green text appears**:
     ```
     # Meeting Minutes - [Date]
     
     ## Topics Discussed
     - Quarterly goals review
     
     ## Action Items
     - [ ] Sarah: Handle marketing campaign
     - [ ] Follow up on budget (Due: Friday)
     
     ## Announcements
     - New hire (John mentioned) starts Monday
     ```

**User Decision:**
8. **User clicks "Accept" button**: Accepts the structured format
   - **Result**: Professional meeting minutes with clear action items

### 4. Extended Shopping List - Multiple Interactions & Complex State Management
This example demonstrates advanced scenarios including multiple AI interactions, mixed content states, and intelligent context awareness.

**Round 1: Initial Organization (from example 1)**
- Document state after accepting AI organization:
  ```
  ## Dairy                    [WHITE]
  - [ ] milk                  [WHITE]
  
  ## Produce                  [WHITE]  
  - [ ] bananas               [WHITE]
  ```

**Round 2: Adding New Items Without Explicit Prompts**
1. **User adds new items at the end:**
   ```
   ## Dairy                    [WHITE]
   - [ ] milk                  [WHITE]
   
   ## Produce                  [WHITE]  
   - [ ] bananas               [WHITE]
   bread                       [BLUE - new]
   chicken breast              [BLUE - new]
   ```

2. **User clicks "✨ Process with AI" button**: AI processes without explicit prompt
   - AI reasoning: "bread" and "chicken breast" are new grocery items that need categorization into the existing structure
   - "bread" and "chicken breast" turn **red**
   - **Green text appears**:
     ```
     ## Dairy                    [unchanged]
     - [ ] milk                  [unchanged]
     
     ## Produce                  [unchanged]  
     - [ ] bananas               [unchanged]
     
     ## Bakery
     - [ ] bread
     
     ## Meat
     - [ ] chicken breast
     ```

3. **User clicks "Accept" button**: Accepts the additions
   - New sections become **white**, red text disappears

**Round 3: Mixed State Processing - Blue and Yellow Throughout Document**
4. **User makes multiple simultaneous edits in various locations:**
   ```
   ## Dairy                    [WHITE]
   - [ ] milk                  [WHITE]
   - [ ] greek yogurt          [BLUE - user edited white section]
   
   ## Produce                  [WHITE]  
   - [ ] bananas               [WHITE]
   - [ ] organic apples        [BLUE - user edited white section]
   
   add quantities to everything [YELLOW - prompt in middle]
   
   ## Bakery                   [WHITE]
   - [ ] bread                 [WHITE]
   
   ## Meat                     [WHITE]
   - [ ] chicken breast        [WHITE]
   
   eggs                        [BLUE - new item]
   olive oil                   [BLUE - new item]
   ```

5. **User clicks "✨ Process with AI" button**: AI processes complex mixed state
   - AI reasoning: 
     - "greek yogurt" (blue) → integrate into Dairy section
     - "organic apples" (blue) → integrate into Produce section  
     - "add quantities to everything" (yellow) → modify all items to include quantities
     - "eggs" (blue) → categorize into Dairy section
     - "olive oil" (blue) → create new Pantry section
   
   - All **blue** and **yellow** text turns **red**
   - **Green text appears**:
     ```
     ## Dairy
     - [ ] milk (1 gallon)
     - [ ] greek yogurt (1 container)
     - [ ] eggs (1 dozen)
     
     ## Produce  
     - [ ] bananas (1 bunch)
     - [ ] organic apples (2 lbs)
     
     ## Bakery
     - [ ] bread (1 loaf)
     
     ## Meat
     - [ ] chicken breast (2 lbs)
     
     ## Pantry
     - [ ] olive oil (1 bottle)
     ```

6. **User clicks "Accept" button**: Accepts all changes
   - **Result**: Comprehensive organized shopping list with quantities

**Round 4: Prompt Before Content & White-to-Blue Transitions**
7. **User edits existing white text and adds prompt before new content:**
   ```
   ## Dairy
   - [ ] organic milk (1 gallon) [BLUE - user edited white text]
   - [ ] greek yogurt (1 container) [WHITE]
   - [ ] eggs (1 dozen)        [WHITE]
   
   prioritize budget options   [YELLOW - prompt placed before new items]
   
   ## Produce  
   - [ ] bananas (1 bunch)     [WHITE]
   - [ ] organic apples (2 lbs) [WHITE]
   
   ## Bakery
   - [ ] bread (1 loaf)        [WHITE]
   
   ## Meat
   - [ ] chicken breast (2 lbs) [WHITE]
   
   ## Pantry
   - [ ] olive oil (1 bottle)  [WHITE]
   
   pasta                       [BLUE - new item]
   tomato sauce               [BLUE - new item]
   ```

8. **User clicks "✨ Process with AI" button**: AI processes prompt and mixed content
   - AI reasoning:
     - "organic milk" (blue, was edited from white) → affected by budget prioritization
     - "prioritize budget options" (yellow) → find cost-effective alternatives
     - "pasta" and "tomato sauce" (blue) → add to Pantry with budget focus
   
   - **Green text appears**:
     ```
     ## Dairy
     - [ ] milk (1 gallon)      [reverted from organic for budget]
     - [ ] greek yogurt (1 container)
     - [ ] eggs (1 dozen)
     
     ## Produce  
     - [ ] bananas (1 bunch)
     - [ ] apples (2 lbs)       [removed "organic" for budget]
     
     ## Bakery
     - [ ] store brand bread (1 loaf)
     
     ## Meat
     - [ ] chicken thighs (2 lbs) [cheaper cut]
     
     ## Pantry
     - [ ] store brand olive oil (1 bottle)
     - [ ] pasta (1 box)
     - [ ] store brand tomato sauce (1 jar)
     ```

9. **User clicks "Accept" button**: Accepts the budget optimization
   - **Result**: Cost-optimized shopping list with new items properly categorized

**Key Advanced Behaviors Demonstrated:**

1. **Intelligent Context Awareness**: AI understands document structure and content relationships without explicit instructions

2. **Mixed State Processing**: Seamlessly handles any combination of blue and yellow text scattered throughout the document

3. **Flexible Prompt Placement**: Prompts work whether placed before, after, or between content blocks

4. **White-to-Blue Transitions**: When users edit finalized (white) text, it becomes blue and subject to re-editing

5. **Cumulative Intelligence**: AI maintains understanding of document evolution across multiple interactions

6. **Non-Destructive Processing**: White text remains unchanged unless specifically targeted by prompts or related to blue text changes

7. **Contextual Reasoning**: AI makes intelligent decisions about how prompts apply to different content types and locations

## AI System Instructions Framework

To handle these complex scenarios, the AI system needs sophisticated reasoning capabilities:

**Context Analysis:**
- Identify document structure and content relationships
- Understand the semantic meaning of blue vs. yellow text placement
- Recognize content categories and how new items relate to existing structure

**Multi-State Processing:**
- Process all blue and yellow text simultaneously
- Apply prompts contextually based on their position and the surrounding content
- Maintain document coherence while making targeted changes

**Intelligent Inference:**
- Understand implicit user intent when no explicit prompts are provided
- Make reasonable assumptions about content organization and enhancement
- Balance prompt instructions with document structure preservation

## MVP Constraints and Simplifications

### Technical Constraints
- **Maximum document size**: 2,000 characters (~400 words)
- **Maximum paragraphs**: 20 per document
- **Maximum AI processing per session**: 10 operations
- **Context window**: Last 5 AI interactions only
- **Processing timeout**: 15 seconds (then fallback)
- **Network-first architecture**: Cloud-only processing with smart caching
- **Language support**: English only for MVP

### Content Type Restrictions
- **Supported**: Plain text with basic formatting, simple lists, basic markdown
- **Not supported**: Tables, images, code blocks, mathematical expressions

### Processing Constraints  
- **Single-paragraph processing**: Process one paragraph + immediate context only
- **Maximum context**: ~500 characters per operation
- **Sequential processing**: One operation at a time (no simultaneous multi-state processing)
- **Stateless operations**: Each AI operation is independent
- **Simple undo**: Last 5 operations only with full document snapshots

## Key Features for MVP

### Essential Features
1. **Plain text editor** with real-time color coding
2. **Manual prompt marking** via button interface (no automatic detection)
3. **Button-based AI invocation** ("Process with AI" button)
4. **Accept/reject editing workflow** via buttons
5. **Full color state management** (blue→yellow→red/green→white)
6. **Text selection and cursor positioning** with cross-color support
7. **Button interaction management** (context-aware button visibility and state)
8. **AI processing feedback** (loading states, progress indicators, animations)
9. **Basic error handling** (network failures, timeouts, recovery)
10. **Document state persistence** (auto-save, session recovery)

### Secondary Features (Future Versions)
1. **Settings screen** (swipe down)
2. **Pretty view** for markdown rendering (swipe left)
3. **Partial accept/reject** for AI suggestions
4. **Basic accessibility support** (VoiceOver, colorblind alternatives)
5. **Automatic prompt detection** (post-MVP enhancement)
6. **Multi-paragraph processing** (advanced context awareness)

## Usability Analysis

### Strengths
✅ **Intuitive color system**: Clear visual feedback for different content states  
✅ **Natural writing flow**: Users can write normally without interruption  
✅ **Simple button controls**: Discoverable and reliable interaction patterns  
✅ **Clear decision points**: Accept/reject workflow is straightforward via buttons
✅ **Flexible prompting**: Users can manually mark prompts using discoverable button interface
✅ **Cross-platform reliability**: Button-based interactions work consistently on mobile, tablet, and web
✅ **Feature discoverability**: All actions accessible via visible UI elements  

### Potential Concerns (Addressed in MVP)
⚠️ **Learning curve**: Users need to understand the color system and button interface
✅ **Manual prompt marking**: Button-based approach is discoverable and eliminates AI detection accuracy issues
✅ **Button-based interactions**: More reliable than gesture-based detection across platforms
✅ **Feature discoverability**: All core actions visible via buttons
⚠️ **Visual complexity**: Multiple colors might feel overwhelming initially  
⚠️ **Text selection complexity**: Standard selection behavior unclear with colored text  
⚠️ **Error recovery**: Users need clear paths to fix AI mistakes  
⚠️ **Accessibility gaps**: Color-dependent interface may exclude some users
⚠️ **Document size limits**: Users may hit 2,000 character constraint  

### Recommendations for MVP
1. **Start with core workflow**: Focus on blue→yellow→red/green→white progression
2. **Include onboarding**: Brief tutorial explaining color system and button interface
3. **Provide feedback**: Clear visual/haptic feedback for button presses
4. **Error recovery**: Easy way to undo AI actions if they go wrong
5. **Document size indicators**: Show character count approaching limits
6. **Progressive disclosure**: Hide advanced features initially
7. **Button discoverability**: Ensure buttons appear reliably based on document state

## Technical Considerations (High-Level)

### Core Requirements (Updated for MVP)
- Real-time color coding system
- Button-based interaction system  
- AI integration for content generation only (no prompt detection)
- State management for color transitions
- Simple undo/redo functionality (5 operations max)
- Document size monitoring and limits enforcement
- Network connectivity handling and error recovery

### Performance Targets (Updated for MVP)
- Instant color feedback on typing
- Smooth button interactions with haptic feedback
- AI processing: 2-15 seconds (within specified timeout)
- Minimal latency for accept/reject actions
- Document size validation: Real-time character counting

## Success Metrics for MVP

### User Engagement
- Time spent in app per session
- Number of AI invocations per session
- Accept rate for AI suggestions

### Usability
- Time to complete first successful AI interaction
- Button interaction success rate
- User retention after first week

### AI Performance (Updated for MVP)
- Relevance of AI-generated content
- User satisfaction with AI suggestions  
- Success rate of manual prompt marking workflow
- Processing time within timeout constraints

## Conclusion

This concept presents an innovative approach to AI-assisted writing that feels natural and intuitive. The color-coded system provides clear visual feedback, while button-based interactions provide reliable, discoverable controls across all platforms. 

**MVP Approach:** By eliminating automatic prompt detection, using button-based controls instead of gestures, and implementing technical constraints, the MVP significantly reduces implementation complexity while maintaining the core innovative experience. Users gain full control over prompt marking and AI invocation, which eliminates AI accuracy concerns and interaction reliability issues while preserving the powerful feeling of AI-assisted writing.

**Technical Feasibility:** With the simplified button-based approach, the MVP has a high probability of success (~90%) and can be developed in 6 months. The button-based interaction model ensures predictable, cross-platform performance and excellent user experience while providing a solid foundation for future enhancements.

The concept makes strong sense from a usability perspective, particularly for users who want powerful AI assistance with transparent, discoverable, user-controlled interactions. The key to success will be in the execution quality of the button interactions and the reliability of the simplified AI processing workflow.
