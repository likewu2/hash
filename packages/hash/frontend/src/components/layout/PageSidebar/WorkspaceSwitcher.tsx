import { VFC, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Menu,
  MenuItem,
  Divider,
  menuItemClasses,
  ListItemText,
  ListItemAvatar,
  listItemTextClasses,
} from "@mui/material";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import {
  usePopupState,
  bindTrigger,
  bindMenu,
} from "material-ui-popup-state/hooks";
import { FontAwesomeIcon } from "../../icons";
import { Link } from "../../Link";
import { useUser } from "../../hooks/useUser";
import { Avatar } from "../../Avatar";
import { Button } from "../../Button";
import { useLogout } from "../../hooks/useLogout";

type WorkspaceSwitcherProps = {};

const truncateText = (text: string) => {
  if (text.length > 18) {
    return `${text.slice(0, 15)}...`;
  }
  return text;
};

export const WorkspaceSwitcher: VFC<WorkspaceSwitcherProps> = () => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popupState = usePopupState({
    variant: "popover",
    popupId: "workspace-switcher-menu",
  });
  const { user } = useUser();
  const { logout } = useLogout();
  const { query } = useRouter();

  const activeWorkspace = useMemo(() => {
    const activeAccountId = query.accountId as string;
    let accountName = "";

    if (user && activeAccountId === user.accountId) {
      accountName = user.properties.preferredName || user.properties.shortname!;
    } else {
      const activeOrg = user?.memberOf.find(
        ({ org }) => org.accountId === activeAccountId,
      )?.org;

      if (activeOrg) {
        accountName = activeOrg.properties.name;
      }
    }

    return { name: accountName || "User" };
  }, [query, user]);

  const workspaceList = useMemo(() => {
    return [
      {
        key: user?.accountId ?? "currentUser",
        url: "/",
        title: "My personal workspace",
        subText: `@${user?.properties.shortname ?? "user"}`,
        avatarTitle: user?.properties.preferredName ?? "U",
      },
      ...(user?.memberOf ?? []).map(({ org }) => ({
        key: org.accountId,
        url: `/${org.accountId}`,
        title: org.properties.name,
        subText: `${org.memberships.length} members`,
        avatarTitle: org.properties.name,
      })),
    ];
  }, [user]);

  return (
    <Box>
      <Button
        ref={buttonRef}
        variant="tertiary_quiet"
        fullWidth
        sx={{
          backgroundColor: "transparent",
          padding: "12px 16px 12px 18px",
          justifyContent: "flex-start",
          textAlign: "left",
        }}
        {...bindTrigger(popupState)}
      >
        <Avatar size={24} title={activeWorkspace.name} />
        <Typography
          sx={{
            pr: 1,
            pl: 1,
            overflowX: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            color: ({ palette }) => palette.gray[80],
            fontWeight: 600,
          }}
          variant="smallTextLabels"
        >
          {truncateText(activeWorkspace.name)}
        </Typography>
        <FontAwesomeIcon
          icon={faChevronDown}
          sx={{ fontSize: 12, color: ({ palette }) => palette.gray[70] }}
        />
      </Button>

      <Menu
        {...bindMenu(popupState)}
        MenuListProps={{
          sx: {
            paddingTop: "10px",
            paddingBottom: "6px",
          },
        }}
      >
        {workspaceList.map(({ title, subText, url, key }) => (
          <MenuItem
            key={key}
            sx={{
              [`&.${menuItemClasses.focusVisible}`]: {
                backgroundColor: "red",
              },
            }}
          >
            <Link
              href={url}
              noLinkStyle
              sx={{
                display: "flex",
              }}
            >
              <ListItemAvatar>
                <Avatar
                  size={34}
                  title={user?.properties.preferredName ?? "U"}
                />
              </ListItemAvatar>

              <ListItemText
                primary={title}
                secondary={subText}
                primaryTypographyProps={{ fontWeight: 600 }}
              />
            </Link>
          </MenuItem>
        ))}

        <Divider />

        {[
          {
            title: "Workspace Settings",
            id: 1,
            href: "/",
          },
          {
            title: "Create or Join a workspace",
            id: 2,
            href: "/",
          },
        ].map(({ title, id, href }) => (
          <MenuItem key={id}>
            <Link key={id} href={href} noLinkStyle>
              <ListItemText primary={title} />
            </Link>
          </MenuItem>
        ))}
        <Divider />
        <MenuItem
          sx={{
            [`& .${listItemTextClasses.primary}`]: {
              color: ({ palette }) => palette.gray[60],
            },
          }}
          onClick={() => logout()}
        >
          <ListItemText primary="Sign out" />
        </MenuItem>
      </Menu>
    </Box>
  );
};
