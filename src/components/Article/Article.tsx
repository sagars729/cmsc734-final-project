import React, { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import {Box} from '@mui/system';
import "@fontsource/playfair-display"
import Grid from '@mui/material/Grid';
import TextSection from './TextSection';
import ChartSection from './ChartSection';
import {DSVRowArray} from 'd3-dsv';

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

interface ArticleProps {
  data: DSVRowArray;
  keyPoints: KeyPointType[];
  title: string;
  byline: string;
  date: string;
}

export const textsx: object = {fontFamily: "Playfair Display"}
export const boxsx: object = {
      backgroundColor: "#646f77",
      width: "100%",
      height: "100vh",
      color: "#e1e4e8",
      overflow: "auto"
    }

const Article = (props: ArticleProps) => {
  return (
    <Box sx={boxsx}>
      {/** Article Title **/}
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={textsx}>
         {props.title}
      </Typography> 

      {/** Article Byline and Publish Date **/}
      <Typography variant="subtitle1" gutterBottom align="center" sx={textsx}>
         {props.byline} | {props.date}
      </Typography>

      {/** Article Sections **/}
      <Grid container spacing={2} sx={{margin: "16px"}}>
        {props.keyPoints.map((keyPoint) => 
          <>
            <Grid xs={6}>
              <TextSection time={keyPoint.time} points={keyPoint.points} />
            </Grid>
            <Grid xs={6} justifyContent="center" alignItems="center">
              <ChartSection time={keyPoint.time} timeWindow={30} points={keyPoint.points} data={props.data} allPoints={props.keyPoints}/>
            </Grid>
          </>
        )}
      </Grid>
    </Box>     
  )

}

export default Article;
