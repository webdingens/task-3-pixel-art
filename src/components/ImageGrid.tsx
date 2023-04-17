import { CSSProperties, useEffect, useRef, useState } from "react";
import GRIDS from "../constants/grids";

import { BsPaintBucket } from "react-icons/bs";

import styles from "./ImageGrid.module.scss";
import { defaultBackgroundColor } from "../constants/colors";
import ExportImageButton from "./ExportImageButton";
import classNames from "classnames";

type ImageGridProps = {
  currentColor: Color;
};

function ImageGrid({ currentColor }: ImageGridProps) {
  const [currentGrid, setCurrentGrid] = useState(GRIDS[0]);
  const [imageData, setImageData] = useState<Color[] | null>(null);
  const gridElement = useRef<HTMLDivElement | null>(null);
  const [paintBucketEnabled, setPaintBucketEnabled] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);

  // set currentColor as css custom property
  const gridStyle = {
    "--current-fill-color": `rgba(${currentColor.value[0]},${
      currentColor.value[1]
    },${currentColor.value[2]},${
      currentColor.value[3] ? currentColor.value[3] / 255 : 1
    })`,
    "--grid-width": currentGrid.width,
    "--grid-height": currentGrid.height,
  } as CSSProperties;

  // reset function used to reset for onClick on Clear button
  function resetImageData() {
    const newImageData: Color[] = [];
    for (
      let i = 0, size = currentGrid.width * currentGrid.height;
      i < size;
      i++
    ) {
      newImageData[i] = defaultBackgroundColor;
    }

    setImageData(newImageData);
  }
  useEffect(() => {
    resetImageData();
  }, [currentGrid]);

  function paintColor(idx: number) {
    if (!paintBucketEnabled) paintSingle(idx);
    else paintBucket(idx);
  }

  function paintSingle(idx: number) {
    if (imageData === null) throw new Error("Image Data shouldn't be null");
    const newImageData = [...imageData];
    newImageData[idx] = currentColor;
    setImageData(newImageData);
  }

  function paintBucket(idx: number) {
    if (imageData === null) throw new Error("Image Data shouldn't be null");
    if (currentGrid === null) throw new Error("Grid shouldn't be null");

    const clickedColor = imageData[idx];
    const searchResults = [idx];
    const sameColor = (c1: Color["value"], c2: Color["value"]) => {
      if (c1.length !== c2.length) return false;
      for (let i = 0; i < c1.length; i++) {
        if (c1[i] !== c2[i]) return false;
      }
      return true;
    };
    for (let i = 0; i < searchResults.length; i++) {
      // nearest neighbor up/left/right/bottom
      // gather all neighboring indices in an array
      const neighbors = [];
      const index = searchResults[i];

      if (index - currentGrid.width >= 0)
        neighbors.push(index - currentGrid.width); // up
      if ((index % currentGrid.width) - 1 >= 0) neighbors.push(index - 1); // left
      if ((index % currentGrid.width) + 1 < currentGrid.width)
        neighbors.push(index + 1); // right
      if (index + currentGrid.width < imageData.length)
        neighbors.push(index + currentGrid.width); // bottom

      // iterate over neighbors and push to array if same color and not already in array
      neighbors.forEach((index) => {
        if (
          sameColor(clickedColor.value, imageData[index].value) &&
          !searchResults.includes(index)
        )
          searchResults.push(index);
      });
    }

    const newImageData = [...imageData];
    searchResults.forEach((idx) => (newImageData[idx] = currentColor));
    setImageData(newImageData);
  }

  function onKeyDown(evt: React.KeyboardEvent<HTMLButtonElement>, idx: number) {
    if (imageData === null) throw new Error("Image Data shouldn't be null");
    if (gridElement.current === null)
      throw new Error("Grid Element shouldn't be null");

    switch (evt.key) {
      case "ArrowDown":
        if (idx + currentGrid.width < imageData.length) {
          const el = gridElement.current.querySelector(
            `button:nth-child(${idx + currentGrid.width + 1})`
          ) as HTMLElement;
          if (!el) break;
          setCurrentIdx(idx + currentGrid.width);
          el.focus();
        }
        break;
      case "ArrowUp":
        if (idx - currentGrid.width >= 0) {
          const el = gridElement.current.querySelector(
            `button:nth-child(${idx - currentGrid.width + 1})`
          ) as HTMLElement;
          if (!el) break;
          setCurrentIdx(idx - currentGrid.width);
          el.focus();
        }
        break;
      case "ArrowLeft":
        if ((idx % currentGrid.width) - 1 >= 0) {
          const el = gridElement.current.querySelector(
            `button:nth-child(${idx - 1 + 1})`
          ) as HTMLElement;
          if (!el) break;
          setCurrentIdx(idx - 1);
          el.focus();
        }
        break;
      case "ArrowRight":
        if ((idx % currentGrid.width) + 1 < currentGrid.width) {
          const el = gridElement.current.querySelector(
            `button:nth-child(${idx + 1 + 1})`
          ) as HTMLElement;
          if (!el) break;
          setCurrentIdx(idx + 1);
          el.focus();
        }
        break;
      case "Enter":
      case " ":
        if (imageData === null)
          throw new Error("pressed key on non existent button");
        paintColor(idx);
        break;
      default:
        break;
    }
  }

  function onTouchEvent(evt: React.TouchEvent<HTMLDivElement>) {
    if (!gridElement.current)
      throw new Error(
        "Grid Element should exist in order to have clicked on it"
      );

    // figure out over what element the move event is firing
    const bbox = gridElement.current.getBoundingClientRect();

    const touches = [...evt.nativeEvent.changedTouches];
    touches.forEach((touch) => {
      // check if touch is still over grid
      const { clientX, clientY } = touch;
      const x = clientX - bbox.left;
      const y = clientY - bbox.top;

      if (x >= bbox.width || y >= bbox.height || x < 0 || y < 0) {
        // out of bounds
        return;
      }

      // map to index of imageData
      const column = Math.floor((currentGrid.width * x) / bbox.width);
      const row = Math.floor((currentGrid.height * y) / bbox.height);

      const idx = column + row * currentGrid.width;

      // paint
      paintColor(idx);
    });
  }

  function onGridSelectChange(evt: React.ChangeEvent<HTMLSelectElement>) {
    const newGrid = GRIDS.find((grid) => grid.label === evt.target.value);
    if (!newGrid) throw new Error("Selected undefined grid");
    setCurrentGrid(newGrid);
  }

  if (imageData === null) return null;

  return (
    <div className={styles.imageGrid} style={gridStyle}>
      <div
        className={styles.grid}
        onTouchMove={onTouchEvent}
        onTouchStart={onTouchEvent}
        ref={gridElement}
      >
        {imageData.map((data, idx) => {
          const buttonStyle = {
            "--button-color": `rgba(${data.value[0]},${data.value[1]},${
              data.value[2]
            },${data.value[3] ? data.value[3] / 255 : 1})`,
          } as CSSProperties;

          const ariaLabel = `Color: Red is ${
            (100 * data.value[0]) / 255
          }%, Green is ${(100 * data.value[1]) / 255}%, Blue is ${
            (100 * data.value[2]) / 255
          }%, Opacity is ${(100 * (data.value[3] ?? 255)) / 255}%`;

          return (
            <button
              key={idx}
              style={buttonStyle}
              aria-label={ariaLabel}
              data-idx={idx}
              onMouseOver={(evt) => evt.buttons === 1 && paintColor(idx)}
              onMouseDown={(evt) => evt.buttons === 1 && paintColor(idx)}
              onKeyDown={(evt) => onKeyDown(evt, idx)}
              tabIndex={idx !== currentIdx ? -1 : undefined}
            ></button>
          );
        })}
      </div>

      <div className={styles.controls}>
        <button className={styles.clearButton} onClick={resetImageData}>
          Clear
        </button>
        <button
          className={classNames(styles.paintBucket, {
            [styles.paintBucketEnabled]: paintBucketEnabled,
          })}
          onClick={() => setPaintBucketEnabled(!paintBucketEnabled)}
        >
          <BsPaintBucket />
        </button>

        <div>
          <select
            name="grid"
            value={currentGrid.label}
            onChange={onGridSelectChange}
          >
            {GRIDS.map((grid) => {
              return (
                <option value={grid.label} key={grid.label}>
                  {grid.label}
                </option>
              );
            })}
          </select>
        </div>
      </div>

      <ExportImageButton grid={currentGrid} imageData={imageData} />
    </div>
  );
}

export default ImageGrid;
