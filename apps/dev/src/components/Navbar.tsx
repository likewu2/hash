import { faBars, faClose } from "@fortawesome/free-solid-svg-icons";
import {
  Box,
  Container,
  IconButton,
  Slide,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState, VFC } from "react";
import { Button } from "./Button";
import { DiscordIcon } from "./icons/DiscordIcon";
import { FaIcon } from "./icons/FaIcon";
import { FontAwesomeIcon } from "./icons/FontAwesomeIcon";
import { Logo } from "./Logo";

export const NAV_HEIGHT = 58;

const DesktopNav: VFC = () => (
  <>
    <Button
      size="medium"
      variant="tertiary"
      href="https://hash.ai"
      endIcon={<FaIcon name="arrow-up-right-from-square" type="solid" />}
    >
      Visit our main site
    </Button>
    {/** @todo these need to be nav links */}
    <Stack direction="row" spacing={2} ml="auto">
      <Button
        size="medium"
        variant="tertiary"
        startIcon={<FaIcon name="discord" type="brands" />}
        href="https://hash.ai/discord"
      >
        Chat to us on Discord
      </Button>
      <Button
        size="medium"
        variant="primary"
        startIcon={<FaIcon name="envelope" type="regular" />}
        href="#subscribe"
      >
        Join the mailing list
      </Button>
    </Stack>
  </>
);

/**
 * @todo update menu open icon colour
 */
const MobileNavButton: VFC<{ open: boolean; onOpenToggle: () => void }> = ({
  open,
  onOpenToggle,
}) => (
  <IconButton
    sx={{
      ml: "auto",
    }}
    onClick={() => onOpenToggle()}
  >
    <FontAwesomeIcon
      icon={open ? faClose : faBars}
      sx={{
        color: "gray.50",
        fontSize: 24,
      }}
    />
  </IconButton>
);

const MobileNav: VFC<{ open: boolean; onMenuClose: () => void }> = ({
  open,
  onMenuClose,
}) => {
  return (
    <Slide in={open}>
      <Box
        sx={{
          position: "fixed",
          width: 1,
          top: NAV_HEIGHT,
          bottom: 0,
          bgcolor: "white",
          zIndex: (theme) => theme.zIndex.appBar - 1,
          left: 0,
        }}
      >
        <Container sx={{ height: "100%", pt: 1, pb: 2 }}>
          <Stack height={1} spacing={1}>
            <Button
              size="large"
              variant="tertiary"
              href="https://hash.ai"
              endIcon={
                <FaIcon name="arrow-up-right-from-square" type="solid" />
              }
            >
              Visit our main site
            </Button>
            <Button
              variant="tertiary"
              startIcon={<FaIcon name="discord" type="brands" />}
              size="large"
              href="https://hash.ai/discord"
            >
              Chat to us on Discord
            </Button>
            <Button
              sx={{ mt: "auto !important" }}
              size="large"
              variant="primary"
              startIcon={<FaIcon name="envelope" type="regular" />}
              href="#subscribe"
              onClick={() => onMenuClose()}
            >
              Join the mailing list
            </Button>
          </Stack>
        </Container>
      </Box>
    </Slide>
  );
};

export const Navbar: VFC = () => {
  const theme = useTheme();
  const mobileNav = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // @todo – can replace with a breakpoint event listener or something?
  if (!mobileNav && mobileNavOpen) {
    setMobileNavOpen(false);
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          height: NAV_HEIGHT,
          bgcolor: "white",
          alignItems: "center",
          position: "fixed",
          width: "100%",
          zIndex: "appBar",
        }}
        component="nav"
      >
        <Container>
          <Stack
            direction="row"
            alignItems="center"
            sx={{ alignItems: "center" }}
          >
            <Logo mr={2} onClick={() => setMobileNavOpen(false)} />
            {mobileNav ? (
              <MobileNavButton
                open={mobileNavOpen}
                onOpenToggle={() => setMobileNavOpen(!mobileNavOpen)}
              />
            ) : (
              <DesktopNav />
            )}
          </Stack>
        </Container>
      </Box>
      {mobileNav ? (
        <MobileNav
          open={mobileNavOpen}
          onMenuClose={() => setMobileNavOpen(false)}
        />
      ) : null}
      <Box height={NAV_HEIGHT} />
    </>
  );
};
