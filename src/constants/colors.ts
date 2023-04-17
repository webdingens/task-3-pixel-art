let COLORS: Color[] = [
  {
    label: "red",
    value: [248, 7, 0, 255],
  },
  {
    label: "purple",
    value: [140, 11, 138, 255],
  },
  {
    label: "green",
    value: [126, 253, 0, 255],
  },
  {
    label: "blue",
    value: [2, 26, 254, 255],
  },
  {
    label: "yellow",
    value: [255, 254, 0, 255],
  },
  {
    label: "khaki",
    value: [251, 165, 5, 255],
  },
  {
    label: "black",
    value: [0, 0, 0, 255],
  },
  {
    label: "beige",
    value: [254, 228, 196, 255],
  },
  {
    label: "rose",
    value: [252, 192, 203, 255],
  },
  {
    label: "brown",
    value: [210, 105, 29, 255],
  },
];

const POSITION_WHITE = 6;

COLORS.splice(POSITION_WHITE, 0, {
  label: "white",
  value: [255, 255, 255, 255],
});

export default COLORS;

export const defaultBackgroundColor = COLORS[POSITION_WHITE]; // white
