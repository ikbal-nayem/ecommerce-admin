import { ENV } from "config/ENV.config";
import { Font, StyleSheet, Text, View } from "@react-pdf/renderer";

interface IPdfAddress {
  addressData: {
    businessName: string;
    WH1addressLine1: string;
    WH1addressLine2: string;
    WH1postCode: string;
    WH1cityName: string;
    WH1country: string;
    WH1phone: string;
    WH1email: string;
    customerName: string;
    addressLine1: string;
    addressLine2: string;
    postCode: string;
    cityName: string;
    country: string;
    phone: string;
    email: string;
  };
}

const address = StyleSheet.create({
  main: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: "10px",
    fontFamily: "Inter",
  },
  billForm: {
    lineHeight: "1.5px",
    fontWeight: 400,
  },
  shipTo: {
    lineHeight: "1.5px",
    fontWeight: 400,
  },
  HeaderText: {
    fontFamily: "Inter",
    fontSize: "11px",
    fontWeight: 600,
    marginBottom: "5px",
  },
});

const Address = ({ addressData }: IPdfAddress) => {
  const {
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
  } = addressData;

  Font.register({
    family: "Inter",
    fonts: [
      { src: "./Fonts/Inter-Regular.otf", fontWeight: 400 },
      { src: "./Fonts/Inter-SemiBold.otf", fontWeight: 600 },
    ],
  });

  Font.register({
    family: "SolaimanLipi",
    format: "truetype",
    src: ENV.FONT_BASE_URL + "/SolaimanLipiNormal.ttf",
  });

  return (
    <View style={address.main}>
      {/* bill form */}
      <View style={address.billForm}>
        <Text style={address.HeaderText}>BILL FROM</Text>
        <Text>{businessName || ""}</Text>
        <Text>
          {WH1addressLine1 || ""} {WH1addressLine2 || ""}
        </Text>
        <Text>
          {WH1postCode && WH1postCode + "-"}
          {WH1cityName && WH1cityName + ", "} {WH1country}
        </Text>
        <Text>{WH1phone || ""}</Text>
        <br />
        <Text>{WH1email || ""}</Text>
      </View>
      {/* ship to */}
      <View style={address.shipTo}>
        <Text style={address.HeaderText}>SHIP TO</Text>
        <Text>{customerName || ""}</Text>
        <Text>
          {addressLine1 || ""} {addressLine2 || ""}
        </Text>
        <Text>
          {postCode && postCode + "-"}
          {cityName && cityName + ", "} {country}
        </Text>
        <Text>{phone || ""}</Text>
        <Text>{email || ""}</Text>
      </View>
    </View>
  );
};

export default Address;
