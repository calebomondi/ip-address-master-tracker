//global variables
var map;
var lat = 48.85341;
var long = 2.3488;
//search
const search = document.getElementById("searchItem");
search.addEventListener("keydown", function(event){
    if(event.key === 'Enter') {
        const ip_address = search.value.toString().trim();
        const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        const ipv6Pattern = /^(?:(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,6}:(?:[0-9a-fA-F]{1,4}:){0,5}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,5}:(?:[0-9a-fA-F]{1,4}:){0,6}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,4}:(?:[0-9a-fA-F]{1,4}:){0,7}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,3}:(?:[0-9a-fA-F]{1,4}:){0,8}[0-9a-fA-F]{1,4}|(?:[0-9a-fA-F]{1,4}:){1,2}:(?:[0-9a-fA-F]{1,4}:){0,9}[0-9a-fA-F]{1,4}|[0-9a-fA-F]{1,4}:(?:[0-9a-fA-F]{1,4}:){0,10}[0-9a-fA-F]{1,4}|:(?:[0-9a-fA-F]{1,4}:){0,11}[0-9a-fA-F]{1,4}|:)$/;

        
        if(ipv4Pattern.test(ip_address)) {
            getSearchItem(ip_address);
        } else if(ipv6Pattern.test(ip_address)) {
           // document.querySelector('.ipAdd').style.overflow = 'hidden';
            getSearchItem(ip_address);
        } else {
            alert("ENTER VALID IPv4 or IPv6 ADDRESS");
        }
        
    }
});

//svg click
document.querySelector('svg').addEventListener('click', function() {
    const ip_address = search.value.toString().trim();
    const ipv4Pattern = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){2}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    const ipv6Pattern = /^(?:[0-9a-fA-F]{1,4}:){1,7}[0-9a-fA-F]{1,4}(?:\/[0-9]{1,3})?$/;
        
    if(ipv4Pattern.test(ip_address)) {
        getSearchItem(ip_address);
    } else if(ipv6Pattern.test(ip_address)) {
        //document.querySelector('.ipAdd').style.overflow = 'hidden';
        getSearchItem(ip_address);
    } else {
        alert("ENTER VALID IPv4 or IPv6 ADDRESS");
    }
});

//onload get the clients data and display it
window.onload = async function() {
    try {
      const clientAddress = await renderClientsAddress();
      await getSearchItem(clientAddress);
    } catch (error) {
      console.log("Error: " + error);
    }
  }

//connect to api to get json
async function getData(ip_address) {
    let url = 'https://geo.ipify.org/api/v2/country,city,vpn?apiKey=at_xjJPk2vm6Ad13BwhBYCs9Lt5BLpYq&ipAddress=' + ip_address;
    try {
        let response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}

//onload get clients ip address
async function getClientsAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        return await response.json();
    } catch (error) {
        console.log("Error: ",error);
    }
}
async function renderClientsAddress() {
    let myIp = await getClientsAddress();
    return myIp.ip;
}


//manipulate the json data
async function getSearchItem(ip_address) {
    const locationData = await getData(ip_address);
    let html = `
        <div class="id">
            <p class="name">IP ADDRESS</p>
            <p class="details ip">${locationData.ip}</p>
        </div>
        <div class="id leftBord">
            <p class="name">LOCATION</p>
            <p class="details location">${locationData.location.city}, ${locationData.location.region}</p>
        </div>
        <div class="id leftBord">
            <p class="name">TIMEZONE</p>
            <p class="details timezone">GMT ${locationData.location.timezone}</p>
        </div>
        <div class="id leftBord">
            <p class="name">ISP</p>
            <p class="details isp">${locationData.isp}</p>
        </div>
    `;
    let info = document.querySelector('.info');
    info.innerHTML = '';
    info.innerHTML = html;

    lat = locationData.location.lat;
    long = locationData.location.lng;

    renderImage();
}