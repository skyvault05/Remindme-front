import queryString from "query-string"
import { customAxios } from '../lib/customAxios';
import { Navigate } from 'react-router-dom';

function Query() {
    let qs = queryString.parse(window.location.search);
    localStorage.setItem("Authorization", `Bearer ${qs.accessToken}`);
    customAxios.defaults.headers.common['Authorization'] = `Bearer ${qs.accessToken}`
    return <Navigate to="/"></Navigate>
}

export default function Oauth() {
    return <Query />;
}