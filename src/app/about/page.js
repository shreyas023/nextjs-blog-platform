import React from 'react';
import Image from 'next/image';

export default function About() {
    return (
      <div className="bg-gray-100">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-16">
          <div className="container mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">About InspiraAI</h1>
            <p className="text-lg">
              Inspiring innovation and empowering creativity with AI-driven solutions.
            </p>
          </div>
        </section>
  
        {/* Our Mission */}
        <section className="py-16 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
            <p className="max-w-3xl mx-auto text-gray-600 text-lg leading-relaxed">
              At InspiraAI, our mission is to harness the power of Artificial Intelligence
              to create innovative solutions that enhance the digital experience. From SEO optimization
              to image generation, we empower creators, developers, and businesses to reach new heights
              by simplifying complex tasks with cutting-edge technology.
            </p>
          </div>
        </section>
  
        {/* What We Do */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">AI-Powered Solutions</h3>
              <p className="text-gray-600">
                From content creation tools to advanced image generators, our platform uses
                AI to help you unlock your creative potential.
              </p>
            </div>
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">SEO Optimization</h3>
              <p className="text-gray-600">
                Leverage AI to generate SEO-friendly keywords and boost your search engine rankings.
                Enhance visibility effortlessly with tailored recommendations.
              </p>
            </div>
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Web Analytics</h3>
              <p className="text-gray-600">
                Understand your website’s performance with detailed analytics that drive
                growth and engagement.
              </p>
            </div>
            <div className="p-8 text-center bg-white rounded-lg shadow-md">
              <h3 className="text-2xl font-semibold mb-4">Image Generation</h3>
              <p className="text-gray-600">
                Create stunning, high-quality images powered by AI. Our image generation tools
                make it easy to design visuals that captivate your audience.
              </p>
            </div>
          </div>
        </section>
  
        {/* Meet the Team */}
        <section className="py-16 bg-white">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Meet the Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="p-8 bg-gray-50 rounded-lg shadow-md">
                <Image
                  src="/team-member1.jpg"
                  height={200}
                  width={200}
                  alt="Team Member 1"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">Shreyas Bailkar</h3>
                <p className="text-gray-600">Founder & CEO</p>
              </div>
              {/* Team Member 2 */}
              <div className="p-8 bg-gray-50 rounded-lg shadow-md">
                <Image
                  src="/team-member2.jpg"
                  height={200}
                  width={200}
                  alt="Team Member 2"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">John Doe</h3>
                <p className="text-gray-600">Lead Developer</p>
              </div>
              {/* Team Member 3 */}
              <div className="p-8 bg-gray-50 rounded-lg shadow-md">
                <Image
                  src="/team-member3.jpg"
                  height={200}
                  width={200}
                  alt="Team Member 3"
                  className="w-24 h-24 rounded-full mx-auto mb-4"
                />
                <h3 className="text-xl font-bold">Jane Smith</h3>
                <p className="text-gray-600">AI Researcher</p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Contact Us */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">Get In Touch</h2>
            <p className="text-lg text-gray-600 mb-4">
              We&apos;re always here to help! Feel free to reach out for any inquiries or support.
            </p>
            <p className="text-xl text-blue-500">Email: support@inspiraai.com</p>
          </div>
        </section>
      </div>
    );
  }
  