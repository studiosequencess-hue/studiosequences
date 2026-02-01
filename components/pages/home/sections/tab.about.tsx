'use client'

import React from 'react'
import { useEditor, EditorContent, useTiptapState, Tiptap } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cn } from '@/lib/utils'
import {
  Bold,
  Edit,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Italic,
  List,
  ListOrdered,
  Quote,
  Redo,
  Save,
  Trash2,
  Undo,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store'
import { useMutation } from '@tanstack/react-query'
import { updateUserInfo } from '@/lib/actions.user'
import { QUERY_KEYS } from '@/lib/constants'
import { Spinner } from '@/components/ui/spinner'

enum State {
  Preview,
  Editor,
}

type Props = {
  editable?: boolean
}

const TabAbout: React.FC<Props> = (props) => {
  const { user, setUser } = useAuthStore()
  const [state, setState] = React.useState<State>(State.Preview)
  const saveMutation = useMutation({
    mutationKey: [QUERY_KEYS.EDITOR_SAVE],
    mutationFn: async () => {
      const content = editor?.getJSON()
      if (!content) return
      if (!user) return

      return updateUserInfo({
        about: editor?.getHTML() || '',
        user_id: user.id,
      })
    },
    onSuccess: () => {
      if (!user) return

      setUser({
        ...user,
        about: editor?.getHTML() || '',
      })
      setState(State.Preview)
    },
  })

  const editor = useEditor({
    extensions: [StarterKit],
    content: user?.about,
    immediatelyRender: false,
  })

  const handleSaveEditor = () => {
    saveMutation.mutate()
  }

  const handleClearEditor = () => {
    editor?.chain().focus().clearContent().run()
  }

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <div className={'flex w-full items-center justify-center gap-2'}>
        <h1 className={'text-xl/none'}>About</h1>
        {props.editable && (
          <Button
            size="sm"
            variant={'link'}
            className={
              'text-foreground hover:text-foreground/50 transition-colors'
            }
            onClick={() => setState(State.Editor)}
          >
            <Edit size={14} />
          </Button>
        )}
      </div>

      {!props.editable || state == State.Preview ? (
        <div
          id={'tiptap-preview'}
          dangerouslySetInnerHTML={{ __html: user?.about || '' }}
          className={'min-h-44 max-w-4xl px-12 py-6'}
        />
      ) : (
        <div className="flex w-full max-w-4xl flex-col gap-4">
          <div className={'flex items-center justify-between gap-4'}>
            <Button
              size={'sm'}
              variant={'accent'}
              onClick={handleSaveEditor}
              className={'w-20'}
            >
              {saveMutation.isPending ? (
                <Spinner />
              ) : (
                <React.Fragment>
                  <Save size={14} /> Save
                </React.Fragment>
              )}
            </Button>
            <Button
              size={'sm'}
              variant={'destructive'}
              onClick={handleClearEditor}
            >
              <Trash2 size={14} /> Clear All
            </Button>
          </div>

          <div className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/50 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none">
            {/* Editable Area */}
            <Tiptap instance={editor}>
              {/* Toolbar */}
              <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white p-2 dark:border-slate-800 dark:bg-slate-900">
                <MenuButton
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  isActive={editor?.isActive('bold')}
                  title="Bold"
                >
                  <Bold size={18} />
                </MenuButton>
                <MenuButton
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  isActive={editor?.isActive('italic')}
                  title="Italic"
                >
                  <Italic size={18} />
                </MenuButton>

                <div className="mx-1 h-6 w-[1px] bg-slate-200 dark:bg-slate-800" />

                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 1 }).run()
                  }
                  isActive={editor?.isActive('heading', { level: 1 })}
                  title="Heading 1"
                >
                  <Heading1 size={18} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 2 }).run()
                  }
                  isActive={editor?.isActive('heading', { level: 2 })}
                  title="Heading 2"
                >
                  <Heading2 size={18} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 3 }).run()
                  }
                  isActive={editor?.isActive('heading', { level: 3 })}
                  title="Heading 3"
                >
                  <Heading3 size={18} />
                </MenuButton>
                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().toggleHeading({ level: 4 }).run()
                  }
                  isActive={editor?.isActive('heading', { level: 4 })}
                  title="Heading 4"
                >
                  <Heading4 size={18} />
                </MenuButton>

                {/*<MenuButton*/}
                {/*  onClick={() => editor?.chain().focus().toggleBulletList().run()}*/}
                {/*  title="Bullet List"*/}
                {/*>*/}
                {/*  <List size={18} />*/}
                {/*</MenuButton>*/}
                {/*<MenuButton*/}
                {/*  onClick={() =>*/}
                {/*    editor?.chain().focus().toggleOrderedList().run()*/}
                {/*  }*/}
                {/*  title="Ordered List"*/}
                {/*>*/}
                {/*  <ListOrdered size={18} />*/}
                {/*</MenuButton>*/}
                <MenuButton
                  onClick={() =>
                    editor?.chain().focus().toggleBlockquote().run()
                  }
                  title="Blockquote"
                >
                  <Quote size={18} />
                </MenuButton>

                <div className="ml-auto flex gap-1">
                  <MenuButton
                    onClick={() => editor?.chain().focus().undo().run()}
                    title="Undo"
                  >
                    <Undo size={18} />
                  </MenuButton>
                  <MenuButton
                    onClick={() => editor?.chain().focus().redo().run()}
                    title="Redo"
                  >
                    <Redo size={18} />
                  </MenuButton>
                </div>
              </div>

              <div className={'p-2'}>
                <Tiptap.Content className={'text-background min-h-96'} />
              </div>
            </Tiptap>

            {/*/!* Footer *!/*/}
            {/*<div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-6 py-4 text-[11px] font-semibold tracking-wider text-slate-400 uppercase dark:border-slate-800 dark:bg-slate-900/50">*/}
            {/*  <div className="flex items-center gap-4">*/}
            {/*    <span>{editor?.state.} characters</span>*/}
            {/*    <span className="h-1 w-1 rounded-full bg-slate-300" />*/}
            {/*    <span>{Math.ceil(stats.chars / 5)} words (est.)</span>*/}
            {/*  </div>*/}
            {/*  <div className="flex items-center gap-3">*/}
            {/*    <span className="flex items-center gap-1.5">*/}
            {/*      <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />*/}
            {/*      Active Session*/}
            {/*    </span>*/}
            {/*  </div>*/}
            {/*</div>*/}
          </div>
        </div>
      )}
    </div>
  )
}

interface MenuButtonProps {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  title: string
}
const MenuButton: React.FC<MenuButtonProps> = ({
  onClick,
  isActive,
  children,
  title,
}) => (
  <button
    onMouseDown={(e: React.MouseEvent) => {
      e.preventDefault()
      onClick()
    }}
    title={title}
    className={cn(
      'rounded-md p-2 transition-all duration-200 hover:bg-slate-200 dark:hover:bg-slate-700',
      isActive
        ? 'bg-slate-200 text-blue-600 shadow-inner dark:bg-slate-700 dark:text-blue-400'
        : 'text-slate-600 dark:text-slate-400',
    )}
  >
    {children}
  </button>
)

export default TabAbout
