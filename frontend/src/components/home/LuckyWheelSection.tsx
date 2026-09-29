"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

// ── Types ─────────────────────────────────────────────────────────────────────

type DietCategory = "normal" | "vegetarian" | "diet";

interface Discovery {
  title: string;
  xp: number;
  badge: string;
  stars: number;
  img: string;
  slug: string;
}

interface CategoryEntry {
  options: string[];
  discoveries: Discovery[];
}

// ── Data ──────────────────────────────────────────────────────────────────────

const categoryData: Record<DietCategory, CategoryEntry> = {
  normal: {
    options: ["Phở Bò", "Cơm Tấm", "Bún Bò Huế", "Bánh Mì", "Lẩu Thái", "Gà Nướng"],
    discoveries: [
      { title: "Phở Bò Tái Chín", xp: 120, badge: "S-Class", stars: 5, img: "https://picsum.photos/seed/phobo/600/600", slug: "pho-bo" },
      { title: "Cơm Tấm Sườn Bì Chả", xp: 90, badge: "Master", stars: 4, img: "https://picsum.photos/seed/comtam/600/600", slug: "com-tam-suon" },
      { title: "Bún Bò Huế", xp: 100, badge: "Elite", stars: 5, img: "https://picsum.photos/seed/bunbohue/600/600", slug: "bun-bo-hue" },
    ],
  },
  vegetarian: {
    options: ["Phở Chay", "Gỏi Cuốn", "Đậu Hũ Sốt", "Bún Huế Chay", "Cơm Chay", "Mì Quảng Chay"],
    discoveries: [
      { title: "Phở Chay Nấm Hương", xp: 80, badge: "Mindful", stars: 5, img: "https://picsum.photos/seed/phochay/600/600", slug: "pho-chay" },
      { title: "Đậu Hũ Sốt Cà Chua", xp: 70, badge: "Elegant", stars: 4, img: "https://picsum.photos/seed/dauhusot/600/600", slug: "dau-hu-sot" },
      { title: "Rau Củ Xào Chay", xp: 60, badge: "Humble", stars: 5, img: "https://picsum.photos/seed/rauxao/600/600", slug: "rau-cu-xao" },
    ],
  },
  diet: {
    options: ["Salad Gà", "Cơm Gạo Lứt", "Ức Gà Nướng", "Quinoa Bowl", "Trứng Bác Rau", "Cá Hồi Hấp"],
    discoveries: [
      { title: "Salad Gà Ức Tươi", xp: 85, badge: "Vitality", stars: 5, img: "https://picsum.photos/seed/saladga/600/600", slug: "salad-ga" },
      { title: "Cá Hồi Áp Chảo", xp: 95, badge: "Focus", stars: 5, img: "https://picsum.photos/seed/cahoi/600/600", slug: "ca-hoi-ap-chao" },
      { title: "Protein Bowl Rau", xp: 75, badge: "Light", stars: 4, img: "https://picsum.photos/seed/proteinbowl/600/600", slug: "protein-bowl" },
    ],
  },
};

// Vibrant manga palette — matches the mockup
const WHEEL_COLORS = ["#FFD700", "#FF7F50", "#00CED1", "#9370DB", "#98FB98", "#FFB6C1"];

const dietTabs: { label: string; value: DietCategory }[] = [
  { label: "Thường ngày", value: "normal" },
  { label: "Ăn chay", value: "vegetarian" },
  { label: "Ăn kiêng", value: "diet" },
];

// ── Canvas renderer ───────────────────────────────────────────────────────────

function renderWheel(canvas: HTMLCanvasElement, options: string[]) {
  const ctx = canvas.getContext("2d");
  if (!ctx || options.length === 0) return;

  const size = canvas.width;
  const cx = size / 2;
  const radius = cx - 2;
  const arc = (2 * Math.PI) / options.length;
  const fontSize = Math.max(10, Math.min(14, Math.floor(420 / options.length / 3)));

  ctx.clearRect(0, 0, size, size);

  options.forEach((opt, i) => {
    const startAngle = i * arc;

    // Vibrant segment fill
    ctx.beginPath();
    ctx.fillStyle = WHEEL_COLORS[i % WHEEL_COLORS.length];
    ctx.moveTo(cx, cx);
    ctx.arc(cx, cx, radius, startAngle, startAngle + arc);
    ctx.closePath();
    ctx.fill();

    // Divider line
    ctx.beginPath();
    ctx.strokeStyle = "rgba(0,0,0,0.15)";
    ctx.lineWidth = 2;
    ctx.moveTo(cx, cx);
    ctx.lineTo(
      cx + Math.cos(startAngle) * radius,
      cx + Math.sin(startAngle) * radius
    );
    ctx.stroke();

    // Label — Space Grotesk (font-label hệ thống), dark ink on vibrant bg
    ctx.save();
    ctx.translate(cx, cx);
    ctx.rotate(startAngle + arc / 2);
    ctx.fillStyle = "#1b1b1e";
    ctx.font = `700 ${fontSize}px "Space Grotesk", sans-serif`;
    ctx.textAlign = "right";
    ctx.shadowColor = "rgba(255,255,255,0.5)";
    ctx.shadowBlur = 4;
    const label = opt.length > 13 ? opt.substring(0, 12) + "…" : opt;
    ctx.fillText(label.toUpperCase(), radius - 36, fontSize / 3);
    ctx.restore();
  });

  // Center white circle
  ctx.beginPath();
  ctx.arc(cx, cx, 54, 0, 2 * Math.PI);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
}

// ── Component ─────────────────────────────────────────────────────────────────

export function LuckyWheelSection() {
  const [activeCategory, setActiveCategory] = useState<DietCategory>("normal");
  const [options, setOptions] = useState<string[]>([...categoryData.normal.options]);
  const [customInput, setCustomInput] = useState("");
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalResult, setModalResult] = useState("");
  const [wheelDeg, setWheelDeg] = useState(0);
  const t = useTranslations("LuckyWheel");
  const locale = useLocale();
  const [apiData, setApiData] = useState<any>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetch(`/api/discover?locale=${locale}`)
      .then(res => res.json())
      .then(data => {
        setApiData(data);
        if (data.categories && data.categories[activeCategory]) {
          setOptions([...data.categories[activeCategory].options]);
        }
      })
      .catch(console.error);
  }, [locale]);

  useEffect(() => {
    if (canvasRef.current) renderWheel(canvasRef.current, options);
  }, [options]);

  const changeCategory = useCallback((cat: DietCategory) => {
    setActiveCategory(cat);
    if (apiData && apiData.categories[cat]) {
      setOptions([...apiData.categories[cat].options]);
    } else {
      setOptions([...categoryData[cat].options]);
    }
  }, [apiData]);

  const spin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);

    const extra = 2160 + Math.random() * 1800;
    const newDeg = rotation + extra;
    setRotation(newDeg);
    setWheelDeg(newDeg);

    setTimeout(() => {
      setIsSpinning(false);
      const seg = 360 / options.length;
      const idx = Math.floor(((360 - (newDeg % 360)) + 270) % 360 / seg) % options.length;
      setModalResult(options[idx]);
      setModalVisible(true);
    }, 5100);
  }, [isSpinning, rotation, options]);

  const removeOption = useCallback(
    (idx: number) => {
      if (options.length <= 2) return;
      setOptions((prev) => prev.filter((_, i) => i !== idx));
    },
    [options.length]
  );

  const addOption = useCallback(() => {
    const val = customInput.trim();
    if (!val || options.length >= 12) return;
    setOptions((prev) => [...prev, val]);
    setCustomInput("");
  }, [customInput, options.length]);

  const discoveries = apiData ? apiData.categories[activeCategory].discoveries : categoryData[activeCategory].discoveries;
  const currentTabs = apiData ? apiData.tabs : dietTabs;

  return (
    <>
      {/* ── Result Modal ──────────────────────────────────────────────────────── */}
      {modalVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zen-ink/40 backdrop-blur-md">
          <div
            className="bg-zen-cream max-w-lg w-full mx-4 p-0.5 border border-zen-gold/30"
            style={{ boxShadow: "0 10px 40px -10px rgba(197,160,40,0.2)" }}
          >
            <div className="bg-zen-cream p-10 border border-zen-gold/20 relative overflow-hidden">
              {/* Corner accents */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-zen-gold/40 pointer-events-none" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-zen-gold/40 pointer-events-none" />

              <div className="text-center space-y-7">
                <p className="font-label text-[10px] uppercase tracking-[0.5em] text-zen-gold">
                  {t("fateDecided")}
                </p>
                <h2 className="font-display text-3xl font-black italic uppercase leading-tight tracking-tight text-on-surface">
                  {t("dishToday")} {modalResult.toUpperCase()}
                </h2>
                <div className="aspect-video overflow-hidden border border-zen-gold/10">
                  <Image
                    src={`https://picsum.photos/seed/${encodeURIComponent(modalResult)}/600/340`}
                    alt={modalResult}
                    width={600}
                    height={340}
                    className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-700"
                  />
                </div>
                <p className="font-body text-on-surface-variant text-sm leading-relaxed max-w-xs mx-auto">
                  {t("newJourney")} <span className="text-zen-gold font-bold">+50 XP</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link
                    href={`/search?q=${encodeURIComponent(modalResult)}&diet=${activeCategory}`}
                    className="flex-1 bg-zen-gold text-white py-4 font-label text-[10px] uppercase tracking-[0.2em] text-center hover:bg-zen-ink transition-all"
                  >
                    {t("seeRecipe")}
                  </Link>
                  <button
                    onClick={() => setModalVisible(false)}
                    className="flex-1 border border-zen-gold text-zen-gold py-4 font-label text-[10px] uppercase tracking-[0.2em] hover:bg-zen-gold/5 transition-all"
                  >
                    {t("goBack")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Page ─────────────────────────────────────────────────────────────── */}
      <div className="min-h-screen relative overflow-hidden">

        {/* ── Hero + Wheel ────────────────────────────────────────────────────── */}
        <section className="relative px-5 md:px-[60px] py-20 flex flex-col items-center">

          {/* Headline */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 text-center mb-16"
          >
            <h1 className="font-display text-[clamp(2.8rem,8vw,4.5rem)] text-on-surface font-black italic uppercase leading-[0.9] tracking-tighter mb-4">
              {t("title")} <br />
              <span className="text-zen-gold">{t("subtitle")}</span>
            </h1>
            <div className="mt-8 inline-block px-8 py-1.5 border border-zen-gold/20 rounded-full">
              <p className="font-label text-[9px] tracking-[0.5em] text-on-surface-variant uppercase">
                {t("journey")}
              </p>
            </div>
          </motion.div>

          {/* Category tabs */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex gap-10 md:gap-14 mb-16 z-20 border-b border-zen-gold/10 w-full max-w-xl justify-center relative"
          >
            {currentTabs.map((tab: any) => (
              <button
                key={tab.value}
                onClick={() => changeCategory(tab.value)}
                className={cn(
                  "pb-4 font-label text-[10px] uppercase tracking-[0.3em] border-b-2 -mb-px transition-all",
                  activeCategory === tab.value
                    ? "text-zen-gold border-zen-gold"
                    : "text-on-surface-variant hover:text-zen-gold border-transparent"
                )}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>

          {/* Wheel + right panel row */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
            className="relative w-full max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-10 mt-4"
          >

            {/* ── Background decorations ─────────────────────────────────────── */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10 overflow-visible">
              {/* Ambient glow */}
              <div className="w-[600px] h-[600px] bg-zen-gold/5 rounded-full blur-[100px] animate-pulse" />
              {/* Rotating ray lines */}
              <div className="absolute w-[800px] h-[800px] animate-rotate-slow opacity-20">
                {[0, 60, 120, 180, 240, 300].map((deg) => (
                  <div
                    key={deg}
                    className="absolute top-0 left-1/2 w-px h-1/2 bg-gradient-to-t from-zen-gold/40 to-transparent origin-bottom"
                    style={{ transform: `translateX(-50%) rotate(${deg}deg)` }}
                  />
                ))}
              </div>
            </div>



            {/* ── Left panel ─────────────────────────────────────────────────── */}
            <div className="hidden lg:flex flex-1 justify-end lg:pr-10">
              <div className="flex flex-col justify-center gap-6 w-full max-w-sm relative z-10 text-right opacity-80 hover:opacity-100 transition-opacity">
                <div className="flex justify-end mb-2">
                  <div className="w-12 h-12 rounded-full border border-zen-gold/30 flex items-center justify-center bg-zen-gold/5 text-zen-gold text-2xl shadow-[0_0_15px_rgba(197,160,40,0.1)]">
                    ✨
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-black italic uppercase tracking-tight text-on-surface mb-3">
                    {t("dontKnow")}
                  </h3>
                  <p className="font-body text-sm text-on-surface-variant leading-relaxed">
                    {t("letWheelDecide")}
                  </p>
                </div>
                
                <div className="pt-6 border-t border-zen-gold/10 mt-2">
                  <p className="font-label text-[10px] uppercase tracking-[0.2em] text-zen-gold/80">
                    {t("tip")}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Lucky Wheel ────────────────────────────────────────────────── */}
            <div className="relative w-[320px] h-[320px] md:w-[480px] md:h-[480px] shrink-0">

              {/* Pointer ▼ */}
              <div className="absolute -top-7 left-1/2 -translate-x-1/2 z-40 scale-125">
                <span
                  className="text-zen-gold leading-none select-none"
                  style={{
                    fontSize: "3rem",
                    filter: "drop-shadow(0 2px 4px rgba(197,160,40,0.4))",
                  }}
                >
                  ▼
                </span>
              </div>

              {/* Outer dark border ring */}
              <div className="absolute -inset-4 border-[12px] border-zen-ink/10 rounded-full z-0" />
              {/* Gold glowing border ring */}
              <div
                className="absolute -inset-4 border-4 border-zen-gold rounded-full z-10"
                style={{ boxShadow: "0 0 25px rgba(197,160,40,0.4)" }}
              />

              {/* Cardinal notch markers */}
              <div className="absolute inset-0 z-20 pointer-events-none">
                <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-3 h-7 bg-zen-gold rounded-full border-2 border-zen-cream" />
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-3 h-7 bg-zen-gold rounded-full border-2 border-zen-cream" />
                <div className="absolute -left-5 top-1/2 -translate-y-1/2 w-7 h-3 bg-zen-gold rounded-full border-2 border-zen-cream" />
                <div className="absolute -right-5 top-1/2 -translate-y-1/2 w-7 h-3 bg-zen-gold rounded-full border-2 border-zen-cream" />
              </div>

              {/* Spinning wheel container */}
              <div
                className="w-full h-full rounded-full border-4 border-zen-ink/90 shadow-2xl overflow-hidden bg-white p-0.5 z-30 relative"
                style={{
                  transform: `rotate(${wheelDeg}deg)`,
                  transition: "transform 5s cubic-bezier(0.15, 0, 0.15, 1)",
                }}
              >
                <motion.canvas
                  key={activeCategory}
                  initial={{ opacity: 0, scale: 0.8, rotate: -30 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  ref={canvasRef}
                  width={540}
                  height={540}
                  className="w-full h-full rounded-full"
                />
              </div>

              {/* SPIN button — center */}
              <button
                onClick={spin}
                disabled={isSpinning}
                className={cn(
                  "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
                  "w-24 h-24 md:w-[7.5rem] md:h-[7.5rem] rounded-full",
                  "flex items-center justify-center overflow-hidden",
                  "active:scale-90 transition-transform pulse-gold-shadow",
                  isSpinning && "opacity-60 cursor-not-allowed"
                )}
              >
                {/* Gold fill */}
                <div className="absolute inset-0 bg-zen-gold border-[6px] border-white/20 rounded-full shadow-inner" />
                {/* Dashed inner rotating ring */}
                <div className="absolute inset-2 border-2 border-white/40 border-dashed rounded-full animate-rotate-slow" />
                {/* Text */}
                <span className="relative z-10 font-display text-white text-xl md:text-2xl uppercase italic tracking-tighter font-black drop-shadow-md">
                  {isSpinning ? "···" : t("spin")}
                </span>
                {/* Shimmer overlay */}
                <div className="absolute inset-0 shimmer opacity-30 rounded-full" />
              </button>
            </div>

            {/* ── Right panel ────────────────────────────────────────────────── */}
            <div className="flex-1 flex justify-center lg:justify-start w-full lg:pl-10">
              <div className="flex flex-col gap-10 w-full max-w-sm relative z-10">

              {/* Current Quests card */}
              <div
                className="bg-zen-cream/60 backdrop-blur-sm border border-zen-gold/20 p-10 relative zen-shadow"
              >
                <div className="absolute -top-3 left-8 bg-zen-gold text-white px-4 py-0.5 font-label text-[9px] uppercase tracking-[0.4em]">
                  {t("listTitle")}
                </div>
                <ul className="space-y-6 max-h-[180px] overflow-y-auto pr-4 scrollbar-thin">
                  <AnimatePresence mode="popLayout">
                    {options.map((opt, idx) => (
                      <motion.li 
                        key={`${opt}-${idx}`}
                        layout
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
                        transition={{ duration: 0.2 }}
                        className="flex justify-between items-center group"
                      >
                        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant flex items-center gap-3">
                          <span
                            className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                            style={{ backgroundColor: WHEEL_COLORS[idx % WHEEL_COLORS.length] }}
                          />
                          {opt}
                        </span>
                        {options.length > 2 && (
                          <button
                            onClick={() => removeOption(idx)}
                            className="w-6 h-6 flex items-center justify-center rounded-full bg-zen-gold/10 text-zen-gold hover:bg-red-500 hover:text-white transition-all ml-2 shrink-0 text-xs"
                            aria-label={`Xoá ${opt}`}
                          >
                            ✕
                          </button>
                        )}
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>

              {/* Add custom quest */}
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addOption()}
                  placeholder={t("addCustom")}
                  className="w-full bg-transparent border-b border-zen-gold/40 p-3 font-label text-[11px] tracking-widest uppercase focus:outline-none focus:border-zen-gold transition-all placeholder:text-on-surface-variant/40"
                />
                <button
                  onClick={addOption}
                  className="w-full bg-zen-ink text-zen-gold py-4 font-label text-[10px] uppercase tracking-[0.3em] hover:bg-zen-gold hover:text-white transition-all shadow-xl"
                >
                  {t("addToWheel")}
                </button>
              </div>
            </div>
            </div>
          </motion.div>
        </section>

        {/* ── Recent Discoveries ────────────────────────────────────────────── */}
        <section className="px-5 md:px-[60px] py-32 border-t border-zen-gold/10 bg-surface-container/20">
          <div className="flex items-center justify-between mb-20">
            <div>
              <h2 className="font-display text-2xl font-black uppercase italic text-zen-gold tracking-tight">
                {t("recentDiscoveries")}
              </h2>
              <p className="font-body text-xs text-on-surface-variant mt-2 tracking-wide uppercase font-semibold opacity-60">
                {t("popularFromCommunity")}
              </p>
            </div>
            <div className="hidden md:block w-32 h-px bg-zen-gold/20" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {discoveries.map((item: any, i: number) => (
              <motion.div
                key={item.slug}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.15 }}
              >
                <Link
                  href={`/dish/${item.slug}`}
                  className="space-y-6 group cursor-pointer block"
                >
                  <div
                    className="aspect-square overflow-hidden border border-zen-gold/5"
                    style={{ boxShadow: "0 10px 30px -10px rgba(197,160,40,0.07)" }}
                  >
                    <Image
                      src={item.img}
                      alt={item.title}
                      width={600}
                      height={600}
                      className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-end gap-2">
                      <h3 className="font-display text-lg font-black uppercase italic text-on-surface tracking-tighter group-hover:text-zen-gold transition-colors leading-tight">
                        {item.title}
                      </h3>
                      <span className="font-label text-[9px] uppercase tracking-widest text-zen-gold shrink-0">
                        +{item.xp} XP
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-label text-[8px] uppercase tracking-[0.3em] text-on-surface-variant opacity-60">
                        {item.badge}
                      </span>
                      <div className="flex gap-px">
                        {Array.from({ length: item.stars }).map((_, i) => (
                          <span key={i} className="text-zen-gold text-[11px] leading-none">
                            ★
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
