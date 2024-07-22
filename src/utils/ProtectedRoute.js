import { useNavigate } from "react-router-dom"
import axios from "./axios"
import { useState } from "react";
const ProtectedRoute = ({ children }) => {
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate()
    axios.get("http://vmi2000569.contaboserver.net:4000/api/profile").then(res => {
        setSuccess(true);
    }).catch(e => {
        if (e.status === 401) {
            navigate("/");
        }
    })
    if (success) {
        return children
    }
};

export default ProtectedRoute;
