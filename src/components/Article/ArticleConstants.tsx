import { Dispatch, SetStateAction } from "react";
import "@fontsource/playfair-display";

import TextSection from "./TextSection";
import Chart from "./Chart";

import { KeyPointType } from "./ArticleTypes";

export const textsx: object = { fontFamily: "Playfair Display" };

export const validateAndSetColor = (
	color: string,
	setColor: Dispatch<SetStateAction<string>>
) => {
	if (color.length !== 7 || !color.startsWith("#")) {
		return false;
	}

	setColor(color);
	return true;
};

const exampleTextHeader: string = "Example Text";
const exampleText: string[] = [
	"Lorem ipsum dolor sit amet, consectetur adipiscing.",
	"Ut enim ad minim veniam, quis nostrud exercitation.",
	"Excepteur sint occaecat cupidatat non proident.",
];

const exampleKeyPoints: KeyPointType[] = [
	{
		time: "2022-11-16",
		points: [
			{
				analysis_yielded: exampleText[0],
				variable: "Cases",
				point_value: 95000,
			},
			{
				analysis_yielded: exampleText[0],
				variable: "Deaths",
				point_value: 9500,
			},
		],
	},
	{
		time: "2022-11-21",
		points: [
			{
				analysis_yielded: exampleText[1],
				variable: "Cases",
				point_value: 100000,
			},
			{
				analysis_yielded: exampleText[1],
				variable: "Deaths",
				point_value: 10000,
			},
		],
	},
	{
		time: "2022-11-26",
		points: [
			{
				analysis_yielded: exampleText[2],
				variable: "Cases",
				point_value: 95000,
			},
			{
				analysis_yielded: exampleText[2],
				variable: "Deaths",
				point_value: 9500,
			},
		],
	},
];

const examplePoints: object[] = [
	{
		Date: "2022-11-11",
		Cases: 90000,
		Deaths: 9000,
	},
	{
		Date: "2022-11-16",
		Cases: 95000,
		Deaths: 9500,
	},
	{
		Date: "2022-11-21",
		Cases: 100000,
		Deaths: 10000,
	},
	{
		Date: "2022-11-26",
		Cases: 95000,
		Deaths: 9500,
	},
	{
		Date: "2022-12-01",
		Cases: 102000,
		Deaths: 10500,
	},
];

interface ExampleTextProps {
	primaryPointColor: string;
}
export const ExampleText = (props: ExampleTextProps) => (
	<TextSection
		startDate={new Date("2022-11-11")}
		endDate={new Date("2022-12-01")}
		focusDate={new Date("2022-11-21")}
		primaryPointColor={props.primaryPointColor}
		header={exampleTextHeader}
		keyPoints={exampleKeyPoints}
		x={"Date"}
	/>
);

interface ExampleChartProps {
	color: string;
	primaryPointColor: string;
	secondaryPointColor: string;
	lineColor: string;
	secondLineColor: string;
	bivariate?: boolean;
}
export const ExampleChart = (props: ExampleChartProps) => (
	<Chart
		startDate={new Date("2022-11-11")}
		endDate={new Date("2022-12-01")}
		focusDate={new Date("2022-11-21")}
		// @ts-ignore TS2741
		data={examplePoints}
		keyPoints={exampleKeyPoints}
		axisLabelColor={props.color}
		primaryPointColor={props.primaryPointColor}
		secondaryPointColor={props.secondaryPointColor}
		lineColor={props.lineColor}
		secondLineColor={props.secondLineColor}
		width={props.bivariate ? 400 : 500}
		height={250}
		ylabel={"Cases (in thousands)"}
		ycoef={1 / 1000}
		x={"Date"}
		y1={"Cases"}
		y2={props.bivariate ? "Deaths" : ""}
		ylabel2={"Deaths (in thousands)"}
		ycoef2={1 / 1000}
	/>
);
