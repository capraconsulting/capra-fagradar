import type { FunctionComponent } from 'react';
import style from './breadcrumb.module.css';
import { useMatches } from 'react-router';

export const Breadcrumb = () => {
  const matches = useMatches();
  const crumbs = (matches as { handle: { crumb?: FunctionComponent } }[])
    .filter((match) => typeof match.handle?.crumb === 'function')
    .map((match) => match.handle?.crumb)
    .filter((c) => !!c);

  return (
    <ol className={style.breadcrumb}>
      {crumbs.map((Crumb, index) => (
        <li key={index}>
          <Crumb />
        </li>
      ))}
    </ol>
  );
};
