#!/bin/bash

# Check if a path argument was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 path/to/your/submodule"
    exit 1
fi

SUBMODULE_DIR="$1"
REPO_DIR=$(pwd)

# Function to apply stashed changes and exit
cleanup() {
    cd "$REPO_DIR" || exit 1
    STASH_OUTPUT=$(git stash list)
    if [[ $STASH_OUTPUT == *"Auto-stashed by submodule update script"* ]]; then
        echo "Applying stashed changes..."
        git stash pop
        echo "Stashed changes have been reapplied."
    fi
    exit "$1"
}

# Handle unexpected errors
trap 'cleanup 1' ERR

# Stash local changes if any
STASH_OUTPUT=$(git stash push -m "Auto-stashed by submodule update script")
cd "$SUBMODULE_DIR" || exit 1

git fetch origin

LATEST_COMMIT=$(git rev-parse origin/main)
CURRENT_COMMIT=$(git rev-parse HEAD)

if [ "$LATEST_COMMIT" == "$CURRENT_COMMIT" ]; then
    echo "Submodule $SUBMODULE_DIR is up to date."
    cleanup 0
else
    echo "Submodule $SUBMODULE_DIR is not at the latest commit. Please update."
    cleanup 2
fi
