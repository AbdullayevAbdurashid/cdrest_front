import React, { useContext, useRef } from "react";
import Link from "next/link";
import cls from "./header.module.scss";
import { BrandLogo, BrandLogoDark } from "components/icons";
import SunFillIcon from "remixicon-react/SunFillIcon";
import MoonFillIcon from "remixicon-react/MoonFillIcon";
import GlobalLineIcon from "remixicon-react/GlobalLineIcon";
import BankCardLineIcon from "remixicon-react/BankCardLineIcon";
import { ThemeContext } from "contexts/theme/theme.context";
import dynamic from "next/dynamic";
import SearchContainer from "containers/searchContainer/searchContainer";
import LanguagePopover from "components/languagePopover/languagePopover";
import CurrencyList from "components/currencyList/currencyList";
import { useAuth } from "contexts/auth/auth.context";
import useModal from "hooks/useModal";
import usePopover from "hooks/usePopover";
import AddressContainer from "containers/addressContainer/addressContainer";
import SecondaryButton from "components/button/secondaryButton";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import NotificationStats from "components/notificationStats/notificationStats";

const AppDrawer = dynamic(() => import("components/appDrawer/appDrawer"));
const PopoverContainer = dynamic(() => import("containers/popover/popover"));
const ProfileDropdown = dynamic(
  () => import("components/profileDropdown/profileDropdown")
);

export default function Header() {
  const { t } = useTranslation();
  const { push } = useRouter();
  const { isDarkMode, toggleDarkMode } = useContext(ThemeContext);
  const [appDrawer, handleOpenAppDrawer, handleCloseAppDrawer] = useModal();
  const [openLang, anchorLang, handleOpenLang, handleCloseLang] = usePopover();
  const searchContainerRef = useRef(null);
  const [
    openCurrency,
    anchorCurrency,
    handleOpenCurrency,
    handleCloseCurrency,
  ] = usePopover();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className={cls.container}>
      <div className="fluid-container">
        <header className={cls.header}>
          <div className={cls.navItem}>
            {!isAuthenticated && (
              <button className={cls.menuBtn} onClick={handleOpenAppDrawer}>
                menu
              </button>
            )}
            <Link href="/" className={cls.brandLogo}>
              {isDarkMode ? <BrandLogoDark /> : <BrandLogo />}
            </Link>
          </div>
          <div
            className={`${cls.navItem} ${cls.searchBar}`}
            ref={searchContainerRef}
          >
            <div className={cls.search}>
              <SearchContainer searchContainerRef={searchContainerRef} />
            </div>
          </div>
          <div className={cls.navItem}>
            <AddressContainer />
          </div>
          <div className={cls.navItem}>
            <div className={cls.actions}>
              <button className={cls.iconBtn} onClick={toggleDarkMode}>
                {isDarkMode ? <MoonFillIcon /> : <SunFillIcon />}
              </button>
              <button className={cls.iconBtn} onClick={handleOpenLang}>
                <GlobalLineIcon />
              </button>
              <button className={cls.iconBtn} onClick={handleOpenCurrency}>
                <BankCardLineIcon />
              </button>
              <NotificationStats />
            </div>
            {isAuthenticated ? (
              <ProfileDropdown data={user} />
            ) : (
              <SecondaryButton onClick={() => push("/login")}>
                {t("login")}
              </SecondaryButton>
            )}
          </div>
        </header>
      </div>
      <AppDrawer open={appDrawer} handleClose={handleCloseAppDrawer} />
      <PopoverContainer
        open={openLang}
        anchorEl={anchorLang}
        onClose={handleCloseLang}
      >
        <LanguagePopover onClose={handleCloseLang} />
      </PopoverContainer>
      <PopoverContainer
        open={openCurrency}
        anchorEl={anchorCurrency}
        onClose={handleCloseCurrency}
      >
        <CurrencyList onClose={handleCloseCurrency} />
      </PopoverContainer>
    </div>
  );
}
