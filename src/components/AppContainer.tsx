import { FC } from "react";
import { Container, MenuItem, Select } from "@mui/material";
import { Box } from "@mui/system";
import { useTranslation } from "react-i18next";

const AppContainer: FC = ({ children }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Container fixed sx={{ px: 0 }}>
      <Box sx={{ p: 1 }}>
        <a href="/">
          <img src="/logo.svg" alt="Hakem.club" style={{ height: "1.5rem" }} />
        </a>
        {i18n.language && (
          <Select
            size="small"
            style={{ marginLeft: "1rem", height: "1.5rem" }}
            defaultValue={i18n.language}
            onChange={(e) => {
              changeLanguage(e.target.value);
            }}
          >
            <MenuItem value="en">{t("en")}</MenuItem>
            <MenuItem value="fa">{t("fa")}</MenuItem>
          </Select>
        )}
      </Box>
      <Box
        sx={{
          boxShadow: "0 3px 10px rgb(0 0 0 / 5%)",
          backgroundColor: "white",
        }}
      >
        {children}
      </Box>
      <Box sx={{ margin: 1, color: "#aaa" }}>
        <div>
          {t("open-source-client")}:
          <a href="https://github.com/hakem-club/courtpiece-web">
            @hakem-club/courtpiece-web
          </a>
        </div>
      </Box>
    </Container>
  );
};

export default AppContainer;
