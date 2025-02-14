import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import routes from './routes';
import '@fontsource-variable/inter';

const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });
const domNode = document.getElementById('root')!;

const root = createRoot(domNode);

root.render(
  <React.StrictMode>
		<RouterProvider router={router} />
  </React.StrictMode>,
);
