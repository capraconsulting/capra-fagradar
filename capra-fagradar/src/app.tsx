import { Outlet, Link } from "react-router-dom";
import style from "./app.module.css";
import Logo from "./logo";
import { Breadcrumb } from "./breadcrumb";

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

const Footer = () => {
	return (
		<footer className={style.footer}>
			<Logo />
			<div>
				<a href="https://capraconsulting.no">Tilbake til capraconsulting.no</a>
			</div>
		</footer>
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
			<Footer />
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
