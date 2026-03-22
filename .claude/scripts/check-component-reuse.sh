#!/bin/bash
# Check if component files exist outside the global components directory
# Used by PreToolUse hooks to enforce component reuse

FILE_PATH="$1"
PROJECT_ROOT="$2"

# Skip if the file IS in the components directory (that's where globals go)
if [[ "$FILE_PATH" == *"/components/"* ]] || [[ "$FILE_PATH" == *"\\components\\"* ]]; then
  exit 0
fi

# Skip non-component files
if [[ "$FILE_PATH" != *.tsx ]] && [[ "$FILE_PATH" != *.jsx ]]; then
  exit 0
fi

# Check if the file contains a component export that should be global
if grep -q "export.*function\|export.*const.*=.*(" "$FILE_PATH" 2>/dev/null; then
  COMPONENT_COUNT=$(grep -c "export.*function\|export.*const.*=.*(" "$FILE_PATH" 2>/dev/null)
  if [ "$COMPONENT_COUNT" -gt 2 ]; then
    echo "WARNING: File contains $COMPONENT_COUNT exported components. Consider moving reusable ones to src/components/"
    exit 0
  fi
fi

exit 0
