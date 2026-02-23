import { Link } from "react-router-dom";
import { NavLink } from "./NavLink";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Layers, Bell, User } from "lucide-react";

interface NavigationProps {
  user: any;
  onLogout: () => void;
  onOpenAuth: (isLogin: boolean) => void;
}

export const Navigation = ({ user, onLogout, onOpenAuth }: NavigationProps) => {
  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
            <Layers className="w-6 h-6" />
            <span>UltraPress</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {user ? (
              <>
                <NavLink
                  to="/"
                  className="text-foreground hover:text-primary transition-colors"
                  activeClassName="text-primary font-medium"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className="text-foreground hover:text-primary transition-colors"
                  activeClassName="text-primary font-medium"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/create"
                  className="text-foreground hover:text-primary transition-colors"
                  activeClassName="text-primary font-medium"
                >
                  Create
                </NavLink>
                <NavLink
                  to="/tools"
                  className="text-foreground hover:text-primary transition-colors"
                  activeClassName="text-primary font-medium"
                >
                  Tools
                </NavLink>
                <NavLink
                  to="/support"
                  className="text-foreground hover:text-primary transition-colors"
                  activeClassName="text-primary font-medium"
                >
                  Support
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/"
                  className="text-foreground hover:text-primary transition-colors"
                  activeClassName="text-primary font-medium"
                >
                  Home
                </NavLink>
                <NavLink
                  to="/support"
                  className="text-foreground hover:text-primary transition-colors"
                  activeClassName="text-primary font-medium"
                >
                  Support
                </NavLink>
              </>
            )}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  asChild
                >
                  <a href="tel:9492842513">Contact Us</a>
                </Button>
                
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => window.location.href = 'mailto:chaithrasrithandra3@gmail.com?subject=Schedule Demo Request'}
                >
                  Schedule Demo
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-primary/10">
                          <User className="w-5 h-5 text-primary" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-background" align="end">
                    <DropdownMenuItem disabled className="cursor-default">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.email}</p>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link to="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onLogout} className="cursor-pointer">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  className="text-foreground"
                  onClick={() => onOpenAuth(true)}
                >
                  Login
                </Button>
                <Button 
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => onOpenAuth(false)}
                >
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
