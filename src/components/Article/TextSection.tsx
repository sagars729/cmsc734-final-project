import Typography from '@mui/material/Typography';
import {PointType, TextSectionProps} from './ArticleTypes';
import {textsx} from './ArticleConstants';

const TextSection = (props: TextSectionProps) => {
  const dateFilter = (point: any) => {
      const candDate: number = (new Date(point.Date).getTime())
        || (new Date(point.time).getTime())
        || 0;
      
      return candDate >= props.startDate.getTime() &&
             candDate <= props.endDate.getTime();
  }

  return (
    <>
      <Typography variant="h4" gutterBottom align="left" sx={textsx}>
        {props.header}
      </Typography>

      {props.keyPoints.filter(dateFilter).map((keyPoint) => (
        <>
        {keyPoint.points.map((point) => ( 
          <Typography variant="body1" gutterBottom align="left" sx={textsx}>
            {point.analysis_yielded}
          </Typography>
        ))}
        </>
      ))} 
    </>
  );
}

export default TextSection
