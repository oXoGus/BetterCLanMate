"use client";


import axios from "axios";
import { useEffect, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import HighlightedText from "../components/HighlightedText";
import Image from "next/image"
import './animation.css';
import UnderlineText from "../components/UnderlineText";
import SemiHighlightedText from "../components/SemiHighlightedText";



export default function Home() {
  
  const spanRef = useRef(null);
  const underlineRef = useRef(null);


  const [playerInvitedByPass, setPlayerInvitedByPass] =useState(false)
  const [markPlayerInvited, setMarkPlayerInvited] = useState(false)
  const [blackListedLoading, setBlackListedLoading] = useState(false)
  const [blackListPlayer, setBlackListPlayer] = useState(false)
  const [blackListed, setBlackListed] = useState(false)
  const [blackListByPass, setBlackListByPass] = useState(false)
  const [clanTag, setClanTag] = useState("#2Q8G0LPU0");
  const [playerDataReceive , setPlayerDataReceive] = useState(null);
  const [playerDataError, setPlayerDataError] = useState(false)
  const [searchNewPlayer, setSearchNewPlayer] = useState(false)
  const [loading, setLoading] = useState(false)
  const [playerData , setPlayerData] = useState(null);
  const [noPlayerMatch, setNoPlayerMatch] = useState(false)
  const [apiError, setApiError] = useState(false)
  const [errorBadClanTag, setErrorBadClanTag] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [byPass, setByPass] = useState(false)

  // les useState pour les stats du joueurs
  const [id, setId] = useState(null);
  const [hdv, setHdv] = useState(null);
  const [townHallWeaponLevel, setTownHallWeaponLevel] = useState(null);
  const [userName, setUserName] = useState(null);
  const [tr, setTr] = useState(null);
  const [xp, setXp] = useState(null);
  const [atk, setAtk] = useState(null);
  const [atkRate, setAtkRate] = useState(null)
  const [jdc, setJdc] = useState(null);
  const [warStars, setWarStars] = useState(null);
  const [noClanDuration, setNoClanDuration] = useState();
  const [heros, setHeros] = useState(null);
  const [troops, setTroops] = useState(null);
  const [spell, setSpell] = useState(null);
  const [pets, setPets] =useState();
  const [siegeEngine, setSiegeEngine] = useState();

  const onClanTagChange = (event) => {
    setClanTag(event.target.value);
  }

  const changeDarkMode = () => {

    // on inverse la valeur du dark mode
    setDarkMode(!darkMode)
  }


  /* on met la largeur du soulignement a la largeur du spam (du text) dès que le text change  */
  useEffect(() => {
    if (spanRef.current && underlineRef.current && spanRef.current.offsetWidth < 210) {
      underlineRef.current.style.width = `${spanRef.current.offsetWidth}px`;
    }
  }, [clanTag]);

  /*********  searchPlayer without clan data fetching *********/ 


  const searchPlayer = () => {
    setLoading(true)
    setApiError(false)
    setErrorBadClanTag(false)
    setNoPlayerMatch(false)
    // on demande a l'api de chercher les joueurs sans clan qui correspondent au prérequis du clanTag
    axios.get(`${window.location.origin}/api/get/searchPlayerWithNoClan/${clanTag.slice(1)}`, { timeout: 10000 })
      .then((response) => {
        // on reset les err
        setApiError(false)
        setErrorBadClanTag(false)
        setNoPlayerMatch(false)

        console.log(response.data[0]);
        setPlayerData(response.data);

      })
      .catch((error) => {
        setLoading(false)
        //console.log(error);

        if (error.response) {
          // si le tag n'est pas bon
          if (error.response.status === 422) {
            setErrorBadClanTag(true);
            setNoPlayerMatch(false);
          }
          // si aucun joueur n'est trouvé 
          else if (error.response.status === 403) {
            setNoPlayerMatch(true);
            setErrorBadClanTag(false);
          }
          // si il y a une erreur de la api 
          else {
            setApiError(true);
            setErrorBadClanTag(false);
            setNoPlayerMatch(false);
          }
        } else {
          // Si error.response est undefined
          setApiError(false);
          setErrorBadClanTag(false);
          setNoPlayerMatch(false);
        }
      });

  }



  useEffect(() => {
    if (byPass){
      searchPlayer()
    }
  }, [searchNewPlayer])


  // on prend les data du joueur les on les stock 
  useEffect(() => {
    // si playerData a ete mis a jours a cause de l'async de la requette a l'api qui faisait tout buggé
    if (playerData) {
      const now = new Date();


      setId(playerData[0].tag);
      setUserName(playerData[0].name)
      setHdv(playerData[0].townHallLevel);
      setTr(playerData[0].trophies);
      setXp(playerData[0].expLevel);


      // si le joueur a un townHallWeaponLevel alors on le save
      if (playerData[0].townHallLevel >= 12) {
        setTownHallWeaponLevel(playerData[0].townHallWeaponLevel);
      }

    // on calcule de nb d'attaque par jour en prennant 
      
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const daysToAtk = Math.floor((now - firstDayOfMonth) / (1000 * 60 * 60 * 24));

      setAtk(playerData[0].attackWins);


      // on arrondi a 10^-1
      setAtkRate((playerData[0].attackWins/daysToAtk).toFixed(1))

      setJdc(playerData[0].achievements[31].value)
      setWarStars(playerData[0].warStars)

      // on convertie le timestamp en forma lisible 

      // on convertie en date
      const date = new Date(playerData[1].noClanDuration);
      
      const diffMs = now - date; // Différence en millisecondes

      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSeconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      let timeAgo = '';

      if (diffDays > 0) {
        timeAgo = `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
      } else if (diffHours > 0) {
        timeAgo = `${diffHours} heure${diffHours > 1 ? 's' : ''}`;
      } else if (diffMinutes > 0) {
        timeAgo = `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''}`;
      } else {
        timeAgo = `${diffSeconds} seconde${diffSeconds > 1 ? 's' : ''}`;
      }


      setNoClanDuration(timeAgo)
      
      // TODO : faire le labo + labels + heros


      setPlayerDataReceive(true)
    }
  }, [playerData]);

  const onButtonForSearchPlayerClick = () => {
    
    // on change la valeur de searchPlayer pour envoyer la requette a l'api avec le useEffect qui s'execute a chaque fois que searchNewPlayer change de valeur
    setSearchNewPlayer(!searchNewPlayer)
    if (!byPass){
      setByPass(true)
    }
    
  }


  /*********  black list player *********/ 

  const onButtonForBlackListPlayerClick = () => {
    // on change l'état pour trigger le useEffect
    
    setBlackListPlayer(!blackListPlayer)
    console.log(blackListPlayer)
    if (!blackListByPass){
      setBlackListByPass(true)
    }
  }

  useEffect(() => {
    if (blackListByPass){
      blackListNewPlayer()
    }
  }, [blackListPlayer])

  const blackListNewPlayer = () => {
    setBlackListedLoading(true)
    const data = {
      id: id
    }
    axios.put(`${window.location.origin}/api/put/blackListPlayerWithNoClan/`, data)
      .then((response) => {
        setBlackListedLoading(false)
        setBlackListed(true)

        // on recherche un nouveau joueur
        searchPlayer()

        setBlackListed(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }


  /*********  mark player invited *********/ 

  const onButtonForMarkPlayerInvitedClick = () => {
    // on change l'état pour trigger le useEffect
    
    setMarkPlayerInvited(!markPlayerInvited)
    console.log(markPlayerInvited)
    if (!playerInvitedByPass){
      setPlayerInvitedByPass(true)
    }
  }

  useEffect(() => {
    if (playerInvitedByPass){
      console.log(playerInvitedByPass)
      markNewPlayerInvited()
    }
  }, [markPlayerInvited])

  const markNewPlayerInvited = () => {
    const data = {
      id: id
    }
    axios.put(`${window.location.origin}/api/put/markPlayerChecked`, data)
      .then((response) => {
        // on recherche un nouveau joueur
        searchPlayer()
      })
      .catch((error) => {
        console.log(error)
      })
  }

   /*   */
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="fixed inset-0 w-full bg-[#FFF1E2] text-black dark:text-white dark:bg-gray-800">
        <div className="dark:text-gray-100 text-gray-900 sm:text-5xl md:text-4xl p-3 flex justify-between">
            <div>
              <a className="font-semibold" href="/"><UnderlineText text={"BetterClanMate"} color={'#FF7700'} customHeight={"7px"}/></a>
            </div>
            <button className="bg-neutral-900 dark:bg-white rounded text-white text-xl dark:text-black font-semibold p-1" onClick={changeDarkMode}>
            {darkMode ? "mode clair" : "mode sombre"}
          </button>
        </div>
        {/*  partie dynamique  */}
        {/*  tant qu'on a pas reçus les données du joueur  */}
        

        {
          playerDataReceive ? 
          <div className="">
            <div className="bg-white m-5 rounded-2xl p-3">
              <div className="flex justify-between">
              <div className="relative w-[167px] h-[183px]">
                  <Image src={townHallWeaponLevel ? `/img/hdv${hdv}-${townHallWeaponLevel}.png` : `/img/hdv${hdv}.png` } layout="fill" objectFit="cover" alt="hdv" className="z-0" loading="lazy"/>
                  <p className=" absolute inset-0 text-2xl mb-4"><HighlightedText text={userName} color={'#FF7700'} customHeight={"35px"}/></p>
                </div>
                <p className="text-xl font-bold">détecté sans clan depuis : {noClanDuration}</p>
              </div>
              <div className="flex">
                
                <div className="flex items-center m-5">
                  <img src="/img/xp.png" className="h-[25px]"/>
                  <p className="m-1"><SemiHighlightedText text={`${xp}`} color={'#FF7700'} customHeight={"7px"}/></p>
                </div>

                <div className="flex items-center m-5">
                  <p className="m-1"><SemiHighlightedText text={`${tr}`} color={'#FF7700'} customHeight={"7px"}/></p>
                  <img src="/img/tr.png" className="h-[25px]"/>
                </div>
                
                <p className="m-2"><SemiHighlightedText text={atk > 1 ? `${atk} attaques` : `${atk} attaque`} color={'#FF7700'} customHeight={"7px"}/></p>
                <p className="m-2">{atkRate} attaques/jours</p>
                <p className="m-2">{warStars} étoiles gagnées en gdc</p>
              </div>
              <div className="flex justify-between m-10">
                <button className=" dark:text-white text-black bg-red-500 hover:bg-red-600 font-semibold py-2 px-4 rounded" onClick={onButtonForBlackListPlayerClick}>pas de ca dans mon clan</button>
                <a className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white text-black bg-slate-200 hover:bg-slate-300 font-bold py-2 px-4 rounded" href={`https://link.clashofclans.com/?action=OpenPlayerProfile&tag=%23${id.slice(1)}`} >voir sur le jeu</a>
                <button className=" dark:text-white text-black bg-green-500 hover:bg-green-600 font-semibold py-2 px-4 rounded" onClick={onButtonForMarkPlayerInvitedClick}>c'est invité, au suivant !</button>
              </div>
            </div>
          </div>

          :

          <div className=" dark:text-white flex">
            <div className="flex items-start flex-col p-3 space-y-2 mt-20 ml-auto mr-auto">
              <span className="relative font-semibold text-1xl">entrez <HighlightedText text={'le tag de votre clan'} color={'#FF7700'} customHeight={"25px"}/>.</span>
              <div className="relative inline-block">
                <input
                  className="border-0 bg-inherit w-[205px] focus:outline-none focus:ring-0 "
                  placeholder="#..."
                  type="text"
                  name="clanTag"
                  spellCheck="false"
                  value={clanTag}
                  onChange={onClanTagChange}
                  style={{ paddingBottom: '1px' }} // Ajoute un peu d'espace pour le soulignement
                />
                <span
                  ref={spanRef}
                  className="absolute top-0 left-0 invisible whitespace-pre"
                  style={{ fontFamily: 'inherit', fontSize: 'inherit' }}
                >
                  {clanTag || "#..."}
                </span>
                <div
                  ref={underlineRef}
                  className="absolute left-0 bottom-0 h-[3px] bg-[#FF7700] hover:bg-[#FFF1E2]"
                  style={{ transition: 'width 0.2s' }}
                />
              </div>
              <div>
                <button className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white text-black bg-[#FF7700] hover:bg-[#FFF1E2] font-semibold " onClick={onButtonForSearchPlayerClick}>{loading ? "..." : "trouve moi des joueurs"}</button>
              </div>
              {errorBadClanTag && <p className="text-red-600 font-bold error">tag du clan invalide !</p> }
              {noPlayerMatch && <p className="text-red-600 font-bold error">aucun joueur trouvé, réessayez plus tard</p> }
              {apiError && <p className="text-red-600 font-bold error">réessayez plus tard</p> }
            </div>
          </div>
        }
      </div>
      
      
      
  </div>  
  );
}
