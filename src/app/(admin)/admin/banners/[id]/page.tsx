import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = { title: "Chỉnh sửa banner" };

type Props = { params: Promise<{ id: string }> };

export default async function AdminBannerEditPage({ params }: Props) {
  const { id } = await params;

  if (!id) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Chỉnh sửa banner</h1>
      {/* BannerForm */}
    </div>
  );
}
