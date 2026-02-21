import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { mockPT, mockClient } from "@/mock/data";

export function useAuth() {
  const { user, isAuthenticated, login, logout, updateUser, addCoins } = useAuthStore();
  const navigate = useNavigate();

  const loginAsPT = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    login(mockPT, "mock-token-pt");
    navigate("/pt/home");
  };

  const loginAsClient = async (email: string, _password: string) => {
    await new Promise((r) => setTimeout(r, 800));
    login(mockClient, "mock-token-client");
    navigate("/client/home");
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return {
    user,
    isAuthenticated,
    isPT: user?.role === "physiotherapist",
    isClient: user?.role === "client",
    isVetted: user?.vettingStatus === "approved",
    isSubscribed: user?.isSubscribed,
    loginAsPT,
    loginAsClient,
    logout: handleLogout,
    updateUser,
    addCoins,
  };
}
