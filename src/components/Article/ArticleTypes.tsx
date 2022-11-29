import { DSVRowArray } from "d3-dsv";
import { Dispatch, SetStateAction } from "react";

// Data Types
export interface PointType {
	analysis_yielded: string;
	variable: string;
	point_value: number;
	[otherOptions: string]: unknown;
}

export interface KeyPointType {
	time: string;
	points: PointType[];
}

export interface SectionType {
	startDate: Date;
	endDate: Date;
	header: string;
	keyTimes: Date[];
}

// Props Types
export interface ArticleContainerProps {
	data: DSVRowArray;
	keyPoints: KeyPointType[];
	setRenderArticle: Dispatch<SetStateAction<boolean>>;
}

export interface ArticleProps {
	data: DSVRowArray;
	keyPoints: KeyPointType[];
	sections: SectionType[];
	title: string;
	byline: string;
	date: string;
	axisLabelColor: string;
	primaryPointColor: string;
	secondaryPointColor: string;
	lineColor: string;
	xlabel: string;
	ylabel: string;
	ycoef: number;
}

export interface TextSectionProps {
	header: string;
	startDate: Date;
	endDate: Date;
	focusDate?: Date;
	keyPoints: KeyPointType[];
}

export interface ChartSectionProps {
	time: string;
	timeWindow: number;
	points: PointType[];
	data: DSVRowArray;
	allPoints: KeyPointType[];
	axisLabelColor: string;
	primaryPointColor: string;
	secondaryPointColor: string;
	lineColor: string;
}

export interface ChartProps {
	startDate: Date;
	endDate: Date;
	data: DSVRowArray;
	keyPoints: KeyPointType[];
	width?: number;
	height?: number;
	axisLabelColor: string;
	primaryPointColor: string;
	secondaryPointColor: string;
	lineColor: string;
	setBrushStartDate?: Dispatch<SetStateAction<Date | null>>;
	setBrushEndDate?: Dispatch<SetStateAction<Date | null>>;
	enableBrush?: boolean;
	focusDate?: Date;
	xlabel: string;
	ylabel: string;
	ycoef: number;
}

export interface BuilderProps {
	// states
	title: string;
	byline: string;
	date: string;
	color: string;
	backgroundColor: string;
	primaryPointColor: string;
	secondaryPointColor: string;
	lineColor: string;
	xlabel: string;
	ylabel: string;
	ycoef: number;
	// setters
	setColor: Dispatch<SetStateAction<string>>;
	setBackgroundColor: Dispatch<SetStateAction<string>>;
	setPrimaryPointColor: Dispatch<SetStateAction<string>>;
	setSecondaryPointColor: Dispatch<SetStateAction<string>>;
	setLineColor: Dispatch<SetStateAction<string>>;
}

export interface ColorPickerProps {
	// states
	color: string;
	label: string;
	// setters
	setColor: Dispatch<SetStateAction<string>>;
}

export interface NavButtonsProps {
	// states
	color: string;
	backgroundColor: string;
	showBuilder: boolean;
	showSectionBuilder: boolean;
	sections: SectionType[];
	// variable setters
	setTitle: Dispatch<SetStateAction<string>>;
	setByline: Dispatch<SetStateAction<string>>;
	setDate: Dispatch<SetStateAction<string>>;
	setSections: Dispatch<SetStateAction<SectionType[]>>;
	setXlabel: Dispatch<SetStateAction<string>>;
	setYlabel: Dispatch<SetStateAction<string>>;
	setYcoef: Dispatch<SetStateAction<number>>;
	// navigation setters
	setShowBuilder: Dispatch<SetStateAction<boolean>>;
	setShowSectionBuilder: Dispatch<SetStateAction<boolean>>;
	setRenderArticle: Dispatch<SetStateAction<boolean>>;
}

export interface NavButtonProps {
	color: string;
	backgroundColor: string;
	label: string;
	onClick: () => void;
}

export interface SectionBuilderProps {
	data: DSVRowArray;
	keyPoints: KeyPointType[];
	color: string;
	backgroundColor: string;
	axisLabelColor: string;
	primaryPointColor: string;
	secondaryPointColor: string;
	lineColor: string;
	sections: SectionType[];
	setSections: Dispatch<SetStateAction<SectionType[]>>;
	xlabel: string;
	ylabel: string;
	ycoef: number;
}
