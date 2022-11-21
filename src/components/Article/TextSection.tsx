import Typography from '@mui/material/Typography';
import {PointType, TextSectionProps} from './ArticleTypes';
import {textsx} from './ArticleConstants';

const TextSection = (props: TextSectionProps) => {
  return (
    <>
      <Typography variant="h4" gutterBottom align="left" sx={textsx}>
        {props.time}
      </Typography>
      {props.points.map((point) => 
        <Typography variant="body1" gutterBottom align="left" sx={textsx}>
          {point.analysis_yielded}
        </Typography>
      )} 
    </>
  );
}

export default TextSection
