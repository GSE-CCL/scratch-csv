# Scratch CSV
A simple script that uses the Scratch Analyzer (https://github.com/llk/scratch-analysis) to read local project JSONs and output values to a CSV. Could be used in conjunction with Scratch Studio Scrape (https://github.com/GSE-CCL/scratch-studio-scrape)!

Developed for the Creative Computing Lab at the Harvard Graduate School of Education.

## Setup
1. Make sure you've installed Node.js and npm.
2. Navigate the terminal to the downloaded repository. 
3. Run `npm install scratch-analysis` and `npm install sync-request`.
4. You should be all set!

## Directory Setup
1. In your repository, create a folder entitled `json_data`, this will store all your Scratch JSON files.
2. Inside `json_data`, create a folder entitled `studios`. This folder will contain plaintext files, where `studio1_project_ids.txt` contains the Project IDs for Studio 1, `studio2_project_ids.txt` contains the Project IDs for Studio 2, etc. Naming convention is very important!
An example of `studio1_project_ids.txt` is as follows:

335749989

345129786

357222518

(no commas, each new line indicates another project)

3. Within `json_data`, there should be corresponding folders to each of your studios, i.e. if you have `studio1_project_ids.txt`in `studios`, there should be another folder within `json_data` entitled `studio1_projects `, which contains JSON files of studio 1 projects (this can be downloaded through Scratch Studio Scrape).
4. Nice! All set, and ready to move on to using Scratch CSV!

## Usage
1. Navigate the terminal to the downloaded repository. 
2. Run `node scratch-analysis.js`. This command will access all of your studios and their corresponding JSON projects. 
3. Find your results in an outputted CSV file in your directory. Woohoo!

## Resources
https://github.com/llk/scratch-analysis for Scratch Analysis

https://github.com/GSE-CCL/scratch-studio-scrape for Scratch Studio Scrape

https://api.scratch.mit.edu/studios/{ID}/projects to get a list of all the projects, with IDs and descriptions

https://projects.scratch.mit.edu/{ID} to download project JSON
