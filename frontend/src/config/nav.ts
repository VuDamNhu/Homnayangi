export const publicNav = [
  { label: "Trang chủ", href: "/" },
  { label: "Danh mục", href: "/category" },
  { label: "Vòng quay", href: "/lucky-wheel" },
  { label: "Nguyên liệu", href: "/ingredients" },
  { label: "Nhà hàng", href: "/restaurants" },
] as const;

export const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
  { label: "Món ăn", href: "/admin/dishes", icon: "UtensilsCrossed" },
  { label: "Công thức", href: "/admin/recipes", icon: "BookOpen" },
  { label: "Danh mục", href: "/admin/categories", icon: "Tag" },
  { label: "Nguyên liệu", href: "/admin/ingredients", icon: "Leaf" },
  { label: "Banner", href: "/admin/banners", icon: "Image" },
  { label: "Phản hồi", href: "/admin/feedbacks", icon: "MessageSquare" },
  { label: "Thông báo", href: "/admin/notifications", icon: "Bell" },
  { label: "Analytics", href: "/admin/analytics", icon: "BarChart2" },
  { label: "Cài đặt", href: "/admin/settings", icon: "Settings" },
] as const;
