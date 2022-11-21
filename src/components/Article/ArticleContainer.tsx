import React, { useState } from 'react';
import {Box} from '@mui/system';

import Article from './Article';
import Builder from './Builder';
import {PointType, KeyPointType, ArticleContainerProps} from './ArticleTypes';

const ArticleContainer = (props: ArticleContainerProps) => {
  const [title, setTitle] = useState<string>("The Rise and Fall of COVID-19 in the United States");
  const [byline, setByline] = useState<string>("FirstName LastName")
  const [date, setDate] = useState<string>("11-20-2022");
  const [color, setColor] = useState<string>("#e1e4e8");
  const [backgroundColor, setBackgroundColor] = useState<string>("#646f77");
  const [primaryPointColor, setPrimaryPointColor] = useState<string>("#ff0000");
  const [secondaryPointColor, setSecondaryPointColor] = useState<string>("#ffc107");
  const [lineColor, setLineColor] = useState<string>("#ffffff");
  const [showBuilder, setShowBuilder] = useState<boolean>(true);

  return (
    <Box sx={{
      backgroundColor,
      color,
      width: "100%",
      height: "100vh",
      overflow: "auto"
    }}>
      {showBuilder ? (
         <Builder
           title={title}
           byline={byline}
           date={date}
           color={color}
           backgroundColor={backgroundColor}
           primaryPointColor={primaryPointColor}
           secondaryPointColor={secondaryPointColor}
           lineColor={lineColor}
           setBackgroundColor={setBackgroundColor}
           setColor={setColor}
           setTitle={setTitle}
           setByline={setByline}
           setDate={setDate}
           setPrimaryPointColor={setPrimaryPointColor}
           setSecondaryPointColor={setSecondaryPointColor}
           setLineColor={setLineColor}
           setShowBuilder={setShowBuilder}
         />
       ) : (
         <Article
           title={title}
           date={date}
           byline={byline}
           data={props.data}
           keyPoints={props.keyPoints}
           axisLabelColor={color}
           primaryPointColor={primaryPointColor}
           secondaryPointColor={secondaryPointColor}
           lineColor={lineColor}
         />
       )} 
    </Box>     
  )

}

export default ArticleContainer;
