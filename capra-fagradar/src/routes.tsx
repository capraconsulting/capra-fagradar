import { createBrowserRouter, useRouteError, Link } from "react-router-dom";
import { App, MainPage, TechnicalRadar, TechLeaderRadar } from "./app.tsx";

const ErrorPage = () => {
	const error = useRouteError();
	console.error(error);

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
		],
	},
]);
