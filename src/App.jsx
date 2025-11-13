import { useEffect, useState } from 'react'
import Spline from '@splinetool/react-spline'

function Chip({ label }) {
  return (
    <span className="inline-flex items-center rounded-full bg-white/70 backdrop-blur px-3 py-1 text-sm text-slate-700 shadow-sm ring-1 ring-slate-200">
      {label}
    </span>
  )
}

function ProjectCard({ project }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white/70 backdrop-blur p-5 shadow-sm hover:shadow-lg transition-all">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-xl font-semibold text-slate-800">{project.title}</h3>
        <span className="text-xs text-slate-500">{project.timeframe || ''}</span>
      </div>
      <p className="mt-2 text-slate-600 leading-relaxed">{project.description}</p>
      {project.purpose && (
        <p className="mt-2 text-slate-500 text-sm"><span className="font-medium text-slate-700">Purpose:</span> {project.purpose}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-2">
        {project.languages?.map((l, i) => <Chip key={`lang-${i}`} label={l} />)}
        {project.frameworks?.map((f, i) => <Chip key={`fw-${i}`} label={f} />)}
      </div>
      {project.highlights?.length > 0 && (
        <ul className="mt-4 list-disc list-inside text-sm text-slate-600 space-y-1">
          {project.highlights.map((h, i) => <li key={i}>{h}</li>)}
        </ul>
      )}
      <div className="mt-4 flex flex-wrap gap-3">
        {project.repo_url && <a href={project.repo_url} target="_blank" className="text-blue-600 hover:text-blue-700 text-sm font-medium">Code →</a>}
        {project.live_url && <a href={project.live_url} target="_blank" className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">Live Demo →</a>}
      </div>
    </div>
  )
}

function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [profile, setProfile] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, prRes] = await Promise.all([
          fetch(`${baseUrl}/api/profile`),
          fetch(`${baseUrl}/api/projects`),
        ])
        const pJson = await pRes.json()
        const prJson = await prRes.json()
        setProfile(pJson)
        setProjects(Array.isArray(prJson) ? prJson : [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [baseUrl])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-sky-50 to-white text-slate-800">
      {/* Hero with Spline */}
      <header className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/VJLoxp84lCdVfdZu/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/40 via-white/10 to-white" />
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl bg-white/60 backdrop-blur rounded-2xl p-6 md:p-8 ring-1 ring-white/50 shadow-lg">
              <p className="text-sm uppercase tracking-wide text-slate-600">Portfolio</p>
              <h1 className="mt-2 text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-sky-700">
                {profile?.name || 'Your Name'}
              </h1>
              <p className="mt-2 text-lg md:text-xl text-slate-700">{profile?.title || 'Computer Science Engineer'}</p>
              <p className="mt-4 text-slate-600 leading-relaxed">{profile?.summary || 'Showcase your work, skills, and the problems you love to solve. Use the Admin page to add your profile and projects.'}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {profile?.location && <Chip label={profile.location} />}
                {profile?.skills?.slice(0,6)?.map((s, i) => <Chip key={i} label={s} />)}
              </div>
              <div className="mt-6 flex flex-wrap gap-4">
                <a href="#projects" className="inline-flex items-center rounded-lg bg-sky-600 text-white px-4 py-2 font-semibold shadow hover:bg-sky-700 transition-colors">View Projects</a>
                <a href="/admin" className="inline-flex items-center rounded-lg bg-slate-900 text-white px-4 py-2 font-semibold shadow hover:bg-black transition-colors">Admin</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Projects */}
      <main className="container mx-auto px-6 py-12" id="projects">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Projects</h2>
            <p className="text-slate-600 mt-1">Things I built using languages and frameworks I love.</p>
          </div>
          <a href="/admin" className="hidden sm:inline-flex text-sm text-slate-600 hover:text-slate-900">Edit in Admin →</a>
        </div>

        {loading ? (
          <p className="mt-8 text-slate-500">Loading...</p>
        ) : projects.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-300 p-8 text-slate-600 bg-white">
            No projects yet. Add your first one in the Admin page.
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <ProjectCard key={i} project={p} />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/70">
        <div className="container mx-auto px-6 py-6 text-sm text-slate-600 flex flex-wrap items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} {profile?.name || 'Your Name'}</p>
          <div className="flex gap-4">
            {profile?.github && <a className="hover:text-slate-900" href={profile.github} target="_blank">GitHub</a>}
            {profile?.linkedin && <a className="hover:text-slate-900" href={profile.linkedin} target="_blank">LinkedIn</a>}
            {profile?.website && <a className="hover:text-slate-900" href={profile.website} target="_blank">Website</a>}
            <a className="hover:text-slate-900" href="/admin">Admin</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
