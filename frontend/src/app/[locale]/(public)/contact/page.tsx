import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/PageContainer";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: "Gửi phản hồi, báo lỗi hoặc đề xuất công thức tới chúng tôi.",
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <PageContainer>
      <div className="py-10">
        {/* ContactForm */}
      </div>
    </PageContainer>
  );
}
