import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { Box } from "@mui/system";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

import Chart from "./Chart";

import { SectionBuilderProps } from "./ArticleTypes";
import { textsx } from "./ArticleConstants";

const SectionBuilder = (props: SectionBuilderProps) => {
	const [brushStartDate, setBrushStartDate] = useState<Date | null>(null);
	const [brushEndDate, setBrushEndDate] = useState<Date | null>(null);

	const builderSectionStyle: object = {
		width: "95%",
		border: `2px dashed ${props.color}`,
		backgroundColor: `${props.backgroundColor}`,
		padding: "1%",
		margin: "2%",
	};

	const CustomTextField = styled(TextField)({
		"& label.Mui-focused": {
			color: props.color,
		},
		"& .MuiInput-underline:before": {
			borderBottomColor: props.color,
		},
		"& .MuiInput-underline:after": {
			borderBottomColor: props.color,
		},
		"& .MuiInput-input": {
			color: props.color,
		},
		"& .MuiInputLabel-root": {
			color: props.color,
		},
	});

	const addSection = () => {
		if (brushStartDate && brushEndDate) {
			props.setSections(
				props.sections.concat([
					{
						startDate: brushStartDate,
						endDate: brushEndDate,
						header: "",
						keyTimes: props.keyPoints
							.filter((point) => {
								const candDate: Date =
									new Date(
										point.time
									);
								return (
									candDate >=
										brushStartDate &&
									candDate <=
										brushEndDate
								);
							})
							.map(
								(point) =>
									new Date(
										point.time
									)
							),
					},
				])
			);
		}
		setBrushStartDate(null);
		setBrushEndDate(null);
	};

	const popSection = () => {
		if (props.sections.length > 0) {
			props.setSections(
				props.sections.slice(
					0,
					props.sections.length - 1
				)
			);
		}
	};

	return (
		<div id="sectionBuilder" style={{ margin: "5%" }}>
			{/** Page Header **/}
			<Typography
				variant="h2"
				component="h1"
				gutterBottom
				align="center"
				sx={textsx}
			>
				Section Builder
			</Typography>
			<Typography
				variant="subtitle1"
				gutterBottom
				align="center"
				sx={textsx}
			>
				Group Story Points into Article Sections
			</Typography>

			<Box
				display="flex"
				alignItems="center"
				justifyContent="center"
				flexDirection="column"
			>
				<Chart
					// @ts-ignore TS2769
					startDate={new Date(props.data[0].Date)}
					endDate={
						new Date(
							// @ts-ignore TS2769
							props.data[
								props.data
									.length -
									1
							].Date
						)
					}
					data={props.data}
					keyPoints={props.keyPoints}
					axisLabelColor={props.axisLabelColor}
					primaryPointColor={
						props.primaryPointColor
					}
					secondaryPointColor={
						props.secondaryPointColor
					}
					lineColor={props.lineColor}
					width={1000}
					height={300}
					xlabel={props.xlabel}
					ylabel={props.ylabel}
					ycoef={props.ycoef}
					setBrushStartDate={setBrushStartDate}
					setBrushEndDate={setBrushEndDate}
					enableBrush
				/>
				{brushStartDate && brushEndDate ? (
					<p>
						Selected Area:{" "}
						{brushStartDate.toLocaleDateString(
							"en-US"
						)}
						-{" "}
						{brushEndDate.toLocaleDateString(
							"en-US"
						)}
					</p>
				) : (
					<></>
				)}
				<ButtonGroup
					variant="contained"
					aria-label="outlined primary button group"
				>
					<Button
						color="success"
						onClick={addSection}
					>
						Add Section
					</Button>
					<Button
						color="warning"
						onClick={popSection}
					>
						Pop Section
					</Button>
				</ButtonGroup>
			</Box>
			<Box sx={builderSectionStyle}>
				<p>
					Modify the section headers below. The
					annotations that you added previously
					will be displayed as parragraphs under
					these new headers. Select a chart area
					and click the "Add Section" button to
					create a new section. Click "Pop
					Section" to remove the last added
					section.
				</p>

				<Grid
					container
					spacing={2}
					sx={{ margin: "16px" }}
				>
					<Grid xs={3}> Start Date </Grid>
					<Grid xs={3}> End Date </Grid>
					<Grid xs={6}> Section Header </Grid>
					{props.sections.map((section, i) => (
						<>
							<Grid xs={3}>
								{" "}
								{section.startDate.toLocaleDateString(
									"en-US"
								)}{" "}
							</Grid>
							<Grid xs={3}>
								{" "}
								{section.endDate.toLocaleDateString(
									"en-US"
								)}{" "}
							</Grid>
							<Grid xs={6}>
								<CustomTextField
									id={`article-section-header-${i}`}
									label="Header"
									variant="standard"
									defaultValue={
										section.header
									}
								/>
							</Grid>
						</>
					))}
				</Grid>
			</Box>
		</div>
	);
};

export default SectionBuilder;
