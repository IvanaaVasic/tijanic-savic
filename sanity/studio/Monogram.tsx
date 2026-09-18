// The TS monogram in the Studio's top bar and in the workspace menu, in place of
// Sanity's default icon. Cut out of public/logo-compact.png — replace it along
// with the site's logo when the vector files arrive.
export function Monogram() {
  return (
    // A plain <img>: the Studio renders this in the browser, next/image adds
    // nothing for a 128px static file.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/studio-monogram.png"
      alt=""
      width={128}
      height={128}
      style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
    />
  );
}
