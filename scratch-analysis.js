// https://github.com/llk/scratch-analysis
const fs = require('fs');
const path = require('path');
const analysis = require('scratch-analysis');

var project_ids = fs.readFileSync('studio6_projects/studio6_project_ids.txt').toString().split("\n");
var file_objects = [];

// read project JSONS of projects in project id text file
for (i = 0; i < project_ids.length; i++) {
    if (project_ids[i].length == 0) {
        break
    }
    var project_str = 'studio6_projects/' + project_ids[i] + '.json'

    try {
        var proj_json = fs.readFileSync(project_str);
    }
    catch (err) {
        console.log(project_str + " not found");
    };

    file_objects.push(proj_json)
}

// create csv file
f = fs.createWriteStream("studio6_data.csv");
f.once('open', function(fd) {
    // csv headings
    f.write("project_id,");
    f.write("script_count,");
    f.write("variable_count,");
    f.write("list_count,")
    f.write("comment_count,")
    f.write("costume_count,")
    f.write("sprite_count,")
    f.write("block_count,")
    f.write("block_unique_count,")
    f.write("\n")

    // run analysis for each project JSON and write values to csv
    for (i = 0; i < file_objects.length; i++) {
        analysis(file_objects[i], function (err, proj) {
            if (!proj) {
                console.log(project_ids[i] + " problem")
            }
            else {
                f.write(project_ids[i] + ",");
                f.write(proj.scripts.count + ",")
                f.write(proj.variables.count + ",")
                f.write(proj.lists.count + ",")
                f.write(proj.comments.count + ",")
                f.write(proj.costumes.count + ",")
                f.write(proj.sprites.count + ",")
                f.write(proj.blocks.count + ",")
                f.write(proj.blocks.unique + ",")
                f.write("\n")
            }
        });
    }
    f.end();
});
