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
  const [windowHeight, setWindowHeight] =useState(null);
  const [profileChecked, setProfileChecked] = useState(false)

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

  // les couleur 
  const red = 230;
  const green = 196; 
  const xpBornMin = [0, 5, 10, 10, 15, 20, 30, 50, 65, 75, 100, 140, 160, 180, 200, 220]
  const xpBornMax = [10, 20, 25, 25, 35, 45, 55, 70, 90, 110, 140, 160, 180, 200, 220, 240]
  const [xpColor, setXpColor] = useState(null);
  const [trColor, setTrColor] = useState(null);
  const [atkRateColor, setAtkRateColor] = useState(null);
  const [warStarsColor, setWarStarsColor] = useState(null);
  const [profileColor, setProfileColor] = useState(null);

  const checkProfile = () => {
    setProfileChecked(true);
  }

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

  useEffect(() => {
    setWindowHeight(window.innerHeight)
  }, [window.innerHeight])

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

  function rgbToHex(r, g, b) {
    // Convertit une valeur en hexadécimal et assure qu'elle est sur deux chiffres
    const toHex = (value) => {
      const hex = value.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
  
    // Concatène les valeurs hexadécimales
    return '#' + toHex(r) + toHex(g) + toHex(b);
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



      // calcule des couleur 
      
      // pour l'xp sour un certain seuil dans le liste xpBorneMin selon l'hdv on met la couleur rouge 
      // pareil avec la couleur verte avec la liste xpBorneMax 
      // et quand c'est entre les deux on fait un dégradé entre le rouge et le vert qui dépend du rate 
      
      if (playerData[0].expLevel > xpBornMax[playerData[0].townHallLevel - 1]){
        setXpColor(rgbToHex(0, green, 0)) // max green 
      }
      else if (playerData[0].expLevel < xpBornMin[playerData[0].townHallLevel - 1]){
        setXpColor(rgbToHex(red, 0, 0)) // max red
      }
      else {

        // le rate est le raport entre le nombre de niveau que le joueur doit gagner pour avoir la couleur verte max (la borne max) sur le nombre de niveau entre la couleur rouge et le vert max 
        let rate = (1 / (xpBornMax[playerData[0].townHallLevel - 1] - xpBornMin[playerData[0].townHallLevel - 1]) * (playerData[0].expLevel - xpBornMin[playerData[0].townHallLevel - 1]));
        
        // équation de droite pour avoir la coposante rouge et verte du dégradé selon le rate qui est entre 0 et 1 
        var rXp = parseInt(red - red * rate);
        var gXp = parseInt(green * rate);
        setXpColor(rgbToHex(rXp, gXp, 0))
        //console.log(`rate : ${rate}, r : ${r}, g : ${g}`)
      }
      
      //pour la couleur des tr c'est comme pour l'xp
      if (playerData[0].trophies >= 5000){
        setTrColor(rgbToHex(0, green, 0));
      }
      else {
        let rate = (1 / (5000 - playerData[2].requiredTrophies) * (playerData[0].trophies - playerData[2].requiredTrophies))

        var rTr = parseInt(red - red * rate);
        var gTr = parseInt(green * rate);

        setTrColor(rgbToHex(rTr, gTr , 0));
      }


      // on calcule de nb d'attaque par jour en prennant comme ref le 1er jour du mois 
      
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      const daysToAtk = Math.floor((now - firstDayOfMonth) / (1000 * 60 * 60 * 24));

      setAtk(playerData[0].attackWins);

      let _atkRate = (playerData[0].attackWins/daysToAtk).toFixed(1)
      // on arrondi a 10^-1
      setAtkRate(_atkRate)

      // pour l'atkRateColor
      if (_atkRate >= 1 ) {
        setAtkRateColor(rgbToHex(0, green, 0));
      }
      else {
        var rAtkRate = parseInt(red - red * _atkRate);
        var gAtkRate = parseInt(green * _atkRate);

        setAtkRateColor(rgbToHex(rAtkRate, gAtkRate, 0));
      }


      setJdc(playerData[0].achievements[31].value)
      setWarStars(playerData[0].warStars)

      // pour les etoiles de gdc  
      if (playerData[0].warStars > 1500){
        setWarStarsColor(rgbToHex(0, green, 0));
      }
      else {
        let rate = 1 / 1500 * playerData[0].warStars;

        var rWarStars = parseInt(red - red * rate);
        var gWarStars = parseInt(green * rate);

        setWarStarsColor(rgbToHex(rWarStars, gWarStars, 0));
      }

      // la couleur moyenne du profile
      var rMoy = parseInt((rXp + rTr + rAtkRate + rWarStars) / 4);
      var gMoy = parseInt((gXp + gTr + gAtkRate + gWarStars) / 4);

      console.log(`rXp : ${rXp}, rTr : ${rTr}, rAtkRate : ${rAtkRate}, rWarStars : ${rWarStars}`)
      console.log(`rMoy : ${rMoy}, gMoy : ${gMoy} `)

      setProfileColor(rgbToHex(rMoy, gMoy, 0));

      // si le joueur a un townHallWeaponLevel alors on le save
      if (playerData[0].townHallLevel >= 12) {
        setTownHallWeaponLevel(playerData[0].townHallWeaponLevel);
      }

    

      

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
    setProfileChecked(false)
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
      <div className="absolute  lg:h-full md:h-auto w-full bg-[#FFF1E2] text-black dark:text-white dark:bg-gray-800">
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
                    <img src={townHallWeaponLevel ? `/img/hdv${hdv}-${townHallWeaponLevel}.png` : `/img/hdv${hdv}.png` } className="z-0 h-full w-full" loading="lazy"/>
                    <p className=" absolute inset-0 text-2xl mb-4"><HighlightedText text={userName} color={'#FF7700'} customHeight={"35px"}/></p>
                  </div>
                  <div className="flex flex-wrap justify-between mt-10">
                    <div className="flex items-center m-3">
                      <img src="/img/xp.png" className="h-[25px]"/>
                      <SemiHighlightedText text={`${xp}`} color={xpColor} customHeight={"7px"}/>
                    </div>

                    <div className="flex items-center m-3">
                      <SemiHighlightedText text={`${tr}`} color={trColor} customHeight={"7px"}/>
                      <img src="/img/tr.png" className="h-[25px]"/>
                    </div>
                    
                    <div className="flex items-center m-3">
                      <SemiHighlightedText text={atk > 1 ? `${atk}⚔ attaques` : `${atk}⚔ attaque`} color={atkRateColor} customHeight={"7px"}/>
                    </div>
                    
                    <div className="flex items-center m-3">
                      <SemiHighlightedText text={`${atkRate} attaques/jours`} color={atkRateColor} customHeight={"7px"}/>
                    </div>

                    <div className="flex items-center m-3">
                      <SemiHighlightedText text={`${warStars} étoiles gagnées en gdc`} color={warStarsColor} customHeight={"7px"}/>
                    </div>
                    
                  </div>
                  <p className="ml-auto text-right text-xl font-bold">détecté sans clan depuis : {noClanDuration}</p>
                </div>
              
              <div className="flex justify-between mt-10 mb-2 ml-5 mr-5">
                <button className="font-semibold flex items-center p-2" onClick={onButtonForBlackListPlayerClick}>
                  <img src="/img/x.png" className="h-[37px] mr-2" loading="lazy"/>
                  <SemiHighlightedText text={"pas de ça dans mon clan"} customHeight={"5px"} color={"#E60000"}/>
                </button>
                { !profileChecked &&
                  <a className= "dark:text-white text-black font-bold flex items-center p-2" href={`https://link.clashofclans.com/?action=OpenPlayerProfile&tag=%23${id.slice(1)}`} onClick={checkProfile} >
                    
                    <SemiHighlightedText text={"voir sur le jeu"} color={"#e2e8f0"} customHeight={"5px"}/>
                    <img src="/img/info.png" className="h-[37px] ml-2" loading="lazy"/>
                    </a>
                }
                {profileChecked && 
                  <button className="dark:text-white text-black font-semibold flex items-center p-2 " onClick={onButtonForMarkPlayerInvitedClick}>
                    <SemiHighlightedText text={"c'est invité, au suivant !"} color={"#00C400"} customHeight={"5px"}/>
                    <img src="/img/checkMark.png" classname="h-[37px] ml-2" loading="lazy"/>
                  </button>
                }
              </div>
            </div>
          </div>

          :

          <div className={`dark:text-white flex h-[654px]`}>
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
                  style={{ paddingBottom: '1px' }} // on ajoute un peu d'espace pour le soulignement
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
