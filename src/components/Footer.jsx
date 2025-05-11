import React from "react";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gradient-to-r from-cyan-500 to-blue-500 p-6 text-center text-white">
      <div className="container mx-auto">
        <p className="text-lg">
          © {new Date().getFullYear()} {t("appName")}. All Rights Reserved.
        </p>
        
      </div>
    </footer>
  );
};

export default Footer;
