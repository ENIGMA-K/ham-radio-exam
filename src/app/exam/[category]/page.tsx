import ExamClient from "./exam-client";

export function generateStaticParams() {
  return [{ category: "A" }, { category: "B" }, { category: "C" }];
}

export default function ExamPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  return <ExamClient params={params} />;
}
