import { diffLines, Change } from 'diff';
import { TextSpan } from '../types/colors';

/**
 * Represents a group of contiguous changes (additions and removals)
 * Each change group can be independently accepted or rejected
 */
export interface ChangeGroup {
  id: string;
  removedLines: string[];  // RED lines (original text)
  addedLines: string[];    // GREEN lines (AI-generated text)
  startLineIndex: number;  // Position in the overall document
}

/**
 * Represents the complete diff result including change groups and unchanged lines
 */
export interface DiffResult {
  changeGroups: ChangeGroup[];
  diffSpans: TextSpan[]; // All spans (red, green, white) for rendering
}

/**
 * Generate a unique ID for change groups
 */
const generateChangeGroupId = (): string => {
  return `change_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate line-level diff between original and AI-generated text
 * Groups contiguous changes into change groups for independent accept/reject
 * 
 * @param originalSpans - Original text spans (blue and yellow)
 * @param aiGeneratedText - AI-generated text
 * @returns DiffResult with change groups and display spans
 */
export const generateLineDiff = (
  originalSpans: TextSpan[],
  aiGeneratedText: string
): DiffResult => {
  // Convert original spans to text
  const originalText = originalSpans.map(span => span.text).join('\n');
  
  // Generate line-level diff using diff package
  const diffResult = diffLines(originalText, aiGeneratedText);
  
  // Group contiguous changes into change groups
  const changeGroups: ChangeGroup[] = [];
  const diffSpans: TextSpan[] = [];
  let currentGroup: ChangeGroup | null = null;
  let lineIndex = 0;
  
  diffResult.forEach((part: Change) => {
    const lines = part.value.split('\n');
    // Remove last empty line if it exists (split artifact)
    if (lines[lines.length - 1] === '') {
      lines.pop();
    }
    
    if (part.added || part.removed) {
      // Start a new change group if we don't have one
      if (!currentGroup) {
        currentGroup = {
          id: generateChangeGroupId(),
          removedLines: [],
          addedLines: [],
          startLineIndex: lineIndex,
        };
      }
      
      // Add lines to current group
      if (part.removed) {
        currentGroup.removedLines.push(...lines);
        // Create red spans for removed lines
        lines.forEach(line => {
          diffSpans.push({
            id: `red_${generateChangeGroupId()}`,
            text: line,
            color: 'red',
            changeGroupId: currentGroup!.id,
          });
        });
      } else if (part.added) {
        currentGroup.addedLines.push(...lines);
        // Create green spans for added lines
        lines.forEach(line => {
          diffSpans.push({
            id: `green_${generateChangeGroupId()}`,
            text: line,
            color: 'green',
            changeGroupId: currentGroup!.id,
          });
        });
      }
      
      lineIndex += lines.length;
    } else {
      // Unchanged section - close current group if it exists
      if (currentGroup) {
        changeGroups.push(currentGroup);
        currentGroup = null;
      }
      
      // Create white spans for unchanged lines
      lines.forEach(line => {
        diffSpans.push({
          id: `white_${generateChangeGroupId()}`,
          text: line,
          color: 'white',
        });
      });
      
      lineIndex += lines.length;
    }
  });
  
  // Don't forget the last group if it exists
  if (currentGroup) {
    changeGroups.push(currentGroup);
  }
  
  return {
    changeGroups,
    diffSpans,
  };
};

/**
 * Find which change group a span belongs to based on its changeGroupId
 * Used for mapping spans to their change groups for rendering
 */
export const findChangeGroupForSpan = (
  span: TextSpan,
  changeGroups: ChangeGroup[]
): ChangeGroup | null => {
  if (!span.changeGroupId) {
    return null;
  }
  
  return changeGroups.find(g => g.id === span.changeGroupId) || null;
};

/**
 * Group spans by their change groups for rendering
 * Returns array of span groups where each group contains:
 * - changeGroup: the change group metadata (or null for white spans)
 * - spans: array of spans belonging to this group
 */
export interface SpanGroup {
  changeGroup: ChangeGroup | null;
  spans: TextSpan[];
}

export const groupSpansByChangeGroup = (
  spans: TextSpan[],
  changeGroups: ChangeGroup[]
): SpanGroup[] => {
  const groups: SpanGroup[] = [];
  let currentGroup: SpanGroup | null = null;
  
  spans.forEach(span => {
    const changeGroup = findChangeGroupForSpan(span, changeGroups);
    
    // If this span belongs to a different group than the current one, start a new group
    if (!currentGroup || currentGroup.changeGroup?.id !== changeGroup?.id) {
      currentGroup = {
        changeGroup,
        spans: [span],
      };
      groups.push(currentGroup);
    } else {
      // Add to current group
      currentGroup.spans.push(span);
    }
  });
  
  return groups;
};

