import React from 'react';
import {Button} from "@/components/ui/button";

const CtaSection = () => {
    return (
        <section id={"home-cta-section"} className="py-20 px-6 text-white">
            <div className="max-w-4xl mx-auto text-center">
                <h3 className="font-display text-4xl md:text-5xl font-bold mb-6">
                    Ready to Showcase Your Work?
                </h3>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
                    Join thousands of creative professionals and companies who trust Studio Sequence for their portfolio and recruitment needs.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        className="bg-accent-terracotta text-white px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all font-medium text-lg">
                        Create Your Portfolio
                    </Button>
                    <Button
                        className="border-2 bg-transparent border-white text-white px-8 py-4 rounded-lg hover:bg-white hover:text-primary-dark transition-all font-medium text-lg">
                        Browse Talent
                    </Button>
                </div>
            </div>
        </section>
    );
};

export default CtaSection;