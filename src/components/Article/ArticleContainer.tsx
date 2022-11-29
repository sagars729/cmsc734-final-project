import React, { useState } from 'react';
import {Box} from '@mui/system';

import Article from './Article';
import Builder from './Builder';
import SectionBuilder from './SectionBuilder';
import NavButtons from './NavButtons';
import {
  PointType,
  KeyPointType,
  SectionType,
  ArticleContainerProps
} from './ArticleTypes';

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
  const [showSectionBuilder, setShowSectionBuilder] = useState<boolean>(false);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [xlabel, setXlabel] = useState<string>("");
  const [ylabel, setYlabel] = useState<string>("");
  const [ycoef, setYcoef] = useState<number>(1);


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
           setPrimaryPointColor={setPrimaryPointColor}
           setSecondaryPointColor={setSecondaryPointColor}
           setLineColor={setLineColor}
           xlabel={xlabel}
           ylabel={ylabel}
           ycoef={ycoef}
         />
       ) : (<></>)}
       {showSectionBuilder ? (
         <SectionBuilder 
           data={props.data}
           keyPoints={props.keyPoints}
           color={color}
           backgroundColor={backgroundColor}
           axisLabelColor={color}
           primaryPointColor={primaryPointColor}
           secondaryPointColor={secondaryPointColor}
           lineColor={lineColor}
           sections={sections}
           setSections={setSections}
           xlabel={xlabel}
           ylabel={ylabel}
           ycoef={ycoef}
         />
       ): (<></>)}
       {(!showSectionBuilder && !showBuilder) ? (
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
           sections={sections}
           xlabel={xlabel}
           ylabel={ylabel}
           ycoef={ycoef}
         />
       ) : (<></>)}
       <NavButtons
         color={color}
         backgroundColor={backgroundColor}
         showBuilder={showBuilder}
         showSectionBuilder={showSectionBuilder}
         sections={sections}
         setSections={setSections}
         setShowSectionBuilder={setShowSectionBuilder}
         setShowBuilder={setShowBuilder}
         setTitle={setTitle}
         setByline={setByline}
         setDate={setDate}
         setRenderArticle={props.setRenderArticle}
         setXlabel={setXlabel}
         setYlabel={setYlabel}
         setYcoef={setYcoef}
       />
    </Box>     
  )

}

export default ArticleContainer;
