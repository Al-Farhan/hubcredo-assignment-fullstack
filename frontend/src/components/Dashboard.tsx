import { jwtDecode, type JwtPayload } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useEffect } from "react";

interface MyPayload extends JwtPayload {
  UserInfo: {
    email: string;
    name: string;
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token]);

  if (!token) {
    return;
  }

  const decodedToken = jwtDecode<MyPayload>(token);
  const userInfo = decodedToken?.UserInfo;

  const onLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/auth/logout`
      );

      if (response && response.status === 204) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Some error occured",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-zinc-50 font-sans ">
      <h2>Welcome {userInfo.name}</h2>

      <Button onClick={() => onLogout()}>Sign Out</Button>
    </div>
  );
};

export default Dashboard;
