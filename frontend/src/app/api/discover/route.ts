import { NextResponse } from "next/server";

const data: any = {
  vi: {
    tabs: [
      { label: "Thường ngày", value: "normal" },
      { label: "Ăn chay", value: "vegetarian" },
      { label: "Ăn kiêng", value: "diet" },
    ],
    categories: {
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
      }
    }
  },
  en: {
    tabs: [
      { label: "Everyday", value: "normal" },
      { label: "Vegetarian", value: "vegetarian" },
      { label: "Diet", value: "diet" },
    ],
    categories: {
      normal: {
        options: ["Beef Pho", "Broken Rice", "Spicy Beef Noodle", "Banh Mi", "Thai Hotpot", "Grilled Chicken"],
        discoveries: [
          { title: "Rare Beef Pho", xp: 120, badge: "S-Class", stars: 5, img: "https://picsum.photos/seed/phobo/600/600", slug: "pho-bo" },
          { title: "Broken Rice Pork", xp: 90, badge: "Master", stars: 4, img: "https://picsum.photos/seed/comtam/600/600", slug: "com-tam-suon" },
          { title: "Hue Spicy Noodle", xp: 100, badge: "Elite", stars: 5, img: "https://picsum.photos/seed/bunbohue/600/600", slug: "bun-bo-hue" },
        ],
      },
      vegetarian: {
        options: ["Vegan Pho", "Spring Rolls", "Tomato Tofu", "Vegan Spicy Noodle", "Vegan Rice", "Vegan Quang Noodle"],
        discoveries: [
          { title: "Mushroom Vegan Pho", xp: 80, badge: "Mindful", stars: 5, img: "https://picsum.photos/seed/phochay/600/600", slug: "pho-chay" },
          { title: "Tomato Sauce Tofu", xp: 70, badge: "Elegant", stars: 4, img: "https://picsum.photos/seed/dauhusot/600/600", slug: "dau-hu-sot" },
          { title: "Stir-fried Veggies", xp: 60, badge: "Humble", stars: 5, img: "https://picsum.photos/seed/rauxao/600/600", slug: "rau-cu-xao" },
        ],
      },
      diet: {
        options: ["Chicken Salad", "Brown Rice", "Grilled Chicken Breast", "Quinoa Bowl", "Scrambled Eggs", "Steamed Salmon"],
        discoveries: [
          { title: "Fresh Chicken Salad", xp: 85, badge: "Vitality", stars: 5, img: "https://picsum.photos/seed/saladga/600/600", slug: "salad-ga" },
          { title: "Pan-seared Salmon", xp: 95, badge: "Focus", stars: 5, img: "https://picsum.photos/seed/cahoi/600/600", slug: "ca-hoi-ap-chao" },
          { title: "Protein Veggie Bowl", xp: 75, badge: "Light", stars: 4, img: "https://picsum.photos/seed/proteinbowl/600/600", slug: "protein-bowl" },
        ],
      }
    }
  }
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get("locale") || "vi";
  
  const responseData = data[locale] || data.vi;
  return NextResponse.json(responseData);
}
