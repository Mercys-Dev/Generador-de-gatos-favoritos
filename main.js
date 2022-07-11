const API_URL_RANDOM = 'https://api.thecatapi.com/v1/images/search?limit=3';
const API_URL_FAVOURITES = 'https://api.thecatapi.com/v1/favourites';
const API_URL_DELETE = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const API_URL_UPLOAD = 'https://api.thecatapi.com/v1/images/upload';

const spanError = document.getElementById('Error')


async function loadRandomMichis(){
    const res = await fetch(API_URL_RANDOM);  
    const data = await res.json();

    console.log('Gatos Aleatorios');
    console.log(data);

    if (res.status !== 200){
        spanError.innerHTML = "Hubo un error: " + res.status;
    }
    {
        const img1 = document.getElementById('img1')
        const img2 = document.getElementById('img2')
        const img3 = document.getElementById('img3')
        const btn1 = document.getElementById('btn1')
        const btn2 = document.getElementById('btn2')
        const btn3 = document.getElementById('btn3')


        img1.src = data[0].url
        img2.src = data[1].url
        img3.src = data[2].url

        btn1.onclick = () => savefavourite(data[0].id);
        btn2.onclick = () => savefavourite(data[1].id);
        btn3.onclick = () => savefavourite(data[2].id);
    }
};

async function LoadFavoriteMichis(){
    const res = await fetch(API_URL_FAVOURITES, {
        method: 'GET',
        headers: {
            'X-API-KEY': '77b97dfe-9148-4a67-b5be-bf407b1d23db',
        },
    });
    const data = await res.json();

    console.log('Favoritos');
    console.log(data);

    if (res.status !== 200){
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    }else{

        const section = document.getElementById('favoritesMichis');
        section.innerHTML = "";
        const h2 = document.createElement('h2');
        const h2Text = document.createTextNode('Gatos Favoritos');
        h2.appendChild(h2Text);
        section.appendChild(h2);

        const div = document.createElement('div');
        


     data.forEach(michi => {

        const article = document.createElement('article');
        const img = document.createElement('img');
        const btn = document.createElement('button');
        const btnText = document.createTextNode('Sacar de favoritos')

        btn.appendChild(btnText);
        btn.onclick = () => deleteFavorite(michi.id);

        img.src = michi.image.url;
        img.width = 350;
        img.height = 350;

        article.appendChild(img);
        article.appendChild(btn);
        div.appendChild(article);
        section.appendChild(div);

     });   
    }

};


async function savefavourite(id){
    const rest = await fetch(API_URL_FAVOURITES, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': '77b97dfe-9148-4a67-b5be-bf407b1d23db',
        },
        body: JSON.stringify({
            image_id: id
        })
    });

    const data = await rest.json();

    if (rest.status !== 200){
        spanError.innerHTML = "Hubo un error: " + rest.status + data.message;
    }

    console.log('Guardar');
    console.log(rest);

    LoadFavoriteMichis()

}

async function deleteFavorite(id){
    const rest = await fetch(API_URL_DELETE(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': '77b97dfe-9148-4a67-b5be-bf407b1d23db',
        }
    });

    const data = await rest.json();

    if (rest.status !== 200){
        spanError.innerHTML = "Hubo un error: " + rest.status + data.message;
    }

    console.log('Eliminado');
    console.log(rest);

    LoadFavoriteMichis()
}

async function uploadMichi(){
    const form = document.getElementById('uploadingForms')
    const formData = new FormData(form);

    console.log(formData.get('file'))

    const res = await fetch(API_URL_UPLOAD, {
        method: 'POST',
        headers: {
            //'Content-Type': 'multipart/form-data',
            'X-API-KEY': '77b97dfe-9148-4a67-b5be-bf407b1d23db',
        },
        body: formData,
    })
    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = `Hubo un error al subir michi: ${res.status} ${data.message}`
    }
    else {
        console.log("Foto de michi cargada :)");
        console.log({ data });
        console.log(data.url);
        savefavourite(data.id);
}
}

document.getElementById("file").onchange = function (e) {
    // Creamos el objeto de la clase FileReader
      let reader = new FileReader();
    // Leemos el archivo subido y se lo pasamos a nuestro fileReader
      reader.readAsDataURL(e.target.files[0]);
    // Le decimos que cuando este listo ejecute el código interno
      reader.onload = function () {
          let preview = document.getElementById("preview"),
          image = document.createElement("img");
          image.src = reader.result;
          image.width = 250;
          preview.innerHTML = "";
          preview.append(image);
      };
  };

loadRandomMichis();
LoadFavoriteMichis();