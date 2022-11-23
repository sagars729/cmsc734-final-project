import {Dispatch, SetStateAction} from 'react';
import Typography from '@mui/material/Typography';
import "@fontsource/playfair-display"

import TextSection from './TextSection';
import Chart from './Chart';

import {KeyPointType} from './ArticleTypes';


export const textsx: object = {fontFamily: "Playfair Display"}

export const validateAndSetColor = 
  (color: string, setColor: Dispatch<SetStateAction<string>>) =>
{    
  if (color.length != 7 || !color.startsWith('#')) {
    return false;
  }

  setColor(color);
  return true;
};

const exampleTextHeader: string = "Example Text"
const exampleText: string = `
  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
  eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
  enim ad minim veniam, quis nostrud exercitation ullamco laboris
  nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
  reprehenderit in voluptate velit esse cillum dolore eu fugiat
  nulla pariatur. Excepteur sint occaecat cupidatat non proident,
  sunt in culpa qui officia deserunt mollit anim id est laborum.
`

const exampleKeyPoints: KeyPointType[] = [
  {
    time: "2022-11-16",
    points: [{
      analysis_yielded: "",
      variable: 'Cases',
      point_value: 95000
    }]
  },
  {
    time: "2022-11-21",
    points: [{
      analysis_yielded: exampleText,
      variable: 'Cases',
      point_value: 100000
    }]
  },
  {
    time: "2022-11-26",
    points: [{
      analysis_yielded: "",
      variable: 'Cases',
      point_value: 95000
    }]
  },
]

const examplePoints: object[] = [
  {
    Date: "2022-11-11",
    Cases: 90000
  },
  {
    Date: "2022-11-16",
    Cases: 95000
  },
  {
    Date: "2022-11-21",
    Cases: 100000
  },
  {
    Date: "2022-11-26",
    Cases: 95000
  },
  {
    Date: "2022-12-01",
    Cases: 102000
  },
]

export const ExampleText = () => (
  <TextSection
    startDate={new Date("2022-11-11")}
    endDate={new Date("2022-12-01")}
    header={exampleTextHeader}
    keyPoints={exampleKeyPoints}
  />
);

interface ExampleChartProps {
  color: string;
  primaryPointColor: string;
  secondaryPointColor: string;
  lineColor: string;
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
    width={500}
    height={250}
  />
);
