import React from "react";
import './MainContentLayout.scss'

interface IWxMainLg {
    className?:string;
    children: JSX.Element | JSX.Element[] | any;
}

const WxMainLg = ({className,children}:IWxMainLg) => {

    return(
        <section className={`wx__w-100 wx__d-flex justify-content-center wx__main_lg ${className || ''}`}>
            <div className="wx__w-100 setting_content wx__main_content">{children}</div>
        </section>
    )
}

export default WxMainLg