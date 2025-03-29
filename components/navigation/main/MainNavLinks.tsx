import { NavbarHomeConnection } from "@/components/navigation/home-connection/NavbarHomeConnection";
import { GithubLink } from "@/components/navigation/links/GithubLink";
import { SupportLink } from "@/components/navigation/links/SupportLink";

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
