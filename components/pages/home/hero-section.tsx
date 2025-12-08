import React from 'react';
import {Button} from "@/components/ui/button";

const HeroSection = () => {
    return (
        <section className="relative overflow-hidden flex items-center min-h-screen home-hero-section">
            <div className="max-w-6xl mx-auto px-6 text-center text-white">
                <h2 className="font-display text-6xl md:text-8xl font-bold mb-6 animate-fade-in">
                    Where Creative<br/>
                    <span className="text-accent-terracotta">Professionals</span> Connect
                </h2>
                <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto animate-slide-up">
                    Discover exceptional talent, showcase your work, and build meaningful connections in the creative industry. From VFX artists
                    to
                    animation studios, find your next collaboration.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
                    <Button
                        className="bg-accent-terracotta text-white px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all font-medium text-lg">
                        Discover Talent
                    </Button>
                    <Button
                        className="border-2 bg-transparent border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-dark transition-all font-medium text-lg"
                    >
                        Join Platform
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;