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
  features: string[];
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
	secondLineColor: string;
	xlabel: string;
	ylabel: string;
	ycoef: number;
  ylabel2?: string;
  ycoef2?: number;
  features: string[];
}

export interface TextSectionProps {
	header: string;
	startDate: Date;
	endDate: Date;
	focusDate?: Date;
	keyPoints: KeyPointType[];
  x: string;
	primaryPointColor: string;
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
	secondLineColor: string;
	setBrushStartDate?: Dispatch<SetStateAction<Date | null>>;
	setBrushEndDate?: Dispatch<SetStateAction<Date | null>>;
	enableBrush?: boolean;
	focusDate?: Date;
	xlabel: string;
	ylabel: string;
	ycoef: number;
  ylabel2?: string;
  ycoef2?: number;
  x: string;
  y1: string;
  y2?: string;
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
	secondLineColor: string;
	xlabel: string;
	ylabel: string;
	ycoef: number;
  features: string[];
  bivariate?: boolean;
  ylabel2?: string;
  ycoef2?: number;
	// setters
	setColor: Dispatch<SetStateAction<string>>;
	setBackgroundColor: Dispatch<SetStateAction<string>>;
	setPrimaryPointColor: Dispatch<SetStateAction<string>>;
	setSecondaryPointColor: Dispatch<SetStateAction<string>>;
	setLineColor: Dispatch<SetStateAction<string>>;
	setSecondLineColor: Dispatch<SetStateAction<string>>;
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
  bivariate?: boolean;
	// variable setters
	setTitle: Dispatch<SetStateAction<string>>;
	setByline: Dispatch<SetStateAction<string>>;
	setDate: Dispatch<SetStateAction<string>>;
	setSections: Dispatch<SetStateAction<SectionType[]>>;
	setXlabel: Dispatch<SetStateAction<string>>;
	setYlabel: Dispatch<SetStateAction<string>>;
	setYcoef: Dispatch<SetStateAction<number>>;
  setYlabel2?: Dispatch<SetStateAction<string>>;
  setYcoef2?: Dispatch<SetStateAction<number>>;
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
	secondLineColor: string;
	sections: SectionType[];
	setSections: Dispatch<SetStateAction<SectionType[]>>;
	xlabel: string;
	ylabel: string;
	ycoef: number;
  ylabel2?: string;
  ycoef2?: number;
  features: string[];
}
