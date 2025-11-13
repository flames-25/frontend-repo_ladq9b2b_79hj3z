import { useState } from 'react'

const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <input {...props} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
    </label>
  )
}

function Textarea({ label, ...props }) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <textarea {...props} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 min-h-[100px]" />
    </label>
  )
}

function ChipInput({ label, value, onChange, placeholder }) {
  const [text, setText] = useState('')
  const add = () => {
    const v = text.trim()
    if (!v) return
    onChange([...(value || []), v])
    setText('')
  }
  const remove = (i) => onChange(value.filter((_, idx) => idx !== i))
  return (
    <div>
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <div className="mt-1 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500" />
        <button type="button" onClick={add} className="rounded-lg bg-slate-900 text-white px-3 py-2 font-medium hover:bg-black">Add</button>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {(value || []).map((v, i) => (
          <span key={i} className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-sm">
            {v}
            <button type="button" onClick={() => remove(i)} className="text-slate-500 hover:text-slate-700">×</button>
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Admin() {
  // Profile form state
  const [profile, setProfile] = useState({ name: '', title: '', summary: '', location: '', email: '', website: '', github: '', linkedin: '', skills: [] })
  const [profileMsg, setProfileMsg] = useState('')

  // Project form state
  const [project, setProject] = useState({ title: '', description: '', purpose: '', timeframe: '', repo_url: '', live_url: '', languages: [], frameworks: [], highlights: [] })
  const [projectMsg, setProjectMsg] = useState('')

  const submitProfile = async (e) => {
    e.preventDefault()
    setProfileMsg('Saving...')
    try {
      const res = await fetch(`${baseUrl}/api/profile`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(profile) })
      if (!res.ok) throw new Error('Failed')
      setProfileMsg('Saved! Refresh home to see changes.')
    } catch (e) {
      setProfileMsg('Error saving profile. Is the database configured?')
    }
  }

  const submitProject = async (e) => {
    e.preventDefault()
    setProjectMsg('Saving...')
    try {
      const res = await fetch(`${baseUrl}/api/projects`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(project) })
      if (!res.ok) throw new Error('Failed')
      setProjectMsg('Project added!')
      setProject({ title: '', description: '', purpose: '', timeframe: '', repo_url: '', live_url: '', languages: [], frameworks: [], highlights: [] })
    } catch (e) {
      setProjectMsg('Error saving project. Is the database configured?')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold">Admin — Edit Portfolio</h1>
          <a href="/" className="text-slate-600 hover:text-slate-900">← Back to site</a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile */}
          <form onSubmit={submitProfile} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Profile</h2>
            <Input label="Name" value={profile.name} onChange={(e)=>setProfile(p=>({...p, name:e.target.value}))} required />
            <Input label="Title" value={profile.title} onChange={(e)=>setProfile(p=>({...p, title:e.target.value}))} required />
            <Textarea label="Summary" value={profile.summary} onChange={(e)=>setProfile(p=>({...p, summary:e.target.value}))} required />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Location" value={profile.location} onChange={(e)=>setProfile(p=>({...p, location:e.target.value}))} />
              <Input label="Email" type="email" value={profile.email} onChange={(e)=>setProfile(p=>({...p, email:e.target.value}))} />
              <Input label="Website URL" value={profile.website} onChange={(e)=>setProfile(p=>({...p, website:e.target.value}))} />
              <Input label="GitHub URL" value={profile.github} onChange={(e)=>setProfile(p=>({...p, github:e.target.value}))} />
              <Input label="LinkedIn URL" value={profile.linkedin} onChange={(e)=>setProfile(p=>({...p, linkedin:e.target.value}))} />
            </div>
            <ChipInput label="Skills" value={profile.skills} onChange={(v)=>setProfile(p=>({...p, skills:v}))} placeholder="Add a skill and click Add" />
            <button className="mt-2 inline-flex items-center rounded-lg bg-sky-600 text-white px-4 py-2 font-semibold shadow hover:bg-sky-700">Save Profile</button>
            <p className="text-sm text-slate-600">{profileMsg}</p>
          </form>

          {/* Project */}
          <form onSubmit={submitProject} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-4">
            <h2 className="text-xl font-semibold">Add Project</h2>
            <Input label="Title" value={project.title} onChange={(e)=>setProject(p=>({...p, title:e.target.value}))} required />
            <Textarea label="Description" value={project.description} onChange={(e)=>setProject(p=>({...p, description:e.target.value}))} required />
            <Textarea label="Purpose" value={project.purpose} onChange={(e)=>setProject(p=>({...p, purpose:e.target.value}))} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Timeframe" value={project.timeframe} onChange={(e)=>setProject(p=>({...p, timeframe:e.target.value}))} />
              <Input label="Repo URL" value={project.repo_url} onChange={(e)=>setProject(p=>({...p, repo_url:e.target.value}))} />
              <Input label="Live URL" value={project.live_url} onChange={(e)=>setProject(p=>({...p, live_url:e.target.value}))} />
            </div>
            <ChipInput label="Languages" value={project.languages} onChange={(v)=>setProject(p=>({...p, languages:v}))} placeholder="e.g., Python" />
            <ChipInput label="Frameworks" value={project.frameworks} onChange={(v)=>setProject(p=>({...p, frameworks:v}))} placeholder="e.g., FastAPI, React" />
            <ChipInput label="Highlights" value={project.highlights} onChange={(v)=>setProject(p=>({...p, highlights:v}))} placeholder="Key achievement" />
            <button className="mt-2 inline-flex items-center rounded-lg bg-slate-900 text-white px-4 py-2 font-semibold shadow hover:bg-black">Add Project</button>
            <p className="text-sm text-slate-600">{projectMsg}</p>
          </form>
        </div>
      </div>
    </div>
  )
}
