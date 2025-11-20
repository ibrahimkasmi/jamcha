import { Link } from "wouter";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { t } from "@/lib/i18n";
import { Accordion } from "@/components/ui/accordion";

import talyin_light from "@/assets/talyin_light.png";

export function Footer() {
  const footerLinks = {
    categories: [
      { name: t("category.politics"), href: "/politics" },
      { name: t("category.culture"), href: "/culture" },
      { name: t("category.sports"), href: "/sports" },
      { name: t("category.economy"), href: "/economy" },
      { name: t("category.society"), href: "/society" },
    ],
    company: [
      { name: t("footer.aboutUs"), href: "/about" },
      { name: t("footer.contactUs"), href: "/contact" },
      { name: t("footer.advertise"), href: "/advertise" },
    ],
    support: [
      { name: t("footer.helpCenter"), href: "/help" },
      { name: t("footer.rss"), href: "/rss" },
    ],
  };

  const socialLinks = [
    { icon: Youtube, href: "#" },
    { icon: Instagram, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Facebook, href: "#" },
  ];

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col items-center text-center">
          {/* Brand + Divider + Socials */}
          <div className="mb-8 flex flex-col items-center w-full">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4 w-full">
              {/* Brand + Logo */}
              <div className="flex items-center gap-2">
                <img
                  src={talyin_light}
                  alt="Talyin Logo"
                  className="h-20 w-auto object-contain"
                />
                {/* <span className="text-2xl font-bold">{t('footer.brandName')}</span> */}
              </div>
              {/* Divider */}
              <span className="hidden sm:inline-block h-8 border-r border-gray-700 mx-4" />
              {/* Social Links */}
              <div className="flex gap-4 mt-4 sm:mt-0">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-transform duration-300 hover:scale-110"
                    aria-label={`social-link-${index}`}
                  >
                    <social.icon className="h-6 w-6" />
                  </a>
                ))}
              </div>
            </div>
            <p className="text-gray-400 max-w-md mx-auto mt-2">
              {t("footer.brandDescription")}
            </p>
          </div>

          {/* Links Section - Accordion on mobile */}
          <div className="w-full md:hidden">
            <Accordion type="single" collapsible className="w-full">
              {/* ...existing code... */}
            </Accordion>
          </div>
        </div>

        {/* Links Section - Grid on desktop */}
        <div className="hidden md:grid grid-cols-3 gap-8 mt-8 pt-8 border-t border-gray-800">
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.categories")}
            </h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.company")}
            </h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="text-center md:text-right">
            <h4 className="text-lg font-semibold mb-4">
              {t("footer.support")}
            </h4>
            <ul className="space-y-2">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-500">
          <p className="mb-4 sm:mb-0">{t("footer.copyright")}</p>
          <div className="flex space-x-4">
            <Link href="/terms" className="hover:text-white transition-colors">
              {t("footer.termsAndConditions")}
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white transition-colors"
            >
              {t("footer.privacyPolicy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
