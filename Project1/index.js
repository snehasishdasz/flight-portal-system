function signup(){
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let pass = document.getElementById('pass').value;
    let genderInputs = document.getElementsByName('gender');
    let gender = 'Male'
    for (var i = 0; i < genderInputs.length; i++) {
        if (genderInputs[i].checked) {
            gender = genderInputs[i].value; 
            break;
        }
    }
    let age = document.getElementById('age').value;
    let nationality = document.getElementById('nationality').value;
    let passport = document.getElementById('passport').value;

    fetch("http://localhost:8080/users",{
        method: "POST",
        headers: {
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            "id":Date.now(),
            "name":name,
            "email":email,
            "pass":pass,
            "gender":gender,
            "age":age,
            "nationality":nationality,
            "passport":passport
        })
    }).then(async (res)=>{
        const data = await res.json();
        console.log(data);
        alert("your account has been created. Login now");
        
    }).catch((err)=>{
        console.log(err);
    })
}
function login(){
    let email = document.getElementById('email').value;
    let pass = document.getElementById('pass').value;
    fetch("http://localhost:8080/users",{
        method: "GET",
    }).then(async (res)=>{
        const data = await res.json();
        let flag=0;
        for(let i=0;i<data.length;++i){
            if(data[i].email == email && data[i].pass == pass){
                alert("Your password is correct\nYou are logged in !!");
                flag=1;
                localStorage.setItem("token",JSON.stringify(data[i].id));
                localStorage.setItem("uname",data[i].name);
                window.location.href='./index.html';
                break;
            }
        }
        if(flag==0){
            alert("You gave wrong password or email");
        }
        
    }).catch((err)=>{
        console.log(err);
    })
}

function viewFlights(){
    console.log('flight list shown');
    fetch("http://localhost:8080/data",{
        method: "GET"
    })
    .then((res) => res.json())
    .then((data) => getData(data));
}
/* ----------nav bar logic--- */
const token = localStorage.getItem("token");
const welcome_txt = document.getElementById('welcome');
const Login_out_btn = document.getElementById('login-out');
if(token){
    console.log('logged in');
    welcome_txt.innerText= localStorage.getItem("uname");
    Login_out_btn.innerHTML = 'Logout';
    Login_out_btn.addEventListener('click',()=>{
        localStorage.removeItem("token");
        localStorage.removeItem("uname");
        window.location.reload();
    });
    if(document.title === "Amigo")viewFlights();
}
else{
    welcome_txt.innerText = "";
    Login_out_btn.innerText = 'Login';
    Login_out_btn.addEventListener('click',()=>{
        window.location.href = './login.html';
    });

    document.getElementById('flist').innerHTML = '<p style="font-size:3em;">Login to view available flights</p>';
}
/* ------------------ */
function getData(data) {
    data.map((el) => {
        const flist = document.getElementById("flist");
        const tr = document.createElement("tr");
        const td1 = document.createElement("td");
        td1.innerText = el.source;
        const td2 = document.createElement("td");
        td2.innerText = el.destination;
        const td3 = document.createElement("td");
        td3.innerText = "Rs. "+el.price+" /-";
        const td4 = document.createElement("td");
        td4.innerText = el.seatsAvailable.toString(); 
        const td5 = document.createElement("td");
        td5.innerText = el.boarding + " Hrs";
        const td6 = document.createElement("td");
        td6.innerText = el.departure + " Hrs"; 
        const td7 = document.createElement("td");
        const book_btn = document.createElement("button");
        book_btn.classList.add('btn');
        book_btn.innerText ='book';
        book_btn.addEventListener("click", () => {
            const newObj={
                flight:el.flight,
                source:el.source,
                destination:el.destination,
                boarding:el.boarding,
                departure:el.departure,
                seatsAvailable:el.seatsAvailable-1,
                price:el.price
            };
    
            fetch(`http://localhost:8080/data/${el.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newObj),
            })
            .then((res) => {
                if (res.ok) {
                    localStorage.setItem("id", JSON.stringify(el.id));
                    window.location.href = "./details.html";
                }
            })
            .catch((err) => {
                alert("Error occurred while booking: " + err);
            });
        });
        if(el.seatsAvailable>0){
            book_btn.disabled = false;
        }else{
            book_btn.disabled = true;
        }
        td7.appendChild(book_btn);
        tr.append(td1,td2,td3,td4,td5,td6,td7);
        flist.appendChild(tr);
    });
}
/* -----------ends------------ */
const blist = document.getElementById('booklist');
if(blist && token){
    showBooking();
}
else if(blist){
    blist.innerHTML = '<h1>Login to view booking</h1>';
}
function showBooking(){
    fetch("http://localhost:8080/booking",{
        method: "GET",
    }).then(async (res)=>{
        const data = await res.json();
        for(let i=0;i<data.length;++i){
            if(data[i].uid === token){
                const box = document.createElement('div');box.classList.add('box');
                const content = document.createElement('div');content.classList.add('content');
                const wrap = document.createElement('h3');
                const p1 = document.createElement('p');
                const p2 = document.createElement('span');
                const p3 = document.createElement('span');
                const p4 = document.createElement('p');
                const p5 = document.createElement('p');
                p1.innerText = data[i].flight;
                p2.innerHTML = '<i class="fas fa-map-marker-alt"></i> '+data[i].source+" TO ";
                p3.innerHTML = '<i class="fas fa-map-marker-alt"></i> '+data[i].destination;
                p4.innerText = "arrival: "+data[i].boarding+ " Hrs";
                p5.innerText = "departure: "+data[i].departure+" Hrs";
                wrap.append(p1,p2,p3,p4,p5)
                content.append(wrap);
                box.appendChild(content);
                blist.appendChild(box);
            }
        }
    }).catch((err)=>{
        console.log(err);
    })
}