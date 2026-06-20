"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardSidebar({ session }) {
  const pathname = usePathname();

  // Change this according to your auth session
  const role = session?.user?.role;

  const menus = {
    artist: [
      {
        title: "Manage Artworks",
        href: "/dashboard/artist/manage-artworks",
      },
      {
        title: "Sales History and Premium Package",
        href: "/dashboard/artist/sales-history",
      },
      {
        title: "Profile",
        href: "/dashboard/artist/profile",
      },
    ],

    user: [
      {
        title: "Purchase History",
        href: "/dashboard/user/purchase-history",
      },
      {
        title: "Bought Artworks",
        href: "/dashboard/user/bought-artworks",
      },
      {
        title: "Subscription",
        href: "/dashboard/user/subscription",
      },
      {
        title: "Profile",
        href: "/dashboard/user/profile",
      },
    ],

    admin: [
      {
        title: "Manage Users",
        href: "/dashboard/admin/manage-users",
      },
      {
        title: "Manage Artworks",
        href: "/dashboard/admin/manage-artworks",
      },
      {
        title: "Transactions",
        href: "/dashboard/admin/transactions",
      },
      {
        title: "Analytics",
        href: "/dashboard/admin/analytics",
      },
      {
        title: "Profile",
        href: "/dashboard/admin/profile",
      },
    ],
  };

  const links = menus[role] || [];

  return (
    <aside className="w-64 min-h-screen bg-white border-r shadow-sm">
      {/* Logo */}
      <div className="p-6 border-b">
        <h1 className="text-2xl font-bold text-purple-600">
          Art Gallery
        </h1>

        <p className="text-sm text-gray-500 mt-2">
          {session?.user?.name}
        </p>

        <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full mt-2 inline-block capitalize">
          {role}
        </span>
      </div>

      {/* Menu */}
      <nav className="p-4 flex flex-col gap-2">
        {links.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-3 rounded-lg transition-all font-medium ${
              pathname === item.href
                ? "bg-purple-600 text-white"
                : "text-gray-700 hover:bg-purple-100 hover:text-purple-700"
            }`}
          >
            {item.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}