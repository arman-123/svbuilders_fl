import React, { useState } from 'react';

const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const projects = [
    {
      id: 1,
      name: 'Gopal Grand Residency',
      location: 'B V Reddy Colony, Chittoor',
      category: 'luxury',
      type: '3 BHK Apartments',
      floors: 6,
      units: 22,
      area: '1800 sq. ft.',
      status: 'Ongoing',
      image: 'https://i.ibb.co/gLFyyKh7/GGR.png',
      description: 'Gopal Grand Residency is a landmark residential development redefining premium living in Chittoor. Thoughtfully designed as the first luxury apartment project in the city, this exclusive development offers a perfect blend of modern architecture, spacious planning, and refined aesthetics.',
      fullDescription: 'The project comprises 6 well-planned floors housing 22 exclusive apartments, ensuring privacy, low density, and a close-knit community living experience. Every home is a spacious 3 BHK apartment with a generous carpet area of 1800 sq. ft., crafted to meet the lifestyle expectations of modern families.',
      highlights: [
        'First luxury apartment project in Chittoor',
        'Low-density development for enhanced privacy',
        'Modern elevation with premium materials',
        'Spacious balconies and ample natural light',
        'Designed for contemporary urban living'
      ]
    },
    {
      id: 2,
      name: 'VC Enclave',
      location: 'Indiranagar, Bengaluru',
      category: 'luxury',
      type: '2 & 3 BHK Apartments',
      floors: 5,
      units: 20,
      area: '1500 - 1800 sq. ft.',
      status: 'Completed 2024',
      image: 'https://i.ibb.co/1tg897L5/VCE.png',
      description: 'VC Enclave is an exclusive luxury residential apartment located in the prime residential neighborhood of Indiranagar, designed for discerning homeowners who value space, privacy, and contemporary elegance.',
      fullDescription: 'The development comprises 5 residential floors with only 20 exclusive apartments, ensuring a low-density living environment and enhanced privacy. The building features a striking contemporary elevation with clean lines, rich material finishes, landscaped balconies, and designer façade elements.',
      highlights: [
        'Luxury apartment project in Indiranagar',
        'Low-density development for enhanced privacy',
        'Contemporary architecture with premium façade',
        'Wide balconies and cross ventilation',
        'High-quality construction and refined finishes'
      ]
    },
    {
      id: 3,
      name: 'Sree Lakshmi Nilayam',
      location: 'Indiranagar, Bengaluru',
      category: 'luxury',
      type: '3 & 4 BHK',
      floors: 5,
      units: 3,
      area: '1800 - 5800 sq. ft.',
      status: 'Completed 2020',
      image: 'https://i.ibb.co/VY9Phqfj/SLN.png',
      description: 'Sree Lakshmi Nilayam is an exclusive boutique residential development located in the prime neighborhood of Indiranagar, designed for homeowners seeking privacy, space, and refined urban living.',
      fullDescription: 'The building consists of 5 residential floors with only 3 exclusive homes, making it an ultra–low-density development that offers a villa-like living experience within an apartment format. The project features spacious 3 BHK residences of 1800 sq. ft. along with a signature 4 BHK duplex/penthouse of 5800 sq. ft.',
      highlights: [
        'Boutique luxury residential development',
        'Only 3 exclusive residences',
        'Ultra-spacious 4 BHK duplex/penthouse',
        'Extremely low-density, villa-style living',
        'Contemporary architecture with premium finishes'
      ]
    },
    {
      id: 4,
      name: 'S V Aralia',
      location: 'Whitefield, Bengaluru',
      category: 'mid-range',
      type: '2 & 3 BHK Apartments',
      floors: 4,
      units: 42,
      area: '1200 - 1500 sq. ft.',
      status: 'Completed 2013',
      image: 'https://i.ibb.co/FqjQTsDn/SV.png',
      description: 'S V Aralia is a well-planned residential apartment community located in the heart of Whitefield, Bengaluru, one of the city\'s most established and sought-after residential and IT corridors.',
      fullDescription: 'The development consists of 4 residential floors with a total of 42 apartments, offering a balanced mix of 2 BHK and 3 BHK homes. The project is located in a peaceful residential pocket of Whitefield, while still being close to major IT parks, schools, hospitals, shopping centers, and public transport.',
      highlights: [
        'Well-planned apartments in Whitefield',
        'Wide balconies and efficient layouts',
        'Good natural light and cross ventilation',
        'Quality construction with long-term durability',
        'Ideal for end-users and long-term investors'
      ]
    },
    {
      id: 5,
      name: 'SLV Greens',
      location: 'Whitefield, Bengaluru',
      category: 'mid-range',
      type: '2 & 3 BHK Apartments',
      floors: 4,
      units: 80,
      area: '1200 - 1500 sq. ft.',
      status: 'Completed 2014',
      image: 'https://i.ibb.co/jmKGzKq/SVL.png',
      description: 'SLV Greens is a thoughtfully planned residential apartment project located in Whitefield, Bengaluru, one of the city\'s prominent and well-connected residential and IT hubs.',
      fullDescription: 'The development comprises 4 residential floors with a total of 80 apartments, offering a well-balanced mix of 2 BHK and 3 BHK homes. The project is situated in a peaceful residential pocket of Whitefield while enjoying close proximity to major IT parks, schools, hospitals, shopping zones, and public transport corridors.',
      highlights: [
        'Functional layouts with spacious living areas',
        'Wide balconies with good ventilation',
        'Quality construction with long-term durability',
        'Established residential community',
        'Convenient access to IT hubs and amenities'
      ]
    },
    {
      id: 6,
      name: 'D S Paradise',
      location: 'Gottigere, Bengaluru',
      category: 'economical',
      type: '2 BHK Apartments',
      floors: 4,
      units: 10,
      area: '1200 sq. ft.',
      status: 'Available',
      image: 'https://i.ibb.co/3LCQh20/DSP.png',
      description: 'D S Paradise is a thoughtfully designed economical residential apartment project located in Gottigere, offering comfortable and practical homes for modern families.',
      fullDescription: 'The development comprises 4 residential floors with a total of 10 apartments, ensuring a low-density and peaceful living environment. All homes are well-planned 2 BHK apartments of 1200 sq. ft., designed to provide efficient use of space, ample natural light, and good ventilation.',
      highlights: [
        'Economical residential apartment project',
        'Functional layouts with efficient space utilization',
        'Good natural light and ventilation',
        'Quality construction at an affordable price',
        'Convenient access to daily amenities'
      ]
    },
    {
      id: 7,
      name: 'G S Exotica',
      location: 'Gottigere, Bengaluru',
      category: 'economical',
      type: '2 & 3 BHK Apartments',
      floors: 4,
      units: 40,
      area: '1200 - 1500 sq. ft.',
      status: 'Available',
      image: 'https://i.ibb.co/2xt2Py0/GSE.png',
      description: 'G S Exotica is a well-planned economical residential apartment project located in Gottigere, offering practical, comfortable homes at an affordable price point.',
      fullDescription: 'The development consists of 4 residential floors with a total of 40 apartments, providing a well-organized community living environment. Located close to Bannerghatta Road, Gottigere offers easy access to schools, hospitals, supermarkets, public transport, and major employment hubs in South Bengaluru.',
      highlights: [
        'Mix of 2 BHK & 3 BHK homes',
        'Practical layouts with efficient space utilization',
        'Good ventilation and natural light',
        'Easy access to daily amenities and main roads',
        'Ideal for families and first-time homebuyers'
      ]
    }
  ];

  const categories = [
    { id: 'all', label: 'All Projects' },
    { id: 'luxury', label: 'Luxury' },
    { id: 'mid-range', label: 'Premium' },
    { id: 'economical', label: 'Economical' }
  ];

  const filteredProjects = selectedCategory === 'all' 
    ? projects 
    : projects.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <div className="bg-gradient-to-b from-amber-800 to-white border-b border-gray-200">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
   <p className="text-sm tracking-widest text-white uppercase mb-4">
            Our Portfolio
          </p>
          <h1 className="text-5xl sm:text-6xl font-serif text-gray-900 mb-6">
            Our Projects
          </h1>
          <div className="w-24 h-0.5 bg-amber-800 mx-auto mb-6"></div>
          <p className="text-lg font-serif text-white max-w-3xl mx-auto">
            Delivering excellence across luxury, premium, and economical residential developments throughout Bengaluru and beyond
          </p>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
<div className="flex flex-wrap justify-center gap-3">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-2.5  text-sm font-medium transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-amber-800 text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-amber-50 border border-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {filteredProjects.map((project, index) => (
          <div
            key={project.id}
            className={`mb-24 last:mb-0 ${
              index % 2 === 0 ? '' : ''
            }`}
          >
            <div className={`flex flex-col ${
              index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
            } gap-12 items-center`}>
              
              {/* Image Section */}
              <div className="w-full lg:w-1/2">
                <div className="relative group">
                  {/* Main Image Placeholder */}
                  <div className="relative h-106 bg-gradient-to-br from-gray-800 via-gray-700 to-gray-600 rounded-lg overflow-hidden shadow-xl">
                    {/* Actual Image */}
                    <img 
                      src={project.image} 
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>

                    {/* Project Number - Large */}
                    <div className="absolute bottom-8 left-8 text-white">
                      <span className="text-8xl font-serif opacity-40 group-hover:opacity-60 transition-opacity duration-500 drop-shadow-lg">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    {/* Status Badge */}
                    {/* <div className="absolute top-8 right-8">
                      <span className={`px-5 py-2 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm ${
                        project.status.includes('Completed')
                          ? 'bg-green-500/90 text-white'
                          : project.status === 'Ongoing'
                          ? 'bg-blue-500/90 text-white'
                          : 'bg-amber-500/90 text-white'
                      }`}>
                        {project.status}
                      </span>
                    </div> */}

                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-amber-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>

                  {/* Decorative Element */}
                  <div className={`absolute -bottom-6 ${
                    index % 2 === 0 ? '-right-6' : '-left-6'
                  } w-32 h-32 bg-amber-100 rounded-lg -z-10`}></div>
                </div>
              </div>

              {/* Content Section */}
              <div className="w-full lg:w-1/2">
                <div className="space-y-6">
                  {/* Category Badge */}
                  <div>
                    <span className="inline-block px-4 py-1.5 bg-amber-50 text-amber-800 text-xs font-medium rounded-full uppercase tracking-wider">
                      {project.category === 'mid-range' ? 'Premium' : project.category}
                    </span>
                  </div>

                  {/* Project Title */}
                  <div>
                    <h2 className="text-4xl font-serif text-gray-900 mb-3">
                      {project.name}
                    </h2>
                    <p className="text-gray-500 flex items-center text-lg">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"/>
                      </svg>
                      {project.location}
                    </p>
                  </div>

                  {/* Description */}
                  <div className="space-y-4">
                    <p className="text-gray-700 font-serif leading-relaxed">
                      {project.description}
                    </p>
                    <p className="text-gray-600 font-serif leading-relaxed">
                      {project.fullDescription}
                    </p>
                  </div>

                  {/* Project Stats Grid */}
                  <div className="grid grid-cols-4 gap-6 py-6 border-t border-b border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Floors</p>
                      <p className="text-2xl font-semibold text-gray-900">{project.floors}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Units</p>
                      <p className="text-2xl font-semibold text-gray-900">{project.units}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">Area</p>
                      <p className="text-xl font-semibold text-gray-900">{project.area}</p>
                    </div>
                  </div>

                  {/* Configuration */}
                  <div>
                    <p className="text-xs text-gray-500 font-serif uppercase tracking-wide mb-2">Configuration</p>
                    <p className="text-lg font-medium font-serif text-gray-900">{project.type}</p>
                  </div>

                  {/* Highlights */}
                  <div>
                    <p className="text-xs font-serif text-gray-500 uppercase tracking-wide mb-3">Key Highlights</p>
                    <ul className="space-y-2 font-serif">
                      {project.highlights.map((highlight, idx) => (
                        <li key={idx} className="flex items-start text-gray-700">
                          <svg className="w-5 h-5 text-amber-800 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  {/* <div className="pt-4">
                    <button className="px-8 py-3.5 bg-amber-800 text-white font-medium rounded-md hover:bg-amber-900 transition-colors duration-300 shadow-lg hover:shadow-xl">
                      View Full Details
                    </button>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom CTA Section */}
      <div className="bg-gradient-to-b from-amber-50 to-white border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl font-serif text-gray-900 mb-4">
            Interested in Our Projects?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Get in touch with us to learn more about our residential developments
          </p>
          <button className="px-10 py-4 bg-gray-900 text-white font-medium rounded-md hover:bg-amber-800 transition-colors duration-300 shadow-lg">
            Contact Us Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default Projects;