import * as React from "react";
import TreeItem, {
  TreeItemProps,
  useTreeItem,
  TreeItemContentProps,
} from "@mui/lab/TreeItem";
// import clsx from "clsx";
import { Box, IconButton, Typography } from "@mui/material";
import { faChevronRight, faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeSvgIcon } from "../../../icons";

type CustomContentProps = TreeItemContentProps & { hasChildren?: boolean };

// inspiration gotten from @see https://mui.com/components/tree-view/#IconExpansionTreeView.tsx
const CustomContent = React.forwardRef((props: CustomContentProps, ref) => {
  const {
    // classes,
    // className,
    label,
    nodeId,
    //   icon: iconProp,
    //   expansionIcon,
    //   displayIcon,
    hasChildren,
  } = props;

  const {
    // disabled,
    expanded,
    selected,
    // focused,
    handleExpansion,
    handleSelection,
    preventSelection,
  } = useTreeItem(nodeId);

  // const icon = iconProp || expansionIcon || displayIcon || (
  //   <FontAwesomeSvgIcon icon={faChevronRight} sx={{ fontSize: 12 }} />
  // );

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    preventSelection(event);
  };

  const handleExpansionClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    handleExpansion(event);
  };

  const handleSelectionClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) => {
    handleSelection(event);
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <Box
      // className={clsx(className, classes.root, {
      //   [classes.expanded]: expanded,
      //   [classes.selected]: selected,
      //   [classes.focused]: focused,
      //   [classes.disabled]: disabled,
      // })}
      onMouseDown={handleMouseDown}
      ref={ref as React.Ref<HTMLDivElement>}
      sx={{
        display: "flex",
        alignItems: "center",
        px: 1,
        py: 1,

        "&:hover": {
          backgroundColor: ({ palette }) => palette.gray[20],
          borderRadius: "4px",
        },

        ...(selected && {
          backgroundColor: ({ palette }) => palette.gray[20],
          borderRadius: "4px",
        }),
      }}
    >
      <IconButton
        onClick={handleExpansionClick}
        sx={{
          visibility: "hidden",
          pointerEvents: "none",
          height: 20,
          width: 20,
          mr: 0.5,

          ...(hasChildren && {
            visibility: "visible",
            pointerEvents: "auto",

            transform: expanded ? `rotate(90deg)` : "none",
            transition: ({ transitions }) =>
              transitions.create("transform", { duration: 300 }),
          }),
        }}
      >
        <FontAwesomeSvgIcon icon={faChevronRight} sx={{ fontSize: 12 }} />
      </IconButton>
      <FontAwesomeSvgIcon
        icon={faFile}
        sx={{
          fontSize: 16,
          mr: 1,
          color: ({ palette }) => palette.gray[50],
        }}
      />
      {/* <Link noLinkStyle href="/" sx={{ flex: 1, border: "1px solid red" }}> */}
      {/* @todo-mui this should be switched to our button component once we all the styles implemented */}
      <Box
        component="button"
        onClick={handleSelectionClick}
        sx={{
          border: "1px solid black",
          flex: 1,
          width: "100%",
          outline: "none",
        }}
      >
        <Typography
          variant="smallTextLabels"
          // onClick={handleSelectionClick}
          //   className={classes.label}
          sx={{
            color: ({ palette }) => palette.gray[70],
          }}
        >
          {label}
        </Typography>
      </Box>

      {/* </Link> */}
    </Box>
  );
});

export const PageTreeItem = (
  props: TreeItemProps & { hasChildren?: boolean },
) => {
  const { hasChildren, ...otherProps } = props;

  return (
    <TreeItem
      ContentComponent={CustomContent}
      {...otherProps}
      ContentProps={{
        hasChildren,
      }}
    />
  );
};
