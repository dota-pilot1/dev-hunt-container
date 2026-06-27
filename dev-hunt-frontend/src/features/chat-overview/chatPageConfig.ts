export type ChatPageConfig = {
  title: string;
  eyebrow: string;
  description: string;
  icon: "bell" | "bot" | "cable" | "message" | "messages" | "users" | "video";
  goals: string[];
  nextHref?: string;
  nextLabel?: string;
};

const chatStudyPages: Record<string, ChatPageConfig> = {
  "level-1": {
    title: "Level 1: WebSocket 연결",
    eyebrow: "채팅 스터디",
    description: "브라우저와 Spring Boot 서버가 WebSocket으로 연결되는 최소 흐름을 만듭니다.",
    icon: "cable",
    goals: ["WebSocket 엔드포인트 구성", "프론트 연결 상태 표시", "연결/해제 이벤트 확인"],
    nextHref: "/chat-study/level-2",
    nextLabel: "Level 2로 이동",
  },
  "level-2": {
    title: "Level 2: 실시간 메시지",
    eyebrow: "채팅 스터디",
    description: "연결된 클라이언트가 메시지를 보내고 즉시 화면에 반영되는 기본 채팅을 구현합니다.",
    icon: "message",
    goals: ["메시지 송수신 DTO 정의", "STOMP publish/subscribe 흐름", "클라이언트 메시지 목록 렌더링"],
    nextHref: "/chat-study/level-3",
    nextLabel: "Level 3로 이동",
  },
  "level-3": {
    title: "Level 3: 채팅방",
    eyebrow: "채팅 스터디",
    description: "여러 채팅방을 만들고 방 단위로 메시지를 분리하는 단체 채팅 기반을 만듭니다.",
    icon: "messages",
    goals: ["채팅방 목록/상세 화면", "방별 topic 구독", "입장/퇴장 메시지 처리"],
    nextHref: "/chat-study/level-4",
    nextLabel: "Level 4로 이동",
  },
  "level-4": {
    title: "Level 4: 사용자 상태",
    eyebrow: "채팅 스터디",
    description: "접속자 목록, 온라인 상태, 읽음 처리처럼 실시간 협업에서 필요한 상태를 다룹니다.",
    icon: "users",
    goals: ["접속자 목록 표시", "온라인/오프라인 이벤트", "읽음 카운트 또는 마지막 읽은 위치"],
    nextHref: "/chat-study/level-5",
    nextLabel: "Level 5로 이동",
  },
  "level-5": {
    title: "Level 5: 저장/알림",
    eyebrow: "채팅 스터디",
    description: "메시지를 DB에 저장하고 인증, 알림, 장애 대응까지 붙여 실전 기능으로 확장합니다.",
    icon: "bell",
    goals: ["메시지 영속화", "로그인 사용자 연동", "알림/재연결/예외 처리"],
    nextHref: "/practical-chat/group",
    nextLabel: "실전 단체 채팅으로 이동",
  },
};

const practicalChatPages: Record<string, ChatPageConfig> = {
  group: {
    title: "단체 채팅",
    eyebrow: "실전 채팅",
    description: "스터디 단계에서 만든 WebSocket 채팅방 기능을 실제 서비스 화면으로 정리합니다.",
    icon: "messages",
    goals: ["채팅방 생성/목록/입장", "메시지 저장과 이전 메시지 조회", "접속자와 읽음 상태"],
    nextHref: "/practical-chat/chatbot",
    nextLabel: "챗봇 채팅으로 이동",
  },
  video: {
    title: "화상 채팅",
    eyebrow: "실전 채팅",
    description: "WebRTC로 영상 통화를 구현하고 WebSocket은 offer/answer/ice candidate 시그널링에 사용합니다.",
    icon: "video",
    goals: ["WebRTC peer 연결", "WebSocket 시그널링", "마이크/카메라 상태 제어"],
    nextHref: "/chat-study/level-1",
    nextLabel: "기초부터 다시 보기",
  },
  chatbot: {
    title: "챗봇 채팅",
    eyebrow: "실전 채팅",
    description: "Spring AI를 연결해 사용자 질문에 답하는 AI 채팅 경험을 만듭니다.",
    icon: "bot",
    goals: ["Spring AI ChatClient 구성", "대화 이력 관리", "스트리밍 응답 UI"],
    nextHref: "/practical-chat/video",
    nextLabel: "화상 채팅으로 이동",
  },
};

export function getChatStudyPageConfig(level: string): ChatPageConfig {
  return chatStudyPages[level] ?? chatStudyPages["level-1"];
}

export function getPracticalChatPageConfig(type: string): ChatPageConfig {
  return practicalChatPages[type] ?? practicalChatPages.group;
}
