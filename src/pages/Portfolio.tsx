import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { 
  Shield, Code, Terminal, Lock, Globe, Database, 
  Server, Eye, Bug, Wifi, ChevronDown, ExternalLink, 
  Github, Linkedin, Mail, MapPin, Award, Briefcase,
  ArrowRight, Layers, Monitor, Search, FileCode, Cpu
} from "lucide-react";
import { Button } from "@/components/ui/button";

const projects = [
  {
    id: 1,
    category: "Full Stack Development",
    title: "CloudSync — Real-Time Collaboration Platform",
    description: "A production-grade real-time collaboration platform enabling teams to co-edit documents, manage tasks, and communicate seamlessly. Built with React, Node.js, PostgreSQL, and WebSocket for instant data synchronization across clients.",
    tech: ["React", "Node.js", "PostgreSQL", "WebSocket", "Redis", "Docker", "TypeScript"],
    features: [
      "Real-time document co-editing with conflict resolution",
      "Role-based access control & team management",
      "RESTful API with JWT authentication",
      "CI/CD pipeline with automated testing",
      "Horizontally scalable microservice architecture"
    ],
    icon: Globe,
    gradient: "from-blue-500 to-cyan-400",
    accent: "blue",
    demoPath: "/demo/cloudsync"
  },
  {
    id: 2,
    category: "Full Stack Development",
    title: "FinTrack — Personal Finance Dashboard",
    description: "An intelligent financial management application with AI-powered spending analysis, budget forecasting, and automated transaction categorization. Full CRUD operations with secure banking API integration.",
    tech: ["Next.js", "Express", "MongoDB", "Chart.js", "Plaid API", "Tailwind CSS"],
    features: [
      "Automated bank transaction sync & categorization",
      "Interactive charts and spending analytics",
      "Budget planning with ML-powered forecasting",
      "Secure OAuth 2.0 & 2FA authentication",
      "Progressive Web App with offline support"
    ],
    icon: Database,
    gradient: "from-emerald-500 to-teal-400",
    accent: "emerald",
    demoPath: "/demo/fintrack"
  },
  {
    id: 3,
    category: "Ethical Hacking",
    title: "PenTest Suite — Automated Vulnerability Scanner",
    description: "A comprehensive penetration testing toolkit that automates reconnaissance, vulnerability scanning, and exploit verification. Generates detailed compliance reports with remediation steps aligned to OWASP Top 10.",
    tech: ["Python", "Nmap", "Metasploit", "Burp Suite", "SQLMap", "Docker"],
    features: [
      "Automated network discovery & port scanning",
      "Web application vulnerability detection (XSS, SQLi, CSRF)",
      "Custom exploit module framework",
      "PDF report generation with CVSS scoring",
      "Integration with CVE database for real-time threat intel"
    ],
    icon: Bug,
    gradient: "from-red-500 to-orange-400",
    accent: "red",
    demoPath: "/demo/pentest"
  },
  {
    id: 4,
    category: "Ethical Hacking",
    title: "PhishGuard — Social Engineering Defense Platform",
    description: "An enterprise-grade phishing simulation and training platform that tests organizational security awareness. Tracks employee response rates, delivers targeted training, and measures security posture improvements over time.",
    tech: ["Python", "Flask", "PostgreSQL", "SendGrid API", "React", "Docker"],
    features: [
      "Customizable phishing email template engine",
      "Real-time campaign tracking & analytics dashboard",
      "Automated security awareness training modules",
      "Click-rate analysis & risk scoring per department",
      "LDAP/Active Directory integration for user sync"
    ],
    icon: Eye,
    gradient: "from-amber-500 to-yellow-400",
    accent: "amber",
    demoPath: "/demo/phishguard"
  },
  {
    id: 5,
    category: "Cybersecurity",
    title: "NetSentinel — Network Intrusion Detection System",
    description: "A machine-learning-powered NIDS that monitors network traffic in real-time, detects anomalies and known attack signatures, and triggers automated incident response workflows with full SIEM integration.",
    tech: ["Python", "TensorFlow", "Scapy", "ELK Stack", "Snort", "Kafka"],
    features: [
      "Deep packet inspection with ML anomaly detection",
      "Real-time traffic visualization & threat mapping",
      "Automated incident response & quarantine rules",
      "Integration with Elasticsearch for log analysis",
      "Custom Snort rule generation & management"
    ],
    icon: Shield,
    gradient: "from-violet-500 to-purple-400",
    accent: "violet",
    demoPath: "/demo/netsentinel"
  },
  {
    id: 6,
    category: "Cybersecurity",
    title: "VaultKeeper — Zero-Trust Access Management",
    description: "A zero-trust identity and access management system implementing continuous verification, micro-segmentation, and encrypted secret management. Designed for enterprise environments requiring SOC 2 and ISO 27001 compliance.",
    tech: ["Go", "gRPC", "HashiCorp Vault", "Kubernetes", "Terraform", "React"],
    features: [
      "Continuous identity verification with behavioral analytics",
      "Dynamic secret rotation & encrypted storage",
      "Micro-segmented network access policies",
      "Compliance reporting (SOC 2, ISO 27001, GDPR)",
      "Multi-cloud deployment with Infrastructure as Code"
    ],
    icon: Lock,
    gradient: "from-pink-500 to-rose-400",
    accent: "pink",
    demoPath: "/demo/vaultkeeper"
  }
];

const certifications = [
  { name: "Full Stack Web Development", issuer: "Certified Professional" },
  { name: "Certified Ethical Hacker (CEH)", issuer: "EC-Council" },
  { name: "Cybersecurity Professional", issuer: "CompTIA / ISC²" },
];

const skills = {
  "Frontend": ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML5/CSS3"],
  "Backend": ["Node.js", "Python", "Express", "Flask", "Go"],
  "Database": ["PostgreSQL", "MongoDB", "Redis", "MySQL"],
  "Security": ["Penetration Testing", "Network Security", "SIEM", "IDS/IPS", "Threat Modeling"],
  "DevOps": ["Docker", "Kubernetes", "CI/CD", "Terraform", "AWS/Azure"],
  "Tools": ["Burp Suite", "Metasploit", "Wireshark", "Nmap", "Git"],
};

const navLinks = ["About", "Skills", "Projects", "Certifications", "Contact"];

export default function Portfolio() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");
  const [expandedProject, setExpandedProject] = useState<number | null>(null);

  const categories = ["All", "Full Stack Development", "Ethical Hacking", "Cybersecurity"];
  const filtered = activeFilter === "All" ? projects : projects.filter(p => p.category === activeFilter);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <span className="font-display text-lg tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            MT
          </span>
          <div className="hidden md:flex gap-8">
            {navLinks.map(link => (
              <button
                key={link}
                onClick={() => scrollTo(link.toLowerCase())}
                className="text-sm text-gray-400 hover:text-white transition-colors font-body tracking-wide"
              >
                {link}
              </button>
            ))}
          </div>
          <a href="mailto:maitsetumelo9@gmail.com">
            <Button size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 hover:opacity-90">
              Hire Me
            </Button>
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Animated grid background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }} />
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-600/10 blur-[120px]" />
        
        <div className="relative text-center px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/5 mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm text-cyan-300 font-body">Available for hire</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold mb-6 leading-tight">
            <span className="text-white">Maitsetumelo</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500">
              Full Stack Developer
            </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
              & Cybersecurity Expert
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-400 font-body max-w-2xl mx-auto mb-10 leading-relaxed">
            I build secure, scalable applications and protect digital infrastructure. 
            Combining development expertise with security-first thinking to create 
            software that's both powerful and resilient.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => scrollTo("projects")}
              className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 hover:opacity-90 h-12 px-8 text-base"
            >
              View Projects <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button 
              onClick={() => scrollTo("contact")}
              variant="outline"
              className="border-gray-700 text-gray-300 hover:bg-white/5 hover:text-white h-12 px-8 text-base"
            >
              Get In Touch
            </Button>
          </div>
          
          <div className="mt-16 flex justify-center gap-12 text-center">
            {[
              { value: "6+", label: "Projects Built" },
              { value: "3", label: "Certifications" },
              { value: "Full Stack", label: "& Security" },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl md:text-3xl font-display font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-500 font-body mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => scrollTo("about")}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-500 animate-bounce"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </section>

      {/* About */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-cyan-400 font-display text-sm tracking-[0.3em] uppercase mb-4 block">About Me</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
              Building the Future,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Securing the Present</span>
            </h2>
            <p className="text-gray-400 font-body text-lg leading-relaxed mb-6">
              I'm a passionate Full Stack Developer and Cybersecurity Professional with a unique blend of 
              skills that allows me to build applications from the ground up while ensuring they're 
              fortified against modern threats. My approach combines clean architecture with defense-in-depth 
              security principles.
            </p>
            <p className="text-gray-400 font-body text-lg leading-relaxed">
              From crafting responsive user interfaces to designing secure backend systems, 
              from conducting penetration tests to implementing zero-trust architectures — 
              I bring a holistic perspective to every project.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Code, label: "Full Stack Dev", desc: "End-to-end application development" },
              { icon: Shield, label: "Cybersecurity", desc: "Threat detection & prevention" },
              { icon: Terminal, label: "Ethical Hacking", desc: "Penetration testing & auditing" },
              { icon: Server, label: "DevOps", desc: "CI/CD & cloud infrastructure" },
            ].map(item => (
              <div key={item.label} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all group">
                <item.icon className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-display text-sm font-semibold text-white mb-1">{item.label}</h3>
                <p className="text-xs text-gray-500 font-body">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-display text-sm tracking-[0.3em] uppercase mb-4 block">Skills</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Technical <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Arsenal</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skills).map(([category, items]) => (
              <div key={category} className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/10 transition-all">
                <h3 className="font-display text-sm font-semibold text-cyan-400 mb-4 tracking-wider uppercase">{category}</h3>
                <div className="flex flex-wrap gap-2">
                  {items.map(skill => (
                    <span key={skill} className="px-3 py-1.5 rounded-lg bg-white/[0.04] text-sm text-gray-300 font-body border border-white/5">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-cyan-400 font-display text-sm tracking-[0.3em] uppercase mb-4 block">Portfolio</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-8">
              Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Projects</span>
            </h2>
            
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-body transition-all ${
                    activeFilter === cat
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"
                      : "bg-white/[0.04] text-gray-400 hover:text-white border border-white/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {filtered.map((project) => {
              const Icon = project.icon;
              const isExpanded = expandedProject === project.id;
              return (
                <div
                  key={project.id}
                  className="group rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all overflow-hidden cursor-pointer"
                  onClick={() => setExpandedProject(isExpanded ? null : project.id)}
                >
                  {/* Header gradient bar */}
                  <div className={`h-1 bg-gradient-to-r ${project.gradient}`} />
                  
                  <div className="p-6">
                    <div className="flex items-start gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${project.gradient} flex items-center justify-center shrink-0`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-xs text-gray-500 font-body uppercase tracking-wider">{project.category}</span>
                        <h3 className="font-display text-lg font-bold text-white mt-1 leading-tight">{project.title}</h3>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform shrink-0 ${isExpanded ? "rotate-180" : ""}`} />
                    </div>
                    
                    <p className="text-gray-400 font-body text-sm leading-relaxed mb-4">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tech.map(t => (
                        <span key={t} className="px-2.5 py-1 rounded-md bg-white/[0.04] text-xs text-gray-400 font-body border border-white/5">
                          {t}
                        </span>
                      ))}
                    </div>
                    
                    {isExpanded && (
                      <div className="pt-4 border-t border-white/5">
                        <h4 className="font-display text-sm font-semibold text-white mb-3">Key Features</h4>
                        <ul className="space-y-2">
                          {project.features.map((f, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-400 font-body">
                              <ArrowRight className="w-3.5 h-3.5 text-cyan-400 mt-1 shrink-0" />
                              {f}
                            </li>
                          ))}
                        </ul>
                        <div className="flex gap-3 mt-6">
                          <Button size="sm" onClick={(e) => { e.stopPropagation(); navigate(project.demoPath); }} className={`bg-gradient-to-r ${project.gradient} text-white border-0 hover:opacity-90`}>
                            <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Live Demo
                          </Button>
                          <a href="https://github.com/maitsetumelo" target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()}>
                            <Button size="sm" variant="outline" className="border-gray-700 text-gray-300 hover:bg-white/5">
                              <Github className="w-3.5 h-3.5 mr-1.5" /> Source Code
                            </Button>
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section id="certifications" className="py-24 px-6 bg-white/[0.01]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-cyan-400 font-display text-sm tracking-[0.3em] uppercase mb-4 block">Credentials</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
              Certifications & <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Achievements</span>
            </h2>
          </div>
          
          <div className="space-y-4">
            {certifications.map((cert, i) => (
              <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-cyan-500/20 transition-all group">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/10 group-hover:scale-110 transition-transform">
                  <Award className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-white">{cert.name}</h3>
                  <p className="text-sm text-gray-500 font-body">{cert.issuer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <span className="text-cyan-400 font-display text-sm tracking-[0.3em] uppercase mb-4 block">Contact</span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
            Let's Build Something <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-500">Together</span>
          </h2>
          <p className="text-gray-400 font-body text-lg mb-10">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your team.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a href="mailto:maitsetumelo9@gmail.com">
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white border-0 hover:opacity-90 h-12 px-8">
                <Mail className="w-4 h-4 mr-2" /> maitsetumelo9@gmail.com
              </Button>
            </a>
          </div>
          
          <div className="flex justify-center gap-6">
            <a href="https://github.com/maitsetumelo" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/20 transition-all">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com/in/maitsetumelo" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:border-cyan-500/20 transition-all">
              <Linkedin className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="font-display text-sm text-gray-500">© 2026 Maitsetumelo. All rights reserved.</span>
          <span className="text-sm text-gray-600 font-body">Built with passion & security in mind.</span>
        </div>
      </footer>
    </div>
  );
}
