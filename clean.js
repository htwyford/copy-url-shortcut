"use strict";

// Query parameters that only record where a click came from. Removing them
// never changes which page a link opens. Keys are matched case-insensitively.
const TRACKING_PARAMS = new Set([
  // Ad click IDs
  "gclid", "gclsrc", "dclid", "gbraid", "wbraid", "msclkid", "yclid", "twclid",
  "ttclid", "li_fat_id", "epik", "rdt_cid", "s_kwcid", "ef_id",
  // Social
  "fbclid", "igshid", "igsh", "mibextid",
  // Email and marketing automation
  "mc_cid", "mc_eid", "_hsenc", "_hsmi", "__hssc", "__hstc", "__hsfp",
  "hsctatracking", "mkt_tok", "vero_id", "vero_conv", "oly_anon_id",
  "oly_enc_id", "rb_clickid", "s_cid", "sc_cid", "ml_subscriber",
  "ml_subscriber_hash", "_kx", "wickedid", "trk_contact", "trk_msg",
  "trk_module", "trk_sid",
  // Analytics cross-site linkers
  "_ga", "_gl", "srsltid", "_branch_match_id", "_bta_tid", "_bta_c",
  // Matomo / Piwik campaigns
  "pk_campaign", "pk_kwd", "pk_keyword", "pk_source", "pk_medium",
  "pk_content", "pk_cid",
]);

const TRACKING_PREFIXES = ["utm_", "hsa_", "mtm_", "matomo_"];

// Parameters that are tracking on particular sites but can mean something
// elsewhere (YouTube's "si" share ID vs. a site using "si" for a page).
const SITE_PARAMS = [
  [/(^|\.)(youtube\.com|youtu\.be)$/, ["si", "feature"]],
  [/(^|\.)spotify\.com$/, ["si"]],
  [/(^|\.)(twitter|x)\.com$/, ["s", "t", "ref_src", "ref_url"]],
  [/(^|\.)linkedin\.com$/, ["trk", "trkinfo", "lipi"]],
  [/(^|\.)amazon\.[a-z.]+$/, ["ref_", "pd_rd_r", "pd_rd_w", "pd_rd_wg", "pf_rd_p", "pf_rd_r", "content-id"]],
];

// Returns the URL with tracking parameters removed. Everything else, including
// the exact encoding of the parameters that stay, is left as it was.
function cleanUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return url;
  }
  if ((parsed.protocol !== "http:" && parsed.protocol !== "https:") || !parsed.search) return url;

  const siteParams = new Set(
    SITE_PARAMS.filter(([host]) => host.test(parsed.hostname)).flatMap(([, keys]) => keys)
  );
  const isTracking = (pair) => {
    let key;
    try {
      key = decodeURIComponent(pair.split("=")[0].replace(/\+/g, " ")).toLowerCase();
    } catch {
      return false;
    }
    return (
      TRACKING_PARAMS.has(key) ||
      siteParams.has(key) ||
      TRACKING_PREFIXES.some((prefix) => key.startsWith(prefix))
    );
  };

  const pairs = parsed.search.slice(1).split("&");
  const kept = pairs.filter((pair) => !isTracking(pair));
  if (kept.length === pairs.length) return url;
  parsed.search = kept.filter(Boolean).join("&");
  return parsed.href;
}
