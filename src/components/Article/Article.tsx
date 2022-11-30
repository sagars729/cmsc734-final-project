import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import React, { useState, useEffect } from "react";

import TextSection from "./TextSection";
import Chart from "./Chart";

import { ArticleProps } from "./ArticleTypes";
import { textsx } from "./ArticleConstants";

const Article = (props: ArticleProps) => {
	console.log("rendering");
	const [currentScene, setCurrentScene] = useState<number>(0);
	const [currentSubScene, setCurrentSubScene] = useState<number>(0);

	const section = props.sections[currentScene];

	const transition = (direction: number) => {
		const lowerBoundary: boolean =
			currentSubScene === 0 && direction === -1;
		const upperBoundary: boolean =
			currentSubScene === section.keyTimes.length - 1 &&
			direction === 1;
		if (lowerBoundary && currentScene === 0) {
			console.log("Hit Top");
		} else if (
			upperBoundary &&
			currentScene === props.sections.length - 1
		) {
			console.log("Hit Bottom");
		} else if (lowerBoundary || upperBoundary) {
			setCurrentSubScene(0);
			setCurrentScene(currentScene + direction);
		} else {
			setCurrentSubScene(currentSubScene + direction);
		}
	};

	useEffect(() => {
		const keyup = (e: any) => {
			if (e.code === "ArrowUp") transition(-1);
			else if (e.code === "ArrowDown") transition(1);
		};

		window.addEventListener("keyup", keyup);
		return () => window.removeEventListener("keyup", keyup);
	});

	// window.addEventListener('scroll', () => {
	//   if (window.scrollY === 0) {
	//     transition()
	//   } else if (window.scrollY < 0) {
	//     direction = -1
	//   } else {
	//     direction = 1
	//   }
	// });

	return (
		<div id="article" style={{ margin: "5%" }}>
			{/** Article Title **/}
			<Typography
				variant="h2"
				component="h1"
				gutterBottom
				align="center"
				sx={textsx}
			>
				{props.title}
			</Typography>

			{/** Article Byline and Publish Date **/}
			<Typography
				variant="subtitle1"
				gutterBottom
				align="center"
				sx={textsx}
			>
				{props.byline} | {props.date}
			</Typography>

			{/** Article Sections **/}
			<div
				id="scroll"
				onScroll={(event) => console.log("hello world")}
			>
				<Grid
					container
					spacing={2}
					sx={{ margin: "16px" }}
				>
					<>
						<Grid xs={6}>
							<TextSection
								header={
									section.header
								}
								startDate={
									section.startDate
								}
								endDate={
									section.endDate
								}
								focusDate={
									section
										.keyTimes[
										currentSubScene
									]
								}
								keyPoints={
									props.keyPoints
								}
							/>
						</Grid>
						<Grid
							xs={6}
							justifyContent="center"
							alignItems="center"
						>
							<Chart
								startDate={
									section.startDate
								}
								endDate={
									section.endDate
								}
								focusDate={
									section
										.keyTimes[
										currentSubScene
									]
								}
								data={
									props.data
								}
								keyPoints={
									props.keyPoints
								}
								axisLabelColor={
									props.axisLabelColor
								}
								primaryPointColor={
									props.primaryPointColor
								}
								secondaryPointColor={
									props.secondaryPointColor
								}
								lineColor={
									props.lineColor
								}
								width={500}
								height={250}
								xlabel={
									props.xlabel
								}
								ylabel={
									props.ylabel
								}
								ycoef={
									props.ycoef
								}
							/>
						</Grid>
					</>
				</Grid>
			</div>
		</div>
	);
};

export default Article;
