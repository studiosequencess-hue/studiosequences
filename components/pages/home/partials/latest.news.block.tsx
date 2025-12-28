import React from 'react'
import { Newspaper, Clock } from 'lucide-react'

interface NewsItem {
  id: number
  title: string
  category: string
  time: string
  image: string
}

const LatestNewsBlock: React.FC = () => {
  const news: NewsItem[] = [
    {
      id: 1,
      title: 'The Rise of Generative Art in Modern Galleries',
      category: 'Digital Art',
      time: '2h ago',
      image:
        'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?w=200&h=200&fit=crop',
    },
    {
      id: 2,
      title: 'Venice Biennale 2025: Highlights & Controversy',
      category: 'Exhibition',
      time: '5h ago',
      image:
        'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=200&h=200&fit=crop',
    },
    {
      id: 3,
      title: 'Restoring the Classics: New AI Techniques',
      category: 'Conservation',
      time: '1d ago',
      image:
        'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=200&h=200&fit=crop',
    },
  ]

  return (
    <div className="mx-auto max-w-sm overflow-hidden rounded-lg border border-zinc-200 bg-white font-sans shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="p-2">
        {news.map((item) => (
          <div
            key={item.id}
            className="group flex cursor-pointer gap-3 rounded-lg p-3 transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
          >
            <img
              src={item.image}
              alt={item.title}
              className="h-16 w-16 flex-shrink-0 rounded-md object-cover grayscale-[20%] transition-all group-hover:grayscale-0"
            />
            <div className="flex min-w-0 flex-col justify-center">
              <span className="mb-1 text-[10px] font-bold tracking-tight text-blue-600 uppercase dark:text-blue-400">
                {item.category}
              </span>
              <h3 className="line-clamp-2 text-xs leading-snug font-semibold text-zinc-800 transition-colors group-hover:text-black dark:text-zinc-200 dark:group-hover:text-white">
                {item.title}
              </h3>
              <div className="mt-1 flex items-center gap-1 text-[10px] text-zinc-400">
                <Clock size={10} />
                {item.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LatestNewsBlock
