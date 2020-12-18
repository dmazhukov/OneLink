import styled from "styled-components";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import chroma from "chroma-js";

interface LinkProps {
	backgroundColor?: string;
	capsule?: boolean;
	shouldAnimate?: boolean;
}

const getTextColor = (color, invert?: boolean) => {
	const isBright = chroma(color).luminance() > 0.4;
	const brightIndex = isBright ? 1 : 0;
	const colors = ["black", "white"];
	return invert ? colors.reverse()[brightIndex] : colors[brightIndex];
};

const LinkComponent = styled.li`
	a {
		padding: 1rem 0 !important;
		transition: color 0.5s;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
		img{
			/* justify-self: start; */
			margin-right: .5rem;
		}
		color: ${({ backgroundColor }: LinkProps) =>
			getTextColor(backgroundColor || "#212121", false)};
	}
	width: 100%;
	/* background: ; */
	transform: translate(0, 0);
	text-align: center;
	border: 2px solid ${({ backgroundColor }: LinkProps) => backgroundColor || "#212121"};
	display: block;
	position: relative;
	cursor: pointer;
	z-index: 5;
	border-radius: ${({ capsule }: LinkProps) => (capsule ? "100vw" : "0")};
	overflow: hidden;
	&:hover {
		a {
			color: ${({ backgroundColor }: LinkProps) =>
				getTextColor(backgroundColor || "#212121", true)};
		}
	}
	&:first-child {
		margin-top: 0 !important;
	}
`;

const LinkBackground = styled(motion.span)`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: ${({ backgroundColor }: LinkProps) => backgroundColor || "#212121"};
	z-index: -1;
	transform-origin: left center;
`;

const availableAnimations = {
	radial: {
		hovered: { clipPath: "circle(70.7% at 50% 50%)" },
		unhovered: { clipPath: "circle(0% at 50% 50%)" },
	},
	slideLeftToRight: {
		hovered: { clipPath: "inset(0 0% 0 0)" },
		unhovered: { clipPath: "inset(0 100% 0 0)" },
	},
	slideRightToLeft: {
		hovered: { clipPath: "inset(0 0 0 0%)" },
		unhovered: { clipPath: "inset(0 0 0 100%)" },
	},
	slideTopToBottom: {
		hovered: { clipPath: "inset(0 0 0% 0)" },
		unhovered: { clipPath: "inset(0 0 100% 0)" },
	},
	slideBottomToTop: {
		hovered: { clipPath: "inset(0% 0 00 0)" },
		unhovered: { clipPath: "inset(100% 0 0 0)" },
	},
};

const background = {
	hovered: animationType => ({
		clipPath: availableAnimations[animationType]?.hovered?.clipPath,
		// ...(availableAnimations[animationType]?.hovered || {}),
		opacity: 1,
		transition: {
			duration: 0.5,
		},
	}),
	unhovered: animationType => ({
		clipPath: availableAnimations[animationType]?.unhovered?.clipPath,
		opacity: 0,
		transition: {
			duration: 0.5,
		},
	}),
};

const Link = ({
	name,
	path,
	animation = "radial",
	disabled = false,
	capsule = false,
	linkColor = "",
	linkStyle = "",
	image = "",
}) => {
	const [hovered, setHovered] = useState(false);
	const [animationType, setAnimationType] = useState(animation);

	useEffect(() => {
		setAnimationType("none");
		setTimeout(() => {
			setAnimationType(animation);
		}, 100);
	}, [animation]);

	return (
		<LinkComponent
			shouldAnimate={animationType !== "none"}
			backgroundColor={linkColor}
			capsule={capsule || linkStyle === "capsule"}
			onMouseEnter={() => setHovered(true)}
			onMouseLeave={() => setHovered(false)}
		>
			<a href={disabled ? null : path}>
				{image?.length && <img width="40" height="40" src={image}></img>}
				{name}
			</a>
			{animationType !== "none" && (
				<LinkBackground
					initial="unhovered"
					variants={background}
					custom={animationType}
					animate={hovered ? "hovered" : "unhovered"}
					backgroundColor={linkColor}
				/>
			)}
		</LinkComponent>
	);
};

export default Link;
