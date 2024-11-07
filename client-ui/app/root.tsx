import { Alignment, Button, Navbar } from "@blueprintjs/core";
import "@blueprintjs/core/lib/css/blueprint.css";
import "@blueprintjs/icons/lib/css/blueprint-icons.css";
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
import "./tailwind.css";

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
    <Navbar className="bp5-dark">
      <div className="container mx-auto">
        <Navbar.Group align={Alignment.LEFT}>
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
            <Button minimal={true} icon="home" text="Home" />
          </NavLink>
        </Navbar.Group>
      </div>
    </Navbar>
  );
}

export default function App() {
  return <Outlet />;
}
