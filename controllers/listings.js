const Listing = require("../models/listing");
const fetch = require('node-fetch'); // Using node-fetch for API calls
const mapToken = process.env.MAP_TOKEN;

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({
        path: 'reviews',
        populate: { path: "author" }
    }).populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    const location = req.body.listing.location;

    // MapTiler Geocoding API Request
    try {
        const geoResponse = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${mapToken}`);
        const geoData = await geoResponse.json();

        if (!geoData.features || geoData.features.length === 0) {
            req.flash("error", "Location not found. Please enter a valid address.");
            return res.redirect("/listings/new");
        }

        const coordinates = geoData.features[0].geometry.coordinates;

        let url = req.file.path;
        let filename = req.file.filename;
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        newListing.geometry = {
            type: "Point",
            coordinates: coordinates
        };

        let savedListing = await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");

    } catch (error) {
        console.error("Geocoding Error:", error);
        req.flash("error", "Failed to fetch location coordinates. Please try again.");
        res.redirect("/listings/new");
    }
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
  let { id } = req.params;
  const location = req.body.listing.location;

  try {
      const geoResponse = await fetch(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${mapToken}`);
      const geoData = await geoResponse.json();

      const coordinates = geoData.features[0]?.geometry?.coordinates || [0, 0];

      const updatedData = {
          ...req.body.listing
      };
      delete updatedData.geometry;  // Exclude geometry from req.body.listing

      let listing = await Listing.findByIdAndUpdate(id, updatedData);

      listing.geometry = {
          type: "Point",
          coordinates: coordinates
      };
      await listing.save();

      if (typeof req.file !== "undefined") {
          let url = req.file.path;
          let filename = req.file.filename;
          listing.image = { url, filename };
          await listing.save();
      }

      req.flash("success", "Listing Updated");
      res.redirect(`/listings/${id}`);

  } catch (error) {
      console.error("Geocoding Error (Update):", error);
      req.flash("error", "Failed to update location coordinates. Please try again.");
      res.redirect(`/listings/${id}/edit`);
  }
};


module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};
