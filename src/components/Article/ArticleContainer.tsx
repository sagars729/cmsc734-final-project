import React, { useState } from 'react';
import {Box} from '@mui/system';

import Article from './Article';
import Builder from './Builder';
import SectionBuilder from './SectionBuilder';
import NavButtons from './NavButtons';
import {
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
  const [secondLineColor, setSecondLineColor] = useState<string>("#000000");
  const [showBuilder, setShowBuilder] = useState<boolean>(true);
  const [showSectionBuilder, setShowSectionBuilder] = useState<boolean>(false);
  const [sections, setSections] = useState<SectionType[]>([]);
  const [xlabel, setXlabel] = useState<string>(props.features[0] || "");
  const [ylabel, setYlabel] = useState<string>(props.features[1] || "");
  const [ycoef, setYcoef] = useState<number>(1);
  const [ylabel2, setYlabel2] = useState<string>(props.features[2] || "");
  const [ycoef2, setYcoef2] = useState<number>(1);
  const bivariate = props.features.length >= 3;

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
           secondLineColor={secondLineColor}
           setBackgroundColor={setBackgroundColor}
           setColor={setColor}
           setPrimaryPointColor={setPrimaryPointColor}
           setSecondaryPointColor={setSecondaryPointColor}
           setLineColor={setLineColor}
           setSecondLineColor={setSecondLineColor}
           xlabel={xlabel}
           ylabel={ylabel}
           ycoef={ycoef}
           features={props.features}
           bivariate={bivariate}
           ylabel2={ylabel2}
           ycoef2={ycoef2}
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
           secondLineColor={secondLineColor}
           sections={sections}
           setSections={setSections}
           xlabel={xlabel}
           ylabel={ylabel}
           ycoef={ycoef}
           ylabel2={ylabel2}
           ycoef2={ycoef2}
           features={props.features}
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
           secondLineColor={secondLineColor}
           sections={sections}
           xlabel={xlabel}
           ylabel={ylabel}
           ycoef={ycoef}
           ylabel2={ylabel2}
           ycoef2={ycoef2}
           features={props.features}
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
         bivariate={bivariate}
         setYlabel2={setYlabel2}
         setYcoef2={setYcoef2}
       />
    </Box>     
  )

}

export default ArticleContainer;
