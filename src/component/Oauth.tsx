import axios from 'axios';
import queryString from "query-string"
import { customAxios } from '../lib/customAxios';

function Query() {
    let qs = queryString.parse(window.location.search);
    console.log(qs);

    // axios.defaults.headers.common['Authorization'] = `Bearer ${qs.accessToken}`

    localStorage.setItem("Authorization", `Bearer ${qs.accessToken}`);
    console.log('oauth:', localStorage.getItem("Authorization"))
    
    // console.log(customAxios.defaults.headers.common['Authorization'])
    customAxios.defaults.headers.common['Authorization'] = `Bearer ${qs.accessToken}`
    console.log('oauth1111:', localStorage.getItem("Authorization"))

    return (
    <>
        Bearer {qs.accessToken}
        <a href="http://localhost:3000">테스트</a>
    </>)
}
export default function Oauth() {
    return <Query />;
}