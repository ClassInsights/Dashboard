import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider, useNavigate } from "react-router-dom";
import PageWrapper from "./components/PageWrapper";
import Home from "./routes/Home";
import Computer from "./routes/Computer";
import Rooms from "./routes/Rooms";
import Confgiguration from "./routes/Configuration";

const root = document.getElementById("root");

if (!root) throw new Error("No root element found");

const router = createBrowserRouter([
	{
		path: "/",
		element: <PageWrapper />,
		errorElement: (() => {
			const ErrorHandler = () => {
				const navigate = useNavigate();
				useEffect(() => {
					navigate("/");
				}, [navigate]);

				return <React.Fragment />;
			};
			return <ErrorHandler />;
		})(),
		children: [
			{
				path: "/",
				element: <Home />,
			},
			{
				path: "/computer",
				element: <Computer />,
			},
			{
				path: "/räume",
				element: <Rooms />,
			},
			{
				path: "/konfiguration",
				element: <Confgiguration />,
			},
		],
	},
]);

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
