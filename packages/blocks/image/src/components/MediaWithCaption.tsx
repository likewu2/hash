import React, { VFC } from "react";
import { tw } from "twind";
import Pencil from "../svgs/Pencil";
import { ResizeImageBlock } from "./ResizeImageBlock";

type MediaWithCaptionProps = {
  src: string;
  caption: string;
  onCaptionChange: (caption: string) => void;
  onCaptionConfirm: () => void;
  onReset: () => void;
  type: "image" | "video";
} & (
  | {
      type: "image";
      width: number | undefined;
      onWidthChange: (width: number) => void;
    }
  | {
      type: "video";
    }
);

export const MediaWithCaption: VFC<MediaWithCaptionProps> = ({
  caption,
  src,
  onCaptionChange,
  onCaptionConfirm,
  onReset,
  ...props
}) => {
  const captionNode = (
    <input
      placeholder="Add a caption"
      className={tw`focus:outline-none text-center mt-3`}
      type="text"
      value={caption}
      onChange={(event) => onCaptionChange(event.target.value)}
      onBlur={onCaptionConfirm}
    />
  );
  return (
    <div className={tw`flex justify-center text-center w-full`}>
      {props.type === "image" ? (
        <div className={tw`flex flex-col`}>
          <ResizeImageBlock
            imageSrc={src}
            width={props.width}
            updateWidth={props.onWidthChange}
          />

          {captionNode}
        </div>
      ) : (
        <div className={tw`max-w-full`}>
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video
            controls
            style={{
              maxWidth: "100%",
            }}
            src={src ?? ""}
          />
          {captionNode}
        </div>
      )}
      <button
        type="button"
        onClick={onReset}
        className={tw`ml-2 bg-gray-100 p-1.5 border-1 border-gray-300 rounded-sm self-start`}
      >
        <Pencil />
      </button>
    </div>
  );
};
