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
const colors = [
    '#FF0000',
    '#FF7400',
    '#009999',
    '#00CC00',
    '#BF3030',
    '#BF7130',
    '#1D7373',
    '#269926',
    '#A60000',
    '#A64B00',
    '#006363',
    '#008500',
    '#FF4040',
    '#FF9640',
    '#33CCCC',
    '#39E639',
    '#FF7373',
    '#FFB273',
    '#5CCCCC',
    '#67E667'
];

ymaps.ready(function () {
    myMap = new ymaps.Map("map", mapInitParams);
    myMap.container.enterFullscreen();

    getData('../data/organizations_labeled.json').then(function (res) {
        const coords = JSON.parse(res).places;
        for (let coord of coords) {
            const myGeoObject = new ymaps.GeoObject({
                geometry: {
                    type: "Point",
                    coordinates: coord['point']
                },

                properties: {}
            }, {
                iconColor: colors[parseInt(coord['label'])]
            });
            myMap.geoObjects.add(myGeoObject);
        }
    });
});
