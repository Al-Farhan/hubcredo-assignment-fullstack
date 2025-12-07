import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import SignUpPage from "./components/SignUp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="login" element={<Login />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
