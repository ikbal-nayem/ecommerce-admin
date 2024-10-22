import { ENV } from "config/ENV.config";
import { Font, StyleSheet, Text, View } from "@react-pdf/renderer";

interface IPdfNotesNSubtotal {
  notesNSubtotalData: {
    orderNote: string;
    orderSubTotal;
    taxAmount;
    deliveryChargeAmount;
    totalAmount;
    dueAmount;
    paidAmount;
  };
}

const NotesNSubtotal = ({ notesNSubtotalData }: IPdfNotesNSubtotal) => {
  const notesNSubtotal = StyleSheet.create({
    main: {
      flexDirection: "row",
      marginTop: "20px",
    },
    notes: {
      width: "50%",
      height: "60px",
      border: "5px solid #F5F6F7",
      borderRadius: "4px",
      padding: "10px",
      marginRight: "5px",
    },
    notesText: {
      fontFamily: "SolaimanLipi" || "Inter",
      fontSize: "11px",
      fontWeight: 600,
      color: "#8c8c8c",
    },
    specificNoteText: {
      fontFamily: "SolaimanLipi" || "Inter",
      fontSize: "11px",
      fontWeight: 400,
      color: "#595959",
      marginTop: "3px",
    },

    subTotal: { width: "50%", justifySelf: "end" },
    subTotalWrapper: {
      fontSize: "10px",
      fontFamily: "SolaimanLipi" || "Inter",
      width: "100%",
      fontWeight: 400,
      backgroundColor: "#F5F6F7",
      borderRadius: "4px",
      padding: "15px",
    },
    displayFlex: {
      //   width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      padding: "6px 0",
    },
    totalText: {
      borderBottom: "0.24px solid #afb0b3",
      borderTop: "0.24px solid #afb0b3",
      margin: "2.5px 0",
      fontSize: "11px",
      fontFamily: "Inter",
      fontWeight: 600,
    },
    totalDeuText: {
      fontSize: "14px",
      fontFamily: "Inter",
      fontWeight: 700,
    },
    payableAmount: {
      fontWeight: 600,
    },
  });

  const {
    orderNote,
    orderSubTotal,
    taxAmount,
    deliveryChargeAmount,
    totalAmount,
    dueAmount,
    paidAmount,
  } = notesNSubtotalData;

  Font.register({
    family: "Inter",
    fonts: [
      { src: "./Fonts/Inter-Regular.otf", fontWeight: 400 },
      { src: "./Fonts/Inter-SemiBold.otf", fontWeight: 600 },
      { src: "./Fonts/Inter-Bold.otf", fontWeight: 700 },
    ],
  });

  Font.register({
    family: "SolaimanLipi",
    format: "truetype",
    src: ENV.FONT_BASE_URL + "/SolaimanLipiNormal.ttf",
  });

  return (
    <View wrap={false} style={notesNSubtotal.main}>
      {/* {orderNote && ( */}
      <View style={notesNSubtotal.notes}>
        <Text style={notesNSubtotal.notesText}>
          {/* <Icon icon="info" /> */}
          NOTES
        </Text>
        <Text style={notesNSubtotal.specificNoteText}>
          {orderNote || "no specific note"}
        </Text>
      </View>
      {/* )} */}
      <View style={notesNSubtotal.subTotal}>
        <View style={notesNSubtotal.subTotalWrapper}>
          <View style={notesNSubtotal.displayFlex}>
            <Text>Sub Total</Text>
            <Text>{orderSubTotal || "0"} BDT</Text>
          </View>
          <View style={notesNSubtotal.displayFlex}>
            <Text>Tax</Text>
            <Text>{taxAmount || "0"} BDT</Text>
          </View>
          <View style={notesNSubtotal.displayFlex}>
            <Text>Delivery Charge</Text>
            <Text>{deliveryChargeAmount || "0"} BDT</Text>
          </View>
          <View style={[notesNSubtotal.displayFlex, notesNSubtotal.totalText]}>
            <Text>Total</Text>
            <Text>{totalAmount || "0"} BDT</Text>
          </View>
          <View style={notesNSubtotal.displayFlex}>
            <Text>Paid</Text>
            <Text>{paidAmount || "0"} BDT</Text>
          </View>
          <View
            style={[notesNSubtotal.displayFlex, notesNSubtotal.totalDeuText]}
          >
            <Text>Total Due</Text>
            <Text style={notesNSubtotal.payableAmount}>
              {dueAmount || "0"} BDT
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default NotesNSubtotal;
