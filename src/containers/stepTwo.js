import React, { useEffect, useState, useCallback } from 'react';
import * as d3 from "d3";
import * as fcAxis from '@d3fc/d3fc-axis';
import * as fcAnnotation from '@d3fc/d3fc-annotation';
import { axisLabelRotate } from '@d3fc/d3fc-axis'
import data from '../data.json';

// set the dimensions and margins of the graph
const maxDesktopWidth = 1400;
const viewHeight = 800;
const margin = {top: 20, right: 30, bottom: 50, left: 50};
const width = maxDesktopWidth - margin.left - margin.right;
const height = viewHeight - margin.top - margin.bottom;

// tick labels
const feasibility = ['Commodotised', 'Pioneering', 'Gaining Momentum', 'In the Lab'];
const viability = ['Star Building', 'Stars Align', 'Star Gazing'];

// distance between axis and main axis label
const paddingFromAxis = 30;

// how many px the nodes must be separated 
const repulsionForce = 50;

const StepTwo = () => {
    const [ universe, setUniverse ] = useState([]);

  const clearOldGraphs = () => {
    const svg = d3.select('#graph')
          svg.selectAll("*").remove()
  }

  const dGraph = () => {
    // set up blank graph
    const xScale = 
      d3.scaleLinear()
        .domain([0, 4])
        .range([ 0, width ]);

    const yScale = 
      d3.scaleLinear()
        .domain([0, 3])
        .range([ height, 0]);

    // append the svg object to the body of the page
    const svg = 
      d3.select("#graph")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

    // append the space for the graph (minus the axis) (called circle-container)
    svg.append('g')
      .attr("id", "circle-container")
      .selectAll("dot")
      .data(universe)
      .enter();
    
    addXAxis(xScale, svg);
    addYAxis(yScale, svg);
    tickStyling();
    gridLines(xScale, yScale);
  }

  const addXAxis = useCallback(
    (xScale, svg) => {
        const xLabelWidth = 75
        const xAxisIndent = width / 2 + xLabelWidth / 2

        // append to the main svg the x-axis including scale and labels
        svg.append('g')
            .attr('transform', 'translate(0,' + height + ')')
            .attr('grid', true)
            .attr('id', 'x-axis')
            .call(
                fcAxis
                    .axisBottom(xScale)
                    .ticks(5)
                    .tickValues([0, 1, 2, 3, 4])
                    .tickFormat(function (d, i) {
                        return data.xaxis[i]
                    })
                    .tickCenterLabel(true),
            )
            .attr('font-size', '1em')

        // branded x axis
        d3.selectAll('g#x-axis')
            .append('path')
            .attr(
                'd',
                'M1324.89 24L1326.6 13.6971L1337 12L1326.6 10.3029L1324.89 -5.96046e-08L1323.18 10.3029L1312.78 12L1323.18 13.6971L1324.89 24Z',
            )
            .attr('transform', 'translate(75,-12)')
            .attr('fill', '#8b8b8b')
            .attr('stroke', '#8b8b8b')

        // append the axis label
        svg.append('text')
            .attr('class', 'x-label')
            .attr('text-anchor', 'end')
            .attr('x', xAxisIndent)
            .attr('y', height + paddingFromAxis)
            .style('font-size', '1em')
            .attr('fill', 'var(--white)')
            .text('Feasibility')
    },
    [data.xaxis],
)

const addYAxis = useCallback(
    (yScale, svg) => {
        const yLabelHeight = 160
        const yAxisPosition = height / 2 - yLabelHeight / 2
        // append to the main svg the y-axis including scale and labels
        svg.append('g')
            .attr('id', 'y-axis')
            .attr('fill', '#8b8b8b')
            .call(
                axisLabelRotate(
                    fcAxis
                        .axisLeft(yScale)
                        .ticks(4)
                        .tickValues([0, 1, 2, 3])
                        .tickFormat(function (d, i) {
                            return data.yaxis[i]
                        })
                        .tickCenterLabel(true),
                ).labelRotate(0),
            )
            .attr('font-size', '1em')

        // branded y axis
        d3.selectAll('g#y-axis')
            .append('path')
            .attr(
                'd',
                'M12.03 28.3467L13.7141 16.1796L24.015 14.1702L13.7099 12.1717L11.9999 0.00633188L10.3158 12.1735L0.0149614 14.1828L10.32 16.1814L12.03 28.3467Z',
            )
            .attr('fill', '#8b8b8b')
            .attr('transform', 'translate(-12,-14)')
            .attr('stroke', '#8b8b8b')

        // append the axis label
        svg.append('text')
            .attr('class', 'y-label')
            .attr('text-anchor', 'end')
            .attr('y', -paddingFromAxis)
            .attr('x', -yAxisPosition)
            .attr('dy', '.75em')
            .attr('font-size', '1em')
            .attr('fill', 'var(--white)')
            .attr('transform', 'rotate(-90)')
            .text('Viability + Desirability')
    },
    [data.yaxis],
)

  const tickStyling = () => {

    // remove lines on axis to mark ticks
    d3.select('#graph').selectAll('.tick').selectAll('path').remove();

    // change color of ticks
    d3.selectAll('g.tick text')
      .style('fill', "black")

    // change color of axis
    d3.selectAll('g#x-axis path')
      .style('stroke', '#8b8b8b')
    d3.selectAll('g#y-axis path')
      .style('stroke', '#8b8b8b')
  }
    
  const gridLines = (xScale, yScale) => {

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

  const dataVisualisation = () => {
    
    // plotting the nodes without overlapping
    d3.forceSimulation(universe)
      .force("collision", d3.forceCollide(repulsionForce)) // Repulsion force
      .force("x_force", d3.forceX(d => d.xaxis.coordinate)) // Each point attacted to its center x and y
      .force("y_force", d3.forceY(d => d.yaxis.coordinate))
      .on('tick', ticked); // Redraws scatterplot at every simulation "tick"


    function ticked() {
      var container = d3.select('#circle-container')

      // nodes and text are appended into groups so text and node can overlap
      var groups = container.selectAll('g')
        .data(universe)

      // append the path of the hexagon to the group
      var enterSelection = groups.enter().append('g')
      
      enterSelection.append('path',)
        .attr('d', 'M0 57.744V30.256a16 16 0 0 1 8.024-13.87l24-13.8a16 16 0 0 1 15.951 0l24 13.8A16 16 0 0 1 80 30.256v27.488a16 16 0 0 1-8.025 13.87l-24 13.8a16 16 0 0 1-15.95 0l-24-13.8A16 16 0 0 1 0 57.744Z')
        .attr("id", function (d) { return `${d.id}-hex`; })
        .attr("class", "node-hexagon")
        .attr("fill", function (d) { 
            var dataColor = 
              d.business_opportunity === null || d.business_opportunity === undefined ? 
              'var(--dark-grey)' : `#${d.business_opportunity.colour}`;
            console.log(dataColor);
            return dataColor;
          })
        .attr("transform", function(d) {
          return `translate(-40,-44)`
        })
        .attr("x", d => d.x)
        .attr("y", d => d.y)
        .attr("width", 80)
        .attr("height", 88);

      // append the text to the group that already contains the hexagon
      enterSelection.append("text")
        .attr("id", function (d) { return `${d.id}-label`; })
        .attr("class", "node-text-label")
        .attr("font-size", "12px")
        .attr("fill", "black")
        .attr("font-family", 'DM Sans')
        .text(function(d){ return d.id})
        .attr("text-anchor", "middle");

      // plots the groups so they dont collide - uses x and y that the forceCollide function adds to the d3 data
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
        <h2>Step two.</h2>
        <h1>Add axis</h1>
        <div id="graph"></div> 
    </>
  );
}

export default StepTwo;