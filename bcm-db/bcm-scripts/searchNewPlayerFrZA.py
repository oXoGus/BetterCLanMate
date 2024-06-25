import mysql.connector # type: ignore
import requests
import json
import time
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
    'authorization' : os.getenv('SEARCH_PLAYER_HEADER_2')
}

while 1:
        
        #on récup les 20 premiers clans par ordre alphabétique Z-A qui n'ont pas encore ete check dans la db 
        cur.execute('SELECT id FROM clanFR WHERE lastChecked IS NULL ORDER BY id DESC LIMIT 20')
        clanResult = cur.fetchall()
        
        if clanResult == []:
            raise Exception('No more clan no checked !')  
        else:     
            for clan in clanResult: # pour chaque clan
                try:

                    print(clan[0][1:])

                    clanData = {
                        'id' : clan[0]
                    }

                    #requete des data du clan
                    try:
                        urlClan = f'https://api.clashofclans.com/v1/clans/%23{clan[0][1:]}'
                        responseClan = requests.get(urlClan, headers=searchPlayerHeader1, timeout=5)
                        
                        # Lève une exception pour les erreurs HTTP
                        responseClan.raise_for_status()
                    except requests.exceptions.Timeout:
                        print("La requête HTTP a expiré. on reéessaye dans 10 sec")
                        time.sleep(10)
                        
                        #on retente une requette
                        responseClan = requests.get(urlClan, headers=searchPlayerHeader1, timeout=5)
                        
                    except requests.exceptions.RequestException as e:
                        print(f"Erreur de requête HTTP : {e}")

                    clan = responseClan.json()
                    clan = json.dumps(clan)
                    clan = json.loads(clan)
                    for member in clan['memberList']: # pour chaque membre du clan
                        try:

                            # try pour éviter les blocages due aux timeout 
                            try:
                                #on fait la requette pour tout les joueurs de la db
                                memberUrl = f'https://api.clashofclans.com/v1/players/%23{member["tag"][1:]}'
                                responseMember = requests.get(memberUrl, headers=searchPlayerHeader1, timeout=5)

                                # Lève une exception pour les erreurs HTTP
                                responseMember.raise_for_status()
                            except requests.exceptions.Timeout:
                                print("La requête HTTP a expiré. on reéessaye dans 10 sec")
                                time.sleep(10)
                        
                                #on retente une requett
                                responseMember = requests.get(memberUrl, headers=searchPlayerHeader1, timeout=5)

                            except requests.exceptions.RequestException as e:
                                print(f"Erreur de requête HTTP : {e}")
                            
                            member = responseMember.json()
                            member = json.dumps(member)
                            member = json.loads(member)


                            #on verif si le joueur n'existe pas dans la base de donnée
                            playerId = {
                                'id' : member['tag']
                            } 
                            cur.execute('SELECT id FROM joueursFR WHERE id = %(id)s', (playerId))  
                            resultat = cur.fetchone() # on recupere les données

                            if resultat == None: # si il n'y a pas deja le ce clan dans la base de donnée 

                                # verifie le nombre de labels pour eviter les erreures
                                playerLabels = member['labels']
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

                                playerData = {
                                    'id' : member['tag'],
                                    'rate' : 0,
                                    'hdv' : member['townHallLevel'],
                                    'tr' : member['trophies'],
                                    'xp' : member['expLevel'],
                                    'donation' : member['achievements'][14]['value'],
                                    'jdc' : member['achievements'][31]['value'],
                                    'warStars' : member['warStars'],
                                    'clanID' : member['clan']['tag'],
                                    'noClanDuration' : None,
                                    'label1' : playerLabels1,
                                    'label2' : playerLabels2,
                                    'label3' : playerLabels3
                                }
                                # on execute la requete sql pour ajouter un ligne avec toutes les data                
                                cur.execute('INSERT INTO joueursFR (id, rate, hdv, tr, xp, donation, jdc, warStars, clanID, noClanDuration, label1, label2, label3, lastChecked) VALUES (%(id)s, %(rate)s, %(hdv)s, %(tr)s, %(xp)s, %(donation)s, %(jdc)s, %(warStars)s, %(clanID)s, %(noClanDuration)s, %(label1)s, %(label2)s, %(label3)s, CURRENT_TIMESTAMP)', (playerData)) # on place toutes les donné dans la base de donnée
                                # on affiche les data pour les log
                                conn.commit() # on enregistre les modification de la data base 
                                print(f"player {member['tag']} inserted !")


                            else: # si le tag du joueur existe deja dans la base de donnée , on update toutes les data
                                # verifie le nombre de labels pour eviter les erreures
                                playerLabels = member['labels']
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

                                playerData = {
                                    'id' : member['tag'],
                                    'rate' : 0,
                                    'hdv' : member['townHallLevel'],
                                    'tr' : member['trophies'],
                                    'xp' : member['expLevel'],
                                    'donation' : member['achievements'][14]['value'],
                                    'jdc' : member['achievements'][31]['value'],
                                    'warStars' : member['warStars'],
                                    'clanID' : member['clan']['tag'],
                                    'noClanDuration' : None,
                                    'label1' : playerLabels1,
                                    'label2' : playerLabels2,
                                    'label3' : playerLabels3
                                }

                                # on met a jour les donnée de la ligne qui verifie la condition               
                                cur.execute('UPDATE joueursFR SET id = %(id)s, rate = %(rate)s, hdv = %(hdv)s, tr = %(tr)s, xp = %(xp)s, donation = %(donation)s, jdc = %(jdc)s, warStars = %(warStars)s, clanID = %(clanID)s, noClanDuration = %(noClanDuration)s, label1 = %(label1)s, label2 = %(label2)s, label3 = %(label3)s, lastChecked = CURRENT_TIMESTAMP WHERE id = %(id)s', (playerData))
                                conn.commit()
                                print(f"player {member['tag']} updated !")
                        except KeyboardInterrupt:
                            print('reset')
                        except Exception:
                            traceback.print_exc() # on affiche les erreur

                    #on marque la date du check un fois que tout les joueurs sont mis dans la db
                    cur.execute('UPDATE clanFR SET lastChecked = CURRENT_TIMESTAMP WHERE id = %(id)s', (clanData))
                    conn.commit()
                    print(f"clan {clan['tag']} checked !")

                except KeyboardInterrupt:
                    print('reset')
                except Exception:
                    traceback.print_exc() # on affiche les erreur