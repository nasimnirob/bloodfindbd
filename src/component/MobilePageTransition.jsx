import { AnimatePresence, motion } from "framer-motion";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const MobilePageTransition = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // যেসব page swipe navigation-এর মধ্যে থাকবে
    const routes = [
        "/",
        "/search",
        "/donate",
        "/donate-request",
        "/blood-request",
        "/profile",
        "/blood-information",
        "/available-donors",
        "/my-posts",
    ];

    const currentIndex = routes.indexOf(location.pathname);

    const handleDragEnd = (event, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // Swipe করার minimum distance
        const swipeDistance = 80;

        // Swipe Left → Next Page
        if (
            (offset < -swipeDistance || velocity < -500) &&
            currentIndex < routes.length - 1
        ) {
            navigate(routes[currentIndex + 1]);
        }

        // Swipe Right → Previous Page
        else if (
            (offset > swipeDistance || velocity > 500) &&
            currentIndex > 0
        ) {
            navigate(routes[currentIndex - 1]);
        }
    };

    return (
        <div className="relative w-full overflow-hidden md:overflow-visible">

            <AnimatePresence
                initial={false}
                custom={currentIndex}
                mode="popLayout"
            >
                <motion.div
                    key={location.pathname}
                    className="w-full touch-pan-y md:touch-auto"
                    drag="x"
                    dragDirectionLock
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.15}
                    onDragEnd={handleDragEnd}
                    initial={{
                        x: 0,
                    }}
                    animate={{
                        x: 0,
                    }}
                    exit={{
                        x: 0,
                    }}
                    transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 35,
                    }}
                >
                    <Outlet />
                </motion.div>
            </AnimatePresence>

        </div>
    );
};

export default MobilePageTransition;