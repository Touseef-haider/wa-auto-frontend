"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HiHome, HiCog, HiMenu, HiDatabase, HiOfficeBuilding, HiChevronDown, HiChevronRight } from "react-icons/hi";
import {FaProductHunt} from "react-icons/fa"
import type { IconType } from "react-icons"
import Button from "../Button/Index";


type SidebarItem = {
  label: string,
  href: string,
  icon: IconType,
  subItems?: SidebarItem[]
}


const sidebarItems: SidebarItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: HiHome
  },
  {
    label: "Data",
    href: "/business-data",
    icon: HiDatabase
  },
  {
    label: "Products",
    href: "/products",
    icon: FaProductHunt
  },
  // { label: "Chat", href: "/chat", icon: HiChat },
  {
    label: "Settings",
    href: "/settings/business-profile",
    subItems: [
      {
        label: "Business Profile",
        href: "/settings/business-profile",
        icon: HiOfficeBuilding
      },
      {
        label: "Business Branding",
        href: "/settings/business-branding",
        icon: HiOfficeBuilding
      }
    ],
    icon: HiCog
  },
];

const Sidebar = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openSubItems, setOpenSubItems] = useState<Record<string,boolean>>({})

  // close mobile drawer on route change
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMobileOpen(false), [pathname]);

  const toggleCollapsed = () => {
    setOpenSubItems({})
    setCollapsed(!collapsed)
  };
  const toggleMobileOpen = () => setMobileOpen(!mobileOpen);

  const closeMobile = () => setMobileOpen(false);


  const toggleSubItems = (href: string) => {
    setOpenSubItems(prev => ({
      ...prev,
      [href]: !prev[href],
    }));
  };

  useEffect(()=>{
    sidebarItems.forEach(item => {
      item.subItems?.forEach(subItem => {
        if(pathname.startsWith(subItem.href)){
          setOpenSubItems(prev => ({
            ...prev,
            [item.href]: true,
          }))
        }
      })
    })
    return () => {
      setOpenSubItems({})
    }
  },[pathname])
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* MOBILE BACKDROP */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-40 h-full bg-white shadow-sm
          transition-all duration-300 flex flex-col overflow-hidden
          ${mobileOpen ? "w-64" : "w-0"}
          ${collapsed ? "md:w-16" : "md:w-64"}
        `}

      >
        {/* DESKTOP COLLAPSE BUTTON */}
        <div className="hidden md:flex items-center font-bold p-3">
          <div className="flex items-center w-full">
            <span
              className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out`}
              style={{ width: collapsed ? "0px" : "200px" }}
            >
              WA AUTO
            </span>

            {/* Menu button always at the end */}
            <button
              onClick={toggleCollapsed}
              className="ml-2 p-2 rounded justify-end hover:bg-gray-100"
            >
              <HiMenu className="h-5 w-5" />
            </button>
          </div>
        </div>


        {/* MOBILE HEADER */}
        {mobileOpen && (
          <div className="flex items-center font-bold p-3">
            <div className="flex items-center w-full">
              <span
                className={`overflow-hidden whitespace-nowrap transition-all duration-300 ease-in-out`}
                style={{ width: collapsed ? "0px" : "200px" }}
              >
                WA AUTO
              </span>

              {/* Menu button always at the end */}
              <button
                onClick={closeMobile}
                className="ml-2 p-2 rounded justify-end hover:bg-gray-100"
              >
                <HiMenu className="h-5 w-5 rotate-90" />
              </button>
            </div>
          </div>
        )}

        {/* NAV ITEMS */}
        <nav className="flex-1 p-2 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);

            
            return (
              <div key={item.href}>
                <div className={`
                      flex items-center rounded-md px-3 py-2 transition mb-2
                      ${active ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}
                      ${collapsed ? "justify-center gap-0 px-2" : "gap-3"}
                    `}>
                  <Link
                    key={item.href}
                    href={item.href}
                    className="w-full flex gap-2"
                  >
                    <Icon className="h-5 w-5" />
                    {!collapsed && item.label}
                  </Link>
                  {
                    Array.isArray(item.subItems) && item.subItems.length > 0 &&!collapsed && !openSubItems[item.href]  && (
                      <Button
                        isHover={false}
                        type="button"
                        onClick={() => toggleSubItems(item.href)}
                        title={<HiChevronRight size={25} />}
                      />

                    )
                  }
                  {
                    Array.isArray(item.subItems) && item.subItems.length > 0 && openSubItems[item.href] && (
                      <Button
                        isHover={false}
                        type="button"
                        onClick={() => toggleSubItems(item.href)}
                        title={<HiChevronDown size={25} />}
                      />

                    )
                  }
                </div>
                {
                  openSubItems[item.href] &&
                  <div className="ml-2">
                    {
                      item.subItems?.map(subItem => {
                        const isSubActive = pathname.includes(subItem.href)
                        return (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`
                              flex items-center rounded-md px-3 py-2 transition mb-2
                              ${isSubActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}
                              ${collapsed ? "justify-center gap-0 px-2" : "gap-3"}
                            `}
                          >
                            <Icon className="h-5 w-5" />
                            {!collapsed && subItem.label}
                          </Link>
                        )
                      })
                    }
                  </div>
                }
              </div>
            );
          })}
        </nav>

        {/* LOGOUT */}
        {mobileOpen && (
          <div className="md:hidden p-4">
            <button className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        )}

        {!collapsed && (
          <div className="hidden md:block p-4">
            <button className="w-full py-2 bg-red-500 text-white rounded hover:bg-red-600">
              Logout
            </button>
          </div>
        )}

        {collapsed && (
          <div className="hidden md:flex p-2 justify-center">
            <button className="w-10 h-10 bg-red-500 text-white rounded flex items-center justify-center hover:bg-red-600">
              <HiMenu className="rotate-90" />
            </button>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT */}
      <div
        className={`
          flex-1 transition-all duration-300 overflow-auto
          
        `}
      >
        {/* HAMBURGER (ALWAYS OUTSIDE SIDEBAR) */}
        <div className="md:hidden p-3 bg-white">
          <button
            onClick={toggleMobileOpen}
            className="p-2 rounded shadow-sm bg-white"
          >
            <HiMenu className="h-5 w-5" />
          </button>
        </div>

        <main className="p-6">{children}</main>
      </div>
    </div>
  );
};

export default Sidebar;
