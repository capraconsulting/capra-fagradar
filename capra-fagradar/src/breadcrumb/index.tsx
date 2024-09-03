import style from "./breadcrumb.module.css";
import { useMatches } from "react-router-dom";

export const Breadcrumb = () => {
	const matches = useMatches();
	const crumbs = matches
		.filter((match) => Boolean((match.handle as any)?.crumb))
		.map((match) => (match.handle as any).crumb(match.data));

	return (
		<ol className={style.breadcrumb}>
			{crumbs.map((crumb, index) => (
				<li key={index}>{crumb}</li>
			))}
		</ol>
	);
};
