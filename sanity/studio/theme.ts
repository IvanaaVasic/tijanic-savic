import { buildLegacyTheme } from "sanity";

// The Studio in the office's colours. buildLegacyTheme takes a handful of base
// colours and derives the rest of the palette from them — hover states, borders,
// the dark scheme — so only the brand's anchors are named here.
//
// The values are the site's tokens from app/tokens.css, written out: the Studio
// is its own root and does not load the site's stylesheets.
//
// Gold is deliberately not a button colour. White text on --gold is 2.2 : 1 and
// fails every standard, exactly as it does on the site; gold appears in the
// monogram in the top bar instead. Primary actions (Publish) are the dark green.
// The state colours — success, warning, danger — stay Sanity's own: an editor
// has to recognise "error" at a glance, and a brand-coloured red helps nobody.
const color = {
  pageGreen: "#0b2f24", // --green-alt, the site's page background
  deepGreen: "#0f382c", // --green-deep
  cream: "#efece6", // --cream
  ink: "#1e2622", // --ink
  greyGreen: "#55605a", // --grey-green
  // One step lighter than --cream: the site's cream as the ground of every
  // form field made the Studio look faded, so the panels get this warmer white.
  paper: "#faf8f4",
};

export const studioTheme = buildLegacyTheme({
  "--black": color.ink,
  "--white": color.paper,

  "--gray": color.greyGreen,
  "--gray-base": color.greyGreen,

  "--component-bg": color.paper,
  "--component-text-color": color.ink,

  "--brand-primary": color.deepGreen,

  "--default-button-color": color.greyGreen,
  "--default-button-primary-color": color.deepGreen,

  // The top bar, as the site's header: the page green with cream text.
  "--main-navigation-color": color.pageGreen,
  "--main-navigation-color--inverted": color.cream,

  "--focus-color": color.deepGreen,
});
