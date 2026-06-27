"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { Cable, Circle, Plug, PlugZap, Send, XCircle } from "lucide-react";
import { useAuth } from "@/entities/user/model/authStore";
import { RequireAuth } from "@/widgets/guards/RequireAuth";

type ConnectionState = "idle" | "connecting" | "connected" | "disconnected" | "error";

type PongMessage = {
  sender: string;
  message: string;
  serverTime: string;
};

type LogItem = {
  id: number;
  type: "system" | "sent" | "received" | "error";
  message: string;
  time: string;
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

export function ChatStudyLevel1Page() {
  return (
    <RequireAuth>
      <ChatStudyLevel1Inner />
    </RequireAuth>
  );
}

function ChatStudyLevel1Inner() {
  const { user } = useAuth();
  const clientRef = useRef<Client | null>(null);
  const logSeqRef = useRef(0);
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle");
  const [message, setMessage] = useState("hello websocket stomp");
  const [logs, setLogs] = useState<LogItem[]>([]);
  const wsUrl = useMemo(getWebSocketUrl, []);
  const sender = user?.username ?? user?.email ?? "tester";
  const connected = connectionState === "connected";

  const appendLog = (type: LogItem["type"], text: string) => {
    const now = new Date();
    const item: LogItem = {
      id: ++logSeqRef.current,
      type,
      message: text,
      time: now.toLocaleTimeString("ko-KR", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };
    setLogs((prev) => [item, ...prev].slice(0, 30));
  };

  const connect = () => {
    if (clientRef.current?.active) return;

    setConnectionState("connecting");
    // appendLog("system", `STOMP 연결 시도: ${wsUrl}`);

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
        appendLog("system", "STOMP 연결 완료");
        client.subscribe("/topic/chat.level1.pong", (frame: IMessage) => {
          const body = JSON.parse(frame.body) as PongMessage;
          appendLog(
            "received",
            `${body.sender}: ${body.message} (${new Date(body.serverTime).toLocaleTimeString("ko-KR")})`
          );
        });
      },
      onDisconnect: () => {
        setConnectionState("disconnected");
        appendLog("system", "STOMP 연결 해제");
      },
      onStompError: (frame) => {
        setConnectionState("error");
        appendLog("error", frame.headers.message ?? "STOMP 프로토콜 에러");
      },
      onWebSocketError: () => {
        setConnectionState("error");
        appendLog("error", "WebSocket 연결 에러");
      },
      onWebSocketClose: () => {
        if (connectionState !== "idle") {
          setConnectionState("disconnected");
        }
      },
    });

    clientRef.current = client;
    client.activate();
  };

  const disconnect = async () => {
    const client = clientRef.current;
    if (!client) return;
    await client.deactivate();
    clientRef.current = null;
    setConnectionState("disconnected");
  };

  const sendPing = () => {
    const client = clientRef.current;
    if (!client?.connected) return;

    const payload = {
      sender,
      message,
    };
    client.publish({
      destination: "/app/chat.level1.ping",
      body: JSON.stringify(payload),
    });
    appendLog("sent", `${sender}: ${message}`);
  };

  useEffect(() => {
    return () => {
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
                <Cable className="h-6 w-6" />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  채팅 스터디
                </p>
                <h1 className="mt-1 text-2xl font-bold tracking-tight">
                  Level 1: WebSocket STOMP 연결
                </h1>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Spring Boot STOMP endpoint에 연결하고 ping 메시지를 보내 서버 응답을 확인합니다.
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
            <div className="border-b border-border bg-muted/35 px-4 py-3">
              <h2 className="text-sm font-bold">연결 테스트</h2>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground">Endpoint</label>
                <div className="mt-1 rounded-md border border-border bg-muted/35 px-3 py-2 font-mono text-sm">
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
                  disabled={!clientRef.current?.active}
                  className="inline-flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-sm font-semibold transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plug className="h-4 w-4" />
                  연결 해제
                </button>
              </div>

              <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && connected) sendPing();
                  }}
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none transition-colors focus:border-primary"
                  placeholder="서버로 보낼 ping 메시지"
                />
                <button
                  type="button"
                  onClick={sendPing}
                  disabled={!connected || !message.trim()}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  Ping 보내기
                </button>
              </div>
            </div>
          </div>

          <aside className="rounded-lg border border-border bg-background">
            <div className="border-b border-border bg-muted/35 px-4 py-3">
              <h2 className="text-sm font-bold">STOMP 경로</h2>
            </div>
            <div className="space-y-3 p-4 text-sm">
              <PathRow label="CONNECT" value="/ws" />
              <PathRow label="PUBLISH" value="/app/chat.level1.ping" />
              <PathRow label="SUBSCRIBE" value="/topic/chat.level1.pong" />
            </div>
          </aside>
        </section>

        <section className="rounded-lg border border-border bg-background">
          <div className="flex items-center justify-between border-b border-border bg-muted/35 px-4 py-3">
            <h2 className="text-sm font-bold">이벤트 로그</h2>
            <button
              type="button"
              onClick={() => setLogs([])}
              className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-border bg-background px-2.5 text-xs font-semibold transition-colors hover:bg-accent"
            >
              <XCircle className="h-3.5 w-3.5" />
              지우기
            </button>
          </div>
          <div className="min-h-48 space-y-2 p-4">
            {logs.length === 0 ? (
              <p className="text-sm text-muted-foreground">아직 로그가 없습니다.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-3 rounded-md border border-border px-3 py-2">
                  <span className="w-20 shrink-0 font-mono text-xs text-muted-foreground">
                    {log.time}
                  </span>
                  <span className="w-16 shrink-0 text-xs font-bold uppercase text-muted-foreground">
                    {log.type}
                  </span>
                  <span className="min-w-0 text-sm">{log.message}</span>
                </div>
              ))
            )}
          </div>
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
