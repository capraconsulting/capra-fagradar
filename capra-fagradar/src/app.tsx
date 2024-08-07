import { Outlet, Link } from "react-router-dom";
import style from "./app.module.css";
import Logo from "./logo";
import { Breadcrumb } from "./breadcrumb";
import { Radar } from "./radar";

const Header = () => {
	return (
		<header className={style.header}>
			<Link to="/">
				<Logo />
				<h1>Fagradar</h1>
			</Link>
			<div className={style.links}>
				<Link to="/technical-radar/">Teknisk radar</Link>
				<Link to="/tech-leader-radar/">Teknologiledelse radar</Link>
			</div>
		</header>
	);
};

export const App = () => {
	return (
		<div>
			<Header />
			<main>
				<Breadcrumb />
				<Outlet />
			</main>
		</div>
	);
};

const HalfWidthSection = ({ children }) => {
	return <section className={style.halfWidthSection}>{children}</section>;
};

export const MainPage = () => {
	return (
		<>
			<h2> Capra sine fagradarer </h2>
			<HalfWidthSection>
				<Link to="/technical-radar/">Teknisk radar</Link>
			</HalfWidthSection>
			<HalfWidthSection>
				<Link to="/tech-leader-radar/">Teknologiledelse radar</Link>
			</HalfWidthSection>
		</>
	);
};

export const TechnicalRadar = () => {
	const quadrants = [
		"backend",
		"frontend",
		"software engineering",
		"plattform",
	];
	return (
		<div>
			<h1> Teknisk radar </h1>
			<Radar quadrants={quadrants} />
		</div>
	);
};

export const TechLeaderRadar = () => {
	const quadrants = ["smidig", "organisasjon", "ledelse", "teknisk"];
	return (
		<div>
			<h1>Teknologiledelse radar</h1>
			<Radar quadrants={quadrants} />
		</div>
	);
};
