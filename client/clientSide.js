


async function  getDataAndDisplay(){
    // console.log("js file called");
   try{
       const response=await fetch("/getCurrentRequest");
       const tableBody=document.getElementById("tableBody");
       const data=await response.json();
    //    const p=document.getElementById("emptyTableMessage");
       const mainTable=document.getElementById("mainTable");
       const emptyTableMessage=document.getElementById("emptyTableMessage");

       if(data.length==0){
            mainTable.style.display = "none";
            // emptyTableMessage.textContent = "Find your route now!";
            emptyTableMessage.innerHTML=`<span style='font-size:50px; color:black;'>Find your route now!&#128653;</span>`
            emptyTableMessage.style.display = "block";
       }else{
        emptyTableMessage.style.display = "none";
            tableBody.innerHTML="";
            data.forEach((item,i)=>{
                const row=document.createElement('tr');
                row.innerHTML=
                `
                    <td>${i+1}</td>
                    <td>${item.source}</td>
                    <td>
                        ${item.via.map((station, index) => `${station}${index < item.via.length - 1 ? ' → ' : ''}`).join('')}
                    </td>
                    <td>${item.destination}</td>
                    <td>${item.departure}</td>
                    <td>${item.depot}</td>
                    <td>${item.fare}</td>
                    <td>${item.totalDistance}</td>
                    <td>${item.busClass}</td>
                `
                tableBody.appendChild(row);
            });
       }

   }
   catch{
       console.log("Error getting data from fetch");
   }
};
  


let allSources=[];
let allDestinations=[];
async function storeSourcesViaDestinations(){
   try{
     const response=await fetch("/getAllData");
       const tableBody=document.getElementById("tableBody");
       const data=await response.json();
        console.log(data);
       data.forEach((item)=>{
            if (!allSources.includes(item.source)) {
                allSources.push(item.source);
            }

            item.via.forEach((x) => {
                if (!allDestinations.includes(x)) {
                    allDestinations.push(x);
                }
            });

            if (!allDestinations.includes(item.destination)) {
                allDestinations.push(item.destination);
            }
       });
       console.log("Allsources:",allSources);
       console.log("allDestinations",allDestinations);
   }
   catch{
        console.log("error storing sources and destinations");
   }
}


const sourceInput=document.getElementById("sourceInput");
const destinationInput=document.getElementById("destinationInput");
const sourceSuggestionList=document.getElementById("sourceSuggestionList");
sourceInput.onkeyup=()=>{
    let srcResults=[];
    const input=sourceInput.value;
    if(input.length){
        srcResults=allSources.filter((keywords)=>{
            return keywords.toLowerCase().includes(input.toLowerCase());
        });
    };
    sourceSuggestionList.innerHTML="";
    srcResults.forEach((item)=>{
        const option=document.createElement('option');
        option.innerText=item;
        sourceSuggestionList.appendChild(option);
    })
    console.log("Source suggestions: ",srcResults);
}


destinationInput.onkeyup=()=>{
    let destResults=[];
    const input=destinationInput.value;
    if(input.length){
        destResults=allDestinations.filter((keywords)=>{
            return keywords.toLowerCase().includes(input.toLowerCase());
        });
    };
    destinationSuggestionList.innerHTML="";
    destResults.forEach((item)=>{
        const option=document.createElement('option');
        option.innerText=item;
        destinationSuggestionList.appendChild(option);
    })
    console.log("Destionation suggestions: ",destResults);
}



document.addEventListener('DOMContentLoaded',()=>{
   getDataAndDisplay(),
   storeSourcesViaDestinations()
} );
