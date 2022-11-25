

var today = new Date();
var dd = today.getDate(); //haetaan päivä. Lähde: https://www.w3schools.com/jsref/jsref_getdate.asp
var mm = today.getMonth() + 1; //Haetaan kuukausi, javascriptissä tammikuu on 0, siitä + 1. 
var yyyy = today.getFullYear();
if(dd < 10) {
    dd = '0' + dd //päivämäärän esittämistavan muotoilu. 
}
if(mm < 10) {
    mm = '0' + mm
}
today = dd + '.' + mm + '.' + yyyy; //päivämäärän esitysmuoto, jota käytetään myös Finnkinon XML-tiedostojen linkkien nimissä. 

document.getElementById('addDate').innerHTML= "Ohjelmistossa " + today; //lisätään elementtiin 'addDate'

document.getElementById('helsinkiArea').addEventListener('click', helsinki); //Kuuntelijat 
document.getElementById('espooArea').addEventListener('click', espoo);
document.getElementById('vantaaArea').addEventListener('click', vantaa);


function helsinki(){ // Jokaisella kapungilla on oma funtio, joka välittää tietoja parametreinä ja kutsuu sitten valitseTeateri -funktiota
  var url = 'https://www.finnkino.fi/xml/TheatreAreas/'
  var tagName = 'Name'
  var cityName = 'Helsinki:'
  valitseTeatteri(url, tagName, cityName);
}
function espoo(){
  var url = 'https://www.finnkino.fi/xml/TheatreAreas/'
  var tagName = 'Name'
  var cityName = 'Espoo:'
  valitseTeatteri(url, tagName, cityName);
  
}
function vantaa(){
  var url = 'https://www.finnkino.fi/xml/TheatreAreas/'
  var tagName = 'Name'
  var cityName = 'Vantaa'
  valitseTeatteri(url, tagName, cityName)
}
function muuSuomi(){
    var url = 'https://www.finnkino.fi/xml/TheatreAreas/'
    var tagName = 'Name'
    var cityName = 'Vantaa'
  valitseTeatteri(url, tagName, cityName)


}


document.getElementById('pudotusvalikko').addEventListener('click', pudotusvalikko); // Pudotuvalikon kuuntelija

function pudotusvalikko() { // Funktio on toteutettu W3Schoolin mallin mukaan: https://www.w3schools.com/howto/howto_js_dropdown.asp
  document.getElementById("myDropdown").classList.toggle("show");
  }

  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      var i;
      for (i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
}

//------------------------------------------------------------------------------------------------------------------------------------
// LUODAAN TEATTEREIDEN VALIKKONAPPULAT PARAMETRIEN MUKAAN (xml-url, tag name xml -hakua varten ja kaupungin nimi IF-rakennetta varten)
//------------------------------------------------------------------------------------------------------------------------------------

function valitseTeatteri(url, tagName, cityName){

var xmlhttp = new XMLHttpRequest(); // lähetetään http -pyyntö. (XMLHttpRequest-olio). Tämän pohjalla käytetty kurssimateriaalia ja demoja. 
 xmlhttp.open("GET", url, true);
 xmlhttp.send();

 xmlhttp.onreadystatechange = function() {

if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

  let xml = xmlhttp.responseXML;
  let x = xml.getElementsByTagName(tagName);
  let id = xml.getElementsByTagName('ID');
    
    var sijainti = document.getElementById('ikkuna');
    sijainti.innerHTML = ""; //tyhjennetään elementin sisältö, jotta toimii oikein, kun funtiota kutsutaan uudelleen. 
    sijainti.appendChild(document.createTextNode('Valitse teatteri:'));
    sijainti.appendChild(document.createElement("br"));

for(i = 0; i < x.length; i++) {
  let kaupungit = x[i].innerHTML
  if (kaupungit.includes(cityName)){ // jos taulukosta löytyy parametrillä saatu kaupungin nimi (esim. Helsinki:), luodaan uusi button. 
    var idd = id[i].childNodes[0].nodeValue;
   
    createButton(idd); // Luodaan button dynaamisesti onclick -toiminnaallisuudella. Lähteenä: https://stackoverflow.com/questions/7066191/javascript-onclick-onsubmit-for-dynamically-created-button
    function createButton(idd) {

            var btn = document.createElement("BUTTON");
            btn.innerHTML = x[i].childNodes[0].nodeValue; //haetaan tekstiksi arvo taulukosta
           
            btn.setAttribute("id", "butt");
            document.body.appendChild(btn);
            sijainti.appendChild(btn);
        
            btn.onclick = function() {
                lataaElokuvat(idd); // toiminnallisuus oli lisättävä anonyymiin functioon. Jos sen laittoi menetelmällä "setAttribute", javascript ajoi funktiot väkisin ja aiheutti kaaosta. 
                console.log(idd); // addEventlistner ei myöskään toimi, sillä buttonit luodaan vain jos funktiota on kutsuttu. 
            };
        }
      }
    }
    }
  }
}
//------------------------------------------------------------------------------------------------------------------
// HAETAAN ELOKUVIEN TIEDOT XML -TIEDOSTOISTA ID:N JA PÄIVÄMÄÄRÄN MUKAAN JA LUODAAN NIILLE SIISTI ESITYSTAPA
//------------------------------------------------------------------------------------------------------------------

function lataaElokuvat(idd){
    
    var url = "https://www.finnkino.fi/xml/Schedule/?area=" + idd + "&dt=" + today; // tallennetaan muuttujaan url + teatterin ID, + ""&dt="" ja päivämäärä, että saadaan kokonainen osoite, josta XML haetaan. 
    var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

        xmlhttp.onreadystatechange=function() { 
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                var xmlDoc = xmlhttp.responseXML;
                var x = xmlDoc.getElementsByTagName("Show");
                var TheatreID = xmlDoc.getElementsByTagName("TheatreID");
                var ShowStart = xmlDoc.getElementsByTagName("dttmShowStart");
                var Theatre = xmlDoc.getElementsByTagName("Theatre");
                var eventID, EventURL, TheatreAuditorium, LengthInMinutes, dttmShowStart, Genres = "";
             
                var Theatre = Theatre[0].innerHTML;
               
                var ul = document.getElementById("elokuvalistaus");
                ul.innerHTML = "";

                document.getElementById('teatteri').innerHTML = Theatre;

                for (i = 0; i <x.length; i++) {
                    
                    let id = TheatreID[i].innerHTML
                    
                        //tallennetaan kaikki myöhemmin tarvittavat tiedot XML taulukosta muuttujiin
                        eventID = x[i].getElementsByTagName("EventID")[0].childNodes[0].nodeValue;
                        TheatreAuditorium = x[i].getElementsByTagName("TheatreAuditorium")[0].childNodes[0].nodeValue;
                        LengthInMinutes = x[i].getElementsByTagName("LengthInMinutes")[0].childNodes[0].nodeValue;
                        dttmShowStart =  x[i].getElementsByTagName("dttmShowStart")[0].childNodes[0].nodeValue;
                        EventURL = x[i].getElementsByTagName("ShowURL")[0].childNodes[0].nodeValue;
                        Genres = x[i].getElementsByTagName("Genres")[0].childNodes[0].nodeValue;


                        //luodaan esitystapaa varten taulukko, rivi ja solut 
                        var table2 = document.createElement('table');
                        var row = document.createElement("tr");
                        var cell = document.createElement("td");
                        var cell2 = document.createElement("td");
                        cell2.setAttribute("id", 'infot');


                        row.appendChild(cell); //solut menee rivin sisään
                        row.appendChild(cell2);
                        table2.appendChild(row); //ja rivit taulukon
                        ul.appendChild(table2);
                        

                        var vasenEka = document.createElement('li'); 
                        var kuva = x[i].getElementsByTagName("EventMediumImagePortrait")[0].childNodes[0].nodeValue
                        var image = document.createElement("img");
                        image.setAttribute("src", kuva);
                        vasenEka.appendChild(image);
                        cell.appendChild(vasenEka); //vasempaan soluun sijoitetaan kuva

                        // Oikean puolen lista-elementit luodaan järjestyksessä ylhäältä alas: oikee 1., oikee 2., jne

                        var genret = lisaaEmoji(Genres);
                        var oikeeVika = document.createElement('span');
                        oikeeVika.setAttribute('id', 'genret');
                        oikeeVika.appendChild(document.createTextNode(genret));
                        cell2.appendChild(oikeeVika);

                        var oikeeEka = document.createElement('li');
                        oikeeEka.setAttribute('id', 'elokuvanNimi'); // annetaan yksilöllinen ID, niin ulkonäköä on helpompi muokata. 
                        var nimet = x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue; // hakee elokuvien nimet taulukosta
                        oikeeEka.appendChild(document.createTextNode(nimet.toUpperCase()));
                        cell2.appendChild(oikeeEka);

                        var oikeeToka = document.createElement('li');
                        oikeeToka.setAttribute('id', 'elokuvanTiedot');
                        oikeeToka.appendChild(document.createTextNode("Kesto: " + LengthInMinutes + " min, "));
                        
                        oikeeToka.appendChild(document.createTextNode(' ' + TheatreAuditorium));
                        oikeeToka.appendChild(document.createElement("br"));

                        var klo = dttmShowStart.slice(-8); //Kellonajan muotoilu: napataan mukaan vikat 8 merkkiä
                        var aika = klo.slice(0,-3); // poistetaan viimeiset nollat
                        oikeeToka.appendChild(document.createTextNode("Showtime: " + aika));
                        cell2.appendChild(oikeeToka);


                        var oikeeKolmas = document.createElement('a')
                        oikeeKolmas.setAttribute('href', EventURL);
                        oikeeKolmas.setAttribute('id', 'ostaliput');
                        oikeeKolmas.target = "_blank"
                        oikeeKolmas.innerHTML = 'Osta liput';
                        cell2.appendChild(oikeeKolmas);
                        
                        
                      
                        }  
                    }
        }
    }

    function lisaaEmoji(genres){ // saa parametrinä genret, käy ne läpi ja lisää muuttujiin emojeja sitä mukaan, jos vastaava string-arvo löytyy. 

        var e1,e2,e3,e4,e5,e6 = "";
        console.log(genres);
        if (genres.includes('Komedia')){e1 = '😁'}
          else{e1 = ""} //jos genreä ei löydy, jätetään se tyhjäksi. 
        if (genres.includes('Draama')){e2 = '🎭';}
          else{e2 = ""}
        if (genres.includes('Animaatio')){e3 = '🎨';}
          else{e3 = ""}
        if (genres.includes('Jännitys')){e4 = '💀';}
          else{e4 = ""}
        if (genres.includes('Kauhu')){e5 = '👻';}
          else{e5 = ""}
        if (genres.includes('Sci-fi')){e6 = '🛸';}
          else{e6 = ""}
        if (genres.includes('Toiminta')){e7 = '💥';}
          else{e7 = ""}
        if (genres.includes('Fantasia')){e9 = '🧝';}
          else{e9 = ""}
        if (genres.includes('Perhe')){e10 = '👪';}
          else{e10 = ""}
        if (genres.includes('Seikkailu')){e11 = '🏹';}
          else{e11 = ""}
        

        var emojit = e1 +" "+ e2 +" "+ e3 + " "+ e4 +" "+ e5+" "+ e6 + " " + e7+ " " + e9 + " " + e10+" "+ e11;
        return emojit; //emojit lähetetään paluuarvona. 
   
    }
    
