import React from 'react'

type IFormRightProps = {
  children?: JSX.Element | JSX.Element[];
};

const WxFormRight=({children}:IFormRightProps)=>{
  return (
    <div className='content_right'>{children}</div>
  )
}

export default WxFormRight