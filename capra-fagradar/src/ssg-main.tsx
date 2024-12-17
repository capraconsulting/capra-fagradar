import React from 'react';
import { hydrateRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import routes from './routes';
import '@fontsource-variable/inter';

const router = createBrowserRouter(routes, { basename: import.meta.env.BASE_URL });
const domNode = document.getElementById('root')!;

hydrateRoot(
	domNode,
	<React.StrictMode>
		<RouterProvider router={router} />
  </React.StrictMode>,
);
