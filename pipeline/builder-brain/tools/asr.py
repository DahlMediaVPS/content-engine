"""Word timings from a 16 kHz mono wav using sherpa-onnx streaming zipformer.
Usage: python3 asr.py in.wav out.json
Zipformer token times lag about 0.21 s; that offset is subtracted here."""
import json, sys
import sherpa_onnx, soundfile as sf

M = "/home/claude/models/sherpa-onnx-streaming-zipformer-en-2023-06-26/"
LAG = 0.21

rec = sherpa_onnx.OnlineRecognizer.from_transducer(
    tokens=M + "tokens.txt",
    encoder=M + "encoder-epoch-99-avg-1-chunk-16-left-128.int8.onnx",
    decoder=M + "decoder-epoch-99-avg-1-chunk-16-left-128.int8.onnx",
    joiner=M + "joiner-epoch-99-avg-1-chunk-16-left-128.int8.onnx",
    num_threads=4, sample_rate=16000, feature_dim=80, decoding_method="greedy_search",
)
audio, sr = sf.read(sys.argv[1], dtype="float32")
st = rec.create_stream()
st.accept_waveform(sr, audio)
st.accept_waveform(sr, [0.0] * int(sr * 0.8))
st.input_finished()
while rec.is_ready(st):
    rec.decode_stream(st)
r = rec.get_result_all(st)
words, cur = [], None
for tok, t in zip(r.tokens, r.timestamps):
    if tok.startswith(("▁", " ")) or cur is None:
        if cur:
            words.append(cur)
        cur = {"w": tok.lstrip("▁ "), "t": round(max(0, t - LAG), 2)}
    else:
        cur["w"] += tok
if cur:
    words.append(cur)
json.dump(words, open(sys.argv[2], "w"), indent=0)
print(" ".join(f"{w['w'].lower()}@{w['t']}" for w in words))
