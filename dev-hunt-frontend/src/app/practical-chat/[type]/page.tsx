import { ChatOverviewPage } from "@/features/chat-overview/ChatOverviewPage";
import { getPracticalChatPageConfig } from "@/features/chat-overview/chatPageConfig";

type PracticalChatPageProps = {
  params: Promise<{
    type: string;
  }>;
};

export function generateStaticParams() {
  return [{ type: "group" }, { type: "video" }, { type: "chatbot" }];
}

export default async function PracticalChatPage({ params }: PracticalChatPageProps) {
  const { type } = await params;

  return <ChatOverviewPage config={getPracticalChatPageConfig(type)} />;
}
