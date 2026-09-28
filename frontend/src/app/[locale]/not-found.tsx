import Link from "next/link";
import { PageContainer } from "@/components/layout/PageContainer";

export default function NotFound() {
  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h1 className="text-6xl font-bold text-muted-foreground">404</h1>
        <h2 className="text-2xl font-semibold">Trang không tìm thấy</h2>
        <p className="text-muted-foreground max-w-md">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển.
        </p>
        <div className="flex gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
          >
            Về trang chủ
          </Link>
          <Link
            href="/random"
            className="inline-flex items-center justify-center rounded-md border px-6 py-2 text-sm font-medium hover:bg-accent"
          >
            Món ngẫu nhiên
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
