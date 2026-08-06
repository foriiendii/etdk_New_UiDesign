import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useMediaQuery } from "react-responsive";

const LinkWrapper = ({
  href,
  children,
  target,
}: {
  href: string;
  target?: string;
  children: React.ReactNode;
}) => {
  const router = useRouter();
  const isTabletOrMobile = useMediaQuery({ query: "(max-width: 1100px)" });

  const scrollTo = async (id: string) => {
    if (isTabletOrMobile && id !== "#general") {
      await sleep(0.6);
    }
    if (router.pathname !== "/") {
      router.push("/" + id);
    }
    const anchor = document.getElementById(id.replace("#", ""));
    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  if (href.startsWith("#")) {
    return <span onClick={async () => await scrollTo(href)}>{children}</span>;
  }
  return (
    <Link href={href} target={target}>
      {children}
    </Link>
  );
};

export default LinkWrapper;
const sleep = (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, Math.ceil(time * 1000)));
};
