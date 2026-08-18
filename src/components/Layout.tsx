import type { ReactNode } from "react";
import Header from "./Header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        // `minHeight` rather than a fixed `height: 100vh`: the page is far taller
        // than the viewport, and on mobile 100vh excludes the browser chrome.
        minHeight: "100svh",
      }}
    >
      <Header />
      {children}
    </div>
  );
};

export default Layout;
