import { Box } from "@mui/system";
import * as $ from "jquery";

import { NavButtonProps, NavButtonsProps } from "./ArticleTypes";

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
		onClick={props.onClick}
	>
		{props.label}
	</Box>
);

const NavButtons = (props: NavButtonsProps) => {
	const BuildSectionNextButton = (
		<NavButton
			color={props.color}
			backgroundColor={props.backgroundColor}
			label="Set Article Sections"
			onClick={() => {
				// @ts-ignore TS2345
				props.setTitle($("#article-title-input").val());
				props.setByline(
				  // @ts-ignore TS2345
					$("#article-byline-input").val()
				);
				// @ts-ignore TS2345
				props.setDate($("#article-date-input").val());
				// @ts-ignore TS2345
				props.setXlabel($("#chart-xaxis-input").val());
				// @ts-ignore TS2345
				props.setYlabel($("#chart-yaxis-input").val());
				// @ts-ignore TS2345
				props.setYcoef($("#chart-yscale-input").val());

				props.setShowBuilder(false);
				props.setShowSectionBuilder(true);
			}}
		/>
	);
	const BuildSectionBackButton = (
		<NavButton
			color={props.color}
			backgroundColor={props.backgroundColor}
			label="Set Article Sections"
			onClick={() => {
				props.setShowBuilder(false);
				props.setShowSectionBuilder(true);
			}}
		/>
	);
	const BuildButton = (
		<NavButton
			color={props.color}
			backgroundColor={props.backgroundColor}
			label="Return to Article Builder"
			onClick={() => {
				props.setShowSectionBuilder(false);
				props.setShowBuilder(true);
			}}
		/>
	);
	const GenerateArticleButton = (
		<NavButton
			color={props.color}
			backgroundColor={props.backgroundColor}
			label="Generate Article!"
			onClick={() => {
				props.setSections(
					props.sections.map((section, i) => {
						return Object.assign(
							{},
							section,
							{
						    // @ts-ignore TS2345
								header: $(
									"#article-section-header-" +
										i
								).val(),
							}
						);
					})
				);

				props.setShowSectionBuilder(false);
			}}
		/>
	);
	const RenderArticleButton = (
		<NavButton
			color={props.color}
			backgroundColor={props.backgroundColor}
			label="Return to Key Point Selector"
			onClick={() => {
				props.setRenderArticle(false);
			}}
		/>
	);

	return (
		<Box display="flex" alignItems="center" justifyContent="center">
			{props.showBuilder ? (
				<>
					{RenderArticleButton}
					{BuildSectionNextButton}
				</>
			) : (
				<></>
			)}
			{props.showSectionBuilder ? (
				<>
					{BuildButton}
					{GenerateArticleButton}
				</>
			) : (
				<></>
			)}
			{!props.showSectionBuilder && !props.showBuilder ? (
				<>{BuildSectionBackButton}</>
			) : (
				<></>
			)}
		</Box>
	);
};

export default NavButtons;
