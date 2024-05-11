#!/bin/bash

# Function to add the same line to the beginning and ending of a file
prependAndAppend() {
    filepath=$1
    text=$2

    TEMP_FILE=$(mktemp)

    # Prepend and Append the text to the file
    echo "$text" > "$TEMP_FILE"
    cat "$filepath" >> "$TEMP_FILE"
    echo "$text" >> "$TEMP_FILE"

    # Replace the original file with the temporary file
    mv "$TEMP_FILE" "$filepath"
    rm "$TEMP_FILE"

    echo "--- The $filepath has been updated. ---"
}

replaceSingleLineInFile() {
    filepath=$1
    to_replace=$(echo "$2" | sed 's|/|\\/|g') # Escaping forward slashes in the search pattern
    replace_with=$(echo "$3" | sed 's|/|\\/|g') # Escaping forward slashes in the replacement pattern

    echo "Attempting to replace in file: $filepath"
    echo "Trying to replace: $to_replace"
    echo "With: $replace_with"

    if grep -q "$to_replace" "$filepath"; then
        echo "Before replacement:"
        grep "$to_replace" "$filepath"

        sed -i '' "s|$to_replace|$replace_with|g" "$filepath"

        echo "After replacement:"
        grep "$replace_with" "$filepath"
    else
        echo "Text to replace not found in $filepath."
    fi

    echo "--- $filepath has been updated. ---"
}

replaceEveryOccurenceInFile() {
    filepath=$1
    to_replace=$(echo "$2" | sed 's|/|\\/|g') # Escaping forward slashes in the search pattern
    replace_with=$(echo "$3" | sed 's|/|\\/|g') # Escaping forward slashes in the replacement pattern

    # Debug: Print the patterns to be sure they're what you expect.
    echo "Replacing '$to_replace' with '$replace_with' in $filepath"

    # Use sed to perform the replacement and capture the output for debugging.
    # Need this as we're doing more than one replacement
    sed -i.bak "s|$to_replace|$replace_with|g" "$filepath" && echo "Replacement succeeded." || echo "Replacement failed."

    # Check differences (optional, for debugging, requires the diff utility).
    # This compares the original file (backup) and the modified one to see changes.
    echo "Changes made:"
    diff "$filepath.bak" "$filepath" || true

    # Clean up the backup file.
    rm "$filepath.bak"

    # Confirm completion.
    echo "--- $filepath has been updated with every occurrence of '$to_replace' replaced with '$replace_with'. ---"
}

# --------- submodule:MRjs.io repo:mrjs-landing --------- #

# Update mrjsio submodule for landing page and
# edit the files as necessary to fit into our
# samples && testing sequence nicely

## update the submodule if necessary
echo "HI"
SUBMODULE_DIR="samples/mrjsio"
echo "HI2"
./scripts/check-and-update-submodule.sh "$SUBMODULE_DIR"
echo "HI3"
script_exit_code=$?

## If the script exit code is 2, it means updates were made
if [ $script_exit_code -eq 2 ]; then
    ### Overwrite main files
    cp "$SUBMODULE_DIR/index.html" samples/index.html
    cp "$SUBMODULE_DIR/style.css" samples/index-style.css
    cp "$SUBMODULE_DIR/favicon.svg" samples/favicon.svg
    cp "$SUBMODULE_DIR/opengraph.jpg" samples/opengraph.jpg

    ### Overwrite assets folder
    rm -rf samples/index-assets
    cp -r "$SUBMODULE_DIR/assets" samples/index-assets

    ### Add auto-generated disclaimers to index.html and index-style.css
    AUTO_GEN_DISCLAIMER="THIS IS AUTO GENERATED FROM scripts/update-all-submodules.sh ANY DIRECT EDITS WILL NOT BE SAVED"
    HTML_AUTO_GEN_DISCLAIMER="<!-- $AUTO_GEN_DISCLAIMER -->"
    CSS_AUTO_GEN_DISCLAIMER="/* $AUTO_GEN_DISCLAIMER */"
    prependAndAppend "samples/index.html" "$HTML_AUTO_GEN_DISCLAIMER"
    prependAndAppend "samples/index-style.css" "$CSS_AUTO_GEN_DISCLAIMER"

    ### overwrite build loc for index.html from whatever mrjs link to dist
    TO_REPLACE='<script src="https://cdn.jsdelivr.net/npm/mrjs@latest/dist/mr.js"></script>'
    REPLACE_WITH='<script src="./mr.js"></script>'
    replaceSingleLineInFile "samples/index.html" "$TO_REPLACE" "$REPLACE_WITH"
    ### overwrite style loc for index.html from the main link it has
    TO_REPLACE='<link rel="stylesheet" type="text/css" href="style.css" />'
    REPLACE_WITH='<link rel="stylesheet" type="text/css" href="index-style.css"/>'
    replaceSingleLineInFile "samples/index.html" "$TO_REPLACE" "$REPLACE_WITH"
    ### overwrite asset loc for index.html and index-style.css from assets-->index-assets
    TO_REPLACE="./assets/"
    REPLACE_WITH="./index-assets/"
    replaceEveryOccurenceInFile "samples/index.html" "$TO_REPLACE" "$REPLACE_WITH";
    replaceEveryOccurenceInFile "samples/index-style.css" $TO_REPLACE "$REPLACE_WITH";
    ### overwrite https://examples.mrjs.io link with nothing so that on main mrjs.io site
    ### we can keep the full url, and in this repo we can just have it direct to our own
    ### files so we can test localhost and live examples without needing to 'magic' the link.
    TO_REPLACE="https://examples.mrjs.io"
    REPLACE_WITH=""
    replaceEveryOccurenceInFile "samples/index.html" "$TO_REPLACE" "$REPLACE_WITH";
    replaceEveryOccurenceInFile "samples/index-style.css" $TO_REPLACE "$REPLACE_WITH";

    ### commit and save replacement changes
    git add samples/index-assets samples/index.html samples/index-style.css
    git commit -m "Overwrote main sample and information from mrjsio submodule"
    echo "Samples updated and committed"

    echo "----------------------------------------------------------------------"
    echo "----------------------------------------------------------------------"
    echo ">>> No changes remaining. Dont forget to 'git push' these commits! <<<"
fi
