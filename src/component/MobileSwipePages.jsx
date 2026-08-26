import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

import Home from "../page/Home";
import Donate from "../page/Donate";
import BloodRequest from "../page/BloodRequest";
import AvailableDonors from "../page/AvailableDonors";
import Profile from "../page/Profile";

import PrivateRoute from "../route/PrivateRoute";

const pages = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/donate",
        element: (
            <PrivateRoute>
                <Donate />
            </PrivateRoute>
        ),
    },
    {
        path: "/blood-request",
        element: <BloodRequest />,
    },
    {
        path: "/available-donors",
        element: <AvailableDonors />,
    },
    {
        path: "/profile",
        element: (
            <PrivateRoute>
                <Profile />
            </PrivateRoute>
        ),
    },
];

const MobileSwipePages = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const index = pages.findIndex(
        (page) => page.path === location.pathname
    );

    // অন্য route হলে swipe system ব্যবহার হবে না
    if (index === -1) {
        return null;
    }

    const previous = pages[index - 1];
    const current = pages[index];
    const next = pages[index + 1];

    const handleDragEnd = (_, info) => {
        const { offset, velocity } = info;

        const swipeThreshold = 80;
        const velocityThreshold = 500;

        // LEFT SWIPE
        if (
            next &&
            (offset.x < -swipeThreshold ||
                velocity.x < -velocityThreshold)
        ) {
            navigate(next.path);
            return;
        }

        // RIGHT SWIPE
        if (
            previous &&
            (offset.x > swipeThreshold ||
                velocity.x > velocityThreshold)
        ) {
            navigate(previous.path);
        }
    };

    return (
        <>
            {/* ================= MOBILE ================= */}
            <div className="md:hidden w-full overflow-hidden">

                <motion.div
                    className="relative w-full"
                    drag="x"
                    dragDirectionLock
                    dragConstraints={{
                        left: next ? -window.innerWidth : 0,
                        right: previous ? window.innerWidth : 0,
                    }}
                    dragElastic={0.12}
                    onDragEnd={handleDragEnd}
                    style={{
                        touchAction: "pan-y",
                    }}
                >

                    {/* Previous Page */}
                    {previous && (
                        <div
                            className="absolute right-full top-0 w-full"
                        >
                            {previous.element}
                        </div>
                    )}

                    {/* Current Page */}
                    <div className="relative w-full">
                        {current.element}
                    </div>

                    {/* Next Page */}
                    {next && (
                        <div
                            className="absolute left-full top-0 w-full"
                        >
                            {next.element}
                        </div>
                    )}

                </motion.div>

            </div>


            {/* ================= DESKTOP ================= */}
            <div className="hidden md:block">
                {current.element}
            </div>
        </>
    );
};

export default MobileSwipePages;