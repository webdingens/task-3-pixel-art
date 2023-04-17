import { CSSProperties } from "react";
import COLORS from "../constants/colors";
import styles from "./ColorRadioInput.module.scss";

type ColorRadioInputProps = {
  currentColor: Color;
  onChange: (color: Color) => void;
};

function ColorRadioInput({ currentColor, onChange }: ColorRadioInputProps) {
  function onColorChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const newColor = COLORS.find((color) => evt.target.value === color.label);
    if (!newColor) throw new Error("Undefined color was selected");
    onChange(newColor);
  }

  return (
    <div className={`${styles.colorRadio} py-4`}>
      {COLORS.map((color) => {
        // set color as css custom property
        const labelStyle = {
          "--fill-color": `rgba(${color.value[0]},${color.value[1]},${
            color.value[2]
          },${color.value[3] ? color.value[3] / 255 : 1})`,
        } as CSSProperties;

        return (
          <label style={labelStyle} key={color.label}>
            <input
              type="radio"
              name="color"
              checked={color.label === currentColor.label}
              onChange={onColorChange}
              value={color.label}
            />
            <span></span>
          </label>
        );
      })}
    </div>
  );
}

export default ColorRadioInput;
