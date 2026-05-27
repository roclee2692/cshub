import { lazy, Suspense, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { AI_CURRICULUM, AI_LESSON_MAP, AI_TOTAL_LESSONS } from '../data/ai/curriculum'
import { useCourseProgress } from '../features/music/hooks/useCourseProgress'
import LessonViewer from '../features/music/components/LessonViewer'
import CurriculumIndex from '../features/music/components/CurriculumIndex'
import ChapterNav from '../features/music/components/ChapterNav'

const AIPlaygroundFor = lazy(() => import('../components/ai-playgrounds/AIPlaygroundFor'))

function AIExercise({ exercise }) {
  if (!exercise || exercise.type !== 'playground') return null
  return (
    <Suspense fallback={<div className="h-64 bg-surface rounded-lg animate-pulse" />}>
      <AIPlaygroundFor viz={exercise.viz} />
    </Suspense>
  )
}

export default function AILessonPage() {
  const { lessonId } = useParams()
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const lesson = AI_LESSON_MAP[lessonId]
  const { isCompleted, markComplete, progress } = useCourseProgress(
    AI_CURRICULUM.id,
    AI_TOTAL_LESSONS
  )

  if (!lesson) {
    return (
      <div className="p-10 text-center text-fg-muted">
        课节不存在。<Link to="/ai-course" className="text-accent hover:underline">返回课程首页</Link>
      </div>
    )
  }

  return (
    <div className="music-lesson-shell">
      <button
        type="button"
        className="music-lesson-sidebar-toggle"
        data-collapsed={sidebarCollapsed ? 'true' : 'false'}
        aria-label={sidebarCollapsed ? '展开课程目录' : '收起课程目录'}
        title={sidebarCollapsed ? '展开课程目录' : '收起课程目录'}
        onClick={() => setSidebarCollapsed(v => !v)}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Sidebar */}
      <div className="music-lesson-sidebar-frame" data-collapsed={sidebarCollapsed ? 'true' : 'false'}>
        <aside className="flex h-full flex-col w-60 flex-shrink-0 border-r border-border-soft px-3 py-6 overflow-y-auto">
          <Link
            to="/ai-course"
            className="flex items-center gap-2 text-fg-muted hover:text-fg text-sm mb-5 transition-colors"
          >
            <span>←</span> <span className="text-xs font-semibold">{AI_CURRICULUM.title}</span>
          </Link>

          <div className="mb-4 px-2">
            <div className="flex justify-between text-[10px] text-fg-faint mb-1">
              <span>进度</span>
              <span>{progress.count}/{progress.total}</span>
            </div>
            <div className="h-1 bg-surface rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${progress.pct}%`, background: '#8b5cf6' }}
              />
            </div>
          </div>

          <CurriculumIndex
            curriculum={AI_CURRICULUM}
            basePath="/ai-course"
            isCompleted={isCompleted}
            currentLessonId={lessonId}
          />
        </aside>
      </div>

      {/* Main */}
      <main className="flex-1 px-6 py-8 overflow-y-auto">
        <Link
          to="/ai-course"
          className="lg:hidden flex items-center gap-1 text-fg-muted hover:text-fg text-sm mb-6 transition-colors"
        >
          ← 课程目录
        </Link>

        <LessonViewer
          lesson={lesson}
          completed={isCompleted(lessonId)}
          onComplete={() => markComplete(lessonId)}
          exerciseSlot={lesson.exercise ? <AIExercise exercise={lesson.exercise} /> : null}
        />

        <ChapterNav
          curriculum={AI_CURRICULUM}
          lessonId={lessonId}
          basePath="/ai-course"
        />
      </main>
    </div>
  )
}
