/**
 * Single source of truth for everything the site says.
 * Every string that is shown to visitors exists in EN and PT.
 */
import type { Locale } from "@/lib/i18n";
import type { GlyphName } from "@/components/Glyph";

export type T = Record<Locale, string>;
export type Rarity = "legendary" | "epic" | "rare" | "uncommon";
export type SpriteName =
  | "chest"
  | "coin"
  | "controller"
  | "potion"
  | "phone"
  | "page"
  | "star"
  | "block";

export const person = {
  name: "Guilherme Molari",
  email: "yguilz123@gmail.com",
  location: { city: "Londrina", region: "PR", country: "BR" },
  github: "https://github.com/gmolari",
  githubHandle: "gmolari",
  linkedin: "https://www.linkedin.com/in/guilherme-molari-5203a8236/",
  /** Path under /public. null = show the pixel avatar instead. */
  photo: "/guilherme-molari.jpg" as string | null,
  jobTitle: { en: "Senior Software Engineer", pt: "Engenheiro de Software Sênior" } as T,
  cls: { en: "Full Stack Engineer", pt: "Engenheiro Full Stack" } as T,
  spec: { en: "Web, mobile & games", pt: "Web, mobile & jogos" } as T,
  tagline: {
    en: "I build products end to end: web apps, APIs, back offices and mobile apps, from the Figma file to production. Next.js, React and TypeScript on the front, Node, NestJS and .NET on the back, and PixiJS when it has to feel like a game.",
    pt: "Construo produtos de ponta a ponta: aplicações web, APIs, backoffices e apps mobile, do Figma à produção. Next.js, React e TypeScript no front, Node, NestJS e .NET no back, e PixiJS quando precisa ter cara de jogo.",
  } as T,
  summary: {
    en: "Senior full stack engineer who builds scalable web applications, APIs and mobile apps with Next.js, React, TypeScript, Node.js and .NET. I have shipped high-traffic real-time platforms, payment and third-party integrations, back offices, reusable component libraries and performance work, always close to design in Figma. As Tech Lead at Ana Gaming I led a team of five front-end and back-end developers, set coding standards and ran code review and mentoring. I also build mobile apps (React Native, Kotlin, Java), web games with PixiJS, and use AI agents, Claude Code and MCP to automate development workflows.",
    pt: "Engenheiro full stack sênior que constrói aplicações web escaláveis, APIs e apps mobile com Next.js, React, TypeScript, Node.js e .NET. Já entreguei plataformas em tempo real com alto tráfego, integrações de pagamento e de terceiros, backoffices, bibliotecas de componentes e melhorias de performance, sempre perto do design no Figma. Como Tech Lead na Ana Gaming liderei um time de cinco devs front-end e back-end, defini padrões de código e conduzi code review e mentoria. Também desenvolvo apps mobile (React Native, Kotlin, Java), jogos web com PixiJS e uso agentes de IA, Claude Code e MCP para automatizar fluxos de desenvolvimento.",
  } as T,
};

/** Character sheet vitals. Playful on purpose; the values are flavour, not metrics. */
export const vitals = [
  { key: "HP", value: 92, icon: "heart" as GlyphName, label: { en: "coffee", pt: "café" } as T, color: "var(--hp)" },
  { key: "MP", value: 80, icon: "mana" as GlyphName, label: { en: "focus", pt: "foco" } as T, color: "var(--mp)" },
  { key: "XP", value: 100, icon: "star" as GlyphName, label: { en: "Senior", pt: "Sênior" } as T, color: "var(--xp)" },
];

export const attributes = [
  { icon: "monitor" as GlyphName, label: { en: "Frontend", pt: "Frontend" } as T, value: 19 },
  { icon: "server" as GlyphName, label: { en: "Backend", pt: "Backend" } as T, value: 17 },
  { icon: "temple" as GlyphName, label: { en: "Architecture", pt: "Arquitetura" } as T, value: 17 },
  { icon: "crown" as GlyphName, label: { en: "Leadership", pt: "Liderança" } as T, value: 16 },
  { icon: "phone" as GlyphName, label: { en: "Mobile", pt: "Mobile" } as T, value: 15 },
  { icon: "pad" as GlyphName, label: { en: "Game dev", pt: "Game dev" } as T, value: 17 },
];

export type SkillIcon =
  | "typescript" | "react" | "nextjs" | "nodejs" | "nestjs" | "dotnet" | "postgresql"
  | "pixijs" | "expo" | "kotlin" | "capacitor" | "claude" | "figma";

export type SkillNode = {
  id: string;
  label: string;
  icon: SkillIcon;
  /** Position inside the tree's inner box, in % (0–100). */
  x: number;
  y: number;
  /** 1–5 */
  level: number;
  category: T;
  note: T;
  /** Project ids from `projects` where this skill was used. */
  usedIn: string[];
  /** Extra tools that come with the skill. */
  extras: string[];
};

const cat = {
  core: { en: "Core", pt: "Base" },
  front: { en: "Frontend", pt: "Frontend" },
  back: { en: "Backend", pt: "Backend" },
  data: { en: "Data", pt: "Dados" },
  mobile: { en: "Mobile", pt: "Mobile" },
  game: { en: "Games", pt: "Jogos" },
  tools: { en: "Workflow", pt: "Fluxo de trabalho" },
} satisfies Record<string, T>;

export const skills: SkillNode[] = [
  {
    id: "ts", label: "TypeScript", icon: "typescript", x: 50, y: 0, level: 5, category: cat.core,
    note: { en: "The language behind almost everything I ship, front and back. Strict types, shared contracts between API and UI, Zod for runtime validation.", pt: "A linguagem por trás de quase tudo que eu entrego, no front e no back. Tipagem estrita, contratos compartilhados entre API e UI, Zod para validação em runtime." },
    usedIn: ["gamification-bko", "pgx-ui", "supernova-bet", "vortexvolley", "game-lab"], extras: ["JavaScript", "Zod"],
  },
  {
    id: "react", label: "React", icon: "react", x: 25, y: 26, level: 5, category: cat.front,
    note: { en: "Component libraries and design systems built from Figma, state with Zustand and React Query, and a lot of performance work on heavy, real-time screens.", pt: "Bibliotecas de componentes e design systems a partir do Figma, estado com Zustand e React Query, e muito trabalho de performance em telas pesadas e em tempo real." },
    usedIn: ["pgx-ui", "gamification-bko", "supernova-bet", "gamification-loop", "bigette"], extras: ["Zustand", "React Query", "Framer Motion"],
  },
  {
    id: "next", label: "Next.js", icon: "nextjs", x: 6, y: 54, level: 5, category: cat.front,
    note: { en: "App Router, server components, SSR and SSG, SEO and Core Web Vitals. This portfolio runs on Next.js 16.", pt: "App Router, server components, SSR e SSG, SEO e Core Web Vitals. Este portfólio roda em Next.js 16." },
    usedIn: ["gamification-bko", "supernova-bet", "gamification-loop", "bigette"], extras: ["Tailwind CSS", "Vercel"],
  },
  {
    id: "figma", label: "Figma", icon: "figma", x: 25, y: 82, level: 4, category: cat.tools,
    note: { en: "I work straight from Figma files with designers: tokens, components and pixel-accurate implementation.", pt: "Trabalho direto dos arquivos do Figma com o design: tokens, componentes e implementação fiel ao pixel." },
    usedIn: ["pgx-ui", "supernova-bet", "gamification-loop"], extras: ["Code Connect", "Design tokens"],
  },
  {
    id: "pixi", label: "PixiJS", icon: "pixijs", x: 42, y: 54, level: 5, category: cat.game,
    note: { en: "WebGL 2D for minigames, slot reels and full casual games. I wrote my own engine on top of it for three games.", pt: "WebGL 2D para minigames, rolos de slot e jogos casuais completos. Escrevi meu próprio motor em cima dele para três jogos." },
    usedIn: ["pgx-ui", "game-lab", "sweepstakes", "gamification-bko"], extras: ["Canvas", "WebGL"],
  },
  {
    id: "capacitor", label: "Capacitor", icon: "capacitor", x: 50, y: 82, level: 4, category: cat.mobile,
    note: { en: "One TypeScript codebase shipped to web, Android and iOS, with haptics, preferences and AdMob.", pt: "Um único código TypeScript publicado na web, no Android e no iOS, com vibração, preferências e AdMob." },
    usedIn: ["game-lab"], extras: ["Vite", "AdMob"],
  },
  {
    id: "rn", label: "React Native", icon: "expo", x: 6, y: 100, level: 4, category: cat.mobile,
    note: { en: "Expo apps with Expo Router, real-time updates over Socket.IO and secure token storage.", pt: "Apps em Expo com Expo Router, atualizações em tempo real via Socket.IO e armazenamento seguro de tokens." },
    usedIn: ["vortexvolley"], extras: ["Expo Router", "Reanimated"],
  },
  {
    id: "kotlin", label: "Kotlin · Java", icon: "kotlin", x: 34, y: 100, level: 3, category: cat.mobile,
    note: { en: "Native Android work and JVM game modding.", pt: "Android nativo e modding de jogos na JVM." },
    usedIn: ["citybuilder"], extras: ["Fabric", "Gradle"],
  },
  {
    id: "node", label: "Node.js", icon: "nodejs", x: 75, y: 26, level: 4, category: cat.back,
    note: { en: "REST APIs, real-time with Socket.IO, and integrations with payment and third-party providers.", pt: "APIs REST, tempo real com Socket.IO e integrações com provedores de pagamento e terceiros." },
    usedIn: ["vortexvolley", "supernova-bet"], extras: ["Express", "Socket.IO"],
  },
  {
    id: "nest", label: "NestJS", icon: "nestjs", x: 62, y: 54, level: 4, category: cat.back,
    note: { en: "Modular APIs with JWT access and refresh tokens, roles, WebSocket gateways, rate limiting and validation.", pt: "APIs modulares com JWT (access e refresh), papéis, gateways WebSocket, rate limiting e validação." },
    usedIn: ["vortexvolley"], extras: ["Passport", "class-validator"],
  },
  {
    id: "dotnet", label: "C# · .NET", icon: "dotnet", x: 94, y: 54, level: 3, category: cat.back,
    note: { en: "ASP.NET Web APIs with Entity Framework. At GMaster I built endpoints and architecture for an internal client management and financial consulting system.", pt: "Web APIs em ASP.NET com Entity Framework. Na GMaster criei endpoints e ajudei na arquitetura de um sistema interno de gestão de clientes e consultoria financeira." },
    usedIn: [], extras: ["ASP.NET", "Entity Framework"],
  },
  {
    id: "db", label: "SQL · Mongo", icon: "postgresql", x: 78, y: 82, level: 4, category: cat.data,
    note: { en: "PostgreSQL, MySQL and MongoDB. Schema design and migrations with Prisma and Drizzle.", pt: "PostgreSQL, MySQL e MongoDB. Modelagem e migrations com Prisma e Drizzle." },
    usedIn: ["vortexvolley", "bigette"], extras: ["Prisma", "Drizzle", "MySQL", "MongoDB"],
  },
  {
    id: "ai", label: "AI · MCP", icon: "claude", x: 94, y: 100, level: 5, category: cat.tools,
    note: { en: "Claude Code, custom agents, skills and MCP servers wired into my daily workflow to automate reviews, assets and repetitive work.", pt: "Claude Code, agentes, skills e servidores MCP no meu dia a dia para automatizar revisões, assets e trabalho repetitivo." },
    usedIn: ["game-lab"], extras: ["Claude Code", "MCP", "Agents"],
  },
];

export const skillLinks: [string, string][] = [
  ["ts", "react"], ["ts", "node"], ["react", "next"], ["react", "pixi"], ["react", "figma"], ["next", "rn"],
  ["pixi", "capacitor"], ["capacitor", "kotlin"], ["node", "nest"], ["node", "dotnet"], ["nest", "db"],
  ["dotnet", "db"], ["db", "ai"], ["ts", "ai"],
];

export const quests = [
  {
    id: "gmaster",
    org: "GMaster",
    badge: "GM",
    role: { en: "Full Stack Developer", pt: "Desenvolvedor Full Stack" } as T,
    text: {
      en: "Evolved an established internal system for client management and financial consulting. Built REST endpoints in C# and .NET, new screens in Next.js and took part in architecture decisions, plus data modeling and queries, integrations, performance fixes, bug hunting and code review across the whole stack.",
      pt: "Evoluí um sistema interno já em produção de gestão de clientes e consultoria financeira. Criei endpoints REST em C# e .NET, desenvolvi telas em Next.js e participei da construção da arquitetura, além de modelagem de dados e consultas, integrações, melhorias de performance, correção de bugs e code review em toda a stack.",
    } as T,
    tags: { en: ["C#", ".NET", "Next.js", "REST APIs", "Architecture"], pt: ["C#", ".NET", "Next.js", "APIs REST", "Arquitetura"] },
  },
  {
    id: "ana",
    org: "Ana Gaming",
    badge: "AG",
    role: { en: "Technical Lead", pt: "Tech Lead" } as T,
    text: {
      en: "Led a team of five front-end and back-end developers. Owned architecture decisions, delivery planning, coding standards, code review and technical mentoring.",
      pt: "Liderei um time de cinco devs front-end e back-end. Responsável por decisões de arquitetura, planejamento de entregas, padrões de código, code review e mentoria técnica.",
    } as T,
    tags: { en: ["Leadership", "Architecture", "Code review"], pt: ["Liderança", "Arquitetura", "Code review"] },
  },
  {
    id: "startbet",
    org: "StartBet",
    badge: "ST",
    role: { en: "Front-end Engineer", pt: "Engenheiro Front-end" } as T,
    text: {
      en: "Built gamification features and platform solutions for the betting product: reusable components, acquisition flows and tools that helped the team ship faster.",
      pt: "Desenvolvi funcionalidades de gamificação e soluções para a plataforma de apostas: componentização, fluxos de aquisição e ferramentas que ajudaram o time a entregar mais rápido.",
    } as T,
    tags: { en: ["Gamification", "Components", "Acquisition"], pt: ["Gamificação", "Componentização", "Aquisição"] },
  },
  {
    id: "multibet",
    org: "Multibet",
    badge: "MB",
    role: { en: "Front-end Engineer", pt: "Engenheiro Front-end" } as T,
    text: {
      en: "Built features across the product and internal tools: Multi-verso, the refer-a-friend back office, admin tools for popups and minigames, and landing pages, working from Figma with React Query and Zustand.",
      pt: "Desenvolvi funcionalidades do produto e de ferramentas internas: Multi-verso, backoffice de indicação, painéis de cadastro de popups e minigames e landing pages, partindo do Figma com React Query e Zustand.",
    } as T,
    tags: { en: ["React", "Back offices", "Landing pages"], pt: ["React", "Backoffices", "Landing pages"] },
  },
  {
    id: "supernova",
    org: "Supernova Gaming",
    badge: "SG",
    role: { en: "Senior Front-end Engineer", pt: "Engenheiro Front-end Sênior" } as T,
    text: {
      en: "One of the first engineers on the Supernova Bet platform: real-time features, REST and payment provider integrations, back offices and a shared component library. Later took responsibility for the gamification layer together with the team and kicked off its projects. The gamification loop front-end I built 100% on my own.",
      pt: "Um dos pioneiros na plataforma Supernova Bet: recursos em tempo real, integrações REST e com provedores de pagamento, backoffices e uma biblioteca de componentes compartilhada. Depois assumi a responsabilidade pela camada de gamificação junto com a equipe e iniciei os projetos. O front do loop de gamificação foi 100% feito por mim.",
    } as T,
    tags: { en: ["Next.js", "Real time", "Payments", "Gamification"], pt: ["Next.js", "Tempo real", "Pagamentos", "Gamificação"] },
  },
];

export type Project = {
  id: string;
  name: string;
  sprite: SpriteName;
  rarity: Rarity;
  context: T;
  role: T;
  summary: T;
  how: T;
  purpose: T;
  stack: string[];
  link?: string;
};

export const projects: Project[] = [
  {
    id: "supernova-bet",
    name: "Supernova Bet",
    sprite: "coin",
    rarity: "epic",
    context: { en: "Supernova Gaming", pt: "Supernova Gaming" },
    role: { en: "Founding front-end engineer", pt: "Pioneiro na construção do front" },
    summary: {
      en: "Betting and casino platform front-end, built from the first commit.",
      pt: "Front da plataforma de apostas e cassino, construído desde o primeiro commit.",
    },
    how: {
      en: "Casino lobby, sports, account and payment flows with real-time updates over Socket.IO, REST integrations with game and payment providers, and a shared component library.",
      pt: "Lobby de cassino, esportes, conta e pagamentos com atualizações em tempo real via Socket.IO, integrações REST com provedores de jogos e pagamento e uma biblioteca de componentes compartilhada.",
    },
    purpose: {
      en: "A fast, reliable product for players and a solid base for every feature after it.",
      pt: "Um produto rápido e confiável para o jogador e uma base sólida para tudo que veio depois.",
    },
    stack: ["Next.js", "React", "TypeScript", "Socket.IO", "Zustand", "React Query"],
  },
  {
    id: "gamification-loop",
    name: "Gamification Loop",
    sprite: "chest",
    rarity: "legendary",
    context: { en: "Supernova Gaming · Play4Tune", pt: "Supernova Gaming · Play4Tune" },
    role: { en: "Front-end 100% solo · initiative led with the team", pt: "Front 100% por mim · iniciativa liderada com a equipe" },
    summary: {
      en: "The retention layer of an iGaming platform: missions, levels, rewards and minigames living inside the product.",
      pt: "A camada de retenção de uma plataforma de iGaming: missões, níveis, recompensas e minigames dentro do produto.",
    },
    how: {
      en: "Players progress through missions and levels and earn rewards they can spend or play with. Minigames and UI come from the PGX UI library, UI state lives in Zustand and server state in React Query, and everything is configured from the gamification back office.",
      pt: "O jogador avança por missões e níveis e ganha recompensas para gastar ou jogar. Os minigames e a UI vêm da biblioteca PGX UI, o estado de UI fica no Zustand e o de servidor no React Query, e tudo é configurado pelo backoffice de gamificação.",
    },
    purpose: {
      en: "Turn one-off visits into a habit: acquisition, activation and retention.",
      pt: "Transformar visitas avulsas em hábito: aquisição, ativação e retenção.",
    },
    stack: ["Next.js", "React", "TypeScript", "PixiJS", "Framer Motion", "Zustand", "React Query"],
  },
  {
    id: "gamification-bko",
    name: "Gamification Back Office",
    sprite: "chest",
    rarity: "legendary",
    context: { en: "Supernova Gaming · Play4Tune", pt: "Supernova Gaming · Play4Tune" },
    role: { en: "Built entirely solo", pt: "Construído inteiro por mim" },
    summary: {
      en: "The admin panel that runs the whole gamification system: operators create and tune every mission, reward and game without a deploy.",
      pt: "O painel que controla todo o sistema de gamificação: a operação cria e ajusta cada missão, prêmio e jogo sem precisar de deploy.",
    },
    how: {
      en: "Missions and quests, store, points, levels, VIP ranks, tournaments, prediction pools, minigames, jackpots, themes, onboarding and webhooks, all multi-currency and multi-language, plus a Player 360 view and live dashboards. Builders work by drag and drop with a preview of the real app screen. Security first: two-factor authentication (TOTP with QR code and recovery codes), sessions in signed httpOnly cookies so the token never reaches the browser, server-side token injection and sanitized rich text. A super admin console provisions new tenants, and the panel adapts to each tenant's system version.",
      pt: "Missões e quests, loja, pontos, níveis, ranks VIP, torneios, bolões, minigames, jackpots, temas, onboarding e webhooks, tudo multi-moeda e multi-idioma, além do Jogador 360 e dashboards ao vivo. Os construtores são de arrastar e soltar, com prévia da tela real do app. Segurança em primeiro lugar: autenticação em duas etapas (TOTP com QR code e códigos de recuperação), sessão em cookie httpOnly assinado para o token nunca chegar ao navegador, token injetado no servidor e texto rico sanitizado. Um console de super admin provisiona novos tenants, e o painel se adapta à versão do sistema de cada um.",
    },
    purpose: {
      en: "Give the operations team full control of the loop, safely, with a refined UI they enjoy using every day.",
      pt: "Dar à operação controle total do loop, com segurança e uma UI refinada que dá gosto de usar todo dia.",
    },
    stack: ["Next.js", "React", "TypeScript", "React Query", "TanStack Table", "React Hook Form", "Zod", "Recharts", "PixiJS", "next-intl", "PGX UI"],
  },
  {
    id: "pgx-ui",
    name: "PGX UI",
    sprite: "controller",
    rarity: "epic",
    context: { en: "Supernova Gaming · Play4Tune", pt: "Supernova Gaming · Play4Tune" },
    role: { en: "All the code solo · designs by the UX team in Figma", pt: "Todo o código por mim · design do time de UX no Figma" },
    summary: {
      en: "The company's component library: 81 React components, dynamic theming and seven minigames, shared by the gamification loop, the back office and Supernova Bet.",
      pt: "A biblioteca de componentes da empresa: 81 componentes React, tema dinâmico e sete minigames, compartilhados pelo loop de gamificação, pelo backoffice e pela Supernova Bet.",
    },
    how: {
      en: "Each brand's theme arrives from the API as tokens and flows through CSS variables into Tailwind, so one library dresses every white-label site. I wrote all the code, turning the UX team's Figma components into React, mapped back to Figma with Code Connect and documented in Storybook. The minigame engine runs on PixiJS 8 with the draw sealed on the server: wheel, mystery box and scratch card in production, plus mines, crash, penalty and slot ready on the same contract, with per-instance sound and assets uploaded from the back office.",
      pt: "O tema de cada marca chega da API como tokens e desce por variáveis CSS até o Tailwind, então uma biblioteca veste todos os sites white-label. Escrevi todo o código, transformando os componentes do time de UX no Figma em React, ligados de volta ao Figma via Code Connect e documentados no Storybook. O motor de minigames roda em PixiJS 8 com o sorteio lacrado no servidor: roleta, caixa misteriosa e raspadinha em produção, além de mines, crash, pênalti e slot prontos no mesmo contrato, com som por instância e assets enviados pelo backoffice.",
    },
    purpose: {
      en: "Centralize UI and games in one place so the loop and Supernova Bet ship faster and look consistent.",
      pt: "Centralizar UI e jogos num lugar só para o loop e a Supernova Bet entregarem mais rápido e com visual consistente.",
    },
    stack: ["React", "TypeScript", "Tailwind", "PixiJS", "Framer Motion", "Storybook", "Figma", "Vitest", "npm"],
  },
  {
    id: "vortexvolley",
    name: "VortexVolley",
    sprite: "phone",
    rarity: "epic",
    context: { en: "Personal project", pt: "Projeto pessoal" },
    role: { en: "Solo, full stack", pt: "Solo, full stack" },
    summary: {
      en: "A volleyball team manager: mobile app, API and a WhatsApp bot.",
      pt: "Um gerenciador de time de vôlei: app mobile, API e bot de WhatsApp.",
    },
    how: {
      en: "Expo app with real-time updates over Socket.IO, a NestJS API with JWT access and refresh tokens and roles, PostgreSQL through Prisma, and a WhatsApp bot that syncs the game list with the group.",
      pt: "App em Expo com atualizações em tempo real via Socket.IO, API NestJS com JWT (access e refresh) e papéis, PostgreSQL com Prisma e um bot de WhatsApp que sincroniza a lista do jogo com o grupo.",
    },
    purpose: {
      en: "Stop organizing games by scrolling through group chats.",
      pt: "Parar de organizar jogo rolando conversa de grupo.",
    },
    stack: ["Expo", "React Native", "NestJS", "Prisma", "PostgreSQL", "Socket.IO"],
    link: "https://github.com/gmolari/vortexvolley",
  },
  {
    id: "bigette",
    name: "Bigette Fotos e Vídeos",
    sprite: "page",
    rarity: "epic",
    context: { en: "Freelance", pt: "Freelance" },
    role: { en: "Solo, front and back end", pt: "Solo, front e back end" },
    summary: {
      en: "Landing page for a photographer in Londrina, with its own admin back end.",
      pt: "Landing page de uma fotógrafa em Londrina, com back end administrativo próprio.",
    },
    how: {
      en: "Next.js 16 and React 19 with 3D scenes that only load on capable devices. Behind it, an authenticated admin panel (JWT and bcrypt) with PostgreSQL and Drizzle, media uploads to Vercel Blob and drag-and-drop gallery ordering. Full SEO setup.",
      pt: "Next.js 16 e React 19 com cenas 3D que só carregam em aparelhos capazes. Por trás, um painel admin autenticado (JWT e bcrypt) com PostgreSQL e Drizzle, upload de mídia no Vercel Blob e ordenação da galeria por arrastar e soltar. SEO completo.",
    },
    purpose: {
      en: "Bring clients in through WhatsApp and let the owner update her portfolio on her own.",
      pt: "Trazer clientes pelo WhatsApp e deixar a dona atualizar o portfólio sozinha.",
    },
    stack: ["Next.js", "React", "Tailwind", "Three.js", "Drizzle", "PostgreSQL", "Vercel Blob"],
    link: "https://github.com/gmolari/lp-bigette-fotos-e-videos",
  },
  {
    id: "game-lab",
    name: "Ad Monetization Engine",
    sprite: "potion",
    rarity: "legendary",
    context: { en: "R&D lab · casual mobile games", pt: "Laboratório de P&D · jogos mobile casuais" },
    role: { en: "Solo: engine and three games", pt: "Solo: motor e três jogos" },
    summary: {
      en: "An ad monetization engine for casual mobile games. For every player and moment it decides whether to show a rewarded ad, an interstitial or a banner, so the studio earns from ads without burning its players.",
      pt: "Um motor de monetização por anúncios para jogos mobile casuais. Para cada jogador e momento ele decide se mostra um anúncio recompensado, um intersticial ou um banner, para o estúdio faturar com anúncios sem queimar os jogadores.",
    },
    how: {
      en: "Tuned like a product, not code: frequency caps, a grace period for new players, interstitials only at game over, rewarded revives, presets (recommended, aggressive, no ads), remote config and a live log that explains every decision. AdMob with automatic fallback to cross-promotion house ads, an ad-free purchase, consent (UMP and LGPD) and protections for minors come built in.",
      pt: "Ajustado como produto, não como código: limite de frequência, carência para jogadores novos, intersticial só no game over, revive recompensado, predefinições (recomendado, agressivo, sem anúncios), remote config e um registro ao vivo que explica cada decisão. AdMob com fallback automático para house ads de promoção cruzada, compra para remover anúncios, consentimento (UMP e LGPD) e proteção para menores já vêm prontos.",
    },
    purpose: {
      en: "Grow ad revenue while keeping retention healthy, and launch new games on a ready-made monetization stack. Mosaico Neon, Alquimia das Cores and Parafusa! run on it, on web, Android and iOS.",
      pt: "Aumentar a receita com anúncios mantendo a retenção saudável e lançar novos jogos sobre uma base de monetização pronta. Mosaico Neon, Alquimia das Cores e Parafusa! rodam nele, na web, no Android e no iOS.",
    },
    stack: ["TypeScript", "PixiJS v8", "Vite", "Capacitor", "AdMob"],
  },
  {
    id: "sweepstakes",
    name: "Sweepstakes",
    sprite: "star",
    rarity: "epic",
    context: { en: "R&D lab", pt: "Laboratório de P&D" },
    role: { en: "Research and prototype", pt: "Pesquisa e protótipo" },
    summary: {
      en: "Market and legal research on sweepstakes casinos plus an original sweepstakes casino prototype.",
      pt: "Pesquisa de mercado e jurídica sobre cassinos sweepstakes e um protótipo original de cassino sweepstakes.",
    },
    how: {
      en: "Eight original slot games on one parametric reel engine in WebGL, dual currency, free spins, VIP tiers, season pass, daily wheel, missions, responsible-gaming tools and a simulated geoblock and KYC flow. All art is drawn in code and runs on web and Android.",
      pt: "Oito slots originais sobre um motor de rolos paramétrico em WebGL, moeda dupla, giros grátis, níveis VIP, passe de temporada, roda diária, missões, ferramentas de jogo responsável e um fluxo simulado de geobloqueio e KYC. Toda a arte é desenhada em código e roda na web e no Android.",
    },
    purpose: {
      en: "Understand the sweepstakes model (US, Japan, Brazil) and what it takes to build one.",
      pt: "Entender o modelo sweepstakes (EUA, Japão, Brasil) e o que é preciso para construir um.",
    },
    stack: ["JavaScript", "PixiJS", "Canvas", "Android WebView"],
  },
  {
    id: "citybuilder",
    name: "CityBuilder",
    sprite: "block",
    rarity: "uncommon",
    context: { en: "Personal project", pt: "Projeto pessoal" },
    role: { en: "Solo", pt: "Solo" },
    summary: {
      en: "A city-builder and RTS mod for Minecraft 1.20.",
      pt: "Um mod de city-builder e RTS para Minecraft 1.20.",
    },
    how: {
      en: "Built on Fabric in Kotlin, extending the MineFortress mod with city-building and strategy mechanics.",
      pt: "Feito em Kotlin sobre o Fabric, estendendo o mod MineFortress com mecânicas de construção de cidade e estratégia.",
    },
    purpose: {
      en: "Because writing game code outside the browser is fun too.",
      pt: "Porque escrever código de jogo fora do navegador também é divertido.",
    },
    stack: ["Kotlin", "Fabric", "Java"],
  },
];

export const ui = {
  en: {
    skip: "Skip cutscene",
    pressStart: "PRESS START",
    pressHint: "Click or press any key",
    loading: "LOADING",
    theme: "Toggle light or dark theme",
    otherLang: "Português",
    otherLangShort: "PT",
    cls: "Class",
    spec: "Specialization",
    attributes: "Attributes",
    skillTree: "Skill tree",
    skillHint: "hover or tap a rune",
    usedIn: "Used in",
    rank: "Rank",
    treeControls: { zoomIn: "Zoom in", zoomOut: "Zoom out", reset: "Recenter", help: "Drag to move · scroll or pinch to zoom" },
    alsoWith: "Comes with",
    level: "Level",
    questLog: "Quest log · Work experience",
    completed: "Completed",
    inventory: "Inventory",
    inventoryHint: "pick an item to inspect it",
    inventoryTitle: "Inventory · Projects",
    howItWorks: "How it works",
    purpose: "Purpose",
    stack: "Stack",
    role: "Role",
    source: "Source code",
    party: "Join the party",
    partyText: "Have a project, a role or a game idea? I usually answer within a day.",
    copy: "Copy",
    copied: "Copied",
    cv: "Download CV (PDF)",
    rarity: { legendary: "Legendary", epic: "Epic", rare: "Rare", uncommon: "Uncommon" } as Record<Rarity, string>,
    cvTitle: "Résumé",
    experience: "Experience",
    projects: "Projects",
    skills: "Skills",
    backToGame: "Back to the game",
    footer: "Built with Next.js and a lot of pixels.",
  },
  pt: {
    skip: "Pular cutscene",
    pressStart: "PRESS START",
    pressHint: "Clique ou aperte qualquer tecla",
    loading: "CARREGANDO",
    theme: "Alternar tema claro ou escuro",
    otherLang: "English",
    otherLangShort: "EN",
    cls: "Classe",
    spec: "Especialização",
    attributes: "Atributos",
    skillTree: "Árvore de skills",
    skillHint: "passe o mouse ou toque numa runa",
    usedIn: "Usado em",
    rank: "Rank",
    treeControls: { zoomIn: "Aproximar", zoomOut: "Afastar", reset: "Centralizar", help: "Arraste para mover · role ou pince para zoom" },
    alsoWith: "Junto com",
    level: "Nível",
    questLog: "Quest log · Experiência profissional",
    completed: "Concluída",
    inventory: "Inventário",
    inventoryHint: "escolha um item para inspecionar",
    inventoryTitle: "Inventário · Projetos",
    howItWorks: "Como funciona",
    purpose: "Finalidade",
    stack: "Stack",
    role: "Papel",
    source: "Código-fonte",
    party: "Entre na party",
    partyText: "Tem um projeto, uma vaga ou uma ideia de jogo? Costumo responder em até um dia.",
    copy: "Copiar",
    copied: "Copiado",
    cv: "Baixar CV (PDF)",
    rarity: { legendary: "Lendário", epic: "Épico", rare: "Raro", uncommon: "Incomum" } as Record<Rarity, string>,
    cvTitle: "Currículo",
    experience: "Experiência",
    projects: "Projetos",
    skills: "Skills",
    backToGame: "Voltar ao jogo",
    footer: "Feito com Next.js e muitos pixels.",
  },
} satisfies Record<Locale, unknown>;

export const skillList = [
  "TypeScript", "JavaScript", "React", "Next.js", "React Native", "Expo", "PixiJS", "Three.js", "Framer Motion",
  "Tailwind CSS", "Zustand", "React Query", "Node.js", "NestJS", "Socket.IO", "C#", "ASP.NET", "Entity Framework",
  "Kotlin", "Java", "PostgreSQL", "MySQL", "MongoDB", "Prisma", "Drizzle", "Capacitor", "Figma", "Claude Code", "MCP",
];
