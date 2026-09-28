import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function RandomPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const dietType = type ?? "normal";

  // TODO: fetch random dish slug from DB, then redirect
  // const dish = await getRandomDish(dietType);
  // redirect(`/dish/${dish.slug}`);

  void dietType;
  redirect("/");
}
