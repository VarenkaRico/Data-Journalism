//---------SVG

var svgWidth=960;
var svgHeight=500;

//----------Chart size
var margin={
    top:20,
    right: 40,
    bottom:175,
    left:175
};

//--------- Space for Chart
var width = svgWidth - margin.right - margin.left;
var height = svgHeight - margin.top - margin.bottom;

//--------- SVG wrapper

var svg=d3
    .select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height",svgHeight);

//---------Append an svg group
var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

//---------- Initial Parameters
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

//----------X-label update when clicked value
function xScale(us_Data, chosenXAxis) {
    //X-label minimum and Maximum values
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(us_Data, d => d[chosenXAxis])*.85,
        //*.85 to have space for the minimum value to show
            d3.max(us_Data, d => d[chosenXAxis])*1.15])
        //*1.15 to have space for the maximum value to show
        .range([0, width]);

    return xLinearScale;
}

//----------Y-label
function yScale(us_Data, chosenYAxis) {
    //Y-label minimum and Maximum values
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(us_Data, d => d[chosenYAxis])*.85,
            d3.max(us_Data, d => d[chosenYAxis])*1.15])
        .range([height, 0]);

    return yLinearScale;
}

//----------X-linear scale update for new variable
function xNewScale(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1500)
        .call(bottomAxis);

    return xAxis;
}

//----------Y-label update for new variable
function yNewScale(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1500)
        .call(leftAxis);

    return yAxis;
}

//----------Scatter update
function ScatterUpdate(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
        .duration(1500)
        .attr("cx", data => newXScale(data[chosenXAxis]))
        .attr("cy", data => newYScale(data[chosenYAxis]));

    return circlesGroup;
}

//--------Scatter Labels update
function ScatterLabelsUpdate(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
        .duration(1500)
        .attr("x", d => newXScale(d[chosenXAxis]))
        .attr("y", d => newYScale(d[chosenYAxis]));

    return textGroup;
}
//----------X Axis Tooltips Info
function styleX(value, chosenXAxis) {

    //----% Poverty
    if (chosenXAxis === "poverty") {
        return `${value}%`;
    }
    //-----Income USD
    else if (chosenXAxis === "income") {
        return `$${value}`;
    }
    //-----% Obesity
    else if (chosenXAxis === "obesity"){
        return `${value}%`;
    }
    //-----Age
    else if (chosenXAxis === "age"){
        return `${value}`;
    }
    //-----%Smokes
    else if (chosenXAxis === "smokes"){
        return `${value}%`;
    }
    //-----%HealthCare
    else{
        return `${value}%`;
    }
}
//---------- X and Y Axis Info in tooltips
function TooltipUpdate(chosenXAxis, chosenYAxis, circlesGroup) {

    // ----- X Axis
     //----- Poverty
     if (chosenXAxis === "poverty") {
         var xLabel = "Poverty:";
     }
    //----- Income USD
    else if (chosenXAxis === "income") {
        var xLabel = "Median Income: $";
    }
    //----- Obesity
    else if (chosenXAxis === "obesity") {
        var xLabel = "Obesity (%): ";
    }
    //----- Smokes
    else if (chosenXAxis === "smokes") {
        var xLabel = "Smokes (%): ";
    }
    //----- Healthcare
    else if (chosenXAxis === "healthcare") {
        var xLabel = "No Healthcare (%)";
    }
    //------ Age (Average)
    else {
        var xLabel = "Age:";
    }

    // ----- Y Axis
    //----- Poverty
    if (chosenYAxis === "poverty") {
        var yLabel = "Poverty:";
    }
    //----- Icome USD
    else if (chosenYAxis === "income") {
       var yLabel = "Median Income: $";
    }
    //----- Obesity
    else if (chosenYAxis === "obesity") {
       var yLabel = "Obesity (%): ";
    }
    //----- Smokes
    else if (chosenYAxis === "smokes") {
       var yLabel = "Smokes (%): ";
    }
    //----- Healthcare
    else if (chosenYAxis === "healthcare") {
       var yLabel = "No Healthcare (%)";
    }
    //------ Age (Average)
    else {
       var yLabel = "Age:";
    }

    //Tooltip
    var toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 0])
        .html(function(d) {
            return (`${d.state}<br>${xLabel} ${styleX(d[chosenXAxis], chosenXAxis)}<br>${yLabel} ${d[chosenYAxis]}`);
        });

    circlesGroup.call(toolTip);

    //Mouse Over event
    circlesGroup.on("mouseover", toolTip.show)
    .on("mouseout", toolTip.hide);

    return circlesGroup;
}

//Upload csv
d3.csv("./assets/data/data.csv").then(function(us_Data) {

    //console.log(us_Data);

    us_Data.forEach(function(data) {
        data.obesity = +data.obesity;
        data.income = +data.income;
        data.smokes = +data.smokes;
        data.age = +data.age;
        data.healthcare = +data.healthcare;
        data.poverty = +data.poverty;
    });

    //---------- INITIAL SCALES
    var xLinearScale = xScale(us_Data, chosenXAxis);
    var yLinearScale = yScale(us_Data, chosenYAxis);

    //--------- X-BOTTOM AND Y-LEFT AXIS
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    //X Axis
    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    //Y Axis
    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    //Scatter Plott
    var circlesGroup = chartGroup.selectAll("circle")
        .data(us_Data)
        .enter()
        .append("circle")
        .classed("stateCircle", true)
        .attr("cx", d => xLinearScale(d[chosenXAxis]))
        .attr("cy", d => yLinearScale(d[chosenYAxis]))
        .attr("r", 12)
        .attr("opacity", ".5");

    var textGroup = chartGroup.selectAll(".stateText")
        .data(us_Data)
        .enter()
        .append("text")
        .classed("stateText", true)
        .attr("x", d => xLinearScale(d[chosenXAxis]))
        .attr("y", d => yLinearScale(d[chosenYAxis]))
        .attr("dy", 3)
        .attr("font-size", "10px")
        .text(function(d){return d.abbr});

    //---------- X-Labels options
    var xLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${width / 2}, ${height + 20 + margin.top})`);

    var povertyXLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 20)
        .attr("value", "poverty")
        .text("In Poverty (%)");

    var ageXLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 40)
        .attr("value", "age")
        .text("Age (Average)")

    var incomeXLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 60)
        .attr("value", "income")
        .text("Household Income (Average)")
    
    var obesityXLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 80)
        .attr("value", "obesity")
        .text("Obesity %")
    
    var smokesXLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 100)
        .attr("value", "smokes")
        .text("Smokes %")
    
    var healthcareXLabel = xLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 120)
        .attr("value", "healthcare")
        .text("Without Healthcare %")

    //--------- Y-Labels options
    var yLabelsGroup = chartGroup.append("g")
        .attr("transform", `translate(${0 - margin.left/4}, ${(height/2)})`);

    var povertyYLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 20)
        .attr("transform", "rotate(-90)")
        .attr("value", "poverty")
        .text("In Poverty (%)");

    var ageYLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 40)
        .attr("transform", "rotate(-90)")
        .attr("value", "age")
        .text("Age (Average)");

    var incomeYLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 60)
        .attr("transform", "rotate(-90)")
        .attr("value", "income")
        .text("Income (Average)");
    
    var obesityYLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("active", true)
        .attr("x", 0)
        .attr("y", 0 - 80)
        .attr("transform", "rotate(-90)")
        .attr("value", "obesity")
        .text("Obesity %")
    
    var smokesYLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 100)
        .attr("transform", "rotate(-90)")
        .attr("value", "smokes")
        .text("Smokes %")
    
    var healthcareYLabel = yLabelsGroup.append("text")
        .classed("aText", true)
        .classed("inactive", true)
        .attr("x", 0)
        .attr("y", 0 - 120)
        .attr("transform", "rotate(-90)")
        .attr("value", "healthcare")
        .text("Without Healthcare %")

    //TooltipUpdate function with data
    var circlesGroup = TooltipUpdate(chosenXAxis, chosenYAxis, circlesGroup);

    //Click for X Axis
    xLabelsGroup.selectAll("text")
        .on("click", function() {
            
            //Selection value
            var value = d3.select(this).attr("value");

            if (value != chosenXAxis) {

                //-------- X Axis with new variable
                chosenXAxis = value;

                //--------New X-Bottom scale with new variable
                xLinearScale = xScale(us_Data, chosenXAxis);

                //--------X Axis Transition
                xAxis = xNewScale(xLinearScale, xAxis);

                //--------Scatter Plot with new values
                circlesGroup = ScatterUpdate(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //--------ScatterLabels with new Value
                textGroup = ScatterLabelsUpdate(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

                //--------TooltipUpdate with new value
                circlesGroup = TooltipUpdate(chosenXAxis, chosenYAxis, circlesGroup);

                //-------- Activate X Label, 
                if (chosenXAxis === "poverty") {
                    povertyXLabel.classed("active", true).classed("inactive", false);
                    ageXLabel.classed("active", false).classed("inactive", true);
                    incomeXLabel.classed("active", false).classed("inactive", true);
                    healthcareXLabel.classed("active", false).classed("inactive", true);
                    smokesXLabel.classed("active", false).classed("inactive", true);
                    obesityXLabel.classed("active", false).classed("inactive", true);
                    povertyYLabel.classed("active", false).classed("inactive", true);
                }
                else if (chosenXAxis === "age") {
                    povertyXLabel.classed("active", false).classed("inactive", true);
                    ageXLabel.classed("active", true).classed("inactive", false);
                    incomeXLabel.classed("active", false).classed("inactive", true);
                    healthcareXLabel.classed("active", false).classed("inactive", true);
                    smokesXLabel.classed("active", false).classed("inactive", true);
                    obesityXLabel.classed("active", false).classed("inactive", true);
                    ageYLabel.classed("active", false).classed("inactive", true);
                }
                else if (chosenXAxis === "income") {
                    povertyXLabel.classed("active", false).classed("inactive", true);
                    ageXLabel.classed("active", false).classed("inactive", true);
                    incomeXLabel.classed("active", true).classed("inactive", false);
                    healthcareXLabel.classed("active", false).classed("inactive", true);
                    smokesXLabel.classed("active", false).classed("inactive", true);
                    obesityXLabel.classed("active", false).classed("inactive", true);
                    incomeYLabel.classed("active", false).classed("inactive", true);
                }
                else if (chosenXAxis === "healthcare") {
                    povertyXLabel.classed("active", false).classed("inactive", true);
                    ageXLabel.classed("active", false).classed("inactive", true);
                    incomeXLabel.classed("active", false).classed("inactive", true);
                    healthcareXLabel.classed("active", true).classed("inactive", false);
                    smokesXLabel.classed("active", false).classed("inactive", true);
                    obesityXLabel.classed("active", false).classed("inactive", true);
                    healthcareYLabel.classed("active", false).classed("inactive", true);
                }
                else if (chosenXAxis === "smokes") {
                    povertyXLabel.classed("active", false).classed("inactive", true);
                    ageXLabel.classed("active", false).classed("inactive", true);
                    incomeXLabel.classed("active", false).classed("inactive", true);
                    healthcareXLabel.classed("active", false).classed("inactive", true);
                    smokesXLabel.classed("active", true).classed("inactive", false);
                    obesityXLabel.classed("active", false).classed("inactive", true);
                    smokesYLabel.classed("active", false).classed("inactive", true);
                }
                else {
                    povertyXLabel.classed("active", false).classed("inactive", true);
                    ageXLabel.classed("active", false).classed("inactive", true);
                    incomeXLabel.classed("active", false).classed("inactive", true);
                    healthcareXLabel.classed("active", false).classed("inactive", true);
                    smokesXLabel.classed("active", false).classed("inactive", true);
                    obesityXLabel.classed("active", true).classed("inactive", false);
                    obesityYLabel.classed("active", false).classed("inactive", true);
                }
            }
        });

    //Click for Y Axis
    yLabelsGroup.selectAll("text")
    .on("click", function() {
        //Variable Selection values
        var value = d3.select(this).attr("value");

        if (value != chosenYAxis) {

            //-------- Y Axis with new variable
            chosenYAxis = value;

            //--------New Y-Left scale with new variable
            yLinearScale = yScale(us_Data, chosenYAxis);

            //--------Y Axis Transition
            yAxis = yNewScale(yLinearScale, yAxis);

            //--------Scatter Plot with new values
            circlesGroup = ScatterUpdate(circlesGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);

            //--------ScatterLabels with new Value
            textGroup = ScatterLabelsUpdate(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis)

            //--------TooltipUpdate with new value
            circlesGroup = TooltipUpdate(chosenXAxis, chosenYAxis, circlesGroup);

            //-------- Activate Y Label,
            if (chosenYAxis === "poverty") {
                povertyYLabel.classed("active", true).classed("inactive", false);
                ageYLabel.classed("active", false).classed("inactive", true);
                incomeYLabel.classed("active", false).classed("inactive", true);
                healthcareYYLabel.classed("active", false).classed("inactive", true);
                smokesYLabel.classed("active", false).classed("inactive", true);
                obesityYLabel.classed("active", false).classed("inactive", true);
                povertyXLabel.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "age") {
                povertyYLabel.classed("active", false).classed("inactive", true);
                ageYLabel.classed("active", true).classed("inactive", false);
                incomeYLabel.classed("active", false).classed("inactive", true);
                healthcareYLabel.classed("active", false).classed("inactive", true);
                smokesYLabel.classed("active", false).classed("inactive", true);
                obesityYLabel.classed("active", false).classed("inactive", true);
                ageXLabel.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "income") {
                povertyYLabel.classed("active", false).classed("inactive", true);
                ageYLabel.classed("active", false).classed("inactive", true);
                incomeYLabel.classed("active", true).classed("inactive", false);
                healthcareYLabel.classed("active", false).classed("inactive", true);
                smokesYLabel.classed("active", false).classed("inactive", true);
                obesityYLabel.classed("active", false).classed("inactive", true);
                incomeXLabel.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "healthcare") {
                povertyYLabel.classed("active", false).classed("inactive", true);
                ageYLabel.classed("active", false).classed("inactive", true);
                incomeYLabel.classed("active", false).classed("inactive", true);
                healthcareYLabel.classed("active", true).classed("inactive", false);
                smokesYLabel.classed("active", false).classed("inactive", true);
                obesityYLabel.classed("active", false).classed("inactive", true);
                healthcareXLabel.classed("active", false).classed("inactive", true);
            }
            else if (chosenYAxis === "smokes") {
                povertyYLabel.classed("active", false).classed("inactive", true);
                ageYLabel.classed("active", false).classed("inactive", true);
                incomeYLabel.classed("active", false).classed("inactive", true);
                healthcareYLabel.classed("active", false).classed("inactive", true);
                smokesYLabel.classed("active", true).classed("inactive", false);
                obesityYLabel.classed("active", false).classed("inactive", true);
                smokesXLabel.classed("active", false).classed("inactive", true);
            }
            else {
                povertyYLabel.classed("active", false).classed("inactive", true);
                ageYLabel.classed("active", false).classed("inactive", true);
                incomeYLabel.classed("active", false).classed("inactive", true);
                healthcareYLabel.classed("active", false).classed("inactive", true);
                smokesYLabel.classed("active", false).classed("inactive", true);
                obesityYLabel.classed("active", true).classed("inactive", false);
                obesityXLabel.classed("active", false).classed("inactive", true);
            }
        }
    });
    


    
});