import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import io from "socket.io-client";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setReceiverId } from "../../redux/chatSlice";


const socket = io("http://localhost:8080", { withCredentials: true });

export default function MyTrainer() {
  const user = useSelector((state) => state.user);
  const { receiverId } = useSelector((state) => state.chat);
  const dispatch = useDispatch();

  const [trainers, setTrainers] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/user/all-trainers", {
          withCredentials: true,
        });
        if (Array.isArray(res.data)) {
          setTrainers(res.data);
        } else {
          console.error("Invalid trainer response:", res.data);
        }
      } catch (err) {
        console.error("Error fetching trainers:", err);
      }
    };
    fetchTrainers();
  }, []);

  const fetchMessages = async () => {
    if (!receiverId) return;
    try {
      const response = await axios.get(`http://localhost:8080/api/v1/message/conversations/${receiverId}`, {
        withCredentials: true,
      });
      setMessages(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      setMessages([]);
    }
  };

  const sendMessage = async () => {
    if (!messageInput.trim()) return;
    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/message/send",
        { receiverId, message: messageInput },
        { withCredentials: true }
      );

      const newMessage = response.data.data;

      socket.emit("sendMessage", {
        receiverId,
        senderId: user?._id,
        message: newMessage.message,
        createdAt: newMessage.createdAt,
      });

      setMessages((prev) => [...prev, newMessage]);
      setMessageInput("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (user?._id) {
      socket.emit("joinRoom", { userId: user._id });

      const handleReceive = (msg) => {
        if (msg.senderId === receiverId || msg.receiverId === receiverId) {
          setMessages((prev) => [...prev, msg]);
        }
      };

      socket.on("receiveMessage", handleReceive);

      return () => {
        socket.off("receiveMessage", handleReceive);
      };
    }
  }, [user, receiverId]);

  useEffect(() => {
    if (receiverId) {
      fetchMessages();
    } else {
      setMessages([]);
    }
  }, [receiverId]);

  const handleSelectTrainer = (id) => {
    dispatch(setReceiverId(id));
  };

  return (
    <div className="flex h-[91vh] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl shadow-lg overflow-hidden">
      
      <div className="w-1/4 border-r border-gray-300 overflow-y-auto p-4 bg-white">
        <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">Trainers</h2>
        {trainers.length === 0 ? (
          <p className="text-gray-700">No trainers available</p>
        ) : (
          trainers.map((trainer) => (
            <div
              key={trainer._id}
              onClick={() => handleSelectTrainer(trainer._id)}
              className={`cursor-pointer p-3 mb-2 rounded-xl transition-all duration-300 ${
                receiverId === trainer._id
                  ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                  : "hover:bg-blue-100 text-gray-900"
              }`}
            >
              {trainer.username}
            </div>
          ))
        )}
      </div>

     
      <div className="flex-1 p-6 flex flex-col justify-between bg-gray-50">
        {!receiverId ? (
          <div className="text-gray-600 mt-20 text-center text-lg font-medium">
            <p>Select a trainer to start chatting.</p>
          </div>
        ) : (
          <>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-3 py-2 bg-white rounded-lg shadow-inner border">
              {Array.isArray(messages) && messages.length > 0 ? (
  messages.map((m, i) => {
    const senderId = typeof m.senderId === "object" ? m.senderId._id : m.senderId;
    const currentUserId = user?.authUser?._id || user?._id;
    const istrainer = senderId?.toString() === currentUserId?.toString();

    return (
      <div
        key={i}
        className={`max-w-[60%] px-4 py-2 rounded-2xl shadow-sm transition-all duration-200 ${
          istrainer
            ? "ml-auto bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-br-none"
            : "mr-auto bg-gray-300 text-gray-800 rounded-bl-none"
        }`}
      >
        <p className="text-sm">{m.message}</p>
        <p
          className={`text-[11px] mt-1 text-right italic ${
            istrainer ? "text-gray-300" : "text-gray-700"
          }`}
        >
          {moment(m.createdAt).format("h:mm A")}
        </p>
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
                className="flex-1 p-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
}
