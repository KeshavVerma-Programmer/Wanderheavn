// mapboxgl.accessToken = mapToken;
// const map = new mapboxgl.Map({
//         container: 'map', // container ID
//         style:"mapbox://styles/mapbox/streets-v12",
//         center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
//         zoom: 9 // starting zoom
// });


// const marker1 = new mapboxgl.Marker({ color: "red" })
// .setLngLat(listing.geometry.coordinates)// Listing.geometry.coordinates
// .setPopup(popup = new mapboxgl.Popup({offset: 25})
// .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be Provided After booking</p>`))
// .addTo(map);

// import maplibregl from 'maplibre-gl'; // Correct import for MapTiler SDK

// // Ensure `mapToken` and `listing` are defined globally in your EJS file
// const mapToken = mapToken || "<%= process.env.MAP_TOKEN %>"; 
// const listing = listing || {};

// if (listing.geometry && listing.geometry.coordinates) {
//     const map = new maplibregl.Map({
//         container: 'map', // Container ID
//         style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`, 
//         center: listing.geometry.coordinates, 
//         zoom: 9
//     });

//     new maplibregl.Marker({ color: "red" })
//         .setLngLat(listing.geometry.coordinates)
//         .setPopup(
//             new maplibregl.Popup().setHTML(
//                 `<h4>${listing.title}</h4>
//                 <p>${listing.location}</p>
//                 <p>Exact location will be provided after booking</p>`
//             )
//         )
//         .addTo(map);
// } else {
//     console.error("Map coordinates are missing or invalid.");
// }

import { Map, Marker, Popup } from 'maplibre-gl'; // Correct v5.x import

document.addEventListener("DOMContentLoaded", () => {
    if (listing?.geometry?.coordinates) {
        const map = new Map({
            container: 'map',
            style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${mapToken}`,
            center: listing.geometry.coordinates,
            zoom: 9
        });

        new Marker({ color: "red" })
            .setLngLat(listing.geometry.coordinates)
            .setPopup(
                new Popup().setHTML(
                    `<h4>${listing.title}</h4>
                    <p>${listing.location}</p>
                    <p>Exact location will be provided after booking</p>`
                )
            )
            .addTo(map);
    } else {
        console.error("Map coordinates are missing or invalid.");
    }
});






