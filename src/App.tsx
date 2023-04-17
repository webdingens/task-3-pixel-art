import { useState } from "react";
import COLORS from "./constants/colors";
import ColorRadioInput from "./components/ColorRadioInput";
import ImageGrid from "./components/ImageGrid";

function App() {
  const [currentColor, setCurrentColor] = useState(COLORS[0]);

  return (
    <div className="container mx-auto text-center py-4">
      <h1 className="text-xl font-bold">Pixel Art</h1>
      <ColorRadioInput
        onChange={(color) => setCurrentColor(color)}
        currentColor={currentColor}
      />
      <ImageGrid currentColor={currentColor} />
    </div>
  );
}

export default App;
