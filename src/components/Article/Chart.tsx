import * as d3 from "d3";
import React, { useState, useEffect, RefObject } from "react";
import { PointType, KeyPointType, ChartProps } from "./ArticleTypes";

const Chart = (props: ChartProps) => {
	const ref: RefObject<HTMLDivElement> = React.createRef();
	const dateFilter = (point: any) => {
		const candDate: number =
			new Date(point.Date).getTime() ||
			new Date(point.time).getTime() ||
			0;

		return (
			candDate >= props.startDate.getTime() &&
			candDate <= props.endDate.getTime()
		);
	};

	useEffect(() => draw());
	const draw = () => {
		const width: number = props.width || 500;
		const height: number = props.height || 250;
		const loff: number = 75;
		const roff: number = 75;
		const boff: number = 50;
		const toff: number = 10;
		const textOff: number = 40;

		// @ts-ignore TS2769
		const data = props.data.filter(dateFilter);

		d3.select(ref.current).selectAll("svg").remove();

		const svg = d3
			.select(ref.current)
			.append("svg")
			.attr("width", width + loff + roff)
			.attr("height", height + boff + toff);

		const xScale = d3
			.scaleTime()
			.domain(
			  // @ts-ignore TS2352
				d3.extent(data, (d) => new Date(d.Date)) as [
					Date,
					Date
				]
			)
			.range([loff, width + loff]);

		const yScale = d3
			.scaleLinear()
			.domain(
				d3.extent(
					data,
			    // @ts-ignore TS2352
					(d) => parseInt(d.Cases) * props.ycoef
				) as [number, number]
			)
			.range([height + toff, toff]);

		var brushStartDate: Date | null = null;
		var brushEndDate: Date | null = null;

		if (props.enableBrush) {
			const brushmove = (event: { selection: number[] }) => {
				brushStartDate = xScale.invert(
					event.selection[0]
				);
				brushEndDate = xScale.invert(
					event.selection[1]
				);
			};
			const brushend = () => {
				if (
					props.setBrushStartDate &&
					props.setBrushEndDate
				) {
					props.setBrushStartDate(brushStartDate);
					props.setBrushEndDate(brushEndDate);
				}
			};

			const brush = d3
				.brushX()
				.extent([
					[loff, 1],
					[width + loff, height + toff + 9],
				])
				.on("brush", brushmove)
				.on("end", brushend);
			// @ts-ignore TS2345
			svg.call(brush);
		}

		svg.append("g")
			.attr(
				"transform",
				`translate(0, ${height + toff + 10})`
			)
			.attr("class", "chartAxis")
			.attr("stroke", props.axisLabelColor)
			.call(d3.axisBottom(xScale));

		svg.append("text")
			.attr("class", "x label")
			.attr("text-anchor", "end")
			.attr("x", width / 2 + loff)
			.attr("y", height + toff + textOff)
			.attr("fill", props.axisLabelColor)
			.text(props.xlabel);

		svg.append("g")
			.attr("transform", `translate(${loff}, ${toff})`)
			.attr("class", "chartAxis")
			.attr("stroke", props.axisLabelColor)
			.call(d3.axisLeft(yScale));

		svg.append("text")
			.attr(
				"transform",
				`translate(${loff - textOff}, ${
					height / 2 - textOff + toff
				}) rotate(270)`
			)
			.attr("class", "y label")
			.attr("text-anchor", "end")
			.attr("fill", props.axisLabelColor)
			.text(props.ylabel);

		svg.append("path")
			.datum(data)
			.attr("fill", "none")
			.attr("stroke", props.lineColor)
			.attr("stroke-width", 1.5)
			.attr(
				"d",
			  // @ts-ignore TS2345
				d3
					.line()
					.x((d) =>
						xScale(
							new Date(
								(
									d as unknown as {
										Date: number;
									}
								).Date
							)
						)
					)
					.y((d) =>
						yScale(
							(
								d as unknown as {
									Cases: number;
								}
							).Cases * props.ycoef
						)
					)
			);

		props.keyPoints
			// @ts-ignore TS2769
			.filter(dateFilter)
			.forEach((point) =>
				point.points.forEach((p) => {
					const circle = svg
						.append("circle")
						.attr(
							"cx",
							xScale(
								new Date(
									point.time
								)
							)
						)
						.attr(
							"cy",
							yScale(
								p.point_value *
									props.ycoef
							)
						)
						.attr("r", 3)
						.attr(
							"fill",
							props.secondaryPointColor
						);
				})
			);

		if (props.focusDate) {
			props.keyPoints
				.filter(
					(keyPoint) =>
						new Date(
							keyPoint.time
						).getTime() ==
				    // @ts-ignore TS2532
						props.focusDate.getTime()
				)
				.forEach((point) =>
					point.points.forEach((p) => {
						const circle = svg
							.append("circle")
							.attr(
								"cx",
								xScale(
									new Date(
										point.time
									)
								)
							)
							.attr(
								"cy",
								yScale(
									p.point_value *
										props.ycoef
								)
							)
							.attr("r", 3)
							.attr(
								"fill",
								props.primaryPointColor
							);
					})
				);
		}
	};

	return <div ref={ref}></div>;
};

export default Chart;
