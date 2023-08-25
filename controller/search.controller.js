const User = require("../models/users.model");
const { distanceCal } = require("../utils/measureDistance");

const searchChildCarer = async (req, res) => {
  const { city, gender } = req.query;
  const offerProvide = req.body.offerProvide || [];
  const userAddress = req.body.userAddress;

  let searchedDistance;

  if (city) {
    const searchedLocation = await distanceCal(city, userAddress);
    searchedDistance = searchedLocation;
  }

  const filtering = [{ $match: { role: "childcarer" } }];

  if (gender) {
    filtering.push({ $match: { gender: gender } });
  }
  if (offerProvide.length > 0) {
    filtering.push({
      $match: {
        offerProvide: {
          $elemMatch: {
            $in: offerProvide,
          },
        },
      },
    });
  }

  try {
    if (searchedDistance) {
      if (searchedDistance > 100) {
        res.status(400).send("Error");
      }
    }

    const filteredUser = await User.aggregate(filtering);
    if (filteredUser.length > 0) {
      const users = [];
      for (i = 0; i < filteredUser.length; i++) {
        const distance = await distanceCal(
          filteredUser[i].residance,
          userAddress
        );
        if (distance <= 30) {
          users.push(filteredUser[i]);
          console.log(distance);
        }
        console.log(users);
      }
    }
    res.send(filteredUser);
    console.log(userAddress, "uss");
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = { searchChildCarer };
