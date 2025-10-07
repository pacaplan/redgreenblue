# Phase 4.1 Testing Guide - Line-Level Diff Display with Per-Change Accept/Reject

## Prerequisites

1. **Start the development server:**
   ```bash
   cd /Users/pcaplan/paul/redgreenblue
   pnpm start
   ```

2. **Open the app in your browser:**
   - Navigate to: **http://localhost:8081**
   - You should see the RedGreenBlue text editor with a blank canvas
   - The app should display "Start typing..." placeholder text

## How the App Works

### Normal Editing Mode
1. Type text → appears with **light blue background** (#E5F2FF)
2. Each line is a separate "span" (press Enter to create new lines)
3. Click toggle button on a line → toggles between **blue** and **yellow** (prompt)
4. Yellow lines = instructions to the AI
5. When you have blue/yellow text, "✨ Process with AI" button appears at bottom

### AI Processing
1. Click "✨ Process with AI"
2. Loading overlay appears with progress animation (~3-8 seconds)
3. System generates line-level diff between your text and AI response
4. App switches to **Diff View** mode

### Diff View Mode
1. See **Change Groups** with borders and labels
2. Each group shows:
   - **RED text** (#FFE5E5 background, #CC0000 text) = removed/original lines
   - **GREEN text** (#E5FFE5 background, #007700 text) = added/new lines
   - **Accept** (green button) and **Reject** (red button)
3. **WHITE text** between groups = unchanged lines (context)
4. Review and click Accept/Reject for each change group
5. After all groups resolved → returns to normal editing mode

---

## Test Scenario 1: Email Improvement (Mockup 1)

### What This Tests
- Multiple independent change groups
- White (unchanged) context between groups
- Yellow prompt text being removed
- Mixed line modifications

### Step-by-Step Instructions

1. **Clear the editor** (if there's any text, delete it all)

2. **Type the following text** (press Enter after each line):
   ```
   Hey Sarah, hope you're doing well.
   I wanted to reach out about the project deadline.
   We might need to push it back a few days.
   Because of the technical issues we've been having.
   make this more professional
   ```
   - All 5 lines should have **light blue background**

3. **Mark the last line as a prompt:**
   - Click anywhere on the line "make this more professional"
   - Wait 500ms - a button should appear on the right side
   - Button should say "→ Mark as Prompt" with **light yellow background**
   - Click the button
   - The line "make this more professional" should turn **light yellow**

4. **Process with AI:**
   - Scroll down to see the "✨ Process with AI" button at the bottom
   - Click it
   - You should see:
     - Processing overlay appears
     - Messages: "Analyzing your text...", "Understanding context...", etc.
     - Progress bar animates
     - Wait ~3-8 seconds

5. **Verify Diff View appears:**
   - Processing overlay disappears
   - You should now see **"Review AI Changes"** header
   - Below that: "Accept or reject each change independently"

### Expected Result: 2 Change Groups

**Change 1:**
```
╔════════════ Change 1 ═══════════════════════════╗
║                                                   ║
║  [RED] Hey Sarah, hope you're doing well.        ║
║  [GREEN] Dear Sarah,                             ║
║  [GREEN]                                         ║
║  [GREEN] I hope this message finds you well.     ║
║                                                   ║
║        [✓ Accept]  [✕ Reject]                    ║
╚═══════════════════════════════════════════════════╝
```
- RED: 1 line (original casual greeting)
- GREEN: 3 lines (formal greeting split across multiple lines)

**[WHITE] Context:**
```
I wanted to reach out about the project deadline.
```
- This line unchanged, appears in white/gray

**Change 2:**
```
╔════════════ Change 2 ═══════════════════════════╗
║                                                   ║
║  [RED] We might need to push it back a few days. ║
║  [RED] Because of the technical issues we've     ║
║        been having.                               ║
║  [RED] make this more professional               ║
║  [GREEN] Due to some technical challenges we've  ║
║          encountered, we may need to extend the  ║
║          deadline by a few days to ensure        ║
║          quality delivery.                        ║
║  [GREEN] Please let me know your availability to ║
║          discuss this further.                    ║
║  [GREEN]                                         ║
║  [GREEN] Best regards,                           ║
║  [GREEN] [Your name]                             ║
║                                                   ║
║        [✓ Accept]  [✕ Reject]                    ║
╚═══════════════════════════════════════════════════╝
```
- RED: 3 lines (original informal explanation + prompt)
- GREEN: 7 lines (formal explanation + professional closing)

**Note:** The line-level diff algorithm groups contiguous changes together, so lines 3-5 form a single change group since there's no unchanged text between them.

### Test Actions

**Test 1: Accept Change 1**
- Click "✓ Accept" on Change 1
- Expected:
  - RED line disappears
  - GREEN lines become WHITE (transparent background, black text)
  - Change 1 box disappears
  - Change 2 remains visible

**Test 2: Accept Change 2**
- Click "✓ Accept" on Change 2
- Expected:
  - RED lines disappear
  - GREEN lines become WHITE
  - Change 2 box disappears
  - Message: "All changes have been reviewed!"
  - Returns to normal editor mode
  - Document now shows the accepted professional email text

**Alternative: Reject Change 2**
- If you reject Change 2 instead:
  - GREEN lines disappear
  - RED lines turn back to BLUE (light blue background)
  - Change 2 box disappears
  - Returns to editor with original informal text restored

---

## Test Scenario 2: Shopping List Organization (Mockup 2)

### What This Tests
- All text changed at once (single change group)
- Yellow prompt removal
- Markdown formatting added by AI

### Step-by-Step Instructions

1. **Clear the editor completely**

2. **Type the following** (press Enter after each line):
   ```
   milk
   bananas
   organize shopping list
   ```
   - All 3 lines should be **light blue**

3. **Mark last line as prompt:**
   - Click on "organize shopping list"
   - Wait for toggle button → Click it
   - Line should turn **light yellow**

4. **Process with AI:**
   - Click "✨ Process with AI"
   - Wait for processing (~3-8 seconds)

### Expected Result: 1 Change Group (All Changed)

**Change 1:**
```
╔════════════ Change 1 ═══════════════════════════╗
║                                                   ║
║  [RED] milk                                       ║
║  [RED] bananas                                    ║
║  [RED] organize shopping list                     ║
║  [GREEN] ## Dairy                                 ║
║  [GREEN] - [ ] milk                               ║
║  [GREEN]                                          ║
║  [GREEN] ## Produce                               ║
║  [GREEN] - [ ] bananas                            ║
║                                                   ║
║        [✓ Accept]  [✕ Reject]                    ║
╚═══════════════════════════════════════════════════╝
```
- RED: 3 lines (all original text including yellow prompt)
- GREEN: 5 lines (organized markdown with categories)
- No white context (everything changed)

### Test Actions

**Test Accept:**
- Click "✓ Accept"
- Expected:
  - All RED lines disappear
  - All GREEN lines become WHITE
  - Returns to editor immediately
  - Document shows organized markdown list with checkboxes

**Alternative Test - Reject:**
- Instead, click "✕ Reject"
- Expected:
  - All GREEN lines disappear
  - All RED lines revert: first 2 to BLUE, last to YELLOW
  - Returns to editor
  - Document back to original "milk", "bananas", "organize shopping list"

---

## Test Scenario 3: Meeting Notes (Mockup 3)

### What This Tests
- Multiple change groups with unchanged context
- Minor edits vs major edits
- Mixed accept/reject workflow

### Step-by-Step Instructions

1. **Clear the editor**

2. **Type the following:**
   ```
   The meeting is scheduled for tomorrow.
   Please bring your notes.
   We'll discuss the quarterly goals.
   Thanks.
   make more formal and add closing
   ```

3. **Mark last line as prompt:**
   - Toggle "make more formal and add closing" to yellow

4. **Process with AI**

### Expected Result: 2 Change Groups with White Context

**[WHITE] Context:**
```
The meeting is scheduled for tomorrow.
```

**Change 1:**
```
╔════════════ Change 1 ═══════════════════════════╗
║                                                   ║
║  [RED] Please bring your notes.                  ║
║  [GREEN] Please bring your notes and laptop.     ║
║                                                   ║
║        [✓ Accept]  [✕ Reject]                    ║
╚═══════════════════════════════════════════════════╝
```

**[WHITE] Context:**
```
We'll discuss the quarterly goals.
```

**Change 2:**
```
╔════════════ Change 2 ═══════════════════════════╗
║                                                   ║
║  [RED] Thanks.                                    ║
║  [RED] make more formal and add closing          ║
║  [GREEN] Looking forward to the discussion.      ║
║  [GREEN]                                         ║
║  [GREEN] Best regards,                           ║
║  [GREEN] Sarah                                   ║
║                                                   ║
║        [✓ Accept]  [✕ Reject]                    ║
╚═══════════════════════════════════════════════════╝
```

### Test Mixed Accept/Reject

**Step 1: Accept Change 1**
- Click "✓ Accept" on Change 1
- Expected: "Please bring your notes and laptop." becomes white

**Step 2: Reject Change 2**
- Click "✕ Reject" on Change 2
- Expected: 
  - GREEN lines disappear
  - RED lines revert (first to blue, second to yellow)
  - Returns to editor
  - Document has: white text + blue text + yellow text mixed together

---

## Edge Case Tests

### Edge Case 1: All Text Changed
**Input:** Any simple text like:
```
hello world
this is a test
```
**Process with AI**
**Expected:** Single change group, 100% red → 100% green

### Edge Case 2: Empty Document
**Input:** Nothing (blank editor)
**Expected:** "✨ Process with AI" button should NOT appear

### Edge Case 3: Only Blue Text (No Prompts)
**Input:** 
```
Send email to team
Update documentation
Review pull requests
```
*Don't mark any as yellow*
**Process with AI**
**Expected:** AI should still process and show improvements

### Edge Case 4: Only Yellow Text (All Prompts)
**Input:**
```
make this formal
add bullet points
improve grammar
```
*Mark ALL lines as yellow*
**Process with AI**
**Expected:** Should work, all yellow lines become red in diff

---

## Visual Verification Checklist

### Color Accuracy (use browser DevTools to inspect)

**Background Colors:**
- [ ] Blue text: `background-color: #E5F2FF`
- [ ] Yellow text: `background-color: #FFF9E5`
- [ ] Red text: `background-color: #FFE5E5`
- [ ] Green text: `background-color: #E5FFE5`
- [ ] White text: `background-color: transparent`

**Text Colors:**
- [ ] Blue text: `color: #0066CC`
- [ ] Yellow text: `color: #B8860B`
- [ ] Red text: `color: #CC0000`
- [ ] Green text: `color: #007700`
- [ ] White text: `color: #111111`

### UI Elements
- [ ] Change group boxes have gray border and rounded corners
- [ ] Change group headers show "Change 1", "Change 2", etc.
- [ ] Accept button is green (#4CAF50)
- [ ] Reject button is red (#F44336)
- [ ] Buttons dim when pressed (opacity: 0.7)
- [ ] White context text visible between change groups
- [ ] Header reads "Review AI Changes"
- [ ] Subheader reads "Accept or reject each change independently"
- [ ] "All changes have been reviewed!" appears when done

### Interactions
- [ ] Toggle button appears 500ms after clicking a line
- [ ] Toggle button shows correct label ("Mark as Prompt" or "Mark as Text")
- [ ] "Process with AI" button only appears with blue/yellow text
- [ ] Processing overlay shows progress animation
- [ ] Accept removes red, converts green to white
- [ ] Reject removes green, reverts red to original
- [ ] Can scroll in diff view
- [ ] Returns to editor after all changes resolved

---

## Troubleshooting

### "Process with AI" button doesn't appear
- **Check:** Do you have any text typed? (blue or yellow)
- **Fix:** Type at least one line of text

### Toggle button doesn't appear
- **Check:** Did you click on a blue or yellow line?
- **Wait:** Button appears after 500ms of inactivity
- **Check:** Is the line blank? (empty lines don't show button)

### No change groups after processing
- **Check:** Browser console for errors (F12 → Console tab)
- **Check:** Did processing complete? (look for "Processing complete!")
- **Refresh:** Hard refresh (Cmd+Shift+R or Ctrl+Shift+R)

### Colors look wrong
- **Clear cache:** Hard refresh browser
- **Check:** Use DevTools to inspect actual color values
- **Restart:** Stop server (Ctrl+C) and restart (`pnpm start`)

### Accept/Reject doesn't work
- **Check:** Browser console for errors
- **Verify:** Button press is registering (should see visual feedback)
- **Refresh:** Reload the page and try again

### App won't load
- **Check:** Server is running (`pnpm start`)
- **Check:** Navigate to http://localhost:8081 (not https)
- **Check:** Terminal for error messages
- **Try:** Different browser (Chrome, Firefox, Safari)

---

## Success Criteria

✅ **Phase 4.1 is complete if:**

1. Can type text and see blue highlighting
2. Can toggle lines to yellow (prompts)
3. "Process with AI" button appears and works
4. AI processing shows loading animation
5. Diff view displays after processing
6. Change groups show with correct red/green/white colors
7. Accept button removes red, converts green to white
8. Reject button removes green, reverts red to original
9. Can resolve multiple change groups independently
10. Returns to normal editor after all groups resolved
11. All colors match specification exactly
12. All 3 mockup scenarios work correctly

---

## Reporting Issues

If you find bugs or unexpected behavior:

1. **Note the scenario:** Which test were you running?
2. **Document steps:** Exact sequence that triggered the issue
3. **Check console:** Browser DevTools → Console for errors
4. **Screenshot:** Visual issues should be captured
5. **Expected vs Actual:** What should happen vs what happened

---

## Next Steps

After Phase 4.1 testing is complete:
- **Phase 4.2:** Implement additional accept/reject polish
- **Phase 4.3:** Continue editing after accepting/rejecting changes
- **Phase 5:** Add animations, haptic feedback, and final polish
