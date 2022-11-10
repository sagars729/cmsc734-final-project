import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Papa from "papaparse";

// Tooltip
// X-axis
// Hardcoded axis and title
// Multi trend
// Json for data circle and line path
// Styling
// Horizontal line for time

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
          data.forEach(function (d: any, i: any) {
            d.date = d3.timeParse("%Y-%m-%d")(d.date);
            d.circle = i % 199 ? 0 : 1; //
          });
          var data2 = JSON.parse(JSON.stringify(data));
          data2.forEach(function (d: any, i: any) {
            d.date = d3.timeParse("%Y-%m-%d")(d.date);
            d.value = i % 10 ? 100 : 0;
            d.circle = i % 199 ? 0 : 1;
          });

          console.log(data2);

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
          
          const x = d3
            .scaleLinear()
            .domain(
              d3.extent(data, function (d: any) {
                return d.date;
              }) as [Date, Date]
            )
            .rangeRound([30, chartWidth]);
          // console.log(
          //   d3.extent(data, function (d: any) {
          //     return d.Date;
          //   }) as [Date, Date]
          // );
          const y = d3
            .scaleLinear()
            .domain([
              0,
              d3.max(data, function (d: any) {
                return +d.value;
              }) as number,
            ])
            .rangeRound([chartHeight, 0]);

          svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + [0, chartHeight] + ")")
            .call(d3.axisBottom(x));

          svg
            .append("g")
            .attr("class", "y axis")
            .attr("transform", "translate(25,0)")
            .call(d3.axisRight(y));

          svg
            .append("text")
            .attr("class", "title")
            .attr("font-family", "cursive")
            .attr("transform", "translate(" + chartWidth / 4 + "," + 15 + ")")
            .text("Title - Chart");

          svg
            .append("text")
            .attr("class", "label")
            .attr(
              "transform",
              "translate(" + [chartWidth / 2, chartHeight + 35] + ")"
            )
            .attr("font-family", "serif")
            .text("X-Axis");

          svg
            .append("text")
            .attr("class", "label")
            .attr(
              "transform",
              "translate(" + [5, chartWidth / 2] + ")  rotate(90)"
            )
            .attr("font-family", "serif")
            .text("Y-Axis :)");

          svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr(
              "d",
              d3
                .line()
                .x(function (d: any) {
                  return x(d.date);
                })
                .y(function (d: any) {
                  return y(d.value);
                }) as any
            );

          svg
            .append("path")
            .datum(data2)
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 1.5)
            .attr(
              "d",
              d3
                .line()
                .x(function (d: any) {
                  return x(d.date);
                })
                .y(function (d: any) {
                  return y(d.value);
                }) as any
            );

          // const data2: any = data.filter((e: any) => {
          //   return e.circle;
          // });
          // console.log(data2);
          const ele = svg
            .selectAll("g")
            .data(data)
            .enter()
            .append("g")
            .attr("cursor", "pointer");

          ele
            .append("circle")
            .attr("r", function (d: any) {
              return d.circle == 1 ? "5" : "0";
            })
            .attr("opacity", 1)
            .style("fill", "red")
            .style("stroke", "black")
            .style("stroke-width", "0.2")
            .attr("cx", function (d: any) {
              return x(d.date);
            })
            .attr("cy", function (d: any) {
              return y(d.value);
            });

          svg
            .append("line")
            .attr("x1", x(d3.timeParse("%Y-%m-%d")("2017-12-17") as Date)) //<<== change your code here
            .attr("y1", 0)
            .attr("x2", x(d3.timeParse("%Y-%m-%d")("2017-12-17") as Date)) //<<== and here
            .attr("y2", height - padding.t - padding.b)
            .style("stroke-width", 0.5)
            .style("stroke", "red")
            .style("fill", "none");

          ele
            .append("text")

            .text(function (d: any) {
              return d.circle ? "Tooltip" : "";
            })
            .attr("opacity", 0)
            .attr("margin", "10px")
            .attr("transform", function (d: any) {
              return "translate(" + x(d.date) + "," + y(d.value) + ")";
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
          height: "620px",
        }}
        ref={d3Chart}
      ></svg>
    </div>
  );
};

export default LineChart;
