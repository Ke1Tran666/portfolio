window.PORTFOLIO_DATA = {
  typingPhrases: [
    "Full-stack Developer với React & Java Spring Boot.",
    "Tôi xây frontend với ReactJS & Tailwind CSS.",
    "Tôi phát triển REST API với Java & Spring Boot.",
    "Tôi làm việc với Spring Security & SQL Server.",
    "Tôi xây dựng ứng dụng từ frontend đến backend.",
  ],

  projects: [
    {
      title: "Garment Design System",

      subtitle: "Full-stack Garment Manufacturing Service Platform",

      desc: `
                Hệ thống full-stack phục vụ lĩnh vực may mặc,
                cho phép quản lý người dùng, dịch vụ, đơn hàng,
                file sản phẩm, đánh giá, dashboard và các quy trình khách hàng.
            `,

      img: "./assets/images/imgProjects/ke1tran666.github.io_Garment-design-landingPage_.png",

      category: "fullstack",

      tech: ["React", "Spring Boot", "Spring Security", "SQL Server"],

      featured: true,

      status: "Active Development",

      detail: "https://ke1tran666.github.io/Garment-design-landingPage/",

      repositories: [
        {
          name: "Backend",
          url: "https://github.com/Ke1Tran666/garmentDesign",
        },
        {
          name: "Frontend",
          url: "https://github.com/Ke1Tran666/garmentDesign_client",
        },
        {
          name: "Landing Page",
          url: "https://github.com/Ke1Tran666/Garment-design-landingPage",
        },
      ],
    },
    {
      title: "CodemeIO",

      subtitle: "Full-stack Web Development Project",

      desc: `
                Một trong những dự án full-stack đầu tiên của tôi,
                được xây dựng để thực hành CRUD, REST API,
                tích hợp frontend/backend và tổ chức project theo nhiều layer.
            `,

      img: "",

      category: "fullstack",

      tech: ["Java", "REST API", "JavaScript", "Database"],

      featured: true,

      repositories: [
        {
          name: "Backend / Original",
          url: "https://github.com/Ke1Tran666/codemeIO",
        },
        {
          name: "Frontend Remake",
          url: "https://github.com/Ke1Tran666/codemeIO-Client_remake",
        },
      ],
    },
    {
      title: "Personal Portfolio",

      subtitle: "Developer Portfolio",

      desc: `
                Portfolio cá nhân dùng để giới thiệu kỹ năng,
                dự án, công nghệ đang sử dụng và hành trình
                phát triển của tôi với vai trò Full-stack Developer.
            `,

      img: "./assets/images/imgProjects/ke1tran666.github.io_portfolio_.png",

      category: "frontend",

      tech: ["HTML", "Tailwind", "JavaScript"],

      detail: "https://ke1tran666.github.io/portfolio/",

      repositories: [
        {
          name: "Source",
          url: "https://github.com/Ke1Tran666/portfolio",
        },
      ],
    },
    {
      title: "Learn-Skill",

      subtitle: "Learning & Technical Notes",

      desc: `
                Repository dành cho việc học và luyện tập các kỹ năng
                kỹ thuật như Git, GitHub, programming concepts,
                workflow và các ghi chú phát triển phần mềm.
            `,

      img: "",

      category: "learning",

      tech: ["Git", "GitHub", "Programming"],

      repositories: [
        {
          name: "Repository",
          url: "https://github.com/Ke1Tran666/Learn-Skill",
        },
      ],
    },
    {
      title: "World Cup 2026 App",

      subtitle: "AI-Assisted Project",

      desc: `
                Ứng dụng thử nghiệm xoay quanh FIFA World Cup 2026,
                được phát triển theo workflow AI-assisted / vibe coding
                để thử nghiệm ý tưởng và xây dựng prototype nhanh.
            `,

      img: "./assets/images/imgProjects/ke1tran666.github.io_world-cup-2026_.png",

      category: "ai",

      tech: ["AI Assisted", "Web App"],

      vibe: true,

      repositories: [
        {
          name: "Repository",
          url: "https://github.com/Ke1Tran666/world-cup-2026-app",
        },
      ],
    },
    {
      title: "ToDooList",

      subtitle: "AI-Assisted Task Management",

      desc: `
                Ứng dụng quản lý công việc được tạo như một thử nghiệm
                về rapid application development và cách sử dụng AI
                để hỗ trợ quá trình xây dựng sản phẩm.
            `,

      img: "./assets/images/imgProjects/ke1tran666.github.io_todolist_.png",

      category: "ai",

      tech: ["AI Assisted", "Task Management"],

      vibe: true,

      repositories: [
        {
          name: "Repository",
          url: "https://github.com/Ke1Tran666/toDooList",
        },
      ],
    },
    {
      title: "Gold & Silver Tracker",

      subtitle: "AI-Assisted Tracking Application",

      desc: `
                Ứng dụng thử nghiệm theo dõi thông tin liên quan
                đến vàng và bạc, được xây dựng bằng workflow
                AI-assisted để thử nghiệm ý tưởng sản phẩm.
            `,

      img: "./assets/images/imgProjects/ke1tran666.github.io_gold-silver-tracker_.png",

      category: "ai",

      tech: ["AI Assisted", "Tracking"],

      vibe: true,

      repositories: [
        {
          name: "Repository",
          url: "https://github.com/Ke1Tran666/gold-silver-tracker",
        },
      ],
    },
  ],

  projectVisuals: {
    fullstack: {
      key: "fullstack",
      icon: "layers-3",
      label: "Full-stack Project",
    },

    frontend: {
      key: "frontend",
      icon: "monitor",
      label: "Frontend Project",
    },

    learning: {
      key: "learning",
      icon: "book-open",
      label: "Learning Project",
    },

    ai: {
      key: "ai",
      icon: "sparkles",
      label: "AI-Assisted Project",
    },

    default: {
      key: "default",
      icon: "code-2",
      label: "Development Project",
    },
  },
};
