import {
  ConnectHomeButton,
  GitHubRepositoryLink,
  MobileMenu,
  NavbarLogo,
  SupportLink,
  UserAuthSection,
} from "./components";

export interface NavbarProps {
  /** Whether the user is currently signed in */
  isSignedIn: boolean;
  /** Whether the user's home is connected to the system */
  isHomeConnected: boolean;
  /** Callback function when the connect home button is clicked */
  onOpenConnectHome: () => void;
}

// Main Navbar component
export function Navbar({
  isSignedIn,
  isHomeConnected,
  onOpenConnectHome,
}: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav
        className="container mx-auto"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <NavbarLogo />
          </div>
          {/* Desktop Navigation */}
          <div
            className="hidden lg:flex items-center gap-4"
            role="group"
            aria-label="Navigation actions"
          >
            <ConnectHomeButton
              isSignedIn={isSignedIn}
              isHomeConnected={isHomeConnected}
              onClick={onOpenConnectHome}
            />
            <div className="flex items-center gap-2">
              <GitHubRepositoryLink />
              <SupportLink />
            </div>
            <UserAuthSection isSignedIn={isSignedIn} />
          </div>
          {/* Mobile Navigation */}
          <MobileMenu
            isSignedIn={isSignedIn}
            isHomeConnected={isHomeConnected}
            onOpenConnectHome={onOpenConnectHome}
          />
        </div>
      </nav>
    </header>
  );
}
