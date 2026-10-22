/**
 * SKILLS — grouped badges. Use level: "primary" | "experienced" | "working".
 * Do not add percentage bars. Add a technology by inserting a { name, level } object.
 */
window.SKILLS = {
    intro:
    "Primary work is Angular, Node.js, .NET Core, and SQL Server. Earlier roles: ASP.NET MVC, AngularJS, VB.NET, and PHP.",
  groups: [
    {
      id: "frontend",
      title: "Frontend",
      items: [
        { name: "Angular", level: "primary" },
        { name: "TypeScript", level: "primary" },
        { name: "JavaScript", level: "primary" },
        { name: "HTML", level: "primary" },
        { name: "CSS", level: "primary" },
        { name: "AngularJS", level: "experienced" },
        { name: "jQuery", level: "experienced" },
      ],
    },
    {
      id: "backend",
      title: "Backend",
      items: [
        { name: "Node.js", level: "primary" },
        { name: "C#", level: "primary" },
        { name: ".NET Core", level: "primary" },
        { name: "REST APIs", level: "primary" },
        { name: ".NET", level: "experienced" },
        { name: "ASP.NET MVC", level: "experienced" },
        { name: "VB.NET", level: "experienced" },
        { name: "PHP", level: "working" },
        { name: "AJAX", level: "experienced" },
      ],
    },
    {
      id: "database",
      title: "Database",
      items: [
        { name: "MSSQL / SQL Server", level: "primary" },
        { name: "MariaDB", level: "working" },
        { name: "PostgreSQL", level: "working" },
        { name: "MySQL", level: "working" },
      ],
    },
    {
      id: "integration",
      title: "Integration / Messaging",
      items: [
        { name: "REST APIs", level: "primary" },
        { name: "SAP", level: "experienced" },
        { name: "MES / QMOs", level: "experienced" },
        { name: "Kocks", level: "experienced" },
        { name: "RabbitMQ", level: "working" },
      ],
    },
    {
      id: "tools",
      title: "Tools / Environment",
      items: [
        { name: "Visual Studio", level: "primary" },
        { name: "Git", level: "primary" },
        { name: "IIS", level: "experienced" },
      ],
    },
  ],
  engineering: [
    "Web application development",
    "REST API development",
    "Database design and development",
    "System integration",
    "Enterprise applications",
    "Industrial application software",
    "Reporting systems",
    "Workflow systems",
    "Third-party integrations",
    "SAP integration",
    "MES integration",
    "Production / industrial systems",
  ],
};
