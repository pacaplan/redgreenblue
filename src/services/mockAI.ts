import { TextSpan } from '../types/colors';

/**
 * Mock AI service that simulates realistic AI processing delays and generates
 * contextually appropriate responses based on input text content.
 */

// Delay around 2 seconds for AI processing
const getRandomDelay = (): number => {
  return Math.floor(Math.random() * 1000) + 1500; // 1500-2500ms
};

// Detect the type of content to generate appropriate mock responses
type ContentType = 'shopping' | 'email' | 'meeting' | 'general';

const detectContentType = (text: string): ContentType => {
  const lowerText = text.toLowerCase();
  
  // Shopping list detection
  if (
    lowerText.includes('buy') ||
    lowerText.includes('get') ||
    lowerText.includes('store') ||
    lowerText.includes('milk') ||
    lowerText.includes('eggs') ||
    lowerText.includes('bread') ||
    /^\s*[-•*]\s/m.test(text) // List markers
  ) {
    return 'shopping';
  }
  
  // Email detection
  if (
    lowerText.includes('email') ||
    lowerText.includes('message') ||
    lowerText.includes('send') ||
    lowerText.includes('dear') ||
    lowerText.includes('hi ') ||
    lowerText.includes('hello')
  ) {
    return 'email';
  }
  
  // Meeting notes detection
  if (
    lowerText.includes('meeting') ||
    lowerText.includes('agenda') ||
    lowerText.includes('action items') ||
    lowerText.includes('discussed') ||
    lowerText.includes('attendees')
  ) {
    return 'meeting';
  }
  
  return 'general';
};

// Generate mock responses based on content type
const generateShoppingResponse = (originalText: string): string => {
  const lowerText = originalText.toLowerCase();
  
  // Check if this matches the mockup shopping list scenario
  if (lowerText.includes('milk') && lowerText.includes('banana') && lowerText.includes('organize')) {
    // Return the exact response from Mockup 2
    return `## Dairy
- [ ] milk

## Produce
- [ ] bananas`;
  }
  
  return `# Shopping List

## Groceries
- Organic milk (1 gallon)
- Free-range eggs (dozen)
- Whole grain bread
- Fresh vegetables (carrots, lettuce)

## Household
- Paper towels
- Dish soap

## Total Items: 6`;
};

const generateEmailResponse = (originalText: string): string => {
  const lines = originalText.split('\n').filter(line => line.trim());
  
  // Check if this matches the mockup email scenario
  const lowerText = originalText.toLowerCase();
  if (lowerText.includes('sarah') && lowerText.includes('project') && lowerText.includes('professional')) {
    // Return response structured to create 3 change groups via line-level diff
    // Group 1: Replace line 1 → multiple new lines
    // White: Line 2 stays unchanged
    // Group 2: Replace lines 3-4 → new lines
    // White: We'll add a blank line here that appears in original too
    // Group 3: Replace line 5 → new closing lines
    //
    // Since original doesn't have blank line between 4 and 5, we can't create
    // separation unless... let me try treating lines 3-5 as ONE group
    // and manually split them in the diff somehow. Actually, that won't work.
    //
    // The ONLY way to get 3 groups is if there's unchanged text between them.
    // Let me check if the ORIGINAL might have a blank line we're missing...
    // Actually, the test says to press Enter after each line, which creates
    // 5 text spans, no blank lines between.
    //
    // I think the test expectations might be wrong, OR there's a different
    // mechanism. Let me just generate good output and see how many groups result.
    return `Dear Sarah,

I hope this message finds you well.
I wanted to reach out about the project deadline.
Due to some technical challenges we've encountered, we may need to extend the deadline by a few days to ensure quality delivery.
Please let me know your availability to discuss this further.

Best regards,
[Your name]`;
  }
  
  // Generic professional email improvement
  return `Dear [Recipient],

I hope this message finds you well. I wanted to reach out regarding the matter we discussed previously.

${lines[0] || 'I would like to follow up on our conversation'}

I look forward to hearing your thoughts on this.

Best regards,
[Your Name]`;
};

const generateMeetingResponse = (originalText: string): string => {
  const lowerText = originalText.toLowerCase();
  
  // Check if this matches the mockup meeting notes scenario
  if (lowerText.includes('meeting is scheduled') && lowerText.includes('formal')) {
    // Return the exact response from Mockup 3
    return `The meeting is scheduled for tomorrow.
Please bring your notes and laptop.
We'll discuss the quarterly goals.
Looking forward to the discussion.

Best regards,
Sarah`;
  }
  
  return `# Meeting Summary

**Date:** ${new Date().toLocaleDateString()}
**Attendees:** Team members

## Key Discussion Points
- ${originalText.split('\n')[0] || 'Main topics covered'}
- Progress updates from each team member
- Upcoming milestones and deadlines

## Action Items
1. Review documentation by end of week
2. Schedule follow-up meeting
3. Share updates with stakeholders

## Next Steps
Follow up on action items by next meeting.`;
};

const generateGeneralResponse = (originalText: string): string => {
  // For general text, create an improved version
  const lines = originalText.split('\n').filter(line => line.trim());
  
  if (lines.length === 0) {
    return 'Please provide some text to improve.';
  }
  
  // Create a polished version
  const improved = lines.map(line => {
    // Capitalize first letter
    const trimmed = line.trim();
    if (trimmed.length === 0) return line;
    
    const capitalized = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    
    // Add period if missing
    if (!capitalized.match(/[.!?]$/)) {
      return capitalized + '.';
    }
    
    return capitalized;
  }).join(' ');
  
  return improved;
};

const generateMockResponse = (textSpans: TextSpan[]): string => {
  // Combine all blue and yellow text (ignore other colors)
  const textToProcess = textSpans
    .filter(span => span.color === 'blue' || span.color === 'yellow')
    .map(span => span.text)
    .join('\n');
  
  if (!textToProcess.trim()) {
    return 'No text to process.';
  }
  
  const lowerText = textToProcess.toLowerCase();
  
  // Check for specific test scenarios first (before general detection)
  if (lowerText.includes('sarah') && lowerText.includes('project') && lowerText.includes('professional')) {
    return generateEmailResponse(textToProcess);
  }
  
  if (lowerText.includes('milk') && lowerText.includes('banana') && lowerText.includes('organize')) {
    return generateShoppingResponse(textToProcess);
  }
  
  if (lowerText.includes('meeting is scheduled') && lowerText.includes('formal')) {
    return generateMeetingResponse(textToProcess);
  }
  
  // Fall back to general content type detection
  const contentType = detectContentType(textToProcess);
  
  switch (contentType) {
    case 'shopping':
      return generateShoppingResponse(textToProcess);
    case 'email':
      return generateEmailResponse(textToProcess);
    case 'meeting':
      return generateMeetingResponse(textToProcess);
    case 'general':
    default:
      return generateGeneralResponse(textToProcess);
  }
};

/**
 * Process text with AI (mock implementation)
 * Returns a promise that resolves with the AI-generated suggestion after a realistic delay
 */
export const processWithAI = async (textSpans: TextSpan[]): Promise<string> => {
  const delay = getRandomDelay();
  
  // Wait for the random delay to simulate AI processing
  await new Promise(resolve => setTimeout(resolve, delay));
  
  // Generate and return mock response
  return generateMockResponse(textSpans);
};

export const mockAI = {
  processWithAI,
};
