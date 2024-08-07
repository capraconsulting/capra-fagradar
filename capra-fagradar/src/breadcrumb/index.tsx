import React from "react";
import style from "./breadcrumb.module.css";
import { useMatches } from "react-router-dom";

export const Breadcrumb = () => {
	const matches = useMatches();
	const crumbs = matches
		.filter((match) => Boolean(match.handle?.crumb))
		.map((match) => match.handle.crumb(match.data));

	return (
		<ol className={style.breadcrumb}>
			{crumbs.map((crumb, index) => (
				<li key={index}>{crumb}</li>
			))}
		</ol>
	);
};
