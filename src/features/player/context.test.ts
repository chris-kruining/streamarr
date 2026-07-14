import { describe, expect, test } from "vitest";
import { formatTime, mapPreviewTile } from "./context";

describe("player helpers", () => {
  test("formats short and long durations", () => {
    expect(formatTime(0)).toBe("00:00");
    expect(formatTime(65)).toBe("01:05");
    expect(formatTime(3661)).toBe("01:01:01");
  });

  test("maps preview time to lazy trickplay tile coordinates", () => {
    expect(
      mapPreviewTile(13, {
        width: 320,
        height: 180,
        tileWidth: 5,
        tileHeight: 5,
        thumbnailCount: 100,
        interval: 2,
        tileUrl: "/tile/{index}.jpg",
      }),
    ).toEqual({
      tileUrl: "/tile/0.jpg",
      tileIndex: 0,
      tileX: 1,
      tileY: 1,
      tileWidth: 320,
      tileHeight: 180,
    });
  });
});
