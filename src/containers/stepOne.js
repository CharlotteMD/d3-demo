import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import * as d3 from "d3";
import * as fcAxis from '@d3fc/d3fc-axis';
import * as fcAnnotation from '@d3fc/d3fc-annotation';
import data from '../data.json';

// set the dimensions and margins of the graph
const maxDesktopWidth = 1400;
const viewHeight = 800;
const margin = {top: 20, right: 30, bottom: 50, left: 50};
const width = maxDesktopWidth - margin.left - margin.right;
const height = viewHeight - margin.top - margin.bottom;

const StepOne = () => {
  const [ universe, setUniverse ] = useState([]);

  const clearOldGraphs = () => {
    const svg = d3.select('#graph')
          svg.selectAll("*").remove()
  }

  const dGraph = () => {

    // append the svg object to the body of the page
    const svg = 
      d3.select("#graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)

    // append the space for the graph (minus the axis) (called circle-container)
    svg.append('g')
      .attr("id", "circle-container")
      .selectAll("dot")
      .data(universe)
      .enter();
    
    // addXAxis(svg);
    // addYAxis(svg);
    gridLines();
  }
    
  const gridLines = () => {

    // set up blank graph
    const xScale = 
      d3.scaleLinear()
        .domain([0, 4])
        .range([ 0, width ]);

    const yScale = 
      d3.scaleLinear()
        .domain([0, 3])
        .range([ height, 0]);

    // add gridlines using d3 extension fc
    fcAxis.axisLabelRotate(fcAxis.axisOrdinalLeft(yScale));

    // add ticks in the same scale as axis
    var gridline = fcAnnotation
      .annotationSvgGridline()
        .xScale(xScale)
        .yScale(yScale);
    
    // add correct number of ticks
    gridline.xTicks([4]);
    gridline.yTicks([3]);

    // append the gridlines to the circle-container 
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
        <h2>Step one.</h2>
        <h1>Draw a blank graph</h1>
        <Link to="/step-two">Next step</Link>
        <div id="graph"></div> 
    </>
  );
}

export default StepOne;