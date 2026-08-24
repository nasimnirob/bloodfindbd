import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdBloodtype, MdOutlineLocationOn, MdOutlinePerson, MdOutlineLocalHospital, MdOutlinePhone, MdOutlineCalendarToday, MdOutlineNotes } from 'react-icons/md'
import { AuthContext } from '../providers/AuthProviders'
import toast from 'react-hot-toast'
import LocationPicker from '../component/LocationPicker'

const bloodGroups = ['A+', 'B+', 'AB+', 'O+', 'A-', 'B-', 'AB-', 'O-']
const unitOptions = ['1 unit', '2 units', '3 units', '4 units', '5 unit', '6 units', '7 units', '8 units']

const districts = [
  "Bagerhat", "Bandarban", "Barguna", "Barishal", "Bhola", "Bogura",
  "Brahmanbaria", "Chandpur", "Chattogram", "Chuadanga", "Cox's Bazar",
  "Cumilla", "Dhaka", "Dinajpur", "Faridpur", "Feni", "Gaibandha",
  "Gazipur", "Gopalganj", "Habiganj", "Jamalpur", "Jashore", "Jhalokathi",
  "Jhenaidah", "Joypurhat", "Khagrachhari", "Khulna", "Kishoreganj",
  "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur",
  "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj",
  "Mymensingh", "Naogaon", "Narail", "Narayanganj", "Narsingdi", "Natore",
  "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
  "Patuakhali", "Pirojpur", "Rajbari", "Rajshahi", "Rangamati", "Rangpur",
  "Satkhira", "Shariatpur", "Sherpur", "Sirajganj", "Sunamganj", "Sylhet",
  "Tangail", "Thakurgaon",
]

const API_URL = import.meta.env.VITE_API_URL

function BloodRequest() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [selectedGroup, setSelectedGroup] = useState('')
  const [selectedUnit, setSelectedUnit] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    patientName: '',
    patientProblem: '',
    hospital: '',
    district: '',
    contact: '',
    neededOn: '',
    note: '',
  })

  // Live map location — { address, lat, lng }
  const [location, setLocation] = useState(null)

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
  }

  const isValid =
    selectedGroup && selectedUnit && form.patientProblem && form.contact && location?.address

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!isValid) {
      setError('সব আবশ্যক ফিল্ড পূরণ করুন')
      return
    }

    // "2 units" -> 2, "1 unit" -> 1
    const unitsNeeded = parseInt(selectedUnit, 10) || 1

    try {
      setSubmitting(true)

      const res = await fetch(`${API_URL}/blood-requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientName: form.patientName,
          patientProblem: form.patientProblem,
          bloodGroup: selectedGroup,
          district: form.district,
          area: location.address,
          location: { lat: location.lat, lng: location.lng },
          hospital: form.hospital,
          contactPhone: form.contact,
          requesterEmail: user?.email || '',
          unitsNeeded,
          urgency: 'urgent',
          neededOn: form.neededOn || null,
          note: form.note,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message)

      toast.success('Blood Request Post Successfully')
      navigate('/donate')
    } catch (err) {
      setError(err.message || 'রিকোয়েস্ট পোস্ট করতে সমস্যা হয়েছে')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-[700px] min-h-screen md:my-6  md:px-0">
      <form onSubmit={handleSubmit} className="flex flex-col bg-white md:rounded-xl shadow-sm">

        {/* Header */}
        <div className="border-b border-gray-100 px-4 py-5 md:px-6">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-xl md:text-2xl font-semibold text-gray-900 uppercase underline decoration-red-500">Create a Urgent post</h1>
          </div>
          <p className="mt-1 text-center text-sm text-gray-500">
            নিচের তথ্যগুলো পূরণ করলে আশেপাশের সম্ভাব্য রক্তদাতা নোটিফিকেশন পাবেন
          </p>
        </div>

        {error && (
          <div className="mx-4 mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600 md:mx-6">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-6 px-4 py-6 md:px-6">

          {/* Blood group */}
          <fieldset className="flex flex-col items-start gap-2">
            <span className="text-sm font-medium text-gray-800">
              Select Blood group <span className="text-red-600">*</span>
            </span>
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
          <fieldset className="flex flex-col items-start gap-2">
            <span className="text-sm font-medium text-gray-800">
               Required units <span className="text-red-600">*</span>
            </span>
            <div className="grid grid-cols-4 sm:grid-cols-4 gap-2 w-full">
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
              Patient name 
              {/* <span className="text-red-600">*</span> */}
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
          {/* Patient Problem */}
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">
              Patient Problem <span className="text-red-600">*</span>
            </span>
            <div className="relative">
              <MdOutlinePerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                value={form.patientProblem}
                onChange={handleChange('patientProblem')}
                type="text"
                placeholder="কি কারণে রক্ত প্রয়োজন"
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

          {/* District */}
          {/* <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">
              District <span className="text-red-600">*</span>
            </span>
            <div className="relative">
              <MdOutlineLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <select
                value={form.district}
                onChange={handleChange('district')}
                className="w-full appearance-none rounded-md border border-gray-200 bg-[#F7F8F9] py-2.5 pl-10 pr-3 text-sm outline-none transition-colors focus:border-red-300 focus:bg-white focus:ring-2 focus:ring-red-100"
              >
                <option value="">জেলা নির্বাচন করুন</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </label> */}

          {/* Live Hospital Location */}
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-gray-800">
              Live Hospital Address <span className="text-red-600">*</span>
            </span>
            <LocationPicker value={location} onChange={setLocation} />
          </div>

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
            disabled={!isValid || submitting}
            className="cursor-pointer w-full rounded-md bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {submitting ? 'Processing...' : 'Submit request'}
          </button>
          <p className="mt-2 text-center text-xs text-gray-400">
            <span className="text-red-600">*</span> চিহ্নিত ফিল্ডগুলো আবশ্যক
          </p>
        </div>
      </form>
    </div>
  )
}

export default BloodRequest