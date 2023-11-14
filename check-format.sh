#!/bin/bash

# check if either need fixes

npm run prettier-list
exit_code_function_prettier=$?

npm run lint-list
exit_code_function_lint=$?

# check lint first, because it might have changed some prettier items
# if lint is successful, then check against prettier to see if there were 
# any remaining problem items
#
# doing this ordering because prettier runs first and then is followed by lint
#
# this is also necessary because part of prettier and lint are in conflict atm
# but it's based on a specific formatting setting, to be resolved.
if [ $exit_code_function_lint -ne 0 ]; then
    echo "Function lint encountered an error"
    exit 1
elif [ $exit_code_function_prettier -ne 0 ]; then
    echo "Function prettier encountered an error"
    exit 1
fi
