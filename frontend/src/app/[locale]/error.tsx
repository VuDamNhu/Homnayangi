"use client";

import { useEffect } from "react";
import { PageContainer } from "@/components/layout/PageContainer";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer>
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center">
        <h2 className="text-2xl font-semibold">Đã xảy ra lỗi</h2>
        <p className="text-muted-foreground max-w-md">
          Đã có sự cố xảy ra. Chúng tôi đã được thông báo.
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90"
        >
          Thử lại
        </button>
      </div>
    </PageContainer>
  );
}
