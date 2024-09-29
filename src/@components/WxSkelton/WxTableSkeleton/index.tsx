import React from "react";
import './WxSkeleton.scss'

interface ITableSkelton {
  rows: number;
  columns?: number;
  hasStartImage?:boolean;
}

const WxTableSkelton = ({ rows, columns = 5, hasStartImage= false }: ITableSkelton) => {
  return (
    <div className="wx__responsive_table table_skelton">
      <table className="wx__table site_operator_table placeholder-wave">
        <thead className="wx__thead">
          <tr className="wx__tr ">
            {Array(rows)
              .fill(null)
              .map((_, indx) => {
                return (
                  <th className="wx__th" key={indx}>
                    <span
                      className="placeholder wx__w-100"
                      style={{ height: "30px" }}
                    />
                  </th>
                );
              })}
          </tr>
        </thead>

        <tbody className="wx__tbody">
          {Array(columns)
            .fill(null)
            .map((_, index) => {
              return (
                <tr className="wx__tr" key={index}>
                  {Array(rows)
                    .fill(null)
                    .map((_, indx) => {
                      return (
                        <td className="wx__td" key={indx}>
                            {
                                hasStartImage && indx === 0 && <span className="placeholder has-image"/>
                            }
                            
                          <span
                            className={hasStartImage && indx === 0 ?"placeholder row-with-image wx__w-100": "placeholder wx__w-100"}
                            style={{ height: "30px" }}
                          />
                        </td>
                      );
                    })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
};

export default WxTableSkelton;
