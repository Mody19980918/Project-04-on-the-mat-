step 1 : Function for API Get

example : async function get (){
let res = await fetch('http://localhost:8080/example/:id', {
method: "GET",
headers: {"Content-Type": "application/json",},
});
return res.json();

}

step 2 : Open Components
