import { Fragment, memo, useEffect, useState } from "react";

interface Dropdown {
  children?: any;
  id?: any;
  className?: string;
  isOpen?: boolean;
  setIsOpen?: any;
  drop?: boolean;
  backdrop?: boolean;
}

const WxDropdown = ({
  children,
  className,
  isOpen,
  setIsOpen,
  id,
  drop = true,
  backdrop = true,
}: Dropdown) => {
  const [menu, setMenu] = useState<any>(false);

  useEffect(() => {
    // const root = document.getElementById("root");
    // isOpen &&
    //   root.addEventListener("click", (e: any) => {
    //     const dropdown = document.querySelector(".dropdown_wrapper");
    //     if (!dropdown.contains(e.target)) {
    //       setIsOpen(false);
    //     }
    //   });

    if (backdrop) {
      const mainWrapper = document.querySelector(".wx__dropdown_wrapper");
      const root = document.getElementById("dropdown__wrapper__sec");

      const dropdown = document.querySelector(".dropdown_wrapper");

      if (!mainWrapper && isOpen) {
        const div = document.createElement("div");
        div.classList.add("wx__dropdown_wrapper");
        root.appendChild(div);
        setMenu(true);
      }

      if (mainWrapper && isOpen) {
        mainWrapper.addEventListener("click", (e) => {
          mainWrapper.remove();
          setIsOpen(false);
        });
        setMenu(false);
      }

      if (mainWrapper && !isOpen && drop) {
        mainWrapper.remove();
      }
    }
  }, [isOpen, menu]);

  useEffect(() => {
    return () => {
      const mainWrapper = document.querySelector(".wx__dropdown_wrapper");
      mainWrapper && mainWrapper.remove();
    };
  }, []);

  const handleDropdown = () => {
    setMenu(false);
    setIsOpen(false);
  };

  return (
    <Fragment>
      <div
        onClick={(e: any) => {
          drop && handleDropdown();
        }}
        className={`dropdown more_dropdown ${className ? className : ""}`}
        id={id ? id : ""}
      >
        {isOpen && children}
      </div>
    </Fragment>
  );
};

export default memo(WxDropdown);
