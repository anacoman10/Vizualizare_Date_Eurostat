// declararea variabile necesare
let ani=[];
let tari=[]
let indicatori=[]
let sv=[]
let pop=[]
let pib=[]


// functia care citeste din fisier
function preluareDateEurostat(fisier)
{
    //apelare request pentru a putea prelua datele
    const request = new XMLHttpRequest();
    
    request.open("GET", fisier, false);
    request.send();
    let data = JSON.parse(request.responseText);

    // liste cu tari, ani si indicatori 
    for(let i=0;i<data.length;i++)
    {
        indicatori.push(data[i].indicator)
        ani.push(data[i].an)
        tari.push(data[i].tara)

    }
    // liste cu tari, ani si indicatori unici
    //x - elementele din array
    //a - array ul
    //i - index ul la care se afla elementul

    

    indicatori = indicatori.filter(function(x, i, a)
    {
        return a.indexOf(x)==i
    });

    ani = ani.filter(function(x, i, a)
    {
        return a.indexOf(x)==i
    });
    tari = tari.filter(function(x, i, a)
    {
        return a.indexOf(x)==i
    });


    return data;
}

// incarcare date
let data = preluareDateEurostat('./media/eurostat.json');


// populare select-uri
let select = document.getElementById("indicatori");
for(let i=0;i<indicatori.length;i++)
{
    let option = document.createElement("option");
    option.text = indicatori[i];
    select.add(option);
}

select = document.getElementById("tari");
for(let i=0;i<tari.length;i++)
{
    let option = document.createElement("option");
    option.text = tari[i];
    select.add(option);

}

select = document.getElementById("ani");
for(let i=0;i<ani.length;i++)
{
    let option = document.createElement("option");
    option.text = ani[i];
    select.add(option);
}


//functia care sterge elementele inainte de a desena altele
function blankScreen()
{
    document.getElementById("tHead").style.visibility="hidden"
    document.getElementById("tBody").innerHTML=""
    document.querySelector('table').visibility="hidden"
    document.getElementById("culoriTabel").style.border=""
    document.getElementById("barChart").innerHTML=''
    barChart.style.height="0px"
    document.getElementById("chartContainer1").style.visibility="hidden"
}


//functia care preia datele selectate din butoane
function preluareDate()
{
    let indicator = document.getElementById('indicatori').value;
    let tara = document.getElementById('tari').value;
    return data.filter((x) => x.tara === tara && x.indicator === indicator);
}


// clasa BarChart implementata la seminar si adaptata conform cerintelor
class BarChart {
    // constructor
    
        constructor(element, svgns = "http://www.w3.org/2000/svg") {
          this.element = element;
          this.svgns = svgns;
          this.width = element.clientWidth;
          this.height = element.clientHeight;

      }
      
    // desenare date
    draw(data) {
        this.data = data;
        this.creareSVG();
        this.desenareFundal();
        this.drawBars();
    }
    // crearea elementului svg pentru grafic
    creareSVG() {
        //creare element svg pe baza namespace-ului
        this.svg = document.createElementNS(this.svgns, "svg");
        //adaugare border pentru element
        this.svg.style.border="5px white double"
        this.svg.setAttribute("viewBox", `0 0 ${this.width} ${this.height}`);
        //setare id pentru svg pentru a fi referit ulterior
        this.svg.setAttribute("id", "svgChart");
        
        //adaugare svg la elementul pe care se va afisa graficul
        this.element.appendChild(this.svg);
    }
    // initializarea fundalului
    desenareFundal() {
        //desenare dreptunghi pe toata suprafata elementului
           
            const rect = document.createElementNS(this.svgns, "rect");
            rect.setAttributeNS(null, "x", 0);
            rect.setAttributeNS(null, "y", 0);
            rect.setAttributeNS(null, "width", this.width);
            rect.setAttributeNS(null, "height", this.height);
            rect.style.setProperty("fill", "#f5f5f5");
            // adaugare dreptunghi pe elementul svg
            this.svg.appendChild(rect);
    }
    // desenarea titlului pentru grafic
    deseneazaTitlu(tara) {
        const titlu = document.createElementNS(this.svgns, "text");
        //setare continut pentru titlu (text)
        titlu.appendChild(document.createTextNode( `Evoluție ${this.data[0].indicator} în ${tara}`));
        //stilizare font si culoare pentru titlu
       
        titlu.style.setProperty("font-style",'bold-italic');
        titlu.style.setProperty("font-size",'25px');
        titlu.style.setProperty("font-family",'times-new-roman');
       
        //setare coordonate pentru titlu (in centru pe orizontala si pe verticala calculat in functie de inaltimea maxima a barelor)
        titlu.setAttribute("x", this.element.clientWidth / 2 - 90);
        titlu.setAttribute("y", 0.1 * this.element.clientHeight);
        //titlu.setAttribute("y", 0.1 * this.element.clientHeight);
        //adaugare titlu la elementul svg
        this.svg.appendChild(titlu);
    }
    // desenarea barelor ce reprezinta fiecare data ilustrata
    drawBars() {
        //latimea unei bare
        const barWidth = this.width / this.data.length;
        //valoarea maxima a datelor reprezentate
        const maxValue = Math.max(...this.data.map(e => e.valoare));
        //factor de scalare
        const scaleFactor = this.height / maxValue;
        let maxBarHeight;
        for (let i = 0; i < this.data.length; i++)
         {
            
            let valoare=this.data[i].valoare;
            const barHeight = valoare * scaleFactor * 0.7;
           
            //coordonatele x si y pentru bare
            //deplasare pe orizontala
            const barX = i * barWidth;
             
            const barY = this.height - barHeight;

            const bar = document.createElementNS(this.svgns, "rect");
            bar.setAttribute("x", barX + barWidth / 4.4);
            bar.setAttribute("y", barY + 30); 
            bar.setAttribute("width", barWidth / 2);
            bar.setAttribute("height", barHeight);
            //colorez bara corespunzatoare valorii maxime diferit
            if (valoare === maxValue) {
               
                maxBarHeight = barHeight;

                bar.style.fill = "#0018a8";

            } else bar.style.fill = "#89cff0";

            bar.style.stroke = "white";
            const strokeWidth = 2.4;
            bar.style.strokeWidth = strokeWidth + "px";

            let indicator = this.data[i].indicator;
            let an = this.data[i].an;

            let mypopup = document.getElementById("popUpChart");
            let textPopUp = document.getElementById("popUpText");
           

            // functia care afiseaza un pop-up cand trecem cu mouse-ul peste bara
            bar.addEventListener("mouseover", () => {
                bar.getBoundingClientRect();
                textPopUp.innerHTML ="Valoare: " + valoare + " Indicator: " + indicator + " An: "+ an;
                mypopup.style.left = 55 + "px";
                mypopup.style.bottom = 700+ "px";
                mypopup.style.display="inline-block"
             
             
            });
            this.svg.appendChild(bar);

            bar.addEventListener("mouseout", () => mypopup.style.setProperty("display","none"));
            let text = document.createElementNS(this.svgns, 'text');
            text.appendChild(document.createTextNode(this.data[i].an));
            text.setAttribute('x', barX + 10);
            text.setAttribute('y', barY );
            this.svg.appendChild(text);
        }
        this.deseneazaTitlu(this.data[0].tara);
    }
}

function datePeAn(an)
{
    const obSelectate = data.filter(obj => obj.an === an).map(obj => obj.valoare);
    return obSelectate
}

function drawChart() {

    blankScreen();
    let chartDiv = document.getElementById("barChart");
    chartDiv.style.setProperty("height","500px");
    let barChart = new BarChart(chartDiv);
    barChart.draw(preluareDate());
}


function sum(accumulator, a)
{
    return accumulator + a;
}
//functie pentru crearea  tabelului
function creareTabel()

{
    //apelez functia blankScreen care sa imi stearga elementul desenat anterior
    blankScreen()
    document.getElementById("tHead").style.visibility = "visible";
    document.querySelector('table').style.visibility = "visible";
    let optiuneAn=document.getElementById("ani")
    var an = optiuneAn.options[optiuneAn.selectedIndex].text
    let obiecteSelectate=datePeAn(an)
    let msv=obiecteSelectate.slice(0,27).reduce(sum,0)/tari.length
    let mpop=obiecteSelectate.slice(27, 54).reduce(sum, 0)/tari.length
    let mpib=obiecteSelectate.slice(54, 81).reduce(sum, 0)/tari.length
  
    
    //adaugarea fiecarui rand
    const table = document.getElementById("tBody")
    for(let i=0;i<=27;i++)
    {    
        table.insertAdjacentHTML('beforebegin', 
        `<tr>
            <td>${tari[i]}</td>
            <td id=${i}>${obiecteSelectate[i]}</td>
            <td id=${i + 27}>${obiecteSelectate[i + 27]}</td>
            <td id=${i + 54}>${obiecteSelectate[i + 54]}</td>
        </tr>`);
    }
    table.insertAdjacentHTML('beforebegin', `<tr>
    <td> Media UE </td>
        <td>${Math.round(msv)}</td>
        <td>${Math.round(mpop)}</td>
        <td>${Math.round(mpib)}</td>
    </tr>`);

    // preluare max, minim pt fiecare indicator
    let max1 = Math.max(...obiecteSelectate.slice(0, 27)); //sv
    let min1 = Math.min(...obiecteSelectate.slice(0, 27)); 
    let max2 = Math.max(...obiecteSelectate.slice(27, 54)); //pop
    let min2 = Math.min(...obiecteSelectate.slice(27, 54));
    let max3 = Math.max(...obiecteSelectate.slice(54, 81)); //pib
    let min3 = Math.min(...obiecteSelectate.slice(54, 81));

    // adaugarea culorii celulei
    for (let i = 1; i < 81; i++) {
        let celula = document.getElementById(`${i}`);
        if (i < 27) celula.style.backgroundColor = calculCuloare(parseInt(celula.innerText), min1, max1, msv);
        else if (i >= 27 && i < 54) celula.style.backgroundColor = calculCuloare(parseInt(celula.innerText), min2, max2, mpop);
        else if (i >= 54 && i < 81) celula.style.backgroundColor = calculCuloare(parseInt(celula.innerText), min3, max3, mpib);
    }
}    


function calculCuloare(val, min, max, medie) {
    if (!val) 
        return ["hsl(0,100%,0%)"].join(""); //negru
 
    let deScazut;
    if (val >= medie)
    {
        deScazut = max;
    }
    else
    {
        deScazut = min;
    }
    let v = (Math.abs(val - deScazut))
    let v1=v/(Math.abs(medie - deScazut));
    let hue = (v1 * 60 + 20).toString(); //intre galben si verde
    return [`hsl(${hue},100%,50%)`];
}

function BubbleChart(dateAnSelectat) {
    blankScreen()
 
        const canvas = document.getElementById("chartContainer1");
        canvas.style.display = "inline-block";
        canvas.style.height = "500px";
        canvas.style.visibility = "visible";
        canvas.style.border = "1px solid black";
      
        const context = canvas.getContext("2d");
        context.fillStyle = "#F2F0FF";
        context.fillRect(0, 0, canvas.width, canvas.height);
      
      
    // preluare date pentru anul respectiv
    function findMinMax(array) {
        return {
          min: Math.min(...array),
          max: Math.max(...array)
        };
      }
      
      let obiecte = datePeAn(dateAnSelectat);
      let ppop = obiecte.slice(27, 54); 
      let ppib = obiecte.slice(54, 81);
      let psv = obiecte.slice(0, 27);
      
      const minMaxPIB = findMinMax(ppib);
      const minMaxSV = findMinMax(psv);
      const minMaxPOP = findMinMax(ppop);
      
      const maxPIB = minMaxPIB.max;
      const minPIB = minMaxPIB.min;
      const minSV = minMaxSV.min;
      const maxSV = minMaxSV.max;
      const minPOP = minMaxPOP.min;
      const maxPOP = minMaxPOP.max;
      

    //desenez un bubble pentru fiecare tara: ox - populatie, oy - speranta viata, raza - PIB/capita
    function drawCircle(context, x, y, r, color, label) {
      context.beginPath();
      context.moveTo(x + r, y);
      context.arc(x, y, r, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.strokeStyle = '#F2F0FF';
      context.fill();
      context.stroke();
      context.fillStyle = "black";
      context.font = "10px Verdana";
      context.fillText(label, x - 5, y);
      context.closePath();
    }
    
    for (let i = 0; i < tari.length; i++) {
      let r = (70 - 10) * (ppib[i] - minPIB) / (maxPIB - minPIB) + 10;
      let y = (canvas.height - 50) * (psv[i] - minSV) / (maxSV - minSV) + 50 - r - 10;
      let x = (canvas.width - 50) * (ppop[i] - minPOP) / (maxPOP - minPOP) + 50 - r - 10;
      let color = `rgb(${256*Math.random() },${256*Math.random() },${256*Math.random()},0.7)`;
      drawCircle(context, x, y, r, color, tari[i]);
    }
    
    
    // desenarea axelor cu unitati de masura pe marginea canvasului
    let distanta = (canvas.height - 90) / 8;
    for(let i =0;i<10;i++){
        context.beginPath();
        context.fillStyle = "black";
        context.font = "11px Arial";
        context.fillText(72 + i, 0, distanta* i +11);
        context.closePath();
    }
     distanta = (canvas.width - 90) / 8;
    for(let i =0;i<10;i++){
        context.beginPath();
        context.fillStyle = "black";
        context.font = "11px Arial";
        context.fillText(5000 + (300000*i),  distanta* i +15,10);
        context.closePath();
    }
    context.fillStyle = "rgb(65,160,232)";
    context.font = "50px Times-New-Roman";
    context.fillText(dateAnSelectat, 800, 50);
}

function animeazaBubble() {
    let i = 0;
    
    let interval = setInterval(function() {
        if (i > ani.length ) {
            clearInterval(interval)
        } 
        else
        {
            BubbleChart(ani[i]);
            i++;
        }
    },500);
}
    
   

     
// atasare de evenimente pentru butoane, sa se afiseze doar cand am datele selectate de cate utilizator
document.getElementById('buttonChart').addEventListener('click', () => drawChart());


document.getElementById('buttonTable').addEventListener('click', ()=> creareTabel());

document.getElementById('buttonAnimatii').addEventListener('click',()=>animeazaBubble());


document.getElementById('buttonBubble').addEventListener("click",()=>{
    let opt = document.getElementById('ani');
    let an = opt.options[opt.selectedIndex].text;
    BubbleChart(an)
})
// atasare evenimente pentru selecturi
document.getElementById('ani').addEventListener('change',()=>{
  
    document.getElementById('buttonTable');
});

document.getElementById('indicatori').addEventListener('change',()=>{
    let opt = document.getElementById('tari');
    let tara =  opt.options[opt.selectedIndex].value;
    if(tara!='Alege o tara')
        document.getElementById('buttonChart');
});

