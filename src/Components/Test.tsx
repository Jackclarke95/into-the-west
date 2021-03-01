import React, { useState, useEffect } from "react";
import { firebaseDb } from "../firebase.utils";

const Test = () => {
  var [currentId, setCurrentId] = useState("");
  var [objects, setObjects] = useState({});

  useEffect(() => {
    firebaseDb.child("test").on("value", (snapshot) => {
      if (snapshot.val() != null) {
        setObjects({ ...snapshot.val() });
      } else {
        setObjects({});
      }
    });
  }, []);

  const addOrEdit = (obj) => {
    if (currentId === "") {
      firebaseDb.child("test").push(obj, (err) => {
        if (err) {
          console.log(err);
        } else {
          setCurrentId("");
        }
      });
    } else {
      firebaseDb.child(`Test/${currentId}`).set(obj, (err) => {
        if (err) {
          console.log(err);
        } else {
          setCurrentId("");
        }
      });
    }
  };

  const onDelete = (id) => {
    if (window.confirm("Are you sure to delete this record?")) {
      firebaseDb.child(`test/${id}`).remove((err) => {
        if (err) {
          console.log(err);
        } else {
          setCurrentId("");
        }
      });
    }
  };

  const addTestObject = () => {
    let testSession = {
      id: 28412605,
      "player-dndbeyond-name": "JackClarke",
      "avatar-link": "10423/229/1581111423-28412605.jpeg",
      name: "Alavara Liarys",
      nickname: "Alavara",
      race: "Half-elf",
      subrace: "Wood",
      classes: [{ class: "Paladin", level: 4 }],
      "starting-level": 4,
      retirement: { date: "2020 05 17", cause: "Retired by player" },
    };

    addOrEdit(testSession);
  };

  return (
    <>
      <div>Hello</div>
      <button onClick={() => addTestObject()}>TEST</button>
      <table>
        <tbody>
          {Object.keys(objects).map((key) => {
            return (
              <tr key={key} data-id={objects[key].id}>
                <td className="column name">
                  <a
                    className="avatar-link"
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`https://www.dndbeyond.com/avatars/${objects[key]["avatar-link"]}`}
                  >
                    <img
                      src={`https://www.dndbeyond.com/avatars/${objects[key]["avatar-link"]}`}
                      style={{
                        objectFit: "cover",
                        width: "30px",
                        height: "30px",
                      }}
                    />
                  </a>
                  <a
                    className="character-name"
                    rel="noopener noreferrer"
                    target="_blank"
                    href={`https://www.dndbeyond.com/profile/${objects[key]["player-dndbeyond-name"]}/characters/${objects[key].id}`}
                  >
                    {objects[key].nickname
                      ? objects[key].nickname
                      : objects[key].name}
                  </a>
                </td>{" "}
                <td>{objects[key].race}</td>
                <td>{objects[key]["starting-level"]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default Test;
