import style from './breadcrumb.module.css';
import { useMatches } from 'react-router-dom';

export const Breadcrumb = () => {
  const matches = useMatches();
  const crumbs = (matches as { handle: { crumb?: Function } }[])
    .filter((match) => typeof match.handle?.crumb === 'function')
    .map((match) => (match.handle as any).crumb);

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
