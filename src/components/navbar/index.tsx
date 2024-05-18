import { PAGES } from "@/data/page-map";
import { USER_ROLES, User } from "@/types/user.types";
import { Container } from "../container";
import NavLink from "./nav-link";

interface NavbarProps {
  user?: User;
}

export default function Navbar(props: NavbarProps) {
  const { user } = props;

  return (
    <nav className=" flex h-[10rem] items-center text-white ">
      <Container className=" h-fit ">
        <div className=" flex h-[5rem] justify-end gap-x-12 gap-y-4 rounded-xl bg-white/20 px-3 text-lg backdrop-blur-md sm:flex-row sm:px-8 ">
          {user && (
            <div className=" mx-auto flex w-fit items-center gap-x-7 sm:mx-0 ">
              <NavLink href={PAGES.HOME} className=" ">
                Dashboard
              </NavLink>

              {user.role === USER_ROLES.ADMIN && (
                <>
                  <NavLink href={PAGES.ASSETS} className=" ">
                    Assets
                  </NavLink>
                </>
              )}

              {user.role === USER_ROLES.USER && (
                <>
                  <NavLink href={"/sales"} className=" ">
                    Sales
                  </NavLink>
                </>
              )}

              <button
                onClick={() => {
                  // TODO add logout server action
                }}
                className=" w-fit bg-transparent hover:bg-transparent hover:underline hover:underline-offset-4 "
              >
                Log out
              </button>
            </div>
          )}
        </div>
      </Container>
    </nav>
  );
}
