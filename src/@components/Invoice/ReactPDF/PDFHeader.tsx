import { Font, Image, StyleSheet, Text, View } from "@react-pdf/renderer";
interface IPdfHeader {
  headerData: {
    siteLogo: string;
    invoiceNo: string;
    orderDate: string;
    businessName: string;
  };
}

const PDFHeader = ({ headerData }: IPdfHeader) => {
  const { siteLogo, invoiceNo, orderDate, businessName } = headerData;

  const header = StyleSheet.create({
    main: {
      flexDirection: "row",
      paddingBottom: "20px",
      marginBottom: "20px",
      justifyContent: "space-between",
      borderBottom: "0.24px solid #595959",
    },
    wrapper: {},
    TextWrapper: {
      alignItems: "flex-end",
    },
    InvoiceText: {
      fontSize: "11px",
      fontFamily: "Inter",
      fontWeight: 600,
    },
    // InvoiceText1: {
    //   fontSize: "11px",
    //   fontFamily: "Times-Roman",
    // },
    InvoiceTime: {
      fontSize: "10px",
      fontFamily: "Inter",
      fontWeight: 400,
      color: "#595959",
    },
    businessNameText: {
      fontSize: "15px",
      fontFamily: "Inter",
      fontWeight: 500,
    },
    img: {
      width: "60px",
      height: "60px",
    },
  });

  Font.register({
    family: "Inter",
    fonts: [
      { src: "./Fonts/Inter-Regular.otf", fontWeight: 400 },
      { src: "./Fonts/Inter-SemiBold.otf", fontWeight: 600 },
    ],
  });

  return (
    <>
      <View style={header.main} fixed>
        <View style={header.wrapper}>
          {siteLogo ? (
            <Image style={header.img} src={siteLogo} />
          ) : businessName ? (
            <Text style={header.businessNameText}>{businessName || ""}</Text>
          ) : null}
        </View>
        <View style={header.TextWrapper}>
          <Text style={header.InvoiceText}>
            INVOICE NO {+invoiceNo > 9 ? invoiceNo : "0" + invoiceNo}
          </Text>
          <Text style={header.InvoiceTime}>{orderDate || ""}</Text>
        </View>
      </View>
    </>
  );
};

export default PDFHeader;
