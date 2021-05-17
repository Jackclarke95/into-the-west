import { url } from "node:inspector";
import React, { useState, useEffect } from "react";
import { isTemplateSpan } from "typescript";
import { fireStore } from "../firebase.utils";

const TestImages = ({ name }) => {
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    fireStore
      .ref(`Avatars/${name}.jpeg`)
      .getDownloadURL()
      .then((url) => {
        setImageUrl(url);
      })
      .catch((e) => console.log("Errors while downloading => ", e));
  }, []);

  return (
    <img style={{ height: 50, width: 50, objectFit: "cover" }} src={imageUrl} />
  );
};

export default TestImages;
