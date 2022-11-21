import {Box} from '@mui/system';
import * as $ from 'jquery';

import {NavButtonProps, NavButtonsProps} from './ArticleTypes';

const NavButton = (props: NavButtonProps) => (
   <Box
     display="flex" 
     alignItems="center"
     justifyContent="center"
     sx={{
       width: "20%",
       border: `2px dashed ${props.color}`,
       backgroundColor: `${props.backgroundColor}`,
       padding: "1%",
       margin: "2%",
     }}
     onClick={props.onClick}>
     {props.label} 
   </Box>
);

const NavButtons = (props: NavButtonsProps) => {
  const GenerateButton = (
    <NavButton
      color={props.color}
      backgroundColor={props.backgroundColor}
      label="Click Here to Generate Article!"
      onClick={() => {
        // @ts-ignore TS2345
        props.setTitle($("#article-title-input").val())
        // @ts-ignore TS2345
        props.setByline($("#article-byline-input").val())
	      // @ts-ignore TS2345
        props.setDate($("#article-date-input").val())
        props.setShowBuilder(false);
      }}
    />
  )
  const BuildButton = (
    <NavButton
      color={props.color}
      backgroundColor={props.backgroundColor}
      label="Return to Article Builder"
      onClick={() => {
        props.setShowBuilder(true);
      }}
    />
  )
  const RenderArticleButton = (
    <NavButton
      color={props.color}
      backgroundColor={props.backgroundColor}
      label="Return to Key Point Selector"
      onClick={() => {
        props.setRenderArticle(false);
      }}
    />
  )

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      {props.showBuilder ? (
        <>
        {RenderArticleButton}
        {GenerateButton}
        </>
      ) : BuildButton}
    </Box>
  )
}


export default NavButtons;
