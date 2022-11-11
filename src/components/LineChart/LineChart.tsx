import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Papa from "papaparse";

// Tooltip - Done
// X-axis - Done
// Hardcoded axis and title - Done
// Json for data circle and line path - Done
// Horizontal line for time - Done

// Zoom

// Styling and resizing

// Multi trend

// Click on the chart

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

          const width = parseInt(d3.select("#d3ChartId").style("width"));
          const height = parseInt(d3.select("#d3ChartId").style("height"));
          const padding = { t: 10, r: 10, b: 40, l: 10 };
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
            .range([0, chartWidth]);

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
          const xAxis = svg
            .append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(" + [0, chartHeight] + ")")
            .call(d3.axisBottom(x));

          const yAxis = svg
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

          // // This allows to find the closest X index of the mouse:
          // const bisect = d3.bisector(function (d: any) {
          //   return d.Date;
          // }).left;

          // // Create the circle that travels along the curve of chart
          // const focus = svg
          //   .append("g")
          //   .append("circle")
          //   .style("fill", "red")
          //   .attr("stroke", "black")
          //   .attr("r", 8)
          //   .style("opacity", 0);

          // // Create the text that travels along the curve of chart
          // const focusText = svg
          //   .append("g")
          //   .append("text")
          //   .style("opacity", 0)
          //   .style("z-index", "10")
          //   .attr("text-anchor", "left")
          //   .attr("alignment-baseline", "middle");

          // // Create a rect on top of the svg area: this rectangle recovers mouse position
          // svg
          //   .append("rect")
          //   .style("fill", "none")
          //   .style("pointer-events", "all")
          //   .attr("width", width)
          //   .attr("height", height)
          //   .on("mouseover", function () {
          //     focus.style("opacity", 1);
          //     focusText.style("opacity", 1);
          //   })
          //   .on("mousemove", function (event) {
          //     // recover coordinate we need
          //     const x0 = x.invert(d3.pointer(event)[0]);
          //     const i = bisect(data, x0, 1);
          //     const selectedData: any = data[i];
          //     // console.log(selectedData, x0, i);
          //     focus
          //       .attr("cx", x(selectedData.Date))
          //       .attr("cy", y(selectedData.Cases));
          //     focusText
          //       .html(
          //         "x:" +
          //           (selectedData.Date as Date).getMonth() +
          //           "/" +
          //           (selectedData.Date as Date).getFullYear() +
          //           "  -  " +
          //           "y:" +
          //           selectedData.Cases
          //       )
          //       .attr("x", x(selectedData.Date) + 15)
          //       .attr("y", y(selectedData.Cases));
          //   })
          //   .on("mouseout", function () {
          //     focus.style("opacity", 0);
          //     focusText.style("opacity", 0);
          //   })
          //   .on("click", function (event) {
          //     const x0 = x.invert(d3.pointer(event)[0]);
          //     const i = bisect(data, x0, 1);
          //     const selectedData: any = data[i];
          //     selectedData.highlight = true;
          //     console.log(selectedData);
          //   });

          // Adding Line Graph/ Path

          // Add a clipPath: everything out of this area won't be drawn.
          const clip = svg
            .append("defs")
            .append("svg:clipPath")
            .attr("id", "clip")
            .append("svg:rect")
            .attr("width", width)
            .attr("height", height)
            .attr("x", 0)
            .attr("y", 0);

          // Add brushing
          const brush = d3
            .brushX() // Add the brush feature using the d3.brush function
            .extent([
              [0, 0],
              [width, height],
            ]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
            .on("end", updateChart); // Each time the brush selection changes, trigger the 'updateChart' function

          // Create the line variable: where both the line and the brush take place
          const line = svg.append("g").attr("clip-path", "url(#clip)");

          line
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

          line.append("g").attr("class", "brush").call(brush);

          var idleTimeout: any = null;
          function idled() {
            idleTimeout = null;
          }

          // A function that update the chart for given boundaries
          function updateChart(event: any) {
            // What are the selected boundaries?
            const extent = event.selection;
            console.log(extent);
            // If no selection, back to initial coordinate. Otherwise, update X axis domain
            if (extent == null || extent == undefined) {
              if (!idleTimeout) return (idleTimeout = setTimeout(idled, 350)); // This allows to wait a little bit
              // x.domain([4, 8]);
              x.domain(
                d3.extent(data, function (d: any) {
                  return d.Date;
                }) as [Date, Date]
              );
            } else {
              x.domain([x.invert(extent[0]), x.invert(extent[1])]);
              line.select(".brush").call(brush.move as any, null); // This remove the grey brush area as soon as the selection has been done
            }

            // Update axis and line position
            xAxis.transition().duration(1000).call(d3.axisBottom(x));
            line
              .transition()
              .duration(1000)
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
          }

          svg.on("dblclick", function () {
            x.domain(
              d3.extent(data, function (d: any) {
                return d.Date;
              }) as [Date, Date]
            );

            xAxis.transition().call(d3.axisBottom(x));
            line.transition().attr(
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
          });

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
