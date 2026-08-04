import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

// Remembers scroll position per route (like browser back/forward).
// - First visit to a path -> starts at top.
// - Revisiting a path -> restores exactly where you left off.
//
// Place inside the scrollable container, next to <Outlet />:
//   <div ref={scrollRef} className="flex-1 overflow-y-auto">
//       <ScrollRestoration scrollContainerRef={scrollRef} />
//       <Outlet />
//   </div>
const positions = new Map(); // pathname -> scrollTop, persists across renders (module scope)

const ScrollRestoration = ({ scrollContainerRef }) => {
    const { pathname } = useLocation();
    const prevPathname = useRef(pathname);

    // Save the scroll position of the page we're LEAVING, right before the new one paints.
    useLayoutEffect(() => {
        const container = scrollContainerRef?.current;
        const leavingPath = prevPathname.current;

        if (leavingPath !== pathname) {
            const leavingScrollTop = container ? container.scrollTop : window.scrollY;
            positions.set(leavingPath, leavingScrollTop);
        }

        // Restore (or default to top for a first-time visit) for the page we're ENTERING.
        const target = positions.has(pathname) ? positions.get(pathname) : 0;

        if (container) {
            container.scrollTo({ top: target });
        } else {
            window.scrollTo({ top: target });
        }

        prevPathname.current = pathname;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pathname]);

    // Continuously track scroll position of the CURRENT page while the user scrolls,
    // so it's up to date whenever they navigate away.
    useEffect(() => {
        const container = scrollContainerRef?.current || window;

        const handleScroll = () => {
            const scrollTop = scrollContainerRef?.current
                ? scrollContainerRef.current.scrollTop
                : window.scrollY;
            positions.set(pathname, scrollTop);
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [pathname, scrollContainerRef]);

    return null;
};

export default ScrollRestoration;
