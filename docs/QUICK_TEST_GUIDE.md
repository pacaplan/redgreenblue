# Quick Test Guide - Phase 4.1 Minimal UI (5 Minutes)

## Setup (30 seconds)

```bash
cd /Users/pcaplan/paul/redgreenblue
pnpm start
```

Open browser: **http://localhost:8081**

---

## What to Expect: Minimal UI

**Key Design:**
- ✅ Looks like you never left the text editor
- ✅ No headers ("Review AI Changes" removed)
- ✅ No border boxes around changes
- ✅ No "Change 1", "Change 2" labels
- ✅ Just colored text + small floating buttons
- ✅ Buttons appear below green text (like toggle button)

---

## 🎯 Test 1: Email Improvement (2 minutes)

### Type This (Press Enter after each line):
```
Hey Sarah, hope you're doing well.
I wanted to reach out about the project deadline.
We might need to push it back a few days.
Because of the technical issues we've been having.
make this more professional
```

### Mark Last Line Yellow:
1. Click on "make this more professional"
2. Wait for button → Click "→ Mark as Prompt"
3. Line turns yellow ✓

### Process:
Click "✨ Process with AI" → Wait ~5 seconds

### ✅ Should See (No Borders, No Headers):
```
[RED: Hey Sarah, hope you're doing well.]
[GREEN: Dear Sarah,]
[GREEN: ]
[GREEN: I hope this message finds you well.]
                         [✓ Accept] [✕ Reject]

I wanted to reach out about the project deadline.

[RED: We might need to push it back a few days.]
[RED: Because of the technical issues we've been having.]
[RED: make this more professional]
[GREEN: Due to some technical challenges...]
[GREEN: Please let me know your availability...]
[GREEN: ]
[GREEN: Best regards,]
[GREEN: [Your name]]
                         [✓ Accept] [✕ Reject]
```

**Note:** 2 change groups (not 3) - the line-level diff algorithm groups contiguous changes together.

**Key Points:**
- No header text above
- No boxes around changes
- Buttons right-aligned below green text
- White text (unchanged) between groups
- Same editor padding and font

### Quick Test:
- Click "✓ Accept" on first button → green becomes white ✓
- Click "✓ Accept" on second button → back to editor ✓

---

## 🎯 Test 2: Shopping List (1 minute)

### Type This:
```
milk
bananas
organize shopping list
```

### Mark Last Line Yellow

### Process:
Click "✨ Process with AI"

### ✅ Should See:
```
[RED: milk]
[RED: bananas]
[RED: organize shopping list]
[GREEN: ## Dairy]
[GREEN: - [ ] milk]
[GREEN: ]
[GREEN: ## Produce]
[GREEN: - [ ] bananas]
                         [✓ Accept] [✕ Reject]
```

**One change group, one button pair below all green text**

### Quick Test:
Click "✓ Accept" → all green→white, red disappears ✓

---

## 🎯 Test 3: Meeting Notes (1 minute)

### Type This:
```
The meeting is scheduled for tomorrow.
Please bring your notes.
We'll discuss the quarterly goals.
Thanks.
make more formal and add closing
```

### Mark Last Line Yellow

### Process:
Click "✨ Process with AI"

### ✅ Should See:
```
The meeting is scheduled for tomorrow.

[RED: Please bring your notes.]
[GREEN: Please bring your notes and laptop.]
                         [✓ Accept] [✕ Reject]

We'll discuss the quarterly goals.

[RED: Thanks.]
[RED: make more formal and add closing]
[GREEN: Looking forward to the discussion.]
[GREEN: ]
[GREEN: Best regards,]
[GREEN: Sarah]
                         [✓ Accept] [✕ Reject]
```

**Two button pairs, positioned below each green section**

---

## 🎨 Visual Check

### UI Elements to Verify:
- [ ] **No header text** ("Review AI Changes" should NOT appear)
- [ ] **No border boxes** (no gray borders around changes)
- [ ] **No change labels** (no "Change 1", "Change 2" text)
- [ ] **Minimal buttons** (small, right-aligned below green)
- [ ] **Button colors:**
  - Accept button: Light green background (#E5FFE5)
  - Reject button: Light red background (#FFE5E5)
  - Both with black text
- [ ] **Same editor style:**
  - Same padding (16px sides, 32px top/bottom)
  - Same font (monospace, 18px)
  - Same line height (26px)

### Colors (use DevTools F12):
- Blue: `#E5F2FF` bg, `#0066CC` text
- Yellow: `#FFF9E5` bg, `#B8860B` text
- Red: `#FFE5E5` bg, `#CC0000` text
- Green: `#E5FFE5` bg, `#007700` text

---

## ⚡ Quick Checks

| Test | Expected | Pass? |
|------|----------|-------|
| Type text → blue | Light blue background | [ ] |
| Toggle → yellow | Light yellow background | [ ] |
| Process AI | Loading animation ~3-8 sec | [ ] |
| **No header** | No "Review AI Changes" text | [ ] |
| **No borders** | No boxes around changes | [ ] |
| **No labels** | No "Change 1" text | [ ] |
| Buttons below green | Right-aligned, small buttons | [ ] |
| Button colors | Light green/red backgrounds | [ ] |
| Accept | Removes red, green→white | [ ] |
| Reject | Removes green, red→blue | [ ] |
| Seamless feel | Looks like same editor | [ ] |

---

## 🐛 Common Issues

**Buttons not appearing:**
- Check: Are there green lines? (buttons appear below green)
- Check: Browser console (F12) for errors

**Buttons in wrong position:**
- Should be below last green line of each group
- Should overlay slightly if red text below

**Still seeing old UI (boxes/headers):**
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows)
- Clear cache and reload

---

## ✅ Success Criteria

**Minimal UI Works If:**
- ✨ No header text above editor
- ✨ No border boxes around changes
- ✨ No "Change 1" labels
- ✨ Small buttons appear below green text
- ✨ Button colors match text backgrounds
- ✨ Feels like staying in same editor
- ✨ Accept/Reject work correctly
- ✨ All 3 test scenarios pass

---

## 💡 Design Philosophy

**Goal:** Make it feel like you never left the text editor.

**Before:** Complex UI with headers, borders, boxes
**After:** Just colored text + minimal floating buttons

**Like Toggle Button:** Same pattern - small button below text, right-aligned, minimal style.

---

**Total Time:** ~5 minutes for all tests
**Detailed Guide:** See `TESTING_PHASE_4_1.md` (updated for minimal UI)
**Design Doc:** See `MINIMAL_UI_DESIGN.md` for full design rationale
