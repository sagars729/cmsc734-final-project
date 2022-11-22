import React, { useState } from 'react';
import {Box} from '@mui/system';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { alpha, styled } from '@mui/material/styles';
import Button from '@mui/material/Button';

import {BuilderProps, ColorPickerProps} from './ArticleTypes';
import {
  textsx,
  validateAndSetColor,
  ExampleChart,
  ExampleText
} from './ArticleConstants';


const Builder = (props: BuilderProps) => {
  const builderSectionStyle: object = {
    width: "95%",
    border: `2px dashed ${props.color}`,
    backgroundColor: `${props.backgroundColor}`,
    padding: "1%",
    margin: "2%"
  }

  const CustomTextField = styled(TextField)({
    '& label.Mui-focused': {
      color: props.color,
    },
    '& .MuiInput-underline:before': {
      borderBottomColor: props.color,
    },
    '& .MuiInput-underline:after': {
      borderBottomColor: props.color,
    },
    '& .MuiInput-input': {
      color: props.color
    },
    '& .MuiInputLabel-root': {
      color: props.color
    },
  });

  const ColorPicker = (props: ColorPickerProps) => 
    (
      <div>
        <CustomTextField
          id={`article-${props.label}-color`}
          label={`${props.label} Color`}
          variant="standard"
          defaultValue={props.color}
          onChange={(e) => validateAndSetColor(e.target.value, props.setColor)}
        />
      </div>
    );

  return (
    <div id="builder" style={{margin:"5%"}}>
      {/** Page Header **/}
      <Typography variant="h2" component="h1" gutterBottom align="center" sx={textsx}>
         Article Builder
      </Typography> 
      <Typography variant="subtitle1" gutterBottom align="center" sx={textsx}>
         Customize Your Article Text, Charts, and Headers
      </Typography>

      {/** Article Headers **/}
      <Box sx={builderSectionStyle}>
        <p> 
          Let's start with some basics. Enter the title of your article,
          the date that the article will be published, and the byline:
        </p>

        <CustomTextField
          id="article-title-input"
          label="Article Title"
          variant="standard"
          defaultValue={props.title}
          fullWidth
        />
        <CustomTextField
          id="article-byline-input"
          label="Article Byline"
          variant="standard"
          defaultValue={props.byline}
          fullWidth
        />
        <CustomTextField
          id="article-date-input"
          label="Publish Date"
          variant="standard"
          defaultValue={props.date}
          fullWidth
        />
      </Box>

      {/** Article Color Scheme **/}
      <Box sx={builderSectionStyle}>
        <p>
          Now let's modify the color scheme of the article. Use the color
          selectors below to change the text, background, and key point
          colors. The example text and chart will reflect any changes. 
        </p>

        <Grid container spacing={2} sx={{margin: "16px"}}>
          <Grid xs={2}>
            <ColorPicker
              label="Text"
              color={props.color}
              setColor={props.setColor}
            />
            <ColorPicker
              label="Background"
              color={props.backgroundColor}
              setColor={props.setBackgroundColor}
            />
            <ColorPicker
              label="Line"
              color={props.lineColor}
              setColor={props.setLineColor}
            />
            <ColorPicker
              label="Primary Point"
              color={props.primaryPointColor}
              setColor={props.setPrimaryPointColor}
            />
            <ColorPicker
              label="Secondary Point"
              color={props.secondaryPointColor}
              setColor={props.setSecondaryPointColor}
            />
          </Grid>
          <Grid xs={4}>
            <ExampleText />
          </Grid>
          <Grid xs={6} justifyContent="center" alignItems="center">
            <ExampleChart
              color={props.color}
              primaryPointColor={props.primaryPointColor}
              secondaryPointColor={props.secondaryPointColor}
              lineColor={props.lineColor}
            />
          </Grid>
        </Grid>
      </Box>
    </div>
  )
}

export default Builder;
