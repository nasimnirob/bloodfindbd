import { useState } from "react";
import {Droplet, HeartPulse, Clock, Weight, Calendar, ShieldCheck, Coffee, Utensils, Bandage, Timer, CheckCircle2, XCircle} from "lucide-react";

const bloodGroups = [
  { group: "A+", givesTo: ["A+", "AB+"], receivesFrom: ["A+", "A-", "O+", "O-"] },
  { group: "A-", givesTo: ["A+", "A-", "AB+", "AB-"], receivesFrom: ["A-", "O-"] },
  { group: "B+", givesTo: ["B+", "AB+"], receivesFrom: ["B+", "B-", "O+", "O-"] },
  { group: "B-", givesTo: ["B+", "B-", "AB+", "AB-"], receivesFrom: ["B-", "O-"] },
  { group: "AB+", givesTo: ["AB+"], receivesFrom: ["Everyone"] },
  { group: "AB-", givesTo: ["AB+", "AB-"], receivesFrom: ["A-", "B-", "AB-", "O-"] },
  { group: "O+", givesTo: ["O+", "A+", "B+", "AB+"], receivesFrom: ["O+", "O-"] },
  { group: "O-", givesTo: ["Everyone"], receivesFrom: ["O-"] },
];

const eligibility = [
  { icon: Calendar, label: "Age", value: "১৮ – ৬০ বছর" },
  { icon: Weight, label: "Weight", value: "কমপক্ষে ৫০ কেজি" },
  { icon: HeartPulse, label: "Hemoglobin", value: "কমপক্ষে ১২.৫ g/dL" },
  { icon: Clock, label: "Gap", value: "শেষ ডোনেশনের ৯০ দিন পর" },
];

const notEligible = [
  "জ্বর, সর্দি বা অসুস্থতার মধ্যে থাকলে",
  "গর্ভবতী বা সদ্য প্রসবকারী মায়েরা",
  "গত ৬ মাসে বড় সার্জারি হয়ে থাকলে",
  "HIV, Hepatitis B/C পজিটিভ হলে",
  "অ্যালকোহল বা ড্রাগ গ্রহণের পরপরই",
  "রক্তচাপ অস্বাভাবিক হলে (খুব বেশি/কম)",
];

const process = [
  { icon: CheckCircle2, title: "রেজিস্ট্রেশন", desc: "ফর্ম পূরণ করে বেসিক তথ্য দিন" },
  { icon: HeartPulse, title: "হেলথ চেকআপ", desc: "হিমোগ্লোবিন, রক্তচাপ পরীক্ষা করা হবে" },
  { icon: Bandage, title: "ডোনেশন", desc: "মাত্র ৮-১০ মিনিটে ৪৫০ মিলি রক্ত সংগ্রহ" },
  { icon: Coffee, title: "রেস্ট ও রিফ্রেশমেন্ট", desc: "১৫ মিনিট বিশ্রাম নিয়ে হালকা খাবার খান" },
];

const faqs = [
  {
    q: "রক্ত দেওয়া কি ব্যথাদায়ক?",
    a: "শুধু সুচ ফোটানোর সময় সামান্য অনুভূতি হয়, পুরো প্রক্রিয়া সাধারণত ব্যথাহীন।",
  },
  {
    q: "কতদিন পর পর রক্ত দেওয়া যায়?",
    a: "একজন সুস্থ মানুষ প্রতি ৯০ দিন (৩ মাস) পর পর রক্ত দিতে পারেন।",
  },
  {
    q: "রক্ত দিলে কি শরীর দুর্বল হয়ে যায়?",
    a: "সাময়িকভাবে সামান্য ক্লান্তি লাগতে পারে, কিন্তু ২৪-৪৮ ঘণ্টার মধ্যে শরীর স্বাভাবিক হয়ে যায়। পর্যাপ্ত পানি ও পুষ্টিকর খাবার খেলে দ্রুত recover হয়।",
  },
  {
    q: "খালি পেটে রক্ত দেওয়া যাবে?",
    a: "না, রক্ত দেওয়ার আগে হালকা খাবার ও পর্যাপ্ত পানি পান করা জরুরি।",
  },
];

const BloodInformation = () => {
  const [selectedGroup, setSelectedGroup] = useState("O+");
  const [openFaq, setOpenFaq] = useState(null);

  const selected = bloodGroups.find((bg) => bg.group === selectedGroup);

  return (
    <div className="w-full bg-gradient-to-b from-rose-50 via-rose-50/60 to-white pb-20">
      {/* Header */}
      <section className="mx-auto max-w-4xl px-6 pt-14 pb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-200">
          <Droplet className="h-7 w-7 fill-white" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Blood Information
        </h1>
        <p className="mt-3 text-gray-600">
          রক্তের গ্রুপ, ডোনেশনের যোগ্যতা, প্রক্রিয়া — যা জানা দরকার সব একজায়গায়
        </p>
      </section>

      {/* Blood group compatibility */}
      <section className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="mb-2 text-xl font-bold text-gray-900">Blood Compatibility Chart</h2>
        <p className="mb-5 text-sm text-red-500">
          আপনার রক্তের গুরুপ সিলেক্ট করে দেখুন কাদের রক্ত দিতে পারবেন ও কাদের কাছ থেকে রক্ত নিতে পারবেন।   
        </p>

        {/* group selector */}
        <div className="mb-6 grid grid-cols-4 gap-2 sm:grid-cols-8">
          {bloodGroups.map((bg) => (
            <button
              key={bg.group}
              onClick={() => setSelectedGroup(bg.group)}
              className={`rounded-xl py-3 text-center font-bold transition ${selectedGroup === bg.group
                  ? "bg-red-600 text-white shadow-lg shadow-red-200"
                  : "border border-red-100 bg-white text-red-600 hover:bg-red-50"
                }`}
            >
              {bg.group}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-gray-500">
              <span className="text-red-600 font-bold">{selected.group}</span> রক্ত দিতে পারবে —
            </p>
            <div className="flex flex-wrap gap-2">
              {selected.givesTo.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-red-50 px-3 py-1 text-sm font-semibold text-red-600"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-sm font-semibold text-gray-500">
              <span className="text-red-600 font-bold">{selected.group}</span> রক্ত নিতে পারবে —
            </p>
            <div className="flex flex-wrap gap-2">
              {selected.receivesFrom.map((g) => (
                <span
                  key={g}
                  className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-600"
                >
                  {g}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-xs text-gray-400">
          <span className="font-semibold text-gray-500">দ্রষ্টব্য:</span> O- হলো universal donor (সবাইকে দিতে পারে), AB+ হলো universal recipient (সবার থেকে নিতে পারে)।
        </p>
      </section>

      {/* Eligibility */}
      <section className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="mb-5 text-xl font-bold text-gray-900">কে রক্ত দিতে পারবে?</h2>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {eligibility.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-red-100 bg-white p-4 text-center shadow-sm"
            >
              <item.icon className="mx-auto mb-2 h-6 w-6 text-red-600" />
              <p className="text-xs text-gray-400">{item.label}</p>
              <p className="mt-1 text-sm font-bold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <p className="mb-3 flex items-center gap-2 font-semibold text-amber-700">
            <XCircle className="h-5 w-5" />
            যাদের রক্ত দেওয়া উচিত না (temporarily)
          </p>
          <ul className="grid grid-cols-1 gap-2 text-sm text-amber-700 sm:grid-cols-2">
            {notEligible.map((reason) => (
              <li key={reason} className="flex items-start gap-2">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Donation process */}
      <section className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="mb-5 text-xl font-bold text-gray-900">ডোনেশন প্রক্রিয়া</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-red-100 bg-white p-5 text-center shadow-sm"
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-red-600 px-2.5 py-0.5 text-xs font-bold text-white">
                {i + 1}
              </span>
              <div className="mx-auto mb-3 mt-2 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-gray-900">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-xl bg-sky-50 px-4 py-3 text-sm text-sky-700">
          <Timer className="h-4 w-4 shrink-0" />
          পুরো প্রক্রিয়ায় সাধারণত ৩০-৪৫ মিনিট সময় লাগে (checkup + donation + rest সহ)।
        </div>
      </section>

      {/* Before / after tips */}
      <section className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="mb-5 text-xl font-bold text-gray-900">ডোনেশনের আগে ও পরে</h2>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
              <Utensils className="h-5 w-5 text-red-600" />
              আগে করণীয়
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• পর্যাপ্ত পানি পান করুন (৮-১০ গ্লাস)</li>
              <li>• হালকা ও পুষ্টিকর খাবার খান</li>
              <li>• রাতে ভালো ঘুম নিশ্চিত করুন</li>
              <li>• খালি পেটে যাবেন না</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-red-100 bg-white p-5 shadow-sm">
            <p className="mb-3 flex items-center gap-2 font-semibold text-gray-900">
              <ShieldCheck className="h-5 w-5 text-red-600" />
              পরে করণীয়
            </p>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• কমপক্ষে ১৫ মিনিট বিশ্রাম নিন</li>
              <li>• ২৪ ঘণ্টা ভারী পরিশ্রম এড়িয়ে চলুন</li>
              <li>• পর্যাপ্ত পানি ও তরল খাবার খান</li>
              <li>• সুচের জায়গায় ব্যান্ডেজ ৪-৫ ঘণ্টা রাখুন</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-6 py-8">
        <h2 className="mb-5 text-xl font-bold text-gray-900">সাধারণ জিজ্ঞাসা</h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={faq.q}
              className="overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-gray-900">{faq.q}</span>
                <span
                  className={`ml-3 shrink-0 text-red-600 transition-transform ${openFaq === i ? "rotate-45" : ""
                    }`}
                >
                  +
                </span>
              </button>
              {openFaq === i && (
                <p className="px-5 pb-4 text-sm text-gray-500">{faq.a}</p>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BloodInformation;