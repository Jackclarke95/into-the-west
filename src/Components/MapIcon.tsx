import {
  IImageStyleProps,
  IImageStyles,
  Image,
  ImageFit,
  IStyleFunctionOrObject,
} from "@fluentui/react";

import TheEverwilds from "../Images/Maps/The Everwilds Preview.png";
import TheForgottenLands from "../Images/Maps/The Forgotten Lands Preview.png";
import TheLunarIsles from "../Images/Maps/The Lunar Isles Preview.png";
import TheShatteredRealms from "../Images/Maps/The Shattered Realms Preview.png";

export const MapIcon: React.FC<{
  mapName: string;
  styles?: IStyleFunctionOrObject<IImageStyleProps, IImageStyles>;
}> = ({ mapName, styles }) => {
  const mapIcons = {
    "The Everwilds": TheEverwilds,
    "The Forgotten Lands": TheForgottenLands,
    "The Lunar Isles": TheLunarIsles,
    "The Shattered Realms": TheShatteredRealms,
  };

  return (
    <Image
      src={mapIcons[mapName]}
      alt={`${mapName} Icon`}
      imageFit={ImageFit.contain}
      styles={styles ?? undefined}
    />
  );
};
