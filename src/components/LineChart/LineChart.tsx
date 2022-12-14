import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import Papa from "papaparse";
import "./LineChart.css";

const LineChart = (props: any) => {
  const d3Chart = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (props.csv && !props.showAttrSelection) {
      Papa.parse(props.csv, {
        header: true,
        skipEmptyLines: true,
        complete: function (results) {
          const data = results.data;
          const data1: any = [];
          const data2: any = [];
          var xVar: string = "";
          var yVar: string = "";
          var yVar2: string = "";
          if (props.variable) {
            xVar = props.variable[0];
            yVar = props.variable[1];
            if (props.variable.length > 2) {
              yVar2 = props.variable[2];
            }
          }
          data.forEach(function (d: any, i: any) {
            var circleTooltipList: any = new Array(4);
            circleTooltipList[0] = 0;
            circleTooltipList[2] = 0;
            circleTooltipList[1] = "";
            circleTooltipList[3] = "";
            props.keyPoints.forEach((e: any, j: any) => {
              if (e.time === d[xVar]) {
                if (e.points[0]["variable"] === yVar) {
                  circleTooltipList[0] = 1;
                  circleTooltipList[1] = e.points[0]["analysis_yielded"];
                }

                if (e.points[0]["variable"] === yVar2) {
                  circleTooltipList[2] = 1;
                  circleTooltipList[3] = e.points[0]["analysis_yielded"];
                }
              }
            });
            // console.log(circleTooltipList);

            const calcdate = new Date(d[xVar]); //d3.timeParse("%Y-%m-%d")(d[xVar]); //|| new Date(d[xVar]);

            data1.push({
              circle: circleTooltipList[0],
              date: calcdate,
              tooltip: circleTooltipList[1],
              value: +d[yVar],
            });
            if (yVar2 !== "") {
              data2.push({
                circle: circleTooltipList[2],
                date: calcdate,
                tooltip: circleTooltipList[3],
                value: +d[yVar2],
              });
            }
          });

          data1.sort(function (a: any, b: any) {
            var keyA = a.date,
              keyB = b.date;
            // Compare the 2 dates
            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          });
          if (data2) {
            data2.sort(function (a: any, b: any) {
              var keyA = a.date,
                keyB = b.date;
              // Compare the 2 dates
              if (keyA < keyB) return -1;
              if (keyA > keyB) return 1;
              return 0;
            });
          }

          if (props.isLoadedInt === 1) {
            props.setIsLoadedInt(2);
            props.setPointsData(data);
          }

          const width = parseInt(d3.select("#d3ChartId").style("width"));
          const height = parseInt(d3.select("#d3ChartId").style("height"));
          const padding = { t: 15, r: 25, b: 100, l: 30 };
          // Compute chart dimensions
          var chartWidth = width - padding.l - padding.r;
          var chartHeight = height - padding.t - padding.b;
          var svg = d3
            .select(d3Chart.current)
            .attr("transform", "translate(" + [0, padding.t] + ")");
          // .attr("preserveAspectRatio", "xMinYMin meet")
          // .attr("viewBox", "0 0 " + width + " " + height + " ");

          d3.select(window).on("resize.updatesvg", function updateWindow() {
            props.setResize(new Date());
          });

          svg.selectAll("*").remove();

          //Scaling Chart
          const x = d3
            .scaleTime()
            .domain(
              d3.extent(data1, function (d: any) {
                return d.date;
              }) as [any, any]
            )
            .range([40, chartWidth]);

          const y0 = d3
            .scaleLinear()
            .domain([
              0,
              d3.max(data1, function (d: any) {
                return +d.value;
              }) as number,
            ])
            .rangeRound([chartHeight, 0]);

          const y1 = d3
            .scaleLinear()
            .domain([
              0,
              d3.max(data2, function (d: any) {
                return +d.value;
              }) as number,
            ])
            .rangeRound([chartHeight, 0]);

          //Adding Axes
          svg
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(" + [0, chartHeight] + ")")
            .call(d3.axisBottom(x));

          svg
            .append("g")
            .attr("class", "y-axis1")
            .attr("transform", "translate(" + 20 + "," + 0 + ")")
            .call(d3.axisRight(y0));
          if (yVar2 !== "") {
            svg
              .append("g")
              .attr("class", "y-axis2")
              .attr("transform", "translate(" + (chartWidth + 25) + ",0)")
              .call(d3.axisLeft(y1));
          }

          if (yVar2 !== "")
            svg
              .append("text")
              .attr("text-anchor", "end")
              .attr("y", chartWidth + 25)
              .attr("dy", ".75em")
              .attr("transform", "rotate(-90)")
              .text(yVar2);

          svg
            .append("text")
            .attr("text-anchor", "end")
            .attr("y", 0)
            .attr("dy", ".75em")
            .attr("transform", "rotate(-90)")
            .text(yVar);

          // svg
          //   .append("text")
          //   .attr("x", 40)
          //   .attr("y", chartHeight + padding.t + 20)
          //   .text(yVar2);

          const line1: any = d3
            .line()
            .defined((d: any) => !isNaN(d.value))
            .x((d: any) => x(d.date))
            .y((d: any) => y0(d.value));
          var line2: any;
          if (yVar2 !== "") {
            line2 = d3
              .line()
              .defined((d: any) => !isNaN(d.value))
              .x((d: any) => x(d.date))
              .y((d: any) => y1(d.value));
          }

          svg
            .append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", padding.l)
            .attr("width", chartWidth - padding.r)
            .attr("height", chartHeight);

          svg
            .append("path")
            .datum(data1)
            .attr("class", "path")
            .attr("fill", "none")
            .attr("clip-path", "url(#clip)")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line1);
          if (yVar2 !== "") {
            svg
              .append("path")
              .datum(data2)
              .attr("class", "path1")
              .attr("fill", "none")
              .attr("clip-path", "url(#clip)")
              .attr("stroke", "pink")
              .attr("stroke-width", 1.5)
              .attr("d", line2);
          }

          // // This allows to find the closest X index of the mouse:
          const bisect = d3.bisector(function (d: any) {
            return d.date;
          }).left;

          // // Create the circle that travels along the curve of chart
          const focus1 = svg
            .append("g")
            .append("circle")
            .style("fill", "yellow")
            .style("z-index", "100")
            .attr("stroke", "black")
            .attr("r", 4)
            .style("opacity", 0);
          var focus2: any;
          if (yVar2 !== "") {
            focus2 = svg
              .append("g")
              .append("circle")
              .style("fill", "yellow")
              .style("z-index", "100")
              .attr("stroke", "black")
              .attr("r", 4)
              .style("opacity", 0);
          }
          // // Create a rect on top of the svg area: this rectangle recovers mouse position
          var xTitle: any;

          svg
            .append("rect")
            .style("fill", "none")
            .style("pointer-events", "all")
            .attr("width", chartWidth)
            .attr("height", chartHeight)
            .on("mouseover", function () {
              focus1.style("opacity", 1);
              if (yVar2 !== "") {
                focus2.style("opacity", 1);
              }
            })
            .on("mousemove", function (event) {
              if (props.focusVar === yVar2) {
                d3.selectAll(".path") // Fade the non-selected names in the legend
                  .style("opacity", 0.2);
              } else {
                d3.selectAll(".path1") // Fade the non-selected names in the legend
                  .style("opacity", 0.2);
              }
              // recover coordinate we need
              const x0 = x.invert(d3.pointer(event)[0]);
              const i =
                bisect(data1, x0, 1) === 0 ? 0 : bisect(data1, x0, 1) - 1;
              var j: any;
              if (yVar2 !== "") {
                j = bisect(data2, x0, 1) === 0 ? 0 : bisect(data2, x0, 1) - 1;
              }

              const selectedData1: any = data1[i];
              var selectedData2: any;
              if (yVar2 !== "") {
                selectedData2 = data2[j];
              }
              if (selectedData1) {
                focus1
                  .attr("cx", x(selectedData1.date))
                  .attr("cy", y0(selectedData1.value));
              }
              if (selectedData2) {
                focus2
                  .attr("cx", x(selectedData2.date))
                  .attr("cy", y1(selectedData2.value));
              }
              var text1 = [selectedData1.value];
              if (yVar2 !== "" && selectedData2) {
                text1.push(selectedData2.value);
              }
              if (xTitle) xTitle.remove();
              xTitle = svg
                .append("text")
                .attr("x", 40)
                .attr("y", chartHeight + padding.t + 20)
                .text(
                  "Date: " +
                    selectedData1.date.toISOString().slice(0, 10) +
                    "     " +
                    (selectedData1 && selectedData1.value
                      ? yVar + ": " + selectedData1.value
                      : "") +
                    "     " +
                    (yVar2 !== "" && selectedData2 && selectedData2.value
                      ? yVar2 + ": " + selectedData2.value
                      : "")
                );

              if (props.focusVar === yVar2) {
                d3.selectAll(".path") // Fade the non-selected names in the legend
                  .style("opacity", 0.2);
              } else {
                d3.selectAll(".path1") // Fade the non-selected names in the legend
                  .style("opacity", 0.2);
              }
            })
            .on("mouseout", function () {
              if (xTitle) xTitle.remove();
              focus1.style("opacity", 0);
              if (yVar2 !== "") {
                focus2.style("opacity", 0);
              }
              if (props.focusVar === yVar2) {
                d3.selectAll(".path") // Fade the non-selected names in the legend
                  .style("opacity", 1);
              } else {
                d3.selectAll(".path1") // Fade the non-selected names in the legend
                  .style("opacity", 1);
              }
            })
            .on("click", function (event) {
              const x0 = x.invert(d3.pointer(event)[0]);
              const i =
                bisect(data1, x0, 1) === 0 ? 0 : bisect(data1, x0, 1) - 1;
              var j: any;
              if (yVar2 !== "") {
                j = bisect(data2, x0, 1) === 0 ? 0 : bisect(data2, x0, 1) - 1;
              }
              const selectedData1: any = data1[i];
              // console.log(x0, i, data1, selectedData1);
              var selectedData2: any;
              if (yVar2 !== "") {
                selectedData2 = data2[j];
              }

              selectedData1.circle = 1;
              if (yVar2 !== "") {
                selectedData2.circle = 1;
              }

              if (props.focusVar === yVar) {
                // console.log(formatDate(selectedData1.date));
                props.addKeyPoints(
                  formatDate(selectedData1.date),
                  yVar,
                  selectedData1.value
                );
              } else {
                props.addKeyPoints(
                  formatDate(selectedData2.date),
                  yVar2,
                  selectedData2.value
                );
              }
            });

          function formatDate(d: any) {
            return d.toISOString().slice(0, 10);
            // var arr = d.split("-");
            // console.log(d.toISOString().slice(0, 10));

            // var month = "" + d.getUTCMonth(),
            //   day = "" + d.getUTCDate(),
            //   year = d.getUTCFullYear();

            // if (month.length < 2) month = "0" + month;
            // if (day.length < 2) day = "0" + day;

            // return [year, month, day].join("-");
          }

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
          // console.log(data1, data2, props.keyPoints);
          // Adding data Key points circle
          var circles1 = svg
            .selectAll(".myDot1")
            .data(data1)
            .join("circle")
            .attr("clip-path", "urzl(#clip)")
            .attr("r", function (d: any) {
              return d.circle === 1 ? "5" : d.highlight ? "5" : "0";
            })
            .attr("opacity", 1)
            .style("fill", function (d: any) {
              return d.circle === 1 ? "green" : d.highlight ? "green" : "";
            })
            .style("stroke", "black")
            .style("stroke-width", "0.2")
            .attr("cx", function (d: any) {
              return x(d.date);
            })
            .attr("cy", function (d: any) {
              return y0(d.value);
            })
            .on("mouseover", function () {
              d3.select(this).style("fill", "yellow");
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
                (d3.select(this) as any)._groups[0][0]["__data__"]["circle"] ===
                  1
                  ? "green"
                  : "green"
              );
              tooltip.transition().duration(500);
              tooltip.style("visibility", "hidden");
            })
            .on("mousemove", function (event: any) {
              tooltip
                .style("top", event.pageY - 10 + "px")
                .style("left", event.pageX + 10 + "px");
            });

          var circles2: any;
          if (yVar2 !== "") {
            circles2 = svg
              .selectAll(".myDot2")
              .data(data2)
              .join("circle")
              .attr("clip-path", "urzl(#clip)")
              .attr("r", function (d: any) {
                return d.circle === 1 ? "5" : d.highlight ? "5" : "0";
              })
              .attr("opacity", 1)
              .style("fill", function (d: any) {
                return d.circle === 1 ? "green" : d.highlight ? "green" : "";
              })
              .style("stroke", "black")
              .style("stroke-width", "0.2")
              .attr("cx", function (d: any) {
                return x(d.date);
              })
              .attr("cy", function (d: any) {
                return y1(d.value);
              })
              .on("mouseover", function () {
                d3.select(this).style("fill", "yellow");
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
                  (d3.select(this) as any)._groups[0][0]["__data__"][
                    "circle"
                  ] === 1
                    ? "green"
                    : "green"
                );
                tooltip.transition().duration(500);
                tooltip.style("visibility", "hidden");
              })
              .on("mousemove", function (event: any) {
                tooltip
                  .style("top", event.pageY - 10 + "px")
                  .style("left", event.pageX + 10 + "px");
              });
          }

          svg.call(zoom);

          function zoom() {
            const extent: any = [
              [padding.l, padding.t],
              [chartWidth - padding.r, chartHeight - padding.t],
            ];

            const zooming: any = d3
              .zoom()
              .scaleExtent([1, 8])
              .translateExtent(extent)
              .extent(extent)
              .on("zoom", zoomed);

            svg.call(zooming);

            function zoomed(event: any) {
              x.range(
                [padding.l, chartWidth - padding.r].map((d) =>
                  event.transform.applyX(d)
                )
              );

              svg.select(".path").attr("d", line1);
              if (yVar2 !== "") {
                svg.select(".path1").attr("d", line2);
              }
              circles1.remove();
              circles1 = svg
                .selectAll(".myDot1")
                .data(data1)
                .join("circle")
                .attr("clip-path", "url(#clip)")
                .attr("r", function (d: any) {
                  return d.circle === 1 ? "5" : d.highlight ? "5" : "0";
                })
                .attr("opacity", 1)
                .style("fill", function (d: any) {
                  return d.circle === 1 ? "green" : d.highlight ? "green" : "";
                })
                .style("stroke", "black")
                .style("stroke-width", "0.2")
                .attr("cx", function (d: any) {
                  return x(d.date);
                })
                .attr("cy", function (d: any) {
                  return y0(d.value);
                })
                .on("mouseover", function () {
                  d3.select(this).style("fill", "yellow");
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
                    (d3.select(this) as any)._groups[0][0]["__data__"][
                      "circle"
                    ] === 1
                      ? "green"
                      : "green"
                  );
                  tooltip.transition().duration(500);
                  tooltip.style("visibility", "hidden");
                })
                .on("mousemove", function (event: any) {
                  tooltip
                    .style("top", event.pageY - 10 + "px")
                    .style("left", event.pageX + 10 + "px");
                });

              if (yVar2 !== "") {
                circles2.remove();
                circles2 = svg
                  .selectAll(".myDot2")
                  .data(data2)
                  .join("circle")
                  .attr("clip-path", "url(#clip)")
                  .attr("r", function (d: any) {
                    return d.circle === 1 ? "5" : d.highlight ? "5" : "0";
                  })
                  .attr("opacity", 1)
                  .style("fill", function (d: any) {
                    return d.circle === 1
                      ? "green"
                      : d.highlight
                      ? "green"
                      : "";
                  })
                  .style("stroke", "black")
                  .style("stroke-width", "0.2")
                  .attr("cx", function (d: any) {
                    return x(d.date);
                  })
                  .attr("cy", function (d: any) {
                    return y1(d.value);
                  })
                  .on("mouseover", function () {
                    d3.select(this).style("fill", "yellow");
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
                      (d3.select(this) as any)._groups[0][0]["__data__"][
                        "circle"
                      ] === 1
                        ? "green"
                        : "green"
                    );
                    tooltip.transition().duration(500);
                    tooltip.style("visibility", "hidden");
                  })
                  .on("mousemove", function (event: any) {
                    tooltip
                      .style("top", event.pageY - 10 + "px")
                      .style("left", event.pageX + 10 + "px");
                  });
              }
              svg.select(".x-axis").call(d3.axisBottom(x) as any);
            }
          }
        },
      });
    }
  });
  return (
    <div id="d3ChartId">
      <svg
        style={{
          width: "98%",
          height: "600px",
          overflowY: "unset",
          overflowX: "hidden",
        }}
        ref={d3Chart}
      ></svg>
    </div>
  );
};

export default LineChart;
