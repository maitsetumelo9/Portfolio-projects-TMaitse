import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Flame, ArrowRight, Shield, Zap, Target, TrendingUp } from 'lucide-react';
import dragonBg from '@/assets/dragon-bg.jpg';

const Index: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Auto Trading',
      description: 'Fully automated gold trading with intelligent entry and exit strategies',
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Take Profit',
      description: 'Automatic profit taking ensures gains are locked in at optimal levels',
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Risk Management',
      description: 'Built-in stop loss protection to minimize potential losses',
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Gold Focused',
      description: 'Specialized in XAUUSD trading for maximum market understanding',
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${dragonBg})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/70 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Flame className="h-10 w-10 text-primary animate-pulse-glow" />
              <span className="font-display text-2xl font-bold text-gold text-glow-gold">
                PHOENIX EA
              </span>
            </div>
            <Button variant="outline" onClick={() => navigate('/auth')}>
              Login
            </Button>
          </div>
        </header>

        {/* Hero */}
        <section className="container mx-auto px-4 py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              <span className="text-foreground">RISE FROM THE</span>
              <br />
              <span className="text-gold text-glow-gold">ASHES</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-body">
              The most powerful automated gold trading bot. Let Phoenix EA trade for you 24/7 with precision and discipline.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="gold" 
                size="xl" 
                onClick={() => navigate('/auth')}
                className="animate-pulse-glow"
              >
                Start Trading Now
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl" onClick={() => navigate('/auth')}>
                Create Free Account
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-4 py-20">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12 text-foreground">
            Why Choose <span className="text-gold">Phoenix EA</span>?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-card/80 backdrop-blur-sm border-2 border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="h-12 w-12 rounded-lg gradient-gold flex items-center justify-center mb-4 group-hover:glow-gold transition-all duration-300">
                  <div className="text-primary-foreground">{feature.icon}</div>
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="container mx-auto px-4 py-20">
          <div className="bg-card/80 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-10 text-center max-w-3xl mx-auto glow-gold">
            <Flame className="h-16 w-16 text-primary mx-auto mb-6 animate-float" />
            <h2 className="font-display text-3xl font-bold text-foreground mb-4">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of traders who trust Phoenix EA to trade gold profitably.
            </p>
            <Button 
              variant="gold" 
              size="xl" 
              onClick={() => navigate('/auth')}
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </section>

        {/* Footer */}
        <footer className="container mx-auto px-4 py-8 border-t border-border">
          <p className="text-center text-muted-foreground text-sm">
            © 2024 Phoenix EA. All rights reserved. Trading involves risk.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
