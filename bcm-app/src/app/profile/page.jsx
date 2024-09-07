"use client";


import axios from "axios";
import { useEffect, useRef, useState } from "react";
import HighlightedText from "../../components/HighlightedText";
import '../animation.css';
import UnderlineText from "../../components/UnderlineText";
import SemiHighlightedText from "../../components/SemiHighlightedText";



export default function Home() {

  const [playerTag, setPlayerTag] = useState(null);
  const [playerToken, setPlayerToken] = useState(null);

  const playerTagSpanRef = useRef(null);
  const playerTagUnderlineRef = useRef(null);

  const playerTokenSpanRef = useRef(null);
  const playerTokenUnderlineRef = useRef(null);

  /* on met la largeur du soulignement a la largeur du spam (du text) dès que le playerTag change  */
  useEffect(() => {
    if (playerTagSpanRef.current && playerTagUnderlineRef.current && playerTagSpanRef.current.offsetWidth < 210) {
      playerTagUnderlineRef.current.style.width = `${playerTagSpanRef.current.offsetWidth}px`;
    }
  }, [playerTag]);

  /* on met la largeur du soulignement a la largeur du spam (du text) dès que le playerTag change  */
  useEffect(() => {
    if (playerTokenSpanRef.current && playerTokenUnderlineRef.current && playerTokenSpanRef.current.offsetWidth < 210) {
      playerTokenUnderlineRef.current.style.width = `${playerTokenSpanRef.current.offsetWidth}px`;
    }
  }, [playerToken]);

  const onPlayerTagChange = (e) => {
    setPlayerTag(e.target.value)
  }

  const onPlayerTokenChange = (e) => {
    setPlayerToken(e.target.value)
  }

  return (
    <div className="absolute  lg:h-full md:h-auto w-full bg-[#FFF1E2] text-black dark:text-white dark:bg-gray-800">
      <div className="dark:text-gray-100 text-gray-900 sm:text-5xl md:text-4xl p-3 flex justify-between">

        <a className="font-semibold" href="/"><UnderlineText text={"BetterClanMate"} color={'#FF7700'} customHeight={"7px"}/></a>

        <a href="/profile" className="text-2xl font-semibold" ><UnderlineText text={"se connecter"} color={"#FF7700"} customHeight={"7px"}/></a>
      </div> 

      <div className="flex w-full h-full">
        <div className="flex flex-col ml-auto mr-auto mt-[100px]">  
          {/* div pour rentrer son tag */}
          <div className="flex flex-col items-start">
            <span className="font-semibold text-1xl">entrez votre <HighlightedText text={"tag in-game"} color={"#FF7700"} customHeight={"25px"}/>.</span>
            {/* div pour l'input */}
            <div className="relative inline-block">
              {/* input pour recuperer le texte */}
              <input
                className="border-0 bg-inherit w-[205px] focus:outline-none focus:ring-0 "
                placeholder="#..."
                type="text"
                name="playerTag"
                spellCheck="false"
                value={playerTag}
                onChange={onPlayerTagChange}
                style={{ paddingBottom: '1px' }} // on ajoute un peu d'espace pour le soulignement
              />
              {/* span invisible pour mesurer la largeur du texte*/}
              <span
                ref={playerTagSpanRef}
                className="absolute top-0 left-0 invisible whitespace-pre"
                style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
              >
                {playerTag || "#..."}
              </span>
              {/* div pour le soulignement dynamique en fonction de la largeur du span*/}
              <div
                ref={playerTagUnderlineRef}
                className="absolute left-0 bottom-0 h-[3px] bg-[#FF7700] hover:bg-[#FFF1E2]"
                style={{ transition: 'width 0.2s' }}
              />
            </div>
          </div>

          {/* div pour rentrer son token */}
          <div className="flex flex-col items-start mt-5">
            <span className="font-semibold text-1xl">entrez votre <HighlightedText text={"jeton in-game"} color={"#FF7700"} customHeight={"25px"}/> (avant dernière catégorie des option supplémentaire du jeu).</span>
            {/* div pour l'input */}
            <div className="relative inline-block">
              {/* input pour recuperer le texte */}
              <input
                className="border-0 bg-inherit w-[205px] focus:outline-none focus:ring-0 "
                placeholder="..."
                type="text"
                name="playerToken"
                spellCheck="false"
                value={playerToken}
                onChange={onPlayerTokenChange}
                style={{ paddingBottom: '1px' }} // on ajoute un peu d'espace pour le soulignement
              />
              {/* span invisible pour mesurer la largeur du texte*/}
              <span
                ref={playerTokenSpanRef}
                className="absolute top-0 left-0 invisible whitespace-pre"
                style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
              >
                {playerToken || "..."}
              </span>
              {/* div pour le soulignement dynamique en fonction de la largeur du span*/}
              <div
                ref={playerTokenUnderlineRef}
                className="absolute left-0 bottom-0 h-[3px] bg-[#FF7700] hover:bg-[#FFF1E2]"
                style={{ transition: 'width 0.2s' }}
              />
            </div>
          </div>
        </div>
      </div>  
    </div> 
  );
}
