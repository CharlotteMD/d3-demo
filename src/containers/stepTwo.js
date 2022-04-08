import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import * as d3 from "d3";
import * as fcAxis from '@d3fc/d3fc-axis';
import * as fcAnnotation from '@d3fc/d3fc-annotation';
import data from '../data.json';

const maxDesktopWidth = 1400;
const viewHeight = 800;
const margin = {top: 20, right: 30, bottom: 50, left: 50};
const width = maxDesktopWidth - margin.left - margin.right;
const height = viewHeight - margin.top - margin.bottom;

// axis-scale (tick) labels
const feasibility = ['Commodotised', 'Pioneering', 'Gaining Momentum', 'In the Lab'];
const viability = ['Star Building', 'Stars Align', 'Star Gazing'];

// distance between axis and main axis label
const paddingFromAxis = 30;

const StepTwo = () => {
    const [ universe, setUniverse ] = useState([]);
    const clearOldGraphs = () => {
        const svg = d3.select('#graph')
            svg.selectAll("*").remove()
    }
  const dGraph = () => {
    const xScale = 
      d3.scaleLinear()
        .domain([0, 4])
        .range([ 0, width ]);
    const yScale = 
      d3.scaleLinear()
        .domain([0, 3])
        .range([ height, 0]);
    const svg = 
      d3.select("#graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
    svg.append('g')
      .attr("id", "circle-container")
      .selectAll("dot")
      .data(universe)
      .enter();
    addXAxis(xScale, svg);
    addYAxis(yScale, svg);
    gridLines(xScale, yScale);
  }

  const addXAxis = (xScale, svg) => {

    const xLabelWidth = 75;
    const xAxisIndent = (width/2) + (xLabelWidth/2);

    // append to the main svg the x-axis including scale and labels
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("grid", true)
      .attr("id", "x-axis")
      .call(fcAxis.axisBottom(xScale)
        .ticks(5)
        .tickValues([0, 1, 2, 3, 4])
        .tickFormat(function(d,i){ return feasibility[i] })
        .tickCenterLabel(true));

    // append the axis label
    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", xAxisIndent)
      .attr("y", height + paddingFromAxis)
      .style("font-size", "1em")
      .attr("fill", "black")
      .text("Feasibility");
  }

  const addYAxis = (yScale, svg) => { 
    const yLabelHeight = 160;
    const yAxisPosition = (height/2) - (yLabelHeight/2);

    // append to the main svg the y-axis including scale and labels
    svg.append("g")
      .attr("id", "y-axis")
      .attr("fill", "#8b8b8b")
      .call(fcAxis.axisLeft(yScale)
        .ticks(4)
        .tickValues([0, 1, 2, 3])
        .tickFormat(function(d,i){ return viability[i] })
        .tickCenterLabel(true));

    // append the axis label
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("y", - paddingFromAxis)
      .attr("x", - yAxisPosition)
      .attr("dy", ".75em")
      .attr("font-size", "16px")
      .attr("fill", "black")
      .attr("transform", "rotate(-90)")
      .text("Viability + Desirability");
  }
    
  const gridLines = (xScale, yScale) => {
    fcAxis.axisLabelRotate(fcAxis.axisOrdinalLeft(yScale));
    var gridline = fcAnnotation
      .annotationSvgGridline()
        .xScale(xScale)
        .yScale(yScale);
    gridline.xTicks([4]);
    gridline.yTicks([3]);
    d3.select('#circle-container')
        .call(gridline);
  }

  useEffect(() => {
    setUniverse(data);
  },[]);
  useEffect(() => {
    clearOldGraphs();
    console.log(universe);
    dGraph();
  },[universe])

  return (
    <>
        <h2>Step two.</h2>
        <h1>Add axis</h1>
        <Link to="/step-three">Next step</Link>
        <div id="graph"></div> 
    </>
  );
}

export default StepTwo;