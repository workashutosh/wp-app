import React, { useEffect, useState } from "react";
import { Mic, Paperclip, Smile, Send, Search, MoreVertical } from "lucide-react";

const ChatArea = ({ activeChat }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (activeChat?.id) {
      fetch(`https://tns.twmresearchalert.com/get_chat.php?contact=${activeChat.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success") {
            setMessages(data.data);
          }
        })
        .catch((err) => console.error("Error fetching chat:", err));
    }
  }, [activeChat]);

  const handleSendMessage = () => {
    if (message.trim()) {
      // Handle sending message
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!activeChat) {
    return (
      <div className="flex flex-col justify-center items-center h-full bg-[#0b141a] text-center p-5 border-b-[6px] border-[#00a884]">
        <div className="w-[550px] mb-5">
          <img 
            src="https://raw.githubusercontent.com/jazimabbas/whatsapp-web-ui/master/public/assets/images/entry-image-dark.png"
            alt="WhatsApp Web"
            className="w-full h-full rounded-full"
          />
        </div>
        <h1 className="text-[#e9edef] text-[2rem] font-normal mb-[10px]">
          WhatsApp Web
        </h1>
        <p className="text-[#8696a0] text-[0.9rem] font-medium max-w-[500px] leading-6 flex items-center pb-[30px]">
          Send and receive messages without keeping your phone online.<br />
          Use WhatsApp on up to 4 linked devices and 1 phone at the same time.
        </p>
        <p className="text-[#8696a0] text-[0.9rem] font-medium max-w-[500px] leading-6 flex items-center pt-[10px]">
          <span>Built by</span>
          <span className="px-2">
                Ashutosh Mishra
          </span>
            
          <span className="text-red-500 ml-[2px]">❤</span>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#0b141a]">
      {/* Chat header */}
      <div className="flex items-center justify-between px-4 py-[10px] bg-[#202c33] border-l border-[#8696a026]">
        <div className="flex items-center flex-1">
          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 cursor-pointer">
            <img
              src={activeChat.avatar || "https://via.placeholder.com/40x40/667781/ffffff?text=" + (activeChat.name?.[0] || "?")}
              alt={activeChat.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 cursor-pointer">
            <h2 className="font-normal text-white text-[16px] leading-[21px]">
              {activeChat.name}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button className="text-[#8696a0] hover:text-white transition-colors p-2 -m-2">
            <Search size={20} />
          </button>
          <button className="text-[#8696a0] hover:text-white transition-colors p-2 -m-2">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages container */}
      <div 
        className="flex-1 overflow-y-auto px-[60px] py-0 relative"
        style={{
          background: "url('https://raw.githubusercontent.com/jazimabbas/whatsapp-web-ui/refs/heads/master/public/assets/images/bg-chat-room.png')",
          backgroundSize: "430px 780px",
          backgroundRepeat: "repeat"
        }}
      >
        <div className="min-h-full flex flex-col justify-end py-[12px]">
          {messages.map((msg, index) => (
            <div
              key={msg.id || index}
              className={`flex mb-1 ${msg.direction === "sent" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative px-[9px] py-[6px] rounded-[7.5px] max-w-[65%] shadow-sm ${
                  msg.direction === "sent"
                    ? "bg-[#005c4b] text-white ml-[60px]"
                    : "bg-[#202c33] text-white mr-[60px]"
                }`}
                style={{
                  borderRadius: msg.direction === "sent" 
                    ? "7.5px 7.5px 0 7.5px" 
                    : "7.5px 7.5px 7.5px 0"
                }}
              >
                <div className="text-[14.2px] leading-[19px] whitespace-pre-wrap break-words">
                  {msg.message}
                </div>
                <div className={`flex items-center justify-end mt-1 gap-1 ${
                  msg.direction === "sent" ? "ml-4" : "ml-4"
                }`}>
                  <span className="text-[11px] text-[#8696a066] leading-[14px]">
                    {msg.formatted_timestamp || ""}
                  </span>
                  {msg.direction === "sent" && (
                    <div className="flex">
                      <svg width="16" height="15" className="ml-1">
                        <path 
                          d="m15.01 3.316-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51zm-4.1 0-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L3.724 9.587a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.063-.51z" 
                          fill={msg.is_read ? "#53bdeb" : "#8696a066"}
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message input area */}
      <div className="px-4 py-[10px] bg-[#202c33]">
        <div className="flex items-end gap-[10px]">
          <button className="text-[#8696a0] hover:text-white transition-colors p-2 -m-2">
            <Smile size={24} />
          </button>
          <button className="text-[#8696a0] hover:text-white transition-colors p-2 -m-2">
            <Paperclip size={24} />
          </button>
          <div className="flex-1 bg-[#2a3942] rounded-[21px] min-h-[42px] flex items-center px-3">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message"
              className="flex-1 bg-transparent text-white text-[15px] placeholder-[#8696a0] border-none outline-none py-[9px] px-[12px] leading-[20px]"
            />
          </div>
          {message.trim() ? (
            <button 
              onClick={handleSendMessage}
              className="text-[#8696a0] hover:text-white transition-colors p-2 -m-2"
            >
              <Send size={24} />
            </button>
          ) : (
            <button className="text-[#8696a0] hover:text-white transition-colors p-2 -m-2">
              <Mic size={24} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatArea;