import { Leaf } from "lucide-react";

const footerLinks = {
  Product: ["Features", "FAQ"],
  Company: ["About", "Blog", "Contact"]
};

export function Footer() {
  return (
    <footer className="bg-green-950 text-green-50 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-8 h-8 text-green-400" />
              <span className="text-xl text-white">Ekoliv</span>
            </div>
            <p className="text-green-200 text-sm mb-4">
              Making sustainable living accessible and rewarding for everyone.
            </p>
            <div className="flex gap-3">
              <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">🌍</span>
              <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">💚</span>
              <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">♻️</span>
              <span className="text-2xl cursor-pointer hover:scale-110 transition-transform">⚖️</span>
            </div>
          </div>
          
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-green-200 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-green-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-green-200 text-sm">
            © 2025 Eco Life. All rights reserved.
          </p>
          <p className="text-green-200 text-sm">
            Made with 💚 for a sustainable future
          </p>
        </div>
      </div>
    </footer>
  );
}
