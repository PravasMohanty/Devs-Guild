import axios from "axios";

const API_URL = "http://localhost:3150"; // Your backend base URL

export const getMessages = async () => {
    const res = await axios.get(`${API_URL}/messages`);
    return res.data;
};

export const sendMessage = async (message) => {
    const res = await axios.post(`${API_URL}/messages`, { message });
    return res.data;
};
