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

    echo "The $filepath has been updated."
}

replaceSingleLineInFile() {
    filepath=$1
    to_replace=$2
    replace_with=$3

    # Check if the file contains the text to replace
    if grep -q "$to_replace" "$filepath"; then
        # Print the original line
        echo "Before replacement:"
        grep "$to_replace" "$filepath"

        # Perform the replacement
        sed -i "s|$to_replace|$replace_with|" "$filepath"

        # Print the new line
        echo "After replacement:"
        grep "$replace_with" "$filepath"
    else
        echo "Text to replace not found in $filepath."
    fi

    # Confirm completion
    echo "$filepath has been updated."
}

replaceEveryOccurenceInFile() {
    filepath=$1
    to_replace=$2
    replace_with=$3

    # Ensure the text exists in the file before attempting replacement
    if grep -q "$to_replace" "$filepath"; then
        # Read the file line by line
        while IFS= read -r line; do
            # Check if the line contains the text to be replaced
            if echo "$line" | grep -q "$to_replace"; then
                # Print the before and after subsections for each replacement
                echo "Before: $line"
                line=$(echo "$line" | sed "s|$to_replace|$replace_with|g")
                echo "After: $line"
            fi
        done < "$filepath"

        # Perform the global replacement
        sed -i "s|$to_replace|$replace_with|g" "$filepath"
    else
        echo "Text to replace not found in $filepath."
    fi

    # Confirm completion
    echo "$filepath has been updated with every occurrence of '$to_replace' replaced with '$replace_with'."
}

# --------- submodule:MRjs.io repo:mrjs-landing --------- #

# Update mrjsio submodule for landing page and 
# edit the files as necessary to fit into our 
# samples && testing sequence nicely

## update the submodule if necessary
SUBMODULE_DIR="samples/mrjsio"
./scripts/check-and-update-submodule.sh "$SUBMODULE_DIR"
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
fi
