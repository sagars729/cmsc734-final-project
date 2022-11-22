import {DSVRowArray} from 'd3-dsv';
import { Dispatch, SetStateAction } from 'react'

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

// Props Types
export interface ArticleContainerProps {
  data: DSVRowArray;
  keyPoints: KeyPointType[];
  setRenderArticle: Dispatch<SetStateAction<boolean>>;
}

export interface ArticleProps {
  data: DSVRowArray;
  keyPoints: KeyPointType[];
  title: string;
  byline: string;
  date: string;
  axisLabelColor: string;
  primaryPointColor: string;
  secondaryPointColor: string;
  lineColor: string;
}

export interface TextSectionProps {
  time: string;
  points: PointType[];
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
  // variable setters
  setTitle: Dispatch<SetStateAction<string>>;
  setByline: Dispatch<SetStateAction<string>>;
  setDate: Dispatch<SetStateAction<string>>;
  // navigation setters
  setShowBuilder: Dispatch<SetStateAction<boolean>>;
  setRenderArticle: Dispatch<SetStateAction<boolean>>;
}

export interface NavButtonProps {
  color: string;
  backgroundColor: string;
  label: string;
  onClick: () => void;
}
