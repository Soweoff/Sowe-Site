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
import UserDashboard from "./pages/UserDashboard";

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

          {/* Dashboard USER */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dashboard ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
