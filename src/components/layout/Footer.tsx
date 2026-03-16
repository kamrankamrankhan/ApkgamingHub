'use client';

import Link from 'next/link';
import { 
  Facebook, Twitter, Instagram, Youtube, Mail, 
  Shield, Lock, Award, HeadphonesIcon, Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const footerLinks = {
  games: [
    { label: 'Slots', href: '#' },
    { label: 'Casino Games', href: '#' },
    { label: 'Poker', href: '#' },
    { label: 'Skill Games', href: '#' },
    { label: 'Bingo', href: '#' },
    { label: 'Novoline', href: '#' }
  ],
  legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
    { label: 'Fair Play', href: '#' }
  ]
};

const socialLinks = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' }
];

export function Footer() {
  return (
    <footer className="bg-gradient-to-b from-purple-950 to-purple-950/95 border-t border-purple-700/50 mt-auto">
      {/* Features Bar */}
      <div className="border-b border-purple-700/30">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Shield, title: '100% Free', desc: 'No real money gambling' },
              { icon: Lock, title: 'Safe & Secure', desc: 'Your data is protected' },
              { icon: Award, title: 'VIP Rewards', desc: 'Exclusive benefits' },
              { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Always here to help' }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-yellow-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs text-purple-300">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img
                src="/logo.png"
                alt="APKgaminghub"
                className="h-10 w-10 object-contain"
              />
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  APKgaminghub
                </h3>
              </div>
            </div>
            <p className="text-sm text-purple-300 mb-4">
              Your ultimate destination for free game downloads. Slots, Poker, Casino games, and more - all available for free!
            </p>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-purple-400" />
              <select className="bg-purple-800/50 border border-purple-600/50 rounded-lg px-2 py-1 text-sm text-purple-200">
                <option>English</option>
                <option>Deutsch</option>
                <option>Español</option>
                <option>Français</option>
              </select>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="font-bold text-white mb-3">Games</h4>
            <ul className="space-y-2">
              {footerLinks.games.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm text-purple-300 hover:text-yellow-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">Legal</h4>
            <ul className="space-y-2">
              {footerLinks.legal.map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-sm text-purple-300 hover:text-yellow-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-6 bg-purple-700/50" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {socialLinks.map((social, i) => (
              <Button
                key={i}
                variant="ghost"
                size="icon"
                className="text-purple-300 hover:text-yellow-400 hover:bg-white/5"
              >
                <social.icon className="h-5 w-5" />
              </Button>
            ))}
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-xs text-purple-400">
              © {new Date().getFullYear()} APKgaminghub. All rights reserved.
            </p>
            <p className="text-xs text-purple-500 mt-1">
              Free game downloads for entertainment purposes only.
            </p>
          </div>
        </div>

        {/* Payment Methods (Demo) */}
        <div className="mt-6 pt-4 border-t border-purple-700/30">
          <p className="text-xs text-purple-400 text-center mb-3">Payment Methods (Demo)</p>
          <div className="flex flex-wrap items-center justify-center gap-3 opacity-50">
            {['Visa', 'Mastercard', 'PayPal', 'Skrill', 'Neteller'].map((method, i) => (
              <div
                key={i}
                className="px-3 py-1.5 bg-purple-800/30 rounded-lg text-xs text-purple-300"
              >
                {method}
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
