import NearMeClient from "./_components/NearMeClient";

export const metadata = {
  title: "Gần Tôi - Quán Ăn Gần Bạn",
  description: "Tìm kiếm và lọc các quán ăn ngon gần vị trí của bạn.",
};

export default function NearMePage() {
  return (
    <div className="min-h-screen bg-zen-cream">
      <NearMeClient />
    </div>
  );
}
