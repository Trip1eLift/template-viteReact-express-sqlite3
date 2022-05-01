import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

export default function App() {
  const [payload, setPayload] = useState();
  
  useEffect(() => {
    axios.get("http://localhost:8080/hello")
      .then((res) => {
        setPayload(res.data);
      })
      .catch((err) => {
        console.error(err)
      });
  }, []);

  if (payload)
    console.log(payload);

  return (
    <div className="App">
      {payload && <>
        <div>{payload.message}</div>
        <div>ID: {payload.rows[0].id}</div>
        <div>Name: {payload.rows[0].name}</div>
      </>}
    </div>
  )
}