document
.getElementById("sendBtn")
.addEventListener(
"click",

async ()=>{

    const email =
    document
    .getElementById("email")
    .value;

    if(email===""){

        alert(
            "Masukkan email!"
        );

        return;

    }

    try{

        const response =
        await fetch(

        "http://localhost:5000/api/forgot-password",

        {

            method:"POST",

            headers:{

                "Content-Type":
                "application/json"

            },

            body:JSON.stringify({

                email

            })

        });

        const result =
        await response.json();

        alert(
            result.message
        );

    }catch(error){

        alert(
            "Gagal mengirim email."
        );

        console.log(error);

    }

});