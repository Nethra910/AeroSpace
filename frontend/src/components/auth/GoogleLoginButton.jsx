import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import userApi from "../../services/userApi";
import { useAuth } from "../../context/AuthContext";

function GoogleLoginButton({ redirectTo = "/" }) {
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse) => {
    try {
      const response = await userApi.post("/users/google", {
        credential: credentialResponse.credential,
      });

      const { access_token, user } = response.data;

      localStorage.setItem("user_access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      navigate(redirectTo, { replace: true });
    } catch (error) {
      console.error(
        "Google login failed:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.error("Google Sign-In failed")}
    />
  );
}

export default GoogleLoginButton;
