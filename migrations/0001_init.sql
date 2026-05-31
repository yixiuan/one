-- NexShore Technologies — D1 数据库初始化迁移
-- Migration: 0001_init

-- 询盘表
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  company TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  is_read INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_inquiries_created ON inquiries(created_at DESC);

-- 文章表
CREATE TABLE IF NOT EXISTS articles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  cover_image TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  published_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_articles_slug_locale ON articles(slug, locale);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status, locale);

-- 内容块表（CMS）
CREATE TABLE IF NOT EXISTS content_blocks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_content_key_locale ON content_blocks(key, locale);

-- SEO 元信息表
CREATE TABLE IF NOT EXISTS seo_meta (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  path TEXT NOT NULL,
  locale TEXT NOT NULL DEFAULT 'en',
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT,
  og_image TEXT
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_seo_path_locale ON seo_meta(path, locale);

-- 管理员表
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- 初始管理员（用户名: admin，密码: admin123）
-- password_hash = SHA-256("admin123" + ":" + "nexshore_salt_2024")
INSERT OR IGNORE INTO admin_users (username, password_hash)
VALUES ('admin', 'a7a7f9f7c5014939af90d1c6635d18856280a3a2c3eb8979d96385a622b4ded7');

-- 初始 SEO 数据
INSERT OR IGNORE INTO seo_meta (path, locale, title, description, keywords) VALUES
('/', 'en', 'NexShore Technologies — Your Bridge to Chinese Manufacturing', 'Technical consulting, sourcing, factory auditing and quality inspection services connecting global businesses with Chinese manufacturing.', 'sourcing, factory audit, quality inspection, China manufacturing, supplier identification'),
('/', 'zh', 'NexShore Technologies — 连接中国制造的可信桥梁', '提供技术咨询、供应商寻源、工厂审核与质量检验服务，连接全球企业与中国制造能力。', '供应商寻源, 工厂审核, 质量检验, 中国制造'),
('/about', 'en', 'About Us — NexShore Technologies', 'Over 15 years of technical expertise bridging global companies with Chinese innovation and manufacturing capacity.', 'about NexShore, China sourcing company'),
('/services', 'en', 'Our Services — NexShore Technologies', 'Technical consulting, supplier sourcing, factory auditing and pre-shipment inspection services for global businesses.', 'technical consulting, supplier sourcing, factory audit, pre-shipment inspection'),
('/contact', 'en', 'Contact Us — NexShore Technologies', 'Get in touch with NexShore Technologies to source, manufacture and deliver high-quality products from China.', 'contact NexShore, China sourcing inquiry');

-- 初始文章数据
INSERT OR IGNORE INTO articles (slug, locale, title, excerpt, content, cover_image, status, published_at) VALUES
('navigating-china-supply-chain-2024', 'en', 'Navigating the China Supply Chain in 2024', 'Key strategies for international companies looking to source reliably from China amid evolving market dynamics.', 'The global supply chain landscape continues to evolve rapidly. For international companies, China remains an indispensable manufacturing partner. In this article, we explore the key strategies for navigating sourcing, quality control, and supplier relationships in 2024.\n\nUnderstanding local business culture is the first step. At NexShore, our 15+ years of on-the-ground experience give us unparalleled insight into the industrial landscape. We help our partners avoid common pitfalls and build resilient supply chains.\n\nFrom initial supplier identification to final pre-shipment inspection, a transparent and technically-driven approach ensures consistent quality and peace of mind.', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=modern%20industrial%20supply%20chain%20logistics%20containers%20port%20blue%20professional&image_size=landscape_16_9', 'published', '2024-03-15 10:00:00'),
('factory-audit-best-practices', 'en', 'Factory Audit Best Practices for Quality Assurance', 'How thorough on-site audits protect your brand and ensure your manufacturing partners meet technical and social compliance.', 'A factory audit is far more than a simple checklist. It is a comprehensive assessment of a supplier''s technical competence, production capacity, quality control systems, and working conditions.\n\nOur audits go beyond surface-level inspection. We evaluate whether a supplier is truly capable of meeting your technical specifications and quality benchmarks. This protects your brand reputation and reduces the risk of costly production issues.\n\nSocial compliance is equally important. We ensure that your manufacturing partners maintain ethical working conditions, giving you confidence in your supply chain.', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=factory%20inspection%20engineer%20quality%20control%20clipboard%20industrial%20manufacturing&image_size=landscape_16_9', 'published', '2024-02-20 09:30:00'),
('why-technical-sourcing-matters', 'en', 'Why Technical Sourcing Beats Traditional Trading', 'The difference between a trading company and a technical sourcing partner can make or break your product quality.', 'Traditional trading companies focus on transactions. A technical sourcing partner focuses on outcomes.\n\nAt NexShore, our engineering team understands the how and why behind your products. We speak the language of engineers, ensuring your technical specifications are understood and executed perfectly by local partners.\n\nThis technical depth translates into superior quality control, fewer revisions, and products that meet your exact requirements the first time.', 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=engineers%20reviewing%20technical%20blueprints%20mechanical%20design%20collaboration%20office&image_size=landscape_16_9', 'published', '2024-01-10 14:00:00');
