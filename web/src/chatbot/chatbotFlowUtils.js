/** Topological walk: roots first (by sort_order), then following edges. */
export function previewFlowOrder(flows, edges) {
  const flowList = Array.isArray(flows) ? flows : []
  const edgeList = Array.isArray(edges) ? edges : []
  const validFlows = flowList.filter(
    (f) => f != null && f.id != null && Number.isFinite(Number(f.id)) && Number(f.id) > 0
  )
  if (!validFlows.length) return []

  const byId = new Map(validFlows.map((f) => [Number(f.id), f]))
  const ids = new Set(validFlows.map((f) => Number(f.id)))
  const inDeg = new Map()
  const outAdj = new Map()
  for (const f of validFlows) {
    const id = Number(f.id)
    inDeg.set(id, 0)
    outAdj.set(id, [])
  }
  for (const e of edgeList) {
    const from = Number(e?.from_flow_id)
    const to = Number(e?.to_flow_id)
    if (!Number.isFinite(from) || !Number.isFinite(to) || from <= 0 || to <= 0) continue
    if (!ids.has(from) || !ids.has(to)) continue
    inDeg.set(to, (inDeg.get(to) ?? 0) + 1)
    outAdj.get(from).push(to)
  }
  const cmp = (idA, idB) => {
    const a = byId.get(idA)
    const b = byId.get(idB)
    const so = (Number(a?.sort_order) || 0) - (Number(b?.sort_order) || 0)
    if (so !== 0) return so
    return idA - idB
  }
  const ready = [...ids].filter((id) => (inDeg.get(id) ?? 0) === 0).sort(cmp)
  const out = []
  const done = new Set()
  while (ready.length) {
    const id = ready.shift()
    if (done.has(id)) continue
    done.add(id)
    const node = byId.get(id)
    if (node != null) out.push(node)
    for (const w of outAdj.get(id) || []) {
      const nextDeg = (inDeg.get(w) ?? 0) - 1
      inDeg.set(w, nextDeg)
      if (nextDeg === 0) {
        ready.push(w)
        ready.sort(cmp)
      }
    }
  }
  const sortedRest = [...validFlows].sort(
    (a, b) => (Number(a.sort_order) || 0) - (Number(b.sort_order) || 0) || Number(a.id) - Number(b.id)
  )
  for (const f of sortedRest) {
    const id = Number(f.id)
    if (!done.has(id)) out.push(f)
  }
  const gIdx = out.findIndex((f) => String(f?.flow_type ?? '') === 'greeting_name')
  if (gIdx > 0) {
    const [g] = out.splice(gIdx, 1)
    out.unshift(g)
  }
  return out
}

/** Replace {name} with the latest name from a greeting_name step earlier in the walk. */
export function resolvePromptText(flow, previewSteps, previewReplies, stepIndex) {
  let text = String(flow?.placeholder_text ?? '').trim()
  if (!text) return 'Continue…'
  let name = ''
  for (let j = 0; j < stepIndex; j++) {
    const pf = previewSteps[j]
    if (pf && String(pf.flow_type ?? '') === 'greeting_name' && previewReplies[j]) {
      name = String(previewReplies[j]).trim()
    }
  }
  return text.replace(/\{name\}/gi, name || 'there')
}

export function botHasNameFlow(flowList) {
  if (!Array.isArray(flowList)) return false
  return flowList.some((f) => String(f.flow_type ?? '') === 'greeting_name')
}
