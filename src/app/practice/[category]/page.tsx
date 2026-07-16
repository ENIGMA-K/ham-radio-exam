import PracticeClient from "./practice-client";

export function generateStaticParams() {
  return [{ category: "A" }, { category: "B" }, { category: "C" }];
}

export default function PracticePage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return <PracticeClient params={params} />;
}
