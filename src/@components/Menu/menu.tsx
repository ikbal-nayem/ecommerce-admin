import clsx from "clsx";
import { FC, ReactNode } from "react";

type IMenu = {
  children: ReactNode;
  triggerContent: ReactNode;
  position?: "end" | "start" | "center";
  closeOnClick?: "outside" | "inside" | true | false;
  menuClassName?: string;
  triggerClassName?: string;
  className?: string;
};

// This component is based on Bootstrap
const Menu: FC<IMenu> = ({
  children,
  triggerContent,
  position,
  closeOnClick = true,
  menuClassName,
  triggerClassName,
  className,
}) => {
  return (
    <div
      className={clsx(
        { dropdown: position !== "center", "dropdown-center": position === "center" },
        className
      )}
    >
      <div
        className={clsx(triggerClassName)}
        data-bs-toggle="dropdown"
        aria-expanded="false"
        data-bs-offset="10,20"
        data-bs-auto-close={closeOnClick}
      >
        {triggerContent}
      </div>
      <ul
        className={clsx(
          "dropdown-menu mw-100px",
          { [`dropdown-menu-${position}`]: !!position && position !== "center" },
          menuClassName
        )}
      >
        {children}
      </ul>
    </div>
  );
};

export { Menu };
