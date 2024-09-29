import { useState } from "react";
import { generateId } from "utils/random-generate";
import "./WxColorPicker.scss";

interface IColorPicker {
  onChange?: (event:any)=>void;
  colorType?: "rgb" | "hex";
  defaultValue?: string;
  value?: string;
  registerProperty?: any;
}

const WxColorPicker = ({  onChange, defaultValue, registerProperty, value }: IColorPicker) => {
  const [id] = useState('id'+generateId())
  
  return (
    <div className="color-picker">
      <label htmlFor={id} className="color-bg-wrapper">
        <input
          id={id}
          type="color"
          defaultValue={defaultValue}
          value= {value}
          onChange={onChange}

          {...registerProperty}
        />
        <label htmlFor={id} className="color-text">
          Select Color
        </label>
      </label>
    </div>
  );
};
export default WxColorPicker;
