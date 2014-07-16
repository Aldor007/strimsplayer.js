# strimsplayer

Module | Status
--- | --- | ---
**Status** | w trakcie prac
**Global Version** | 0.0.1
**Website** |  [strimsplayer.pl/](http://strimsplayer.pl/)
**Strims** | [strims.pl/s/strimsplayer](http://strims.pl/s/strimsplayer)
---
# Instalacja zależności
```bash
sudo apt-get install nodejs
sudo apt-get install mysql-server
sudo apt-get install redis-server
sudo npm install -g bower
sudo npm install -g jasmine-node@1.14.2
```
lub
```bash
./install.sh
```
# Konfiguracja 

Aplikacja do działania potrzebuje bazy danych. Baza może być plikowa lub MySQL. 
Konfiguracja bazy znajduje się w pliku config/connections.js a sam wybór rodzaju bazy w config/models.js,

### Baza plikowa
Aby aplikacja korzystała z bazy plikowej należy zmodyfikować pliki config/models.js w następujący sposób
```javascript
  connection: 'localDiskDb'
```
Baza plikow jest najwygodniejsza w dewelopowaniu.
### Baza MySQL
Aby aplikacja działał z bazą MySQL należy ustawić w envie dane do polączenie do bazy.
```
export MYSQL_USER='test'
export MYSQL_DB='strimsplayer'
export MYSQL_PASSWORD='tajne'
```
Zeby nie wpisywać informacji o połaczeniu za każdym razem dobrze jest napiać je w skrypcie:
```bash
export MYSQL_USER='test'
export MYSQL_DB='strimsplayer'
export MYSQL_PASSWORD='tajne'
node app.js
```
#Testy
Uruchomienie testów
```bash
jasmine-node --verbose tests/
```
Pokrycie kodu testami
```bash
sudo npm install -g istanbul
istanbul cover jasmine-node --verbose tests
istanbul report # generowanie html-a w coverage/lcov-report
```

a [Sails](http://sailsjs.org) application
