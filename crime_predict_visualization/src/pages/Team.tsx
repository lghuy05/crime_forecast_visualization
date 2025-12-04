import React from 'react'
import { AnimatedTestimonials } from '../components/ui/animated-testimonials'
import { teamImages } from '../lib/team-images'

const TeamPage = () => {
  const teamMembers = [
    {
      quote: "Assistant Professor in the Bellini College of Artificial Intelligence, Cybersecurity, and Computing at the University of South Florida, leading multiple AI researchs",
      name: "Dr. Seungbae Kim",
      designation: "Research Director",
      src: teamImages.drkim
    },
    {
      quote: "Invented baseline model research",
      name: "Dr. Lee",
      designation: "Senior AI Researcher",
      src: "/images/team/maria-garcia.jpg", // Replace with your image path
    },
    {
      quote: "Leading crime forcast research, implemented MLP model and beat Lee",
      name: "An Le",
      designation: "Master in Computer Science",
      src: teamImages.anle
    },
    {
      quote: "Research Assistant and Research page developer",
      name: "Huy Luong",
      designation: "Freshman, Bachelor of Computer Science",
      src: teamImages.yui // Replace with your image path
    },
    {
      quote: "Research Assistant",
      name: "Bill Nguyen",
      designation: "Freshmanm, Bachelor of Computer Science",
      src: teamImages.bill
    },
  ]

  return (
    <div className="min-h-screen pt-20 bg-black text-white">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-8">
          Research <span className="text-green-400">Team</span>
        </h1>
        <p className="text-xl text-white/70 mb-12">
          Meet the researchers behind the project.
        </p>

        <div className="mt-12">
          <AnimatedTestimonials
            testimonials={teamMembers}
            autoplay={true}
          />
        </div>

        {/* Optional: Add more team information here */}
        <div className="mt-20 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Team Philosophy</h2>
          <p className="text-lg text-white/70 max-w-3xl mx-auto">
            We believe in collaborative research that bridges theoretical innovation with practical applications.
            Our team combines diverse expertise to tackle the most challenging problems in AI.
          </p>
        </div>
      </div>
    </div>
  )
}

export default TeamPage
