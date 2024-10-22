import { useEffect } from "react";
import "./TableLoader.scss";

interface ITableLoader {
  adjustTop?: string | number;
  isLoading?: boolean;
}

const TableLoader = ({ adjustTop, isLoading = true }: ITableLoader) => {
  useEffect(() => {
    const loader = document.querySelector(".wx__table_loader");
    if (isLoading) {
      loader.classList.add("show");
    } else {
      setTimeout(() => {
        loader.classList.remove("show");
        loader.classList.add("hide");
      }, 700);
      setTimeout(() => {
        loader.classList.remove("hide");
      }, 800);
    }
  }, [isLoading]);

  
  return (
    <div className="wx__table_loader">
      <div className="custom-loader"></div>
      <div className="custom-text text_body">Loading...</div>
    </div>
  );
};

export default TableLoader;
