// Shared editor plumbing: item load, sibling list (for slug uniqueness),
// validation, dirty tracking, and a save flow with toast feedback (including
// Cmd/Ctrl+S). Each editor supplies its own clean/validate transforms and
// keeps its JSX.
import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import { useDirtyTracker } from './dirtyContext'
import { validateItem } from '../utils/validate'

export function useEditorForm({
  collection,
  id,
  empty,
  titleField = 'title',
  titleLabel,
  validate,
  clean,
  editorPath,
  savedMessage = 'Saved',
  checkBasics = true,
  afterSave,
}) {
  const isNew = !id
  const navigate = useNavigate()
  const toast = useToast()

  const [item, setItem] = useState(isNew ? empty : null)
  const [err, setErr] = useState(null)
  const [saving, setSaving] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const [siblings, setSiblings] = useState([])
  const { dirty, markSaved } = useDirtyTracker(item)

  useEffect(() => {
    if (isNew) return
    collection.get(id).then(setItem).catch((e) => setErr(e.message))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isNew])

  useEffect(() => {
    if (!checkBasics) return
    collection
      .list()
      .then((items) => setSiblings(items.map((i) => ({ id: i.id, slug: i.slug, title: i.title, name: i.name }))))
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const computeErrors = useCallback(
    (it) => ({
      ...(checkBasics ? validateItem(it, { titleField, titleLabel, siblings }) : {}),
      ...(validate ? validate(it) : {}),
    }),
    [checkBasics, titleField, titleLabel, siblings, validate],
  )

  // After a failed save, re-validate live so errors clear as they're fixed.
  const hasErrors = Object.keys(fieldErrors).length > 0
  useEffect(() => {
    if (!hasErrors || !item) return
    setFieldErrors(computeErrors(item))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item])

  const set = (patch) => setItem((t) => ({ ...t, ...patch }))
  const setNested = (key, patch) => setItem((t) => ({ ...t, [key]: { ...(t[key] || {}), ...patch } }))

  const savingRef = useRef(false)

  const onSave = async () => {
    if (savingRef.current) return
    const errors = computeErrors(item)
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors)
      setErr('Fix the highlighted fields, then save again.')
      requestAnimationFrame(() => {
        document.querySelector('[data-field-error]')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      })
      return
    }
    setFieldErrors({})
    savingRef.current = true
    setSaving(true)
    setErr(null)
    try {
      const cleaned = clean ? clean(item) : item
      let saved
      if (isNew) {
        saved = await collection.create(cleaned)
        markSaved(saved)
        navigate(editorPath(saved.id), { replace: true })
      } else {
        saved = await collection.update(id, cleaned)
        setItem(saved)
        markSaved(saved)
      }
      toast.success(savedMessage)
      afterSave?.(saved)
    } catch (e) {
      setErr(e.message)
      toast.error(`Save failed: ${e.message}`)
    } finally {
      savingRef.current = false
      setSaving(false)
    }
  }

  // Cmd/Ctrl+S saves — editors reach for it instinctively, and the browser's
  // own save dialog is never what they meant.
  const onSaveRef = useRef()
  onSaveRef.current = onSave
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's') {
        e.preventDefault()
        onSaveRef.current?.()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return { item, setItem, set, setNested, err, saving, dirty, fieldErrors, onSave, isNew }
}
