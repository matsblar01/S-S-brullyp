// Felles oppsett for gjestesiden og adminsiden.
// Finnes i Supabase: Project Settings → API.
window.CONFIG = {
  supabaseUrl: "https://zrmsprurpmlwdpxvcbqd.supabase.co",
  supabaseAnonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpybXNwcnVycG1sd2RweHZjYnFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM0NjIwNTAsImV4cCI6MjEwOTAzODA1MH0.uTH8CEcFdD73iCdmIPXLl1MRYjKd6aZER0zrCyLL-KY",

  // Maks antall personer per påmelding (deg + andre). 1 = bare seg selv.
  maksPersoner: 9,

  // false = knappen viser «Påmelding åpner snart» (siden trenger da ingen database)
  paameldingApen: true
};
