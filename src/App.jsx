import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Inicio from "./pages/Inicio";
import Ventas from "./pages/Ventas";
import MovimientoCaja from "./pages/MovimientoCaja";
import Reportes from "./pages/Reportes";
import Almacenes from "./pages/Almacenes";
import Perfil from "./pages/Perfil";
import Trabajadores from "./pages/Trabajadores";
import Clientes from "./pages/Clientes";
import { QueryClient, QueryClientProvider } from "react-query";
import CreateAlmacenes from "./pages/Almacenes/CreateAlmacenes";
import MainContextProvider from "./context/MainContextProvider";
import CreateVenta from "./pages/Ventas/CreateVenta";
import CreateTrabajadores from "./pages/Trabajadores/CreateTrabajadores";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginComponent from "./components/LoginCompononent";
import LoginAdministradorComponent from "./components/LoginAdministradorComponent";
import ReportAlmacenesComponent from "./components/DashboardReporteComponent/ReportAlmacenesComponent";
import ReportCajaComponent from "./components/DashboardReporteComponent/ReportCajaComponent";
import ReportVentasComponent from "./components/DashboardReporteComponent/ReportVentasComponent";
import ReportClientesComponent from "./components/DashboardReporteComponent/ReportClientesComponent";
import MovimientoInventario from "./pages/MovimientoInventario";
import CreateMovementInventario from "./pages/MovimientoInventario/CreateMovementInventario";
import { Box } from "@mui/material";
import Theme from "./theme/Theme";
import ReportProveedoresComponent from "./components/DashboardReporteComponent/ReportProveedoresComponent";
import ReportProductosComponent from "./components/DashboardReporteComponent/ReportProductosComponent";
import EditProductProviders from "./pages/Almacenes/EditProductProviders";
import ReportUtilidadesComponent from "./components/DashboardReporteComponent/ReportUtilidadesComponent";

function App() {
  const queryClient = new QueryClient();

  return (
    <Theme>
      <QueryClientProvider client={queryClient}>
        <MainContextProvider>
          <Router>
            <Routes>
              <Route
                element={<ProtectedRoute allowedPermissions={["reportes"]} />}
              >
                <Route path="/reportes">
                  <Route path="" element={<Reportes />} />
                  <Route
                    path="almacen"
                    element={<ReportAlmacenesComponent />}
                  />
                  <Route path="caja" element={<ReportCajaComponent />} />
                  <Route path="venta" element={<ReportVentasComponent />} />
                  <Route path="cliente" element={<ReportClientesComponent />} />
                  <Route
                    path="proveedor"
                    element={<ReportProveedoresComponent />}
                  />
                  <Route
                    path="producto"
                    element={<ReportProductosComponent />}
                  />
                  <Route
                    path="utilidades"
                    element={<ReportUtilidadesComponent />}
                  />
                </Route>
              </Route>

              <Route
                element={
                  <ProtectedRoute allowedPermissions={["gestion de compras"]} />
                }
              >
                <Route path="/almacenes/crear" element={<CreateAlmacenes />} />
              </Route>
              {/* <Route
                element={
                  <ProtectedRoute allowedPermissions={["gestion de compras"]} />
                }
              >
                <Route
                  path="/almacenes/proveedor"
                  element={<EditProductProviders />}
                />
              </Route> */}
              <Route
                element={<ProtectedRoute allowedPermissions={["inventario"]} />}
              >
                <Route path="/almacenes" element={<Almacenes />} />
                <Route path="/movimiento-inventario">
                  <Route path="" element={<MovimientoInventario />} />
                  <Route
                    path="crear"
                    element={<CreateVenta movimientoInventario={true} />}
                  />
                </Route>
              </Route>

              <Route
                element={
                  <ProtectedRoute
                    allowedPermissions={["gestionar trabajadores"]}
                  />
                }
              >
                <Route path="/trabajadores">
                  <Route path="" element={<Trabajadores />} />
                  <Route path="crear" element={<CreateTrabajadores />} />
                </Route>
              </Route>

              <Route
                element={
                  <ProtectedRoute
                    allowedPermissions={["movimientos de caja"]}
                  />
                }
              >
                <Route path="/movimiento-caja" element={<MovimientoCaja />} />
              </Route>
              <Route
                element={
                  <ProtectedRoute
                    allowedPermissions={["movimientos de caja"]}
                  />
                }
              >
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/clientes" element={<Clientes />} />
              </Route>
              <Route path="/ventas">
                <Route path="" element={<Ventas />} />
                <Route path="crear" element={<CreateVenta />} />
              </Route>
              <Route path="/" element={<Inicio />} />
              <Route path="/login" element={<LoginComponent />} />
              <Route
                path="/login/admin/superadmin"
                element={<LoginAdministradorComponent />}
              />
            </Routes>
          </Router>
        </MainContextProvider>
      </QueryClientProvider>
    </Theme>
  );
}

export default App;
