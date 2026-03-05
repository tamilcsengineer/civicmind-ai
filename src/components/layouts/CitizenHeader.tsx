import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function CitizenHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">CM</span>
          </div>
          <span className="font-bold text-xl text-foreground">CivicMind AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/submit">
            <Button variant="ghost">Submit Complaint</Button>
          </Link>
          <Link to="/track">
            <Button variant="ghost">Track Complaint</Button>
          </Link>
          <Link to="/admin">
            <Button variant="outline">Admin Portal</Button>
          </Link>
        </nav>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <nav className="flex flex-col space-y-4 mt-8">
              <Link to="/">
                <Button variant="ghost" className="w-full justify-start">Home</Button>
              </Link>
              <Link to="/submit">
                <Button variant="ghost" className="w-full justify-start">Submit Complaint</Button>
              </Link>
              <Link to="/track">
                <Button variant="ghost" className="w-full justify-start">Track Complaint</Button>
              </Link>
              <Link to="/admin">
                <Button variant="outline" className="w-full justify-start">Admin Portal</Button>
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
