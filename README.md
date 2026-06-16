# ⚗ Alchemy Lab — Mortal Online 2

🔗 **Live demo:** https://mo2-alchemy-lab.onrender.com

A calculator for researching and cataloguing ingredient parameters in **Mortal Online 2** alchemy. Once measured, ingredients are saved to a local library and can be combined into recipes to preview potion output before you ever touch a vial.

An intuitive step-by-step flow guides you through the entire research process so you always know exactly what to brew and what to record.

## How it works

1. **Enter each ingredient against a known testbed** — brew small batches with a well-understood base ingredient and record the observed property values. The calculator resolves the ratio between your ingredient and the testbed to extract clean base values.
2. **Parameters are detected and saved automatically** — each ingredient produces values for up to 6 properties (DH, HoT, HL, DP, PoT, PL). Multipliers (MV) are identified by scanning 301 candidate values for convergence across your test potions, then everything is written to your local library in one click.

Once your library is built you can mix ingredients into recipes and instantly preview PU, per-gulp healing, and poison output for any vial type.

## Features

- 3-step wizard for ingredient research (base values → multipliers → save)
- Automatic MV detection with convergence algorithm
- Base+MV mode for ingredients that carry both a base and a multiplier
- Calibration support to correct for your exact APM / Lore levels
- Ingredient library with search, Excel export/import
- Recipe calculator with vial type, thirst, Alvarin clade and quality buff support
- RU / EN interface

## Tech stack

Vue 3 · Vite · Composition API

## Getting started

```bash
npm install
npm run dev
```

## License

MIT
