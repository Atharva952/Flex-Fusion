import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import {setReceiverId} from "../../redux/chatSlice"
import io from "socket.io-client";
import moment from "moment";

const socket = io("http://localhost:8080", { withCredentials: true });


const ChatWithUser = () => {
  const user = useSelector((state) => state.user);
  const { receiverId } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [latestMessages, setLatestMessages] = useState({}); 

  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/user/all-users", { withCredentials: true });
        if (Array.isArray(res.data)) {
          const filtered = res.data.filter(u => u && u._id && u.username && u.role === "User");
          setUsers(filtered);
        }
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  
  useEffect(() => {
    if (receiverId) fetchMessages();
    else setMessages([]);
  }, [receiverId]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/v1/message/conversations/${receiverId}`, {
        withCredentials: true,
      });
      if (Array.isArray(res.data)) {
        setMessages(res.data);
      } else {
        console.error("Invalid message response:", res.data);
      }
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;

    try {
      const res = await axios.post(
        "http://localhost:8080/api/v1/message/send",
        { receiverId, message: messageInput },
        { withCredentials: true }
      );

      const newMessage = res.data.data;

      socket.emit("sendMessage", {
        receiverId,
        senderId: user?._id,
        message: newMessage.message,
        createdAt: newMessage.createdAt,
      });

      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");

      
      setLatestMessages((prev) => ({
        ...prev,
        [receiverId]: {
          count: 0,
          lastMessageTime: newMessage.createdAt,
        },
      }));
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  
  useEffect(() => {
    if (user?._id) {
      socket.emit("joinRoom", { userId: user._id });

      const handleReceive = (msg) => {
        const { senderId, createdAt } = msg;

        if (senderId === receiverId || msg.receiverId === receiverId) {
          setMessages((prev) => [...prev, msg]);
        }

        setLatestMessages((prev) => ({
          ...prev,
          [senderId]: {
            count: (prev[senderId]?.count || 0) + (senderId !== receiverId ? 1 : 0),
            lastMessageTime: createdAt,
          },
        }));
      };

      socket.on("receiveMessage", handleReceive);

      return () => socket.off("receiveMessage", handleReceive);
    }
  }, [user, receiverId]);

  const handleSelectUser = (id) => {
    dispatch(setReceiverId(id));
    setLatestMessages((prev) => ({
      ...prev,
      [id]: { ...prev[id], count: 0 },
    }));
  };

  const sortedUsers = [...users].sort((a, b) => {
    const timeA = latestMessages[a._id]?.lastMessageTime || 0;
    const timeB = latestMessages[b._id]?.lastMessageTime || 0;
    return new Date(timeB) - new Date(timeA);
  });

  return (
    <div className="flex h-[91vh] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg overflow-hidden">
     
      <div className="w-1/4 border-r border-gray-300 overflow-y-auto p-4 bg-white">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Users</h2>
        {sortedUsers.length === 0 ? (
          <p className="text-gray-500">No users available</p>
        ) : (
          sortedUsers.map((u) => (
            <div
              key={u._id}
              onClick={() => handleSelectUser(u._id)}
              className={`relative cursor-pointer p-3 mb-2 rounded-xl transition-all duration-300 ${
                receiverId === u._id
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                  : "hover:bg-blue-100 text-gray-900"
              }`}
            >
              {u.username}
              {latestMessages[u._id]?.count > 0 && (
                <span className="absolute top-2 right-3 bg-red-500 text-white text-xs rounded-full px-2">
                  {latestMessages[u._id]?.count}
                </span>
              )}
            </div>
          ))
        )}
      </div>

      
      <div className="flex-1 p-6 flex flex-col justify-between bg-gray-50">
        {!receiverId ? (
          <div className="text-gray-600 mt-20 text-center text-lg font-medium">
            <p>Select a user to start chatting.</p>
          </div>
        ) : (
          <>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-3 py-2 bg-white rounded-lg shadow-inner border">
              {messages.length > 0 ? (
                messages.map((m, i) => {
                  const senderId = typeof m.senderId === "object" ? m.senderId._id : m.senderId;
                  const currentUserId = user?.authUser?._id || user?._id;
                  const isUser = senderId?.toString() === currentUserId?.toString();
                  const time = moment(m.createdAt).format("HH:mm");

                  return (
                    <div
                      key={i}
                      className={`max-w-[60%] px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 relative ${
                        isUser
                          ? "ml-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none"
                          : "mr-auto bg-gray-300 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      <div>{m.message}</div>
                      <div className="text-xs text-gray-200 text-right mt-1">{time}</div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500">No messages yet.</div>
              )}
            </div>

            
            <div className="flex gap-3 items-center">
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
              />
              <button
                onClick={sendMessage}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-5 py-2 rounded-2xl shadow-md transition"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatWithUser;
