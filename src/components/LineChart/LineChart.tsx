import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Papa from "papaparse";
import "./LineChart.css";

const LineChart = (props: any) => {
  const d3Chart = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (props.csv) {
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
          console.log(props.variable);
          if (props.variable) {
            xVar = props.variable[0];
            yVar = props.variable[1];
            if (props.variable.length > 2) {
              yVar2 = props.variable[2];
            }
          }

          // const applyZoomAndFocusOn: any = props.variable == "Cases" ? 0 : 1;
          data.forEach(function (d: any, i: any) {
            const index = props.keyPoints.findIndex(
              (x: any) => x.time === d[xVar]
            );
            const calcdate = d3.timeParse("%Y-%m-%d")(d[xVar]);
            data1.push({
              circle:
                index != -1 &&
                props.keyPoints[index].points[0]["variable"] == yVar
                  ? 1
                  : 0,
              date: calcdate,
              tooltip:
                index != -1 &&
                props.keyPoints[index].points[0]["variable"] == yVar
                  ? props.keyPoints[index].points[0]["analysis_yielded"]
                  : "",
              value: d[yVar],
            });
            if (yVar2 != "") {
              data2.push({
                circle:
                  index != -1 &&
                  props.keyPoints[index].points[0]["variable"] == yVar2
                    ? 1
                    : 0,
                date: calcdate,
                tooltip:
                  index != -1 &&
                  props.keyPoints[index].points[0]["variable"] == yVar2
                    ? props.keyPoints[index].points[0]["analysis_yielded"]
                    : "",
                value: d[yVar2],
              });
            }
          });

          console.log(data1, data2);
          if (props.isLoadedInt == 1) {
            console.log("set points data");
            props.setIsLoadedInt(2);
            props.setPointsData(data);
          }

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
              d3.extent(data1, function (d: any) {
                return d.date;
              }) as [any, any]
            )
            .range([0, chartWidth]);

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
          const xAxis = svg
            .append("g")
            .attr("class", "x-axis")
            .attr("transform", "translate(" + [0, chartHeight] + ")")
            .call(d3.axisBottom(x));

          const yAxisLeft = svg
            .append("g")
            .attr("class", "y-axis1")
            .attr("transform", "translate(25,0)")
            .call(d3.axisRight(y0));
          var yAxisRight: any;
          if (yVar2 != "") {
            yAxisRight = svg
              .append("g")
              .attr("class", "y-axis2")
              .attr("transform", "translate(" + chartWidth + ",0)")
              .call(d3.axisRight(y1));
          }
          // Adding titles
          svg
            .append("text")
            .attr("class", "title")
            .attr("font-family", "cursive")
            .attr("transform", "translate(" + chartWidth / 4 + "," + 15 + ")")
            .text(props.general.title);

          const line1: any = d3
            .line()
            .defined((d: any) => !isNaN(d.value))
            .x((d: any) => x(d.date))
            .y((d: any) => y0(d.value));
          var line2: any;
          if (yVar2 != "") {
            line2 = d3
              .line()
              .defined((d: any) => !isNaN(d.value))
              .x((d: any) => x(d.date))
              .y((d: any) => y1(d.value));
          }

          const defs = svg
            .append("defs")
            .append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", padding.l)
            .attr("width", chartWidth - padding.r)
            .attr("height", chartHeight);

          var path = svg
            .append("path")
            .datum(data1)
            .attr("class", "path")
            .attr("fill", "none")
            .attr("clip-path", "url(#clip)")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", line1);
          if (yVar2 != "") {
            svg
              .append("path")
              .datum(data2)
              .attr("class", "path1")
              .attr("fill", "none")
              .attr("clip-path", "url(#clip)")
              .attr("stroke", "green")
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
            .style("fill", "pink")
            .style("z-index", "100")
            .attr("stroke", "black")
            .attr("r", 4)
            .style("opacity", 0);
          var focus2: any;
          if (yVar2 != "") {
            focus2 = svg
              .append("g")
              .append("circle")
              .style("fill", "pink")
              .style("z-index", "100")
              .attr("stroke", "black")
              .attr("r", 4)
              .style("opacity", 0);
          }

          // // Create the text that travels along the curve of chart
          const focusText = svg
            .append("text")
            .style("opacity", 0)
            .style("z-index", "200")
            .style("background-color", "black")
            .style("font-size", "13px")
            .style("color", "#fff")
            .attr("text-anchor", "left")
            .attr("alignment-baseline", "middle");

          // // Create a rect on top of the svg area: this rectangle recovers mouse position
          svg
            .append("rect")
            .style("fill", "none")
            .attr("class", "path2")
            .attr("clip-path", "url(#clip)")
            .style("pointer-events", "all")
            .attr("width", width)
            .attr("height", height)
            .on("mouseover", function () {
              focus1.style("opacity", 1);
              if (yVar2 != "") {
                focus2.style("opacity", 1);
              }
              focusText.style("opacity", 1);
            })
            .on("mousemove", function (event) {
              console.log(event, this);
              // var selectthegraphs = $(".").not(this); //select all the rest of the lines, except the one you are hovering on and drop their opacity
              // d3.selectAll(":not(.").style("opacity", 0.2);
              // d3.selectAll(".path1") // Fade the non-selected names in the legend
              //   .style("opacity", 0.2);
              // recover coordinate we need
              const x0 = x.invert(d3.pointer(event)[0]);
              const i = bisect(data1, x0, 1);
              var j: any;
              if (yVar2 != "") {
                j = bisect(data2, x0, 1);
              }
              const selectedData1: any = data1[i];
              var selectedData2: any;
              if (yVar2 != "") {
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
              var text2 = "";

              if (yVar2 != "") {
                text2 = yVar2 + ": " + selectedData2.value;
              }
              var text1 =
                "Date:" +
                (selectedData1.date as Date).getMonth() +
                "/" +
                (selectedData1.date as Date).getFullYear() +
                " <br />" +
                yVar +
                ": " +
                selectedData1.value +
                "<br />" +
                text2 +
                "";
              focusText
                .html(text1)
                .attr("x", x(selectedData1.date) + 15)
                .attr("y", y0(selectedData1.value));
            })
            .on("mouseout", function () {
              focus1.style("opacity", 0);
              if (yVar2 != "") {
                focus2.style("opacity", 0);
              }
              focusText.style("opacity", 0);
              // d3.selectAll(".path1") // Fade the non-selected names in the legend
              //   .style("opacity", 1);
            })
            .on("click", function (event) {
              const x0 = x.invert(d3.pointer(event)[0]);
              const i = bisect(data1, x0, 1);
              var j: any;
              if (yVar2 != "") {
                j = bisect(data2, x0, 1);
              }
              const selectedData1: any = data1[i];
              var selectedData2: any;
              if (yVar2 != "") {
                selectedData2 = data2[j];
              }

              selectedData1.circle = 1;
              if (yVar2 != "") {
                selectedData2.circle = 1;
              }

              // TODO: for Harsh - auto scroll to the point on the left side when point is clicked on the graph
              props.addKeyPoints(
                formatDate(selectedData1.date),
                yVar,
                selectedData1.value
              );
              if (yVar2 != "") {
                props.addKeyPoints(
                  formatDate(selectedData2.date),
                  yVar2,
                  selectedData2.value
                );
              }
            });

          function formatDate(d: Date) {
            var month = "" + (d.getMonth() + 1),
              day = "" + d.getDate(),
              year = d.getFullYear();

            if (month.length < 2) month = "0" + month;
            if (day.length < 2) day = "0" + day;

            return [year, month, day].join("-");
          }

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

          // // Adding data Key points circle
          // var circles = svg
          //   .selectAll(".myDot")
          //   .data(applyZoomAndFocusOn == 0 ? data1 : data2)
          //   .join("circle")
          //   .attr("clip-path", "urzl(#clip)")
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
          //     return x(d.date);
          //   })
          //   .attr("cy", function (d: any) {
          //     return applyZoomAndFocusOn == 0 ? y0(d.value) : y1(d.value);
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
              if (yVar2 != "") {
                svg.select(".path1").attr("d", line2);
              }
              // circles.remove();
              // circles = svg
              //   .selectAll(".myDot")
              //   .data(applyZoomAndFocusOn == 0 ? data1 : data2)
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
              //     return x(d.date);
              //   })
              //   .attr("cy", function (d: any) {
              //     return applyZoomAndFocusOn == 0 ? y0(d.value) : y1(d.value);
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
              //       (d3.select(this) as any)._groups[0][0]["__data__"][
              //         "circle"
              //       ] == 1
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
          width: "100%",
          height: "620px",
        }}
        ref={d3Chart}
      ></svg>
    </div>
  );
};

export default LineChart;
