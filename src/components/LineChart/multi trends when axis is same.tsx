import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Papa from "papaparse";

// Tooltip - Done
// X-axis - Done
// Hardcoded axis and title - Done
// Json for data circle and line path - Done
// Horizontal line for time - Done
// Zoom - Done
// Resetting the graph to clear all - Achieved
// Click on the chart - Done Need zoom after clicking to fix the point
// Styling and resizing
// Multi trend

import "./LineChart.css";
import { zoomTransform } from "d3";

const LineChart = (props: any) => {
  const d3Chart = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (props.csv) {
      Papa.parse(props.csv, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const data: any = results.data;

          var finalData = ["Cases", "Deaths"].map(function (id: any) {
            return {
              id: id,
              values: data.map(function (d: any) {
                const index = props.keyPoints.findIndex(
                  (x: any) => x.time === d.Date
                );
                return {
                  circle:
                    index != -1 &&
                    props.keyPoints[index].points[0]["variable"] == id
                      ? 1
                      : 0,
                  date: d3.timeParse("%Y-%m-%d")(d.Date),
                  tooltip:
                    index != -1 &&
                    props.keyPoints[index].points[0]["variable"] == id
                      ? props.keyPoints[index].points[0]["analysis_yielded"]
                      : "",
                  value: +d[id],
                };
              }),
            };
          });

          data.forEach((d: any) => {
            d.date = d3.timeParse("%Y-%m-%d")(d.Date);
          });

          // if (props.isLoadedInt == 1) {
          //   console.log("set points data");
          //   props.setIsLoadedInt(2);
          //   props.setPointsData(data);
          // }

          const width = parseInt(d3.select("#d3ChartId").style("width"));
          const height = parseInt(d3.select("#d3ChartId").style("height"));
          const padding = { t: 15, r: 0, b: 45, l: 25 };
          // Compute chart dimensions
          var chartWidth = width - padding.l - padding.r;
          var chartHeight = height - padding.t - padding.b;
          var svg = d3
            .select(d3Chart.current)
            .attr("transform", "translate(" + [padding.l, padding.t] + ")");

          svg.selectAll("*").remove();

          //Scaling Chart
          const x = d3
            .scaleTime()
            .domain(
              d3.extent(data, function (d: any) {
                return d.date;
              }) as [any, any]
            )
            .range([0, chartWidth]);

          const y = d3
            .scaleLinear()
            .domain([
              d3.min(finalData, function (c: any) {
                return d3.min(c.values, function (d: any) {
                  return d.value;
                }) as any;
              }),
              d3.max(finalData, function (c: any) {
                return d3.max(c.values, function (d: any) {
                  return d.value;
                }) as any;
              }),
            ])
            .rangeRound([chartHeight, 0]);

          const z = d3.scaleOrdinal(d3.schemeCategory10);
          z.domain(
            finalData.map(function (c) {
              return c.id;
            })
          );

          //Adding Axes
          const xAxis = svg
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(" + [0, chartHeight] + ")")
            .call(d3.axisBottom(x));

          const yAxis = svg
            .append("g")
            .attr("class", "y-axis")
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

          const line: any = d3
            .line()
            .defined((d: any) => !isNaN(d.value))
            .x((d: any) => x(d.date))
            .y((d: any) => y(d.value));

          // Create a <g> element for each column for which you want a line
          var eachColumn = svg
            .selectAll(".eachColumn")
            .data(finalData)
            .enter()
            .append("g")
            .attr("class", "eachColumn");

          eachColumn
            .append("path")
            .attr("class", "line")
            .attr("d", function (d) {
              console.log(d.values);
              return line(d.values);
            })
            .style("stroke", function (d) {
              return z(d.id);
            });

          // const defs = svg
          //   .append("defs")
          //   .append("clipPath")
          //   .attr("id", "clip")
          //   .append("rect")
          //   .attr("x", padding.l)
          //   .attr("width", chartWidth - padding.r)
          //   .attr("height", chartHeight);

          // svg
          //   .append("path")
          //   .datum(data)
          //   .attr("class", "path")
          //   .attr("fill", "none")
          //   .attr("clip-path", "url(#clip)")
          //   .attr("stroke", "orange")
          //   .attr("stroke-width", 1.5)
          //   .attr("d", line);

          // // This allows to find the closest X index of the mouse:
          // const bisect = d3.bisector(function (d: any) {
          //   return d.Date;
          // }).left;

          // // Create the circle that travels along the curve of chart
          // const focus = svg
          //   .append("g")
          //   .append("circle")
          //   .style("fill", "pink")
          //   .style("z-index", "100")
          //   .attr("stroke", "black")
          //   .attr("r", 4)
          //   .style("opacity", 0);

          // // Create the text that travels along the curve of chart
          // const focusText = svg
          //   .append("text")
          //   .style("opacity", 0)
          //   .style("z-index", "200")
          //   .style("background-color", "black")
          //   .style("font-size", "13px")
          //   .style("color", "#fff")
          //   .attr("text-anchor", "left")
          //   .attr("alignment-baseline", "middle");

          // // Create a rect on top of the svg area: this rectangle recovers mouse position
          // svg
          //   .append("rect")
          //   .style("fill", "none")
          //   .attr("class", "path2")
          //   .attr("clip-path", "url(#clip)")
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
          //     if (selectedData) {
          //       focus
          //         .attr("cx", x(selectedData.Date))
          //         .attr("cy", y(selectedData.Cases));
          //       focusText
          //         .html(
          //           "Date:" +
          //             (selectedData.Date as Date).getMonth() +
          //             "/" +
          //             (selectedData.Date as Date).getFullYear() +
          //             ""
          //         )
          //         .attr("x", x(selectedData.Date) + 15)
          //         .attr("y", y(selectedData.Cases));
          //     }
          //   })
          //   .on("mouseout", function () {
          //     focus.style("opacity", 0);
          //     focusText.style("opacity", 0);
          //   })
          //   .on("click", function (event) {
          //     const x0 = x.invert(d3.pointer(event)[0]);
          //     const i = bisect(data, x0, 1);
          //     const selectedData: any = data[i];
          //     selectedData.circle = 1;
          //     // var newData = [...props.keyPoints];

          //     // TODO: for Harsh - auto scroll to the point on the left side when point is clicked on the graph
          //     props.addKeyPoints(
          //       formatDate(selectedData.Date),
          //       "Cases",
          //       selectedData.Cases
          //     );
          //     // newData.push({
          //     //   time: formatDate(selectedData.Date),
          //     //   points: [
          //     //     {
          //     //       analysis_yielded: "",
          //     //       point_value: selectedData.Cases,
          //     //       variable: "Cases",
          //     //     },
          //     //   ],
          //     // });
          //     // props.setData(newData);
          //   });

          // function formatDate(d: Date) {
          //   var month = "" + (d.getMonth() + 1),
          //     day = "" + d.getDate(),
          //     year = d.getFullYear();

          //   if (month.length < 2) month = "0" + month;
          //   if (day.length < 2) day = "0" + day;

          //   return [year, month, day].join("-");
          // }

          // Tooltip On Hover
          // const tooltip = d3
          //   .select("body")
          //   .append("div")
          //   .style("position", "absolute")
          //   .style("z-index", "10")
          //   .style("visibility", "hidden")
          //   .style("background-color", "black")
          //   .style("font-size", "13px")
          //   .style("color", "#fff")
          //   .attr("class", "keyPointTip");

          // Adding data Key points circle
          // var circles = svg
          //   .selectAll(".myDot")
          //   .data(data)
          //   .join("circle")
          //   .attr("clip-path", "url(#clip)")
          //   .attr("r", function (d: any) {
          //     return d.circle == 1 ? "5" : d.highlight ? "5" : "0";
          //   })
          //   .attr("opacity", 1)
          //   .style("fill", function (d: any) {
          //     return d.circle == 1 ? "red" : d.highlight ? "pink" : "";
          //   })
          //   .style("stroke", "black")
          //   .style("stroke-width", "0.2")
          //   .attr("cx", function (d: any) {
          //     return x(d.Date);
          //   })
          //   .attr("cy", function (d: any) {
          //     return y(d.Cases);
          //   })
          //   .on("mouseover", function () {
          //     d3.select(this).style("fill", "lightgreen");
          //     tooltip.text(
          //       (d3.select(this) as any)._groups[0][0]["__data__"][
          //         "tooltip"
          //       ] as string
          //     );
          //     tooltip.transition().duration(200);
          //     tooltip.style("visibility", "visible");
          //   })
          //   .on("mouseout", function () {
          //     d3.select(this).style(
          //       "fill",
          //       (d3.select(this) as any)._groups[0][0]["__data__"]["circle"] ==
          //         1
          //         ? "red"
          //         : "pink"
          //     );
          //     tooltip.transition().duration(500);
          //     tooltip.style("visibility", "hidden");
          //   })
          //   .on("mousemove", function (event: any) {
          //     tooltip
          //       .style("top", event.pageY - 10 + "px")
          //       .style("left", event.pageX + 10 + "px");
          //   });

          // svg.call(zoom);

          // function zoom() {
          //   const extent: any = [
          //     [padding.l, padding.t],
          //     [chartWidth - padding.r, chartHeight - padding.t],
          //   ];

          //   const zooming: any = d3
          //     .zoom()
          //     .scaleExtent([1, 8])
          //     .translateExtent(extent)
          //     .extent(extent)
          //     .on("zoom", zoomed);

          //   svg.call(zooming);

          //   function zoomed(event: any) {
          //     x.range(
          //       [padding.l, chartWidth - padding.r].map((d) =>
          //         event.transform.applyX(d)
          //       )
          //     );

          //     svg.select(".path").attr("d", line2);
          //     circles.remove();
          //     circles = svg
          //       .selectAll(".myDot")
          //       .data(data)
          //       .join("circle")
          //       .attr("clip-path", "url(#clip)")
          //       .attr("r", function (d: any) {
          //         return d.circle == 1 ? "5" : d.highlight ? "5" : "0";
          //       })
          //       .attr("opacity", 1)
          //       .style("fill", function (d: any) {
          //         return d.circle == 1 ? "red" : d.highlight ? "pink" : "";
          //       })
          //       .style("stroke", "black")
          //       .style("stroke-width", "0.2")
          //       .attr("cx", function (d: any) {
          //         return x(d.Date);
          //       })
          //       .attr("cy", function (d: any) {
          //         return y(d.Cases);
          //       })
          //       .on("mouseover", function () {
          //         d3.select(this).style("fill", "lightgreen");
          //         tooltip.text(
          //           (d3.select(this) as any)._groups[0][0]["__data__"][
          //             "tooltip"
          //           ] as string
          //         );
          //         tooltip.transition().duration(200);
          //         tooltip.style("visibility", "visible");
          //       })
          //       .on("mouseout", function () {
          //         d3.select(this).style(
          //           "fill",
          //           (d3.select(this) as any)._groups[0][0]["__data__"][
          //             "circle"
          //           ] == 1
          //             ? "red"
          //             : "pink"
          //         );
          //         tooltip.transition().duration(500);
          //         tooltip.style("visibility", "hidden");
          //       })
          //       .on("mousemove", function (event: any) {
          //         tooltip
          //           .style("top", event.pageY - 10 + "px")
          //           .style("left", event.pageX + 10 + "px");
          //       });
          //     svg.select(".x-axis").call(d3.axisBottom(x) as any);
          // }
          // }
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
