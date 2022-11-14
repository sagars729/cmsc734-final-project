import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Papa from "papaparse";

// Tooltip - Done
// X-axis - Done
// Hardcoded axis and title - Done
// Multi trend
// Json for data circle and line path - Done
// Styling and resizing
// Zoom
// Horizontal line for time - Done

import "./LineChart.css";
import { zoomTransform } from "d3";

const LineChart = (props: any) => {
  const d3Chart = useRef<SVGSVGElement | null>(null);
  const [currentZoomState, setCurrentZoomState] = useState();
  useEffect(() => {
    if (props.csv) {
      console.log(props);
      Papa.parse(props.csv, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const data = results.data;
          data.forEach(function (d: any, i: any) {
            const index = props.keyPoints.findIndex(
              (x: any) => x.time === d.Date
            );
            d.circle = index != -1 ? 1 : 0;
            d.Date = d3.timeParse("%Y-%m-%d")(d.Date);
            d.tooltip =
              index != -1
                ? props.keyPoints[index].points[0]["analysis_yielded"]
                : "";
            d.highlight =
              index != -1 &&
              props.keyPoints[index].points[0]["analysis_yielded"] === "";
          });

          console.log(data);
          props.setPointsData(data);

          const width = parseInt(d3.select("#d3ChartId").style("width"));
          const height = parseInt(d3.select("#d3ChartId").style("height"));
          const padding = { t: 10, r: 10, b: 30, l: 10 };
          // Compute chart dimensions
          var chartWidth = width - padding.l - padding.r;
          var chartHeight = height - padding.t - padding.b;

          const svg = d3
            .select(d3Chart.current)
            .attr("transform", "translate(" + [padding.l, padding.t] + ")");

          //Scaling Chart
          const x = d3
            .scaleTime()
            .domain(
              d3.extent(data, function (d: any) {
                return d.Date;
              }) as [Date, Date]
            )
            .rangeRound([30, chartWidth]);

          if (currentZoomState) {
            const newXScale = (currentZoomState as any).rescaleX(x);
            // console.log(x.domain());
            // console.log(newXScale.domain());
            x.domain(newXScale.domain());
          }

          const y = d3
            .scaleLinear()
            .domain([
              0,
              d3.max(data, function (d: any) {
                return +d.Cases;
              }) as number,
            ])
            .rangeRound([chartHeight, 0]);

          //Adding Axes
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

          // Adding titles
          svg
            .append("text")
            .attr("class", "title")
            .attr("font-family", "cursive")
            .attr("transform", "translate(" + chartWidth / 4 + "," + 15 + ")")
            .text(props.general.title);

          svg
            .append("text")
            .attr("class", "label")
            .attr(
              "transform",
              "translate(" + [chartWidth / 2, chartHeight + 35] + ")"
            )
            .attr("font-family", "serif")
            .text(props.general["x-axis"]);

          svg
            .append("text")
            .attr("class", "label")
            .attr(
              "transform",
              "translate(" + [5, chartWidth / 3] + ")  rotate(90)"
            )
            .attr("font-family", "serif")
            .text(props.general["y-axis"]);

          // Adding Line Graph/ Path
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
                  return x(d.Date);
                })
                .y(function (d: any) {
                  return y(d.Cases);
                }) as any
            );

          // Tooltip On Hover
          const tooltip = d3
            .select("body")
            .append("div")
            .style("position", "absolute")
            .style("z-index", "10")
            .style("visibility", "hidden")
            .style("background-color", "black")
            .style("font-size", "13px")
            .style("color", "#fff")
            .attr("class", "keyPointTip");

          // Adding data Key points circle
          const ele = svg.selectAll("g").data(data).enter().append("g");

          ele
            .append("circle")
            .attr("r", function (d: any) {
              return d.circle == 1 ? "5" : d.highlight ? "5" : "0";
            })
            .attr("opacity", 1)
            .style("fill", function (d: any) {
              return d.circle == 1 ? "red" : d.highlight ? "pink" : "";
            })
            .style("stroke", "black")
            .style("stroke-width", "0.2")
            .attr("cx", function (d: any) {
              return x(d.Date);
            })
            .attr("cy", function (d: any) {
              return y(d.Cases);
            })
            .on("mouseover", function () {
              d3.select(this).style("fill", "lightgreen");
              tooltip.text(
                (d3.select(this) as any)._groups[0][0]["__data__"][
                  "tooltip"
                ] as string
              );
              tooltip.transition().duration(200);
              tooltip.style("visibility", "visible");
            })
            .on("mouseout", function () {
              d3.select(this).style(
                "fill",
                (d3.select(this) as any)._groups[0][0]["__data__"]["circle"] ==
                  1
                  ? "red"
                  : "pink"
              );
              tooltip.transition().duration(500);
              tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function (event: any) {
              tooltip
                .style("top", event.pageY - 10 + "px")
                .style("left", event.pageX + 10 + "px");
            });

          const zoomBehaviour: any = d3
            .zoom()
            .scaleExtent([0.5, 5])
            // .translateExtent([
            //   [-100, 0],
            //   [width + 100, height],
            // ])
            .on("zoom", () => {
              const zoomState: any = zoomTransform(svg.node() as any);
              setCurrentZoomState(zoomState);
            });

          // svg.call(zoomBehaviour);

          // Adding new key point highlight
          // console.log(chartHeight, chartWidth, width, height);
          data.forEach((d: any) => {
            if (d.highlight) {
              // console.log(x(d.Date), x(d.Cases), y(d.Date), y(d.Cases));
              svg
                .append("line")
                .attr("x1", x(d.Date)) //<<== change your code here
                .attr("y1", y(d.Cases))
                .attr("x2", x(d.Date)) //<<== and here
                .attr("y2", chartWidth + 10)
                .style("stroke-width", 1)
                .style("stroke", "pink")
                .style("fill", "none");
            }
          });
        },
      });
    }
  }, [currentZoomState, props.csv]);
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
