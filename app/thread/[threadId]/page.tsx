import ThreadDetail from "@/components/ThreadDetail";

export default function ThreadPage({
  params,
}: {
  params: { threadId: string };
}) {
  return <ThreadDetail threadId={params.threadId} />;
}
