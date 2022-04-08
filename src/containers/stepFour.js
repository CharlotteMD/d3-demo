import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import * as d3 from "d3";
import * as fcAxis from '@d3fc/d3fc-axis';
import * as fcAnnotation from '@d3fc/d3fc-annotation';
import data from '../more-data.json';

const maxDesktopWidth = 1400;
const viewHeight = 800;
const margin = {top: 20, right: 30, bottom: 50, left: 50};
const width = maxDesktopWidth - margin.left - margin.right;
const height = viewHeight - margin.top - margin.bottom;
const feasibility = ['Commodotised', 'Pioneering', 'Gaining Momentum', 'In the Lab'];
const viability = ['Star Building', 'Stars Align', 'Star Gazing'];
const paddingFromAxis = 30;
const repulsionForce = 50;

const StepFour = () => {
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
    dataVisualisation();
    gridLines(xScale, yScale);
  }
  const addXAxis = (xScale, svg) => {
    const xLabelWidth = 75;
    const xAxisIndent = (width/2) + (xLabelWidth/2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .attr("grid", true)
      .attr("id", "x-axis")
      .call(fcAxis.axisBottom(xScale)
        .ticks(5)
        .tickValues([0, 1, 2, 3, 4])
        .tickFormat(function(d,i){ return feasibility[i] })
        .tickCenterLabel(true));
    svg.append("text")
      .attr("class", "x-label")
      .attr("text-anchor", "end")
      .attr("x", xAxisIndent)
      .attr("y", height + paddingFromAxis)
      .style("font-size", "1em")
      .attr("fill", "var(--white)")
      .text("Feasibility");
  }
  const addYAxis = (yScale, svg) => { 
    const yLabelHeight = 160;
    const yAxisPosition = (height/2) - (yLabelHeight/2);
    svg.append("g")
      .attr("id", "y-axis")
      .attr("fill", "#8b8b8b")
      .call(fcAxis.axisLeft(yScale)
        .ticks(4)
        .tickValues([0, 1, 2, 3])
        .tickFormat(function(d,i){ return viability[i] })
        .tickCenterLabel(true));
    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "end")
      .attr("y", - paddingFromAxis)
      .attr("x", - yAxisPosition)
      .attr("dy", ".75em")
      .attr("font-size", "16px")
      .attr("fill", "var(--white)")
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

  const dataVisualisation = () => {
    const simulation = 
        d3.forceSimulation(universe)
            .force("collision", d3.forceCollide(50)) // Repulsion force
            .force("x_force", d3.forceX(d => d.xaxis)) // Each point attacted to its center x and y
            .force("y_force", d3.forceY(d => d.yaxis))
            .on('tick', ticked); // Redraws scatterplot at every simulation "tick"


    function ticked() {
        var container = d3.select('#circle-container')
        var groups = container.selectAll('g')
            .data(universe)

        var enterSelection = groups.enter().append('g')
        enterSelection.append('path',)
            .attr('d', 'M0 57.744V30.256a16 16 0 0 1 8.024-13.87l24-13.8a16 16 0 0 1 15.951 0l24 13.8A16 16 0 0 1 80 30.256v27.488a16 16 0 0 1-8.025 13.87l-24 13.8a16 16 0 0 1-15.95 0l-24-13.8A16 16 0 0 1 0 57.744Z')
            .attr("id", function (d) { return `${d.id}-hex`; })
            .attr("class", "node-hexagon")
            .attr("fill", "pink")
            .attr("transform", function(d) {
              return `translate(-40,-44)`
            })
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .attr("width", 80)
            .attr("height", 88);
          enterSelection.append("text")
            .attr("id", function (d) { return `${d.id}-label`; })
            .attr("class", "node-text-label")
            .attr("font-size", "12px")
            .attr("fill", "black")
            .attr("font-family", 'DM Sans')
            .text(function(d){ return `${d.name}`;})
            .attr("text-anchor", "middle");

        groups.attr("id", function (d) { return `${d.id}-g` })
            .attr("transform", function(d) {
              return `translate(${d.x},${d.y})`
            });     
  }
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
        <h2>Step four.</h2>
        <h1>Arranging the data</h1>
        <Link to="/">Back to start</Link>
        <div id="graph"></div> 
    </>
  );
}

export default StepFour;