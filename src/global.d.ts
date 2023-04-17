type RGBValue = [red: number, green: number, blue: number];

type RGBAValue = [red: number, green: number, blue: number, alpha: number];

type Color = {
  label: string;
  value: RGBValue | RGBAValue;
};
