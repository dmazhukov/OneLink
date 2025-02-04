import { useEffect, useContext, useState } from "react";
import Router, { useRouter } from "next/router";
import { globalUser, userContext } from "../contexts/userContext";
import client from "../graphql/client";
import userQuery from "../graphql/userQuery";
import { getAccessToken, setAccessToken } from "../util/auth/accessToken";
import useUserContext from "./useUserContext";
interface userOptions {
	redirectTo?: string;
	as?: string;
	refresh?: boolean;
	loggedInRedirect?: string;
}

const redirects = {
	"/": {
		redirectTo: "/landing",
		as: "/",
		loggedInRedirect: "/admin",
	},
	"/admin": { redirectTo: "/auth/login" },
	"/admin/[[...type]]": { redirectTo: "/auth/login" },
	"/auth/[type]": { loggedInRedirect: "/admin" },
};

const useUser = ({ refresh }: userOptions = {}): globalUser => {
	const context = useUserContext();

	const router = useRouter();

	const pathRedirects = redirects[router.pathname];

	const { redirectTo, as, loggedInRedirect } = pathRedirects || {};

	const [tokenRefreshed, setTokenRefreshed] = useState(false);
	const accessToken = getAccessToken();

	const { setUser, user, setLoading, loading } = context;

	useEffect(() => {
		setTokenRefreshed(false);
		fetch(`${process.env.NEXT_PUBLIC_API_URL}/refresh_token`, {
			method: "POST",
			credentials: "include",
		}).then(async response => {
			if (!response.ok) return setTokenRefreshed(true);
			const json = await response.json();
			const { token } = json.data;
			setAccessToken(token);
			setTokenRefreshed(true);
		});
	}, []);

	useEffect(() => {
		setLoading(true);
		let id: number;
		let loadingId: number;
		try {
			if (tokenRefreshed) {
				id = setTimeout(async () => {
					if (accessToken) {
						const userData = await client.query({
							query: userQuery,
							fetchPolicy: "no-cache"
						});
						setUser(userData?.data?.me);
						if (loggedInRedirect) {
							setLoading(false);
							await Router.push(loggedInRedirect);
						}
					} else if (redirectTo) {
						setLoading(false);
						await Router.push(redirectTo, as);
					}
				}, 300);
				loadingId = setTimeout(() => {
					setLoading(false);
				}, 300);
			}
		} catch (err) {
			setLoading(false);
		}
		return () => {
			clearTimeout(id);
			clearTimeout(loadingId);
		};
	}, [accessToken, redirectTo, as, tokenRefreshed]);

	return { ...context };
};

export default useUser;
