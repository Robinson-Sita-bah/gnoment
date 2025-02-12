#!/bin/bash
# filepath: auto_replace.sh
# This script makes canned search and replace changes in a given file.

if [ $# -ne 1 ]; then
  echo "Usage: $0 <filename>"
  exit 1
fi

FILE="$1"


sed -i'' -e 's/moment/gnoment/g' "$FILE"
sed -i'' -e 's/moment()/gnoment()/g' "$FILE"
sed -i'' -e 's/momentToCalendarDateTime/gnomentToCalendarDateTime,/g' "$FILE"
sed -i'' -e 's/momentToCalendarDate/gnomentToCalendarDate,/g' "$FILE"
sed -i'' -e 's/momentToZonedDateTime/gnomentToZonedDateTime,/g' "$FILE"

echo "Replacements complete."