// src/MyDocument.jsx
import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import logo from "./img/LogoHITC.png";
import roboto from "./fonts/Roboto-Regular.ttf";

Font.register({
  family: "Roboto",
  src: roboto,
  fontStyle: "normal",
  fontWeight: "normal",
});

const styles = StyleSheet.create({
  page: { fontFamily: "Roboto", fontSize: 11, padding: 40, color: "#000" },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  logo: { width: 80, height: 80, marginRight: 12 },
  titleContainer: { flexDirection: "column" },
  schoolName: { color: "#0070C0", fontSize: 14, fontWeight: "bold" },
  faculty: {
    backgroundColor: "#0070C0",
    color: "white",
    fontSize: 11,
    paddingVertical: 3,
    paddingHorizontal: 8,
    alignSelf: "flex-start",
    borderRadius: 3,
    marginTop: 4,
  },
  info: { marginTop: 10, marginBottom: 6 },
  infoText: { marginBottom: 4 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#DEDEDE",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginTop: 12,
    paddingVertical: 4,
  },
  thWide: { flex: 2, padding: 4, fontWeight: "bold", textAlign: "left" }, // căn trái
  th: { flex: 1, padding: 4, fontWeight: "bold", textAlign: "center" },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 4,
    alignItems: "center",
  },
  tdWide: { flex: 2, padding: 2, textAlign: "left" }, // căn trái
  td: { flex: 1, padding: 2, textAlign: "center" },
  totalRow: { flexDirection: "row", justifyContent: "flex-end", marginTop: 8 },
  totalLabel: { fontWeight: "bold", marginRight: 12 },
  totalValue: { fontWeight: "bold" },
});

const MyDocument = ({ data }: { data: any }) => {
  const { cartItems, username, createdAt, cartId } = data;

  // Tính tổng tiền
  const totalAmount = cartItems.reduce(
    (sum: number, item: any) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
    <Document>
      <Page style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Image src={logo} style={styles.logo} />
          <View style={styles.titleContainer}>
            <Text style={styles.schoolName}>
              HANOI INDUSTRY AND TRADE COLLEGE
            </Text>
            <Text style={styles.faculty}>E-COMMERCE FACULTY</Text>
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.info}>
          <Text style={styles.infoText}>Cart ID: {cartId}</Text>
          <Text style={styles.infoText}>Username: {username}</Text>
          <Text style={styles.infoText}>
            Created At: {new Date(createdAt).toLocaleString()}
          </Text>
        </View>

        {/* Table Header */}
        <View style={styles.tableHeader}>
          <Text style={styles.thWide}>Product Name</Text>
          <Text style={styles.th}>Quantity</Text>
          <Text style={styles.th}>Unit Price</Text>
          <Text style={styles.th}>Total Price</Text>
        </View>

        {/* Table Rows */}
        {cartItems.map((item: any, index: number) => (
          <View key={index} style={styles.row}>
            <Text style={styles.tdWide}>{item.productName}</Text>
            <Text style={styles.td}>{item.quantity}</Text>
            <Text style={styles.td}>
              ${item.unitPrice.toFixed(2)}
            </Text>
            <Text style={styles.td}>
              ${(item.quantity * item.unitPrice).toFixed(2)}
            </Text>
          </View>
        ))}

        {/* Total Amount */}
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>${totalAmount.toFixed(2)}</Text>
        </View>
      </Page>
    </Document>
  );
}

export default MyDocument;
