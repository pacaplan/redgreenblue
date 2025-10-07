# UI Mockups: Line-Level Diff Display with Per-Change Accept/Reject

## Overview

After AI processing completes, changes are displayed using line-level diffs. The diff algorithm (`diffLines()` from the `diff` package) groups contiguous added/removed lines into "change groups". Each change group can be independently accepted or rejected, giving users granular control over AI suggestions.

## Key Concepts

### Diff Structure
```typescript
// Using diffLines() from diff package
import { diffLines } from 'diff';

const diff = diffLines(originalText, aiGeneratedText);

// Group contiguous changes into "change groups"
// Each change group = consecutive removed/added lines
// Separated by unchanged lines

Change Group 1:
  - removed line 1
  - removed line 2  
  + added line 1
  + added line 2

[unchanged lines = WHITE]

Change Group 2:
  - removed line 3
  + added line 3
  + added line 4

[unchanged lines = WHITE]
```

### Visual Elements

**Color Rendering:**
```
[RED: text]    ← Light red background (#FFE5E5), dark red text (#CC0000)
                 Represents deleted/replaced lines

[GREEN: text]  ← Light green background (#E5FFE5), dark green text (#007700)
                 Represents added/new lines

[WHITE: text]  ← White/light gray background (#FFFFFF), normal black text
                 Represents unchanged lines (context)

[BLUE: text]   ← Light blue background (#E5F2FF), dark blue text (#0066CC)
                 Original user input (before AI processing)

[YELLOW: text] ← Light yellow background (#FFF9E5), dark yellow text (#B8860B)
                 User-marked prompts (before AI processing)
```

## Mockup 1: Email Improvement

### Before AI Processing

```
┌─────────────────────────────────────────────────────────────┐
│ RedGreenBlue                                    [☰ Menu]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  [BLUE: Hey Sarah, hope you're doing well.]             │ │
│  │  [BLUE: I wanted to reach out about the project         │ │
│  │  deadline.]                                              │ │
│  │  [BLUE: We might need to push it back a few days.]      │ │
│  │  [BLUE: Because of the technical issues we've been      │ │
│  │  having.]                                                │ │
│  │  [YELLOW: make this more professional]                  │ │
│  │                                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│                                                              │
│              ✨ Process with AI                              │
│                                                              │
│  150 characters                                              │
└─────────────────────────────────────────────────────────────┘
```

### After AI Processing (with independent change groups)

```
┌─────────────────────────────────────────────────────────────┐
│ RedGreenBlue                                    [☰ Menu]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  ╔════════════ Change 1 ═══════════════════════════╗   │ │
│  │  ║                                                   ║   │ │
│  │  ║  [RED: Hey Sarah, hope you're doing well.]       ║   │ │
│  │  ║  [GREEN: Dear Sarah,]                            ║   │ │
│  │  ║  [GREEN: ]                                       ║   │ │
│  │  ║  [GREEN: I hope this message finds you well.]    ║   │ │
│  │  ║                                                   ║   │ │
│  │  ║        [✓ Accept]  [✕ Reject]                    ║   │ │
│  │  ╚═══════════════════════════════════════════════════╝   │ │
│  │                                                          │ │
│  │  [WHITE: I wanted to reach out about the project        │ │
│  │  deadline.]                                              │ │
│  │                                                          │ │
│  │  ╔════════════ Change 2 ═══════════════════════════╗   │ │
│  │  ║                                                   ║   │ │
│  │  ║  [RED: We might need to push it back a few days.]║   │ │
│  │  ║  [RED: Because of the technical issues we've     ║   │ │
│  │  ║  been having.]                                   ║   │ │
│  │  ║  [GREEN: Due to some technical challenges we've  ║   │ │
│  │  ║  encountered, we may need to extend the deadline ║   │ │
│  │  ║  by a few days to ensure quality delivery.]      ║   │ │
│  │  ║                                                   ║   │ │
│  │  ║        [✓ Accept]  [✕ Reject]                    ║   │ │
│  │  ╚═══════════════════════════════════════════════════╝   │ │
│  │                                                          │ │
│  │  ╔════════════ Change 3 ═══════════════════════════╗   │ │
│  │  ║                                                   ║   │ │
│  │  ║  [RED: make this more professional]              ║   │ │
│  │  ║  [GREEN: Please let me know your availability to ║   │ │
│  │  ║  discuss this further.]                          ║   │ │
│  │  ║  [GREEN: ]                                       ║   │ │
│  │  ║  [GREEN: Best regards,]                          ║   │ │
│  │  ║  [GREEN: [Your name]]                            ║   │ │
│  │  ║                                                   ║   │ │
│  │  ║        [✓ Accept]  [✕ Reject]                    ║   │ │
│  │  ╚═══════════════════════════════════════════════════╝   │ │
│  │                                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  250 characters                                              │
└─────────────────────────────────────────────────────────────┘
```

### Explanation

**Change 1**: Greeting modification
- Removed: Casual greeting line
- Added: Formal greeting split across two lines

**Change 2**: Main content improvement
- Removed: Two informal lines about timeline and issues
- Added: One formal line combining both points

**Change 3**: Prompt removal and closing addition
- Removed: Yellow prompt text
- Added: Professional closing with multiple lines

**Unchanged**: Middle line "I wanted to reach out about the project deadline." stays white because it appears in both versions.

---

## Mockup 2: Shopping List Organization

### Before AI Processing

```
┌─────────────────────────────────────────────────────────────┐
│ RedGreenBlue                                    [☰ Menu]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  [BLUE: milk]                                            │ │
│  │  [BLUE: bananas]                                         │ │
│  │  [YELLOW: organize shopping list]                        │ │
│  │                                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│                                                              │
│              ✨ Process with AI                              │
│                                                              │
│  30 characters                                               │
└─────────────────────────────────────────────────────────────┘
```

### After AI Processing (with independent change groups)

```
┌─────────────────────────────────────────────────────────────┐
│ RedGreenBlue                                    [☰ Menu]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  ╔════════════ Change 1 ═══════════════════════════╗   │ │
│  │  ║                                                   ║   │ │
│  │  ║  [RED: milk]                                     ║   │ │
│  │  ║  [RED: bananas]                                  ║   │ │
│  │  ║  [RED: organize shopping list]                   ║   │ │
│  │  ║  [GREEN: ## Dairy]                               ║   │ │
│  │  ║  [GREEN: - [ ] milk]                             ║   │ │
│  │  ║  [GREEN: ]                                       ║   │ │
│  │  ║  [GREEN: ## Produce]                             ║   │ │
│  │  ║  [GREEN: - [ ] bananas]                          ║   │ │
│  │  ║                                                   ║   │ │
│  │  ║        [✓ Accept]  [✕ Reject]                    ║   │ │
│  │  ╚═══════════════════════════════════════════════════╝   │ │
│  │                                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  85 characters                                               │
└─────────────────────────────────────────────────────────────┘
```

### Explanation

**Change 1**: Complete reorganization
- Removed: All original lines (two items + prompt)
- Added: Structured markdown list with categories

This is a single change group because all lines were modified together with no unchanged sections between them.

---

## Mockup 3: Meeting Notes with Multiple Independent Changes

### Before AI Processing

```
┌─────────────────────────────────────────────────────────────┐
│ RedGreenBlue                                    [☰ Menu]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  [BLUE: The meeting is scheduled for tomorrow.]         │ │
│  │  [BLUE: Please bring your notes.]                       │ │
│  │  [BLUE: We'll discuss the quarterly goals.]             │ │
│  │  [BLUE: Thanks.]                                         │ │
│  │  [YELLOW: make more formal and add closing]             │ │
│  │                                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│                                                              │
│              ✨ Process with AI                              │
│                                                              │
│  120 characters                                              │
└─────────────────────────────────────────────────────────────┘
```

### After AI Processing (with independent change groups)

```
┌─────────────────────────────────────────────────────────────┐
│ RedGreenBlue                                    [☰ Menu]    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                                                          │ │
│  │  [WHITE: The meeting is scheduled for tomorrow.]        │ │
│  │                                                          │ │
│  │  ╔════════════ Change 1 ═══════════════════════════╗   │ │
│  │  ║                                                   ║   │ │
│  │  ║  [RED: Please bring your notes.]                 ║   │ │
│  │  ║  [GREEN: Please bring your notes and laptop.]    ║   │ │
│  │  ║                                                   ║   │ │
│  │  ║        [✓ Accept]  [✕ Reject]                    ║   │ │
│  │  ╚═══════════════════════════════════════════════════╝   │ │
│  │                                                          │ │
│  │  [WHITE: We'll discuss the quarterly goals.]            │ │
│  │                                                          │ │
│  │  ╔════════════ Change 2 ═══════════════════════════╗   │ │
│  │  ║                                                   ║   │ │
│  │  ║  [RED: Thanks.]                                  ║   │ │
│  │  ║  [RED: make more formal and add closing]         ║   │ │
│  │  ║  [GREEN: Looking forward to the discussion.]     ║   │ │
│  │  ║  [GREEN: ]                                       ║   │ │
│  │  ║  [GREEN: Best regards,]                          ║   │ │
│  │  ║  [GREEN: Sarah]                                  ║   │ │
│  │  ║                                                   ║   │ │
│  │  ║        [✓ Accept]  [✕ Reject]                    ║   │ │
│  │  ╚═══════════════════════════════════════════════════╝   │ │
│  │                                                          │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                              │
│  180 characters                                              │
└─────────────────────────────────────────────────────────────┘
```

### Explanation

**Unchanged Line 1**: "The meeting is scheduled for tomorrow." - appears in both versions

**Change 1**: Minor addition
- Removed: "Please bring your notes."
- Added: "Please bring your notes and laptop."

**Unchanged Line 2**: "We'll discuss the quarterly goals." - appears in both versions

**Change 2**: Prompt removal and closing addition
- Removed: Casual closing + prompt (2 lines)
- Added: Formal closing with signature (4 lines)

This demonstrates how unchanged lines (white) provide context between change groups, making it easier to understand what stayed the same.

---

## Button Behavior

### Per-Change Accept (✓ Accept)

**Action:** Accept THIS change group only
- RED lines in this group → deleted from document
- GREEN lines in this group → converted to WHITE (accepted text)
- Other change groups remain unchanged (still show red/green)

**Result:** This change group disappears, accepted text becomes white and editable

**Example:** If user accepts "Change 1" but not "Change 2":
- Change 1's green text becomes white
- Change 1's red text is deleted
- Change 2 still shows with red/green and its Accept/Reject buttons

### Per-Change Reject (✕ Reject)

**Action:** Reject THIS change group only
- RED lines in this group → revert to original color (blue or yellow)
- GREEN lines in this group → deleted from document
- Other change groups remain unchanged

**Result:** This change group disappears, original text is restored

**Example:** If user rejects "Change 2" but not "Change 1":
- Change 2's red text becomes blue/yellow again
- Change 2's green text is deleted
- Change 1 still shows with red/green and its Accept/Reject buttons

### Mixed Accept/Reject Scenario

Users can mix and match:
1. Accept Change 1 → becomes white
2. Reject Change 2 → reverts to blue/yellow
3. Accept Change 3 → becomes white

**Result:** Document contains a mix of white (accepted AI changes), blue/yellow (rejected, back to original), and any remaining change groups still pending decision.

---

## Key Design Principles

### 1. Line-Level Granularity
- Changes operate on entire lines, not individual words
- Makes diffs cleaner and easier to understand
- Reduces visual noise compared to word-level diffs

### 2. Independent Change Groups
- Each group of contiguous changes can be accepted/rejected separately
- Gives users fine-grained control over AI suggestions
- Users can cherry-pick the changes they like

### 3. Context Preservation
- Unchanged lines (white) remain visible between change groups
- Helps users understand what stayed the same
- Provides continuity when reading through changes

### 4. Visual Grouping
- Change groups visually separated with borders
- Clear labels ("Change 1", "Change 2", etc.)
- Each group has its own Accept/Reject buttons

### 5. Progressive Disclosure
- Users review and act on one change at a time
- No need to commit to all changes at once
- Can accept some, reject others, and continue editing

---

## Technical Implementation Notes

### Using the `diff` Package

```typescript
import { diffLines } from 'diff';

// Generate line-level diff
const originalText = spans.map(s => s.text).join('\n');
const aiGeneratedText = mockAI.response;

const diff = diffLines(originalText, aiGeneratedText);

// Group contiguous changes
interface ChangeGroup {
  id: string;
  removed: string[];  // RED lines
  added: string[];    // GREEN lines
}

const changeGroups: ChangeGroup[] = [];
let currentGroup: ChangeGroup | null = null;

diff.forEach(part => {
  if (part.removed || part.added) {
    if (!currentGroup) {
      currentGroup = { id: generateId(), removed: [], added: [] };
    }
    if (part.removed) {
      currentGroup.removed.push(...part.value.split('\n'));
    }
    if (part.added) {
      currentGroup.added.push(...part.value.split('\n'));
    }
  } else {
    // Unchanged section - closes current group
    if (currentGroup) {
      changeGroups.push(currentGroup);
      currentGroup = null;
    }
  }
});

// Don't forget the last group
if (currentGroup) {
  changeGroups.push(currentGroup);
}
```

### State Management

```typescript
interface DocumentState {
  spans: TextSpan[];
  changeGroups: ChangeGroup[];
  pendingChanges: Set<string>; // IDs of change groups not yet accepted/rejected
}

// When user accepts a change group
function acceptChangeGroup(groupId: string) {
  const group = changeGroups.find(g => g.id === groupId);
  if (!group) return;
  
  // Remove red lines, convert green lines to white
  const newSpans = spans.filter(s => !group.removed.includes(s.text))
    .map(s => group.added.includes(s.text) ? { ...s, color: 'white' } : s);
  
  updateSpans(newSpans);
  pendingChanges.delete(groupId);
}

// When user rejects a change group
function rejectChangeGroup(groupId: string) {
  const group = changeGroups.find(g => g.id === groupId);
  if (!group) return;
  
  // Remove green lines, revert red lines to original color
  const newSpans = spans.filter(s => !group.added.includes(s.text))
    .map(s => group.removed.includes(s.text) ? { ...s, color: s.originalColor } : s);
  
  updateSpans(newSpans);
  pendingChanges.delete(groupId);
}
```

---

## Edge Cases

### All Text Changed
```
╔════════════ Change 1 ═══════════════════════════╗
║  [RED: entire original document...]             ║
║  [GREEN: entirely new content...]               ║
║                                                  ║
║        [✓ Accept]  [✕ Reject]                   ║
╚══════════════════════════════════════════════════╝
```
Single change group with all content replaced.

### Only Additions
```
[WHITE: Original line 1]
[WHITE: Original line 2]

╔════════════ Change 1 ═══════════════════════════╗
║  [GREEN: New line added here]                   ║
║                                                  ║
║        [✓ Accept]  [✕ Reject]                   ║
╚══════════════════════════════════════════════════╝

[WHITE: Original line 3]
```
Change group with only green (added) lines, no red (removed) lines.

### Only Deletions
```
[WHITE: Original line 1]

╔════════════ Change 1 ═══════════════════════════╗
║  [RED: Line to be deleted]                      ║
║                                                  ║
║        [✓ Accept]  [✕ Reject]                   ║
╚══════════════════════════════════════════════════╝

[WHITE: Original line 2]
```
Change group with only red (removed) lines, no green (added) lines.

### Minimal Changes
```
[WHITE: Long unchanged section...]
[WHITE: More unchanged content...]
[WHITE: Even more unchanged text...]

╔════════════ Change 1 ═══════════════════════════╗
║  [RED: one word]                                ║
║  [GREEN: one term]                              ║
║                                                  ║
║        [✓ Accept]  [✕ Reject]                   ║
╚══════════════════════════════════════════════════╝

[WHITE: More unchanged content...]
[WHITE: Even more unchanged text...]
```
Most content is white (unchanged), with small red/green change groups.