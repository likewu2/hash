import { BlockComponent } from "blockprotocol/react";
import React from "react";
import { Media } from "@hashintel/block-image/src/components/Media";

type AppProps = {
  initialCaption?: string;
  url?: string;
};

export const Video: BlockComponent<AppProps> = (props) => (
  <Media {...props} mediaType="video" />
);
