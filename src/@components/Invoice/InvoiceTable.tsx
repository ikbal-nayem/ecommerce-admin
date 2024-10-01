const InvoiceTable = ({ data }) => {
  return (
    <table className="d-inline" id="purchaseTable">
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Amount</th>
        </tr>
      </thead>
      <tbody>
        {data.length
          ? data.map((item, index) => {
              return (
                <tr key={index}>
                  <td>
                    <div className="d-flex ">
                      {/* <div>
                    <img src={item.thumbnail} alt="" className="item_img" />
                  </div> */}
                      <div>
                        <p className="wx__mb-0">{item?.title + "\n"}</p>
                        <br />
                        {item?.options && item?.options?.length
                          ? item?.options.map((variant, indx) => {
                              return (
                                <span key={indx} style={{ color: "green" }}>
                                  {indx > 0 ? ", " : ""}
                                  {variant?.key}-{variant?.value}
                                </span>
                              );
                            })
                          : null}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div>
                      {+item?.quantity > 9
                        ? item?.quantity
                        : "0" + item?.quantity}
                    </div>
                  </td>
                  <td>
                    <div>{item?.subTotal || 0} BDT</div>
                  </td>
                </tr>
              );
            })
          : null}
      </tbody>
    </table>
  );
};

export default InvoiceTable;
