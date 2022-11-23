//document.getElementById('1015').addEventListener('click', lataaElokuvat(1015));
 /*
 console.log(document.getElementById('10').textContent);
 document.getElementById('1015').addEventListener('click', klikkaus());

 function klikkaus(){
  var url = 'https://www.finnkino.fi/xml/TheatreAreas/'
  var tagName = 'Name'
  var cityName = document.getElementById('10').textContent;
  valitseTeatteri(url, tagName, cityName);

 }*/

 document.getElementById('pudotusvalikko').addEventListener('click', pudotusvalikko);

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


var today = new Date();
var dd = today.getDate(); //haetaan päivä. Lähde: https://www.w3schools.com/jsref/jsref_getdate.asp
var mm = today.getMonth()+1; //Haetaan kuukaus, javascriptissä tammikuu on 0, siitä + 1. 
var yyyy = today.getFullYear();
if(dd < 10) {
    dd = '0' + dd
}
if(mm < 10) {
    mm = '0' + mm
}
today = dd + '.' + mm + '.' + yyyy; //päivämäärän esitysmuoto, jota käytetään myös Finnkinon XML-tiedostojen linkkien nimissä. 

document.getElementById('addDate').innerHTML= "Ohjelmistossa " + today;


document.getElementById('helsinkiArea').addEventListener('click', helsinki);
document.getElementById('espooArea').addEventListener('click', espoo);
document.getElementById('vantaaArea').addEventListener('click', vantaa);
//document.getElementById('muuSuomi').addEventListener('click', muuSuomi);

//document.getElementById('1015').addEventListener('click', lataaElokuvat2(1015));

/*  <a id="1015">Jyväskylä</a>
          <a id="1016">Kuopio</a>
          <a id="1017">Lahti</a>
          <a id="1041">Lappeenranta</a>
          <a id="1018">Oulu</a>
          <a id="1019">Pori</a>
          <a id="1034">Tampere: Cine Atlas</a>
          <a id="1035">Tampere: Plevna</a>
          <a id="1022">Turku</a>
          <a id="1046">Raisio</a>*/

function helsinki(){
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

//------------------------------------------------------------------------------------------------------------------
// LUODAAN TEATTEREIDEN VALIKKONAPPULAT XML -URL:N, TAG NAME:N JA KAUPUNGIN NIMEN MUKAAN 
//------------------------------------------------------------------------------------------------------------------

function valitseTeatteri(url, tagName, cityName){

var xmlhttp = new XMLHttpRequest();
 xmlhttp.open("GET", url, true);
 xmlhttp.send();

 xmlhttp.onreadystatechange = function() {

if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

  let xml = xmlhttp.responseXML;
  let x = xml.getElementsByTagName(tagName);
  let id = xml.getElementsByTagName('ID');
  let y = cityName

    
    var sijainti = document.getElementById('ikkuna');
    sijainti.innerHTML = "";
    sijainti.appendChild(document.createTextNode('Valitse teatteri:'));
    sijainti.appendChild(document.createElement("br"));

for(i = 0; i < x.length; i++) {
  let kaupungit = x[i].innerHTML
  if (kaupungit.includes(cityName)){
    var idd = id[i].childNodes[0].nodeValue;
   
    createButton(idd); // https://stackoverflow.com/questions/7066191/javascript-onclick-onsubmit-for-dynamically-created-button
    function createButton(idd) {

            var btn = document.createElement("BUTTON");
            btn.innerHTML = x[i].childNodes[0].nodeValue;
           
            btn.setAttribute("id", "butt");
            document.body.appendChild(btn);
            sijainti.appendChild(btn);
        
            btn.onclick = function() {
                lataaElokuvat(idd);
                console.log(idd);
            };
            
        }
}
}
    }
  }
}
//------------------------------------------------------------------------------------------------------------------
// HAETAAN ELOKUVIEN TIEDOT XML -TIEDOSTOISTA ID:N JA PÄIVÄMÄÄRÄN MUKAAN
//------------------------------------------------------------------------------------------------------------------

function lataaElokuvat(idd){
    
    var url = "http://www.finnkino.fi/xml/Schedule/?area=" + idd + "&dt=" + today; // tallennetaan muuttujaan url + teatterin ID, + ""&dt="" ja päivämäärä, että saadaan kokonainen osoite, josta XML haetaan. 
    var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", url, true);
        xmlhttp.send();

        xmlhttp.onreadystatechange=function() { 
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                var xmlDoc = xmlhttp.responseXML;
                var x = xmlDoc.getElementsByTagName("Show");
                var TheatreID = xmlDoc.getElementsByTagName("TheatreID");
                var ShowStart = xmlDoc.getElementsByTagName("dttmShowStart");
                //var EventURL = xmlDoc.getElementsByTagName("EventURL");
                var eventID = "";
                var EventURL = "";
                var TheatreAuditorium = "";
                var LengthInMinutes = "";
                var dttmShowStart = "";
                var Genres = "";

                var lista="";
                var ul = document.getElementById("elokuvalistaus");
                ul.innerHTML = "";

                for (i = 0; i <x.length; i++) {
                    
                   // let y = idd
                    let id = TheatreID[i].innerHTML
                    
                   
                   // if (id.includes(y)){ // tarkistetaan, mätsääkö teatterin id parametrinä saatuun teatterin id:seen

                        //tallennetaan kaikki tarvittavat Event-id:llä löydetyt tiedot XML taulukosta muuttujiin
                        eventID = x[i].getElementsByTagName("EventID")[0].childNodes[0].nodeValue;
                        TheatreAuditorium = x[i].getElementsByTagName("TheatreAuditorium")[0].childNodes[0].nodeValue;
                        LengthInMinutes = x[i].getElementsByTagName("LengthInMinutes")[0].childNodes[0].nodeValue;
                        dttmShowStart =  x[i].getElementsByTagName("dttmShowStart")[0].childNodes[0].nodeValue;
                        EventURL = x[i].getElementsByTagName("ShowURL")[0].childNodes[0].nodeValue;
                        Genres = x[i].getElementsByTagName("Genres")[0].childNodes[0].nodeValue;
                        //console.log(Genres);

                        //luodaan taulukko, rivi ja solut 
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

                        var klo = dttmShowStart.slice(-8); //lähde?
                        var aika = klo.slice(0,-3);
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

        var e1, e2,e3,e4,e5,e6 = "";
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
        return emojit; //emojin lähetetään paluuarvona. 
   
    }
    

/*
function lataaElokuvat(idd){ 
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", "http://www.finnkino.fi/xml/Schedule/?area=" + idd + "&dt=" + today ,true); 
        xmlhttp.send();

        xmlhttp.onreadystatechange=function() { 
            if(xmlhttp.readyState == 4 && xmlhttp.status == 200){
                var xmlDoc = xmlhttp.responseXML;
                var x = xmlDoc.getElementsByTagName("Show");
                var TheatreID = xmlDoc.getElementsByTagName("TheatreID");
                var ShowStart = xmlDoc.getElementsByTagName("dttmShowStart");

                lista = ""
                var eventID = ""

                var ul = document.getElementById("elokuvalistaus");
                ul.innerHTML = "";

                for (i = 0; i <x.length; i++) {
                    let y = idd
                    let id = TheatreID[i].innerHTML
                  
                   
                   // if (id.includes(y)){

                        eventID = x[i].getElementsByTagName("EventID")[0].childNodes[0].nodeValue;

                        var lii = document.createElement('ul');
                        var kuva = x[i].getElementsByTagName("EventMediumImagePortrait")[0].childNodes[0].nodeValue
                        var image = document.createElement("img");
                        image.setAttribute("src", kuva);
                        lii.appendChild(image);
                        ul.appendChild(lii);

                        var li = document.createElement('li');
                        li.setAttribute('id', 'li2');
                        var nimet = x[i].getElementsByTagName("Title")[0].childNodes[0].nodeValue;
                        li.appendChild(document.createTextNode(nimet));
                        ul.appendChild(li);

                        var liii = document.createElement('li');
                        var lisatietojaNappi = luoNappi(); 
                        liii.appendChild(lisatietojaNappi);
                        ul.appendChild(liii);
                       
                            
                        function luoNappi(){
                            eventID = x[i].getElementsByTagName("EventID")[0].childNodes[0].nodeValue;
                            var button = document.createElement("BUTTON");
                            button.innerHTML =  'Lisätietoja';
                            button.setAttribute("id","btnid" + eventID);
                            return button;
                    }
                }  
            }
            
        }
    }
*/
//}
    

//} 
