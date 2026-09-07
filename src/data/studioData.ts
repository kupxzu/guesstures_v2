import { Discipline, PricingTier, LifecyclePhase, GovernanceTerm } from '../types';

export const DISCIPLINES: Discipline[] = [
  {
    id: 'web',
    code: '01 // WEB DEVELOPMENT',
    tag: 'WEB.CLOUD',
    title: 'Full-Stack Cloud Native Platforms',
    category: 'Web Apps, APIs & Cloud Systems',
    description:
      'Modern and responsive web applications with clean architecture. We build fast frontends and reliable backends that are easy to run, deploy, and scale.',
    features: [
      'React (TypeScript & JavaScript)',
      'Django & FastAPI Backends',
      'Laravel & Inertia.js Stack',
      'PostgreSQL & REST / WebSocket APIs',
    ],
    benchmark: 'FAST LOAD: Optimized APIs & Quick Page Renders',
    specDetails: {
      stack: ['TypeScript & JavaScript', 'React', 'Django', 'FastAPI', 'Laravel / Inertia.js', 'PostgreSQL', 'Tailwind CSS', 'Docker / Cloud Hosting'],
      architecture: 'Clean layered architecture with React on the frontend, robust REST/GraphQL APIs (Django / FastAPI / Laravel), and organized PostgreSQL database schemas.',
      keyDeliverables: [
        'Complete Git repository with type-safe code and clear setup instructions',
        'Database setup scripts, migrations & sample seed data',
        'Ready-to-deploy configuration (Docker / Vercel / Cloud)',
        'Full API documentation and step-by-step installation guide',
      ],
      latencyProfile: 'Fast response times (<50ms API calls) and lightweight client bundle',
      sampleSchematic: 'User Browser ──[HTTPS / REST]──> React Frontend ──[API Requests]──> Django / FastAPI / Laravel ──> PostgreSQL Database',
    },
  },
  {
    id: 'mobile',
    code: '02 // MOBILE APPS',
    tag: 'MOBILE.APP',
    title: 'Native iOS & Android Ecosystems',
    category: 'Cross-Platform & Native Mobile Applications',
    description:
      'Smooth, user-friendly mobile applications for both iOS and Android. Designed for great performance, intuitive user experience, and easy store release.',
    features: [
      'React Native Development',
      'Flutter Cross-Platform Apps',
      'Offline Storage & Cloud Sync',
      'Clean UI/UX & Push Notifications',
    ],
    benchmark: 'PERFORMANCE: 60 FPS Smooth Animations',
    specDetails: {
      stack: ['React Native', 'Flutter', 'TypeScript / Dart', 'SQLite / Async Storage', 'Firebase / REST APIs', 'Tailored Mobile UI Components'],
      architecture: 'Modern cross-platform mobile architecture with reactive state management, offline local caching, and seamless REST/Firebase backend integration.',
      keyDeliverables: [
        'Ready-to-run iOS and Android project source code',
        'Build files (.apk / .aab for Android, .ipa / Xcode project for iOS)',
        'Step-by-step build, testing, and installation guide',
        'Integrated UI screens with complete form validation and error handling',
      ],
      latencyProfile: 'Smooth 60 FPS transitions, fast app startup time (<1.5s)',
      sampleSchematic: 'Mobile Device (iOS / Android) ──> React Native / Flutter App ──[Local Storage]──> REST API / Firebase Backend',
    },
  },
  {
    id: 'ai',
    code: '03 // AI & MACHINE LEARNING',
    tag: 'AI.ML',
    title: 'Agentic Systems & Neural Pipelines',
    category: 'Machine Learning, AI Agents & RAG Pipelines',
    description:
      'Practical AI and machine learning solutions. From intelligent chatbots and document search with RAG to custom ML models and agent workflows.',
    features: [
      'PyTorch & Python ML Pipelines',
      'TensorFlow (Python & TensorFlow.js)',
      'Qdrant Vector Database for RAG',
      'AI Agents, LangChain & LLM Tools',
    ],
    benchmark: 'AI SEARCH: Instant Semantic & Vector Retrieval',
    specDetails: {
      stack: ['PyTorch', 'TensorFlow (Python & JS)', 'Qdrant Vector DB', 'Machine Learning & RAG Pipelines', 'FastAPI AI Backend', 'OpenAI / HuggingFace / Local Models'],
      architecture: 'End-to-end AI workflow connecting document ingestion, embedding generation, Qdrant vector storage, and RAG-powered prompt reasoning with clean web interfaces.',
      keyDeliverables: [
        'Trained or integrated AI model pipeline and inference API',
        'Vector database setup with Qdrant collection scripts',
        'Interactive web demo or chatbot interface for testing',
        'Jupyter notebooks and clear documentation explaining the model',
      ],
      latencyProfile: 'Real-time vector queries (<30ms) with fast streaming responses',
      sampleSchematic: 'User Prompt / Document ──> Text Preprocessor ──> Embedding Model ──> Qdrant Vector DB (RAG) ──> AI LLM / ML Model ──> Output Result',
    },
  },
  {
    id: 'robotics',
    code: '04 // ROBOTICS & AUTOMATION',
    tag: 'ROBOTICS.AUTO',
    title: 'Robotics Automation',
    category: 'Microcontrollers, Arduino, ESP & 3D Hardware Prototypes',
    description:
      'Custom robotics, hardware automation, and IoT projects. Built with ESP32/ESP8266, Arduino, C++, and custom 3D designed prototypes for school labs, capstones, and industry.',
    features: [
      'ESP32 & ESP8266 WiFi/Bluetooth Boards',
      'C++ & Arduino Microcontroller Firmware',
      '3D Design & Physical Prototyping',
      'Sensor Integration, Motors & Automation',
    ],
    benchmark: 'RESPONSE: Real-time sensor & motor reaction',
    specDetails: {
      stack: ['ESP32 / ESP8266', 'Arduino IDE / PlatformIO', 'C / C++ Embedded Code', '3D CAD Design & 3D Printing (STL/STEP)', 'Sensors (Ultrasonic, IR, IMU, Temp)', 'Relays, Steppers & Servo Actuators'],
      architecture: 'Microcontroller-based automation system reading sensor inputs, executing control logic in C++, driving motors/relays, and sending telemetry via WiFi/Bluetooth or serial.',
      keyDeliverables: [
        'Clean and well-commented C++/Arduino source code',
        'Wiring schematics and component list (BOM)',
        '3D model files (.STL / .STEP) ready for 3D printing',
        'Complete assembly guide, pinout diagrams, and demo video',
      ],
      latencyProfile: 'Instant hardware loop response (<10ms) and fast sensor readings',
      sampleSchematic: 'Sensors & Inputs ──> Arduino / ESP32 (C++ Firmware) ──> Motor Drivers & Actuators + 3D Printed Chassis ──[WiFi/BT]──> Mobile/Web Dashboard',
    },
  },
];

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'prototype',
    tierCode: 'TIER 01 // PROTOTYPE & MVP',
    duration: '1-2 WEEKS',
    title: 'PROTOTYPE SPRINT',
    description: 'Fast Proof-of-Concept or MVP build for Web, Mobile, AI, or simple Robotics.',
    business: {
      price: '₱18,000',
      period: '/ project',
      subtext: 'Fixed cost. Working prototype ready for product testing or client presentation.',
    },
    student: {
      price: '₱8,500',
      period: '/ project',
      subtext: 'Student rate. Perfect for initial capstone prototypes, lab demos, and school projects.',
    },
    features: [
      '1 Core platform (Web, Mobile, AI, or Robotics)',
      'Key features implemented with clean user interface',
      '100% Full source code and project files handover',
      'Step-by-step setup guide and documentation',
      '14-day free bug fix support after delivery',
    ],
    ctaLabel: 'Inquire for Prototype',
  },
  {
    id: 'core',
    tierCode: 'TIER 02 // COMPLETE SYSTEM',
    duration: '3-4 WEEKS',
    title: 'CORE COMMISSION',
    description: 'Full web application, mobile app, AI system, or complete thesis/capstone project.',
    recommended: true,
    business: {
      price: '₱45,000',
      period: '/ project',
      subtext: 'Production-ready application with backend, database, and complete features.',
    },
    student: {
      price: '₱13,500',
      period: '/ full project',
      subtext: 'Full thesis or capstone system with complete documentation, diagrams, and testing.',
    },
    features: [
      'Full-featured frontend, backend & database system',
      'Complete authentication, user roles & dashboard',
      'Cloud deployment or ready-to-run local setup',
      'Detailed documentation, manual & architecture diagrams',
      'Integration with AI, IoT, or external APIs',
      '30-day warranty & free assistance for defense/demo',
    ],
    ctaLabel: 'Commission Core Project',
  },
  {
    id: 'robotics',
    tierCode: 'TIER 03 // ROBOTICS & ADVANCED',
    duration: 'CUSTOM TIMELINE',
    title: 'ROBOTICS & ADVANCED SYSTEM',
    description: 'Full hardware robotics build with 3D design, microcontrollers, mobile/web controls, and AI.',
    business: {
      price: '₱85,000+',
      period: '/ custom scope',
      subtext: 'Complete hardware prototype, C++ firmware, 3D casing, and web/mobile controller.',
    },
    student: {
      price: '₱20,000',
      period: '/ thesis package',
      subtext: 'Robotics hardware setup, Arduino/ESP code, 3D prototype files, and full thesis support.',
    },
    features: [
      'Custom C++ firmware for ESP32/ESP8266/Arduino',
      'Custom 3D model designs (.STL) ready for 3D printing',
      'Complete circuit schematics, wiring guide & bill of materials',
      'Web or mobile dashboard to monitor and control hardware',
      'Direct guidance for wiring, hardware assembly & troubleshooting',
    ],
    ctaLabel: 'Inquire for Robotics Project',
  },
];

export const LIFECYCLE_PHASES: LifecyclePhase[] = [
  {
    phase: 'PHASE 01',
    timeframe: 'DAYS 1-2',
    title: 'Requirements & Planning',
    description:
      'We discuss your project goals, choose the right tech stack (Web, Mobile, AI, or Robotics), and agree on a clear scope and timeline.',
    deliverable: 'DELIVERABLE: Project Roadmap & Agreed Features',
  },
  {
    phase: 'PHASE 02',
    timeframe: 'WEEKS 1-2',
    title: 'Core Development',
    description:
      'We build the main features, UI screens, backend APIs, AI models, or Arduino/ESP firmware. You get regular updates and live demos.',
    deliverable: 'DELIVERABLE: Working Demo & Progress Preview',
  },
  {
    phase: 'PHASE 03',
    timeframe: 'WEEK 3',
    title: 'Testing & Polishing',
    description:
      'We test all buttons, database queries, sensor inputs, and edge cases to make sure everything works reliably without errors.',
    deliverable: 'DELIVERABLE: Tested & Bug-Free Build',
  },
  {
    phase: 'PHASE 04',
    timeframe: 'FINAL SIGNOFF',
    title: 'Delivery & Full Handover',
    description:
      'We hand over 100% of the source code, 3D CAD files, setup instructions, and help you get it running on your laptop or server.',
    deliverable: 'DELIVERABLE: All Source Code, 3D Files & Setup Guide',
  },
];

export const GOVERNANCE_TERMS: GovernanceTerm[] = [
  {
    id: 'term-1',
    num: '01',
    title: '100% Full Ownership & Source Code Handover',
    content:
      'Once the project is completed, you own all of the code, design files, 3D models, and documentation created for you. There are no recurring royalties or hidden ownership claims.',
    standardNote: 'SUMMARY: Full commercial ownership transferred to you.',
  },
  {
    id: 'term-2',
    num: '02',
    title: ' Budget-Friendly Discounts',
    content:
      'We provide budget-friendly rates for senior high, college(under and post), and university students for thesis, capstone, and research projects. Just let us know your school or course during inquiry.',
    standardNote: 'ELIGIBILITY: Valid for student capstones, thesis, and academic coursework.',
  },
  {
    id: 'term-3',
    num: '03',
    title: 'Clear Milestones & Free Revisions',
    content:
      'Projects are delivered in clear steps. After receiving your project, you have a 7-day review period to test everything and request adjustments within the agreed scope at no extra charge.',
    standardNote: 'WARRANTY: 7-day review window with quick fixes for any agreed scope issues.',
  },
  {
    id: 'term-4',
    num: '04',
    title: 'Privacy & Confidentiality',
    content:
      'Your project ideas, research papers, and data are treated with strict confidentiality. We never share or sell your project details to third parties.',
    standardNote: 'PRIVACY: Confidentiality guaranteed for all student and client inquiries.',
  },
  {
    id: 'term-5',
    num: '05',
    title: 'Setup Support & Bug Fix Assistance',
    content:
      'Every project comes with clear step-by-step setup instructions. We also include up to 30 days of free technical support to answer questions and fix unexpected bugs.',
    standardNote: 'SUPPORT: Free setup assistance and bug fixes included after delivery.',
  },
];
