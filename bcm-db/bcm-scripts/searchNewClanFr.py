import mysql.connector 
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
        url = f"https://api.clashofclans.com/v1/clans?locationId=32000087&limit={randint(500, 1000)}" 
        response = requests.get(url, headers=searchClanHeader) # envoie de la requete a l'API
        clanJson = response.json() # on convertit la reponse au format JSON
        clanJson = json.dumps(clanJson) # convertit la reponse au format JSON
        clanJson = json.loads(clanJson) # convertit une chaîne de caractères JSON en une structure de données Python afin de pouvoir accéder et manipuler les données JSON 
        clanList = clanJson['items'] # on accedde juste a la liste 'items'
        for clans in clanList: # pour chaque element de la liste
            try:
                if clans['chatLanguage']['languageCode'] == "FR":
                    clanTag = {
                        'clanTag' : clans['tag'] # ID du clan
                    }
                    
                    cur.execute('SELECT id FROM clanFR WHERE id = %(clanTag)s', (clanTag))
                    clanResult = cur.fetchone()
                    if clanResult == None:
                        print(f"{datetime.now()} -> {clans['name']}, {clans['tag']}, n'est pas dans la base de donnée" ) # log pour le terminal
                        cur.execute('INSERT INTO clanFR (id) VALUES (%(clanTag)s)', (clanTag)) # on ajoute le clan dans la base de donnée
                        conn.commit()
                    else:
                        #print(clans['name'], clans['tag'], "est déja dans la base de donnée ! Skipping..." )
                        pass
                else:
                    #print('faux clanFR ! skipping...' )
                    pass
            except KeyboardInterrupt:
                    print('reset')
            
            except Exception as e:
                #print('faux clanFR ! skipping...' )
                pass
except Exception as e:
    
    #debbug
    traceback.print_exc()
    
    #on ferme les connection a la db pour pas la surcharger
    cur.close()
    conn.close()

finally:
    cur.close()
    conn.close()