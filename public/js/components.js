fetch("components/navbar.html").then(respuesta => respuesta.text()).then(html => {
    document.getElementById("navbar").innerHTML = html;
});

fetch("components/footer.html").then(respuesta => respuesta.text()).then(html => {
    document.getElementById("footer").innerHTML = html;
});