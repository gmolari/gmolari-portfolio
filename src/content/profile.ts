/**
 * Single source of truth for everything the site says.
 * Every string that is shown to visitors exists in EN and PT.
 */
import type { Locale } from "@/lib/i18n";

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
  { key: "HP", value: 92, label: { en: "coffee", pt: "café" } as T, color: "var(--hp)" },
  { key: "MP", value: 80, label: { en: "focus", pt: "foco" } as T, color: "var(--mp)" },
  { key: "XP", value: 70, label: { en: "senior", pt: "sênior" } as T, color: "var(--xp)" },
];

export const attributes = [
  { label: { en: "Frontend", pt: "Frontend" } as T, value: 19 },
  { label: { en: "Backend", pt: "Backend" } as T, value: 17 },
  { label: { en: "Architecture", pt: "Arquitetura" } as T, value: 17 },
  { label: { en: "Leadership", pt: "Liderança" } as T, value: 16 },
  { label: { en: "Mobile", pt: "Mobile" } as T, value: 15 },
  { label: { en: "Game dev", pt: "Game dev" } as T, value: 17 },
];

export type SkillNode = {
  id: string;
  label: string;
  x: number; // % of the tree width
  y: number; // % of the tree height
  level: "max" | "on";
  note: T;
};

export const skills: SkillNode[] = [
  { id: "ts", label: "TypeScript", x: 50, y: 10, level: "max", note: { en: "The base of everything I ship.", pt: "A base de tudo que eu entrego." } },
  { id: "react", label: "React", x: 24, y: 34, level: "max", note: { en: "Component libraries, design systems, performance.", pt: "Bibliotecas de componentes, design systems, performance." } },
  { id: "node", label: "Node.js", x: 76, y: 34, level: "on", note: { en: "REST APIs, real-time with Socket.IO, integrations with payment and third-party providers.", pt: "APIs REST, tempo real com Socket.IO, integrações com provedores de pagamento e terceiros." } },
  { id: "next", label: "Next.js", x: 9, y: 62, level: "max", note: { en: "App Router, SSR/SSG, SEO, Core Web Vitals.", pt: "App Router, SSR/SSG, SEO, Core Web Vitals." } },
  { id: "pixi", label: "PixiJS", x: 26, y: 62, level: "max", note: { en: "Minigames, 2D scenes, my own game engine.", pt: "Minigames, cenas 2D, meu próprio motor de jogos." } },
  { id: "rn", label: "React Native", x: 17, y: 88, level: "on", note: { en: "Expo apps; also Kotlin and Java on Android.", pt: "Apps em Expo; também Kotlin e Java no Android." } },
  { id: "capacitor", label: "Capacitor", x: 36, y: 88, level: "on", note: { en: "One codebase for web, Android and iOS games.", pt: "Um código para jogos web, Android e iOS." } },
  { id: "nest", label: "NestJS", x: 62, y: 62, level: "on", note: { en: "JWT auth, roles, WebSockets, Prisma.", pt: "Auth JWT, papéis, WebSockets, Prisma." } },
  { id: "dotnet", label: "C# · .NET", x: 88, y: 62, level: "on", note: { en: "ASP.NET and Entity Framework.", pt: "ASP.NET e Entity Framework." } },
  { id: "db", label: "SQL · Mongo", x: 75, y: 88, level: "on", note: { en: "PostgreSQL, MySQL, MongoDB; Prisma and Drizzle.", pt: "PostgreSQL, MySQL, MongoDB; Prisma e Drizzle." } },
  { id: "ai", label: "AI · MCP", x: 54, y: 88, level: "max", note: { en: "Claude Code, agents and MCP integrations for automation.", pt: "Claude Code, agentes e integrações MCP para automação." } },
];

export const skillLinks: [string, string][] = [
  ["ts", "react"], ["ts", "node"], ["react", "next"], ["react", "pixi"], ["react", "rn"],
  ["pixi", "capacitor"], ["node", "nest"], ["node", "dotnet"], ["nest", "db"], ["dotnet", "db"], ["ts", "ai"],
];

export const quests = [
  {
    id: "ana",
    title: { en: "Lead the party", pt: "Liderar a party" } as T,
    org: "Ana Gaming",
    role: { en: "Technical Lead", pt: "Tech Lead" } as T,
    text: {
      en: "Led a team of five front-end and back-end developers. Owned architecture decisions, delivery planning, coding standards, code review and technical mentoring.",
      pt: "Liderei um time de cinco devs front-end e back-end. Responsável por decisões de arquitetura, planejamento de entregas, padrões de código, code review e mentoria técnica.",
    } as T,
    reward: { en: "+ Leadership + Architecture", pt: "+ Liderança + Arquitetura" } as T,
  },
  {
    id: "supernova",
    title: { en: "Build the platform", pt: "Construir a plataforma" } as T,
    org: "Supernova Gaming",
    role: { en: "Senior Front-end Engineer", pt: "Engenheiro Front-end Sênior" } as T,
    text: {
      en: "One of the first engineers on the Supernova Bet platform: real-time features, REST and payment provider integrations, back offices and a shared component library. Later took ownership of the gamification layer and built it almost entirely on my own.",
      pt: "Um dos pioneiros na plataforma Supernova Bet: recursos em tempo real, integrações REST e com provedores de pagamento, backoffices e uma biblioteca de componentes compartilhada. Depois assumi a camada de gamificação e a construí praticamente sozinho.",
    } as T,
    reward: { en: "+ Frontend + Backend", pt: "+ Frontend + Backend" } as T,
  },
  {
    id: "multibet",
    title: { en: "Reinforce the kingdom", pt: "Reforçar o reino" } as T,
    org: "Multibet",
    role: { en: "Front-end Engineer", pt: "Engenheiro Front-end" } as T,
    text: {
      en: "Built features across the product and internal tools: Multi-verso, the refer-a-friend back office, admin tools for popups and minigames, and landing pages, working from Figma with React Query and Zustand.",
      pt: "Desenvolvi funcionalidades do produto e de ferramentas internas: Multi-verso, backoffice de indicação, painéis de cadastro de popups e minigames e landing pages, partindo do Figma com React Query e Zustand.",
    } as T,
    reward: { en: "+ Product", pt: "+ Produto" } as T,
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
    role: { en: "Built almost entirely solo", pt: "Construído praticamente solo" },
    summary: {
      en: "The retention layer of an iGaming platform: missions, levels, rewards and minigames living inside the product.",
      pt: "A camada de retenção de uma plataforma de iGaming: missões, níveis, recompensas e minigames dentro do produto.",
    },
    how: {
      en: "Players progress through missions and levels and earn rewards they can spend or play with. Minigames render in PixiJS, UI state lives in Zustand and server state in React Query, with a back office to configure every piece.",
      pt: "O jogador avança por missões e níveis e ganha recompensas para gastar ou jogar. Os minigames rodam em PixiJS, o estado de UI fica no Zustand e o de servidor no React Query, com um backoffice para configurar cada peça.",
    },
    purpose: {
      en: "Turn one-off visits into a habit: acquisition, activation and retention.",
      pt: "Transformar visitas avulsas em hábito: aquisição, ativação e retenção.",
    },
    stack: ["Next.js", "React", "TypeScript", "PixiJS", "Framer Motion", "Zustand", "React Query"],
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
    name: "Game Lab Engine",
    sprite: "potion",
    rarity: "legendary",
    context: { en: "R&D lab", pt: "Laboratório de P&D" },
    role: { en: "Solo: engine and three games", pt: "Solo: motor e três jogos" },
    summary: {
      en: "A shared engine plus three casual games (Mosaico Neon, Alquimia das Cores and Parafusa!) for web, Android and iOS.",
      pt: "Um motor compartilhado e três jogos casuais (Mosaico Neon, Alquimia das Cores e Parafusa!) para web, Android e iOS.",
    },
    how: {
      en: "The engine decides how much generated content helps the player (the dealer), when to offer revive, interstitial or banner (the ad policy), how mature a player is, and enforces wellbeing protections. It also ships the whole app shell: title screen, HUD, modals, sound and haptics. Each game is a block puzzle, a liquid sort or a screw puzzle on top of it.",
      pt: "O motor decide quanto o conteúdo gerado ajuda o jogador (o dealer), quando oferecer revive, intersticial ou banner (a policy de anúncios), qual a maturidade do jogador, e aplica proteções de bem-estar. Ele também entrega a casca do app: tela de título, HUD, modais, som e vibração. Cada jogo (block puzzle, ordenar líquidos, parafusos) roda em cima dele.",
    },
    purpose: {
      en: "Study game design and monetization with real, playable products instead of slides.",
      pt: "Estudar game design e monetização com produtos jogáveis de verdade, não com slides.",
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
    id: "minigames",
    name: "Daily Minigames",
    sprite: "controller",
    rarity: "rare",
    context: { en: "Supernova Gaming", pt: "Supernova Gaming" },
    role: { en: "Front-end", pt: "Front-end" },
    summary: {
      en: "Roulette, prize cases and scratch cards that players open every day.",
      pt: "Roleta, caixas de prêmio e raspadinha que o jogador abre todo dia.",
    },
    how: {
      en: "A spinning wheel with real easing, a sliding case roller and a canvas scratch card. The prize is chosen by weights and the animation lands exactly on it.",
      pt: "Uma roleta com easing de verdade, um rolo de caixas deslizante e uma raspadinha em canvas. O prêmio é sorteado por pesos e a animação para exatamente nele.",
    },
    purpose: {
      en: "A daily reason to come back, feeding the gamification loop.",
      pt: "Um motivo diário para voltar, alimentando o loop de gamificação.",
    },
    stack: ["Next.js", "Framer Motion", "Canvas", "PixiJS"],
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
    theme: "Toggle light or dark theme",
    otherLang: "Português",
    otherLangShort: "PT",
    cls: "Class",
    spec: "Specialization",
    attributes: "Attributes",
    skillTree: "Skill tree",
    skillHint: "hover or focus a node",
    questLog: "Quest log",
    completed: "Completed",
    inventory: "Inventory",
    inventoryHint: "pick an item to inspect it",
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
    theme: "Alternar tema claro ou escuro",
    otherLang: "English",
    otherLangShort: "EN",
    cls: "Classe",
    spec: "Especialização",
    attributes: "Atributos",
    skillTree: "Árvore de skills",
    skillHint: "passe o mouse ou foque um nó",
    questLog: "Quest log",
    completed: "Concluída",
    inventory: "Inventário",
    inventoryHint: "escolha um item para inspecionar",
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
