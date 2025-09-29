// PDFReport.js
import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 30,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
  },
  table: {
    display: "flex",
    flexDirection: "column",
    border: "1px solid black",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottom: "1px solid black",
    padding: 5,
  },
  cell: {
    width: "16%", // Ajusta el ancho según sea necesario
  },
});

const PDFReport = ({ buyLote, sumaTotal }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Reporte de Compra</Text>
      <View style={styles.section}>
        <View style={styles.table}>
          <View style={styles.row}>
            <Text style={styles.cell}>Fecha Caducidad</Text>
            <Text style={styles.cell}>Cantidad</Text>
            <Text style={styles.cell}>Producto</Text>
            <Text style={styles.cell}>Proveedor</Text>
            <Text style={styles.cell}>Precio Unitario</Text>
            <Text style={styles.cell}>Precio Total</Text>
          </View>
          {buyLote.map((registro, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>
                {new Date(registro?.fecha_caducidad).toLocaleDateString()}
              </Text>
              <Text style={styles.cell}>{registro?.cantidad}</Text>
              <Text style={styles.cell}>{registro?.producto?.nombre}</Text>
              <Text style={styles.cell}>
                {registro?.detalleCompra?.proveedor?.nombre}
              </Text>
              <Text style={styles.cell}>
                {registro?.detalleCompra?.precio_unitario} Bs
              </Text>
              <Text style={styles.cell}>
                {(
                  registro.cantidad * registro.detalleCompra.precio_unitario
                ).toFixed(2)}{" "}
                Bs
              </Text>
            </View>
          ))}
          <View style={styles.row}>
            <Text style={styles.cell}>Suma Total:</Text>
            <Text style={styles.cell}>{sumaTotal.toFixed(2)} Bs</Text>
          </View>
        </View>
      </View>
    </Page>
  </Document>
);

export default PDFReport;
