import React from "react";
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-4">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-gray-400"><Facebook size={24} /></a>
            <a href="#" className="hover:text-gray-400"><Instagram size={24} /></a>
            <a href="#" className="hover:text-gray-400"><Twitter size={24} /></a>
            <a href="#" className="hover:text-gray-400"><Youtube size={24} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-gray-400">About Us</a></li>
            <li><a href="#" className="hover:text-gray-400">Contact</a></li>
            <li><a href="#" className="hover:text-gray-400">FAQ</a></li>
            <li><a href="#" className="hover:text-gray-400">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Subscribe to Our Newsletter</h3>
          <p className="text-sm text-gray-400 mb-3">Get updates on sales, new products, and promotions.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="p-2 w-full text-black rounded-l-md"
            />
            <button className="bg-indigo-600 px-4 py-2 rounded-r-md hover:bg-indigo-500">
              Subscribe
            </button>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Customer Support</h3>
          <p className="flex items-center space-x-2"><Phone size={20} /> <span>+1 234 567 890</span></p>
          <p className="flex items-center space-x-2 mt-2"><Mail size={20} /> <span>amith143.km143@gmail.com</span></p>
          <p className="flex items-center space-x-2 mt-2"><MapPin size={20} /> <span>123 cheruthuruthy Street, Thrissur</span></p>
        </div>
      </div>

      <div className="mt-8 text-center border-t border-gray-700 pt-6">
        <h3 className="text-lg font-semibold mb-2">We Accept</h3>
        <div className="flex justify-center space-x-4">
          <i className="fa-brands fa-cc-visa"></i>
          <i className="fa-brands fa-cc-mastercard"></i>
          <i className="fa-brands fa-cc-paypal"></i>
        </div>
        <p className="text-sm text-gray-400 mt-4">&copy; 2025 TRENDZCART. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
