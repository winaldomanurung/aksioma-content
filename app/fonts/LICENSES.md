# Font licenses

All fonts in this folder are variable `woff2` files (latin subset) taken from the
Fontsource packages `@fontsource-variable/*` v5.3.0. Each is licensed under the
SIL Open Font License, Version 1.1 (https://openfontlicense.org), which permits
use, embedding and redistribution, including in images exported from this app.

| File | Font | Copyright |
| --- | --- | --- |
| `inter-latin-wght-normal.woff2` | Inter | Copyright 2016 The Inter Project Authors (https://github.com/rsms/inter) |
| `lexend-latin-wght-normal.woff2` | Lexend | Copyright 2019 The Lexend Project Authors (https://github.com/googlefonts/lexend) |
| `plus-jakarta-sans-latin-wght-normal.woff2` | Plus Jakarta Sans | Copyright 2020 The Plus Jakarta Sans Project Authors (https://github.com/tokotype/PlusJakartaSans) |
| `playfair-display-latin-wght-normal.woff2` | Playfair Display | Copyright 2017 The Playfair Display Project Authors (https://github.com/clauseggers/Playfair-Display), with Reserved Font Name "Playfair Display" |
| `space-grotesk-latin-wght-normal.woff2` | Space Grotesk | Copyright 2020 The Space Grotesk Project Authors (https://github.com/floriankarsten/space-grotesk) |

The full license text is distributed with each Fontsource package
(`node_modules/@fontsource-variable/<name>/LICENSE`).

## Adding a font

1. Copy a variable `latin` woff2 file here.
2. Register it with `localFont` in `app/fonts.js` (own `variable` name).
3. Add a preset to `lib/studio/fonts.js` and a matching `data-font` rule in
   `app/globals.css`.
4. Add its license line to the table above.
