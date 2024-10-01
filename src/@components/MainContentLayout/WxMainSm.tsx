import React from "react";
import './MainContentLayout.scss'

interface IWxMainSm {
	className?: string;
	children: JSX.Element | JSX.Element[] | any;
}

const WxMainSm = ({className,children}:IWxMainSm) => {

    return(
        <section className={`w-100 d-flex justify-content-center wx__main_sm ${className || ''}`}>
            <div className="w-100 wx__main_content">{children}</div>
        </section>
    )
}

export default WxMainSm