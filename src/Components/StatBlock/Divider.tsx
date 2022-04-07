import { Image, ImageFit } from "@fluentui/react";
import StatBlockDivider from "../../Images/StatBlocks/Stat Block Divider.png";

export const Divider = () => {
  return (
    <Image
      src={StatBlockDivider}
      height={10}
      imageFit={ImageFit.contain}
      styles={{
        root: {
          minHeight: "10px",
          width: "350px",
        },
      }}
    />
  );
};
