import './header.css';
import {useMemo} from "react";

export default function Header() {
  const isAboutMePage = useMemo(
    () => window.location.href.toLowerCase().indexOf('about-me') > -1,
    []
  );

  return (
    <>
      <div className="header">
        Katriyna
      </div>
      <div className="headerNavigation">
        <div className={`headerNavigationItem ${isAboutMePage ? 'headerNavigationItemFocused' : ''}`}>
          <a className="headerNavigationItemLink" href="/main?page=about-me">
            About me
          </a>
        </div>
        <div className={`headerNavigationItem ${isAboutMePage ? '' : 'headerNavigationItemFocused'}`}>
          <a className="headerNavigationItemLink" href="/main?page=watercolors">
            Watercolors
          </a>
        </div>
      </div>
    </>
  );
}
