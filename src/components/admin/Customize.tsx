import { useContext } from "react";
import LinkComponent from "../../components/Link";
import { AnimateSharedLayout, motion } from "framer-motion";
import { CirclePicker } from "react-color";
import defaultAnimations from "../../util/LinkAnimations.json";
import defaultTypes from "../../util/LinkTypes.json";
import { splitByCaps } from "../../util/functions";
import { settingsContext } from "../../contexts/settingsContext";
import {
	SectionContainer,
	ContentHeader,
	ContentSection,
	CustomizeLinksBody,
} from "./index.styled";
import { colors } from "../../util/constants";
import styled from "styled-components";

const OptionArea = styled(motion.div)`
	display: flex;
	flex-direction: column;
`;

const OptionHeader = styled(motion.div)`
	display: flex;
	justify-content: space-between;
	align-items: center;
`;

const ButtonOutline = styled(motion.div)`
	padding: 0.1rem;
	width: 1.5rem;
	height: 1.5rem;
	border-radius: 50%;
	border: 2px solid var(--clr-accent-300);
	align-items: center;
	margin-bottom: 0.25rem;
	transition: background .25s;
	cursor: pointer;
	:hover{
		background: #ffffff22
	}
`;

const ButtonCenter = styled(motion.div)`
	border-radius: 50%;
	width: 100%;
	height: 100%;
	background: var(--clr-accent-300);
`;

const Customize = props => {
	const { settings, update } = useContext(settingsContext);

	return (
		<SectionContainer {...props}>
			<ContentHeader>Background Color</ContentHeader>
			<ContentSection solid>
				<CirclePicker
					colors={colors}
					width="100%"
					color={settings.backgroundColor}
					onChange={color => update("backgroundColor", color.hex)}
				/>
			</ContentSection>
			<ContentHeader>Link Color</ContentHeader>
			<ContentSection solid>
				<CirclePicker
					colors={colors}
					width="100%"
					color={settings.linkColor}
					onChange={color => update("linkColor", color.hex)}
				/>
			</ContentSection>
			<ContentHeader>Link Hover animation</ContentHeader>
			<ContentSection solid>
				<CustomizeLinksBody>
					<AnimateSharedLayout>
						{defaultAnimations.map(animation => (
							<OptionArea
								key={animation}
								onClick={() => update("animation", animation)}
							>
								<OptionHeader>
									<h2>{splitByCaps(animation)}</h2>
									<ButtonOutline>
										{animation === settings?.animation && (
											<ButtonCenter layoutId="selected"></ButtonCenter>
										)}
									</ButtonOutline>
								</OptionHeader>

								<LinkComponent
									animation={animation}
									path=""
									disabled
									name="Hover Me"
									backgroundColor="#000000"
									linkColor="#ffffff"
								/>
							</OptionArea>
						))}
					</AnimateSharedLayout>
				</CustomizeLinksBody>
			</ContentSection>
			<ContentHeader>Link Style</ContentHeader>
			<ContentSection solid>
				<CustomizeLinksBody className="column">
					<AnimateSharedLayout>
						{defaultTypes.map(type => {
							return (
								<OptionArea key={type} onClick={() => update("linkStyle", type)}>
									<OptionHeader>
										<h2>{type}</h2>
										<ButtonOutline>
											{type === settings?.linkStyle && (
												<ButtonCenter layoutId="type-selection"></ButtonCenter>
											)}
										</ButtonOutline>
									</OptionHeader>
									<LinkComponent
										capsule={type === "capsule"}
										path=""
										disabled
										name="example"
										backgroundColor="#000000"
										linkColor="#ffffff"
									/>
								</OptionArea>
							);
						})}
					</AnimateSharedLayout>
				</CustomizeLinksBody>
			</ContentSection>
			{/* <ContentHeader>Style</ContentHeader>
			<ContentSection solid></ContentSection> */}
		</SectionContainer>
	);
};

export default Customize;
