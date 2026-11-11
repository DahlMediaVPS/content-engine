#!/bin/bash
# usage: SEGS="c1:0:7.5 c2:0.5:4.6 ..." ./stitch.sh out.mp4   (clips c1.mp4.. in cwd)
OUT=$1; inputs=""; f=""; i=0
for s in $SEGS; do IFS=: read file a b <<< "$s"; inputs="$inputs -i $file.mp4"; d=$(python3 -c "print(round($b-$a,3))")
f="$f[$i:v]trim=$a:$b,setpts=PTS-STARTPTS,scale=720:1280,fps=24,format=yuv420p[v$i];[$i:a]atrim=$a:$b,asetpts=PTS-STARTPTS,aresample=48000,afade=t=in:d=0.01,afade=t=out:st=$(python3 -c "print(round($d-0.01,3))"):d=0.01[a$i];"; i=$((i+1)); done
cat=""; for j in $(seq 0 $((i-1))); do cat="$cat[v$j][a$j]"; done
ffmpeg -y -loglevel error $inputs -filter_complex "${f}${cat}concat=n=$i:v=1:a=1[v][a0];[a0]highpass=f=80,equalizer=f=3200:t=q:w=1:g=2.5,acompressor=threshold=-20dB:ratio=2.5:attack=10:release=150,loudnorm=I=-14:TP=-1.5[a]" -map "[v]" -map "[a]" -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 160k -movflags +faststart "$OUT"
