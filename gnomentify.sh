#!/bin/bash
# filepath: auto_replace.sh
# This script makes canned search and replace changes in a given file.
# It creates a backup (<filename>.bak) before making in-place changes.

if [ $# -ne 1 ]; then
  echo "Usage: $0 <filename>"
  exit 1
fi

FILE="$1"

# Create a backup of the original file.
cp "$FILE" "$FILE.bak" || { echo "Cannot create backup file."; exit 1; }

sed -i'' -e 's/moment./gnoment./g' "$FILE"
sed -i'' -e 's/moment(/gnoment(/g' "$FILE"
sed -i'' -e 's/momentToCalendarDateTime/gnomentToCalendarDateTime,/g' "$FILE"
sed -i'' -e 's/momentToCalendarDate/gnomentToCalendarDate,/g' "$FILE"
sed -i'' -e 's/momentToZonedDateTime/gnomentToZonedDateTime,/g' "$FILE"

# Add additional search & replace commands as needed:
# sed -i'' -e 's/oldPattern/newReplacement/g' "$FILE"

echo "Replacements complete. Backup saved as ${FILE}.bak"