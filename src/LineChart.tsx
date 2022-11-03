import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Papa from "papaparse";

import "./LineChart.css";

const LineChart = (props: any) => {
  const d3Chart = useRef<SVGSVGElement | null>(null);
  useEffect(() => {
    if (props.data) {
      Papa.parse(props.data, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const data = results.data;
          const width = parseInt(d3.select("#d3ChartId").style("width"));
          const height = parseInt(d3.select("#d3ChartId").style("height"));
          const padding = { t: 40, r: 10, b: 40, l: 10 };
          const svg = d3
            .select(d3Chart.current)
            .attr("transform", "translate(" + [padding.l, padding.t] + ")");

          // Compute chart dimensions
          var chartWidth = width - padding.l - padding.r;
          var chartHeight = height - padding.t - padding.b;
          console.log(chartWidth, chartHeight);
          const xScale = d3
            .scaleLinear()
            .domain([1870, 2017])
            .rangeRound([30, chartWidth]);

          const yScale = d3
            .scaleLinear()
            .domain([0, 75])
            .rangeRound([chartHeight, 0]);

          svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + [0, chartHeight] + ")")
            .call(
              d3.axisBottom(xScale).tickFormat(function (d: any) {
                return d;
              })
            );

          svg
            .append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(25,0)")
            .call(d3.axisRight(yScale));

          svg
            .append("text")
            .attr("class", "title")
            .attr("font-family", "cursive")
            .attr("transform", "translate(" + chartWidth / 4 + "," + 15 + ")")
            .text("Top 10 HR Leaders per MLB Season");

          svg
            .append("text")
            .attr("class", "label")
            .attr(
              "transform",
              "translate(" + [chartWidth / 3, chartHeight + 45] + ")"
            )
            .attr("font-family", "serif")
            .text("MLB Season");

          svg
            .append("text")
            .attr("class", "label")
            .attr(
              "transform",
              "translate(" + [5, chartWidth / 2] + ")  rotate(90)"
            )
            .attr("font-family", "serif")
            .text("Home Runs (HR)");

          const ele = svg
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("cursor", "pointer");

          ele
            .append("circle")
            .attr("r", "2")
            // For Styling opacity
            .attr("opacity", function (d: any) {
              return d.homeruns > 50
                ? 1
                : d.homeruns < 50 && d.homeruns > 30
                ? 0.6
                : 0.4;
            })
            .style("fill", function (d: any) {
              return d.rank < 4 ? "orange" : "#42b9df";
            })
            .style("stroke", function (d: any) {
              return d.rank < 4 ? "black" : "none";
            })
            .style("stroke-width", function (d: any) {
              return d.rank < 4 ? "0.2" : "none";
            })
            .attr("cx", function (d: any) {
              return xScale(d.year);
            })
            .attr("cy", function (d: any) {
              return yScale(d.homeruns);
            });

          ele
            .append("text")
            .text(function (d: any) {
              return d.name;
            })
            .attr("opacity", 0)
            .attr("transform", function (d: any) {
              return (
                "translate(" + xScale(d.year) + "," + yScale(d.homeruns) + ")"
              );
            })
            .on("mouseover", function (d, i) {
              d3.select(this).attr("opacity", "1");
            })
            .on("mouseout", function (d, i) {
              d3.select(this).attr("opacity", "0");
            });
        },
      });
    }
  });
  return (
    <div id="d3ChartId">
      <svg
        style={{
          width: "100%",
          height: "90vh",
        }}
        ref={d3Chart}
      ></svg>
    </div>
  );
};

export default LineChart;
