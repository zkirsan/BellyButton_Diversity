function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
   
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// Create the buildChart function.
function buildCharts(sample) {
  // Use d3.json to load the samples.json file 
  d3.json("samples.json").then((data) => {
    console.log(data);

    // Create a variable that holds the samples array. 
    var samples = data.samples;

    // Create a variable that filters the samples for the object with the desired sample number.
    var selSample = samples.filter(sampleObj => sampleObj.id == sample);

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metadata = data.metadata;

    // Create a variable that holds the first sample in the array.
    var meta = metadata.filter(obj => obj.id == sample);


    // 2. Create a variable that holds the first sample in the metadata array.
    var selMeta = meta[0];

    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otuIDs = selSample.otu_ids;
    var otuLabels = selSample.otu_labels;
    var sampleValues = selSample.sample_values;

    // 3. Create a variable that holds the washing frequency.
    var washingFreq = parseFloat(selMeta.wfreq);

    // Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order 
    // so the otu_ids with the most bacteria are last. 
    var yticks = otuIDs.map(label => "OTU " + label).slice(0, 10).reverse(); 

    // Create the trace for the bar chart. 
    var barData = [{
      x: sampleValues.slice(0, 10).reverse(),
      y: yticks,
      text: otuLabels.reverse(),
      type: "bar",
      orientation: "h"
    }
      
    ];
    // Create the layout for the bar chart. 
    var barLayout = {
      title: "Top Ten Bacteria Cultures Found"
      
    };

    // Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout);

    // Create the trace for the bubble chart.
    var bubbleData = [{
      x: otuIDs,
      y: sampleValues,
      mode: 'markers',
      text: otuLabels,
      marker:{ size: sampleValues, color:otu_ids, colorscale:colorscale}
    }
   
    ];

    // Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Culture Per Sample",
      hovermode: "closest",
      xaxis: {title: "OTU ID"},
      margin: {l:100, r:100},
      paper_bgcolor: "rgba(182,212,194,0)",
      plot_bgcolor: "rgba(182,212,194,0)" 
      
    };

    // D2: 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    
    // 4. Create the trace for the gauge chart.
    var gaugeData = [{value:washFreq,
      type:'indicator',
      mode:'gauge+number',
      title: { text: "<b>Belly Button Scrub frequency</b> <br> Scrubs per week", font: { size: 18 } },
      gauge: { axis: { range: [null, 10] },
      bar: { color: "black" },
      steps: [
        { range: [0, 2], color: "red" },
        { range: [2, 4], color: "yellow" },
        { range: [4, 6], color: "orange" },
        { range: [6, 8], color: "lightgreen" },
        { range: [8,10], color: "green" }
      ]}

}];

    // 6. Use Plotly to plot the gauge data and layout.
    var gaugeLayout = { 
      width: 600, height: 450, margin: { t: 0, b: 0 },paper_bgcolor: "rgba(182,212,194,0)"
           
    };
    Plotly.newPlot('gauge', gaugeData, gaugeLayout);
  });
}
