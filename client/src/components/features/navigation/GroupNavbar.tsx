import { NavItems } from "./NavItems";

function GroupNavbar() {
    return (
        <nav
            className="sticky overflow-x-auto text-nowrap top-16 left-0 right-0 flex items-center justify-between px-4 py-2 min-h-16 bg-surface border-b border-border text-xs md:text-base z-99999"
            role="navigation"
            aria-label="Main navigation"
        >
            <NavItems navType="group" />
        </nav>
    );
}

export default GroupNavbar;
