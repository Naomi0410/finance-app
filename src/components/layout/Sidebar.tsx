"use client";

import Image from "next/image";
import { useState } from "react";
import SidebarButton from "../ui/SidebarButton";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { sidebarLinks, minimizeMenuLink } from "@/lib/constants";
import Link from "next/link";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside
      className={`
        text-preset-3 flex flex-col justify-between gap-300 pt-100 lg:pb-300 lg:pt-0 px-200 md:px-500 lg:!px-0
        bg-grey-900 rounded-t-[8px] lg:rounded-t-none lg:rounded-r-[16px] transition-all duration-300 shrink-0
        ${collapsed ? "lg:w-[88px]" : "lg:w-[300px]"} w-full
      `}
    >
      <div className="relative px-400 py-500 mb-300 hidden lg:block">
        <Image
          src="/assets/images/logo-large.svg"
          alt="Logo large"
          width={121}
          height={21.5}
          onClick={() => router.push("/")}
          className={`absolute transition-opacity duration-300 cursor-pointer ${
            collapsed ? "opacity-0" : "opacity-100"
          }`}
        />
        <Image
          src="assets/images/logo-small.svg"
          alt="Logo small"
          width={13.7}
          height={21.5}
          onClick={() => router.push("/")}
          className={`absolute transition-all duration-300 cursor-pointer ${
            collapsed
              ? "opacity-100 translate-x-[5px]"
              : "opacity-0 translate-x-[0px]"
          }`}
        />
      </div>

      <div
        className={`
          flex flex-row lg:flex-col justify-between lg:justify-normal gap-[4px] 
          h-full rounded-r-[12px]
          transition-padding duration-300 ${
            collapsed ? "lg:pr-100" : "lg:pr-300"
          }
        `}
      >
       {sidebarLinks.map((link) => {
  const isDemo = pathname.startsWith('/demo');
  const href = isDemo ? `/demo${link.href}` : link.href;

  return (
    <Link href={href} key={href} className="w-full md:w-fit lg:!w-full">
      <SidebarButton
        width={link.width}
        height={link.height}
        iconPath={link.iconPath}
        text={link.text}
        showText={!collapsed}
        active={pathname.replace(/^\/demo/, '') === link.href}
      />
    </Link>
  );
})}

      </div>

      <div className="hidden lg:block">
        <SidebarButton
          width={minimizeMenuLink.width}
          height={minimizeMenuLink.height}
          iconPath={minimizeMenuLink.iconPath}
          text="Minimize Menu"
          showText={!collapsed}
          onClick={() => setCollapsed(!collapsed)}
          imageClassName={collapsed ? "rotate-180" : "rotate-0"}
          extraMargin={"mb-100"}
        />
      </div>
    </aside>
  );
}
