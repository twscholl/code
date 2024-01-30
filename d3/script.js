var json_data = {
  "name": "Shiv Menon",
  "free":true,
  "description":"Vice President",
  "children": [
    {
     "name": "Alan Kipust",
     "free": true,
     "description": "Senior Director, Product Management",
     "children": [
      {
       "name": "Navjot Saini",
       "description": "Associate Director, Product Management",
       "free": true,
       "children": [
        {
         "name": "Alex Poon",
         "description": "Senior Technical Product Manager",
         "free": true
        },
        {
         "name": "Chuck Carletta",
         "description": "Senior Technical Product Manager",
         "free": true
        },
        {
         "name": "Polina Kulikova",
         "description": "Senior Technical Product Manager",
         "free": true
        },
        {
         "name": "Jahnavi Jha",
         "description": "Technical Product Manager",
         "free": true
        }
       ]
      },
      {
       "name": "Stefanie Andre",
       "description":"Associate Director, Product Management",
       "free": true,
       "children": [
        {
         "name": "Carlos Ordóñez",
         "description": "Senior Technical Product Manager",
         "free": true
        },
        {
          "name": "Rene Figueroa",
          "description": "Contractor",
          "free": true
         },
         {
          "name": "Wendy Petree",
          "description": "Senior Technical Product Manager",
          "free": true
         },
        {
         "name": "Jiten Punjabi",
         "description": "Senior Technical Product Manager",
         "free": true
        }
       ]
      },
      {
        "name": "Felicia Dabbieri",
        "description":"Associate Director, Technical Product Management",
        "free": true,
        "children": [
         {
          "name": "Michael Finn",
          "description": "Technical Program Manager",
          "free": true
         },
         {
          "name": "Kelly Williamson",
          "description": "Manager, Technical Product Manager II",
          "free": true,
          "children": [
            {
            "name":"Draya Moseley",
            "description": "Customer Service Product Specialist",
            "free":true,
            },
            {
              "name":"Maddison Vanhorne",
              "description":"Customer Service Product Specialist",
              "free":true,
            }
          ]

         },
        ]
       }
     ]
    },
    {
     "name": "Andrew Stein",
     "description": "Senior Director, Customer Experience",
     "free": true,
     "children": []

    }
  ]
 }

var m = [90, 90, 90, 90],
    w = 1000 - m[1] - m[3],
    h = 600 - m[0] - m[2],
    i = 0,
    root;

var tree = d3.layout.tree()
    .size([h, w]);

var diagonal = d3.svg.diagonal()
    .projection(function(d) { return [d.y, d.x]; });

var vis = d3.select("#body").append("svg:svg")
    .attr("width", w + m[1] + m[3])
    .attr("height", h + m[0] + m[2])
  .append("svg:g")
    .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

root = json_data;
root.x0 = h / 2;
root.y0 = 0;

function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
}

  // Initialize the display to show a few nodes.
  // root.children.forEach(toggleAll);
  // toggle(root.children[1]);
  // toggle(root.children[1].children[2]);
  // toggle(root.children[9]);
  // toggle(root.children[9].children[0]);

 update(root);


function update(source) {
  var duration = d3.event && d3.event.altKey ? 5000 : 500;

  // Compute the new tree layout.
  var nodes = tree.nodes(root).reverse();

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = vis.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d) { toggle(d); update(d); });

  nodeEnter.append("svg:circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append('a')
      .attr('xlink:href', function(d) {
        return d.url;
      })
      .append("svg:text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style('fill', function(d) {
        return d.free ? 'black' : '#999';
      })
      .style("fill-opacity", 1e-6);

  nodeEnter.append("svg:title")
    .text(function(d) {
      return d.description;
    });

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = vis.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children.
function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}