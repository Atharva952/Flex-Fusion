import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10 mt-0.5">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div>
          <h2 className="text-2xl font-bold mb-2">Flex Fusion</h2>
          <p className="text-sm text-gray-400">
            Your all-in-one fitness and nutrition tracker.
          </p>
        </div>

        
        <div>
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-sm">
            <li><Link to="/" className="hover:text-blue-400">Home</Link></li>
            <li><Link to="/register" className="hover:text-blue-400">Get Started</Link></li>
            <li><Link to="/myworkout" className="hover:text-blue-400">MyWorkout</Link></li>
            <li><Link to="/myplans" className="hover:text-blue-400">MyPlans</Link></li>
            <li><Link to="/mytracker" className="hover:text-blue-400">MyTracker</Link></li>
          </ul>
        </div>

        
        <div className="text-sm">
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-4 mb-3">
            <a href="#" className="hover:text-blue-400">Facebook</a>
            <a href="#" className="hover:text-blue-400">Instagram</a>
            <a href="#" className="hover:text-blue-400">Twitter</a>
          </div>
          <p className="text-gray-500">&copy; 2025 Flex Fusion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
