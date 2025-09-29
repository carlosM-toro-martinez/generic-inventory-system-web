import React, { useState } from "react";
import DrawerComponent from "../../DrawerComponent";
import { useQuery } from "react-query";
import { Box } from "@mui/material";
import reportProveedoresServices from "../../../async/services/get/reportProveedoresServices";
import TableProveedorComponent from "./TableProveedorComponent";

function ReportProveedoresComponent() {
  const {
    data: reportData,
    refetch: fetchReport,
    isLoading: isLoadingReport,
  } = useQuery("reporteProveedor", () => reportProveedoresServices());

  return (
    <DrawerComponent>
      {!isLoadingReport && <TableProveedorComponent data={reportData} />}
    </DrawerComponent>
  );
}

export default ReportProveedoresComponent;
