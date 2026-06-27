"use client";

import Link from "next/link";
import {
  ArrowRight,
  BellRing,
  Bot,
  Cable,
  CheckCircle2,
  MessageCircle,
  MessagesSquare,
  Radio,
  ServerCog,
  UsersRound,
  Video,
} from "lucide-react";
import { RequireAuth } from "@/widgets/guards/RequireAuth";
import type { ChatPageConfig } from "./chatPageConfig";

const iconMap = {
  bell: BellRing,
  bot: Bot,
  cable: Cable,
  message: MessageCircle,
  messages: MessagesSquare,
  users: UsersRound,
  video: Video,
};

export function ChatOverviewPage({ config }: { config: ChatPageConfig }) {
  const Icon = iconMap[config.icon];

  return (
    <RequireAuth>
      <main className="min-h-[calc(100vh-3.5rem)] bg-muted/30 px-4 py-6">
        <div className="mx-auto max-w-6xl space-y-5">
          <section className="rounded-lg border border-border bg-background p-5">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase text-muted-foreground">
                    {config.eyebrow}
                  </p>
                  <h1 className="mt-1 text-2xl font-bold tracking-tight">{config.title}</h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                    {config.description}
                  </p>
                </div>
              </div>
              {config.nextHref && config.nextLabel && (
                <Link
                  href={config.nextHref}
                  className="inline-flex h-9 shrink-0 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold transition-colors hover:bg-accent"
                >
                  {config.nextLabel}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </section>

          <section className="grid gap-4 lg:grid-cols-[1fr_22rem]">
            <div className="rounded-lg border border-border bg-background">
              <div className="border-b border-border bg-muted/35 px-4 py-3">
                <h2 className="text-sm font-bold">구현 체크리스트</h2>
              </div>
              <div className="grid gap-2 p-4">
                {config.goals.map((goal) => (
                  <div
                    key={goal}
                    className="flex items-center gap-3 rounded-md border border-border px-3 py-2.5"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm font-medium">{goal}</span>
                  </div>
                ))}
              </div>
            </div>

            <aside className="rounded-lg border border-border bg-background">
              <div className="border-b border-border bg-muted/35 px-4 py-3">
                <h2 className="text-sm font-bold">권장 흐름</h2>
              </div>
              <div className="space-y-3 p-4 text-sm text-muted-foreground">
                <div className="flex gap-3">
                  <Radio className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <p>WebSocket으로 실시간 연결을 먼저 검증합니다.</p>
                </div>
                <div className="flex gap-3">
                  <ServerCog className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <p>메시지 저장, 인증, 알림은 기본 송수신이 안정된 뒤 붙입니다.</p>
                </div>
                <div className="flex gap-3">
                  <Bot className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                  <p>Spring AI와 WebRTC는 실전 메뉴에서 독립 기능으로 확장합니다.</p>
                </div>
              </div>
            </aside>
          </section>
        </div>
      </main>
    </RequireAuth>
  );
}
