package com.cj.devhunt.config;

import com.cj.devhunt.menu.domain.Menu;
import com.cj.devhunt.menu.infrastructure.MenuRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Component
@Order(4)
@RequiredArgsConstructor
public class MenuSeeder implements ApplicationRunner {

    private final MenuRepository menuRepository;

    private record MenuDef(
            String code, String parentCode, String label, String labelKey,
            String path, String icon, String requiredRole, int displayOrder
    ) {}

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<MenuDef> defs = List.of(
                new MenuDef("DASHBOARD",             null,    "대시보드",      "nav.dashboard",        "/dashboard",        "LayoutDashboard", null,                    0),
                new MenuDef("CHAT",                  null,    "채팅",          "nav.chat",             null,                "MessagesSquare",  null,                    1),
                new MenuDef("CHAT_STUDY",            "CHAT",  "채팅 스터디",   "nav.chatStudy",        null,                "BookOpen",        null,                    0),
                new MenuDef("CHAT_STUDY_LEVEL_1",    "CHAT_STUDY", "Level 1: WebSocket 연결", "nav.chatStudyLevel1", "/chat-study/level-1", "Cable", null, 0),
                new MenuDef("CHAT_STUDY_LEVEL_2",    "CHAT_STUDY", "Level 2: 실시간 메시지",  "nav.chatStudyLevel2", "/chat-study/level-2", "MessageCircle", null, 1),
                new MenuDef("CHAT_STUDY_LEVEL_3",    "CHAT_STUDY", "Level 3: 채팅방",        "nav.chatStudyLevel3", "/chat-study/level-3", "MessagesSquare", null, 2),
                new MenuDef("CHAT_STUDY_LEVEL_4",    "CHAT_STUDY", "Level 4: 사용자 상태",    "nav.chatStudyLevel4", "/chat-study/level-4", "UsersRound", null, 3),
                new MenuDef("CHAT_STUDY_LEVEL_5",    "CHAT_STUDY", "Level 5: 저장/알림",      "nav.chatStudyLevel5", "/chat-study/level-5", "BellRing", null, 4),
                new MenuDef("PRACTICAL_CHAT",        "CHAT",  "실전 채팅",     "nav.practicalChat",    null,                "Rocket",          null,                    1),
                new MenuDef("PRACTICAL_GROUP_CHAT",  "PRACTICAL_CHAT", "단체 채팅", "nav.groupChat",    "/practical-chat/group", "MessagesSquare", null, 0),
                new MenuDef("PRACTICAL_VIDEO_CHAT",  "PRACTICAL_CHAT", "화상 채팅", "nav.videoChat",    "/practical-chat/video", "Video", null, 1),
                new MenuDef("PRACTICAL_CHATBOT_CHAT", "PRACTICAL_CHAT", "챗봇 채팅", "nav.chatbotChat", "/practical-chat/chatbot", "Bot", null, 2),
                new MenuDef("ADMIN",                 null,    "관리",          "nav.admin",            null,                "Settings",        RoleSeeder.ROLE_ADMIN,   2),
                new MenuDef("ADMIN_USERS",           "ADMIN", "유저 관리",     "nav.users",            "/users",            "Users",           RoleSeeder.ROLE_ADMIN,   0),
                new MenuDef("ADMIN_ROLE_PERMISSIONS","ADMIN", "역할-권한 매핑","nav.rolePermissions",  "/role-permissions", "ShieldCheck",     RoleSeeder.ROLE_ADMIN,   1),
                new MenuDef("ADMIN_SITE_SETTINGS",   "ADMIN", "메인 관리",     "nav.siteSettings",     "/site-settings",   "LayoutDashboard", RoleSeeder.ROLE_ADMIN,   2),
                new MenuDef("ADMIN_MENU_MANAGEMENT", "ADMIN", "메뉴 관리",     "nav.menuManagement",   "/menu-management",  "Menu",            RoleSeeder.ROLE_ADMIN,   3)
        );

        for (MenuDef def : defs) {
            if (menuRepository.existsByCode(def.code())) continue;
            Menu parent = def.parentCode() != null
                    ? menuRepository.findByCode(def.parentCode()).orElse(null)
                    : null;
            menuRepository.save(Menu.create(
                    def.code(), parent, def.label(), def.labelKey(),
                    def.path(), def.icon(), false,
                    def.requiredRole(), null, true, def.displayOrder()
            ));
            log.info("Seeded menu: {}", def.code());
        }

        menuRepository.findByCode("ADMIN").ifPresent(admin -> admin.update(
                admin.getParent(), admin.getLabel(), admin.getLabelKey(),
                admin.getPath(), admin.getIcon(), admin.isExternal(),
                admin.getRequiredRole(), admin.getRequiredPermission(),
                admin.isVisible(), 2
        ));
    }
}
