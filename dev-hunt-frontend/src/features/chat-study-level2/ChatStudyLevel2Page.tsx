"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { Client, type IMessage, type StompSubscription } from "@stomp/stompjs";
import {
  Circle,
  MessageCircle,
  Plug,
  PlugZap,
  Send,
  Trash2,
  UsersRound,
} from "lucide-react";
import { useAuth } from "@/entities/user/model/authStore";
import { RequireAuth } from "@/widgets/guards/RequireAuth";

type ConnectionState = "idle" | "connecting" | "connected" | "disconnected" | "error";

type ChatMessage = {
  id: string;
  sender: string;
  content: string;
  sentAt: string;
};

const stateLabel: Record<ConnectionState, string> = {
  idle: "연결 전",
  connecting: "연결 중",
  connected: "연결됨",
  disconnected: "연결 끊김",
  error: "에러",
};

const stateClassName: Record<ConnectionState, string> = {
  idle: "text-muted-foreground",
  connecting: "text-amber-600",
  connected: "text-emerald-600",
  disconnected: "text-muted-foreground",
  error: "text-destructive",
};

function getWebSocketUrl() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4101";
  return `${apiUrl.replace(/^http/, "ws").replace(/\/$/, "")}/ws`;
}

export function ChatStudyLevel2Page() {
  return (
    <RequireAuth>
      <ChatStudyLevel2Inner />
    </RequireAuth>
  );
}

function ChatStudyLevel2Inner() {
  const { user } = useAuth();
  const clientRef = useRef<Client | null>(null);
  const subscriptionRef = useRef<StompSubscription | null>(null);
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [systemMessage, setSystemMessage] = useState("연결 후 메시지를 보내면 구독 중인 모든 화면에 표시됩니다.");
  const wsUrl = useMemo(() => getWebSocketUrl(), []);
  const sender = user?.username ?? user?.email ?? "tester";
  const connected = connectionState === "connected";

  const connect = () => {
    if (clientRef.current?.active) return;

    setConnectionState("connecting");
    setSystemMessage("STOMP 연결을 시도하는 중입니다.");

    const client = new Client({
      brokerURL: wsUrl,
      reconnectDelay: 0,
      debug: (line) => {
        if (process.env.NODE_ENV === "development") {
          console.debug("[stomp]", line);
        }
      },
      onConnect: () => {
        setConnectionState("connected");
        setSystemMessage("연결되었습니다. 다른 브라우저 탭에서도 같은 페이지를 열어 브로드캐스트를 확인할 수 있습니다.");
        subscriptionRef.current = client.subscribe("/topic/chat.level2.messages", (frame: IMessage) => {
          const body = JSON.parse(frame.body) as ChatMessage;
          setMessages((prev) => [...prev, body].slice(-100));
        });
      },
      onDisconnect: () => {
        setConnectionState("disconnected");
        setSystemMessage("연결을 해제했습니다.");
      },
      onStompError: (frame) => {
        setConnectionState("error");
        setSystemMessage(frame.headers.message ?? "STOMP 프로토콜 에러가 발생했습니다.");
      },
      onWebSocketError: () => {
        setConnectionState("error");
        setSystemMessage("WebSocket 연결 에러가 발생했습니다.");
      },
      onWebSocketClose: () => {
        setConnectionState((current) => (current === "idle" ? current : "disconnected"));
      },
    });

    clientRef.current = client;
    client.activate();
  };

  const disconnect = async () => {
    const client = clientRef.current;
    if (!client) return;

    subscriptionRef.current?.unsubscribe();
    subscriptionRef.current = null;
    await client.deactivate();
    clientRef.current = null;
    setConnectionState("disconnected");
  };

  const sendMessage = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    const client = clientRef.current;
    const content = draft.trim();
    if (!client?.connected || !content) return;

    client.publish({
      destination: "/app/chat.level2.send",
      body: JSON.stringify({ sender, content }),
    });
    setDraft("");
  };

  useEffect(() => {
    return () => {
      subscriptionRef.current?.unsubscribe();
      void clientRef.current?.deactivate();
    };
  }, []);

  return (
    <main className="min-h-[calc(100vh-3.5rem)] bg-muted/30 px-4 py-6">
      <div className="mx-auto max-w-6xl space-y-5">
        <section className="rounded-lg border border-border bg-background p-5">
          <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <MessageCircle className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  채팅 스터디
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight">
                  Level 2: 실시간 메시지
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  STOMP publish/subscribe로 메시지를 브로드캐스트하고 클라이언트 목록에 즉시 렌더링합니다.
                </p>
              </div>
            </div>
            <div className="flex h-9 shrink-0 items-center gap-2 rounded-md border border-border px-3 text-sm font-semibold">
              <Circle className={`h-3 w-3 fill-current ${stateClassName[connectionState]}`} />
              <span className={stateClassName[connectionState]}>{stateLabel[connectionState]}</span>
            </div>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1fr_24rem]">
          <div className="rounded-lg border border-border bg-background">
            <div className="flex items-center justify-between border-b border-border bg-muted/35 px-4 py-3">
              <h2 className="text-sm font-bold">채팅</h2>
              <button
                type="button"
                onClick={() => setMessages([])}
                className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-border bg-background px-2.5 text-xs font-semibold transition-colors hover:bg-accent"
              >
                <Trash2 className="h-3.5 w-3.5" />
                지우기
              </button>
            </div>

            <div className="flex h-[28rem] flex-col">
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center rounded-md border border-dashed border-border text-sm text-muted-foreground">
                    아직 수신한 메시지가 없습니다.
                  </div>
                ) : (
                  messages.map((message) => {
                    const mine = message.sender === sender;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${mine ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg border px-3 py-2 ${
                            mine
                              ? "border-primary bg-primary text-primary-foreground"
                              : "border-border bg-muted/35"
                          }`}
                        >
                          <div className="flex items-center gap-2 text-xs font-semibold opacity-80">
                            <span className="truncate">{message.sender}</span>
                            <span className="shrink-0">
                              {new Date(message.sentAt).toLocaleTimeString("ko-KR", {
                                hour: "2-digit",
                                minute: "2-digit",
                                second: "2-digit",
                              })}
                            </span>
                          </div>
                          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-6">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <form
                onSubmit={sendMessage}
                className="grid gap-2 border-t border-border bg-muted/20 p-4 sm:grid-cols-[1fr_auto]"
              >
                <input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  disabled={!connected}
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
                  placeholder={connected ? "메시지를 입력하세요" : "먼저 연결하세요"}
                />
                <button
                  type="submit"
                  disabled={!connected || !draft.trim()}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  보내기
                </button>
              </form>
            </div>
          </div>

          <aside className="space-y-4">
            <div className="rounded-lg border border-border bg-background">
              <div className="border-b border-border bg-muted/35 px-4 py-3">
                <h2 className="text-sm font-bold">연결 제어</h2>
              </div>
              <div className="space-y-4 p-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Endpoint</label>
                  <div className="mt-1 break-all rounded-md border border-border bg-muted/35 px-3 py-2 font-mono text-xs">
                    {wsUrl}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={connect}
                    disabled={connectionState === "connecting" || connected}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-primary px-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <PlugZap className="h-4 w-4" />
                    연결
                  </button>
                  <button
                    type="button"
                    onClick={disconnect}
                    disabled={connectionState === "idle" || connectionState === "disconnected"}
                    className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Plug className="h-4 w-4" />
                    연결 해제
                  </button>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">{systemMessage}</p>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background">
              <div className="border-b border-border bg-muted/35 px-4 py-3">
                <h2 className="text-sm font-bold">STOMP 경로</h2>
              </div>
              <div className="space-y-3 p-4 text-sm">
                <PathRow label="CONNECT" value="/ws" />
                <PathRow label="PUBLISH" value="/app/chat.level2.send" />
                <PathRow label="SUBSCRIBE" value="/topic/chat.level2.messages" />
              </div>
            </div>

            <div className="rounded-lg border border-border bg-background p-4">
              <div className="flex items-start gap-3 text-sm text-muted-foreground">
                <UsersRound className="mt-0.5 h-4 w-4 shrink-0 text-foreground" />
                <p>같은 계정 또는 다른 계정으로 탭을 하나 더 열면 양쪽에 같은 메시지가 표시됩니다.</p>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function PathRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className="mt-1 break-all rounded-md border border-border bg-muted/35 px-2 py-1.5 font-mono text-xs">
        {value}
      </p>
    </div>
  );
}
