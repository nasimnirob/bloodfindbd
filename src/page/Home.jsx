import { Heart, Users, UserRoundPlus, ShieldCheck, Clock, Globe, Sparkles, ArrowRight, Search, BellRing, HandHeart, Droplet, MapPin, Quote, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../providers/AuthProviders";
import { useContext } from "react";
import HomeSkeleton from "../component/HomeSkeleton";

const stats = [
    { label: "Registered Donors", value: "12,400+" },
    { label: "Lives Saved", value: "8,900+" },
    { label: "Cities Covered", value: "64" },
    { label: "Requests Fulfilled", value: "97%" },
];

const steps = [
    {
        icon: UserRoundPlus,
        title: "Register",
        desc: "Sign up as a donor with your blood group, location, and contact info.",
    },
    {
        icon: Search,
        title: "Get Matched",
        desc: "Our AI matches nearby donors with people who need blood, instantly.",
    },
    {
        icon: BellRing,
        title: "Get Notified",
        desc: "Receive a request alert by SMS or app notification when someone nearby needs your blood group.",
    },
    {
        icon: HandHeart,
        title: "Donate & Save",
        desc: "Confirm availability, meet up, and save up to 3 lives with one donation.",
    },
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const urgentRequests = [
    { name: "Rafiq Islam", group: "O-", location: "Dhanmondi, Dhaka", time: "2 hours ago" },
    { name: "Sadia Akter", group: "AB+", location: "Chattogram", time: "5 hours ago" },
    { name: "Tanvir Ahmed", group: "B+", location: "Sylhet", time: "1 day ago" },
];

const features = [
    {
        icon: ShieldCheck,
        title: "Verified Donors",
        desc: "Every donor profile is verified for accurate blood group and contact details.",
    },
    {
        icon: Clock,
        title: "24/7 Availability",
        desc: "Emergency requests are matched round the clock, no waiting for office hours.",
    },
    {
        icon: Sparkles,
        title: "AI-Powered Matching",
        desc: "Smart matching connects the nearest, most compatible donor first.",
    },
    {
        icon: Globe,
        title: "Nationwide Network",
        desc: "Donors and recipients across every division, growing every day.",
    },
];

const testimonials = [
    {
        name: "Mahmudul Hasan",
        role: "Recipient's family",
        quote:
            "We needed O- blood for my father at 2am and found a donor within 20 minutes. This platform is a lifesaver, literally.",
    },
    {
        name: "Nusrat Jahan",
        role: "Regular donor",
        quote:
            "I've donated 4 times through Blood Find BD. The notification system makes it so easy to know when I'm needed nearby.",
    },
];

const Home = () => {
    const { loading } = useContext(AuthContext);
    if (loading) {
        return (
            // <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-rose-50">

            //     <div className="flex flex-col items-center gap-3">

            //         <div className="h-10 w-10 animate-spin rounded-full border-4 border-red-100 border-t-red-600" />

            //         <p className="text-sm font-medium text-gray-500">
            //             Loading account...
            //         </p>

            //     </div>

            // </div>

            <HomeSkeleton></HomeSkeleton>
        )
    }
    return (
        <div className="w-full bg-linear-to-b from-rose-50 via-rose-50/60 to-white">
            {/* ---------- HERO ---------- */}
            <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-105 overflow-hidden">
                <svg
                    className="absolute -top-10 left-1/2 w-[140%] -translate-x-1/2"
                    viewBox="0 0 1440 400"
                    fill="none"
                >
                    <path
                        d="M0 220C240 300 480 120 720 160C960 200 1200 340 1440 240V0H0V220Z"
                        fill="url(#heroGradient)"
                        opacity="0.6"
                    />
                    <defs>
                        <linearGradient id="heroGradient" x1="0" y1="0" x2="1440" y2="0" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#FDE4E7" />
                            <stop offset="1" stopColor="#FBCFD6" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>

            <section className="relative flex max-w-[1920px] mx-auto md:h-220 sm:h-200 h-250 flex-col items-center justify-center px-6 md:pt-16 pb-20 text-center">
                <div className="-mt-30 mb-8 inline-flex items-center gap-2 rounded-full border border-red-200 bg-white/80 px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm backdrop-blur">
                    <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                    </span>
                    Live Global Network
                    <Globe className="h-4 w-4 text-gray-400" />
                </div>

                <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-gray-900 sm:text-6xl py-6">
                    Donate Blood.
                    <br />
                    <span className="text-red-600">Save Lives.</span>
                    <br />
                    Instantly.
                </h1>

                <p className="mt-6 max-w-2xl text-lg text-gray-500">
                    Connect with blood donors worldwide through our AI-powered platform.
                    Every donation saves up to <span className="font-semibold text-gray-700">3 lives</span>.
                </p>

                <div className="mt-9 flex flex-col gap-4 sm:flex-row py-5">
                    <Link to='/available-donors' className="group inline-flex items-center justify-center gap-2 rounded-full bg-red-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700">
                        <Heart className="h-5 w-5 fill-white" />
                        I Need Blood
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>

                    <Link to='/donate' className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-red-200 bg-white px-7 py-3.5 font-semibold text-red-600 transition hover:bg-red-50">
                        <Users className="h-5 w-5" />
                        I Want to Donate
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
                    <span className="inline-flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-emerald-500" />
                        100% Secure
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-sky-500" />
                        24/7 Available
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Globe className="h-4 w-4 text-violet-500" />
                        Global Network
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4 text-amber-400" />
                        AI-Powered Matching
                    </span>
                </div>
            </section>

            {/* ---------- STATS ---------- */}
            <section className="relative mx-auto -mt-16 max-w-6xl px-6">
                <div className="grid grid-cols-2 gap-6 rounded-2xl border border-red-100 bg-white/90 p-8 shadow-[0_8px_30px_rgba(220,38,38,0.08)] backdrop-blur sm:grid-cols-4">
                    {stats.map((s) => (
                        <div key={s.label} className="text-center">
                            <p className="text-3xl font-extrabold text-red-600">{s.value}</p>
                            <p className="mt-1 text-sm text-gray-500">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- HOW IT WORKS ---------- */}
            <section className="mx-auto max-w-6xl px-6 py-24">
                <div className="mb-14 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        How It Works
                    </h2>
                    <p className="mt-3 text-gray-500">
                        Four simple steps between a donor and a life saved.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, i) => (
                        <div
                            key={step.title}
                            className="relative rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                        >
                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">
                                {i + 1}
                            </span>
                            <div className="mx-auto mb-4 mt-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                <step.icon className="h-6 w-6" />
                            </div>
                            <h3 className="font-bold text-gray-900">{step.title}</h3>
                            <p className="mt-2 text-sm text-gray-500">{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- FIND BY BLOOD GROUP ---------- */}
            <section className="bg-white py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Find Donors by Blood Group
                        </h2>
                        <p className="mt-3 text-gray-500">
                            Tap a blood group to see available donors near you.
                        </p>
                    </div>

                    <div className="grid grid-cols-4 gap-4 sm:grid-cols-8">
                        {bloodGroups.map((bg) => (
                            <Link
                                key={bg}
                                to={`/available-donors?group=${encodeURIComponent(bg)}`}
                                className="group flex flex-col items-center justify-center gap-1 rounded-2xl border border-red-100 bg-rose-50/50 py-6 font-bold text-red-600 transition hover:bg-red-600 hover:text-white"
                            >
                                <Droplet className="h-5 w-5 fill-current" />
                                {bg}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- URGENT REQUESTS ---------- */}
            <section className="mx-auto max-w-6xl px-6 py-24">
                <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Urgent Requests
                        </h2>
                        <p className="mt-3 text-gray-500">
                            Real people who need blood right now — you could be their match.
                        </p>
                    </div>
                    <Link
                        to="/donate"
                        className="inline-flex items-center gap-1 text-sm font-semibold text-red-600 hover:underline"
                    >
                        View all requests
                        <ArrowRight className="h-4 w-4" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {urgentRequests.map((req) => (
                        <div
                            key={req.name}
                            className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm transition hover:shadow-lg"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-600 font-bold text-white">
                                    {req.group}
                                </div>
                                <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
                                    Urgent
                                </span>
                            </div>
                            <h3 className="mt-4 font-bold text-gray-900">{req.name}</h3>
                            <p className="mt-1 inline-flex items-center gap-1 text-sm text-gray-500">
                                <MapPin className="h-3.5 w-3.5" />
                                {req.location}
                            </p>
                            <p className="mt-1 text-xs text-gray-400">{req.time}</p>
                            <Link
                                to="/donate-request"
                                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                            >
                                <Heart className="h-4 w-4 fill-white" />
                                Respond
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- WHY CHOOSE US ---------- */}
            <section className="bg-white py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-14 text-center">
                        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Why Blood Find BD
                        </h2>
                        <p className="mt-3 text-gray-500">
                            Built for speed, trust, and reach when it matters most.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
                        {features.map((f) => (
                            <div key={f.title} className="text-center">
                                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                                    <f.icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-bold text-gray-900">{f.title}</h3>
                                <p className="mt-2 text-sm text-gray-500">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ---------- TESTIMONIALS ---------- */}
            <section className="mx-auto max-w-6xl px-6 py-24">
                <div className="mb-14 text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Stories That Matter
                    </h2>
                    <p className="mt-3 text-gray-500">
                        Real donors, real recipients, real impact.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                    {testimonials.map((t) => (
                        <div
                            key={t.name}
                            className="relative rounded-2xl border border-red-100 bg-white p-8 shadow-sm"
                        >
                            <Quote className="h-8 w-8 text-red-100" />
                            <p className="mt-4 text-gray-600">{t.quote}</p>
                            <p className="mt-6 font-bold text-gray-900">{t.name}</p>
                            <p className="text-sm text-gray-400">{t.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------- CTA BANNER ---------- */}
            <section className="mx-auto max-w-6xl px-6 pb-24">
                <div className="relative overflow-hidden rounded-3xl bg-red-600 px-8 py-14 text-center shadow-xl shadow-red-200 sm:px-16">
                    <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
                    <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10" />
                    <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
                        Be Someone's Reason to Live
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-red-50">
                        Register as a donor today. It takes 5 minutes and could save a life tomorrow.
                    </p>
                    <Link
                        to="/donate"
                        className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 font-semibold text-red-600 shadow-lg transition hover:bg-red-50"
                    >
                        <UserPlus className="h-5 w-5" />
                        Become a Donor
                    </Link>
                </div>
            </section>

        </div>
    );
}

export default Home;
