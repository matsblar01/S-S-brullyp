// Felles oppsett for gjestesiden og adminsiden.
// Finnes i Supabase: Project Settings → API.
window.CONFIG = {
  supabaseUrl: "https://zrmsprurpmlwdpxvcbqd.supabase.co",
  supabaseAnonKey: "sb_publishable_HBnWloyVTilmt0PIaEt-SQ_dut_wgIo",

  // Maks antall personer per påmelding (deg + andre). 1 = bare seg selv.
  maksPersoner: 9,

  // false = knappen viser «Påmelding åpner snart» (siden trenger da ingen database)
  paameldingApen: true
};
