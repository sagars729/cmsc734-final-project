import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import TextSection from './TextSection';
import ChartSection from './ChartSection';

import {KeyPointType, ArticleProps} from './ArticleTypes';
import {textsx} from './ArticleConstants';


const Article = (props: ArticleProps) => {
  return (
    <div id="article" style={{margin:"5%"}}>
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
              <ChartSection
                time={keyPoint.time}
                timeWindow={30}
                points={keyPoint.points}
                data={props.data}
                allPoints={props.keyPoints}
                axisLabelColor={props.axisLabelColor}
                primaryPointColor={props.primaryPointColor}
                secondaryPointColor={props.secondaryPointColor}
                lineColor={props.lineColor}
              />
            </Grid>
          </>
        )}
      </Grid>
    </div>
  )

}

export default Article;
