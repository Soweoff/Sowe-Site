import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Youtube from "./pages/Youtube";
import CS2 from "./pages/CS2";
import Edition from "./pages/Edition";
import Products from "./pages/Products";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import Websites from "./pages/Websites";
import Privacy from "./pages/Privacy";
import Portfolio from "./pages/Portfolio";
import Booking from "./pages/Booking";
import Bookings from "./pages/Bookings";
import UserDashboard from "./pages/UserDashboard";
import Metrics from "./pages/Metrics";
import Tasks from "./pages/Tasks";
import Goal from "./pages/Goal";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/youtube" element={<Youtube />} />
          <Route path="/cs2" element={<CS2 />} />
          <Route path="/edition" element={<Edition />} />
          <Route path="/products" element={<Products />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/websites" element={<Websites />} />
          <Route path="/privacidade" element={<Privacy />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/agendar" element={<Booking />} />

          {/* Dashboard USER */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dashboard ADMIN (somente papel ADMIN) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/agendamentos"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Bookings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/tarefas"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Tasks />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/meta"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Goal />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/metrics"
            element={
              <ProtectedRoute allowedRoles={["ADMIN"]}>
                <Metrics />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
