import React from "react";
import { Character } from "../Types/LocalStructures";
import Card from "./Surfaces/Card";
import DefaultAvatar from "../Images/DefaultAvatar.jpeg";
import LevelUpData from "../Data/LevelUp";
import ClassIcon from "./ClassIcon";

const CharacterCard: React.FC<{ character: Character }> = ({ character }) => {
  const XpBar = () => {
    const characterXp = character.player?.xp ?? 0;

    const achievedLevels = LevelUpData.filter(
      (level) => characterXp >= level.xpRequired
    );

    const currentLevel = LevelUpData[achievedLevels.length - 1];
    const nextLevel = LevelUpData[achievedLevels.length];

    const xpForCurrent = currentLevel.xpRequired;
    const xpForNext = nextLevel.xpRequired;

    const xpBetweenLevels = xpForNext - xpForCurrent;
    const xpIntoCurrentLevel = characterXp - xpForCurrent;
    const xpPercentage = (xpIntoCurrentLevel / xpBetweenLevels) * 100;

    return (
      <div className="xp-bar-container">
        <div
          className="xp-bar"
          title={`${xpIntoCurrentLevel} / ${xpBetweenLevels} XP`}
        >
          <div
            className="progress"
            style={{
              width: `${xpPercentage}%`,
            }}
          ></div>
        </div>
        <div className="xp-description">{`${xpIntoCurrentLevel}/${xpBetweenLevels}`}</div>
      </div>
    );
  };

  const onRenderCharacterClasses = () => {
    return character.classes.map((cls) => (
      <div className="class-container">
        <ClassIcon key={cls.class} className={cls.class} />
        <div className="class-name">
          {character.classes.length > 1
            ? `${cls.class} (${cls.level})`
            : cls.class}
        </div>
      </div>
    ));
  };

  return (
    <Card>
      <div className="character-card">
        <div className="character-body">
          <img
            className="avatar"
            src={character.avatarUrl ?? DefaultAvatar}
            alt="Character Avatar URL"
            title={`${character.fullName} Avatar`}
          />
          <div className="character-details">
            <h3 className="name">{character.fullName}</h3>
            <div className="classes">{onRenderCharacterClasses()}</div>
            <div className="race">{`${character.race.subrace ?? ""} ${
              character.race.race
            }`}</div>
          </div>
        </div>
        <XpBar />
      </div>
    </Card>
  );
};

export default CharacterCard;
