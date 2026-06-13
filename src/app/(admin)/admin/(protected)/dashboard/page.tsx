import type { Metadata } from "next";
import Link from "next/link";
import {
  UtensilsCrossed,
  BookOpen,
  Eye,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Search,
  Plus,
  BarChart2,
  Tag,
  Pencil,
  Flame,
} from "lucide-react";

export const metadata: Metadata = { title: "Dashboard — Admin" };

/* ─── Mock data ─────────────────────────────────────────────────────────── */

const stats = [
  {
    label: "Tổng món ăn",
    value: "248",
    change: "+12",
    trend: "up" as const,
    sub: "so với tháng trước",
    icon: UtensilsCrossed,
    href: "/admin/dishes",
    color: "amber",
    spark: [30, 42, 38, 55, 48, 62, 58],
  },
  {
    label: "Công thức",
    value: "1,034",
    change: "+38",
    trend: "up" as const,
    sub: "so với tháng trước",
    icon: BookOpen,
    href: "/admin/recipes",
    color: "blue",
    spark: [50, 58, 54, 70, 65, 80, 75],
  },
  {
    label: "Lượt xem (30d)",
    value: "18,420",
    change: "+2,140",
    trend: "up" as const,
    sub: "so với kỳ trước",
    icon: Eye,
    href: "/admin/analytics",
    color: "green",
    spark: [40, 60, 55, 75, 70, 90, 85],
  },
  {
    label: "Tìm kiếm (7d)",
    value: "4,231",
    change: "-180",
    trend: "down" as const,
    sub: "so với tuần trước",
    icon: Search,
    href: "/admin/analytics",
    color: "red",
    spark: [80, 70, 75, 60, 65, 55, 58],
  },
];

// 30-day view history for area chart
const viewHistory = [
  320, 410, 380, 450, 430, 510, 490, 540, 560, 590,
  570, 620, 600, 650, 640, 680, 660, 710, 700, 740,
  720, 770, 760, 800, 790, 830, 820, 870, 850, 910,
];

const topDishes = [
  { name: "Phở bò tái chín", views: 4820, category: "Súp" },
  { name: "Bún bò Huế", views: 3610, category: "Súp" },
  { name: "Cơm tấm sườn nướng", views: 3120, category: "Cơm" },
  { name: "Bánh mì pate thịt", views: 2740, category: "Bánh mì" },
  { name: "Gỏi cuốn tôm thịt", views: 2280, category: "Khai vị" },
];

const recentDishes = [
  { name: "Phở bò tái", category: "Súp", status: "active", createdAt: "13/06/2026", views: 4820 },
  { name: "Bún bò Huế", category: "Súp", status: "active", createdAt: "12/06/2026", views: 3610 },
  { name: "Cơm tấm sườn", category: "Cơm", status: "active", createdAt: "11/06/2026", views: 3120 },
  { name: "Bánh mì thịt nướng", category: "Bánh mì", status: "draft", createdAt: "10/06/2026", views: 0 },
  { name: "Gỏi cuốn tôm thịt", category: "Khai vị", status: "active", createdAt: "09/06/2026", views: 2280 },
  { name: "Bún chả Hà Nội", category: "Bún", status: "active", createdAt: "08/06/2026", views: 1940 },
];

const categories = [
  { name: "Súp & Bún", pct: 35, count: 87 },
  { name: "Cơm", pct: 28, count: 69 },
  { name: "Khai vị", pct: 18, count: 45 },
  { name: "Bánh mì", pct: 12, count: 30 },
  { name: "Tráng miệng", pct: 7, count: 17 },
];

const quickActions = [
  { label: "Thêm món ăn", href: "/admin/dishes/new", icon: Plus, bg: "bg-zen-gold", text: "text-zen-ink" },
  { label: "Thêm công thức", href: "/admin/recipes/new", icon: BookOpen, bg: "bg-zen-ink", text: "text-white" },
  { label: "Danh mục", href: "/admin/categories", icon: Tag, bg: "bg-white", text: "text-zen-ink", border: true },
  { label: "Analytics", href: "/admin/analytics", icon: BarChart2, bg: "bg-white", text: "text-zen-ink", border: true },
];

/* ─── SVG Area Chart ─────────────────────────────────────────────────────── */
function buildAreaPath(data: number[], w = 400, h = 100) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 8;

  const pts = data.map((v, i) => ({
    x: +((i / (data.length - 1)) * w).toFixed(2),
    y: +(pad + (1 - (v - min) / range) * (h - pad * 2)).toFixed(2),
  }));

  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const area = `${line} L${w},${h} L0,${h} Z`;
  return { line, area, pts };
}

/* ─── Mini sparkline (pure CSS bars) ────────────────────────────────────── */
function Spark({ bars, color }: { bars: number[]; color: string }) {
  const max = Math.max(...bars);
  const colors: Record<string, string> = {
    amber: "bg-zen-gold",
    blue: "bg-blue-400",
    green: "bg-green-400",
    red: "bg-red-400",
  };
  const cls = colors[color] ?? "bg-zen-gold";

  return (
    <div className="flex items-end gap-0.5 h-8">
      {bars.map((v, i) => (
        <div
          key={i}
          className={`flex-1 ${cls} opacity-70`}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

/* ─── Page ───────────────────────────────────────────────────────────────── */
export default function AdminDashboardPage() {
  const { line, area, pts } = buildAreaPath(viewHistory, 400, 100);

  // X-axis labels: every 5 days
  const xLabels = Array.from({ length: 6 }, (_, i) => ({
    day: i * 6 + 1,
    x: (i * 6) / (viewHistory.length - 1),
  }));

  // Y-axis
  const yMax = Math.max(...viewHistory);
  const yLabels = [0, 0.5, 1].map((t) => Math.round(yMax * t));

  const today = new Date().toLocaleDateString("vi-VN", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <div className="space-y-5 max-w-screen-xl pb-8">

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-2xl font-black uppercase tracking-tight text-zen-ink leading-none">
            Dashboard
          </h1>
          <p className="text-sm text-on-surface-variant mt-1 capitalize">{today}</p>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className={`flex items-center gap-2 px-3 h-8 text-xs font-label font-semibold uppercase tracking-[0.1em] manga-border transition-all hover:-translate-y-px ${a.bg} ${a.text} ${a.border ? "border-zinc-200 hover:border-zen-gold hover:text-zen-gold" : "manga-shadow-sm"}`}
            >
              <a.icon size={13} />
              {a.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ── Stats row ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white manga-border p-4 flex flex-col justify-between gap-3 hover:border-zen-gold group transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-label text-[10px] uppercase tracking-[0.15em] text-on-surface-variant">
                  {s.label}
                </p>
                <p className="font-display text-3xl font-black text-zen-ink tracking-tight mt-1 leading-none">
                  {s.value}
                </p>
              </div>
              <div className="w-9 h-9 bg-zen-gold/10 flex items-center justify-center shrink-0">
                <s.icon size={16} className="text-zen-gold" />
              </div>
            </div>

            <div className="flex items-end justify-between gap-2">
              <div className={`flex items-center gap-1 text-[11px] font-label font-semibold ${s.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                {s.trend === "up" ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {s.change}
                <span className="text-zinc-400 font-normal">{s.sub}</span>
              </div>
            </div>

            <Spark bars={s.spark} color={s.color} />
          </Link>
        ))}
      </div>

      {/* ── Charts row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* Area chart */}
        <div className="lg:col-span-2 bg-white manga-border p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-sm font-black uppercase tracking-tight text-zen-ink">
                Lượt xem
              </h2>
              <p className="font-label text-[10px] uppercase tracking-[0.12em] text-on-surface-variant mt-0.5">
                30 ngày gần nhất
              </p>
            </div>
            <Link
              href="/admin/analytics"
              className="flex items-center gap-1 font-label text-[10px] uppercase tracking-[0.12em] text-zen-gold hover:underline"
            >
              Chi tiết <ArrowRight size={11} />
            </Link>
          </div>

          {/* SVG chart */}
          <div className="relative">
            {/* Y labels */}
            <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between pr-2 pointer-events-none">
              {[...yLabels].reverse().map((v) => (
                <span key={v} className="font-mono text-[9px] text-zinc-400 leading-none">
                  {v.toLocaleString()}
                </span>
              ))}
            </div>

            {/* Chart area */}
            <div className="ml-10 mb-6">
              <svg
                viewBox="0 0 400 100"
                preserveAspectRatio="none"
                className="w-full h-36"
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c5a028" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#c5a028" stopOpacity="0.02" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((t) => (
                  <line
                    key={t}
                    x1="0" y1={t * 100}
                    x2="400" y2={t * 100}
                    stroke="#e4e4e7"
                    strokeWidth="0.5"
                  />
                ))}
                {/* Area fill */}
                <path d={area} fill="url(#areaGrad)" />
                {/* Line */}
                <path
                  d={line}
                  fill="none"
                  stroke="#c5a028"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                  vectorEffect="non-scaling-stroke"
                />
                {/* Last point dot */}
                <circle
                  cx={pts[pts.length - 1].x}
                  cy={pts[pts.length - 1].y}
                  r="3"
                  fill="#c5a028"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>

              {/* X-axis labels */}
              <div className="relative h-5 mt-1">
                {xLabels.map(({ day, x }) => (
                  <span
                    key={day}
                    className="absolute font-mono text-[9px] text-zinc-400 -translate-x-1/2"
                    style={{ left: `${x * 100}%` }}
                  >
                    {day}/06
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Summary strip */}
          <div className="flex items-center gap-6 pt-2 border-t border-zinc-100">
            <div>
              <p className="font-mono text-base font-bold text-zen-ink">18,420</p>
              <p className="font-label text-[9px] uppercase tracking-[0.12em] text-on-surface-variant">Tổng views</p>
            </div>
            <div>
              <p className="font-mono text-base font-bold text-zen-ink">614</p>
              <p className="font-label text-[9px] uppercase tracking-[0.12em] text-on-surface-variant">Trung bình / ngày</p>
            </div>
            <div>
              <p className="font-mono text-base font-bold text-green-600">+910</p>
              <p className="font-label text-[9px] uppercase tracking-[0.12em] text-on-surface-variant">Cao nhất</p>
            </div>
          </div>
        </div>

        {/* Hot keywords */}
        <div className="bg-white manga-border p-5 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <Flame size={14} className="text-zen-gold" />
            <h2 className="font-display text-sm font-black uppercase tracking-tight text-zen-ink">
              Tìm kiếm hot
            </h2>
          </div>
          <p className="font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant -mt-2">
            7 ngày gần nhất
          </p>

          <ul className="space-y-3 flex-1">
            {[
              { keyword: "phở bò", count: 842, trend: "up" as const },
              { keyword: "bún bò huế", count: 613, trend: "up" as const },
              { keyword: "cơm tấm", count: 589, trend: "down" as const },
              { keyword: "bánh mì", count: 420, trend: "up" as const },
              { keyword: "gà rán", count: 314, trend: "down" as const },
              { keyword: "canh chua", count: 276, trend: "up" as const },
            ].map((kw, i) => {
              const maxCount = 842;
              return (
                <li key={kw.keyword}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-label text-[9px] text-zinc-400 w-4 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="flex-1 text-xs font-medium text-zen-ink truncate">
                      {kw.keyword}
                    </span>
                    <span className="font-mono text-[10px] text-on-surface-variant">{kw.count}</span>
                    {kw.trend === "up"
                      ? <TrendingUp size={11} className="text-green-500 shrink-0" />
                      : <TrendingDown size={11} className="text-red-400 shrink-0" />}
                  </div>
                  <div className="ml-6 h-0.5 bg-zinc-100">
                    <div
                      className="h-full bg-zen-gold/60"
                      style={{ width: `${(kw.count / maxCount) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* ── Bottom row ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">

        {/* Recent dishes table */}
        <div className="lg:col-span-2 bg-white manga-border">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
            <h2 className="font-display text-sm font-black uppercase tracking-tight text-zen-ink">
              Món ăn mới thêm
            </h2>
            <Link
              href="/admin/dishes"
              className="flex items-center gap-1 font-label text-[10px] uppercase tracking-[0.12em] text-zen-gold hover:underline"
            >
              Tất cả <ArrowRight size={11} />
            </Link>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-50">
                {["Tên món", "Danh mục", "Trạng thái", "Views", ""].map((h, i) => (
                  <th
                    key={i}
                    className="text-left px-5 py-2.5 font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentDishes.map((dish, i) => (
                <tr
                  key={dish.name}
                  className={`hover:bg-zen-gold/5 transition-colors ${i < recentDishes.length - 1 ? "border-b border-zinc-50" : ""}`}
                >
                  <td className="px-5 py-3 font-medium text-zen-ink text-sm">{dish.name}</td>
                  <td className="px-5 py-3 text-on-surface-variant text-xs">{dish.category}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1.5 font-label text-[9px] uppercase tracking-[0.1em] px-2 py-0.5 ${dish.status === "active" ? "bg-green-50 text-green-700" : "bg-zinc-100 text-zinc-500"}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${dish.status === "active" ? "bg-green-500" : "bg-zinc-400"}`} />
                      {dish.status === "active" ? "Hoạt động" : "Nháp"}
                    </span>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-on-surface-variant">
                    {dish.views > 0 ? dish.views.toLocaleString() : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Link href="/admin/dishes" className="inline-flex items-center gap-1 font-label text-[10px] text-zen-gold hover:underline">
                      <Pencil size={11} /> Sửa
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top dishes by views */}
        <div className="bg-white manga-border p-5 flex flex-col gap-4">
          <div>
            <h2 className="font-display text-sm font-black uppercase tracking-tight text-zen-ink">
              Top món xem nhiều
            </h2>
            <p className="font-label text-[9px] uppercase tracking-[0.12em] text-on-surface-variant mt-0.5">
              30 ngày gần nhất
            </p>
          </div>

          <ul className="space-y-4 flex-1">
            {topDishes.map((d, i) => {
              const maxViews = topDishes[0].views;
              return (
                <li key={d.name}>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-display text-xl font-black text-zen-gold/30 leading-none w-6 shrink-0">
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-zen-ink truncate leading-snug">{d.name}</p>
                        <p className="font-label text-[9px] text-on-surface-variant uppercase tracking-[0.1em]">{d.category}</p>
                      </div>
                    </div>
                    <span className="font-mono text-xs font-bold text-zen-ink shrink-0">
                      {d.views.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1 bg-zinc-100">
                    <div
                      className="h-full bg-zen-gold transition-all"
                      style={{ width: `${(d.views / maxViews) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Category breakdown */}
          <div className="pt-3 border-t border-zinc-100 space-y-2">
            <p className="font-label text-[9px] uppercase tracking-[0.15em] text-on-surface-variant">
              Theo danh mục
            </p>
            {categories.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="font-label text-[10px] text-on-surface-variant w-20 shrink-0 truncate">
                  {c.name}
                </span>
                <div className="flex-1 h-1.5 bg-zinc-100">
                  <div
                    className="h-full bg-zen-gold/70"
                    style={{ width: `${c.pct}%` }}
                  />
                </div>
                <span className="font-mono text-[10px] text-zinc-400 w-6 text-right shrink-0">
                  {c.pct}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
