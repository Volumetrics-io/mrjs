#!/bin/bash

##################################################################
## !!                    IMPORTANT                           !! ##
## -- starts by stashing whatever local changes are made if any ##
##    to not have issues with bumping the submodule commit.     ##
## -- if submodule needs an update, then updates it and         ##
##    commits the changes in this main repo.                    ##
## -- applies the stashed changes on any type of exit (error,   ##
##    success, etc) to put the user back in their original      ##
##    state.                                                    ##
##################################################################

# Function to handle script exit without needing an update
cleanup_success() {
    apply_stash
    exit 0
}

# Function to handle script exit with an update
cleanup_update() {
    apply_stash
    exit 2
}

# Function to handle unexpected errors
error_handler() {
    echo "An error occurred. Cleaning up..."
    apply_stash
    exit 1
}

# Function to apply stashed changes
apply_stash() {
    if [ "$STASH_APPLIED" = true ]; then
        echo "Applying stashed changes..."
        cd "$REPO_DIR" || exit 1
        git stash apply
        echo "Stashed changes have been reapplied."
    fi
}

# Check if a path argument was provided
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 path/to/your/submodule"
    exit 1
fi

SUBMODULE_DIR="$1"
REPO_DIR=$(pwd)

trap error_handler ERR
trap cleanup_success EXIT

STASH_OUTPUT=$(git stash push -m "Auto-stashed by submodule update script")
if [[ "$STASH_OUTPUT" == *"No local changes to save"* ]]; then
    STASH_APPLIED=false
else
    STASH_APPLIED=true
fi

cd "$SUBMODULE_DIR" || exit 1

git fetch origin

LATEST_COMMIT=$(git rev-parse origin/main)
CURRENT_COMMIT=$(git rev-parse HEAD)

if [ "$LATEST_COMMIT" == "$CURRENT_COMMIT" ]; then
    echo "Submodule $SUBMODULE_DIR is up to date."
else
    echo "Submodule $SUBMODULE_DIR is not at the latest commit. Updating..."
    git checkout $LATEST_COMMIT
    cd "$REPO_DIR"
    git add "$SUBMODULE_DIR"
    git commit -m "Updated submodule $SUBMODULE_DIR to its latest repo commit: $LATEST_COMMIT"
    echo "Submodule updated and committed."

    # Change the trap for EXIT to use the cleanup_update function
    trap cleanup_update EXIT
fi
