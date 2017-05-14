let getData = function (url) {
    return new Promise(function (resolve, reject) {
        const req = new XMLHttpRequest();
        req.open('GET', url);
        req.onload = function () {
            if (req.status === 200) {
                resolve(req.response);
            }
            else {
                reject(req.statusText);
            }
        };
        req.send();
    });
};

let mapInitParams = {
    center: [57.623, 39.887],
    zoom: 12,
    controls: ['geolocationControl', 'zoomControl']
};

let myMap;
const colors = ['red', 'blue', 'green', 'orange', 'purple', 'gray', 'maroon', 'lime', 'aqua', 'teal', 'fuchsia', 'navy', 'yellow', 'black'];
ymaps.ready(function () {
    myMap = new ymaps.Map("map", mapInitParams);
    myMap.container.enterFullscreen();

    getData('../data/coords_labeled.json').then(function (res) {
        const coords = JSON.parse(res);
        for (let coord of coords) {
            const myGeoObject = new ymaps.GeoObject({
                geometry: {
                    type: "Point",
                    coordinates: [coord['latitude'], coord['longitude']]
                },

                properties: {}
            }, {
                iconColor: colors[parseInt(coord['label'])]
            });
            myMap.geoObjects.add(myGeoObject);
        }
    });
});
