var techniqueDivs, valueDivs, storyNameDivs



var colorscale = d3.scale.ordinal()
    .range(['color1', 'color2', 'color3', 'color4', 'color5'])

function loadTechniques(storyfile, showIndices) {
    var techniques = {}
    d3.csv('codes.csv', function(raw_techniques) {
        raw_techniques.forEach(function(d) {
            d.color = colorscale(d.parent)
            techniques[d.id] = d
            d.stories = []
            // debugger;
            // if (d.parent) {
            //     d.parent = techniques[d.parent]
            //     d.color = colorscale(d.parent)
            // } else {
            //     delete d.parent
            //     d.color = colorscale(d.id)
            // }
            // techniques[d.id] = d
            // d.stories = []
        })
        drawTaxonomy(raw_techniques)
        drawTechniques(raw_techniques)
        loadStories(storyfile, raw_techniques, showIndices)
    })
}


function loadStories(storyfile, raw_techniques, showIndices) {
    d3.csv(storyfile, function(raw_stories) {
        raw_stories.forEach(function(story) {
            //story_array包含了每一个story对应的所有技术
            var story_array = []
            var techniques = []
            for (var i = 0; i < raw_techniques.length; i++) {
                var obj = {}
                obj['technique'] = raw_techniques[i].id
                obj['value'] = story[raw_techniques[i].id]
                obj['story'] = story.id
                obj['color'] = raw_techniques[i].color
                // if (raw_techniques[i].parent) {
                //     obj['parent'] = raw_techniques[i].parent.id
                // }
                story_array.push(obj)

                if (obj['value'] == "x") {
                    techniques.push(obj['technique'])
                    raw_techniques[i].stories.push(story.id)
                }
            }
            story.values = story_array
            story.techniques = techniques
        })

        drawStories(raw_stories, raw_techniques, showIndices)

    })
}


function drawStories(raw_stories, raw_techniques, showIndices) {
    var storySelection = d3.select("#stories").selectAll('.story')
        .data(raw_stories)

    var storyRows = storySelection.enter().append('div')
        .classed('story', true)
        
        //year改为index
        storyYearDivs = storyRows.append('div')
        .classed('cell', true)
        .classed('storyyear', true)
        .classed('notastory', function(d) {
            return (d.notastory)
        })
        .each(function(d) {
            var sel = d3.select(this)
            sel.classed(d.id, true)
            d.techniques.forEach(function(tech) {
                sel.classed(tech, true)
            })
        })
        .text(function(d) {
            return d.index
        })

    
        storyNameDivs = storyRows.append('div')
        .classed('cell', true)
        .classed('storyname', true)
        // .classed('notastory', function(d) {
        //     return d.notastory
        // })
        .each(function(d) {
            var sel = d3.select(this)
            sel.classed(d.id, true)
            d.techniques.forEach(function(tech) {
                sel.classed(tech, true)
            })
        })

    //title不要超链接
        storyNameDivs.append('div')
        .text(function(d) {
                    return d.title;
            })
    //title有超链接
    // storyNameDivs.append('a')
    //     .attr('href', function(d) {
    //         if (d.title != "Frequency"){
    //             return d.url;
    //         }
    //     })
    //     .text(function(d) {
    //         return d.title;
    //     })
    //     .attr("target", function(d) {
    //         if (d.title != "Frequency"){
    //             return "_blank";
    //         }
    //     })

    //是否在标题后面显示标号，可删？
    if (showIndices == true) {
        storyNameDivs.append('span')
            .classed('index', true)
            .text(function(d) {
                return " [" + d.index + "]"
            })
    }

    
    // //作者来源，改为领域
    // storySourceDivs = storyRows.append('div')
    //     .classed('cell', true)
    //     .classed('storysource', true)
    //     .classed('notastory', function(d) {
    //         return d.notastory
    //     })
    //     .each(function(d) {
    //         var sel = d3.select(this)
    //         sel.classed(d.id, true)
    //         d.techniques.forEach(function(tech) {
    //             sel.classed(tech, true)
    //         })
    //     })
    //     .text(function(d) {
    //         return d.field
    //     })



    var values = storyRows.selectAll('.value').data(function(d) {
        return d.values;
    })


    values.enter().append('div')
        .classed('value', true)
        .classed('cell', true)
        .each(function(d) {
            d3.select(this)
                .classed(d.story, true)
                .classed(d.technique, true)
        })
        // .text(function(d){
        // 	return d.value;
        // })
        .text(function(d) {
            if (d.value > 0){
                return d.value;
            }
        })
        .classed('filled', function(d) {
            if (typeof(d.value) == 'string'){            
                return d.value;
            }
            //如果存在d.value，则赋以filled的class
        })
        .classed('color1', function(d) {
            return d.color == "color1"
        })
        .classed('color2', function(d) {
            return d.color == "color2"
        })
        .classed('color3', function(d) {
            return d.color == "color3"
        })
        .classed('color4', function(d) {
            return d.color == "color4"
        })
        .classed('color5', function(d) {
            return d.color == "color5"
        })
        .classed('genre1', function(d) {
            if (d.value == "interactive interface") {
                return true
            } 
        })
        .classed('genre2', function(d) {
            if (d.value == "video") {
                return true
            } 
        })
        .classed('genre3', function(d) {
            if (d.value == "static image/painting") {
                return true
            } 
        })
        .classed('genre4', function(d) {
            if (d.value == "installation") {
                return true
            } 
        })
        .classed('genre5', function(d) {
            if (d.value == "artifact") {
                return true
            } 
        })
        .classed('genre6', function(d) {
            if (d.value == "event") {
                return true
            } 
        })
        .classed('genre12', function(d) {
            if (d.value == "interactive interface + video") {
                return true
            } 
        })
        .classed('genre14', function(d) {
            if (d.value == "interactive interface + installation") {
                return true
            } 
        })
        .classed('genre15', function(d) {
            if (d.value == "interactive interface + artifact") {
                return true
            } 
        })
        .classed('genre16', function(d) {
            if (d.value == "interactive interface + event") {
                return true
            } 
        })
        .classed('genre36', function(d) {
            if (d.value == "static image/painting + event") {
                return true
            } 
        })
        .classed('genre46', function(d) {
            if (d.value == "installation + event") {
                return true
            } 
        })
        .classed('genre56', function(d) {
            if (d.value == "artifact + event") {
                return true
            } 
        })
        .classed('genre456', function(d) {
            if (d.value == "installation + event + artifact") {
                return true
            } 
        })


    valueDivs = values

    applyStoryClassesToTechniques()
    applyInteractions()
}

function drawTaxonomy(raw_techniques) {
    var strategySelection = d3.select("#strategy").selectAll('.strategy')
        .data(raw_techniques)

        strategySelection.enter().append('div')
        .classed('strategy', true)
        .classed('s1', function(d) {
            return d.parent == "Sensation"
        })
        .classed('s2', function(d) {
            return d.parent == "Narrative"
        })
        .classed('s3', function(d) {
            return d.parent == "Behavior"
        })
        .classed('s4', function(d) {
            return d.parent == "Context"
        })
        // .classed('cell', true)
        .each(function(d) {
            d3.select(this).classed(d.id, true)
        })
        .append('div')
        // .classed('rotate', true)
        .html(function(d) { if(d.parent != "Field" & d.parent != "Task" & d.parent != "Genre"){
            return d.parent
        }
        })

        var dimensionSelection = d3.select("#dimension").selectAll('.dimension')
        .data(raw_techniques)

        dimensionSelection.enter().append('div')
        .classed('dimension', true)
        // .classed('headercell', true)
        // .classed('field', function(d) {
        //     return d.parent == "Field"
        // })
        // .classed('task', function(d) {
        //     return d.parent == "Task"
        // })
        // .classed('cell', true)
        .classed('d1', function(d) {
            return d.parent == "Field"
        })
        .classed('d2', function(d) {
            return d.parent == "Task"
        })
        .classed('d3', function(d) { 
            if (d.parent == "Sensation" || d.parent == "Narrative" || d.parent == "Behavior" || d.parent == "Context" || d.parent == "Genre"){
            return true
        }
        })

        .each(function(d) {
            d3.select(this).classed(d.id, true)
        })
        .append('div')
        .html(function(d) { 
            if(d.parent == "Field"){
            return "Where to apply"
        } else if (d.parent == "Task"){
            return "What task"
        } else {
            return "How to design"
        }
        })
    }


function drawTechniques(raw_techniques) {
    var techniqueSelection = d3.select("#techniques").selectAll('.technique')
        .data(raw_techniques)
    
    techniqueSelection.enter().append('div')
        .classed('technique', true)
        .classed('headercell', true)
        // .classed('child', function(d) {
        //     return d.parent;
        // })
        // .classed('parent', function(d) {
        //     return !(d.parent);
        // })
        .classed('color1', function(d) {
            return d.color == "color1"
        })
        .classed('color2', function(d) {
            return d.color == "color2"
        })
        .classed('color3', function(d) {
            return d.color == "color3"
        })
        .classed('color4', function(d) {
            return d.color == "color4"
        })
        .classed('color5', function(d) {
            return d.color == "color5"
        })

        .classed('cell', true)
        .each(function(d) {
            d3.select(this).classed(d.id, true)
        })
        .append('div')
        .classed('rotate', true)
        .html(function(d) {
            if (d.parent) {
                return d.name;
            } else {
                return "test";
            }
        })


    // d3.select("#techniques").append('div')
    //     .classed('namefiller', true)
    //     .classed('headercell', true)
    //     .classed('cell', true)

    techniqueDivs = techniqueSelection

}


function applyStoryClassesToTechniques() {
    techniqueDivs
        .each(function(d) {
            var sel = d3.select(this)
            d.stories.forEach(function(story) {
                sel.classed(story, true)
            })
        })
}



var selectedTechnique = null

function applyInteractions() {
    techniqueDivs
        .on('mouseover', function(d) {
            if (!selectedTechnique || selectedTechnique == d) {
                d3.selectAll(".cell:not(." + d.id + ")").classed('faded', true)
            }
        })
        .on('mouseout', function(d) {
            if (!selectedTechnique) {
                d3.selectAll(".cell").classed('faded', false)
            }
        })
        .on('click', function(d) {
            if (selectedTechnique == d) {
                selectedTechnique = null
            } else {
                selectedTechnique = d
                d3.selectAll(".cell").classed('faded', false)
                d3.selectAll(".cell:not(." + d.id + ")").classed('faded', true)
            }
        })


    valueDivs
        .on('mouseover', function(d) {
            if (selectedTechnique) {
                return;
            }

            d3.selectAll(".cell").classed('faded', true)

            if (d.value) {
                d3.select(this).classed('faded', false)
                d3.selectAll(".headercell." + d.technique).classed('faded', false)
                d3.selectAll(".storyname." + d.story).classed('faded', false)
            }
        })
        .on('mouseout', function(d) {
            if (selectedTechnique) {
                return;
            }
            d3.selectAll(".cell").classed('faded', false)
        })

    storyNameDivs
        .on('mouseover', function(d) {
            if (selectedTechnique) {
                return;
            }
            d3.selectAll(".cell:not(." + d.id + ")").classed('faded', true)
        })
        .on('mouseout', function(d) {
            if (selectedTechnique) {
                return;
            }
            d3.selectAll(".cell").classed('faded', false)
        })
}