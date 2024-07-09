"use client";


import axios from "axios";
import { useState } from "react";
import Navbar from "../components/Navbar";

export default function Home() {
  
  const [clanTag, setClanTag] = useState("#2Q8G0LPU0");

  const onClanTagChange = (event) => {
    setClanTag(event.target.value);
  }

  const onButtonClick = () => {

    // on demande a l'api de chercher les joueurs sans clan qui correspondent au prérequis du clanTag"
    axios.put(`${window.location.origin}/api/put/searchPlayerWithNoClan`, clanTag)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <>
      <Navbar />  
        <div className="bg-gray-800 text-white flex">
          <div className="flex items-center flex-col w-full p-3 space-y-2">
            <p className="text-1xl">entrez le tag de votre clan, pour avoir des recommandation de joueurs correspondant</p>
            <input className="w-32 text-black" placeholder="#..." type="text" name="clanTag" onChange={onClanTagChange} value={clanTag}/>
            <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded" onClick={onButtonClick}>trouve moi des joueurs</button>
          </div>
        </div>
    </>
    
  );
}
