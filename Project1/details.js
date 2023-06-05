const id = localStorage.getItem("id");
if(id){
    fetch(`http://localhost:8080/data/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then(async (res) => {
        if (res.ok) {
            const el = await res.json();

            const content = document.getElementById('show_details');
            const flight = document.createElement("h1");
            flight.innerText = el.flight;
            const source = document.createElement("h3");
            source.innerText = "From: " + el.source;
            const destination = document.createElement("h3");
            destination.innerText = "To: " + el.destination;
            const boarding = document.createElement("h3");
            boarding.innerText = "Boarding time: " + el.boarding + " Hrs";
            const departure = document.createElement("h3");
            departure.innerText = "Departure time: " + el.departure + " Hrs";
            
            const confirm = document.createElement("button");
            confirm.innerHTML = 'Confirm';
            confirm.addEventListener('click',()=>{
                fetch("http://localhost:8080/booking",{
                    method: "POST",
                    headers: {
                        "Content-Type":"application/json"
                    },
                    body: JSON.stringify({
                        "id":Date.now(),
                        "uid": localStorage.getItem("token"),
                        "flight":el.flight,
                        "source":el.source,
                        "destination":el.destination,
                        "boarding":el.boarding,
                        "departure":el.departure
                    })
                }).then(async (res)=>{
                    const data = await res.json();
                    console.log(data);
                    alert("booking added");
                    window.location.href = './index.html';
                }).catch((err)=>{
                    console.log(err);
                })
            });
            content.append(flight,source,destination,boarding,departure,confirm);
        }
    })
    .catch((err) => {
        alert("Error occurred while booking: " + err);
    });
}