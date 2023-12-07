import React from 'react';
import { Route, Routes as ReactRouterRoutes } from 'react-router-dom';

import Home from './Home/Home';
import Game from './Game/Game';

export default function Routes() {
  return (
    <ReactRouterRoutes>
      <Route path="/">
        <Route index element={<Home />} />
        <Route path="*" element={<Home />} />
      </Route>
    </ReactRouterRoutes>
  );
}
