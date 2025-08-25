"use client"


import { useState } from "react";
import { useSession } from "next-auth/react";
import { ChevronDownIcon, ChevronRightIcon, HomeIcon, UserIcon, Cog6ToothIcon, Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";


function getMenu(role: string | undefined) {
  const isAdminOrEditor = role === "admin" || role === "editor";
  return [
    {
      label: "Home",
      icon: <HomeIcon className="w-5 h-5" />,
      href: "/",
    },
    isAdminOrEditor && {
      label: "Dashboard",
      icon: <span className="w-5 h-5 inline-block">📊</span>,
      href: "/dashboard",
    },
    {
      label: "News",
      icon: <span className="w-5 h-5 inline-block">📰</span>,
      href: "/news",
    },
    isAdminOrEditor && {
      label: "Users",
      icon: <UserIcon className="w-5 h-5" />,
      submenu: [
        { label: "All Users", href: "/users" },
        { label: "Add User", href: "/users/add" },
      ],
    },
    isAdminOrEditor && {
      label: "Settings",
      icon: <Cog6ToothIcon className="w-5 h-5" />,
      href: "/settings",
    },
  ].filter(Boolean);
}


export function Sidebar() {
  const [open, setOpen] = useState<{ [key: string]: boolean }>({});
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();
  const role = session?.user?.role;
  const menu = getMenu(role);

  return (
    <>
      {/* Burger button for mobile */}
      <button
        className="sm:hidden fixed top-2 left-4 z-50 bg-blue-900 bg-opacity-80 rounded p-2 text-white focus:outline-none"
        onClick={() => setSidebarOpen(true)}
        aria-label="Open sidebar"
      >
        <Bars3Icon className="w-7 h-7" />
      </button>

      {/* Sidebar overlay for mobile */}
      <aside
        className={`
          fixed z-50 top-20 left-0 w-64
          bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700
          text-white shadow-lg
          transform transition-transform duration-200
          rounded-r-2xl
          pt-6 pb-6
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          sm:static sm:translate-x-0 sm:w-56
        `}
  style={{ height: 'auto' }}
      >
        {/* Close button for mobile */}
        <div className="flex sm:hidden justify-end p-2">
          <button onClick={() => setSidebarOpen(false)} aria-label="Close sidebar">
            <XMarkIcon className="w-7 h-7 text-white" />
          </button>
        </div>
        <nav className="flex-1 px-2 flex flex-col">
          <ul className="space-y-1 flex-1 text-sm">
            {menu.filter(Boolean).map((item) => (
              <li key={item.label}>
                {item.submenu ? (
                  <div>
                    <button
                      className="flex items-center w-full px-2 py-2 rounded hover:bg-blue-800/70 transition"
                      onClick={() => setOpen((o) => ({ ...o, [item.label]: !o[item.label] }))}
                    >
                      {item.icon}
                      <span className="ml-3 flex-1 text-left">{item.label}</span>
                      {open[item.label] ? (
                        <ChevronDownIcon className="w-4 h-4 ml-auto" />
                      ) : (
                        <ChevronRightIcon className="w-4 h-4 ml-auto" />
                      )}
                    </button>
                    {open[item.label] && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.submenu.map((sub) => (
                          <li key={sub.label}>
                            <a
                              href={sub.href}
                              className="block px-2 py-1 rounded hover:bg-blue-800/70 text-sm"
                            >
                              {sub.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <a
                    href={item.href}
                    className="flex items-center px-2 py-2 rounded hover:bg-blue-800/70 transition"
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
    </>
  );
}
