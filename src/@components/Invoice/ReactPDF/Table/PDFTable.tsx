import { ENV } from "config/ENV.config";
import {
  DataTableCell,
  Table,
  TableBody,
  TableCell,
  TableHeader,
} from "@david.kucsai/react-pdf-table";
import { Font, StyleSheet, View } from "@react-pdf/renderer";

const PDFTable = ({ tableData }) => {
  const table = StyleSheet.create({
    main: {
      fontFamily: "SolaimanLipi" || "Inter",
      marginTop: "50px",
    },
    textCenter: {
      textAlign: "center",
    },
    header: {
      padding: "5px 10px",
      backgroundColor: "#434343",
      color: "white",
      fontSize: "11px",
      border: "none",
    },
    tableBody: {
      padding: "5px  10px",
      border: "none",
      fontSize: "11px",
    },
    nestedCell: {
      border: "none",
    },
    variantsCell: {
      color: "#595959",
      fontSize: "10px",
    },
  });

  Font.register({
    family: "Inter",
    fonts: [{ src: "../Fonts/Inter-Regular.otf", fontWeight: 400 }],
  });

  Font.register({
    family: "SolaimanLipi",
    format: "truetype",
    src: ENV.FONT_BASE_URL + "/SolaimanLipiNormal.ttf",
  });

  return (
    <View style={table.main}>
      <Table data={tableData}>
        <TableHeader
          includeTopBorder={false}
          includeBottomBorder={false}
          includeRightBorder={false}
          includeLeftBorder={false}
        >
          <TableCell
            includeLeftBorder={false}
            style={[table.header]}
            weighting={0.6}
          >
            Item
          </TableCell>
          <TableCell
            includeLeftBorder={false}
            style={[table.header, table.textCenter]}
            weighting={0.2}
          >
            Unit Price
          </TableCell>
          <TableCell
            includeLeftBorder={false}
            style={[table.header, table.textCenter]}
            weighting={0.2}
          >
            Quantity
          </TableCell>
          <TableCell
            includeLeftBorder={false}
            style={[table.header, table.textCenter]}
            weighting={0.2}
          >
            Amount
          </TableCell>
        </TableHeader>
        <TableBody
          includeTopBorder={false}
          includeBottomBorder={false}
          includeRightBorder={false}
          includeLeftBorder={false}
        >
          <DataTableCell
            includeTopBorder={false}
            includeBottomBorder={false}
            includeRightBorder={false}
            includeLeftBorder={false}
            style={[table.tableBody]}
            weighting={0.6}
            getContent={(r) => {
              return (
                r?.title +
                (r?.options?.length
                  ? ", " +
                    r.options
                      .map((vrnt) => vrnt?.key + "-" + vrnt?.value)
                      .join(", ")
                  : "")
              );
            }}
          />
          <DataTableCell
            includeTopBorder={false}
            includeBottomBorder={false}
            includeRightBorder={false}
            includeLeftBorder={false}
            style={[table.tableBody, table.textCenter]}
            getContent={(r) => r?.sellingPrice || ""}
            weighting={0.2}
          />
          <DataTableCell
            includeTopBorder={false}
            includeBottomBorder={false}
            includeRightBorder={false}
            includeLeftBorder={false}
            style={[table.tableBody, table.textCenter]}
            getContent={(r) =>
              +r?.quantity > 9 ? r?.quantity : "0" + r?.quantity
            }
            weighting={0.2}
          />
          <DataTableCell
            includeTopBorder={false}
            includeBottomBorder={false}
            includeRightBorder={false}
            includeLeftBorder={false}
            weighting={0.2}
            style={[table.tableBody, table.textCenter]}
            getContent={(r) => r?.subTotal + " BDT"}
          />
        </TableBody>
      </Table>
    </View>
  );
};

export default PDFTable;

// r.options && r.options.map((vari) => vari.key + "-" + vari.value)
// <Table data={[r]} isNested>
//   <TableBody
//     textAlign={"left"}
//     includeTopBorder={false}
//     includeBottomBorder={false}
//     includeLeftBorder={false}
//     includeRightBorder={false}
//   >
//     <DataTableCell
//       style={table.nestedCell}
//       getContent={(r) => r?.title}
//       textAlign="left"
//     />
//     <DataTableCell
//       style={[table.nestedCell, table.variantsCell]}
//       getContent={(r) => r?.options[1]?.value || "no variant"}
//       textAlign="left"
//     />
//   </TableBody>
// </Table>
