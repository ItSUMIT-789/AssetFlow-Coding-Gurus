import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, CheckCircle2, ImagePlus, Link2, MessageSquareText, Paperclip, UserRound } from 'lucide-react'

export default function MaintenanceDetailDrawer({ request, open, onClose, comments, commentDraft, setCommentDraft, addComment, uploads }) {
  return <AnimatePresence>
    {open ? <>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-[2px]"
        aria-label="Close maintenance details"
      />
      <motion.aside
        initial={{ x: 420, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 420, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 26 }}
        className="fixed inset-y-0 right-0 z-50 w-full max-w-[44rem] overflow-y-auto border-l border-white/70 bg-white/95 p-5 shadow-[0_30px_80px_rgba(15,23,42,.22)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/90 sm:p-6"
        aria-label="Maintenance request details"
      >
        <header className="flex items-start justify-between gap-4 border-b border-slate-200/70 pb-4 dark:border-white/10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.24em] text-sky-600 dark:text-sky-300">Maintenance request</p>
            <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white">{request.assetName}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-300">{request.issue}</p>
          </div>
          <button onClick={onClose} className="rounded-2xl border border-slate-200/70 bg-white px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:text-sky-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-200">
            Close
          </button>
        </header>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-slate-400">Asset Information</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p><b className="text-slate-950 dark:text-white">Category:</b> {request.category}</p>
              <p><b className="text-slate-950 dark:text-white">Priority:</b> {request.priority}</p>
              <p><b className="text-slate-950 dark:text-white">Status:</b> {request.status}</p>
              <p><b className="text-slate-950 dark:text-white">Due Date:</b> {request.dueDate}</p>
            </div>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-slate-400">Technician Details</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-linear-to-br from-sky-500 to-indigo-600 text-white"><UserRound size={20} /></div>
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{request.technician}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{request.technicianRole}</p>
              </div>
            </div>
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm dark:bg-white/5">Estimated completion: <b>{request.estimatedCompletion}</b></div>
          </div>
        </div>

        <section className="mt-5 rounded-3xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-slate-400">Timeline</p>
          <div className="mt-4 space-y-4">
            {['Created request', 'Assigned technician', 'Parts ordered', 'Work started'].map((item, index) => <div key={item} className="flex items-start gap-3">
              <div className="mt-1 size-3 rounded-full bg-sky-500" />
              <div>
                <p className="font-semibold text-slate-950 dark:text-white">{item}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{index + 1} day{index === 0 ? '' : 's'} ago</p>
              </div>
            </div>)}
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-[.22em] text-slate-400">Comments</p>
            <MessageSquareText size={16} className="text-sky-500" />
          </div>
          <div className="mt-4 space-y-3">
            {comments.map((comment) => <div key={comment.id} className="rounded-2xl bg-slate-50 px-4 py-3 dark:bg-white/5">
              <div className="flex items-center justify-between gap-3 text-sm">
                <p className="font-semibold text-slate-950 dark:text-white">{comment.author}</p>
                <span className="text-xs text-slate-400">{comment.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{comment.body}</p>
            </div>)}
          </div>
          <div className="mt-4 rounded-2xl border border-dashed border-slate-300 bg-white px-3 py-3 dark:border-white/10 dark:bg-slate-950/40">
            <textarea value={commentDraft} onChange={(event) => setCommentDraft(event.target.value)} rows={3} className="w-full resize-none bg-transparent text-sm outline-none placeholder:text-slate-400" aria-label="Add maintenance comment" />
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400"><Link2 size={16} /> @mentions supported</div>
              <button onClick={addComment} className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950">
                Post Comment
              </button>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-slate-400">Image Gallery</p>
              <ImagePlus size={16} className="text-sky-500" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              {['photo-1', 'photo-2', 'photo-3', 'photo-4'].map((item) => <div key={item} className="aspect-square rounded-2xl bg-linear-to-br from-sky-500/10 via-indigo-500/10 to-cyan-500/10" />)}
            </div>
          </div>
          <div className="rounded-3xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[.22em] text-slate-400">Attachments</p>
              <Paperclip size={16} className="text-sky-500" />
            </div>
            <div className="mt-4 space-y-2">
              {uploads.map((file) => <div key={file.id} className="rounded-2xl bg-slate-50 px-3 py-3 text-sm dark:bg-white/5">
                <div className="flex items-center justify-between gap-3">
                  <span className="truncate font-semibold text-slate-950 dark:text-white">{file.name}</span>
                  <span className="text-xs text-slate-400">{file.progress}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-slate-200/70 dark:bg-white/10"><div className="h-full rounded-full bg-linear-to-r from-sky-500 to-indigo-600" style={{ width: `${file.progress}%` }} /></div>
              </div>)}
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-slate-300 px-4 py-4 text-center text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
              Drag & drop images or attachments here
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-3xl border border-white/70 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
          <p className="text-xs font-semibold uppercase tracking-[.22em] text-slate-400">Related Requests</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {[request.assetName, `${request.assetName} follow-up`, 'Routine check-up', 'Preventive service'].map((item, index) => <div key={`${item}-${index}`} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 dark:bg-white/5 dark:text-slate-300">
              {item}
            </div>)}
          </div>
        </section>
      </motion.aside>
    </> : null}
  </AnimatePresence>
}