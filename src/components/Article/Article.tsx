import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import TextSection from './TextSection';
import Chart from './Chart';

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
        {props.sections.map((section) => (
          <>
            <Grid xs={6}>
              <TextSection
                header={section.header}
                startDate={section.startDate}
                endDate={section.endDate}
                keyPoints={props.keyPoints}
              /> 
            </Grid>
            <Grid xs={6} justifyContent="center" alignItems="center">
              <Chart
                startDate={section.startDate}
                endDate={section.endDate}
                data={props.data}
                keyPoints={props.keyPoints}
                axisLabelColor={props.axisLabelColor}
                primaryPointColor={props.primaryPointColor}
                secondaryPointColor={props.secondaryPointColor}
                lineColor={props.lineColor}
                width={500}
                height={250}
              />
            </Grid>
          </>
        ))}
      </Grid>
    </div>
  )

}

export default Article;
