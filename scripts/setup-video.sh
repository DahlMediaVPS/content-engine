#!/usr/bin/env bash
# One-time setup for HyperFrames video editing + Whisper transcription.
# Usage: bash scripts/setup-video.sh
set -euo pipefail

TOOLS_DIR="${TOOLS_DIR:-$HOME/.local/share/content-engine}"
MODEL="${WHISPER_MODEL:-base.en}"
mkdir -p "$TOOLS_DIR"

echo "==> HyperFrames render browser"
npx -y hyperframes@latest browser ensure

echo "==> Whisper (whisper.cpp)"
if ! command -v whisper-cli >/dev/null 2>&1; then
  if [ ! -x "$TOOLS_DIR/whisper.cpp/build/bin/whisper-cli" ]; then
    git clone --depth 1 https://github.com/ggml-org/whisper.cpp.git "$TOOLS_DIR/whisper.cpp" 2>/dev/null || true
    cmake -S "$TOOLS_DIR/whisper.cpp" -B "$TOOLS_DIR/whisper.cpp/build" -DCMAKE_BUILD_TYPE=Release >/dev/null
    cmake --build "$TOOLS_DIR/whisper.cpp/build" -j"$(nproc)" --config Release
  fi
  mkdir -p "$HOME/.local/bin"
  ln -sf "$TOOLS_DIR/whisper.cpp/build/bin/whisper-cli" "$HOME/.local/bin/whisper-cli"
fi

echo "==> Whisper model ($MODEL) — needs huggingface.co reachable"
if ! sh "$TOOLS_DIR/whisper.cpp/models/download-ggml-model.sh" "$MODEL"; then
  echo "!! Model download failed. If you're in Claude Code on the web, add huggingface.co"
  echo "   to the environment's allowed domains, then re-run this script."
fi

npx -y hyperframes@latest doctor || true
