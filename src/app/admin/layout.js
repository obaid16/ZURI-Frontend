"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  MailWarning,
  FileText,
  Users,
  Settings as SettingsIcon,
  Menu,
  X,
  Bell,
  ChevronDown,
  LogOut,
  User as UserIcon,
  Loader2,
  Zap,
  ExternalLink,
  Clock,
  Building2,
  CheckCheck,
  ArrowRight
} from "lucide-react";
import ZuriLogo from "@/components/ZuriLogo";
import { apiRequest } from "@/utils/api";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const notifRef = useRef(null);

  useEffect(() => {
    setMobileSidebarOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  // Fetch unified notification feed
  const fetchNotifications = useCallback(async () => {
    if (!user || user.role !== "admin") return;
    try {
      setNotifLoading(true);
      const res = await apiRequest("/dashboard/notifications", "GET");
      if (res && res.success) {
        setNotifications(res.notifications || []);
        setPendingCount(res.unread || 0);
      }
    } catch (e) {
      // silently fail — notifications are non-critical
    } finally {
      setNotifLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  // Per-type icon/colour config
  const notifConfig = {
    inquiry_new:       { color: "#10b7ff", bg: "bg-[#10b7ff]/10", border: "border-[#10b7ff]/20", badgeClass: "bg-[#10b7ff]/10 border-[#10b7ff]/20 text-[#10b7ff]",  icon: MailWarning },
    inquiry_reviewed:  { color: "#f59e0b", bg: "bg-amber-500/10",  border: "border-amber-500/20",  badgeClass: "bg-amber-500/10 border-amber-500/20 text-amber-400",    icon: Clock },
    inquiry_completed: { color: "#10b981", bg: "bg-emerald-500/10", border: "border-emerald-500/20", badgeClass: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", icon: CheckCheck },
    user_registered:   { color: "#a78bfa", bg: "bg-purple-500/10", border: "border-purple-500/20", badgeClass: "bg-purple-500/10 border-purple-500/20 text-purple-400",  icon: Users },
    blog_published:    { color: "#fb923c", bg: "bg-orange-500/10", border: "border-orange-500/20", badgeClass: "bg-orange-500/10 border-orange-500/20 text-orange-400",  icon: FileText },
    low_stock:         { color: "#ef4444", bg: "bg-red-500/10",    border: "border-red-500/20",    badgeClass: "bg-red-500/10 border-red-500/20 text-red-400",          icon: Package },
  };

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !isLoginPage) {
      if (!user || user.role !== "admin") {
        router.push("/admin/login");
      }
    }
  }, [user, loading, isLoginPage, router]);

  if (loading && !isLoginPage) {
    return (
      <div className="min-h-screen bg-[#030303] flex flex-col items-center justify-center space-y-4 text-white">
        <div className="relative">
          <div className="w-16 h-16 rounded-full border border-[#10b7ff]/20 flex items-center justify-center">
            <Loader2 className="w-7 h-7 text-[#10b7ff] animate-spin" />
          </div>
          <div className="absolute inset-0 rounded-full bg-[#10b7ff]/5 blur-xl" />
        </div>
        <span className="text-[10px] tracking-[0.3em] uppercase text-white/40 font-bold">Verifying Admin Access</span>
      </div>
    );
  }

  if (!isLoginPage && (!user || user.role !== "admin")) {
    return (
      <div className="min-h-screen bg-[#030303] flex items-center justify-center text-white text-[10px] tracking-widest uppercase text-white/30">
        Redirecting...
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const navSections = [
    {
      label: "Core",
      items: [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Inquiries", href: "/admin/inquiries", icon: MailWarning, badge: pendingCount > 0 ? String(pendingCount) : null },
      ]
    },
    {
      label: "Catalog",
      items: [
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Categories", href: "/admin/categories", icon: FolderTree },
        { name: "Blog Posts", href: "/admin/blogs", icon: FileText },
      ]
    },
    {
      label: "Management",
      items: [
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Settings", href: "/admin/settings", icon: SettingsIcon },
      ]
    }
  ];

  const breadcrumbs = pathname
    .split("/")
    .filter(Boolean)
    .map((crumb) => crumb.charAt(0).toUpperCase() + crumb.slice(1));

  const SidebarContent = ({ compact = false }) => (
    <>
      {/* Logo area */}
      <div className={`flex items-center border-b border-white/5 ${compact ? "h-16 px-5 justify-center" : "h-16 px-6 justify-between"}`}>
        {compact ? (
          <span className="text-[#10b7ff] font-serif font-black text-xl tracking-widest">Z</span>
        ) : (
          <>
            <Link href="/admin/dashboard">
              <ZuriLogo className="scale-75 origin-left" />
            </Link>
            <span className="text-[8px] uppercase tracking-[0.3em] text-white/20 font-bold border border-white/10 px-1.5 py-0.5 rounded">
              Admin
            </span>
          </>
        )}
      </div>

      {/* Status pill */}
      {!compact && (
        <div className="px-4 pt-5 pb-2">
          <div className="flex items-center space-x-2 bg-emerald-500/5 border border-emerald-500/15 rounded-lg px-3 py-2">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-widest">Live • All Systems OK</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-5 overflow-y-auto">
        {navSections.map((section) => (
          <div key={section.label}>
            {!compact && (
              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-white/20 px-3 mb-2">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={compact ? item.name : undefined}
                    className={`group flex items-center rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-150 ${
                      compact ? "justify-center p-3" : "space-x-3 px-3 py-2.5"
                    } ${
                      isActive
                        ? "bg-[#10b7ff]/10 text-[#10b7ff] border border-[#10b7ff]/25 shadow-[0_0_20px_rgba(16,183,255,0.07)]"
                        : "text-white/45 hover:bg-white/5 hover:text-white/80 border border-transparent"
                    }`}
                  >
                    <Icon className={`shrink-0 ${compact ? "w-4.5 h-4.5" : "w-4 h-4"} ${isActive ? "text-[#10b7ff]" : "text-white/35 group-hover:text-white/60"}`} />
                    {!compact && (
                      <span className="flex-1">{item.name}</span>
                    )}
                    {!compact && item.badge && (
                      <span className="text-[8px] bg-[#10b7ff]/15 text-[#10b7ff] border border-[#10b7ff]/30 px-1.5 py-0.5 rounded font-black">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-white/5 space-y-1">
        {!compact && (
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-3 px-3 py-2.5 rounded-lg text-[11px] font-bold uppercase tracking-wider text-white/40 hover:text-white/70 hover:bg-white/5 transition-all border border-transparent"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Storefront</span>
          </Link>
        )}
        <button
          onClick={() => { logout(); router.push("/admin/login"); }}
          className={`w-full flex items-center rounded-lg text-[11px] font-bold uppercase tracking-wider text-red-400/60 hover:text-red-400 hover:bg-red-950/20 transition-all border border-transparent cursor-pointer ${
            compact ? "justify-center p-3" : "space-x-3 px-3 py-2.5"
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!compact && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#030303] text-white flex">

      {/* DESKTOP SIDEBAR */}
      <aside className={`hidden md:flex flex-col bg-[#080808] border-r border-white/[0.06] transition-all duration-300 relative z-30 ${sidebarOpen ? "w-60" : "w-[68px]"}`}>
        <SidebarContent compact={!sidebarOpen} />
      </aside>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-60 bg-[#080808] border-r border-white/[0.06] flex flex-col h-full z-10">
            <div className="absolute top-4 right-4">
              <button onClick={() => setMobileSidebarOpen(false)} className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <SidebarContent compact={false} />
          </div>
        </div>
      )}

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">

        {/* TOP BAR */}
        <header className="h-14 border-b border-white/[0.06] flex items-center justify-between px-5 bg-[#080808]/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            {/* Sidebar toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
            >
              <Menu className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden flex items-center justify-center w-7 h-7 rounded-md bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-all"
            >
              <Menu className="w-3.5 h-3.5" />
            </button>

            {/* Breadcrumbs */}
            <div className="hidden sm:flex items-center space-x-2 text-[10px] uppercase font-bold tracking-widest">
              {breadcrumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center space-x-2">
                  {idx > 0 && <span className="text-white/15">›</span>}
                  <span className={idx === breadcrumbs.length - 1 ? "text-white/70" : "text-white/25"}>
                    {crumb}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Live indicator */}
            <div className="hidden lg:flex items-center space-x-1.5 text-[9px] text-emerald-400/70 font-bold uppercase tracking-widest">
              <Zap className="w-3 h-3" />
              <span>Live</span>
            </div>

            <div className="w-px h-4 bg-white/10 mx-1 hidden lg:block" />

            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }}
                className={`relative p-1.5 rounded-lg transition-colors ${notifOpen ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"}`}
              >
                <Bell className="w-4 h-4" />
                {pendingCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#10b7ff] text-black text-[8px] font-black rounded-full flex items-center justify-center px-1">
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#0d0d0d] border border-white/[0.09] rounded-xl shadow-2xl z-50 overflow-hidden text-xs">
                  {/* Panel header */}
                  <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/[0.06] bg-[#111]">
                    <div className="flex items-center space-x-2">
                      <Bell className="w-3.5 h-3.5 text-[#10b7ff]" />
                      <span className="font-black uppercase tracking-widest text-white text-[10px]">Notifications</span>
                      {pendingCount > 0 && (
                        <span className="bg-[#10b7ff]/15 border border-[#10b7ff]/25 text-[#10b7ff] text-[8px] font-black px-1.5 py-0.5 rounded">
                          {pendingCount} pending
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => setNotifOpen(false)}
                      className="text-white/30 hover:text-white transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Panel body */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-white/[0.04]">
                    {notifLoading ? (
                      <div className="flex items-center justify-center py-8 space-x-2 text-white/30">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-[10px] font-semibold">Fetching updates...</span>
                      </div>
                    ) : notifications.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-2">
                        <CheckCheck className="w-6 h-6 text-white/15" />
                        <p className="text-white/25 text-[10px] font-bold uppercase tracking-wider">All caught up!</p>
                        <p className="text-white/15 text-[9px]">No new events in the last 30 days.</p>
                      </div>
                    ) : (
                      notifications.map((n) => {
                        const cfg = notifConfig[n.type] || notifConfig.inquiry_new;
                        const IconComp = cfg.icon;
                        return (
                          <Link
                            key={n.id}
                            href={n.href}
                            onClick={() => setNotifOpen(false)}
                            className="flex items-start space-x-3 px-4 py-3 hover:bg-white/[0.03] transition-colors"
                          >
                            {/* Type icon */}
                            <div className={`w-7 h-7 rounded-full ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0 mt-0.5`}>
                              <IconComp className="w-3.5 h-3.5" style={{ color: cfg.color }} />
                            </div>
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <p className="font-bold text-white/80 text-[11px] leading-snug">{n.title}</p>
                                <span className="text-[9px] text-white/20 font-semibold shrink-0 mt-0.5">{timeAgo(n.timestamp)}</span>
                              </div>
                              <p className="text-[10px] text-white/40 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                              <span className={`inline-block mt-1.5 text-[8px] border px-1.5 py-0.5 rounded font-black uppercase tracking-wider ${cfg.badgeClass}`}>
                                {n.badge}
                              </span>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>

                  {/* Panel footer */}
                  <div className="border-t border-white/[0.06] px-4 py-2.5 flex items-center justify-between">
                    <span className="text-[9px] text-white/20 font-semibold">Last 30 days · auto-refresh 60s</span>
                    <Link
                      href="/admin/inquiries"
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center space-x-1 text-[#10b7ff] hover:text-[#10b7ff]/80 font-bold uppercase tracking-wider text-[9px] transition-colors"
                    >
                      <span>All Inquiries</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center space-x-2 pl-2 pr-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-xs"
              >
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#10b7ff]/30 to-[#10b7ff]/10 border border-[#10b7ff]/30 flex items-center justify-center">
                  <UserIcon className="w-3 h-3 text-[#10b7ff]" />
                </div>
                <span className="hidden sm:inline-block max-w-[90px] truncate text-white/70 font-semibold text-[11px]">{user?.name?.split(" ")[0]}</span>
                <ChevronDown className="w-3 h-3 text-white/30" />
              </button>

              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full mt-1.5 w-52 bg-[#0d0d0d] border border-white/10 rounded-xl shadow-2xl py-1.5 z-50 text-xs overflow-hidden">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="font-bold text-white text-[11px] truncate">{user?.name}</p>
                      <p className="text-[10px] text-white/35 truncate mt-0.5">{user?.email}</p>
                      <span className="inline-block mt-1.5 text-[8px] bg-[#10b7ff]/10 border border-[#10b7ff]/25 text-[#10b7ff] px-2 py-0.5 rounded font-black uppercase tracking-wider">Administrator</span>
                    </div>
                    <Link
                      href="/admin/settings"
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-white/55 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <SettingsIcon className="w-3.5 h-3.5" />
                      <span className="font-semibold">Console Settings</span>
                    </Link>
                    <Link
                      href="/"
                      target="_blank"
                      className="flex items-center space-x-2.5 px-4 py-2.5 text-white/55 hover:bg-white/5 hover:text-white transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span className="font-semibold">View Storefront</span>
                    </Link>
                    <div className="border-t border-white/5 mt-1 pt-1">
                      <button
                        onClick={() => { setProfileOpen(false); logout(); router.push("/admin/login"); }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2.5 text-red-400/70 hover:bg-red-950/20 hover:text-red-400 text-left cursor-pointer transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span className="font-semibold">Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto bg-[#030303]">
          {children}
        </main>
      </div>
    </div>
  );
}
