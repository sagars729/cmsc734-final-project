import Typography from '@mui/material/Typography';
import {textsx, PointType} from './Article';

interface TextSectionProps {
  time: string;
  points: PointType[];
}

const TextSection = (props: TextSectionProps) => {
  return (
    <>
      <Typography variant="h3" gutterBottom align="left" sx={textsx}>
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
