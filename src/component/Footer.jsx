import { Heart, HeartPulse } from 'lucide-react'
import React from 'react'
import { FaInstagram, FaLinkedin, FaTwitter, FaYoutube } from 'react-icons/fa'
import { FaFacebook } from 'react-icons/fa6'
import { Link } from 'react-router-dom'

function Footer() {
    return (
        <footer className="border-t border-red-100 bg-neutral-700">
            <div className="mx-auto max-w-6xl px-6 md:pb-6 pb-20 pt-12">
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-4">
                    <div>
                        <div className="flex items-center gap-2 text-lg font-bold text-white">
                            <HeartPulse className="bg-red-500 text-white w-10 h-10 p-1.5 rounded-lg" />
                            Blood Find BD
                        </div>
                        <p className="mt-3 text-sm text-gray-300">
                            Connecting donors and recipients across Bangladesh, instantly.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white">Platform</h4>
                        <ul className="mt-3 space-y-2 text-sm text-gray-300">
                            <li><Link to="/blood-request" className="inline-block transition-all duration-200 hover:text-red-600 hover:translate-x-1">I Need Blood</Link></li>
                            <li><Link to="/donate" className="inline-block transition-all duration-200 hover:text-red-600 hover:translate-x-1">I Want to Donate</Link></li>
                            <li><Link to="/available-donors" className="inline-block transition-all duration-200 hover:text-red-600 hover:translate-x-1">Available Donors</Link></li>
                            <li><Link to="/blood-information" className="inline-block transition-all duration-200 hover:text-red-600 hover:translate-x-1">Blood Information</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white">Company</h4>
                        <ul className="mt-3 space-y-2 text-sm text-gray-300">
                            <li><Link to="/about" className="inline-block transition-all duration-200 hover:text-red-600 hover:translate-x-1">About Us</Link></li>
                            <li><Link to="/contact" className="inline-block transition-all duration-200 hover:text-red-600 hover:translate-x-1">Contact</Link></li>
                            <li><Link to="/privacy" className="inline-block transition-all duration-200 hover:text-red-600 hover:translate-x-1">Privacy Policy</Link></li>
                            <li><Link to="/terms" className="inline-block transition-all duration-200 hover:text-red-600 hover:translate-x-1">Terms of Service</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold text-white">Follow Us</h4>

                        <div className="mt-3 flex gap-3">
                            <a
                                href="https://www.facebook.com/nasim.nirob.official"
                                target='blank'
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                            >
                                <FaFacebook className="h-4 w-4" />
                            </a>

                            <a
                                href="https://www.linkedin.com/in/nasim-nirob/"
                                target='_blank'
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                            >
                                <FaLinkedin className="h-4 w-4" />
                            </a>

                            <a
                                href="https://www.youtube.com/@nasimnirob"
                                target='_blank'
                                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-600 hover:text-white"
                            >
                                <FaYoutube className="h-4 w-4" />
                            </a>
                        </div>
                    </div>

                </div>

                <div className="mt-10 border-t border-gray-400 pt-6 text-center text-xs text-gray-300">
                    © {new Date().getFullYear()} Blood Find BD. All rights reserved.
                </div>
            </div>
        </footer>
    )
}

export default Footer