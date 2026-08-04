import React, { useState } from 'react'
import { MdBloodtype, MdOutlineLocationOn, MdOutlinePerson, MdOutlineLocalHospital, MdOutlinePhone, MdOutlineCalendarToday, MdOutlineNotes } from 'react-icons/md'

const bloodGroups = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']
const unitOptions = ['1 unit', '2 units', '3 units', '4+ units']

function DonateRequest() {
  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [form, setForm] = useState({
    patientName: '',
    hospital: '',
    address: '',
    contact: '',
    neededOn: '',
    note: '',
  })

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: API call বসবে এখানে
    console.log({ selectedGroup, selectedUnit, ...form })
  }

  const isValid = selectedGroup && selectedUnit && form.patientName && form.contact && form.address

  return (
    <div className="mx-auto max-w-[700px] md:mt-6 px-3 md:px-0 pb-10">
      <form onSubmit={handleSubmit} className="flex flex-col bg-white md:rounded-xl shadow-sm">

        {/* Header */}
        <div className="border-b border-gray-100 px-4 py-5 md:px-6">
          <div className="flex items-center justify-center gap-2">
            <MdBloodtype className="text-2xl text-red-600" />
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900">Find A Donor</h1>
          </div>
          <p className="mt-1 text-center text-sm text-gray-500">
            নিচের তথ্যগুলো পূরণ করলে আশেপাশের সম্ভাব্য donor-রা notification পাবেন
          </p>
        </div>

        <div className="flex flex-col gap-6 px-4 py-6 md:px-6">

          {/* Blood group */}
          <fieldset className="flex flex-col items-start gap-2.5">
            <legend className="text-sm font-medium text-gray-800">
              Blood group <span className="text-red-600">*</span>
            </legend>
            <div className="grid grid-cols-4 gap-2 w-full sm:flex sm:flex-wrap">
              {bloodGroups.map((group) => {
                const active = selectedGroup === group
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => setSelectedGroup(group)}
                    aria-pressed={active}
                    className={`h-11 flex-1 sm:flex-none sm:w-14 rounded-md border text-sm font-semibold transition-colors
                                            ${active
                        ? 'border-red-600 bg-red-600 text-white'
                        : 'border-gray-200 bg-[#F7F8F9] text-gray-800 hover:border-red-300 hover:bg-red-50'
                      }`}
                  >
                    {group}
                  </button>
                )
              })}
            </div>
          </fieldset>

          {/* Required units */}
          <fieldset className="flex flex-col items-start gap-2.5">
            <legend className="text-sm font-medium text-gray-800">
              Required units <span className="text-red-600">*</span>
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full">
              {unitOptions.map((unit) => {
                const active = selectedUnit === unit
                return (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setSelectedUnit(unit)}
                    aria-pressed={active}
                    className={`h-10 rounded-md border text-sm font-medium transition-colors
                                            ${active
                        ? 'border-red-600 bg-red-600 text-white'
                        : 'border-gray-200 bg-[#F7F8F9] text-gray-800 hover:border-red-300 hover:bg-red-50'
                      }`}
                  >
                    {unit}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <div className="h-px bg-gray-100" />

          {/* Patient name */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">
              Patient name <span className="text-red-600">*</span>
            </span>
            <div className="relative">
              <MdOutlinePerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                value={form.patientName}
                onChange={handleChange('patientName')}
                type="text"
                placeholder="যার জন্য রক্ত প্রয়োজন তার নাম"
                className="w-full rounded-md border border-gray-200 bg-[#F7F8F9] py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
              />
            </div>
          </label>

          {/* Hospital */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">Hospital / Clinic</span>
            <div className="relative">
              <MdOutlineLocalHospital className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                value={form.hospital}
                onChange={handleChange('hospital')}
                type="text"
                placeholder="হাসপাতাল বা ক্লিনিকের নাম"
                className="w-full rounded-md border border-gray-200 bg-[#F7F8F9] py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
              />
            </div>
          </label>

          {/* Address */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">
              Address <span className="text-red-600">*</span>
            </span>
            <div className="relative">
              <MdOutlineLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                value={form.address}
                onChange={handleChange('address')}
                type="text"
                placeholder="জেলা, উপজেলা / এলাকা"
                className="w-full rounded-md border border-gray-200 bg-[#F7F8F9] py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
              />
            </div>
          </label>

          {/* Contact + Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-800">
                Contact number <span className="text-red-600">*</span>
              </span>
              <div className="relative">
                <MdOutlinePhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  value={form.contact}
                  onChange={handleChange('contact')}
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  className="w-full rounded-md border border-gray-200 bg-[#F7F8F9] py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>
            </label>

            <label className="flex flex-col gap-2">
              <span className="text-sm font-medium text-gray-800">Needed on</span>
              <div className="relative">
                <MdOutlineCalendarToday className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  value={form.neededOn}
                  onChange={handleChange('neededOn')}
                  type="date"
                  className="w-full rounded-md border border-gray-200 bg-[#F7F8F9] py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
                />
              </div>
            </label>
          </div>

          {/* Additional note */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">Additional note</span>
            <div className="relative">
              <MdOutlineNotes className="absolute left-3 top-3 text-gray-400 text-lg" />
              <textarea
                value={form.note}
                onChange={handleChange('note')}
                rows={3}
                placeholder="রোগীর অবস্থা বা অন্য কোনো প্রয়োজনীয় তথ্য (ঐচ্ছিক)"
                className="w-full resize-none rounded-md border border-gray-200 bg-[#F7F8F9] py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
              />
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="border-t border-gray-100 px-4 py-4 md:px-6">
          <button
            type="submit"
            disabled={!isValid}
            className="w-full rounded-md bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            Submit request
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">
            <span className="text-red-600">*</span> চিহ্নিত ফিল্ডগুলো আবশ্যক
          </p>
        </div>
      </form>
    </div>
  )
}

export default DonateRequest


// import React from 'react'

// function DonateRequest() {
//   return (
//     <div className='mx-auto max-w-[700px] md:mt-4'>
//       <div className='flex flex-col bg-white md:rounded-xl shadow-sm py-3'>
//         <div className=''>
//           <h1 className='text-2xl text-center text-red-600'>Find A Donor</h1>
//         </div>
//         <div className='flex flex-col gap-4 py-4'>
//           <div className='flex flex-col items-start gap-2.5  px-4'>
//             <div className=''>
//               <h2>Choose blood group</h2>
//             </div>
//             <div className='flex gap-2 items-center justify-center '>
//               <span className='border border-gray-300  w-9 h-9 items-center flex justify-center text-sm bg-[#f5ecec] text-[#090909] hover:bg-[#F2F2F2] cursor-pointer px-5'>A+</span>
//               <span className='border border-gray-300  w-9 h-9 items-center flex justify-center text-sm bg-[#E2E5E9] text-[#090909] hover:bg-[#F2F2F2] cursor-pointer px-5'>B+</span>
//               <span className='border border-gray-300  w-9 h-9 items-center flex justify-center text-sm bg-[#E2E5E9] text-[#090909] hover:bg-[#F2F2F2] cursor-pointer px-5'>AB+</span>
//               <span className='border border-gray-300  w-9 h-9 items-center flex justify-center text-sm bg-[#E2E5E9] text-[#090909] hover:bg-[#F2F2F2] cursor-pointer px-5'>O+</span>
//               <span className='border border-gray-300  w-9 h-9 items-center flex justify-center text-sm bg-[#E2E5E9] text-[#090909] hover:bg-[#F2F2F2] cursor-pointer px-5'>A-</span>
//               <span className='border border-gray-300  w-9 h-9 items-center flex justify-center text-sm bg-[#E2E5E9] text-[#090909] hover:bg-[#F2F2F2] cursor-pointer px-5'>B-</span>
//               <span className='border border-gray-300  w-9 h-9 items-center flex justify-center text-sm bg-[#E2E5E9] text-[#090909] hover:bg-[#F2F2F2] cursor-pointer px-5'>AB-</span>
//               <span className='border border-gray-300  w-9 h-9 items-center flex justify-center text-sm bg-[#E2E5E9] text-[#090909] hover:bg-[#F2F2F2] cursor-pointer px-5'>O-</span>
//             </div>
//           </div>

//           <div className='flex flex-col items-start gap-2.5  px-4 '>
//             <div className=''>
//               <h2>Required units</h2>
//             </div>
//             <div className='flex gap-2 items-center justify-center w-full'>
//               <span className='border border-gray-300 py-1.75 items-center flex justify-center text-sm bg-[#E2E5E9] text-[#090909] hover:bg-[#F2F2F2] cursor-pointer w-full'>1 unit</span>

//             </div>
//           </div>

//           <div className='flex flex-col items-start gap-2.5  px-4 '>
//             <div className=''>
//               <h2>Address</h2>
//             </div>
//             <div className='flex gap-2 items-center justify-center'>
//                 <button>droupdown all address</button>

//             </div>
//           </div>

//           <div>

//           </div>
//           <div></div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default DonateRequest