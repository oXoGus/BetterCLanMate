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


searchPlayerHeader1 = {
    'authorization' : os.getenv('SEARCH_PLAYER_HEADER_3')
}
while 1:
        time.sleep(1)
        cur.execute('SELECT id FROM joueursFR WHERE clanID IS NULL ORDER BY lastChecked ASC')
        playerList = cur.fetchall()
        
        if playerList == []:
            raise Exception('err')  
        else:     
            for player in playerList: # pour chaque clan
                try:

                    #print(player[0][1:])

                    playerId = {
                        'id' : player[0]
                    }

                    #requete des data du clan
                    try:
                        playerUrl = f'https://api.clashofclans.com/v1/players/%23{player[0][1:]}'
                        responsePlayer = requests.get(playerUrl, headers=searchPlayerHeader1, timeout=5)
                        
                        # Lève une exception pour les erreurs HTTP
                        responsePlayer.raise_for_status()
                    except requests.exceptions.Timeout:
                        try:
                            print("La requête HTTP a expiré. on reéessaye dans 10 sec")
                            time.sleep(10)
                            
                            #on retente une requette
                            responsePlayer = requests.get(playerUrl, headers=searchPlayerHeader1, timeout=5)
                            responsePlayer.raise_for_status()
                        except requests.exceptions.Timeout:
                            print("2 timeout")
                            continue
                        
                    except requests.exceptions.RequestException as e:
                        print(f"Erreur de requête HTTP : {e}")
                    
                    player = responsePlayer.json()
                    player = json.dumps(player)
                    player = json.loads(player)
                    

                    #on verif si le joueur n'existe pas dans la base de donnée
                    playerId = {
                        'id' : player['tag']
                    } 
                    
                    # on update les data du joueur 
                    # verifie le nombre de labels pour eviter les erreures
                    playerLabels = player['labels']
                    if len(playerLabels) == 3:
                        playerLabels1 = playerLabels[0]
                        playerLabels1 = playerLabels1['name']
                        playerLabels2 = playerLabels[1]
                        playerLabels2 = playerLabels2['name']
                        playerLabels3 = playerLabels[2]
                        playerLabels3 = playerLabels3['name']
                    elif len(playerLabels) == 2:
                        playerLabels1 = playerLabels[0]
                        playerLabels1 = playerLabels1['name']
                        playerLabels2 = playerLabels[1]
                        playerLabels2 = playerLabels2['name']
                        playerLabels3 = None
                    elif len(playerLabels) == 1:
                        playerLabels1 = playerLabels[0]
                        playerLabels1 = playerLabels1['name']
                        playerLabels2 = None
                        playerLabels3 = None 
                    else:
                        playerLabels1 = None
                        playerLabels2 = None
                        playerLabels3 = None 
                        
                    

                    try:
                        

                        player['clan'] #si le joueur est toujour dans un clan
                            
                        playerData = {
                            'id' : player['tag'],
                            'rate' : 0,
                            'hdv' : player['townHallLevel'],
                            'tr' : player['trophies'],
                            'xp' : player['expLevel'],
                            'donation' : player['achievements'][14]['value'],
                            'jdc' : player['achievements'][31]['value'],
                            'warStars' : player['warStars'],
                            'clanID' : player['clan']['tag'],
                            'label1' : playerLabels1,
                            'label2' : playerLabels2,
                            'label3' : playerLabels3,
                            'noClanDuration' : None
                        }
                            

                        # on met a jour les donnée               
                        cur.execute('UPDATE joueursFR SET id = %(id)s, rate = %(rate)s, hdv = %(hdv)s, tr = %(tr)s, xp = %(xp)s, donation = %(donation)s, jdc = %(jdc)s, warStars = %(warStars)s, clanID = %(clanID)s, noClanDuration = %(noClanDuration)s, label1 = %(label1)s, label2 = %(label2)s, label3 = %(label3)s, lastChecked = CURRENT_TIMESTAMP WHERE id = %(id)s', (playerData))
                        conn.commit()
                        #print(f"player {player['tag']} updated !")

                    except KeyError:
                        
                        #traceback.print_exc()

                        # si le joueur n'est plus dans un clan 
                        playerData = {
                            'id' : player['tag'],
                            'rate' : 0,
                            'hdv' : player['townHallLevel'],
                            'tr' : player['trophies'],
                            'xp' : player['expLevel'],
                            'donation' : player['achievements'][14]['value'],
                            'jdc' : player['achievements'][31]['value'],
                            'warStars' : player['warStars'],
                            'clanID' : None,
                            'label1' : playerLabels1,
                            'label2' : playerLabels2,
                            'label3' : playerLabels3, 
                            'noClanDuration' : None
                        }

                        # si le joueur n'est pas inactif
                        if player["attackWins"] != 0 :

                            #print(playerData)

                            # on met a jour les donnée               
                            cur.execute('UPDATE joueursFR SET id = %(id)s, rate = %(rate)s, hdv = %(hdv)s, tr = %(tr)s, xp = %(xp)s, donation = %(donation)s, jdc = %(jdc)s, warStars = %(warStars)s, clanID = %(clanID)s, noClanDuration = CURRENT_TIMESTAMP, label1 = %(label1)s, label2 = %(label2)s, label3 = %(label3)s, lastChecked = CURRENT_TIMESTAMP WHERE id = %(id)s', (playerData))
                            conn.commit()
            
                            #print(f"player {player['tag']} n'a pas de clan !")
                        else :
                             # on lui met un faux clan comme ca il est pas recommandé            
                            cur.execute("UPDATE joueursFR SET clanID = 'inactif', noClanDuration = %(noClanDuration)s ,lastChecked = CURRENT_TIMESTAMP WHERE id = %(id)s", (playerData))
                            conn.commit()

                except Exception:
                    traceback.print_exc() # on affiche les erreur