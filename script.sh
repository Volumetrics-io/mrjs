#!/bin/bash

# Define base output directories
output_dir='docs'
js_api_dir="${output_dir}/js-api"
js_api_utils_dir="${output_dir}/js-api-utils"
js_api_extras_dir="${output_dir}/js-api-extras"

# Remove the existing output directories if they exist and create new ones
rm -rf "$js_api_dir" "$js_api_utils_dir" "$js_api_extras_dir"
mkdir -p "$js_api_dir" "$js_api_utils_dir" "$js_api_extras_dir"

# Function to process .js files
process_js_files() {
  local source_dir=$1
  local output_dir=$2
  local ignore_index_js_subdirs=$3
  local counter=0 # Local counter for each call
  
  # Construct the base find command to exclude 'index.js' files directly
  local find_cmd="find \"$source_dir\" -type f -name '*.js' ! -name 'index.js' ! -name '_*'"

  # If ignoring subdirectories with index.js
  if [[ "$ignore_index_js_subdirs" == "true" ]]; then
    # Find subdirectories containing index.js, excluding the source directory itself
    local ignore_dirs=$(find "$source_dir" -mindepth 2 -type f -name 'index.js' -exec dirname {} \; | sort | uniq)
    for dir in $ignore_dirs; do
      # Escape paths for use in eval
      local escaped_dir=$(printf '%q' "$dir")
      find_cmd+=" ! -path \"$escaped_dir/*\""
    done
  fi

  # Execute the find command and process files using eval for command expansion
  eval "$find_cmd" | while read file; do
    # Format the counter with leading zeros
    printf -v formatted_counter "%03d" $counter
  
    # Generate new Markdown file name by prepending the counter to the base name of the .js file
    md_file="${output_dir}/${formatted_counter}$(basename "${file%.js}.md")"
  
    # Correctly extract the title from the Markdown file name
    title=$(basename "${md_file%.md}" | cut -c5-)
  
    # Generate Markdown content
    {
      echo '---'
      echo "title: ${title}"
      echo '---'
      echo "# ${title}"
      echo ''
      jsdoc2md "$file"
    } > "$md_file"
    echo "<div class='centered'><a href='https://github.com/volumetrics-io/mrjs/edit/main/$file' target='_blank'>Suggest an edit on GitHub for $(basename "$file")</a></div>" >> "$md_file"
  
    # Increment the local counter
    ((counter++))
  done
}

# Process files for each directory
process_js_files "src" "$js_api_dir" true # true to ignore subdirs with index.js for js-api
process_js_files "src/utils" "$js_api_utils_dir" false
process_js_files "src/extras" "$js_api_extras_dir" false
