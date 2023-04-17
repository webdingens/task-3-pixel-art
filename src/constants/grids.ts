const GRIDS_WITHOUT_LABELS = [
  {
    width: 8,
    height: 8,
  },
  {
    width: 12,
    height: 12,
  },
  {
    width: 16,
    height: 16,
  },
  {
    width: 32,
    height: 32,
  },
];

const GRIDS = GRIDS_WITHOUT_LABELS.map((grid) => ({
  ...grid,
  label: `${grid.width}x${grid.height}`,
}));

export default GRIDS;
