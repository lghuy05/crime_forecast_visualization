import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-sm mt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-2xl font-bold">
              Crime Forecast<span className="text-blue-400"> Research</span>
            </Link>
            <p className="text-white/60 text-sm mt-2">
              Connected Social Artificial Intelligence Lab
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-white/40 text-xs mt-1">
              Based on Lee et al. (2019) methodology
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
