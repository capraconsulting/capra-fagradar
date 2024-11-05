import { createBrowserRouter, useRouteError, Link } from "react-router-dom";
import { App, MainPage } from "./app.tsx";
import { TechnicalRadar } from './technical-radar';
import { TechLeaderRadar } from './tech-leader-radar';
import OmFagradar from './om-fagradar.mdx';

const ErrorPage = () => {
	const error = useRouteError() as { statusText?: string, message?: string };

	return (
		<div id="error-page">
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{error.statusText || error.message}</i>
			</p>
		</div>
	);
};

export const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		errorElement: <ErrorPage />,
		handle: {
			crumb: () => <Link to="/">Home</Link>,
		},
		children: [
			{
				path: "/",
				element: <MainPage />,
			},
			{
				path: "/technical-radar/",
				element: <TechnicalRadar />,

				handle: {
					crumb: () => <span>Teknisk radar</span>,
				},
			},
			{
				path: "/tech-leader-radar/",
				element: <TechLeaderRadar />,

				handle: {
					crumb: () => <span>Teknologiledelse radar</span>,
				},
			},
			{
				path: "/om-fagradar/",
				element: <OmFagradar />,

				handle: {
					crumb: () => <span>Om fagradaren</span>,
				},
			},
		],
	},
], {
  basename: import.meta.env.BASE_URL,
});
