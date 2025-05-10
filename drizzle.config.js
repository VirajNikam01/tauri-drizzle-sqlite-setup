export default {
  schema: './src/lib/schema.js',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
  url: './src-tauri/test.db' 
}
}
