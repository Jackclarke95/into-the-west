import { url } from "node:inspector";
import React, { useState, useEffect } from "react";
import { firestore } from "../firebase.utils";

const TestImages = ({ name }) => {
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    firestore
      .ref(`Avatars/${name}`)
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) => console.log("Errors while downloading => ", e));
  }, []);

  return (
    <>
      <h3>{name}</h3>
      <img
        style={{ height: 50, width: 50, objectFit: "cover" }}
        src={imageUrl}
      />
    </>
  );
};

export default TestImages;
