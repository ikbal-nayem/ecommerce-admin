import { ENV } from "config/ENV.config";
import { Document, Font, Page, StyleSheet } from "@react-pdf/renderer";
import { generateDateFormat } from "utils/splitDate";
import { imageURLGenerate } from "utils/utils";
import Address from "./ReactPDF/Address";
import NotesNSubtotal from "./ReactPDF/NotesNSubtotal";
import PDFFooter from "./ReactPDF/PDFFooter";
import PDFHeader from "./ReactPDF/PDFHeader";
import PDFTable from "./ReactPDF/Table/PDFTable";

const GenerateReactPDF = ({ data }) => {
  const { invoiceData, invoiceItemData } = data;
  const {
    invoice: {
      customerName = "",
      orderDate = new Date(),
      orderNote = "free shipping with 30 days with money back guaranteed",
      orderSubTotal = 0,
      taxAmount = 0,
      deliveryChargeAmount = 0,
      totalPayableAmount = 0,
      shippingAddress: {
        addressLine1 = "",
        addressLine2 = "",
        cityName = "",
        country = "",
        email = "",
        fullAddress = "",
        phone = "",
        postCode = "",
        state = "",
      } = {},
      orderLineList = [],
      invoice: {
        invoiceNo = "",
        orderStatusId = "",
        payAmount = "",
        dueAmount = 0,
        paidAmount = 0,
        totalAmount = 0,
      } = {},
    } = {},
    store: {
      store: { name: storeName = "", businessName = "" } = {},
      storeConfig: { siteLogoUrl = "" } = {},
      storeWarehouse: [
        {
          addressLine1: WH1addressLine1 = "",
          addressLine2: WH1addressLine2 = "",
          city: WH1cityName = "",
          country: WH1country = "",
          email: WH1email = "",
          id: WH1id = "",
          phone: WH1phone = "",
          state: WH1state = "",
          storeId: WH1storeId = "",
          title: WH1title = "",
          zip: WH1postCode = "",
        } = {},
        wearHouse2,
      ] = [],
    } = {},
  } = invoiceData;

  const headerData = {
    businessName: businessName,
    siteLogo: imageURLGenerate(siteLogoUrl),
    invoiceNo,
    orderDate: generateDateFormat(
      orderDate,
      "%date% %MM%, %hour%.%minute%%ampm%"
    ),
  };

  const addressData = {
    businessName,
    WH1addressLine1,
    WH1addressLine2,
    WH1postCode,
    WH1cityName,
    WH1country,
    WH1phone,
    WH1email,
    customerName,
    addressLine1,
    addressLine2,
    postCode,
    cityName,
    country,
    phone,
    email,
  };

  const notesNSubtotalData = {
    orderNote,
    orderSubTotal,
    taxAmount,
    deliveryChargeAmount,
    totalAmount,
    dueAmount,
    paidAmount,
  };

  const tableData = orderLineList;

  const styles = StyleSheet.create({
    pdfViewer: {
      width: "100vw",
      height: "100vh",
    },
    body: {
      paddingTop: 35,
      paddingBottom: 100,
      paddingHorizontal: 35,
      fontSize: "11px",
    },
  });

  Font.register({
    family: "Inter",
    fonts: [
      { src: ENV.FONT_BASE_URL + "/Inter-Thin-BETA.otf", fontWeight: 100 },
      {
        src: ENV.FONT_BASE_URL + "/Inter-ExtraLight-BETA.otf",
        fontWeight: 200,
      },
      { src: ENV.FONT_BASE_URL + "/Inter-Light-BETA.otf", fontWeight: 300 },
      { src: ENV.FONT_BASE_URL + "/Inter-Regular.otf", fontWeight: 400 },
      { src: ENV.FONT_BASE_URL + "/Inter-Medium.otf", fontWeight: 500 },
      { src: ENV.FONT_BASE_URL + "/Inter-SemiBold.otf", fontWeight: 600 },
      { src: ENV.FONT_BASE_URL + "/Inter-Bold.otf", fontWeight: 700 },
      { src: ENV.FONT_BASE_URL + "/Inter-ExtraBold.otf", fontWeight: 800 },
      { src: ENV.FONT_BASE_URL + "/Inter-Black.otf", fontWeight: 900 },
      // italic font
      {
        src: ENV.FONT_BASE_URL + "/Inter-ThinItalic-BETA.otf",
        fontStyle: "italic",
        fontWeight: 100,
      },
      {
        src: ENV.FONT_BASE_URL + "/Inter-ExtraLightItalic-BETA.otf",
        fontStyle: "italic",
        fontWeight: 200,
      },
      {
        src: ENV.FONT_BASE_URL + "/Inter-LightItalic-BETA.otf",
        fontStyle: "italic",
        fontWeight: 300,
      },
      {
        src: ENV.FONT_BASE_URL + "/Inter-Italic.otf",
        fontStyle: "italic",
        fontWeight: 400,
      },
      {
        src: ENV.FONT_BASE_URL + "/Inter-MediumItalic.otf",
        fontStyle: "italic",
        fontWeight: 500,
      },
      {
        src: ENV.FONT_BASE_URL + "/Inter-SemiBoldItalic.otf",
        fontStyle: "italic",
        fontWeight: 600,
      },
      {
        src: ENV.FONT_BASE_URL + "/Inter-BoldItalic.otf",
        fontStyle: "italic",
        fontWeight: 700,
      },
      {
        src: ENV.FONT_BASE_URL + "/Inter-ExtraBoldItalic.otf",
        fontStyle: "italic",
        fontWeight: 800,
      },
      {
        src: ENV.FONT_BASE_URL + "/Inter-BlackItalic.otf",
        fontStyle: "italic",
        fontWeight: 900,
      },
    ],
  });

  Font.register({
    family: "SolaimanLipi",
    format: "truetype",
    src: ENV.FONT_BASE_URL + "/SolaimanLipiNormal.ttf",
  });

  return (
    // <PDFViewer style={styles.pdfViewer}>
    <Document>
      <Page wrap style={styles.body}>
        <PDFHeader headerData={headerData} />
        <Address addressData={addressData} />
        <PDFTable tableData={tableData} />
        <NotesNSubtotal notesNSubtotalData={notesNSubtotalData} />
        <PDFFooter />
      </Page>
    </Document>
    // </PDFViewer>
  );
};

export default GenerateReactPDF;
