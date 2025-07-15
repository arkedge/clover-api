import { Alignment, Button, ButtonVariant, Navbar } from "@blueprintjs/core";
import { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import logo from "./assets/logo.svg";
import "./index.css";

export const meta: MetaFunction = () => [
  { title: "Clover UI - ArkEdge Space" },
];

export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <HeaderNav />
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

function HeaderNav() {
  return (
    <Navbar className="bp6-dark">
      <div className="container mx-auto">
        <Navbar.Group align={Alignment.START}>
          <Navbar.Heading>
            <img
              src={logo}
              alt="logo"
              className="inline-block h-6 w-6 align-top"
            />{" "}
            Clover UI
          </Navbar.Heading>
          <Navbar.Divider />
          <NavLink to="/">
            <Button variant={ButtonVariant.MINIMAL} icon="home" text="Home" />
          </NavLink>
        </Navbar.Group>
      </div>
    </Navbar>
  );
}

export default function App() {
  return <Outlet />;
}
