import React from 'react'
import "./WxFormLayout.scss";

type IFormContainerProps = {
  children?: any;
}

const WxFormContainer=({children}:IFormContainerProps)=>{
  return (
    <div className="container wx__form_container">
      {children}
    </div>
  )
}

export default WxFormContainer;