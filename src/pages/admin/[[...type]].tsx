import useUser from "../../hooks/useUser";
import { useRouter } from "next/router";
import { Slide, useMediaQuery } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import LinkComponent from "../../components/Link";
import Link from "next/link";
import { CopyToClipboard } from "react-copy-to-clipboard";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import { AnimateSharedLayout, AnimatePresence } from "framer-motion";
import Head from "next/head";
import LinkList from "../../components/shared/LinkList";
import { settingsContext, SettingsContextProvider } from "../../contexts/settingsContext";
import {
	AdminPage,
	AdminSection,
	SectionHeader,
	PreviewBody,
	PreviewSection,
	ContentBody,
	AvatarContainer,
} from "../../components/admin/index.styled";
import Snackbar from "@material-ui/core/Snackbar";
import { Underline, LargeAvatar } from "../../components/shared/styles";
// import Customize from "../../components/admin/Customize";
// import Analytics from "../../components/admin/Analytics";
// import Content from "../../components/admin/Content";
import styled from "styled-components";
import dynamic from "next/dynamic";
import Preview from "../../components/admin/Preview";
import useUserContext from "../../hooks/useUserContext";
const Content = dynamic(() => import("../../components/admin/Content"));
const Analytics = dynamic(() => import("../../components/admin/Analytics"));
const Customize = dynamic(() => import("../../components/admin/Customize"));

const CopyIcon = styled(FileCopyIcon)`
	padding: 0.25rem;
	border-radius: 0.1rem;
	&:hover {
		background: #282828;
	}
`;

const sectionProps = {
	exit: { x: -600, opacity: 0 },
	animate: { x: 0, opacity: 1 },
	initial: { x: -600, opactiy: 0 },
};

const AdminComponent = () => {
	const [copied, setCopied] = useState(false);

	const { user, loading } = useUserContext();
	const { settings, update } = useContext(settingsContext);
	const {
		query: { type },
	} = useRouter();
	const section = type?.[0];

	const { links } = settings;

	const showPreview = useMediaQuery("(min-width: 64rem)");

	const remove = id => {
		update("links", prev => prev.filter(item => item.id !== id));
	};

	useEffect(() => {
		update("links", [...(user?.Page?.links || [])]);
	}, [user]);

	return (
		<AdminPage>
			<Head>
				<title>OneLink | Admin</title>
			</Head>
			{!loading && (
				<>
					<Snackbar
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "left",
						}}
						open={copied}
						autoHideDuration={6000}
						onClose={() => setCopied(false)}
						message="Link Copied!"
					/>
					<AdminSection left>
						<SectionHeader>
							<AnimateSharedLayout>
								<Link href="/admin">
									<a>
										Content
										{!section && <Underline layoutId="section-header" />}
									</a>
								</Link>
								<Link href="/admin/customize">
									<a>
										Customize
										{section === "customize" && (
											<Underline layoutId="section-header" />
										)}
									</a>
								</Link>
								<Link href="/admin/analytics">
									<a>
										Analytics
										{section === "analytics" && (
											<Underline layoutId="section-header" />
										)}
									</a>
								</Link>
							</AnimateSharedLayout>
						</SectionHeader>
						<ContentBody>
							<AnimatePresence exitBeforeEnter>
								{!section ? (
									<Content
										remove={remove}
										key="content"
										{...sectionProps}
										links={links}
										setLinks={links => update("links", links)}
									/>
								) : section === "customize" ? (
									<Customize key={section} {...sectionProps} />
								) : section === "analytics" ? (
									<Analytics key={section} {...sectionProps} />
								) : (
									<></>
								)}
							</AnimatePresence>
						</ContentBody>
					</AdminSection>
					{showPreview && (
						<AdminSection>
							<SectionHeader className="link-section">
								<Link href={`/${user.username}`}>
									<a>
										{process.env.NEXT_PUBLIC_CLIENT_URL}/{user.username}
									</a>
								</Link>
								<CopyToClipboard
									text={`${process.env.NEXT_PUBLIC_CLIENT_URL}/${user.username}`}
									onCopy={() => setCopied(true)}
								>
									<CopyIcon />
								</CopyToClipboard>
							</SectionHeader>
							<Preview user={user} />
						</AdminSection>
					)}
				</>
			)}
		</AdminPage>
	);
};

export default function Admin() {
	return (
		<SettingsContextProvider>
			<AdminComponent />
		</SettingsContextProvider>
	);
}

export async function getServerSideProps(ctx) {
	const { type } = ctx.query;
	if (type?.length > 1) return { notFound: true };
	if (!type || ["customize", "analytics", "preview"].includes(type[0])) {
		return { props: {} };
	}
	return { notFound: true };
}
