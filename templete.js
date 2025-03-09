// Load the data
const socialMedia = d3.csv("socialMedia.csv");

// Once the data is loaded, proceed with plotting
socialMedia.then(function(data) {
    // Convert string values to numbers
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    
    // Define the dimensions and margins for the SVG
    const width = 800 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    // Create the SVG container for the boxplot
    const svgBoxplot = d3.select("#boxplot").append("svg")
                         .attr("width", width + margin.left + margin.right)
                         .attr("height", height + margin.top + margin.bottom)
                         .append("g")
                         .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add scales
    const xScale = d3.scaleBand()
                     .domain([...new Set(data.map(d => d.Platform))])
                     .range([0, width])
                     .padding(0.4);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.Likes)])
                     .range([height, 0]);

    // Add x-axis label
    svgBoxplot.append("g")
              .attr("transform", `translate(0,${height})`)
              .call(d3.axisBottom(xScale));

    // Add y-axis label
    svgBoxplot.append("g")
              .call(d3.axisLeft(yScale));

    // Rollup function for quantiles
    const rollupFunction = function(groupData) {
        const values = groupData.map(d => d.Likes).sort(d3.ascending);
        const min = d3.min(values); 
        const q1 = d3.quantile(values, 0.25);
        const q3 = d3.quantile(values, 0.75);
        const median = d3.quantile(values, 0.5);
        return { min, q1, q3, median };
    };

    const quantilesByGroups = d3.rollup(data, rollupFunction, d => d.Platform);

    quantilesByGroups.forEach((quartiles, Platform) => {
        const x = xScale(Platform);
        const boxWidth = xScale.bandwidth();

        // Draw vertical lines
        svgBoxplot.append("line")
                  .attr("x1", x + boxWidth / 2)
                  .attr("x2", x + boxWidth / 2)
                  .attr("y1", yScale(quartiles.min))
                  .attr("y2", yScale(quartiles.max))
                  .attr("stroke", "black");

        // Draw the box (IQR)
        svgBoxplot.append("rect")
                  .attr("x", x)
                  .attr("y", yScale(quartiles.q3))
                  .attr("width", boxWidth)
                  .attr("height", yScale(quartiles.q1) - yScale(quartiles.q3))
                  .attr("fill", "lightgray")
                  .attr("stroke", "black");

        // Draw the median line
        svgBoxplot.append("line")
                  .attr("x1", x)
                  .attr("x2", x + boxWidth)
                  .attr("y1", yScale(quartiles.median))
                  .attr("y2", yScale(quartiles.median))
                  .attr("stroke", "black");
    });
});

// Prepare your data and load the data again for barplot
const socialMediaAvg = d3.csv("socialMediaAvg.csv");

socialMediaAvg.then(function(data) {
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    // Create the SVG container for the barplot
    const svgBarplot = d3.select("#barplot").append("svg")
                          .attr("width", width + margin.left + margin.right)
                          .attr("height", height + margin.top + margin.bottom)
                          .append("g")
                          .attr("transform", `translate(${margin.left},${margin.top})`);

    // Define scales and axes (same as before)
    
    // Add the legend and bars
});

// Prepare your data and load the data again for lineplot
const socialMediaTime = d3.csv("socialMediaTime.csv");

socialMediaTime.then(function(data) {
    data.forEach(function(d) {
        d.Likes = +d.Likes;
    });

    // Create the SVG container for the lineplot
    const svgLineplot = d3.select("#lineplot").append("svg")
                           .attr("width", width + margin.left + margin.right)
                           .attr("height", height + margin.top + margin.bottom)
                           .append("g")
                           .attr("transform", `translate(${margin.left},${margin.top})`);
    // Set up scales for x and y axes
    const xScale = d3.scaleTime()
                     .domain(d3.extent(data, d => new Date(d.Date)))
                     .range([0, width]);

    const yScale = d3.scaleLinear()
                     .domain([0, d3.max(data, d => d.Likes)])
                     .range([height, 0]);

    // Draw the axis, you can rotate the text in the x-axis here

    // Add x-axis label
    svgLineplot.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(xScale));

    // Add y-axis label
    svgLineplot.append("g")
       .call(d3.axisLeft(yScale));

    // Draw the line for the time series data
    const line = d3.line()
                   .x(d => xScale(new Date(d.Date)))
                   .y(d => yScale(d.Likes))
                   .curve(d3.curveNatural);

    svgLineplot.append("path")
       .data([data])
       .attr("class", "line")
       .attr("d", line)
       .attr("fill", "none")
       .attr("stroke", "steelblue")
       .attr("stroke-width", 2);
});

