import { NavbarHomeConnection } from "@/components/nav/home-connection/NavbarHomeConnection";
import { GithubLink } from "@/components/nav/links/GithubLink";
import { SupportLink } from "@/components/nav/links/SupportLink";

export function MainNavLinks() {
  return (
    <>
      <NavbarHomeConnection />
      <div className="flex items-center gap-2">
        <GithubLink />
        <SupportLink />
      </div>
    </>
  );
}
