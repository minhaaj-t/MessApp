import React from 'react';
import { CheckCircle, Clock, MapPin, Utensils, Users, Truck } from 'lucide-react';

interface HomeProps {
  onNavigate: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: <Utensils className="w-8 h-8 text-emerald-500" />,
      title: 'Authentic Kerala Cuisine',
      description: 'Traditional recipes prepared with love and authentic spices'
    },
    {
      icon: <Truck className="w-8 h-8 text-emerald-500" />,
      title: 'Daily Delivery',
      description: 'Fresh meals delivered to your doorstep every day'
    },
    {
      icon: <Clock className="w-8 h-8 text-emerald-500" />,
      title: 'Flexible Timing',
      description: 'Choose from multiple delivery slots for lunch and dinner'
    },
    {
      icon: <MapPin className="w-8 h-8 text-emerald-500" />,
      title: 'Location-Based',
      description: 'Serving across Ajman with precise location tracking'
    }
  ];

  const meals = [
    {
      name: 'Kerala Lunch',
      price: 'AED 25',
      items: ['Rice', 'Sambar', 'Rasam', 'Thoran', 'Pachadi', 'Pickle'],
      image: 'https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=500'
    },
    {
      name: 'Kerala Dinner',
      price: 'AED 30',
      items: ['Rice', 'Fish Curry', 'Vegetable Curry', 'Dal', 'Chutney'],
      image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-emerald-600 to-green-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Taste of Kerala,<br />
              <span className="text-amber-300">Delivered Fresh</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Experience authentic Kerala cuisine delivered daily to your doorstep in Ajman. 
              Fresh, homemade meals with the perfect blend of spices and tradition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => onNavigate('register')}
                className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
              >
                Start Your Journey
              </button>
              <button className="bg-white/20 hover:bg-white/30 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all backdrop-blur-sm border border-white/30">
                View Menu
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600">Experience the best of Kerala cuisine with our premium delivery service</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-emerald-100">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meals Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Our Signature Meals</h2>
            <p className="text-xl text-gray-600">Carefully crafted with authentic Kerala flavors</p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            {meals.map((meal, index) => (
              <div key={index} className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${meal.image})` }}></div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-gray-800">{meal.name}</h3>
                    <span className="text-2xl font-bold text-emerald-600">{meal.price}</span>
                  </div>
                  <div className="space-y-2">
                    {meal.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-emerald-500" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">Join hundreds of satisfied customers enjoying authentic Kerala meals daily</p>
          <button
            onClick={() => onNavigate('register')}
            className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 shadow-lg"
          >
            Register Now
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">500+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">1000+</div>
              <div className="text-gray-600">Meals Delivered</div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-emerald-600 mb-2">15+</div>
              <div className="text-gray-600">Areas Covered</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;