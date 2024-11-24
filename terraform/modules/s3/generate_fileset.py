#!/usr/bin/env python3
import os
import json

def main():
    # Define the path to the dist directory
    dist_path = "../frontend/dist"
    output_file = "fileset.json"
    file_list = {}

    # Check if the dist directory exists
    if not os.path.exists(dist_path):
        print("Dist directory does not exist. Generating an empty file list.")
        with open(output_file, "w") as f:
            json.dump(file_list, f)  # Save an empty JSON map to the file
        print(json.dumps(file_list))  # Return an empty JSON map for console output
        return

    # Generate file list with keys as "file_N"
    i = 0
    for root, _, files in os.walk(dist_path):
        for file in files:
            # Get the relative path from dist_path
            relative_path = os.path.relpath(os.path.join(root, file), dist_path)
            file_list[f"file_{i}"] = relative_path
            i += 1

    # Save the JSON map to the output file
    with open(output_file, "w") as f:
        json.dump(file_list, f, indent=4)

    # Print the JSON map to stdout (if needed by Terraform)
    print(json.dumps(file_list))

if __name__ == "__main__":
    main()
