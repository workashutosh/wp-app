import React, { useEffect, useState, useContext } from "react";
import IMAGES from "../images";
import { toast } from "react-toastify";
import { getUserPlatform } from "../utils/getUserPlatform";
import { useNavigate } from "react-router-dom";
import { setLocalStorage } from "../utils/setLocalStorage";
import { AppContext } from "../context/AppContext";
import { getLocalStorage } from "../utils/getLocalStorage";
import axiosInstance from "../api/axiosInstance";
import { useLoggerStore } from "@store/log.jsx";
import LoaderComponent from "../components/common/LoaderComponent";
import { EyeClosed, Eye, Lock } from 'lucide-react';
import logo1 from "../../public/logo.svg";

// Splash Screen Component
const SplashScreen = ({ progress }) => {
  return (
    <div className="bg-[#0b141a] min-h-screen flex flex-col justify-center items-center">
      {/* Logo with shine effect */}
      <div className="relative mb-8">
        <div className="relative overflow-hidden">
          <svg
            width="60"
            height="60"
            viewBox="0 0 24 24"
            className="fill-[#00d9bb] z-10 relative"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
          </svg>
          {/* Shine effect */}
          <div
            className="absolute inset-0 -left-[100px] w-[100px] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shine"
            style={{
              animation: 'shine 2s ease-in 0.8s infinite'
            }}
          />
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-[90%] max-w-[400px] h-1 bg-[#233138] relative mb-6 rounded-full overflow-hidden">
        <div
          className="absolute h-full bg-[#00d9bb] transition-all duration-1000 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Title */}
      <h1 className="text-[#e9edef] text-[1.1rem] font-medium mb-2">
        WhatsApp
      </h1>

      {/* Subtitle */}
      <p className="text-[#8696a0] text-[0.85rem] text-center flex items-center">
        <Lock size={14} className="mr-1" />
        End-to-end encrypted. Built by{" "}
        <span className="ml-1 text-[#00d9bb]">Ashutosh Mishra</span>
        <span className="text-red-500 ml-1">❤️</span>
      </p>

      <style jsx>{`
        @keyframes shine {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(150px);
          }
        }
        .animate-shine {
          animation: shine 2s ease-in 0.8s infinite;
        }
      `}</style>
    </div>
  );
};

const LoginPage = () => {
  const { setActiveUserData, activeUserData } = useContext(AppContext);
  const [whatsAppNumber, setWhatsAppNumber] = useState("");
  const [password, setPassword] = useState("");
  const [userPlatform, setUserPlatform] = useState(null);
  const [loaderActive, setLoaderActive] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const { updateActivityLog, initializeLogData } = useLoggerStore();

  const handleLogCheck = async (log) => {
    updateActivityLog(log);
  }

  useEffect(() => {
    initializeLogData(activeUserData);
  }, [activeUserData, initializeLogData]);

  useEffect(() => {
    setUserPlatform(getUserPlatform());

    try {
      if (getLocalStorage()) {
        window.location.href = "/";
      }
    } catch (error) {}
  }, []);

  // Progress bar effect for splash screen
  useEffect(() => {
    if (showSplash) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              navigate("/");
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 200);

      return () => clearInterval(interval);
    }
  }, [showSplash, navigate]);

  const handleInputChange = (e) => {
    setWhatsAppNumber(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLogin = async () => {
    setLoaderActive(true);
    const regex = /^[6-9]\d{9}$/;

    // if (!regex.test(whatsAppNumber)) {
    //   toast.error("Invalid Number");
    //   setLoaderActive(false);
    //   return;
    // }

    if (!password) {
      toast.error("Please enter password");
      setLoaderActive(false);
      return;
    }

    try {
      const res = await axiosInstance("/session", "POST", {
        number: whatsAppNumber,
        password: password,
        platform: userPlatform
      });

      handleLogCheck(`Login Success for ${whatsAppNumber}`);
      setActiveUserData({
        user_name: res?.data?.data?.user_name,
        user_id: res?.data?.data?.user_id,
        user_position: res?.data?.data?.user_role,
      });

      setLocalStorage(
        res?.data?.data?.access_token,
        res?.data?.data?.access_token_expiry,
        res?.data?.data?.refresh_token,
        res?.data?.data?.refresh_token_expiry,
        res?.data?.data?.session_id
      );
      
      // Show splash screen after successful login
      setShowSplash(true);
      
    } catch (error) {
      toast.error(error?.response?.data?.messages[0] || "Login failed");
      handleLogCheck(`Login Failed for ${whatsAppNumber}`);
    } finally {
      setLoaderActive(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show splash screen if login is successful
  if (showSplash) {
    return <SplashScreen progress={progress} />;
  }

  return (
    <section 
      className="min-h-screen bg-[#0b141a] flex items-center justify-center px-4 py-6"
      style={{
        backgroundImage: `url('https://raw.githubusercontent.com/jazimabbas/whatsapp-web-ui/refs/heads/master/public/assets/images/bg-chat-room.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-md bg-[#202c33] border border-[#3b4a54] rounded-lg px-8 py-10 shadow-xl">
        
        {/* Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <img src={logo1} className="w-[100px] max-w-full mb-4" alt="Logo" />
          <h1 className="text-[#e9edef] text-2xl font-light">WhatsApp Web</h1>
          <p className="text-[#8696a0] text-sm mt-2 text-center">
            Sign in to continue to WhatsApp
          </p>
        </div>

        <div className="space-y-6">
          {/* Username Field */}
          <div className="space-y-1">
            <label className="text-[#8696a0] text-sm">Username</label>
            <input
              className="w-full px-4 py-3 bg-[#2a3942] border border-[#3b4a54] rounded-md text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-[#00d9bb] focus:ring-1 focus:ring-[#00d9bb] transition-colors"
              type="text"
              placeholder="Username"
              value={whatsAppNumber}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-1">
            <label className="text-[#8696a0] text-sm">Password</label>
            <div className="relative">
              <input
                className="w-full px-4 py-3 bg-[#2a3942] border border-[#3b4a54] rounded-md text-[#e9edef] placeholder-[#8696a0] focus:outline-none focus:border-[#00d9bb] focus:ring-1 focus:ring-[#00d9bb] transition-colors pr-12"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
                onKeyPress={handleKeyPress}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8696a0] hover:text-[#e9edef] transition-colors"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              onClick={handleLogin}
              disabled={loaderActive}
              className="w-full py-3 bg-[#00d9bb] hover:bg-[#00c4aa] disabled:bg-[#8696a0] text-[#0b141a] font-medium rounded-md transition-colors disabled:cursor-not-allowed"
            >
              {loaderActive ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-[#8696a0] text-xs flex items-center justify-center">
            <Lock size={12} className="mr-1" />
            Your personal messages are end-to-end encrypted
          </p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;