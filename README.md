# Storm Eagle — AI Excited v2

![make.fun bounty](https://make.fun/badge/ai-excited-01.svg)
![rank](https://make.fun/badge/ai-excited-01/irwan11795/makefun-ai-excited-01-v2/rank.svg)
![reward](https://make.fun/badge/ai-excited-01/irwan11795/makefun-ai-excited-01-v2/reward.svg)

Entry for the [AI Excited bounty](https://make.fun/bounty/ai-excited-01) on make.fun.

## The image

**Storm Eagle** is a photorealistic scene of a giant eagle made of storm
wind and clouds bursting out of a large golden picture frame in a concert
hall. Its feathers dissolve into swirling wind vortices, sheet music flies
everywhere, and the orchestra below looks up in awe — the moment a painting
refuses to stay on the wall. The artwork was generated fresh for this
entry and contains no text, letters, or numbers anywhere in the frame.

## How it runs

`main.ts` (Node, standard library only, no network) copies `entry.png` into
the output directory given by `MAKEFUN_OUTPUT_DIR` (default `/output`),
after validating the artwork first:

- PNG magic bytes `89 50 4E 47 0D 0A 1A 0A`
- file size at most 1,048,576 bytes
- width and height at most 1024 px

Run it with:

```sh
MAKEFUN_OUTPUT_DIR=/output node main.ts
```

## Files

- `entry.png` — the artwork, 1024×1024 PNG
- `main.ts` — copies and validates the artwork
- `LICENSE` — MIT
- `README.md` — this file
