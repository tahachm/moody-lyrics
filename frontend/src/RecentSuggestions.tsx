interface Song {
  id: number
  name: string
  description: string
}

const suggestedSongs: Song[] = [
  { id: 1, name: "Bohemian Rhapsody", description: "A classic rock masterpiece by Queen, known for its unique structure and powerful vocals." },
  { id: 2, name: "Imagine", description: "John Lennon's iconic song about peace and unity, featuring simple yet profound lyrics." },
  { id: 3, name: "Billie Jean", description: "Michael Jackson's hit song with its unforgettable bassline and smooth vocals." },
  { id: 4, name: "Like a Rolling Stone", description: "Bob Dylan's revolutionary folk-rock song that changed the landscape of popular music." },
  { id: 5, name: "Smells Like Teen Spirit", description: "Nirvana's grunge anthem that defined a generation with its raw energy and angst." },
]

export default function SuggestedSongs() {

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-12 pb-12">
        {/* Recent Suggestions */}
        <section>
          <div className="flex items-center gap-2 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-fuchsia-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h2 className="text-xl font-semibold">Recently Suggested</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {suggestedSongs.map((song, i) => (
              <div 
                key={i} 
                className="bg-white bg-opacity-5 rounded-lg p-4 hover:bg-opacity-10 transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-fuchsia-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-white group-hover:text-fuchsia-400 transition-colors">
                      {song.name}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-left text-gray-300 mt-3 line-clamp-2">
                  {song.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
  )
}

