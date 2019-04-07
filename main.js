function callServer()
{
    $("#main_content").animate({top: '0%'});
    $("#prediction_container").css("display", "block");
    var tick = $("#stock_name").val();
    $.get("http://127.0.0.1:5000/getStockInfo?ticker="+tick, function(data) {
        var values = data.split(" ");
        for (var i = 0; i < values.length; i++) {
            values[i] = parseFloat(values[i]);
        }
        createHistogram(values);
        updateAverage(values);
    });
}

function updateAverage(data) {
    var sum = 0;
    for (var i = 1; i < data.length; i++) {
        sum += data[i];
    }
    console.log(data);
    console.log(data.length);
    var average = sum / data.length;
    $("#average").text("Average Sentiment: " + average);
    if (average > 0.05)
        $("#rec").text("Recommended Action: BUY");
    else if (average < -0.05)
        $("#rec").text("Recommended Action: SELL");
    else
        $("#rec").text("Recommended Action: HOLD");
}

function createHistogram(values)
{
    var color = "steelblue";

    // Generate a 1000 data points using normal distribution with mean=20, deviation=5

    // A formatter for counts.
    var formatCount = d3.format(",.0f");

    var margin = {top: 30, right: 30, bottom: 30, left: 30},
        width = 700 - margin.left - margin.right,
        height = 300 - margin.top - margin.bottom;

    var max = d3.max(values);
    var min = d3.min(values);
    var x = d3.scale.linear()
          .domain([min, max])
          .range([0, width]);

    // Generate a histogram using twenty uniformly-spaced bins.
    var data = d3.layout.histogram()
        .bins(x.ticks(20))
        (values);

    var yMax = d3.max(data, function(d){return d.length});
    var yMin = d3.min(data, function(d){return d.length});
    var colorScale = d3.scale.linear()
                .domain([yMin, yMax])
                .range([d3.rgb(color).brighter(), d3.rgb(color).darker()]);

    var y = d3.scale.linear()
        .domain([0, yMax])
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var svg = d3.select("#graph_container").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var bar = svg.selectAll(".bar")
        .data(data)
      .enter().append("g")
        .attr("class", "bar")
        .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

    bar.append("rect")
        .attr("x", 1)
        .attr("width", (x(data[0].dx) - x(0)) - 1)
        .attr("height", function(d) { return height - y(d.y); })
        .attr("fill", function(d) { return colorScale(d.y) });

    bar.append("text")
        .attr("dy", ".75em")
        .attr("y", -12)
        .attr("x", (x(data[0].dx) - x(0)) / 2)
        .attr("text-anchor", "middle")
        .text(function(d) { return formatCount(d.y); });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
}