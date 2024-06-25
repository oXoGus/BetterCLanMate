import mysql.connector # type: ignore
from mysql.connector import Error, OperationalError # type: ignore
import requests
import json
import time
from random import randint
from dotenv import load_dotenv
import os
import traceback
from datetime import datetime

#on récupe les info du .env
load_dotenv()


#on se co a la db
conn = mysql.connector.connect(
    host=os.getenv('HOST'),
	user=os.getenv('USERr'),
	password=os.getenv('PASSWORD'),
	database=os.getenv('DATABASE'))

cur = conn.cursor()



searchClanHeader = {
    'authorization' : os.getenv('SEARCH_CLAN_HEADER')
}

searchPlayerHeader = searchClanHeader
try :
    while 1:
        try:
            random = randint(800, 832)
            try:
                url = f"https://api.clashofclans.com/v1/clans?locationId=32000087&limit={random}" 
                response = requests.get(url, headers=searchClanHeader, timeout=5) # envoie de la requete a l'API

                response.raise_for_status()
            except requests.exceptions.Timeout:
                print("La requête HTTP a expiré. on reéessaye dans 10 sec")
                time.sleep(10)
                        
                #on retente une requette
                response = requests.get(url, headers=searchClanHeader, timeout=5) # envoie de la requete a l'API                        
            except requests.exceptions.RequestException as e:
                print(f"Erreur de requête HTTP : {e}")
                
            clanJson = response.json() # on convertit la reponse au format JSON
            clanJson = json.dumps(clanJson) # convertit la reponse au format JSON
            clanJson = json.loads(clanJson) # convertit une chaîne de caractères JSON en une structure de données Python afin de pouvoir accéder et manipuler les données JSON 
            clanList = clanJson['items'] # on accedde juste a la liste 'items'
            count = 1
            for clans in clanList: # pour chaque element de la liste
                try:

                    print(f"({count}/{len(clanList)})", end='\r')

                    if clans['chatLanguage']['languageCode'] == "FR":
                        clanTag = {
                            'clanTag' : clans['tag'] # ID du clan
                        }
                        
                        cur.execute('SELECT id FROM clanFR WHERE id = %(clanTag)s', (clanTag))
                        clanResult = cur.fetchone()
                        if clanResult == None:
                            print(f"            {datetime.now()} -> {clans['name']}, {clans['tag']}, n'est pas dans la base de donnée                   ", end='\r') # log pour le terminal
                            cur.execute('INSERT INTO clanFR (id) VALUES (%(clanTag)s)', (clanTag)) # on ajoute le clan dans la base de donnée
                            conn.commit()
                        else:
                            #print(clans['name'], clans['tag'], "est déja dans la base de donnée ! Skipping..." )
                            pass
                    else:
                        #print('faux clanFR ! skipping...' )
                        pass

                    count += 1

                except KeyboardInterrupt:
                        print('reset')
                
                except Exception as e:
                    #print('faux clanFR ! skipping...' )
                    count += 1
        except OperationalError as e:
            print(f"Erreur opérationnelle (probablement une coupure de connexion) : {e}")
        except Error as e:
            print(f"Erreur de connexion : {e}")
except Exception as e:
    
    #debbug
    traceback.print_exc()
    
    #on ferme les connection a la db pour pas la surcharger
    cur.close()
    conn.close()

finally:
    cur.close()
    conn.close()