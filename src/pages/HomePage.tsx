import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { sports, sportIcons } from '@/lib/constants';
import { Zap, Calendar, Clock, Users, ArrowRight } from 'lucide-react';

export function HomePage() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-primary" />,
      title: "Easy Scheduling",
      description: "Book your preferred sports facilities with just a few clicks"
    },
    {
      icon: <Clock className="w-6 h-6 text-primary" />,
      title: "Real-time Availability",
      description: "Check facility availability in real-time and secure your spot"
    },
    {
      icon: <Users className="w-6 h-6 text-primary" />,
      title: "Multiple Sports",
      description: "Access a wide range of sports facilities on campus"
    },
    {
      icon: <Zap className="w-6 h-6 text-primary" />,
      title: "Instant Confirmation",
      description: "Get immediate confirmation for your bookings"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="hero-gradient py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Book Sports Facilities with Ease
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Your one-stop platform for managing sports facility bookings on campus.
            Join us and start playing today!
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
              onClick={() => setLocation('/login')}
            >
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white/10"
              onClick={() => setLocation('/register')}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Why Choose The League?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Sports Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Available Sports
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sports.map((sport) => (
              <Card key={sport.value} className="overflow-hidden group">
                <CardContent className="p-0">
                  <div className="aspect-video bg-primary/10 flex items-center justify-center">
                    <div className="text-4xl">{sportIcons[sport.value as keyof typeof sportIcons]}</div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {sport.label}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Book {sport.label.toLowerCase()} courts and enjoy your game
                    </p>
                    <Button 
                      variant="link" 
                      className="group-hover:text-primary transition-colors p-0"
                      onClick={() => setLocation('/login')}
                    >
                      Book Now <ArrowRight className="w-4 h-4 ml-2 inline" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join The League today and start booking your favorite sports facilities.
          </p>
          <Button
            size="lg"
            className="bg-primary text-white"
            onClick={() => setLocation('/register')}
          >
            Create Your Account
          </Button>
        </div>
      </div>
    </div>
  );
}
