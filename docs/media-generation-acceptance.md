# RC7 AI Image Studio and AI Video Studio — acceptance guide

**Status:** proposed official test presets for RC7; generated media capabilities are NOT implemented by these template files. **SIAAS-FLOW-01** phase B, 2026-11-23. Stack on `siaas-templates` business-plan PR #7 (which stacks on v2 PR #6). Do not merge/release until RC6 is complete and the Personal RC7 executor is verified.

## Common constraints

Both definitions are portable `siaas-project-v2` bundles, `model:null`, no source URLs, models, file paths, secrets or user data. Two named assistants each, `assistant_indices:[0,1]`, `max_steps:2`, `enabled:false`, `share_results:false`. Each assistant keeps its own Knowledge and Hybrid Router. Selecting a template does not activate image/video generation or grant tool permissions. No separate Skills objects: use existing Actions, with permission decisions enforced by the Project Tool Permission Gateway. AGENTS.md is a read-only dynamically generated preview outside the template bundle.

## Image test matrix

1. Offline baseline: import in RC7, verify two assistants, all sources empty, no model selected, coordinator disabled, no file/Internet side effects.
2. With **no compatible stable-diffusion.cpp model installed**, ask for a small 256×256 test image. Expected: clear unavailable result, no fabricated image, no silent download.
3. Install a verified compatible model with explicit user authorization and license check. Configure a bounded image request and a writable destination inside the approved workspace. Verify Gateway `ASK` blocks without consent and `DENY` blocks even with model instructions.
4. On `ALLOW` or explicitly approved `ASK`, generate using the actual native stable-diffusion.cpp tool. Inspect MIME/signature, nonzero bytes, dimensions, destination and provenance; confirm only expected output was written.
5. Negative tests: oversized dimensions or memory budget, corrupt/unsupported model, cancelled render, unwritable path, revoked project permission, wrong assistant/project, simultaneous jobs, app restart and no residual temp files.

## Video test matrix

1. Offline baseline as above. No compatible backend/model → explicit unavailable, no fake MP4/GIF.
2. Select user-approved short storyboard (e.g. 2 seconds, 8 fps, 256×256), compute exactly 16 frames with deterministic code, confirm resource estimate against the actual machine, select compatible licensed video model only after verified backend capability. **Wan 2.1 1.3B compatibility is a test question, not an assumption**.
3. Run the native video generation process with stable-diffusion.cpp for generation; use FFmpeg only for frame assembly, transcoding or editing. Verify actual output is decodable, codec/container, frame dimensions, frame rate, duration and frame count against supported tolerances.
4. Check explicit model-download consent, Gateway ALLOW/ASK/DENY, safe output paths, cancellation, timeout, partial-file cleanup, bounded threads/RAM/VRAM and no overwrite. Do not claim benchmarked speed on hardware not actually tested.

## Reporting

For each case record exact SIAAS build/commit, OS/hardware, model name/checksum/license, stable-diffusion.cpp revision, FFmpeg version, effective permission rule, parameters, elapsed time, output inspection and verdict PASS/FAIL/BLOCKED/NOT RUN. Mock tests demonstrate dispatch only, not actual generation. Require real Windows 11 CPU-only acceptance plus other available OS testing. Never leak local paths, credentials, model binaries or synthetic benchmark answers into official templates.

Upstream: `npm run build && npm test`. Consumer: sync catalog by exact immutable commit only after approved upstream PR and compatible Personal RC7 implementation; then run template/check/import/export, Actions, project permission, app/desktop and tool regressions. No automatic merge, publication or website update.
