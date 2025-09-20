import React, { useState } from 'react'

type FetchFn = (input: RequestInfo, init?: RequestInit) => Promise<Response>

export default function PostProjectWizard({ onSubmit, fetchImpl }:{ onSubmit?: (data:any)=>void, fetchImpl?: FetchFn }){
  const [step, setStep] = useState(0)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [budgetMin, setBudgetMin] = useState('')
  const [budgetMax, setBudgetMax] = useState('')
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({})
  const fetcher = fetchImpl || fetch

  function validateStep(s:number){
    const e:Record<string,string> = {}
    if (s===0){
      if (!title.trim()) e.title = 'Required'
      if (!description.trim()) e.description = 'Required'
    }
    if (s===1){
      if (skills.length === 0) e.skills = 'Add at least one skill'
    }
    if (s===2){
      const min = parseInt(budgetMin||'0',10)||0
      const max = parseInt(budgetMax||'0',10)||0
      if (min && max && min > max) e.budget = 'Min must be <= Max'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next(){
    if (!validateStep(step)) return
    setStep(s=>Math.min(2,s+1))
  }

  function back(){ setStep(s=>Math.max(0,s-1)) }

  function addSkill(){
    const v = skillInput.trim()
    if (!v) return
    if (!skills.includes(v)) setSkills(s=>[...s, v])
    setSkillInput('')
  }

  async function submit(e?:any){
    e && e.preventDefault()
    if (!validateStep(2)) return
    const payload = {
      title,
      description,
      budget_min: budgetMin? parseInt(budgetMin,10): null,
      budget_max: budgetMax? parseInt(budgetMax,10): null,
      skills
    }
    if (onSubmit) onSubmit(payload)
    try{
      const res = await fetcher('/api/projects', { method: 'POST', headers: { 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('network')
      // success handling could be more elaborate
      setStep(2)
    }catch(err){
      setErrors({ submit: 'Failed to submit' })
    }
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <form aria-label="post-project-form" onSubmit={submit} className="space-y-4">
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded ${step===0? 'bg-blue-600 text-white':'bg-gray-200'}`}>1</div>
          <div className={`px-3 py-1 rounded ${step===1? 'bg-blue-600 text-white':'bg-gray-200'}`}>2</div>
          <div className={`px-3 py-1 rounded ${step===2? 'bg-blue-600 text-white':'bg-gray-200'}`}>3</div>
        </div>

        {step===0 && (
          <fieldset>
            <label className="block">
              <span className="text-sm font-medium">Title</span>
              <input aria-label="Title" value={title} onChange={e=>setTitle(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </label>
            <label className="block mt-2">
              <span className="text-sm font-medium">Description</span>
              <textarea aria-label="Description" value={description} onChange={e=>setDescription(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </label>
            {errors.title && <div role="alert" className="text-red-600">{errors.title}</div>}
            {errors.description && <div role="alert" className="text-red-600">{errors.description}</div>}
          </fieldset>
        )}

        {step===1 && (
          <fieldset>
            <label className="block">
              <span className="text-sm font-medium">Skills</span>
              <div className="flex mt-1">
                <input aria-label="Skill input" value={skillInput} onChange={e=>setSkillInput(e.target.value)} className="flex-1 border rounded p-2" />
                <button type="button" onClick={addSkill} className="ml-2 px-3 py-2 bg-blue-600 text-white rounded">Add</button>
              </div>
            </label>
            <div className="mt-2 flex flex-wrap gap-2">
              {skills.map(s=> <span key={s} className="px-2 py-1 bg-gray-100 rounded">{s}</span> )}
            </div>
            {errors.skills && <div role="alert" className="text-red-600">{errors.skills}</div>}
          </fieldset>
        )}

        {step===2 && (
          <fieldset>
            <label className="block">
              <span className="text-sm font-medium">Budget Min</span>
              <input aria-label="Budget Min" value={budgetMin} onChange={e=>setBudgetMin(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </label>
            <label className="block mt-2">
              <span className="text-sm font-medium">Budget Max</span>
              <input aria-label="Budget Max" value={budgetMax} onChange={e=>setBudgetMax(e.target.value)} className="mt-1 block w-full border rounded p-2" />
            </label>
            <div className="mt-3">
              <h4 className="font-medium">Review</h4>
              <div>Title: {title}</div>
              <div>Description: {description}</div>
              <div>Skills: {skills.join(', ')}</div>
              <div>Budget: {budgetMin} - {budgetMax}</div>
            </div>
            {errors.budget && <div role="alert" className="text-red-600">{errors.budget}</div>}
            {errors.submit && <div role="alert" className="text-red-600">{errors.submit}</div>}
          </fieldset>
        )}

        <div className="flex justify-between">
          <div>
            {step>0 && <button type="button" onClick={back} className="px-3 py-2 bg-gray-200 rounded">Back</button>}
          </div>
          <div className="space-x-2">
            {step<2 && <button type="button" onClick={next} className="px-3 py-2 bg-blue-600 text-white rounded">Next</button>}
            {step===2 && <button type="submit" className="px-3 py-2 bg-green-600 text-white rounded">Post Project</button>}
          </div>
        </div>
      </form>
    </div>
  )
}
