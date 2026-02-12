import Image from "next/image";
import Link from "next/link";
import { Newspaper, Facebook, Twitter, Instagram, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-12">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/logo.png"
                alt="New Digital India"
                width={40}
                height={40}
                className="w-10 h-10 rounded-lg object-cover"
              />
              <span className="font-display text-2xl font-bold">New Digital India</span>
            </Link>
            <p className="text-primary-foreground/80 max-w-md">
              Your trusted source for the latest news and updates from across India. 
              We bring you verified news from multiple sources.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/?category=breaking-news" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Breaking News
                </Link>
              </li>
              <li>
                <Link href="/?category=india" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  India
                </Link>
              </li>
              <li>
                <Link href="/?category=world" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  World
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/?category=technology" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/?category=sports" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Sports
                </Link>
              </li>
              <li>
                <Link href="/?category=health" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Health
                </Link>
              </li>
              <li>
                <Link href="/?category=jobs" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Jobs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-primary-foreground/60 text-sm">
          <p>&copy; {new Date().getFullYear()} New Digital India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
