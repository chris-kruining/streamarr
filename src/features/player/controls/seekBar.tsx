import { Component, For, Show, createMemo } from "solid-js";
import { formatTime, useVideo } from "../context";
import css from "./seekBar.module.css";

export const SeekBar: Component = () => {
  const player = useVideo();
  const duration = createMemo(() => player.duration() || player.metadata()?.duration || 0);
  const progress = createMemo(() =>
    duration() > 0 ? (player.currentTime() / duration()) * 100 : 0,
  );
  const markerStyle = (start: number, end?: number) => {
    const left = duration() > 0 ? (start / duration()) * 100 : 0;
    const width = end && duration() > 0 ? Math.max(0.25, ((end - start) / duration()) * 100) : 0.25;

    return {
      left: `${left}%`,
      width: `${width}%`,
    };
  };
  const updatePreview = (event: PointerEvent) => {
    const rect = event.currentTarget instanceof HTMLElement
      ? event.currentTarget.getBoundingClientRect()
      : undefined;

    if (!rect || duration() <= 0) {
      return;
    }

    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    player.setPreview(ratio * duration(), event.clientX - rect.left);
  };

  return (
    <div
      class={css.container}
      onPointerMove={updatePreview}
      onPointerLeave={() => player.clearPreview()}
    >
      <div class={css.timeRow}>
        <span>{formatTime(player.currentTime())}</span>
        <span>{formatTime(duration())}</span>
      </div>

      <div class={css.track}>
        <For each={[...player.bufferedRanges(), ...(player.metadata()?.markers ?? [])]}>
          {(marker) => (
            <span
              classList={{
                [css.marker]: true,
                [css.chapter]: marker.type === "chapter",
                [css.segment]: marker.type === "segment",
                [css.bufferedMarker]: marker.type === "buffered",
              }}
              style={markerStyle(marker.start, marker.end)}
              title={marker.label}
            />
          )}
        </For>
        <input
          class={css.bar}
          type="range"
          aria-label="Seek timeline"
          max={duration().toFixed(2)}
          value={player.currentTime().toFixed(2)}
          style={{ "--progress": `${progress()}%` }}
          onFocus={() => player.setBottomPanelOpen(true)}
          onBlur={() => player.setBottomPanelOpen(false)}
          onPointerDown={(event) => {
            player.setScrubbing(true);
            updatePreview(event);
          }}
          onPointerUp={() => player.setScrubbing(false)}
          onInput={(event) => player.setTime(event.currentTarget.valueAsNumber)}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") {
              return;
            }

            event.preventDefault();
            player.seekBy(event.key === "ArrowLeft" ? -10 : 10);
          }}
          step="0.01"
        />
      </div>

      <Show when={player.preview()}>
        {(preview) => (
          <output class={css.preview} style={{ left: `${preview().x}px` }}>
            <Show
              when={preview().tileUrl}
              fallback={<span>{formatTime(preview().time)}</span>}
            >
              {(tileUrl) => (
                <span class={css.thumbnail}>
                  <img
                    src={tileUrl()}
                    alt=""
                    onError={() => player.markPreviewError()}
                    style={{
                      "object-position": `-${(preview().tileX ?? 0) * (preview().tileWidth ?? 0)}px -${(preview().tileY ?? 0) * (preview().tileHeight ?? 0)}px`,
                    }}
                  />
                  <span>{formatTime(preview().time)}</span>
                </span>
              )}
            </Show>
          </output>
        )}
      </Show>
    </div>
  );
};
