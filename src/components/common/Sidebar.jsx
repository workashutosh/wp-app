import React, { useState, useEffect, useRef, useContext } from "react";
import { Search, MoreVertical, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import secureLocalStorage from "react-secure-storage";

const Sidebar = ({ setActiveChat }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMenu, setShowMenu] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);

  // You'll need to import these from your actual context and navigation
  // const { activeUserData, setActiveUserData } = useContext(AppContext);
   const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch(
          "https://tns.twmresearchalert.com/get_contact_list.php"
        );
        const data = await res.json();
        if (data.status === "success") {
          setChats(data.data);
        }
      } catch (err) {
        console.error("Error fetching chats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setShowMenu(false);

    try {
      navigate("/login");
      secureLocalStorage.clear("data");
      // Import secureLocalStorage and other dependencies in your actual implementation
      /*
      import secureLocalStorage from "react-secure-storage";
      import axiosInstance from "@api/axiosInstance";
      
      // Clear local storage and update UI state
      secureLocalStorage.clear("data");
      setActiveUserData(null);

      // Navigate to login page
      navigate("/login");

      // Perform logout request
      const lsData = secureLocalStorage.getItem("data");
      if (lsData && lsData.session_id && lsData.access_token) {
        await axiosInstance(
          `/session/logout?session=${lsData.session_id}`,
          "DELETE",
          {},
          lsData.access_token
        );
      }
      */
      
      
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSettings = () => {
    setShowMenu(false);
    // Add your settings navigation logic here
    alert("Settings - implement navigation to settings page");
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-[#111b21] border-r border-gray-300 dark:border-[#2a2f32]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#f0f2f5] dark:bg-[#202c33] border-b border-gray-300 dark:border-[#2a2f32]">
        <div className="w-10 h-10 rounded-full overflow-hidden cursor-pointer">
          <img
            src="https://imgs.search.brave.com/yyohYnmzAAnkfFJW05xsD3s5CgX2w39fc_AGW-kFWFo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90My5m/dGNkbi5uZXQvanBn/LzEyLzgxLzEyLzE2/LzM2MF9GXzEyODEx/MjE2NjNfSmV4eXJI/ckFCZUhjOEl0Q3lG/Qk1DR2hqZVBRekxV/QlYuanBn"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="relative" ref={menuRef}>
          <button 
            onClick={() => setShowMenu(!showMenu)}
            className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-[#2a3942] rounded-full transition-colors"
          >
            <MoreVertical size={20} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-[#233138] rounded-md shadow-lg z-50 py-1">
              <button
                onClick={handleSettings}
                className="flex items-center px-4 py-3 text-[#e9edef] hover:bg-[#2a3942] transition-colors w-full text-left text-sm"
              >
                <Settings size={16} className="mr-3" />
                Settings
              </button>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex items-center px-4 py-3 text-[#e9edef] hover:bg-[#2a3942] transition-colors w-full text-left text-sm disabled:opacity-50"
              >
                <LogOut size={16} className="mr-3" />
                {isLoggingOut ? "Logging out..." : "Log out"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="p-2 bg-white dark:bg-[#111b21] border-b border-gray-300 dark:border-[#2a2f32]">
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-500 dark:text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full py-1.5 pl-10 pr-4 rounded-lg text-sm bg-[#f0f2f5] dark:bg-[#202c33] text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-transparent focus:outline-none focus:border-gray-400 dark:focus:border-gray-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-[#2a3942] scrollbar-track-transparent">
        {loading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            Loading chats...
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No chats found
          </div>
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() =>
                setActiveChat({
                  ...chat,
                  avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    chat.name
                  )}&background=random`,
                  messages: [], // You can fetch messages here if needed
                })
              }
              className="flex items-center px-4 py-3 border-b border-gray-200 dark:border-[#2a2f32] hover:bg-[#f5f6f6] dark:hover:bg-[#2a3942] cursor-pointer transition-colors"
            >
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden mr-3 flex-shrink-0">
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                    chat.name
                  )}&background=random`}
                  alt={chat.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Chat info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-0.5">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {chat.name || "Unknown"}
                  </h3>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {chat.latest_message_timestamp}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {chat.latest_message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;