import * as d3 from "d3";
import React, { useEffect, RefObject } from "react";
import { ChartProps } from "./ArticleTypes";

const Chart = (props: ChartProps) => {
	const ref: RefObject<HTMLDivElement> = React.createRef();
	const dateFilter = (point: any) => {
		const candDate: number =
			// @ts-ignore TS7015
			new Date(point[props.x]).getTime() ||
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

		// xscale + axis label
		const xScale = d3
			.scaleTime()
			.domain(
				d3.extent(
					data,
					// @ts-ignore TS2352
					(d) => new Date(d[props.x])
				) as [Date, Date]
			)
			.range([loff, width + loff]);

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

		const addYScale = (
			y: string,
			ycoef: number,
			ylabel: string,
			left: boolean
		) => {
			const yScale = d3
				.scaleLinear()
				.domain(
					d3.extent(
						data,
						// @ts-ignore TS2352
						(d) => parseInt(d[y]) * ycoef
					) as [number, number]
				)
				.range([height + toff, toff]);

			const translateAxis: string = `translate(${
				left ? loff : loff + width
			}, ${toff})`;
			const d3axis = left ? d3.axisLeft : d3.axisRight;
			svg.append("g")
				.attr("transform", translateAxis)
				.attr("class", "chartAxis")
				.attr("stroke", props.axisLabelColor)
				.call(d3axis(yScale));

			const translateText: string = `translate(${
				left ? loff - textOff : loff + width + textOff
			}, ${
				left
					? height / 2 - textOff + toff
					: height / 2 + toff
			}) rotate(270)`;
			svg.append("text")
				.attr("transform", translateText)
				.attr("class", "y label")
				.attr("text-anchor", "end")
				.attr("fill", props.axisLabelColor)
				.text(ylabel);

			return yScale;
		};

		const addPath = (
			y: string,
			ycoef: number,
			yScale: any,
			color: string
		) => {
			svg.append("path")
				.datum(data)
				.attr("fill", "none")
				.attr("stroke", color)
				.attr("stroke-width", 1.5)
				.attr(
					"d",
					// @ts-ignore TS2345
					d3
						.line()
						.x((d) =>
							xScale(
								new Date(
									d[
										// @ts-ignore TS7015
										props.x
									]
								)
							)
						)
						.y((d) =>
							yScale(
								// @ts-ignore TS7015
								d[y] * ycoef
							)
						)
				);
		};

		const addCircle = (
			time: string,
			point_value: number,
			ycoef: number,
			yScale: any,
			r: number,
			color: string
		) => {
			svg.append("circle")
				.attr("cx", xScale(new Date(time)))
				.attr("cy", yScale(point_value * ycoef))
				.attr("r", r)
				.attr("fill", color);
		};

		const addKeyPoints = (
			y: string,
			ycoef: number,
			yScale: any
		) => {
			props.keyPoints
				// @ts-ignore TS2769
				.filter(dateFilter)
				.forEach((point) =>
					point.points.forEach((p) => {
						if (p.variable === y) {
							addCircle(
								point.time,
								p.point_value,
								ycoef,
								yScale,
								3,
								props.secondaryPointColor
							);
						}
					})
				);

			if (props.focusDate) {
				props.keyPoints
					.filter(
						(keyPoint) =>
							new Date(
								keyPoint.time
							).getTime() ===
							// @ts-ignore TS2532
							props.focusDate.getTime()
					)
					.forEach((point) =>
						point.points.forEach((p) => {
							point.points.forEach(
								(p) => {
									if (
										p.variable ===
										y
									) {
										addCircle(
											point.time,
											p.point_value,
											ycoef,
											yScale,
											5,
											props.primaryPointColor
										);
									}
								}
							);
						})
					);
			}
		};

		const yScale = addYScale(
			props.y1,
			props.ycoef,
			props.ylabel,
			true
		);
		addPath(props.y1, props.ycoef, yScale, props.lineColor);
		addKeyPoints(props.y1, props.ycoef, yScale);

		if (props.y2) {
			const yScale2 = addYScale(
				props.y2 || "",
				props.ycoef2 || 1,
				props.ylabel2 || "",
				false
			);
			addPath(
				props.y2 || "",
				props.ycoef2 || 1,
				yScale2,
				props.secondLineColor
			);
			addKeyPoints(
				props.y2 || "",
				props.ycoef2 || 1,
				yScale2
			);
		}
	};

	return <div ref={ref}></div>;
};

export default Chart;
