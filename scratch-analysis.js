// https://github.com/llk/scratch-analysis
// input: txt file with all project ids (line separated), corresponding project JSONs
// TODO: add studio number

const fs = require('fs');
const path = require('path');
const request = require('sync-request');
const analysis = require('scratch-analysis');


function block_frequency(proj, block_name) {
    if (proj.blocks.frequency[block_name] == undefined) {
        return 0
    }
    else {
        return proj.blocks.frequency[block_name]
    }
}

// for all studios
function studio_stats(studio_num) {
    studio_num = studio_num;

    var project_ids = fs.readFileSync('json_data/studios/studio'+ studio_num + '_project_ids.txt').toString().split("\n");
    var file_objects = [];

    // read project JSONS of projects in project id text file
    for (var i = 0; i < project_ids.length; i++) {

        // handle EOF
        if (project_ids[i].length == 0) {
            break
        }

        // try to obtain proj json
        var project_str = 'json_data/studio'+ studio_num + '_projects/' + project_ids[i] + '.json'
        try {
            var proj_json = fs.readFileSync(project_str);
        }
        catch (err) {
            console.log(project_str + " not found");
        };

        file_objects.push(proj_json)
    }

    // create csv file
    f = fs.createWriteStream("teststudio" + studio_num + "_data.csv");
    // f = fs.createWriteStream("studio" + studio_num + "_data.csv");
    f.once('open', function(fd) {
        // csv headings
        f.write("project_id,");
        f.write("project_author_id,");
        f.write("project_author_username,");
        f.write("studio_number,")
        f.write("script_count,");
        f.write("variable_count,");
        f.write("list_count,")
        f.write("comment_count,")
        f.write("costume_count,")
        f.write("sprite_count,")
        f.write("block_count,")
        f.write("block_unique_count,")
        f.write("random_block_count,")
        f.write("interactive_block_count,")
        f.write("audio_block_count,")
        f.write("\n")

        // run analysis for each project JSON and write values to csv
        for (var i = 0; i < file_objects.length; i++) {
            analysis(file_objects[i], function (err, proj) {
                if (!proj) {
                    console.log(project_ids[i] + " problem")
                }
                else {

                    // get proj author information
                    var proj_meta_url = 'https://api.scratch.mit.edu/projects/' + project_ids[i];
                    try {
                        var proj_meta_data = JSON.parse(request('GET', proj_meta_url).getBody());
                        var proj_author_id = proj_meta_data.author.id
                        var proj_author_username = proj_meta_data.author.username
                    }
                    catch (err) {
                        console.log(proj_meta_url + " not found");
                        var proj_author_id = "N/A"
                        var proj_author_username = "N/A"
                    };

                    f.write(project_ids[i] + ",");
                    f.write(proj_author_id + ",")
                    f.write(proj_author_username + ",")
                    f.write(studio_num + ",")
                    f.write(proj.scripts.count + ",")
                    f.write(proj.variables.count + ",")
                    f.write(proj.lists.count + ",")
                    f.write(proj.comments.count + ",")
                    f.write(proj.costumes.count + ",")
                    f.write(proj.sprites.count + ",")
                    f.write(proj.blocks.count + ",")
                    f.write(proj.blocks.unique + ",")

                    // count random blocks
                    random_block_freq = block_frequency(proj, 'randomFrom:to:') + block_frequency(proj, 'operator_random')
                    f.write(random_block_freq.toString() + ",")

                    // count interactive blocks
                    interactive_block_freq = block_frequency(proj, 'pointTowards:')
                                            + block_frequency(proj, 'gotoSpriteOrMouse')
                                            + block_frequency(proj, 'whenKeyPressed')
                                            + block_frequency(proj, 'whenClicked')
                                            + block_frequency(proj, 'whenSensorGreaterThan')
                                            + block_frequency(proj, 'touching:')
                                            + block_frequency(proj, 'distanceTo:')
                                            + block_frequency(proj, 'keyPressed:')
                                            + block_frequency(proj, 'mousePressed')
                                            + block_frequency(proj, 'mouseX')
                                            + block_frequency(proj, 'mouseY');
                    f.write(interactive_block_freq.toString() + ",")

                    // count audio blocks
                    audio_block_freq = block_frequency(proj, 'playSound:')
                                        + block_frequency(proj, 'doPlaySoundAndWait')
                                        + block_frequency(proj, 'stopAllSounds')
                                        + block_frequency(proj, 'playDrum')
                                        + block_frequency(proj, 'rest:elapsed:from:')
                                        + block_frequency(proj, 'noteOn:duration:elapsed:from:')
                                        + block_frequency(proj, 'instrument:')
                                        + block_frequency(proj, 'changeVolumeBy:')
                                        + block_frequency(proj, 'setVolumeTo:')
                                        + block_frequency(proj, 'changeTempoBy:')
                                        + block_frequency(proj, 'setTempoTo:');
                                        + block_frequency(proj, 'whenSensorGreaterThan');
                    f.write(audio_block_freq.toString() + ",")

                    f.write("\n")
                }
            });
        }
        f.end();
    });
};

studio_stats(1)
