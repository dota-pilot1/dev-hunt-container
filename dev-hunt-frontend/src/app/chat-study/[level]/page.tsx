import { ChatOverviewPage } from "@/features/chat-overview/ChatOverviewPage";
import { getChatStudyPageConfig } from "@/features/chat-overview/chatPageConfig";
import { ChatStudyLevel1Page } from "@/features/chat-study-level1/ChatStudyLevel1Page";
import { ChatStudyLevel2Page } from "@/features/chat-study-level2/ChatStudyLevel2Page";

type ChatStudyLevelPageProps = {
  params: Promise<{
    level: string;
  }>;
};

export function generateStaticParams() {
  return [
    { level: "level-1" },
    { level: "level-2" },
    { level: "level-3" },
    { level: "level-4" },
    { level: "level-5" },
  ];
}

export default async function ChatStudyLevelPage({ params }: ChatStudyLevelPageProps) {
  const { level } = await params;

  if (level === "level-1") {
    return <ChatStudyLevel1Page />;
  }

  if (level === "level-2") {
    return <ChatStudyLevel2Page />;
  }

  return <ChatOverviewPage config={getChatStudyPageConfig(level)} />;
}
