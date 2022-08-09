import { TooltipHost, ProgressIndicator, Stack } from "@fluentui/react";
import { Character } from "../../Types/LocalStructures";
import LevelUpData from "../../Data/LevelUp";

const XpBar: React.FC<{ character: Character }> = ({ character }) => {
  if (!character.player) {
    return (
      <TooltipHost content="Could not find player for this character">
        <ProgressIndicator />
      </TooltipHost>
    );
  }

  const characterXp = character.player.xp;

  const achievedLevels = LevelUpData.filter(
    (level) => characterXp >= level.xpRequired
  );

  const currentLevel = LevelUpData[achievedLevels.length - 1];
  const nextLevel = LevelUpData[achievedLevels.length];

  const xpForCurrent = currentLevel.xpRequired;
  const xpForNext = nextLevel.xpRequired;

  const xpBetweenLevels = xpForNext - xpForCurrent;
  const xpIntoCurrentLevel = characterXp - xpForCurrent;

  return (
    <TooltipHost content={`${xpIntoCurrentLevel} / ${xpBetweenLevels}`}>
      <Stack verticalFill verticalAlign="center">
        <ProgressIndicator
          barHeight={3}
          percentComplete={xpIntoCurrentLevel / xpBetweenLevels}
          styles={{
            itemProgress: {
              padding: 0,
            },
          }}
        />
      </Stack>
    </TooltipHost>
  );
};

export default XpBar;
