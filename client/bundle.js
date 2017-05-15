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
    'blue',
    'red',
    'darkgreen',
    'darkorange',
    'violet',
    'grey',
    'lightblue',
    'night',
    'orange',
    'pink',
    'darkblue',
    'green',
    'white',
    'yellow',
    'brown',
    'black',
    'black'
];

let clusterers = [];

ymaps.ready(function () {
    myMap = new ymaps.Map("map", mapInitParams);
    myMap.container.enterFullscreen();

    for (let color of colors) {
        clusterers.push(new ymaps.Clusterer({
            preset: 'islands#' + color + 'ClusterIcons',
            groupByCoordinates: false,
            clusterDisableClickZoom: false,
            clusterHideIconOnBalloonOpen: false,
            geoObjectHideIconOnBalloonOpen: false,

            clusterOpenBalloonOnClick: false,
            clusterBalloonPanelMaxMapArea: 0
        }));
    }

    getData('../data/connections_labeled.json').then(function (res) {
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

            clusterer = clusterers[parseInt(coord['label'])];
            clusterer.add(myGeoObject);
            myMap.geoObjects.add(clusterer);
        }
    });
});
