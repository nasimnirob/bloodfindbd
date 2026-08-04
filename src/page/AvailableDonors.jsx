import React, { useContext } from 'react'
import { AuthContext } from '../providers/AuthProviders'

const AvailableDonors = () => {
    const { user, loading } = useContext(AuthContext);
    return (
        <div className='bg-gradient-to-b from-rose-50 via-rose-50/60 to-white px-2 pb-20'>
            <h1 className='text-center py-5 text-2xl'>Available Donors</h1>
            <div className='mx-auto max-w-[700px] min-h-[calc(100vh-210px)]'>
                <div className='flex flex-col gap-5'>
                    <div className='flex flex-row items-center justify-between bg-white md:rounded-xl rounded-2xl shadow-md text-center text-2xl py-2'>
                        <div className='flex justify-center items-center w-full px-3 '>
                            <div className='rounded-full py-3'>
                                <img className='border border-gray-200 rounded-full' src={user?.photoURL} referrerPolicy="no-referrer" alt="" />
                            </div>
                            <div className='flex flex-col justify-between text-start w-full px-3 gap-2'>
                                <p className='text-base'>{user?.displayName}</p>
                                <p className='text-sm px-2'>Location</p>
                                <div className=' w-full'>
                                    <button className='items-center border w-full text-sm bg-red-600  rounded-tl-full rounded-br-full text-white py-[3px] cursor-pointer'>
                                        Request
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* <div className='border rounded-b-full rounded-t-full'>AB+</div> */}
                        <div className="w-16 h-20 px-2">
                            <svg
                                viewBox="0 0 100 120"
                                className="w-full h-full"
                                fill="#c8102e"
                            >
                                <path d="M50 0 C75 25 95 45 95 70 A45 45 0 1 1 5 70 C5 45 25 25 50 0Z" />
                                <text
                                    x="50"
                                    y="68"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="22"
                                    fontWeight="bold"
                                >
                                    AB+
                                </text>
                            </svg>
                        </div>

                    </div>
                    
                    <div className='flex flex-row items-center justify-between bg-white md:rounded-xl rounded-2xl shadow-md text-center text-2xl py-2'>
                        <div className='flex justify-center items-center w-full px-3 '>
                            <div className='rounded-full py-3'>
                                <img className='border border-gray-200 rounded-full' src={user?.photoURL} referrerPolicy="no-referrer" alt="" />
                            </div>
                            <div className='flex flex-col justify-between text-start w-full px-3 gap-2'>
                                <p className='text-base'>{user?.displayName}</p>
                                <p className='text-sm px-2'>Location</p>
                                <div className=' w-full'>
                                    <button className='items-center border w-full text-sm bg-red-600  rounded-tl-full rounded-br-full text-white py-[3px] cursor-pointer'>
                                        Request
                                    </button>
                                </div>
                            </div>
                        </div>
                        {/* <div className='border rounded-b-full rounded-t-full'>AB+</div> */}
                        <div className="w-16 h-20 px-2">
                            <svg
                                viewBox="0 0 100 120"
                                className="w-full h-full"
                                fill="#c8102e"
                            >
                                <path d="M50 0 C75 25 95 45 95 70 A45 45 0 1 1 5 70 C5 45 25 25 50 0Z" />
                                <text
                                    x="50"
                                    y="68"
                                    textAnchor="middle"
                                    fill="white"
                                    fontSize="22"
                                    fontWeight="bold"
                                >
                                    AB+
                                </text>
                            </svg>
                        </div>

                    </div>
                   
                </div>
            </div>
            
        </div>
    )
}

export default AvailableDonors