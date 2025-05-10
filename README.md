# Tauri + Drizzle ORM + SQLite (via SQL Plugin)

This project is a cross-platform desktop application built with [Tauri](https://tauri.app/), using [Drizzle ORM](https://orm.drizzle.team/) for type-safe database access and the [@tauri-apps/plugin-sql](https://github.com/tauri-apps/plugins-workspace/tree/dev/plugins/sql) plugin to manage SQLite.

## 🛠️ Tech Stack

- [Tauri](https://tauri.app/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [SQLite](https://www.sqlite.org/index.html)
- [@tauri-apps/plugin-sql](https://pub.dev/packages/tauri_plugin_sql)
- Your frontend framework (React, Svelte, etc.)

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-username/your-tauri-drizzle-app.git
cd your-tauri-drizzle-app

# Install dependencies
npm install

# Install Rust components
rustup update
cargo install tauri-cli
