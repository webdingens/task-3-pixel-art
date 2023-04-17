import { useDeferredValue, useEffect, useRef, useState } from "react";
import GRIDS from "../constants/grids";

import GIF from "gif.js";
import GIFWorkerUrl from "gif.js/dist/gif.worker.js?url";

import styles from "./ExportImageButton.module.scss";

function ExportImageButton({
  imageData,
  grid,
}: {
  imageData: Color[];
  grid: typeof GRIDS[0];
}) {
  const [hrefPNG, setHrefPNG] = useState<string | null>(null);
  const [hrefGIF, setHrefGIF] = useState<string | null>(null);
  const [hrefJPG, setHrefJPG] = useState<string | null>(null);
  const canvas = useRef<HTMLCanvasElement | null>(null);
  const gifRenderer = useRef<GIF | null>(null);

  const deferredGrid = useDeferredValue(grid);
  const deferredImageData = useDeferredValue(imageData);

  useEffect(() => {
    if (!canvas.current) canvas.current = document.createElement("canvas");

    canvas.current.width = grid.width;
    canvas.current.height = grid.height;

    const ctx = canvas.current.getContext("2d");
    if (!ctx) {
      throw new Error("No Canvas context");
    }

    // convert imageData
    const flattenedImageData = imageData.reduce((prev, curr) => {
      const colorArray = [
        curr.value[0],
        curr.value[1],
        curr.value[2],
        curr.value[3] ?? 255,
      ];
      return prev.concat(colorArray);
    }, [] as number[]);
    const convertedImageData = new Uint8ClampedArray(flattenedImageData);

    const newImageData = new ImageData(
      convertedImageData,
      grid.width,
      grid.height
    );
    ctx.putImageData(newImageData, 0, 0);

    // Gif didn't work, now checking for support: https://stackoverflow.com/a/17407392
    const imageMimes = ["image/png", "image/gif", "image/jpeg"];
    for (let i = 0; i < imageMimes.length; i++) {
      const dataUrl = canvas.current.toDataURL(imageMimes[i]);
      if (dataUrl.search(imageMimes[i]) >= 0) {
        if (imageMimes[i] === "image/png") setHrefPNG(dataUrl);
        if (imageMimes[i] === "image/gif") setHrefGIF(dataUrl);
        if (imageMimes[i] === "image/jpeg") setHrefJPG(dataUrl);
      } else {
        // if gif fails use the gif renderer
        if (imageMimes[i] === "image/gif") {
          if (gifRenderer.current) gifRenderer.current.abort();
          gifRenderer.current = new GIF({
            workerScript: GIFWorkerUrl,
          });
          gifRenderer.current?.on("finished", function (blob: Blob) {
            setHrefGIF(URL.createObjectURL(blob));
          });
          gifRenderer.current.addFrame(newImageData);
          gifRenderer.current.render();
        }
      }
    }
  }, [deferredImageData, deferredGrid]);

  if (hrefPNG === null && hrefGIF === null && hrefJPG === null) return null;

  return (
    <div className={styles.module}>
      <p>Download</p>
      <ul className={styles.exportOptions}>
        {hrefPNG !== null && (
          <li>
            <a href={hrefPNG} download={`image${grid.label}.png`}>
              PNG
            </a>
          </li>
        )}
        {hrefGIF !== null && (
          <li>
            <a href={hrefGIF} download={`image${grid.label}.gif`}>
              GIF
            </a>
          </li>
        )}
        {hrefJPG !== null && (
          <li>
            <a href={hrefJPG} download={`image${grid.label}.jpg`}>
              JPG
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

export default ExportImageButton;
