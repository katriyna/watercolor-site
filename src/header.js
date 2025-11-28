import './header.css';

export default function Header() {
  return (
    <>
      <div className="header">
        Katriyna
      </div>
      <div className="headerNavigation">
        <div className="headerNavigationItem">
          <div className="headerNavigationItemLink">
            About me
          </div>
        </div>
        <div className="headerNavigationItem headerNavigationItemFocused">
          <div className="headerNavigationItemLink">
            Watercolors
          </div>
        </div>
      </div>
    </>
  );
}
