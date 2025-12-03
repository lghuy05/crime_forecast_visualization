import React from 'react'

const DemoPage = () => {
  return (
    <div className="min-h-screen pt-20 bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Interactive <span className="text-purple-400">Demo</span>
        </h1>
        <p className="text-xl text-white/70">
          Visualizations of crime prediction models.
        </p>
      </div>
    </div>
  )
}

export default DemoPage
