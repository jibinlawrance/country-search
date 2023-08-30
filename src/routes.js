import React from "react";
// import DetailsPage from "./pages/DetailsPage";
import HomePage from "./pages/HomePage";
import { useRoutes } from "react-router-dom";

let routes = [
  {
    path: "/",
    element: <HomePage />,
  },
//   {
//     path: "/details",
//     element: <DetailsPage />,
//   },
];

let Routes = () => useRoutes(routes);

export default Routes;
