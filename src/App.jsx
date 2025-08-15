import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Sidebar from "@components/common/Sidebar";
import ChatArea from "@components/common/ChatArea";
import React, { useState } from "react";

// Page imports
import LoginPage from "@pages/LoginPage";

const WhatsAppLayout = () => {
  const [activeChat, setActiveChat] = useState(null);

  return (
    <div className="flex h-screen bg-[#efeae2] dark:bg-[#0b141a]">
      <div className="w-full md:w-1/3 lg:w-[30%] h-full">
        <Sidebar setActiveChat={setActiveChat} />
      </div>
      <div className="hidden md:block md:w-2/3 lg:w-[70%] h-full">
        <ChatArea activeChat={activeChat} />
      </div>
    </div>
  );
};

// Route configuration
const routes = [
  {
    path: "/login",
    element: LoginPage,
    protected: false
  },
  {
    path: "/",
    element: WhatsAppLayout,
    protected: true,
    key: "whatsapp-layout",
    role: "admin"
  }
];

const AppContent = () => {
  const renderRoute = (route) => {
    const Component = route.element;
    
    if (!route.protected) {
      return <Route key={route.path} path={route.path} element={<Component />} />;
    }

    return (
      <Route
        key={route.path}
        path={route.path}
        element={
          <ProtectedRoute
            element={<Component />}
            key={route.key}
            role={route.role}
          />
        }
      />
    );
  };

  return (
    <>
    <ToastContainer 
      autoClose={1000}
      position="top-right"
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      className="z-50"
    />
    <BrowserRouter>
      <Routes>
        {routes.map(renderRoute)}
      </Routes>
    </BrowserRouter>
    </>
  );
};

const App = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;